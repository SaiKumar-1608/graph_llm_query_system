/**
 * Extract number from string safely
 */
function toNumber(val) {
  if (!val) return null;
  const match = String(val).match(/\d+/);
  return match ? Number(match[0]) : null;
}

/**
 * ================================
 * CUSTOMERS ✅ (already working)
 * ================================
 */
export function transformCustomers(raw) {
  return raw.map((c) => ({
    id: toNumber(c.businessPartner),
    name: c.businessPartnerFullName || c.businessPartnerName,
  }));
}

/**
 * ================================
 * PRODUCTS ✅ FIXED
 * ================================
 */
export function transformProducts(raw) {
  return raw.map((p) => ({
    id: toNumber(p.product),
    name: p.productOldId || p.product,
    description: p.productType,
  }));
}

/**
 * ================================
 * SALES ORDERS ✅ FIXED
 * ================================
 */
export function transformSalesOrders(raw) {
  return raw.map((o) => ({
    id: toNumber(o.salesOrder),
    customer_id: toNumber(o.soldToParty),
    order_date: o.creationDate,
    status: o.overallDeliveryStatus,
  }));
}

/**
 * ================================
 * SALES ORDER ITEMS
 * ================================
 */
export function transformSalesOrderItems(raw) {
  return raw.map((i) => ({
    order_id: toNumber(i.salesOrder),
    product_id: toNumber(i.product),
    quantity: Number(i.orderQuantity || 0),
    price: Number(i.netAmount || 0),
  }));
}

/**
 * ================================
 * DELIVERIES
 * ================================
 */
export function transformDeliveries(raw) {
  return raw
    .map((d) => {
      // 🔥 Try multiple possible keys
      const id =
        toNumber(d.outboundDelivery) ||
        toNumber(d.OutboundDelivery) ||
        toNumber(d.deliveryDocument) ||
        toNumber(d.DeliveryDocument);

      if (!id) return null;

      const order_id =
        toNumber(d.referenceSDDocument) ||
        toNumber(d.salesOrder);

      return {
        id,
        order_id,
        delivery_date: d.creationDate,
        status: d.overallGoodsMovementStatus,
      };
    })
    .filter(Boolean);
}

/**
 * ================================
 * DELIVERY ITEMS
 * ================================
 */
export function transformDeliveryItems(raw) {
  return raw
    .map((i) => {
      const delivery_id = toNumber(i.deliveryDocument);
      const order_id = toNumber(i.referenceSdDocument);

      if (!delivery_id) return null;

      return {
        delivery_id,
        product_id: null, // ✅ IMPORTANT FIX
        quantity: Number(i.actualDeliveryQuantity || 0),
      };
    })
    .filter(Boolean);
}
     

/**
 * ================================
 * BILLING DOCUMENTS
 * ================================
 */
export function transformBillingDocuments(raw) {
  return raw.map((b) => ({
    id: toNumber(b.billingDocument),
    delivery_id: toNumber(b.referenceSDDocument),
    billing_date: b.creationDate,
    total_amount: Number(b.totalNetAmount || 0),
    status: b.overallBillingStatus,
  }));
}

/**
 * ================================
 * BILLING ITEMS
 * ================================
 */
export function transformBillingItems(raw) {
  return raw.map((i) => ({
    billing_id: toNumber(i.billingDocument),
    product_id: toNumber(i.product),
    quantity: Number(i.billingQuantity || 0),
    amount: Number(i.netAmount || 0),
  }));
}

/**
 * ================================
 * PAYMENTS
 * ================================
 */
export function transformPayments(raw) {
  return raw.map((p) => ({
    id: toNumber(p.accountingDocument),
    billing_id: toNumber(p.referenceDocument),
    payment_date: p.postingDate,
    amount: Number(p.amountInCompanyCodeCurrency || 0),
    method: p.paymentMethod,
  }));
}

/**
 * ================================
 * JOURNAL ENTRIES
 * ================================
 */
export function transformJournalEntries(raw, validPaymentIds) {
  return raw
    .map((j) => {
      const id = toNumber(j.accountingDocument);
      const payment_id = toNumber(j.accountingDocument);

      // ❌ Skip invalid or non-matching payments
      if (!id || !validPaymentIds.has(payment_id)) return null;

      return {
        id,
        payment_id,
        entry_date: j.postingDate,
        debit: Number(j.debitAmount || 0),
        credit: Number(j.creditAmount || 0),
      };
    })
    .filter(Boolean);
}