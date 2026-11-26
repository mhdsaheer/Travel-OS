## Architecture
- Frontend-only for now: all data flows through `src/lib/store.tsx` (local state seeded from `src/lib/mock-data.ts`) so a REST API can replace it later without touching screens.
- Module colours are applied with `.mod-*` classes that set `--mod*` tokens; components use `bg-mod`/`text-mod` instead of per-module colour classes.
- Chunky press-down buttons come from the `Chunky` component / `chunky` utility; don't hand-roll button shadows.
- Real identities and roles come from Supabase Auth plus profiles and a protected user_roles table; never infer access from email, metadata or client role switches.
- Existing screen components are shared by explicit role-prefixed routes under the authenticated layout; portal-aware navigation prevents cross-portal links and unavailable pages are not registered.
- Operational data remains in-memory sample data; admin operational views are read-only and store actions enforce module edit permissions.
