# Job Tracker Application Frontend

Production-ready React + TypeScript + Vite frontend connected to your backend.

## Features
- Home page with login + MFA flow
- Forgot password page with:
  - reset link request
  - temporary password request
- Applications page:
  - list, add, edit, delete
  - search by company
  - filter by status
  - sort by date
- Settings page:
  - change email
  - change password
- Protected routes
- Axios API layer with bearer token support

## Setup
1. Install dependencies:
   npm install

2. Create `.env` based on `.env.example`

3. Start development:
   npm run dev

4. Build for production:
   npm run build

## Important
Update your backend URL in `.env`:
VITE_API_URL=http://localhost:3000
