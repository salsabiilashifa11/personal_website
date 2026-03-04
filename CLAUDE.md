# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Dev Commands

```bash
# Backend (runs on :8080)
cd backend && go run ./main.go

# Frontend (runs on :3000)
cd frontend && npm run dev

# Frontend build
cd frontend && npm run build

# Frontend lint
cd frontend && npm run lint

# Backend build check
cd backend && go build ./...
```

## Architecture

**Frontend**: `frontend/` — Next.js 14 (App Router) + TypeScript + Tailwind CSS
- Pages: `/` (home/about+experiences), `/writings`, `/reading`, `/admin`
- Components: `src/components/` — Navbar, ExperienceCard, WritingCard, BookCard
- API client: `src/lib/api.ts` — typed fetch wrappers for Go backend
- Config: `frontend/.env.local` sets `NEXT_PUBLIC_API_URL=http://localhost:8080/api`

**Backend**: `backend/` — Go + Gin + SQLite (GORM + mattn/go-sqlite3)
- `main.go` — Gin server setup, CORS, route registration
- `models/models.go` — About, Experience, Writing, Book structs
- `handlers/` — one file per resource (about, experiences, writings, books)
- `middleware/auth.go` — checks `X-Admin-Password` header against `ADMIN_PASSWORD` env var
- `database/db.go` — SQLite init, AutoMigrate, seeds empty About row
- Config: copy `backend/.env.example` to `backend/.env` and set `ADMIN_PASSWORD`

## Design System

- **Fonts**: `Press Start 2P` (pixel, for headings) + `Space Mono` (body)
- **Colors**: Google primaries — Red `#EA4335`, Blue `#4285F4`, Yellow `#FBBC04`, Green `#34A853`
- **Style**: pixel-art box shadows, solid 2-4px black borders, white background
- Tailwind custom theme defined in `frontend/tailwind.config.ts`

## Conventions

- All API routes live under `/api` on the backend
- Admin mutations require `X-Admin-Password` header (client stores password in sessionStorage)
- Public GET routes are unauthenticated
- Books API returns a grouped object `{ reading, read, will_read }` (arrays)
- Experiences ordered by `order` field asc, then `id` asc
- Writings ordered by `published_at` desc
