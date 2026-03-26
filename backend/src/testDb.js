import { query } from "./config/db.js";

const testDB = async () => {
  try {
    console.log("🔍 Testing database connection...\n");

    // 1. Check DB connection
    const timeRes = await query("SELECT NOW()");
    console.log("✅ DB Connected at:", timeRes.rows[0].now);

    // 2. Check customers table
    const customers = await query("SELECT * FROM customers LIMIT 5");
    console.log("\n📦 Customers Sample:");
    console.table(customers.rows);

    // 3. Check products table
    const products = await query("SELECT * FROM products LIMIT 5");
    console.log("\n📦 Products Sample:");
    console.table(products.rows);

    // 4. Check orders
    const orders = await query("SELECT * FROM sales_orders LIMIT 5");
    console.log("\n📦 Orders Sample:");
    console.table(orders.rows);

    // 5. Check full relationship (IMPORTANT)
    const flow = await query(`
      SELECT o.id AS order_id, d.id AS delivery_id, b.id AS billing_id, p.id AS payment_id
      FROM sales_orders o
      LEFT JOIN deliveries d ON o.id = d.order_id
      LEFT JOIN billing_documents b ON d.id = b.delivery_id
      LEFT JOIN payments p ON b.id = p.billing_id
      LIMIT 5;
    `);

    console.log("\n🔗 Order → Delivery → Billing → Payment Flow:");
    console.table(flow.rows);

    console.log("\n🎉 DATABASE TEST SUCCESSFUL");
  } catch (err) {
    console.error("❌ Database test failed:");
    console.error(err.message);
  } finally {
    process.exit();
  }
};

testDB();