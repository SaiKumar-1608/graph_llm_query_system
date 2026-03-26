import React, { useState } from "react";
import { sendQuery } from "../services/api";
import "./Chat.css";

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
      const data = res.data.data;

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
    <div className="chat-container">
      <div className="chat-header">
        <h2 className="chat-title">🧠 Ask Your Data</h2>
      </div>

      <div className="chat-content">
        {/* INPUT FORM */}
        <form onSubmit={handleSubmit} className="chat-form">
          <input
            type="text"
            placeholder="Try: 'Show orders for customer 310000109'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="chat-input"
            disabled={loading}
          />
          <button type="submit" className="chat-button" disabled={loading}>
            {loading ? "Loading..." : "Ask"}
          </button>
        </form>

        {/* ERROR STATE */}
        {error && (
          <div className="chat-error">
            <span className="error-icon">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* RESPONSE RESULTS */}
        {response && (
          <div className="chat-response">
            {/* SUMMARY SECTION */}
            <div className="response-section">
              <h3 className="section-title">📊 Summary</h3>
              <p className="section-content">
                {response.summary || "No summary available"}
              </p>
            </div>

            {/* SQL SECTION */}
            <div className="response-section">
              <h3 className="section-title">🧾 Generated SQL</h3>
              <pre className="sql-box">
                {response.sql || "No SQL generated"}
              </pre>
            </div>

            {/* ROW COUNT SECTION */}
            <div className="response-section">
              <h3 className="section-title">📦 Results</h3>
              <p className="section-content">
                <strong>{response.rowCount ?? 0}</strong> rows returned
              </p>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {!response && !error && (
          <div className="chat-empty">
            <p>✨ Ask a question about your data to get started</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
