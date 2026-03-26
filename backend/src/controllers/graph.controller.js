import {
  getOrderGraph,
  expandNodeGraph,
} from "../services/graph.service.js";

// ------------------------------
// GET FULL ORDER GRAPH
// ------------------------------
export async function getGraph(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const graph = await getOrderGraph(id);

    return res.status(200).json({
      success: true,
      data: graph,
    });
  } catch (error) {
    console.error("❌ Graph Fetch Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch graph",
    });
  }
}

// ------------------------------
// EXPAND NODE (DYNAMIC GRAPH)
// ------------------------------
export async function expandNode(req, res) {
  try {
    const { nodeId } = req.params;

    if (!nodeId) {
      return res.status(400).json({
        success: false,
        message: "Node ID is required",
      });
    }

    const graph = await expandNodeGraph(nodeId);

    return res.status(200).json({
      success: true,
      data: graph,
    });
  } catch (error) {
    console.error("❌ Node Expand Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to expand node",
    });
  }
}