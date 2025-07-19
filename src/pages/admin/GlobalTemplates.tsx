import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  FileText,
  Plus,
  Eye,
  Edit,
  MoreHorizontal,
  Archive,
  Download,
  X
} from 'lucide-react';
import { DocumentTemplate } from '../../types/templates';
import { getGlobalTemplates, getTemplateById } from '../../utils/templateData';
import { TemplateBuilder } from '../../components/templates/TemplateBuilder';

export function GlobalTemplates() {
  const [templates, setTemplates] = useState<DocumentTemplate[]>(getGlobalTemplates());
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewTemplate, setPreviewTemplate] = useState<DocumentTemplate | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const categories = ['all', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = templates.filter(template => {
    const searchMatch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const categoryMatch = categoryFilter === 'all' || template.category === categoryFilter;
    return searchMatch && categoryMatch;
  });

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

  const handleArchiveTemplate = (templateId: string) => {
    // In a real app, this would call an API to archive the template
    alert(`Template ${templateId} has been archived.`);
    setTemplates(templates.filter(t => t.id !== templateId));
  };

  const handleSaveTemplate = (template: DocumentTemplate) => {
    if (editingTemplateId) {
      // Update existing template
      setTemplates(templates.map(t => t.id === editingTemplateId ? template : t));
    } else {
      // Add new template
      setTemplates([...templates, template]);
    }
    setShowTemplateBuilder(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Template Library</h1>
          <p className="text-gray-600">Manage system-wide document templates available to all institutions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Templates
          </Button>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Global Template
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            {/* Search */}
            <div className="flex-1 min-w-64">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search templates..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
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
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => handlePreviewTemplate(template.id)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleEditTemplate(template.id)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleArchiveTemplate(template.id)}>
                      <Archive className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Create your first global template to get started'}
          </p>
          <Button onClick={handleCreateTemplate}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
        </div>
      )}

      {/* Template Builder Modal */}
      {showTemplateBuilder && (
        <TemplateBuilder
          templateId={editingTemplateId}
          isGlobal={true}
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

            <div className="mt-6 flex justify-end">
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