import React from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import { useOnboarding } from '../../../context/OnboardingContext';
import { CheckCircle, Users, Database, FileText, Shield, Settings, Rocket, Eye } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

export function ReviewStep() {
  const { state, dispatch } = useOnboarding();

  const handleLaunch = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: 'review' });
    dispatch({ type: 'COMPLETE_ONBOARDING' });
    // This will trigger the transition to the main dashboard
    window.location.reload(); // Simple way to transition to main app
  };

  const handlePrevious = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 6 });
  };

  const completedSteps = state.steps.filter(step => step.completed).length;
  const totalSteps = state.steps.length;
  const setupProgress = Math.round((completedSteps / totalSteps) * 100);

  return (
    <OnboardingLayout
      title="Review & Launch"
      description="Review your configuration and launch your institution's digital platform"
      onNext={handleLaunch}
      onPrevious={handlePrevious}
      nextLabel="Launch Dashboard"
      canProceed={true}
    >
      <div className="space-y-8">
        {/* Setup Summary */}
        <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-green-900">Setup Complete!</h3>
              <p className="text-green-700">Your institution is ready to go digital</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">{setupProgress}%</div>
              <div className="text-sm text-green-700">Configuration Complete</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">{state.services.length}</div>
              <div className="text-sm text-green-700">Services Configured</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-900">{state.registries.length}</div>
              <div className="text-sm text-green-700">Registries Created</div>
            </div>
          </div>
        </div>

        {/* Institution Profile Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Settings className="h-5 w-5 mr-2" />
            Institution Profile
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Basic Information</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{state.profile.name || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <Badge variant="default" size="sm">
                    {state.profile.type || 'Not selected'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{state.profile.email || 'Not set'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{state.profile.phone || 'Not set'}</span>
                </div>
              </div>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Branding</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Primary Color:</span>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-4 h-4 rounded border"
                      style={{ backgroundColor: state.profile.primaryColor }}
                    />
                    <span className="font-medium">{state.profile.primaryColor}</span>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Logo:</span>
                  <Badge variant={state.profile.logo ? 'success' : 'default'} size="sm">
                    {state.profile.logo ? 'Uploaded' : 'Default'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Digital Seal:</span>
                  <Badge variant={state.profile.digitalSeal ? 'success' : 'default'} size="sm">
                    {state.profile.digitalSeal ? 'Uploaded' : 'Default'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Configured Services ({state.services.length})
          </h4>
          {state.services.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.services.map((service) => (
                <div key={service.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{service.name}</h5>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Fee: {service.currency} {service.fee}</span>
                    <span className="text-gray-500">{service.processingTime}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No services configured yet. You can add services later.</p>
          )}
        </div>

        {/* Registries Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Data Registries ({state.registries.length})
          </h4>
          {state.registries.length > 0 ? (
            <div className="space-y-3">
              {state.registries.map((registry) => (
                <div key={registry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">{registry.name}</h5>
                    <p className="text-sm text-gray-600">{registry.fields.length} fields configured</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant={registry.isPublic ? 'success' : 'default'} size="sm">
                      {registry.isPublic ? 'Public' : 'Private'}
                    </Badge>
                    <Badge variant={registry.searchable ? 'info' : 'default'} size="sm">
                      {registry.searchable ? 'Searchable' : 'Internal'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No registries configured yet. You can create registries later.</p>
          )}
        </div>

        {/* User Roles Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 mr-2" />
            User Roles ({state.roles.length})
          </h4>
          {state.roles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.roles.map((role) => (
                <div key={role.id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium text-gray-900">{role.name}</h5>
                    <Badge variant={role.isCustom ? 'warning' : 'info'} size="sm">
                      {role.isCustom ? 'Custom' : 'Default'}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{role.description}</p>
                  <span className="text-xs text-gray-500">{role.permissions.length} permissions</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No roles configured yet. Default roles will be created.</p>
          )}
        </div>

        {/* Templates Summary */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Document Templates ({state.templates.length})
          </h4>
          {state.templates.length > 0 ? (
            <div className="space-y-3">
              {state.templates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <h5 className="font-medium text-gray-900">{template.name}</h5>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Badge variant="info" size="sm">{template.category}</Badge>
                    <Badge variant="success" size="sm">Ready</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No templates configured yet. Default templates will be available.</p>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Rocket className="h-5 w-5 mr-2" />
            What's Next?
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-blue-900 mb-2">Immediate Actions</h5>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Access your institution dashboard</li>
                <li>• Invite team members and assign roles</li>
                <li>• Test service workflows</li>
                <li>• Configure API access if needed</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-900 mb-2">Optional Enhancements</h5>
              <ul className="space-y-1 text-sm text-blue-700">
                <li>• Customize document templates</li>
                <li>• Set up advanced workflows</li>
                <li>• Configure public portal</li>
                <li>• Enable analytics and reporting</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Launch Confirmation */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full mb-4">
            <Rocket className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Launch!</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Your institution's digital platform is configured and ready to serve citizens and businesses. 
            Click the button below to access your dashboard and start processing requests.
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview Setup
            </Button>
            <Button size="lg" onClick={handleLaunch}>
              <Rocket className="h-4 w-4 mr-2" />
              Launch Dashboard
            </Button>
          </div>
        </div>
      </div>
    </OnboardingLayout>
  );
}