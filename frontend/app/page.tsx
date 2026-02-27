'use client';

import { useEffect, useState } from 'react';
import { apiClient, HealthResponse, DatabaseHealthResponse } from '@/lib/api';

export default function Home() {
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);
  const [dbHealth, setDbHealth] = useState<DatabaseHealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [backend, db] = await Promise.allSettled([
          apiClient.getHealth(),
          apiClient.getDatabaseHealth(),
        ]);

        if (backend.status === 'fulfilled') {
          setBackendHealth(backend.value);
        } else {
          setError('Backend health check failed');
        }

        if (db.status === 'fulfilled') {
          setDbHealth(db.value);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Connection failed');
      } finally {
        setLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800">
      <header className="border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Ecommerce App
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Full-stack application with Next.js, Express, Prisma & Supabase
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Backend Status */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Backend Status
            </h2>
            
            {loading ? (
              <div className="text-slate-600 dark:text-slate-400">Loading...</div>
            ) : error ? (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            ) : backendHealth ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {backendHealth.message}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(backendHealth.timestamp).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400">No data</div>
            )}
          </div>

          {/* Database Status */}
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              Database Status
            </h2>
            
            {loading ? (
              <div className="text-slate-600 dark:text-slate-400">Loading...</div>
            ) : dbHealth ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${dbHealth.success ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {dbHealth.message}
                  </span>
                </div>
                {dbHealth.supabaseAuthMode && (
                  <div className="text-sm">
                    <p className="text-slate-600 dark:text-slate-400">
                      Auth Mode: <span className="font-medium">{dbHealth.supabaseAuthMode}</span>
                    </p>
                  </div>
                )}
                {dbHealth.warnings && dbHealth.warnings.length > 0 && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-3">
                    {dbHealth.warnings.map((warning, idx) => (
                      <p key={idx} className="text-sm text-yellow-800 dark:text-yellow-200">
                        ⚠️ {warning}
                      </p>
                    ))}
                  </div>
                )}
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {new Date(dbHealth.timestamp).toLocaleString()}
                </p>
              </div>
            ) : (
              <div className="text-slate-500 dark:text-slate-400">No data</div>
            )}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            📚 Quick Start Guide
          </h2>
          
          <div className="space-y-6">
            <section>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                1. Setup Environment Variables
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-2">
                Copy <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">.env.example</code> to <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">.env</code> and fill in your Supabase credentials:
              </p>
              <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-1">
                <li>DATABASE_URL (PostgreSQL from Supabase)</li>
                <li>SUPABASE_URL & SUPABASE_ANON_KEY</li>
                <li>NEXT_PUBLIC_SUPABASE_URL & NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                2. Setup Database
              </h3>
              <pre className="bg-slate-100 dark:bg-slate-700 p-4 rounded overflow-x-auto text-sm">
                <code>{`# Generate Prisma client
npm --prefix backend run prisma:generate

# Run migrations
npm --prefix backend run prisma:migrate:dev

# (Optional) Open Prisma Studio
npm --prefix backend run prisma:studio`}</code>
              </pre>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                3. Install Dependencies & Run
              </h3>
              <pre className="bg-slate-100 dark:bg-slate-700 p-4 rounded overflow-x-auto text-sm">
                <code>{`# Install all dependencies
npm install

# Run frontend in dev mode
npm run dev:frontend

# In another terminal, run backend
npm run dev:backend`}</code>
              </pre>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                📖 Project Structure
              </h3>
              <pre className="bg-slate-100 dark:bg-slate-700 p-4 rounded overflow-x-auto text-sm text-slate-700 dark:text-slate-300">
                <code>{`ecommerce-app/
├── backend/
│   ├── src/
│   │   ├── config/       # Database & Supabase config
│   │   ├── controllers/  # Route handlers
│   │   ├── services/     # Business logic
│   │   ├── middlewares/  # Express middlewares
│   │   └── routes/       # API routes
│   └── prisma/           # Database schema
└── frontend/
    ├── app/              # Next.js app directory
    ├── lib/              # Utilities & API client
    └── public/           # Static files`}</code>
              </pre>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
