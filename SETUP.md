# Ecommerce App - Full Stack Setup Guide

A complete ecommerce application built with:
- **Frontend**: Next.js 16 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Express.js + Node.js
- **Database**: PostgreSQL (via Supabase)
- **ORM**: Prisma
- **Authentication**: Supabase Auth

---

## 📋 Prerequisites

Before you start, ensure you have:
- **Node.js** (v18+ recommended)
- **npm** or **yarn**
- **Git**
- **Supabase Account** (free tier available at https://supabase.com)

---

## 🚀 Quick Start

### 1. Clone & Install Dependencies

```bash
# Navigate to project directory
cd f:\ecommerce-app

# Install root dependencies
npm install

# Install backend dependencies
npm --prefix backend install

# Install frontend dependencies
npm --prefix frontend install
```

### 2. Setup Supabase

1. **Create a Supabase Project**:
   - Go to https://supabase.com and sign up
   - Create a new project
   - Note your Project URL and API keys

2. **Get Your Credentials**:
   - Project Settings → API
   - Copy: `Project URL` (your SUPABASE_URL)
   - Copy: `anon public` key (your SUPABASE_ANON_KEY)
   - Copy: `service_role` key (your SUPABASE_SERVICE_ROLE_KEY)
   - Go to Settings → Database → Connection Pooling and copy the `CONNECTION_STRING`

### 3. Configure Environment Variables

**Update `.env` in the root directory** with your actual Supabase credentials:

```env
# Backend Server
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Database (from Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@[PROJECT_ID].supabase.co:5432/postgres?schema=public"

# Supabase
SUPABASE_URL="https://[PROJECT_ID].supabase.co"
SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR_SERVICE_ROLE_KEY]"

# Frontend Client (exposed to browser)
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
```

**For Frontend** (`frontend/.env.local`):

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT_ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR_ANON_KEY]"
```

### 4. Setup Prisma Database

```bash
# Generate Prisma Client
npm --prefix backend run prisma:generate

# Create and run migrations
npm --prefix backend run prisma:migrate:dev

# Enter migration name (e.g., "init")
```

This will:
- Create database tables based on the schema
- Generate Prisma client for backend

**Optional**: Open Prisma Studio to view data:
```bash
npm --prefix backend run prisma:studio
```

---

## 🎯 Running the Application

### Option 1: Run Both Frontend & Backend (from root)

```bash
# Terminal 1 - Frontend
npm run dev:frontend
# Runs on http://localhost:3000

# Terminal 2 - Backend
npm run dev:backend
# Runs on http://localhost:5000
```

### Option 2: Run Individually

**Backend**:
```bash
cd backend
npm run dev
```

**Frontend**:
```bash
cd frontend
npm run dev
```

---

## 📁 Project Structure

```
ecommerce-app/
├── .env                          # Root environment variables
├── .env.example                  # Example environment template
├── package.json                  # Root monorepo scripts
│
├── backend/
│   ├── src/
│   │   ├── app.js               # Express app setup
│   │   ├── server.js            # Server entry point
│   │   ├── config/
│   │   │   ├── env.js           # Environment variable loader
│   │   │   ├── prismaClient.js  # Prisma client singleton
│   │   │   └── supabaseClient.js# Supabase client setup
│   │   ├── controllers/
│   │   │   ├── healthController.js      # Health check endpoints
│   │   │   ├── dbController.js          # Database health check
│   │   │   ├── productController.js     # Product CRUD
│   │   │   └── categoryController.js    # Category CRUD
│   │   ├── services/
│   │   │   └── pingService.js
│   │   ├── middlewares/
│   │   │   └── errorHandler.js  # Global error handler
│   │   └── routes/
│   │       ├── healthRoutes.js
│   │       ├── productRoutes.js
│   │       └── categoryRoutes.js
│   ├── prisma/
│   │   └── schema.prisma        # Database schema
│   └── package.json
│
└── frontend/
    ├── app/
    │   ├── layout.tsx           # Root layout
    │   ├── page.tsx             # Home page (status dashboard)
    │   └── globals.css
    ├── lib/
    │   ├── api.ts               # API client for backend
    │   └── supabaseClient.ts    # Supabase client
    ├── public/
    ├── .env.local               # Frontend environment
    └── package.json
```

---

## 🔌 API Endpoints

### Health Checks
- `GET /api/health` - Backend health status
- `GET /api/health/db` - Database & Supabase health

### Products
- `GET /api/products` - List all products (with pagination)
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create new product

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category

---

## 🔐 Database Schema

The Prisma schema includes models for:

- **User**: Store user profiles and authentication
- **Product**: Product listings with price, stock, images
- **Category**: Product categories
- **Order**: Customer orders
- **OrderItem**: Items in each order
- **Review**: Product reviews and ratings

---

## 🐛 Troubleshooting

### Issue: "DATABASE_URL is missing"
**Solution**: Make sure `.env` file is in the root directory with correct DATABASE_URL

### Issue: "SUPABASE_URL is missing"
**Solution**: Check that SUPABASE_URL is set in `.env`

### Issue: "Cannot reach Supabase host"
**Solution**: 
- Verify SUPABASE_URL format: `https://[project-id].supabase.co`
- Check internet connection
- Ensure Supabase project is active

### Issue: Prisma migration errors
**Solution**:
```bash
# Reset the database (WARNING: deletes all data)
npm --prefix backend run prisma:migrate:dev -- --force

# Or manually reset:
npm --prefix backend run prisma:migrate:deploy
```

### Issue: Port already in use
```bash
# Change PORT in .env (e.g., PORT=5001)
# Or kill the process using the port
```

---

## 📚 Next Steps

1. **Add Authentication**:
   - Implement Supabase Auth in frontend
   - Add protected routes

2. **Create Product Pages**:
   - Build product listing page
   - Add product detail pages
   - Implement search and filtering

3. **Shopping Cart**:
   - Implement local cart state (Zustand/Redux)
   - Add cart to database
   - Create checkout flow

4. **Payment Integration**:
   - Add Stripe or similar payment provider
   - Implement payment processing

5. **User Profiles**:
   - Implement user dashboard
   - Order history
   - Account management

---

## 📖 Useful Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Express.js Guide](https://expressjs.com)
- [Tailwind CSS](https://tailwindcss.com)

---

## 🤝 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review your `.env` configuration
3. Check console for error messages
4. Verify all dependencies are installed

---

## 📝 License

This project is open source and available under the MIT License.
