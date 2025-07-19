import React, { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Users, Shield, Edit, Plus, Trash2, Check, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { RoleSetup } from '../../../types/onboarding';

export function RolesStep() {
  const { state, dispatch } = useOnboarding();
  const [showCustomRole, setShowCustomRole] = useState(false);

  const defaultRoles: RoleSetup[] = [
    {
      id: 'admin',
      name: 'Institution Administrator',
      description: 'Full access to all system features and settings',
      permissions: [
        'manage_users',
        'manage_services',
        'manage_registries',
        'manage_templates',
        'view_analytics',
        'manage_api_keys',
        'system_settings'
      ],
      isCustom: false
    },
    {
      id: 'processor',
      name: 'Request Processor',
      description: 'Process and review service requests',
      permissions: [
        'process_requests',
        'view_requests',
        'update_request_status',
        'generate_documents',
        'access_registries'
      ],
      isCustom: false
    },
    {
      id: 'reviewer',
      name: 'Senior Reviewer',
      description: 'Review and approve processed requests',
      permissions: [
        'review_requests',
        'approve_requests',
        'reject_requests',
        'view_analytics',
        'access_registries'
      ],
      isCustom: false
    },
    {
      id: 'operator',
      name: 'Data Entry Operator',
      description: 'Enter and update registry data',
      permissions: [
        'add_registry_data',
        'edit_registry_data',
        'view_registries',
        'export_data'
      ],
      isCustom: false
    }
  ];

  const allPermissions = [
    { id: 'manage_users', name: 'Manage Users', category: 'Administration' },
    { id: 'manage_services', name: 'Manage Services', category: 'Administration' },
    { id: 'manage_registries', name: 'Manage Registries', category: 'Administration' },
    { id: 'manage_templates', name: 'Manage Templates', category: 'Administration' },
    { id: 'system_settings', name: 'System Settings', category: 'Administration' },
    { id: 'manage_api_keys', name: 'Manage API Keys', category: 'Administration' },
    { id: 'process_requests', name: 'Process Requests', category: 'Operations' },
    { id: 'review_requests', name: 'Review Requests', category: 'Operations' },
    { id: 'approve_requests', name: 'Approve Requests', category: 'Operations' },
    { id: 'reject_requests', name: 'Reject Requests', category: 'Operations' },
    { id: 'view_requests', name: 'View Requests', category: 'Operations' },
    { id: 'update_request_status', name: 'Update Request Status', category: 'Operations' },
    { id: 'generate_documents', name: 'Generate Documents', category: 'Operations' },
    { id: 'add_registry_data', name: 'Add Registry Data', category: 'Data Management' },
    { id: 'edit_registry_data', name: 'Edit Registry Data', category: 'Data Management' },
    { id: 'view_registries', name: 'View Registries', category: 'Data Management' },
    { id: 'access_registries', name: 'Access Registries', category: 'Data Management' },
    { id: 'export_data', name: 'Export Data', category: 'Data Management' },
    { id: 'view_analytics', name: 'View Analytics', category: 'Reporting' }
  ];

  const addDefaultRole = (role: RoleSetup) => {
    if (!state.roles.some(r => r.id === role.id)) {
      dispatch({ type: 'UPDATE_ROLES', payload: [...state.roles, role] });
    }
  };

  const removeRole = (roleId: string) => {
    dispatch({ 
      type: 'UPDATE_ROLES', 
      payload: state.roles.filter(r => r.id !== roleId) 
    });
  };

  const handleNext = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: 'roles' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 6 });
  };

  const handlePrevious = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 4 });
  };

  const canProceed = state.roles.length > 0;

  return (
    <OnboardingLayout
      title="User Roles & Permissions"
      description="Set up user roles and permissions for your institution"
      onNext={handleNext}
      onPrevious={handlePrevious}
      canProceed={canProceed}
    >
      <div className="space-y-8">
        {/* Default Roles */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Recommended Roles
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {defaultRoles.map((role) => (
              <div key={role.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{role.name}</h5>
                      <Badge variant="default" size="sm">Default Role</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addDefaultRole(role)}
                    disabled={state.roles.some(r => r.id === role.id)}
                  >
                    {state.roles.some(r => r.id === role.id) ? 'Added' : 'Add'}
                  </Button>
                </div>
                
                <p className="text-gray-600 mb-4">{role.description}</p>
                
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">
                    Permissions ({role.permissions.length})
                  </h6>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.slice(0, 3).map((permission) => (
                      <Badge key={permission} variant="info" size="sm">
                        {allPermissions.find(p => p.id === permission)?.name || permission}
                      </Badge>
                    ))}
                    {role.permissions.length > 3 && (
                      <Badge variant="default" size="sm">
                        +{role.permissions.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configured Roles */}
        {state.roles.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Configured Roles ({state.roles.length})
              </h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowCustomRole(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Role
              </Button>
            </div>
            
            <div className="space-y-4">
              {state.roles.map((role) => (
                <div key={role.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{role.name}</h5>
                        <Badge variant="success" size="sm">Configured</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {role.isCustom && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeRole(role.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{role.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {role.permissions.length} permissions assigned
                    </span>
                    <Badge variant={role.isCustom ? 'warning' : 'info'} size="sm">
                      {role.isCustom ? 'Custom' : 'Default'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Role Creation */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Role</h4>
          <p className="text-gray-600 mb-4">
            Need a role with specific permissions? Create a custom role tailored to your institution's workflow.
          </p>
          <Button 
            variant="outline"
            onClick={() => setShowCustomRole(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Role
          </Button>
        </div>

        {/* Permission Categories Overview */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Available Permissions
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Administration', 'Operations', 'Data Management', 'Reporting'].map((category) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <h5 className="font-semibold text-gray-900 mb-3">{category}</h5>
                <div className="space-y-2">
                  {allPermissions
                    .filter(p => p.category === category)
                    .slice(0, 4)
                    .map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Check className="h-3 w-3 text-green-500" />
                        <span className="text-sm text-gray-600">{permission.name}</span>
                      </div>
                    ))}
                  {allPermissions.filter(p => p.category === category).length > 4 && (
                    <p className="text-xs text-gray-500">
                      +{allPermissions.filter(p => p.category === category).length - 4} more
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role Management Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-semibold text-blue-900 mb-2">Role Management</h5>
          <p className="text-blue-700 text-sm">
            You can modify roles and permissions later in the user management section. 
            Start with the recommended roles and customize as needed for your workflow.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}