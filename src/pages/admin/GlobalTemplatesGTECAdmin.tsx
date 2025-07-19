import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { FileText, Plus, Download } from 'lucide-react';
import { TemplateBuilder } from '../../components/templates/TemplateBuilder';

export default function GlobalTemplatesGTECAdmin() {
  const [showTemplateBuilder, setShowTemplateBuilder] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Mock educational/tertiary templates
  const educationalTemplates = [
    { id: 'edu-1', name: 'Transcript Template', description: 'Official transcript for tertiary institutions', category: 'Education' },
    { id: 'edu-2', name: 'Degree Certificate', description: 'Degree certificate template', category: 'Education' },
    { id: 'edu-3', name: 'Course Completion', description: 'Course completion certificate', category: 'Education' }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Educational Global Template Library</h1>
          <p className="text-gray-600">Import, build, and manage templates for tertiary institutions</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={() => setShowImportModal(true)}>
            <Download className="h-4 w-4 mr-2" />
            Import Templates
          </Button>
          <Button onClick={() => setShowTemplateBuilder(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Template
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Educational Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {educationalTemplates.map((template) => (
              <div key={template.id} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center mb-2">
                  <FileText className="h-6 w-6 text-blue-500 mr-2" />
                  <span className="font-semibold text-gray-900">{template.name}</span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                <span className="text-xs text-blue-700">{template.category}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      {showTemplateBuilder && (
        <TemplateBuilder isGlobal={true} onClose={() => setShowTemplateBuilder(false)} />
      )}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowImportModal(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-4">Import Templates</h3>
            <input type="file" accept=".json,.docx,.pdf" className="mb-4" />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowImportModal(false)}>Cancel</Button>
              <Button onClick={() => setShowImportModal(false)}>Import</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 