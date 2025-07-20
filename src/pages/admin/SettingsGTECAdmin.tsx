// src/pages/admin/SettingsGTECAdmin.tsx - REPLACE ENTIRE FILE
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Switch } from '../../components/ui/Switch';
import { Settings as SettingsIcon, Shield, Bell, Save, UserPlus, Building, Trash2, Edit, Plus, X, Loader2, Users } from 'lucide-react';
import { UserManagementAPI, GtecUser, Department } from '../../utils/UserManagementAPI';
import { SystemSettingsAPI, SystemSettings, NotificationSettings } from '../../utils/SystemSettingsAPI';

// =================================================================================
// Main Exported Component
// =================================================================================
export default function SettingsGTECAdmin() {
  const [activeTab, setActiveTab] = useState('general');
  const tabs = [
    { id: 'general', name: 'General', icon: SettingsIcon },
    { id: 'users_departments', name: 'User & Department Management', icon: Users },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'notifications', name: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">Manage GTEC system settings and configurations</p>
        </div>
      </div>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="pt-4">
        {activeTab === 'general' && <GeneralSettingsTab />}
        {activeTab === 'users_departments' && <UserDepartmentManagement />}
        {activeTab === 'security' && <SecuritySettingsTab />}
        {activeTab === 'notifications' && <NotificationSettingsTab />}
      </div>
    </div>
  );
}

// =================================================================================
// Tab Content Components
// =================================================================================

function GeneralSettingsTab() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    SystemSettingsAPI.getSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await SystemSettingsAPI.updateSettings(settings);
      alert('General settings saved successfully!');
    } catch {
      alert('Failed to save settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <Card>
      <CardHeader><CardTitle>General System Settings</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
                <input type="text" value={settings.system_name} onChange={e => setSettings({...settings, system_name: e.target.value})} className="w-full p-2 border rounded" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Official Contact Email</label>
                <input type="email" value={settings.contact_email} onChange={e => setSettings({...settings, contact_email: e.target.value})} className="w-full p-2 border rounded" />
            </div>
        </div>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
                <h4 className="font-medium">Maintenance Mode</h4>
                <p className="text-sm text-gray-500">Temporarily disable public access to the portal.</p>
            </div>
            <Switch checked={settings.maintenance_mode} onCheckedChange={checked => setSettings({...settings, maintenance_mode: checked})} />
        </div>
        <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Save className="h-4 w-4 mr-2"/>}
                Save General Settings
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SecuritySettingsTab() {
    return (
        <Card>
            <CardHeader><CardTitle>Security & Access Control</CardTitle></CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                        <h4 className="font-medium">Enforce Two-Factor Authentication (2FA)</h4>
                        <p className="text-sm text-gray-500">Require all admin and agent accounts to use an authenticator app.</p>
                    </div>
                    <Switch />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Password Length</label>
                        <input type="number" defaultValue={12} className="w-full p-2 border rounded" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Session Timeout (minutes)</label>
                        <input type="number" defaultValue={60} className="w-full p-2 border rounded" />
                    </div>
                </div>
                 <div className="flex justify-end">
                    <Button><Save className="h-4 w-4 mr-2"/>Save Security Settings</Button>
                </div>
            </CardContent>
        </Card>
    );
}

function NotificationSettingsTab() {
  const [settings, setSettings] = useState<NotificationSettings | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    SystemSettingsAPI.getNotificationSettings().then(setSettings);
  }, []);

  const handleSave = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      await SystemSettingsAPI.updateNotificationSettings(settings);
      alert('Notification settings saved!');
    } catch (error) {
      alert('Failed to save notification settings.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!settings) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  
  return (
    <Card>
      <CardHeader><CardTitle>Email Notification Settings</CardTitle></CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Enable Email Notifications</h4>
            <p className="text-sm text-gray-500">Master switch to turn all system emails on or off.</p>
          </div>
          <Switch checked={settings.notifications_enabled} onCheckedChange={checked => setSettings({ ...settings, notifications_enabled: checked })} />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notification Recipient</label>
            <input type="email" value={settings.recipient_email} onChange={e => setSettings({...settings, recipient_email: e.target.value})} placeholder="e.g., alerts@gtec.edu.gh" className="w-full p-2 border rounded" />
            <p className="text-xs text-gray-500 mt-1">This email address will receive all administrative alerts.</p>
        </div>
        <div className="space-y-4 pt-4 border-t">
            <h4 className="font-medium">Notify Admin On These Events:</h4>
            <div className="flex items-center justify-between">
                <label htmlFor="notify-new" className="text-sm">New verification request submitted</label>
                <Switch id="notify-new" checked={settings.notify_on_new_request} onCheckedChange={checked => setSettings({ ...settings, notify_on_new_request: checked })} />
            </div>
            <div className="flex items-center justify-between">
                <label htmlFor="notify-approval" className="text-sm">An institution approves a request</label>
                <Switch id="notify-approval" checked={settings.notify_on_institution_approval} onCheckedChange={checked => setSettings({ ...settings, notify_on_institution_approval: checked })} />
            </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin"/> : <Save className="h-4 w-4 mr-2"/>}
            Save Notification Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function UserDepartmentManagement() {
  const [users, setUsers] = useState<GtecUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewUserModal, setShowNewUserModal] = useState(false);
  const [showNewDeptModal, setShowNewDeptModal] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [fetchedUsers, fetchedDepartments] = await Promise.all([
        UserManagementAPI.getGTECUsers(),
        UserManagementAPI.getDepartments(),
      ]);
      setUsers(fetchedUsers);
      setDepartments(fetchedDepartments);
    } catch (error) {
      alert("Failed to load user and department data. Please ensure the SQL script has been run successfully.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Departments</CardTitle>
          <Button size="sm" onClick={() => setShowNewDeptModal(true)}><Building className="h-4 w-4 mr-2" />New Department</Button>
        </CardHeader>
        <CardContent><DepartmentTable departments={departments} users={users} /></CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Users</CardTitle>
          <Button size="sm" onClick={() => setShowNewUserModal(true)}><UserPlus className="h-4 w-4 mr-2" />Invite User</Button>
        </CardHeader>
        <CardContent><UserTable users={users} /></CardContent>
      </Card>
      {showNewDeptModal && <NewDepartmentModal onClose={() => setShowNewDeptModal(false)} onSave={fetchData} />}
      {showNewUserModal && <NewUserModal onClose={() => setShowNewUserModal(false)} onSave={fetchData} departments={departments} />}
    </div>
  );
}

// =================================================================================
// Helper Components (Tables & Modals)
// =================================================================================

function DepartmentTable({ departments, users }: { departments: Department[], users: GtecUser[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Users</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">
                {departments.map(dept => (<tr key={dept.id}><td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{dept.name}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{users.filter(u => u.department_name === dept.name).length}</td><td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2"><Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button><Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700"><Trash2 className="h-4 w-4"/></Button></td></tr>))}
                {departments.length === 0 && (<tr><td colSpan={3} className="text-center py-8 text-gray-500">No departments created yet.</td></tr>)}
            </tbody></table>
        </div>
    );
}

function UserTable({ users }: { users: GtecUser[] }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th><th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (<tr key={user.id}><td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{user.full_name}</div><div className="text-sm text-gray-500">{user.email}</div></td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role === 'gtec_admin' ? 'Admin' : 'Agent'}</td><td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department_name}</td><td className="px-6 py-4 whitespace-nowrap"><Badge variant={user.status === 'active' ? 'success' : (user.status === 'invited' ? 'warning' : 'default')}>{user.status}</Badge></td><td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"><Button variant="ghost" size="icon"><Edit className="h-4 w-4"/></Button></td></tr>))}
                {users.length === 0 && (<tr><td colSpan={5} className="text-center py-8 text-gray-500">No users invited yet.</td></tr>)}
            </tbody></table>
        </div>
    );
}

function NewDepartmentModal({ onClose, onSave }: { onClose: () => void, onSave: () => void }) {
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const handleSave = async () => {
        if (!name.trim()) return alert("Department name is required.");
        setIsSaving(true);
        try {
            await UserManagementAPI.createDepartment(name);
            onSave();
            onClose();
        } catch (error) {
            alert("Failed to create department. Does it already exist?");
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">New Department</h3><Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4"/></Button></div><input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Verification Unit" className="w-full p-2 border rounded mb-4" />
            <div className="flex justify-end space-x-2"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleSave} disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : "Save Department"}</Button></div></div>
        </div>
    );
}

