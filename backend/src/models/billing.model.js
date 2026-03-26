import { query } from "../config/db.js";

// ------------------------------
// GET BILLING BY ID
// ------------------------------
export async function getBillingById(billingId) {
  const sql = `
    SELECT *
    FROM billing_documents
    WHERE id = $1
  `;

  const res = await query(sql, [billingId]);
  return res.rows[0];
}

// ------------------------------
// GET BILLING BY DELIVERY ID
// ------------------------------
export async function getBillingByDeliveryId(deliveryId) {
  const sql = `
    SELECT *
    FROM billing_documents
    WHERE delivery_id = $1
  `;

  const res = await query(sql, [deliveryId]);
  return res.rows;
}

// ------------------------------
// GET BILLING WITH ITEMS
// ------------------------------
export async function getBillingWithItems(billingId) {
  const sql = `
    SELECT 
      b.id AS billing_id,
      b.billing_date,
      b.total_amount,
      b.status,
      bi.product_id,
      bi.quantity,
      bi.amount
    FROM billing_documents b
    LEFT JOIN billing_document_items bi
      ON b.id = bi.billing_id
    WHERE b.id = $1
  `;

  const res = await query(sql, [billingId]);
  return res.rows;
}

// ------------------------------
// GET FULL BILLING FLOW (DELIVERY → BILLING → PAYMENT)
// ------------------------------
export async function getBillingFlowByDelivery(deliveryId) {
  const sql = `
    SELECT 
      d.id AS delivery_id,
      b.id AS billing_id,
      b.billing_date,
      b.total_amount,
      b.status AS billing_status,
      p.id AS payment_id,
      p.amount AS payment_amount,
      p.payment_date
    FROM deliveries d
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
// GET ALL BILLINGS (LIMITED)
// ------------------------------
export async function getAllBillings(limit = 50) {
  const sql = `
    SELECT *
    FROM billing_documents
    ORDER BY billing_date DESC
    LIMIT $1
  `;

  const res = await query(sql, [limit]);
  return res.rows;
}