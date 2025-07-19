import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useAuth } from '../../context/AuthContext';
import {
  HelpCircle,
  FileText,
  Download,
  Play,
  MessageSquare,
  Mail,
  Phone,
  Clock,
  Bell,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
  Search,
  BookOpen,
  Video,
  X
} from 'lucide-react';

export function UserHelp() {
  const { state } = useAuth();
  const { user } = state;
  const [activeTab, setActiveTab] = useState('guides');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);

  const tabs = [
    { id: 'guides', name: 'User Guides', icon: BookOpen },
    { id: 'faq', name: 'FAQs', icon: HelpCircle },
    { id: 'contact', name: 'Contact Support', icon: MessageSquare }
  ];

  // Get institution-specific guides based on user's institution
  const getInstitutionGuides = () => {
    switch (user?.institutionId) {
      case 'gps':
        return [
          {
            id: 'guide-police-1',
            title: 'Police Clearance Certificate Guide',
            description: 'How to process police clearance certificate requests',
            content: 'This guide covers the complete process for handling police clearance certificate requests...',
            category: 'Verification'
          },
          {
            id: 'guide-police-2',
            title: 'Incident Report Processing',
            description: 'Steps for processing incident report requests',
            content: 'Learn how to properly document and process incident report requests...',
            category: 'Verification'
          },
          {
            id: 'guide-police-3',
            title: 'Document Upload Guidelines',
            description: 'Best practices for uploading police documents',
            content: 'Follow these guidelines to ensure proper document handling and security...',
            category: 'Documents'
          }
        ];
      case 'hcg':
        return [
          {
            id: 'guide-court-1',
            title: 'Court Case Verification Guide',
            description: 'How to verify court case records',
            content: 'This guide covers the complete process for verifying court case records...',
            category: 'Verification'
          },
          {
            id: 'guide-court-2',
            title: 'Legal Document Processing',
            description: 'Steps for processing legal document requests',
            content: 'Learn how to properly handle and process legal document requests...',
            category: 'Documents'
          }
        ];
      case 'moe':
        return [
          {
            id: 'guide-edu-1',
            title: 'Academic Certificate Verification',
            description: 'How to verify academic certificates',
            content: 'This guide covers the complete process for verifying academic certificates...',
            category: 'Verification'
          },
          {
            id: 'guide-edu-2',
            title: 'Transcript Request Processing',
            description: 'Steps for processing transcript requests',
            content: 'Learn how to properly handle and process transcript requests...',
            category: 'Documents'
          }
        ];
      default:
        return [];
    }
  };

  const institutionGuides = getInstitutionGuides();

  // General guides for all institutions
  const generalGuides = [
    {
      id: 'guide-general-1',
      title: 'BacChecker User Manual',
      description: 'Complete guide to using the BacChecker platform',
      type: 'PDF',
      size: '3.5 MB',
      downloadUrl: '/guides/user-manual.pdf'
    },
    {
      id: 'guide-general-2',
      title: 'Document Upload Tutorial',
      description: 'How to properly upload and manage documents',
      type: 'Video',
      duration: '5 min',
      videoUrl: '/tutorials/document-upload'
    },
    {
      id: 'guide-general-3',
      title: 'Verification Process Overview',
      description: 'Understanding the verification workflow',
      type: 'PDF',
      size: '1.8 MB',
      downloadUrl: '/guides/verification-process.pdf'
    }
  ];

  // FAQs based on institution
  const getInstitutionFAQs = () => {
    const commonFAQs = [
      {
        id: 'faq-1',
        question: 'How do I submit a new verification request?',
        answer: 'To submit a new verification request, click the "New Verification" button on your dashboard or verifications page. Fill out the required information and upload any necessary documents.'
      },
      {
        id: 'faq-2',
        question: 'How long does the verification process take?',
        answer: 'Verification processing times vary depending on the type of request. Most verifications are completed within 3-7 business days.'
      },
      {
        id: 'faq-3',
        question: 'How do I check the status of my verification?',
        answer: 'You can check the status of your verification on the Verifications page. Each verification will show its current status (Pending, Under Review, Completed, or Rejected).'
      },
      {
        id: 'faq-4',
        question: 'What should I do if my verification is rejected?',
        answer: 'If your verification is rejected, review the notes provided for the reason. You can submit a new verification with the corrected information or additional documents.'
      }
    ];

    switch (user?.institutionId) {
      case 'gps':
        return [
          ...commonFAQs,
          {
            id: 'faq-police-1',
            question: 'What documents are required for a Police Clearance Certificate?',
            answer: 'For a Police Clearance Certificate, you need to upload a valid ID card, a recent passport-sized photograph, and a completed application form.'
          },
          {
            id: 'faq-police-2',
            question: 'How do I report an incident for verification?',
            answer: 'To report an incident, select "Incident Report" as the verification type, provide all relevant details, and upload any supporting evidence such as photographs or witness statements.'
          }
        ];
      case 'hcg':
        return [
          ...commonFAQs,
          {
            id: 'faq-court-1',
            question: 'How do I request a court case history?',
            answer: 'To request a court case history, you need to provide the case reference number, court location, and any relevant identification documents.'
          },
          {
            id: 'faq-court-2',
            question: 'What is a Legal Standing Certificate?',
            answer: 'A Legal Standing Certificate confirms the legal status of an individual or organization in relation to court proceedings. It verifies whether there are any pending cases or judgments.'
          }
        ];
      case 'moe':
        return [
          ...commonFAQs,
          {
            id: 'faq-edu-1',
            question: 'How do I verify an academic certificate?',
            answer: 'To verify an academic certificate, you need to upload a scanned copy of the certificate, provide the institution name, graduation year, and student ID if available.'
          },
          {
            id: 'faq-edu-2',
            question: 'Can I request transcripts for multiple institutions?',
            answer: 'Yes, you can submit separate transcript requests for each institution. Each request will be processed individually.'
          }
        ];
      default:
        return commonFAQs;
    }
  };

  const faqs = getInstitutionFAQs();

  const filteredGuides = [...institutionGuides, ...generalGuides].filter(guide =>
    'title' in guide && guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    'description' in guide && guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredFAQs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">Find guides and get help with using the system</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowTicketModal(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Submit Support Ticket
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="py-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides, FAQs, and help articles..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* User Guides Tab */}
      {activeTab === 'guides' && (
        <div className="space-y-6">
          {/* Institution-specific guides */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {user?.institutionId === 'gps' ? 'Police Service' : 
               user?.institutionId === 'hcg' ? 'Court System' : 
               'Education Ministry'} Guides
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {institutionGuides.filter(guide => 
                guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guide.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((guide) => (
                <Card key={guide.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{guide.title}</CardTitle>
                        <Badge variant="default" size="sm" className="mt-2">
                          {guide.category}
                        </Badge>
                      </div>
                      <HelpCircle className="h-5 w-5 text-gray-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{guide.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Read Guide
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* General guides */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">General Guides</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {generalGuides.filter(guide => 
                guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                guide.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).map((guide) => (
                <Card key={guide.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        {guide.type === 'PDF' && <FileText className="h-6 w-6 text-blue-600" />}
                        {guide.type === 'Video' && <Video className="h-6 w-6 text-blue-600" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                        <p className="text-gray-600 mb-3">{guide.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Type: {guide.type}</span>
                            <span>
                              {guide.size && `Size: ${guide.size}`}
                              {guide.duration && `Duration: ${guide.duration}`}
                            </span>
                          </div>
                          <Button size="sm">
                            {guide.type === 'PDF' && <Download className="h-4 w-4 mr-2" />}
                            {guide.type === 'Video' && <Play className="h-4 w-4 mr-2" />}
                            {guide.type === 'PDF' ? 'Download' : 'Watch'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* FAQs Tab */}
      {activeTab === 'faq' && (
        <div className="space-y-4">
          {filteredFAQs.map((faq) => (
            <Card key={faq.id}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <HelpCircle className="h-5 w-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <HelpCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No FAQs Found</h3>
              <p className="text-gray-600">Try adjusting your search or contact support for help.</p>
            </div>
          )}
        </div>
      )}

      {/* Contact Support Tab */}
      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <MessageSquare className="h-6 w-6 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Submit Support Ticket</h4>
                  <p className="text-sm text-gray-600">Get help with technical issues</p>
                </div>
                <Button size="sm" onClick={() => setShowTicketModal(true)}>
                  Submit
                </Button>
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <Mail className="h-6 w-6 text-red-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Email Support</h4>
                  <p className="text-sm text-gray-600">support@bacchecker.com</p>
                </div>
                <Button size="sm" variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>

              <div className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                <Phone className="h-6 w-6 text-green-600" />
                <div>
                  <h4 className="font-medium text-gray-900">Phone Support</h4>
                  <p className="text-sm text-gray-600">+233-302-XXXXXX</p>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Support Hours</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span className="font-medium text-gray-900">Business Hours</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="font-medium">8:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-medium">9:00 AM - 1:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium text-green-900">Currently Available</span>
                  </div>
                  <p className="text-sm text-green-700 mt-1">
                    Our support team is online and ready to help
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Submit Ticket Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTicketModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Submit Support Ticket</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowTicketModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Type</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="technical">Technical Issue</option>
                  <option value="account">Account Access</option>
                  <option value="verification">Verification Problem</option>
                  <option value="document">Document Upload Issue</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"></textarea>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowTicketModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => {
                  alert('Support ticket submitted successfully! A support representative will contact you soon.');
                  setShowTicketModal(false);
                }}>
                  Submit Ticket
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}