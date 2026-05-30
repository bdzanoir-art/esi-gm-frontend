import axios from 'axios';

const BASE_URL = 'http://localhost:8000/api/esi-gm';

const getAuthHeader = () => {
  const token = localStorage.getItem('access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Super Admin Dashboard Stats (users, labs, materials, requests counts)
export const getDashboardStats = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/superadmin/stats/`, {
      headers: getAuthHeader(),
    });
    const d = response.data;
    return [
      {
        id: 1,
        value: d.total_users || 0,
        label: 'Total Users',
        tagText: 'Total',
        style: 'bg-blue-50/20 border-blue-100',
        status: 'bg-blue-100 text-blue-700',
        path: '/admin/users'
      },
      {
        id: 2,
        value: d.total_laboratories || 0,
        label: 'Laboratories',
        tagText: 'Active',
        style: 'bg-purple-50/20 border-purple-100',
        status: 'bg-purple-100 text-purple-700',
        path: '/admin/laboratories'
      },
      {
        id: 3,
        value: d.total_materials || 0,
        label: 'Total Materials',
        tagText: 'Stock',
        style: 'bg-green-50/20 border-green-100',
        status: 'bg-green-100 text-green-700',
        path: '/inventory'
      },
      {
        id: 4,
        value: d.total_requests || 0,
        label: 'Total Requests',
        tagText: 'Pending',
        style: 'bg-orange-50/20 border-orange-100',
        status: 'bg-orange-100 text-orange-700',
        path: '/requests'
      }
    ];
  } catch (error) {
    console.error('Error fetching super admin stats:', error);
    return [];
  }
};

// Get the laboratories overview from the same stats endpoint
export const getLabsSummary = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/superadmin/stats/`, {
        headers: getAuthHeader(),
      });
      return response.data.laboratories_overview || [];
    } catch (error) {
      console.error('Error fetching labs summary:', error);
      return [];
    }
};

// Get role breakdown counts
export const getRoles = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/superadmin/stats/`, {
      headers: getAuthHeader(),
    });
    const data = response.data;
    return [
      { id: 1, label: 'Lab Admins', count: data.lab_admins || 0, color: 'bg-blue-500/10 text-blue-500', details: 'Manage Lab Admins' },
      { id: 2, label: 'Warehouse Managers', count: data.warehouse_managers || 0, color: 'bg-purple-500/10 text-purple-500', details: 'Manage Storekeepers' },
      { id: 3, label: 'Students', count: data.students || 0, color: 'bg-green-500/10 text-green-500', details: 'View Students' },
    ];
  } catch (error) {
    console.error('Error fetching roles:', error);
    return [];
  }
};
export const getUsers = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/superadmin/users/`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};
