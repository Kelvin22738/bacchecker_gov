import { supabase } from './supabase';
import { 
  VerificationRequest, 
  DocumentSubmission, 
  InstitutionProgram, 
  VerificationPhase, 
  FraudRegistryEntry, 
  VerificationReport,
  AuditLog,
  SystemSetting
} from '../types/verification';

// Export types for easier importing
export type {
  VerificationRequest,
  DocumentSubmission,
  InstitutionProgram,
  VerificationPhase,
  FraudRegistryEntry,
  VerificationReport,
  AuditLog,
  SystemSetting
};
// Verification Requests API
export const verificationRequestsAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as VerificationRequest[];
  },

  async getByInstitution(institutionId: string) {
    const { data, error } = await supabase
      .from('verification_requests')
      .select('*')
      .or(`requesting_institution_id.eq.${institutionId},target_institution_id.eq.${institutionId}`)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as VerificationRequest[];
  },

  async create(request: Partial<VerificationRequest>) {
    // Calculate SLA deadline based on priority
    const slaHours = request.priority_level === 'urgent' ? 48 : 
                    request.priority_level === 'high' ? 72 : 120;
    const slaDeadline = new Date();
    slaDeadline.setHours(slaDeadline.getHours() + slaHours);

    const { data, error } = await supabase
      .from('verification_requests')
      .insert({
        ...request,
        sla_deadline: slaDeadline.toISOString(),
        overall_status: 'submitted'
      })
      .select()
      .single();
    
    if (error) throw error;

    // Create initial verification phases
    await this.createInitialPhases(data.id);
    
    return data as VerificationRequest;
  },

  async update(id: string, updates: Partial<VerificationRequest>) {
    const { data, error } = await supabase
      .from('verification_requests')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as VerificationRequest;
  },

  async createInitialPhases(requestId: string) {
    const phases = [
      { phase_number: 1, phase_name: 'Initial Processing', phase_status: 'in_progress' },
      { phase_number: 2, phase_name: 'Institution Verification', phase_status: 'pending' },
      { phase_number: 3, phase_name: 'Document Authentication', phase_status: 'pending' },
      { phase_number: 4, phase_name: 'Quality Assurance', phase_status: 'pending' }
    ];

    const { error } = await supabase
      .from('verification_phases')
      .insert(
        phases.map(phase => ({
          verification_request_id: requestId,
          ...phase,
          started_at: phase.phase_status === 'in_progress' ? new Date().toISOString() : null
        }))
      );

    if (error) throw error;
  },

  async advancePhase(requestId: string, currentPhase: number, phaseData: any) {
    // Complete current phase
    const { error: updateError } = await supabase
      .from('verification_phases')
      .update({
        phase_status: 'completed',
        completed_at: new Date().toISOString(),
        validation_results: phaseData
      })
      .eq('verification_request_id', requestId)
      .eq('phase_number', currentPhase);

    if (updateError) throw updateError;
    // Start next phase if exists
    if (currentPhase < 4) {
      const { error: nextPhaseError } = await supabase
        .from('verification_phases')
        .update({
          phase_status: 'in_progress',
          started_at: new Date().toISOString()
        })
        .eq('verification_request_id', requestId)
        .eq('phase_number', currentPhase + 1);

      if (nextPhaseError) throw nextPhaseError;
      // Update request current phase
      const { error: requestUpdateError } = await supabase
        .from('verification_requests')
        .update({ current_phase: currentPhase + 1 })
        .eq('id', requestId);
        
      if (requestUpdateError) throw requestUpdateError;
    } else {
      // All phases complete
      const { error: completeError } = await supabase
        .from('verification_requests')
        .update({ 
          overall_status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', requestId);
        
      if (completeError) throw completeError;
    }
  }
};

// Document Submissions API
export const documentSubmissionsAPI = {
  async getByRequest(requestId: string) {
    const { data, error } = await supabase
      .from('document_submissions')
      .select('*')
      .eq('verification_request_id', requestId)
      .order('uploaded_at', { ascending: false });
    
    if (error) throw error;
    return data as DocumentSubmission[];
  },

  async create(document: Partial<DocumentSubmission>) {
    const { data, error } = await supabase
      .from('document_submissions')
      .insert(document)
      .select()
      .single();
    
    if (error) throw error;
    return data as DocumentSubmission;
  },

  async updateValidation(id: string, validationData: any) {
    const { data, error } = await supabase
      .from('document_submissions')
      .update({
        validation_status: validationData.status,
        validation_errors: validationData.errors || [],
        authenticity_score: validationData.score || 0,
        processed_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as DocumentSubmission;
  }
};

// Institution Programs API
export const institutionProgramsAPI = {
  async getByInstitution(institutionId: string) {
    const { data, error } = await supabase
      .from('institution_programs')
      .select('*')
      .eq('institution_id', institutionId)
      .eq('program_status', 'active')
      .order('program_name', { ascending: true });
    
    if (error) throw error;
    return data as InstitutionProgram[];
  },

  async create(program: Partial<InstitutionProgram>) {
    const { data, error } = await supabase
      .from('institution_programs')
      .insert(program)
      .select()
      .single();
    
    if (error) throw error;
    return data as InstitutionProgram;
  },

  async verifyProgram(institutionId: string, programCode: string, graduationDate: string) {
    const { data, error } = await supabase
      .from('institution_programs')
      .select('*')
      .eq('institution_id', institutionId)
      .eq('program_code', programCode)
      .eq('program_status', 'active')
      .eq('accreditation_status', 'accredited')
      .single();
    
    if (error) return { verified: false, reason: 'Program not found or not accredited' };
    
    // Check if graduation date is within program period
    const programStart = new Date(data.created_at);
    const gradDate = new Date(graduationDate);
    
    if (gradDate < programStart) {
      return { verified: false, reason: 'Graduation date predates program establishment' };
    }
    
    return { verified: true, program: data };
  }
};

// Verification Phases API
export const verificationPhasesAPI = {
  async getByRequest(requestId: string) {
    const { data, error } = await supabase
      .from('verification_phases')
      .select('*')
      .eq('verification_request_id', requestId)
      .order('phase_number', { ascending: true });
    
    if (error) throw error;
    return data as VerificationPhase[];
  },

  async updatePhase(id: string, updates: Partial<VerificationPhase>) {
    const { data, error } = await supabase
      .from('verification_phases')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as VerificationPhase;
  }
};

// Fraud Registry API
export const fraudRegistryAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('fraud_registry')
      .select('*')
      .order('flagged_at', { ascending: false });
    
    if (error) throw error;
    return data as FraudRegistryEntry[];
  },

  async checkEntity(entityType: string, entityIdentifier: string) {
    const { data, error } = await supabase
      .from('fraud_registry')
      .select('*')
      .eq('entity_type', entityType)
      .eq('entity_identifier', entityIdentifier)
      .in('investigation_status', ['open', 'investigating', 'confirmed']);
    
    if (error) throw error;
    return data as FraudRegistryEntry[];
  },

  async create(entry: Partial<FraudRegistryEntry>) {
    const { data, error } = await supabase
      .from('fraud_registry')
      .insert(entry)
      .select()
      .single();
    
    if (error) throw error;
    return data as FraudRegistryEntry;
  }
};

// Verification Reports API
export const verificationReportsAPI = {
  async generate(requestId: string, reportType: 'standard' | 'detailed' | 'summary' = 'standard') {
    // Get verification request with all related data
    const { data: request } = await supabase
      .from('verification_requests')
      .select(`
        *,
        requesting_institution:requesting_institution_id(name, acronym),
        target_institution:target_institution_id(name, acronym),
        document_submissions(*),
        verification_phases(*)
      `)
      .eq('id', requestId)
      .single();

    if (!request) throw new Error('Verification request not found');

    // Generate report data
    const reportData = {
      request_details: {
        request_number: request.request_number,
        student_name: request.student_name,
        student_id: request.student_id,
        program_name: request.program_name,
        graduation_date: request.graduation_date,
        requesting_institution: request.requesting_institution,
        target_institution: request.target_institution
      },
      verification_summary: {
        overall_status: request.overall_status,
        verification_score: request.verification_score,
        processing_time: this.calculateProcessingTime(request.submitted_at, request.completed_at),
        phases_completed: request.verification_phases?.filter((p: any) => p.phase_status === 'completed').length || 0
      },
      phase_results: request.verification_phases || [],
      documents_verified: request.document_submissions || [],
      fraud_checks: request.fraud_flags || [],
      generated_at: new Date().toISOString()
    };

    // Determine verification outcome
    let outcome: 'verified' | 'not_verified' | 'inconclusive' | 'fraudulent' = 'inconclusive';
    if (request.fraud_flags?.length > 0) {
      outcome = 'fraudulent';
    } else if (request.overall_status === 'completed' && request.verification_score >= 80) {
      outcome = 'verified';
    } else if (request.overall_status === 'completed') {
      outcome = 'not_verified';
    }

    const { data, error } = await supabase
      .from('verification_reports')
      .insert({
        verification_request_id: requestId,
        report_type: reportType,
        report_data: reportData,
        verification_outcome: outcome,
        confidence_score: request.verification_score,
        generated_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) throw error;
    return data as VerificationReport;
  },

  calculateProcessingTime(startDate: string, endDate?: string) {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diffMs = end.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    return `${diffDays} days, ${diffHours} hours`;
  }
};

// Audit Logging API
export const auditLogAPI = {
  async log(action: string, tableName: string, recordId: string, oldValues?: any, newValues?: any) {
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        table_name: tableName,
        record_id: recordId,
        action,
        old_values: oldValues,
        new_values: newValues,
        timestamp: new Date().toISOString()
      });

    if (error) console.error('Audit log error:', error);
  },

  async getByRecord(tableName: string, recordId: string) {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .eq('table_name', tableName)
      .eq('record_id', recordId)
      .order('timestamp', { ascending: false });
    
    if (error) throw error;
    return data as AuditLog[];
  }
};

