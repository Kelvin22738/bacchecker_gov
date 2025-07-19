import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { useAuth } from '../context/AuthContext';
import {
  FileText,
  Plus,
  Eye,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  X,
  Download,
  Upload
} from 'lucide-react';
import { DocumentTemplate } from '../types/templates';
import { getInstitutionTemplates, getGlobalTemplates, getTemplateById } from '../utils/templateData';
import { TemplateBuilder } from '../components/templates/TemplateBuilder';

export function DocumentTemplates() {
  const { state } = useAuth();
  const { user } = state;
  const [activeTab, setActiveTab] = useState<'institution' | 'global'>('institution');
  const [institutionTemplates, setInstitutionTemplates] = useState<DocumentTemplate[]>(
    user?.institutionId ? getInstitutionTemplates(user.institutionId) : []
  );
  const [globalTemplates] = useState<DocumentTemplate[]>(getGlobalTemplates());
  
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInstitutionTemplates = institutionTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGlobalTemplates = globalTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateTemplate = () => {
    setEditingTemplateId(null);
    setShowTemplateBuilder(true);
  };

  const handleEditTemplate = (templateId: string) => {
    setEditingTemplateId(templateId);
    setShowTemplateBuilder(true);
  };

  const handlePreviewTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template) {
      setPreviewTemplate(template);
      setShowPreviewModal(true);
    }
  };

  const handleDuplicateTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template && user?.institutionId) {
      const newTemplate: DocumentTemplate = {
        ...template,
        id: `template-${Date.now()}`,
        name: `Copy of ${template.name}`,
        isGlobal: false,
        institutionId: user.institutionId,
        createdBy: user.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setInstitutionTemplates([...institutionTemplates, newTemplate]);
      alert('Template duplicated successfully!');
    }
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template?')) {
      setInstitutionTemplates(institutionTemplates.filter(t => t.id !== templateId));
      alert('Template deleted successfully!');
    }
  };

  const handleUseGlobalTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (template && user?.institutionId) {
      const newTemplate: DocumentTemplate = {
        ...template,
        id: `template-${Date.now()}`,
        name: `${template.name} - Customized`,
        isGlobal: false,
        institutionId: user.institutionId,
        createdBy: user.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      setInstitutionTemplates([...institutionTemplates, newTemplate]);
      setEditingTemplateId(newTemplate.id);
      setShowTemplateBuilder(true);
    }
  };

  const handleSaveTemplate = (template: DocumentTemplate) => {
    if (editingTemplateId) {
      // Update existing template
      setInstitutionTemplates(institutionTemplates.map(t => 
        t.id === editingTemplateId ? template : t
      ));
    } else {
      // Add new template
      setInstitutionTemplates([...institutionTemplates, template]);
    }
    setShowTemplateBuilder(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Document Templates</h1>
          <p className="text-gray-600">Create and manage document templates for your institution</p>
        </div>
        <div className="flex space-x-2">
          {activeTab === 'institution' && (
            <>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Import Template
              </Button>
              <Button onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('institution')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'institution'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Institution's Templates
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'global'
                ? 'border-red-500 text-red-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            BacChecker Template Library
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
        />
      </div>

      {/* Institution Templates Tab */}
      {activeTab === 'institution' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutionTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-0">
                {/* Template Thumbnail */}
                <div className="relative h-48 bg-gray-100 border-b">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                
                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <Badge variant="default" size="sm">{template.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Modified: {new Date(template.updatedAt).toLocaleDateString()}</span>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm" onClick={() => handlePreviewTemplate(template.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDuplicateTemplate(template.id)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {filteredInstitutionTemplates.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? 'Try adjusting your search'
                  : 'Create your first template or use one from the global library'}
              </p>
              <Button onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create New Template
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Global Templates Tab */}
      {activeTab === 'global' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGlobalTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-all duration-200">
              <CardContent className="p-0">
                {/* Template Thumbnail */}
                <div className="relative h-48 bg-gray-100 border-b">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <FileText className="h-16 w-16 text-gray-400" />
                  </div>
                  <div className="absolute top-2 right-2">
                    <Badge variant="primary" size="sm">Global</Badge>
                  </div>
                </div>
                
                {/* Template Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <Badge variant="default" size="sm">{template.category}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{template.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">BacChecker Official</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" onClick={() => handlePreviewTemplate(template.id)}>
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                      <Button size="sm" onClick={() => handleUseGlobalTemplate(template.id)}>
                        Use Template
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Empty State */}
          {filteredGlobalTemplates.length === 0 && (
            <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No global templates found</h3>
              <p className="text-gray-600">
                {searchQuery 
                  ? 'Try adjusting your search'
                  : 'Global templates will appear here when available'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Template Builder Modal */}
      {showTemplateBuilder && (
        <TemplateBuilder
          templateId={editingTemplateId}
          isGlobal={false}
          onClose={() => setShowTemplateBuilder(false)}
          onSave={handleSaveTemplate}
        />
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPreviewModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{previewTemplate.name} - Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPreviewModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-lg flex justify-center">
              <div className="bg-white shadow-lg relative" style={{
                width: previewTemplate.settings.pageSize === 'A4' ? '210mm' : '8.5in',
                height: previewTemplate.settings.pageSize === 'A4' ? '297mm' : '11in',
                padding: '20mm'
              }}>
                {/* Watermark */}
                {previewTemplate.settings.watermark && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-6xl text-gray-200 font-bold transform rotate-45 opacity-20">
                      {previewTemplate.settings.watermark}
                    </span>
                  </div>
                )}

                {/* Template Fields */}
                {previewTemplate.fields.map((field) => (
                  <div
                    key={field.id}
                    className="absolute border border-gray-300 bg-gray-50 flex items-center justify-center text-sm"
                    style={{
                      left: `${field.position.x}px`,
                      top: `${field.position.y}px`,
                      width: `${field.size.width}px`,
                      height: `${field.size.height}px`,
                      fontSize: field.fontSize ? `${field.fontSize}px` : '14px',
                      fontWeight: field.fontWeight || 'normal',
                      textAlign: field.textAlign || 'left'
                    }}
                  >
                    {field.type === 'qr' ? 'QR Code' : 
                     field.type === 'signature' ? 'Signature' :
                     field.type === 'image' ? 'Image' :
                     `{{${field.name}}}`}
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <div>
                {activeTab === 'global' && (
                  <Button onClick={() => {
                    handleUseGlobalTemplate(previewTemplate.id);
                    setShowPreviewModal(false);
                  }}>
                    Use This Template
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => setShowPreviewModal(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}