# Quick Start Guide

Get the NSQTech application running in 5 minutes!

---

## Prerequisites

Before you begin, ensure you have:

- ✅ Node.js (v18+) installed
- ✅ npm (v9+) installed
- ✅ MongoDB running (local or cloud)
- ✅ Angular CLI installed globally: `npm install -g @angular/cli`

---

## Step-by-Step Setup

### 1. Install MongoDB (if not already installed)

**Option A: Local MongoDB**
```bash
# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# Ubuntu/Debian
sudo apt-get install mongodb
sudo systemctl start mongodb

# Windows
# Download from https://www.mongodb.com/try/download/community
```

**Option B: MongoDB Atlas (Cloud)**
1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string
4. Update `backend/.env` with your connection string

---

### 2. Clone or Download the Project

```bash
# If you have the project in a zip file, extract it
# Or clone from Git (when available)
cd nsqtech-intern-challenge
```

---

### 3. Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment (optional - defaults work for local MongoDB)
# Edit .env file if needed:
nano .env  # or use your preferred editor

# Start the backend server
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
✅ Users created
✅ Records created
🚀 Server is running on port 3000
📍 API URL: http://localhost:3000
```

---

### 4. Setup Frontend (in a new terminal)

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
# Or use: ng serve
```

You should see:
```
✔ Browser application bundle generation complete.
** Angular Live Development Server is listening on localhost:4200 **
```

---

### 5. Access the Application

Open your browser and navigate to:
```
http://localhost:4200
```

---

## Login & Test

### Quick Login Options

**Option 1: Admin User**
1. Click "Admin (admin001)" button on login page
2. Click "Login"

**Option 2: General User**
1. Click "User (user001)" button on login page
2. Click "Login"

**Option 3: Manual Entry**
- User ID: `admin001` or `user001` or `user002` or `user003`
- Password: `Admin@123` for admin, `User@123` for users
- Role: Select matching role

---

## What to Test

### 1. Authentication ✅
- Login with different users
- Logout and login again
- Try invalid credentials (should show error)

### 2. Dashboard Features ✅
- View user details
- See records table
- Notice loading indicators (demonstrating async processing)
- Click refresh button

### 3. Role-Based Access ✅
- **As General User (user001)**:
  - See only records assigned to user001
  - No user management section visible

- **As Admin (admin001)**:
  - See ALL records from all users
  - See "User Management" section
  - View all system users

### 4. Async Processing Demo ✅
- Watch loading spinners when data loads
- Click the info icon to see async delay explanation
- Default delay is 1500ms (1.5 seconds)

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Ensure MongoDB is running
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows
# Start MongoDB service from Services panel
```

**Port 3000 Already in Use**
```bash
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Kill the process using port 3000 or change port in `.env`
```bash
# Find and kill process on macOS/Linux
lsof -ti:3000 | xargs kill -9

# Or change port in backend/.env
PORT=3001
```

### Frontend Issues

**Port 4200 Already in Use**
```bash
Port 4200 is already in use.
```
**Solution:** Use a different port
```bash
ng serve --port 4201
```

**Module Not Found Errors**
```bash
Cannot find module '@angular/core'
```
**Solution:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## API Testing (Optional)

You can test the API directly using curl or Postman:

### Login Request
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "admin001",
    "password": "Admin@123",
    "role": "Admin"
  }'
```

### Get Records (with token)
```bash
# Replace YOUR_TOKEN with the token from login response
curl -X GET "http://localhost:3000/api/records?delay=1500" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Stopping the Application

### Stop Backend
In the backend terminal, press: `Ctrl + C`

### Stop Frontend
In the frontend terminal, press: `Ctrl + C`

### Stop MongoDB
```bash
# macOS
brew services stop mongodb-community

# Linux
sudo systemctl stop mongodb
```

---

## Next Steps

Once you have the application running:

1. ✅ Explore the code structure
2. ✅ Read the full [README.md](README.md) for detailed documentation
3. ✅ Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical details
4. ✅ Test all features thoroughly
5. ✅ Try creating new users (as admin)
6. ✅ Experiment with the API delay parameter

---

## Quick Reference

### Default Credentials

| User ID | Password | Role |
|---------|----------|------|
| admin001 | Admin@123 | Admin |
| user001 | User@123 | General User |
| user002 | User@123 | General User |
| user003 | User@123 | General User |

### Default URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:3000 |
| API Health | http://localhost:3000/health |

### Useful Commands

```bash
# Backend
cd backend
npm run dev          # Start development server
npm run build        # Build TypeScript
npm start            # Start production server

# Frontend
cd frontend
npm start            # Start development server
ng build             # Build for production
ng test              # Run tests

# Both
npm install          # Install dependencies
```

---

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Check console logs for error messages
4. Ensure MongoDB is running
5. Review the full README.md for detailed setup

---

**Happy Testing! 🚀**

*Developed by P.R. ADITHYA for NSQTech Software Intern Application*
