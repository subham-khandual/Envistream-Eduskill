# Database

PostgreSQL, managed through Prisma ORM. This document is the source of truth for the schema — update it whenever `schema.prisma` changes.

## 1. Entity overview

| Model | Purpose |
| --- | --- |
| `AdminUser` | Staff/admin accounts for the dashboard |
| `Course` | Each training track (Software Testing, Web Development, AI, Digital Marketing, etc.) |
| `Application` | A visitor's application/enrollment submission for a course, project, or general inquiry |
| `ProjectIdea` | Sample project entries under "Apply for Project" (PHP, Web Development, Python, Java) |
| `Testimonial` | Student testimonials shown on Home/Testimonials pages |
| `Partner` | Partner/associate company logos |
| `ContactMessage` | General contact-form submissions |
| `AssistantLog` (optional) | Lightweight log of AI assistant Q&A for quality review |

Fields marked **(future)** are reserved for later LMS-style features (payments, certificates, quizzes) mentioned in the PRD's non-goals — they are documented now so the schema doesn't need breaking changes later.

## 2. Prisma schema (draft)

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

enum AdminRole {
  ADMIN
  STAFF
}

enum ApplicationStatus {
  NEW
  CONTACTED
  ENROLLED
  REJECTED
}

enum CourseTrack {
  ENGINEERING
  MANAGEMENT
}

model AdminUser {
  id           String   @id @default(cuid())
  name         String
  email        String   @unique
  passwordHash String
  role         AdminRole @default(STAFF)
  createdAt    DateTime @default(now())
}

model Course {
  id          String       @id @default(cuid())
  slug        String       @unique
  title       String
  track       CourseTrack
  summary     String
  description String?
  duration    String?
  eligibility String?
  iconUrl     String?
  isActive    Boolean      @default(true)
  order       Int          @default(0)
  applications Application[]
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

model Application {
  id          String            @id @default(cuid())
  fullName    String
  email       String
  phone       String
  college     String?
  course      Course?           @relation(fields: [courseId], references: [id])
  courseId    String?
  projectIdea ProjectIdea?      @relation(fields: [projectIdeaId], references: [id])
  projectIdeaId String?
  message     String?
  resumeUrl   String?
  status      ApplicationStatus @default(NEW)
  source      String?           // e.g. "course-detail", "projects-page", "homepage-cta"
  createdAt   DateTime          @default(now())
}

model ProjectIdea {
  id           String        @id @default(cuid())
  category     String        // "PHP" | "Web Development" | "Python" | "Java"
  title        String
  description  String
  applications Application[]
  createdAt    DateTime      @default(now())
}

model Testimonial {
  id        String   @id @default(cuid())
  name      String
  role      String
  quote     String
  photoUrl  String?
  isFeatured Boolean @default(false)
  createdAt DateTime @default(now())
}

model Partner {
  id       String @id @default(cuid())
  name     String
  logoUrl  String
  order    Int    @default(0)
}

model ContactMessage {
  id        String   @id @default(cuid())
  name      String
  email     String
  phone     String?
  subject   String?
  message   String
  createdAt DateTime @default(now())
}

model AssistantLog {
  id        String   @id @default(cuid())
  question  String
  answer    String
  createdAt DateTime @default(now())
}

// --- Future / not built in v1 ---
// model Enrollment { studentId, courseId, progress, certificateUrl, ... }
// model Payment    { applicationId, amount, status, provider, ... }
// model Quiz       { courseId, questions, ... }
```

## 3. Notes

- `Application.source` lets the team see which page/CTA drove a lead (homepage hero, a specific course page, the Projects page, etc.) without extra analytics tooling.
- `Course.track` separates the Engineering (B.Tech CSE) tracks from the BBA/MBA tracks so the Courses page can filter by audience, matching the current site's two course sections.
- Media fields (`iconUrl`, `photoUrl`, `logoUrl`, `resumeUrl`) store a Cloudinary URL, not the file itself.
- Migrations are managed with `npx prisma migrate dev` locally and `npx prisma migrate deploy` in production — never hand-edit generated SQL (see `AGENTS.md`).
