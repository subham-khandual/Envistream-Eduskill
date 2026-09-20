# Deployment

## 1. Environments

| Environment | Frontend | Backend | Database |
| --- | --- | --- | --- |
| Local | Vite dev server (`localhost:5173`) | Express + nodemon (`localhost:4000`) | Local or dev PostgreSQL instance |
| Production | Vercel | Render | Managed PostgreSQL (e.g. Render/Neon/Supabase Postgres) |

## 2. Frontend (Vercel)

1. Import the repo into Vercel, set the project root to `apps/web`.
2. Build command: `npm run build`. Output directory: `dist`.
3. Environment variables (Vercel project settings):
   - `VITE_API_BASE_URL` — the deployed backend URL, e.g. `https://envistream-eduskill-api.onrender.com/api`
4. Attach the production domain (`www.envistream.org`) via Vercel's domain settings and update DNS (`CNAME`/`A` records) at the domain registrar.

## 3. Backend (Render)

1. Create a new Web Service pointing at `apps/server`.
2. Build command: `npm install`. Start command: `npm start` (or `node src/index.js`).
3. Environment variables (Render dashboard), matching `docs/SECURITY.md`:
   ```
   DATABASE_URL=
   JWT_SECRET=
   GROQ_API_KEY=
   CLOUDINARY_CLOUD_NAME=
   CLOUDINARY_API_KEY=
   CLOUDINARY_API_SECRET=
   CORS_ORIGIN=https://www.envistream.org
   ```
4. Run database migrations as part of the deploy step: `npx prisma migrate deploy`.

## 4. Database

- Use a managed PostgreSQL instance (Render Postgres, Neon, or Supabase all work with Prisma).
- Keep automated backups enabled.
- `DATABASE_URL` from the managed provider goes into the backend's environment variables — never into the frontend.

## 5. CI/CD

- GitHub Actions (or Vercel/Render's built-in git integration) runs on every push:
  1. Install dependencies (`npm install --workspaces`)
  2. Lint (`npm run lint`)
  3. Run tests (`npm test`)
  4. On `main`: Vercel auto-deploys `apps/web`; Render auto-deploys `apps/server`.
- Pull requests get preview deployments on both Vercel and Render before merging.

## 6. Rollout plan for replacing the live site

1. Build and deploy the new app to a staging subdomain (e.g. `new.envistream.org`) while the current PHP site stays live at `www.envistream.org`.
2. Migrate/re-enter existing content (courses, testimonials, partner logos, project ideas) into the new database via the admin dashboard.
3. QA all forms (application, contact, AI assistant) and check mobile responsiveness and SEO metadata.
4. Cut over DNS from the old PHP host to Vercel for `www.envistream.org`, keeping the old site backed up.
5. Monitor error logs and form submissions closely for the first 1–2 weeks post-launch.

## 7. Monitoring

- Backend errors: basic logging (e.g. `morgan` + a hosted log viewer, or Render's built-in logs) at minimum for v1.
- Uptime: Render/Vercel status + an external uptime check (e.g. UptimeRobot) on the production domain.
