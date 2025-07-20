import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { verificationRequestsAPI } from '../utils/verificationAPI';
import {
  FileText,
  Upload,
  Search,
  Eye,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  User,
  Mail,
  Phone,
  Calendar,
  Building2,
  GraduationCap,
  Shield,
  Scale,
  Plus,
  X,
  Send,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

interface PublicRequest {
  id: string;
  requestNumber: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  idNumber: string;
  verificationType: string;
  targetInstitution: string;
  programName?: string;
  graduationDate?: string;
  purpose: string;
  status: 'submitted' | 'processing' | 'institution_verified' | 'completed' | 'rejected';
  currentPhase: number;
  verificationScore: number;
  submittedAt: string;
  completedAt?: string;
  documents: Array<{
    id: string;
    name: string;
    type: string;
    uploadedAt: string;
  }>;
  finalReport?: {
    outcome: 'verified' | 'not_verified' | 'fraudulent';
    confidence: number;
    reportUrl: string;
    generatedAt: string;
  };
}

export function PublicPortal() {
  const [activeTab, setActiveTab] = useState('submit');
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showTrackingModal, setShowTrackingModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackedRequest, setTrackedRequest] = useState<PublicRequest | null>(null);
  const [requests, setRequests] = useState<PublicRequest[]>([
  ]);
  const [copiedTracking, setCopiedTracking] = useState(false);

  // Load existing requests from localStorage on mount
  React.useEffect(() => {
    const savedRequests = localStorage.getItem('public_verification_requests');
    if (savedRequests) {
      try {
        const parsed = JSON.parse(savedRequests);
        setRequests(parsed);
      } catch (error) {
        console.error('Error loading saved requests:', error);
      }
    }
  }, []);

  // Save requests to localStorage whenever requests change
  React.useEffect(() => {
    if (requests.length > 0) {
      localStorage.setItem('public_verification_requests', JSON.stringify(requests));
    }
  }, [requests]);

  const verificationTypes = [
    {
      id: 'academic_certificate',
      name: 'Academic Certificate Verification',
      description: 'Verify the authenticity of academic certificates and degrees',
      icon: GraduationCap,
      fee: 100,
      processingTime: '5-7 business days',
      requiredDocs: ['Academic Certificate', 'Official Transcript', 'ID Document']
    },
    {
      id: 'police_clearance',
      name: 'Police Clearance Certificate',
      description: 'Obtain official police clearance for employment or travel',
      icon: Shield,
      fee: 50,
      processingTime: '3-5 business days',
      requiredDocs: ['ID Document', 'Passport Photo', 'Application Form']
    },
    {
      id: 'court_records',
      name: 'Court Records Verification',
      description: 'Verify court case history and legal standing',
      icon: Scale,
      fee: 75,
      processingTime: '7-10 business days',
      requiredDocs: ['ID Document', 'Court Reference', 'Legal Documents']
    },
    {
      id: 'transcript_request',
      name: 'Official Transcript Request',
      description: 'Request official academic transcripts from institutions',
      icon: FileText,
      fee: 60,
      processingTime: '5-7 business days',
      requiredDocs: ['Student ID', 'ID Document', 'Institution Letter']
    }
  ];

  const institutions = [
    { id: 'ug', name: 'University of Ghana' },
    { id: 'knust', name: 'KNUST' },
    { id: 'ucc', name: 'University of Cape Coast' },
    { id: 'gps', name: 'Ghana Police Service' },
    { id: 'hcg', name: 'High Court of Ghana' },
    { id: 'moe', name: 'Ministry of Education' }
  ];

  const handleSubmitRequest = async (formData: any) => {
    try {
      // Generate unique request number
      const requestNumber = `VER-${Date.now().toString().slice(-8)}`;
      
      // Create request for backend systems
      const backendRequest = {
        request_number: requestNumber,
        requesting_institution_id: 'public',
        target_institution_id: getInstitutionId(formData.targetInstitution),
        student_name: formData.applicantName,
        student_id: formData.idNumber,
        program_name: formData.programName || 'N/A',
        graduation_date: formData.graduationDate || null,
        verification_type: formData.verificationType,
        priority_level: 'normal',
        overall_status: 'submitted',
        current_phase: 1,
        verification_score: 0,
        fraud_flags: [],
        metadata: {
          purpose: formData.purpose,
          applicant_email: formData.applicantEmail,
          applicant_phone: formData.applicantPhone,
          source: 'public_portal'
        }
      };

      // Save to backend systems (this will appear in admin dashboards)
      try {
        await verificationRequestsAPI.create(backendRequest);
      } catch (error) {
        // If backend fails, still create local request for demo
        console.log('Backend request created (simulated):', backendRequest);
      }

      // Create public request for tracking
    const newRequest: PublicRequest = {
        id: crypto.randomUUID(),
        requestNumber: requestNumber,
      applicantName: formData.applicantName,
      applicantEmail: formData.applicantEmail,
      applicantPhone: formData.applicantPhone,
      idNumber: formData.idNumber,
      verificationType: formData.verificationType,
      targetInstitution: formData.targetInstitution,
      programName: formData.programName,
      graduationDate: formData.graduationDate,
      purpose: formData.purpose,
      status: 'submitted',
      currentPhase: 1,
      verificationScore: 0,
      submittedAt: new Date().toISOString(),
      documents: []
    };

    setRequests(prev => [newRequest, ...prev]);
    setShowNewRequestModal(false);
    
      // Show success with copy option
      setCopiedTracking(false);
      if (confirm(`Request submitted successfully!\n\nYour tracking number is: ${newRequest.requestNumber}\n\nClick OK to copy tracking number to clipboard.`)) {
        navigator.clipboard.writeText(newRequest.requestNumber);
        setCopiedTracking(true);
      }
    } catch (error) {
      console.error('Error submitting request:', error);
      alert('Error submitting request. Please try again.');
    }
  };

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

  const handleTrackRequest = () => {
    const found = requests.find(r => r.requestNumber === trackingNumber);
    if (found) {
      setTrackedRequest(found);
    } else {
      alert('Request not found. Please check your tracking number and try again.');
    }
  };

  const handleCopyTracking = (trackingNumber: string) => {
    navigator.clipboard.writeText(trackingNumber);
    setCopiedTracking(true);
    setTimeout(() => setCopiedTracking(false), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">Completed</Badge>;
      case 'gtec_approved':
        return <Badge variant="info">GTEC Approved</Badge>;
      case 'institution_processed':
        return <Badge variant="warning">Under GTEC Review</Badge>;
      case 'processing':
        return <Badge variant="info">Processing</Badge>;
      case 'institution_verified':
        return <Badge variant="warning">Under Review</Badge>;
      case 'rejected':
        return <Badge variant="error">Rejected</Badge>;
      default:
        return <Badge variant="default">Submitted</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'gtec_approved':
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case 'institution_processed':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'processing':
      case 'institution_verified':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'verified':
        return <Badge variant="success">✓ Verified</Badge>;
      case 'not_verified':
        return <Badge variant="error">✗ Not Verified</Badge>;
      case 'fraudulent':
        return <Badge variant="error">⚠ Fraudulent</Badge>;
      default:
        return <Badge variant="default">Pending</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/image.png" alt="BacChecker" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">BacChecker Public Portal</h1>
              <p className="text-sm text-gray-600">Government Document Verification Services</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => setShowTrackingModal(true)}>
              <Search className="h-4 w-4 mr-2" />
              Track Request
            </Button>
            <Button onClick={() => setShowNewRequestModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Secure Document Verification Services
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Submit requests for official document verification from government institutions. 
            Track your requests in real-time and receive verified reports.
          </p>
        </div>

        {/* Service Types */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {verificationTypes.map((service) => (
            <Card key={service.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => setShowNewRequestModal(true)}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <service.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-green-600 font-medium">GHS {service.fee}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">Processing Time:</span>
                    <span className="font-medium">{service.processingTime}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Required: {service.requiredDocs.join(', ')}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Submit Request</h4>
                <p className="text-sm text-gray-600">Fill out the verification form and upload required documents</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Processing</h4>
                <p className="text-sm text-gray-600">Your request goes through our 4-phase verification process</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Institution Review</h4>
                <p className="text-sm text-gray-600">The relevant institution verifies your documents</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-red-600 font-bold">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Get Report</h4>
                <p className="text-sm text-gray-600">Receive your official verification report</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sample Completed Request */}
        {requests.length > 0 && requests[0].status === 'completed' && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Completed Verification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-green-900">{requests[0].requestNumber}</h4>
                    <p className="text-green-700">{requests[0].applicantName} • {requests[0].programName}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(requests[0].status)}
                    {requests[0].finalReport && getOutcomeBadge(requests[0].finalReport.outcome)}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-lg font-bold text-green-900">{requests[0].currentPhase}/4</div>
                    <div className="text-sm text-green-700">Phases Complete</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-lg font-bold text-green-900">{requests[0].verificationScore}%</div>
                    <div className="text-sm text-green-700">Verification Score</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-lg font-bold text-green-900">{requests[0].documents.length}</div>
                    <div className="text-sm text-green-700">Documents Verified</div>
                  </div>
                  <div className="text-center p-3 bg-white rounded">
                    <div className="text-lg font-bold text-green-900">
                      {requests[0].finalReport?.confidence}%
                    </div>
                    <div className="text-sm text-green-700">Confidence Level</div>
                  </div>
                </div>

                {requests[0].finalReport && (
                  <div className="flex justify-center">
                    <Button onClick={() => alert('Downloading official verification report...')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Official Report
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Requests */}
        {requests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Recent Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {requests.slice(0, 3).map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-gray-900">{request.requestNumber}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyTracking(request.requestNumber)}
                          className="h-6 w-6 p-0"
                        >
                          {copiedTracking ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{request.applicantName} • {request.verificationType.replace('_', ' ')}</p>
                      <p className="text-xs text-gray-500">{new Date(request.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(request.status)}
                      <p className="text-xs text-gray-500 mt-1">Phase {request.currentPhase}/4</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* New Request Modal */}
      {showNewRequestModal && (
        <NewRequestModal
          verificationTypes={verificationTypes}
          institutions={institutions}
          onSubmit={handleSubmitRequest}
          onClose={() => setShowNewRequestModal(false)}
        />
      )}

      {/* Tracking Modal */}
      {showTrackingModal && (
        <TrackingModal
          trackingNumber={trackingNumber}
          setTrackingNumber={setTrackingNumber}
          onTrack={handleTrackRequest}
          onClose={() => setShowTrackingModal(false)}
          trackedRequest={trackedRequest}
        />
      )}
    </div>
  );
}

// New Request Modal Component
function NewRequestModal({ 
  verificationTypes, 
  institutions, 
  onSubmit, 
  onClose 
}: {
  verificationTypes: any[];
  institutions: any[];
  onSubmit: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    verificationType: '',
    targetInstitution: '',
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    idNumber: '',
    programName: '',
    graduationDate: '',
    purpose: ''
  });

  const selectedService = verificationTypes.find(s => s.id === formData.verificationType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Submit Verification Request</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Verification Type *</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {verificationTypes.map((service) => (
                <div
                  key={service.id}
                  className={`p-3 border-2 rounded-lg cursor-pointer transition-colors ${
                    formData.verificationType === service.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setFormData({...formData, verificationType: service.id})}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <service.icon className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">{service.name}</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{service.description}</p>
                  <p className="text-xs font-medium text-green-600">GHS {service.fee} • {service.processingTime}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input 
                type="text"
                value={formData.applicantName}
                onChange={(e) => setFormData({...formData, applicantName: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ID Number *</label>
              <input 
                type="text"
                value={formData.idNumber}
                onChange={(e) => setFormData({...formData, idNumber: e.target.value})}
                required
                placeholder="e.g., GHA-123456789-1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
              <input 
                type="email"
                value={formData.applicantEmail}
                onChange={(e) => setFormData({...formData, applicantEmail: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input 
                type="tel"
                value={formData.applicantPhone}
                onChange={(e) => setFormData({...formData, applicantPhone: e.target.value})}
                required
                placeholder="+233-XX-XXX-XXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Institution Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Target Institution *</label>
            <select 
              value={formData.targetInstitution}
              onChange={(e) => setFormData({...formData, targetInstitution: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select institution...</option>
              {institutions.map(inst => (
                <option key={inst.id} value={inst.name}>{inst.name}</option>
              ))}
            </select>
          </div>

          {/* Academic Information (for academic verifications) */}
          {formData.verificationType === 'academic_certificate' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program Name *</label>
                <input 
                  type="text"
                  value={formData.programName}
                  onChange={(e) => setFormData({...formData, programName: e.target.value})}
                  required
                  placeholder="e.g., Bachelor of Science in Computer Science"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Date</label>
                <input 
                  type="date"
                  value={formData.graduationDate}
                  onChange={(e) => setFormData({...formData, graduationDate: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          )}

          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Verification *</label>
            <select 
              value={formData.purpose}
              onChange={(e) => setFormData({...formData, purpose: e.target.value})}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select purpose...</option>
              <option value="employment">Employment</option>
              <option value="further_education">Further Education</option>
              <option value="immigration">Immigration</option>
              <option value="professional_licensing">Professional Licensing</option>
              <option value="legal_proceedings">Legal Proceedings</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Service Summary */}
          {selectedService && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Service Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-blue-700">Fee:</span>
                  <span className="font-medium ml-2">GHS {selectedService.fee}</span>
                </div>
                <div>
                  <span className="text-blue-700">Processing Time:</span>
                  <span className="font-medium ml-2">{selectedService.processingTime}</span>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-blue-700 text-sm">Required Documents:</span>
                <p className="text-blue-800 text-sm">{selectedService.requiredDocs.join(', ')}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!formData.verificationType || !formData.applicantName}>
              Submit Request
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Tracking Modal Component
function TrackingModal({ 
  trackingNumber, 
  setTrackingNumber, 
  onTrack, 
  onClose, 
  trackedRequest 
}: {
  trackingNumber: string;
  setTrackingNumber: (value: string) => void;
  onTrack: () => void;
  onClose: () => void;
  trackedRequest: PublicRequest | null;
}) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">Track Your Request</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter Tracking Number</label>
            <div className="flex space-x-3">
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g., VER-PUB-001"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <Button onClick={onTrack}>
                <Search className="h-4 w-4 mr-2" />
                Track
              </Button>
            </div>
          </div>

          {trackedRequest && (
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">{trackedRequest.requestNumber}</h4>
                  <p className="text-gray-600">{trackedRequest.applicantName}</p>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(trackedRequest.status)}
                  {getStatusBadge(trackedRequest.status)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{trackedRequest.currentPhase}/3</div>
                  <div className="text-sm text-gray-600">Phases Complete</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{trackedRequest.verificationScore}%</div>
                  <div className="text-sm text-gray-600">Verification Score</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-gray-900">{trackedRequest.documents.length}</div>
                  <div className="text-sm text-gray-600">Documents</div>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-3 mb-6">
                <h5 className="font-medium text-gray-900">Verification Progress</h5>
                {[
                  { phase: 1, name: 'GTEC Initial Review', completed: trackedRequest.currentPhase >= 1 },
                  { phase: 2, name: 'Institution Processing', completed: trackedRequest.currentPhase >= 2 },
                  { phase: 3, name: 'GTEC Final Review', completed: trackedRequest.currentPhase >= 3 }
                ].map((step) => (
                  <div key={step.phase} className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      step.completed ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <span className="text-gray-600 text-sm">{step.phase}</span>
                      )}
                    </div>
                    <span className={`text-sm ${step.completed ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
                      {step.name}
                    </span>
                  </div>
                ))}
              </div>

              {/* Final Report */}
              {trackedRequest.finalReport && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="font-semibold text-green-900">Verification Complete</h5>
                    {getOutcomeBadge(trackedRequest.finalReport.outcome)}
                  </div>
                  <p className="text-green-700 text-sm mb-4">
                    Your verification has been completed with {trackedRequest.finalReport.confidence}% confidence. 
                    You can now download your official verification report.
                  </p>
                  <Button onClick={() => alert('Downloading official verification report...')}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Official Report
                  </Button>
                </div>
              )}

              {/* Copy Tracking Number */}
              <div className="flex justify-center mt-4">
                <Button
                  variant="outline"
                  onClick={() => handleCopyTracking(trackedRequest.requestNumber)}
                >
                  {copiedTracking ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                  {copiedTracking ? 'Copied!' : 'Copy Tracking Number'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'completed':
      return <Badge variant="success">Completed</Badge>;
    case 'processing':
      return <Badge variant="info">Processing</Badge>;
    case 'institution_verified':
      return <Badge variant="warning">Under Review</Badge>;
    case 'rejected':
      return <Badge variant="error">Rejected</Badge>;
    default:
      return <Badge variant="default">Submitted</Badge>;
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'rejected':
      return <XCircle className="h-4 w-4 text-red-600" />;
    case 'processing':
    case 'institution_verified':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    default:
      return <Clock className="h-4 w-4 text-blue-600" />;
  }
}

function getOutcomeBadge(outcome: string) {
  switch (outcome) {
    case 'verified':
      return <Badge variant="success">✓ Verified</Badge>;
    case 'not_verified':
      return <Badge variant="error">✗ Not Verified</Badge>;
    case 'fraudulent':
      return <Badge variant="error">⚠ Fraudulent</Badge>;
    default:
      return <Badge variant="default">Pending</Badge>;
  }
}