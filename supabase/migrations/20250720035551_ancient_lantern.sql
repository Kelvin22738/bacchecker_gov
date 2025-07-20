/*
  # Insert Demo Data for GTEC Verification System

  This migration inserts comprehensive demo data to simulate a real verification system:
  - Sample tertiary institutions
  - Academic programs
  - Verification requests with complete workflow
  - Document submissions
  - Fraud registry entries
  - System settings
*/

-- Insert sample tertiary institutions (if not exists)
INSERT INTO tertiary_institutions (
  name, acronym, email, phone, address, website, established_year, 
  student_population, faculty_count, institution_type, accreditation_status, 
  onboarding_status, gtec_managed, primary_color, secondary_color, accent_color
) VALUES 
(
  'University of Ghana', 'UG', 'admin@ug.edu.gh', '+233-302-500381',
  'University of Ghana, Legon, Accra', 'https://ug.edu.gh', 1948,
  38000, 1200, 'university', 'Fully Accredited', 'completed', true,
  '#1e40af', '#171717', '#fafafa'
),
(
  'Kwame Nkrumah University of Science and Technology', 'KNUST', 'admin@knust.edu.gh', '+233-322-060319',
  'KNUST, Kumasi, Ghana', 'https://knust.edu.gh', 1952,
  45000, 1500, 'technical_university', 'Fully Accredited', 'completed', true,
  '#dc2626', '#171717', '#fafafa'
),
(
  'University of Cape Coast', 'UCC', 'admin@ucc.edu.gh', '+233-332-132480',
  'University of Cape Coast, Cape Coast', 'https://ucc.edu.gh', 1962,
  32000, 980, 'university', 'Fully Accredited', 'completed', true,
  '#059669', '#171717', '#fafafa'
),
(
  'Ghana Institute of Management and Public Administration', 'GIMPA', 'admin@gimpa.edu.gh', '+233-302-401681',
  'GIMPA, Greenhill, Accra', 'https://gimpa.edu.gh', 1961,
  15000, 450, 'institute', 'Fully Accredited', 'completed', true,
  '#7c2d12', '#171717', '#fafafa'
),
(
  'Ashesi University', 'ASHESI', 'admin@ashesi.edu.gh', '+233-302-610330',
  'Ashesi University, Berekuso, Ghana', 'https://ashesi.edu.gh', 2002,
  1200, 85, 'private_university', 'Fully Accredited', 'completed', true,
  '#991b1b', '#171717', '#fafafa'
)
ON CONFLICT (email) DO NOTHING;

-- Insert comprehensive academic programs
INSERT INTO institution_programs (
  institution_id, program_code, program_name, program_level, faculty, department, 
  duration_years, accreditation_status, program_status
) 
SELECT 
  ti.id, 'BSC-CS', 'Bachelor of Science in Computer Science', 'bachelor',
  'Faculty of Physical and Computational Sciences', 'Department of Computer Science',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'UG'
UNION ALL
SELECT 
  ti.id, 'BBA', 'Bachelor of Business Administration', 'bachelor',
  'University of Ghana Business School', 'Department of Management Studies',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'UG'
UNION ALL
SELECT 
  ti.id, 'LLB', 'Bachelor of Laws', 'bachelor',
  'University of Ghana School of Law', 'Department of Law',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'UG'
UNION ALL
SELECT 
  ti.id, 'MBCHB', 'Bachelor of Medicine and Surgery', 'bachelor',
  'School of Medicine and Dentistry', 'Department of Medicine',
  6, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'UG'
UNION ALL
SELECT 
  ti.id, 'BSC-ME', 'Bachelor of Science in Mechanical Engineering', 'bachelor',
  'College of Engineering', 'Department of Mechanical Engineering',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'KNUST'
UNION ALL
SELECT 
  ti.id, 'BSC-CE', 'Bachelor of Science in Civil Engineering', 'bachelor',
  'College of Engineering', 'Department of Civil Engineering',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'KNUST'
UNION ALL
SELECT 
  ti.id, 'BSC-ARCH', 'Bachelor of Science in Architecture', 'bachelor',
  'College of Art and Built Environment', 'Department of Architecture',
  5, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'KNUST'
