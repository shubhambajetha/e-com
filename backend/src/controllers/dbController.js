const { supabaseAdmin } = require("../config/supabaseClient");

async function getDatabaseHealth(req, res, next) {
  try {
    if (!supabaseAdmin) {
      return res.status(500).json({
        success: false,
        message: "Supabase is not configured. Check environment variables.",
      });
    }

    const { error } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1,
    });

    if (error) {
      throw error;
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
