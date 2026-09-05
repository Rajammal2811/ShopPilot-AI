import { PRODUCTS } from '../data/products.js';

class InMemoryStore {
  constructor() {
    this.products = [...PRODUCTS];
    this.orders = [];
    this.auditLogs = [];
    this.carts = new Map();
    
    // Seed initial synthetic historical analytics & audit events for a rich baseline
    this.seedBaselineData();
  }

  seedBaselineData() {
    const now = Date.now();
    const min = 60 * 1000;
    const hour = 60 * min;

    // Seed 4 sample historical orders to populate merchant growth dashboard right away
    const sampleOrders = [
      {
        id: "ORD-94812",
        orderId: "order_demo_94812",
        items: [
          { ...PRODUCTS[0], quantity: 1 },
          { ...PRODUCTS[10], quantity: 1 }
        ],
        amount: 63994,
        subtotal: 63994,
        upsellAmount: 8995,
        aiAssisted: true,
        status: "PAID",
        paymentId: "pay_demo_94812",
        createdAt: new Date(now - 48 * hour).toISOString(),
        customer: { name: "Ananya Sharma", email: "ananya@example.com" }
      },
      {
        id: "ORD-83219",
        orderId: "order_demo_83219",
        items: [
          { ...PRODUCTS[4], quantity: 1 },
          { ...PRODUCTS[9], quantity: 1 }
        ],
        amount: 23998,
        subtotal: 23998,
        upsellAmount: 4999,
        aiAssisted: true,
        status: "PAID",
        paymentId: "pay_demo_83219",
        createdAt: new Date(now - 24 * hour).toISOString(),
        customer: { name: "Rahul Verma", email: "rahul@example.com" }
      },
      {
        id: "ORD-71934",
        orderId: "order_demo_71934",
        items: [
          { ...PRODUCTS[1], quantity: 1 },
          { ...PRODUCTS[12], quantity: 1 }
        ],
        amount: 61289,
        subtotal: 61289,
        upsellAmount: 1299,
        aiAssisted: true,
        status: "PAID",
        paymentId: "pay_demo_71934",
        createdAt: new Date(now - 12 * hour).toISOString(),
        customer: { name: "Priya Patel", email: "priya@example.com" }
      },
      {
        id: "ORD-61204",
        orderId: "order_demo_61204",
        items: [
          { ...PRODUCTS[2], quantity: 1 }
        ],
        amount: 49999,
        subtotal: 49999,
        upsellAmount: 0,
        aiAssisted: false,
        status: "PAID",
        paymentId: "pay_demo_61204",
        createdAt: new Date(now - 4 * hour).toISOString(),
        customer: { name: "Karan Singh", email: "karan@example.com" }
      }
    ];

    this.orders.push(...sampleOrders);

    // Seed baseline audit logs
    const auditEvents = [
      {
        id: "aud-001",
        timestamp: new Date(now - 30 * min).toISOString(),
        type: "USER_INTENT",
        description: "Customer intent received: 'I need a laptop for coding under ₹60,000'",
        status: "SUCCESS",
        metadata: { prompt: "I need a laptop for coding under ₹60,000", budget: 60000, category: "Laptops" }
      },
      {
        id: "aud-002",
        timestamp: new Date(now - 29 * min).toISOString(),
        type: "PRODUCT_SEARCH",
        description: "Analyzed 20 products across catalog matching budget ₹60,000 and category 'Laptops'",
        status: "SUCCESS",
        metadata: { candidateCount: 4, catalogSize: 20 }
      },
      {
        id: "aud-003",
        timestamp: new Date(now - 28 * min).toISOString(),
        type: "RECOMMENDATION",
        description: "Selected Lenovo IdeaPad Slim 5 Intel i5 (Score: 96%) as primary match",
        status: "SUCCESS",
        metadata: { productId: "prod-101", price: 54999, score: 0.96 }
      },
      {
        id: "aud-004",
        timestamp: new Date(now - 27 * min).toISOString(),
        type: "UPSELL_SUGGESTED",
        description: "Identified 2 cross-sell add-ons: Wireless Mouse (₹799) & Laptop Stand (₹1,299)",
        status: "SUCCESS",
        metadata: { items: ["Logitech Pebble Mouse", "Aluminum Stand"], totalUpsell: 2098 }
      },
      {
        id: "aud-005",
        timestamp: new Date(now - 25 * min).toISOString(),
        type: "USER_CONFIRMATION",
        description: "Customer confirmed purchase intent for cart total ₹57,097",
        status: "SUCCESS",
        metadata: { totalAmount: 57097 }
      },
      {
        id: "aud-006",
        timestamp: new Date(now - 24 * min).toISOString(),
        type: "PAYMENT_ORDER_CREATED",
        description: "Created payment order order_demo_94812 for ₹57,097 (INR)",
        status: "SUCCESS",
        metadata: { orderId: "order_demo_94812", amount: 57097, currency: "INR" }
      },
      {
        id: "aud-007",
        timestamp: new Date(now - 23 * min).toISOString(),
        type: "PAYMENT_SUCCESS",
        description: "Payment verified successfully via signature verification (pay_demo_94812)",
        status: "SUCCESS",
        metadata: { paymentId: "pay_demo_94812", orderId: "order_demo_94812" }
      }
    ];

    this.auditLogs.push(...auditEvents);
  }

