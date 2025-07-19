import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

export default function UserSettings() {
  const { state } = useAuth();
  const user = state.user;

  // Theme state (default to GTEC theme)
  const defaultTheme = {
    logo: '/GTEC-LOGO-removebg-preview.png',
    primaryColor: '#1e40af',
    secondaryColor: '#171717',
    accentColor: '#fafafa',
  };
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('user_theme');
    return saved ? JSON.parse(saved) : defaultTheme;
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  // Placeholder handlers
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };
  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Profile updated!');
  };
  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert('New passwords do not match!');
      return;
    }
    alert('Password changed!');
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme({ ...theme, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogoFile(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setTheme({ ...theme, logo: ev.target?.result as string });
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleThemeSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('user_theme', JSON.stringify(theme));
    alert('Theme updated!');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      {/* Profile and password always shown */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleProfileSave}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordSave}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type="password"
                name="current"
                value={password.current}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                name="new"
                value={password.new}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type="password"
                name="confirm"
                value={password.confirm}
                onChange={handlePasswordChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit">Change Password</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Theme customization only for tertiary users */}
      {user?.role === 'tertiary_institution_user' && false && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Customize Theme</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleThemeSave}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <div className="flex items-center space-x-4">
                  <img src={theme.logo} alt="Logo Preview" className="h-12 w-12 rounded shadow border" />
                  <input type="file" accept="image/*" onChange={handleLogoChange} disabled />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Primary Color</label>
                <input type="color" name="primaryColor" value={theme.primaryColor} onChange={handleThemeChange} className="w-12 h-8 p-0 border-0" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Secondary Color</label>
                <input type="color" name="secondaryColor" value={theme.secondaryColor} onChange={handleThemeChange} className="w-12 h-8 p-0 border-0" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Accent Color</label>
                <input type="color" name="accentColor" value={theme.accentColor} onChange={handleThemeChange} className="w-12 h-8 p-0 border-0" disabled />
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled>Save Theme</Button>
              </div>
            </form>
            <div className="mt-4 text-blue-700 text-sm font-medium">
              GTEC branding is enforced for your institution. Theme customization is disabled.
            </div>
          </CardContent>
        </Card>
      )}
      {/* Institution admin: add institution settings and user management */}
      {user?.role === 'institution_admin' && (
        <>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Institution Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Institution name, address, and other settings go here.</p>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Add/remove users, assign roles, etc.</p>
            </CardContent>
          </Card>
        </>
      )}
      {/* BacChecker admin: add platform/global settings and user management */}
      {user?.role === 'bacchecker_admin' && (
        <>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Platform Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p>System configuration, branding, etc.</p>
            </CardContent>
          </Card>
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Manage all users, permissions, etc.</p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 