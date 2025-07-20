import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
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
  RefreshCw
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
    {
      id: 'req-demo-1',
      requestNumber: 'VER-PUB-001',
      applicantName: 'John Doe',
      applicantEmail: 'john.doe@email.com',
      applicantPhone: '+233-24-123-4567',
      idNumber: 'GHA-123456789-1',
      verificationType: 'academic_certificate',
      targetInstitution: 'University of Ghana',
      programName: 'Bachelor of Science in Computer Science',
      graduationDate: '2023-06-15',
      purpose: 'Employment verification',
      status: 'completed',
      currentPhase: 4,
      verificationScore: 92,
      submittedAt: new Date(Date.now() - 172800000).toISOString(),
      completedAt: new Date().toISOString(),
      documents: [
        { id: 'doc-1', name: 'certificate.pdf', type: 'Academic Certificate', uploadedAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 'doc-2', name: 'transcript.pdf', type: 'Official Transcript', uploadedAt: new Date(Date.now() - 172800000).toISOString() },
        { id: 'doc-3', name: 'id_card.pdf', type: 'ID Document', uploadedAt: new Date(Date.now() - 172800000).toISOString() }
      ],
      finalReport: {
        outcome: 'verified',
        confidence: 92,
        reportUrl: '/reports/VER-PUB-001.pdf',
        generatedAt: new Date().toISOString()
      }
    }
  ]);

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

  const handleSubmitRequest = (formData: any) => {
    const newRequest: PublicRequest = {
      id: `req-${Date.now()}`,
      requestNumber: `VER-PUB-${String(requests.length + 1).padStart(3, '0')}`,
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
    
    alert(`Request submitted successfully!\n\nYour tracking number is: ${newRequest.requestNumber}\n\nYou will receive email updates as your request progresses through verification.`);
  };

  const handleTrackRequest = () => {
    const found = requests.find(r => r.requestNumber === trackingNumber);
    if (found) {
      setTrackedRequest(found);
    } else {
      alert('Request not found. Please check your tracking number and try again.');
    }
  };

  const getStatusBadge = (status: string) => {
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
  };

  const getStatusIcon = (status: string) => {
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
        {requests.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Sample Completed Verification</CardTitle>
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
                  <div className="text-lg font-bold text-gray-900">{trackedRequest.currentPhase}/4</div>
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
                  { phase: 1, name: 'Initial Processing', completed: trackedRequest.currentPhase >= 1 },
                  { phase: 2, name: 'Institution Verification', completed: trackedRequest.currentPhase >= 2 },
                  { phase: 3, name: 'Document Authentication', completed: trackedRequest.currentPhase >= 3 },
                  { phase: 4, name: 'Quality Assurance', completed: trackedRequest.currentPhase >= 4 }
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