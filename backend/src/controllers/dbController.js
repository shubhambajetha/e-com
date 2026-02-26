const env = require("../config/env");
const { supabaseAdmin } = require("../config/supabaseClient");

async function checkSupabaseHostReachability() {
  if (!env.supabaseUrl) {
    return {
      ok: false,
      status: 500,
      message: "SUPABASE_URL is missing in backend/.env",
    };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    let response;
    try {
      response = await fetch(`${env.supabaseUrl}/auth/v1/health`, {
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
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
      details: error.cause?.code || error.message,
    };
  }
}

async function getDatabaseHealth(req, res, next) {
  try {
    const hostCheck = await checkSupabaseHostReachability();
    if (!hostCheck.ok) {
      return res.status(hostCheck.status).json({
        success: false,
        message: hostCheck.message,
        details: hostCheck.details || null,
      });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        message:
          "Supabase admin client is not configured. Check SUPABASE_SERVICE_ROLE_KEY.",
      });
    }

    const { error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    if (error) {
      return res.status(500).json({
        success: false,
        message: "Supabase admin auth failed",
        details: error.message || "Unknown admin error",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Supabase connection is healthy",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getDatabaseHealth,
};
