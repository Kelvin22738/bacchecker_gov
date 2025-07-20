/*
  # Create Verification System Tables

  1. New Tables
    - `verification_requests`
      - `id` (uuid, primary key)
      - `request_number` (text, unique)
      - `requesting_institution_id` (uuid, foreign key)
      - `target_institution_id` (uuid, foreign key)
      - `student_name` (text)
      - `student_id` (text, optional)
      - `program_name` (text)
      - `graduation_date` (date, optional)
      - `verification_type` (text)
      - `current_phase` (integer, default 1)
      - `overall_status` (text with constraints)
      - `priority_level` (text with constraints)
      - `sla_deadline` (timestamptz)
      - `submitted_at` (timestamptz)
      - `completed_at` (timestamptz, optional)
      - `assigned_to` (uuid, optional)
      - `verification_score` (integer, default 0)
      - `fraud_flags` (jsonb)
      - `metadata` (jsonb)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `document_submissions`
      - `id` (uuid, primary key)
      - `verification_request_id` (uuid, foreign key)
      - `document_type` (text)
      - `file_name` (text)
      - `file_size` (integer)
      - `file_url` (text)
      - `mime_type` (text)
      - `document_hash` (text)
      - `extracted_data` (jsonb)
      - `validation_status` (text with constraints)
      - `validation_errors` (jsonb)
      - `authenticity_score` (integer, default 0)
      - `uploaded_at` (timestamptz)
      - `processed_at` (timestamptz, optional)
      - `created_at` (timestamptz)

    - `verification_phases`
      - `id` (uuid, primary key)
      - `verification_request_id` (uuid, foreign key)
      - `phase_number` (integer)
      - `phase_name` (text)
      - `phase_status` (text with constraints)
      - `started_at` (timestamptz, optional)
      - `completed_at` (timestamptz, optional)
      - `assigned_to` (uuid, optional)
      - `phase_data` (jsonb)
      - `validation_results` (jsonb)
      - `notes` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `fraud_registry`
      - `id` (uuid, primary key)
      - `entity_type` (text with constraints)
      - `entity_identifier` (text)
      - `fraud_type` (text)
      - `severity_level` (text with constraints)
      - `description` (text)
      - `evidence` (jsonb)
      - `reported_by` (uuid, optional)
      - `investigation_status` (text with constraints)
      - `flagged_at` (timestamptz)
      - `resolved_at` (timestamptz, optional)
      - `resolution_notes` (text, optional)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `verification_reports`
      - `id` (uuid, primary key)
      - `verification_request_id` (uuid, foreign key)
      - `report_type` (text with constraints)
      - `report_data` (jsonb)
      - `verification_outcome` (text with constraints)
      - `confidence_score` (integer)
      - `generated_by` (uuid, optional)
      - `generated_at` (timestamptz)
      - `delivered_at` (timestamptz, optional)
      - `delivery_method` (text, optional)
      - `recipient_email` (text, optional)
      - `digital_signature` (text, optional)
      - `report_hash` (text, optional)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
    - Add policies for public read access where appropriate

  3. Indexes
    - Add indexes for foreign keys and common lookup fields
*/

-- Create verification_requests table
CREATE TABLE IF NOT EXISTS verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number text UNIQUE NOT NULL,
  requesting_institution_id uuid REFERENCES tertiary_institutions(id),
  target_institution_id uuid REFERENCES tertiary_institutions(id),
  student_name text NOT NULL,
  student_id text,
  program_name text NOT NULL,
  graduation_date date,
  verification_type text NOT NULL,
  current_phase integer DEFAULT 1,
  overall_status text DEFAULT 'submitted' CHECK (overall_status IN ('submitted', 'processing', 'institution_verified', 'document_authenticated', 'quality_review', 'completed', 'rejected', 'flagged')),
  priority_level text DEFAULT 'normal' CHECK (priority_level IN ('low', 'normal', 'high', 'urgent')),
  sla_deadline timestamptz,
  submitted_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  assigned_to uuid,
  verification_score integer DEFAULT 0,
  fraud_flags jsonb DEFAULT '[]'::jsonb,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create document_submissions table
