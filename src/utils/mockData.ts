import { Institution, Registry, Service, Request, Workflow, ApiKey, User, DocumentTemplate, RegistryField, WorkflowStage } from '../types';

export function generateMockData() {
  // Mock Institutions with comprehensive data
  const institutions: Institution[] = [
    {
      id: 'inst-police',
      name: 'Ghana Police Service',
      shortName: 'GPS',
      description: 'Criminal Investigation Department and Security Clearance Services',
      address: 'Police Headquarters, Ring Road Central, Accra',
      phone: '+233-302-773906',
      email: 'info@police.gov.gh',
      website: 'https://police.gov.gh',
      logo: '/image.png',
      primaryColor: '#dc2626',
      secondaryColor: '#171717',
      accentColor: '#fafafa',
      services: [],
      registries: [],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      stats: {
        totalRequests: 2847,
        pendingRequests: 156,
        completedRequests: 2634,
        rejectedRequests: 57,
        totalServices: 8,
        totalRegistries: 4,
        totalRecords: 45672
      }
    },
    {
      id: 'inst-court',
      name: 'High Court of Ghana',
      shortName: 'HCG',
      description: 'Judicial Service - Court Records and Legal Documentation',
      address: 'High Court Complex, Accra Central',
      phone: '+233-302-664851',
      email: 'registry@courts.gov.gh',
      website: 'https://courts.gov.gh',
      logo: '/image.png',
      primaryColor: '#7f1d1d',
      secondaryColor: '#171717',
      accentColor: '#fafafa',
      services: [],
      registries: [],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      stats: {
        totalRequests: 1523,
        pendingRequests: 89,
        completedRequests: 1398,
        rejectedRequests: 36,
        totalServices: 6,
        totalRegistries: 3,
        totalRecords: 28934
      }
    },
    {
      id: 'inst-education',
      name: 'Ministry of Education',
      shortName: 'MOE',
      description: 'Educational Certification and Academic Verification Services',
      address: 'Ministry of Education, Airport Residential Area, Accra',
      phone: '+233-302-666049',
      email: 'info@moe.gov.gh',
      website: 'https://moe.gov.gh',
      logo: '/image.png',
      primaryColor: '#991b1b',
      secondaryColor: '#171717',
      accentColor: '#fafafa',
      services: [],
      registries: [],
      isActive: true,
      createdAt: new Date('2024-01-01'),
      stats: {
        totalRequests: 4521,
        pendingRequests: 234,
        completedRequests: 4187,
        rejectedRequests: 100,
        totalServices: 12,
        totalRegistries: 6,
        totalRecords: 156789
      }
    }
  ];

  // Mock Registry Fields
  const criminalRecordFields: RegistryField[] = [
    {
      id: 'field-1',
      name: 'fullName',
      label: 'Full Name',
      type: 'text',
      required: true,
      order: 1,
      placeholder: 'Enter full legal name',
      helpText: 'Name as it appears on official documents'
    },
    {
      id: 'field-2',
      name: 'idNumber',
      label: 'Ghana Card Number',
      type: 'text',
      required: true,
      order: 2,
      placeholder: 'GHA-XXXXXXXXX-X',
      helpText: 'National identification number'
    },
    {
      id: 'field-3',
      name: 'dateOfBirth',
      label: 'Date of Birth',
      type: 'date',
      required: true,
      order: 3,
      helpText: 'Date of birth as on official documents'
    },
    {
      id: 'field-4',
      name: 'fingerprint',
      label: 'Fingerprint ID',
      type: 'text',
      required: false,
      order: 4,
      helpText: 'Biometric fingerprint identifier'
    },
    {
      id: 'field-5',
      name: 'criminalHistory',
      label: 'Criminal History',
      type: 'textarea',
      required: false,
      order: 5,
      helpText: 'Details of any criminal convictions'
    },
    {
      id: 'field-6',
      name: 'status',
      label: 'Clearance Status',
      type: 'select',
      required: true,
      options: ['Clean Record', 'Minor Offenses', 'Major Convictions', 'Under Investigation'],
      order: 6,
      helpText: 'Current criminal record status'
    }
  ];

  const courtRecordFields: RegistryField[] = [
    {
      id: 'field-7',
      name: 'caseNumber',
      label: 'Case Number',
      type: 'text',
      required: true,
      order: 1,
      placeholder: 'HC/CR/XXX/2024'
    },
    {
      id: 'field-8',
      name: 'parties',
      label: 'Parties Involved',
      type: 'textarea',
      required: true,
      order: 2
    },
    {
      id: 'field-9',
      name: 'caseType',
      label: 'Case Type',
      type: 'select',
      required: true,
      options: ['Civil', 'Criminal', 'Commercial', 'Family', 'Land'],
      order: 3
    },
    {
      id: 'field-10',
      name: 'filingDate',
      label: 'Filing Date',
      type: 'date',
      required: true,
      order: 4
    },
    {
      id: 'field-11',
      name: 'status',
      label: 'Case Status',
      type: 'select',
      required: true,
      options: ['Active', 'Closed', 'Pending', 'Appealed'],
      order: 5
    },
    {
      id: 'field-12',
      name: 'judgment',
      label: 'Judgment',
      type: 'textarea',
      required: false,
      order: 6
    }
  ];

  const educationRecordFields: RegistryField[] = [
    {
      id: 'field-13',
      name: 'studentName',
      label: 'Student Name',
      type: 'text',
      required: true,
      order: 1
    },
    {
      id: 'field-14',
      name: 'studentId',
      label: 'Student ID',
      type: 'text',
      required: true,
      order: 2
    },
    {
      id: 'field-15',
      name: 'institution',
      label: 'Educational Institution',
      type: 'text',
      required: true,
      order: 3
    },
    {
      id: 'field-16',
      name: 'program',
      label: 'Program/Course',
      type: 'text',
      required: true,
      order: 4
    },
    {
      id: 'field-17',
      name: 'level',
      label: 'Education Level',
      type: 'select',
      required: true,
      options: ['Basic Education', 'Secondary', 'Tertiary', 'Postgraduate'],
      order: 5
    },
    {
      id: 'field-18',
      name: 'graduationDate',
      label: 'Graduation Date',
      type: 'date',
      required: true,
      order: 6
    },
    {
      id: 'field-19',
      name: 'grade',
      label: 'Grade/Classification',
      type: 'text',
      required: true,
      order: 7
    },
    {
      id: 'field-20',
      name: 'verified',
      label: 'Verification Status',
      type: 'boolean',
      required: true,
      order: 8
    }
  ];

  // Mock Registries
  const registries: Registry[] = [
    {
      id: 'reg-police-criminal',
      name: 'Criminal Records Database',
      description: 'Comprehensive database of criminal records and background checks',
      institutionId: 'inst-police',
      fields: criminalRecordFields,
      records: Array.from({ length: 50 }, (_, i) => ({
        id: `rec-police-${i + 1}`,
        registryId: 'reg-police-criminal',
        data: {
          fullName: ['John Doe', 'Jane Smith', 'Kwame Asante', 'Ama Osei', 'Michael Johnson'][i % 5],
          idNumber: `GHA-${Math.random().toString().substr(2, 9)}-${i % 10}`,
          dateOfBirth: new Date(1970 + (i % 30), i % 12, (i % 28) + 1).toISOString().split('T')[0],
          status: ['Clean Record', 'Minor Offenses', 'Major Convictions', 'Under Investigation'][i % 4],
          fingerprint: `FP-${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
          criminalHistory: i % 4 === 0 ? '' : 'Traffic violation in 2022'
        },
        createdAt: new Date(2024, 0, i + 1),
        updatedAt: new Date(2024, 0, i + 1),
        createdBy: 'system',
        status: 'active'
      })),
      isPublic: false,
      searchable: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      category: 'Security',
      icon: 'Shield'
    },
    {
      id: 'reg-court-cases',
      name: 'Court Cases Registry',
      description: 'Registry of all court cases and legal proceedings',
      institutionId: 'inst-court',
      fields: courtRecordFields,
      records: Array.from({ length: 30 }, (_, i) => ({
        id: `rec-court-${i + 1}`,
        registryId: 'reg-court-cases',
        data: {
          caseNumber: `HC/CR/${String(i + 1).padStart(3, '0')}/2024`,
          parties: `Plaintiff vs Defendant ${i + 1}`,
          caseType: ['Civil', 'Criminal', 'Commercial', 'Family', 'Land'][i % 5],
          filingDate: new Date(2024, i % 12, (i % 28) + 1).toISOString().split('T')[0],
          status: ['Active', 'Closed', 'Pending', 'Appealed'][i % 4],
          judgment: i % 3 === 0 ? 'Case dismissed' : i % 3 === 1 ? 'Judgment for plaintiff' : ''
        },
        createdAt: new Date(2024, 0, i + 1),
        updatedAt: new Date(2024, 0, i + 1),
        createdBy: 'system',
        status: 'active'
      })),
      isPublic: true,
      searchable: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      category: 'Legal',
      icon: 'Scale'
    },
    {
      id: 'reg-education-certificates',
      name: 'Educational Certificates Registry',
      description: 'Verified educational certificates and academic records',
      institutionId: 'inst-education',
      fields: educationRecordFields,
      records: Array.from({ length: 75 }, (_, i) => ({
        id: `rec-edu-${i + 1}`,
        registryId: 'reg-education-certificates',
        data: {
          studentName: ['Alice Johnson', 'Bob Wilson', 'Carol Davis', 'David Brown', 'Eva Martinez'][i % 5],
          studentId: `STU-${2020 + (i % 5)}-${String(i + 1).padStart(6, '0')}`,
          institution: ['University of Ghana', 'KNUST', 'University of Cape Coast', 'GIMPA', 'Ashesi University'][i % 5],
          program: ['Computer Science', 'Engineering', 'Business Administration', 'Medicine', 'Law'][i % 5],
          level: ['Basic Education', 'Secondary', 'Tertiary', 'Postgraduate'][i % 4],
          graduationDate: new Date(2020 + (i % 5), 5, 15).toISOString().split('T')[0],
          grade: ['First Class', 'Second Class Upper', 'Second Class Lower', 'Third Class'][i % 4],
          verified: i % 10 !== 0
        },
        createdAt: new Date(2024, 0, i + 1),
        updatedAt: new Date(2024, 0, i + 1),
        createdBy: 'system',
        status: 'active'
      })),
      isPublic: true,
      searchable: true,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      category: 'Education',
      icon: 'GraduationCap'
    }
  ];

  // Mock Workflow Stages
  const policeWorkflowStages: WorkflowStage[] = [
    {
      id: 'stage-police-1',
      name: 'Application Received',
      description: 'Initial application submission and document verification',
      type: 'start',
      assignedRoles: ['processor'],
      requiredActions: ['verify_documents', 'check_completeness'],
      slaHours: 24,
      order: 1,
      position: { x: 100, y: 100 },
      color: '#10b981'
    },
    {
      id: 'stage-police-2',
      name: 'Background Check',
      description: 'Comprehensive criminal background verification',
      type: 'review',
      assignedRoles: ['processor'],
      requiredActions: ['check_criminal_records', 'verify_identity', 'fingerprint_check'],
      slaHours: 72,
      order: 2,
      position: { x: 300, y: 100 },
      color: '#3b82f6'
    },
    {
      id: 'stage-police-3',
      name: 'Supervisor Review',
      description: 'Senior officer review and approval',
      type: 'approval',
      assignedRoles: ['reviewer'],
      requiredActions: ['review_findings', 'approve_or_reject'],
      slaHours: 48,
      order: 3,
      position: { x: 500, y: 100 },
      color: '#f59e0b'
    },
    {
      id: 'stage-police-4',
      name: 'Certificate Generation',
      description: 'Generate and digitally sign clearance certificate',
      type: 'document_generation',
      assignedRoles: ['processor'],
      requiredActions: ['generate_certificate', 'apply_digital_signature'],
      slaHours: 24,
      order: 4,
      position: { x: 700, y: 100 },
      color: '#8b5cf6'
    }
  ];

  const courtWorkflowStages: WorkflowStage[] = [
    {
      id: 'stage-court-1',
      name: 'Request Received',
      description: 'Court record request received and logged',
      type: 'start',
      assignedRoles: ['processor'],
      requiredActions: ['log_request', 'verify_identity'],
      slaHours: 12,
      order: 1,
      position: { x: 100, y: 100 },
      color: '#10b981'
    },
    {
      id: 'stage-court-2',
      name: 'Record Search',
      description: 'Search court databases for requested records',
      type: 'review',
      assignedRoles: ['processor'],
      requiredActions: ['search_records', 'compile_results'],
      slaHours: 48,
      order: 2,
      position: { x: 300, y: 100 },
      color: '#3b82f6'
    },
    {
      id: 'stage-court-3',
      name: 'Legal Review',
      description: 'Legal officer reviews for confidentiality and accuracy',
      type: 'approval',
      assignedRoles: ['reviewer'],
      requiredActions: ['legal_review', 'confidentiality_check'],
      slaHours: 24,
      order: 3,
      position: { x: 500, y: 100 },
      color: '#f59e0b'
    },
    {
      id: 'stage-court-4',
      name: 'Document Preparation',
      description: 'Prepare official court document with seal',
      type: 'document_generation',
      assignedRoles: ['processor'],
      requiredActions: ['prepare_document', 'apply_court_seal'],
      slaHours: 12,
      order: 4,
      position: { x: 700, y: 100 },
      color: '#8b5cf6'
    }
  ];

  const educationWorkflowStages: WorkflowStage[] = [
    {
      id: 'stage-edu-1',
      name: 'Verification Request',
      description: 'Academic verification request received',
      type: 'start',
      assignedRoles: ['processor'],
      requiredActions: ['receive_request', 'check_documents'],
      slaHours: 24,
      order: 1,
      position: { x: 100, y: 100 },
      color: '#10b981'
    },
    {
      id: 'stage-edu-2',
      name: 'Institution Verification',
      description: 'Verify with educational institution',
      type: 'review',
      assignedRoles: ['processor'],
      requiredActions: ['contact_institution', 'verify_records'],
      slaHours: 120,
      order: 2,
      position: { x: 300, y: 100 },
      color: '#3b82f6'
    },
    {
      id: 'stage-edu-3',
      name: 'Academic Review',
      description: 'Academic officer reviews verification results',
      type: 'approval',
      assignedRoles: ['reviewer'],
      requiredActions: ['academic_review', 'validate_credentials'],
      slaHours: 48,
      order: 3,
      position: { x: 500, y: 100 },
      color: '#f59e0b'
    },
    {
      id: 'stage-edu-4',
      name: 'Certificate Issuance',
      description: 'Issue verified academic certificate',
      type: 'document_generation',
      assignedRoles: ['processor'],
      requiredActions: ['generate_certificate', 'ministry_seal'],
      slaHours: 24,
      order: 4,
      position: { x: 700, y: 100 },
      color: '#8b5cf6'
    }
  ];

  // Mock Workflows
  const workflows: Workflow[] = [
    {
      id: 'workflow-police',
      name: 'Police Clearance Certificate Workflow',
      stages: policeWorkflowStages,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'workflow-court',
      name: 'Court Record Request Workflow',
      stages: courtWorkflowStages,
      createdAt: new Date('2024-01-01')
    },
    {
      id: 'workflow-education',
      name: 'Academic Verification Workflow',
      stages: educationWorkflowStages,
      createdAt: new Date('2024-01-01')
    }
  ];

  // Mock Services
  const services: Service[] = [
    {
      id: 'service-police-clearance',
      name: 'Police Clearance Certificate',
      description: 'Official certificate confirming criminal record status for employment, travel, and immigration purposes',
      institutionId: 'inst-police',
      category: 'Security Clearance',
      requiredDocuments: ['Ghana Card', 'Passport Photo', 'Application Form', 'Fingerprints'],
      processingTime: '5-7 business days',
      fee: 50,
      currency: 'GHS',
      workflow: workflows[0],
      isActive: true,
      isPublic: true,
      createdAt: new Date('2024-01-01'),
      icon: 'Shield',
      color: '#dc2626',
      stats: {
        totalRequests: 1247,
        avgProcessingTime: '4.2 days',
        successRate: 94.5
      }
    },
    {
      id: 'service-police-incident',
      name: 'Incident Report Request',
      description: 'Official police incident reports for insurance and legal purposes',
      institutionId: 'inst-police',
      category: 'Reports',
      requiredDocuments: ['Ghana Card', 'Incident Details', 'Supporting Documents'],
      processingTime: '3-5 business days',
      fee: 25,
      currency: 'GHS',
      workflow: workflows[0],
      isActive: true,
      isPublic: true,
      createdAt: new Date('2024-01-01'),
      icon: 'FileText',
      color: '#dc2626',
      stats: {
        totalRequests: 856,
        avgProcessingTime: '3.8 days',
        successRate: 97.2
      }
    },
    {
      id: 'service-court-records',
      name: 'Court Case History',
      description: 'Official court case records and judgment history',
      institutionId: 'inst-court',
      category: 'Legal Records',
      requiredDocuments: ['Ghana Card', 'Case Reference', 'Legal Standing Proof'],
      processingTime: '7-10 business days',
      fee: 75,
      currency: 'GHS',
      workflow: workflows[1],
      isActive: true,
      isPublic: true,
      createdAt: new Date('2024-01-01'),
      icon: 'Scale',
      color: '#7f1d1d',
      stats: {
        totalRequests: 623,
        avgProcessingTime: '8.1 days',
        successRate: 91.8
      }
    },
    {
      id: 'service-court-certificate',
      name: 'Legal Standing Certificate',
      description: 'Certificate confirming legal standing and court case status',
      institutionId: 'inst-court',
      category: 'Certificates',
      requiredDocuments: ['Ghana Card', 'Legal Documents', 'Application Form'],
      processingTime: '5-7 business days',
      fee: 60,
      currency: 'GHS',
      workflow: workflows[1],
      isActive: true,
      isPublic: true,
      createdAt: new Date('2024-01-01'),
      icon: 'Award',
      color: '#7f1d1d',
      stats: {
        totalRequests: 445,
        avgProcessingTime: '6.3 days',
        successRate: 95.1
      }
    },
    {
      id: 'service-edu-verification',
      name: 'Academic Certificate Verification',
      description: 'Official verification of educational certificates and academic credentials',
      institutionId: 'inst-education',
      category: 'Verification',
      requiredDocuments: ['Original Certificate', 'Transcript', 'Ghana Card', 'Passport Photo'],
      processingTime: '10-14 business days',
      fee: 100,
      currency: 'GHS',
      workflow: workflows[2],
      isActive: true,
      isPublic: true,
      createdAt: new Date('2024-01-01'),
      icon: 'GraduationCap',
      color: '#991b1b',
      stats: {
        totalRequests: 2134,
        avgProcessingTime: '11.5 days',
        successRate: 88.7
      }
    },
    {
      id: 'service-edu-transcript',
      name: 'Official Transcript Request',
      description: 'Request for official academic transcripts from educational institutions',
      institutionId: 'inst-education',
      category: 'Documents',
      requiredDocuments: ['Student ID', 'Ghana Card', 'Institution Letter', 'Fee Payment'],
      processingTime: '7-10 business days',
      fee: 50,
      currency: 'GHS',
      workflow: workflows[2],
      isActive: true,
      isPublic: true,
      createdAt: new Date('2024-01-01'),
      icon: 'FileText',
      color: '#991b1b',
      stats: {
        totalRequests: 1876,
        avgProcessingTime: '8.7 days',
        successRate: 92.3
      }
    }
  ];

  // Mock Document Templates
  const templates: DocumentTemplate[] = [
    {
      id: 'template-police-clearance',
      name: 'Police Clearance Certificate',
      description: 'Official police clearance certificate template with digital signature and QR code',
      institutionId: 'inst-police',
      category: 'Certificates',
      thumbnail: '/api/placeholder/300/400',
      fileUrl: '/templates/police-clearance.pdf',
      fields: [
        {
          id: 'field-name',
          name: 'fullName',
          label: 'Full Name',
          type: 'text',
          position: { x: 200, y: 150 },
          size: { width: 300, height: 30 },
          required: true
        },
        {
          id: 'field-id',
          name: 'idNumber',
          label: 'ID Number',
          type: 'text',
          position: { x: 200, y: 200 },
          size: { width: 200, height: 30 },
          required: true
        },
        {
          id: 'field-date',
          name: 'issueDate',
          label: 'Issue Date',
          type: 'date',
          position: { x: 200, y: 250 },
          size: { width: 150, height: 30 },
          required: true
        },
        {
          id: 'field-signature',
          name: 'officerSignature',
          label: 'Officer Signature',
          type: 'signature',
          position: { x: 400, y: 350 },
          size: { width: 150, height: 60 },
          required: true
        },
        {
          id: 'field-qr',
          name: 'verificationQR',
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
        margins: { top: 50, right: 50, bottom: 50, left: 50 },
        watermark: 'OFFICIAL DOCUMENT',
        digitalSignature: true,
        qrCodePosition: 'top-right'
      },
      createdAt: new Date('2024-01-01'),
      isActive: true
    },
    {
      id: 'template-court-certificate',
      name: 'Court Case History Certificate',
      description: 'Official court case history and legal standing certificate',
      institutionId: 'inst-court',
      category: 'Legal Documents',
      thumbnail: '/api/placeholder/300/400',
      fileUrl: '/templates/court-certificate.pdf',
      fields: [
        {
          id: 'field-case-name',
          name: 'caseName',
          label: 'Case Name',
          type: 'text',
          position: { x: 100, y: 120 },
          size: { width: 400, height: 30 },
          required: true
        },
        {
          id: 'field-case-number',
          name: 'caseNumber',
          label: 'Case Number',
          type: 'text',
          position: { x: 100, y: 170 },
          size: { width: 200, height: 30 },
          required: true
        },
        {
          id: 'field-judgment',
          name: 'judgment',
          label: 'Judgment Summary',
          type: 'text',
          position: { x: 100, y: 220 },
          size: { width: 400, height: 80 },
          required: false
        }
      ],
      settings: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 60, right: 60, bottom: 60, left: 60 },
        watermark: 'HIGH COURT OF GHANA',
        digitalSignature: true,
        qrCodePosition: 'bottom-right'
      },
      createdAt: new Date('2024-01-01'),
      isActive: true
    },
    {
      id: 'template-edu-verification',
      name: 'Academic Verification Certificate',
      description: 'Official academic credential verification certificate',
      institutionId: 'inst-education',
      category: 'Academic Documents',
      thumbnail: '/api/placeholder/300/400',
      fileUrl: '/templates/academic-verification.pdf',
      fields: [
        {
          id: 'field-student-name',
          name: 'studentName',
          label: 'Student Name',
          type: 'text',
          position: { x: 150, y: 140 },
          size: { width: 300, height: 30 },
          required: true
        },
        {
          id: 'field-institution',
          name: 'institution',
          label: 'Institution',
          type: 'text',
          position: { x: 150, y: 190 },
          size: { width: 300, height: 30 },
          required: true
        },
        {
          id: 'field-program',
          name: 'program',
          label: 'Program',
          type: 'text',
          position: { x: 150, y: 240 },
          size: { width: 300, height: 30 },
          required: true
        },
        {
          id: 'field-graduation-date',
          name: 'graduationDate',
          label: 'Graduation Date',
          type: 'date',
          position: { x: 150, y: 290 },
          size: { width: 150, height: 30 },
          required: true
        }
      ],
      settings: {
        pageSize: 'A4',
        orientation: 'portrait',
        margins: { top: 50, right: 50, bottom: 50, left: 50 },
        watermark: 'MINISTRY OF EDUCATION',
        digitalSignature: true,
        qrCodePosition: 'top-right'
      },
      createdAt: new Date('2024-01-01'),
      isActive: true
    }
  ];

  // Mock Requests with comprehensive data
  const requests: Request[] = [
    // Police requests
    ...Array.from({ length: 25 }, (_, i) => ({
      id: `req-police-${i + 1}`,
      serviceId: i % 2 === 0 ? 'service-police-clearance' : 'service-police-incident',
      institutionId: 'inst-police',
      requesterId: `citizen-${i + 1}`,
      requesterInfo: {
        name: ['Michael Asante', 'Sarah Osei', 'John Mensah', 'Grace Adjei', 'David Kusi'][i % 5],
        email: `user${i + 1}@email.com`,
        phone: `+233-${20 + (i % 10)}-${Math.random().toString().substr(2, 7)}`,
        address: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Takoradi'][i % 5],
        idNumber: `GHA-${Math.random().toString().substr(2, 9)}-${i % 10}`
      },
      status: ['submitted', 'under_review', 'pending_approval', 'completed', 'rejected'][i % 5] as any,
      currentStage: `stage-police-${(i % 4) + 1}`,
      submittedData: {
        purpose: ['Employment', 'Travel', 'Immigration', 'Business', 'Education'][i % 5],
        urgency: ['normal', 'urgent'][i % 2]
      },
      uploadedDocuments: [
        {
          id: `doc-${i + 1}`,
          name: 'ghana_card.pdf',
          type: 'application/pdf',
          size: 1024000 + (i * 50000),
          url: `/documents/ghana_card_${i + 1}.pdf`,
          uploadedAt: new Date(2024, 0, i + 1),
          verified: i % 10 !== 0
        }
      ],
      processingHistory: [
        {
          id: `hist-${i + 1}`,
          stage: 'stage-police-1',
          action: 'Application received and documents verified',
          performedBy: `Officer ${['Mensah', 'Osei', 'Asante'][i % 3]}`,
          performedAt: new Date(2024, 0, i + 1),
          comments: 'All required documents submitted',
          duration: 2 + (i % 5)
        }
      ],
      generatedDocuments: [],
      paymentStatus: ['paid', 'pending', 'failed'][i % 3] as any,
      paymentAmount: i % 2 === 0 ? 50 : 25,
      submittedAt: new Date(2024, 0, i + 1),
      estimatedCompletion: new Date(2024, 0, i + 8),
      priority: ['normal', 'high', 'urgent'][i % 3] as any,
      slaStatus: ['on-time', 'at-risk', 'overdue'][i % 3] as any
    })),
    // Court requests
    ...Array.from({ length: 15 }, (_, i) => ({
      id: `req-court-${i + 1}`,
      serviceId: i % 2 === 0 ? 'service-court-records' : 'service-court-certificate',
      institutionId: 'inst-court',
      requesterId: `citizen-${i + 26}`,
      requesterInfo: {
        name: ['Alice Johnson', 'Robert Brown', 'Mary Wilson', 'James Davis', 'Linda Garcia'][i % 5],
        email: `court_user${i + 1}@email.com`,
        phone: `+233-${24 + (i % 6)}-${Math.random().toString().substr(2, 7)}`,
        address: ['Accra', 'Kumasi', 'Ho', 'Koforidua', 'Sunyani'][i % 5],
        idNumber: `GHA-${Math.random().toString().substr(2, 9)}-${i % 10}`
      },
      status: ['submitted', 'under_review', 'pending_approval', 'completed'][i % 4] as any,
      currentStage: `stage-court-${(i % 4) + 1}`,
      submittedData: {
        caseType: ['Civil', 'Criminal', 'Commercial', 'Family'][i % 4],
        timeframe: ['Last 5 years', 'Last 10 years', 'All records'][i % 3]
      },
      uploadedDocuments: [
        {
          id: `doc-court-${i + 1}`,
          name: 'legal_documents.pdf',
          type: 'application/pdf',
          size: 2048000 + (i * 75000),
          url: `/documents/legal_docs_${i + 1}.pdf`,
          uploadedAt: new Date(2024, 0, i + 5),
          verified: i % 8 !== 0
        }
      ],
      processingHistory: [
        {
          id: `hist-court-${i + 1}`,
          stage: 'stage-court-1',
          action: 'Legal record request received',
          performedBy: `Registrar ${['Adjei', 'Boateng', 'Owusu'][i % 3]}`,
          performedAt: new Date(2024, 0, i + 5),
          comments: 'Request logged and identity verified',
          duration: 1 + (i % 3)
        }
      ],
      generatedDocuments: [],
      paymentStatus: ['paid', 'pending'][i % 2] as any,
      paymentAmount: i % 2 === 0 ? 75 : 60,
      submittedAt: new Date(2024, 0, i + 5),
      estimatedCompletion: new Date(2024, 0, i + 15),
      priority: ['normal', 'high'][i % 2] as any,
      slaStatus: ['on-time', 'at-risk'][i % 2] as any
    })),
    // Education requests
    ...Array.from({ length: 35 }, (_, i) => ({
      id: `req-edu-${i + 1}`,
      serviceId: i % 2 === 0 ? 'service-edu-verification' : 'service-edu-transcript',
      institutionId: 'inst-education',
      requesterId: `citizen-${i + 41}`,
      requesterInfo: {
        name: ['Emmanuel Nkrumah', 'Akosua Sarpong', 'Kwaku Boateng', 'Efua Asante', 'Kofi Mensah'][i % 5],
        email: `edu_user${i + 1}@email.com`,
        phone: `+233-${26 + (i % 8)}-${Math.random().toString().substr(2, 7)}`,
        address: ['Accra', 'Kumasi', 'Cape Coast', 'Legon', 'KNUST'][i % 5],
        idNumber: `GHA-${Math.random().toString().substr(2, 9)}-${i % 10}`
      },
      status: ['submitted', 'under_review', 'pending_approval', 'completed', 'rejected'][i % 5] as any,
      currentStage: `stage-edu-${(i % 4) + 1}`,
      submittedData: {
        institution: ['University of Ghana', 'KNUST', 'UCC', 'GIMPA', 'Ashesi'][i % 5],
        program: ['Computer Science', 'Engineering', 'Business', 'Medicine', 'Law'][i % 5],
        graduationYear: 2015 + (i % 10)
      },
      uploadedDocuments: [
        {
          id: `doc-edu-${i + 1}`,
          name: 'certificate.pdf',
          type: 'application/pdf',
          size: 1536000 + (i * 60000),
          url: `/documents/certificate_${i + 1}.pdf`,
          uploadedAt: new Date(2024, 0, i + 10),
          verified: i % 12 !== 0
        }
      ],
      processingHistory: [
        {
          id: `hist-edu-${i + 1}`,
          stage: 'stage-edu-1',
          action: 'Academic verification request received',
          performedBy: `Officer ${['Amponsah', 'Darko', 'Frimpong'][i % 3]}`,
          performedAt: new Date(2024, 0, i + 10),
          comments: 'Documents received and logged for verification',
          duration: 3 + (i % 4)
        }
      ],
      generatedDocuments: [],
      paymentStatus: ['paid', 'pending', 'failed'][i % 3] as any,
      paymentAmount: i % 2 === 0 ? 100 : 50,
      submittedAt: new Date(2024, 0, i + 10),
      estimatedCompletion: new Date(2024, 0, i + 24),
      priority: ['normal', 'high', 'urgent'][i % 3] as any,
      slaStatus: ['on-time', 'at-risk', 'overdue'][i % 3] as any
    }))
  ];

  // Mock API Keys
  const apiKeys: ApiKey[] = [
    {
      id: 'api-police-1',
      name: 'External Verification System - Police',
      key: 'bac_live_sk_police_1234567890abcdef',
      institutionId: 'inst-police',
      permissions: ['verify_documents', 'read_registries', 'check_status'],
      rateLimit: 1000,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastUsed: new Date('2024-01-25'),
      usage: {
        totalCalls: 15847,
        monthlyLimit: 50000,
        currentMonth: 3247
      }
    },
    {
      id: 'api-court-1',
      name: 'Legal Services Integration - Court',
      key: 'bac_live_sk_court_abcdef1234567890',
      institutionId: 'inst-court',
      permissions: ['verify_documents', 'read_registries'],
      rateLimit: 500,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastUsed: new Date('2024-01-24'),
      usage: {
        totalCalls: 8934,
        monthlyLimit: 25000,
        currentMonth: 1876
      }
    },
    {
      id: 'api-edu-1',
      name: 'Academic Verification Portal - Education',
      key: 'bac_live_sk_edu_fedcba0987654321',
      institutionId: 'inst-education',
      permissions: ['verify_documents', 'read_registries', 'submit_requests'],
      rateLimit: 2000,
      isActive: true,
      createdAt: new Date('2024-01-01'),
      lastUsed: new Date('2024-01-26'),
      usage: {
        totalCalls: 23456,
        monthlyLimit: 100000,
        currentMonth: 5678
      }
    }
  ];

  // Mock Users
  const users: User[] = [
    {
      id: 'user-police-admin',
      email: 'admin@police.gov.gh',
      name: 'Inspector Sarah Mensah',
      role: 'institution_admin',
      institutionId: 'inst-police',
      permissions: ['manage_services', 'manage_registries', 'process_requests', 'view_analytics', 'manage_templates'],
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date('2024-01-26'),
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'user-court-admin',
      email: 'registrar@courts.gov.gh',
      name: 'Chief Registrar John Boateng',
      role: 'institution_admin',
      institutionId: 'inst-court',
      permissions: ['manage_services', 'manage_registries', 'process_requests', 'view_analytics', 'manage_templates'],
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date('2024-01-25'),
      avatar: '/api/placeholder/40/40'
    },
    {
      id: 'user-edu-admin',
      email: 'director@moe.gov.gh',
      name: 'Dr. Akosua Frimpong',
      role: 'institution_admin',
      institutionId: 'inst-education',
      permissions: ['manage_services', 'manage_registries', 'process_requests', 'view_analytics', 'manage_templates'],
      createdAt: new Date('2024-01-01'),
      lastLogin: new Date('2024-01-26'),
      avatar: '/api/placeholder/40/40'
    }
  ];

  return {
    institutions,
    registries,
    services,
    requests,
    workflows,
    apiKeys,
    templates,
    users
  };
}