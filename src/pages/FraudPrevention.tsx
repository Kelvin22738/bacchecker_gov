import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  Shield,
  AlertTriangle,
  Search,
  Filter,
  Eye,
  Plus,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building2,
  FileText,
  TrendingUp,
  X,
  Flag,
  Investigation
} from 'lucide-react';
import { fraudRegistryAPI, FraudRegistryEntry } from '../utils/verificationAPI';

export function FraudPrevention() {
  const { state } = useAuth();
  const { user } = state;
  const [fraudEntries, setFraudEntries] = useState<FraudRegistryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showInvestigationModal, setShowInvestigationModal] = useState(false);

  const isGTECAdmin = user?.role === 'gtec_admin';

  useEffect(() => {
    if (isGTECAdmin) {
      loadFraudEntries();
    }
  }, [isGTECAdmin]);

  const loadFraudEntries = async () => {
    try {
      setLoading(true);
      const data = await fraudRegistryAPI.getAll();
      setFraudEntries(data);
    } catch (error) {
      console.error('Error loading fraud entries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFraudEntry = async (formData: any) => {
    try {
      const newEntry = await fraudRegistryAPI.create({
        entity_type: formData.entity_type,
        entity_identifier: formData.entity_identifier,
        fraud_type: formData.fraud_type,
        severity_level: formData.severity_level,
        description: formData.description,
        evidence: formData.evidence,
        investigation_status: 'open'
      });

      setFraudEntries(prev => [newEntry, ...prev]);
      setShowAddModal(false);
      alert('Fraud entry added successfully!');
    } catch (error) {
      console.error('Error adding fraud entry:', error);
      alert('Error adding fraud entry. Please try again.');
    }
  };

  const filteredEntries = fraudEntries.filter(entry => {
    const searchMatch = entry.entity_identifier.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       entry.description.toLowerCase().includes(searchQuery.toLowerCase());
    const typeMatch = typeFilter === 'all' || entry.entity_type === typeFilter;
    const statusMatch = statusFilter === 'all' || entry.investigation_status === statusFilter;
    return searchMatch && typeMatch && statusMatch;
  });

  const selectedEntryData = selectedEntry 
    ? fraudEntries.find(e => e.id === selectedEntry)
    : null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="error">Confirmed</Badge>;
      case 'investigating':
        return <Badge variant="warning">Investigating</Badge>;
      case 'dismissed':
        return <Badge variant="success">Dismissed</Badge>;
      case 'closed':
        return <Badge variant="default">Closed</Badge>;
      default:
        return <Badge variant="info">Open</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <Badge variant="error">Critical</Badge>;
      case 'high':
        return <Badge variant="warning">High</Badge>;
      case 'medium':
        return <Badge variant="info">Medium</Badge>;
      default:
        return <Badge variant="default">Low</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'dismissed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'investigating':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-blue-600" />;
    }
  };

  const getEntityIcon = (entityType: string) => {
    switch (entityType) {
      case 'student':
        return User;
      case 'institution':
        return Building2;
      case 'document':
        return FileText;
      default:
        return Shield;
    }
  };

  if (!isGTECAdmin) {
    return (
      <div className="text-center py-12">
        <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Access Restricted</h3>
        <p className="text-gray-600">Only GTEC administrators can access the fraud prevention system.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fraud Prevention System</h1>
          <p className="text-gray-600">Monitor, investigate, and prevent fraudulent activities</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Report Fraud
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cases</p>
                <p className="text-3xl font-bold text-gray-900">{fraudEntries.length}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <Shield className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Investigations</p>
                <p className="text-3xl font-bold text-gray-900">
                  {fraudEntries.filter(e => e.investigation_status === 'investigating').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Confirmed Fraud</p>
                <p className="text-3xl font-bold text-gray-900">
                  {fraudEntries.filter(e => e.investigation_status === 'confirmed').length}
                </p>
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
                <p className="text-sm font-medium text-gray-600">Resolution Rate</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round((fraudEntries.filter(e => ['confirmed', 'dismissed', 'closed'].includes(e.investigation_status)).length / fraudEntries.length) * 100) || 0}%
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-xl">
                <TrendingUp className="h-6 w-6 text-green-600" />
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
                  placeholder="Search fraud entries..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Types</option>
                <option value="student">Student</option>
                <option value="institution">Institution</option>
                <option value="document">Document</option>
                <option value="pattern">Pattern</option>
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="investigating">Investigating</option>
                <option value="confirmed">Confirmed</option>
                <option value="dismissed">Dismissed</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fraud Entries List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Registry ({filteredEntries.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {filteredEntries.map((entry) => {
                  const EntityIcon = getEntityIcon(entry.entity_type);
                  
                  return (
                    <div
                      key={entry.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedEntry === entry.id
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedEntry(entry.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(entry.investigation_status)}
                          <EntityIcon className="h-4 w-4 text-gray-500" />
                        </div>
                        <div className="flex space-x-1">
                          {getStatusBadge(entry.investigation_status)}
                          {getSeverityBadge(entry.severity_level)}
                        </div>
                      </div>
                      
                      <p className="text-sm font-medium text-gray-900">{entry.entity_identifier}</p>
                      <p className="text-xs text-gray-600">{entry.fraud_type}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {new Date(entry.flagged_at).toLocaleDateString()}
                        </span>
                        <Badge variant="default" size="sm">
                          {entry.entity_type}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
                
                {filteredEntries.length === 0 && (
                  <div className="text-center py-8">
                    <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No fraud entries found</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fraud Entry Details */}
        <div className="lg:col-span-2">
          {selectedEntryData ? (
            <FraudEntryDetails 
              entry={selectedEntryData}
              onUpdateStatus={() => loadFraudEntries()}
              onStartInvestigation={() => setShowInvestigationModal(true)}
            />
          ) : (
            <Card>
              <CardContent className="text-center py-12">
                <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Fraud Entry</h3>
                <p className="text-gray-600">Choose an entry from the registry to view details and manage the investigation.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Add Fraud Entry Modal */}
      {showAddModal && (
        <AddFraudEntryModal
          onSubmit={handleAddFraudEntry}
          onClose={() => setShowAddModal(false)}
        />
      )}

      {/* Investigation Modal */}
      {showInvestigationModal && selectedEntryData && (
        <InvestigationModal
          entry={selectedEntryData}
          onClose={() => setShowInvestigationModal(false)}
          onUpdate={() => {
            loadFraudEntries();
            setShowInvestigationModal(false);
          }}
        />
      )}
    </div>
  );
}

// Fraud Entry Details Component
function FraudEntryDetails({ 
  entry, 
  onUpdateStatus, 
  onStartInvestigation 
}: {
  entry: FraudRegistryEntry;
  onUpdateStatus: () => void;
  onStartInvestigation: () => void;
}) {
  const EntityIcon = entry.entity_type === 'student' ? User :
                    entry.entity_type === 'institution' ? Building2 :
                    entry.entity_type === 'document' ? FileText : Shield;

  return (
    <div className="space-y-6">
      {/* Entry Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <EntityIcon className="h-6 w-6 text-gray-600" />
              <div>
                <CardTitle>{entry.entity_identifier}</CardTitle>
                <p className="text-gray-600">{entry.fraud_type}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              {entry.investigation_status === 'open' && (
                <Button size="sm" onClick={onStartInvestigation}>
                  <Flag className="h-4 w-4 mr-2" />
                  Start Investigation
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View Evidence
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded">
              <Badge variant={
                entry.investigation_status === 'confirmed' ? 'error' :
                entry.investigation_status === 'investigating' ? 'warning' :
                entry.investigation_status === 'dismissed' ? 'success' : 'info'
              }>
                {entry.investigation_status}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Status</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <Badge variant={
                entry.severity_level === 'critical' ? 'error' :
                entry.severity_level === 'high' ? 'warning' :
                entry.severity_level === 'medium' ? 'info' : 'default'
              }>
                {entry.severity_level}
              </Badge>
              <div className="text-sm text-gray-600 mt-1">Severity</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-sm font-medium text-gray-900">
                {new Date(entry.flagged_at).toLocaleDateString()}
              </div>
              <div className="text-sm text-gray-600">Flagged</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded">
              <Badge variant="default">{entry.entity_type}</Badge>
              <div className="text-sm text-gray-600 mt-1">Entity Type</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Fraud Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-900">{entry.description}</p>
        </CardContent>
      </Card>

      {/* Evidence */}
      <Card>
        <CardHeader>
          <CardTitle>Evidence & Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          {entry.evidence && Object.keys(entry.evidence).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(entry.evidence).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{key.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-600">{String(value)}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No evidence documented yet.</p>
          )}
        </CardContent>
      </Card>

      {/* Investigation Notes */}
      {entry.resolution_notes && (
        <Card>
          <CardHeader>
            <CardTitle>Investigation Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-900">{entry.resolution_notes}</p>
            {entry.resolved_at && (
              <p className="text-sm text-gray-500 mt-2">
                Resolved on {new Date(entry.resolved_at).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Add Fraud Entry Modal
function AddFraudEntryModal({ 
  onSubmit, 
  onClose 
}: {
  onSubmit: (data: any) => void;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState({
    entity_type: 'student',
    entity_identifier: '',
    fraud_type: '',
    severity_level: 'medium',
    description: '',
    evidence: {}
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Report Fraud</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entity Type *</label>
              <select 
                value={formData.entity_type}
                onChange={(e) => setFormData({...formData, entity_type: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="student">Student</option>
                <option value="institution">Institution</option>
                <option value="document">Document</option>
                <option value="pattern">Pattern</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Severity Level *</label>
              <select 
                value={formData.severity_level}
                onChange={(e) => setFormData({...formData, severity_level: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entity Identifier *</label>
            <input 
              type="text"
              value={formData.entity_identifier}
              onChange={(e) => setFormData({...formData, entity_identifier: e.target.value})}
              required
              placeholder="e.g., Student ID, Institution name, Document ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fraud Type *</label>
            <input 
              type="text"
              value={formData.fraud_type}
              onChange={(e) => setFormData({...formData, fraud_type: e.target.value})}
              required
              placeholder="e.g., Document forgery, Identity theft, Grade manipulation"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea 
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={4}
              placeholder="Provide detailed description of the suspected fraud..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Report Fraud
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Investigation Modal
function InvestigationModal({ 
  entry, 
  onClose, 
  onUpdate 
}: {
  entry: FraudRegistryEntry;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState(entry.investigation_status);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, you would update the fraud entry
    alert('Investigation updated successfully!');
    onUpdate();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Update Investigation</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Investigation Status</label>
            <select 
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="confirmed">Confirmed</option>
              <option value="dismissed">Dismissed</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Investigation Notes</label>
            <textarea 
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              placeholder="Add investigation notes, findings, or resolution details..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Update Investigation
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}