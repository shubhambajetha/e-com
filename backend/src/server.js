const dns = require("node:dns");
const env = require("./config/env");
const app = require("./app");

dns.setDefaultResultOrder("ipv4first");

app.listen(env.port, () => {
  console.log(`Backend running on port ${env.port} (${env.nodeEnv})`);
});
