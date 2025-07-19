import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  Bell,
  Plus,
  Eye,
  Download,
  MessageSquare,
  Upload,
  Calendar,
  Filter,
  Search,
  X,
  GraduationCap,
  BookOpen,
  Users,
  Award,
  Settings,
  Home,
  User,
  HelpCircle
} from 'lucide-react';

export function UserDashboard() {
  const { state } = useAuth();
  const { user } = state;
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const isGTECInstitution = user?.role === 'tertiary_institution_user';

  // Show welcome modal for GTEC institutions on first load
  useEffect(() => {
    if (isGTECInstitution) {
      const hasSeenWelcome = localStorage.getItem(`welcome_seen_${user?.institutionId}`);
      if (!hasSeenWelcome) {
        setShowWelcomeModal(true);
      }
    }
  }, [isGTECInstitution, user?.institutionId]);

  const handleCloseWelcome = () => {
    if (user?.institutionId) {
      localStorage.setItem(`welcome_seen_${user.institutionId}`, 'true');
    }
    setShowWelcomeModal(false);
  };

  // Mock data for user dashboard
  const userStats = {
    totalVerifications: isGTECInstitution ? 156 : 24,
    pendingVerifications: isGTECInstitution ? 12 : 5,
    completedVerifications: isGTECInstitution ? 142 : 18,
    rejectedVerifications: isGTECInstitution ? 2 : 1
  };

  const getInstitutionName = () => {
    switch (user?.institutionId) {
      case 'ug':
        return 'University of Ghana';
      case 'knust':
        return 'KNUST';
      case 'gps':
        return 'Ghana Police Service';
      default:
        return 'Institution';
    }
  };

  const recentVerifications = isGTECInstitution ? [
    {
      id: 'ver-001',
      type: 'Academic Certificate Verification',
      submittedDate: '2025-01-20',
      status: 'Completed',
      reference: 'REF-AC-2025-001'
    },
    {
      id: 'ver-002',
      type: 'Transcript Request',
      submittedDate: '2025-01-22',
      status: 'Pending',
      reference: 'REF-TR-2025-002'
    },
    {
      id: 'ver-003',
      type: 'Course Accreditation Verification',
      submittedDate: '2025-01-23',
      status: 'Under Review',
      reference: 'REF-CA-2025-003'
    },
    {
      id: 'ver-004',
      type: 'Faculty Verification',
      submittedDate: '2025-01-24',
      status: 'Completed',
      reference: 'REF-FV-2025-004'
    }
  ] : [
    {
      id: 'ver-001',
      type: 'Police Clearance Certificate',
      submittedDate: '2025-01-20',
      status: 'Completed',
      reference: 'REF-PC-2025-001'
    },
    {
      id: 'ver-002',
      type: 'Court Case History',
      submittedDate: '2025-01-22',
      status: 'Pending',
      reference: 'REF-CC-2025-002'
    },
    {
      id: 'ver-003',
      type: 'Academic Certificate Verification',
      submittedDate: '2025-01-23',
      status: 'Under Review',
      reference: 'REF-AC-2025-003'
    },
    {
      id: 'ver-004',
      type: 'Police Incident Report',
      submittedDate: '2025-01-24',
      status: 'Rejected',
      reference: 'REF-PI-2025-004'
    }
  ];

  const notifications = [
    {
      id: 'notif-001',
      title: 'Verification Completed',
      message: isGTECInstitution ? 'Your Academic Certificate verification has been completed.' : 'Your Police Clearance Certificate verification has been completed.',
      date: '2025-01-20',
      read: false
    },
    {
      id: 'notif-002',
      title: 'Document Required',
      message: isGTECInstitution ? 'Please upload additional supporting documents for your Transcript verification.' : 'Please upload additional supporting documents for your Court Case History verification.',
      date: '2025-01-22',
      read: true
    },
    {
      id: 'notif-003',
      title: 'Verification Started',
      message: isGTECInstitution ? 'Your Course Accreditation verification process has begun.' : 'Your Academic Certificate verification process has begun.',
      date: '2025-01-23',
      read: false
    }
  ];

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
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome, {user?.name}</h1>
          <p className="text-gray-600 mt-1">
            Your verification dashboard for {getInstitutionName()}
            {isGTECInstitution && (
              <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                GTEC Accredited
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowNotificationsModal(true)}
            className="relative"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
            {notifications.filter(n => !n.read).length > 0 && (
              <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
            )}
          </Button>
          <Button size="sm" onClick={() => setShowNewRequestModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {isGTECInstitution ? 'New Verification' : 'New Verification'}
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="relative overflow-hidden">
          <div className={`absolute top-0 right-0 w-20 h-20 rounded-full -mr-10 -mt-10 ${
            isGTECInstitution ? 'bg-gradient-to-br from-blue-500/10 to-blue-600/10' : 'bg-gradient-to-br from-blue-500/10 to-blue-600/10'
          }`} />
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Verifications</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{userStats.totalVerifications}</p>
                <div className="flex items-center mt-2">
                  <FileText className={`h-4 w-4 mr-1 ${isGTECInstitution ? 'text-blue-500' : 'text-blue-500'}`} />
                  <span className={`text-sm font-medium ${isGTECInstitution ? 'text-blue-600' : 'text-blue-600'}`}>All time</span>
                </div>
              </div>
              <div className={`p-3 rounded-xl ${isGTECInstitution ? 'bg-blue-100' : 'bg-blue-100'}`}>
                <FileText className={`h-6 w-6 ${isGTECInstitution ? 'text-blue-600' : 'text-blue-600'}`} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{userStats.pendingVerifications}</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600 font-medium">In progress</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{userStats.completedVerifications}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Verified</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-500/10 to-red-600/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{userStats.rejectedVerifications}</p>
                <div className="flex items-center mt-2">
                  <XCircle className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600 font-medium">Needs attention</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Verifications */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Verifications</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVerifications.map((verification) => (
                  <div key={verification.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        {getStatusIcon(verification.status)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{verification.type}</p>
                        <p className="text-xs text-gray-500">
                          {verification.submittedDate} • {verification.reference}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      {getStatusBadge(verification.status)}
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-3 w-3" />
                        </Button>
                        {verification.status === 'Completed' && (
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity & Quick Actions */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isGTECInstitution ? 'bg-blue-100' : 'bg-blue-100'
                  }`}>
                    <Upload className={`h-4 w-4 ${isGTECInstitution ? 'text-blue-600' : 'text-blue-600'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Document Uploaded</p>
                    <p className="text-xs text-gray-500">Today at 10:30 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Verification Completed</p>
                    <p className="text-xs text-gray-500">Yesterday at 2:15 PM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Comment Added</p>
                    <p className="text-xs text-gray-500">Yesterday at 11:30 AM</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isGTECInstitution ? 'bg-purple-100' : 'bg-purple-100'
                  }`}>
                    <Plus className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">New Verification Submitted</p>
                    <p className="text-xs text-gray-500">Jan 22, 2025 at 9:45 AM</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setShowNewRequestModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Verification Request
                </Button>
                {isGTECInstitution && (
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Manage Courses
                  </Button>
                )}
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Download Reports
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Welcome Modal for GTEC tertiary institution users */}
      {isGTECInstitution && showWelcomeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <img src="/GTEC-LOGO-removebg-preview.png" alt="GTEC Logo" className="mx-auto mb-4 h-16 w-16" />
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Welcome to BacChecker!</h2>
            <p className="text-gray-700 mb-4">
              You have been onboarded by the Ghana Tertiary Education Commission (GTEC).<br/>
              Your institution is now ready to use the BacChecker platform with GTEC branding and settings.<br/>
              If you have any questions, please contact <a href="mailto:info@gtec.edu.gh" className="text-blue-600 underline">info@gtec.edu.gh</a>.
            </p>
            <Button onClick={handleCloseWelcome} className="mt-2">Get Started</Button>
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
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select verification type...</option>
                  {isGTECInstitution ? (
                    <>
                      <option value="academic-cert">Academic Certificate Verification</option>
                      <option value="transcript">Official Transcript</option>
                      <option value="course-accreditation">Course Accreditation</option>
                      <option value="faculty-verification">Faculty Verification</option>
                    </>
                  ) : (
                    <>
                      <option value="police-clearance">Police Clearance Certificate</option>
                      <option value="incident-report">Incident Report</option>
                    </>
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Number</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                  <option value="">Select purpose...</option>
                  <option value="employment">Employment</option>
                  <option value="education">Further Education</option>
                  <option value="immigration">Immigration</option>
                  <option value="accreditation">Accreditation</option>
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

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowNotificationsModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNotificationsModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 rounded-lg ${notification.read ? 'bg-gray-50' : 'bg-blue-50 border-l-4 border-blue-500'}`}
                >
                  <div className="flex items-start space-x-3">
                    <Bell className={`h-5 w-5 ${notification.read ? 'text-gray-400' : 'text-blue-500'}`} />
                    <div>
                      <h4 className={`font-medium ${notification.read ? 'text-gray-900' : 'text-blue-900'}`}>
                        {notification.title}
                      </h4>
                      <p className={`text-sm ${notification.read ? 'text-gray-600' : 'text-blue-700'}`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{notification.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" size="sm">
                Mark All as Read
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}