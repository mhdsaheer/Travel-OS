# TravelOS — full source export

## Contents

This export contains the current React/TypeScript app, all four role portals,
shared screens and controls, styles, public assets, tests, dependency lockfile,
Vite/TanStack configuration, generated route map, and database migrations with
metadata. Plus Jakarta Sans weights 400–700 and their OFL license are included
under `public/fonts`; this export loads those local fonts instead of Google Fonts.
No application access controls have been removed or replaced with a demo bypass.

Excluded intentionally: repository metadata, installed dependencies, generated
build output, editor-specific metadata, live `.env`, managed backend project
configuration, database records, user accounts, passwords, session tokens and
private keys. Auth accounts and live data are not part of a source export.

## Local development

1. Install a current Bun 1.x release (the project includes `bun.lock`).
2. Open a terminal inside `TravelOS-full-source`.
3. Run `bun install --frozen-lockfile` while connected to the internet.
4. Copy `.env.example` to `.env` and fill in configuration for a backend you
   control, or retain your existing authorized backend connection locally.
5. Run `bun run dev` and open the local URL printed in the terminal.
6. Run `bun run test` to execute the included tests.
7. Run `bun run build` for a production build and `bun run preview` to preview
   the generated build where the configured deployment adapter supports it.

The project uses a plain TanStack Start/Vite setup (`vite.config.ts`) with a
Cloudflare Workers-targeted Nitro build. Production hosting must support that
target; it is not a static HTML-only website. To deploy elsewhere, change the
`preset` passed to `nitro()` in `vite.config.ts`.

## Backend configuration

Browser/build-time variables:
- `VITE_SUPABASE_URL`: your backend endpoint.
- `VITE_SUPABASE_PUBLISHABLE_KEY`: your backend's public client key.

Server runtime variables:
- `SUPABASE_URL`: backend endpoint reachable by the server.
- `SUPABASE_PUBLISHABLE_KEY`: matching public client key.
- `SUPABASE_SERVICE_ROLE_KEY`: privileged credential for admin user operations,
  provided only by an independently managed backend you control. Keep it out of
  browser-exposed variables and out of source control.

Migration tooling:
- `DATABASE_URL`: your own PostgreSQL migration connection string.

No service-role key or database password is included in this export. Running
privileged server operations requires your own compatible backend and
independently issued server credentials.

For a new compatible backend, apply SQL migrations in order:
1. `drizzle/migrations/0000_role_portals_profiles.sql`
2. `drizzle/migrations/0001_restrict_profile_trigger_execution.sql`

Review the SQL on a new database first. Do not reapply it to an existing backend
that already has these migrations. Retain the accompanying Drizzle metadata.
Create real authentication users using your own backend's supported user-creation
process. Profiles are created by the included lifecycle trigger; administrators
must securely assign each user's `public.user_roles` entry to `agent`, `manager`,
`finance`, or `admin`. Never assign roles from user-editable metadata. No demo
accounts or passwords are bundled. The short demo usernames resolve to demo
emails in the current login screen and require those actual accounts to exist.
Configure authorized app origins, password recovery redirects to `/reset-password`,
and deliverable email settings on your backend before testing recovery.

## Offline scope — important

All app code and visual assets are included and may be read/edited offline.
After dependencies have been installed, local development can start without
fetching fonts. A new dependency install requires internet access or a prefilled
package cache; dependencies are deliberately not bundled in a source archive.

The current application is NOT a fully disconnected operational app. Secure
login, profile/role checks, admin user management, and password recovery need a
reachable compatible backend. Without it, protected portals cannot be accessed.
True disconnected usage would require a separately approved offline/local
backend design; this export does not weaken authentication to simulate it.
Operational enquiries, trips, payments, customers, and tasks remain in-memory
sample data as in the current project, rather than a persistent database export.

## Export integrity

`EXPORT-MANIFEST.sha256` records the SHA-256 of each file, excluding itself.
Verify it with `sha256sum -c EXPORT-MANIFEST.sha256`.
