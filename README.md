# Ecommerce App - Full Stack Application

A modern, full-stack ecommerce application built with cutting-edge web technologies.

## 🎯 Features

- **Full-Stack Architecture**: Separate frontend and backend
- **Real-time Database**: PostgreSQL with Prisma ORM
- **Type-Safe**: TypeScript in frontend
- **Modern Frontend**: Next.js 16 with React 19
- **REST API**: Express.js backend
- **Authentication Ready**: Integrated Supabase Auth
- **Responsive Design**: Tailwind CSS styling
- **Database GUI**: Prisma Studio

## 🛠 Tech Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Supabase Client

### Backend
- Express.js
- Node.js
- Prisma ORM
- PostgreSQL
- Supabase

## ⚡ Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

```bash
# Install dependencies


# Setup environment variables
# Copy .env.example to .env and fill in your Supabase credentials

# Setup database
npm --prefix backend run prisma:migrate:dev

# Run development servers
npm run dev:frontend  # Terminal 1
npm run dev:backend   # Terminal 2
```

## 📖 Documentation

- [Complete Setup Guide](./SETUP.md) - Detailed installation and configuration
- [API Endpoints](#api-endpoints) - Available REST endpoints

## 🔌 API Endpoints

- `GET /` - Root endpoint with available routes
- `GET /api/health` - Backend health status
- `GET /api/health/db` - Database health check
- `GET /api/products` - List products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product
- `GET /api/categories` - List categories
- `POST /api/categories` - Create category

## 🌐 Running the App

After setup, the application will be available at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

The frontend home page displays the status of both backend and database connections.

## 📁 Project Structure

```
ecommerce-app/
├── backend/        # Express API server
├── frontend/       # Next.js web application
├── .env           # Environment variables
└── SETUP.md       # Detailed setup guide
```

## 🚀 Next Steps

1. Follow the [SETUP.md](./SETUP.md) guide to get started
2. Configure your Supabase project
3. Run the database migrations
4. Start developing!

## 📝 License

MIT License - See LICENSE file for details
 Monorepo

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
