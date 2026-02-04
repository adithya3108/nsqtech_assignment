# API Documentation

Complete REST API reference for NSQTech Background Verification System

---

## Base URL

```
http://localhost:3000/api
```

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by logging in via `/auth/login` endpoint.

---

## Response Format

All API responses follow this structure:

**Success Response:**
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Endpoints

### Authentication

#### POST /auth/login

Authenticate user and receive JWT token.

**Request Body:**
```json
{
  "userId": "admin001",
  "password": "Admin@123",
  "role": "Admin"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "userId": "admin001",
      "name": "Administrator",
      "email": "admin@nsqtech.com",
      "role": "Admin",
      "department": "IT Operations"
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Invalid credentials or role mismatch

---

#### GET /auth/me

Get current authenticated user's details.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `delay` (optional): Delay in milliseconds (0-5000)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "admin001",
    "name": "Administrator",
    "email": "admin@nsqtech.com",
    "role": "Admin",
    "department": "IT Operations",
    "createdAt": "2025-02-01T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `404 Not Found`: User not found

---

#### POST /auth/logout

Logout user (client-side token removal recommended).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### Records Management

#### GET /records

Get records for current user.
- **Admin users**: See all records
- **General users**: See only their own records

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `delay` (optional): Delay in milliseconds (0-5000)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "recordId": "REC-001",
      "userId": "user001",
      "title": "Background Verification - Tech Corp",
      "description": "Complete background verification for employment",
      "status": "In Progress",
      "priority": "High",
      "category": "Employment Verification",
      "accessLevel": "Private",
      "assignedTo": "user001",
      "createdBy": "user001",
      "metadata": {
        "company": "Tech Corp",
        "position": "Senior Developer"
      },
      "createdAt": "2025-02-01T08:00:00.000Z",
      "updatedAt": "2025-02-01T10:30:00.000Z"
    }
  ],
  "count": 1,
  "userRole": "Admin"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `500 Internal Server Error`: Server error

---

#### GET /records/:recordId

Get specific record by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `delay` (optional): Delay in milliseconds (0-5000)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "recordId": "REC-001",
    "userId": "user001",
    "title": "Background Verification - Tech Corp",
    ...
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Access denied (General user accessing another user's record)
- `404 Not Found`: Record not found

---

#### POST /records

Create a new record.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Employment Verification",
  "description": "Verify employment at XYZ Corporation",
  "category": "Employment Verification",
  "status": "Pending",
  "priority": "High",
  "accessLevel": "Private",
  "assignedTo": "user002",
  "metadata": {
    "company": "XYZ Corp",
    "duration": "2020-2023"
  }
}
```

**Required Fields:**
- `title` (string)
- `description` (string)
- `category` (string)

