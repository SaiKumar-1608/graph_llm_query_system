import { query } from "../config/db.js";

// ------------------------------
// GET DELIVERY BY ID
// ------------------------------
export async function getDeliveryById(deliveryId) {
  const sql = `
    SELECT *
    FROM deliveries
    WHERE id = $1
  `;

  const res = await query(sql, [deliveryId]);
  return res.rows[0];
}

// ------------------------------
// GET DELIVERIES BY ORDER ID
// ------------------------------
export async function getDeliveriesByOrderId(orderId) {
  const sql = `
    SELECT *
    FROM deliveries
    WHERE order_id = $1
    ORDER BY delivery_date
  `;

  const res = await query(sql, [orderId]);
  return res.rows;
}

// ------------------------------
// GET DELIVERY ITEMS
// ------------------------------
export async function getDeliveryItems(deliveryId) {
  const sql = `
    SELECT 
      di.delivery_id,
      di.product_id,
      di.quantity
    FROM delivery_items di
    WHERE di.delivery_id = $1
  `;

  const res = await query(sql, [deliveryId]);
  return res.rows;
}

// ------------------------------
// GET DELIVERY WITH ITEMS
// ------------------------------
export async function getDeliveryWithItems(deliveryId) {
  const sql = `
    SELECT 
      d.id AS delivery_id,
      d.order_id,
      d.delivery_date,
      d.status,
      di.product_id,
      di.quantity
    FROM deliveries d
    LEFT JOIN delivery_items di
      ON d.id = di.delivery_id
    WHERE d.id = $1
  `;

  const res = await query(sql, [deliveryId]);
  return res.rows;
}

// ------------------------------
// GET DELIVERY FLOW (ORDER → DELIVERY → BILLING)
// ------------------------------
export async function getDeliveryFlow(deliveryId) {
  const sql = `
    SELECT 
      o.id AS order_id,
      d.id AS delivery_id,
      d.delivery_date,
      d.status AS delivery_status,
      b.id AS billing_id,
      b.total_amount,
      b.status AS billing_status
    FROM deliveries d
    LEFT JOIN sales_orders o
      ON d.order_id = o.id
    LEFT JOIN billing_documents b
      ON d.id = b.delivery_id
    WHERE d.id = $1
  `;

  const res = await query(sql, [deliveryId]);
  return res.rows;
}

// ------------------------------
// GET FULL DELIVERY CHAIN
// (Order → Delivery → Billing → Payment)
// ------------------------------
export async function getFullDeliveryChain(deliveryId) {
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

    FROM deliveries d

    LEFT JOIN sales_orders o
      ON d.order_id = o.id

    LEFT JOIN billing_documents b
      ON d.id = b.delivery_id

    LEFT JOIN payments p
      ON b.id = p.billing_id

    WHERE d.id = $1
  `;

  const res = await query(sql, [deliveryId]);
  return res.rows;
}

// ------------------------------
// GET ALL DELIVERIES (LIMITED)
// ------------------------------
export async function getAllDeliveries(limit = 50) {
  const sql = `
    SELECT *
    FROM deliveries
    ORDER BY delivery_date DESC
    LIMIT $1
  `;

  const res = await query(sql, [limit]);
  return res.rows;
}

// ------------------------------
// GET DELIVERY COUNT BY STATUS
// ------------------------------
export async function getDeliveryStats() {
  const sql = `
    SELECT 
      status,
      COUNT(*) AS count
    FROM deliveries
    GROUP BY status
  `;

  const res = await query(sql);
  return res.rows;
}