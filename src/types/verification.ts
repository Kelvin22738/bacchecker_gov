export interface VerificationRequest {
  id: string;
  request_number: string;
  requesting_institution_id: string;
  target_institution_id: string;
  student_name: string;
  student_id?: string;
  program_name: string;
  graduation_date?: string;
  verification_type: string;
  current_phase: number;
  overall_status: 'submitted' | 'processing' | 'institution_verified' | 'document_authenticated' | 'quality_review' | 'completed' | 'rejected' | 'flagged';
  priority_level: 'low' | 'normal' | 'high' | 'urgent';
  sla_deadline?: string;
  submitted_at: string;
  completed_at?: string;
  assigned_to?: string;
  verification_score: number;
  fraud_flags: any[];
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface DocumentSubmission {
  id: string;
  verification_request_id: string;
  document_type: string;
  file_name: string;
  file_size: number;
  file_url: string;
  mime_type: string;
  document_hash: string;
  extracted_data: any;
  validation_status: 'pending' | 'valid' | 'invalid' | 'requires_review';
  validation_errors: any[];
  authenticity_score: number;
  uploaded_at: string;
  processed_at?: string;
  created_at: string;
}

export interface InstitutionProgram {
  id: string;
  institution_id: string;
  program_code: string;
  program_name: string;
  program_level: 'certificate' | 'diploma' | 'bachelor' | 'master' | 'doctorate';
  faculty?: string;
  department?: string;
  duration_years?: number;
  accreditation_status: 'accredited' | 'provisional' | 'suspended' | 'revoked';
  accreditation_date?: string;
  accreditation_expiry?: string;
  program_status: 'active' | 'inactive' | 'discontinued';
  entry_requirements?: string;
  graduation_requirements?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationPhase {
  id: string;
  verification_request_id: string;
  phase_number: number;
  phase_name: string;
  phase_status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  started_at?: string;
  completed_at?: string;
  assigned_to?: string;
  phase_data: any;
  validation_results: any;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface FraudRegistryEntry {
  id: string;
  entity_type: 'student' | 'institution' | 'document' | 'pattern';
  entity_identifier: string;
  fraud_type: string;
  severity_level: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  evidence: any;
  reported_by?: string;
  investigation_status: 'open' | 'investigating' | 'confirmed' | 'dismissed' | 'closed';
  flagged_at: string;
  resolved_at?: string;
  resolution_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface VerificationReport {
  id: string;
  verification_request_id: string;
  report_type: 'standard' | 'detailed' | 'summary';
  report_data: any;
  verification_outcome: 'verified' | 'not_verified' | 'inconclusive' | 'fraudulent';
  confidence_score: number;
  generated_by?: string;
  generated_at: string;
  delivered_at?: string;
  delivery_method?: string;
  recipient_email?: string;
  digital_signature?: string;
  report_hash?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  table_name: string;
  record_id: string;
  action: 'INSERT' | 'UPDATE' | 'DELETE' | 'SELECT';
  old_values?: any;
  new_values?: any;
  user_id?: string;
  user_role?: string;
  ip_address?: string;
  user_agent?: string;
  session_id?: string;
  timestamp: string;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: 'config' | 'workflow' | 'security' | 'notification';
  description?: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface VerificationWorkflowPhase {
  number: number;
  name: string;
  description: string;
  estimatedHours: number;
  requiredChecks: string[];
  autoAdvance: boolean;
}

export interface VerificationStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  rejectedRequests: number;
  averageProcessingTime: number;
  successRate: number;
  fraudDetectionRate: number;
  slaCompliance: number;
}