UNION ALL
SELECT 
  ti.id, 'BSC-AGRIC', 'Bachelor of Science in Agriculture', 'bachelor',
  'College of Agriculture and Natural Resources', 'Department of Crop Science',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'KNUST'
UNION ALL
SELECT 
  ti.id, 'BCOM', 'Bachelor of Commerce', 'bachelor',
  'School of Business', 'Department of Management Studies',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'UCC'
UNION ALL
SELECT 
  ti.id, 'BED', 'Bachelor of Education', 'bachelor',
  'Faculty of Education', 'Department of Education and Psychology',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'UCC'
UNION ALL
SELECT 
  ti.id, 'MPA', 'Master of Public Administration', 'master',
  'Faculty of Public Administration', 'Department of Public Administration',
  2, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'GIMPA'
UNION ALL
SELECT 
  ti.id, 'MBA', 'Master of Business Administration', 'master',
  'GIMPA Business School', 'Department of Management Studies',
  2, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'GIMPA'
UNION ALL
SELECT 
  ti.id, 'BSC-CS-ASHESI', 'Bachelor of Science in Computer Science', 'bachelor',
  'School of Engineering', 'Department of Computer Science',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'ASHESI'
UNION ALL
SELECT 
  ti.id, 'BSC-EE', 'Bachelor of Science in Electrical Engineering', 'bachelor',
  'School of Engineering', 'Department of Electrical Engineering',
  4, 'accredited', 'active'
FROM tertiary_institutions ti WHERE ti.acronym = 'ASHESI'
ON CONFLICT (institution_id, program_code) DO NOTHING;

-- Insert sample verification requests with realistic data
DO $$
DECLARE
  ug_id uuid;
  knust_id uuid;
  ucc_id uuid;
  gimpa_id uuid;
  ashesi_id uuid;
  gtec_id uuid;
  request_id uuid;
BEGIN
  -- Get institution IDs
  SELECT id INTO ug_id FROM tertiary_institutions WHERE acronym = 'UG';
  SELECT id INTO knust_id FROM tertiary_institutions WHERE acronym = 'KNUST';
  SELECT id INTO ucc_id FROM tertiary_institutions WHERE acronym = 'UCC';
  SELECT id INTO gimpa_id FROM tertiary_institutions WHERE acronym = 'GIMPA';
  SELECT id INTO ashesi_id FROM tertiary_institutions WHERE acronym = 'ASHESI';
  SELECT id INTO gtec_id FROM tertiary_institutions WHERE acronym = 'GTEC';

  -- Insert verification requests
  INSERT INTO verification_requests (
    requesting_institution_id, target_institution_id, student_name, student_id,
    program_name, graduation_date, verification_type, current_phase, overall_status,
    priority_level, verification_score, submitted_at, completed_at
  ) VALUES 
  (
    gimpa_id, ug_id, 'Kwame Asante', 'UG/2018/001234',
    'Bachelor of Science in Computer Science', '2022-06-15', 'academic_certificate',
    4, 'completed', 'normal', 85, 
    now() - interval '15 days', now() - interval '2 days'
  ),
  (
    ashesi_id, knust_id, 'Ama Osei', 'KNUST/2019/005678',
    'Bachelor of Science in Mechanical Engineering', '2023-07-20', 'transcript',
    3, 'document_authenticated', 'high', 78,
    now() - interval '10 days', null
  ),
  (
    ucc_id, ug_id, 'Kofi Mensah', 'UG/2017/009876',
    'Bachelor of Laws', '2021-05-30', 'degree_verification',
    4, 'completed', 'urgent', 92,
    now() - interval '8 days', now() - interval '1 day'
  ),
  (
    ug_id, knust_id, 'Akosua Sarpong', 'KNUST/2020/003456',
    'Bachelor of Science in Civil Engineering', '2024-06-10', 'academic_certificate',
    2, 'institution_verified', 'normal', 65,
    now() - interval '5 days', null
  ),
  (
    knust_id, ucc_id, 'Yaw Boateng', 'UCC/2018/007890',
    'Bachelor of Commerce', '2022-11-15', 'transcript',
    1, 'processing', 'low', 45,
    now() - interval '3 days', null
  ),
  (
    gimpa_id, ashesi_id, 'Efua Asante', 'ASHESI/2019/001122',
    'Bachelor of Science in Computer Science', '2023-05-25', 'degree_verification',
    4, 'completed', 'high', 88,
    now() - interval '12 days', now() - interval '3 days'
  ),
  (
    ashesi_id, gimpa_id, 'Kwaku Boateng', 'GIMPA/2020/004455',
    'Master of Public Administration', '2022-12-20', 'academic_certificate',
    3, 'quality_review', 'normal', 72,
    now() - interval '7 days', null
  ),
  (
    ucc_id, knust_id, 'Adwoa Mensah', 'KNUST/2017/008899',
    'Bachelor of Science in Architecture', '2022-08-30', 'transcript',
    4, 'completed', 'normal', 90,
    now() - interval '20 days', now() - interval '5 days'
  );

