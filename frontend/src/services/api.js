import axios from "axios";

// ------------------------------
// BASE URL FROM ENV
// ------------------------------
const BASE_URL = import.meta.env.VITE_API_URL;

// ------------------------------
// AXIOS INSTANCE (FIX)
// ------------------------------
const API = axios.create({
  baseURL: BASE_URL,
});

// ------------------------------
// QUERY API
// ------------------------------
export const sendQuery = async (query) => {
  try {
    const res = await API.post("/api/query", { query });
    return res;
  } catch (err) {
    console.error("❌ Query API error:", err);
    throw err;
  }
};

// ------------------------------
// GRAPH API (OPTIONAL)
// ------------------------------
export const getGraph = async (orderId) => {
  try {
    const res = await API.get(`/api/graph/${orderId}`);
    console.log("📦 GRAPH API RESPONSE:", res.data);
    return res;
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
    const res = await API.get(`/api/graph/expand/${nodeId}`);
    console.log("📦 EXPAND API RESPONSE:", res.data);
    return res;
  } catch (err) {
    console.error("❌ Expand API error:", err);
    throw err;
  }
};
