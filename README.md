# Envistream EduSkill — AI-Powered Education & Internship Platform

A modern education and internship platform redesign focused on creating a smarter student experience, digital enrollment flow, AI-assisted course guidance, and better career-oriented learning journeys.

**Developer:** [@subham-khandual](https://github.com/subham-khandual)

**Keywords:** education platform, internship platform, AI education assistant, student enrollment system, course platform, training and internship portal, web development learning, career-oriented education, AI-powered student support

## Overview

**Envistream EduSkill** is a redesign and rebuild of Envistream’s training and internship platform. The goal is to modernize the platform, improve the user experience, and add digital workflows for course enrollment, AI-powered guidance, and a more scalable education experience.

This project is built to support:
- Prospective students
- Training and internship seekers
- Educational administrators
- Course and enrollment workflows

## Why this rebuild matters

The previous platform was static and limited in interactivity. This rebuild modernizes the experience by adding:
- Better user engagement and visual design
- Real application and enrollment funnel
- AI assistant for course and eligibility questions
- Easier administration and content management
- Improved SEO, performance, and mobile experience

## Features

- ✅ AI-powered course assistant
- ✅ Student enrollment and application flow
- ✅ Course and internship information portal
- ✅ Modern landing pages and UI redesign
- ✅ Admin dashboard support
- ✅ Database-backed enrollment management
- ✅ Better SEO and performance optimization
- ✅ Responsive design for mobile and desktop users

## Tech Stack

- React
- Node.js
- PostgreSQL
- Prisma
- Express
- Vite
- AI-powered assistant integration

## Documentation

| Document | Purpose |
| --- | --- |
| `AGENTS.md` | AI coding instructions |
| `docs/PRD.md` | Product requirements |
| `docs/DESIGN.md` | Design system and UX guidelines |
| `docs/TECH-STACK.md` | Stack rationale |
| `docs/ARCHITECTURE.md` | System architecture |
| `docs/DATABASE.md` | Database schema |
| `docs/API.md` | API reference |
| `docs/FEATURES.md` | Features and roadmap |
| `docs/SECURITY.md` | Security overview |
| `docs/DEPLOYMENT.md` | Deployment process |

## Quick Start

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

Frontend: http://localhost:5173  
Backend: http://localhost:4000

## Status

🚧 Pre-build / planning documentation repo with implementation underway using AI-assisted development workflows.

## Developer

Created by **@subham-khandual**  
GitHub: https://github.com/subham-khandual

## SEO Summary

Envistream EduSkill is an AI-powered education and internship platform designed to modernize training programs, improve student enrollment, and deliver a smarter learning experience with course guidance, digital workflows, and career-focused education tools.

---

**Project Name:** Envistream EduSkill  
**Category:** Education Platform, Internship Platform, AI Learning Assistant  
**Audience:** Students, training institutions, recruiters, educational admins
