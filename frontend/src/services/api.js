// Fast in-memory response cache for idempotent queries
const cache = new Map();

// Determine API base URL dynamically
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }
  // In development, Vite dev server proxies /api directly to localhost:5000
  // Returning '' avoids cross-origin preflight requests (saving 50-100ms per call)
  // In production (e.g. Vercel), relative root routes directly to serverless /api
  return '';
}

export function buildApiUrl(endpoint) {
  const base = getApiBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;

  if (!base) {
    return cleanEndpoint;
  }

  // Prevent duplicate /api if base already ends with /api
  if (base.endsWith('/api') && cleanEndpoint.startsWith('/api/')) {
    return `${base}${cleanEndpoint.slice(4)}`;
  }

  return `${base}${cleanEndpoint}`;
}

async function request(endpoint, options = {}) {
  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  
  // Return cached response instantly if available (0ms)
  if (isGet && cache.has(endpoint)) {
    return cache.get(endpoint);
  }

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'x-session-id': localStorage.getItem('shoppilot_session_id') || 'session-demo-1'
  };

  const url = buildApiUrl(endpoint);

  // Fast AbortController timeout (3000ms max) to prevent UI hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  let res;
  try {
    res = await fetch(url, {
      ...options,
      headers: { ...defaultHeaders, ...options.headers },
      signal: options.signal || controller.signal
    });
  } catch (networkErr) {
    clearTimeout(timeoutId);
    const errorMsg = `Unable to connect to server at ${url}. ${networkErr.message || 'Network error'}.`;
    console.warn(`Network Warning [${endpoint}]:`, errorMsg);
    throw new Error(errorMsg);
  } finally {
    clearTimeout(timeoutId);
  }

  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const isJson = contentType.includes('application/json');

  // Handle non-JSON responses safely (e.g., HTML 404/500/SPA fallback)
  if (!isJson) {
    let responseText = '';
    try {
      responseText = await res.text();
    } catch (_) {}

    console.warn(`Non-JSON response received from ${url} [Status ${res.status}]:`, responseText.slice(0, 300));
    let userFriendlyError = `API endpoint '${endpoint}' returned a non-JSON response with HTTP ${res.status}.`;
    if (res.status === 404) {
      userFriendlyError = `API route '${endpoint}' not found (HTTP 404).`;
    } else if (res.status >= 500) {
      userFriendlyError = `Server gateway error (HTTP ${res.status}).`;
    }
    throw new Error(userFriendlyError);
  }

  // Parse JSON safely
  let data;
  try {
    data = await res.json();
  } catch (jsonErr) {
    throw new Error(`Failed to parse API response from ${endpoint}: Invalid JSON format.`);
  }

  // Handle HTTP error status codes
  if (!res.ok) {
    const errorMessage = data?.message || data?.error || `Request failed with HTTP ${res.status}`;
    const err = new Error(errorMessage);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  // Cache successful GET results for instant 0ms access
  if (isGet) {
    cache.set(endpoint, data);
  }

  return data;
}

export const api = {
  // Products (cached after first fetch)
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
