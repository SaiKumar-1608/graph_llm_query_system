import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import "./GraphView.css";

import { getGraph, expandNode } from "../services/api";

const GraphView = ({ orderId, graphData, setSelectedNode }) => {
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  // ------------------------------
  // TRANSFORM BACKEND → REACT FLOW
  // ------------------------------
  const transformGraph = useCallback((graph) => {
    if (!graph) return { nodes: [], edges: [] };
    
    const safeNodes = Array.isArray(graph.nodes) ? graph.nodes : [];
    const safeEdges = Array.isArray(graph.edges) ? graph.edges : [];

    const rfNodes = safeNodes.map((node, index) => {
      const typeStr = (node?.type || "unknown").toString().toUpperCase();
      const idStr = (node?.id || "unknown").toString();
      const shortId = idStr.includes("_") ? idStr.split("_")[1] : idStr;

      return {
        id: idStr,
        data: {
          label: `${typeStr} (${shortId})`,
        },
        position: {
          x: 250 * (index % 3) + 50,
          y: 150 * Math.floor(index / 3) + 50,
        },
        style: getNodeStyle(node?.type),
      };
    });

    const rfEdges = safeEdges.map((edge, i) => ({
      id: `e-${i}-${edge?.from}-${edge?.to}`,
      source: (edge?.from || "").toString(),
      target: (edge?.to || "").toString(),
      animated: true,
    }));

    return { nodes: rfNodes, edges: rfEdges };
  }, []);

  // ------------------------------
  // NODE STYLE
  // ------------------------------
  const getNodeStyle = (type) => {
    // Elegant, slightly desaturated modern colors
    const colors = {
      customer: { bg: "rgba(250, 204, 21, 0.8)", border: "#eab308", text: "#854d0e" }, // Yellow
      order: { bg: "rgba(56, 189, 248, 0.8)", border: "#0ea5e9", text: "#0c4a6e" },   // Sky Blue
      delivery: { bg: "rgba(251, 146, 60, 0.8)", border: "#f97316", text: "#7c2d12" }, // Orange
      billing: { bg: "rgba(74, 222, 128, 0.8)", border: "#22c55e", text: "#14532d" },  // Green
      payment: { bg: "rgba(192, 132, 252, 0.8)", border: "#a855f7", text: "#581c87" }, // Purple
      journal: { bg: "rgba(156, 163, 175, 0.8)", border: "#6b7280", text: "#1f2937" }, // Gray
    };

    const scheme = colors[type] || colors.journal;

    return {
      background: scheme.bg,
      border: `2px solid ${scheme.border}`,
      color: scheme.text,
      backdropFilter: "blur(4px)",
      WebkitBackdropFilter: "blur(4px)",
    };
  };

  // ------------------------------
  // NODE CLICK → SELECT + EXPAND
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
    [setSelectedNode, transformGraph]
  );

  // ------------------------------
  // LOAD ON PROPS CHANGE
  // ------------------------------
  useEffect(() => {
    // If we receive the full graph directly (via Chat)
    if (graphData && graphData.nodes) {
      const transformed = transformGraph(graphData);
      setNodes(transformed.nodes);
      setEdges(transformed.edges);
    }
  }, [graphData, transformGraph]);

  // Handle fallback if we just have an orderId to load (backwards compat)
  useEffect(() => {
    if (orderId && !graphData) {
      const loadGraph = async (id) => {
        try {
          const res = await getGraph(id);
          const graph = res.data?.data || res;
          
          if (!graph || !graph.nodes) return;
          const transformed = transformGraph(graph);
          setNodes(transformed.nodes);
          setEdges(transformed.edges);
        } catch (err) {
          console.error("❌ Graph load error:", err);
        }
      };
      
      loadGraph(orderId);
    }
  }, [orderId, graphData, transformGraph]);

  return (
    <div className="graph-wrapper animate-fade-in">
      <div className="graph-header glass-panel">
        <h2 className="graph-title">📈 Interaction Graph</h2>
      </div>

      {nodes.length === 0 ? (
        <p className="graph-empty">No graph data available</p>
      ) : (
        <div className="react-flow-container">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            fitView
            attributionPosition="bottom-right"
          >
            <MiniMap 
              nodeStrokeColor={(n) => {
                if (n.style?.background) return n.style.background;
                return '#eee';
              }} 
              nodeColor={(n) => {
                if (n.style?.background) return n.style.background;
                return '#fff';
              }} 
            />
            <Controls className="custom-controls" />
            <Background gap={16} size={1} color="rgba(0,0,0,0.1)" />
          </ReactFlow>
        </div>
      )}

      <style>{`
        .graph-wrapper {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
        }

        .graph-header {
          position: absolute;
          top: 16px;
          left: 16px;
          z-index: 10;
          padding: 8px 16px;
          border-radius: 8px;
          pointer-events: none; /* Let clicks pass through to graph */
        }

        .graph-title {
          margin: 0;
          font-size: 1rem;
          font-weight: 600;
        }

        .react-flow-container {
          flex: 1;
          width: 100%;
          height: 100%;
        }

        .graph-empty {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Specifically target dark mode background dots */
        @media (prefers-color-scheme: dark) {
          .react-flow__background-pattern {
            fill: rgba(255, 255, 255, 0.1) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default GraphView;