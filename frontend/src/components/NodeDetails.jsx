import React from "react";

const NodeDetails = ({ selectedNode }) => {
  // ------------------------------
  // EMPTY STATE
  // ------------------------------
  if (!selectedNode) {
    return (
      <div className="details-container">
        <h2 className="details-title">
          <span className="icon">📌</span>
          Node Details
        </h2>
        <div className="empty-details">
          <p>Select a node from the graph to view details</p>
        </div>
      </div>
    );
  }

  // ------------------------------
  // EXTRACT INFO
  // ------------------------------
  const { id, data } = selectedNode;

  // id format: order_740506 → split
  const [type, ...actualIdParts] = id.split("_");
  const actualId = actualIdParts.join("_") || id;

  return (
    <div className="details-container animate-fade-in">
      <h2 className="details-title">
        <span className="icon">📌</span>
        Node Details
      </h2>

      <div className="details-content">
        {/* ------------------------------ */}
        {/* BASIC INFO */}
        {/* ------------------------------ */}
        <div className="glass-card detail-card">
          <div className="detail-row">
            <span className="detail-label">Type</span>
            <span className="detail-value highlight">{type.toUpperCase()}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">ID</span>
            <span className="detail-value">{actualId}</span>
          </div>
        </div>

        {/* ------------------------------ */}
        {/* LABEL */}
        {/* ------------------------------ */}
        {data?.label && (
          <div className="glass-card detail-card">
            <span className="detail-label">Label</span>
            <p className="detail-text">{data.label}</p>
          </div>
        )}

        {/* ------------------------------ */}
        {/* RAW DATA */}
        {/* ------------------------------ */}
        <div className="glass-card detail-card flex-col">
          <span className="detail-label">Raw Data</span>
          <pre className="data-box">
            <code>{JSON.stringify(data || {}, null, 2)}</code>
          </pre>
        </div>
      </div>

      <style>{`
        .details-container {
          padding: 24px 20px;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
        }

        .details-title {
          font-size: 1.25rem;
          margin-top: 0;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .empty-details {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: var(--text-muted);
          padding: 20px;
        }

        .details-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .detail-card {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding: 16px;
        }
        
        .detail-card.flex-col {
          gap: 8px;
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border);
        }

        .detail-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }

        .detail-label {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-muted);
        }

        .detail-value {
          font-weight: 500;
          color: var(--text-main);
        }

        .detail-value.highlight {
          color: var(--primary);
        }

        .detail-text {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .data-box {
          margin: 0;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default NodeDetails;