# BacChecker User Guide

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Roles](#user-roles)
3. [Dashboard Overview](#dashboard-overview)
4. [Document Verification](#document-verification)
5. [Managing Templates](#managing-templates)
6. [User Management](#user-management)
7. [Settings & Configuration](#settings--configuration)

## Getting Started

### Logging In
1. Navigate to the BacChecker platform
2. Enter your email and password
3. Click "Sign In"

**Demo Accounts Available:**
- **GTEC Admin**: `admin@gtec.edu.gh` / `password123`
- **University of Ghana**: `admin@ug.edu.gh` / `password123`
- **KNUST**: `admin@knust.edu.gh` / `password123`

### First-Time Setup
If you're logging in for the first time as an institution administrator, you'll be guided through an onboarding process:

1. **Welcome Screen**: Introduction to the platform
2. **Institution Information**: Verify and update your institution details
3. **Branding Setup**: Upload logo and set brand colors
4. **Academic Programs**: Add your courses and programs
5. **Verification Services**: Configure verification services
6. **Review & Launch**: Final review and activation

## User Roles

### GTEC Administrator
- **Purpose**: Oversee tertiary education verification system
- **Access**: Full system oversight for educational institutions
- **Key Functions**:
  - Manage tertiary institutions
  - Process verification requests
  - Generate verification reports
  - Monitor system analytics
  - Manage global templates

### Tertiary Institution User
- **Purpose**: Manage institution profile and process verification requests
- **Access**: Institution-specific dashboard and verification tools
- **Key Functions**:
  - Process incoming verification requests
  - Manage institution courses and programs
  - Upload and manage documents
  - View analytics and reports

### BacChecker System Administrator
- **Purpose**: Full platform administration
- **Access**: Complete system control
- **Key Functions**:
  - Manage all institutions
  - System configuration
  - User management
  - Global settings and templates

## Dashboard Overview

### GTEC Admin Dashboard
- **Verification Queue**: Pending requests requiring GTEC review
- **Institution Overview**: Status of all managed institutions
- **System Metrics**: Performance and usage statistics
- **Recent Activity**: Latest verification activities

### Institution User Dashboard
- **Pending Verifications**: Requests awaiting your institution's response
- **Recent Activities**: Your recent verification actions
- **Performance Metrics**: Your institution's processing statistics
- **Quick Actions**: Common tasks and shortcuts

## Document Verification

### For GTEC Administrators

#### Processing Verification Requests
1. **Access Verification Queue**:
   - Navigate to "Document Verification" from the sidebar
   - View all pending requests in the queue

2. **Review Request Details**:
   - Click on a request to view full details
   - Review student information, program details, and supporting documents
   - Check for any fraud flags or anomalies

3. **Take Action**:
   - **Approve & Forward**: Send request to target institution
   - **Reject**: Reject request with reason
   - **Request More Information**: Ask for additional documentation

4. **Final Approval**:
   - Review institution's response
   - Provide final approval or rejection
   - Generate official verification report

### For Institution Users

#### Responding to Verification Requests
1. **Access Your Queue**:
   - Navigate to "Verifications" or "Document Verification"
   - View requests forwarded by GTEC

2. **Verify Student Records**:
   - Check student information against your records
   - Verify program enrollment and completion
   - Validate graduation dates and academic standing

3. **Provide Response**:
   - **Approve**: Confirm the student's academic credentials
   - **Reject**: Reject with detailed explanation
   - **Request Clarification**: Ask for additional information

### Verification Workflow

```
1. Public Submission → 2. GTEC Review → 3. Institution Verification → 4. Final GTEC Approval → 5. Report Generation
```

**Phase 1: GTEC Initial Review**
- Document completeness check
- Initial fraud screening
- Institution validation

**Phase 2: Institution Verification**
- Student record verification
- Academic credential validation
- Program completion confirmation

**Phase 3: Final Processing**
- Quality assurance review
- Report generation
- Delivery to requester

## Managing Templates

### Document Templates
Templates are used to generate official verification documents.

#### For Institution Users
1. **Access Templates**:
   - Navigate to "Document Templates"
   - View institution-specific and global templates

2. **Use Global Templates**:
   - Browse BacChecker Template Library
   - Click "Use Template" to customize for your institution
   - Modify fields and layout as needed

3. **Create Custom Templates**:
   - Click "Create New Template"
   - Use the visual template builder
   - Add fields, signatures, and QR codes
   - Save and activate template

#### Template Builder Features
- **Drag & Drop Interface**: Easy field placement
- **Field Types**: Text, date, signature, QR code, image
- **Placeholder System**: Dynamic content insertion
- **Preview Mode**: See how documents will look
- **Digital Signatures**: Secure document signing

## User Management

### Adding Users (Institution Administrators)
1. Navigate to "User & Department Management"
2. Click "Add User"
3. Fill in user details:
   - Full name and email
   - Role assignment
   - Department assignment
4. User receives invitation email

### Managing Departments
1. Switch to "Departments" tab
2. Click "Add Department"
3. Configure department details:
   - Department name and description
   - Head of department
   - Department code (optional)

### User Roles Available
- **Institution Admin**: Full institution management
- **Reviewer**: Review and approve requests
- **Processor**: Process and handle requests
- **Data Entry**: Manage registry data

## Settings & Configuration

### Institution Settings
- **Profile Information**: Update institution details
- **Branding**: Customize colors and logos
- **Contact Information**: Update contact details
- **Service Configuration**: Manage offered services

### User Profile Settings
- **Personal Information**: Update name, email, phone
- **Password Management**: Change password securely
- **Notification Preferences**: Configure email and in-app notifications
- **Two-Factor Authentication**: Enable additional security

### System Preferences
- **Theme Customization**: Personalize interface (limited for GTEC institutions)
- **Language Settings**: Interface language preferences
- **Timezone**: Set local timezone for timestamps

## Public Portal Usage

### Submitting Verification Requests
1. **Access Public Portal**: Visit `/public` route
2. **Fill Request Form**:
   - Personal information (name, email, phone)
   - Academic details (institution, program, graduation date)
   - Verification type selection
   - Purpose of verification
3. **Upload Documents**: Supporting academic documents
4. **Submit Request**: Receive confirmation and tracking number

### Checking Request Status
1. **Access Status Portal**: Visit `/check-status`
2. **Enter Information**:
   - Request number OR email address
3. **View Progress**: See current status and timeline
4. **Track Updates**: Receive email notifications

## Best Practices

### For Verification Processing
- **Timely Response**: Process requests within SLA timeframes
- **Thorough Verification**: Verify all details against official records
- **Clear Communication**: Provide detailed reasons for rejections
- **Document Security**: Handle sensitive documents appropriately

### For Institution Management
- **Regular Updates**: Keep institution information current
- **User Training**: Ensure staff understand the platform
- **Security Awareness**: Follow security best practices
- **Backup Procedures**: Maintain data backup protocols

### For System Administration
- **Monitor Performance**: Regular system health checks
- **User Support**: Provide timely assistance to institutions
- **Security Updates**: Keep system security current
- **Data Integrity**: Ensure data accuracy and consistency

## Troubleshooting Common Issues

### Login Problems
- **Forgot Password**: Contact system administrator
- **Account Locked**: Wait 15 minutes or contact support
- **Role Issues**: Verify role assignment with administrator

### Verification Issues
- **Request Not Found**: Check request number spelling
- **Status Not Updating**: Allow 24-48 hours for processing
- **Document Upload Fails**: Check file size and format

### Technical Issues
- **Page Not Loading**: Clear browser cache and cookies
- **Slow Performance**: Check internet connection
- **Feature Not Working**: Try refreshing the page

## Contact Support

### Technical Support
- **Email**: support@bacchecker.gov.gh
- **Phone**: +233-XXX-XXXXXX
- **Hours**: Monday-Friday, 8:00 AM - 5:00 PM GMT

### GTEC Support
- **Email**: verification@gtec.edu.gh
- **Phone**: +233-302-244694
- **Address**: GTEC House, Liberation Road, Accra

### Emergency Support
For critical system issues outside business hours:
- **Emergency Line**: +233-XXX-EMERGENCY
- **Email**: emergency@bacchecker.gov.gh