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
    <div className="chat-container">
      <h2 className="chat-title">
        <span className="icon">🧠</span>
        Ask Your Data
      </h2>

      {/* INPUT */}
      <form onSubmit={handleSubmit} className="chat-form">
        <input
          type="text"
          placeholder="Try: 'Show orders for customer 310000109'"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="chat-input"
          disabled={loading}
        />
        <button type="submit" className={`chat-button ${loading ? "loading" : ""}`} disabled={loading}>
          {loading ? "..." : "Ask"}
        </button>
      </form>

      {/* ERROR */}
      {error && <div className="chat-error animate-fade-in">❌ {error}</div>}

      {/* RESPONSE */}
      {response && (
        <div className="response-box animate-fade-in">
          {/* SUMMARY */}
          <div className="glass-card response-section">
            <h3 className="section-title">📊 Summary</h3>
            <p className="summary-text">{response.summary || "No summary available"}</p>
          </div>

          {/* SQL */}
          <div className="glass-card response-section">
            <h3 className="section-title">🧾 Generated SQL</h3>
            <pre className="sql-box">
              <code>{response.sql || "No SQL generated"}</code>
            </pre>
          </div>

          {/* ROW COUNT */}
          <div className="glass-card response-section row-count-card">
            <div className="row-icon">📦</div>
            <div className="row-info">
              <h3 className="section-title">Row Count</h3>
              <p>{response.rowCount ?? 0} rows returned</p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .chat-container {
          padding: 24px 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .chat-title {
          font-size: 1.25rem;
          margin-top: 0;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .chat-form {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 24px;
        }

        .chat-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          background: rgba(255, 255, 255, 0.5);
          color: var(--text-main);
          font-family: inherit;
          font-size: 0.95rem;
          outline: none;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
          transition: all 0.2s ease;
        }

        @media (prefers-color-scheme: dark) {
          .chat-input {
            background: rgba(0, 0, 0, 0.2);
          }
        }

        .chat-input:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px var(--primary-glow);
        }

        .chat-button {
          padding: 14px 20px;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 600;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 12px var(--primary-glow);
        }

        .chat-button:hover:not(:disabled) {
          background: var(--primary-hover);
          transform: translateY(-1px);
          box-shadow: 0 6px 16px var(--primary-glow);
        }

        .chat-button:active:not(:disabled) {
          transform: translateY(1px);
          box-shadow: 0 2px 8px var(--primary-glow);
        }

        .chat-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          box-shadow: none;
        }
        
        .chat-button.loading {
          animation: pulse 1.5s infinite;
        }
        
        @keyframes pulse {
          0% { opacity: 0.7; }
          50% { opacity: 0.9; }
          100% { opacity: 0.7; }
        }

        .chat-error {
          color: var(--error);
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 24px;
          font-size: 0.9rem;
        }

        .response-box {
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding-bottom: 20px;
        }

        .response-section {
          padding: 16px;
        }

        .section-title {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .summary-text {
          font-size: 0.95rem;
          line-height: 1.6;
        }

        .sql-box {
          margin: 0;
          border-radius: 8px;
        }
        
        .row-count-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px;
        }
        
        .row-icon {
          font-size: 2rem;
          background: rgba(0,0,0,0.05);
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
        }
        
        @media (prefers-color-scheme: dark) {
          .row-icon {
            background: rgba(255,255,255,0.05);
          }
        }
        
        .row-info p {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-main);
          margin: 0;
        }
        
        .row-info h3 {
          margin-bottom: 4px;
        }
      `}</style>
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

