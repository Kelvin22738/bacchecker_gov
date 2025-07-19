import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  BarChart3,
  TrendingUp,
  Download,
  Calendar,
  Filter,
  RefreshCw,
  Users,
  FileText,
  Clock,
  CheckCircle,
  Activity,
  AlertCircle
} from 'lucide-react';
import { 
  masterInstitutions, 
  masterRequests, 
  masterServices, 
  masterUsers,
  getSystemStats,
  getInstitutionStats,
  getInstitutionById,
  getServiceById
} from '../../utils/masterData';

export function SystemAnalytics() {
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('requests');
  const [refreshing, setRefreshing] = useState(false);

  const stats = getSystemStats();

  // Generate daily request data for the last 30 days
  const generateDailyData = () => {
    const data = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayRequests = Math.floor(Math.random() * 15) + 5; // Random between 5-20
      data.push({
        date: date.toISOString().split('T')[0],
        requests: dayRequests,
        completions: Math.floor(dayRequests * 0.8), // 80% completion rate
      });
    }
    return data;
  };

  const dailyData = generateDailyData();

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      alert('Data refreshed successfully!');
    }, 1500);
  };

  const handleExportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      dateRange: `Last ${dateRange} days`,
      summary: stats,
      institutions: masterInstitutions.map(inst => ({
        ...inst,
        stats: getInstitutionStats(inst.id)
      })),
      dailyVolume: dailyData
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `system_analytics_report_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Analytics</h1>
          <p className="text-gray-600">Comprehensive analytics across all institutions and services</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh Data'}
          </Button>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Time Range:</span>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Metric:</span>
              <select 
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="requests">Request Volume</option>
                <option value="completions">Completion Rate</option>
                <option value="sla">SLA Performance</option>
                <option value="revenue">Revenue</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalRequests}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">+15.3%</span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SLA Compliance</p>
                <p className="text-3xl font-bold text-gray-900">{stats.slaCompliance}%</p>
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

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Fulfillment Time</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgFulfillmentTime}</p>
                <div className="flex items-center mt-2">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">Improved</span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejection Rate</p>
                <p className="text-3xl font-bold text-gray-900">{stats.rejectionRate}%</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600 font-medium">-2.1%</span>
                </div>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Request Volume (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg p-4">
              {/* Simple Line Chart Visualization */}
              <div className="h-full flex items-end justify-between space-x-1">
                {dailyData.map((day, index) => {
                  const maxRequests = Math.max(...dailyData.map(d => d.requests));
                  const height = (day.requests / maxRequests) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div 
                        className="bg-blue-500 rounded-t w-full transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%`, minHeight: '4px' }}
                        title={`${day.date}: ${day.requests} requests`}
                      />
                      {index % 5 === 0 && (
                        <span className="text-xs text-gray-500 mt-1 transform rotate-45 origin-left">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 flex justify-between text-sm text-gray-600">
                <span>Peak: {Math.max(...dailyData.map(d => d.requests))} requests/day</span>
                <span>Avg: {Math.round(dailyData.reduce((sum, d) => sum + d.requests, 0) / dailyData.length)} requests/day</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Institution Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Institution Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {masterInstitutions.map(institution => {
                const institutionStats = getInstitutionStats(institution.id);
                const maxRequests = Math.max(...masterInstitutions.map(i => getInstitutionStats(i.id).totalRequests));
                const percentage = (institutionStats.totalRequests / maxRequests) * 100;
                
                return (
                  <div key={institution.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{institution.acronym}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{institutionStats.totalRequests} requests</span>
                        <Badge variant="success" size="sm">{institutionStats.successRate}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: institution.primaryColor 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Request Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Request Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { status: 'Completed', count: stats.completedRequests, color: '#10b981' },
                { status: 'Under Review', count: masterRequests.filter(r => r.status === 'Under Review').length, color: '#3b82f6' },
                { status: 'Pending Approval', count: masterRequests.filter(r => r.status === 'Pending Approval').length, color: '#f59e0b' },
                { status: 'Rejected', count: stats.rejectedRequests, color: '#ef4444' },
                { status: 'Submitted', count: masterRequests.filter(r => r.status === 'Submitted').length, color: '#6b7280' }
              ].map(item => {
                const percentage = (item.count / stats.totalRequests) * 100;
                
                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{item.status}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">{item.count}</span>
                        <span className="text-xs text-gray-500">({percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: item.color 
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Service Performance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Service Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Service</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Institution</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Requests</th>
                    <th className="text-left py-2 text-sm font-medium text-gray-700">Success Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {masterServices.slice(0, 6).map(service => {
                    const serviceRequests = masterRequests.filter(r => r.service_id === service.id);
                    const successRate = serviceRequests.length > 0 
                      ? Math.round((serviceRequests.filter(r => r.status === 'Completed').length / serviceRequests.length) * 100)
                      : 0;
                    const institution = getInstitutionById(service.institution_id);
                    
                    return (
                      <tr key={service.id} className="border-b border-gray-100">
                        <td className="py-2 text-sm text-gray-900">{service.name}</td>
                        <td className="py-2 text-sm text-gray-600">{institution?.acronym}</td>
                        <td className="py-2 text-sm text-gray-900">{serviceRequests.length}</td>
                        <td className="py-2">
                          <Badge variant={successRate >= 90 ? 'success' : successRate >= 70 ? 'warning' : 'error'} size="sm">
                            {successRate}%
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Processor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {masterUsers
              .filter(user => ['Reviewer', 'Processor'].includes(user.role))
              .slice(0, 6)
              .map(user => {
                const processedRequests = Math.floor(Math.random() * 50) + 10; // Mock data
                const institution = user.institution_id ? getInstitutionById(user.institution_id) : null;
                
                return (
                  <div key={user.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{institution?.acronym || 'System'}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Processed:</span>
                        <span className="text-sm font-medium text-gray-900">{processedRequests}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Success Rate:</span>
                        <Badge variant="success" size="sm">
                          {Math.floor(Math.random() * 20) + 80}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>

      {/* System Alerts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertCircle className="h-5 w-5 mr-2 text-yellow-600" />
            System Alerts & Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-900">SLA Compliance Below Target</p>
                <p className="text-sm text-yellow-700">Current compliance is {stats.slaCompliance}%, below the 90% target. Consider reviewing processing workflows.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Activity className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-blue-900">High Request Volume Detected</p>
                <p className="text-sm text-blue-700">Request volume has increased by 15.3% this month. Consider scaling processing capacity.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-green-900">System Performance Optimal</p>
                <p className="text-sm text-green-700">All institutions are online and processing requests efficiently.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}