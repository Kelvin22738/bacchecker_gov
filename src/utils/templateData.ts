import { DocumentTemplate, PlaceholderField } from '../types/templates';

// Global templates (managed by BacChecker Admin)
export const globalTemplates: DocumentTemplate[] = [
  {
    id: 'template-global-1',
    name: 'Standard Police Clearance Certificate',
    description: 'Official clearance certificate with digital seal and QR code for verification',
    isGlobal: true,
    institutionId: null,
    createdBy: 'BacChecker Admin',
    createdAt: '2024-06-22T20:30:00Z',
    updatedAt: '2024-06-22T20:30:00Z',
    category: 'Security Clearance',
    thumbnail: '/image.png',
    fields: [
      {
        id: 'field-name',
        name: 'applicant.full_name',
        label: 'Full Name',
        type: 'text',
        position: { x: 200, y: 150 },
        size: { width: 300, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-id',
        name: 'applicant.id_number',
        label: 'ID Number',
        type: 'text',
        position: { x: 200, y: 200 },
        size: { width: 200, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-date',
        name: 'request.completion_date',
        label: 'Issue Date',
        type: 'date',
        position: { x: 200, y: 250 },
        size: { width: 150, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-signature',
        name: 'officer.signature',
        label: 'Officer Signature',
        type: 'signature',
        position: { x: 400, y: 350 },
        size: { width: 150, height: 60 },
        required: true
      },
      {
        id: 'field-qr',
        name: 'request.validation_url',
        label: 'Verification QR Code',
        type: 'qr',
        position: { x: 450, y: 50 },
        size: { width: 80, height: 80 },
        required: true
      }
    ],
    settings: {
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
      watermark: 'OFFICIAL DOCUMENT',
      digitalSignature: true,
      qrCodePosition: 'top-right'
    },
    isActive: true
  },
  {
    id: 'template-global-2',
    name: 'Court Case History Certificate',
    description: 'Official court case history and legal standing certificate',
    isGlobal: true,
    institutionId: null,
    createdBy: 'BacChecker Admin',
    createdAt: '2024-06-20T14:15:00Z',
    updatedAt: '2024-06-20T14:15:00Z',
    category: 'Legal Documents',
    thumbnail: '/image.png',
    fields: [
      {
        id: 'field-case-name',
        name: 'case.name',
        label: 'Case Name',
        type: 'text',
        position: { x: 100, y: 120 },
        size: { width: 400, height: 30 },
        required: true,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
      },
      {
        id: 'field-case-number',
        name: 'case.number',
        label: 'Case Number',
        type: 'text',
        position: { x: 100, y: 170 },
        size: { width: 200, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-judgment',
        name: 'case.judgment',
        label: 'Judgment Summary',
        type: 'text',
        position: { x: 100, y: 220 },
        size: { width: 400, height: 80 },
        required: false,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-seal',
        name: 'institution.seal',
        label: 'Court Seal',
        type: 'image',
        position: { x: 250, y: 350 },
        size: { width: 100, height: 100 },
        required: true
      }
    ],
    settings: {
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
      watermark: 'HIGH COURT OF GHANA',
      digitalSignature: true,
      qrCodePosition: 'bottom-right'
    },
    isActive: true
  },
  {
    id: 'template-global-3',
    name: 'Academic Verification Certificate',
    description: 'Official academic credential verification certificate',
    isGlobal: true,
    institutionId: null,
    createdBy: 'BacChecker Admin',
    createdAt: '2024-06-18T09:45:00Z',
    updatedAt: '2024-06-18T09:45:00Z',
    category: 'Academic Documents',
    thumbnail: '/image.png',
    fields: [
      {
        id: 'field-student-name',
        name: 'student.name',
        label: 'Student Name',
        type: 'text',
        position: { x: 150, y: 140 },
        size: { width: 300, height: 30 },
        required: true,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left'
      },
      {
        id: 'field-institution',
        name: 'education.institution',
        label: 'Institution',
        type: 'text',
        position: { x: 150, y: 190 },
        size: { width: 300, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-program',
        name: 'education.program',
        label: 'Program',
        type: 'text',
        position: { x: 150, y: 240 },
        size: { width: 300, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-graduation-date',
        name: 'education.graduation_date',
        label: 'Graduation Date',
        type: 'date',
        position: { x: 150, y: 290 },
        size: { width: 150, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      }
    ],
    settings: {
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
      watermark: 'MINISTRY OF EDUCATION',
      digitalSignature: true,
      qrCodePosition: 'top-right'
    },
    isActive: true
  }
];

// Institution templates (managed by Institution Admin)
export const institutionTemplates: DocumentTemplate[] = [
  {
    id: 'template-inst-1',
    name: 'Ghana Police Clearance Certificate',
    description: 'Customized police clearance certificate for Ghana Police Service',
    isGlobal: false,
    institutionId: 'gps',
    createdBy: 'Inspector Sarah Mensah',
    createdAt: '2024-06-24T11:20:00Z',
    updatedAt: '2024-06-24T11:20:00Z',
    category: 'Security Clearance',
    thumbnail: '/image.png',
    fields: [
      {
        id: 'field-header',
        name: 'institution.header',
        label: 'Header',
        type: 'image',
        position: { x: 50, y: 50 },
        size: { width: 500, height: 80 },
        required: true
      },
      {
        id: 'field-name',
        name: 'applicant.full_name',
        label: 'Full Name',
        type: 'text',
        position: { x: 150, y: 180 },
        size: { width: 300, height: 30 },
        required: true,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'left'
      },
      {
        id: 'field-id',
        name: 'applicant.id_number',
        label: 'Ghana Card Number',
        type: 'text',
        position: { x: 150, y: 230 },
        size: { width: 200, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-clearance',
        name: 'clearance.status',
        label: 'Clearance Status',
        type: 'text',
        position: { x: 150, y: 280 },
        size: { width: 300, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left'
      },
      {
        id: 'field-issue-date',
        name: 'request.issue_date',
        label: 'Issue Date',
        type: 'date',
        position: { x: 150, y: 330 },
        size: { width: 150, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-expiry-date',
        name: 'request.expiry_date',
        label: 'Expiry Date',
        type: 'date',
        position: { x: 350, y: 330 },
        size: { width: 150, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-signature',
        name: 'officer.signature',
        label: 'Officer Signature',
        type: 'signature',
        position: { x: 150, y: 400 },
        size: { width: 150, height: 60 },
        required: true
      },
      {
        id: 'field-qr',
        name: 'request.validation_url',
        label: 'Verification QR Code',
        type: 'qr',
        position: { x: 450, y: 400 },
        size: { width: 100, height: 100 },
        required: true
      }
    ],
    settings: {
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
      watermark: 'GHANA POLICE SERVICE',
      digitalSignature: true,
      qrCodePosition: 'bottom-right'
    },
    isActive: true
  },
  {
    id: 'template-inst-2',
    name: 'Police Incident Report',
    description: 'Official police incident report template',
    isGlobal: false,
    institutionId: 'gps',
    createdBy: 'Inspector Sarah Mensah',
    createdAt: '2024-06-23T15:40:00Z',
    updatedAt: '2024-06-23T15:40:00Z',
    category: 'Reports',
    thumbnail: '/image.png',
    fields: [
      {
        id: 'field-report-number',
        name: 'incident.number',
        label: 'Report Number',
        type: 'text',
        position: { x: 100, y: 100 },
        size: { width: 200, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'left'
      },
      {
        id: 'field-incident-date',
        name: 'incident.date',
        label: 'Incident Date',
        type: 'date',
        position: { x: 100, y: 150 },
        size: { width: 150, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-location',
        name: 'incident.location',
        label: 'Location',
        type: 'text',
        position: { x: 100, y: 200 },
        size: { width: 400, height: 30 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      },
      {
        id: 'field-description',
        name: 'incident.description',
        label: 'Description',
        type: 'text',
        position: { x: 100, y: 250 },
        size: { width: 400, height: 100 },
        required: true,
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'left'
      }
    ],
    settings: {
      pageSize: 'A4',
      orientation: 'portrait',
      margins: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
      watermark: 'POLICE REPORT',
      digitalSignature: true,
      qrCodePosition: 'top-right'
    },
    isActive: true
  }
];

// Available placeholder fields for templates
export const placeholderFields: PlaceholderField[] = [
  // Applicant Information
  {
    id: 'placeholder-1',
    name: 'applicant.full_name',
    label: 'Applicant Full Name',
    description: 'Full legal name of the applicant',
    category: 'Applicant Information'
  },
  {
    id: 'placeholder-2',
    name: 'applicant.id_number',
    label: 'Applicant ID Number',
    description: 'Ghana Card or other national ID number',
    category: 'Applicant Information'
  },
  {
    id: 'placeholder-3',
    name: 'applicant.date_of_birth',
    label: 'Date of Birth',
    description: 'Applicant date of birth',
    category: 'Applicant Information'
  },
  {
    id: 'placeholder-4',
    name: 'applicant.address',
    label: 'Residential Address',
    description: 'Current residential address',
    category: 'Applicant Information'
  },
  {
    id: 'placeholder-5',
    name: 'applicant.phone',
    label: 'Phone Number',
    description: 'Contact phone number',
    category: 'Applicant Information'
  },
  {
    id: 'placeholder-6',
    name: 'applicant.email',
    label: 'Email Address',
    description: 'Contact email address',
    category: 'Applicant Information'
  },
  
  // Request Information
  {
    id: 'placeholder-7',
    name: 'request.id',
    label: 'Request ID',
    description: 'Unique identifier for the request',
    category: 'Request Information'
  },
  {
    id: 'placeholder-8',
    name: 'request.submission_date',
    label: 'Submission Date',
    description: 'Date when the request was submitted',
    category: 'Request Information'
  },
  {
    id: 'placeholder-9',
    name: 'request.issue_date',
    label: 'Issue Date',
    description: 'Date when the document is issued',
    category: 'Request Information'
  },
  {
    id: 'placeholder-10',
    name: 'request.expiry_date',
    label: 'Expiry Date',
    description: 'Date when the document expires',
    category: 'Request Information'
  },
  {
    id: 'placeholder-11',
    name: 'request.validation_url',
    label: 'Validation URL',
    description: 'URL for online verification',
    category: 'Request Information'
  },
  {
    id: 'placeholder-12',
    name: 'request.purpose',
    label: 'Purpose',
    description: 'Purpose of the request',
    category: 'Request Information'
  },
  
  // Institution Information
  {
    id: 'placeholder-13',
    name: 'institution.name',
    label: 'Institution Name',
    description: 'Full name of the issuing institution',
    category: 'Institution Information'
  },
  {
    id: 'placeholder-14',
    name: 'institution.address',
    label: 'Institution Address',
    description: 'Physical address of the institution',
    category: 'Institution Information'
  },
  {
    id: 'placeholder-15',
    name: 'institution.contact',
    label: 'Contact Information',
    description: 'Phone and email of the institution',
    category: 'Institution Information'
  },
  {
    id: 'placeholder-16',
    name: 'institution.logo',
    label: 'Institution Logo',
    description: 'Official logo of the institution',
    category: 'Institution Information'
  },
  {
    id: 'placeholder-17',
    name: 'institution.seal',
    label: 'Official Seal',
    description: 'Digital seal of the institution',
    category: 'Institution Information'
  },
  
  // Officer Information
  {
    id: 'placeholder-18',
    name: 'officer.name',
    label: 'Officer Name',
    description: 'Name of the issuing officer',
    category: 'Officer Information'
  },
  {
    id: 'placeholder-19',
    name: 'officer.title',
    label: 'Officer Title',
    description: 'Title or rank of the issuing officer',
    category: 'Officer Information'
  },
  {
    id: 'placeholder-20',
    name: 'officer.id',
    label: 'Officer ID',
    description: 'ID number of the issuing officer',
    category: 'Officer Information'
  },
  {
    id: 'placeholder-21',
    name: 'officer.signature',
    label: 'Officer Signature',
    description: 'Digital signature of the issuing officer',
    category: 'Officer Information'
  },
  
  // Document Specific - Police
  {
    id: 'placeholder-22',
    name: 'clearance.status',
    label: 'Clearance Status',
    description: 'Status of the police clearance',
    category: 'Police Clearance'
  },
  {
    id: 'placeholder-23',
    name: 'clearance.remarks',
    label: 'Remarks',
    description: 'Additional remarks on the clearance',
    category: 'Police Clearance'
  },
  
  // Document Specific - Court
  {
    id: 'placeholder-24',
    name: 'case.number',
    label: 'Case Number',
    description: 'Court case reference number',
    category: 'Court Documents'
  },
  {
    id: 'placeholder-25',
    name: 'case.name',
    label: 'Case Name',
    description: 'Name of the court case',
    category: 'Court Documents'
  },
  {
    id: 'placeholder-26',
    name: 'case.judgment',
    label: 'Judgment',
    description: 'Summary of the court judgment',
    category: 'Court Documents'
  },
  
  // Document Specific - Education
  {
    id: 'placeholder-27',
    name: 'education.institution',
    label: 'Educational Institution',
    description: 'Name of the educational institution',
    category: 'Education Documents'
  },
  {
    id: 'placeholder-28',
    name: 'education.program',
    label: 'Program/Course',
    description: 'Name of the program or course',
    category: 'Education Documents'
  },
  {
    id: 'placeholder-29',
    name: 'education.qualification',
    label: 'Qualification',
    description: 'Degree or qualification obtained',
    category: 'Education Documents'
  },
  {
    id: 'placeholder-30',
    name: 'education.graduation_date',
    label: 'Graduation Date',
    description: 'Date of graduation',
    category: 'Education Documents'
  }
];

// Helper functions
export const getAllTemplates = () => {
  return [...globalTemplates, ...institutionTemplates];
};

export const getGlobalTemplates = () => {
  return globalTemplates;
};

export const getInstitutionTemplates = (institutionId: string) => {
  return institutionTemplates.filter(template => template.institutionId === institutionId);
};

export const getTemplateById = (templateId: string) => {
  return getAllTemplates().find(template => template.id === templateId);
};