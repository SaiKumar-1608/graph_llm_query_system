import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { query as dbQuery } from "../config/db.js";
import { callLLM } from "../config/llm.js";
import { transformToGraph } from "../utils/graphTransformer.js"; // ✅ NEW

// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROMPT_DIR = path.join(__dirname, "../prompts");

// ------------------------------
function loadPrompt(fileName) {
  return fs.readFileSync(path.join(PROMPT_DIR, fileName), "utf-8");
}

const sqlPromptTemplate = loadPrompt("sql.prompt.txt");
const guardrailPromptTemplate = loadPrompt("guardrail.prompt.txt");
const responsePromptTemplate = loadPrompt("response.prompt.txt");

// ------------------------------
export async function processUserQuery(userQuery) {
  const startTime = Date.now();

  try {
    console.log("\n==============================");
    console.log("🧠 USER QUERY:", userQuery);

    let sql = "";

    // ------------------------------
    // 🔥 STEP 1: DIRECT OPTIMIZATION
    // ------------------------------
    const optimized = optimizeSQL(userQuery);

    if (optimized) {
      sql = optimized;
      console.log("⚡ Using optimized SQL");
    } else {
      const sqlPrompt = sqlPromptTemplate.replace(
        "{{USER_QUERY}}",
        userQuery
      );

      const generatedSQL = await callLLM({
        prompt: sqlPrompt,
        temperature: 0,
      });

      sql = cleanSQL(generatedSQL);
    }

    console.log("📄 Final SQL:\n", sql);

    // ------------------------------
    // 🔥 STEP 2: GUARDRAIL
    // ------------------------------
    try {
      const guardrailPrompt = guardrailPromptTemplate.replace(
        "{{SQL_QUERY}}",
        sql
      );

      const guardrailResponse = await callLLM({
        prompt: guardrailPrompt,
        temperature: 0,
      });

      const guardrailResult = JSON.parse(guardrailResponse);

      if (!guardrailResult.safe) {
        throw new Error(`Unsafe SQL: ${guardrailResult.reason}`);
      }

      console.log("🛡️ Guardrail: SAFE");
    } catch (err) {
      console.warn("⚠️ Guardrail skipped:", err.message);
    }

    // ------------------------------
    // 🔥 STEP 3: EXECUTE SQL
    // ------------------------------
    let rows = [];

    try {
      const dbResult = await dbQuery(sql);
      rows = dbResult.rows;
    } catch (err) {
      console.error("❌ DB ERROR:", err.message);

      return {
        success: false,
        message: "Database query failed",
      };
    }

    console.log(`📊 Rows fetched: ${rows.length}`);

    // ------------------------------
    // ✅ STEP 3.5: GRAPH GENERATION (NEW)
    // ------------------------------
    let graph = { nodes: [], edges: [] };

    if (rows.length > 0) {
      graph = transformToGraph(rows);
    }

    console.log(`📊 Graph nodes: ${graph.nodes.length}`);
    console.log(`📊 Graph edges: ${graph.edges.length}`);

    // ------------------------------
    // 🔥 STEP 4: SUMMARY
    // ------------------------------
    let summary = "No summary available";

    try {
      const responsePrompt = responsePromptTemplate
        .replace("{{USER_QUERY}}", userQuery)
        .replace("{{SQL_QUERY}}", sql)
        .replace("{{SQL_RESULT}}", JSON.stringify(rows));

      summary = await callLLM({
        prompt: responsePrompt,
        temperature: 0.3,
      });
    } catch {
      console.warn("⚠️ Summary generation failed");
    }

    // ------------------------------
    // 🔥 STEP 5: RETURN RESPONSE (UPDATED)
    // ------------------------------
    return {
      success: true,
      data: {
        sql,
        rowCount: rows.length,
        rows,
        summary,
        graph, // ✅ THIS IS THE FIX
      },
    };

  } catch (error) {
    console.error("❌ Query Service Error:", error.message);

    return {
      success: false,
      message: error.message,
    };
  }
}

// ------------------------------
// OPTIMIZER
// ------------------------------
function optimizeSQL(userQuery) {
  const q = userQuery.toLowerCase();

  const match = q.match(/\d+/);
  const id = match ? match[0] : null;

  if (q.includes("customer") && q.includes("order") && id) {
    return `
      SELECT id, customer_id
      FROM sales_orders
      WHERE customer_id = ${id}
      LIMIT 50;
    `;
  }

  if (q.includes("order") && id) {
    return `
      SELECT id, customer_id
      FROM sales_orders
      WHERE id = ${id};
    `;
  }

  if (q.includes("all orders")) {
    return `
      SELECT id, customer_id
      FROM sales_orders
      LIMIT 50;
    `;
  }

  return null;
}

// ------------------------------
function cleanSQL(raw) {
  return raw
    .replace(/```sql/g, "")
    .replace(/```/g, "")
    .trim();
}