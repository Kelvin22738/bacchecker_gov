// Master Demo Data Model - Single source of truth for all UI components
export interface MasterInstitution {
  id: string;
  name: string;
  acronym: string;
  description: string;
  contact: {
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  status: 'Active' | 'Inactive';
  online: boolean;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

export interface MasterService {
  id: string;
  institution_id: string;
  name: string;
  description: string;
  category: string;
  fee: number;
  currency: string;
  processingTime: string;
  requiredDocuments: string[];
  isActive: boolean;
}

export interface MasterRequest {
  id: string;
  requestId: string;
  applicant: string;
  institution_id: string;
  service_id: string;
  submittedDate: string;
  status: 'Under Review' | 'Pending Approval' | 'Completed' | 'Rejected' | 'Submitted';
  risk: 'On Time' | 'At Risk' | 'Overdue' | null;
  priority: 'Low' | 'Normal' | 'High' | 'Urgent';
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
  paymentAmount: number;
  requesterInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    idNumber: string;
  };
  processingHistory: Array<{
    id: string;
    stage: string;
    action: string;
    performedBy: string;
    performedAt: string;
    comments?: string;
    duration?: number;
  }>;
}

export interface MasterUser {
  id: string;
  name: string;
  email: string;
  role: string;
  institution_id: string | null;
  status: 'Active' | 'Inactive';
  lastLogin?: string;
  avatar?: string;
}

// Master Data Sets
export const masterInstitutions: MasterInstitution[] = [
  {
    id: "gtec",
    name: "Ghana Tertiary Education Commission",
    acronym: "GTEC",
    description: "Regulatory body for tertiary education in Ghana.",
    contact: {
      address: "GTEC House, Liberation Road, Accra",
      phone: "+233-302-244694",
      email: "info@gtec.edu.gh",
      website: "https://gtec.edu.gh"
    },
    status: "Active",
    online: true,
    logo: "/GTEC-LOGO-removebg-preview.png",
    primaryColor: "#1e40af",
    secondaryColor: "#171717",
    accentColor: "#fafafa"
  },
  {
    id: "ug",
    name: "University of Ghana",
    acronym: "UG",
    description: "Premier university in Ghana offering undergraduate and graduate programs.",
    contact: {
      address: "University of Ghana, Legon, Accra",
      phone: "+233-302-500381",
      email: "info@ug.edu.gh",
      website: "https://ug.edu.gh"
    },
    status: "Active",
    online: true,
    logo: "/GTEC-LOGO-removebg-preview.png",
    primaryColor: "#059669",
    secondaryColor: "#171717",
    accentColor: "#fafafa"
  },
  {
    id: "knust",
    name: "Kwame Nkrumah University of Science and Technology",
    acronym: "KNUST",
    description: "Leading technological university in Ghana.",
    contact: {
      address: "KNUST, Kumasi, Ghana",
      phone: "+233-322-060319",
      email: "info@knust.edu.gh",
      website: "https://knust.edu.gh"
    },
    status: "Active",
    online: true,
    logo: "/GTEC-LOGO-removebg-preview.png",
    primaryColor: "#dc2626",
    secondaryColor: "#171717",
    accentColor: "#fafafa"
  },
  {
    id: "gps",
    name: "Ghana Police Service",
    acronym: "GPS",
    description: "National police service responsible for law enforcement in Ghana.",
    contact: {
      address: "Police Headquarters, Accra, Ghana",
      phone: "+233-302-773906",
      email: "info@police.gov.gh",
      website: "https://police.gov.gh"
    },
    status: "Active",
    online: true,
    logo: "/GTEC-LOGO-removebg-preview.png",
    primaryColor: "#2563eb",
    secondaryColor: "#1e293b",
    accentColor: "#fbbf24"
  }
];

export const masterServices: MasterService[] = [
  {
    id: "gtec_accreditation",
    institution_id: "gtec",
    name: "Institution Accreditation",
    description: "Accreditation verification for tertiary institutions",
    category: "Accreditation",
    fee: 50,
    currency: "GHS",
    processingTime: "10-14 business days",
    requiredDocuments: ["Institution Documents", "Academic Programs", "Faculty List"],
    isActive: true
  },
  {
    id: "ug_transcript",
    institution_id: "ug",
    name: "Official Transcript",
    description: "Official academic transcript verification",
    category: "Academic Documents",
    fee: 100,
    currency: "GHS",
    processingTime: "7-10 business days",
    requiredDocuments: ["Student ID", "Application Form", "Payment Receipt"],
    isActive: true
  },
  {
    id: "knust_certificate",
    institution_id: "knust",
    name: "Degree Certificate Verification",
    description: "Verification of degree certificates",
    category: "Academic Verification",
    fee: 75,
    currency: "GHS",
    processingTime: "5-7 business days",
    requiredDocuments: ["Certificate Copy", "Student ID", "Application Form"],
    isActive: true
  },
  {
    id: "gps_clearance",
    institution_id: "gps",
    name: "Police Clearance Certificate",
    description: "Issuance of police clearance certificates for background checks.",
    category: "Clearance",
    fee: 120,
    currency: "GHS",
    processingTime: "3-5 business days",
    requiredDocuments: ["Application Form", "ID Card Copy"],
    isActive: true
  }
];

// Generate 75 varied requests
export const masterRequests: MasterRequest[] = [
  // GTEC Requests (25)
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `req-gtec-${String(i + 1).padStart(3, '0')}`,
    requestId: `#gtec-${i + 1}`,
    applicant: [
      'University of Ghana', 'KNUST', 'University of Cape Coast', 'GIMPA', 'Ashesi University',
      'Central University', 'Valley View University', 'Presbyterian University', 'Methodist University', 'Pentecost University',
      'Ghana Institute of Journalism', 'Accra Technical University', 'Ho Technical University', 'Tamale Technical University', 'Sunyani Technical University',
      'Bolgatanga Technical University', 'Koforidua Technical University', 'Takoradi Technical University', 'Cape Coast Technical University', 'Wa Technical University',
      'Ghana Communication Technology University', 'University of Professional Studies', 'University of Development Studies', 'University of Energy', 'Academic City University'
    ][i],
    institution_id: 'gtec',
    service_id: 'gtec_accreditation',
    submittedDate: new Date(2024, 5, Math.floor(Math.random() * 30) + 1).toISOString(),
    status: ['Under Review', 'Pending Approval', 'Completed', 'Rejected', 'Submitted'][i % 5] as any,
    risk: i % 4 === 0 ? null : ['On Time', 'At Risk', 'Overdue'][i % 3] as any,
    priority: ['Normal', 'High', 'Urgent', 'Low'][i % 4] as any,
    paymentStatus: ['Paid', 'Pending', 'Failed'][i % 3] as any,
    paymentAmount: 50,
    requesterInfo: {
      name: [
        'Dr. Nana Aba Appiah Amfo', 'Prof. Kwasi Obiri-Danso', 'Dr. Joshua Alabi', 'Prof. Emmanuel Akyeampong', 'Dr. Elsie Effah Kaufmann',
        'Prof. Rita Akosua Dickson', 'Dr. Kwame Karikari', 'Prof. Jane Naana Opoku-Agyemang', 'Dr. Patrick Awuah', 'Prof. Ernest Aryeetey',
        'Dr. Yaw Osei Adutwum', 'Prof. Naana Jane Opoku-Agyemang', 'Dr. Matthew Opoku Prempeh', 'Prof. Aaron Mike Oquaye', 'Dr. Kwaku Aning',
        'Prof. Joseph Ghartey Ampiah', 'Dr. Grace Ofori-Sarpong', 'Prof. Samuel Kwaku Bonsu', 'Dr. Angela Dwamena-Aboagye', 'Prof. Kwabena Frimpong-Boateng',
        'Dr. Kwame Pianim', 'Prof. Esi Sutherland-Addy', 'Dr. Kwaku Ohene-Frempong', 'Prof. Francis Dodoo', 'Dr. Akosua Adomako Ampofo'
      ][i],
      email: `admin${i + 1}@university.edu.gh`,
      phone: `+233-${30 + (i % 10)}-${Math.random().toString().substr(2, 7)}`,
      address: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Takoradi'][i % 5],
      idNumber: `INST-${Math.random().toString().substr(2, 9)}-${i % 10}`
    },
    processingHistory: [
      {
        id: `hist-gtec-${i + 1}`,
        stage: 'Accreditation Review',
        action: 'Accreditation application received and under review',
        performedBy: `GTEC Officer ${['Mensah', 'Osei', 'Asante'][i % 3]}`,
        performedAt: new Date(2024, 5, Math.floor(Math.random() * 30) + 1).toISOString(),
        comments: 'Institution documents under review',
        duration: 2 + (i % 5)
      }
    ]
  })),

  // UG Requests (25)
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `req-ug-${String(i + 1).padStart(3, '0')}`,
    requestId: `#ug-${i + 1}`,
    applicant: [
      'Kwame Asante', 'Ama Osei', 'Kofi Mensah', 'Akosua Sarpong', 'Yaw Boateng',
      'Efua Asante', 'Kwaku Boateng', 'Adwoa Mensah', 'Kojo Darko', 'Abena Kumi',
      'Kwesi Owusu', 'Esi Frimpong', 'Fiifi Asante', 'Araba Mensah', 'Koku Boateng',
      'Aba Adjei', 'Nana Owusu', 'Ama Frimpong', 'Kofi Darko', 'Akosua Kumi',
      'Kwame Amponsah', 'Adjoa Osei', 'Emmanuel Nkrumah', 'Grace Adjei', 'David Kusi'
    ][i],
    institution_id: 'ug',
    service_id: 'ug_transcript',
    submittedDate: new Date(2024, 5, Math.floor(Math.random() * 30) + 1).toISOString(),
    status: ['Under Review', 'Pending Approval', 'Completed', 'Rejected', 'Submitted'][i % 5] as any,
    risk: i % 4 === 0 ? null : ['On Time', 'At Risk', 'Overdue'][i % 3] as any,
    priority: ['Normal', 'High', 'Urgent', 'Low'][i % 4] as any,
    paymentStatus: ['Paid', 'Pending', 'Failed'][i % 3] as any,
    paymentAmount: 100,
    requesterInfo: {
      name: [
        'Kwame Asante', 'Ama Osei', 'Kofi Mensah', 'Akosua Sarpong', 'Yaw Boateng',
        'Efua Asante', 'Kwaku Boateng', 'Adwoa Mensah', 'Kojo Darko', 'Abena Kumi',
        'Kwesi Owusu', 'Esi Frimpong', 'Fiifi Asante', 'Araba Mensah', 'Koku Boateng',
        'Aba Adjei', 'Nana Owusu', 'Ama Frimpong', 'Kofi Darko', 'Akosua Kumi',
        'Kwame Amponsah', 'Adjoa Osei', 'Emmanuel Nkrumah', 'Grace Adjei', 'David Kusi'
      ][i],
      email: `student${i + 1}@ug.edu.gh`,
      phone: `+233-${24 + (i % 6)}-${Math.random().toString().substr(2, 7)}`,
      address: ['Legon', 'Accra', 'Tema', 'Madina', 'Adenta'][i % 5],
      idNumber: `UG-${Math.random().toString().substr(2, 9)}-${i % 10}`
    },
    processingHistory: [
      {
        id: `hist-ug-${i + 1}`,
        stage: 'Transcript Request',
        action: 'Transcript request received and processing',
        performedBy: `UG Registrar ${['Adjei', 'Boateng', 'Owusu'][i % 3]}`,
        performedAt: new Date(2024, 5, Math.floor(Math.random() * 30) + 1).toISOString(),
        comments: 'Student records verified',
        duration: 1 + (i % 3)
      }
    ]
  })),

  // KNUST Requests (25)
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `req-knust-${String(i + 1).padStart(3, '0')}`,
    requestId: `#knust-${i + 1}`,
    applicant: [
      'Kwame Nkrumah', 'Akosua Sarpong', 'Kwaku Boateng', 'Efua Asante', 'Kofi Mensah',
      'Ama Osei', 'Kwame Asante', 'Adwoa Mensah', 'Yaw Boateng', 'Akua Adjei',
      'Kwesi Owusu', 'Esi Frimpong', 'Kojo Darko', 'Abena Kumi', 'Kwadwo Amponsah',
      'Adjoa Osei', 'Fiifi Asante', 'Araba Mensah', 'Koku Boateng', 'Aba Adjei',
      'Nana Owusu', 'Ama Frimpong', 'Kofi Darko', 'Akosua Kumi', 'Kwame Amponsah'
    ][i],
    institution_id: 'knust',
    service_id: 'knust_certificate',
    submittedDate: new Date(2024, 5, Math.floor(Math.random() * 30) + 1).toISOString(),
    status: ['Under Review', 'Pending Approval', 'Completed', 'Rejected', 'Submitted'][i % 5] as any,
    risk: i % 4 === 0 ? null : ['On Time', 'At Risk', 'Overdue'][i % 3] as any,
    priority: ['Normal', 'High', 'Urgent', 'Low'][i % 4] as any,
    paymentStatus: ['Paid', 'Pending', 'Failed'][i % 3] as any,
    paymentAmount: 75,
    requesterInfo: {
      name: [
        'Kwame Nkrumah', 'Akosua Sarpong', 'Kwaku Boateng', 'Efua Asante', 'Kofi Mensah',
        'Ama Osei', 'Kwame Asante', 'Adwoa Mensah', 'Yaw Boateng', 'Akua Adjei',
        'Kwesi Owusu', 'Esi Frimpong', 'Kojo Darko', 'Abena Kumi', 'Kwadwo Amponsah',
        'Adjoa Osei', 'Fiifi Asante', 'Araba Mensah', 'Koku Boateng', 'Aba Adjei',
        'Nana Owusu', 'Ama Frimpong', 'Kofi Darko', 'Akosua Kumi', 'Kwame Amponsah'
      ][i],
      email: `student${i + 1}@knust.edu.gh`,
      phone: `+233-${26 + (i % 8)}-${Math.random().toString().substr(2, 7)}`,
      address: ['Kumasi', 'Obuasi', 'Sunyani', 'Techiman', 'Wenchi'][i % 5],
      idNumber: `KNUST-${Math.random().toString().substr(2, 9)}-${i % 10}`
    },
    processingHistory: [
      {
        id: `hist-knust-${i + 1}`,
        stage: 'Certificate Verification',
        action: 'Certificate verification request received',
        performedBy: `KNUST Officer ${['Amponsah', 'Darko', 'Frimpong'][i % 3]}`,
        performedAt: new Date(2024, 5, Math.floor(Math.random() * 30) + 1).toISOString(),
        comments: 'Certificate documents under verification',
        duration: 3 + (i % 4)
      }
    ]
  })),

  // GPS Requests (25)
  ...Array.from({ length: 25 }, (_, i) => ({
    id: `req-gps-${String(i + 1).padStart(3, '0')}`,
    requestId: `#gps-${i + 1}`,
    applicant: [
      'Kwame Boateng', 'Ama Frimpong', 'Kofi Darko', 'Akosua Sarpong', 'Yaw Boateng',
      'Efua Asante', 'Kwaku Boateng', 'Adwoa Mensah', 'Kojo Darko', 'Abena Kumi',
      'Kwesi Owusu', 'Esi Frimpong', 'Fiifi Asante', 'Araba Mensah', 'Koku Boateng',
      'Aba Adjei', 'Nana Owusu', 'Ama Frimpong', 'Kofi Darko', 'Akosua Kumi',
      'Kwame Amponsah', 'Adjoa Osei', 'Emmanuel Nkrumah', 'Grace Adjei', 'David Kusi'
    ][i],
    institution_id: 'gps',
    service_id: 'gps_clearance',
    submittedDate: new Date(2024, 5, Math.floor(Math.random() * 30) + 1).toISOString(),
    status: ['Under Review', 'Pending Approval', 'Completed', 'Rejected', 'Submitted'][i % 5] as any,
    risk: i % 4 === 0 ? null : ['On Time', 'At Risk', 'Overdue'][i % 3] as any,
    priority: ['Normal', 'High', 'Urgent', 'Low'][i % 4] as any,
    paymentStatus: ['Paid', 'Pending', 'Failed'][i % 3] as any,
    paymentAmount: 120,
    requesterInfo: {
      name: [
        'Kwame Boateng', 'Ama Frimpong', 'Kofi Darko', 'Akosua Sarpong', 'Yaw Boateng',
        'Efua Asante', 'Kwaku Boateng', 'Adwoa Mensah', 'Kojo Darko', 'Abena Kumi',
        'Kwesi Owusu', 'Esi Frimpong', 'Fiifi Asante', 'Araba Mensah', 'Koku Boateng',
        'Aba Adjei', 'Nana Owusu', 'Ama Frimpong', 'Kofi Darko', 'Akosua Kumi',
        'Kwame Amponsah', 'Adjoa Osei', 'Emmanuel Nkrumah', 'Grace Adjei', 'David Kusi'
      ][i],
      email: `applicant${i + 1}@police.gov.gh`,
      phone: `+233-${27 + (i % 8)}-${Math.random().toString().substr(2, 7)}`,
      address: ['Accra', 'Kumasi', 'Tamale', 'Cape Coast', 'Takoradi'][i % 5],
      idNumber: `GPS-${Math.random().toString().substr(2, 9)}-${i % 10}`
    },
    processingHistory: [
      {
        id: `hist-gps-${i + 1}`,
        stage: 'Clearance Verification',
        action: 'Police clearance request received and processing',
        performedBy: `GPS Officer ${['Owusu', 'Darko', 'Frimpong'][i % 3]}`,
        performedAt: new Date(2024, 5, Math.floor(Math.random() * 30) + 1).toISOString(),
        comments: 'Background check verified',
        duration: 2 + (i % 4)
      }
    ]
  }))
];

