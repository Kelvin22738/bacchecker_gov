import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Users,
  Database,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  ArrowUpRight,
  Activity,
  Shield,
  Scale,
  GraduationCap,
  Plus,
  Eye,
  Send,
  Settings,
  BarChart3,
  DollarSign,
  Home
} from 'lucide-react';
import { 
  masterInstitutions, 
  masterRequests, 
  masterServices, 
  masterUsers,
  getInstitutionRequests,
  getInstitutionServices,
  getInstitutionUsers,
  getInstitutionStats,
  getInstitutionById,
  getServiceById
} from '../utils/masterData';

export function Dashboard() {
  const { state } = useAuth();
  const { user } = state;
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Get current institution data based on user's institutionId
  const currentInstitution = user?.institutionId ? getInstitutionById(user.institutionId) : null;
  const institutionRequests = user?.institutionId ? getInstitutionRequests(user.institutionId) : [];
  const institutionServices = user?.institutionId ? getInstitutionServices(user.institutionId) : [];
  const institutionUsers = user?.institutionId ? getInstitutionUsers(user.institutionId) : [];

  // Calculate statistics
  const stats = user?.institutionId ? getInstitutionStats(user.institutionId) : {
    totalRequests: 0,
    pendingRequests: 0,
    completedRequests: 0,
    rejectedRequests: 0,
    totalServices: 0,
    successRate: 0,
    avgProcessingTime: '0 days',
    overdueRequests: 0
  };

  const recentRequests = institutionRequests
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
    .slice(0, 6);

  // Mock user activity logs
  const userActivityLogs = [
    {
      id: 'log-1',
      user: institutionUsers[0]?.name || 'User',
      action: 'Completed verification',
      target: 'REF-PC-2025-001',
      timestamp: '2025-01-25 14:30:22',
      ipAddress: '192.168.1.1'
    },
    {
      id: 'log-2',
      user: institutionUsers[1]?.name || 'User',
      action: 'Uploaded document',
      target: 'REF-PC-2025-002',
      timestamp: '2025-01-25 13:15:45',
      ipAddress: '192.168.1.2'
    },
    {
      id: 'log-3',
      user: institutionUsers[0]?.name || 'User',
      action: 'Added comment',
      target: 'REF-PC-2025-003',
      timestamp: '2025-01-25 11:42:18',
      ipAddress: '192.168.1.1'
    },
    {
      id: 'log-4',
      user: institutionUsers[2]?.name || 'User',
      action: 'Created new verification',
      target: 'REF-PC-2025-004',
      timestamp: '2025-01-25 10:05:33',
      ipAddress: '192.168.1.3'
    },
    {
      id: 'log-5',
      user: institutionUsers[1]?.name || 'User',
      action: 'Rejected verification',
      target: 'REF-PC-2025-005',
      timestamp: '2025-01-24 16:22:47',
      ipAddress: '192.168.1.2'
    }
  ];

  const tabs = [
    { id: 'overview', name: 'Overview', icon: Home },
    { id: 'activity', name: 'User Activity', icon: Clock },
    { id: 'analytics', name: 'Analytics', icon: BarChart3 }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return <Badge variant="success">Completed</Badge>;
      case 'Under Review':
        return <Badge variant="info">Under Review</Badge>;
      case 'Pending Approval':
        return <Badge variant="warning">Pending Approval</Badge>;
      case 'Rejected':
        return <Badge variant="error">Rejected</Badge>;
      case 'Submitted':
        return <Badge variant="default">Submitted</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getSLABadge = (risk: string | null) => {
    if (!risk) return null;
    switch (risk) {
      case 'On Time':
        return <Badge variant="success" size="sm">On Time</Badge>;
      case 'At Risk':
        return <Badge variant="warning" size="sm">At Risk</Badge>;
      case 'Overdue':
        return <Badge variant="error" size="sm">Overdue</Badge>;
      default:
        return <Badge variant="default" size="sm">{risk}</Badge>;
    }
  };

  const getInstitutionIcon = (institutionId: string) => {
    switch (institutionId) {
      case 'gps':
        return Shield;
      case 'hcg':
        return Scale;
      case 'moe':
        return GraduationCap;
      default:
        return FileText;
    }
  };

  if (!currentInstitution) {
    return (
      <div className="p-8 text-center">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.name}. Here's your institution overview.
              </p>
            </div>
          </div>

          {/* Default Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card hover>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card hover>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completed</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">0</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card hover>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Success Rate</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">--</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="text-center py-12">
              <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Your Dashboard</h3>
              <p className="text-gray-600">Start by configuring your services and processing requests.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {user?.name}. Here's what's happening at {currentInstitution.name}.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => window.location.href = '/analytics'}>
            <Eye className="h-4 w-4 mr-2" />
            View Reports
          </Button>
          <Button size="sm" onClick={() => setShowQuickActionModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </div>
      </div>

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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card hover className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Requests</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalRequests.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">+12.5%</span>
                      <span className="text-sm text-gray-500 ml-1">vs last month</span>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Review</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingRequests}</p>
                    <div className="flex items-center mt-2">
                      <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                      <span className="text-sm text-yellow-600 font-medium">Avg {stats.avgProcessingTime}</span>
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
                    <p className="text-3xl font-bold text-gray-900 mt-1">{stats.completedRequests.toLocaleString()}</p>
                    <div className="flex items-center mt-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600 font-medium">{stats.successRate}% success</span>
                    </div>
                  </div>
                  <div className="p-3 bg-green-100 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card hover className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full -mr-10 -mt-10" />
              <CardContent className="relative">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Registry Records</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">45,672</p>
                    <div className="flex items-center mt-2">
                      <Database className="h-4 w-4 text-purple-500 mr-1" />
                      <span className="text-sm text-purple-600 font-medium">4 registries</span>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Database className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Requests */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Requests</CardTitle>
                    <Button variant="outline" size="sm" onClick={() => window.location.href = '/requests'}>
                      View All
                      <ArrowUpRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentRequests.length > 0 ? (
                      recentRequests.map((request) => {
                        const service = getServiceById(request.service_id);
                        const IconComponent = getInstitutionIcon(request.institution_id);
                        
                        return (
                          <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 bg-white rounded-lg shadow-sm">
                                <IconComponent className="h-5 w-5 text-gray-600" />
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{request.applicant}</p>
                                <p className="text-sm text-gray-600">{service?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(request.submittedDate).toLocaleDateString()} • {request.requestId}
                                </p>
                              </div>
                            </div>
                            <div className="text-right space-y-1">
                              {getStatusBadge(request.status)}
                              {getSLABadge(request.risk)}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No recent requests</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats & Actions */}
            <div className="space-y-6">
              {/* Active Services */}
              <Card>
                <CardHeader>
                  <CardTitle>Active Services</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {institutionServices.slice(0, 4).map((service) => {
                      const serviceRequests = institutionRequests.filter(r => r.service_id === service.id);
                      const successRate = serviceRequests.length > 0 
                        ? Math.round((serviceRequests.filter(r => r.status === 'Completed').length / serviceRequests.length) * 100)
                        : 0;
                      
                      return (
                        <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: currentInstitution.primaryColor }}
                            />
                            <div>
                              <p className="font-medium text-gray-900 text-sm">{service.name}</p>
                              <p className="text-xs text-gray-500">{serviceRequests.length} requests</p>
                            </div>
                          </div>
                          <Badge variant="success" size="sm">
                            {successRate}%
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* System Health */}
              <Card>
                <CardHeader>
                  <CardTitle>System Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">API Status</span>
                      </div>
                      <Badge variant="success" size="sm">Operational</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Database className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">Database</span>
                      </div>
                      <Badge variant="success" size="sm">Healthy</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-700">Security</span>
                      </div>
                      <Badge variant="success" size="sm">Secure</Badge>
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
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.location.href = '/requests'}>
                      <FileText className="h-4 w-4 mr-2" />
                      Process New Request
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.location.href = '/registries'}>
                      <Database className="h-4 w-4 mr-2" />
                      Manage Registries
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.location.href = '/analytics'}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* User Activity Tab */}
      {activeTab === 'activity' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>User Activity Logs</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Logs
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userActivityLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{log.user}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={
                            log.action.includes('Completed') ? 'success' : 
                            log.action.includes('Rejected') ? 'error' : 
                            'default'
                          } 
                          size="sm"
                        >
                          {log.action}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {log.target}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {log.ipAddress}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                Showing 5 of 1,234 activity logs
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" disabled>Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-blue-50 border border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-blue-900">Processing Time</h3>
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-700" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-blue-900 mb-2">{stats.avgProcessingTime}</div>
                <p className="text-sm text-blue-700">Average time to complete requests</p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-green-900">Success Rate</h3>
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-700" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-green-900 mb-2">{stats.successRate}%</div>
                <p className="text-sm text-green-700">Requests completed successfully</p>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-red-900">SLA Compliance</h3>
                  <div className="p-2 bg-red-100 rounded-lg">
                    <AlertCircle className="h-5 w-5 text-red-700" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-red-900 mb-2">
                  {Math.round(((stats.totalRequests - stats.overdueRequests) / stats.totalRequests) * 100)}%
                </div>
                <p className="text-sm text-red-700">Requests completed within SLA</p>
              </CardContent>
            </Card>
          </div>

          {/* Request Volume Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Request Volume (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-50 rounded-lg p-4">
                {/* Simple Bar Chart Visualization */}
                <div className="h-full flex items-end justify-between space-x-1">
                  {Array.from({ length: 30 }, (_, i) => {
                    const height = Math.floor(Math.random() * 80) + 20;
                    return (
                      <div key={i} className="flex flex-col items-center flex-1">
                        <div 
                          className="bg-red-500 rounded-t w-full transition-all duration-300 hover:bg-red-600"
                          style={{ height: `${height}%`, minHeight: '4px' }}
                        />
                        {i % 5 === 0 && (
                          <span className="text-xs text-gray-500 mt-1">
                            {new Date(2025, 0, i + 1).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Service Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Service Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {institutionServices.map(service => {
                  const serviceRequests = institutionRequests.filter(r => r.service_id === service.id);
                  const successRate = serviceRequests.length > 0 
                    ? Math.round((serviceRequests.filter(r => r.status === 'Completed').length / serviceRequests.length) * 100)
                    : 0;
                  const percentage = successRate;
                  
                  return (
                    <div key={service.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-900">{service.name}</span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">{serviceRequests.length} requests</span>
                          <Badge variant={percentage >= 90 ? 'success' : percentage >= 70 ? 'warning' : 'error'} size="sm">
                            {percentage}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full transition-all duration-500"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: percentage >= 90 ? '#10b981' : percentage >= 70 ? '#f59e0b' : '#ef4444'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Action Modal */}
      {showQuickActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowQuickActionModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                setShowQuickActionModal(false);
                window.location.href = '/requests';
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Request
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                setShowQuickActionModal(false);
                window.location.href = '/users';
              }}>
                <Users className="h-4 w-4 mr-2" />
                Add User
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                setShowQuickActionModal(false);
                window.location.href = '/analytics';
              }}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
            <div className="flex justify-end pt-4">
              <Button onClick={() => setShowQuickActionModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}