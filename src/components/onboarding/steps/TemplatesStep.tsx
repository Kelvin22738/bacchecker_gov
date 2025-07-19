import React, { useState } from 'react';
import { OnboardingLayout } from '../OnboardingLayout';
import { useOnboarding } from '../../../context/OnboardingContext';
import { Upload, FileText, Eye, Settings, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { TemplateSetup } from '../../../types/onboarding';

export function TemplatesStep() {
  const { state, dispatch } = useOnboarding();
  const [dragOver, setDragOver] = useState(false);

  const templateCategories = [
    'Certificates',
    'Reports',
    'Legal Documents',
    'Academic Documents',
    'Official Letters',
    'Verification Forms'
  ];

  const defaultTemplates = [
    {
      name: 'Police Clearance Certificate',
      description: 'Standard police clearance certificate with digital signature',
      category: 'Certificates',
      signatureMode: 'digital' as const,
      sealRequired: true
    },
    {
      name: 'Court Case Summary',
      description: 'Official court case summary document',
      category: 'Legal Documents',
      signatureMode: 'digital' as const,
      sealRequired: true
    },
    {
      name: 'Academic Verification Letter',
      description: 'Official academic credential verification',
      category: 'Academic Documents',
      signatureMode: 'electronic' as const,
      sealRequired: false
    }
  ];

  const addDefaultTemplate = (template: any) => {
    const newTemplate: TemplateSetup = {
      id: `template-${Date.now()}`,
      name: template.name,
      description: template.description,
      category: template.category,
      fields: [
        {
          id: 'field-name',
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          position: { x: 100, y: 150 },
          size: { width: 300, height: 30 },
          required: true
        },
        {
          id: 'field-date',
          name: 'issueDate',
          label: 'Issue Date',
          type: 'date',
          position: { x: 100, y: 200 },
          size: { width: 150, height: 30 },
          required: true
        },
        {
          id: 'field-signature',
          name: 'signature',
          label: 'Official Signature',
          type: 'signature',
          position: { x: 400, y: 350 },
          size: { width: 150, height: 60 },
          required: true
        }
      ],
      signatureMode: template.signatureMode,
      sealRequired: template.sealRequired
    };

    dispatch({ type: 'UPDATE_TEMPLATES', payload: [...state.templates, newTemplate] });
  };

  const removeTemplate = (templateId: string) => {
    dispatch({ 
      type: 'UPDATE_TEMPLATES', 
      payload: state.templates.filter(t => t.id !== templateId) 
    });
  };

  const handleNext = () => {
    dispatch({ type: 'COMPLETE_STEP', payload: 'templates' });
    dispatch({ type: 'SET_CURRENT_STEP', payload: 4 });
  };

  const handlePrevious = () => {
    dispatch({ type: 'SET_CURRENT_STEP', payload: 2 });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    // Handle file drop logic here
  };

  return (
    <OnboardingLayout
      title="Document Templates"
      description="Upload and configure document templates for your services"
      onNext={handleNext}
      onPrevious={handlePrevious}
      showSkip={true}
      onSkip={handleNext}
    >
      <div className="space-y-8">
        {/* Template Upload Area */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Upload Templates</h4>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h5 className="text-lg font-semibold text-gray-900 mb-2">
              Drag and drop your templates here
            </h5>
            <p className="text-gray-600 mb-4">
              Support for Word (.docx), PDF (.pdf), and HTML templates
            </p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Maximum file size: 10MB per template
            </p>
          </div>
        </div>

        {/* Default Templates */}
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Recommended Templates
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultTemplates.map((template, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-gray-900">{template.name}</h5>
                      <Badge variant="default" size="sm">{template.category}</Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addDefaultTemplate(template)}
                    disabled={state.templates.some(t => t.name === template.name)}
                  >
                    {state.templates.some(t => t.name === template.name) ? 'Added' : 'Add'}
                  </Button>
                </div>
                
                <p className="text-gray-600 mb-4">{template.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Signature Mode:</span>
                    <Badge variant="info" size="sm">{template.signatureMode}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500">Seal Required:</span>
                    <Badge variant={template.sealRequired ? 'success' : 'default'} size="sm">
                      {template.sealRequired ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configured Templates */}
        {state.templates.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-gray-900">
                Configured Templates ({state.templates.length})
              </h4>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Template Builder
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {state.templates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-4 bg-green-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">{template.name}</h5>
                        <Badge variant="success" size="sm">Configured</Badge>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => removeTemplate(template.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{template.fields.length} fields configured</span>
                    <Badge variant="info" size="sm">{template.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Template Configuration Note */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h5 className="font-semibold text-yellow-900 mb-2">Template Configuration</h5>
          <p className="text-yellow-700 text-sm">
            Templates can be fully customized later using our visual template builder. 
            You can add merge fields, configure layouts, and set up digital signatures.
          </p>
        </div>
      </div>
    </OnboardingLayout>
  );
}