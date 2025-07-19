import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
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
  MessageSquare,
  FileCheck,
  X,
  Mail,
  Phone
} from 'lucide-react';
import { 
  getInstitutionRequests,
  getServiceById,
  masterRequests,
  MasterRequest
} from '../utils/masterData';

export function Requests() {
  const { state } = useAuth();
  const { user } = state;
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [revisionMessage, setRevisionMessage] = useState('');

  const institutionRequests = user?.institutionId ? getInstitutionRequests(user.institutionId) : [];

  const filteredRequests = institutionRequests.filter(request => {
    const statusMatch = statusFilter === 'all' || request.status === statusFilter;
    const serviceMatch = serviceFilter === 'all' || request.service_id === serviceFilter;
    return statusMatch && serviceMatch;
  });

  const selectedRequestData = selectedRequest 
    ? institutionRequests.find(r => r.id === selectedRequest)
    : null;

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

  const handleApprove = (requestId: string) => {
    alert(`Request ${requestId} has been approved and marked as completed.`);
  };

  const handleReject = () => {
    if (selectedRequest && rejectionReason.trim()) {
      alert(`Request ${selectedRequest} has been rejected. Reason: ${rejectionReason}`);
      setShowRejectModal(false);
      setRejectionReason('');
    }
  };

  const handleRequestRevision = () => {
    if (selectedRequest && revisionMessage.trim()) {
      alert(`Revision requested for ${selectedRequest}. Message sent to requester.`);
      setShowRevisionModal(false);
      setRevisionMessage('');
    }
  };

  const handleGenerateDocument = (requestId: string) => {
    alert(`PDF certificate generated for request ${requestId} using the associated document template.`);
  };

  const uniqueServices = [...new Set(institutionRequests.map(r => r.service_id))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Request Processing</h1>
          <p className="text-gray-600">Manage and process service requests for your institution</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Search className="h-4 w-4 mr-2" />
            Advanced Search
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
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
                      ({status === 'all' ? institutionRequests.length : institutionRequests.filter(r => r.status === status).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Service Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Service:</span>
              <select 
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Services</option>
                {uniqueServices.map(serviceId => {
                  const service = getServiceById(serviceId);
                  return (
                    <option key={serviceId} value={serviceId}>
                      {service?.name || serviceId}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests Queue */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Requests Queue ({filteredRequests.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredRequests.map((request) => {
                  const service = getServiceById(request.service_id);
                  
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
                      
                      <p className="text-sm font-medium text-gray-900">{request.applicant}</p>
                      <p className="text-xs text-gray-600">{service?.name}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(request.submittedDate).toLocaleDateString()}
                        </span>
                        {request.risk && (
                          <Badge variant={request.risk === 'Overdue' ? 'error' : request.risk === 'At Risk' ? 'warning' : 'success'} size="sm">
                            {request.risk}
                          </Badge>
                        )}
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
          {selectedRequestData ? (
            <div className="space-y-6">
              {/* Request Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Request {selectedRequestData.requestId}</CardTitle>
                      <p className="text-gray-600">
                        {getServiceById(selectedRequestData.service_id)?.name}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      {getStatusIcon(selectedRequestData.status)}
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {selectedRequestData.status}
                      </p>
                      <p className="text-xs text-gray-600">Status</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Calendar className="h-5 w-5 text-blue-600 mx-auto" />
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {new Date(selectedRequestData.submittedDate).toLocaleDateString()}
                      </p>
                      <p className="text-xs text-gray-600">Submitted</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <DollarSign className="h-5 w-5 text-green-600 mx-auto" />
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        GHS {selectedRequestData.paymentAmount}
                      </p>
                      <p className="text-xs text-gray-600">Fee</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Badge variant={selectedRequestData.paymentStatus === 'Paid' ? 'success' : 'warning'}>
                        {selectedRequestData.paymentStatus}
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
                      <p className="text-gray-900">{selectedRequestData.requesterInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <p className="text-gray-900">{selectedRequestData.requesterInfo.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone</label>
                      <p className="text-gray-900">{selectedRequestData.requesterInfo.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">ID Number</label>
                      <p className="text-gray-900">{selectedRequestData.requesterInfo.idNumber}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {selectedRequestData.status !== 'Completed' && selectedRequestData.status !== 'Rejected' && (
                      <>
                        <Button 
                          variant="default"
                          onClick={() => handleApprove(selectedRequestData.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowRejectModal(true)}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button 
                          variant="outline"
                          onClick={() => setShowRevisionModal(true)}
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Request Revision
                        </Button>
                      </>
                    )}
                    {selectedRequestData.status === 'Completed' && (
                      <Button 
                        variant="default"
                        onClick={() => handleGenerateDocument(selectedRequestData.id)}
                      >
                        <FileCheck className="h-4 w-4 mr-2" />
                        Generate Document
                      </Button>
                    )}
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
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Request</h3>
                <p className="text-gray-600">Choose a request from the queue to view details and process it.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowRejectModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject Request</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowRejectModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Please provide a reason for rejection..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                  Cancel
                </Button>
                <Button variant="error" onClick={handleReject}>
                  Reject Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowRevisionModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Request Revision</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowRevisionModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message to Requester</label>
                <textarea
                  value={revisionMessage}
                  onChange={(e) => setRevisionMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Please describe what needs to be revised..."
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button variant="outline" onClick={() => setShowRevisionModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleRequestRevision}>
                  Send Revision Request
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}