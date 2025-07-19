import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Download,
  Clock,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Plus,
  X,
  Upload
} from 'lucide-react';

export function UserVerifications() {
  const { state } = useAuth();
  const { user } = state;
  const [selectedVerification, setSelectedVerification] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);

  // Mock verifications based on institution
  const getInstitutionVerifications = () => {
    switch (user?.institutionId) {
      case 'gps':
        return [
          {
            id: 'ver-gps-001',
            reference: 'REF-PC-2025-001',
            type: 'Police Clearance Certificate',
            subject: 'John Doe',
            submittedDate: '2025-01-20',
            status: 'Completed',
            documents: ['ID Card', 'Application Form', 'Photo'],
            notes: 'Verification completed successfully. No criminal records found.',
            result: 'CLEAR'
          },
          {
            id: 'ver-gps-002',
            reference: 'REF-PC-2025-002',
            type: 'Police Clearance Certificate',
            subject: 'Jane Smith',
            submittedDate: '2025-01-22',
            status: 'Pending',
            documents: ['ID Card', 'Application Form'],
            notes: 'Awaiting fingerprint verification.',
            result: null
          },
          {
            id: 'ver-gps-003',
            reference: 'REF-IR-2025-003',
            type: 'Incident Report',
            subject: 'Accident Report',
            submittedDate: '2025-01-23',
            status: 'Under Review',
            documents: ['ID Card', 'Incident Details', 'Photos'],
            notes: 'Officer assigned to verify incident details.',
            result: null
          },
          {
            id: 'ver-gps-004',
            reference: 'REF-PC-2025-004',
            type: 'Police Clearance Certificate',
            subject: 'Robert Johnson',
            submittedDate: '2025-01-24',
            status: 'Rejected',
            documents: ['ID Card', 'Application Form'],
            notes: 'Incomplete information provided. Missing address history.',
            result: 'REJECTED'
          }
        ];
      case 'hcg':
        return [
          {
            id: 'ver-hcg-001',
            reference: 'REF-CC-2025-001',
            type: 'Court Case History',
            subject: 'Civil Case #12345',
            submittedDate: '2025-01-20',
            status: 'Completed',
            documents: ['Court Reference', 'ID Card', 'Request Form'],
            notes: 'Case history verified and compiled.',
            result: 'VERIFIED'
          },
          {
            id: 'ver-hcg-002',
            reference: 'REF-LS-2025-002',
            type: 'Legal Standing Certificate',
            subject: 'Company XYZ',
            submittedDate: '2025-01-22',
            status: 'Pending',
            documents: ['Company Registration', 'Court Documents'],
            notes: 'Awaiting verification of company registration status.',
            result: null
          }
        ];
      case 'moe':
        return [
          {
            id: 'ver-moe-001',
            reference: 'REF-AC-2025-001',
            type: 'Academic Certificate Verification',
            subject: 'BSc Computer Science - University of Ghana',
            submittedDate: '2025-01-20',
            status: 'Completed',
            documents: ['Certificate Copy', 'ID Card', 'Application Form'],
            notes: 'Certificate verified with the university registrar.',
            result: 'AUTHENTIC'
          },
          {
            id: 'ver-moe-002',
            reference: 'REF-TR-2025-002',
            type: 'Transcript Request',
            subject: 'MBA Program - GIMPA',
            submittedDate: '2025-01-22',
            status: 'Under Review',
            documents: ['Student ID', 'Application Form'],
            notes: 'Request sent to institution for transcript preparation.',
            result: null
          }
        ];
      default:
        return [];
    }
  };

  const verifications = getInstitutionVerifications();
  
  const filteredVerifications = verifications.filter(verification => {
    const statusMatch = statusFilter === 'all' || verification.status === statusFilter;
    const typeMatch = typeFilter === 'all' || verification.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const selectedVerificationData = selectedVerification 
    ? verifications.find(v => v.id === selectedVerification)
    : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'Under Review':
        return <Badge variant="info">Under Review</Badge>;
      case 'Pending':
        return <Badge variant="warning">Pending</Badge>;
      case 'Rejected':
        return <Badge variant="error">Rejected</Badge>;
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
      case 'Pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getResultBadge = (result: string | null) => {
    if (!result) return null;
    
    switch (result) {
      case 'CLEAR':
      case 'VERIFIED':
      case 'AUTHENTIC':
        return <Badge variant="success">{result}</Badge>;
      case 'REJECTED':
        return <Badge variant="error">{result}</Badge>;
      default:
        return <Badge variant="default">{result}</Badge>;
    }
  };

  const uniqueTypes = [...new Set(verifications.map(v => v.type))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Verifications</h1>
          <p className="text-gray-600">Manage and track your verification requests</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowUploadModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload Documents
          </Button>
          <Button onClick={() => setShowNewRequestModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Verification
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search verifications..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <div className="flex space-x-1">
                {['all', 'Completed', 'Under Review', 'Pending', 'Rejected'].map((status) => (
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
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verifications List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Verification Requests ({filteredVerifications.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredVerifications.map((verification) => (
                  <div
                    key={verification.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedVerification === verification.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedVerification(verification.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(verification.status)}
                        <span className="font-medium text-gray-900">{verification.reference}</span>
                      </div>
                      {getStatusBadge(verification.status)}
                    </div>
                    
                    <p className="text-sm font-medium text-gray-900">{verification.type}</p>
                    <p className="text-xs text-gray-600">{verification.subject}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {verification.submittedDate}
                      </span>
                      {verification.result && getResultBadge(verification.result)}
                    </div>
                  </div>
                ))}
                
                {filteredVerifications.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No verifications found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Verification Details */}
        <div className="lg:col-span-2">
          {selectedVerificationData ? (
            <div className="space-y-6">
              {/* Verification Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedVerificationData.type}</CardTitle>
                      <p className="text-gray-600">
                        Reference: {selectedVerificationData.reference}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      {selectedVerificationData.status === 'Completed' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download Certificate
                        </Button>
                      )}
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
                      {getStatusIcon(selectedVerificationData.status)}
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {selectedVerificationData.status}
                      </p>
                      <p className="text-xs text-gray-600">Status</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Calendar className="h-5 w-5 text-blue-600 mx-auto" />
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {selectedVerificationData.submittedDate}
                      </p>
                      <p className="text-xs text-gray-600">Submitted</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <FileText className="h-5 w-5 text-purple-600 mx-auto" />
                      <p className="text-sm font-medium text-gray-900 mt-1">
                        {selectedVerificationData.documents.length}
                      </p>
                      <p className="text-xs text-gray-600">Documents</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      {selectedVerificationData.result ? (
                        getResultBadge(selectedVerificationData.result)
                      ) : (
                        <Badge variant="default">Pending</Badge>
                      )}
                      <p className="text-xs text-gray-600 mt-1">Result</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Subject Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Subject Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Subject</label>
                      <p className="text-gray-900">{selectedVerificationData.subject}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Type</label>
                      <p className="text-gray-900">{selectedVerificationData.type}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Documents */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Submitted Documents</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => setShowUploadModal(true)}>
                      <Upload className="h-4 w-4 mr-1" />
                      Add Document
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedVerificationData.documents.map((document, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <span className="text-gray-900">{document}</span>
                        </div>
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Notes & Comments */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes & Comments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">System Note</span>
                        <span className="text-xs text-gray-500">{selectedVerificationData.submittedDate}</span>
                      </div>
                      <p className="text-gray-600">{selectedVerificationData.notes}</p>
                    </div>
                    
                    {selectedVerificationData.status !== 'Completed' && (
                      <div>
                        <textarea 
                          placeholder="Add a comment or question..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 mb-2"
                        ></textarea>
                        <Button size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Add Comment
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Verification</h3>
                <p className="text-gray-600">Choose a verification request from the list to view details and track progress.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowUploadModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upload Document</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowUploadModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Reference</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Select verification...</option>
                  {verifications.map(verification => (
                    <option 
                      key={verification.id} 
                      value={verification.id}
                      selected={selectedVerification === verification.id}
                    >
                      {verification.reference} - {verification.type}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Select document type...</option>
                  <option value="id">ID Card</option>
                  <option value="application">Application Form</option>
                  <option value="photo">Photograph</option>
                  <option value="certificate">Certificate</option>
                  <option value="other">Other Supporting Document</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 5MB)</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  alert('Document uploaded successfully!');
                  setShowUploadModal(false);
                }}>
                  Upload Document
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Verification Request Modal */}
      {showNewRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowNewRequestModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">New Verification Request</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNewRequestModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Verification Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Select verification type...</option>
                  {user?.institutionId === 'gps' && (
                    <>
                      <option value="police-clearance">Police Clearance Certificate</option>
                      <option value="incident-report">Incident Report</option>
                    </>
                  )}
                  {user?.institutionId === 'hcg' && (
                    <>
                      <option value="court-case">Court Case History</option>
                      <option value="legal-standing">Legal Standing Certificate</option>
                    </>
                  )}
                  {user?.institutionId === 'moe' && (
                    <>
                      <option value="academic-cert">Academic Certificate Verification</option>
                      <option value="transcript">Official Transcript</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Select purpose...</option>
                  <option value="employment">Employment</option>
                  <option value="travel">Travel</option>
                  <option value="education">Education</option>
                  <option value="legal">Legal Proceedings</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Documents</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500 mt-1">PDF, JPG, or PNG (max 5MB)</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowNewRequestModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  alert('Verification request submitted successfully!');
                  setShowNewRequestModal(false);
                }}>
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}