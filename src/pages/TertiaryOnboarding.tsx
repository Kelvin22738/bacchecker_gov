import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  CheckCircle,
  Circle,
  ArrowLeft,
  ArrowRight,
  Upload,
  Save,
  GraduationCap,
  Building2,
  Users,
  BookOpen,
  Settings,
  Eye,
  Plus,
  X
} from 'lucide-react';
import { tertiaryInstitutionAPI, onboardingStepsAPI, coursesAPI, TertiaryInstitution, InstitutionCourse } from '../utils/supabase';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export function TertiaryOnboarding() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  
  const [institution, setInstitution] = useState<TertiaryInstitution | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [courses, setCourses] = useState<InstitutionCourse[]>([]);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to BacChecker',
      description: 'Get started with GTEC verification platform',
      completed: false,
      required: true
    },
    {
      id: 'institution_info',
      title: 'Institution Information',
      description: 'Verify and update your institution details',
      completed: false,
      required: true
    },
    {
      id: 'branding',
      title: 'Branding & Appearance',
      description: 'Customize your institution\'s appearance',
      completed: false,
      required: false
    },
    {
      id: 'courses',
      title: 'Academic Programs',
      description: 'Add your courses and programs',
      completed: false,
      required: true
    },
    {
      id: 'verification_services',
      title: 'Verification Services',
      description: 'Configure verification services',
      completed: false,
      required: true
    },
    {
      id: 'review',
      title: 'Review & Launch',
      description: 'Review setup and go live',
      completed: false,
      required: true
    }
  ];

  const [formData, setFormData] = useState({
    name: '',
    acronym: '',
    email: '',
    phone: '',
    address: '',
    website: '',
    established_year: new Date().getFullYear(),
    student_population: 0,
    faculty_count: 0,
    institution_type: 'university',
    primary_color: '#1e40af',
    secondary_color: '#171717',
    accent_color: '#fafafa'
  });

  const [newCourse, setNewCourse] = useState({
    name: '',
    code: '',
    level: 'Undergraduate',
    duration: '',
    faculty: '',
    department: '',
    students_enrolled: 0,
    graduates_last_year: 0,
    description: ''
  });

  useEffect(() => {
    if (token) {
      loadInstitution();
    }
  }, [token]);

  const loadInstitution = async () => {
    try {
      setLoading(true);
      const data = await tertiaryInstitutionAPI.getByToken(token!);
      setInstitution(data);
      setFormData({
        name: data.name || '',
        acronym: data.acronym || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        website: data.website || '',
        established_year: data.established_year || new Date().getFullYear(),
        student_population: data.student_population || 0,
        faculty_count: data.faculty_count || 0,
        institution_type: data.institution_type || 'university',
        primary_color: data.primary_color || '#1e40af',
        secondary_color: data.secondary_color || '#171717',
        accent_color: data.accent_color || '#fafafa'
      });

      // Load courses if they exist
      if (data.id) {
        const coursesData = await coursesAPI.getByInstitution(data.id);
        setCourses(coursesData);
      }

      // Update onboarding status to in_progress if still pending
      if (data.onboarding_status === 'pending') {
        await tertiaryInstitutionAPI.update(data.id, { onboarding_status: 'in_progress' });
      }
    } catch (error) {
      console.error('Error loading institution:', error);
      alert('Invalid or expired onboarding link');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      await saveCurrentStep();
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveCurrentStep = async () => {
    if (!institution) return;

    setSaving(true);
    try {
      const stepName = steps[currentStep].id;
      
      if (stepName === 'institution_info' || stepName === 'branding') {
        // Update institution data
        await tertiaryInstitutionAPI.update(institution.id, formData);
      }

      // Save step completion
      await onboardingStepsAPI.upsertStep(
        institution.id,
        stepName,
        stepName === 'courses' ? { courses } : formData,
        true
      );

      // Update local steps state
      steps[currentStep].completed = true;
    } catch (error) {
      console.error('Error saving step:', error);
      alert('Error saving progress. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const completeOnboarding = async () => {
    if (!institution) return;

    setSaving(true);
    try {
      await saveCurrentStep();
      await tertiaryInstitutionAPI.completeOnboarding(institution.id);
      
      alert('Onboarding completed successfully! Welcome to BacChecker.');
      navigate('/user');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      alert('Error completing onboarding. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const addCourse = async () => {
    if (!institution) return;

    try {
      const courseData = await coursesAPI.create({
        ...newCourse,
        institution_id: institution.id
      });
      setCourses([...courses, courseData]);
      setNewCourse({
        name: '',
        code: '',
        level: 'Undergraduate',
        duration: '',
        faculty: '',
        department: '',
        students_enrolled: 0,
        graduates_last_year: 0,
        description: ''
      });
      setShowAddCourseModal(false);
    } catch (error) {
      console.error('Error adding course:', error);
      alert('Error adding course. Please try again.');
    }
  };

  const renderStepContent = () => {
    const step = steps[currentStep];

    switch (step.id) {
      case 'welcome':
        return (
          <div className="text-center py-8">
            <div className="flex items-center justify-center mb-6">
              <img src="/GTEC-LOGO-removebg-preview.png" alt="GTEC" className="h-16 w-16 mr-4" />
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Welcome to BacChecker</h2>
                <p className="text-blue-700">Powered by Ghana Tertiary Education Commission</p>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">You've been invited by GTEC</h3>
              <p className="text-blue-700 mb-4">
                The Ghana Tertiary Education Commission has invited your institution to join the 
                BacChecker verification platform. This will enable you to:
              </p>
              <ul className="text-left text-blue-700 space-y-2">
                <li>• Issue verified academic certificates</li>
                <li>• Manage student transcripts digitally</li>
                <li>• Participate in the national verification network</li>
                <li>• Streamline academic credential verification</li>
              </ul>
            </div>
            <p className="text-gray-600">
              This setup process will take about 10-15 minutes. You can save your progress and return later.
            </p>
          </div>
        );

      case 'institution_info':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Acronym *</label>
                <input
                  type="text"
                  value={formData.acronym}
                  onChange={(e) => setFormData({ ...formData, acronym: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
                <input
                  type="number"
                  value={formData.established_year}
                  onChange={(e) => setFormData({ ...formData, established_year: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Institution Type</label>
                <select
                  value={formData.institution_type}
                  onChange={(e) => setFormData({ ...formData, institution_type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="university">University</option>
                  <option value="technical_university">Technical University</option>
                  <option value="university_college">University College</option>
                  <option value="polytechnic">Polytechnic</option>
                  <option value="institute">Institute</option>
                  <option value="private_university">Private University</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student Population</label>
                <input
                  type="number"
                  value={formData.student_population}
                  onChange={(e) => setFormData({ ...formData, student_population: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty Count</label>
                <input
                  type="number"
                  value={formData.faculty_count}
                  onChange={(e) => setFormData({ ...formData, faculty_count: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        );

      case 'branding':
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Institution Logo</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Upload your institution logo</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Brand Colors</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Accent Color</label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.accent_color}
                      onChange={(e) => setFormData({ ...formData, accent_color: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Preview</h5>
              <div 
                className="p-4 rounded-lg text-white"
                style={{ backgroundColor: formData.primary_color }}
              >
                <div className="flex items-center space-x-3">
                  <img src="/GTEC-LOGO-removebg-preview.png" alt="Logo" className="w-8 h-8 bg-white rounded p-1" />
                  <div>
                    <h6 className="font-bold">{formData.name || 'Institution Name'}</h6>
                    <p className="text-sm opacity-90">{formData.acronym || 'ACRONYM'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Academic Programs</h3>
              <Button onClick={() => setShowAddCourseModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{course.name}</h4>
                    <Badge variant="success">{course.level}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Code: {course.code}</p>
                  <p className="text-sm text-gray-600 mb-2">Faculty: {course.faculty}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{course.students_enrolled} students</span>
                    <span className="text-gray-500">{course.duration}</span>
                  </div>
                </div>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">No courses added yet</h4>
                <p className="text-gray-600 mb-4">Add your academic programs to get started</p>
                <Button onClick={() => setShowAddCourseModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Course
                </Button>
              </div>
            )}
          </div>
        );

      case 'verification_services':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">GTEC Verification Services</h3>
              <p className="text-blue-700 mb-4">
                As a GTEC-managed institution, the following verification services will be automatically 
                configured for you:
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-blue-700">Academic Certificate Verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-blue-700">Official Transcript Requests</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-blue-700">Course Accreditation Verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-blue-700">Faculty Verification</span>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-medium text-green-900 mb-2">Ready to Go</h4>
              <p className="text-green-700 text-sm">
                Your verification services are pre-configured according to GTEC standards. 
                You can customize them later from your dashboard.
              </p>
            </div>
          </div>
        );

      case 'review':
        return (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
                <div>
                  <h3 className="text-xl font-bold text-green-900">Setup Complete!</h3>
                  <p className="text-green-700">Your institution is ready to join the BacChecker network</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Institution Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{formData.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Acronym:</span>
                      <span className="font-medium">{formData.acronym}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{formData.institution_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Students:</span>
                      <span className="font-medium">{formData.student_population.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Faculty:</span>
                      <span className="font-medium">{formData.faculty_count}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Courses Added</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {courses.slice(0, 5).map((course) => (
                      <div key={course.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-900">{course.name}</span>
                        <Badge variant="default" size="sm">{course.level}</Badge>
                      </div>
                    ))}
                    {courses.length > 5 && (
                      <p className="text-xs text-gray-500">+{courses.length - 5} more courses</p>
                    )}
                    {courses.length === 0 && (
                      <p className="text-sm text-gray-500">No courses added</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center py-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready to Launch</h4>
              <p className="text-gray-600 mb-6">
                Click the button below to complete your onboarding and access your dashboard.
              </p>
              <Button size="lg" onClick={completeOnboarding} disabled={saving}>
                {saving ? 'Completing...' : 'Complete Onboarding & Launch'}
              </Button>
            </div>
          </div>
        );

      default:
        return <div>Step not found</div>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading onboarding...</p>
        </div>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Onboarding Link</h2>
          <p className="text-gray-600">This onboarding link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/GTEC-LOGO-removebg-preview.png" alt="GTEC" className="h-10 w-10" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">GTEC Institution Onboarding</h1>
              <p className="text-sm text-gray-600">BacChecker Verification Platform</p>
            </div>
          </div>
          
          <div className="flex-1 max-w-md mx-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{currentStep + 1} of {steps.length}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-600">{institution.name}</p>
            <p className="text-xs text-gray-500">{institution.acronym}</p>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 min-h-screen p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Setup Steps</h3>
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                  index === currentStep
                    ? 'bg-blue-50 border border-blue-200'
                    : step.completed
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {step.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : index === currentStep ? (
                    <div className="h-5 w-5 bg-blue-600 rounded-full flex items-center justify-center">
                      <div className="h-2 w-2 bg-white rounded-full" />
                    </div>
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${
                    index === currentStep
                      ? 'text-blue-900'
                      : step.completed
                      ? 'text-green-900'
                      : 'text-gray-700'
                  }`}>
                    {step.title}
                  </p>
                  <p className={`text-xs ${
                    index === currentStep
                      ? 'text-blue-600'
                      : step.completed
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{steps[currentStep].title}</h2>
              <p className="text-lg text-gray-600">{steps[currentStep].description}</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              {renderStepContent()}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div>
                {currentStep > 0 && (
                  <Button variant="outline" onClick={handlePrevious}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                )}
              </div>

              <div>
                {currentStep < steps.length - 1 ? (
                  <Button onClick={handleNext} disabled={saving}>
                    {saving ? 'Saving...' : 'Continue'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button onClick={completeOnboarding} disabled={saving}>
                    {saving ? 'Completing...' : 'Complete Setup'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add Course</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddCourseModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); addCourse(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label>
                  <input
                    type="text"
                    value={newCourse.name}
                    onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code *</label>
                  <input
                    type="text"
                    value={newCourse.code}
                    onChange={(e) => setNewCourse({ ...newCourse, code: e.target.value })}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                  <select
                    value={newCourse.level}
                    onChange={(e) => setNewCourse({ ...newCourse, level: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input
                    type="text"
                    value={newCourse.duration}
                    onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
                    placeholder="e.g., 4 years"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                  <input
                    type="text"
                    value={newCourse.faculty}
                    onChange={(e) => setNewCourse({ ...newCourse, faculty: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newCourse.department}
                    onChange={(e) => setNewCourse({ ...newCourse, department: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newCourse.description}
                  onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddCourseModal(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}