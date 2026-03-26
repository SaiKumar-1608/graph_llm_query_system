-- ================================
-- CLEAN START
-- ================================
DROP TABLE IF EXISTS journal_entries CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS billing_document_items CASCADE;
DROP TABLE IF EXISTS billing_documents CASCADE;
DROP TABLE IF EXISTS delivery_items CASCADE;
DROP TABLE IF EXISTS deliveries CASCADE;
DROP TABLE IF EXISTS sales_order_items CASCADE;
DROP TABLE IF EXISTS sales_orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS customers CASCADE;

-- ================================
-- CUSTOMERS
-- ================================
CREATE TABLE customers (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================================
-- PRODUCTS
-- ================================
CREATE TABLE products (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT
);

-- ================================
-- SALES ORDERS (HEADER)
-- ================================
CREATE TABLE sales_orders (
  id BIGINT PRIMARY KEY,
  customer_id BIGINT,
  order_date DATE,
  status TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_orders_customer
    FOREIGN KEY (customer_id)
    REFERENCES customers(id)
    ON DELETE SET NULL
);

-- ================================
-- SALES ORDER ITEMS
-- ================================
CREATE TABLE sales_order_items (
  id BIGSERIAL PRIMARY KEY,
  order_id BIGINT,
  product_id BIGINT,
  quantity INT DEFAULT 0,
  price NUMERIC DEFAULT 0,

  CONSTRAINT fk_so_items_order
    FOREIGN KEY (order_id)
    REFERENCES sales_orders(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_so_items_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE SET NULL,

  CONSTRAINT unique_order_product UNIQUE(order_id, product_id)
);

-- ================================
-- DELIVERIES (HEADER)
-- ================================
CREATE TABLE deliveries (
  id BIGINT PRIMARY KEY,
  order_id BIGINT,
  delivery_date DATE,
  status TEXT,

  CONSTRAINT fk_delivery_order
    FOREIGN KEY (order_id)
    REFERENCES sales_orders(id)
    ON DELETE SET NULL
);

-- ================================
-- DELIVERY ITEMS
-- ================================
CREATE TABLE delivery_items (
  id BIGSERIAL PRIMARY KEY,
  delivery_id BIGINT,
  product_id BIGINT,
  quantity INT DEFAULT 0,

  CONSTRAINT fk_delivery_items_delivery
    FOREIGN KEY (delivery_id)
    REFERENCES deliveries(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_delivery_items_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE SET NULL
);

-- ================================
-- BILLING DOCUMENTS (INVOICES)
-- ================================
CREATE TABLE billing_documents (
  id BIGINT PRIMARY KEY,
  delivery_id BIGINT,
  billing_date DATE,
  total_amount NUMERIC DEFAULT 0,
  status TEXT,

  CONSTRAINT fk_billing_delivery
    FOREIGN KEY (delivery_id)
    REFERENCES deliveries(id)
    ON DELETE SET NULL
);

-- ================================
-- BILLING ITEMS
-- ================================
CREATE TABLE billing_document_items (
  id BIGSERIAL PRIMARY KEY,
  billing_id BIGINT,
  product_id BIGINT,
  quantity INT DEFAULT 0,
  amount NUMERIC DEFAULT 0,

  CONSTRAINT fk_billing_items_billing
    FOREIGN KEY (billing_id)
    REFERENCES billing_documents(id)
    ON DELETE CASCADE,

  CONSTRAINT fk_billing_items_product
    FOREIGN KEY (product_id)
    REFERENCES products(id)
    ON DELETE SET NULL
);

-- ================================
-- PAYMENTS
-- ================================
CREATE TABLE payments (
  id BIGINT PRIMARY KEY,
  billing_id BIGINT,
  payment_date DATE,
  amount NUMERIC DEFAULT 0,
  method TEXT,

  CONSTRAINT fk_payment_billing
    FOREIGN KEY (billing_id)
    REFERENCES billing_documents(id)
    ON DELETE SET NULL
);

-- ================================
-- JOURNAL ENTRIES
-- ================================
CREATE TABLE journal_entries (
  id BIGINT PRIMARY KEY,
  payment_id BIGINT,
  entry_date DATE,
  debit NUMERIC DEFAULT 0,
  credit NUMERIC DEFAULT 0,

  CONSTRAINT fk_journal_payment
    FOREIGN KEY (payment_id)
    REFERENCES payments(id)
    ON DELETE SET NULL
);

-- ================================
-- INDEXES (PERFORMANCE BOOST)
-- ================================
CREATE INDEX idx_orders_customer ON sales_orders(customer_id);
CREATE INDEX idx_delivery_order ON deliveries(order_id);
CREATE INDEX idx_billing_delivery ON billing_documents(delivery_id);
CREATE INDEX idx_payment_billing ON payments(billing_id);

CREATE INDEX idx_so_items_order ON sales_order_items(order_id);
CREATE INDEX idx_delivery_items_delivery ON delivery_items(delivery_id);
CREATE INDEX idx_billing_items_billing ON billing_document_items(billing_id);

-- ================================
-- OPTIONAL: ANALYTICS INDEXES
-- ================================
CREATE INDEX idx_orders_date ON sales_orders(order_date);
CREATE INDEX idx_billing_date ON billing_documents(billing_date);
CREATE INDEX idx_payment_date ON payments(payment_date);

-- ================================
-- VALIDATION QUERY
-- ================================
-- FULL ORDER TO CASH FLOW
SELECT 
  o.id AS order_id,
  c.name AS customer,
  d.id AS delivery_id,
  b.id AS billing_id,
  p.id AS payment_id,
  p.amount
FROM sales_orders o
LEFT JOIN customers c ON o.customer_id = c.id
LEFT JOIN deliveries d ON o.id = d.order_id
LEFT JOIN billing_documents b ON d.id = b.delivery_id
LEFT JOIN payments p ON b.id = p.billing_id
LIMIT 10;