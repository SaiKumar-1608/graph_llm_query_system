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
    <div style={styles.container}>
      {/* LEFT: CHAT */}
      <div style={styles.chat}>
        <Chat onGraphLoad={handleGraphLoad} />
      </div>

      {/* CENTER: GRAPH */}
      <div style={styles.graph}>
        {graphData ? (
          <GraphView
            graphData={graphData}   // ✅ FIXED
            setSelectedNode={setSelectedNode}
          />
        ) : (
          <div style={styles.emptyGraph}>
            <h3>📈 Graph View</h3>
            <p>Run a query to visualize the data graph</p>
          </div>
        )}
      </div>

      {/* RIGHT: NODE DETAILS */}
      <div style={styles.details}>
        <NodeDetails selectedNode={selectedNode} />
      </div>
    </div>
  );
};

// ------------------------------
// STYLES
// ------------------------------
const styles = {
  container: {
    display: "flex",
    height: "100vh",
  },
  chat: {
    width: "30%",
    borderRight: "1px solid #ddd",
    overflow: "hidden",
  },
  graph: {
    width: "50%",
    position: "relative",
  },
  details: {
    width: "20%",
    borderLeft: "1px solid #ddd",
  },
  emptyGraph: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#666",
  },
};

export default Home;