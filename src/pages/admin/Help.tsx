import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
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
  Headphones,
  Users,
  Settings,
  Database,
  Lock,
  BarChart3,
  X
} from 'lucide-react';

export function Help() {
  const [activeTab, setActiveTab] = useState('admin-guides');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);

  const tabs = [
    { id: 'admin-guides', name: 'Admin Guides', icon: BookOpen },
    { id: 'system-guides', name: 'System Guides', icon: Settings },
    { id: 'support', name: 'Support Resources', icon: HelpCircle },
    { id: 'notices', name: 'System Notices', icon: Bell }
  ];

  const adminGuides = [
    {
      id: 'institution-management',
      title: 'Institution Management Guide',
      description: 'How to add, configure, and manage government institutions',
      content: 'Learn how to properly onboard and manage institutions in the BacChecker system...',
      category: 'Administration'
    },
    {
      id: 'user-roles',
      title: 'User Roles & Permissions',
      description: 'Understanding the role hierarchy and permission system',
      content: 'BacChecker uses a comprehensive role-based access control system...',
      category: 'Administration'
    },
    {
      id: 'system-monitoring',
      title: 'System Monitoring & Alerts',
      description: 'How to monitor system health and respond to alerts',
      content: 'The monitoring dashboard provides real-time insights into system performance...',
      category: 'Technical'
    },
    {
      id: 'analytics-reporting',
      title: 'Analytics & Reporting',
      description: 'Generating and interpreting system-wide reports',
      content: 'The analytics module allows you to track verification volumes, success rates...',
      category: 'Analytics'
    }
  ];

  const systemGuides = [
    {
      id: 'admin-manual',
      title: 'System Administrator Manual',
      description: 'Comprehensive guide for BacChecker system administrators',
      type: 'PDF',
      size: '4.2 MB',
      downloadUrl: '/guides/admin-manual.pdf'
    },
    {
      id: 'technical-docs',
      title: 'Technical Documentation',
      description: 'System architecture, database schema, and API references',
      type: 'PDF',
      size: '6.8 MB',
      downloadUrl: '/guides/technical-docs.pdf'
    },
    {
      id: 'admin-videos',
      title: 'Admin Video Tutorials',
      description: 'Video walkthroughs of key administrative functions',
      type: 'Video',
      duration: '45 min',
      videoUrl: '/tutorials/admin-overview'
    },
    {
      id: 'security-guide',
      title: 'Security Best Practices',
      description: 'Guidelines for maintaining system security',
      type: 'PDF',
      size: '2.3 MB',
      downloadUrl: '/guides/security-guide.pdf'
    }
  ];

  const supportResources = [
    {
      id: 'support-team',
      title: 'BacChecker Support Team',
      description: 'Direct contact with our dedicated support specialists',
      contactMethod: 'Email',
      contact: 'admin-support@bacchecker.com',
      icon: Mail
    },
    {
      id: 'technical-support',
      title: 'Technical Support',
      description: 'For system issues, bugs, and technical problems',
      contactMethod: 'Phone',
      contact: '+233-302-XXXXXX',
      icon: Phone
    },
    {
      id: 'admin-training',
      title: 'Admin Training Sessions',
      description: 'Schedule a training session for new system administrators',
      contactMethod: 'Booking',
      contact: 'Schedule online',
      icon: Users
    },
    {
      id: 'knowledge-base',
      title: 'Admin Knowledge Base',
      description: 'Searchable database of common questions and solutions',
      contactMethod: 'Web',
      contact: 'Access online',
      icon: Database
    }
  ];

  const systemNotices = [
    {
      id: 'maintenance-1',
      title: 'Scheduled Maintenance - January 30, 2025',
      type: 'maintenance',
      date: '2025-01-25',
      content: 'System will be unavailable from 2:00 AM to 4:00 AM GMT for database optimization and security updates.',
      priority: 'high'
    },
    {
      id: 'feature-1',
      title: 'New Feature: Advanced Analytics Dashboard',
      type: 'feature',
      date: '2025-01-20',
      content: 'We\'ve added enhanced analytics capabilities with custom report generation and data visualization tools.',
      priority: 'medium'
    },
    {
      id: 'policy-1',
      title: 'Updated System Administrator Policy',
      type: 'policy',
      date: '2025-01-15',
      content: 'New security requirements for system administrators including mandatory 2FA and quarterly password rotation.',
      priority: 'high'
    },
    {
      id: 'feature-2',
      title: 'Institution API Access Controls',
      type: 'feature',
      date: '2025-01-10',
      content: 'New granular controls for institution API access with improved rate limiting and monitoring.',
      priority: 'medium'
    }
  ];

  const filteredAdminGuides = adminGuides.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getNoticeIcon = (type: string) => {
    switch (type) {
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'feature':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'policy':
        return <FileText className="h-5 w-5 text-blue-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNoticeColor = (type: string) => {
    switch (type) {
      case 'maintenance':
        return 'border-orange-200 bg-orange-50';
      case 'feature':
        return 'border-green-200 bg-green-50';
      case 'policy':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600">Resources for BacChecker system administrators</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowTicketModal(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Admin Manual
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
              placeholder="Search admin guides, documentation, and support resources..."
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

      {/* Admin Guides Tab */}
      {activeTab === 'admin-guides' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredAdminGuides.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <Badge variant="default" size="sm" className="mt-2">
                      {item.category}
                    </Badge>
                  </div>
                  <div className="p-2 bg-red-100 rounded-lg">
                    {item.category === 'Administration' && <Users className="h-5 w-5 text-red-600" />}
                    {item.category === 'Technical' && <Settings className="h-5 w-5 text-red-600" />}
                    {item.category === 'Analytics' && <BarChart3 className="h-5 w-5 text-red-600" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button variant="outline" size="sm" className="w-full">
                  Read Guide
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* System Guides Tab */}
      {activeTab === 'system-guides' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {systemGuides.map((guide) => (
              <Card key={guide.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-red-100 rounded-lg">
                      {guide.type === 'PDF' && <FileText className="h-6 w-6 text-red-600" />}
                      {guide.type === 'Video' && <Video className="h-6 w-6 text-red-600" />}
                      {guide.type === 'Web' && <ExternalLink className="h-6 w-6 text-red-600" />}
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
                          {guide.type === 'Web' && <ExternalLink className="h-4 w-4 mr-2" />}
                          {guide.type === 'PDF' ? 'Download' : guide.type === 'Video' ? 'Watch' : 'View'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Lock className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Security Guidelines</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Best practices for system security and data protection</p>
                  <Button variant="outline" size="sm" className="w-full">View Guidelines</Button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Database className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">Database Management</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">How to manage and optimize the system database</p>
                  <Button variant="outline" size="sm" className="w-full">View Guide</Button>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Users className="h-5 w-5 text-gray-600" />
                    <h4 className="font-medium text-gray-900">User Management</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">Managing system users and access controls</p>
                  <Button variant="outline" size="sm" className="w-full">View Guide</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Support Resources Tab */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Support Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportResources.map((resource) => (
                <div key={resource.id} className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <resource.icon className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{resource.title}</h4>
                    <p className="text-sm text-gray-600">{resource.description}</p>
                    <div className="flex items-center mt-1">
                      <span className="text-xs font-medium text-gray-500">{resource.contactMethod}:</span>
                      <span className="text-xs text-gray-700 ml-1">{resource.contact}</span>
                    </div>
                  </div>
                  <Button size="sm">
                    Contact
                  </Button>
                </div>
              ))}
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
                  <span className="font-medium text-gray-900">Admin Support Hours</span>
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monday - Friday:</span>
                    <span className="font-medium">8:00 AM - 6:00 PM GMT</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Saturday:</span>
                    <span className="font-medium">9:00 AM - 2:00 PM GMT</span>
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
                    Our admin support team is online and ready to help
                  </p>
                </div>

                <div className="mt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Emergency Support</h4>
                  <p className="text-sm text-gray-600">
                    For critical system issues outside business hours, contact our emergency line:
                  </p>
                  <p className="font-medium text-red-600">+233-XXX-EMERGENCY</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">How do I reset an institution admin's password?</h4>
                  <p className="text-gray-600">
                    Navigate to the Institutions Management page, select the institution, click on "Users", 
                    find the admin user, and use the "Reset Password" option. A temporary password will be 
                    sent to their registered email.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">How can I monitor system performance?</h4>
                  <p className="text-gray-600">
                    The System Analytics page provides real-time metrics on system performance, 
                    including request volumes, processing times, and success rates. You can also 
                    set up custom alerts for specific performance thresholds.
                  </p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">What should I do if an institution reports API issues?</h4>
                  <p className="text-gray-600">
                    First, check the System Analytics page for any system-wide issues. Then, go to the 
                    specific institution's configuration page to verify their API settings and rate limits. 
                    You can also view their recent API logs to identify specific errors.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Notices Tab */}
      {activeTab === 'notices' && (
        <div className="space-y-4">
          {systemNotices.map((notice) => (
            <Card key={notice.id} className={`border-l-4 ${getNoticeColor(notice.type)}`}>
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {getNoticeIcon(notice.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{notice.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Badge variant={notice.priority === 'high' ? 'error' : 'default'} size="sm">
                          {notice.priority} priority
                        </Badge>
                        <span className="text-sm text-gray-500">{notice.date}</span>
                      </div>
                    </div>
                    <p className="text-gray-600">{notice.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contact Support Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowTicketModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Admin Support</h3>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Support Category</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="technical">Technical Issue</option>
                  <option value="account">Account Management</option>
                  <option value="security">Security Concern</option>
                  <option value="feature">Feature Request</option>
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
                  alert('Support request submitted successfully! A member of our team will contact you shortly.');
                  setShowTicketModal(false);
                }}>
                  Submit Request
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}