// System Settings API
export const systemSettingsAPI = {
  async get(key: string) {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('setting_key', key)
      .single();
    
    if (error) throw error;
    return data as SystemSetting;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .order('setting_key', { ascending: true });
    
    if (error) throw error;
    return data as SystemSetting[];
  },

  async update(key: string, value: any) {
    const { data, error } = await supabase
      .from('system_settings')
      .update({ 
        setting_value: value,
        updated_at: new Date().toISOString()
      })
      .eq('setting_key', key)
      .select()
      .single();
    
    if (error) throw error;
    return data as SystemSetting;
  }
};

// Workflow Engine
export const workflowEngine = {
  async processPhase1(requestId: string, documents: DocumentSubmission[]) {
    // Phase 1: Initial Processing
    let score = 0;
    const validationResults: any = {};

    // Document format validation
    for (const doc of documents) {
      const validation = await this.validateDocumentFormat(doc);
      validationResults[doc.id] = validation;
      score += validation.score;
    }

    // Completeness check
    const completeness = await this.checkCompleteness(requestId);
    validationResults.completeness = completeness;
    score += completeness.score;

    // Update phase
    await verificationPhasesAPI.updatePhase(requestId, {
      phase_status: score >= 70 ? 'completed' : 'failed',
      completed_at: new Date().toISOString(),
      validation_results: validationResults
    });

    if (score >= 70) {
      await verificationRequestsAPI.advancePhase(requestId, 1, validationResults);
    }

    return { success: score >= 70, score, results: validationResults };
  },

  async processPhase2(requestId: string) {
    // Phase 2: Institution Verification (4-Point Check)
    const { data: request } = await supabase
      .from('verification_requests')
      .select('*, target_institution:target_institution_id(*)')
      .eq('id', requestId)
      .single();

    if (!request) throw new Error('Request not found');

    const checks = {
      accreditation_status: await this.checkAccreditationStatus(request.target_institution_id),
      commission_standing: await this.checkCommissionStanding(request.target_institution_id),
      program_authorization: await this.checkProgramAuthorization(request.target_institution_id, request.program_name),
      compliance_history: await this.checkComplianceHistory(request.target_institution_id)
    };

    const totalScore = Object.values(checks).reduce((sum: number, check: any) => sum + check.score, 0) / 4;

    await verificationPhasesAPI.updatePhase(requestId, {
      phase_status: totalScore >= 75 ? 'completed' : 'failed',
      completed_at: new Date().toISOString(),
      validation_results: checks
    });

    if (totalScore >= 75) {
      await verificationRequestsAPI.advancePhase(requestId, 2, checks);
    }

    return { success: totalScore >= 75, score: totalScore, results: checks };
  },

  async validateDocumentFormat(document: DocumentSubmission) {
    // Simulate document format validation
    const validFormats = ['application/pdf', 'image/jpeg', 'image/png'];
    const isValidFormat = validFormats.includes(document.mime_type);
    const hasValidSize = document.file_size < 10 * 1024 * 1024; // 10MB limit
    
    return {
      score: (isValidFormat ? 50 : 0) + (hasValidSize ? 50 : 0),
      valid_format: isValidFormat,
      valid_size: hasValidSize,
      extracted_text: `Sample extracted text from ${document.file_name}`
    };
  },

  async checkCompleteness(requestId: string) {
    const documents = await documentSubmissionsAPI.getByRequest(requestId);
    const requiredTypes = ['transcript', 'certificate', 'id_document'];
    const submittedTypes = documents.map(d => d.document_type);
    const missingTypes = requiredTypes.filter(type => !submittedTypes.includes(type));
    
    return {
      score: missingTypes.length === 0 ? 100 : Math.max(0, 100 - (missingTypes.length * 33)),
      complete: missingTypes.length === 0,
      missing_documents: missingTypes
    };
  },

  async checkAccreditationStatus(institutionId: string) {
    const { data: institution } = await supabase
      .from('tertiary_institutions')
      .select('accreditation_status')
      .eq('id', institutionId)
      .single();

    const isAccredited = institution?.accreditation_status === 'Fully Accredited';
    return {
      score: isAccredited ? 100 : 0,
      status: institution?.accreditation_status || 'Unknown',
      verified: isAccredited
    };
  },

  async checkCommissionStanding(institutionId: string) {
    // Check if institution is in good standing with GTEC
    const { data: institution } = await supabase
      .from('tertiary_institutions')
      .select('gtec_managed, onboarding_status')
      .eq('id', institutionId)
      .single();

    const goodStanding = institution?.gtec_managed && institution?.onboarding_status === 'completed';
    return {
      score: goodStanding ? 100 : 50,
      standing: goodStanding ? 'Good Standing' : 'Under Review',
      gtec_managed: institution?.gtec_managed || false
    };
  },

  async checkProgramAuthorization(institutionId: string, programName: string) {
    const { data: programs } = await supabase
      .from('institution_programs')
      .select('*')
      .eq('institution_id', institutionId)
      .ilike('program_name', `%${programName}%`)
      .eq('accreditation_status', 'accredited');

    const authorized = programs && programs.length > 0;
    return {
      score: authorized ? 100 : 0,
      authorized,
      matching_programs: programs || []
    };
  },
  async validateGrades(requestId: string) {
    // Simulate grade validation
    const gradeScore = Math.floor(Math.random() * 20) + 80; // 80-100 range
    return {
      score: gradeScore,
      valid_grades: gradeScore >= 85,
      grade_consistency: gradeScore >= 90 ? 'Excellent' : 'Good',
      anomalies_detected: gradeScore < 85 ? ['Grade pattern inconsistency'] : []
    };
  },

  async checkDateConsistency(requestId: string) {
    // Simulate date consistency check
    const dateScore = Math.floor(Math.random() * 15) + 85; // 85-100 range
    return {
      score: dateScore,
      dates_consistent: dateScore >= 90,
      enrollment_dates: 'Valid',
      graduation_dates: 'Valid'
    };
  },
  async checkComplianceHistory(institutionId: string) {
    // Simulate compliance history check
    const complianceScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
    return {
      score: complianceScore,
      compliance_rating: complianceScore >= 90 ? 'Excellent' : complianceScore >= 80 ? 'Good' : 'Satisfactory',
      recent_violations: complianceScore < 80 ? ['Minor reporting delay in Q2 2024'] : []
    };
  },

  async verifyProgramCompletion(requestId: string) {
    // Simulate program completion verification
    const completionScore = Math.floor(Math.random() * 20) + 80; // 80-100 range
    return {
      score: completionScore,
      program_completed: completionScore >= 85,
      requirements_met: completionScore >= 90,
      credit_hours: 'Sufficient'
    };
  },

  async crossReferenceRecords(requestId: string) {
    // Simulate academic record cross-referencing
    const recordScore = Math.floor(Math.random() * 25) + 75; // 75-100 range
    return {
      score: recordScore,
      records_match: recordScore >= 80,
      database_consistency: recordScore >= 85 ? 'High' : 'Medium',
      discrepancies: recordScore < 80 ? ['Minor data inconsistency'] : []
    };
  },

  async performFraudCheck(requestId: string) {
    // Check against fraud registry
    const { data: request } = await supabase
      .from('verification_requests')
      .select('student_name, target_institution_id')
      .eq('id', requestId)
      .single();

    if (!request) return { score: 0, fraud_detected: true };

    // Check for fraud entries
    const fraudEntries = await fraudRegistryAPI.checkEntity('student', request.student_name);
    const institutionFraud = await fraudRegistryAPI.checkEntity('institution', request.target_institution_id);

    const fraudDetected = fraudEntries.length > 0 || institutionFraud.length > 0;
    
    return {
      score: fraudDetected ? 0 : 100,
      fraud_detected: fraudDetected,
      fraud_entries: fraudEntries.length,
      institution_flags: institutionFraud.length
    };
  },

  async validateSecurityFeatures(requestId: string) {
    // Simulate security feature validation
    const securityScore = Math.floor(Math.random() * 20) + 80; // 80-100 range
    return {
      score: securityScore,
      security_features_valid: securityScore >= 85,
      digital_signatures: 'Valid',
      document_integrity: securityScore >= 90 ? 'Excellent' : 'Good'
    };
  },

  async performFinalReview(requestId: string) {
    // Simulate final manual review
    const reviewScore = Math.floor(Math.random() * 15) + 85; // 85-100 range
    return {
      score: reviewScore,
      manual_review_passed: reviewScore >= 90,
      reviewer_confidence: reviewScore >= 95 ? 'Very High' : 'High',
      additional_checks: 'Completed'
    };
  },

  async checkFinalCompliance(requestId: string) {
    // Simulate final compliance check
    const complianceScore = Math.floor(Math.random() * 10) + 90; // 90-100 range
    return {
      score: complianceScore,
      compliance_met: complianceScore >= 95,
      regulatory_requirements: 'Met',
      audit_trail: 'Complete'
    };
  },
};