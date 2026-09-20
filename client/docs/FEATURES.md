# Features

## 1. Carried over from the current site (rebuilt, data-driven)

| Current site element | New implementation |
| --- | --- |
| Image slider with "EduSkill Training & Internship" + "Enroll Now" | Animated hero section on Home with rotating headline and a primary CTA that opens the application flow |
| "Courses We Offer" (Engineering tracks) | `Course` records with `track = ENGINEERING`, rendered as animated cards on the Courses page |
| "Training & Internship Programs for BBA/MBA Graduates" | `Course` records with `track = MANAGEMENT`, filterable on the same Courses page |
| "Benefits of Choosing Envistream Eduskill" (lab facility, mentors, placement help, etc.) | Icon + text benefits grid on Home/About, scroll-animated |
| Student testimonials | `Testimonial` model, homepage carousel + full Testimonials page |
| "Apply for Online Training & Internship" links | Unified `ApplicationForm` component, `source` tagged per page |
| "Apply for Project" (PHP / Web Development / Python / Java) | `ProjectIdea` model + Projects page with category tabs, each idea linking into the same application flow |
| Partner/associate logos | `Partner` model, animated logo marquee |
| "Why Internship is Important for Your Career" | Content block on About/Home |
| "Download Brochure" | Brochure PDF stored in Cloudinary, linked from the header/hero |
| Office address, phone, email, social links | Footer + Contact page, with a map embed |

## 2. New capabilities

1. **AI course assistant** — floating chat widget (Groq-powered) that answers questions like "How long is the Cypress Automation course?" or "Am I eligible for the AI track as a 2nd-year student?" using live course data, and links to the relevant course/apply page.
2. **Structured lead pipeline** — every application/enrollment and contact message is stored, with a status (`NEW → CONTACTED → ENROLLED/REJECTED`) visible in the admin dashboard, instead of only arriving by phone/email.
3. **Admin dashboard** (`/admin`) — staff can log in to review applications and messages, and manage courses, testimonials, and partner logos without editing code.
4. **SEO-friendly structure** — each course and project category gets its own indexable route (`/courses/:slug`) with proper metadata, improving on the current PHP pages.
5. **Animated, responsive UI** — replaces the static template look with motion-based hero sections, scroll reveals, and hover interactions (see `docs/DESIGN.md`).

## 3. Reserved for later (not built in v1)

- Full LMS features: lesson content, quizzes, progress tracking, certificates (schema already allows for these — see `docs/DATABASE.md`).
- Online payments for paid courses.
- Student login/portal (current scope is public marketing + application flow + admin only).

## 4. Feature-to-page map

| Page | Key features |
| --- | --- |
| Home | Hero, stats counters, course preview grid, benefits grid, testimonial carousel, partner marquee, AI assistant widget, final CTA |
| Courses | Track filter (Engineering/Management), course cards, search |
| Course detail | Full description, duration/eligibility, application form, related courses |
| Projects | Category tabs, project idea cards, application form |
| About | Company story, facilities, benefits, office map |
| Testimonials | Full testimonial grid |
| Contact | Contact form, address/map, phone/email/social |
| Admin | Login, applications table, contact messages table, course/testimonial/partner management |
