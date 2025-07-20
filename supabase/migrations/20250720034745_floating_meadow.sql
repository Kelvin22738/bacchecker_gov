/*
  # Complete GTEC Document Verification System

  1. New Tables
    - `verification_requests` - Main verification request tracking
    - `document_submissions` - Uploaded documents and metadata
    - `institution_programs` - Programs offered by institutions
    - `verification_phases` - Workflow phase tracking
    - `fraud_registry` - Fraud prevention database
    - `audit_logs` - Complete audit trail
    - `verification_reports` - Generated verification reports
    - `system_settings` - Configuration settings

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for each user role
    - Secure document access controls

  3. Workflow Management
    - Phase-based verification tracking
    - Automated status updates
    - SLA monitoring
*/

-- Verification Requests Table
CREATE TABLE IF NOT EXISTS verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text UNIQUE NOT NULL DEFAULT 'VR-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('verification_request_seq')::text, 6, '0'),
  requesting_institution_id uuid REFERENCES tertiary_institutions(id),
  target_institution_id uuid REFERENCES tertiary_institutions(id),
  student_name text NOT NULL,
  student_id text,
  program_name text NOT NULL,
  graduation_date date,
  verification_type text NOT NULL DEFAULT 'academic_certificate',
  current_phase integer DEFAULT 1,
  overall_status text DEFAULT 'submitted' CHECK (overall_status IN ('submitted', 'processing', 'institution_verified', 'document_authenticated', 'quality_review', 'completed', 'rejected', 'flagged')),
  priority_level text DEFAULT 'normal' CHECK (priority_level IN ('low', 'normal', 'high', 'urgent')),
  sla_deadline timestamp with time zone,
  submitted_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  assigned_to uuid,
  verification_score integer DEFAULT 0,
  fraud_flags jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Create sequence for verification request numbers
CREATE SEQUENCE IF NOT EXISTS verification_request_seq START 1;

-- Document Submissions Table
CREATE TABLE IF NOT EXISTS document_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_request_id uuid REFERENCES verification_requests(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_size bigint NOT NULL,
  file_url text NOT NULL,
  mime_type text NOT NULL,
  document_hash text NOT NULL,
  extracted_data jsonb DEFAULT '{}'::jsonb,
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'requires_review')),
  validation_errors jsonb DEFAULT '[]'::jsonb,
  authenticity_score integer DEFAULT 0,
  uploaded_at timestamp with time zone DEFAULT now(),
  processed_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT now()
);

-- Institution Programs Table (Enhanced)
CREATE TABLE IF NOT EXISTS institution_programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES tertiary_institutions(id) ON DELETE CASCADE,
  program_code text NOT NULL,
  program_name text NOT NULL,
  program_level text NOT NULL CHECK (program_level IN ('certificate', 'diploma', 'bachelor', 'master', 'doctorate')),
  faculty text,
  department text,
  duration_years numeric,
  accreditation_status text DEFAULT 'accredited' CHECK (accreditation_status IN ('accredited', 'provisional', 'suspended', 'revoked')),
  accreditation_date date,
  accreditation_expiry date,
  program_status text DEFAULT 'active' CHECK (program_status IN ('active', 'inactive', 'discontinued')),
  entry_requirements text,
  graduation_requirements text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(institution_id, program_code)
);

-- Verification Phases Table
CREATE TABLE IF NOT EXISTS verification_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_request_id uuid REFERENCES verification_requests(id) ON DELETE CASCADE,
  phase_number integer NOT NULL,
  phase_name text NOT NULL,
  phase_status text DEFAULT 'pending' CHECK (phase_status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  assigned_to uuid,
  phase_data jsonb DEFAULT '{}'::jsonb,
  validation_results jsonb DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Fraud Registry Table
CREATE TABLE IF NOT EXISTS fraud_registry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL CHECK (entity_type IN ('student', 'institution', 'document', 'pattern')),
  entity_identifier text NOT NULL,
  fraud_type text NOT NULL,
  severity_level text DEFAULT 'medium' CHECK (severity_level IN ('low', 'medium', 'high', 'critical')),
  description text NOT NULL,
  evidence jsonb DEFAULT '{}'::jsonb,
  reported_by uuid,
  investigation_status text DEFAULT 'open' CHECK (investigation_status IN ('open', 'investigating', 'confirmed', 'dismissed', 'closed')),
  flagged_at timestamp with time zone DEFAULT now(),
  resolved_at timestamp with time zone,
  resolution_notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name text NOT NULL,
  record_id uuid NOT NULL,
  action text NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SELECT')),
  old_values jsonb,
  new_values jsonb,
  user_id uuid,
  user_role text,
  ip_address inet,
  user_agent text,
  session_id text,
  timestamp timestamp with time zone DEFAULT now()
);

