import React, { useState } from "react";
import Chat from "../components/Chat";
import GraphView from "../components/GraphView";
import NodeDetails from "../components/NodeDetails";
import "./Home.css";

const Home = () => {
  const [graphData, setGraphData] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const handleGraphLoad = (graph) => {
    console.log("📊 Received graph:", graph);

    if (!graph || !graph.nodes) {
      console.warn("⚠️ Invalid graph received");
      return;
    }

    setGraphData(graph);
    setSelectedNode(null);
  };

  return (
    <div className="home-container">
      {/* LEFT: CHAT PANEL */}
      <aside className="home-chat">
        <Chat onGraphLoad={handleGraphLoad} />
      </aside>

      {/* CENTER: GRAPH VISUALIZATION */}
      <main className="home-graph">
        {graphData ? (
          <GraphView
            graphData={graphData}
            setSelectedNode={setSelectedNode}
          />
        ) : (
          <div className="home-empty-graph">
            <div className="empty-content">
              <h3>📈 Graph View</h3>
              <p>Run a query to visualize the data graph</p>
            </div>
          </div>
        )}
      </main>

      {/* RIGHT: NODE DETAILS PANEL */}
      <aside className="home-details">
        <NodeDetails selectedNode={selectedNode} />
      </aside>
    </div>
  );
};

export default Home;
