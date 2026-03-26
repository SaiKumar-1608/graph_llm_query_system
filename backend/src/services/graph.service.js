import { query } from "../config/db.js";

// ------------------------------
// HELPER: CREATE NODE
// ------------------------------
function createNode(id, type, data = {}) {
  return {
    id: `${type}_${id}`,
    type,
    data,
  };
}

// ------------------------------
// HELPER: CREATE EDGE
// ------------------------------
function createEdge(fromType, fromId, toType, toId) {
  if (!fromId || !toId) return null;

  return {
    from: `${fromType}_${fromId}`,
    to: `${toType}_${toId}`,
  };
}

// ------------------------------
// GET FULL ORDER GRAPH
// ------------------------------
export async function getOrderGraph(orderId) {
  try {
    const sql = `
      SELECT 
        o.id AS order_id,
        o.customer_id,
        c.name AS customer_name,

        d.id AS delivery_id,
        b.id AS billing_id,

        p.id AS payment_id,
        p.amount AS payment_amount

      FROM sales_orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      LEFT JOIN deliveries d ON o.id = d.order_id
      LEFT JOIN billing_documents b ON d.id = b.delivery_id
      LEFT JOIN payments p ON b.id = p.billing_id

      WHERE o.id = $1
    `;

    const res = await query(sql, [orderId]);
    const rows = res.rows;

    console.log("📊 Graph DB result:", rows);

    const nodes = new Map();
    const edges = [];

    // ------------------------------
    // ALWAYS ADD ORDER NODE (🔥 FIX)
    // ------------------------------
    nodes.set(
      `order_${orderId}`,
      createNode(orderId, "order")
    );

    rows.forEach((row) => {
      // ------------------------------
      // CUSTOMER
      // ------------------------------
      if (row.customer_id) {
        nodes.set(
          `customer_${row.customer_id}`,
          createNode(row.customer_id, "customer", {
            name: row.customer_name,
          })
        );

        const edge = createEdge(
          "order",
          row.order_id,
          "customer",
          row.customer_id
        );
        if (edge) edges.push(edge);
      }

      // ------------------------------
      // DELIVERY
      // ------------------------------
      if (row.delivery_id) {
        nodes.set(
          `delivery_${row.delivery_id}`,
          createNode(row.delivery_id, "delivery")
        );

        const edge = createEdge(
          "order",
          row.order_id,
          "delivery",
          row.delivery_id
        );
        if (edge) edges.push(edge);
      }

      // ------------------------------
      // BILLING
      // ------------------------------
      if (row.billing_id) {
        nodes.set(
          `billing_${row.billing_id}`,
          createNode(row.billing_id, "billing")
        );

        const edge = createEdge(
          "delivery",
          row.delivery_id,
          "billing",
          row.billing_id
        );
        if (edge) edges.push(edge);
      }

      // ------------------------------
      // PAYMENT
      // ------------------------------
      if (row.payment_id) {
        nodes.set(
          `payment_${row.payment_id}`,
          createNode(row.payment_id, "payment", {
            amount: row.payment_amount,
          })
        );

        const edge = createEdge(
          "billing",
          row.billing_id,
          "payment",
          row.payment_id
        );
        if (edge) edges.push(edge);
      }
    });

    // ------------------------------
    // 🔥 FALLBACK IF ONLY ORDER EXISTS
    // ------------------------------
    if (nodes.size === 1) {
      console.warn("⚠️ Only order node found (no relationships)");
    }

    return {
      nodes: Array.from(nodes.values()),
      edges,
    };
  } catch (error) {
    console.error("❌ Graph Service Error:", error.message);
    throw error;
  }
}

// ------------------------------
// EXPAND NODE
// ------------------------------
export async function expandNodeGraph(nodeId) {
  try {
    const [type, id] = nodeId.split("_");

    switch (type) {
      case "order":
        return await getOrderGraph(id);
      case "customer":
        return await getCustomerExpansion(id);
      case "delivery":
        return await getDeliveryExpansion(id);
      case "billing":
        return await getBillingExpansion(id);
      case "payment":
        return await getPaymentExpansion(id);
      default:
        return { nodes: [], edges: [] };
    }
  } catch (error) {
    console.error("❌ Expand Node Error:", error.message);
    throw error;
  }
}

// ------------------------------
// CUSTOMER EXPANSION
// ------------------------------
async function getCustomerExpansion(customerId) {
  const res = await query(
    `SELECT id FROM sales_orders WHERE customer_id = $1 LIMIT 20`,
    [customerId]
  );

  const nodes = [];
  const edges = [];

  res.rows.forEach((row) => {
    nodes.push(createNode(row.id, "order"));
    edges.push(createEdge("customer", customerId, "order", row.id));
  });

  return { nodes, edges };
}

// ------------------------------
// DELIVERY EXPANSION
// ------------------------------
async function getDeliveryExpansion(deliveryId) {
  const res = await query(
    `SELECT id FROM billing_documents WHERE delivery_id = $1`,
    [deliveryId]
  );

  const nodes = [];
  const edges = [];

  res.rows.forEach((row) => {
    nodes.push(createNode(row.id, "billing"));
    edges.push(createEdge("delivery", deliveryId, "billing", row.id));
  });

  return { nodes, edges };
}

// ------------------------------
// BILLING EXPANSION
// ------------------------------
async function getBillingExpansion(billingId) {
  const res = await query(
    `SELECT id FROM payments WHERE billing_id = $1`,
    [billingId]
  );

  const nodes = [];
  const edges = [];

  res.rows.forEach((row) => {
    nodes.push(createNode(row.id, "payment"));
    edges.push(createEdge("billing", billingId, "payment", row.id));
  });

  return { nodes, edges };
}

// ------------------------------
// PAYMENT EXPANSION
// ------------------------------
async function getPaymentExpansion(paymentId) {
  const res = await query(
    `SELECT id FROM journal_entries WHERE payment_id = $1`,
    [paymentId]
  );

  const nodes = [];
  const edges = [];

  res.rows.forEach((row) => {
    nodes.push(createNode(row.id, "journal"));
    edges.push(createEdge("payment", paymentId, "journal", row.id));
  });

  return { nodes, edges };
}