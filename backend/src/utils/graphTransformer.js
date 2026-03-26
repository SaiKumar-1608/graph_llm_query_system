export function transformToGraph(rows) {
  const nodes = [];
  const edges = [];

  const customerSet = new Set();

  rows.forEach(row => {
    const customerId = row.customer_id;
    const orderId = row.id;

    if (!customerSet.has(customerId)) {
      nodes.push({
        id: `customer-${customerId}`,
        label: `Customer ${customerId}`,
      });
      customerSet.add(customerId);
    }

    nodes.push({
      id: `order-${orderId}`,
      label: `Order ${orderId}`,
    });

    edges.push({
      from: `customer-${customerId}`,
      to: `order-${orderId}`,
      label: "PLACED",
    });
  });

  return { nodes, edges };
}