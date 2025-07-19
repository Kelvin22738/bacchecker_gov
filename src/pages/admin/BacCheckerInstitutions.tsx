import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  Building2,
  Plus,
  Edit,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  Settings,
  Eye,
  Send,
  BarChart3,
  Activity,
  X,
  Upload,
  Key,
  Clock,
  CheckCircle,
  FileText,
  TrendingUp,
  Shield,
  Scale,
  GraduationCap
} from 'lucide-react';
import { 
  masterInstitutions, 
  getInstitutionStats,
  getInstitutionById
} from '../../utils/masterData';

export function BacCheckerInstitutions() {
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);

  // All institutions for BacChecker Admin
  const institutions = [
    {
      id: 'gps',
      name: 'Ghana Police Service',
      acronym: 'GPS',
      description: 'Criminal Investigation Department and Security Clearance Services',
      contact: {
        address: 'Police Headquarters, Ring Road Central, Accra',
        phone: '+233-302-773906',
        email: 'info@police.gov.gh',
        website: 'https://police.gov.gh'
      },
      status: 'Active' as const,
      online: true,
      logo: '/image.png',
      primaryColor: '#dc2626',
      secondaryColor: '#171717',
      accentColor: '#fafafa'
    },
    {
      id: 'hcg',
      name: 'High Court of Ghana',
      acronym: 'HCG',
      description: 'Judicial Service - Court Records and Legal Documentation',
      contact: {
        address: 'High Court Complex, Accra Central',
        phone: '+233-302-664851',
        email: 'registry@courts.gov.gh',
        website: 'https://courts.gov.gh'
      },
      status: 'Active' as const,
      online: true,
      logo: '/image.png',
      primaryColor: '#7f1d1d',
      secondaryColor: '#171717',
      accentColor: '#fafafa'
    },
    {
      id: 'moe',
      name: 'Ministry of Education',
      acronym: 'MOE',
      description: 'Educational Certification and Academic Verification Services',
      contact: {
        address: 'Ministry of Education, Airport Residential Area, Accra',
        phone: '+233-302-666049',
        email: 'info@moe.gov.gh',
        website: 'https://moe.gov.gh'
      },
      status: 'Active' as const,
      online: true,
      logo: '/image.png',
      primaryColor: '#991b1b',
      secondaryColor: '#171717',
      accentColor: '#fafafa'
    }
  ];

  // Add GTEC to the institutions list
  const allInstitutions = [
    ...institutions,
    {
      id: 'gtec',
      name: 'Ghana Tertiary Education Commission',
      acronym: 'GTEC',
      description: 'Regulatory body for tertiary education in Ghana',
      contact: {
        address: 'GTEC House, Liberation Road, Accra',
        phone: '+233-302-244694',
        email: 'info@gtec.edu.gh',
        website: 'https://gtec.edu.gh'
      },
      status: 'Active' as const,
      online: true,
      logo: '/GTEC-LOGO-removebg-preview.png',
      primaryColor: '#1e40af',
      secondaryColor: '#171717',
      accentColor: '#fafafa'
    }
  ];

  const recentlyOnboardedInstitutions = [
    {
      id: 'recent-1',
      name: 'Ghana Immigration Service',
      acronym: 'GIS',
      email: 'admin@gis.gov.gh',
      onboardedDate: '2025-01-20',
      status: 'Recently Onboarded'
    },
    {
      id: 'recent-2',
      name: 'Ghana Revenue Authority',
      acronym: 'GRA',
      email: 'admin@gra.gov.gh',
      onboardedDate: '2025-01-18',
      status: 'Recently Onboarded'
    },
    {
      id: 'recent-3',
      name: 'Ghana Standards Authority',
      acronym: 'GSA',
      email: 'admin@gsa.gov.gh',
      onboardedDate: '2025-01-15',
      status: 'Recently Onboarded'
    }
  ];

  const handleSendOnboardingEmail = (institutionData: any) => {
    alert(`BacChecker onboarding email sent to ${institutionData.email}. The institution will receive the full setup wizard with BacChecker branding.`);
    setShowAddModal(false);
  };

  const getInstitutionIcon = (institutionId: string) => {
    switch (institutionId) {
      case 'gtec':
        return GraduationCap;
      case 'gps':
        return Shield;
      case 'hcg':
        return Scale;
      case 'moe':
        return GraduationCap;
      case 'ug':
      case 'knust':
      case 'ucc':
        return GraduationCap;
      default:
        return Building2;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Government Institutions Management</h1>
          <p className="text-gray-600">Manage all government institutions and their verification services</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            System Analytics
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Institution
          </Button>
        </div>
      </div>

      {/* Recently Onboarded Institutions */}
      {recentlyOnboardedInstitutions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recently Onboarded ({recentlyOnboardedInstitutions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentlyOnboardedInstitutions.map((institution) => (
                <div key={institution.id} className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{institution.name}</h4>
                      <p className="text-sm text-gray-600">{institution.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="success">{institution.status}</Badge>
                    <span className="text-sm text-gray-500">{institution.onboardedDate}</span>
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      View Setup
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Institutions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {allInstitutions.map((institution) => {
          const IconComponent = getInstitutionIcon(institution.id);
          
          return (
            <Card key={institution.id} className="hover:shadow-lg transition-all duration-200">
              <CardContent>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 bg-red-100 rounded-xl">
                      <IconComponent className="h-6 w-6 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{institution.name}</h3>
                      <p className="text-sm text-gray-600">{institution.acronym}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="success">{institution.status}</Badge>
                    <div className="flex items-center space-x-1">
                      <Activity className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{institution.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{institution.contact.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{institution.contact.phone}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{institution.contact.email}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                    <a 
                      href={institution.contact.website} 
                      className="text-red-600 hover:underline truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {institution.contact.website}
                    </a>
                  </div>
                </div>

                {/* Institution Type Badge */}
                <div className="mb-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">Institution Type</span>
                    <Badge variant="default">
                      {institution.id === 'gps' ? 'Security Services' :
                       institution.id === 'hcg' ? 'Judicial Services' :
                       institution.id === 'moe' ? 'Education Ministry' :
                       institution.id === 'gtec' ? 'Regulatory Body' :
                       ['ug', 'knust', 'ucc'].includes(institution.id) ? 'Tertiary Education' :
                       'Government Agency'}
                    </Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-1" />
                    Manage Users
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Settings className="h-4 w-4 mr-1" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Add Institution Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Government Institution</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Acronym *</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Type *</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Select type...</option>
                  <option value="security">Security Services</option>
                  <option value="judicial">Judicial Services</option>
                  <option value="ministry">Government Ministry</option>
                  <option value="agency">Government Agency</option>
                  <option value="regulatory">Regulatory Body</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address *</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input type="tel" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input type="url" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Services Offered</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" placeholder="List main services this institution will offer..."></textarea>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <img src="/image.png" alt="BacChecker" className="h-5 w-5" />
                  <span className="font-medium text-red-900">BacChecker Full Onboarding</span>
                </div>
                <p className="text-sm text-red-700">
                  This institution will receive the complete BacChecker onboarding experience with full setup wizard, 
                  service configuration, and template customization options.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Logo</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => handleSendOnboardingEmail({ email: 'new@institution.gov.gh' })}>
                  <Send className="h-4 w-4 mr-2" />
                  Add & Send Onboarding
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}