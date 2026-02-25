const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const healthRoutes = require("./routes/healthRoutes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);
app.use(express.json());

app.use("/api", healthRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Ecommerce backend API",
  });
});

app.use(errorHandler);

module.exports = app;
