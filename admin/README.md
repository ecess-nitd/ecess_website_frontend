# Admin Panel (Next.js)

This folder contains a minimal Next.js admin panel scaffold for the ECESS website frontend.

Quick start

1. cd into the admin folder

   cd admin

2. Install dependencies

   npm install

3. Run dev server (defaults to port 3001)

   npm run dev

Environment

- Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` to your backend FastAPI URL.

Notes

- The admin app is intentionally minimal. Add pages under `pages/` and components under `components/`.
- The dev server runs on port 3001 to avoid conflict with a main website running on port 3000.
