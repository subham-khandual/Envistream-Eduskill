# Security

## 1. Authentication & authorization

- **JWT authentication** protects the admin dashboard and all `/admin/*` and `/auth/me` routes. Tokens are short-lived; the frontend stores them in memory (not `localStorage`) where possible, or an httpOnly cookie if session persistence is required.
- **RBAC**: two roles — `ADMIN` (full access, including managing staff accounts) and `STAFF` (view/manage applications and content, no user management). Role is embedded in the JWT and checked in middleware, never trusted from the client.
- The public site (Home, Courses, Projects, About, Contact) requires no authentication — only `/admin` routes do.

## 2. Password handling

- All admin/staff passwords are hashed with **bcrypt** before storage. Plaintext passwords are never logged, stored, or emailed.
- Minimum password policy enforced at account creation (length + complexity) — configured in `apps/server/src/middleware/validate.js`.

## 3. Input validation

- Every public write endpoint (`/applications`, `/contact`, `/assistant`) validates and sanitizes input server-side before it reaches Prisma — required fields, email/phone format, string length limits.
- File uploads (resumes, images) are restricted by MIME type and size limit via Multer, and scanned/validated before being forwarded to Cloudinary.

## 4. CORS

- The API only accepts requests from the known frontend origins (production domain + local dev URL). All other origins are rejected.

## 5. Rate limiting

- `/applications`, `/contact`, and `/assistant` are rate-limited per IP address to prevent spam submissions and abuse of the AI assistant (which incurs API cost).
- Login attempts on `/auth/login` are rate-limited/backed off to reduce brute-force risk.

## 6. Secrets & environment variables

All secrets live in `.env` files (never committed) and are loaded via environment variables:

```
DATABASE_URL=
JWT_SECRET=
GROQ_API_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CORS_ORIGIN=
```

- The Groq API key is used only server-side inside `services/groqAssistant.js` — it is never sent to or accessible from the frontend.
- `.env.example` files (with placeholder values) are committed so contributors know which variables to set.

## 7. Transport & headers

- HTTPS enforced in production (handled by Vercel/Render).
- Standard security headers (e.g. via `helmet` in Express): `X-Content-Type-Options`, `X-Frame-Options`, a reasonable `Content-Security-Policy`, etc.

## 8. Data handling

- Applicant data (name, email, phone, resume) is used only for admissions/enrollment follow-up, stored in the production PostgreSQL database, and not exposed via any public endpoint.
- Admin/staff accounts are created directly by an existing admin — there is no public sign-up route.
