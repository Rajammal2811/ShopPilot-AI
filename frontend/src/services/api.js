const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(endpoint, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'x-session-id': localStorage.getItem('shoppilot_session_id') || 'session-demo-1'
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || data.error || `HTTP ${res.status}`);
    }
    return data;
  } catch (err) {
    console.warn(`API Error [${endpoint}]:`, err.message);
    throw err;
  }
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/products${query ? `?${query}` : ''}`);
  },

  getProductById: (id) => request(`/api/products/${id}`),

  // AI Chat
  sendAIChat: (prompt) => request('/api/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ prompt })
  }),

  // Cart
  getCart: () => request('/api/cart'),
  updateCart: (items) => request('/api/cart', {
    method: 'POST',
    body: JSON.stringify({ items })
  }),

  // Payment
  getPaymentConfig: () => request('/api/payment/config'),
  
  createPaymentOrder: (items, customer) => request('/api/payment/create-order', {
    method: 'POST',
    body: JSON.stringify({ items, customer })
  }),

  verifyPayment: (payload) => request('/api/payment/verify', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Orders
  getOrders: () => request('/api/orders'),
  getOrderById: (id) => request(`/api/orders/${id}`),

  // Audit Logs
  getAuditLogs: () => request('/api/audit'),

  // Analytics
  getAnalytics: () => request('/api/analytics'),

  // Health
  checkHealth: () => request('/api/health')
};
