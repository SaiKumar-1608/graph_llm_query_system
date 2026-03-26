import { query } from "../config/db.js";

// ------------------------------
// GET PAYMENT BY ID
// ------------------------------
export async function getPaymentById(paymentId) {
  const sql = `
    SELECT *
    FROM payments
    WHERE id = $1
  `;

  const res = await query(sql, [paymentId]);
  return res.rows[0];
}

// ------------------------------
// GET PAYMENTS BY BILLING ID
// ------------------------------
export async function getPaymentsByBillingId(billingId) {
  const sql = `
    SELECT *
    FROM payments
    WHERE billing_id = $1
    ORDER BY payment_date
  `;

  const res = await query(sql, [billingId]);
  return res.rows;
}

// ------------------------------
// GET PAYMENT WITH BILLING
// ------------------------------
export async function getPaymentWithBilling(paymentId) {
  const sql = `
    SELECT 
      p.id AS payment_id,
      p.amount,
      p.payment_date,
      p.method,

      b.id AS billing_id,
      b.total_amount,
      b.billing_date

    FROM payments p

    LEFT JOIN billing_documents b
      ON p.billing_id = b.id

    WHERE p.id = $1
  `;

  const res = await query(sql, [paymentId]);
  return res.rows[0];
}

// ------------------------------
// GET FULL PAYMENT FLOW
// (Payment → Billing → Delivery → Order → Customer)
// ------------------------------
export async function getFullPaymentFlow(paymentId) {
  const sql = `
    SELECT 
      p.id AS payment_id,
      p.amount,
      p.payment_date,

      b.id AS billing_id,
      b.total_amount,

      d.id AS delivery_id,
      d.delivery_date,

      o.id AS order_id,
      o.customer_id,

      c.name AS customer_name

    FROM payments p

    LEFT JOIN billing_documents b
      ON p.billing_id = b.id

    LEFT JOIN deliveries d
      ON b.delivery_id = d.id

    LEFT JOIN sales_orders o
      ON d.order_id = o.id

    LEFT JOIN customers c
      ON o.customer_id = c.id

    WHERE p.id = $1
  `;

  const res = await query(sql, [paymentId]);
  return res.rows;
}

// ------------------------------
// GET JOURNAL ENTRIES BY PAYMENT
// ------------------------------
export async function getJournalEntriesByPayment(paymentId) {
  const sql = `
    SELECT *
    FROM journal_entries
    WHERE payment_id = $1
  `;

  const res = await query(sql, [paymentId]);
  return res.rows;
}

// ------------------------------
// GET PAYMENT WITH JOURNAL ENTRIES
// ------------------------------
export async function getPaymentWithJournal(paymentId) {
  const sql = `
    SELECT 
      p.id AS payment_id,
      p.amount,
      p.payment_date,
      p.method,

      j.id AS journal_id,
      j.entry_date,
      j.debit,
      j.credit

    FROM payments p

    LEFT JOIN journal_entries j
      ON p.id = j.payment_id

    WHERE p.id = $1
  `;

  const res = await query(sql, [paymentId]);
  return res.rows;
}

// ------------------------------
// GET ALL PAYMENTS (LIMITED)
// ------------------------------
export async function getAllPayments(limit = 50) {
  const sql = `
    SELECT *
    FROM payments
    ORDER BY payment_date DESC
    LIMIT $1
  `;

  const res = await query(sql, [limit]);
  return res.rows;
}

// ------------------------------
// GET PAYMENT SUMMARY
// ------------------------------
export async function getPaymentSummary() {
  const sql = `
    SELECT 
      COUNT(*) AS total_payments,
      COALESCE(SUM(amount), 0) AS total_amount,
      AVG(amount) AS avg_payment
    FROM payments
  `;

  const res = await query(sql);
  return res.rows[0];
}

// ------------------------------
// GET PAYMENTS BY METHOD
// ------------------------------
export async function getPaymentsByMethod() {
  const sql = `
    SELECT 
      method,
      COUNT(*) AS count,
      COALESCE(SUM(amount), 0) AS total_amount
    FROM payments
    GROUP BY method
    ORDER BY total_amount DESC
  `;

  const res = await query(sql);
  return res.rows;
}