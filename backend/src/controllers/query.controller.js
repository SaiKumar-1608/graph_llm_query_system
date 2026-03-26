import { processUserQuery } from "../services/query.service.js";

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
     * result structure (from service):
     * {
     *   success: true,
     *   data: {
     *     sql,
     *     rowCount,
     *     rows,
     *     summary,
     *     graph
     *   }
     * }
     */

    // ------------------------------
    // RETURN CLEAN RESPONSE
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
