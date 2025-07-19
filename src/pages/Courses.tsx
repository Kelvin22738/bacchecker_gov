import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Plus,
  Edit,
  Trash2,
  Search,
  Filter,
  BookOpen,
  Users,
  Calendar,
  Award,
  X,
  Upload
} from 'lucide-react';

export function Courses() {
  const { state } = useAuth();
  const { user } = state;
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showEditCourseModal, setShowEditCourseModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  // Mock courses data based on institution
  const getInstitutionCourses = () => {
    switch (user?.institutionId) {
      case 'ug':
        return [
          {
            id: 'course-1',
            name: 'Computer Science',
            code: 'BSc CS',
            level: 'Undergraduate',
            duration: '4 years',
            faculty: 'Faculty of Physical and Computational Sciences',
            department: 'Department of Computer Science',
            accreditationStatus: 'Fully Accredited',
            studentsEnrolled: 450,
            graduatesLastYear: 89,
            description: 'Comprehensive computer science program covering software engineering, algorithms, and systems.'
          },
          {
            id: 'course-2',
            name: 'Business Administration',
            code: 'BBA',
            level: 'Undergraduate',
            duration: '4 years',
            faculty: 'University of Ghana Business School',
            department: 'Department of Management Studies',
            accreditationStatus: 'Fully Accredited',
            studentsEnrolled: 680,
            graduatesLastYear: 156,
            description: 'Business administration program with focus on management, finance, and entrepreneurship.'
          },
          {
            id: 'course-3',
            name: 'Master of Business Administration',
            code: 'MBA',
            level: 'Graduate',
            duration: '2 years',
            faculty: 'University of Ghana Business School',
            department: 'Graduate School of Business',
            accreditationStatus: 'Fully Accredited',
            studentsEnrolled: 120,
            graduatesLastYear: 45,
            description: 'Executive MBA program for working professionals and business leaders.'
          },
          {
            id: 'course-4',
            name: 'Medicine and Surgery',
            code: 'MBChB',
            level: 'Undergraduate',
            duration: '6 years',
            faculty: 'School of Medicine and Dentistry',
            department: 'Department of Medicine',
            accreditationStatus: 'Fully Accredited',
            studentsEnrolled: 280,
            graduatesLastYear: 42,
            description: 'Medical degree program training future doctors and healthcare professionals.'
          }
        ];
      case 'knust':
        return [
          {
            id: 'course-5',
            name: 'Mechanical Engineering',
            code: 'BSc Mech Eng',
            level: 'Undergraduate',
            duration: '4 years',
            faculty: 'College of Engineering',
            department: 'Department of Mechanical Engineering',
            accreditationStatus: 'Fully Accredited',
            studentsEnrolled: 520,
            graduatesLastYear: 98,
            description: 'Engineering program focusing on mechanical systems, design, and manufacturing.'
          },
          {
            id: 'course-6',
            name: 'Architecture',
            code: 'BSc Arch',
            level: 'Undergraduate',
            duration: '5 years',
            faculty: 'College of Art and Built Environment',
            department: 'Department of Architecture',
            accreditationStatus: 'Fully Accredited',
            studentsEnrolled: 340,
            graduatesLastYear: 67,
            description: 'Architecture program combining design, technology, and environmental considerations.'
          }
        ];
      default:
        return [];
    }
  };

  const courses = getInstitutionCourses();

  const filteredCourses = courses.filter(course => {
    const searchMatch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       course.faculty.toLowerCase().includes(searchQuery.toLowerCase());
    const levelMatch = levelFilter === 'all' || course.level === levelFilter;
    return searchMatch && levelMatch;
  });

  const selectedCourseData = selectedCourse 
    ? courses.find(c => c.id === selectedCourse)
    : null;

  const uniqueLevels = [...new Set(courses.map(c => c.level))];

  const handleAddCourse = () => {
    alert('Course added successfully!');
    setShowAddCourseModal(false);
  };

  const handleEditCourse = () => {
    alert('Course updated successfully!');
    setShowEditCourseModal(false);
  };

  const handleDeleteCourse = (courseId: string) => {
    if (confirm('Are you sure you want to delete this course?')) {
      alert(`Course ${courseId} has been deleted.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>
          <p className="text-gray-600">Manage your institution's academic programs and courses</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Import Courses
          </Button>
          <Button onClick={() => setShowAddCourseModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Course
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search courses by name, code, or faculty..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Level Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Level:</span>
              <div className="flex space-x-1">
                {['all', ...uniqueLevels].map((level) => (
                  <button
                    key={level}
                    onClick={() => setLevelFilter(level)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      levelFilter === level
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {level === 'all' ? 'All' : level}
                    <span className="ml-1 text-xs">
                      ({level === 'all' ? courses.length : courses.filter(c => c.level === level).length})
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Courses ({filteredCourses.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredCourses.map((course) => (
                  <div
                    key={course.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedCourse === course.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedCourse(course.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-gray-900">{course.code}</span>
                      </div>
                      <Badge variant={course.level === 'Graduate' ? 'info' : 'success'} size="sm">
                        {course.level}
                      </Badge>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-900">{course.name}</p>
                    <p className="text-xs text-gray-600">{course.faculty}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {course.studentsEnrolled} students
                      </span>
                      <Badge variant="success" size="sm">
                        {course.accreditationStatus}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {filteredCourses.length === 0 && (
                  <div className="text-center py-8">
                    <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No courses found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Course Details */}
        <div className="lg:col-span-2">
          {selectedCourseData ? (
            <div className="space-y-6">
              {/* Course Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedCourseData.name}</CardTitle>
                      <p className="text-gray-600">
                        {selectedCourseData.code} • {selectedCourseData.duration}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => setShowEditCourseModal(true)}>
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDeleteCourse(selectedCourseData.id)}>
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900">
                        {selectedCourseData.studentsEnrolled}
                      </p>
                      <p className="text-xs text-gray-600">Enrolled</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Award className="h-5 w-5 text-green-600 mx-auto mb-1" />
                      <p className="text-lg font-bold text-gray-900">
                        {selectedCourseData.graduatesLastYear}
                      </p>
                      <p className="text-xs text-gray-600">Graduates (2023)</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Calendar className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-gray-900">
                        {selectedCourseData.duration}
                      </p>
                      <p className="text-xs text-gray-600">Duration</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Badge variant="success" size="sm">
                        {selectedCourseData.accreditationStatus}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <p className="text-gray-900 mt-1">{selectedCourseData.description}</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Faculty</label>
                        <p className="text-gray-900">{selectedCourseData.faculty}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Department</label>
                        <p className="text-gray-900">{selectedCourseData.department}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Level</label>
                        <p className="text-gray-900">{selectedCourseData.level}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Course Code</label>
                        <p className="text-gray-900">{selectedCourseData.code}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Course Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>Course Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Enrollment Trends</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Current Year:</span>
                          <span className="font-medium">{selectedCourseData.studentsEnrolled}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Last Year:</span>
                          <span className="font-medium">{selectedCourseData.studentsEnrolled - 23}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Growth:</span>
                          <span className="font-medium text-green-600">+5.4%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Graduation Rates</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-green-700">2023 Graduates:</span>
                          <span className="font-medium">{selectedCourseData.graduatesLastYear}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Success Rate:</span>
                          <span className="font-medium">94.2%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Employment Rate:</span>
                          <span className="font-medium">87.6%</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Quality Metrics</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span className="text-purple-700">Student Satisfaction:</span>
                          <span className="font-medium">4.3/5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700">Faculty Rating:</span>
                          <span className="font-medium">4.1/5.0</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-700">Industry Rating:</span>
                          <span className="font-medium">4.5/5.0</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <GraduationCap className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Course</h3>
                <p className="text-gray-600">Choose a course from the list to view details and manage information.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddCourseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowAddCourseModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Add New Course</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowAddCourseModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">Select level...</option>
                    <option value="Undergraduate">Undergraduate</option>
                    <option value="Graduate">Graduate</option>
                    <option value="Postgraduate">Postgraduate</option>
                    <option value="Certificate">Certificate</option>
                    <option value="Diploma">Diploma</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <input type="text" placeholder="e.g., 4 years" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowAddCourseModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddCourse}>
                  Add Course
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Course Modal */}
      {showEditCourseModal && selectedCourseData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowEditCourseModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Edit Course</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowEditCourseModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
                  <input 
                    type="text" 
                    defaultValue={selectedCourseData.name}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
                  <input 
                    type="text" 
                    defaultValue={selectedCourseData.code}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  rows={3} 
                  defaultValue={selectedCourseData.description}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level</label>
                  <select 
                    defaultValue={selectedCourseData.level}
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
                    defaultValue={selectedCourseData.duration}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
                <input 
                  type="text" 
                  defaultValue={selectedCourseData.faculty}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input 
                  type="text" 
                  defaultValue={selectedCourseData.department}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowEditCourseModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleEditCourse}>
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}