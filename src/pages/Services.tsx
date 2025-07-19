import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  Workflow,
  Plus,
  Edit,
  Settings,
  Clock,
  DollarSign,
  FileText,
  Users,
  Play,
  Pause,
  Eye,
  ArrowRight,
  CheckCircle,
  X
} from 'lucide-react';
import { 
  getInstitutionServices,
  getInstitutionRequests,
  getServiceById
} from '../utils/masterData';

export function Services() {
  const { state } = useAuth();
  const { user } = state;
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [showWorkflowEditor, setShowWorkflowEditor] = useState(false);
  const [showCreateServiceModal, setShowCreateServiceModal] = useState(false);

  const institutionServices = user?.institutionId ? getInstitutionServices(user.institutionId) : [];
  const institutionRequests = user?.institutionId ? getInstitutionRequests(user.institutionId) : [];

  const selectedServiceData = selectedService 
    ? institutionServices.find(s => s.id === selectedService)
    : null;

  const getServiceStats = (serviceId: string) => {
    const serviceRequests = institutionRequests.filter(r => r.service_id === serviceId);
    return {
      totalRequests: serviceRequests.length,
      completedRequests: serviceRequests.filter(r => r.status === 'Completed').length,
      pendingRequests: serviceRequests.filter(r => ['Under Review', 'Pending Approval', 'Submitted'].includes(r.status)).length,
      successRate: serviceRequests.length > 0 
        ? Math.round((serviceRequests.filter(r => r.status === 'Completed').length / serviceRequests.length) * 100)
        : 0
    };
  };

  // Mock workflow stages
  const mockWorkflowStages = [
    {
      id: 'stage-1',
      name: 'Application Submitted',
      description: 'Initial application submission',
      type: 'start',
      assignedRoles: ['Processor'],
      requiredActions: ['verify_documents'],
      slaHours: 24,
      order: 1
    },
    {
      id: 'stage-2',
      name: 'Initial Review',
      description: 'Document verification and completeness check',
      type: 'review',
      assignedRoles: ['Processor'],
      requiredActions: ['check_documents', 'verify_identity'],
      slaHours: 48,
      order: 2
    },
    {
      id: 'stage-3',
      name: 'Background Verification',
      description: 'Comprehensive background check',
      type: 'verification',
      assignedRoles: ['Reviewer'],
      requiredActions: ['background_check', 'database_search'],
      slaHours: 72,
      order: 3
    },
    {
      id: 'stage-4',
      name: 'Final Approval',
      description: 'Senior officer approval',
      type: 'approval',
      assignedRoles: ['Senior Reviewer'],
      requiredActions: ['approve_or_reject'],
      slaHours: 24,
      order: 4
    },
    {
      id: 'stage-5',
      name: 'Certificate Issued',
      description: 'Generate and issue certificate',
      type: 'completion',
      assignedRoles: ['Processor'],
      requiredActions: ['generate_certificate'],
      slaHours: 12,
      order: 5
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services & Workflows</h1>
          <p className="text-gray-600">Configure services and their processing workflows</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowWorkflowEditor(true)}>
            <Workflow className="h-4 w-4 mr-2" />
            Workflow Builder
          </Button>
          <Button onClick={() => setShowCreateServiceModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Service
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Services List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Services</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {institutionServices.map((service) => {
                  const stats = getServiceStats(service.id);
                  
                  return (
                    <div
                      key={service.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedService === service.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedService(service.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{service.name}</h4>
                        <Badge variant="success" size="sm">Active</Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">
                          GHS {service.fee}
                        </span>
                        <span className="text-xs text-gray-500">{stats.totalRequests} requests</span>
                      </div>
                    </div>
                  );
                })}
                
                {institutionServices.length === 0 && (
                  <div className="text-center py-8">
                    <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No services configured yet</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowCreateServiceModal(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Create First Service
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Details */}
        <div className="lg:col-span-2">
          {selectedServiceData ? (
            <div className="space-y-6">
              {/* Service Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedServiceData.name}</CardTitle>
                      <p className="text-gray-600">{selectedServiceData.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900">
                        GHS {selectedServiceData.fee}
                      </p>
                      <p className="text-xs text-gray-600">Service Fee</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">{selectedServiceData.processingTime}</p>
                      <p className="text-xs text-gray-600">Processing Time</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <FileText className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900">{selectedServiceData.requiredDocuments.length}</p>
                      <p className="text-xs text-gray-600">Required Docs</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Badge variant="success">Active</Badge>
                      <p className="text-xs text-gray-600 mt-1">Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Required Documents */}
              <Card>
                <CardHeader>
                  <CardTitle>Required Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedServiceData.requiredDocuments.map((doc, index) => (
                      <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900">{doc}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Workflow Stages */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Processing Workflow</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowWorkflowEditor(true)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Workflow
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockWorkflowStages.map((stage, index) => (
                      <div key={stage.id} className="relative">
                        {index < mockWorkflowStages.length - 1 && (
                          <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-300"></div>
                        )}
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-semibold">{index + 1}</span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium text-gray-900">{stage.name}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant="default" size="sm">
                                  {stage.slaHours}h SLA
                                </Badge>
                                <Badge variant="info" size="sm">
                                  {stage.type}
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{stage.description}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <div className="flex items-center text-xs text-gray-500">
                                <Users className="h-3 w-3 mr-1" />
                                {stage.assignedRoles.join(', ')}
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <FileText className="h-3 w-3 mr-1" />
                                {stage.requiredActions.length} actions
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Workflow className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Service</h3>
                <p className="text-gray-600">Choose a service from the list to view its configuration and workflow.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Service Modal */}
      {showCreateServiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCreateServiceModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create New Service</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateServiceModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Service Fee (GHS)</label>
                  <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Processing Time</label>
                  <input type="text" placeholder="e.g., 5-7 business days" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Required Documents</label>
                <textarea rows={3} placeholder="List required documents, one per line" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateServiceModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  alert('Service created successfully!');
                  setShowCreateServiceModal(false);
                }}>
                  Create Service
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Workflow Editor Modal */}
      {showWorkflowEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowWorkflowEditor(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Workflow Editor</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowWorkflowEditor(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8 min-h-96">
              <div className="flex items-center justify-center space-x-8">
                {mockWorkflowStages.map((stage, index) => (
                  <div key={stage.id} className="flex items-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-2">
                        <CheckCircle className="h-8 w-8 text-blue-600" />
                      </div>
                      <p className="text-sm font-medium text-gray-900">{stage.name}</p>
                      <p className="text-xs text-gray-500">{stage.slaHours}h</p>
                    </div>
                    {index < mockWorkflowStages.length - 1 && (
                      <ArrowRight className="h-6 w-6 text-gray-400 mx-4" />
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-600 mb-4">Visual workflow editor for designing service processing steps</p>
                <div className="flex justify-center space-x-3">
                  <Button variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Stage
                  </Button>
                  <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Stage
                  </Button>
                  <Button onClick={() => {
                    alert('Workflow saved successfully!');
                    setShowWorkflowEditor(false);
                  }}>
                    Save Workflow
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}