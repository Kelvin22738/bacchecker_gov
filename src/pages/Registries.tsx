import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  Database,
  Plus,
  Edit,
  Search,
  Download,
  Upload,
  Eye,
  Settings,
  Users,
  Lock,
  Unlock,
  FileText,
  Calendar
} from 'lucide-react';

interface Registry {
  id: string;
  name: string;
  description: string;
  records: number;
  fields: number;
  lastUpdated: string;
  isPublic: boolean;
  searchable: boolean;
}

export function Registries() {
  const { state } = useAuth();
  const { user } = state;
  const [selectedRegistry, setSelectedRegistry] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkUploadModal, setShowBulkUploadModal] = useState(false);

  // Mock registries based on institution
  const getInstitutionRegistries = (): Registry[] => {
    switch (user?.institutionId) {
      case 'gps':
        return [
          {
            id: 'reg-criminal',
            name: 'Criminal Cases',
            description: 'Database of criminal records and background checks',
            records: 25124,
            fields: 8,
            lastUpdated: new Date().toISOString(),
            isPublic: false,
            searchable: true
          },
          {
            id: 'reg-incidents',
            name: 'Incident Reports',
            description: 'Police incident reports and case files',
            records: 15678,
            fields: 12,
            lastUpdated: new Date(Date.now() - 86400000).toISOString(),
            isPublic: false,
            searchable: true
          }
        ];
      case 'hcg':
        return [
          {
            id: 'reg-cases',
            name: 'Court Cases',
            description: 'Registry of all court cases and legal proceedings',
            records: 18934,
            fields: 10,
            lastUpdated: new Date().toISOString(),
            isPublic: true,
            searchable: true
          },
          {
            id: 'reg-judgments',
            name: 'Judgments',
            description: 'Court judgments and legal decisions',
            records: 12456,
            fields: 15,
            lastUpdated: new Date(Date.now() - 172800000).toISOString(),
            isPublic: true,
            searchable: true
          }
        ];
      case 'moe':
        return [
          {
            id: 'reg-certificates',
            name: 'Educational Certificates',
            description: 'Verified educational certificates and academic records',
            records: 45672,
            fields: 12,
            lastUpdated: new Date().toISOString(),
            isPublic: true,
            searchable: true
          },
          {
            id: 'reg-institutions',
            name: 'Educational Institutions',
            description: 'Registry of accredited educational institutions',
            records: 2345,
            fields: 8,
            lastUpdated: new Date(Date.now() - 259200000).toISOString(),
            isPublic: true,
            searchable: true
          }
        ];
      default:
        return [];
    }
  };

  const registries = getInstitutionRegistries();
  const selectedRegistryData = selectedRegistry 
    ? registries.find(r => r.id === selectedRegistry)
    : null;

  const mockFields = [
    { id: 'field-1', name: 'fullName', label: 'Full Name', type: 'text', required: true },
    { id: 'field-2', name: 'idNumber', label: 'ID Number', type: 'text', required: true },
    { id: 'field-3', name: 'dateOfBirth', label: 'Date of Birth', type: 'date', required: true },
    { id: 'field-4', name: 'status', label: 'Status', type: 'select', required: true },
    { id: 'field-5', name: 'notes', label: 'Notes', type: 'textarea', required: false }
  ];

  const mockRecords = Array.from({ length: 10 }, (_, i) => ({
    id: `record-${i + 1}`,
    fullName: ['John Doe', 'Jane Smith', 'Kofi Asante', 'Ama Osei', 'Michael Johnson'][i % 5],
    idNumber: `GHA-${Math.random().toString().substr(2, 9)}-${i % 10}`,
    dateOfBirth: new Date(1970 + (i % 30), i % 12, (i % 28) + 1).toISOString().split('T')[0],
    status: ['Active', 'Inactive', 'Pending', 'Verified'][i % 4]
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Registry Builder</h1>
          <p className="text-gray-600">Create and manage data registries for your institution</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowBulkUploadModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Registry
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registries List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Your Registries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {registries.map((registry) => (
                  <div
                    key={registry.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedRegistry === registry.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedRegistry(registry.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{registry.name}</h4>
                      <div className="flex items-center space-x-1">
                        {registry.isPublic ? (
                          <Unlock className="h-4 w-4 text-green-600" />
                        ) : (
                          <Lock className="h-4 w-4 text-gray-400" />
                        )}
                        <Badge variant="default" size="sm">
                          {registry.records.toLocaleString()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{registry.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-500">
                        {registry.fields} fields
                      </span>
                      <Badge variant={registry.searchable ? 'success' : 'default'} size="sm">
                        {registry.searchable ? 'Searchable' : 'Private'}
                      </Badge>
                    </div>
                  </div>
                ))}
                
                {registries.length === 0 && (
                  <div className="text-center py-8">
                    <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No registries created yet</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={() => setShowCreateModal(true)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Create First Registry
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Registry Details */}
        <div className="lg:col-span-2">
          {selectedRegistryData ? (
            <div className="space-y-6">
              {/* Registry Info */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{selectedRegistryData.name}</CardTitle>
                      <p className="text-gray-600">{selectedRegistryData.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-lg font-bold text-gray-900">{selectedRegistryData.records.toLocaleString()}</p>
                      <p className="text-xs text-gray-600">Total Records</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-lg font-bold text-gray-900">{selectedRegistryData.fields}</p>
                      <p className="text-xs text-gray-600">Fields</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Badge variant={selectedRegistryData.isPublic ? 'success' : 'default'}>
                        {selectedRegistryData.isPublic ? 'Public' : 'Private'}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">Visibility</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <Badge variant={selectedRegistryData.searchable ? 'info' : 'default'}>
                        {selectedRegistryData.searchable ? 'Yes' : 'No'}
                      </Badge>
                      <p className="text-xs text-gray-600 mt-1">Searchable</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Registry Fields */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Registry Schema</CardTitle>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Field
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mockFields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-900">{field.label}</span>
                            {field.required && (
                              <Badge variant="error" size="sm">Required</Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            Type: {field.type} • Name: {field.name}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Registry Data */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Registry Data</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-1" />
                        Search
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-1" />
                        Import
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {mockFields.slice(0, 4).map((field) => (
                            <th key={field.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              {field.label}
                            </th>
                          ))}
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockRecords.map((record) => (
                          <tr key={record.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.fullName}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.idNumber}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {record.dateOfBirth}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <Badge variant="success" size="sm">{record.status}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Registry</h3>
                <p className="text-gray-600">Choose a registry from the list to view its details and manage data.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Create Registry Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Registry</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Registry Name</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"></textarea>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 mb-3">Schema Builder</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
                    <input type="text" placeholder="Field Name" className="flex-1 px-3 py-2 border border-gray-300 rounded" />
                    <select className="px-3 py-2 border border-gray-300 rounded">
                      <option>Text</option>
                      <option>Number</option>
                      <option>Date</option>
                      <option>File</option>
                    </select>
                    <label className="flex items-center">
                      <input type="checkbox" className="mr-1" />
                      Required
                    </label>
                  </div>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Field
                  </Button>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowCreateModal(false)}>
                  Create Registry
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Upload Modal */}
      {showBulkUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Upload Data</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Registry</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
                  <option value="">Choose registry...</option>
                  {registries.map(registry => (
                    <option key={registry.id} value={registry.id}>{registry.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload File</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">CSV or JSON files only</p>
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowBulkUploadModal(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowBulkUploadModal(false)}>
                  Upload
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}