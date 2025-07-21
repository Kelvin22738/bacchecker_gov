// src/utils/verificationWorkflowAPI.ts - UPDATED WITH MISSING METHODS
import { supabase } from './supabase';
import { VerificationRequest } from '../types/verification';

export class VerificationWorkflowAPI {
  // --- Mappings for Display ---
  private static institutionMapping: { [key: string]: string } = {
    'b066613d3-0837-49e9-82c2-23d1caa1df11': 'KNUST',
    'bd5610c1e8-941a-4f51-ab77-882656fd7f17': 'University of Ghana',
    '2d78f1ff-bc42-460b-bbf3-2fb61eb8ca9f': 'University of Cape Coast',
    '2f3dcc21-8fa2-4788-921e-9b1825fd7835': 'Emmanuel University'
  };

  private static statusMapping: { [key: string]: string } = {
    'submitted': 'Submitted', 'processing': 'Processing',
    'institution_verified': 'Institution Verified', 'document_authenticated': 'Document Authenticated',
    'quality_review': 'Quality Review', 'completed': 'Completed',
    'rejected': 'Rejected', 'flagged': 'Flagged',
    'gtec_approved': 'GTEC Approved', 'institution_approved': 'Institution Approved',
    'gtec_rejected': 'GTEC Rejected', 'institution_rejected': 'Institution Rejected'
  };

  private static statusColors: { [key: string]: string } = {
    'submitted': 'default', 'processing': 'info',
    'institution_verified': 'info', 'document_authenticated': 'info',
    'quality_review': 'warning', 'completed': 'success',
    'rejected': 'error', 'flagged': 'error',
    'gtec_approved': 'success', 'institution_approved': 'success',
    'gtec_rejected': 'error', 'institution_rejected': 'error'
  };

  // --- Missing Methods Added ---

  /**
   * Generates a unique request number for verification requests
   */
  static generateRequestNumber(): string {
    return `VER-${Date.now().toString().slice(-8)}`;
  }

  /**
   * Creates a new verification request in the database
   */
  static async createRequest(requestData: any): Promise<VerificationRequest | null> {
    try {
      // Calculate SLA deadline based on priority
      const priorityLevel = requestData.priority_level || 'normal';
      const slaHours = priorityLevel === 'urgent' ? 48 : 
                      priorityLevel === 'high' ? 72 : 120;
      const slaDeadline = new Date();
      slaDeadline.setHours(slaDeadline.getHours() + slaHours);

      const { data, error } = await supabase
        .from('verification_requests')
        .insert({
          ...requestData,
          sla_deadline: slaDeadline.toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating verification request:', error);
        return null;
      }

      // Create initial verification phases
      await this.createInitialPhases(data.id);

      return data as VerificationRequest;
    } catch (error) {
      console.error('Exception in createRequest:', error);
      return null;
    }
  }

  /**
   * Creates initial verification phases for a new request
   */
  private static async createInitialPhases(requestId: string): Promise<void> {
    const phases = [
      { phase_number: 1, phase_name: 'Initial Processing', phase_status: 'in_progress' },
      { phase_number: 2, phase_name: 'Institution Verification', phase_status: 'pending' },
      { phase_number: 3, phase_name: 'Document Authentication', phase_status: 'pending' },
      { phase_number: 4, phase_name: 'Quality Assurance', phase_status: 'pending' }
    ];

    try {
      const { error } = await supabase
        .from('verification_phases')
        .insert(
          phases.map(phase => ({
            verification_request_id: requestId,
            ...phase,
            started_at: phase.phase_status === 'in_progress' ? new Date().toISOString() : null
          }))
        );

      if (error) {
        console.error('Error creating initial phases:', error);
      }
    } catch (error) {
      console.error('Exception creating initial phases:', error);
    }
  }

  /**
   * Creates a notification (basic implementation)
   */
  static async createNotification(notificationData: any): Promise<boolean> {
    try {
      // This could be expanded to use a notifications table
      // For now, just log it as an audit entry
      const { error } = await supabase
        .from('audit_logs')
        .insert({
          table_name: 'notifications',
          record_id: notificationData.request_id || 'system',
          action: 'INSERT',
          new_values: notificationData,
          user_role: notificationData.user_id || 'system',
          timestamp: new Date().toISOString()
        });

      if (error) {
        console.error('Error creating notification:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Exception in createNotification:', error);
      return false;
    }
  }

  // --- Public Status Check Functions ---

  /**
   * Gets a single request by its unique request number.
   */
  static async getRequestByNumber(requestNumber: string): Promise<VerificationRequest | null> {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('request_number', requestNumber)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Ignore "No rows found"
        console.error('Error fetching by request number:', error);
        return null;
      }
      return data;
    } catch (err) {
      console.error('Exception in getRequestByNumber:', err);
      return null;
    }
  }