export const masterUsers: MasterUser[] = [
  {
    id: "gtec-admin-01",
    name: "GTEC Administrator",
    email: "admin@gtec.edu.gh",
    role: "GTEC Admin",
    institution_id: "gtec",
    status: "Active",
    lastLogin: "2024-06-25T10:30:00Z",
    avatar: "/GTEC-LOGO-removebg-preview.png"
  },
  {
    id: "ug-admin-01",
    name: "Dr. Nana Aba Appiah Amfo",
    email: "admin@ug.edu.gh",
    role: "Tertiary Institution User",
    institution_id: "ug",
    status: "Active",
    lastLogin: "2024-06-25T09:15:00Z",
    avatar: "/GTEC-LOGO-removebg-preview.png"
  },
  {
    id: "knust-admin-01",
    name: "Prof. Kwasi Obiri-Danso",
    email: "admin@knust.edu.gh",
    role: "Tertiary Institution User",
    institution_id: "knust",
    status: "Active",
    lastLogin: "2024-06-25T08:45:00Z",
    avatar: "/GTEC-LOGO-removebg-preview.png"
  },
  {
    id: "gps-admin-01",
    name: "Superintendent Kofi Owusu",
    email: "admin@police.gov.gh",
    role: "Institution Admin",
    institution_id: "gps",
    status: "Active",
    lastLogin: "2024-06-25T11:00:00Z",
    avatar: "/GTEC-LOGO-removebg-preview.png"
  }
];

