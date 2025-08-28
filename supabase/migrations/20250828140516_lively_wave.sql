/*
  # Initial NSS Management System Schema

  1. New Tables
    - `students`
      - `id` (text, primary key) - Custom student ID
      - `name` (text)
      - `department` (text)
      - `password` (text)
      - `profile_image_url` (text, nullable)
      - `created_at` (timestamp)
    
    - `coordinators`
      - `id` (text, primary key) - Custom coordinator ID
      - `name` (text)
      - `department` (text)
      - `password` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)
    
    - `programs`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `date` (text)
      - `time` (text)
      - `venue` (text)
      - `coordinator_ids` (text array)
      - `participant_ids` (text array)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `departments`
      - `id` (uuid, primary key)
      - `name` (text)
      - `is_active` (boolean)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated access
*/

-- Students table
CREATE TABLE IF NOT EXISTS students (
  id text PRIMARY KEY,
  name text NOT NULL,
  department text NOT NULL,
  password text NOT NULL,
  profile_image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own data"
  ON students
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Students can be managed"
  ON students
  FOR ALL
  TO authenticated
  USING (true);

-- Coordinators table
CREATE TABLE IF NOT EXISTS coordinators (
  id text PRIMARY KEY,
  name text NOT NULL,
  department text NOT NULL,
  password text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE coordinators ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Coordinators can be accessed"
  ON coordinators
  FOR ALL
  TO authenticated
  USING (true);

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  date text NOT NULL,
  time text NOT NULL,
  venue text NOT NULL,
  coordinator_ids text[] DEFAULT '{}',
  participant_ids text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Programs can be accessed"
  ON programs
  FOR ALL
  TO authenticated
  USING (true);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Departments can be accessed"
  ON departments
  FOR ALL
  TO authenticated
  USING (true);

-- Insert default departments
INSERT INTO departments (name) VALUES
  ('Mathematics'),
  ('Physics'),
  ('Chemistry'),
  ('Microbiology'),
  ('History'),
  ('English'),
  ('ASM'),
  ('BBA'),
  ('BCOM'),
  ('Computer Science'),
  ('Economics')
ON CONFLICT (name) DO NOTHING;

-- Insert sample data
INSERT INTO students (id, name, department, password) VALUES
  ('101', 'John Doe', 'Computer Science', 'student123'),
  ('102', 'Jane Smith', 'Electronics', 'student456'),
  ('103', 'Mike Johnson', 'Mechanical', 'student789')
ON CONFLICT (id) DO NOTHING;

INSERT INTO coordinators (id, name, department, password, is_active) VALUES
  ('COORD1001', 'Dr. Sarah Johnson', 'NSS Coordinator', 'coord123', true),
  ('COORD1002', 'Prof. Michael Chen', 'Environmental Science', 'coord456', true)
ON CONFLICT (id) DO NOTHING;