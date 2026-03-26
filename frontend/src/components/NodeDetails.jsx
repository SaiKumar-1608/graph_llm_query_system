import React from "react";

const NodeDetails = ({ selectedNode }) => {
  // ------------------------------
  // EMPTY STATE
  // ------------------------------
  if (!selectedNode) {
    return (
      <div style={styles.container}>
        <h3>📌 Node Details</h3>
        <p>Select a node from the graph to view details</p>
      </div>
    );
  }

  // ------------------------------
  // EXTRACT INFO
  // ------------------------------
  const { id, data } = selectedNode;

  // id format: order_740506 → split
  const [type, actualId] = id.split("_");

  return (
    <div style={styles.container}>
      <h3>📌 Node Details</h3>

      {/* ------------------------------ */}
      {/* BASIC INFO */}
      {/* ------------------------------ */}
      <div style={styles.card}>
        <p>
          <strong>Type:</strong> {type.toUpperCase()}
        </p>
        <p>
          <strong>ID:</strong> {actualId}
        </p>
      </div>

      {/* ------------------------------ */}
      {/* LABEL */}
      {/* ------------------------------ */}
      {data?.label && (
        <div style={styles.card}>
          <strong>Label:</strong>
          <p>{data.label}</p>
        </div>
      )}

      {/* ------------------------------ */}
      {/* RAW DATA */}
      {/* ------------------------------ */}
      <div style={styles.card}>
        <strong>Raw Data:</strong>
        <pre style={styles.dataBox}>
          {JSON.stringify(data || {}, null, 2)}
        </pre>
      </div>
    </div>
  );
};

// ------------------------------
// STYLES
// ------------------------------
const styles = {
  container: {
    padding: "15px",
    borderLeft: "1px solid #ddd",
    height: "100vh",
    overflowY: "auto",
    background: "#fafafa",
  },
  card: {
    background: "#fff",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  dataBox: {
    background: "#f4f4f4",
    padding: "10px",
    borderRadius: "6px",
    fontSize: "12px",
    overflowX: "auto",
    marginTop: "8px",
  },
};

export default NodeDetails;