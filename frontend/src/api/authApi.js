import axiosInstance from './axiosConfig';

export const authApi = {
  // ثبت‌نام
  register: async (userData) => {
    const response = await axiosInstance.post('/auth/register', userData);
    return response.data;
  },

  // ورود
  login: async (credentials) => {
    const response = await axiosInstance.post('/auth/login', credentials);
    if (response.data.success) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  // خروج
  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return response.data;
  },

  // دریافت پروفایل
  getProfile: async () => {
    const response = await axiosInstance.get('/auth/profile');
    return response.data;
  },

  // تغییر رمز عبور
  changePassword: async (passwordData) => {
    const response = await axiosInstance.put('/auth/change-password', passwordData);
    return response.data;
  },

  // اعتبارسنجی توکن
  validateToken: async () => {
    const response = await axiosInstance.get('/auth/validate');
    return response.data;
  }
};