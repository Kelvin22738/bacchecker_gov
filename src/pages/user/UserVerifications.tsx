// src/pages/user/UserVerifications.tsx - FIXED WITH WORKING APPROVE/REJECT
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { VerificationWorkflowAPI } from '../../utils/verificationWorkflowAPI';
import { VerificationRequest } from '../../types/verification';
import {
  FileText,
  Search,
  Eye,
  Download,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plus,
  X,
  Upload,
  Loader2,
  User,
  MessageSquare
} from 'lucide-react';

export function UserVerifications() {
  const { state } = useAuth();
  const { user } = state;
  
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<VerificationRequest[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal states
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [approvalComments, setApprovalComments] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  
  // Success/Error states
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch data from the API
  useEffect(() => {
    loadVerifications();
  }, [user?.institutionId, user?.role]);

  const loadVerifications = async () => {
    if (user?.institutionId && user.role === 'tertiary_institution_user') {
      setIsLoading(true);
      try {
        const data = await VerificationWorkflowAPI.getInstitutionRequests(user.institutionId);
        setVerifications(data);
        if (data.length > 0 && !selectedVerification) {
          setSelectedVerification(data[0]);
        }
        // Update selected verification if it exists in the new data
        if (selectedVerification) {
          const updatedSelected = data.find(v => v.id === selectedVerification.id);
          if (updatedSelected) {
            setSelectedVerification(updatedSelected);
          }
        }
      } catch (error) {
        console.error('Error loading verifications:', error);
        setErrorMessage('Failed to load verifications. Please try again.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setVerifications([]);
      setIsLoading(false);
    }
  };

  // Filter data when filters or search query change
  useEffect(() => {
    let result = verifications;

    if (statusFilter !== 'all') {
      result = result.filter(v => v.overall_status === statusFilter);
    }

    if (searchQuery) {
      result = result.filter(v => 
        v.request_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.student_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredVerifications(result);
  }, [verifications, statusFilter, searchQuery]);

  // Handle approval
  const handleApprove = async () => {
    if (!selectedVerification || !user?.id) return;
    
    setActionLoading(true);
    try {
      const result = await VerificationWorkflowAPI.institutionApproveRequest(
        selectedVerification.id,
        user.id,
        approvalComments
      );
      
      if (result) {
        setSuccessMessage(`Request ${selectedVerification.request_number} has been approved successfully!`);
        setShowApproveModal(false);
        setApprovalComments('');
        // Reload data to get updated status
        await loadVerifications();
      } else {
        setErrorMessage('Failed to approve request. Please try again.');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      setErrorMessage('An error occurred while approving the request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Handle rejection
  const handleReject = async () => {
    if (!selectedVerification || !user?.id || !rejectionReason.trim()) return;
    
    setActionLoading(true);
    try {
      const result = await VerificationWorkflowAPI.institutionRejectRequest(
        selectedVerification.id,
        user.id,
        rejectionReason
      );
      
      if (result) {
        setSuccessMessage(`Request ${selectedVerification.request_number} has been rejected.`);
        setShowRejectModal(false);
        setRejectionReason('');
        // Reload data to get updated status
        await loadVerifications();
      } else {
        setErrorMessage('Failed to reject request. Please try again.');
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
      setErrorMessage('An error occurred while rejecting the request.');
    } finally {
      setActionLoading(false);
    }
  };

  // Clear messages after a delay
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const getStatusBadge = (status: string) => {
    const color = VerificationWorkflowAPI.getStatusColor(status);
    const name = VerificationWorkflowAPI.getStatusDisplayName(status);
    return <Badge variant={color as any}>{name}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
      case 'institution_approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
      case 'gtec_rejected':
      case 'institution_rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  // Check if current user can take actions on selected verification
  const canTakeAction = (verification: VerificationRequest) => {
    return verification.overall_status === 'gtec_approved' || 
           verification.overall_status === 'institution_reviewing';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-800">{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="ml-auto">
                <X className="h-4 w-4 text-green-600" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {errorMessage && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-800">{errorMessage}</span>
              <button onClick={() => setErrorMessage('')} className="ml-auto">
                <X className="h-4 w-4 text-red-600" />
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Verifications</h1>
          <p className="text-gray-600">Manage and track your verification requests</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Verification
        </Button>
      </div>

      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by request number or name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex space-x-1">
                {['all', 'gtec_approved', 'institution_reviewing', 'institution_approved', 'completed', 'rejected'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      statusFilter === status
                        ? 'bg-red-100 text-red-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {status === 'all' ? 'All' : VerificationWorkflowAPI.getStatusDisplayName(status)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Verification Requests ({filteredVerifications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                {filteredVerifications.map((verification) => (
                  <div
                    key={verification.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVerification?.id === verification.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedVerification(verification)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(verification.overall_status)}
                        <span className="font-medium text-gray-900">{verification.request_number}</span>
                      </div>
                      {getStatusBadge(verification.overall_status)}
                    </div>
                    <p className="text-sm font-medium text-gray-900">{verification.student_name}</p>
                    <p className="text-xs text-gray-600">{verification.program_name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(verification.submitted_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
                
                {filteredVerifications.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No verifications found for the selected filters.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          {selectedVerification ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedVerification.program_name}</CardTitle>
                      <p className="text-gray-600">Request: {selectedVerification.request_number}</p>
                    </div>
                    <div>
                      {getStatusBadge(selectedVerification.overall_status)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-3 bg-gray-50 rounded">
                            <User className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                            <p className="text-sm font-medium text-center">{selectedVerification.student_name}</p>
                            <p className="text-xs text-gray-500 text-center">Student Name</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <Calendar className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                            <p className="text-sm font-medium text-center">{new Date(selectedVerification.submitted_at).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500 text-center">Submitted</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <FileText className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                            <p className="text-sm font-medium text-center">{selectedVerification.verification_type.replace(/_/g, ' ')}</p>
                            <p className="text-xs text-gray-500 text-center">Type</p>
                        </div>
                        <div className="p-3 bg-gray-50 rounded">
                            <Clock className="h-5 w-5 text-gray-600 mx-auto mb-1" />
                            <p className="text-sm font-medium text-center">{new Date(selectedVerification.updated_at).toLocaleDateString()}</p>
                            <p className="text-xs text-gray-500 text-center">Last Update</p>
                        </div>
                    </div>
                </CardContent>
              </Card>
              
              {canTakeAction(selectedVerification) && (
                <Card>
                  <CardHeader>
                      <CardTitle>Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <div className="flex gap-4">
                          <Button 
                            className="flex-1" 
                            onClick={() => setShowApproveModal(true)}
                            disabled={actionLoading}
                          >
                              {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                              Approve
                          </Button>
                           <Button 
                            variant="destructive" 
                            className="flex-1" 
                            onClick={() => setShowRejectModal(true)}
                            disabled={actionLoading}
                          >
                              {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                              Reject
                          </Button>
                           <Button 
                            variant="outline" 
                            className="flex-1" 
                            onClick={() => alert(`Viewing details for ${selectedVerification.request_number}`)}
                          >
                              <Eye className="h-4 w-4 mr-2" />
                              View Full Details
                          </Button>
                      </div>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Verification</h3>
                <p className="text-gray-600">Choose a verification request from the list to view its details.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Approve Verification Request</h3>
              <button onClick={() => setShowApproveModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to approve request {selectedVerification?.request_number}?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Comments (Optional)
              </label>
              <textarea
                value={approvalComments}
                onChange={(e) => setApprovalComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="Add any comments about this approval..."
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowApproveModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleApprove}
                disabled={actionLoading}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                Approve
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Reject Verification Request</h3>
              <button onClick={() => setShowRejectModal(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting request {selectedVerification?.request_number}:
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Please explain why this request is being rejected..."
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowRejectModal(false)}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <XCircle className="h-4 w-4 mr-2" />}
                Reject
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}