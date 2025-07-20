import { supabase } from './supabase';

// Define types for clarity
export interface GtecUser {
  id: string;
  full_name: string;
  email: string;
  role: 'gtec_admin' | 'gtec_agent';
  department_id?: string;
  department_name?: string;
  status: 'active' | 'invited' | 'inactive';
}

export interface Department {
  id: string;
  name: string;
  created_at: string;
}

export class UserManagementAPI {
  // --- Department Management ---

  static async getDepartments(): Promise<Department[]> {
    const { data, error } = await supabase.from('departments').select('*');
    if (error) {
      console.error('Error fetching departments:', error);
      throw error;
    }
    return data || [];
  }

  static async createDepartment(name: string): Promise<Department | null> {
    const { data, error } = await supabase
      .from('departments')
      .insert({ name })
      .select()
      .single();
    if (error) {
      console.error('Error creating department:', error);
      throw error;
    }
    return data;
  }

  // --- User Management ---

  static async getGTECUsers(): Promise<GtecUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
        id,
        full_name,
        email,
        role,
        status,
        department:departments (name)
      `)
      .in('role', ['gtec_admin', 'gtec_agent']);
      
    if (error) {
      console.error('Error fetching GTEC users:', error);
      throw error;
    }
    
    // Flatten the department name for easier access
    return data.map(user => ({
      ...user,
      department_name: user.department?.name
    })) as GtecUser[];
  }

  /**
   * Invites a new user via email and creates their profile.
   * NOTE: This requires elevated Supabase privileges (service_role key).
   * For production, this should be called from a secure Supabase Edge Function.
   */
  static async inviteGTECUser(userData: {
    email: string;
    fullName: string;
    role: 'gtec_admin' | 'gtec_agent';
    departmentId: string;
  }): Promise<any> {
    
    // Step 1: Invite the user using Supabase Auth Admin
    const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(
        userData.email,
        { data: { full_name: userData.fullName } }
    );

    if (inviteError) {
      console.error('Error inviting user:', inviteError);
      throw new Error(inviteError.message);
    }

    if (!inviteData.user) {
        throw new Error('User invitation did not return a user.');
    }

    // Step 2: Create a corresponding profile for the user in the public 'profiles' table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: inviteData.user.id, // Link to the auth user
        full_name: userData.fullName,
        email: userData.email,
        role: userData.role,
        department_id: userData.departmentId,
        status: 'invited'
      });

    if (profileError) {
      console.error('Error creating user profile:', profileError);
      // Optional: Clean up by deleting the invited auth user if profile creation fails
      await supabase.auth.admin.deleteUser(inviteData.user.id);
      throw new Error(profileError.message);
    }

    return inviteData.user;
  }
}