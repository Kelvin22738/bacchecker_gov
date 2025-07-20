// src/pages/DocumentVerification.tsx - REPLACE ENTIRE FILE
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  MessageSquare,
  User,
  Calendar,
  Building2,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Send,
  RefreshCw,
  Filter,
  Search,
  X,
  Loader2
} from 'lucide-react';
import { VerificationWorkflowAPI } from '../utils/verificationWorkflowAPI';
import { VerificationRequest, VerificationStatus } from '../types/verification';

export function DocumentVerification() {
  const { state } = useAuth();
  const { user } = state;
  
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [refreshing, setRefreshing] = useState(false);

  const isGTECAdmin = user?.role === 'gtec_admin';
  const isBacCheckerAdmin = user?.role === 'bacchecker_admin';
  const isTertiaryUser = user?.role === 'tertiary_institution_user';

  // Load verification requests based on user role
  const loadRequests = async () => {
    if (refreshing) return; // Prevent multiple simultaneous loads
    
    setLoading(true);
    try {
      let requests: VerificationRequest[] = [];

      if (isGTECAdmin || isBacCheckerAdmin) {
        // GTEC/BacChecker admins see all requests that need their action
        requests = await VerificationWorkflowAPI.getGTECRequests();
      } else if (isTertiaryUser && user?.institutionId) {
        // Institution users see requests forwarded to their institution
        requests = await VerificationWorkflowAPI.getInstitutionRequests(user.institutionId);
      }

      // Apply status filter
      if (filterStatus !== 'all') {
        requests = requests.filter(req => req.overall_status === filterStatus);
      }

      setVerificationRequests(requests);
    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  useEffect(() => {
    loadRequests();
  }, [user, filterStatus]);

  const selectedRequestData = selectedRequest
    ? verificationRequests.find(r => r.id === selectedRequest)
    : null;

  // Handle GTEC approval
  const handleGTECApproval = async () => {
    if (!selectedRequest || !user) return;
    
    setProcessing(true);
    try {
      const updatedRequest = await VerificationWorkflowAPI.gtecApproveRequest(
        selectedRequest,
        user.id,
        approvalComments
      );

      if (updatedRequest) {
        setVerificationRequests(prev => 
          prev.map(req => req.id === selectedRequest ? updatedRequest : req)
        );
        setApprovalComments('');
        setShowApprovalModal(false);
        alert('Request approved and forwarded to institution successfully!');
      } else {
        alert('Error approving request. Please try again.');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle GTEC rejection
  const handleGTECRejection = async () => {
    if (!selectedRequest || !user || !rejectionReason.trim()) return;
    
    setProcessing(true);
    try {
      const updatedRequest = await VerificationWorkflowAPI.gtecRejectRequest(
        selectedRequest,
        user.id,
        rejectionReason
      );

      if (updatedRequest) {
        setVerificationRequests(prev => 
          prev.map(req => req.id === selectedRequest ? updatedRequest : req)
        );
        setRejectionReason('');
        setShowRejectionModal(false);
        alert('Request rejected successfully!');
      } else {
        alert('Error rejecting request. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle Institution approval
  const handleInstitutionApproval = async () => {
    if (!selectedRequest || !user) return;
    
    setProcessing(true);
    try {
      const updatedRequest = await VerificationWorkflowAPI.institutionApproveRequest(
        selectedRequest,
        user.id,
        approvalComments
      );

      if (updatedRequest) {
        setVerificationRequests(prev => 
          prev.map(req => req.id === selectedRequest ? updatedRequest : req)
        );
        setApprovalComments('');
        setShowApprovalModal(false);
        alert('Request approved and sent back to GTEC for final approval!');
      } else {
        alert('Error approving request. Please try again.');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      alert('Error approving request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle Institution rejection
  const handleInstitutionRejection = async () => {
    if (!selectedRequest || !user || !rejectionReason.trim()) return;
    
    setProcessing(true);
    try {
      const updatedRequest = await VerificationWorkflowAPI.institutionRejectRequest(
        selectedRequest,
        user.id,
        rejectionReason
      );

      if (updatedRequest) {
        setVerificationRequests(prev => 
          prev.map(req => req.id === selectedRequest ? updatedRequest : req)
        );
        setRejectionReason('');
        setShowRejectionModal(false);
        alert('Request rejected successfully!');
      } else {
        alert('Error rejecting request. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      alert('Error rejecting request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle final GTEC approval
  const handleFinalApproval = async () => {
    if (!selectedRequest || !user) return;
    
    setProcessing(true);
    try {
      const updatedRequest = await VerificationWorkflowAPI.finalGtecApproval(
        selectedRequest,
        user.id,
        approvalComments
      );

      if (updatedRequest) {
        setVerificationRequests(prev => 
          prev.map(req => req.id === selectedRequest ? updatedRequest : req)
        );
        setApprovalComments('');
        setShowApprovalModal(false);
        alert('Request completed successfully!');
      } else {
        alert('Error completing request. Please try again.');
      }
    } catch (error) {
      console.error('Error completing request:', error);
      alert('Error completing request. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  // Determine available actions based on user role and request status
  const getAvailableActions = (request: VerificationRequest) => {
    const actions = [];

    if (isGTECAdmin || isBacCheckerAdmin) {
      if (request.overall_status === 'submitted') {
        actions.push({ type: 'gtec_approve', label: 'Approve & Forward to Institution' });
        actions.push({ type: 'gtec_reject', label: 'Reject' });
      } else if (request.overall_status === 'institution_approved') {
        actions.push({ type: 'final_approve', label: 'Final Approval' });
        actions.push({ type: 'gtec_reject', label: 'Reject' });
      }
    } else if (isTertiaryUser) {
      if (request.overall_status === 'gtec_approved') {
        actions.push({ type: 'institution_approve', label: 'Approve' });
        actions.push({ type: 'institution_reject', label: 'Reject' });
      }
    }

    return actions;
  };

  const handleAction = (actionType: string) => {
    switch (actionType) {
      case 'gtec_approve':
      case 'institution_approve':
      case 'final_approve':
        setShowApprovalModal(true);
        break;
      case 'gtec_reject':
      case 'institution_reject':
        setShowRejectionModal(true);
        break;
    }
  };

  const executeApproval = () => {
    if (!selectedRequestData) return;

    const status = selectedRequestData.overall_status;
    
    if ((isGTECAdmin || isBacCheckerAdmin) && status === 'submitted') {
      handleGTECApproval();
    } else if ((isGTECAdmin || isBacCheckerAdmin) && status === 'institution_approved') {
      handleFinalApproval();
    } else if (isTertiaryUser && status === 'gtec_approved') {
      handleInstitutionApproval();
    }
  };

  const executeRejection = () => {
    if (!selectedRequestData) return;

    if ((isGTECAdmin || isBacCheckerAdmin)) {
      handleGTECRejection();
    } else if (isTertiaryUser) {
      handleInstitutionRejection();
    }
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading verification requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Verification System</h1>
          <p className="text-gray-600">
            {isGTECAdmin || isBacCheckerAdmin 
              ? 'Review and approve verification requests from institutions' 
              : 'Process verification requests forwarded to your institution'}
          </p>
        </div>
        <div className="flex space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading || refreshing}
          >
            <option value="all">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="gtec_approved">GTEC Approved</option>
            <option value="institution_approved">Institution Approved</option>
            <option value="pending_final_approval">Pending Final Approval</option>
          </select>
          <Button variant="outline" onClick={refreshData} disabled={loading || refreshing}>
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Requests List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                Verification Requests ({verificationRequests.length})
                {refreshing && (
                  <Loader2 className="h-4 w-4 ml-2 animate-spin inline" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {verificationRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRequest === request.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{request.request_number}</span>
                      <Badge variant={VerificationWorkflowAPI.getStatusColor(request.overall_status) as any}>
                        {VerificationWorkflowAPI.getStatusDisplayName(request.overall_status)}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{request.student_name}</p>
                    <p className="text-xs text-gray-500">
                      {VerificationWorkflowAPI.getInstitutionName(request.target_institution_id)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.submitted_at).toLocaleDateString()}
                    </p>
                  </div>
                ))}

                {verificationRequests.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No requests to review</p>
                    <p className="text-sm text-gray-400">
                      {isGTECAdmin || isBacCheckerAdmin 
                        ? 'All verification requests are up to date'
                        : 'No requests have been forwarded to your institution'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Request Details */}
        <div className="lg:col-span-2">
          {selectedRequestData ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Request Details</CardTitle>
                  <div className="flex space-x-2">
                    {getAvailableActions(selectedRequestData).map((action) => (
                      <Button
                        key={action.type}
                        variant={action.type.includes('approve') ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleAction(action.type)}
                        disabled={processing}
                        className={action.type.includes('reject') ? 'border-red-500 text-red-600 hover:bg-red-50' : ''}
                      >
                        {processing ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : action.type.includes('approve') ? (
                          <ThumbsUp className="h-4 w-4 mr-2" />
                        ) : (
                          <ThumbsDown className="h-4 w-4 mr-2" />
                        )}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Request Number</label>
                      <p className="text-gray-900">{selectedRequestData.request_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Status</label>
                      <Badge variant={VerificationWorkflowAPI.getStatusColor(selectedRequestData.overall_status) as any}>
                        {VerificationWorkflowAPI.getStatusDisplayName(selectedRequestData.overall_status)}
                      </Badge>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Student Name</label>
                      <p className="text-gray-900">{selectedRequestData.student_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Student ID</label>
                      <p className="text-gray-900">{selectedRequestData.student_id || 'N/A'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Program</label>
                      <p className="text-gray-900">{selectedRequestData.program_name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Target Institution</label>
                      <p className="text-gray-900">
                        {VerificationWorkflowAPI.getInstitutionName(selectedRequestData.target_institution_id)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Verification Type</label>
                      <p className="text-gray-900 capitalize">{selectedRequestData.verification_type.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Submitted Date</label>
                      <p className="text-gray-900">{new Date(selectedRequestData.submitted_at).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div className="border-t pt-6">
                    <h4 className="font-semibold text-gray-900 mb-4">Progress Timeline</h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Request Submitted</span>
                        <span className="text-xs text-gray-500">
                          {new Date(selectedRequestData.submitted_at).toLocaleString()}
                        </span>
                      </div>
                      
                      {selectedRequestData.gtec_approved_at && (
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">GTEC Approved</span>
                          <span className="text-xs text-gray-500">
                            {new Date(selectedRequestData.gtec_approved_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {selectedRequestData.institution_approved_at && (
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Institution Approved</span>
                          <span className="text-xs text-gray-500">
                            {new Date(selectedRequestData.institution_approved_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                      
                      {selectedRequestData.completed_at && (
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Completed</span>
                          <span className="text-xs text-gray-500">
                            {new Date(selectedRequestData.completed_at).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Additional Information */}
                  {selectedRequestData.metadata && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Additional Information</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedRequestData.metadata.purpose && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Purpose</label>
                            <p className="text-gray-900">{selectedRequestData.metadata.purpose}</p>
                          </div>
                        )}
                        {selectedRequestData.metadata.applicant_email && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Applicant Email</label>
                            <p className="text-gray-900">{selectedRequestData.metadata.applicant_email}</p>
                          </div>
                        )}
                        {selectedRequestData.metadata.applicant_phone && (
                          <div>
                            <label className="text-sm font-medium text-gray-700">Applicant Phone</label>
                            <p className="text-gray-900">{selectedRequestData.metadata.applicant_phone}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Rejection Reason */}
                  {selectedRequestData.rejection_reason && (
                    <div className="border-t pt-6">
                      <h4 className="font-semibold text-gray-900 mb-4">Rejection Reason</h4>
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <p className="text-red-800">{selectedRequestData.rejection_reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div className="text-center py-12">
                  <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Select a request to view details</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Approve Request</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowApprovalModal(false)} disabled={processing}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Comments (Optional)
                </label>
                <textarea
                  value={approvalComments}
                  onChange={(e) => setApprovalComments(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Add any comments or notes..."
                  disabled={processing}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={executeApproval}
                  disabled={processing}
                  className="flex-1"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Approve'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowApprovalModal(false)}
                  className="flex-1"
                  disabled={processing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Reject Request</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowRejectionModal(false)} disabled={processing}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rejection <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  rows={3}
                  placeholder="Please provide a reason for rejection..."
                  required
                  disabled={processing}
                />
              </div>
              
              <div className="flex space-x-3">
                <Button 
                  onClick={executeRejection}
                  disabled={processing || !rejectionReason.trim()}
                  variant="outline"
                  className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                >
                  {processing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Reject'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowRejectionModal(false)}
                  className="flex-1"
                  disabled={processing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}