# NSQTech Background Verification System

**Developer:** P.R. ADITHYA  
**Position:** Software Intern Application  
**Submission Date:** February 2025

---

## 📋 Project Overview

This is a comprehensive Single Page Application (SPA) built with **Angular 16** and **Node.js/TypeScript** backend, showcasing modern web development practices, clean architecture, and professional UI/UX design for NSQTech's background verification system.

### Key Features

✅ **Authentication System**
- Secure JWT-based authentication
- Role-based access control (Admin & General User)
- Protected routes with guards

✅ **User Management** (Admin Only)
- Create, read, update, and delete users
- View all system users
- Role assignment and management

✅ **Records Management**
- Role-based record access (Admin sees all, Users see their own)
- Comprehensive record details with status, priority, and access levels
- Real-time data visualization in tables

✅ **Async Processing Demo**
- Configurable API delay parameter to showcase async operations
- Loading states and indicators
- Proper error handling

✅ **Modern UI/UX**
- Clean, professional design
- Responsive layout (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive user experience

---

## 🏗️ Architecture

### Frontend (Angular 16+)

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/           # Route protection
│   │   │   ├── interceptors/     # HTTP interceptors
│   │   │   └── services/         # Business logic services
│   │   ├── features/
│   │   │   ├── login/           # Login component
│   │   │   └── dashboard/       # Dashboard component
│   │   ├── app.module.ts        # Root module
│   │   └── app-routing.module.ts # Routing configuration
│   ├── environments/             # Environment configs
│   └── styles.scss              # Global styles
```

**Key Architectural Decisions:**

1. **Modular Structure**: Separation of concerns with core, features, and shared modules
2. **Service Layer**: Centralized business logic and API communication
3. **Reactive Programming**: RxJS for async operations and state management
4. **Type Safety**: Full TypeScript implementation
5. **Guards & Interceptors**: Security and HTTP request/response handling

### Backend (Node.js + TypeScript)

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts          # MongoDB connection & seeding
│   ├── controllers/
│   │   ├── auth.controller.ts   # Authentication logic
│   │   ├── user.controller.ts   # User management
│   │   └── record.controller.ts # Records management
│   ├── middleware/
│   │   ├── auth.middleware.ts   # JWT verification
│   │   └── delay.middleware.ts  # Async simulation
│   ├── models/
│   │   ├── User.model.ts        # User schema
│   │   └── Record.model.ts      # Record schema
│   ├── routes/
│   │   └── api.routes.ts        # API endpoints
│   └── server.ts                # Express server
```

**Key Architectural Decisions:**

1. **MVC Pattern**: Clear separation of models, controllers, and routes
2. **Middleware Chain**: Authentication, validation, and delay simulation
3. **MongoDB/Mongoose**: NoSQL database with schema validation
4. **JWT Authentication**: Stateless authentication mechanism
5. **Environment Configuration**: Secure configuration management

---

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- MongoDB (v6 or higher) - Local or cloud instance
- Angular CLI (v16)

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MongoDB URI
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nsqtech
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:4200

# Build TypeScript
npm run build

# Start the server (development)
npm run dev

# Or start production build
npm start
```

The backend will automatically:
- Connect to MongoDB
- Create database collections
- Seed initial data (users and records)
- Start listening on http://localhost:3000

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
# Or
ng serve

# Build for production
npm run build
```

The frontend will be available at http://localhost:4200

---

## 🔐 Demo Credentials

### Admin User
- **User ID:** `admin001`
- **Password:** `Admin@123`
- **Role:** Admin

### General Users
- **User ID:** `user001` | **Password:** `User@123` | **Role:** General User
- **User ID:** `user002` | **Password:** `User@123` | **Role:** General User
- **User ID:** `user003` | **Password:** `User@123` | **Role:** General User

---

## 📡 API Documentation

### Base URL: `http://localhost:3000/api`

### Authentication Endpoints

#### POST `/auth/login`
Login user and receive JWT token

**Request Body:**
```json
{
  "userId": "admin001",
  "password": "Admin@123",
  "role": "Admin"
}
```

**Response:**
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

#### GET `/auth/me`
Get current user details (requires authentication)

**Headers:** `Authorization: Bearer <token>`

**Query Parameters:**
- `delay` (optional): Milliseconds to delay response (0-5000)

### User Management Endpoints (Admin Only)

#### GET `/users?delay=1500`
Get all users

#### GET `/users/:userId?delay=1500`
Get user by ID

#### POST `/users`
Create new user

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

#### PUT `/users/:userId`
Update user

#### DELETE `/users/:userId`
Delete user

### Records Endpoints

#### GET `/records?delay=1500`
Get records (Admin: all records, User: own records only)

#### GET `/records/:recordId?delay=1500`
Get record by ID

#### POST `/records`
Create new record

**Request Body:**
```json
{
  "title": "Employment Verification",
  "description": "Verify employment at XYZ Corp",
  "category": "Employment Verification",
  "status": "Pending",
  "priority": "High",
  "accessLevel": "Private"
}
```

#### PUT `/records/:recordId`
Update record

#### DELETE `/records/:recordId`
Delete record

---

## 🎨 UI Features

### Login Page
- Clean, modern design with gradient background
- Form validation with error messages
- Quick login buttons for demo credentials
- Responsive design for all screen sizes

### Dashboard
- **User Details Card**: Displays current user information
- **Records Table**: Shows verification records with:
  - Status badges (Pending, In Progress, Completed, Rejected)
  - Priority badges (Low, Medium, High)
  - Access level badges (Public, Private, Restricted)
  - Formatted dates
  - Role-based filtering
- **User Management Table** (Admin only):
  - All system users
  - Role indicators
  - User details

### Async Processing Demo
- Configurable API delay via query parameter
- Loading overlays with spinners
- Info banner explaining the async simulation
- Smooth state transitions

---

## 🔧 Technical Highlights

### Frontend

1. **Reactive Forms**: Form validation and error handling
2. **HTTP Interceptors**: Automatic JWT token injection
3. **Route Guards**: Protected routes based on authentication
4. **RxJS Operators**: Proper async handling with observables
5. **Type Safety**: Complete TypeScript coverage
6. **SCSS Styling**: Modern, maintainable stylesheets
7. **Responsive Design**: Mobile-first approach

### Backend

1. **TypeScript**: Full type safety on backend
2. **Mongoose Models**: Schema validation and pre-save hooks
3. **Bcrypt**: Secure password hashing
4. **JWT**: Token-based authentication
5. **Express Middleware**: Modular request handling
6. **Error Handling**: Comprehensive error responses
7. **Database Seeding**: Automatic test data generation

---

## 🎯 Code Quality

### Best Practices Implemented

✅ **Clean Code Architecture**
- Single Responsibility Principle
- Dependency Injection
- Service Layer Pattern
- DRY (Don't Repeat Yourself)

✅ **Security**
- Password hashing with bcrypt
- JWT token validation
- HTTP-only authentication
- Input validation
- SQL injection prevention (NoSQL)

✅ **Performance**
- Lazy loading potential
- Efficient database queries with indexes
- Minimal bundle size
- Optimized change detection

✅ **Maintainability**
- Comprehensive comments
- Consistent naming conventions
- Modular file structure
- Environment-based configuration

---

## 📊 Features Demonstration

### 1. Login System
- Select role (Admin/General User)
- Enter credentials
- JWT token stored in localStorage
- Automatic redirection to dashboard

### 2. Role-Based Access
**General User:**
- See only their own records
- Cannot access user management
- Limited to personal data

**Admin:**
- See all records from all users
- Access user management features
- Full system visibility

### 3. Async Processing
- API calls include configurable delay (default: 1500ms)
- Loading indicators show during data fetch
- Demonstrates proper state management
- Shows real-world async behavior

### 4. User Management (Admin)
- View all users in system
- Create new users
- Update existing users
- Delete users (cannot delete self)

---

## 🧪 Testing the Application

### Test Scenarios

1. **Login Flow**
   - Try invalid credentials → See error message
   - Login as General User → Access dashboard with limited records
   - Login as Admin → Access all features

2. **Role-Based Access**
   - Login as `user001` → See only records for user001
   - Login as `admin001` → See all records + user management

3. **Async Processing**
   - Watch loading indicators on page load
   - Click refresh button to reload data
   - Observe smooth state transitions

4. **Responsive Design**
   - Resize browser window
   - Test on mobile device
   - Verify layout adapts properly

---

## 🚧 Future Enhancements

Potential improvements for production:

1. **Advanced Features**
   - Real-time notifications
   - File upload for verification documents
   - Advanced search and filtering
   - Export to PDF/Excel
   - Audit logs

2. **Technical Improvements**
   - Unit and E2E tests
   - CI/CD pipeline
   - Docker containerization
   - Redis caching
   - GraphQL API option

3. **UI/UX Enhancements**
   - Dark mode
   - Customizable themes
   - Advanced data visualizations
   - Drag-and-drop interfaces

---

## 📝 Assignment Requirements Checklist

✅ **Login Page**
- User ID field
- Password field
- Role selection (General User / Admin)
- Dummy API with storage (MongoDB)

✅ **Logged In Page**
- User details display
- API call to fetch records
- Table format display
- Access level based on role

✅ **Admin Features**
- User management mechanism
- View all users
- Create/Edit/Delete users

✅ **Async Processing**
- Delay parameter in API
- Loading states
- Async processing demonstration

✅ **Code Quality**
- Modularized code structure
- Service layer implementation
- Clean architecture
- Creative design
- Professional UI/UX

---

## 👨‍💻 Developer Notes

This application was built from scratch without copying GitHub code. It demonstrates:

- Deep understanding of Angular framework and lifecycle
- Proficiency in TypeScript and modern JavaScript
- RESTful API design principles
- Security best practices
- Clean code and architecture
- Professional UI/UX design skills
- Full-stack development capabilities

Every component, service, and API endpoint was thoughtfully designed to showcase real-world development skills applicable to the Software Intern position at NSQTech.

---

## 📧 Contact

**Developer:** P.R. ADITHYA  
**Email:**adithyapr3104@gmail.com
**Submission For:** NSQTech Private Limited - Software Intern Position

---

## 📄 License

This project is submitted as part of a code challenge for NSQTech Private Limited.

© 2025 P.R. ADITHYA. All rights reserved.
