import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ------------------------------
// PATH SETUP
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_DIR = path.join(__dirname, "../../logs");

// Ensure log folders exist
function ensureLogDirs() {
  const dirs = ["app", "error", "ai_sessions"];

  dirs.forEach((dir) => {
    const fullPath = path.join(LOG_DIR, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }
  });
}

ensureLogDirs();

// ------------------------------
// FORMATTER
// ------------------------------
function formatMessage(level, message, meta = {}) {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  });
}

// ------------------------------
// WRITE TO FILE
// ------------------------------
function writeLog(file, content) {
  const filePath = path.join(LOG_DIR, file);
  fs.appendFileSync(filePath, content + "\n");
}

// ------------------------------
// LOGGER METHODS
// ------------------------------
export const logger = {
  info(message, meta = {}) {
    const log = formatMessage("INFO", message, meta);
    console.log("ℹ️", message);
    writeLog("app/app.log", log);
  },

  error(message, meta = {}) {
    const log = formatMessage("ERROR", message, meta);
    console.error("❌", message);
    writeLog("error/error.log", log);
  },

  debug(message, meta = {}) {
    const log = formatMessage("DEBUG", message, meta);
    console.log("🐞", message);
    writeLog("app/debug.log", log);
  },
};

// ------------------------------
// AI SESSION LOGGER (IMPORTANT)
// ------------------------------
export function logAISession(data) {
  try {
    const fileName = `session_${Date.now()}.json`;
    const filePath = path.join(LOG_DIR, "ai_sessions", fileName);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log("🧠 AI session logged:", fileName);
  } catch (err) {
    console.warn("⚠️ Failed to log AI session:", err.message);
  }
}