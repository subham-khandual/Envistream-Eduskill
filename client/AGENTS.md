# AGENTS.md

Instructions for AI coding agents (Claude Code, Cursor, Copilot Workspace, etc.) working in this repository. Read this before generating or editing any code. When a rule here conflicts with a general habit, follow this file.

## 1. Project summary

Envistream EduSkill is the rebuilt version of [envistream.org](https://www.envistream.org/) — a training & internship marketing site — turned into a full-stack web app. It needs to look modern and "eye-catchy" (motion, gradients, strong hero sections) while staying fast and easy to maintain. Full context lives in `docs/`. Read `docs/PRD.md` and `docs/FEATURES.md` before implementing any page or feature.

## 2. Source of truth

- `docs/TECH-STACK.md` — the only technologies allowed unless the user explicitly approves a new one.
- `docs/DATABASE.md` — the Prisma schema. Don't invent new tables/fields without updating this doc first.
- `docs/API.md` — the endpoint contract. Frontend calls must match these routes/shapes exactly.
- `docs/DESIGN.md` — colors, type scale, spacing, and page-by-page layout. Don't freelance the visual design.

If something isn't covered by a doc, make the smallest reasonable assumption, note it in the PR/commit description, and keep going — don't block on it.

## 3. Repo layout (target)

```
envistream-eduskill/
├── apps/
│   ├── web/          # React + Vite + Tailwind frontend
│   └── server/        # Node.js + Express backend
├── packages/
│   └── shared/         # Shared types/constants used by web + server
├── docs/
└── AGENTS.md, README.md
```

Use a monorepo with npm workspaces. Keep frontend and backend fully separate — the frontend only talks to the backend through the documented REST API, never directly to the database.

## 4. Coding conventions

- **Language**: JavaScript (ES6+) throughout, both frontend and backend. No TypeScript unless asked.
- **Style**: ESLint + Prettier configs live at the repo root and apply to both apps. Run `npm run lint` and `npm run format` before considering a task done.
- **Components**: Functional React components with hooks only. No class components.
- **Styling**: Tailwind CSS utility classes. Avoid inline styles and ad-hoc CSS files except for rare cases Tailwind can't express.
- **Animation**: Framer Motion for transitions/scroll effects. Keep animations subtle enough not to hurt performance or accessibility (respect `prefers-reduced-motion`).
- **API calls**: All done through a single `apps/web/src/lib/api.js` Axios instance, not scattered `fetch` calls.
- **Naming**: `camelCase` for variables/functions, `PascalCase` for components, `kebab-case` for file names except React components (`PascalCase.jsx`).

## 5. Non-negotiables

- Never commit secrets. All credentials come from `.env` files listed in `docs/SECURITY.md`, and `.env` is git-ignored.
- Every mutating API route (`POST`/`PUT`/`PATCH`/`DELETE`) must run through the validation and auth middleware described in `docs/API.md` — no unvalidated user input reaches Prisma.
- Passwords are always hashed with bcrypt; never store or log plaintext passwords or tokens.
- Public marketing pages (Home, About, Courses, Projects, Contact) must render usable content without JavaScript where reasonably possible (SEO matters for this site — it lives on organic search and word of mouth).
- Don't remove or rename an existing API route without updating `docs/API.md` in the same change.

## 6. Working style for this repo

- Prefer small, complete vertical slices (e.g., "Course listing page end-to-end": route + controller + Prisma query + React page + API call) over large partial changes across many files.
- When building a page, check `docs/DESIGN.md` for that page's section list before writing markup, so nothing is missed or invented.
- When touching the database, generate a Prisma migration — never hand-edit generated SQL.
- Write only the tests that meaningfully protect behavior (auth, form validation, enrollment flow) — this project does not need 100% coverage.

## 7. Things to ask about vs. things to just do

**Just do it:**
- Component structure, folder placement within the agreed layout
- Copy/microcopy for buttons, labels, empty states
- Choice of icon, spacing, or minor layout details within the design system

**Ask first (or clearly flag the assumption):**
- Adding a new third-party service/dependency not in `docs/TECH-STACK.md`
- Changing the database schema in a breaking way
- Anything that touches payments or sends real emails/SMS in a non-test environment
