import axios from 'axios';

// Backend API URLs - Django backends on different ports
const API_BASE_URLS = {
  esi_gm: 'http://localhost:8000/api/esi-gm/',      // Student/Project backend
  admin: 'http://localhost:8000/api/inventory/',       // Admin dashboard backend
  inventory: 'http://localhost:8000/api/inventory/',   // Inventory/Storekeeper backend
  qr_scanner: 'http://localhost:8000/api/scanner/',  // QR Scanner backend
  materials: 'http://localhost:8000/api/transfers/',   // Materials transfer backend
  browse: 'http://localhost:8000/api/browse/',      // Browse backend — materials catalogue
  my_request: 'http://localhost:8000/api/my-request/', // My requests backend
};

// Create axios instances for each backend
const createApiClient = (baseURL) => {
  const client = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor to add JWT token
  client.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor for token refresh
  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refresh_token');
        
        if (refreshToken) {
          try {
            const response = await axios.post(`${API_BASE_URLS.esi_gm}token/refresh/`, {
              refresh: refreshToken,
            });
            const { access } = response.data;
            localStorage.setItem('access_token', access);
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return client(originalRequest);
          } catch (refreshError) {
            // Refresh failed, logout user
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }
      }
      
      return Promise.reject(error);
    }
  );

  return client;
};

// API Clients
const esiGMClient = createApiClient(API_BASE_URLS.esi_gm);
const adminClient = createApiClient(API_BASE_URLS.admin);
const inventoryClient = createApiClient(API_BASE_URLS.inventory);
const browseClient = createApiClient(API_BASE_URLS.browse);
const myRequestClient = createApiClient(API_BASE_URLS.my_request);
const transfersClient = createApiClient(API_BASE_URLS.materials); // Note: renamed from 'materials' in config to be clearer

// ==================== AUTHENTICATION APIs ====================
export const authAPI = {
  login: (credentials) => esiGMClient.post('login/', credentials),
  register: (data) => esiGMClient.post('register/', data),
  logout: () => esiGMClient.post('logout/'),
  profile: () => esiGMClient.get('profile/'),
  refreshToken: (refresh) => axios.post(`${API_BASE_URLS.esi_gm}token/refresh/`, { refresh }),
};

// ==================== STUDENT APIs ====================
export const studentAPI = {
  // Projects
  getProjects: () => esiGMClient.get('projects/'),
  getProject: (id) => esiGMClient.get(`projects/${id}/`),
  createProject: (data) => esiGMClient.post('create-project/', data),
  updateProject: (id, data) => esiGMClient.post(`projects/${id}/update/`, data),
  deleteProject: (id) => esiGMClient.post(`projects/${id}/delete/`),
  
  // Team Members
  addTeamMember: (projectId, data) => esiGMClient.post(`projects/${projectId}/add-member/`, data),
  deleteTeamMember: (projectId, memberId) => esiGMClient.post(`projects/${projectId}/delete-member/${memberId}/`),
  
  // Materials
  getMaterials: () => esiGMClient.get('materials/'),
  getLaboratories: () => esiGMClient.get('laboratories/'),
  
  // Material Outputs
  getMaterialOutputs: () => esiGMClient.get('material-outputs/'),
  getMaterialOutput: (id) => esiGMClient.get(`material-outputs/${id}/`),
  returnMaterial: (id) => esiGMClient.post(`material-outputs/${id}/return/`),
  
  // Maintenance
  getMaintenanceStats: () => esiGMClient.get('maintenance/stats/'),
  getMaintenanceRecords: () => esiGMClient.get('maintenance/records/'),
  getMaintenanceAlerts: () => esiGMClient.get('maintenance/alerts/'),
  completeMaintenance: (id) => esiGMClient.post(`maintenance/records/${id}/complete/`),
  
  // Dashboard & Stats
  getDashboard: () => esiGMClient.get('dashboard/'),
  getSystemStats: () => esiGMClient.get('system-stats/'),
};

// ==================== ADMIN APIs ====================
export const adminAPI = {
  getStats: () => adminClient.get('dashboard/stats/'),
  getCategories: () => adminClient.get('categories/'),
  getMaterials: () => adminClient.get('materials/'),
  getProjects: () => adminClient.get('projects/'),
  getRequests: () => adminClient.get('requests/'),
  getRequest: (id) => adminClient.get(`requests/${id}/`),
  cancelRequest: (id) => adminClient.post(`requests/${id}/cancel/`),
  getSlip: (id) => adminClient.get(`requests/${id}/slip/`),
  getOutputs: () => adminClient.get('outputs/'),
  getAlerts: () => adminClient.get('alerts/'),
  getUsers: () => adminClient.get('users/'),
};

// ==================== STOREKEEPER APIs ====================
export const storekeeperAPI = {
  getStats: () => inventoryClient.get('dashboard/stats/'),
  getCategories: () => inventoryClient.get('categories/'),
  getMaterials: () => inventoryClient.get('materials/'),
  createMaterial: (data) => inventoryClient.post('materials/', data),
  updateMaterial: (id, data) => inventoryClient.patch(`materials/${id}/`, data),
  getLaboratories: () => inventoryClient.get('laboratories/'),
  getProjects: () => inventoryClient.get('projects/'),
  getRequests: (params = {}) => inventoryClient.get('requests/', { params }),
  getRequest: (id) => inventoryClient.get(`requests/${id}/`),
  cancelRequest: (id) => inventoryClient.post(`requests/${id}/cancel/`),
  updateRequestStatus: (id, action) => inventoryClient.post(`requests/${id}/update-status/`, { action }),
  getSlip: (id) => inventoryClient.get(`requests/${id}/slip/`),
  getOutputs: () => inventoryClient.get('outputs/'),
  getAlerts: () => inventoryClient.get('alerts/'),
  createAlert: (data) => inventoryClient.post('alerts/', data),
  getUsers: () => inventoryClient.get('users/'),
};

// ==================== BROWSE APIs ====================
export const browseAPI = {
  // GET /api/browse/materials/?search=&category=
  getMaterials: (params = {}) => browseClient.get('materials/', { params }),
  // GET /api/browse/materials/<pk>/
  getMaterial: (id) => browseClient.get(`materials/${id}/`),
  // GET /api/browse/categories/
  getCategories: () => browseClient.get('categories/'),
};

// ==================== MY REQUEST APIs ====================
export const myRequestAPI = {
  getRequests: (params = {}) => myRequestClient.get('requests/', { params }),
  createRequest: (data) => myRequestClient.post('requests/', data),
  getRequest: (id) => myRequestClient.get(`requests/${id}/`),
  getDashboardStats: () => myRequestClient.get('dashboard/'),
};

// ==================== TRANSFERS APIs ====================
export const transfersAPI = {
  getTransfers: () => transfersClient.get('/'),
  createTransfer: (data) => transfersClient.post('/', data),
};

// ==================== TOKEN UTILITIES ====================
export const setTokens = (access, refresh) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getTokens = () => ({
  access: localStorage.getItem('access_token'),
  refresh: localStorage.getItem('refresh_token'),
});

export const isAuthenticated = () => {
  return !!localStorage.getItem('access_token');
};

// Default export
export default {
  esiGMClient,
  adminClient,
  inventoryClient,
  browseClient,
  myRequestClient,
  authAPI,
  studentAPI,
  adminAPI,
  storekeeperAPI,
  browseAPI,
  myRequestAPI,
  transfersAPI,
  setTokens,
  clearTokens,
  getTokens,
  isAuthenticated,
};