  /**
   * Gets all requests associated with an email, searching within the metadata JSON.
   */
  static async getRequestByEmail(email: string): Promise<VerificationRequest[]> {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .contains('metadata', { applicant_email: email }); // Correctly queries the JSON field

      if (error) {
        console.error('Error fetching by email:', error);
        return [];
      }
      return data || [];
    } catch (err) {
      console.error('Exception in getRequestByEmail:', err);
      return [];
    }
  }

  // --- Authenticated User Functions (Admin/Institution) ---

  static async getAllRequests(): Promise<VerificationRequest[]> {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching verification requests:', error);
      return [];
    }
  }

  static async getGTECRequests(): Promise<VerificationRequest[]> {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .in('overall_status', ['submitted', 'processing', 'institution_approved'])
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching GTEC requests:', error);
      return [];
    }
  }

  static async getInstitutionRequests(institutionId: string): Promise<VerificationRequest[]> {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('target_institution_id', institutionId)
        .in('overall_status', ['gtec_approved', 'institution_reviewing'])
        .order('submitted_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        return [];
      }
      return data || [];
    } catch (error) {
      console.error('Error fetching institution requests:', error);
      return [];
    }
  }
  
  static async getRequestById(requestId: string): Promise<VerificationRequest | null> {
    try {
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (error) {
        console.error('Error fetching request:', error);
        return null;
      }
      return data;
    } catch (error) {
      console.error('Error in getRequestById:', error);
      return null;
    }
  }

  // --- Workflow Action Functions ---

  private static async updateWorkflow(requestId: string, newStatus: string, metadataUpdate: object): Promise<VerificationRequest | null> {
    const { data: currentRequest, error: fetchError } = await supabase
        .from('verification_requests')
        .select('metadata')
        .eq('id', requestId)
        .single();
    
    if (fetchError) {
        console.error('Error fetching current request for update:', fetchError);
        return null;
    }

    const updatedMetadata = {
        ...currentRequest.metadata,
        ...metadataUpdate,
    };

    const { data, error } = await supabase
        .from('verification_requests')
        .update({
            overall_status: newStatus,
            updated_at: new Date().toISOString(),
            metadata: updatedMetadata
        })
        .eq('id', requestId)
        .select()
        .single();

    if (error) {
        console.error(`Error during workflow update to ${newStatus}:`, error);
        return null;
    }

    return data;
  }

  static async gtecApproveRequest(requestId: string, userId: string, comments: string = ''): Promise<VerificationRequest | null> {
    return this.updateWorkflow(requestId, 'gtec_approved', {
      workflow_step: 'gtec_approved',
      gtec_comments: comments,
      gtec_approved_at: new Date().toISOString(),
      gtec_approved_by: userId
    });
  }

  static async gtecRejectRequest(requestId: string, userId: string, reason: string): Promise<VerificationRequest | null> {
    return this.updateWorkflow(requestId, 'gtec_rejected', {
      workflow_step: 'gtec_rejected',
      rejection_reason: reason,
      rejected_at: new Date().toISOString(),
      rejected_by: userId
    });
  }

  static async institutionApproveRequest(requestId: string, userId: string, comments: string = ''): Promise<VerificationRequest | null> {
    return this.updateWorkflow(requestId, 'institution_approved', {
      workflow_step: 'institution_approved',
      institution_comments: comments,
      institution_approved_at: new Date().toISOString(),
      institution_approved_by: userId
    });
  }

  static async institutionRejectRequest(requestId: string, userId: string, reason: string): Promise<VerificationRequest | null> {
    return this.updateWorkflow(requestId, 'institution_rejected', {
      workflow_step: 'institution_rejected',
      rejection_reason: reason,
      rejected_at: new Date().toISOString(),
      rejected_by: userId
    });
  }
  
  static async finalGtecApproval(requestId: string, userId: string, comments: string = ''): Promise<VerificationRequest | null> {
    return this.updateWorkflow(requestId, 'completed', {
      workflow_step: 'completed',
      final_comments: comments,
      completed_at: new Date().toISOString(),
      final_approved_at: new Date().toISOString(),
      final_approved_by: userId
    });
  }

  // --- Display Helpers ---
  
  static getInstitutionName(institutionId: string): string {
    return this.institutionMapping[institutionId] || 'Educational Institution';
  }

  static getStatusDisplayName(status: string, metadata?: any): string {
    if (metadata?.workflow_step && this.statusMapping[metadata.workflow_step]) {
      return this.statusMapping[metadata.workflow_step];
    }
    return this.statusMapping[status] || status;
  }

  static getStatusColor(status: string, metadata?: any): string {
    if (metadata?.workflow_step && this.statusColors[metadata.workflow_step]) {
      return this.statusColors[metadata.workflow_step];
    }
    return this.statusColors[status] || 'default';
  }
}