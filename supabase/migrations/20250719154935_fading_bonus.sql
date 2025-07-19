/*
  # Create tertiary institutions and onboarding system

  1. New Tables
    - `tertiary_institutions`
      - `id` (uuid, primary key)
      - `name` (text)
      - `acronym` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `address` (text)
      - `website` (text)
      - `established_year` (integer)
      - `student_population` (integer)
      - `faculty_count` (integer)
      - `institution_type` (text)
      - `accreditation_status` (text)
      - `onboarding_status` (text)
      - `onboarding_token` (text, unique)
      - `logo_url` (text)
      - `primary_color` (text)
      - `secondary_color` (text)
      - `accent_color` (text)
      - `gtec_managed` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `onboarded_at` (timestamp)
    - `institution_onboarding_steps`
      - `id` (uuid, primary key)
      - `institution_id` (uuid, foreign key)
      - `step_name` (text)
      - `step_data` (jsonb)
      - `completed` (boolean)
      - `completed_at` (timestamp)
      - `created_at` (timestamp)
    - `institution_courses`
      - `id` (uuid, primary key)
      - `institution_id` (uuid, foreign key)
      - `name` (text)
      - `code` (text)
      - `level` (text)
      - `duration` (text)
      - `faculty` (text)
      - `department` (text)
      - `accreditation_status` (text)
      - `students_enrolled` (integer)
      - `graduates_last_year` (integer)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create tertiary institutions table
CREATE TABLE IF NOT EXISTS tertiary_institutions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  acronym text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text,
  address text,
  website text,
  established_year integer,
  student_population integer,
  faculty_count integer,
  institution_type text DEFAULT 'university',
  accreditation_status text DEFAULT 'Fully Accredited',
  onboarding_status text DEFAULT 'pending' CHECK (onboarding_status IN ('pending', 'in_progress', 'completed')),
  onboarding_token text UNIQUE,
  logo_url text,
  primary_color text DEFAULT '#1e40af',
  secondary_color text DEFAULT '#171717',
  accent_color text DEFAULT '#fafafa',
  gtec_managed boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  onboarded_at timestamptz
);

-- Create institution onboarding steps table
CREATE TABLE IF NOT EXISTS institution_onboarding_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES tertiary_institutions(id) ON DELETE CASCADE,
  step_name text NOT NULL,
  step_data jsonb DEFAULT '{}',
  completed boolean DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create institution courses table
CREATE TABLE IF NOT EXISTS institution_courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid REFERENCES tertiary_institutions(id) ON DELETE CASCADE,
  name text NOT NULL,
  code text NOT NULL,
  level text NOT NULL,
  duration text,
  faculty text,
  department text,
  accreditation_status text DEFAULT 'Accredited',
  students_enrolled integer DEFAULT 0,
  graduates_last_year integer DEFAULT 0,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE tertiary_institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_onboarding_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE institution_courses ENABLE ROW LEVEL SECURITY;

-- Policies for tertiary_institutions
CREATE POLICY "Allow public read access to tertiary institutions"
  ON tertiary_institutions
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to insert tertiary institutions"
  ON tertiary_institutions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update tertiary institutions"
  ON tertiary_institutions
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policies for institution_onboarding_steps
CREATE POLICY "Allow authenticated users to manage onboarding steps"
  ON institution_onboarding_steps
  FOR ALL
  TO authenticated
  USING (true);

-- Policies for institution_courses
CREATE POLICY "Allow public read access to courses"
  ON institution_courses
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated users to manage courses"
  ON institution_courses
  FOR ALL
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tertiary_institutions_email ON tertiary_institutions(email);
CREATE INDEX IF NOT EXISTS idx_tertiary_institutions_onboarding_token ON tertiary_institutions(onboarding_token);
CREATE INDEX IF NOT EXISTS idx_tertiary_institutions_gtec_managed ON tertiary_institutions(gtec_managed);
CREATE INDEX IF NOT EXISTS idx_institution_onboarding_steps_institution_id ON institution_onboarding_steps(institution_id);
CREATE INDEX IF NOT EXISTS idx_institution_courses_institution_id ON institution_courses(institution_id);

-- Insert sample tertiary institutions
INSERT INTO tertiary_institutions (
  name, acronym, email, phone, address, website, established_year, 
  student_population, faculty_count, institution_type, onboarding_status
) VALUES 
(
  'University of Ghana',
  'UG',
  'admin@ug.edu.gh',
  '+233-302-500381',
  'University of Ghana, Legon, Accra',
  'https://ug.edu.gh',
  1948,
  38000,
  1200,
  'university',
  'completed'
),
(
  'Kwame Nkrumah University of Science and Technology',
  'KNUST',
  'admin@knust.edu.gh',
  '+233-322-060319',
  'KNUST, Kumasi, Ghana',
  'https://knust.edu.gh',
  1952,
  45000,
  1500,
  'technical_university',
  'completed'
),
(
  'University of Cape Coast',
  'UCC',
  'admin@ucc.edu.gh',
  '+233-332-132480',
  'University of Cape Coast, Cape Coast',
  'https://ucc.edu.gh',
  1962,
  32000,
  980,
  'university',
  'completed'
),
(
  'Ghana Institute of Management and Public Administration',
  'GIMPA',
  'admin@gimpa.edu.gh',
  '+233-302-401681',
  'GIMPA Campus, Greenhill, Accra',
  'https://gimpa.edu.gh',
  1961,
  15000,
  450,
  'institute',
  'pending'
),
(
  'Ashesi University',
  'ASHESI',
  'admin@ashesi.edu.gh',
  '+233-302-610330',
  'Ashesi University, Berekuso, Ghana',
  'https://ashesi.edu.gh',
  2002,
  3500,
  180,
  'private_university',
  'pending'
);

-- Insert sample courses for completed institutions
INSERT INTO institution_courses (institution_id, name, code, level, duration, faculty, department, students_enrolled, graduates_last_year, description)
SELECT 
  ti.id,
  course_data.name,
  course_data.code,
  course_data.level,
  course_data.duration,
  course_data.faculty,
  course_data.department,
  course_data.students_enrolled,
  course_data.graduates_last_year,
  course_data.description
FROM tertiary_institutions ti
CROSS JOIN (
  VALUES 
    ('Computer Science', 'BSc CS', 'Undergraduate', '4 years', 'Faculty of Physical and Computational Sciences', 'Department of Computer Science', 450, 89, 'Comprehensive computer science program covering software engineering, algorithms, and systems.'),
    ('Business Administration', 'BBA', 'Undergraduate', '4 years', 'University of Ghana Business School', 'Department of Management Studies', 680, 156, 'Business administration program with focus on management, finance, and entrepreneurship.'),
    ('Medicine and Surgery', 'MBChB', 'Undergraduate', '6 years', 'School of Medicine and Dentistry', 'Department of Medicine', 280, 42, 'Medical degree program training future doctors and healthcare professionals.'),
    ('Mechanical Engineering', 'BSc Mech Eng', 'Undergraduate', '4 years', 'College of Engineering', 'Department of Mechanical Engineering', 520, 98, 'Engineering program focusing on mechanical systems, design, and manufacturing.'),
    ('Architecture', 'BSc Arch', 'Undergraduate', '5 years', 'College of Art and Built Environment', 'Department of Architecture', 340, 67, 'Architecture program combining design, technology, and environmental considerations.')
) AS course_data(name, code, level, duration, faculty, department, students_enrolled, graduates_last_year, description)
WHERE ti.onboarding_status = 'completed';

-- Function to generate onboarding token
CREATE OR REPLACE FUNCTION generate_onboarding_token()
RETURNS text AS $$
BEGIN
  RETURN 'onboard_' || encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_tertiary_institutions_updated_at
  BEFORE UPDATE ON tertiary_institutions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_institution_courses_updated_at
  BEFORE UPDATE ON institution_courses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();