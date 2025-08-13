# Next.js Guest Book

A modern guest book web app built with Next.js App Router, React 19, Prisma ORM, Bun, and TailwindCSS. Users can leave messages, see paginated visitor entries, and enjoy a secure, fast, and beautiful experience.

## Features

- Guest book UI with form validation and toast notifications
- Paginated visitor messages
- Email masking and XSS protection
- Rate limiting for spam prevention
- Prisma ORM (server-only) for data access
- Bun as package manager
- ESLint 9+ with flat config and ignores for generated Prisma
- Ready for deployment on Vercel/Netlify

## Tech Stack

- Next.js 15 (App Router)
- React 19
- Prisma ORM
- Bun
- TailwindCSS
- ESLint 9+

## Getting Started

### 1. Install dependencies

```sh
bun install
```

### 2. Setup database

- Edit `prisma/schema.prisma` as needed.
- Run migrations:

```sh
bunx prisma migrate dev
```

- (Optional) Seed data:

```sh
bun prisma/seed/guest-data.ts
```

### 3. Generate Prisma Client

```sh
bunx prisma generate
```

### 4. Run development server

```sh
bun dev
```

### 5. Build for production

```sh
bun run build
```

## Deployment

### Vercel

- Make sure your `package.json` build script runs `prisma generate` before `next build`:
  ```json
  "build": "bun run prisma generate && bun run build"
  ```
- Set environment variable `DATABASE_URL` in Vercel dashboard.

## Project Structure

```
prisma/           # Prisma schema, migrations, seed
src/app/          # Next.js App Router pages, components, API
src/generated/    # Generated Prisma client
public/           # Static assets
.eslint.config.mjs # ESLint config (flat, ignores generated Prisma)
tsconfig.json     # TypeScript config
```

## Security & Best Practices

- All Prisma code is server-only (never imported in client components)
- Email is masked in UI
- Messages are escaped to prevent XSS
- Rate limiting middleware for API
- ESLint ignores generated Prisma files

## Troubleshooting

- If Prisma Client error on Vercel/Netlify: ensure `prisma generate` runs before build
- If lint error on generated files: check ESLint config ignores
- For database issues: check `DATABASE_URL` env variable

## License

Free hehehe
