// src/pages/UserRequestStatus.tsx - FINAL VERSION
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  FileText,
  Calendar,
  Building2,
  User,
  Phone,
  Mail,
  Download,
  Eye,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { VerificationWorkflowAPI } from '../utils/verificationWorkflowAPI';
import { VerificationRequest } from '../types/verification';

export function UserRequestStatus() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchEmail, setSearchEmail] = useState('');
  const [foundRequests, setFoundRequests] = useState<VerificationRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [searching, setSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [searchError, setSearchError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim() && !searchEmail.trim()) {
      setSearchError('Please enter either a request number or an email address.');
      return;
    }

    setSearching(true);
    setNotFound(false);
    setFoundRequests([]);
    setSelectedRequest(null);
    setSearchError('');

    try {
      let requests: VerificationRequest[] = [];
      
      if (searchQuery.trim()) {
        const request = await VerificationWorkflowAPI.getRequestByNumber(searchQuery.trim());
        if (request) {
          requests = [request];
        }
      } else if (searchEmail.trim()) {
        requests = await VerificationWorkflowAPI.getRequestByEmail(searchEmail.trim());
      }

      if (requests.length > 0) {
        setFoundRequests(requests);
        if (requests.length === 1) {
          setSelectedRequest(requests[0]);
        }
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Error searching for request:', error);
      setSearchError('An error occurred while searching. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const getProgressPercentage = (status: string) => {
    const statusOrder = ['submitted', 'gtec_approved', 'institution_approved', 'completed'];
    const index = statusOrder.indexOf(status);
    if (index === -1) return 0;
    return ((index + 1) / statusOrder.length) * 100;
  };

  const getStepStatus = (stepNumber: number, currentStatus: string) => {
    const statusOrder = ['submitted', 'gtec_approved', 'institution_approved', 'completed'];
    const currentStepIndex = statusOrder.indexOf(currentStatus);
    const currentStepNumber = currentStepIndex + 1;
    
    if (stepNumber < currentStepNumber) return 'completed';
    if (stepNumber === currentStepNumber) return 'current';
    return 'pending';
  };

  const getExpectedDuration = (status: string) => {
    switch (status) {
      case 'submitted':
        return '3-5 business days for GTEC review';
      case 'gtec_approved':
        return '5-7 business days for institution review';
      case 'institution_approved':
        return '1-2 business days for final approval';
      case 'completed':
        return 'Verification complete';
      default:
        return 'Processing time varies';
    }
  };

  const resetSearch = () => {
    setSearchQuery('');
    setSearchEmail('');
    setFoundRequests([]);
    setSelectedRequest(null);
    setNotFound(false);
    setSearchError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check Your Verification Status
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your request number or email address to track your verification progress.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search for Your Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Request Number
                  </label>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setSearchEmail(''); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., VR-2025-001"
                    disabled={searching}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    OR Email Address
                  </label>
                  <input
                    type="email"
                    value={searchEmail}
                    onChange={(e) => { setSearchEmail(e.target.value); setSearchQuery(''); }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                    disabled={searching}
                  />
                </div>
              </div>
              
              {searchError && (
                <div className="text-red-600 text-sm mt-2">{searchError}</div>
              )}
              
              <div className="flex space-x-3 pt-2">
                <Button 
                  onClick={handleSearch} 
                  disabled={searching || (!searchQuery && !searchEmail)}
                  className="flex-1 md:flex-none"
                >
                  {searching ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Searching...</>
                  ) : (
                    <><Search className="h-4 w-4 mr-2" />Search Request</>
                  )}
                </Button>
                
                {(foundRequests.length > 0 || notFound || searchError) && (
                  <Button variant="outline" onClick={resetSearch} disabled={searching}>
                    Clear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {foundRequests.length > 1 && !selectedRequest && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Multiple Requests Found</CardTitle>
              <p className="text-sm text-gray-600">Please select a request to view its details.</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {foundRequests.map((request) => (
                  <div
                    key={request.id}
                    className="p-4 border rounded-lg cursor-pointer transition-colors hover:border-blue-500 hover:bg-blue-50"
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{request.request_number}</h4>
                        <p className="text-sm text-gray-600">{request.program_name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.submitted_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={VerificationWorkflowAPI.getStatusColor(request.overall_status, request.metadata) as any}>
                        {VerificationWorkflowAPI.getStatusDisplayName(request.overall_status, request.metadata)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {notFound && (
          <Card className="mb-8 border-red-200">
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Not Found</h3>
              <p className="text-gray-600">
                We couldn't find a verification request with the provided information.
              </p>
            </CardContent>
          </Card>
        )}

        {selectedRequest && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <CardTitle>Request Status Overview</CardTitle>
                  <Badge 
                    variant={VerificationWorkflowAPI.getStatusColor(selectedRequest.overall_status, selectedRequest.metadata) as any}
                    className="text-base px-4 py-2"
                  >
                    {VerificationWorkflowAPI.getStatusDisplayName(selectedRequest.overall_status, selectedRequest.metadata)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Request Number</label>
                      <p className="text-lg font-semibold text-blue-600">{selectedRequest.request_number}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Student Name</label>
                      <p className="text-gray-900">{selectedRequest.student_name}</p>
                    </div>
                     <div>
                      <label className="text-sm font-medium text-gray-700">Program/Course</label>
                      <p className="text-gray-900">{selectedRequest.program_name}</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Submitted Date</label>
                      <p className="text-gray-900">{new Date(selectedRequest.submitted_at).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Expected Duration</label>
                      <p className="text-gray-900">{getExpectedDuration(selectedRequest.overall_status)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle>Verification Progress</CardTitle></CardHeader>
              <CardContent>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{width: `${getProgressPercentage(selectedRequest.overall_status)}%`}}></div>
                </div>
                {/* Add timeline steps here if needed */}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}