CREATE TABLE IF NOT EXISTS document_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_request_id uuid REFERENCES verification_requests(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  file_name text NOT NULL,
  file_size integer NOT NULL,
  file_url text NOT NULL,
  mime_type text NOT NULL,
  document_hash text NOT NULL,
  extracted_data jsonb DEFAULT '{}'::jsonb,
  validation_status text DEFAULT 'pending' CHECK (validation_status IN ('pending', 'valid', 'invalid', 'requires_review')),
  validation_errors jsonb DEFAULT '[]'::jsonb,
  authenticity_score integer DEFAULT 0,
  uploaded_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create verification_phases table
CREATE TABLE IF NOT EXISTS verification_phases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_request_id uuid REFERENCES verification_requests(id) ON DELETE CASCADE,
  phase_number integer NOT NULL,
  phase_name text NOT NULL,
  phase_status text DEFAULT 'pending' CHECK (phase_status IN ('pending', 'in_progress', 'completed', 'failed', 'skipped')),
  started_at timestamptz,
  completed_at timestamptz,
  assigned_to uuid,
  phase_data jsonb DEFAULT '{}'::jsonb,
  validation_results jsonb DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fraud_registry table
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
  flagged_at timestamptz DEFAULT now(),
  resolved_at timestamptz,
  resolution_notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create verification_reports table
CREATE TABLE IF NOT EXISTS verification_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  verification_request_id uuid REFERENCES verification_requests(id) ON DELETE CASCADE,
  report_type text DEFAULT 'standard' CHECK (report_type IN ('standard', 'detailed', 'summary')),
  report_data jsonb DEFAULT '{}'::jsonb,
  verification_outcome text CHECK (verification_outcome IN ('verified', 'not_verified', 'inconclusive', 'fraudulent')),
  confidence_score integer DEFAULT 0,
  generated_by uuid,
  generated_at timestamptz DEFAULT now(),
  delivered_at timestamptz,
  delivery_method text,
  recipient_email text,
  digital_signature text,
  report_hash text,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_verification_requests_requesting_institution_id ON verification_requests (requesting_institution_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_target_institution_id ON verification_requests (target_institution_id);
CREATE INDEX IF NOT EXISTS idx_verification_requests_overall_status ON verification_requests (overall_status);
CREATE INDEX IF NOT EXISTS idx_verification_requests_student_name ON verification_requests (student_name);
CREATE INDEX IF NOT EXISTS idx_verification_requests_request_number ON verification_requests (request_number);

CREATE INDEX IF NOT EXISTS idx_document_submissions_verification_request_id ON document_submissions (verification_request_id);
CREATE INDEX IF NOT EXISTS idx_document_submissions_validation_status ON document_submissions (validation_status);

CREATE INDEX IF NOT EXISTS idx_verification_phases_verification_request_id ON verification_phases (verification_request_id);
CREATE INDEX IF NOT EXISTS idx_verification_phases_phase_number ON verification_phases (phase_number);
CREATE INDEX IF NOT EXISTS idx_verification_phases_phase_status ON verification_phases (phase_status);

CREATE INDEX IF NOT EXISTS idx_fraud_registry_entity_type ON fraud_registry (entity_type);
CREATE INDEX IF NOT EXISTS idx_fraud_registry_entity_identifier ON fraud_registry (entity_identifier);
CREATE INDEX IF NOT EXISTS idx_fraud_registry_investigation_status ON fraud_registry (investigation_status);

CREATE INDEX IF NOT EXISTS idx_verification_reports_verification_request_id ON verification_reports (verification_request_id);
CREATE INDEX IF NOT EXISTS idx_verification_reports_verification_outcome ON verification_reports (verification_outcome);

-- Enable Row Level Security
ALTER TABLE verification_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_reports ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for verification_requests
CREATE POLICY "Allow authenticated users to manage verification requests"
  ON verification_requests
  FOR ALL
  TO authenticated
  USING (true);

CREATE POLICY "Allow public read access to verification requests"
  ON verification_requests
  FOR SELECT
  TO public
  USING (true);

-- Create RLS policies for document_submissions
CREATE POLICY "Allow authenticated users to manage document submissions"
  ON document_submissions
  FOR ALL
  TO authenticated
  USING (true);

-- Create RLS policies for verification_phases
CREATE POLICY "Allow authenticated users to manage verification phases"
  ON verification_phases
  FOR ALL
  TO authenticated
  USING (true);

-- Create RLS policies for fraud_registry
CREATE POLICY "Allow authenticated users to manage fraud registry"
  ON fraud_registry
  FOR ALL
  TO authenticated
  USING (true);

-- Create RLS policies for verification_reports
CREATE POLICY "Allow authenticated users to manage verification reports"
  ON verification_reports
  FOR ALL
  TO authenticated
  USING (true);

-- Create trigger function for updating updated_at columns
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_verification_requests_updated_at
    BEFORE UPDATE ON verification_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_verification_phases_updated_at
    BEFORE UPDATE ON verification_phases
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fraud_registry_updated_at
    BEFORE UPDATE ON fraud_registry
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();