**Optional Fields:**
- `status`: "Pending" | "In Progress" | "Completed" | "Rejected" (default: "Pending")
- `priority`: "Low" | "Medium" | "High" (default: "Medium")
- `accessLevel`: "Public" | "Private" | "Restricted" (default: "Public")
- `assignedTo` (string)
- `metadata` (object)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Record created successfully",
  "data": {
    "recordId": "REC-1706872635789-k3m9x8y2z",
    "userId": "user001",
    "title": "Employment Verification",
    ...
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Invalid or missing token

---

#### PUT /records/:recordId

Update an existing record.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body** (all fields optional):
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "status": "Completed",
  "priority": "Low",
  "accessLevel": "Public",
  "metadata": { ... }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Record updated successfully",
  "data": {
    "recordId": "REC-001",
    ...
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Access denied
- `404 Not Found`: Record not found

---

#### DELETE /records/:recordId

Delete a record.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Record deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Access denied
- `404 Not Found`: Record not found

---

### User Management (Admin Only)

#### GET /users

Get all users in the system.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `delay` (optional): Delay in milliseconds (0-5000)

**Response (200 OK):**
```json
{
  "success": true,
  "data": [
    {
      "userId": "admin001",
      "name": "Administrator",
      "email": "admin@nsqtech.com",
      "role": "Admin",
      "department": "IT Operations",
      "createdAt": "2025-02-01T00:00:00.000Z",
      "updatedAt": "2025-02-01T00:00:00.000Z"
    }
  ],
  "count": 4
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not an admin user

---

#### GET /users/:userId

Get specific user by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `delay` (optional): Delay in milliseconds (0-5000)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "userId": "user001",
    "name": "John Doe",
    "email": "john.doe@nsqtech.com",
    "role": "General User",
    "department": "Engineering",
    ...
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not an admin user
- `404 Not Found`: User not found

---

#### POST /users

Create a new user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "userId": "user004",
  "password": "User@123",
  "role": "General User",
  "name": "New User",
  "email": "newuser@nsqtech.com",
  "department": "HR"
}
```

**Required Fields:**
- `userId` (string, unique)
- `password` (string, min 6 characters)
- `role`: "Admin" | "General User"
- `name` (string)
- `email` (string, unique)

**Optional Fields:**
- `department` (string)

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "user004",
    "name": "New User",
    "email": "newuser@nsqtech.com",
    "role": "General User",
    "department": "HR"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not an admin user
- `409 Conflict`: User ID or email already exists

---

#### PUT /users/:userId

Update an existing user.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body** (all fields optional):
```json
{
  "name": "Updated Name",
  "email": "updated@nsqtech.com",
  "role": "Admin",
  "department": "Engineering",
  "password": "NewPassword@123"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "userId": "user004",
    "name": "Updated Name",
    ...
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not an admin user
- `404 Not Found`: User not found

---

#### DELETE /users/:userId

Delete a user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400 Bad Request`: Cannot delete your own account
- `401 Unauthorized`: Invalid or missing token
- `403 Forbidden`: Not an admin user
- `404 Not Found`: User not found

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (duplicate resource) |
| 500 | Internal Server Error |

---

## Async Processing Demo

All endpoints support the `delay` query parameter to simulate async processing:

```
GET /api/records?delay=2000
```

This will delay the response by 2000ms (2 seconds), demonstrating:
- Loading states in the UI
- Async data handling
- State management during API calls

**Delay Range:** 0-5000 milliseconds (0-5 seconds)

---

## Example API Calls

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin001",
    "password": "Admin@123",
    "role": "Admin"
  }'
```

**Get Records with Delay:**
```bash
curl -X GET "http://localhost:3000/api/records?delay=1500" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create User:**
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "userId": "user005",
    "password": "User@123",
    "role": "General User",
    "name": "Test User",
    "email": "test@nsqtech.com"
  }'
```

### Using Postman

1. **Import Collection**: Create a new collection in Postman
2. **Set Base URL**: `http://localhost:3000/api`
3. **Add Authorization**: Use Bearer Token type, add token after login
4. **Test Endpoints**: Follow the endpoint documentation above

---

## Rate Limiting

Currently, no rate limiting is implemented. For production, consider:
- API rate limiting (e.g., 100 requests/minute)
- Authentication attempt limiting
- DDoS protection

---

## CORS Configuration

CORS is enabled for:
```
http://localhost:4200 (Angular development server)
```

For production, update `CORS_ORIGIN` in `.env` file.

---

## Best Practices

1. **Always include JWT token** for protected endpoints
2. **Handle errors gracefully** in your client application
3. **Use appropriate HTTP methods** (GET, POST, PUT, DELETE)
4. **Validate input** on both client and server
5. **Use delay parameter** only for testing/demo purposes
6. **Store tokens securely** (avoid localStorage for sensitive apps)

---

## Support

For issues or questions about the API:
- Review the main [README.md](README.md)
- Check [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
- Contact: P.R. ADITHYA

---

**API Version:** 1.0.0  
**Last Updated:** February 2025
