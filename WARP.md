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

## Backend-Frontend Connection

### How to Make API Calls from Frontend

The frontend communicates with the backend using **fetch API** (NOT axios despite it being installed). All API calls follow this pattern:

```js
const res = await fetch("http://localhost:3000/endpoint", {
  method: "POST",  // or GET, PUT, DELETE
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ key: value })  // for POST/PUT only
});

if (!res.ok) {
  const text = await res.text();
  throw new Error(text);
}

const data = await res.json();
```

**Key Points:**
- Backend URL: `http://localhost:3000`
- Always use `Content-Type: application/json` header
- Backend responds with plain text for errors, JSON for success
- Sessions are handled automatically via cookies (no manual token management needed)

### Example: Login Flow

**Frontend** (login.jsx):
```js
const res = await fetch("http://localhost:3000/user/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password })
});
const data = await res.json();
// Session cookie is automatically set by backend
// data.user contains { id, email }
```

**Backend** (account.js):
```js
// Validates credentials, sets session, returns user info
req.session.userId = results[0].iduser;
req.session.email = results[0].email;
req.session.isAuthenticated = true;
res.json({ success: true, message: "Login successful", user: {...} });
```

### Example: User Registration

**Frontend** (register.jsx):
```js
const form = new FormData(e.target);
const name = form.get("name");
const email = form.get("email");
const password = form.get("password");

const res = await fetch("http://localhost:3000/user/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, password })
});
```

**Backend** (account.js):
```js
// Hashes password with bcrypt, inserts into DB
const passwordHash = bcryptjs.hashSync(password, 10);
connection.query("INSERT INTO user (full_name, email, password_hash) VALUES (?, ?, ?)", ...);
```

## Complete API Reference

### Authentication Endpoints
- `POST /user/login`: Login with `{ email, password }` → Returns `{ success, message, user: { id, email } }`
- `POST /user/create`: Register with `{ name, email, password }` → Returns `{ mensaje, alumno }`
- `POST /user/logout`: Destroy session (requires auth) → Returns `{ message }`

### Account Management (All require authentication)
- `PUT /user/change/pass`: Change password with `{ currentPassword, newPassword }`
- `PUT /user/change/email`: Change email with `{ currentEmail, newEmail }`
- `PUT /user/change/name`: Change name with `{ currentName, newName }`
- `DELETE /user/delete`: Delete user account (auto-logout after)

### User Data Endpoints
- `GET /users`: Get all users with courses and lessons (admin use)
- `GET /users/summary`: Get simplified user list `{ id, email, full_name }`
- `GET /user/:id`: Get single user with full details
- `GET /user/:id/progress`: Get user's course progress

### Course Endpoints
- `GET /courses`: Get all courses with lessons and students
- `GET /course/:id`: Get single course with details

### Content Endpoints
- `GET /lessons`: Get all lessons
- `GET /categories`: Get all course categories

## CORS Configuration

Frontend origin is whitelisted: `http://localhost:5173`
Allowed methods: GET, POST, PUT, DELETE

## Recent Changes (as of latest commits)

**Account Management (commit: 753b1c2 "borrar cuenta")**:
- Added account modification endpoints: change password, email, name, and delete account
- All account management routes require authentication via `requireAuth` middleware
- Delete account automatically logs user out after deletion

**Categories Support (commit: 8b5e736 "Obtener categorias")**:
- Added `middlewares/categories.js` with `fetchCategories` and `respondWithCategories`
- New endpoint: `GET /categories` to retrieve all course categories

**Login & Registration UI (commits: c31a47b, 03ff8e4)**:
- Implemented complete login page with validation, error handling, and accessibility features
- Registration page created with fetch API integration
- Both pages use native fetch API, not axios
- Form validation happens client-side before sending to backend

## Development Notes

- Backend uses CommonJS modules (`require`/`module.exports`)
- Frontend uses ES6 modules (`import`/`export`)
- Password hashing uses bcryptjs with salt rounds of 10
- Database queries use callback-based mysql2 API
- Frontend uses React 19+ with modern patterns
- No TypeScript - pure JavaScript on both frontend and backend
- **Use native fetch API for HTTP requests**, not axios (despite axios being in dependencies)
