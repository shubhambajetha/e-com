# Ecommerce App Monorepo

This repository is organized into separate frontend and backend apps.

```
ecommerce-app/
|- frontend/      # Next.js app
|- backend/       # Node.js + Express API
|- package.json   # root helper scripts
|- .gitignore
|- README.md
```

## Quick Start (from root)

```bash
npm --prefix frontend install
npm --prefix backend install
npm run dev:frontend
npm run dev:backend
```

Frontend: `http://localhost:3000`
Backend: `http://localhost:5000`
Health API: `http://localhost:5000/api/health`

## App Commands

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

## Suggested Backend Structure

```
backend/src/
|- config/        # Env and config
|- controllers/   # Request handlers
|- middlewares/   # Express middlewares
|- routes/        # API routes
|- services/      # Business logic
|- app.js         # Express app config
|- server.js      # Entry point
```

## GitHub Push Steps

```bash
git add .
git commit -m "setup frontend and backend structure"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
