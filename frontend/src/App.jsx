import React from "react";
import Home from "./pages/Home";

const App = () => {
  return (
    <div className="app-container">
      {/* ------------------------------ */}
      {/* HEADER (PREMIUM GLASSMORPHISM) */}
      {/* ------------------------------ */}
      <header className="glass-panel app-header">
        <div className="header-content">
          <h1 className="title">
            <span className="icon">📊</span>
            Graph LLM System
          </h1>
          <p className="subtitle">
            Ask questions &rarr; Get insights &rarr; Explore relationships
          </p>
        </div>
      </header>

      {/* ------------------------------ */}
      {/* MAIN CONTENT */}
      {/* ------------------------------ */}
      <main className="main-content">
        <Home />
      </main>

      {/* ------------------------------ */}
      {/* STYLES FOR APP (COMPONENT LEVEL) */}
      {/* ------------------------------ */}
      <style>{`
        .app-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
        }

        .app-header {
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 12px 24px;
          border-left: none;
          border-right: none;
          border-top: none;
        }

        .header-content {
          display: flex;
          align-items: baseline;
          gap: 16px;
        }

        .title {
          font-size: 1.25rem;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .icon {
          font-size: 1.5rem;
        }

        .subtitle {
          margin: 0;
          font-size: 0.875rem;
          font-weight: 500;
          opacity: 0.8;
        }

        .main-content {
          flex: 1;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default App;