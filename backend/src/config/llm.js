import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

// ------------------------------
// INIT OPENAI CLIENT
// ------------------------------
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ------------------------------
// GENERIC LLM CALL FUNCTION
// ------------------------------
export async function callLLM({
  prompt,
  temperature = 0,
  max_tokens = 500,
}) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // fast + good for backend tasks
      messages: [
        {
          role: "system",
          content: "You are a helpful AI assistant for data querying.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature,
      max_tokens,
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error("❌ LLM Error:", error.message);

    throw new Error("LLM request failed");
  }
}

// ------------------------------
// SQL GENERATION HELPER
// ------------------------------
export async function generateSQLFromPrompt(prompt) {
  return await callLLM({
    prompt,
    temperature: 0, // deterministic
  });
}

// ------------------------------
// RESPONSE FORMATTER HELPER
// ------------------------------
export async function formatResponseFromPrompt(prompt) {
  return await callLLM({
    prompt,
    temperature: 0.3,
  });
}