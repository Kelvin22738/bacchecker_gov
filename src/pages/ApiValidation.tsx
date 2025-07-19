import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  Key,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Code,
  Shield,
  Activity,
  CheckCircle,
  AlertCircle,
  X,
  Search,
  Download
} from 'lucide-react';

export function ApiValidation() {
  const { state } = useAuth();
  const { user } = state;
  const [activeTab, setActiveTab] = useState('api-keys');
  const [showCreateKeyModal, setShowCreateKeyModal] = useState(false);
  const [showKeyDetails, setShowKeyDetails] = useState<string | null>(null);
  const [validationQuery, setValidationQuery] = useState('');
  const [validationResult, setValidationResult] = useState<any>(null);

  // Mock API keys data
  const apiKeys = [
    {
      id: 'key-1',
      name: 'Third-Party Verification System',
      key: 'bac_live_sk_1234567890abcdef',
      permissions: ['verify_documents', 'read_registries'],
      rateLimit: 1000,
      isActive: true,
      lastUsed: '2024-01-25T10:30:00Z',
      usage: {
        totalCalls: 15847,
        monthlyLimit: 50000,
        currentMonth: 3247
      }
    },
    {
      id: 'key-2',
      name: 'Internal Dashboard API',
      key: 'bac_live_sk_abcdef1234567890',
      permissions: ['read_registries', 'check_status'],
      rateLimit: 500,
      isActive: true,
      lastUsed: '2024-01-24T16:45:00Z',
      usage: {
        totalCalls: 8934,
        monthlyLimit: 25000,
        currentMonth: 1876
      }
    }
  ];

  const handleCreateKey = () => {
    alert('New API key created successfully!');
    setShowCreateKeyModal(false);
  };

  const handleRevokeKey = (keyId: string) => {
    alert(`API key ${keyId} has been revoked.`);
  };

  const handleValidateDocument = () => {
    if (validationQuery.trim()) {
      // Mock validation result
      setValidationResult({
        valid: true,
        document: {
          id: validationQuery,
          type: 'Police Clearance Certificate',
          holder: 'K.M.',
          issueDate: '2024-01-20',
          expiryDate: '2025-01-20',
          status: 'Valid'
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">API & Validation</h1>
          <p className="text-gray-600">Manage API access and document validation for your institution</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            API Documentation
          </Button>
          {activeTab === 'api-keys' && (
            <Button onClick={() => setShowCreateKeyModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Generate API Key
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'api-keys'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'validation'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Document Validation
          </button>
          <button
            onClick={() => setActiveTab('documentation')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'documentation'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            API Documentation
          </button>
        </nav>
      </div>

      {/* API Keys Tab */}
      {activeTab === 'api-keys' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((key) => (
                  <div key={key.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Key className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">{key.name}</h4>
                          <p className="text-sm text-gray-500">Last used: {new Date(key.lastUsed).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={key.isActive ? 'success' : 'error'}>
                          {key.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button variant="ghost" size="sm" onClick={() => setShowKeyDetails(key.id)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleRevokeKey(key.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div>
                        <span className="text-sm text-gray-600">Rate Limit:</span>
                        <p className="font-medium">{key.rateLimit} req/hour</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">This Month:</span>
                        <p className="font-medium">{key.usage.currentMonth.toLocaleString()} calls</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Total Usage:</span>
                        <p className="font-medium">{key.usage.totalCalls.toLocaleString()} calls</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <code className="bg-gray-100 px-3 py-1 rounded text-sm font-mono">
                        {showKeyDetails === key.id ? key.key : `${key.key.substring(0, 20)}...`}
                      </code>
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(key.key)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="mt-3">
                      <span className="text-sm text-gray-600">Permissions:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {key.permissions.map((permission) => (
                          <Badge key={permission} variant="default" size="sm">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Validation Tab */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Validation Center</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Document or Verification ID
                  </label>
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={validationQuery}
                      onChange={(e) => setValidationQuery(e.target.value)}
                      placeholder="e.g., GPS-PC-2024-12345"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                    <Button onClick={handleValidateDocument}>
                      <Search className="h-4 w-4 mr-2" />
                      Verify
                    </Button>
                  </div>
                </div>

                {validationResult && (
                  <div className={`p-6 rounded-lg ${validationResult.valid ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-full ${validationResult.valid ? 'bg-green-100' : 'bg-red-100'}`}>
                        {validationResult.valid ? (
                          <CheckCircle className="h-6 w-6 text-green-600" />
                        ) : (
                          <AlertCircle className="h-6 w-6 text-red-600" />
                        )}
                      </div>
                      <div>
                        <h3 className={`text-lg font-semibold ${validationResult.valid ? 'text-green-900' : 'text-red-900'}`}>
                          {validationResult.valid ? 'Valid Document' : 'Invalid Document'}
                        </h3>
                        {validationResult.valid ? (
                          <div className="mt-2 space-y-2">
                            <p className="text-green-700">
                              Document '{validationResult.document.type}' for {validationResult.document.holder} is valid.
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm text-green-700">
                              <div>
                                <span className="font-medium">Issue Date:</span> {validationResult.document.issueDate}
                              </div>
                              <div>
                                <span className="font-medium">Expiry Date:</span> {validationResult.document.expiryDate}
                              </div>
                              <div>
                                <span className="font-medium">Status:</span> {validationResult.document.status}
                              </div>
                              <div>
                                <span className="font-medium">ID:</span> {validationResult.document.id}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="mt-2 text-red-700">
                            The document ID you provided could not be verified. Please check the ID and try again.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">About Document Validation</h4>
                  <p className="text-sm text-blue-700">
                    This tool allows verification of documents issued by your institution. 
                    Enter the unique document ID or scan the QR code to verify authenticity.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === 'documentation' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Getting Started</h3>
                  <p className="text-gray-600 mb-4">
                    Our REST API allows you to programmatically access and verify documents issued by your institution.
                    All API requests require authentication using your API key.
                  </p>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Base URL</h4>
                    <code className="block bg-gray-100 p-3 rounded font-mono text-sm">
                      https://api.bacchecker.gov.gh/v1
                    </code>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Authentication</h4>
                    <p className="text-gray-600 mb-3">
                      Include your API key in the Authorization header:
                    </p>
                    <code className="block bg-gray-100 p-3 rounded font-mono text-sm">
                      Authorization: Bearer YOUR_API_KEY
                    </code>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Endpoints</h3>
                  
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="success" size="sm">GET</Badge>
                        <code className="font-mono text-sm">/documents/{'{id}'}/verify</code>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Verify the authenticity of a document by its ID.
                      </p>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-3">
                        <p>// Example Request</p>
                        <p>curl -X GET \</p>
                        <p>  https://api.bacchecker.gov.gh/v1/documents/GPS-PC-2024-12345/verify \</p>
                        <p>  -H "Authorization: Bearer YOUR_API_KEY"</p>
                      </div>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                        <p>// Example Response</p>
                        <p>{'{'}</p>
                        <p>  "valid": true,</p>
                        <p>  "document": {'{'}</p>
                        <p>    "id": "GPS-PC-2024-12345",</p>
                        <p>    "type": "Police Clearance Certificate",</p>
                        <p>    "holder": "John Doe",</p>
                        <p>    "issueDate": "2024-01-20",</p>
                        <p>    "expiryDate": "2025-01-20",</p>
                        <p>    "status": "Valid"</p>
                        <p>  {'}'}</p>
                        <p>{'}'}</p>
                      </div>
                    </div>
                    
                    <div className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant="info" size="sm">GET</Badge>
                        <code className="font-mono text-sm">/registry/{'{registry_id}'}/search</code>
                      </div>
                      <p className="text-gray-600 mb-3">
                        Search records in a specific registry (requires appropriate permissions).
                      </p>
                      <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                        <p>// Example Request</p>
                        <p>curl -X GET \</p>
                        <p>  "https://api.bacchecker.gov.gh/v1/registry/criminal-records/search?query=GHA-123456789" \</p>
                        <p>  -H "Authorization: Bearer YOUR_API_KEY"</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create API Key Modal */}
      {showCreateKeyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowCreateKeyModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Generate New API Key</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateKeyModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Key Name</label>
                <input 
                  type="text" 
                  placeholder="e.g., Third-Party Integration"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Permissions</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" />
                    <span className="text-sm text-gray-700">Read Registries</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" />
                    <span className="text-sm text-gray-700">Verify Documents</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" />
                    <span className="text-sm text-gray-700">Submit Requests</span>
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-red-600 focus:ring-red-500 mr-2" />
                    <span className="text-sm text-gray-700">Check Status</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rate Limit (requests/hour)</label>
                <input 
                  type="number" 
                  defaultValue="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500" 
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowCreateKeyModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateKey}>
                  Generate Key
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}