function NewUserModal({ onClose, onSave, departments }: { onClose: () => void, onSave: () => void, departments: Department[] }) {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'gtec_admin' | 'gtec_agent'>('gtec_agent');
    const [departmentId, setDepartmentId] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const handleInvite = async () => {
        if (!fullName.trim() || !email.trim() || !departmentId) return alert("All fields are required.");
        setIsSaving(true);
        try {
            await UserManagementAPI.inviteGTECUser({ fullName, email, role, departmentId });
            onSave();
            onClose();
        } catch (error) {
            alert(`Failed to send invitation: ${(error as Error).message}`);
        } finally {
            setIsSaving(false);
        }
    };
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Invite New User</h3><Button variant="ghost" size="icon" onClick={onClose}><X className="h-4 w-4"/></Button></div><div className="space-y-4"><input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Full Name" className="w-full p-2 border rounded" /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address" className="w-full p-2 border rounded" /><select value={role} onChange={e => setRole(e.target.value as any)} className="w-full p-2 border rounded bg-white"><option value="gtec_agent">Agent</option><option value="gtec_admin">Admin</option></select><select value={departmentId} onChange={e => setDepartmentId(e.target.value)} className="w-full p-2 border rounded bg-white"><option value="">Select Department...</option>{departments.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
            <div className="flex justify-end space-x-2 mt-6"><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={handleInvite} disabled={isSaving}>{isSaving ? <Loader2 className="h-4 w-4 animate-spin"/> : "Send Invite"}</Button></div></div>
        </div>
    );
}