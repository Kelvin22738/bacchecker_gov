import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Building2,
  Users,
  FileText,
  TrendingUp,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  Shield,
  Globe,
  Database,
  Plus,
  Eye,
  Send,
  Settings,
  BarChart3,
  Calendar,
  Search,
  Upload,
  CreditCard,
  Key,
  Download,
  Filter,
  RefreshCw,
  Bell,
  X
} from 'lucide-react';
import { 
  masterInstitutions, 
  masterRequests, 
  masterServices, 
  masterUsers,
  getSystemStats,
  getInstitutionStats,
  getInstitutionById
} from '../../utils/masterData';
import { useAuth } from '../../context/AuthContext';

export function AdminDashboard() {
  const [selectedTimeRange, setSelectedTimeRange] = useState('30');
  const [showQuickActionModal, setShowQuickActionModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const systemStats = getSystemStats();
  const { state: authState } = useAuth();
  const user = authState.user;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const recentRequests = masterRequests
    .sort((a, b) => new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime())
    .slice(0, 8);

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
          <p className="text-gray-600">Monitor and manage the entire BacChecker platform</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <Button onClick={() => setShowQuickActionModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Quick Action
          </Button>
        </div>
      </div>

      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-500/10 to-blue-600/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Institutions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{systemStats.totalInstitutions}</p>
                <div className="flex items-center mt-2">
                  <Building2 className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-sm text-blue-600 font-medium">Active</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-green-600/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{systemStats.totalRequests.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+15.3%</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{systemStats.slaCompliance}%</p>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm text-yellow-600 font-medium">Target: 90%</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover className="relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-purple-600/10 rounded-full -mr-10 -mt-10" />
          <CardContent className="relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{systemStats.totalUsers}</p>
                <div className="flex items-center mt-2">
                  <Users className="h-4 w-4 text-purple-500 mr-1" />
                  <span className="text-sm text-purple-600 font-medium">System-wide</span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Institution Status */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Institution Status</CardTitle>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {masterInstitutions.map((institution) => {
                  const stats = getInstitutionStats(institution.id);
                  
                  return (
                    <div key={institution.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: institution.primaryColor }}
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{institution.name}</p>
                          <p className="text-sm text-gray-600">{institution.acronym}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">{stats.totalRequests} requests</span>
                            <span className="text-xs text-gray-500">{stats.totalServices} services</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <Badge variant={institution.status === 'Active' ? 'success' : 'error'}>
                          {institution.status}
                        </Badge>
                        <div className="flex items-center space-x-1">
                          <Activity className="h-3 w-3 text-green-500" />
                          <span className="text-xs text-green-600">Online</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Health & Quick Actions */}
        <div className="space-y-6">
          {/* System Health */}
          {user?.role !== 'gtec_admin' && (
            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Activity className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">API Gateway</span>
                    </div>
                    <Badge variant="success" size="sm">Healthy</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Database className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Database</span>
                    </div>
                    <Badge variant="success" size="sm">Optimal</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-gray-700">Security</span>
                    </div>
                    <Badge variant="success" size="sm">Secure</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-gray-700">External APIs</span>
                    </div>
                    <Badge variant="warning" size="sm">Degraded</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Institution
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Send className="h-4 w-4 mr-2" />
                  Send Broadcast
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Generate Report
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Settings className="h-4 w-4 mr-2" />
                  System Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent System Activity</CardTitle>
            <div className="flex space-x-2">
              <select 
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
              </select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentRequests.slice(0, 6).map((request) => {
              const institution = getInstitutionById(request.institution_id);
              
              return (
                <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <FileText className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{request.requestId}</p>
                      <p className="text-sm text-gray-600">{request.applicant}</p>
                      <p className="text-xs text-gray-500">
                        {institution?.acronym} • {new Date(request.submittedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Modal */}
      {showQuickActionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowQuickActionModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowQuickActionModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                setShowQuickActionModal(false);
                window.location.href = '/admin/institutions';
              }}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Institution
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                setShowQuickActionModal(false);
                window.location.href = '/admin/analytics';
              }}>
                <BarChart3 className="h-4 w-4 mr-2" />
                View System Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={() => {
                setShowQuickActionModal(false);
                window.location.href = '/admin/requests';
              }}>
                <FileText className="h-4 w-4 mr-2" />
                Monitor Requests
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}