END $$;

-- Insert verification phases for each request
INSERT INTO verification_phases (verification_request_id, phase_number, phase_name, phase_status, started_at, completed_at, phase_data)
SELECT 
  vr.id,
  1,
  'Initial Processing',
  CASE WHEN vr.current_phase > 1 THEN 'completed' ELSE 'in_progress' END,
  vr.submitted_at,
  CASE WHEN vr.current_phase > 1 THEN vr.submitted_at + interval '6 hours' ELSE null END,
  '{"document_validation": {"score": 85, "format_check": true, "completeness": true}}'::jsonb
FROM verification_requests vr;

INSERT INTO verification_phases (verification_request_id, phase_number, phase_name, phase_status, started_at, completed_at, phase_data)
SELECT 
  vr.id,
  2,
  'Institution Verification',
  CASE WHEN vr.current_phase > 2 THEN 'completed' WHEN vr.current_phase = 2 THEN 'in_progress' ELSE 'pending' END,
  CASE WHEN vr.current_phase >= 2 THEN vr.submitted_at + interval '6 hours' ELSE null END,
  CASE WHEN vr.current_phase > 2 THEN vr.submitted_at + interval '24 hours' ELSE null END,
  '{"accreditation_check": {"score": 100, "status": "verified"}, "program_authorization": {"score": 95, "authorized": true}}'::jsonb
FROM verification_requests vr;

INSERT INTO verification_phases (verification_request_id, phase_number, phase_name, phase_status, started_at, completed_at, phase_data)
SELECT 
  vr.id,
  3,
  'Document Authentication',
  CASE WHEN vr.current_phase > 3 THEN 'completed' WHEN vr.current_phase = 3 THEN 'in_progress' ELSE 'pending' END,
  CASE WHEN vr.current_phase >= 3 THEN vr.submitted_at + interval '24 hours' ELSE null END,
  CASE WHEN vr.current_phase > 3 THEN vr.submitted_at + interval '48 hours' ELSE null END,
  '{"authenticity_score": 88, "grade_validation": true, "date_consistency": true}'::jsonb
FROM verification_requests vr;

INSERT INTO verification_phases (verification_request_id, phase_number, phase_name, phase_status, started_at, completed_at, phase_data)
SELECT 
  vr.id,
  4,
  'Quality Assurance',
  CASE WHEN vr.current_phase > 4 OR vr.overall_status = 'completed' THEN 'completed' WHEN vr.current_phase = 4 THEN 'in_progress' ELSE 'pending' END,
  CASE WHEN vr.current_phase >= 4 THEN vr.submitted_at + interval '48 hours' ELSE null END,
  CASE WHEN vr.overall_status = 'completed' THEN vr.completed_at ELSE null END,
  '{"final_review": {"approved": true, "reviewer_notes": "All checks passed successfully"}}'::jsonb
FROM verification_requests vr;

-- Insert sample document submissions
INSERT INTO document_submissions (
  verification_request_id, document_type, file_name, file_size, file_url,
  mime_type, document_hash, validation_status, authenticity_score, uploaded_at
)
SELECT 
  vr.id,
  'transcript',
  'official_transcript_' || vr.student_id || '.pdf',
  2048576,
  'https://storage.gtec.edu.gh/documents/' || vr.id || '/transcript.pdf',
  'application/pdf',
  encode(sha256(vr.id::text::bytea), 'hex'),
  'valid',
  85 + (random() * 15)::int,
  vr.submitted_at + interval '30 minutes'
