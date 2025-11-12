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
- `middlewares/account.js`: Authentication (login, logout, createUser, requireAuth) and profile management
- `middlewares/users.js`: User list operations with course/lesson attachment
- `middlewares/user.js`: Single user operations, progress tracking, **course enrollment, and lesson completion**
- `middlewares/courses.js`: Course operations with lesson/student attachment
- `middlewares/lessons.js`: Lesson queries
- `middlewares/categories.js`: Category queries

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

Sessions store: `userId`, `email`, `isAuthenticated`, `userData` (for enriched user data)

Protected routes use `requireAuth` middleware. Authentication is verified by checking `req.session.isAuthenticated`.

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

### Example: Subscribe to Course

**Frontend**:
```js
// User must be authenticated (session cookie will be sent automatically)
const courseId = 5;
const res = await fetch(`http://localhost:3000/user/subscribe/${courseId}`, {
  method: "POST",
  credentials: "include"  // Important: includes session cookie
});

if (!res.ok) {
  const text = await res.text();
  // Could be: "Already enrolled", "Course not found", etc.
  throw new Error(text);
}

const data = await res.json();
// { message: "Successfully subscribed to course" }
```

**Backend** (user.js `subscribeToCourse`):
```js
// Gets userId from session automatically
const userId = req.session.userId;  // Set during login
const { courseId } = req.params;

// Validates: course exists, user not already enrolled
// Then inserts: INSERT INTO enrollments (iduser, idcourses, status) VALUES (?, ?, 'active')
```

### Example: Complete Lesson

**Frontend**:
```js
const courseId = 5;
const lessonId = 12;

const res = await fetch(`http://localhost:3000/user/complete-lesson/${courseId}/${lessonId}`, {
  method: "POST",
  credentials: "include"
});

const data = await res.json();
// { message: "Lesson marked as completed", alreadyCompleted: false }
// OR { message: "Lesson already completed", alreadyCompleted: true }
```

**Backend** (user.js `completeLesson`):
```js
// 1. Gets userId from session
// 2. Finds enrollment: SELECT idenrollments FROM enrollments WHERE iduser = ? AND idcourses = ?
// 3. Validates lesson belongs to course
// 4. Checks if already completed
// 5. Inserts/updates: INSERT INTO lesson_progress (...) ON DUPLICATE KEY UPDATE
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
- `GET /user/auth/check`: Verify if user is authenticated → Returns `{ message, userId }`

### User Data Endpoints (Require authentication)
- `GET /user/profile`: Get authenticated user's profile with courses and lessons
- `GET /user/progress`: Get authenticated user's course progress with completion percentages
- `GET /users`: Get all users with courses and lessons (admin use, no auth required)
- `GET /users/summary`: Get simplified user list `{ id, email, full_name }`

### User Course Interaction (Require authentication)
- `POST /user/subscribe/:courseId`: Subscribe to a course → Returns `{ message }`
  - Inserts into `enrollments` table with status 'active'
  - Validates course exists and user not already enrolled
  - Uses `courseId` from URL params, `userId` from session
- `POST /user/complete-lesson/:courseId/:lessonId`: Mark a lesson as completed → Returns `{ message, alreadyCompleted }`
  - Inserts/updates `lesson_progress` table with status 'completed'
  - Validates enrollment exists and lesson belongs to course
  - Idempotent - can be called multiple times safely
  - Uses `courseId` and `lessonId` from URL params, `userId` from session

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

**User Course Interactions (commits: 83307fa, ae09647 "solidificacion de las funciones del usuario")**:
- **NEW**: `POST /user/subscribe/:courseId` - Subscribe to courses with validation
- **NEW**: `POST /user/complete-lesson/:courseId/:lessonId` - Mark lessons as completed
- Both functions in `middlewares/user.js` with full validation:
  - Check enrollment/course/lesson existence
  - Prevent duplicate enrollments
  - Handle already-completed lessons gracefully
- Updated routes now require authentication and use session-based userId

**User Progress & Profile (commits: 9de6279, 039c3cb "progreso de usuario")**:
- Changed `/user/:id` to `/user/profile` (uses session userId, requires auth)
- Changed `/user/:id/progress` to `/user/progress` (uses session userId, requires auth)
- Progress calculation improved with `Math.floor()` for percentages
- Added `setProgress()` method to Course class for better encapsulation

**Authentication Check (commit: 83307fa)**:
- Added `GET /user/auth/check` endpoint to verify authentication status
- Useful for frontend to check if user session is still valid

**Categories Support (commit: 8b5e736 "Obtener categorias")**:
- Added `middlewares/categories.js` with `fetchCategories` and `respondWithCategories`
- New endpoint: `GET /categories` to retrieve all course categories

**Account Management (commit: 753b1c2 "borrar cuenta")**:
- Added account modification endpoints: change password, email, name, and delete account
- All account management routes require authentication via `requireAuth` middleware
- Delete account automatically logs user out after deletion

**Login & Registration UI (commits: c31a47b, 03ff8e4)**:
- Implemented complete login page with validation, error handling, and accessibility features
- Registration page created with fetch API integration
- Both pages use native fetch API, not axios
- Form validation happens client-side before sending to backend

## Important Implementation Details

### Course Interaction Validation Logic

When implementing course/lesson features, follow this validation pattern:

**subscribeToCourse:**
1. Check if already enrolled (avoid duplicate key errors)
2. Verify course exists in database
3. Insert enrollment record
4. Return appropriate HTTP status codes (201 for created, 409 for conflict, 404 for not found)

**completeLesson:**
1. Verify user is enrolled in the course
2. Validate lesson belongs to the specified course
3. Check if lesson is already completed (idempotent operation)
4. Use `ON DUPLICATE KEY UPDATE` as safety mechanism
5. Return `alreadyCompleted` flag in response

### Session-Based Authentication Pattern

- All authenticated endpoints use `requireAuth` middleware
- User identity comes from `req.session.userId` (NOT from request body or params)
- Frontend includes session cookie automatically using `credentials: "include"`
- Never trust user-provided IDs for sensitive operations - always use session data

### Database Relationship Flow

```
user (iduser)
  ↓
enrollments (idenrollments) ← links user to course
  ↓                             (status: 'active', 'completed', etc.)
courses (idcourses)
  ↓
lessons (idlessons)
  ↓
lesson_progress ← tracks completion
  (idenrollments + idlessons + lesson_progresscol: 'completed')
```

## Development Notes

- Backend uses CommonJS modules (`require`/`module.exports`)
- Frontend uses ES6 modules (`import`/`export`)
- Password hashing uses bcryptjs with salt rounds of 10
- Database queries use callback-based mysql2 API (nested callbacks, not Promises)
- Frontend uses React 19+ with modern patterns
- No TypeScript - pure JavaScript on both frontend and backend
- **Use native fetch API for HTTP requests**, not axios (despite axios being in dependencies)
- **Always include `credentials: "include"`** in fetch calls for authenticated endpoints
