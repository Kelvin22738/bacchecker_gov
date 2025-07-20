// src/pages/PublicPortal.tsx - REPLACE ENTIRE FILE
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  FileText,
  Upload,
  CheckCircle,
  Clock,
  Shield,
  Building2,
  Mail,
  Phone,
  MapPin,
  Search,
  Download,
  AlertCircle,
  User,
  GraduationCap,
  Calendar,
  X,
  Eye,
  Loader2
} from 'lucide-react';
import { VerificationWorkflowAPI } from '../utils/verificationWorkflowAPI';
import { supabase } from '../utils/supabase';

export function PublicPortal() {
  const [activeTab, setActiveTab] = useState('submit');
  const [showForm, setShowForm] = useState(false);
  const [institutions, setInstitutions] = useState<any[]>([]);
  const [institutionsLoading, setInstitutionsLoading] = useState(true);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantEmail: '',
    applicantPhone: '',
    idNumber: '',
    targetInstitution: '',
    programName: '',
    graduationDate: '',
    verificationType: '',
    purpose: '',
    documents: [] as File[]
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submittedRequestNumber, setSubmittedRequestNumber] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Load institutions dynamically from Supabase
  useEffect(() => {
    const loadInstitutions = async () => {
      try {
        const { data, error } = await supabase
          .from('tertiary_institutions')
          .select('id, name, acronym, institution_type')
          .eq('onboarding_status', 'completed')
          .in('institution_type', ['university', 'technical_university', 'private_university'])
          .order('name');

        if (error) {
          console.error('Error loading institutions:', error);
          // Fallback to the corrected hardcoded list with real UUIDs
          setInstitutions([
            {
              id: 'bd5610c1e8-941a-4f51-ab77-882656fd7f17',
              name: 'University of Ghana',
              acronym: 'UG'
            },
            {
              id: 'b066613d3-0837-49e9-82c2-23d1caa1df11',
              name: 'Kwame Nkrumah University of Science and Technology',
              acronym: 'KNUST'
            },
            {
              id: '2d78f1ff-bc42-460b-bbf3-2fb61eb8ca9f',
              name: 'University of Cape Coast',
              acronym: 'UCC'
            }
          ]);
        } else {
          setInstitutions(data || []);
        }
      } catch (error) {
        console.error('Error loading institutions:', error);
        // Fallback to hardcoded list
        setInstitutions([
          {
            id: 'bd5610c1e8-941a-4f51-ab77-882656fd7f17',
            name: 'University of Ghana',
            acronym: 'UG'
          },
          {
            id: 'b066613d3-0837-49e9-82c2-23d1caa1df11',
            name: 'Kwame Nkrumah University of Science and Technology',
            acronym: 'KNUST'
          }
        ]);
      } finally {
        setInstitutionsLoading(false);
      }
    };

    loadInstitutions();
  }, []);

  const verificationTypes = [
    { value: 'academic_transcript', label: 'Academic Transcript' },
    { value: 'certificate', label: 'Certificate Verification' },
    { value: 'diploma', label: 'Diploma Verification' },
    { value: 'degree', label: 'Degree Verification' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({
        ...formData,
        documents: Array.from(e.target.files)
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.applicantName || !formData.applicantEmail || !formData.targetInstitution || 
        !formData.programName || !formData.verificationType) {
      setSubmitError('Please fill in all required fields');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    
    try {
      const requestNumber = VerificationWorkflowAPI.generateRequestNumber();
      
      // Create verification request with NULL requesting_institution_id for public submissions
      const newRequest = {
        request_number: requestNumber,
        requesting_institution_id: null, // NULL for public submissions
        target_institution_id: formData.targetInstitution,
        student_name: formData.applicantName,
        student_id: formData.idNumber || null,
        program_name: formData.programName,
        graduation_date: formData.graduationDate || null,
        verification_type: formData.verificationType as any,
        current_phase: 1,
        overall_status: 'submitted' as any,
        priority_level: 'normal' as any,
        fraud_flags: [],
        submitted_at: new Date().toISOString(),
        metadata: {
          purpose: formData.purpose,
          applicant_email: formData.applicantEmail,
          applicant_phone: formData.applicantPhone,
          source: 'public_portal',
          is_public_submission: true,
          documents: formData.documents.map(file => ({
            id: `doc_${Date.now()}_${Math.random()}`,
            filename: file.name,
            file_type: file.type,
            uploaded_at: new Date().toISOString(),
            uploaded_by: formData.applicantEmail,
            document_type: 'supporting_document' as any
          }))
        }
      };

      // Save to Supabase
      const createdRequest = await VerificationWorkflowAPI.createRequest(newRequest);
      
      if (createdRequest) {
        // Show success
        setSubmittedRequestNumber(requestNumber);
        setSubmitSuccess(true);
        setShowForm(false);
        
        // Reset form
        setFormData({
          applicantName: '',
          applicantEmail: '',
          applicantPhone: '',
          idNumber: '',
          targetInstitution: '',
          programName: '',
          graduationDate: '',
          verificationType: '',
          purpose: '',
          documents: []
        });

        // Try to create notification (non-blocking)
        try {
          await VerificationWorkflowAPI.createNotification({
            user_id: 'gtec_admin',
            type: 'info',
            title: 'New Verification Request',
            message: `New verification request ${requestNumber} submitted for ${formData.applicantName}.`,
            action_url: '/admin/verification',
            action_label: 'Review Request',
            request_id: createdRequest.id
          });
        } catch (notificationError) {
          // Don't fail the whole submission if notification fails
          console.warn('Failed to create notification (non-blocking):', notificationError);
        }
      } else {
        throw new Error('Failed to create verification request');
      }

    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitError('Error submitting request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const resetSuccess = () => {
    setSubmitSuccess(false);
    setSubmittedRequestNumber('');
  };

  const resetError = () => {
    setSubmitError('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white" id="public-portal">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              GTEC Document Verification Portal
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Secure, fast, and reliable verification of academic credentials
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-black hover:bg-white hover:text-blue-600"
                onClick={() => {
                  setActiveTab('submit');
                  setShowForm(true);
                  resetError();
                }}
              >
                <FileText className="h-5 w-5 mr-2" />
                Submit Verification Request
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-black hover:bg-white hover:text-blue-600"
                onClick={() => window.location.href = '/check-status'}
              >
                <Search className="h-5 w-5 mr-2" />
                Check Request Status
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Success Message */}
        {submitSuccess && (
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">
                      Request Submitted Successfully!
                    </h3>
                    <p className="text-green-700">
                      Your verification request has been submitted and is now under review by GTEC.
                    </p>
                    <p className="text-green-800 font-medium mt-2">
                      Request Number: <span className="font-bold">{submittedRequestNumber}</span>
                    </p>
                    <p className="text-green-600 text-sm mt-1">
                      You will receive notifications about your request status via email.
                    </p>
                  </div>
                </div>
                <Button variant="ghost" onClick={resetSuccess}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-4 flex space-x-3">
                <Button onClick={() => window.location.href = '/check-status'}>
                  <Eye className="h-4 w-4 mr-2" />
                  Track Your Request
                </Button>
                <Button variant="outline" onClick={() => setShowForm(true)}>
                  Submit Another Request
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error Message */}
        {submitError && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">
                      Submission Failed
                    </h3>
                    <p className="text-red-700">{submitError}</p>
                  </div>
                </div>
                <Button variant="ghost" onClick={resetError}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Verification Form */}
        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Submit Verification Request</CardTitle>
                <Button variant="ghost" onClick={() => setShowForm(false)} disabled={submitting}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="applicantName"
                        value={formData.applicantName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="applicantEmail"
                        value={formData.applicantEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="applicantPhone"
                        value={formData.applicantPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Student ID Number
                      </label>
                      <input
                        type="text"
                        name="idNumber"
                        value={formData.idNumber}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Institution <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="targetInstitution"
                        value={formData.targetInstitution}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={submitting || institutionsLoading}
                      >
                        <option value="">
                          {institutionsLoading ? 'Loading institutions...' : 'Select Institution'}
                        </option>
                        {institutions.map((institution) => (
                          <option key={institution.id} value={institution.id}>
                            {institution.name} {institution.acronym && `(${institution.acronym})`}
                          </option>
                        ))}
                      </select>
                      {institutionsLoading && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center">
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Loading available institutions...
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Program/Course Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="programName"
                        value={formData.programName}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Bachelor of Science in Computer Science"
                        required
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Graduation Date
                      </label>
                      <input
                        type="date"
                        name="graduationDate"
                        value={formData.graduationDate}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="verificationType"
                        value={formData.verificationType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                        disabled={submitting}
                      >
                        <option value="">Select Type</option>
                        {verificationTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose of Verification
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Employment, Further Studies, Professional Certification..."
                    disabled={submitting}
                  />
                </div>

                {/* Document Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Supporting Documents
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      disabled={submitting}
                    />
                    <label
                      htmlFor="file-upload"
                      className={`cursor-pointer text-blue-600 hover:text-blue-500 ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      Click to upload files
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      PDF, JPG, PNG, DOC files up to 10MB each
                    </p>
                    {formData.documents.length > 0 && (
                      <div className="mt-4 text-left">
                        <p className="text-sm font-medium text-gray-700 mb-2">Selected files:</p>
                        <ul className="text-sm text-gray-600">
                          {formData.documents.map((file, index) => (
                            <li key={index}>• {file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || institutionsLoading}
                    className="min-w-[120px]"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Request'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* How It Works */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>How Verification Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
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
                <h4 className="font-semibold text-gray-900 mb-2">GTEC Review</h4>
                <p className="text-sm text-gray-600">GTEC reviews your request and forwards it to the institution</p>
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
                <p className="text-sm text-gray-600">Receive your official verification report from GTEC</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Supported Institutions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Supported Institutions</CardTitle>
          </CardHeader>
          <CardContent>
            {institutionsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                <span className="text-gray-600">Loading institutions...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {institutions.map((institution) => (
                  <div key={institution.id} className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Building2 className="h-8 w-8 text-blue-500" />
                      <div>
                      <h4 className="font-semibold text-gray-900">{institution.name}</h4>
                      <p className="text-sm text-gray-600">
                        {institution.acronym && `${institution.acronym} • `}
                        Educational Institution
                      </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <Phone className="h-6 w-6 text-blue-500" />
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600">+233 XXX XXX XXX</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-6 w-6 text-blue-500" />
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">verification@gtec.edu.gh</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-6 w-6 text-blue-500" />
                <div>
                  <h4 className="font-semibold text-gray-900">Address</h4>
                  <p className="text-gray-600">GTEC Head Office, Accra</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}