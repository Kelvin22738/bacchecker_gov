// src/pages/user/UserDashboard.tsx - REPLACED
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
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
  HelpCircle,
  RefreshCw,
  Building2,
  TrendingUp,
  Loader2
} from 'lucide-react';
import { VerificationWorkflowAPI } from '../../utils/verificationWorkflowAPI';
import { VerificationRequest } from '../../types/verification';

export function UserDashboard() {
  const { state } = useAuth();
  const { user } = state;
  const navigate = useNavigate();
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const isGTECInstitution = user?.role === 'tertiary_institution_user';
  const isTertiaryUser = user?.role === 'tertiary_institution_user';

  // Load verification requests for this institution
  const loadVerificationRequests = async () => {
    if (refreshing) return; // Prevent multiple simultaneous loads
    
    setLoading(true);
    try {
      let requests: VerificationRequest[] = [];
      
      if (user?.institutionId && isTertiaryUser) {
        // Get requests assigned to this institution
        requests = await VerificationWorkflowAPI.getInstitutionRequests(user.institutionId);
      }
      
      setVerificationRequests(requests);
    } catch (error) {
      console.error('Error loading verification requests:', error);
    } finally {
      setLoading(false);
    }
  };

  // Refresh data
  const refreshData = async () => {
    setRefreshing(true);
    await loadVerificationRequests();
    setRefreshing(false);
  };

  useEffect(() => {
    loadVerificationRequests();
  }, [user?.institutionId]);

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

  // Calculate statistics for verification requests
  const verificationStats = {
    total: verificationRequests.length,
    pending: verificationRequests.filter(r => 
      r.overall_status === 'gtec_approved' || r.overall_status === 'institution_reviewing'
    ).length,
    approved: verificationRequests.filter(r => r.overall_status === 'institution_approved').length,
    completed: verificationRequests.filter(r => r.overall_status === 'completed').length,
    rejected: verificationRequests.filter(r => r.overall_status === 'institution_rejected').length
  };

  // Mock data for user dashboard (existing functionality)
  const userStats = {
    totalVerifications: isGTECInstitution ? 156 : 24,
    pendingVerifications: isGTECInstitution ? 12 : 5,
    completedVerifications: isGTECInstitution ? 142 : 18,
    rejectedVerifications: isGTECInstitution ? 2 : 1
  };

  const getInstitutionName = () => {
    switch (user?.institutionId) {
      case 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12':
        return 'University of Ghana';
      case 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13':
        return 'KNUST';
      case 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14':
        return 'Ghana Police Service';
      default:
        return 'Institution';
    }
  };

  const recentVerifications = isGTECInstitution ? [
    {
      id: '1',
      requestNumber: 'VR-2025-001',
      studentName: 'Kwame Asante',
      program: 'BSc Computer Science',
      status: 'Completed',
      submittedDate: '2025-01-20',
      type: 'Transcript Verification'
    },
    {
      id: '2',
      requestNumber: 'VR-2025-002', 
      studentName: 'Ama Osei',
      program: 'MSc Data Science',
      status: 'Under Review',
      submittedDate: '2025-01-22',
      type: 'Degree Verification'
    },
    {
      id: '3',
      requestNumber: 'VR-2025-003',
      studentName: 'Kojo Mensah',
      program: 'BSc Engineering',
      status: 'Pending Approval',
      submittedDate: '2025-01-23',
      type: 'Certificate Verification'
    }
  ] : [
    {
      id: '1',
      requestNumber: 'REF-PC-2025-001',
      applicantName: 'John Doe',
      purpose: 'Employment',
      status: 'Completed',
      submittedDate: '2025-01-15',
      type: 'Police Clearance'
    },
    {
      id: '2',
      requestNumber: 'REF-PC-2025-002',
      applicantName: 'Jane Smith',
      purpose: 'Travel',
      status: 'Under Review',
      submittedDate: '2025-01-18',
      type: 'Police Clearance'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-blue-100">
          {getInstitutionName()} - {isTertiaryUser ? 'Institution User' : 'User'} Dashboard
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Verification Requests Stats (for tertiary users) */}
        {isTertiaryUser && (
          <>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Verifications</p>
                    <p className="text-3xl font-bold text-orange-600">{verificationStats.pending}</p>
                  </div>
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">Require your attention</span>
                  {refreshing && (
                    <Loader2 className="h-3 w-3 ml-2 animate-spin inline" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Approved Today</p>
                    <p className="text-3xl font-bold text-green-600">{verificationStats.approved}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">Successfully processed</span>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-blue-600">
                  {isTertiaryUser ? verificationStats.total : userStats.totalVerifications}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">
                +12% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-purple-600">
                  {isTertiaryUser && verificationStats.total > 0 
                    ? Math.round(((verificationStats.approved + verificationStats.completed) / verificationStats.total) * 100)
                    : 94}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-gray-500">Above industry average</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Verification Requests (for tertiary users) */}
        {isTertiaryUser && (
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    Pending Verification Requests
                    {refreshing && (
                      <Loader2 className="h-4 w-4 ml-2 animate-spin inline" />
                    )}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={refreshData} disabled={loading || refreshing}>
                      <RefreshCw className="h-4 w-4 mr-1" />
                      Refresh
                    </Button>
                    <Button size="sm" onClick={() => navigate('/user/verification')}>
                      View All
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loading && !refreshing ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {verificationRequests.slice(0, 5).map((request) => (
                      <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                           onClick={() => navigate('/user/verification')}>
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{request.request_number}</h4>
                            <p className="text-sm text-gray-600">{request.student_name}</p>
                            <p className="text-xs text-gray-500">{request.program_name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge variant={VerificationWorkflowAPI.getStatusColor(request.overall_status) as any}>
                            {VerificationWorkflowAPI.getStatusDisplayName(request.overall_status)}
                          </Badge>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(request.submitted_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}

                    {verificationRequests.length === 0 && !loading && (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No pending verification requests</p>
                        <p className="text-sm text-gray-400">All verification requests are up to date</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Recent Activities (existing functionality) */}
        <div className={isTertiaryUser ? 'lg:col-span-1' : 'lg:col-span-2'}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Activities</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentVerifications.slice(0, 5).map((verification) => (
                  <div key={verification.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          {verification.requestNumber}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {isGTECInstitution ? verification.studentName : verification.applicantName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={
                          verification.status === 'Completed' ? 'default' :
                          verification.status === 'Under Review' ? 'secondary' : 'outline'
                        }
                      >
                        {verification.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions - Always show */}
        <div className={isTertiaryUser ? 'lg:col-span-3' : 'lg:col-span-1'}>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {isTertiaryUser && (
                  <Button 
                    variant="outline" 
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                    onClick={() => navigate('/user/verification')}
                  >
                    <FileText className="h-6 w-6" />
                    <span className="text-sm">Process Verifications</span>
                    {verificationStats.pending > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {verificationStats.pending} pending
                      </Badge>
                    )}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/user/templates')}
                >
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm">Manage Templates</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/user/settings')}
                >
                  <Settings className="h-6 w-6" />
                  <span className="text-sm">Settings</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="h-20 flex flex-col items-center justify-center space-y-2"
                  onClick={() => navigate('/user/help')}
                >
                  <HelpCircle className="h-6 w-6" />
                  <span className="text-sm">Help & Support</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Metrics (for tertiary users) */}
      {isTertiaryUser && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Processing Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Average Processing Time</span>
                  <span className="font-medium">2.3 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="font-medium text-green-600">↑ 15% faster</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">SLA Compliance</span>
                  <span className="font-medium text-green-600">98.5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '98.5%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">New verification request</p>
                    <p className="text-xs text-blue-700">VR-2025-045 requires your attention</p>
                    <p className="text-xs text-blue-600">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-green-900">Request completed</p>
                    <p className="text-xs text-green-700">VR-2025-043 was successfully processed</p>
                    <p className="text-xs text-green-600">1 hour ago</p>
                  </div>
                </div>
                <div className="text-center">
                  <Button variant="outline" size="sm" onClick={() => setShowNotificationsModal(true)}>
                    View All Notifications
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Welcome Modal for GTEC Institutions */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Welcome to {getInstitutionName()}!
              </h3>
              <p className="text-gray-600 mb-6">
                You now have access to the GTEC verification system. You can process verification requests, 
                manage templates, and track your institution's verification activities.
              </p>
              <div className="space-y-3">
                <Button onClick={handleCloseWelcome} className="w-full">
                  Get Started
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/user/help')}
                  className="w-full"
                >
                  View Documentation
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notifications Modal */}
      {showNotificationsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">All Notifications</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowNotificationsModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No notifications available</p>
                <p className="text-sm text-gray-400">You'll see updates about verification requests here</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}