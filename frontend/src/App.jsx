import React from "react";
import Home from "./pages/Home";

const App = () => {
  return (
    <div style={styles.app}>
      {/* ------------------------------ */}
      {/* HEADER (OPTIONAL BUT IMPRESSIVE) */}
      {/* ------------------------------ */}
      <header style={styles.header}>
        <h1 style={styles.title}>📊 Graph LLM System</h1>
        <p style={styles.subtitle}>
          Ask questions → Get insights → Explore relationships
        </p>
      </header>

      {/* ------------------------------ */}
      {/* MAIN CONTENT */}
      {/* ------------------------------ */}
      <div style={styles.content}>
        <Home />
      </div>
    </div>
  );
};

// ------------------------------
// STYLES
// ------------------------------
const styles = {
  app: {
    fontFamily: "system-ui, -apple-system, sans-serif",
    backgroundColor: "#f9fafb",
    height: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    padding: "10px 20px",
    backgroundColor: "#111827",
    color: "white",
    borderBottom: "1px solid #333",
  },
  title: {
    margin: 0,
    fontSize: "20px",
  },
  subtitle: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af",
  },
  content: {
    flex: 1,
    overflow: "hidden",
  },
};

export default App;