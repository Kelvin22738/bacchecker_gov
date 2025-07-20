// src/pages/DocumentVerification.tsx - FINAL CORRECTED FILE
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  ThumbsUp,
  ThumbsDown,
  Eye,
  RefreshCw,
  X,
  Loader2
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { VerificationWorkflowAPI } from '../utils/verificationWorkflowAPI';
import { VerificationRequest } from '../types/verification';

export function DocumentVerification() {
  const { state } = useAuth();
  const { user } = state;
  const location = useLocation();
  const navigate = useNavigate();
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const isGTECAdmin = user?.role === 'gtec_admin';
  const isTertiaryUser = user?.role === 'tertiary_institution_user';

  const loadRequests = async () => {
    if (refreshing) return;
    setLoading(true);
    try {
      let requests: VerificationRequest[] = [];

      if (isGTECAdmin) {
        requests = await VerificationWorkflowAPI.getGTECRequests();
      } else if (isTertiaryUser && user?.institutionId) {
        // CORRECTED: This uses the dedicated API function that correctly fetches 
        // requests with status 'gtec_approved' or 'institution_reviewing'.
        requests = await VerificationWorkflowAPI.getInstitutionRequests(user.institutionId);
      }

      setVerificationRequests(requests);

      const incomingRequestId = location.state?.selectedRequestId;
      if (incomingRequestId && requests.some(r => r.id === incomingRequestId)) {
          setSelectedRequest(incomingRequestId);
      } else if (requests.length > 0) {
          setSelectedRequest(requests[0].id);
      } else {
          setSelectedRequest(null);
      }

    } catch (error) {
      console.error('Error loading requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const selectedRequestData = selectedRequest
    ? verificationRequests.find(r => r.id === selectedRequest)
    : null;

  const updateRequestInState = (updatedRequest: VerificationRequest) => {
    const newRequests = verificationRequests.filter(req => req.id !== updatedRequest.id);
    setVerificationRequests(newRequests);
    // Select the next request in the list, or none if the list is empty
    setSelectedRequest(newRequests.length > 0 ? newRequests[0].id : null);
  };
  
  const handleAction = (actionType: string) => {
    setApprovalComments('');
    setRejectionReason('');
    if (actionType.includes('approve')) setShowApprovalModal(true);
    if (actionType.includes('reject')) setShowRejectionModal(true);
  };

  const executeApproval = async () => {
    if (!selectedRequestData || !user) return;
    setProcessing(true);

    const actionType = getAvailableActions(selectedRequestData).find(a => a.type.includes('approve'))?.type;
    let updated: VerificationRequest | null = null;

    switch (actionType) {
        case 'gtec_approve':
            updated = await VerificationWorkflowAPI.gtecApproveRequest(selectedRequest, user.id, approvalComments);
            break;
        case 'institution_approve':
            updated = await VerificationWorkflowAPI.institutionApproveRequest(selectedRequest, user.id, approvalComments);
            break;
        case 'final_approve':
            updated = await VerificationWorkflowAPI.finalGtecApproval(selectedRequest, user.id, approvalComments);
            break;
    }

    if (updated) {
        updateRequestInState(updated);
        alert('Action completed successfully!');
    } else {
        alert('An error occurred. Please try again.');
    }
    
    setShowApprovalModal(false);
    setProcessing(false);
  };

  const executeRejection = async () => {
    if (!selectedRequestData || !user || !rejectionReason.trim()) return;
    setProcessing(true);

    let updated: VerificationRequest | null = null;
    if (isGTECAdmin) {
        updated = await VerificationWorkflowAPI.gtecRejectRequest(selectedRequest, user.id, rejectionReason);
    } else if (isTertiaryUser) {
        updated = await VerificationWorkflowAPI.institutionRejectRequest(selectedRequest, user.id, rejectionReason);
    }

    if (updated) {
        updateRequestInState(updated);
        alert('Request rejected successfully!');
    } else {
        alert('An error occurred. Please try again.');
    }
    
    setShowRejectionModal(false);
    setProcessing(false);
  };

  const getAvailableActions = (request: VerificationRequest) => {
    const actions = [];
    if (isGTECAdmin) {
      if (request.overall_status === 'submitted') {
        actions.push({ type: 'gtec_approve', label: 'Approve & Forward' });
        actions.push({ type: 'gtec_reject', label: 'Reject' });
      } else if (request.overall_status === 'institution_approved') {
        actions.push({ type: 'final_approve', label: 'Final Approval' });
        actions.push({ type: 'gtec_reject', label: 'Reject' });
      }
    } else if (isTertiaryUser) {
      if (request.overall_status === 'gtec_approved' || request.overall_status === 'institution_reviewing') {
        actions.push({ type: 'institution_approve', label: 'Approve' });
        actions.push({ type: 'institution_reject', label: 'Reject' });
      }
    }
    return actions;
  };

  if (loading && !refreshing) {
    return <div className="flex items-center justify-center h-full"><Loader2 className="h-12 w-12 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Verification</h1>
          <p className="text-gray-600">Review and process incoming verification requests.</p>
        </div>
        <Button variant="outline" onClick={refreshData} disabled={loading || refreshing}>
          {refreshing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />}
          Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>Request Queue ({verificationRequests.length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2">
                {verificationRequests.map((request) => (
                  <div key={request.id} className={`p-3 border rounded-lg cursor-pointer transition-colors ${selectedRequest === request.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`} onClick={() => setSelectedRequest(request.id)}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{request.request_number}</span>
                      <Badge variant={VerificationWorkflowAPI.getStatusColor(request.overall_status, request.metadata) as any}>{VerificationWorkflowAPI.getStatusDisplayName(request.overall_status, request.metadata)}</Badge>
                    </div>
                    <p className="text-sm text-gray-800">{request.student_name}</p>
                    <p className="text-xs text-gray-500">{VerificationWorkflowAPI.getInstitutionName(request.target_institution_id)}</p>
                  </div>
                ))}
                {verificationRequests.length === 0 && (
                  <div className="text-center py-12"><FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 font-medium">Queue is Empty</p><p className="text-sm text-gray-400">No pending requests to review.</p></div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedRequestData ? (
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <CardTitle>Details: {selectedRequestData.request_number}</CardTitle>
                  <div className="flex space-x-2">
                    {getAvailableActions(selectedRequestData).map((action) => (
                      <Button key={action.type} variant={action.type.includes('approve') ? 'default' : 'destructive'} size="sm" onClick={() => handleAction(action.type)} disabled={processing}>
                        {action.type.includes('approve') ? <ThumbsUp className="h-4 w-4 mr-2" /> : <ThumbsDown className="h-4 w-4 mr-2" />}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 border p-4 rounded-lg">
                  <div><p className="text-sm text-gray-500">Student Name</p><p className="font-medium">{selectedRequestData.student_name}</p></div>
                  <div><p className="text-sm text-gray-500">Program</p><p className="font-medium">{selectedRequestData.program_name}</p></div>
                  <div><p className="text-sm text-gray-500">Institution</p><p className="font-medium">{VerificationWorkflowAPI.getInstitutionName(selectedRequestData.target_institution_id)}</p></div>
                  <div><p className="text-sm text-gray-500">Submitted</p><p className="font-medium">{new Date(selectedRequestData.submitted_at).toLocaleString()}</p></div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="flex items-center justify-center h-full"><div className="text-center py-12"><Eye className="h-12 w-12 text-gray-300 mx-auto mb-4" /><p className="text-gray-500 font-medium">Select a Request</p><p className="text-sm text-gray-400">Choose a request from the queue to view its details.</p></div></Card>
          )}
        </div>
      </div>
      
      {/* Modals */}
      {showApprovalModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Approve Request</h3><Button variant="ghost" size="icon" onClick={() => setShowApprovalModal(false)}><X className="h-4 w-4"/></Button></div><textarea value={approvalComments} onChange={(e) => setApprovalComments(e.target.value)} className="w-full p-2 border rounded mb-4" placeholder="Optional comments..."/>
              <div className="flex justify-end space-x-2"><Button variant="outline" onClick={() => setShowApprovalModal(false)} disabled={processing}>Cancel</Button><Button onClick={executeApproval} disabled={processing}>{processing ? <Loader2 className="h-4 w-4 animate-spin"/> : "Confirm Approval"}</Button></div></div></div>
      )}
      {showRejectionModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}><div className="flex items-center justify-between mb-4"><h3 className="text-lg font-semibold">Reject Request</h3><Button variant="ghost" size="icon" onClick={() => setShowRejectionModal(false)}><X className="h-4 w-4"/></Button></div><textarea value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} className="w-full p-2 border rounded mb-4" placeholder="Reason for rejection (required)..."/>
              <div className="flex justify-end space-x-2"><Button variant="outline" onClick={() => setShowRejectionModal(false)} disabled={processing}>Cancel</Button><Button variant="destructive" onClick={executeRejection} disabled={processing || !rejectionReason.trim()}>{processing ? <Loader2 className="h-4 w-4 animate-spin"/> : "Confirm Rejection"}</Button></div></div></div>
      )}
    </div>
  );
}