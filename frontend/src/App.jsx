import React from "react";
import Home from "./pages/Home";
import "./App.css";

const App = () => {
  return (
    <div className="app">
      {/* ------------------------------ */}
      {/* HEADER */}
      {/* ------------------------------ */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-title-group">
            <h1 className="header-title">📊 Graph LLM System</h1>
            <p className="header-subtitle">
              Ask questions → Get insights → Explore relationships
            </p>
          </div>
        </div>
      </header>

      {/* ------------------------------ */}
      {/* MAIN CONTENT */}
      {/* ------------------------------ */}
      <main className="app-content">
        <Home />
      </main>
    </div>
  );
};

export default App;