// Helper functions to get filtered data
export const getInstitutionRequests = (institutionId: string): MasterRequest[] => {
  return masterRequests.filter(request => request.institution_id === institutionId);
};

export const getInstitutionServices = (institutionId: string): MasterService[] => {
  return masterServices.filter(service => service.institution_id === institutionId);
};

export const getInstitutionUsers = (institutionId: string): MasterUser[] => {
  return masterUsers.filter(user => user.institution_id === institutionId);
};

export const getInstitutionById = (institutionId: string): MasterInstitution | undefined => {
  return masterInstitutions.find(institution => institution.id === institutionId);
};

export const getServiceById = (serviceId: string): MasterService | undefined => {
  return masterServices.find(service => service.id === serviceId);
};

export const getRequestById = (requestId: string): MasterRequest | undefined => {
  return masterRequests.find(request => request.id === requestId);
};

// Statistics helpers
export const getInstitutionStats = (institutionId: string) => {
  const requests = getInstitutionRequests(institutionId);
  const services = getInstitutionServices(institutionId);
  
  return {
    totalRequests: requests.length,
    pendingRequests: requests.filter(r => ['Under Review', 'Pending Approval', 'Submitted'].includes(r.status)).length,
    completedRequests: requests.filter(r => r.status === 'Completed').length,
    rejectedRequests: requests.filter(r => r.status === 'Rejected').length,
    totalServices: services.length,
    successRate: requests.length > 0 ? Math.round((requests.filter(r => r.status === 'Completed').length / requests.length) * 100) : 0,
    avgProcessingTime: '4.2 days',
    overdueRequests: requests.filter(r => r.risk === 'Overdue').length
  };
};

export const getSystemStats = () => {
  return {
    totalInstitutions: masterInstitutions.length,
    totalRequests: masterRequests.length,
    pendingRequests: masterRequests.filter(r => ['Under Review', 'Pending Approval', 'Submitted'].includes(r.status)).length,
    completedRequests: masterRequests.filter(r => r.status === 'Completed').length,
    rejectedRequests: masterRequests.filter(r => r.status === 'Rejected').length,
    totalServices: masterServices.length,
    totalUsers: masterUsers.length,
    slaCompliance: Math.round(((masterRequests.length - masterRequests.filter(r => r.risk === 'Overdue').length) / masterRequests.length) * 100),
    avgFulfillmentTime: '2.1 days',
    rejectionRate: Math.round((masterRequests.filter(r => r.status === 'Rejected').length / masterRequests.length) * 100)
  };
};