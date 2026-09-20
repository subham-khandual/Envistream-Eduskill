# Technology Stack

## 1. Frontend

| Technology | Role |
| --- | --- |
| React.js | Component-based UI for the whole site |
| JavaScript (ES6+) | Application logic, interactions, state |
| Tailwind CSS | Responsive, consistent styling system |
| React Router | Client-side routing (Home, Courses, Course detail, Projects, About, Contact, Admin) |
| Axios | HTTP calls from the frontend to the backend REST API |
| Framer Motion | Hero animations, scroll reveals, hover/micro-interactions |

## 2. Backend

| Technology | Role |
| --- | --- |
| Node.js | Server-side JavaScript runtime |
| Express.js | REST API framework, routing, middleware |
| REST APIs | Contract between frontend and backend (see `docs/API.md`) |
| JWT | Auth for the admin dashboard |
| bcrypt | Password hashing for admin/staff accounts |
| Multer | File uploads (brochure PDFs, course/partner images, resumes on applications) |

## 3. Database

| Technology | Role |
| --- | --- |
| PostgreSQL | Primary relational database — courses, applications, enrollments, testimonials, partners, contact messages, admin users |
| Prisma ORM | Schema definition, migrations, type-safe queries (see `docs/DATABASE.md`) |

## 4. AI

| Technology | Role |
| --- | --- |
| Groq API | Fast LLM inference behind the AI course assistant |
| LLM-based course assistant | Answers prospective-student questions (course duration, eligibility, tracks) grounded in real course data from the database; called from the backend, never exposes the API key to the frontend |

## 5. Storage

| Technology | Role |
| --- | --- |
| Cloudinary / cloud storage | Course images/icons, partner logos, brochure PDF, testimonial photos, and any resumes/files uploaded with applications |

## 6. Security

| Technology | Role |
| --- | --- |
| JWT authentication | Secures the admin dashboard and any staff-only API routes |
| RBAC | Roles: `admin`, `staff` (student-facing site has no login) |
| CORS | Restricts which origins can call the API |
| Input validation | Validates all form submissions (application, contact) before they touch the database |
| Rate limiting | Protects public forms and the AI assistant endpoint from abuse |
| Password hashing (bcrypt) | For admin/staff accounts |
| Environment variables | Database URL, JWT secret, Groq API key, Cloudinary credentials — never committed |

## 7. Development tools

Git, GitHub, VS Code, Postman, ESLint, Prettier.

## 8. Deployment

| Technology | Role |
| --- | --- |
| Vercel | Hosts the React frontend |
| Render | Hosts the Node.js/Express backend |
| Managed PostgreSQL hosting | Production database |

## 9. Recommended core stack

```
React.js + JavaScript + Tailwind CSS  →  Node.js + Express.js  →  Prisma + PostgreSQL
```

This is a scalable full-stack foundation for the Envistream EduSkill site, with room to grow into fuller LMS features (course content, quizzes, certificates, payments) later without a rebuild — see `docs/DATABASE.md` for schema fields already reserved for that.
