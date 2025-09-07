# BacChecker API Documentation

## Overview

The BacChecker API provides programmatic access to verification services, document validation, and registry data. All API endpoints require authentication and follow RESTful conventions.

## Authentication

### API Key Authentication
All API requests must include an API key in the Authorization header:

```http
Authorization: Bearer YOUR_API_KEY
```

### Obtaining API Keys
1. Log in to your institution dashboard
2. Navigate to "API & Validation"
3. Click "Generate API Key"
4. Configure permissions and rate limits
5. Copy and securely store your API key

## Base URL

```
Production: https://api.bacchecker.gov.gh/v1
Development: http://localhost:3000/api/v1
```

## Endpoints

### Document Verification

#### Verify Document
Verify the authenticity of a document by its ID.

```http
GET /documents/{document_id}/verify
```

**Parameters:**
- `document_id` (string): Unique document identifier

**Response:**
```json
{
  "valid": true,
  "document": {
    "id": "GPS-PC-2024-12345",
    "type": "Police Clearance Certificate",
    "holder": "John Doe",
    "issueDate": "2024-01-20",
    "expiryDate": "2025-01-20",
    "status": "Valid",
    "issuer": "Ghana Police Service"
  },
  "verification": {
    "timestamp": "2024-06-30T10:30:00Z",
    "method": "QR_CODE",
    "confidence": 95
  }
}
```

#### Bulk Document Verification
Verify multiple documents in a single request.

```http
POST /documents/verify/bulk
```

**Request Body:**
```json
{
  "documents": [
    "GPS-PC-2024-12345",
    "HCG-CR-2024-67890",
    "MOE-AC-2024-11111"
  ]
}
```

### Registry Access

#### Search Registry
Search records in a specific registry.

```http
GET /registry/{registry_id}/search
```

**Parameters:**
- `registry_id` (string): Registry identifier
- `query` (string): Search query
- `limit` (integer): Maximum results (default: 50)
- `offset` (integer): Pagination offset (default: 0)

**Example:**
```http
GET /registry/criminal-records/search?query=GHA-123456789&limit=10
```

**Response:**
```json
{
  "results": [
    {
      "id": "record-123",
      "fullName": "John Doe",
      "idNumber": "GHA-123456789",
      "status": "Clean Record",
      "lastUpdated": "2024-06-30T10:30:00Z"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### Verification Requests

#### Submit Verification Request
Submit a new verification request programmatically.

```http
POST /verification/requests
```

**Request Body:**
```json
{
  "student_name": "John Doe",
  "student_id": "UG123456",
  "target_institution_id": "ug-uuid",
  "program_name": "Bachelor of Science in Computer Science",
  "graduation_date": "2023-06-15",
  "verification_type": "academic_transcript",
  "priority_level": "normal",
  "metadata": {
    "purpose": "Employment verification",
    "applicant_email": "john.doe@email.com",
    "applicant_phone": "+233-XXX-XXXXXX"
  }
}
```

#### Get Request Status
Check the status of a verification request.

```http
GET /verification/requests/{request_id}/status
```

**Response:**
```json
{
  "request_number": "VER-12345678",
  "status": "institution_approved",
  "current_phase": 3,
  "progress_percentage": 75,
  "estimated_completion": "2024-07-05T15:00:00Z",
  "last_updated": "2024-07-02T14:30:00Z"
}
```

### Institution Management

#### Get Institution Information
Retrieve detailed information about an institution.

```http
GET /institutions/{institution_id}
```

**Response:**
```json
{
  "id": "ug-uuid",
  "name": "University of Ghana",
  "acronym": "UG",
  "type": "university",
  "accreditation_status": "Fully Accredited",
  "contact": {
    "email": "admin@ug.edu.gh",
    "phone": "+233-302-500381",
    "address": "University of Ghana, Legon, Accra"
  },
  "statistics": {
    "student_population": 38000,
    "faculty_count": 1200,
    "programs_offered": 156
  },
  "verification_services": [
    "academic_transcript",
    "certificate_verification",
    "degree_verification"
  ]
}
```

#### List Institutions
Get a list of all institutions or filter by type.

```http
GET /institutions?type=university&status=active
```

### Analytics

#### Get System Statistics
Retrieve platform-wide statistics.

```http
GET /analytics/system/stats
```

**Response:**
```json
{
  "total_institutions": 25,
  "total_requests": 15847,
  "completed_requests": 14203,
  "pending_requests": 1644,
  "success_rate": 89.6,
  "average_processing_time": "4.2 days",
  "sla_compliance": 94.2
}
```

#### Get Institution Analytics
Retrieve analytics for a specific institution.

```http
GET /analytics/institutions/{institution_id}
```

## Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Rate Limit Exceeded
- `500` - Internal Server Error

### Error Response Format
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "The request is missing required parameters",
    "details": {
      "missing_fields": ["student_name", "program_name"]
    },
    "timestamp": "2024-06-30T10:30:00Z",
    "request_id": "req-123456"
  }
}
```

