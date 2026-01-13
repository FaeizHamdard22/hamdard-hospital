import axiosInstance from './axiosConfig';

export const patientApi = {
  // ایجاد بیمار جدید
  createPatient: async (patientData) => {
    const response = await axiosInstance.post('/patients', patientData);
    return response.data;
  },

  // دریافت لیست بیماران
  getPatients: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await axiosInstance.get(`/patients?${queryParams}`);
    return response.data;
  },

  // دریافت بیمار بر اساس ID
  getPatientById: async (id) => {
    const response = await axiosInstance.get(`/patients/${id}`);
    return response.data;
  },

  // ویرایش بیمار
  updatePatient: async (id, patientData) => {
    const response = await axiosInstance.put(`/patients/${id}`, patientData);
    return response.data;
  },

  // حذف بیمار
  deletePatient: async (id) => {
    const response = await axiosInstance.delete(`/patients/${id}`);
    return response.data;
  },

  // دریافت آمار بیماران
  getPatientStats: async () => {
    const response = await axiosInstance.get('/patients/stats');
    return response.data;
  },

  // جستجوی بیماران
  searchPatients: async (searchTerm) => {
    const response = await axiosInstance.get(`/patients?search=${searchTerm}`);
    return response.data;
  }
};