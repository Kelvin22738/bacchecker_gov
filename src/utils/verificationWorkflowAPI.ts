// src/utils/verificationWorkflowAPI.ts
import { VerificationRequest, VerificationAction, VerificationStatus } from '../types/verification';
import { supabase } from './supabase';
import { Notification } from '../types/verification';

// Since we're using localStorage for demo, we'll create functions that work with localStorage
// In production, these would connect to your Supabase backend

export class VerificationWorkflowAPI {
  private static REQUESTS_KEY = 'public_verification_requests';
  private static ACTIONS_KEY = 'verification_actions';

  // Notification support (localStorage for demo)
  private static NOTIFICATIONS_KEY = 'verification_notifications';

  // Get all verification requests
  static getAllRequests(): VerificationRequest[] {
    try {
      const requests = localStorage.getItem(this.REQUESTS_KEY);
      return requests ? JSON.parse(requests) : [];
    } catch (error) {
      console.error('Error getting requests:', error);
      return [];
    }
  }

  // Get requests by institution
  static getRequestsByInstitution(institutionId: string): VerificationRequest[] {
    const allRequests = this.getAllRequests();
    return allRequests.filter(req => req.target_institution_id === institutionId);
  }

  // Get requests by status
  static getRequestsByStatus(status: VerificationStatus[]): VerificationRequest[] {
    const allRequests = this.getAllRequests();
    return allRequests.filter(req => status.includes(req.overall_status));
  }

  // Get requests for GTEC admin (all requests that need GTEC action)
  static getGTECRequests(): VerificationRequest[] {
    const allRequests = this.getAllRequests();
    return allRequests.filter(req => 
      req.overall_status === 'submitted' || 
      req.overall_status === 'institution_approved' ||
      req.overall_status === 'gtec_reviewing' ||
      req.overall_status === 'pending_final_approval'
    );
  }

  // Get requests for institution (requests forwarded to their institution)
  static getInstitutionRequests(institutionId: string): VerificationRequest[] {
    const allRequests = this.getAllRequests();
    return allRequests.filter(req => 
      req.target_institution_id === institutionId || 
      (req.requesting_institution_id && req.requesting_institution_id === institutionId)
    );
  }

