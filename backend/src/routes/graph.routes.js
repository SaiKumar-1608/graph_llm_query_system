import express from "express";
import {
  getGraph,
  expandNode,
} from "../controllers/graph.controller.js";

const router = express.Router();

// ------------------------------
// EXPAND NODE FIRST (IMPORTANT)
// ------------------------------
router.get("/expand/:nodeId", expandNode);

// ------------------------------
// GET FULL GRAPH
// ------------------------------
router.get("/:id", getGraph);

export default router;