import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// ------------------------------
// CREATE POOL
// ------------------------------
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "graph_llm",
  password: process.env.DB_PASSWORD || "password",
  port: process.env.DB_PORT || 5432,

  max: 10, // max connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 3000,
});

// ------------------------------
// POOL EVENTS (🔥 IMPORTANT)
// ------------------------------
pool.on("connect", () => {
  console.log("✅ PostgreSQL pool connected");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected DB error:", err.message);
});

// ------------------------------
// TEST CONNECTION (SAFE)
// ------------------------------
export const testDBConnection = async () => {
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("🟢 DB Time:", res.rows[0].now);
  } catch (err) {
    console.error("❌ DB connection failed:", err.message);
  }
};

// ------------------------------
// QUERY FUNCTION (🔥 IMPROVED)
// ------------------------------
export const query = async (text, params = []) => {
  const start = Date.now();

  try {
    console.log("\n📄 Executing Query:");
    console.log(text);
    if (params.length) console.log("🔢 Params:", params);

    const res = await pool.query({
      text,
      values: params,
      statement_timeout: 3000, // 🔥 prevent hanging queries
    });

    const duration = Date.now() - start;

    console.log(`✅ Query executed in ${duration} ms`);
    console.log(`📊 Rows: ${res.rowCount}`);

    return res;
  } catch (err) {
    console.error("❌ Query failed:");
    console.error("Message:", err.message);
    console.error("SQL:", text);

    throw err;
  }
};

// ------------------------------
// TRANSACTION SUPPORT
// ------------------------------
export const withTransaction = async (callback) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const result = await callback(client);

    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");

    console.error("❌ Transaction failed:", err.message);
    throw err;
  } finally {
    client.release();
  }
};

// ------------------------------
export default pool;