-- Verification Reports Table
CREATE TABLE IF NOT EXISTS verification_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_request_id uuid REFERENCES verification_requests(id) ON DELETE CASCADE,
  report_type text DEFAULT 'standard' CHECK (report_type IN ('standard', 'detailed', 'summary')),
  report_data jsonb NOT NULL,
  verification_outcome text NOT NULL CHECK (verification_outcome IN ('verified', 'not_verified', 'inconclusive', 'fraudulent')),
  confidence_score integer DEFAULT 0,
  generated_by uuid,
  generated_at timestamp with time zone DEFAULT now(),
  delivered_at timestamp with time zone,
  delivery_method text,
  recipient_email text,
  digital_signature text,
  report_hash text,
  created_at timestamp with time zone DEFAULT now()
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS system_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key text UNIQUE NOT NULL,
  setting_value jsonb NOT NULL,
  setting_type text DEFAULT 'config' CHECK (setting_type IN ('config', 'workflow', 'security', 'notification')),
  description text,
  is_public boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for verification_requests
CREATE POLICY "GTEC admins can manage all verification requests"
  ON verification_requests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tertiary_institutions ti
      WHERE ti.id = auth.uid()::text::uuid
      AND ti.acronym = 'GTEC'
    )
  );

CREATE POLICY "Institutions can view their own verification requests"
  ON verification_requests
  FOR SELECT
  TO authenticated
  USING (
    requesting_institution_id = auth.uid()::text::uuid
    OR target_institution_id = auth.uid()::text::uuid
  );

CREATE POLICY "Institutions can create verification requests"
  ON verification_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (requesting_institution_id = auth.uid()::text::uuid);

-- RLS Policies for document_submissions
CREATE POLICY "Users can manage documents for their verification requests"
  ON document_submissions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM verification_requests vr
      WHERE vr.id = verification_request_id
      AND (vr.requesting_institution_id = auth.uid()::text::uuid
           OR vr.target_institution_id = auth.uid()::text::uuid
           OR EXISTS (
             SELECT 1 FROM tertiary_institutions ti
             WHERE ti.id = auth.uid()::text::uuid
             AND ti.acronym = 'GTEC'
           ))
    )
  );

-- RLS Policies for institution_programs
CREATE POLICY "Institutions can manage their own programs"
  ON institution_programs
  FOR ALL
  TO authenticated
  USING (institution_id = auth.uid()::text::uuid);

CREATE POLICY "Public read access to active programs"
  ON institution_programs
  FOR SELECT
  TO authenticated
  USING (program_status = 'active');

-- RLS Policies for verification_phases
CREATE POLICY "Users can view phases for their verification requests"
  ON verification_phases
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM verification_requests vr
      WHERE vr.id = verification_request_id
      AND (vr.requesting_institution_id = auth.uid()::text::uuid
           OR vr.target_institution_id = auth.uid()::text::uuid
           OR EXISTS (
             SELECT 1 FROM tertiary_institutions ti
             WHERE ti.id = auth.uid()::text::uuid
             AND ti.acronym = 'GTEC'
           ))
    )
  );

CREATE POLICY "GTEC admins can manage all verification phases"
  ON verification_phases
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tertiary_institutions ti
      WHERE ti.id = auth.uid()::text::uuid
      AND ti.acronym = 'GTEC'
    )
  );

-- RLS Policies for fraud_registry
CREATE POLICY "GTEC admins can manage fraud registry"
  ON fraud_registry
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tertiary_institutions ti
      WHERE ti.id = auth.uid()::text::uuid
      AND ti.acronym = 'GTEC'
    )
  );

-- RLS Policies for audit_logs
CREATE POLICY "GTEC admins can view all audit logs"
  ON audit_logs
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tertiary_institutions ti
      WHERE ti.id = auth.uid()::text::uuid
      AND ti.acronym = 'GTEC'
    )
  );

