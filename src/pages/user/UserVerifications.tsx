// src/pages/user/UserVerifications.tsx - REPLACED
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
  User // CORRECTED: Added User icon to imports
} from 'lucide-react';

export function UserVerifications() {
  const { state } = useAuth();
  const { user } = state;
  
  const [verifications, setVerifications] = useState<VerificationRequest[]>([]);
  const [filteredVerifications, setFilteredVerifications] = useState<VerificationRequest[]>([]);
  const [selectedVerification, setSelectedVerification] = useState<VerificationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch data from the API
  useEffect(() => {
    const loadVerifications = async () => {
      if (user?.institutionId && user.role === 'tertiary_institution_user') {
        setIsLoading(true);
        const data = await VerificationWorkflowAPI.getInstitutionRequests(user.institutionId);
        setVerifications(data);
        if (data.length > 0) {
          setSelectedVerification(data[0]);
        }
        setIsLoading(false);
      } else {
        setVerifications([]);
        setIsLoading(false);
      }
    };

    loadVerifications();
  }, [user?.institutionId, user?.role]);

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

  const getStatusBadge = (status: string) => {
    const color = VerificationWorkflowAPI.getStatusColor(status);
    const name = VerificationWorkflowAPI.getStatusDisplayName(status);
    return <Badge variant={color as any}>{name}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected':
      case 'gtec_rejected':
      case 'institution_rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
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
                {['all', 'gtec_approved', 'institution_reviewing', 'completed', 'rejected'].map((status) => (
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
              <Card>
                <CardHeader>
                    <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4">
                        <Button className="flex-1" onClick={() => alert(`Approving ${selectedVerification.request_number}`)}>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                        </Button>
                         <Button variant="destructive" className="flex-1" onClick={() => alert(`Rejecting ${selectedVerification.request_number}`)}>
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                        </Button>
                         <Button variant="outline" className="flex-1" onClick={() => alert(`Viewing details for ${selectedVerification.request_number}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Full Details
                        </Button>
                    </div>
                </CardContent>
              </Card>
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
    </div>
  );
}