## Rate Limiting

### Default Limits
- **Standard API Key**: 1,000 requests/hour
- **Premium API Key**: 5,000 requests/hour
- **System API Key**: 10,000 requests/hour

### Rate Limit Headers
```http
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1625097600
```

## Webhooks

### Webhook Events
Configure webhooks to receive real-time notifications:

- `verification.completed` - Verification request completed
- `verification.rejected` - Verification request rejected
- `document.verified` - Document verification completed
- `fraud.detected` - Fraud pattern detected

### Webhook Configuration
```http
POST /webhooks
```

**Request Body:**
```json
{
  "url": "https://your-app.com/webhooks/bacchecker",
  "events": ["verification.completed", "verification.rejected"],
  "secret": "your-webhook-secret"
}
```

## SDK and Libraries

### JavaScript/TypeScript SDK
```bash
npm install @bacchecker/sdk
```

```javascript
import { BacCheckerClient } from '@bacchecker/sdk';

const client = new BacCheckerClient({
  apiKey: 'your-api-key',
  environment: 'production' // or 'sandbox'
});

// Verify a document
const result = await client.documents.verify('GPS-PC-2024-12345');

// Submit verification request
const request = await client.verification.submit({
  student_name: 'John Doe',
  target_institution_id: 'ug-uuid',
  program_name: 'Computer Science',
  verification_type: 'academic_transcript'
});
```

### Python SDK
```bash
pip install bacchecker-python
```

```python
from bacchecker import BacCheckerClient

client = BacCheckerClient(
    api_key='your-api-key',
    environment='production'
)

# Verify document
result = client.documents.verify('GPS-PC-2024-12345')

# Submit verification request
request = client.verification.submit(
    student_name='John Doe',
    target_institution_id='ug-uuid',
    program_name='Computer Science',
    verification_type='academic_transcript'
)
```

## Testing

### Sandbox Environment
Use the sandbox environment for testing:

```
Sandbox URL: https://sandbox-api.bacchecker.gov.gh/v1
```

### Test Data
The sandbox includes test institutions and sample data:

- **Test Institution IDs**: `test-ug`, `test-knust`, `test-gps`
- **Test Document IDs**: `TEST-DOC-12345`, `TEST-CERT-67890`
- **Test Student Records**: Available for verification testing

### API Testing Tools
- **Postman Collection**: Available for download
- **OpenAPI Specification**: Swagger documentation
- **cURL Examples**: Command-line testing examples

## Best Practices

### Security
- **Secure API Key Storage**: Never expose API keys in client-side code
- **HTTPS Only**: Always use HTTPS for API requests
- **Input Validation**: Validate all input data
- **Error Handling**: Implement proper error handling

### Performance
- **Caching**: Cache frequently accessed data
- **Pagination**: Use pagination for large result sets
- **Rate Limiting**: Respect rate limits and implement backoff
- **Compression**: Use gzip compression for large payloads

### Integration
- **Webhook Reliability**: Implement webhook retry logic
- **Idempotency**: Handle duplicate requests gracefully
- **Monitoring**: Monitor API usage and performance
- **Documentation**: Keep integration documentation updated

## Support

### API Support
- **Email**: api-support@bacchecker.gov.gh
- **Documentation**: https://docs.bacchecker.gov.gh
- **Status Page**: https://status.bacchecker.gov.gh

### Developer Resources
- **GitHub**: Sample code and SDKs
- **Community Forum**: Developer discussions
- **Changelog**: API updates and changes
- **Migration Guides**: Version upgrade assistance