-- RLS Policies for verification_reports
CREATE POLICY "Users can view reports for their verification requests"
  ON verification_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM verification_requests vr
      WHERE vr.id = verification_request_id
      AND (vr.requesting_institution_id = auth.uid()::text::uuid
           OR vr.target_institution_id = auth.uid()::text::uuid
           OR EXISTS (
             SELECT 1 FROM tertiary_institutions ti
             WHERE ti.id = auth.uid()::text::uuid
             AND ti.acronym = 'GTEC'
           ))
    )
  );

-- RLS Policies for system_settings
CREATE POLICY "GTEC admins can manage system settings"
  ON system_settings
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM tertiary_institutions ti
      WHERE ti.id = auth.uid()::text::uuid
      AND ti.acronym = 'GTEC'
    )
  );

CREATE POLICY "Public read access to public settings"
  ON system_settings
  FOR SELECT
  TO authenticated
  USING (is_public = true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_requests_status ON verification_requests(overall_status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_institution ON verification_requests(requesting_institution_id, target_institution_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_phase ON verification_requests(current_phase);
CREATE INDEX IF NOT EXISTS idx_document_submissions_request ON document_submissions(verification_request_id);
CREATE INDEX IF NOT EXISTS idx_verification_phases_request ON verification_phases(verification_request_id);
CREATE INDEX IF NOT EXISTS idx_fraud_registry_entity ON fraud_registry(entity_type, entity_identifier);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_record ON audit_logs(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_institution_programs_institution ON institution_programs(institution_id);

-- Insert default system settings
INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('verification_phases', '{"phases": [
  {"number": 1, "name": "Initial Processing", "description": "Document upload and parsing"},
  {"number": 2, "name": "Institution Verification", "description": "4-point check system"},
  {"number": 3, "name": "Document Authentication", "description": "Academic record verification"},
  {"number": 4, "name": "Quality Assurance", "description": "GTEC final review"}
]}', 'workflow', 'Verification workflow phases', true),
('sla_settings', '{"default_sla_hours": 120, "urgent_sla_hours": 48, "high_priority_sla_hours": 72}', 'workflow', 'SLA time limits', false),
('fraud_detection', '{"auto_flag_threshold": 70, "manual_review_threshold": 50}', 'security', 'Fraud detection thresholds', false),
('notification_settings', '{"email_enabled": true, "sms_enabled": false, "in_app_enabled": true}', 'notification', 'Notification preferences', false);

-- Insert sample institution programs
INSERT INTO institution_programs (institution_id, program_code, program_name, program_level, faculty, department, duration_years, accreditation_status) 
SELECT 
  ti.id,
  'BSC-CS',
  'Bachelor of Science in Computer Science',
  'bachelor',
  'Faculty of Physical and Computational Sciences',
  'Department of Computer Science',
  4,
  'accredited'
FROM tertiary_institutions ti WHERE ti.acronym = 'UG'
ON CONFLICT (institution_id, program_code) DO NOTHING;

INSERT INTO institution_programs (institution_id, program_code, program_name, program_level, faculty, department, duration_years, accreditation_status) 
SELECT 
  ti.id,
  'BBA',
  'Bachelor of Business Administration',
  'bachelor',
  'University of Ghana Business School',
  'Department of Management Studies',
  4,
  'accredited'
FROM tertiary_institutions ti WHERE ti.acronym = 'UG'
ON CONFLICT (institution_id, program_code) DO NOTHING;

INSERT INTO institution_programs (institution_id, program_code, program_name, program_level, faculty, department, duration_years, accreditation_status) 
SELECT 
  ti.id,
  'BSC-ME',
  'Bachelor of Science in Mechanical Engineering',
  'bachelor',
  'College of Engineering',
  'Department of Mechanical Engineering',
  4,
  'accredited'
FROM tertiary_institutions ti WHERE ti.acronym = 'KNUST'
ON CONFLICT (institution_id, program_code) DO NOTHING;

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_verification_requests_updated_at BEFORE UPDATE ON verification_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_institution_programs_updated_at BEFORE UPDATE ON institution_programs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_verification_phases_updated_at BEFORE UPDATE ON verification_phases FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_fraud_registry_updated_at BEFORE UPDATE ON fraud_registry FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();