# Architecture Documentation

## System Architecture Overview

This document provides a detailed explanation of the architectural decisions and design patterns used in the NSQTech Background Verification System.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Data Flow](#data-flow)
5. [Security Architecture](#security-architecture)
6. [Design Patterns](#design-patterns)

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │         Angular SPA (Port 4200)                 │    │
│  │                                                 │    │
│  │  ├── Login Component                           │    │
│  │  ├── Dashboard Component                       │    │
│  │  ├── Auth Service                              │    │
│  │  ├── User Service                              │    │
│  │  ├── Record Service                            │    │
│  │  └── HTTP Interceptor                          │    │
│  └────────────────────────────────────────────────┘    │
│                        │                                 │
│                        │ HTTP/REST API                   │
│                        │ (JSON + JWT)                    │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              Node.js/Express Server (Port 3000)         │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │              API Routes                         │    │
│  │  ├── /api/auth/*     (Authentication)          │    │
│  │  ├── /api/users/*    (User Management)         │    │
│  │  └── /api/records/*  (Records Management)      │    │
│  └────────────────────────────────────────────────┘    │
│                        │                                 │
│  ┌────────────────────────────────────────────────┐    │
│  │            Middleware Layer                     │    │
│  │  ├── Auth Middleware (JWT Verification)        │    │
│  │  ├── Delay Middleware (Async Demo)             │    │
│  │  └── Error Handler                             │    │
│  └────────────────────────────────────────────────┘    │
│                        │                                 │
│  ┌────────────────────────────────────────────────┐    │
│  │           Controllers Layer                     │    │
│  │  ├── AuthController                            │    │
│  │  ├── UserController                            │    │
│  │  └── RecordController                          │    │
│  └────────────────────────────────────────────────┘    │
│                        │                                 │
│  ┌────────────────────────────────────────────────┐    │
│  │          Models/Schemas Layer                   │    │
│  │  ├── User Model (Mongoose)                     │    │
│  │  └── Record Model (Mongoose)                   │    │
│  └────────────────────────────────────────────────┘    │
└────────────────────────┼─────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              MongoDB Database                            │
│                                                          │
│  ├── users collection                                   │
│  └── records collection                                 │
└─────────────────────────────────────────────────────────┘
```

---

## Frontend Architecture

### Component-Based Architecture

The frontend follows Angular's component-based architecture with clear separation of concerns:

```
app/
├── core/                    # Singleton services, guards, interceptors
│   ├── services/
│   │   ├── auth.service.ts      # Authentication logic
│   │   ├── user.service.ts      # User management
│   │   └── record.service.ts    # Records management
│   ├── guards/
│   │   └── auth.guard.ts        # Route protection
│   └── interceptors/
│       └── auth.interceptor.ts  # HTTP request/response handling
│
├── features/                # Feature modules
│   ├── login/
│   │   ├── login.component.ts
│   │   ├── login.component.html
│   │   └── login.component.scss
│   └── dashboard/
│       ├── dashboard.component.ts
│       ├── dashboard.component.html
│       └── dashboard.component.scss
│
└── app.module.ts           # Root module
```

### State Management

- **Services as State Stores**: Services use BehaviorSubject for reactive state
- **Observable Streams**: RxJS for async data flow
- **Local Storage**: Token and user persistence

### Routing Strategy

```typescript
const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];
```

---

## Backend Architecture

### Layered Architecture

The backend follows a clean layered architecture:

1. **Routes Layer**: Defines API endpoints and maps to controllers
2. **Middleware Layer**: Authentication, validation, async simulation
3. **Controller Layer**: Business logic and request/response handling
4. **Service Layer**: (Could be added) Reusable business logic
5. **Model Layer**: Data schemas and database interaction

### Request Flow

```
HTTP Request
    ↓
Express Router
    ↓
Middleware Chain
    ├── CORS Handler
    ├── Body Parser
    ├── Auth Middleware (if protected)
    └── Delay Middleware (if ?delay param)
    ↓
Controller
    ├── Validate Input
    ├── Business Logic
    └── Database Operations
    ↓
HTTP Response
```

### Database Schema Design

#### User Schema
```javascript
{
  userId: String (unique, required),
  password: String (hashed, required),
  role: Enum['Admin', 'General User'] (required),
  name: String (required),
  email: String (unique, required),
  department: String (optional),
  timestamps: true
}
```

#### Record Schema
```javascript
{
  recordId: String (unique, required),
  userId: String (ref: User, required),
  title: String (required),
  description: String (required),
  status: Enum['Pending', 'In Progress', 'Completed', 'Rejected'],
  priority: Enum['Low', 'Medium', 'High'],
  category: String (required),
  accessLevel: Enum['Public', 'Private', 'Restricted'],
  assignedTo: String (ref: User, optional),
  createdBy: String (ref: User, required),
  metadata: Mixed (optional),
  timestamps: true
}
```

---

## Data Flow

### Authentication Flow

```
1. User enters credentials → Login Component
2. Login Component → Auth Service.login()
3. Auth Service → POST /api/auth/login
4. Backend validates credentials → Generate JWT
5. JWT returned to frontend
6. Auth Service stores token in localStorage
7. Auth Service updates currentUser$ BehaviorSubject
8. Router navigates to dashboard
9. Auth Guard checks authentication
10. Dashboard loads with protected data
```

### Data Loading Flow

```
1. Dashboard Component ngOnInit()
2. Call RecordService.getRecords(delay)
3. HTTP Interceptor adds JWT token
4. Delay Middleware simulates async processing
5. Auth Middleware verifies JWT
6. RecordController.getRecords()
7. Query MongoDB based on user role
8. Return records to frontend
9. Dashboard updates view with loading states
10. Display records in table
```

---

## Security Architecture

### Authentication & Authorization

1. **JWT-Based Authentication**
   - Stateless token-based auth
   - Token stored in localStorage
   - Automatic token injection via HTTP interceptor

2. **Password Security**
   - Bcrypt hashing (10 salt rounds)
   - Pre-save hooks for automatic hashing
   - Never expose passwords in responses

3. **Role-Based Access Control (RBAC)**
   - Admin: Full access to all features
   - General User: Limited to own data
   - Server-side validation of permissions

4. **API Security**
   - JWT verification middleware
   - Request validation
   - Error message sanitization
   - CORS configuration

### Security Best Practices Implemented

✅ Password hashing with bcrypt
✅ JWT token expiration (24h)
✅ HTTP-only authentication
✅ Route guards on frontend
✅ Middleware authorization on backend
✅ Input validation and sanitization
✅ Secure error handling (no stack traces in production)

---

## Design Patterns

### Frontend Patterns

1. **Dependency Injection**: Angular's DI system for services
2. **Observer Pattern**: RxJS Observables for async operations
3. **Guard Pattern**: Route protection with AuthGuard
4. **Interceptor Pattern**: HTTP request/response manipulation
5. **Service Layer Pattern**: Business logic separation

### Backend Patterns

1. **MVC Pattern**: Models, Controllers, Routes separation
2. **Middleware Pattern**: Request processing chain
3. **Repository Pattern**: Mongoose models as data repositories
4. **Factory Pattern**: Model creation and validation
5. **Singleton Pattern**: Database connection

### Code Organization Patterns

1. **Single Responsibility**: Each file has one clear purpose
2. **DRY (Don't Repeat Yourself)**: Reusable services and utilities
3. **Separation of Concerns**: Clear layer boundaries
4. **Convention over Configuration**: Standard naming and structure

---

## Performance Considerations

### Frontend Optimization

- **Lazy Loading**: Potential for module lazy loading
- **Change Detection**: OnPush strategy potential
- **RxJS Operators**: Proper use of takeUntil for subscription cleanup
- **Bundle Size**: Tree shaking and minification

### Backend Optimization

- **Database Indexing**: Indexed fields for faster queries
- **Connection Pooling**: Mongoose connection management
- **Query Optimization**: Efficient MongoDB queries
- **Response Caching**: Potential for Redis integration

---

## Scalability Considerations

### Horizontal Scalability

- Stateless JWT authentication (no session storage)
- Database can be replicated/sharded
- Load balancer compatible

### Vertical Scalability

- Modular code structure
- Clear separation of concerns
- Easy to add new features

---

## Development Workflow

### Development Process

1. **Backend First**: Develop and test API endpoints
2. **Frontend Integration**: Connect Angular services to API
3. **UI Development**: Build components and styling
4. **Testing**: Manual and automated testing
5. **Documentation**: Code comments and README

### Environment Configuration

- **Development**: Local MongoDB, hot reload
- **Production**: Environment variables, optimized builds

---

## Monitoring & Logging

### Current Implementation

- Console logging for requests
- Error logging in try-catch blocks
- Client-side error handling

### Production Recommendations

- Structured logging (Winston, Morgan)
- Error tracking (Sentry)
- Performance monitoring (New Relic, Datadog)
- Database query logging

---

## Conclusion

This architecture provides a solid foundation for a production-ready application with:

✅ Clean, maintainable code structure
✅ Security best practices
✅ Scalable design
✅ Professional development patterns
✅ Comprehensive documentation

The modular design allows for easy extension and modification as requirements evolve.
