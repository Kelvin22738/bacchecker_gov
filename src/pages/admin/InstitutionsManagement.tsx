import React, { useState } from 'react';
import { useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { tertiaryInstitutionAPI, TertiaryInstitution } from '../../utils/supabase';
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
  GraduationCap,
  Activity,
  X,
  Upload,
  Key,
  Clock,
  CheckCircle,
  FileText,
  TrendingUp,
  BookOpen
} from 'lucide-react';

export function InstitutionsManagement() {
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCoursesModal, setShowCoursesModal] = useState(false);
  const [selectedInstitutionData, setSelectedInstitutionData] = useState<any>(null);
  const [institutions, setInstitutions] = useState<TertiaryInstitution[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingInstitutions, setPendingInstitutions] = useState<TertiaryInstitution[]>([]);

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      const data = await tertiaryInstitutionAPI.getGTECManaged();
      
      // Separate completed and pending institutions
      const completed = data.filter(inst => inst.onboarding_status === 'completed');
      const pending = data.filter(inst => inst.onboarding_status !== 'completed');
      
      setInstitutions(completed);
      setPendingInstitutions(pending);
    } catch (error) {
      console.error('Error loading institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOnboardingEmail = async (formData: any) => {
    try {
      // Create new institution in database
      const newInstitution = await tertiaryInstitutionAPI.create({
        name: formData.name,
        acronym: formData.acronym,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        website: formData.website,
        established_year: formData.established_year,
        student_population: formData.student_population,
        faculty_count: formData.faculty_count,
        institution_type: formData.institution_type,
        gtec_managed: true
      });

      // Generate onboarding URL
      const onboardingUrl = `${window.location.origin}/onboarding/${newInstitution.onboarding_token}`;
      
      // In a real app, this would send an actual email
      alert(`GTEC onboarding email sent to ${formData.email}!\n\nOnboarding URL: ${onboardingUrl}\n\nThe institution will receive simplified setup instructions with GTEC branding and pre-configured settings.`);
      
      // Refresh the institutions list
      loadInstitutions();
    } catch (error) {
      console.error('Error creating institution:', error);
      alert('Error creating institution. Please try again.');
    }
    setShowAddModal(false);
  };

  const handleViewCourses = (institution: any) => {
    setSelectedInstitutionData(institution);
    setShowCoursesModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tertiary Institutions Management</h1>
          <p className="text-gray-600">Manage accredited tertiary institutions and their verification services</p>
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

      {/* Pending Institutions */}
      {pendingInstitutions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Onboarding ({pendingInstitutions.length})</CardTitle>
              <Button variant="outline" size="sm" onClick={loadInstitutions}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingInstitutions.map((institution) => (
                <div key={institution.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{institution.name}</h4>
                      <p className="text-sm text-gray-600">{institution.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Badge variant="warning">
                      {institution.onboarding_status === 'pending' ? 'Pending Onboarding' : 
                       institution.onboarding_status === 'in_progress' ? 'In Progress' : 'Pending'}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      {new Date(institution.created_at).toLocaleDateString()}
                    </span>
                    {institution.onboarding_token && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => {
                          const url = `${window.location.origin}/onboarding/${institution.onboarding_token}`;
                          navigator.clipboard.writeText(url);
                          alert('Onboarding link copied to clipboard!');
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Copy Link
                      </Button>
                    )}
                    <Button size="sm" onClick={() => {
                      const url = `${window.location.origin}/onboarding/${institution.onboarding_token}`;
                      window.open(url, '_blank');
                    }}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Onboarding
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}

      {/* Active Institutions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {institutions.map((institution) => (
          <Card key={institution.id} className="hover:shadow-lg transition-all duration-200">
            <CardContent>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <GraduationCap className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{institution.name}</h3>
                    <p className="text-sm text-gray-600">{institution.acronym}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="success">Active</Badge>
                  <div className="flex items-center space-x-1">
                    <Activity className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-600">Online</span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {institution.institution_type.replace('_', ' ').toUpperCase()} • Established {institution.established_year}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{institution.address}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span>{institution.phone}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{institution.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Globe className="h-4 w-4 mr-2 flex-shrink-0" />
                  <a 
                    href={institution.website} 
                    className="text-blue-600 hover:underline truncate"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {institution.website}
                  </a>
                </div>
              </div>

              {/* Institution Statistics */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{institution.student_population?.toLocaleString() || 'N/A'}</p>
                  <p className="text-xs text-gray-600">Students</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">{institution.faculty_count || 'N/A'}</p>
                  <p className="text-xs text-gray-600">Faculty</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">--</p>
                  <p className="text-xs text-gray-600">Courses</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <p className="text-lg font-bold text-gray-900">--</p>
                  <p className="text-xs text-gray-600">Success Rate</p>
                </div>
              </div>

              {/* Accreditation Status */}
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-green-900">Accreditation Status</span>
                  <Badge variant="success">{institution.accreditation_status}</Badge>
                </div>
                <p className="text-xs text-green-700 mt-1">Established: {institution.established_year}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewCourses(institution)}>
                  <BookOpen className="h-4 w-4 mr-1" />
                  View Courses
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-1" />
                  View Profile
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
        ))}
      </div>

      {/* Add Institution Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Tertiary Institution</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Acronym *</label>
                  <input 
                    type="text" 
                    name="acronym"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Type *</label>
                <select 
                  name="institution_type"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select type...</option>
                  <option value="university">University</option>
                  <option value="technical">Technical University</option>
                  <option value="college">University College</option>
                  <option value="polytechnic">Polytechnic</option>
                  <option value="institute">Institute</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Address *</label>
                <input 
                  type="text" 
                  name="address"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input 
                    type="url" 
                    name="website"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                  <input 
                    type="number" 
                    name="established_year"
                    min="1800"
                    max={new Date().getFullYear()}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student Population</label>
                  <input 
                    type="number" 
                    name="student_population"
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Count</label>
                <input 
                  type="number" 
                  name="faculty_count"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <img src="/GTEC-LOGO-removebg-preview.png" alt="GTEC" className="h-5 w-5" />
                  <span className="font-medium text-blue-900">GTEC Simplified Onboarding</span>
                </div>
                <p className="text-sm text-blue-700">
                  This institution will receive a simplified onboarding process with GTEC branding and pre-configured settings. 
                  They will only need to confirm their details and upload their logo to complete setup.
                </p>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddModal(false)}>
                  Cancel
                </Button>
                <Button onClick={(e) => {
                  e.preventDefault();
                  const form = e.target.closest('form');
                  const formData = new FormData(form);
                  const data = Object.fromEntries(formData.entries());
                  handleSendOnboardingEmail(data);
                }}>
                  <Send className="h-4 w-4 mr-2" />
                  Add & Send Onboarding
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses Modal */}
      {showCoursesModal && selectedInstitutionData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCoursesModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{selectedInstitutionData.name} - Courses</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCoursesModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Course Categories */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Undergraduate Programs</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-blue-700">• Computer Science</div>
                    <div className="text-sm text-blue-700">• Business Administration</div>
                    <div className="text-sm text-blue-700">• Engineering</div>
                    <div className="text-sm text-blue-700">• Medicine</div>
                    <div className="text-sm text-blue-700">• Law</div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">Graduate Programs</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-green-700">• MBA</div>
                    <div className="text-sm text-green-700">• MSc Computer Science</div>
                    <div className="text-sm text-green-700">• PhD Programs</div>
                    <div className="text-sm text-green-700">• Master of Laws</div>
                    <div className="text-sm text-green-700">• Master of Medicine</div>
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">Professional Programs</h4>
                  <div className="space-y-2">
                    <div className="text-sm text-purple-700">• Executive MBA</div>
                    <div className="text-sm text-purple-700">• Certificate Programs</div>
                    <div className="text-sm text-purple-700">• Diploma Courses</div>
                    <div className="text-sm text-purple-700">• Short Courses</div>
                    <div className="text-sm text-purple-700">• Distance Learning</div>
                  </div>
                </div>
              </div>

              {/* Course Statistics */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Course Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{selectedInstitutionData.coursesOffered}</div>
                    <div className="text-sm text-gray-600">Total Courses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">12</div>
                    <div className="text-sm text-gray-600">Faculties</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">45</div>
                    <div className="text-sm text-gray-600">Departments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-600">Accreditation Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}