  // Update request
  static updateRequest(requestId: string, updates: Partial<VerificationRequest>): VerificationRequest | null {
    try {
      const requests = this.getAllRequests();
      const requestIndex = requests.findIndex(req => req.id === requestId);
      
      if (requestIndex === -1) {
        throw new Error('Request not found');
      }

      const updatedRequest = {
        ...requests[requestIndex],
        ...updates,
        updated_at: new Date().toISOString()
      };

      requests[requestIndex] = updatedRequest;
      localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(requests));
      
      return updatedRequest;
    } catch (error) {
      console.error('Error updating request:', error);
      return null;
    }
  }

  static isPublicSubmission(request: VerificationRequest): boolean {
    return request.requesting_institution_id === null || 
           request.metadata?.source === 'public_portal';
  }

  // GTEC approve request (forward to institution)
  static gtecApproveRequest(requestId: string, approvedBy: string, comments?: string): VerificationRequest | null {
    const action: VerificationAction = {
      id: `action_${Date.now()}`,
      request_id: requestId,
      action_type: 'gtec_approve',
      performed_by: approvedBy,
      performed_at: new Date().toISOString(),
      comments
    };

    this.logAction(action);

    return this.updateRequest(requestId, {
      overall_status: 'gtec_approved',
      current_phase: 2,
      gtec_approved_at: new Date().toISOString(),
      gtec_approved_by: approvedBy
    });
  }

  // GTEC reject request
  static gtecRejectRequest(requestId: string, rejectedBy: string, reason: string): VerificationRequest | null {
    const action: VerificationAction = {
      id: `action_${Date.now()}`,
      request_id: requestId,
      action_type: 'gtec_reject',
      performed_by: rejectedBy,
      performed_at: new Date().toISOString(),
      comments: reason
    };

    this.logAction(action);

    return this.updateRequest(requestId, {
      overall_status: 'gtec_rejected',
      rejection_reason: reason
    });
  }

  // Institution approve request (send back to GTEC)
  static institutionApproveRequest(requestId: string, approvedBy: string, comments?: string): VerificationRequest | null {
    const action: VerificationAction = {
      id: `action_${Date.now()}`,
      request_id: requestId,
      action_type: 'institution_approve',
      performed_by: approvedBy,
      performed_at: new Date().toISOString(),
      comments
    };

    this.logAction(action);

    return this.updateRequest(requestId, {
      overall_status: 'institution_approved',
      current_phase: 3,
      institution_approved_at: new Date().toISOString(),
      institution_approved_by: approvedBy
    });
  }

  // Institution reject request
  static institutionRejectRequest(requestId: string, rejectedBy: string, reason: string): VerificationRequest | null {
    const action: VerificationAction = {
      id: `action_${Date.now()}`,
      request_id: requestId,
      action_type: 'institution_reject',
      performed_by: rejectedBy,
      performed_at: new Date().toISOString(),
      comments: reason
    };

    this.logAction(action);

    return this.updateRequest(requestId, {
      overall_status: 'institution_rejected',
      rejection_reason: reason
    });
  }

  // Final GTEC approval (complete the request)
  static finalGtecApproval(requestId: string, approvedBy: string, comments?: string): VerificationRequest | null {
    const action: VerificationAction = {
      id: `action_${Date.now()}`,
      request_id: requestId,
      action_type: 'final_approve',
      performed_by: approvedBy,
      performed_at: new Date().toISOString(),
      comments
    };

    this.logAction(action);

    return this.updateRequest(requestId, {
      overall_status: 'completed',
      current_phase: 4,
      completed_at: new Date().toISOString()
    });
  }

  // Get request by ID
  static getRequestById(requestId: string): VerificationRequest | null {
    const requests = this.getAllRequests();
    return requests.find(req => req.id === requestId) || null;
  }

  // Get actions for a request
  static getRequestActions(requestId: string): VerificationAction[] {
    try {
      const actions = localStorage.getItem(this.ACTIONS_KEY);
      const allActions: VerificationAction[] = actions ? JSON.parse(actions) : [];
      return allActions.filter(action => action.request_id === requestId);
    } catch (error) {
      console.error('Error getting actions:', error);
      return [];
    }
  }

  // Log action
  private static logAction(action: VerificationAction): void {
    try {
      const actions = localStorage.getItem(this.ACTIONS_KEY);
      const allActions: VerificationAction[] = actions ? JSON.parse(actions) : [];
      allActions.push(action);
      localStorage.setItem(this.ACTIONS_KEY, JSON.stringify(allActions));
    } catch (error) {
      console.error('Error logging action:', error);
    }
  }

  // Notification support (Supabase)
  static async createNotification(notification: Omit<Notification, 'id' | 'is_read' | 'created_at'>) {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        ...notification,
        is_read: false,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data as Notification;
  }

  static async getUserNotifications(userId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Notification[];
  }

  static async markNotificationAsRead(notificationId: string) {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .select()
      .single();
    if (error) throw error;
    return data as Notification;
  }

  // Helper function to get institution name by ID
  static getInstitutionName(institutionId: string | null): string {
    if (!institutionId) return 'Public Submission';
    
    // Only include educational institutions for GTEC workflow
    const institutionMap: { [key: string]: string } = {
      'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11': 'GTEC',
      'bd5610c1e8-941a-4f51-ab77-882656fd7f17': 'University of Ghana',
      'b066613d3-0837-49e9-82c2-23d1caa1df11': 'KNUST',
      '2d78f1ff-bc42-460b-bbf3-2fb61eb8ca9f': 'University of Cape Coast',
      '2f3dcc21-8fa2-4788-921e-9b1825fd7835': 'Emmanuel University',
      // Add other educational institutions here
      // REMOVED: Ghana Police Service and High Court (non-educational)
    };
    return institutionMap[institutionId] || 'Educational Institution';
  }

  static async getEducationalInstitutions() {
    try {
      const { data, error } = await supabase
        .from('tertiary_institutions')
        .select('id, name, acronym, institution_type')
        .eq('onboarding_status', 'completed')
        .eq('gtec_managed', true)
        .in('institution_type', ['university', 'technical_university', 'private_university', 'polytechnic', 'college'])
        .order('name');
  
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading educational institutions:', error);
      
      // Fallback to hardcoded educational institutions only
      return [
        {
          id: 'bd5610c1e8-941a-4f51-ab77-882656fd7f17',
          name: 'University of Ghana',
          acronym: 'UG',
          institution_type: 'university'
        },
        {
          id: 'b066613d3-0837-49e9-82c2-23d1caa1df11',
          name: 'Kwame Nkrumah University of Science and Technology',
          acronym: 'KNUST',
          institution_type: 'technical_university'
        },
        {
          id: '2d78f1ff-bc42-460b-bbf3-2fb61eb8ca9f',
          name: 'University of Cape Coast',
          acronym: 'UCC',
          institution_type: 'university'
        }
      ];
    }
  }

  // Helper function to get status display name
  static getStatusDisplayName(status: VerificationStatus): string {
    const statusNames: { [key in VerificationStatus]: string } = {
      'submitted': 'Submitted',
      'gtec_reviewing': 'GTEC Reviewing',
      'gtec_approved': 'GTEC Approved',
      'gtec_rejected': 'GTEC Rejected',
      'institution_reviewing': 'Institution Reviewing',
      'institution_approved': 'Institution Approved',
      'institution_rejected': 'Institution Rejected',
      'pending_final_approval': 'Pending Final Approval',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };
    return statusNames[status] || status;
  }

  // Helper function to get status color
  static getStatusColor(status: VerificationStatus): string {
    const statusColors: { [key in VerificationStatus]: string } = {
      'submitted': 'blue',
      'gtec_reviewing': 'yellow',
      'gtec_approved': 'green',
      'gtec_rejected': 'red',
      'institution_reviewing': 'yellow',
      'institution_approved': 'green',
      'institution_rejected': 'red',
      'pending_final_approval': 'purple',
      'completed': 'green',
      'rejected': 'red'
    };
    return statusColors[status] || 'gray';
  }

  static generateRequestNumber() {
    return `VER-${Date.now().toString().slice(-8)}`;
  }

  static async createRequest(request: Omit<VerificationRequest, 'id'>) {
    try {
      console.log('Creating request in Supabase:', request);
      
      const { data, error } = await supabase
        .from('verification_requests')
        .insert({ 
          ...request,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) {
        console.error('Supabase error details:', error);
        throw new Error(`Database error: ${error.message}`);
      }
      
      console.log('Request created successfully in Supabase:', data);
      return data as VerificationRequest;
    } catch (error) {
      console.error('Error creating request:', error);
      throw error;
    }

  
      // For institutional requests, try Supabase first
      const { data, error } = await supabase
        .from('verification_requests')
        .insert({ 
          ...request,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();
        
      if (error) {
        console.error('Supabase error:', error);
        
        // Fallback to localStorage if Supabase fails
        const existingRequests = JSON.parse(localStorage.getItem(this.REQUESTS_KEY) || '[]');
        
        const newRequest: VerificationRequest = {
          id: crypto.randomUUID(),
          ...request,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
  
        existingRequests.push(newRequest);
        localStorage.setItem(this.REQUESTS_KEY, JSON.stringify(existingRequests));
        
        console.log('Request stored in localStorage (Supabase fallback):', newRequest);
        return newRequest;
      }
      
      return data as VerificationRequest;
    } catch (error) {
      console.error('Error creating request:', error);
      throw new Error('Failed to create verification request');
    }

  
  // Also add these helper methods for getting requests from both sources
  static async getRequestByNumber(requestNumber: string): Promise<VerificationRequest | null> {
    try {
      // First try Supabase
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .eq('request_number', requestNumber)
        .single();
      
      if (!error && data) {
        return data as VerificationRequest;
      }
      
      // Fallback to localStorage
      const requests = this.getAllRequests();
      return requests.find(req => req.request_number === requestNumber) || null;
    } catch (error) {
      console.error('Error finding request by number:', error);
      
      // Fallback to localStorage
      const requests = this.getAllRequests();
      return requests.find(req => req.request_number === requestNumber) || null;
    }
  }
  
  static async getRequestByEmail(email: string): Promise<VerificationRequest[]> {
    try {
      // First try Supabase
      const { data, error } = await supabase
        .from('verification_requests')
        .select('*')
        .contains('metadata', { applicant_email: email });
      
      if (!error && data) {
        return data as VerificationRequest[];
      }
      
      // Fallback to localStorage
      const requests = this.getAllRequests();
      return requests.filter(req => req.metadata?.applicant_email === email);
    } catch (error) {
      console.error('Error finding requests by email:', error);
      
      // Fallback to localStorage
      const requests = this.getAllRequests();
      return requests.filter(req => req.metadata?.applicant_email === email);
    }
  }
}