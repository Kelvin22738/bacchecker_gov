// src/types/verification.ts - REPLACE ENTIRE FILE
export interface VerificationRequest {
  id: string;
  request_number: string;
  requesting_institution_id: string;
  target_institution_id: string;
  student_name: string;
  student_id?: string;
  program_name: string;
  graduation_date?: string;
  verification_type: 'academic_transcript' | 'certificate' | 'diploma' | 'degree';
  current_phase: number;
  overall_status: VerificationStatus;
  priority_level: 'low' | 'normal' | 'high' | 'urgent';
  verification_score?: number;
  fraud_flags: string[];
  submitted_at: string;
  created_at: string;
  updated_at: string;
  gtec_approved_at?: string;
  gtec_approved_by?: string;
  institution_approved_at?: string;
  institution_approved_by?: string;
  completed_at?: string;
  rejection_reason?: string;
  metadata?: {
    purpose?: string;
    applicant_email?: string;
    applicant_phone?: string;
    source?: string;
    documents?: UploadedDocument[];
  };
}

export type VerificationStatus = 
  | 'submitted'           // Initial submission
  | 'gtec_reviewing'      // GTEC is reviewing
  | 'gtec_approved'       // GTEC approved, forwarded to institution
  | 'gtec_rejected'       // GTEC rejected
  | 'institution_reviewing' // Institution is reviewing
  | 'institution_approved'  // Institution approved, back to GTEC
  | 'institution_rejected'  // Institution rejected
  | 'pending_final_approval' // Back to GTEC for final approval
  | 'completed'           // Final approval by GTEC
  | 'rejected';           // Final rejection

export interface VerificationAction {
  id: string;
  request_id: string;
  action_type: 'request_created' | 'gtec_approve' | 'gtec_reject' | 'institution_approve' | 'institution_reject' | 'final_approve' | 'final_reject';
  performed_by: string;
  performed_at: string;
  comments?: string;
  metadata?: any;
}

export interface UploadedDocument {
  id: string;
  request_id: string;
  filename: string;
  file_type: string;
  file_size?: number;
  document_type: 'transcript' | 'certificate' | 'id_document' | 'supporting_document';
  uploaded_at: string;
  uploaded_by: string;
  file_url?: string;
  metadata?: any;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'success' | 'warning' | 'info' | 'error';
  title: string;
  message: string;
  is_read: boolean;
  action_url?: string;
  action_label?: string;
  request_id?: string;
  created_at: string;
  metadata?: any;
}

// Legacy interfaces for backward compatibility
export interface DocumentSubmission {
  id: string;
  verification_request_id: string;
  document_type: string;
  document_name: string;
  file_path: string;
  submitted_at: string;
  submitted_by: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  metadata?: any;
}

export interface InstitutionProgram {
  id: string;
  institution_id: string;
  program_code: string;
  program_name: string;
  program_type: 'undergraduate' | 'graduate' | 'doctorate' | 'certificate';
  department: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VerificationPhase {
  id: string;
  verification_request_id: string;
  phase_number: number;
  phase_name: string;
  phase_status: 'pending' | 'in_progress' | 'completed' | 'failed';
  started_at?: string;
  completed_at?: string;
  processed_by?: string;
  notes?: string;
  metadata?: any;
}

export interface FraudRegistryEntry {
  id: string;
  document_hash: string;
  fraud_type: 'forgery' | 'alteration' | 'identity_theft' | 'fake_institution' | 'other';
  reported_by: string;
  reported_at: string;
  verified: boolean;
  description: string;
  metadata?: any;
}

export interface VerificationReport {
  id: string;
  verification_request_id: string;
  report_type: 'summary' | 'detailed' | 'official';
  generated_at: string;
  generated_by: string;
  report_content: any;
  is_final: boolean;
  digital_signature?: string;
  metadata?: any;
}

export interface AuditLog {
  id: string;
  entity_type: 'verification_request' | 'document' | 'user' | 'system';
  entity_id: string;
  action: string;
  performed_by: string;
  performed_at: string;
  old_values?: any;
  new_values?: any;
  ip_address?: string;
  user_agent?: string;
  metadata?: any;
}

export interface SystemSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: 'string' | 'number' | 'boolean' | 'json';
  description?: string;
  updated_by: string;
  updated_at: string;
  is_public: boolean;
}