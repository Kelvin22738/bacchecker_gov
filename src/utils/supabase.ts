import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our database tables
export interface TertiaryInstitution {
  id: string;
  name: string;
  acronym: string;
  email: string;
  phone?: string;
  address?: string;
  website?: string;
  established_year?: number;
  student_population?: number;
  faculty_count?: number;
  institution_type: string;
  accreditation_status: string;
  onboarding_status: 'pending' | 'in_progress' | 'completed';
  onboarding_token?: string;
  logo_url?: string;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  gtec_managed: boolean;
  created_at: string;
  updated_at: string;
  onboarded_at?: string;
}

export interface InstitutionOnboardingStep {
  id: string;
  institution_id: string;
  step_name: string;
  step_data: any;
  completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface InstitutionCourse {
  id: string;
  institution_id: string;
  name: string;
  code: string;
  level: string;
  duration?: string;
  faculty?: string;
  department?: string;
  accreditation_status: string;
  students_enrolled: number;
  graduates_last_year: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

// API functions
export const tertiaryInstitutionAPI = {
  // Get all tertiary institutions
  async getAll() {
    const { data, error } = await supabase
      .from('tertiary_institutions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as TertiaryInstitution[];
  },

  // Get GTEC managed institutions
  async getGTECManaged() {
    const { data, error } = await supabase
      .from('tertiary_institutions')
      .select('*')
      .eq('gtec_managed', true)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as TertiaryInstitution[];
  },

  // Get institution by onboarding token
  async getByToken(token: string) {
    if (!token || token.trim() === '') {
      throw new Error('Invalid token provided');
    }
    
    const { data, error } = await supabase
      .from('tertiary_institutions')
      .select('*')
      .eq('onboarding_token', token)
      .eq('onboarding_status', 'pending')
      .single();
    
    if (error) {
      console.error('Error fetching institution by token:', error);
      throw new Error('Institution not found or onboarding link has expired');
    }
    
    if (!data) {
      throw new Error('Institution not found');
    }
    
    return data as TertiaryInstitution;
  },

  // Create new institution
  async create(institution: Partial<TertiaryInstitution>) {
    // Generate onboarding token
    const onboarding_token = 'onboard_' + Math.random().toString(36).substr(2, 16);
    
    const { data, error } = await supabase
      .from('tertiary_institutions')
      .insert({
        ...institution,
        onboarding_token,
        onboarding_status: 'pending'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as TertiaryInstitution;
  },

  // Update institution
  async update(id: string, updates: Partial<TertiaryInstitution>) {
    const { data, error } = await supabase
      .from('tertiary_institutions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as TertiaryInstitution;
  },

  // Complete onboarding
  async completeOnboarding(id: string) {
    const { data, error } = await supabase
      .from('tertiary_institutions')
      .update({
        onboarding_status: 'completed',
        onboarded_at: new Date().toISOString(),
        onboarding_token: null // Clear the token after completion
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as TertiaryInstitution;
  }
};

export const onboardingStepsAPI = {
  // Get steps for institution
  async getByInstitution(institutionId: string) {
    const { data, error } = await supabase
      .from('institution_onboarding_steps')
      .select('*')
      .eq('institution_id', institutionId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return data as InstitutionOnboardingStep[];
  },

  // Create or update step
  async upsertStep(institutionId: string, stepName: string, stepData: any, completed: boolean = false) {
    const { data, error } = await supabase
      .from('institution_onboarding_steps')
      .upsert({
        institution_id: institutionId,
        step_name: stepName,
        step_data: stepData,
        completed,
        completed_at: completed ? new Date().toISOString() : null
      }, {
        onConflict: 'institution_id,step_name'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data as InstitutionOnboardingStep;
  }
};

export const coursesAPI = {
  // Get courses for institution
  async getByInstitution(institutionId: string) {
    const { data, error } = await supabase
      .from('institution_courses')
      .select('*')
      .eq('institution_id', institutionId)
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data as InstitutionCourse[];
  },

  // Create course
  async create(course: Partial<InstitutionCourse>) {
    const { data, error } = await supabase
      .from('institution_courses')
      .insert(course)
      .select()
      .single();
    
    if (error) throw error;
    return data as InstitutionCourse;
  },

  // Update course
  async update(id: string, updates: Partial<InstitutionCourse>) {
    const { data, error } = await supabase
      .from('institution_courses')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data as InstitutionCourse;
  },

  // Delete course
  async delete(id: string) {
    const { error } = await supabase
      .from('institution_courses')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};