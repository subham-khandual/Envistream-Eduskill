# API Reference

Base URL: `/api`. All request/response bodies are JSON. Authenticated routes require `Authorization: Bearer <JWT>`.

## 1. Public routes

### Courses

| Method | Route | Description |
| --- | --- | --- |
| GET | `/courses` | List active courses. Supports `?track=ENGINEERING|MANAGEMENT` |
| GET | `/courses/:slug` | Get a single course by slug (for course detail page) |

### Projects

| Method | Route | Description |
| --- | --- | --- |
| GET | `/projects` | List project ideas. Supports `?category=PHP|Web Development|Python|Java` |

### Testimonials & partners

| Method | Route | Description |
| --- | --- | --- |
| GET | `/testimonials` | List testimonials. Supports `?featured=true` for the homepage carousel |
| GET | `/partners` | List partner logos, ordered for the marquee |

### Applications & contact (public writes)

| Method | Route | Description |
| --- | --- | --- |
| POST | `/applications` | Submit a course/project application. Body: `fullName, email, phone, college?, courseId?, projectIdeaId?, message?, resume?(file), source` |
| POST | `/contact` | Submit a general contact message. Body: `name, email, phone?, subject?, message` |

### AI assistant

| Method | Route | Description |
| --- | --- | --- |
| POST | `/assistant` | Body: `{ question: string }`. Server fetches relevant course data, calls Groq, returns `{ answer: string }` |

## 2. Admin routes (JWT required, `ADMIN`/`STAFF` roles)

### Auth

| Method | Route | Description |
| --- | --- | --- |
| POST | `/auth/login` | Body: `{ email, password }` → `{ token, user }` |
| GET | `/auth/me` | Returns the current authenticated admin user |

### Applications & messages

| Method | Route | Description |
| --- | --- | --- |
| GET | `/admin/applications` | List/filter applications. Query: `status, courseId, from, to` |
| PATCH | `/admin/applications/:id` | Update `status` (`NEW`, `CONTACTED`, `ENROLLED`, `REJECTED`) |
| GET | `/admin/contact-messages` | List contact messages |

### Content management

| Method | Route | Description |
| --- | --- | --- |
| POST | `/admin/courses` | Create a course |
| PUT | `/admin/courses/:id` | Update a course |
| DELETE | `/admin/courses/:id` | Deactivate (soft-delete) a course |
| POST | `/admin/testimonials` | Create a testimonial |
| PUT | `/admin/testimonials/:id` | Update a testimonial |
| DELETE | `/admin/testimonials/:id` | Remove a testimonial |
| POST | `/admin/partners` | Add a partner logo |
| DELETE | `/admin/partners/:id` | Remove a partner logo |

## 3. Conventions

- **Validation**: every `POST`/`PUT`/`PATCH` body is validated by middleware before reaching the controller; invalid requests return `400` with a field-level error map.
- **Errors**: consistent shape — `{ error: { message, code } }` with appropriate HTTP status (`400`, `401`, `403`, `404`, `429`, `500`).
- **Pagination**: list endpoints accept `?page=&pageSize=` and return `{ data, page, pageSize, total }`.
- **Rate limiting**: `/applications`, `/contact`, and `/assistant` are rate-limited per IP to prevent spam/abuse.
- **File uploads**: `multipart/form-data` via Multer, streamed to Cloudinary; the API stores only the resulting URL.
