import { supabase } from './supabase';

export interface NotificationSettings {
    notifications_enabled: boolean;
    recipient_email: string;
    notify_on_new_request: boolean;
    notify_on_institution_approval: boolean;
  }


export interface SystemSettings {
  system_name: string;
  contact_email: string;
  timezone: string;
  maintenance_mode: boolean;
}

export class SystemSettingsAPI {
  static async getSettings(): Promise<SystemSettings> {
    const { data, error } = await supabase
      .from('system_settings')
      .select('value')
      .in('key', ['system_name', 'contact_email', 'timezone', 'maintenance_mode']);

    if (error) {
      console.error('Error fetching settings:', error);
      throw error;
    }

    // Convert the key-value array into a single settings object
    const settings = data.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as any);

    return {
      system_name: settings.system_name || 'GTEC Verification Platform',
      contact_email: settings.contact_email || '',
      timezone: settings.timezone || 'UTC',
      maintenance_mode: settings.maintenance_mode || false,
    };
  }

  static async getNotificationSettings(): Promise<NotificationSettings> {
    // This is a simplified example; you can expand this logic
    return {
      notifications_enabled: true,
      recipient_email: 'admin-alerts@gtec.edu.gh',
      notify_on_new_request: true,
      notify_on_institution_approval: true,
    };
  }

  static async updateNotificationSettings(settings: NotificationSettings): Promise<void> {
    // In a real app, you would save this to your system_settings table
    console.log('Saving notification settings:', settings);
    // const { error } = await supabase.from('system_settings').upsert(...);
    // if (error) throw error;
  }

  static async updateSettings(settings: Partial<SystemSettings>): Promise<void> {
    const updates = Object.entries(settings).map(([key, value]) => ({
      key,
      value,
    }));

    const { error } = await supabase.from('system_settings').upsert(updates);

    if (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
}