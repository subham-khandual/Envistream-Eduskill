# Envistream EduSkill

A full redesign and rebuild of **[envistream.org](https://www.envistream.org/)** — the training & internship platform of Envistream Smartech Pvt. Ltd, Bhubaneswar — as a modern, fast, and eye-catching full-stack web application.

Envistream EduSkill provides training and internship programs for B.Tech (CSE) students and BBA/MBA graduates in Software Testing, Cypress Automation, ERP/SAP, Web Development (Node.js & React.js), Artificial Intelligence, and Digital Marketing (SEO/AEO) — combined with live projects, placement assistance, and mentorship from industry professionals.

This repository replaces the current static PHP site with a React + Node.js + PostgreSQL application, adding an AI-powered course assistant, an online application/enrollment flow, and an admin dashboard for managing leads and content.

## Why this rebuild

The current site is a static, template-driven PHP site. This rebuild aims to:

- Give the brand a modern, animated, "eye-catchy" look and feel (see [`docs/DESIGN.md`](docs/DESIGN.md))
- Turn static "Enroll Now" links into a real application/enrollment funnel with a database behind it
- Add an AI assistant that can answer prospective students' questions about courses, duration, and eligibility
- Make course, project, and testimonial content manageable without editing HTML/PHP
- Improve SEO, page speed, and mobile experience

## Documentation

| Doc | Purpose |
| --- | --- |
| [`AGENTS.md`](AGENTS.md) | Instructions for AI coding agents / vibe-coding tools working in this repo |
| [`docs/PRD.md`](docs/PRD.md) | Product requirements — goals, users, scope |
| [`docs/DESIGN.md`](docs/DESIGN.md) | Visual design system, pages, and UX direction |
| [`docs/TECH-STACK.md`](docs/TECH-STACK.md) | Full technology stack and rationale |
| [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) | System architecture and repo structure |
| [`docs/DATABASE.md`](docs/DATABASE.md) | Database schema (Prisma models) |
| [`docs/API.md`](docs/API.md) | REST API reference |
| [`docs/FEATURES.md`](docs/FEATURES.md) | Feature list, mapped to the current site plus new additions |
| [`docs/SECURITY.md`](docs/SECURITY.md) | Security model and practices |
| [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) | Environments and deployment process |

## Quick start (once scaffolded)

```bash
# 1. Clone and install
git clone <repo-url> envistream-eduskill
cd envistream-eduskill
npm install --workspaces

# 2. Configure environment
cp apps/server/.env.example apps/server/.env
cp apps/web/.env.example apps/web/.env

# 3. Set up the database
npx prisma migrate dev --schema apps/server/prisma/schema.prisma

# 4. Run frontend + backend together
npm run dev
```

- Frontend (Vite/React): `http://localhost:5173`
- Backend (Express): `http://localhost:4000`

## Status

🚧 Pre-build — this repo currently holds planning documentation only. Implementation is being done via AI-assisted ("vibe coding") development, guided by the docs above.
