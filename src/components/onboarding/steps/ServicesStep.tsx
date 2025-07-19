import React, { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Plus, Edit, Trash2, Shield, Scale, GraduationCap, FileText, Award, Clock, DollarSign } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ServiceSetup } from '../../../types/onboarding';

export function ServicesStep() {
  const { state, dispatch } = useOnboarding();
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceSetup | null>(null);

  const serviceTemplates = {
    police: [
      {
        name: 'Police Clearance Certificate',
        description: 'Official certificate confirming criminal record status',
        category: 'Security Clearance',
        requiredDocuments: ['Ghana Card', 'Passport Photo', 'Application Form'],
        fee: 50,
        processingTime: '5-7 business days',
        icon: Shield
      },
      {
        name: 'Incident Report Request',
        description: 'Official police incident reports for insurance purposes',
        category: 'Reports',
        requiredDocuments: ['Ghana Card', 'Incident Details'],
        fee: 25,
        processingTime: '3-5 business days',
        icon: FileText
      }
    ],
    court: [
      {
        name: 'Court Case History',
        description: 'Official court case records and judgment history',
        category: 'Legal Records',
        requiredDocuments: ['Ghana Card', 'Case Reference', 'Legal Standing Proof'],
        fee: 75,
        processingTime: '7-10 business days',
        icon: Scale
      },
      {
        name: 'Legal Standing Certificate',
        description: 'Certificate confirming legal standing and court case status',
        category: 'Certificates',
        requiredDocuments: ['Ghana Card', 'Legal Documents'],
        fee: 60,
        processingTime: '5-7 business days',
        icon: Award
      }
    ],
    education: [
      {
        name: 'Academic Certificate Verification',
        description: 'Official verification of educational certificates',
        category: 'Verification',
        requiredDocuments: ['Original Certificate', 'Transcript', 'Ghana Card'],
        fee: 100,
        processingTime: '10-14 business days',
        icon: GraduationCap
      },
      {
        name: 'Official Transcript Request',
        description: 'Request for official academic transcripts',
        category: 'Documents',
        requiredDocuments: ['Student ID', 'Ghana Card', 'Institution Letter'],
        fee: 50,
        processingTime: '7-10 business days',
        icon: FileText
      }
    ]
  };

  const currentTemplates = serviceTemplates[state.profile.type as keyof typeof serviceTemplates] || [];

  const addService = (template: any) => {
    const newService: ServiceSetup = {
      id: `service-${Date.now()}`,
      name: template.name,
      description: template.description,
      category: template.category,
      requiredDocuments: template.requiredDocuments,
      fee: template.fee,
      currency: 'GHS',
      processingTime: template.processingTime,
      isPublic: true,
      enabled: true
    };

    dispatch({ type: 'UPDATE_SERVICES', payload: [...state.services, newService] });
  };

  const removeService = (serviceId: string) => {
    dispatch({ 
      type: 'UPDATE_SERVICES', 
      payload: state.services.filter(s => s.id !== serviceId) 
    });
  };

  const handleNext = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: 'services' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 3 });
  };

  const handlePrevious = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 1 });
  };

  return (
    <OnboardingLayout
      title="Services Setup"
      description="Configure the services your institution will offer to citizens and businesses"
      onNext={handleNext}
      onPrevious={handlePrevious}
      showSkip={true}
      onSkip={handleNext}
    >
      <div className="space-y-8">
        {/* Service Templates */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Recommended Services for {state.profile.name}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentTemplates.map((template, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <template.icon className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{template.name}</h5>
                      <Badge variant="default" size="sm">{template.category}</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addService(template)}
                    disabled={state.services.some(s => s.name === template.name)}
                  >
                    {state.services.some(s => s.name === template.name) ? 'Added' : 'Add'}
                  </Button>
                </div>
                
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Processing Time:</span>
                    <span className="font-medium">{template.processingTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Fee:</span>
                    <span className="font-medium">GHS {template.fee}</span>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Required Documents:</span>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {template.requiredDocuments.map((doc, i) => (
                        <Badge key={i} variant="default" size="sm">{doc}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Added Services */}
        {state.services.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Configured Services ({state.services.length})
              </h4>
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Service
              </Button>
            </div>
            
            <div className="space-y-4">
              {state.services.map((service) => (
                <div key={service.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{service.name}</h5>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="success" size="sm">Configured</Badge>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeService(service.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{service.processingTime}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span>{service.currency} {service.fee}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>{service.requiredDocuments.length} documents</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Custom Service Creation */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Plus className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">Create Custom Service</h4>
          <p className="text-gray-600 mb-4">
            Need a service that's not in our templates? Create a custom service tailored to your institution's needs.
          </p>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Create Custom Service
          </Button>
        </div>

        {/* Service Configuration Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h5 className="font-semibold text-blue-900 mb-2">Service Configuration</h5>
          <p className="text-blue-700 text-sm">
            You can modify service details, workflows, and requirements later in the main dashboard. 
            This setup creates the basic structure for your services.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}