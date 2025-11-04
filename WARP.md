# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

HoloLearn is a learning management system with a React + Vite frontend and Express.js backend, using MySQL for data persistence. The application handles user authentication, course management, lessons, and student progress tracking.

## Project Structure

This is a monorepo with two main directories:
- **frontend/**: React + Vite application with routing and component-based architecture
- **backend/**: Express.js REST API with middleware-based architecture

## Development Commands

### Backend (from `backend/` directory)
```powershell
npm start                 # Start the server (production mode)
node server.js            # Alternative start command
```

The backend runs on `http://localhost:3000`

### Frontend (from `frontend/` directory)
```powershell
npm run dev              # Start Vite dev server with HMR
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

The frontend dev server runs on `http://localhost:5173`

## Database Setup

The backend connects to a MySQL database named `hololearn`. Database credentials are in `backend/connection.js`:
- Host: localhost
- User: root
- Password: (see connection.js)
- Database: hololearn

**Database Tables:**
- `user`: User accounts with authentication
- `courses`: Course information with instructor references
- `lessons`: Course content organized by lesson_order
- `enrollments`: Many-to-many relationship between users and courses with enrollment status
- `lesson_progress`: Tracks student progress through lessons
- `categories`: Course categorization
- `course_categories`: Many-to-many relationship between courses and categories

## Architecture Patterns

### Backend Architecture

**Middleware Chain Pattern**: The backend uses a functional middleware architecture where each route composes multiple middleware functions that progressively build up the response data.

Example pattern:
```js
app.get('/endpoint',
  fetchData,           // Query DB, attach to req
  enrichData,          // Add related data
  transformData,       // Format/transform
  respondWithData      // Send JSON response
);
```

**Key Middleware Files:**
- `middlewares/account.js`: Authentication (login, logout, createUser, requireAuth)
- `middlewares/users.js`: User list operations with course/lesson attachment
- `middlewares/user.js`: Single user operations and progress tracking
- `middlewares/courses.js`: Course operations with lesson/student attachment
- `middlewares/lessons.js`: Lesson queries

**Class Models** (`backend/classes/`):
- `classUser.js`: User domain object with courses array
- `classCourse.js`: Course domain object with lessons and students arrays
- `classLesson.js`: Lesson domain object

**Data Enrichment Pattern**: Middleware functions fetch base data, then subsequent middleware attach related entities (e.g., `attachCoursesToUser`, `attachLessonsToUser`) using Promises to handle async operations.

### Frontend Architecture

**React Router Structure**: Single-page application using react-router-dom with a Layout wrapper component for consistent UI across pages.

**Pages** (`frontend/src/pages/`):
- `home.jsx`: Landing page
- `courses.jsx`: Course listing
- `about.jsx`: About information
- `login.jsx`: User login
- `register.jsx`: User registration

**API Communication**: Uses Axios for HTTP requests to backend at `http://localhost:3000`

## Session Management

Express-session is configured with:
- Secret: "secretkey123" (should be environment variable in production)
- Cookie max age: 24 hours
- Secure: false (set to true with HTTPS in production)

Sessions store: `userId`, `email`, `isAuthenticated`

Protected routes use `requireAuth` middleware.

## Key API Endpoints

**Authentication:**
- `POST /user/login`: Login with email/password (bcrypt validation)
- `POST /user/create`: Register new user
- `POST /user/logout`: Destroy session (requires auth)

**Users:**
- `GET /users`: Get all users with courses and lessons
- `GET /users/summary`: Get simplified user list
- `GET /user/:id`: Get single user with full details
- `GET /user/:id/progress`: Get user's course progress

**Courses:**
- `GET /course`: Get all courses with lessons and students
- `GET /course/:id`: Get single course with details

**Lessons:**
- `GET /lessons`: Get all lessons

## CORS Configuration

Frontend origin is whitelisted: `http://localhost:5173`
Allowed methods: GET, POST, PUT, DELETE

## Development Notes

- Backend uses CommonJS modules (`require`/`module.exports`)
- Frontend uses ES6 modules (`import`/`export`)
- Password hashing uses bcryptjs with salt rounds of 10
- Database queries use callback-based mysql2 API
- Frontend uses React 19+ with modern patterns
- No TypeScript - pure JavaScript on both frontend and backend
