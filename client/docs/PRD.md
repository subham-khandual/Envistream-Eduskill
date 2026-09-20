# Product Requirements Document (PRD)

## 1. Overview

**Product**: Envistream EduSkill website & lead/application platform
**Replaces**: [envistream.org](https://www.envistream.org/), the current static PHP site
**Owner**: Envistream Smartech Pvt. Ltd, Bhubaneswar

Envistream EduSkill runs training and internship programs for engineering (B.Tech CSE) and management (BBA/MBA) students, covering Software Testing, Cypress Automation, ERP/SAP, Web Development, Node.js & React.js, Artificial Intelligence, and Digital Marketing/SEO/AEO. The current site communicates this well but looks dated, is template-based, and has no real backend — "Enroll Now" and "Apply" actions just link to a contact form.

## 2. Problem statement

- The current site doesn't visually match the quality of the training being offered — it looks like a generic template, which undercuts trust for prospective students and corporate partners.
- There's no structured way to capture and manage applications/enrollments — leads likely arrive by phone/email only.
- Content (courses, testimonials, partner logos) is hardcoded in PHP/HTML, so updates require a developer.
- There's no way for a visitor to get quick answers about course duration, eligibility, or fees without contacting the office directly.

## 3. Goals

1. **Look and feel**: A modern, animated, "eye-catchy" site that reflects an IT training brand — strong hero sections, smooth transitions, clear visual hierarchy.
2. **Lead capture**: Replace static "Enroll Now" links with a real enrollment/application flow stored in a database, viewable by staff.
3. **Content manageability**: Courses, testimonials, partner logos, and projects should be data-driven, not hardcoded.
4. **AI assistance**: An in-page assistant (Groq-powered) that can answer common prospective-student questions and point them to the right course.
5. **Performance & SEO**: Fast load times and strong on-page SEO, since the current site's growth channel is organic search and referrals.

## 4. Non-goals (for v1)

- A full learning management system (video lessons, in-depth quizzes) — the schema allows for it later, but v1 is a marketing + application platform, not an LMS.
- Payment processing for course fees (documented as a future extension in `docs/DATABASE.md`, not built in v1).
- A native mobile app — the web app must simply be fully responsive.

## 5. Target users

| User | Needs |
| --- | --- |
| **Prospective student (B.Tech/BBA/MBA)** | Understand available courses, duration, eligibility, and how to apply/enroll quickly |
| **Corporate/college partner** | Understand credibility (placements, partner logos, testimonials) at a glance |
| **Envistream staff/admin** | See and manage incoming applications and enrollments without digging through email |

## 6. Key user journeys

1. **Discover → Apply**: Visitor lands on Home → browses Courses → opens a course detail page → submits an application form → receives a confirmation.
2. **Get quick answers**: Visitor opens the AI assistant widget → asks about eligibility/duration for a course → gets an answer with a link to the right course/apply page.
3. **Browse student work**: Visitor opens Projects → filters by category (PHP, Web Development, Python, Java) → views sample project ideas per track.
4. **Staff review**: Admin logs into `/admin` → sees new applications and contact messages → updates their status.

## 7. Success metrics (qualitative, v1)

- Every course listed on the current site is represented, with a working "Apply/Enroll" form that stores a record in the database.
- Lighthouse performance and SEO scores meaningfully improved over the current PHP site.
- Admin can view and triage applications without needing developer help.
- The AI assistant answers course-related questions using real course data rather than freeform hallucination.

## 8. Content to migrate from the current site

- Course catalog (Software Testing, Cypress Automation, ERP/SAP Training, SAP Testing, Web Development, Node.js & React.js, Digital Marketing, AI, AEO)
- BBA/MBA-track programs (Digital Marketing, SEO Training, Social Media Marketing, Market Research, Business Development, Lead Generation)
- Testimonials (student name, role, quote)
- Partner/associate logos
- Project categories for "Apply for Project" (PHP, Web Development, Python, Java)
- Company info: address (DLF Cyber City, Patia, Bhubaneswar), phone numbers, email, social links
- "Why internship is important" / program benefits content

See `docs/FEATURES.md` for how each of these maps to a feature in the new build.
