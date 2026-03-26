import { query } from "../config/db.js";

// ------------------------------
// GET PRODUCT BY ID
// ------------------------------
export async function getProductById(productId) {
  const sql = `
    SELECT *
    FROM products
    WHERE id = $1
  `;

  const res = await query(sql, [productId]);
  return res.rows[0];
}

// ------------------------------
// GET ALL PRODUCTS (LIMITED)
// ------------------------------
export async function getAllProducts(limit = 50) {
  const sql = `
    SELECT *
    FROM products
    ORDER BY id
    LIMIT $1
  `;

  const res = await query(sql, [limit]);
  return res.rows;
}

// ------------------------------
// SEARCH PRODUCTS BY NAME
// ------------------------------
export async function searchProductsByName(name) {
  const sql = `
    SELECT *
    FROM products
    WHERE LOWER(name) LIKE LOWER($1)
    LIMIT 20
  `;

  const res = await query(sql, [`%${name}%`]);
  return res.rows;
}

// ------------------------------
// GET PRODUCT IN ORDERS
// ------------------------------
export async function getProductOrders(productId) {
  const sql = `
    SELECT 
      p.id AS product_id,
      p.name,

      o.id AS order_id,
      o.order_date,

      soi.quantity,
      soi.price

    FROM products p

    LEFT JOIN sales_order_items soi
      ON p.id = soi.product_id

    LEFT JOIN sales_orders o
      ON soi.order_id = o.id

    WHERE p.id = $1
  `;

  const res = await query(sql, [productId]);
  return res.rows;
}

// ------------------------------
// GET PRODUCT IN DELIVERIES
// ------------------------------
export async function getProductDeliveries(productId) {
  const sql = `
    SELECT 
      p.id AS product_id,
      p.name,

      d.id AS delivery_id,
      d.delivery_date,

      di.quantity

    FROM products p

    LEFT JOIN delivery_items di
      ON p.id = di.product_id

    LEFT JOIN deliveries d
      ON di.delivery_id = d.id

    WHERE p.id = $1
  `;

  const res = await query(sql, [productId]);
  return res.rows;
}

// ------------------------------
// GET PRODUCT IN BILLING
// ------------------------------
export async function getProductBilling(productId) {
  const sql = `
    SELECT 
      p.id AS product_id,
      p.name,

      b.id AS billing_id,
      b.billing_date,

      bi.quantity,
      bi.amount

    FROM products p

    LEFT JOIN billing_document_items bi
      ON p.id = bi.product_id

    LEFT JOIN billing_documents b
      ON bi.billing_id = b.id

    WHERE p.id = $1
  `;

  const res = await query(sql, [productId]);
  return res.rows;
}

// ------------------------------
// GET FULL PRODUCT FLOW
// (Product → Order → Delivery → Billing → Payment)
// ------------------------------
export async function getFullProductFlow(productId) {
  const sql = `
    SELECT 
      p.id AS product_id,
      p.name,

      o.id AS order_id,
      o.customer_id,

      d.id AS delivery_id,

      b.id AS billing_id,
      b.total_amount,

      pay.id AS payment_id,
      pay.amount AS payment_amount

    FROM products p

    LEFT JOIN sales_order_items soi
      ON p.id = soi.product_id

    LEFT JOIN sales_orders o
      ON soi.order_id = o.id

    LEFT JOIN deliveries d
      ON o.id = d.order_id

    LEFT JOIN billing_documents b
      ON d.id = b.delivery_id

    LEFT JOIN payments pay
      ON b.id = pay.billing_id

    WHERE p.id = $1
  `;

  const res = await query(sql, [productId]);
  return res.rows;
}

// ------------------------------
// GET PRODUCT SALES SUMMARY
// ------------------------------
export async function getProductSalesSummary(productId) {
  const sql = `
    SELECT 
      p.id AS product_id,
      p.name,

      COUNT(DISTINCT soi.order_id) AS total_orders,
      SUM(soi.quantity) AS total_quantity,
      SUM(soi.price) AS total_revenue

    FROM products p

    LEFT JOIN sales_order_items soi
      ON p.id = soi.product_id

    WHERE p.id = $1

    GROUP BY p.id, p.name
  `;

  const res = await query(sql, [productId]);
  return res.rows[0];
}

// ------------------------------
// GET TOP SELLING PRODUCTS
// ------------------------------
export async function getTopProducts(limit = 10) {
  const sql = `
    SELECT 
      p.id,
      p.name,
      SUM(soi.quantity) AS total_sold,
      SUM(soi.price) AS revenue

    FROM products p

    LEFT JOIN sales_order_items soi
      ON p.id = soi.product_id

    GROUP BY p.id, p.name
    ORDER BY total_sold DESC
    LIMIT $1
  `;

  const res = await query(sql, [limit]);
  return res.rows;
}