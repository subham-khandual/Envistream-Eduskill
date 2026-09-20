# Architecture

## 1. High-level diagram

```
                        VISITOR / BROWSER
                               │
                               ▼
                    ┌─────────────────────┐
                    │   REACT FRONTEND    │
                    │   (Vercel, apps/web)│
                    │                     │
                    │ React Router pages  │
                    │ Axios API client    │
                    │ Framer Motion UI    │
                    └──────────┬──────────┘
                               │  REST API (HTTPS)
                               ▼
                    ┌─────────────────────┐
                    │  EXPRESS BACKEND    │
                    │  (Render, apps/     │
                    │  server)            │
                    │                     │
                    │ Auth (JWT)          │
                    │ Validation          │
                    │ Rate limiting       │
                    │ Controllers/Routes  │
                    └───────┬─────┬───────┘
                            │     │
                 ┌──────────▼─┐ ┌─▼───────────────┐
                 │ PostgreSQL │ │   AI SERVICE     │
                 │ (Prisma    │ │   Groq API +     │
                 │ ORM)       │ │   course-aware   │
                 │            │ │   LLM assistant  │
                 └────────────┘ └──────────────────┘
                            │
                            ▼
                 ┌────────────────────┐
                 │ Cloudinary / Cloud │
                 │ Storage (media,    │
                 │ brochure, resumes) │
                 └────────────────────┘
```

## 2. Request flow examples

**Visitor submits a course application**
1. `ApplicationForm` (React) validates required fields client-side and calls `POST /api/applications`.
2. Express route runs input validation + rate limiting middleware.
3. Controller writes an `Application` row via Prisma, optionally uploads an attached resume via Multer → Cloudinary.
4. Response confirms success; frontend shows a confirmation state.
5. Application appears in the admin dashboard's applications table.

**Visitor asks the AI assistant a question**
1. `AIAssistantWidget` sends the question to `POST /api/assistant`.
2. Backend fetches relevant course data from PostgreSQL (via Prisma) to ground the answer.
3. Backend calls the Groq API with the question + course context, keeping the API key server-side only.
4. Response is returned to the widget and rendered in the chat panel.

## 3. Repository structure

```
envistream-eduskill/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── components/     # Button, CourseCard, TestimonialCard, etc.
│   │   │   ├── pages/          # Home, Courses, CourseDetail, Projects, About, Contact, Admin
│   │   │   ├── lib/api.js      # Axios instance + API calls
│   │   │   ├── hooks/
│   │   │   └── App.jsx
│   │   └── .env.example
│   └── server/
│       ├── src/
│       │   ├── routes/         # courses.js, applications.js, testimonials.js, contact.js, assistant.js, auth.js, admin.js
│       │   ├── controllers/
│       │   ├── middleware/     # auth.js, validate.js, rateLimit.js, errorHandler.js
│       │   ├── services/       # groqAssistant.js, cloudinary.js
│       │   └── app.js
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── migrations/
│       └── .env.example
├── packages/
│   └── shared/                 # shared constants (course categories, form field enums)
└── docs/
```

## 4. Environments

- **Local**: `npm run dev` runs `apps/web` (Vite dev server) and `apps/server` (nodemon) concurrently against a local or dev PostgreSQL instance.
- **Staging** (optional): a Render preview environment + Vercel preview deployment per pull request.
- **Production**: Vercel (frontend) + Render (backend) + managed PostgreSQL, as detailed in `docs/DEPLOYMENT.md`.
