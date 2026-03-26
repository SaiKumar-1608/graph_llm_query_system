//
// SQL VALIDATOR UTILITY
// Strict rule-based validation (no LLM)
//

/**
 * Normalize SQL string
 */
function normalize(sql) {
  return sql
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/**
 * Check for forbidden keywords
 */
function containsForbiddenKeywords(sql) {
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
    "execute",
  ];

  return forbidden.find((keyword) => sql.includes(keyword));
}

/**
 * Check multiple statements
 */
function hasMultipleStatements(sql) {
  return sql.split(";").filter((s) => s.trim()).length > 1;
}

/**
 * Check system table access
 */
function accessingSystemTables(sql) {
  const systemTables = ["pg_catalog", "information_schema"];

  return systemTables.find((tbl) => sql.includes(tbl));
}

/**
 * Check comment injection
 */
function hasSQLComments(sql) {
  return sql.includes("--") || sql.includes("/*");
}

/**
 * Validate SQL query
 */
export function validateSQLQuery(sql) {
  try {
    if (!sql || typeof sql !== "string") {
      return {
        valid: false,
        reason: "SQL must be a non-empty string",
      };
    }

    const normalized = normalize(sql);

    // ------------------------------
    // MUST START WITH SELECT
    // ------------------------------
    if (!normalized.startsWith("select")) {
      return {
        valid: false,
        reason: "Only SELECT queries are allowed",
      };
    }

    // ------------------------------
    // FORBIDDEN KEYWORDS
    // ------------------------------
    const forbidden = containsForbiddenKeywords(normalized);
    if (forbidden) {
      return {
        valid: false,
        reason: `Forbidden keyword detected: ${forbidden}`,
      };
    }

    // ------------------------------
    // MULTIPLE STATEMENTS
    // ------------------------------
    if (hasMultipleStatements(normalized)) {
      return {
        valid: false,
        reason: "Multiple SQL statements are not allowed",
      };
    }

    // ------------------------------
    // SYSTEM TABLE ACCESS
    // ------------------------------
    const systemAccess = accessingSystemTables(normalized);
    if (systemAccess) {
      return {
        valid: false,
        reason: `Access to system table is restricted: ${systemAccess}`,
      };
    }

    // ------------------------------
    // COMMENT INJECTION
    // ------------------------------
    if (hasSQLComments(normalized)) {
      return {
        valid: false,
        reason: "SQL comments are not allowed",
      };
    }

    // ------------------------------
    // SAFE QUERY
    // ------------------------------
    return {
      valid: true,
      reason: "SQL passed validation",
    };
  } catch (error) {
    return {
      valid: false,
      reason: "SQL validation failed",
    };
  }
}