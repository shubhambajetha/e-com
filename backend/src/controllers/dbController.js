const env = require("../config/env");
const prisma = require("../config/prismaClient");

const REQUEST_TIMEOUT_MS = 10000;

function getFetchTimeoutController() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  return {
    controller,
    clear() {
      clearTimeout(timeout);
    },
  };
}

function formatErrorDetails(error) {
  return error?.cause?.code || error?.message || "Unknown error";
}

async function checkSupabaseHostReachability() {
  if (!env.supabaseUrl) {
    return {
      ok: false,
      status: 500,
      message: "SUPABASE_URL is missing in backend/.env",
    };
  }

  try {
    const timeoutRef = getFetchTimeoutController();

    let response;
    try {
      response = await fetch(`${env.supabaseUrl}/auth/v1/health`, {
        signal: timeoutRef.controller.signal,
      });
    } finally {
      timeoutRef.clear();
    }

    if (!response.ok) {
      return {
        ok: false,
        status: 502,
        message: `Supabase host responded with status ${response.status}`,
      };
    }

    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      message: "Cannot reach Supabase host over HTTPS (443)",
      details: formatErrorDetails(error),
    };
  }
}

async function checkSupabaseApiAccess() {
  const supabaseKey = env.supabaseServiceRoleKey || env.supabaseAnonKey;
  if (!supabaseKey) {
    return {
      ok: true,
      warning:
        "SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY is missing. Skipping Supabase REST key validation.",
    };
  }

  try {
    const timeoutRef = getFetchTimeoutController();
    let response;

    try {
      response = await fetch(`${env.supabaseUrl}/rest/v1/`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        signal: timeoutRef.controller.signal,
      });
    } finally {
      timeoutRef.clear();
    }

    if (!response.ok) {
      return {
        ok: false,
        status: 502,
        message: `Supabase REST API responded with status ${response.status}`,
      };
    }

    return {
      ok: true,
      authMode: env.supabaseServiceRoleKey ? "service_role" : "anon",
    };
  } catch (error) {
    return {
      ok: false,
      status: 502,
      message: "Supabase REST API request failed",
      details: formatErrorDetails(error),
    };
  }
}

async function checkPrismaConnection() {
  if (!env.databaseUrl) {
    return {
      ok: false,
      status: 500,
      message: "DATABASE_URL is missing in backend/.env",
    };
  }

  try {
    await prisma.$queryRaw`SELECT 1`;
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      message: "Prisma database connection failed",
      details: formatErrorDetails(error),
    };
  }
}

async function getDatabaseHealth(req, res, next) {
  try {
    const prismaCheck = await checkPrismaConnection();
    if (!prismaCheck.ok) {
      return res.status(prismaCheck.status).json({
        success: false,
        message: prismaCheck.message,
        details: prismaCheck.details || null,
      });
    }

    const hostCheck = await checkSupabaseHostReachability();
    if (!hostCheck.ok) {
      return res.status(hostCheck.status).json({
        success: false,
        message: hostCheck.message,
        details: hostCheck.details || null,
      });
    }

    const supabaseApiCheck = await checkSupabaseApiAccess();
    if (!supabaseApiCheck.ok) {
      return res.status(supabaseApiCheck.status).json({
        success: false,
        message: supabaseApiCheck.message,
        details: supabaseApiCheck.details || null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Prisma + Supabase connection is healthy",
      supabaseAuthMode: supabaseApiCheck.authMode || "not-configured",
      warnings: supabaseApiCheck.warning ? [supabaseApiCheck.warning] : [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDatabaseHealth,
};
