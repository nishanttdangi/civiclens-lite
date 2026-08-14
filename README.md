# CivicLens Lite

A civic complaint management platform that lets citizens report and track public issues
(roads, water, electricity, sanitation, safety), with role-based access for citizens and
administrators.

**Stack:** MongoDB · Express.js · React.js · Node.js · JWT · CSS

## Features

- JWT-based authentication & authorization (citizen / admin roles)
- React dashboard with search + status/category filtering
- REST API for complaint registration, status updates, and full status-change history
- Image upload for complaint evidence (Multer, served as static files)
- Responsive UI built with React + plain CSS (no UI framework)
- Admin panel to review all complaints and update their status with a note

## Project Structure

```
civiclens-lite/
├── backend/          Node + Express + MongoDB API
│   ├── config/        DB connection
│   ├── controllers/    Route handlers
│   ├── middleware/     JWT auth + role guard + Multer upload
│   ├── models/         User, Complaint (Mongoose)
│   ├── routes/         /api/auth, /api/complaints
│   ├── uploads/         Uploaded evidence images (served at /uploads)
│   └── server.js
└── frontend/          React (Vite) client
    └── src/
        ├── api/          Axios instance with JWT interceptor
        ├── context/      AuthContext (login/register/logout)
        ├── components/   Navbar, ComplaintCard, FilterBar, ProtectedRoute
        └── pages/        Login, Register, Dashboard, AdminDashboard,
                            NewComplaint, ComplaintDetail
```

## Prerequisites

- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
# edit .env: set MONGO_URI and a strong JWT_SECRET
npm install
npm run dev        # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev        # starts on http://localhost:5173
```

Open `http://localhost:5173` in your browser.

## Usage

1. Register an account — choose **Citizen** to report issues, or **Administrator** to
   manage them (this is a self-serve toggle for demo purposes; in production, admin
   accounts should be provisioned separately).
2. As a citizen: click **Report an Issue**, fill in title/description/category/location,
   optionally attach a photo, and submit. Track its status and history from your dashboard.
3. As an admin: open the **Admin Dashboard** to see every complaint, filter/search them,
   open one, and update its status (Pending → In Progress → Resolved/Rejected) with an
   optional note — this is appended to that complaint's history timeline.

## API Overview

| Method | Route                        | Access        | Description                          |
|--------|------------------------------|---------------|---------------------------------------|
| POST   | /api/auth/register            | Public        | Create a citizen/admin account        |
| POST   | /api/auth/login                | Public        | Log in, returns JWT                   |
| GET    | /api/auth/me                   | Authenticated | Current user profile                  |
| GET    | /api/complaints                | Authenticated | List complaints (filter/search/paginate) |
| GET    | /api/complaints/stats          | Authenticated | Status counts for dashboard cards     |
| POST   | /api/complaints                 | Authenticated | Create complaint (multipart, optional image) |
| GET    | /api/complaints/:id             | Authenticated | Complaint detail + status history     |
| PATCH  | /api/complaints/:id/status       | Admin only    | Update status, appends to history     |
| DELETE | /api/complaints/:id              | Owner/Admin   | Delete a complaint                    |

## Notes

- This is a "lite" build focused on the core resume-listed features (auth, CRUD APIs,
  dashboard filtering, image upload, status/history tracking). It intentionally omits
  heavier features from the full CivicLens platform (Socket.IO real-time notifications,
  Leaflet maps, Recharts analytics) to keep the codebase small and easy to explain.
- Uploaded images are stored on local disk under `backend/uploads` and served at
  `/uploads/<filename>`. For production, swap this for a cloud storage bucket (S3, etc.).
