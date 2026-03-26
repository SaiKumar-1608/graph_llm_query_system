import { validateSQL as llmValidateSQL } from "./llm.service.js";

// ------------------------------
// BASIC RULE-BASED VALIDATION (FAST)
// ------------------------------
function basicSQLCheck(sql) {
  const lowerSQL = sql.toLowerCase().trim();

  // ❌ Block dangerous keywords
  const forbidden = [
    "insert",
    "update",
    "delete",
    "drop",
    "alter",
    "truncate",
    "create",
    "grant",
    "revoke",
  ];

  for (const keyword of forbidden) {
    if (lowerSQL.includes(keyword)) {
      return {
        safe: false,
        reason: `Forbidden keyword detected: ${keyword}`,
      };
    }
  }

  // ❌ Must start with SELECT
  if (!lowerSQL.startsWith("select")) {
    return {
      safe: false,
      reason: "Only SELECT queries are allowed",
    };
  }

  return {
    safe: true,
    reason: "Basic validation passed",
  };
}

// ------------------------------
// MAIN VALIDATION FUNCTION
// ------------------------------
export async function validateQuery(sql) {
  try {
    // ------------------------------
    // STEP 1: BASIC CHECK (FAST)
    // ------------------------------
    const basicCheck = basicSQLCheck(sql);

    if (!basicCheck.safe) {
      return basicCheck;
    }

    // ------------------------------
    // STEP 2: LLM GUARDRAIL CHECK
    // ------------------------------
    const llmResult = await llmValidateSQL(sql);

    if (!llmResult.safe) {
      return llmResult;
    }

    // ------------------------------
    // FINAL RESULT
    // ------------------------------
    return {
      safe: true,
      reason: "SQL passed all validation checks",
    };
  } catch (error) {
    console.error("❌ Guardrail Error:", error.message);

    return {
      safe: false,
      reason: "Guardrail validation failed",
    };
  }
}