export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  isGlobal: boolean;
  institutionId: string | null;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  thumbnail: string;
  fields: TemplateField[];
  settings: TemplateSettings;
  isActive: boolean;
}

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'date' | 'signature' | 'qr' | 'image';
  position: { x: number; y: number };
  size: { width: number; height: number };
  required: boolean;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold' | 'semibold';
  textAlign?: 'left' | 'center' | 'right';
}

export interface TemplateSettings {
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: { top: string; bottom: string; left: string; right: string };
  watermark?: string;
  digitalSignature: boolean;
  qrCodePosition: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

export interface PlaceholderField {
  id: string;
  name: string;
  label: string;
  description: string;
  category: string;
}