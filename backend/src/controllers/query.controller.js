import { processUserQuery } from "../services/query.service.js";
import { transformToGraph } from "../utils/graphTransformer.js";

// ------------------------------
// HANDLE USER QUERY (MAIN API)
// ------------------------------
export async function handleQuery(req, res) {
  try {
    const { query } = req.body;

    // ------------------------------
    // VALIDATION
    // ------------------------------
    if (!query || typeof query !== "string") {
      return res.status(400).json({
        success: false,
        message: "Valid query is required",
      });
    }

    console.log("\n🧠 Incoming Query:", query);

    // ------------------------------
    // PROCESS QUERY (LLM + DB)
    // ------------------------------
    const result = await processUserQuery(query);

    /**
     * Expected result structure (based on your logs):
     * {
     *   summary,
     *   sql,
     *   rows
     * }
     */

    const rows = result.rows || [];

    console.log("📊 Rows fetched:", rows.length);

    // ------------------------------
    // ✅ TRANSFORM TO GRAPH (NEW)
    // ------------------------------
    let graph = { nodes: [], edges: [] };

    if (rows.length > 0) {
      graph = transformToGraph(rows);
    }

    console.log("📊 Graph nodes:", graph.nodes.length);
    console.log("📊 Graph edges:", graph.edges.length);

    // ------------------------------
    // RESPONSE
    // ------------------------------
    return res.status(200).json(result);
    

  } catch (error) {
    console.error("❌ Query Processing Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to process query",
    });
  }
}