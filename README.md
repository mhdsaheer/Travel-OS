# TravelOS

CRM for travel agencies: leads, trips, payments and Umrah bookings, with separate
portals for agents, managers, finance and admins.

## Development

You need [Bun](https://bun.sh) 1.x (the project ships a `bun.lock`).

```sh
bun install --frozen-lockfile
cp .env.example .env   # then fill in your Supabase project's values
bun run dev
```

Other scripts:

- `bun run test`: run the test suite
- `bun run build`: production build (Cloudflare Workers target, output in `.output/`)
- `bun run preview`: preview the production build
- `bun run lint`: lint the project

See [EXPORT-SETUP.md](EXPORT-SETUP.md) for backend configuration and database migrations.

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Supabase
