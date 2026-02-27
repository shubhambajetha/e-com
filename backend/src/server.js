const dns = require("node:dns");
const env = require("./config/env");
const prisma = require("./config/prismaClient");
const app = require("./app");

dns.setDefaultResultOrder("ipv4first");

const server = app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port} (${env.nodeEnv})`);
});

async function shutdown(signal) {
  console.log(`Received ${signal}. Shutting down server...`);
  server.close(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
