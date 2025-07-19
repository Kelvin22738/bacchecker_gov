import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import {
  X,
  Save,
  Eye,
  Type,
  Calendar,
  PenTool,
  QrCode,
  Image as ImageIcon,
  Search,
  Settings,
  Move,
  Trash2,
  Copy,
  Undo,
  Redo,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { DocumentTemplate, TemplateField, TemplateSettings } from '../../types/templates';
import { getTemplateById, placeholderFields } from '../../utils/templateData';

interface TemplateBuilderProps {
  templateId: string | null;
  isGlobal: boolean;
  onClose: () => void;
  onSave: (template: DocumentTemplate) => void;
}

export function TemplateBuilder({ templateId, isGlobal, onClose, onSave }: TemplateBuilderProps) {
  const [activePanel, setActivePanel] = useState<'components' | 'placeholders' | 'settings'>('components');
  const [selectedField, setSelectedField] = useState<string | null>(null);
  const [draggedField, setDraggedField] = useState<TemplateField | null>(null);
  const [zoom, setZoom] = useState(100);
  const [showPreview, setShowPreview] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Template state
  const [template, setTemplate] = useState<DocumentTemplate>({
    id: templateId || `template-${Date.now()}`,
    name: 'New Template',
    description: '',
    isGlobal,
    institutionId: isGlobal ? null : 'gps', // Default to GPS for demo
    createdBy: isGlobal ? 'BacChecker Admin' : 'Inspector Sarah Mensah',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    category: 'General',
    thumbnail: '',
    fields: [],
    settings: {
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
      digitalSignature: true,
      qrCodePosition: 'top-right'
    },
    isActive: true
  });

  // Load existing template if editing
  useEffect(() => {
    if (templateId) {
      const existingTemplate = getTemplateById(templateId);
      if (existingTemplate) {
        setTemplate(existingTemplate);
      }
    }
  }, [templateId]);

  const componentTypes = [
    { type: 'text', label: 'Text Block', icon: Type, description: 'Add text fields and labels' },
    { type: 'date', label: 'Date Field', icon: Calendar, description: 'Date input field' },
    { type: 'signature', label: 'Signature', icon: PenTool, description: 'Digital signature area' },
    { type: 'qr', label: 'QR Code', icon: QrCode, description: 'QR code for verification' },
    { type: 'image', label: 'Image/Logo', icon: ImageIcon, description: 'Image or logo placeholder' }
  ];

  const filteredPlaceholders = placeholderFields.filter(field =>
    field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    field.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const placeholderCategories = [...new Set(placeholderFields.map(p => p.category))];

  const handleDragStart = (componentType: string) => {
    const newField: TemplateField = {
      id: `field-${Date.now()}`,
      name: `${componentType}_field`,
      label: `${componentType.charAt(0).toUpperCase() + componentType.slice(1)} Field`,
      type: componentType as any,
      position: { x: 100, y: 100 },
      size: { 
        width: componentType === 'signature' ? 150 : componentType === 'qr' ? 80 : 200, 
        height: componentType === 'signature' ? 60 : componentType === 'qr' ? 80 : 30 
      },
      required: false,
      fontSize: 14,
      fontWeight: 'normal',
      textAlign: 'left'
    };
    setDraggedField(newField);
  };

  const handleCanvasDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedField || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newField = {
      ...draggedField,
      position: { x: Math.max(0, x - draggedField.size.width / 2), y: Math.max(0, y - draggedField.size.height / 2) }
    };

    setTemplate(prev => ({
      ...prev,
      fields: [...prev.fields, newField]
    }));

    setDraggedField(null);
    setSelectedField(newField.id);
  };

  const handleFieldUpdate = (fieldId: string, updates: Partial<TemplateField>) => {
    setTemplate(prev => ({
      ...prev,
      fields: prev.fields.map(field =>
        field.id === fieldId ? { ...field, ...updates } : field
      )
    }));
  };

  const handleFieldDelete = (fieldId: string) => {
    setTemplate(prev => ({
      ...prev,
      fields: prev.fields.filter(field => field.id !== fieldId)
    }));
    setSelectedField(null);
  };

  const handleSave = () => {
    onSave(template);
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const selectedFieldData = template.fields.find(f => f.id === selectedField);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900">Template Builder</h1>
          <Badge variant={isGlobal ? 'info' : 'success'}>
            {isGlobal ? 'Global Template' : 'Institution Template'}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setZoom(Math.max(50, zoom - 10))}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">{zoom}%</span>
            <Button variant="ghost" size="sm" onClick={() => setZoom(Math.min(200, zoom + 10))}>
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>
          
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Template
          </Button>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Left Panel - Toolbox */}
        <div className="w-80 border-r border-gray-200 bg-gray-50 flex flex-col">
          {/* Panel Tabs */}
          <div className="border-b border-gray-200 p-4">
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setActivePanel('components')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activePanel === 'components' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Components
              </button>
              <button
                onClick={() => setActivePanel('placeholders')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activePanel === 'placeholders' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Placeholders
              </button>
              <button
                onClick={() => setActivePanel('settings')}
                className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors ${
                  activePanel === 'settings' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Settings
              </button>
            </div>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activePanel === 'components' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">Drag Components to Canvas</h3>
                {componentTypes.map((component) => (
                  <div
                    key={component.type}
                    draggable
                    onDragStart={() => handleDragStart(component.type)}
                    className="p-3 border border-gray-200 rounded-lg cursor-move hover:border-gray-300 hover:shadow-sm transition-all bg-white"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <component.icon className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{component.label}</p>
                        <p className="text-xs text-gray-500">{component.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activePanel === 'placeholders' && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Available Placeholders</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search placeholders..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {placeholderCategories.map(category => {
                    const categoryFields = filteredPlaceholders.filter(p => p.category === category);
                    if (categoryFields.length === 0) return null;

                    return (
                      <div key={category}>
                        <h4 className="font-medium text-gray-900 text-sm mb-2">{category}</h4>
                        <div className="space-y-2">
                          {categoryFields.map(placeholder => (
                            <div
                              key={placeholder.id}
                              className="p-2 border border-gray-200 rounded cursor-pointer hover:border-gray-300 hover:bg-gray-50 transition-colors"
                              onClick={() => {
                                if (selectedField) {
                                  handleFieldUpdate(selectedField, { name: placeholder.name });
                                }
                              }}
                            >
                              <p className="font-medium text-gray-900 text-sm">{placeholder.label}</p>
                              <p className="text-xs text-gray-500">{placeholder.description}</p>
                              <code className="text-xs bg-gray-100 px-1 py-0.5 rounded mt-1 inline-block">
                                {`{{${placeholder.name}}}`}
                              </code>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activePanel === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Template Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Template Name</label>
                      <input
                        type="text"
                        value={template.name}
                        onChange={(e) => setTemplate(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={template.description}
                        onChange={(e) => setTemplate(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={template.category}
                        onChange={(e) => setTemplate(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="General">General</option>
                        <option value="Security Clearance">Security Clearance</option>
                        <option value="Legal Documents">Legal Documents</option>
                        <option value="Academic Documents">Academic Documents</option>
                        <option value="Certificates">Certificates</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Page Size</label>
                      <select
                        value={template.settings.pageSize}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          settings: { ...prev.settings, pageSize: e.target.value as 'A4' | 'Letter' }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="A4">A4</option>
                        <option value="Letter">Letter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
                      <select
                        value={template.settings.orientation}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          settings: { ...prev.settings, orientation: e.target.value as 'portrait' | 'landscape' }
                        }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="portrait">Portrait</option>
                        <option value="landscape">Landscape</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Watermark</label>
                      <input
                        type="text"
                        value={template.settings.watermark || ''}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          settings: { ...prev.settings, watermark: e.target.value }
                        }))}
                        placeholder="e.g., OFFICIAL DOCUMENT"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">Digital Signature</span>
                      <input
                        type="checkbox"
                        checked={template.settings.digitalSignature}
                        onChange={(e) => setTemplate(prev => ({
                          ...prev,
                          settings: { ...prev.settings, digitalSignature: e.target.checked }
                        }))}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Center Panel - Canvas */}
        <div className="flex-1 bg-gray-100 p-8 overflow-auto">
          <div className="flex justify-center">
            <div
              ref={canvasRef}
              className="bg-white shadow-lg relative"
              style={{
                width: template.settings.pageSize === 'A4' ? '210mm' : '8.5in',
                minHeight: template.settings.pageSize === 'A4' ? '297mm' : '11in',
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
                padding: '20mm'
              }}
              onDrop={handleCanvasDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              {/* Watermark */}
              {template.settings.watermark && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="text-6xl text-gray-200 font-bold transform rotate-45 opacity-20">
                    {template.settings.watermark}
                  </span>
                </div>
              )}

              {/* Template Fields */}
              {template.fields.map((field) => (
                <div
                  key={field.id}
                  className={`absolute border-2 cursor-move ${
                    selectedField === field.id ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                  } flex items-center justify-center text-sm hover:border-red-400 transition-colors`}
                  style={{
                    left: `${field.position.x}px`,
                    top: `${field.position.y}px`,
                    width: `${field.size.width}px`,
                    height: `${field.size.height}px`,
                    fontSize: field.fontSize ? `${field.fontSize}px` : '14px',
                    fontWeight: field.fontWeight || 'normal',
                    textAlign: field.textAlign || 'left'
                  }}
                  onClick={() => setSelectedField(field.id)}
                >
                  {field.type === 'qr' ? 'QR Code' : 
                   field.type === 'signature' ? 'Signature' :
                   field.type === 'image' ? 'Image' :
                   `{{${field.name}}}`}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Inspector */}
        <div className="w-80 border-l border-gray-200 bg-gray-50 p-4">
          {selectedFieldData ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900">Field Properties</h3>
                <div className="flex space-x-1">
                  <Button variant="ghost" size="sm" onClick={() => handleFieldDelete(selectedFieldData.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Field Name</label>
                  <input
                    type="text"
                    value={selectedFieldData.name}
                    onChange={(e) => handleFieldUpdate(selectedFieldData.id, { name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={selectedFieldData.label}
                    onChange={(e) => handleFieldUpdate(selectedFieldData.id, { label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width</label>
                    <input
                      type="number"
                      value={selectedFieldData.size.width}
                      onChange={(e) => handleFieldUpdate(selectedFieldData.id, {
                        size: { ...selectedFieldData.size, width: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height</label>
                    <input
                      type="number"
                      value={selectedFieldData.size.height}
                      onChange={(e) => handleFieldUpdate(selectedFieldData.id, {
                        size: { ...selectedFieldData.size, height: parseInt(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                </div>

                {selectedFieldData.type === 'text' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Font Size</label>
                      <input
                        type="number"
                        value={selectedFieldData.fontSize || 14}
                        onChange={(e) => handleFieldUpdate(selectedFieldData.id, { fontSize: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Font Weight</label>
                      <select
                        value={selectedFieldData.fontWeight || 'normal'}
                        onChange={(e) => handleFieldUpdate(selectedFieldData.id, { fontWeight: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="normal">Normal</option>
                        <option value="bold">Bold</option>
                        <option value="semibold">Semibold</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text Align</label>
                      <select
                        value={selectedFieldData.textAlign || 'left'}
                        onChange={(e) => handleFieldUpdate(selectedFieldData.id, { textAlign: e.target.value as any })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                      >
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  </>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Required Field</span>
                  <input
                    type="checkbox"
                    checked={selectedFieldData.required}
                    onChange={(e) => handleFieldUpdate(selectedFieldData.id, { required: e.target.checked })}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Field Selected</h3>
              <p className="text-gray-600">
                Click on a field to edit its properties, or drag a component from the left panel to add a new field.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">{template.name} - Preview</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPreview(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="bg-gray-100 p-8 rounded-lg flex justify-center">
              <div className="bg-white shadow-lg relative" style={{
                width: template.settings.pageSize === 'A4' ? '210mm' : '8.5in',
                height: template.settings.pageSize === 'A4' ? '297mm' : '11in',
                padding: '20mm'
              }}>
                {/* Watermark */}
                {template.settings.watermark && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-6xl text-gray-200 font-bold transform rotate-45 opacity-20">
                      {template.settings.watermark}
                    </span>
                  </div>
                )}

                {/* Template Fields with Sample Data */}
                {template.fields.map((field) => {
                  // Generate sample data based on field name
                  let sampleValue = '';
                  if (field.name.includes('name')) sampleValue = 'John Doe';
                  else if (field.name.includes('id')) sampleValue = 'GHA-123456789';
                  else if (field.name.includes('date')) sampleValue = '2024-06-30';
                  else if (field.name.includes('status')) sampleValue = 'Approved';
                  else if (field.name.includes('institution')) sampleValue = 'Ghana Police Service';
                  else sampleValue = field.name;

                  return (
                    <div
                      key={field.id}
                      className="absolute border border-gray-200 bg-white flex items-center justify-center"
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
                      {field.type === 'qr' ? (
                        <div className="bg-gray-800 w-full h-full flex items-center justify-center text-white text-xs">QR Code</div>
                      ) : field.type === 'signature' ? (
                        <div className="w-full h-full border-b border-gray-400 flex items-end justify-end">
                          <span className="text-gray-600 italic text-sm">John Smith</span>
                        </div>
                      ) : field.type === 'image' ? (
                        <div className="bg-gray-100 w-full h-full flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                        </div>
                      ) : (
                        <span>{sampleValue}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}