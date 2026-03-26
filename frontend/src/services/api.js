import axios from "axios";

// ------------------------------
// AXIOS INSTANCE
// ------------------------------
const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

// ------------------------------
// QUERY API
// ------------------------------
export const sendQuery = async (query) => {
  try {
    const res = await API.post("/query", { query });
    return res; // ✅ return full response
  } catch (err) {
    console.error("❌ Query API error:", err);
    throw err;
  }
};

// ------------------------------
// GRAPH API
// ------------------------------
export const getGraph = async (orderId) => {
  try {
    const res = await API.get(`/graph/${orderId}`);

    console.log("📦 GRAPH API RESPONSE:", res.data);

    return res; // ✅ IMPORTANT: return full response
  } catch (err) {
    console.error("❌ Graph API error:", err);
    throw err;
  }
};

// ------------------------------
// EXPAND NODE API
// ------------------------------
export const expandNode = async (nodeId) => {
  try {
    const res = await API.get(`/graph/expand/${nodeId}`);

    console.log("📦 EXPAND API RESPONSE:", res.data);

    return res; // ✅ IMPORTANT
  } catch (err) {
    console.error("❌ Expand API error:", err);
    throw err;
  }
};