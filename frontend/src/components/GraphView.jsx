import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import "./GraphView.css";

import { expandNode } from "../services/api";

const GraphView = ({ graphData, setSelectedNode }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // ------------------------------
  // TRANSFORM BACKEND → REACT FLOW
  // ------------------------------
  const transformGraph = (graph) => {
    const rfNodes = graph.nodes.map((node, index) => ({
      id: node.id,
      data: {
        label: node.label || node.id,
      },
      position: {
        x: 200 * (index % 3),
        y: 120 * Math.floor(index / 3),
      },
      style: getNodeStyle(node.type),
    }));

    const rfEdges = graph.edges.map((edge, i) => ({
      id: `e-${i}-${edge.from}-${edge.to}`,
      source: edge.from,
      target: edge.to,
      label: edge.label || "",
      animated: true,
    }));

    return { nodes: rfNodes, edges: rfEdges };
  };

  // ------------------------------
  // NODE STYLE
  // ------------------------------
  const getNodeStyle = (type) => {
    const colors = {
      customer: "#FFD700",
      order: "#87CEEB",
      delivery: "#FFA07A",
      billing: "#90EE90",
      payment: "#DDA0DD",
      journal: "#ccc",
    };

    return {
      padding: 10,
      borderRadius: 10,
      border: "1px solid #333",
      background: colors[type] || "#eee",
      fontSize: "12px",
    };
  };

  // ------------------------------
  // LOAD GRAPH FROM BACKEND RESPONSE
  // ------------------------------
  useEffect(() => {
    if (!graphData) return;

    console.log("📊 Rendering graph:", graphData);

    if (!graphData.nodes || graphData.nodes.length === 0) {
      setNodes([]);
      setEdges([]);
      return;
    }

    const transformed = transformGraph(graphData);

    setNodes(transformed.nodes);
    setEdges(transformed.edges);
  }, [graphData]);

  // ------------------------------
  // NODE CLICK → EXPAND
  // ------------------------------
  const onNodeClick = useCallback(
    async (event, node) => {
      console.log("🖱️ Node clicked:", node);

      if (setSelectedNode) {
        setSelectedNode(node);
      }

      try {
        const res = await expandNode(node.id);

        const graph = res.data?.data;

        console.log("📦 Expanded graph:", graph);

        if (!graph || !graph.nodes) return;

        const newGraph = transformGraph(graph);

        // Merge nodes
        setNodes((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const newNodes = newGraph.nodes.filter(
            (n) => !existingIds.has(n.id)
          );
          return [...prev, ...newNodes];
        });

        // Merge edges
        setEdges((prev) => {
          const existingEdges = new Set(prev.map((e) => e.id));
          const newEdges = newGraph.edges.filter(
            (e) => !existingEdges.has(e.id)
          );
          return [...prev, ...newEdges];
        });
      } catch (err) {
        console.error("❌ Expand error:", err);
      }
    },
    [setSelectedNode]
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>📈 Graph View</h2>

      {nodes.length === 0 ? (
        <p style={styles.empty}>Run a query to visualize the graph</p>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodeClick={onNodeClick}
          fitView
        >
          <MiniMap />
          <Controls />
          <Background />
        </ReactFlow>
      )}
    </div>
  );
};

// ------------------------------
// STYLES
// ------------------------------
const styles = {
  container: {
    height: "100vh",
    width: "100%",
  },
  header: {
    margin: "10px",
  },
  empty: {
    textAlign: "center",
    marginTop: "50px",
    color: "#666",
  },
};

export default GraphView;