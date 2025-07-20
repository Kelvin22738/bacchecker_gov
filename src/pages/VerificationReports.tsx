import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Download,
  Eye,
  Send,
  Filter,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  Search,
  RefreshCw
} from 'lucide-react';
import { verificationReportsAPI, verificationRequestsAPI, VerificationReport, VerificationRequest } from '../utils/verificationAPI';

export function VerificationReports() {
  const { state } = useAuth();
  const { user } = state;
  const [reports, setReports] = useState<VerificationReport[]>([]);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [outcomeFilter, setOutcomeFilter] = useState('all');
  const [dateRange, setDateRange] = useState('30');

  const isGTECAdmin = user?.role === 'gtec_admin';

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load verification requests
      if (isGTECAdmin) {
        const requestsData = await verificationRequestsAPI.getAll();
        setRequests(requestsData);
      } else if (user?.institutionId) {
        const requestsData = await verificationRequestsAPI.getByInstitution(user.institutionId);
        setRequests(requestsData);
      }

      // Load reports (simulated for now)
      const mockReports = requests
        .filter(r => r.overall_status === 'completed')
        .map(r => ({
          id: `report-${r.id}`,
          verification_request_id: r.id,
          report_type: 'standard' as const,
          report_data: {
            request_details: {
              request_number: r.request_number,
              student_name: r.student_name,
              program_name: r.program_name
            },
            verification_summary: {
              overall_status: r.overall_status,
              verification_score: r.verification_score
            }
          },
          verification_outcome: r.verification_score >= 80 ? 'verified' as const : 'not_verified' as const,
          confidence_score: r.verification_score,
          generated_at: r.completed_at || r.created_at,
          created_at: r.completed_at || r.created_at
        }));
      
      setReports(mockReports);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async (requestId: string, reportType: 'standard' | 'detailed' | 'summary' = 'standard') => {
    try {
      const report = await verificationReportsAPI.generate(requestId, reportType);
      setReports(prev => [report, ...prev]);
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Error generating report. Please try again.');
    }
  };

  const filteredReports = reports.filter(report => {
    const searchMatch = report.report_data?.request_details?.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       report.report_data?.request_details?.request_number?.toLowerCase().includes(searchQuery.toLowerCase());
    const outcomeMatch = outcomeFilter === 'all' || report.verification_outcome === outcomeFilter;
    return searchMatch && outcomeMatch;
  });

  const selectedReportData = selectedReport 
    ? reports.find(r => r.id === selectedReport)
    : null;

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'verified':
        return <Badge variant="success">Verified</Badge>;
      case 'not_verified':
        return <Badge variant="error">Not Verified</Badge>;
      case 'fraudulent':
        return <Badge variant="error">Fraudulent</Badge>;
      default:
        return <Badge variant="warning">Inconclusive</Badge>;
    }
  };

  const getOutcomeIcon = (outcome: string) => {
    switch (outcome) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'not_verified':
      case 'fraudulent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    }
  };

  const completedRequests = requests.filter(r => r.overall_status === 'completed');
  const verificationStats = {
    totalReports: reports.length,
    verifiedCount: reports.filter(r => r.verification_outcome === 'verified').length,
    notVerifiedCount: reports.filter(r => r.verification_outcome === 'not_verified').length,
    fraudulentCount: reports.filter(r => r.verification_outcome === 'fraudulent').length,
    averageConfidence: Math.round(reports.reduce((sum, r) => sum + r.confidence_score, 0) / reports.length) || 0
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verification Reports</h1>
          <p className="text-gray-600">Generate, manage, and deliver verification reports</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">{verificationStats.totalReports}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified</p>
                <p className="text-3xl font-bold text-gray-900">{verificationStats.verifiedCount}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Not Verified</p>
                <p className="text-3xl font-bold text-gray-900">{verificationStats.notVerifiedCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Fraudulent</p>
                <p className="text-3xl font-bold text-gray-900">{verificationStats.fraudulentCount}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Confidence</p>
                <p className="text-3xl font-bold text-gray-900">{verificationStats.averageConfidence}%</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search reports..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Outcome:</span>
              <select 
                value={outcomeFilter}
                onChange={(e) => setOutcomeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Outcomes</option>
                <option value="verified">Verified</option>
                <option value="not_verified">Not Verified</option>
                <option value="fraudulent">Fraudulent</option>
                <option value="inconclusive">Inconclusive</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Period:</span>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports ({filteredReports.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedReport === report.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedReport(report.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getOutcomeIcon(report.verification_outcome)}
                        <span className="font-medium text-gray-900">
                          {report.report_data?.request_details?.request_number || 'N/A'}
                        </span>
                      </div>
                      {getOutcomeBadge(report.verification_outcome)}
                    </div>
                    
                    <p className="text-sm font-medium text-gray-900">
                      {report.report_data?.request_details?.student_name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {report.report_data?.request_details?.program_name || 'Unknown Program'}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(report.generated_at).toLocaleDateString()}
                      </span>
                      <Badge variant="default" size="sm">
                        {report.confidence_score}% confidence
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredReports.length === 0 && (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No reports found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Details or Pending Requests */}
        <div className="lg:col-span-2">
          {selectedReportData ? (
            <ReportDetails report={selectedReportData} />
          ) : (
            <PendingReports 
              requests={completedRequests.filter(r => !reports.some(rep => rep.verification_request_id === r.id))}
              onGenerateReport={handleGenerateReport}
              isGTECAdmin={isGTECAdmin}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// Report Details Component
function ReportDetails({ report }: { report: VerificationReport }) {
  const handleDownload = () => {
    // In a real implementation, this would download the actual report
    alert('Report download started...');
  };

  const handleSend = () => {
    // In a real implementation, this would send the report via email
    alert('Report sent successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Report Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Verification Report</CardTitle>
              <p className="text-gray-600">
                {report.report_data?.request_details?.request_number} • {report.report_type}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleSend}>
                <Send className="h-4 w-4 mr-1" />
                Send Report
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-1" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <Badge variant={
                report.verification_outcome === 'verified' ? 'success' :
                report.verification_outcome === 'fraudulent' ? 'error' : 'warning'
              }>
                {report.verification_outcome}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Outcome</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-900">{report.confidence_score}%</div>
              <div className="text-sm text-gray-600">Confidence</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm font-medium text-gray-900">
                {new Date(report.generated_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Generated</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <Badge variant="info">{report.report_type}</Badge>
              <div className="text-sm text-gray-600 mt-1">Type</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Information */}
      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Student Name</label>
                <p className="text-gray-900">{report.report_data?.request_details?.student_name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Student ID</label>
                <p className="text-gray-900">{report.report_data?.request_details?.student_id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Program</label>
                <p className="text-gray-900">{report.report_data?.request_details?.program_name || 'N/A'}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700">Graduation Date</label>
                <p className="text-gray-900">
                  {report.report_data?.request_details?.graduation_date 
                    ? new Date(report.report_data.request_details.graduation_date).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Target Institution</label>
                <p className="text-gray-900">
                  {report.report_data?.request_details?.target_institution?.name || 'N/A'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Requesting Institution</label>
                <p className="text-gray-900">
                  {report.report_data?.request_details?.requesting_institution?.name || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verification Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">
                  {report.report_data?.verification_summary?.phases_completed || 0}/4
                </div>
                <div className="text-sm text-blue-700">Phases Completed</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">
                  {report.report_data?.verification_summary?.verification_score || 0}
                </div>
                <div className="text-sm text-green-700">Verification Score</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-sm font-bold text-purple-900">
                  {report.report_data?.verification_summary?.processing_time || 'N/A'}
                </div>
                <div className="text-sm text-purple-700">Processing Time</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Verification Outcome</h4>
              <div className="flex items-center space-x-2">
                {getOutcomeIcon(report.verification_outcome)}
                <span className="font-medium text-gray-900">
                  {report.verification_outcome.replace('_', ' ').toUpperCase()}
                </span>
                <Badge variant={
                  report.verification_outcome === 'verified' ? 'success' :
                  report.verification_outcome === 'fraudulent' ? 'error' : 'warning'
                }>
                  {report.confidence_score}% confidence
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Results */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Phase Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {report.report_data?.phase_results?.map((phase: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    phase.phase_status === 'completed' ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    {phase.phase_status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Clock className="h-4 w-4 text-gray-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Phase {phase.phase_number}: {phase.phase_name}</p>
                    <p className="text-sm text-gray-600">{phase.notes || 'No additional notes'}</p>
                  </div>
                </div>
                <Badge variant={phase.phase_status === 'completed' ? 'success' : 'default'}>
                  {phase.phase_status}
                </Badge>
              </div>
            )) || (
              <p className="text-gray-500">No phase results available</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Pending Reports Component
function PendingReports({ 
  requests, 
  onGenerateReport, 
  isGTECAdmin 
}: {
  requests: VerificationRequest[];
  onGenerateReport: (requestId: string, reportType: 'standard' | 'detailed' | 'summary') => void;
  isGTECAdmin: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Report Generation ({requests.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {requests.map((request) => (
            <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{request.request_number}</p>
                <p className="text-sm text-gray-600">{request.student_name} • {request.program_name}</p>
                <p className="text-xs text-gray-500">
                  Completed: {request.completed_at ? new Date(request.completed_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              <div className="flex space-x-2">
                {isGTECAdmin && (
                  <>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onGenerateReport(request.id, 'summary')}
                    >
                      Summary
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => onGenerateReport(request.id, 'standard')}
                    >
                      Standard
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => onGenerateReport(request.id, 'detailed')}
                    >
                      Detailed
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
          
          {requests.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No pending reports</p>
              <p className="text-sm text-gray-400">All completed verifications have reports generated</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}