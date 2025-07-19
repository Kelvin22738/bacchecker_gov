export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  order: number;
}

export interface InstitutionProfile {
  type: 'police' | 'court' | 'education' | 'ministry' | 'other';
  name: string;
  shortName: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: File | string;
  banner?: File | string;
  digitalSeal?: File | string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface ServiceSetup {
  id: string;
  name: string;
  description: string;
  category: string;
  requiredDocuments: string[];
  fee: number;
  currency: string;
  processingTime: string;
  isPublic: boolean;
  enabled: boolean;
}

export interface TemplateSetup {
  id: string;
  name: string;
  description: string;
  category: string;
  file?: File;
  fields: TemplateField[];
  signatureMode: 'digital' | 'electronic' | 'both';
  sealRequired: boolean;
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

export interface RoleSetup {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isCustom: boolean;
}

export interface RegistrySetup {
  id: string;
  name: string;
  description: string;
  fields: RegistryFieldSetup[];
  isPublic: boolean;
  searchable: boolean;
}

export interface RegistryFieldSetup {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'phone' | 'date' | 'boolean' | 'select' | 'file';
  required: boolean;
  validation?: string[];
  options?: string[];
  order: number;
}

export interface OnboardingState {
  currentStep: number;
  steps: OnboardingStep[];
  profile: Partial<InstitutionProfile>;
  services: ServiceSetup[];
  templates: TemplateSetup[];
  roles: RoleSetup[];
  registries: RegistrySetup[];
  isComplete: boolean;
}