import { query } from "../config/db.js";
import { loadJSONLFolder } from "./load_jsonl.js";

import {
  transformCustomers,
  transformProducts,
  transformSalesOrders,
  transformSalesOrderItems,
  transformDeliveries,
  transformDeliveryItems,
  transformBillingDocuments,
  transformBillingItems,
  transformPayments,
  transformJournalEntries,
} from "./transform.js";

import path from "path";
import { fileURLToPath } from "url";

// ------------------------------
// PATH SETUP
// ------------------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root dataset path
const BASE_PATH = path.join(
  __dirname,
  "../../../data/raw/sap-o2c-data/"
);

// ------------------------------
// DATASET FOLDERS
// ------------------------------
const FOLDERS = {
  customers: "business_partners",
  products: "products",
  salesOrders: "sales_order_headers",
  salesOrderItems: "sales_order_items",
  deliveries: "outbound_delivery_headers",
  deliveryItems: "outbound_delivery_items",
  billingDocs: "billing_document_headers",
  billingItems: "billing_document_items",
  payments: "payments_accounts_receivable",
  journal: "journal_entry_items_accounts_receivable",
};

// ------------------------------
// BATCH INSERT FUNCTION
// ------------------------------
async function batchInsert(table, columns, rows) {
  if (!rows.length) {
    console.log(`⚠️ Skipping ${table}, no data`);
    return;
  }

  const values = [];
  const placeholders = rows
    .map((row, i) => {
      const offset = i * columns.length;
      const params = columns.map((_, j) => `$${offset + j + 1}`);
      values.push(...columns.map((col) => row[col]));
      return `(${params.join(", ")})`;
    })
    .join(", ");

  const sql = `
    INSERT INTO ${table} (${columns.join(", ")})
    VALUES ${placeholders}
    ON CONFLICT DO NOTHING
  `;

  await query(sql, values);
  console.log(`✅ Inserted into ${table}: ${rows.length} rows`);
}

// ------------------------------
// LOAD HELPER
// ------------------------------
async function loadData(folderKey) {
  const folderPath = path.join(BASE_PATH, FOLDERS[folderKey]);
  return await loadJSONLFolder(folderPath);
}

// ------------------------------
// MAIN SEED FUNCTION
// ------------------------------
async function seed() {
  try {
    console.log("🚀 Starting DB seeding...\n");
    console.log("📁 BASE PATH:", BASE_PATH);

    // ------------------------------
    // LOAD RAW DATA
    // ------------------------------
    const rawCustomers = await loadData("customers");
    const rawProducts = await loadData("products");
    const rawOrders = await loadData("salesOrders");
    const rawOrderItems = await loadData("salesOrderItems");
    const rawDeliveries = await loadData("deliveries");
    const rawDeliveryItems = await loadData("deliveryItems");
    const rawBilling = await loadData("billingDocs");
    const rawBillingItems = await loadData("billingItems");
    const rawPayments = await loadData("payments");
    const rawJournal = await loadData("journal");

    console.log("\n📊 RAW DATA COUNTS:");
    console.log("Customers:", rawCustomers.length);
    console.log("Products:", rawProducts.length);
    console.log("Orders:", rawOrders.length);
    console.log("Deliveries:", rawDeliveries.length);
    console.log("Delivery Items:", rawDeliveryItems.length);
    console.log("Billing:", rawBilling.length);
    console.log("Billing:", rawBillingItems.length);
    console.log("Payments:", rawPayments.length);
    console.log("Journal:", rawJournal.length);

    // ------------------------------
  // TRANSFORM DATA
  // ------------------------------
  const customers = transformCustomers(rawCustomers);
  const products = transformProducts(rawProducts);
  const orders = transformSalesOrders(rawOrders);
  const orderItems = transformSalesOrderItems(rawOrderItems);
  const deliveries = transformDeliveries(rawDeliveries);
  const deliveryItems = transformDeliveryItems(rawDeliveryItems);
  const billingDocs = transformBillingDocuments(rawBilling);
  const billingItems = transformBillingItems(rawBillingItems);
  const payments = transformPayments(rawPayments);

  // ✅ IMPORTANT FIX
  const paymentIds = new Set(payments.map(p => p.id));

  const journalEntries = transformJournalEntries(rawJournal, paymentIds);

    console.log("\n🔄 TRANSFORMED DATA COUNTS:");
    console.log("Customers:", customers.length);
    console.log("Products:", products.length);
    console.log("Orders:", orders.length);
    console.log("Deliveries:", deliveries.length);
    console.log("Delivery Items:", deliveryItems.length);
    console.log("Billing:", billingDocs.length);
    console.log("Billing:", billingItems.length);
    console.log("Payments:", payments.length);
    console.log("Journal:", journalEntries.length);
    
    if (!deliveryItems.length) {
      console.warn("⚠️ No delivery items found — check transform mapping");
    }

    // Debug sample (important)
    console.log("\n🔍 Sample Transformed Customer:", customers[0]);

    console.log("\n🔍 RAW SAMPLE DATA:\n");

    console.log("Customer RAW:", rawCustomers[0]);
    console.log("Product RAW:", rawProducts[0]);
    console.log("Order RAW:", rawOrders[0]);
    console.log("🚨 DELIVERY RAW SAMPLE:", rawDeliveries[0]);
    console.log("🚨 DELIVERY RAW SAMPLE:", rawDeliveryItems[0]);


    // ------------------------------
    // INSERT DATA (ORDER MATTERS)
    // ------------------------------
    console.log("\n📥 INSERTING DATA...\n");

    await batchInsert("customers", ["id", "name"], customers);
    await batchInsert("products", ["id", "name", "description"], products);

    await batchInsert(
      "sales_orders",
      ["id", "customer_id", "order_date", "status"],
      orders
    );

    await batchInsert(
      "sales_order_items",
      ["order_id", "product_id", "quantity", "price"],
      orderItems
    );

    await batchInsert(
      "deliveries",
      ["id", "order_id", "delivery_date", "status"],
      deliveries
    );

    await batchInsert(
      "delivery_items",
      ["delivery_id", "product_id", "quantity"],
      deliveryItems
    );

    await batchInsert(
      "billing_documents",
      ["id", "delivery_id", "billing_date", "total_amount", "status"],
      billingDocs
    );

    await batchInsert(
      "billing_document_items",
      ["billing_id", "product_id", "quantity", "amount"],
      billingItems
    );

    await batchInsert(
      "payments",
      ["id", "billing_id", "payment_date", "amount", "method"],
      payments
    );

    await batchInsert(
      "journal_entries",
      ["id", "payment_id", "entry_date", "debit", "credit"],
      journalEntries
    );

    console.log("\n🎉 Database seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

// ------------------------------
seed();