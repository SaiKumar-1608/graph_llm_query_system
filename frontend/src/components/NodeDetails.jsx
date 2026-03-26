import React from "react";
import "./NodeDetails.css";

const NodeDetails = ({ selectedNode }) => {
  if (!selectedNode) {
    return (
      <div className="node-details-container">
        <div className="node-details-header">
          <h3 className="node-details-title">📌 Node Details</h3>
        </div>
        <div className="node-empty">
          <p>Select a node to view details</p>
        </div>
      </div>
    );
  }

  const { id, data } = selectedNode;
  const [type, actualId] = id.split("_");

  return (
    <div className="node-details-container">
      <div className="node-details-header">
        <h3 className="node-details-title">📌 Node Details</h3>
      </div>

      <div className="node-details-content">
        {/* BASIC INFO CARD */}
        <div className="node-card">
          <h4 className="card-title">Type & ID</h4>
          <div className="card-body">
            <div className="detail-item">
              <span className="detail-label">Type:</span>
              <span className={`detail-value type-badge type-${type}`}>
                {type.toUpperCase()}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">ID:</span>
              <span className="detail-value">{actualId}</span>
            </div>
          </div>
        </div>

        {/* LABEL CARD */}
        {data?.label && (
          <div className="node-card">
            <h4 className="card-title">Label</h4>
            <div className="card-body">
              <p className="label-text">{data.label}</p>
            </div>
          </div>
        )}

        {/* RAW DATA CARD */}
        <div className="node-card">
          <h4 className="card-title">Raw Data</h4>
          <div className="card-body">
            <pre className="data-box">
              {JSON.stringify(data || {}, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetails;
