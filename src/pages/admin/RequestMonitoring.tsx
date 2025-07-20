// src/pages/admin/RequestMonitoring.tsx - REPLACE ENTIRE FILE
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  Building2,
  FileText,
  Users,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { VerificationWorkflowAPI } from '../../utils/verificationWorkflowAPI';
import { VerificationRequest } from '../../types/verification';

export function RequestMonitoring() {
  const { state } = useAuth();
  const { user } = state;
  
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);

  const isGTECAdmin = user?.role === 'gtec_admin';
  const isBacCheckerAdmin = user?.role === 'bacchecker_admin';

  // Institution options for filtering
  const institutions = [
    { id: 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', name: 'University of Ghana' },
    { id: 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', name: 'KNUST' },
    { id: 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', name: 'Ghana Police Service' },
    { id: 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', name: 'High Court of Ghana'
    }
  ];

  // Load all requests
  const loadRequests = async () => {
    if (refreshing) return; // Prevent multiple simultaneous loads
    
    setLoading(true);
    try {
      let allRequests = await VerificationWorkflowAPI.getAllRequests();

      // Filter by institution if selected
      if (selectedInstitution !== 'all') {
        allRequests = allRequests.filter(req => req.target_institution_id === selectedInstitution);
      }

      // Filter by status if selected
      if (selectedStatus !== 'all') {
        allRequests = allRequests.filter(req => req.overall_status === selectedStatus);
      }

      // Filter by search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        allRequests = allRequests.filter(req => 
          req.student_name.toLowerCase().includes(query) ||
          req.request_number.toLowerCase().includes(query) ||
          req.program_name.toLowerCase().includes(query) ||
          (req.metadata?.applicant_email && req.metadata.applicant_email.toLowerCase().includes(query))
        );
      }

      setRequests(allRequests);
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
  }, [selectedInstitution, selectedStatus, searchQuery]);

  // Calculate statistics
  const stats = {
    total: requests.length,
    submitted: requests.filter(r => r.overall_status === 'submitted').length,
    gtecApproved: requests.filter(r => r.overall_status === 'gtec_approved').length,
    institutionApproved: requests.filter(r => r.overall_status === 'institution_approved').length,
    completed: requests.filter(r => r.overall_status === 'completed').length,
    rejected: requests.filter(r => 
      r.overall_status === 'gtec_rejected' || r.overall_status === 'institution_rejected'
    ).length,
  };

  // Group requests by institution for overview
  const requestsByInstitution = institutions.map(institution => {
    const institutionRequests = requests.filter(req => req.target_institution_id === institution.id);
    return {
      ...institution,
      requestCount: institutionRequests.length,
      pendingCount: institutionRequests.filter(req => 
        ['submitted', 'gtec_approved', 'institution_approved'].includes(req.overall_status)
      ).length,
      completedCount: institutionRequests.filter(req => req.overall_status === 'completed').length
    };
  });

  const selectedRequestData = selectedRequest
    ? requests.find(r => r.id === selectedRequest)
    : null;

  // Export functionality
  const handleExport = () => {
    const csvContent = [
      // CSV Headers
      ['Request Number', 'Student Name', 'Institution', 'Program', 'Status', 'Submitted Date', 'Applicant Email'].join(','),
      // CSV Data
      ...requests.map(req => [
        req.request_number,
        req.student_name,
        VerificationWorkflowAPI.getInstitutionName(req.target_institution_id),
        req.program_name,
        VerificationWorkflowAPI.getStatusDisplayName(req.overall_status),
        new Date(req.submitted_at).toLocaleDateString(),
        req.metadata?.applicant_email || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `verification_requests_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
          <h1 className="text-2xl font-bold text-gray-900">Request Monitoring</h1>
          <p className="text-gray-600">Monitor verification requests across all institutions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={refreshData} disabled={loading || refreshing}>
            {refreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={requests.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-sm text-gray-600">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.submitted}</p>
                <p className="text-sm text-gray-600">Submitted</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.gtecApproved}</p>
                <p className="text-sm text-gray-600">GTEC Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.institutionApproved}</p>
                <p className="text-sm text-gray-600">Institution Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Institution Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Requests by Institution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {requestsByInstitution.map((institution) => (
              <div
                key={institution.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedInstitution === institution.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'hover:border-blue-500'
                }`}
                onClick={() => setSelectedInstitution(institution.id)}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <Building2 className="h-6 w-6 text-blue-500" />
                  <h3 className="font-semibold text-gray-900">{institution.name}</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Requests:</span>
                    <span className="font-medium">{institution.requestCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Pending:</span>
                    <span className="font-medium text-yellow-600">{institution.pendingCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Completed:</span>
                    <span className="font-medium text-green-600">{institution.completedCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search by name, ID, or program..."
                  disabled={loading || refreshing}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
              <select
                value={selectedInstitution}
                onChange={(e) => setSelectedInstitution(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading || refreshing}
              >
                <option value="all">All Institutions</option>
                {institutions.map((institution) => (
                  <option key={institution.id} value={institution.id}>
                    {institution.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={loading || refreshing}
              >
                <option value="all">All Statuses</option>
                <option value="submitted">Submitted</option>
                <option value="gtec_approved">GTEC Approved</option>
                <option value="institution_approved">Institution Approved</option>
                <option value="completed">Completed</option>
                <option value="gtec_rejected">GTEC Rejected</option>
                <option value="institution_rejected">Institution Rejected</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setSelectedInstitution('all');
                  setSelectedStatus('all');
                  setSearchQuery('');
                }}
                className="w-full"
                disabled={loading || refreshing}
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>
              Verification Requests ({requests.length})
              {refreshing && (
                <Loader2 className="h-4 w-4 ml-2 animate-spin inline" />
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading && !refreshing ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Request #</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Student</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Institution</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Program</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Submitted</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((request) => (
                    <tr key={request.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <span className="font-medium text-blue-600">{request.request_number}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{request.student_name}</p>
                          {request.student_id && (
                            <p className="text-sm text-gray-600">{request.student_id}</p>
                          )}
                          {request.metadata?.applicant_email && (
                            <p className="text-xs text-gray-500">{request.metadata.applicant_email}</p>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-900">
                          {VerificationWorkflowAPI.getInstitutionName(request.target_institution_id)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-gray-900">{request.program_name}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {request.verification_type.replace('_', ' ')}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={VerificationWorkflowAPI.getStatusColor(request.overall_status) as any}>
                          {VerificationWorkflowAPI.getStatusDisplayName(request.overall_status)}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <span className="text-gray-600">
                            {new Date(request.submitted_at).toLocaleDateString()}
                          </span>
                          <p className="text-xs text-gray-500">
                            {new Date(request.submitted_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedRequest(request.id)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {requests.length === 0 && !loading && (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No requests found</p>
                  <p className="text-sm text-gray-400">Try adjusting your filters</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details Modal */}
      {selectedRequestData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Request Details</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Request Number</label>
                  <p className="text-gray-900">{selectedRequestData.request_number}</p>
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
                {selectedRequestData.metadata?.applicant_email && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Applicant Email</label>
                    <p className="text-gray-900">{selectedRequestData.metadata.applicant_email}</p>
                  </div>
                )}
                {selectedRequestData.metadata?.applicant_phone && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Applicant Phone</label>
                    <p className="text-gray-900">{selectedRequestData.metadata.applicant_phone}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">Status</label>
                  <Badge variant={VerificationWorkflowAPI.getStatusColor(selectedRequestData.overall_status) as any}>
                    {VerificationWorkflowAPI.getStatusDisplayName(selectedRequestData.overall_status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Target Institution</label>
                  <p className="text-gray-900">
                    {VerificationWorkflowAPI.getInstitutionName(selectedRequestData.target_institution_id)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Verification Type</label>
                  <p className="text-gray-900 capitalize">
                    {selectedRequestData.verification_type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">Submitted Date</label>
                  <p className="text-gray-900">
                    {new Date(selectedRequestData.submitted_at).toLocaleDateString()}
                  </p>
                </div>
                {selectedRequestData.metadata?.purpose && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Purpose</label>
                    <p className="text-gray-900">{selectedRequestData.metadata.purpose}</p>
                  </div>
                )}
                {selectedRequestData.rejection_reason && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Rejection Reason</label>
                    <p className="text-red-700 bg-red-50 p-2 rounded">{selectedRequestData.rejection_reason}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Timeline */}
            <div className="mt-6 border-t pt-6">
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
                    {selectedRequestData.gtec_approved_by && (
                      <span className="text-xs text-gray-400">by {selectedRequestData.gtec_approved_by}</span>
                    )}
                  </div>
                )}
                
                {selectedRequestData.institution_approved_at && (
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm">Institution Approved</span>
                    <span className="text-xs text-gray-500">
                      {new Date(selectedRequestData.institution_approved_at).toLocaleString()}
                    </span>
                    {selectedRequestData.institution_approved_by && (
                      <span className="text-xs text-gray-400">by {selectedRequestData.institution_approved_by}</span>
                    )}
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

            {/* Action Button */}
            <div className="mt-6 flex justify-end">
              <Button onClick={() => window.location.href = '/admin/verification'}>
                Go to Verification System
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}