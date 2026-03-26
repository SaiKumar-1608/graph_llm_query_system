import React, { useState } from "react";
import { sendQuery } from "../services/api";

const Chat = ({ onGraphLoad }) => {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // ------------------------------
  // HANDLE SUBMIT
  // ------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const res = await sendQuery(query);

      // ✅ FIXED: Correct path
      const data = res.data.data?.data;

      console.log("📦 API Response:", data);

      // ------------------------------
      // HANDLE BACKEND ERROR
      // ------------------------------
      if (!data) {
        setError("No data received from server");
        return;
      }

      setResponse(data);

      // ------------------------------
      // 🔥 GRAPH TRIGGER (FINAL FIX)
      // ------------------------------
      if (data?.graph && onGraphLoad) {
        console.log("🚀 Sending graph to GraphView");

        // ✅ DIRECT GRAPH (NO ID CALL)
        onGraphLoad(data.graph);
      } else {
        console.warn("⚠️ No graph data found");
      }

    } catch (err) {
      console.error("❌ Query error:", err);

      const msg =
        err?.response?.data?.message ||
        "Something went wrong while processing the query.";

      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2>🧠 Ask Your Data</h2>

      {/* INPUT */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Try: 'Show orders for customer 310000109'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Loading..." : "Ask"}
        </button>
      </form>

      {/* ERROR */}
      {error && <p style={styles.error}>❌ {error}</p>}

      {/* RESPONSE */}
      {response && (
        <div style={styles.responseBox}>
          {/* SUMMARY */}
          <div style={styles.section}>
            <h3>📊 Summary</h3>
            <p>{response.summary || "No summary available"}</p>
          </div>

          {/* SQL */}
          <div style={styles.section}>
            <h3>🧾 Generated SQL</h3>
            <pre style={styles.sqlBox}>
              {response.sql || "No SQL generated"}
            </pre>
          </div>

          {/* ROW COUNT */}
          <div style={styles.section}>
            <h3>📦 Rows</h3>
            <p>{response.rowCount ?? 0} rows returned</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ------------------------------
// STYLES
// ------------------------------
const styles = {
  container: {
    padding: "20px",
    borderRight: "1px solid #ddd",
    height: "100vh",
    overflowY: "auto",
    background: "#fafafa",
  },
  form: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px 16px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  responseBox: {
    marginTop: "20px",
  },
  section: {
    marginBottom: "20px",
  },
  sqlBox: {
    background: "#f5f5f5",
    padding: "10px",
    borderRadius: "6px",
    overflowX: "auto",
    fontSize: "12px",
  },
  error: {
    color: "red",
  },
};

export default Chat;
