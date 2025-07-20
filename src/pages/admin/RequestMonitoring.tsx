import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Clock,
  User,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Building2,
  Shield,
  Scale,
  GraduationCap,
  Send,
  MoreHorizontal,
  X,
  Mail,
  Phone
} from 'lucide-react';
import { 
  masterInstitutions, 
  masterRequests, 
  masterServices, 
  getInstitutionById,
  getServiceById,
  MasterRequest
} from '../../utils/masterData';

export function RequestMonitoring() {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [institutionFilter, setInstitutionFilter] = useState<string>('all');
  const [showSendRequestModal, setShowSendRequestModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showRequestDetails, setShowRequestDetails] = useState(false);
  const [selectedRequestData, setSelectedRequestData] = useState<MasterRequest | null>(null);

  // Load public requests from localStorage
  React.useEffect(() => {
    const publicRequests = localStorage.getItem('public_verification_requests');
    if (publicRequests) {
      try {
        const parsed = JSON.parse(publicRequests);
        // Convert public requests to master request format and add to existing requests
        const convertedRequests = parsed.map((req: any) => ({
          id: req.id,
          requestId: req.requestNumber,
          applicant: req.applicantName,
          institution_id: getInstitutionId(req.targetInstitution),
          service_id: getServiceId(req.verificationType),
          submittedDate: req.submittedAt,
          status: convertStatus(req.status),
          risk: req.currentPhase < 2 ? 'On Time' : req.currentPhase < 4 ? 'At Risk' : null,
          priority: 'Normal',
          paymentStatus: 'Paid',
          paymentAmount: getServiceFee(req.verificationType),
          requesterInfo: {
            name: req.applicantName,
            email: req.applicantEmail,
            phone: req.applicantPhone,
            address: 'Public Portal',
            idNumber: req.idNumber
          },
          processingHistory: [
            {
              id: `hist-${req.id}`,
              stage: 'Public Submission',
              action: 'Request submitted via public portal',
              performedBy: 'Public Portal System',
              performedAt: req.submittedAt,
              comments: `Purpose: ${req.purpose}`,
              duration: 0
            }
          ]
        }));
        
        // Add to existing master requests
        masterRequests.push(...convertedRequests);
      } catch (error) {
        console.error('Error loading public requests:', error);
      }
    }
  }, []);

  const getInstitutionId = (institutionName: string) => {
    const mapping: { [key: string]: string } = {
      'University of Ghana': 'ug',
      'KNUST': 'knust',
      'University of Cape Coast': 'ucc',
      'Ghana Police Service': 'gps',
      'High Court of Ghana': 'hcg',
      'Ministry of Education': 'moe'
    };
    return mapping[institutionName] || 'unknown';
  };

  const getServiceId = (verificationType: string) => {
    const mapping: { [key: string]: string } = {
      'academic_certificate': 'ug_transcript',
      'police_clearance': 'gps_clearance',
      'court_records': 'hcg_records',
      'transcript_request': 'ug_transcript'
    };
    return mapping[verificationType] || 'unknown_service';
  };

  const convertStatus = (publicStatus: string) => {
    const mapping: { [key: string]: string } = {
      'submitted': 'Submitted',
      'processing': 'Under Review',
      'institution_verified': 'Pending Approval',
      'completed': 'Completed',
      'rejected': 'Rejected'
    };
    return mapping[publicStatus] || 'Submitted';
  };

  const getServiceFee = (verificationType: string) => {
    const fees: { [key: string]: number } = {
      'academic_certificate': 100,
      'police_clearance': 50,
      'court_records': 75,
      'transcript_request': 60
    };
    return fees[verificationType] || 50;
  };

  const filteredRequests = masterRequests.filter(request => {
    const statusMatch = statusFilter === 'all' || request.status === statusFilter;
    const institutionMatch = institutionFilter === 'all' || request.institution_id === institutionFilter;
    return statusMatch && institutionMatch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'Under Review':
        return <Badge variant="info">Under Review</Badge>;
      case 'Pending Approval':
        return <Badge variant="warning">Pending Approval</Badge>;
      case 'Rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'Submitted':
        return <Badge variant="default">Submitted</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'Under Review':
      case 'Pending Approval':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSLABadge = (risk: string | null) => {
    if (!risk) return null;
    switch (risk) {
      case 'On Time':
        return <Badge variant="success" size="sm">On Time</Badge>;
      case 'At Risk':
        return <Badge variant="warning" size="sm">At Risk</Badge>;
      case 'Overdue':
        return <Badge variant="error" size="sm">Overdue</Badge>;
      default:
        return <Badge variant="default" size="sm">{risk}</Badge>;
    }
  };

  const getInstitutionIcon = (institutionId: string) => {
    switch (institutionId) {
      case 'gps':
        return Shield;
      case 'hcg':
        return Scale;
      case 'moe':
        return GraduationCap;
      default:
        return Building2;
    }
  };

  const getInstitutionName = (institutionId: string) => {
    const institution = getInstitutionById(institutionId);
    return institution?.acronym || 'Unknown';
  };

  const handleViewDetails = (request: MasterRequest) => {
    setSelectedRequestData(request);
    setShowRequestDetails(true);
  };

  const handleExportData = () => {
    const csvContent = [
      ['Request ID', 'Applicant', 'Institution', 'Service', 'Status', 'Submitted Date'],
      ...filteredRequests.map(request => [
        request.requestId,
        request.applicant,
        getInstitutionName(request.institution_id),
        getServiceById(request.service_id)?.name || 'Unknown',
        request.status,
        new Date(request.submittedDate).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'requests_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request Monitoring</h1>
          <p className="text-gray-600">Monitor and manage requests across all institutions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowAdvancedSearch(true)}>
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button onClick={() => setShowSendRequestModal(true)}>
            <Send className="h-4 w-4 mr-2" />
            Send Test Request
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex space-x-1">
                {['all', 'Submitted', 'Under Review', 'Pending Approval', 'Completed', 'Rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      statusFilter === status
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {status === 'all' ? 'All' : status}
                    <span className="ml-1 text-xs">
                      ({status === 'all' ? masterRequests.length : masterRequests.filter(r => r.status === status).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Institution Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Institution:</span>
              <div className="flex space-x-1">
                <button
                  onClick={() => setInstitutionFilter('all')}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    institutionFilter === 'all'
                      ? 'bg-red-100 text-red-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All ({masterRequests.length})
                </button>
                {masterInstitutions.map((institution) => (
                  <button
                    key={institution.id}
                    onClick={() => setInstitutionFilter(institution.id)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      institutionFilter === institution.id
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {institution.acronym} ({masterRequests.filter(r => r.institution_id === institution.id).length})
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Requests Queue ({filteredRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredRequests.map((request) => {
                  const service = getServiceById(request.service_id);
                  const IconComponent = getInstitutionIcon(request.institution_id);
                  
                  return (
                    <div
                      key={request.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedRequest === request.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRequest(request.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(request.status)}
                          <span className="font-medium text-gray-900">{request.requestId}</span>
                        </div>
                        {getStatusBadge(request.status)}
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-2">
                        <IconComponent className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {getInstitutionName(request.institution_id)}
                        </span>
                      </div>
                      
                      <p className="text-sm font-medium text-gray-900">{request.applicant}</p>
                      <p className="text-xs text-gray-600">{service?.name}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(request.submittedDate).toLocaleDateString()}
                        </span>
                        {getSLABadge(request.risk)}
                      </div>
                    </div>
                  );
                })}
                
                {filteredRequests.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No requests found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Details */}
        <div className="lg:col-span-2">
          {selectedRequest ? (
            (() => {
              const requestData = masterRequests.find(r => r.id === selectedRequest);
              if (!requestData) return null;

              const service = getServiceById(requestData.service_id);
              const institution = getInstitutionById(requestData.institution_id);

              return (
                <div className="space-y-6">
                  {/* Request Header */}
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle>Request {requestData.requestId}</CardTitle>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-gray-600">{service?.name}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">{institution?.name}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(requestData)}>
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          {getStatusIcon(requestData.status)}
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {requestData.status}
                          </p>
                          <p className="text-xs text-gray-600">Status</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <Calendar className="h-5 w-5 text-blue-600 mx-auto" />
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            {new Date(requestData.submittedDate).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">Submitted</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <DollarSign className="h-5 w-5 text-green-600 mx-auto" />
                          <p className="text-sm font-medium text-gray-900 mt-1">
                            GHS {requestData.paymentAmount}
                          </p>
                          <p className="text-xs text-gray-600">Fee</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <Badge variant={requestData.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                            {requestData.paymentStatus}
                          </Badge>
                          <p className="text-xs text-gray-600 mt-1">Payment</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Requester Information */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Requester Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Full Name</label>
                          <p className="text-gray-900">{requestData.requesterInfo.name}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Email</label>
                          <p className="text-gray-900">{requestData.requesterInfo.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">Phone</label>
                          <p className="text-gray-900">{requestData.requesterInfo.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-700">ID Number</label>
                          <p className="text-gray-900">{requestData.requesterInfo.idNumber}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Processing History */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Processing History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {requestData.processingHistory.map((history, index) => (
                          <div key={history.id} className="relative">
                            {index < requestData.processingHistory.length - 1 && (
                              <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-300"></div>
                            )}
                            <div className="flex items-start space-x-3">
                              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="h-4 w-4 text-blue-600" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900">{history.action}</p>
                                <p className="text-sm text-gray-600">Stage: {history.stage}</p>
                                {history.comments && (
                                  <p className="text-sm text-gray-600 mt-1">{history.comments}</p>
                                )}
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(history.performedAt).toLocaleString()} • {history.performedBy}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Request</h3>
                <p className="text-gray-600">Choose a request from the queue to view details and monitor progress.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Send Test Request Modal */}
      {showSendRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowSendRequestModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Send Test Request</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowSendRequestModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Select Institution</option>
                  {masterInstitutions.map(institution => (
                    <option key={institution.id} value={institution.id}>{institution.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Select Service</option>
                  {masterServices.map(service => (
                    <option key={service.id} value={service.id}>{service.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
                <input type="text" defaultValue="Test User" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Email</label>
                <input type="email" defaultValue="test@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowSendRequestModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  alert('Test request sent successfully!');
                  setShowSendRequestModal(false);
                }}>
                  Send Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advanced Search Modal */}
      {showAdvancedSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAdvancedSearch(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Advanced Search</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAdvancedSearch(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Request ID</label>
                <input type="text" placeholder="e.g., #gps-45" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Applicant Name</label>
                <input type="text" placeholder="Enter applicant name" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                  <input type="date" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowAdvancedSearch(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  alert('Search functionality would filter results based on criteria');
                  setShowAdvancedSearch(false);
                }}>
                  Search
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Details Modal */}
      {showRequestDetails && selectedRequestData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowRequestDetails(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Request Details - {selectedRequestData.requestId}</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowRequestDetails(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Request Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Request Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Request ID:</span>
                      <span className="font-medium">{selectedRequestData.requestId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service:</span>
                      <span className="font-medium">{getServiceById(selectedRequestData.service_id)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Institution:</span>
                      <span className="font-medium">{getInstitutionById(selectedRequestData.institution_id)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      {getStatusBadge(selectedRequestData.status)}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Priority:</span>
                      <Badge variant={selectedRequestData.priority === 'Urgent' ? 'error' : selectedRequestData.priority === 'High' ? 'warning' : 'default'}>
                        {selectedRequestData.priority}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Applicant Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequestData.requesterInfo.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequestData.requesterInfo.email}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{selectedRequestData.requesterInfo.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span>ID: {selectedRequestData.requesterInfo.idNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Processing Timeline</h4>
                <div className="space-y-4">
                  {selectedRequestData.processingHistory.map((history, index) => (
                    <div key={history.id} className="relative">
                      {index < selectedRequestData.processingHistory.length - 1 && (
                        <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-300"></div>
                      )}
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">{history.action}</p>
                          <p className="text-sm text-gray-600">Stage: {history.stage}</p>
                          {history.comments && (
                            <p className="text-sm text-gray-600 mt-1 italic">"{history.comments}"</p>
                          )}
                          <div className="flex items-center space-x-4 mt-1">
                            <p className="text-xs text-gray-500">
                              {new Date(history.performedAt).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">By: {history.performedBy}</p>
                            {history.duration && (
                              <p className="text-xs text-gray-500">Duration: {history.duration}h</p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}