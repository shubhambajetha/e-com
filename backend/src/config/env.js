const fs = require("node:fs");
const path = require("node:path");
const dotenv = require("dotenv");

const envPath = path.resolve(__dirname, "../../.env");
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config();
}

function cleanEnvValue(value) {
  if (!value) {
    return "";
  }

  return String(value).trim().replace(/^['"]|['"]$/g, "");
}

function resolvePort(value, fallbackPort) {
  const parsedPort = Number.parseInt(value, 10);
  return Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : fallbackPort;
}

function deriveSupabaseUrlFromDatabaseUrl(databaseUrl) {
  if (!databaseUrl) {
    return "";
  }

  try {
    const { hostname } = new URL(databaseUrl);
    const prefix = "db.";
    const suffix = ".supabase.co";

    if (!hostname.startsWith(prefix) || !hostname.endsWith(suffix)) {
      return "";
    }

    const projectRef = hostname.slice(prefix.length, -suffix.length);
    return projectRef ? `https://${projectRef}.supabase.co` : "";
  } catch {
    return "";
  }
}

const databaseUrl = cleanEnvValue(
  process.env.DATABASE_URL || process.env.SUPABASE_DB_URL
);
const explicitSupabaseUrl = cleanEnvValue(process.env.SUPABASE_URL);
const derivedSupabaseUrl = deriveSupabaseUrlFromDatabaseUrl(databaseUrl);

const env = {
  port: resolvePort(process.env.PORT, 5000),
  nodeEnv: cleanEnvValue(process.env.NODE_ENV) || "development",
  frontendUrl: cleanEnvValue(process.env.FRONTEND_URL) || "http://localhost:3000",
  databaseUrl,
  supabaseUrl: explicitSupabaseUrl || derivedSupabaseUrl,
  supabaseAnonKey: cleanEnvValue(process.env.SUPABASE_ANON_KEY),
  supabaseServiceRoleKey: cleanEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY),
};

module.exports = env;
