import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import queryRoutes from "./routes/query.routes.js";
import graphRoutes from "./routes/graph.routes.js";

import { logger } from "./utils/logger.js";
import { testDBConnection } from "./config/db.js";

// ------------------------------
// LOAD ENV VARIABLES
// ------------------------------
dotenv.config();

// ------------------------------
// INIT APP
// ------------------------------
const app = express();

// ------------------------------
// MIDDLEWARE
// ------------------------------
app.use(cors());
app.use(express.json());

// ------------------------------
// 🔥 REQUEST LOGGER (IMPROVED)
// ------------------------------
app.use((req, res, next) => {
  logger.info("📥 Incoming Request", {
    method: req.method,
    url: req.url,
    body: req.method === "POST" ? req.body : undefined,
  });
  next();
});

// ------------------------------
// HEALTH CHECK
// ------------------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Graph LLM Backend Running 🚀",
  });
});

// ------------------------------
// ROUTES
// ------------------------------
app.use("/api/query", queryRoutes);
app.use("/api/graph", graphRoutes);

// ------------------------------
// 404 HANDLER
// ------------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// ------------------------------
// 🔥 GLOBAL ERROR HANDLER (IMPROVED)
// ------------------------------
app.use((err, req, res, next) => {
  logger.error("❌ Unhandled Error", {
    message: err.message,
    stack: err.stack,
  });

  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// ------------------------------
// START SERVER
// ------------------------------
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // 🔥 DB CONNECTION TEST
    await testDBConnection();

    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    logger.error("❌ Failed to start server", {
      error: err.message,
    });
    process.exit(1);
  }
};

startServer();