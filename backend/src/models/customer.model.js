import { query } from "../config/db.js";

// ------------------------------
// GET CUSTOMER BY ID
// ------------------------------
export async function getCustomerById(customerId) {
  const sql = `
    SELECT *
    FROM customers
    WHERE id = $1
  `;

  const res = await query(sql, [customerId]);
  return res.rows[0];
}

// ------------------------------
// GET ALL CUSTOMERS (LIMITED)
// ------------------------------
export async function getAllCustomers(limit = 50) {
  const sql = `
    SELECT *
    FROM customers
    ORDER BY id
    LIMIT $1
  `;

  const res = await query(sql, [limit]);
  return res.rows;
}

// ------------------------------
// SEARCH CUSTOMERS BY NAME
// ------------------------------
export async function searchCustomersByName(name) {
  const sql = `
    SELECT *
    FROM customers
    WHERE LOWER(name) LIKE LOWER($1)
    LIMIT 20
  `;

  const res = await query(sql, [`%${name}%`]);
  return res.rows;
}

// ------------------------------
// GET CUSTOMER WITH ORDERS
// ------------------------------
export async function getCustomerWithOrders(customerId) {
  const sql = `
    SELECT 
      c.id AS customer_id,
      c.name,
      o.id AS order_id,
      o.order_date,
      o.status
    FROM customers c
    LEFT JOIN sales_orders o
      ON c.id = o.customer_id
    WHERE c.id = $1
  `;

  const res = await query(sql, [customerId]);
  return res.rows;
}

// ------------------------------
// GET FULL CUSTOMER FLOW (O2C)
// ------------------------------
export async function getCustomerFullFlow(customerId) {
  const sql = `
    SELECT 
      c.id AS customer_id,
      c.name,

      o.id AS order_id,
      o.order_date,

      d.id AS delivery_id,
      d.delivery_date,

      b.id AS billing_id,
      b.total_amount,

      p.id AS payment_id,
      p.amount AS payment_amount

    FROM customers c

    LEFT JOIN sales_orders o
      ON c.id = o.customer_id

    LEFT JOIN deliveries d
      ON o.id = d.order_id

    LEFT JOIN billing_documents b
      ON d.id = b.delivery_id

    LEFT JOIN payments p
      ON b.id = p.billing_id

    WHERE c.id = $1
  `;

  const res = await query(sql, [customerId]);
  return res.rows;
}

// ------------------------------
// GET CUSTOMERS WITH PAYMENT SUMMARY
// ------------------------------
export async function getCustomersWithPaymentSummary() {
  const sql = `
    SELECT 
      c.id AS customer_id,
      c.name,
      COUNT(DISTINCT o.id) AS total_orders,
      COUNT(DISTINCT p.id) AS total_payments,
      COALESCE(SUM(p.amount), 0) AS total_paid

    FROM customers c

    LEFT JOIN sales_orders o
      ON c.id = o.customer_id

    LEFT JOIN deliveries d
      ON o.id = d.order_id

    LEFT JOIN billing_documents b
      ON d.id = b.delivery_id

    LEFT JOIN payments p
      ON b.id = p.billing_id

    GROUP BY c.id, c.name
    ORDER BY total_paid DESC
  `;

  const res = await query(sql);
  return res.rows;
}