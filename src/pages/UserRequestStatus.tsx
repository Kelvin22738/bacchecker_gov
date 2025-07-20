// src/pages/UserRequestStatus.tsx - REPLACE ENTIRE FILE
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
      setSearchError('Please enter either a request number or email address');
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
        // Search by request number
        const request = await VerificationWorkflowAPI.getRequestByNumber(searchQuery.trim());
        if (request) {
          requests = [request];
        }
      } else if (searchEmail.trim()) {
        // Search by email
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
      setSearchError('Error searching for request. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'submitted':
        return 25;
      case 'gtec_approved':
        return 50;
      case 'institution_approved':
        return 75;
      case 'completed':
        return 100;
      default:
        return 0;
    }
  };

  const getStepStatus = (stepNumber: number, currentStatus: string) => {
    const statusOrder = ['submitted', 'gtec_approved', 'institution_approved', 'completed'];
    const currentStep = statusOrder.indexOf(currentStatus) + 1;
    
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Check Your Verification Status
          </h1>
          <p className="text-gray-600 text-lg">
            Enter your request number or email address to track your verification progress
          </p>
        </div>

        {/* Search Form */}
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
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    onChange={(e) => setSearchEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                    disabled={searching}
                  />
                </div>
              </div>
              
              {searchError && (
                <div className="text-red-600 text-sm">{searchError}</div>
              )}
              
              <div className="flex space-x-3">
                <Button 
                  onClick={handleSearch} 
                  disabled={searching}
                  className="flex-1 md:flex-none"
                >
                  {searching ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Search Request
                    </>
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

        {/* Multiple Results */}
        {foundRequests.length > 1 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Multiple Requests Found</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {foundRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedRequest?.id === request.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
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
                      <Badge variant={VerificationWorkflowAPI.getStatusColor(request.overall_status) as any}>
                        {VerificationWorkflowAPI.getStatusDisplayName(request.overall_status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Not Found Message */}
        {notFound && (
          <Card className="mb-8 border-red-200">
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Request Not Found</h3>
              <p className="text-gray-600 mb-4">
                We couldn't find a verification request with the provided information.
              </p>
              <div className="text-sm text-gray-500">
                <p>Please check that you've entered the correct:</p>
                <ul className="list-disc list-inside mt-2">
                  <li>Request number (format: VR-2025-XXX)</li>
                  <li>Email address used during submission</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Request Details */}
        {selectedRequest && (
          <div className="space-y-6">
            {/* Status Overview */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Request Status Overview</CardTitle>
                  <Badge 
                    variant={VerificationWorkflowAPI.getStatusColor(selectedRequest.overall_status) as any}
                    className="text-lg px-4 py-2"
                  >
                    {VerificationWorkflowAPI.getStatusDisplayName(selectedRequest.overall_status)}
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
                    <div>
                      <label className="text-sm font-medium text-gray-700">Target Institution</label>
                      <p className="text-gray-900">
                        {VerificationWorkflowAPI.getInstitutionName(selectedRequest.target_institution_id)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Verification Type</label>
                      <p className="text-gray-900 capitalize">
                        {selectedRequest.verification_type.replace('_', ' ')}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Submitted Date</label>
                      <p className="text-gray-900">
                        {new Date(selectedRequest.submitted_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Expected Duration</label>
                      <p className="text-gray-900">{getExpectedDuration(selectedRequest.overall_status)}</p>
                    </div>
                    {selectedRequest.completed_at && (
                      <div>
                        <label className="text-sm font-medium text-gray-700">Completed Date</label>
                        <p className="text-gray-900">
                          {new Date(selectedRequest.completed_at).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Verification Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{getProgressPercentage(selectedRequest.overall_status)}% Complete</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(selectedRequest.overall_status)}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Timeline Steps */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getStepStatus(1, selectedRequest.overall_status) === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : getStepStatus(1, selectedRequest.overall_status) === 'current'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {getStepStatus(1, selectedRequest.overall_status) === 'completed' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span>1</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Request Submitted</h4>
                        <p className="text-sm text-gray-600">Your verification request has been submitted to GTEC</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(selectedRequest.submitted_at).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getStepStatus(2, selectedRequest.overall_status) === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : getStepStatus(2, selectedRequest.overall_status) === 'current'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {getStepStatus(2, selectedRequest.overall_status) === 'completed' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span>2</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">GTEC Review</h4>
                        <p className="text-sm text-gray-600">GTEC is reviewing your request and will forward it to the institution</p>
                        {selectedRequest.gtec_approved_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Approved: {new Date(selectedRequest.gtec_approved_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getStepStatus(3, selectedRequest.overall_status) === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : getStepStatus(3, selectedRequest.overall_status) === 'current'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {getStepStatus(3, selectedRequest.overall_status) === 'completed' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span>3</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Institution Review</h4>
                        <p className="text-sm text-gray-600">The institution is verifying your academic records</p>
                        {selectedRequest.institution_approved_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Approved: {new Date(selectedRequest.institution_approved_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          getStepStatus(4, selectedRequest.overall_status) === 'completed' 
                            ? 'bg-green-500 text-white' 
                            : getStepStatus(4, selectedRequest.overall_status) === 'current'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-300 text-gray-600'
                        }`}>
                          {getStepStatus(4, selectedRequest.overall_status) === 'completed' ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : (
                            <span>4</span>
                          )}
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">Final Approval & Report</h4>
                        <p className="text-sm text-gray-600">GTEC provides final approval and generates your verification report</p>
                        {selectedRequest.completed_at && (
                          <p className="text-xs text-gray-500 mt-1">
                            Completed: {new Date(selectedRequest.completed_at).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {selectedRequest.overall_status === 'completed' && (
              <Card className="border-green-200 bg-green-50">
                <CardContent className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Verification Complete!
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Your verification has been completed successfully. You can download your official verification report.
                  </p>
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download Verification Report
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Rejection Information */}
            {(selectedRequest.overall_status === 'gtec_rejected' || selectedRequest.overall_status === 'institution_rejected') && (
              <Card className="border-red-200 bg-red-50">
                <CardContent className="py-6">
                  <div className="flex items-start space-x-4">
                    <AlertCircle className="h-8 w-8 text-red-500 mt-1" />
                    <div>
                      <h3 className="text-lg font-semibold text-red-900 mb-2">
                        Request Rejected
                      </h3>
                      <p className="text-red-700 mb-4">
                        Your verification request has been rejected.
                      </p>
                      {selectedRequest.rejection_reason && (
                        <div>
                          <label className="text-sm font-medium text-red-800">Reason:</label>
                          <p className="text-red-700 mt-1">{selectedRequest.rejection_reason}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <Phone className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Call Us</h4>
                    <p className="text-sm text-gray-600">+233 XXX XXX XXX</p>
                  </div>
                  <div className="text-center">
                    <Mail className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Email Us</h4>
                    <p className="text-sm text-gray-600">support@gtec.edu.gh</p>
                  </div>
                  <div className="text-center">
                    <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                    <h4 className="font-semibold text-gray-900">Office Hours</h4>
                    <p className="text-sm text-gray-600">Mon-Fri: 8AM-5PM</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}