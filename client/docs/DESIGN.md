# Design Guidelines

## 1. Design direction

The current site reads as a generic, dated training-institute template: a static image slider, boxy cards, default fonts. The rebuild should feel like a modern SaaS/edtech product — confident, energetic, and trustworthy — while staying clearly rooted in "training & internship for tech and management students."

Mood: **energetic but professional** — closer to a modern bootcamp/edtech brand than a corporate training PDF.

## 2. Color palette

| Role | Color | Hex |
| --- | --- | --- |
| Primary (brand) | Indigo/Blue | `#2563EB` |
| Primary dark (hero backgrounds, header) | Deep Navy | `#0F172A` |
| Accent (CTAs, highlights) | Amber/Orange | `#F97316` |
| Success / placements | Emerald | `#16A34A` |
| Neutral text | Slate | `#1E293B` |
| Neutral background | Off-white | `#F8FAFC` |
| Card/section backgrounds (alt) | Light tint of primary | `#EFF6FF` |

Each course category can carry a small accent color (as in the tech-stack docs) for quick visual scanning on the Courses page — e.g. testing = blue, ERP/SAP = purple, AI = orange, digital marketing = teal — but the palette above remains the site-wide base.

## 3. Typography

- **Headings**: A confident, slightly geometric sans-serif (e.g. "Sora" or "Poppins") — bold weights for hero headlines.
- **Body**: A highly readable sans-serif (e.g. "Inter") at 16px base size.
- **Scale**: Hero H1 40–56px, section H2 28–32px, H3 20–22px, body 16px, small print 13–14px.

## 4. Layout & motion principles

- **Hero sections** on every major page (Home, Courses, About, Contact) with a headline, one-line subtext, and a primary CTA button — animated entrance (fade/slide up) via Framer Motion.
- **Scroll-reveal** for cards and sections (courses, testimonials, stats) — staggered fade/slide, not overused.
- **Sticky, condensing header** on scroll, with a persistent "Apply Now" button.
- **Micro-interactions**: hover-lift on cards, animated underline on nav links, count-up animation for stats (years of training, students placed, partner companies).
- Respect `prefers-reduced-motion`: fall back to instant/no animation.
- Mobile-first responsive breakpoints matching Tailwind defaults (`sm`, `md`, `lg`, `xl`).

## 5. Pages

1. **Home** — Hero with rotating headline (training tracks), stats bar (students trained, placement partners, courses offered), course category grid, "Why Envistream EduSkill" benefits grid, testimonials carousel, partner-logo marquee, final CTA banner.
2. **Courses (listing)** — Filterable grid (Engineering tracks vs BBA/MBA tracks), each card with icon, short description, and "View details" / "Apply Now".
3. **Course detail** — Overview, curriculum highlights, duration/eligibility, "Apply" form, related courses.
4. **Projects** — Category tabs (PHP, Web Development, Python, Java) showing sample project ideas, each with a short description; CTA to apply for a live project.
5. **About Us** — Company story, mission, facilities (24x7 lab, mentors, mock interviews), office location/map.
6. **Testimonials** — Full list/grid of student stories beyond the homepage carousel.
7. **Contact / Apply** — Contact form, office address & map embed, phone/email, social links; also the general "Enroll Now" destination.
8. **Admin dashboard** (`/admin`, authenticated) — Applications table, contact messages table, basic content management for courses/testimonials/partner logos.

## 6. Components to build once, reuse everywhere

- `Button` (primary/secondary/ghost variants)
- `CourseCard`
- `TestimonialCard`
- `StatCounter`
- `SectionHeading` (eyebrow + title + subtitle)
- `ApplicationForm` (used on course detail + contact + projects pages, with a `context` prop to tag what was applied for)
- `PartnerLogoMarquee`
- `AIAssistantWidget` (floating button + chat panel)

## 7. Accessibility

- Color contrast meeting WCAG AA for text on colored backgrounds.
- All interactive elements keyboard-navigable; forms fully labeled.
- Motion-heavy sections must have a static, still-usable fallback.
