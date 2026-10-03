# OttoManagerPro V2

V2 codebase for [OttoManagerPro](https://ottomanagerpro.com): a multi-tenant SaaS foundation for auto repair shops covering customers, inventory and multi-location support, built tenant-safety-first. Work in progress.

## What's implemented

- **Multi-tenant data model**: every record is scoped to an organization, and reads and writes go through a tenant context with explicit scope helpers
- **Locations**: organizations can have multiple shop locations, with an active-location switcher that scopes what the user sees
- **Phone-first customers**: customer search and create flow keyed on normalized phone digits, unique per organization
- **Inventory**: location-scoped inventory items (item, condition, size, price, quantity) with quick-add
- **Tests**: tenant context, tenant-safety baseline, location context, inventory scope and customer creation

## Stack

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Prisma 6 · PostgreSQL

## Structure

- `app/`: routes, layouts and server actions
- `components/`: shell, customers and inventory UI
- `lib/`: tenant, location, customer and inventory logic
- `prisma/`: schema and migrations
- `tests/`: automated tests (`npm test`)

## Getting started

```bash
cp .env.example .env   # set DATABASE_URL
npm install
npx prisma migrate dev
npm run dev
```

Other scripts: `npm run typecheck`, `npm run lint`, `npm test`.
