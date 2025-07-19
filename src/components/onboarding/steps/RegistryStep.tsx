import React, { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Database, Plus, Edit, Trash2, Eye, DragDropContext, Droppable, Draggable } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { RegistrySetup, RegistryFieldSetup } from '../../../types/onboarding';

export function RegistryStep() {
  const { state, dispatch } = useOnboarding();
  const [selectedRegistry, setSelectedRegistry] = useState<string | null>(null);
  const [showFieldBuilder, setShowFieldBuilder] = useState(false);

  const registryTemplates = {
    police: [
      {
        name: 'Criminal Records Database',
        description: 'Database of criminal records and background checks',
        isPublic: false,
        searchable: true,
        fields: [
          { name: 'fullName', label: 'Full Name', type: 'text', required: true },
          { name: 'idNumber', label: 'ID Number', type: 'text', required: true },
          { name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
          { name: 'criminalHistory', label: 'Criminal History', type: 'text', required: false },
          { name: 'status', label: 'Status', type: 'select', required: true, options: ['Clean', 'Convicted', 'Under Investigation'] }
        ]
      },
      {
        name: 'Incident Reports Registry',
        description: 'Registry of police incident reports and cases',
        isPublic: false,
        searchable: true,
        fields: [
          { name: 'incidentNumber', label: 'Incident Number', type: 'text', required: true },
          { name: 'reportDate', label: 'Report Date', type: 'date', required: true },
          { name: 'location', label: 'Location', type: 'text', required: true },
          { name: 'incidentType', label: 'Incident Type', type: 'select', required: true, options: ['Theft', 'Assault', 'Traffic', 'Other'] },
          { name: 'status', label: 'Status', type: 'select', required: true, options: ['Open', 'Closed', 'Under Investigation'] }
        ]
      }
    ],
    court: [
      {
        name: 'Court Cases Registry',
        description: 'Registry of court cases and legal proceedings',
        isPublic: true,
        searchable: true,
        fields: [
          { name: 'caseNumber', label: 'Case Number', type: 'text', required: true },
          { name: 'parties', label: 'Parties Involved', type: 'text', required: true },
          { name: 'caseType', label: 'Case Type', type: 'select', required: true, options: ['Civil', 'Criminal', 'Commercial', 'Family'] },
          { name: 'filingDate', label: 'Filing Date', type: 'date', required: true },
          { name: 'status', label: 'Status', type: 'select', required: true, options: ['Active', 'Closed', 'Pending'] }
        ]
      }
    ],
    education: [
      {
        name: 'Educational Certificates Registry',
        description: 'Registry of verified educational certificates',
        isPublic: true,
        searchable: true,
        fields: [
          { name: 'studentName', label: 'Student Name', type: 'text', required: true },
          { name: 'studentId', label: 'Student ID', type: 'text', required: true },
          { name: 'institution', label: 'Institution', type: 'text', required: true },
          { name: 'program', label: 'Program', type: 'text', required: true },
          { name: 'graduationDate', label: 'Graduation Date', type: 'date', required: true },
          { name: 'grade', label: 'Grade', type: 'text', required: true }
        ]
      }
    ]
  };

  const fieldTypes = [
    { value: 'text', label: 'Text', icon: '📝' },
    { value: 'number', label: 'Number', icon: '🔢' },
    { value: 'email', label: 'Email', icon: '📧' },
    { value: 'phone', label: 'Phone', icon: '📞' },
    { value: 'date', label: 'Date', icon: '📅' },
    { value: 'boolean', label: 'Yes/No', icon: '✅' },
    { value: 'select', label: 'Dropdown', icon: '📋' },
    { value: 'file', label: 'File Upload', icon: '📎' }
  ];

  const currentTemplates = registryTemplates[state.profile.type as keyof typeof registryTemplates] || [];

  const addRegistry = (template: any) => {
    const newRegistry: RegistrySetup = {
      id: `registry-${Date.now()}`,
      name: template.name,
      description: template.description,
      fields: template.fields.map((field: any, index: number) => ({
        id: `field-${Date.now()}-${index}`,
        name: field.name,
        label: field.label,
        type: field.type,
        required: field.required,
        options: field.options,
        order: index + 1
      })),
      isPublic: template.isPublic,
      searchable: template.searchable
    };

    dispatch({ type: 'UPDATE_REGISTRIES', payload: [...state.registries, newRegistry] });
  };

  const removeRegistry = (registryId: string) => {
    dispatch({ 
      type: 'UPDATE_REGISTRIES', 
      payload: state.registries.filter(r => r.id !== registryId) 
    });
  };

  const handleNext = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: 'registry' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 7 });
  };

  const handlePrevious = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 5 });
  };

  const selectedRegistryData = selectedRegistry 
    ? state.registries.find(r => r.id === selectedRegistry)
    : null;

  return (
    <OnboardingLayout
      title="Registry Schema Builder"
      description="Create data registries to store and manage your institution's records"
      onNext={handleNext}
      onPrevious={handlePrevious}
      showSkip={true}
      onSkip={handleNext}
    >
      <div className="space-y-8">
        {/* Registry Templates */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Recommended Registries for {state.profile.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTemplates.map((template, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Database className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{template.name}</h5>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant={template.isPublic ? 'success' : 'default'} size="sm">
                          {template.isPublic ? 'Public' : 'Private'}
                        </Badge>
                        <Badge variant={template.searchable ? 'info' : 'default'} size="sm">
                          {template.searchable ? 'Searchable' : 'Internal'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addRegistry(template)}
                    disabled={state.registries.some(r => r.name === template.name)}
                  >
                    {state.registries.some(r => r.name === template.name) ? 'Added' : 'Add'}
                  </Button>
                </div>
                
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div>
                  <h6 className="text-sm font-medium text-gray-700 mb-2">
                    Fields ({template.fields.length})
                  </h6>
                  <div className="space-y-1">
                    {template.fields.slice(0, 3).map((field: any, i: number) => (
                      <div key={i} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">{field.label}</span>
                        <Badge variant="default" size="sm">{field.type}</Badge>
                      </div>
                    ))}
                    {template.fields.length > 3 && (
                      <p className="text-xs text-gray-500">+{template.fields.length - 3} more fields</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configured Registries */}
        {state.registries.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Configured Registries ({state.registries.length})
              </h4>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Registry
              </Button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Registry List */}
              <div className="lg:col-span-1">
                <div className="space-y-3">
                  {state.registries.map((registry) => (
                    <div
                      key={registry.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedRegistry === registry.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRegistry(registry.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-semibold text-gray-900">{registry.name}</h5>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRegistry(registry.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{registry.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{registry.fields.length} fields</span>
                        <div className="flex space-x-1">
                          <Badge variant={registry.isPublic ? 'success' : 'default'} size="sm">
                            {registry.isPublic ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Registry Details */}
              <div className="lg:col-span-2">
                {selectedRegistryData ? (
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h5 className="text-lg font-semibold text-gray-900">{selectedRegistryData.name}</h5>
                        <p className="text-gray-600">{selectedRegistryData.description}</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h6 className="font-semibold text-gray-900">Registry Fields</h6>
                      {selectedRegistryData.fields
                        .sort((a, b) => a.order - b.order)
                        .map((field) => (
                          <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-white rounded border flex items-center justify-center">
                                <span className="text-xs">
                                  {fieldTypes.find(t => t.value === field.type)?.icon || '📝'}
                                </span>
                              </div>
                              <div>
                                <span className="font-medium text-gray-900">{field.label}</span>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="default" size="sm">{field.type}</Badge>
                                  {field.required && (
                                    <Badge variant="error" size="sm">Required</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h6 className="font-semibold text-blue-900 mb-2">Registry Settings</h6>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-blue-700">Visibility:</span>
                          <Badge variant={selectedRegistryData.isPublic ? 'success' : 'default'} size="sm" className="ml-2">
                            {selectedRegistryData.isPublic ? 'Public' : 'Private'}
                          </Badge>
                        </div>
                        <div>
                          <span className="text-blue-700">Searchable:</span>
                          <Badge variant={selectedRegistryData.searchable ? 'info' : 'default'} size="sm" className="ml-2">
                            {selectedRegistryData.searchable ? 'Yes' : 'No'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border border-gray-200 rounded-lg p-12 text-center">
                    <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h5 className="text-lg font-medium text-gray-900 mb-2">Select a Registry</h5>
                    <p className="text-gray-600">Choose a registry from the list to view and edit its schema.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Custom Registry Builder */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Registry</h4>
          <p className="text-gray-600 mb-4">
            Need a registry with specific fields? Use our visual schema builder to create custom data structures.
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Open Schema Builder
          </Button>
        </div>

        {/* Registry Management Note */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h5 className="font-semibold text-green-900 mb-2">Registry Management</h5>
          <p className="text-green-700 text-sm">
            Registries can be modified and extended later using the full schema builder. 
            You can add fields, change validation rules, and configure access permissions.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}