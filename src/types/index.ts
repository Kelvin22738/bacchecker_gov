export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  institutionId: string;
  avatar?: string;
  permissions: Permission[];
  createdAt: Date;
  lastLogin?: Date;
}

export interface Institution {
  id: string;
  name: string;
  shortName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  banner?: string;
  digitalSeal?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  services: Service[];
  registries: Registry[];
  isActive: boolean;
  createdAt: Date;
  stats: {
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    rejectedRequests: number;
    totalServices: number;
    totalRegistries: number;
    totalRecords: number;
  };
}

export interface Registry {
  id: string;
  name: string;
  description: string;
  institutionId: string;
  fields: RegistryField[];
  records: RegistryRecord[];
  isPublic: boolean;
  searchable: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  icon: string;
}

export interface RegistryField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  required: boolean;
  validation?: ValidationRule[];
  options?: string[];
  defaultValue?: any;
  order: number;
  placeholder?: string;
  helpText?: string;
}

export interface RegistryRecord {
  id: string;
  registryId: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  status: 'active' | 'archived' | 'pending';
}

export interface Service {
  id: string;
  name: string;
  description: string;
  institutionId: string;
  category: string;
  requiredDocuments: string[];
  processingTime: string;
  fee: number;
  currency: string;
  workflow: Workflow;
  isActive: boolean;
  isPublic: boolean;
  createdAt: Date;
  icon: string;
  color: string;
  stats: {
    totalRequests: number;
    avgProcessingTime: string;
    successRate: number;
  };
}

export interface Workflow {
  id: string;
  name: string;
  stages: WorkflowStage[];
  createdAt: Date;
}

export interface WorkflowStage {
  id: string;
  name: string;
  description: string;
  type: StageType;
  assignedRoles: UserRole[];
  requiredActions: string[];
  slaHours: number;
  order: number;
  conditions?: WorkflowCondition[];
  position?: { x: number; y: number };
  color: string;
}

export interface Request {
  id: string;
  serviceId: string;
  institutionId: string;
  requesterId: string;
  requesterInfo: RequesterInfo;
  status: RequestStatus;
  currentStage: string;
  submittedData: Record<string, any>;
  uploadedDocuments: UploadedDocument[];
  processingHistory: ProcessingHistory[];
  generatedDocuments: GeneratedDocument[];
  paymentStatus: PaymentStatus;
  paymentAmount: number;
  submittedAt: Date;
  completedAt?: Date;
  estimatedCompletion?: Date;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  slaStatus: 'on-time' | 'at-risk' | 'overdue';
}

export interface RequesterInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  idNumber?: string;
  businessName?: string;
  businessRegistration?: string;
}

export interface UploadedDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: Date;
  verified: boolean;
}

export interface ProcessingHistory {
  id: string;
  stage: string;
  action: string;
  performedBy: string;
  performedAt: Date;
  comments?: string;
  attachments?: string[];
  duration?: number;
}

export interface GeneratedDocument {
  id: string;
  name: string;
  type: string;
  url: string;
  verificationCode: string;
  qrCode: string;
  generatedAt: Date;
  expiresAt?: Date;
  template: DocumentTemplate;
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  institutionId: string;
  category: string;
  thumbnail: string;
  fileUrl: string;
  fields: TemplateField[];
  settings: TemplateSettings;
  createdAt: Date;
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
}

export interface TemplateSettings {
  pageSize: 'A4' | 'Letter';
  orientation: 'portrait' | 'landscape';
  margins: { top: number; right: number; bottom: number; left: number };
  watermark?: string;
  digitalSignature: boolean;
  qrCodePosition: 'top-right' | 'bottom-right' | 'bottom-left' | 'top-left';
}

export interface ApiKey {
  id: string;
  name: string;
  key: string;
  institutionId: string;
  permissions: ApiPermission[];
  rateLimit: number;
  isActive: boolean;
  lastUsed?: Date;
  createdAt: Date;
  expiresAt?: Date;
  usage: {
    totalCalls: number;
    monthlyLimit: number;
    currentMonth: number;
  };
}

export type UserRole = 
  | 'super_admin'
  | 'institution_admin'
  | 'service_manager'
  | 'processor'
  | 'reviewer'
  | 'api_manager'
  | 'citizen'
  | 'business';

export type Permission = 
  | 'manage_institutions'
  | 'manage_users'
  | 'manage_services'
  | 'manage_registries'
  | 'process_requests'
  | 'review_requests'
  | 'manage_api_keys'
  | 'view_analytics'
  | 'manage_workflows'
  | 'manage_templates';

export type FieldType = 
  | 'text'
  | 'number'
  | 'email'
  | 'phone'
  | 'date'
  | 'datetime'
  | 'boolean'
  | 'select'
  | 'multiselect'
  | 'file'
  | 'textarea'
  | 'rich_text';

export type ValidationRule = {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom';
  value?: any;
  message: string;
};

export type StageType = 
  | 'start'
  | 'review'
  | 'approval'
  | 'rejection'
  | 'document_generation'
  | 'payment'
  | 'end';

export type RequestStatus = 
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'waived';

export type ApiPermission = 
  | 'read_registries'
  | 'verify_documents'
  | 'submit_requests'
  | 'check_status';

export interface WorkflowCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
  nextStage: string;
}

export interface AppState {
  user: User | null;
  currentInstitution: Institution | null;
  institutions: Institution[];
  registries: Registry[];
  services: Service[];
  requests: Request[];
  workflows: Workflow[];
  apiKeys: ApiKey[];
  templates: DocumentTemplate[];
  isLoading: boolean;
  error: string | null;
  sidebarCollapsed: boolean;
  currentView: string;
}

export type AppAction = 
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_CURRENT_INSTITUTION'; payload: Institution | null }
  | { type: 'SET_INSTITUTIONS'; payload: Institution[] }
  | { type: 'ADD_INSTITUTION'; payload: Institution }
  | { type: 'UPDATE_INSTITUTION'; payload: Institution }
  | { type: 'SET_REGISTRIES'; payload: Registry[] }
  | { type: 'ADD_REGISTRY'; payload: Registry }
  | { type: 'UPDATE_REGISTRY'; payload: Registry }
  | { type: 'SET_SERVICES'; payload: Service[] }
  | { type: 'ADD_SERVICE'; payload: Service }
  | { type: 'UPDATE_SERVICE'; payload: Service }
  | { type: 'SET_REQUESTS'; payload: Request[] }
  | { type: 'ADD_REQUEST'; payload: Request }
  | { type: 'UPDATE_REQUEST'; payload: Request }
  | { type: 'SET_WORKFLOWS'; payload: Workflow[] }
  | { type: 'ADD_WORKFLOW'; payload: Workflow }
  | { type: 'UPDATE_WORKFLOW'; payload: Workflow }
  | { type: 'SET_API_KEYS'; payload: ApiKey[] }
  | { type: 'ADD_API_KEY'; payload: ApiKey }
  | { type: 'UPDATE_API_KEY'; payload: ApiKey }
  | { type: 'SET_TEMPLATES'; payload: DocumentTemplate[] }
  | { type: 'ADD_TEMPLATE'; payload: DocumentTemplate }
  | { type: 'UPDATE_TEMPLATE'; payload: DocumentTemplate }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_CURRENT_VIEW'; payload: string };