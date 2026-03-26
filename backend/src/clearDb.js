import { query } from "./config/db.js";

async function clearDB() {
  try {
    console.log("🧹 Clearing database...");

    await query(`
      TRUNCATE TABLE 
        journal_entries,
        payments,
        billing_document_items,
        billing_documents,
        delivery_items,
        deliveries,
        sales_order_items,
        sales_orders,
        products,
        customers
      RESTART IDENTITY CASCADE;
    `);

    console.log("✅ Database cleared successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Failed to clear DB:", err.message);
    process.exit(1);
  }
}

clearDB();