import React, { useState } from "react";

import Chat from "../components/Chat";
import GraphView from "../components/GraphView";
import NodeDetails from "../components/NodeDetails";

const Home = () => {
  // ✅ NEW: store full graph instead of orderId
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  // ------------------------------
  // HANDLE GRAPH LOAD FROM CHAT
  // ------------------------------
  const handleGraphLoad = (graph) => {
    console.log("📊 Received graph:", graph);

    if (!graph || !graph.nodes) {
      console.warn("⚠️ Invalid graph received");
      return;
    }

    // ✅ SET GRAPH DIRECTLY
    setGraphData(graph);
    setSelectedNode(null);
  };

  return (
    <div className="home-container">
      {/* LEFT: CHAT */}
      <div className="home-sidebar chat-panel">
        <Chat onGraphLoad={handleGraphLoad} />
      </div>

      {/* CENTER: GRAPH */}
      <div className="home-main">
        {graphData ? (
          <GraphView
            graphData={graphData}   // ✅ FIXED
            setSelectedNode={setSelectedNode}
          />
        ) : (
          <div className="empty-graph animate-fade-in">
            <div className="empty-icon glass-card">📈</div>
            <h3>Graph View</h3>
            <p>Run a query to visualize the data graph</p>
          </div>
        )}
      </div>

      {/* RIGHT: NODE DETAILS */}
      <div className="home-sidebar details-panel">
        <NodeDetails selectedNode={selectedNode} />
      </div>

      <style>{`
        .home-container {
          display: flex;
          height: 100%;
          width: 100%;
          gap: 16px;
          padding: 16px;
          box-sizing: border-box;
          overflow: hidden;
        }

        .home-sidebar {
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .chat-panel {
          flex: 0 0 320px;
          display: flex;
          flex-direction: column;
        }

        .home-main {
          flex: 1;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(8px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.02);
          position: relative;
          overflow: hidden;
        }
        
        @media (prefers-color-scheme: dark) {
          .home-main {
            background: rgba(15, 23, 42, 0.3);
          }
        }

        .details-panel {
          flex: 0 0 280px;
          display: flex;
          flex-direction: column;
        }

        .empty-graph {
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justifyContent: center;
          color: var(--text-muted);
          gap: 12px;
        }
        
        .empty-graph h3 {
          margin: 0;
          font-weight: 500;
        }
        
        .empty-graph p {
          margin: 0;
          font-size: 0.875rem;
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 8px;
          padding: 24px;
          border-radius: 50%;
        }
      `}</style>
    </div>
  );
};

export default Home;
