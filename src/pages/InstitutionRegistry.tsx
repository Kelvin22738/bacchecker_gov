import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Search,
  Filter,
  Eye,
  Edit,
  Plus,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  AlertCircle,
  GraduationCap,
  Users,
  Calendar,
  Award,
  X,
  RefreshCw
} from 'lucide-react';
import { tertiaryInstitutionAPI, TertiaryInstitution } from '../utils/supabase';
import { institutionProgramsAPI, InstitutionProgram } from '../utils/verificationAPI';

export function InstitutionRegistry() {
  const { state } = useAuth();
  const { user } = state;
  const [institutions, setInstitutions] = useState<TertiaryInstitution[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [programs, setPrograms] = useState<InstitutionProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProgramModal, setShowProgramModal] = useState(false);

  const isGTECAdmin = user?.role === 'gtec_admin';

  useEffect(() => {
    loadInstitutions();
  }, []);

  const loadInstitutions = async () => {
    try {
      setLoading(true);
      const data = await tertiaryInstitutionAPI.getGTECManaged();
      setInstitutions(data);
    } catch (error) {
      console.error('Error loading institutions:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async (institutionId: string) => {
    try {
      const data = await institutionProgramsAPI.getByInstitution(institutionId);
      setPrograms(data);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };

  const handleInstitutionSelect = (institutionId: string) => {
    setSelectedInstitution(institutionId);
    loadPrograms(institutionId);
  };

  const filteredInstitutions = institutions.filter(institution => {
    const searchMatch = institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       institution.acronym.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = statusFilter === 'all' || institution.accreditation_status === statusFilter;
    return searchMatch && statusMatch;
  });

  const selectedInstitutionData = selectedInstitution 
    ? institutions.find(i => i.id === selectedInstitution)
    : null;

  const getAccreditationBadge = (status: string) => {
    switch (status) {
      case 'Fully Accredited':
        return <Badge variant="success">Fully Accredited</Badge>;
      case 'Provisionally Accredited':
        return <Badge variant="warning">Provisional</Badge>;
      case 'Not Accredited':
        return <Badge variant="error">Not Accredited</Badge>;
      default:
        return <Badge variant="default">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Fully Accredited':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Not Accredited':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Tertiary Institution Registry</h1>
          <p className="text-gray-600">Comprehensive database of accredited tertiary institutions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={loadInstitutions}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Registry
          </Button>
          {isGTECAdmin && (
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Institution
            </Button>
          )}
        </div>
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
                  placeholder="Search institutions..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="Fully Accredited">Fully Accredited</option>
                <option value="Provisionally Accredited">Provisional</option>
                <option value="Not Accredited">Not Accredited</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Institutions List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Institutions ({filteredInstitutions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredInstitutions.map((institution) => (
                  <div
                    key={institution.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedInstitution === institution.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => handleInstitutionSelect(institution.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(institution.accreditation_status)}
                        <span className="font-medium text-gray-900">{institution.acronym}</span>
                      </div>
                      {getAccreditationBadge(institution.accreditation_status)}
                    </div>
                    
                    <p className="text-sm font-medium text-gray-900">{institution.name}</p>
                    <p className="text-xs text-gray-600">{institution.institution_type.replace('_', ' ')}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        Est. {institution.established_year}
                      </span>
                      <span className="text-xs text-gray-500">
                        {institution.student_population?.toLocaleString()} students
                      </span>
                    </div>
                  </div>
                ))}
                
                {filteredInstitutions.length === 0 && (
                  <div className="text-center py-8">
                    <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No institutions found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Institution Details */}
        <div className="lg:col-span-2">
          {selectedInstitutionData ? (
            <InstitutionDetails 
              institution={selectedInstitutionData}
              programs={programs}
              onAddProgram={() => setShowProgramModal(true)}
              isGTECAdmin={isGTECAdmin}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select an Institution</h3>
                <p className="text-gray-600">Choose an institution from the registry to view detailed information and manage programs.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Program Modal */}
      {showProgramModal && selectedInstitution && (
        <AddProgramModal
          institutionId={selectedInstitution}
          onSubmit={async (programData) => {
            try {
              await institutionProgramsAPI.create({
                ...programData,
                institution_id: selectedInstitution
              });
              loadPrograms(selectedInstitution);
              setShowProgramModal(false);
              alert('Program added successfully!');
            } catch (error) {
              console.error('Error adding program:', error);
              alert('Error adding program. Please try again.');
            }
          }}
          onClose={() => setShowProgramModal(false)}
        />
      )}
    </div>
  );
}

// Institution Details Component
function InstitutionDetails({ 
  institution, 
  programs, 
  onAddProgram, 
  isGTECAdmin 
}: {
  institution: TertiaryInstitution;
  programs: InstitutionProgram[];
  onAddProgram: () => void;
  isGTECAdmin: boolean;
}) {
  return (
    <div className="space-y-6">
      {/* Institution Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{institution.name}</CardTitle>
              <p className="text-gray-600">{institution.acronym}</p>
            </div>
            <div className="flex space-x-2">
              {isGTECAdmin && (
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View Profile
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-900">{institution.student_population?.toLocaleString() || 'N/A'}</div>
              <div className="text-sm text-gray-600">Students</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-900">{institution.faculty_count || 'N/A'}</div>
              <div className="text-sm text-gray-600">Faculty</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-900">{programs.length}</div>
              <div className="text-sm text-gray-600">Programs</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-2xl font-bold text-gray-900">{institution.established_year}</div>
              <div className="text-sm text-gray-600">Established</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Institution Information */}
      <Card>
        <CardHeader>
          <CardTitle>Institution Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Institution Type</label>
                <p className="text-gray-900">{institution.institution_type.replace('_', ' ')}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Accreditation Status</label>
                <div className="flex items-center space-x-2">
                  <Badge variant={institution.accreditation_status === 'Fully Accredited' ? 'success' : 'warning'}>
                    {institution.accreditation_status}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Contact Email</label>
                <p className="text-gray-900">{institution.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{institution.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Address</label>
                <p className="text-gray-900">{institution.address || 'Not provided'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Website</label>
                <p className="text-gray-900">
                  {institution.website ? (
                    <a href={institution.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      {institution.website}
                    </a>
                  ) : 'Not provided'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">GTEC Managed</label>
                <Badge variant={institution.gtec_managed ? 'success' : 'default'}>
                  {institution.gtec_managed ? 'Yes' : 'No'}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Onboarding Status</label>
                <Badge variant={institution.onboarding_status === 'completed' ? 'success' : 'warning'}>
                  {institution.onboarding_status}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Programs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Academic Programs ({programs.length})</CardTitle>
            {isGTECAdmin && (
              <Button size="sm" onClick={onAddProgram}>
                <Plus className="h-4 w-4 mr-2" />
                Add Program
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {programs.map((program) => (
              <div key={program.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{program.program_name}</p>
                    <p className="text-sm text-gray-600">{program.program_code} • {program.program_level}</p>
                    {program.faculty && (
                      <p className="text-xs text-gray-500">{program.faculty}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={program.accreditation_status === 'accredited' ? 'success' : 'warning'} size="sm">
                    {program.accreditation_status}
                  </Badge>
                  <Badge variant={program.program_status === 'active' ? 'success' : 'default'} size="sm">
                    {program.program_status}
                  </Badge>
                  {isGTECAdmin && (
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {programs.length === 0 && (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No programs registered</p>
                {isGTECAdmin && (
                  <Button variant="outline" size="sm" className="mt-2" onClick={onAddProgram}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Program
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add Program Modal
function AddProgramModal({ 
  institutionId, 
  onSubmit, 
  onClose 
}: {
  institutionId: string;
  onSubmit: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    program_code: '',
    program_name: '',
    program_level: 'bachelor',
    faculty: '',
    department: '',
    duration_years: 4,
    accreditation_status: 'accredited',
    program_status: 'active',
    entry_requirements: '',
    graduation_requirements: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Add Academic Program</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Code *</label>
              <input 
                type="text"
                value={formData.program_code}
                onChange={(e) => setFormData({...formData, program_code: e.target.value})}
                required
                placeholder="e.g., BSC-CS"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Level *</label>
              <select 
                value={formData.program_level}
                onChange={(e) => setFormData({...formData, program_level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="certificate">Certificate</option>
                <option value="diploma">Diploma</option>
                <option value="bachelor">Bachelor</option>
                <option value="master">Master</option>
                <option value="doctorate">Doctorate</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Program Name *</label>
            <input 
              type="text"
              value={formData.program_name}
              onChange={(e) => setFormData({...formData, program_name: e.target.value})}
              required
              placeholder="e.g., Bachelor of Science in Computer Science"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
              <input 
                type="text"
                value={formData.faculty}
                onChange={(e) => setFormData({...formData, faculty: e.target.value})}
                placeholder="e.g., Faculty of Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input 
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g., Department of Computer Science"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Years)</label>
              <input 
                type="number"
                value={formData.duration_years}
                onChange={(e) => setFormData({...formData, duration_years: parseInt(e.target.value)})}
                min="1"
                max="10"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation Status</label>
              <select 
                value={formData.accreditation_status}
                onChange={(e) => setFormData({...formData, accreditation_status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="accredited">Accredited</option>
                <option value="provisional">Provisional</option>
                <option value="suspended">Suspended</option>
                <option value="revoked">Revoked</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Program Status</label>
              <select 
                value={formData.program_status}
                onChange={(e) => setFormData({...formData, program_status: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entry Requirements</label>
            <textarea 
              value={formData.entry_requirements}
              onChange={(e) => setFormData({...formData, entry_requirements: e.target.value})}
              rows={3}
              placeholder="Describe the entry requirements for this program..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Requirements</label>
            <textarea 
              value={formData.graduation_requirements}
              onChange={(e) => setFormData({...formData, graduation_requirements: e.target.value})}
              rows={3}
              placeholder="Describe the graduation requirements for this program..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Add Program
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}