FROM verification_requests vr
WHERE vr.verification_type IN ('transcript', 'academic_certificate');

INSERT INTO document_submissions (
  verification_request_id, document_type, file_name, file_size, file_url,
  mime_type, document_hash, validation_status, authenticity_score, uploaded_at
)
SELECT 
  vr.id,
  'certificate',
  'degree_certificate_' || vr.student_id || '.pdf',
  1536000,
  'https://storage.gtec.edu.gh/documents/' || vr.id || '/certificate.pdf',
  'application/pdf',
  encode(sha256((vr.id::text || '_cert')::bytea), 'hex'),
  'valid',
  80 + (random() * 20)::int,
  vr.submitted_at + interval '45 minutes'
FROM verification_requests vr
WHERE vr.verification_type IN ('degree_verification', 'academic_certificate');

-- Insert fraud registry entries for testing
INSERT INTO fraud_registry (
  entity_type, entity_identifier, fraud_type, severity_level, description,
  evidence, investigation_status, flagged_at
) VALUES 
(
  'student', 'FAKE/2020/999999', 'Document Forgery', 'high',
  'Suspected forged transcript with altered grades and graduation date',
  '{"document_anomalies": ["Inconsistent fonts", "Digital signature mismatch"], "reported_by": "Institution Verification System"}'::jsonb,
  'investigating', now() - interval '5 days'
),
(
  'institution', 'Fake University College', 'Unaccredited Institution', 'critical',
  'Institution claiming accreditation status but not registered with GTEC',
  '{"website": "fake-university.com", "claimed_accreditation": "2020", "actual_status": "Not Registered"}'::jsonb,
  'confirmed', now() - interval '30 days'
),
(
  'document', 'DOC-HASH-123456', 'Grade Manipulation', 'medium',
  'Document shows signs of grade alteration after original issuance',
  '{"original_grade": "C+", "altered_grade": "A", "detection_method": "Digital forensics"}'::jsonb,
  'open', now() - interval '2 days'
),
(
  'pattern', 'IP-192.168.1.100', 'Suspicious Activity Pattern', 'medium',
  'Multiple verification requests from same IP with different student identities',
  '{"request_count": 15, "time_span": "2 hours", "different_institutions": 8}'::jsonb,
  'investigating', now() - interval '1 day'
);

-- Insert audit logs for demonstration
INSERT INTO audit_logs (
  table_name, record_id, action, new_values, user_role, timestamp
)
SELECT 
  'verification_requests',
  vr.id::text,
  'INSERT',
  row_to_json(vr)::jsonb,
  'gtec_admin',
  vr.submitted_at
FROM verification_requests vr
LIMIT 5;

-- Update system settings with realistic values
UPDATE system_settings 
SET setting_value = '{"phases": [
  {"number": 1, "name": "Initial Processing", "description": "Document upload, format validation, and completeness check", "estimated_hours": 6},
  {"number": 2, "name": "Institution Verification", "description": "4-point verification: accreditation, standing, program authorization, compliance", "estimated_hours": 24},
  {"number": 3, "name": "Document Authentication", "description": "Grade validation, date consistency, academic record cross-referencing", "estimated_hours": 48},
  {"number": 4, "name": "Quality Assurance", "description": "GTEC manual review, fraud checking, final approval", "estimated_hours": 24}
]}'::jsonb
WHERE setting_key = 'verification_phases';

INSERT INTO system_settings (setting_key, setting_value, setting_type, description, is_public) VALUES
('fraud_detection_rules', '{"auto_flag_patterns": ["multiple_requests_same_ip", "grade_inconsistencies", "unregistered_institutions"], "confidence_thresholds": {"high": 90, "medium": 70, "low": 50}}'::jsonb, 'security', 'Fraud detection configuration', false),
('verification_statistics', '{"total_processed": 1247, "success_rate": 94.2, "average_processing_time": "3.2 days", "fraud_detection_rate": 2.1}'::jsonb, 'config', 'System performance metrics', true),
('email_templates', '{"verification_complete": {"subject": "Verification Complete - {{request_number}}", "body": "Your verification request has been completed."}, "fraud_alert": {"subject": "Fraud Alert - {{entity_type}}", "body": "Potential fraud detected in the system."}}'::jsonb, 'notification', 'Email notification templates', false)
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();