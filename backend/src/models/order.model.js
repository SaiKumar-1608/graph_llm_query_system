import { query } from "../config/db.js";

// ------------------------------
// GET ORDER BY ID
// ------------------------------
export async function getOrderById(orderId) {
  const sql = `
    SELECT *
    FROM sales_orders
    WHERE id = $1
  `;

  const res = await query(sql, [orderId]);
  return res.rows[0];
}

// ------------------------------
// GET ORDERS BY CUSTOMER
// ------------------------------
export async function getOrdersByCustomer(customerId) {
  const sql = `
    SELECT *
    FROM sales_orders
    WHERE customer_id = $1
    ORDER BY order_date DESC
  `;

  const res = await query(sql, [customerId]);
  return res.rows;
}

// ------------------------------
// GET ORDER ITEMS
// ------------------------------
export async function getOrderItems(orderId) {
  const sql = `
    SELECT 
      soi.order_id,
      soi.product_id,
      soi.quantity,
      soi.price
    FROM sales_order_items soi
    WHERE soi.order_id = $1
  `;

  const res = await query(sql, [orderId]);
  return res.rows;
}

// ------------------------------
// GET ORDER WITH ITEMS
// ------------------------------
export async function getOrderWithItems(orderId) {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.customer_id,
      o.order_date,
      o.status,
      soi.product_id,
      soi.quantity,
      soi.price
    FROM sales_orders o
    LEFT JOIN sales_order_items soi
      ON o.id = soi.order_id
    WHERE o.id = $1
  `;

  const res = await query(sql, [orderId]);
  return res.rows;
}

// ------------------------------
// GET ORDER FLOW (ORDER → DELIVERY)
// ------------------------------
export async function getOrderDeliveryFlow(orderId) {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.customer_id,
      o.order_date,

      d.id AS delivery_id,
      d.delivery_date,
      d.status AS delivery_status

    FROM sales_orders o
    LEFT JOIN deliveries d
      ON o.id = d.order_id

    WHERE o.id = $1
  `;

  const res = await query(sql, [orderId]);
  return res.rows;
}

// ------------------------------
// GET FULL O2C FLOW
// (Order → Delivery → Billing → Payment)
// ------------------------------
export async function getFullOrderFlow(orderId) {
  const sql = `
    SELECT 
      o.id AS order_id,
      o.customer_id,

      d.id AS delivery_id,
      d.delivery_date,

      b.id AS billing_id,
      b.total_amount,

      p.id AS payment_id,
      p.amount AS payment_amount

    FROM sales_orders o

    LEFT JOIN deliveries d
      ON o.id = d.order_id

    LEFT JOIN billing_documents b
      ON d.id = b.delivery_id

    LEFT JOIN payments p
      ON b.id = p.billing_id

    WHERE o.id = $1
  `;

  const res = await query(sql, [orderId]);
  return res.rows;
}

// ------------------------------
// GET ORDER SUMMARY (AGGREGATED)
// ------------------------------
export async function getOrderSummary(orderId) {
  const sql = `
    SELECT 
      o.id AS order_id,
      COUNT(DISTINCT soi.product_id) AS total_products,
      SUM(soi.quantity) AS total_quantity,
      SUM(soi.price) AS total_price

    FROM sales_orders o

    LEFT JOIN sales_order_items soi
      ON o.id = soi.order_id

    WHERE o.id = $1
    GROUP BY o.id
  `;

  const res = await query(sql, [orderId]);
  return res.rows[0];
}

// ------------------------------
// GET ALL ORDERS (LIMITED)
// ------------------------------
export async function getAllOrders(limit = 50) {
  const sql = `
    SELECT *
    FROM sales_orders
    ORDER BY order_date DESC
    LIMIT $1
  `;

  const res = await query(sql, [limit]);
  return res.rows;
}

// ------------------------------
// GET ORDER STATUS STATS
// ------------------------------
export async function getOrderStats() {
  const sql = `
    SELECT 
      status,
      COUNT(*) AS count
    FROM sales_orders
    GROUP BY status
  `;

  const res = await query(sql);
  return res.rows;
}