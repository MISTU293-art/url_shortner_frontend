import axios from "axios";

const API_BASE = "http://localhost:3000/api/v1";

const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor to attach JWT token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("shortx_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to extract data cleanly
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customMessage = error.response?.data?.message || error.message || "Network Error";
    return Promise.reject(new Error(customMessage));
  }
);

export const apiService = {
  // Authentication API
  register: (payload) => apiClient.post("/auth/register", payload),
  login: (payload) => apiClient.post("/auth/login", payload),
  logout: () => apiClient.post("/auth/logout"),
  getMe: () => apiClient.get("/auth/me"),

  // URLs API
  shortenUrl: (payload) => apiClient.post("/urls", payload),
  getAllUrls: (params) => apiClient.get("/urls", { params }),
  getUrlById: (id) => apiClient.get(`/urls/${id}`),
  updateUrl: (id, payload) => apiClient.put(`/urls/${id}`, payload),
  deleteUrl: (id) => apiClient.delete(`/urls/${id}`),
  getUrlQr: (shortCode) => apiClient.get(`/urls/${shortCode}/qr`),
  bulkShorten: (urls) => apiClient.post("/urls/bulk", { urls }),

  // Dashboard & Cache API
  getDashboardStats: () => apiClient.get("/dashboard/stats"),
  clearCache: () => apiClient.post("/dashboard/cache/clear"),

  // Health
  checkHealth: () => axios.get("http://localhost:3000/health", { timeout: 3000 })
};

export default apiService;
