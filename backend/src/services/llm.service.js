import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import { callLLM } from "../config/llm.js";

// ------------------------------
// PATH SETUP
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROMPT_DIR = path.join(__dirname, "../prompts");

// ------------------------------
// LOAD PROMPTS
// ------------------------------
function loadPrompt(fileName) {
  return fs.readFileSync(path.join(PROMPT_DIR, fileName), "utf-8");
}

const sqlPromptTemplate = loadPrompt("sql.prompt.txt");
const guardrailPromptTemplate = loadPrompt("guardrail.prompt.txt");
const responsePromptTemplate = loadPrompt("response.prompt.txt");

// ------------------------------
// CLEAN SQL OUTPUT
// ------------------------------
function cleanSQL(raw) {
  return raw
    .replace(/```sql/g, "")
    .replace(/```/g, "")
    .trim();
}

// ------------------------------
// GENERATE SQL FROM USER QUERY
// ------------------------------
export async function generateSQL(userQuery) {
  const prompt = sqlPromptTemplate.replace(
    "{{USER_QUERY}}",
    userQuery
  );

  const response = await callLLM({
    prompt,
    temperature: 0,
  });

  return cleanSQL(response);
}

// ------------------------------
// VALIDATE SQL USING GUARDRAIL
// ------------------------------
export async function validateSQL(sql) {
  const prompt = guardrailPromptTemplate.replace(
    "{{SQL_QUERY}}",
    sql
  );

  const response = await callLLM({
    prompt,
    temperature: 0,
  });

  try {
    return JSON.parse(response);
  } catch (err) {
    return {
      safe: false,
      reason: "Invalid guardrail response",
    };
  }
}

// ------------------------------
// FORMAT FINAL RESPONSE
// ------------------------------
export async function formatResponse({
  userQuery,
  sql,
  rows,
}) {
  const prompt = responsePromptTemplate
    .replace("{{USER_QUERY}}", userQuery)
    .replace("{{SQL_QUERY}}", sql)
    .replace("{{SQL_RESULT}}", JSON.stringify(rows));

  return await callLLM({
    prompt,
    temperature: 0.3,
  });
}