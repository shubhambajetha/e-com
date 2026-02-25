const { createClient } = require("@supabase/supabase-js");
const env = require("./env");

function buildClient(url, key) {
  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

const supabaseAnon = buildClient(env.supabaseUrl, env.supabaseAnonKey);
const supabaseAdmin = buildClient(env.supabaseUrl, env.supabaseServiceRoleKey);

module.exports = {
  supabaseAnon,
  supabaseAdmin,
};