  // Products
  getProducts(query = {}) {
    let list = [...this.products];
    if (query.category) {
      list = list.filter(p => p.category.toLowerCase() === query.category.toLowerCase());
    }
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (query.maxPrice) {
      list = list.filter(p => p.price <= Number(query.maxPrice));
    }
    return list;
  }

  getProductById(id) {
    return this.products.find(p => p.id === id);
  }

  // Orders
  getOrders() {
    return [...this.orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.orders.find(o => o.id === id || o.orderId === id);
  }

  createOrder(orderData) {
    const newOrder = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      createdAt: new Date().toISOString(),
      status: "CREATED",
      ...orderData
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId, status, paymentId = null, paymentDetails = {}) {
    const order = this.orders.find(o => o.orderId === orderId || o.id === orderId);
    if (order) {
      order.status = status;
      if (paymentId) order.paymentId = paymentId;
      order.paymentDetails = paymentDetails;
      order.updatedAt = new Date().toISOString();
    }
    return order;
  }

  // Audit Logs
  getAuditLogs() {
    return [...this.auditLogs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  recordAuditEvent(type, description, status = "SUCCESS", metadata = {}) {
    const event = {
      id: `aud-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      type,
      description,
      status,
      metadata
    };
    this.auditLogs.unshift(event);
    return event;
  }

  // Cart
  getCart(sessionId = "default") {
    if (!this.carts.has(sessionId)) {
      this.carts.set(sessionId, { items: [], subtotal: 0, upsellTotal: 0, total: 0 });
    }
    return this.carts.get(sessionId);
  }

  updateCart(sessionId = "default", cartData) {
    this.carts.set(sessionId, cartData);
    return cartData;
  }

  // Analytics
  getAnalytics() {
    const paidOrders = this.orders.filter(o => o.status === "PAID");
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const aiOrders = paidOrders.filter(o => o.aiAssisted !== false);
    const aiRevenue = aiOrders.reduce((sum, o) => sum + (o.amount || 0), 0);
    const upsellRevenue = paidOrders.reduce((sum, o) => sum + (o.upsellAmount || 0), 0);
    const orderCount = paidOrders.length;
    const avgOrderValue = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;
    
    // Revenue timeline (last 7 days simulation / aggregation)
    const revenueGrowth = [
      { day: "Mon", total: 45000, aiRevenue: 38000, upsell: 4200 },
      { day: "Tue", total: 62000, aiRevenue: 52000, upsell: 6800 },
      { day: "Wed", total: 78000, aiRevenue: 69000, upsell: 8500 },
      { day: "Thu", total: 63994, aiRevenue: 63994, upsell: 8995 },
      { day: "Fri", total: 85288, aiRevenue: 75000, upsell: 10200 },
      { day: "Sat", total: 98000, aiRevenue: 88000, upsell: 12500 },
      { day: "Sun", total: totalRevenue, aiRevenue: aiRevenue, upsell: upsellRevenue }
    ];

    // Funnel stats
    const funnel = [
      { stage: "Customer Intent", count: 180, rate: "100%" },
      { stage: "AI Recommendation", count: 165, rate: "91.6%" },
      { stage: "Product View", count: 142, rate: "78.8%" },
      { stage: "Upsell Displayed", count: 120, rate: "66.6%" },
      { stage: "Checkout Gate", count: 98, rate: "54.4%" },
      { stage: "Payment Confirmed", count: 86, rate: "47.7%" }
    ];

    const aiInsights = [
      {
        id: 1,
        title: "High AI-Influenced Sales Share",
        description: `AI recommendations directly influenced ₹${aiRevenue.toLocaleString('en-IN')} in total sales.`,
        metric: `${Math.round((aiRevenue / (totalRevenue || 1)) * 100)}%`,
        type: "positive"
      },
      {
        id: 2,
        title: "Cross-Sell Basket Booster",
        description: `Smart upsell suggestions contributed ₹${upsellRevenue.toLocaleString('en-IN')} in incremental revenue.`,
        metric: `+₹${Math.round(upsellRevenue / (orderCount || 1)).toLocaleString('en-IN')} / order`,
        type: "highlight"
      },
      {
        id: 3,
        title: "Higher Conversion Rate",
        description: "Customers who received structured 'Why this product?' reasons converted 18% faster.",
        metric: "18% Lift",
        type: "insight"
      }
    ];

    return {
      metrics: {
        totalRevenue,
        aiRevenue,
        upsellRevenue,
        orderCount,
        conversionRate: "47.7%",
        avgOrderValue
      },
      revenueGrowth,
      funnel,
      aiInsights
    };
  }
}

export const store = new InMemoryStore();
