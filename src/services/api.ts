import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export default api;

export const getProjects = () => api.get('/projects');
export const getProject = (id: string | number) => api.get(`/projects/${id}`);
export const createProject = (data: any) => api.post('/projects', data);
export const updateProject = (id: string | number, data: any) => api.put(`/projects/${id}`, data);
export const deleteProject = (id: string | number) => api.delete(`/projects/${id}`);

export const getProjectAreas = (projectId: string | number) => api.get(`/projects/${projectId}/areas`);
export const createArea = (projectId: string | number, data: any) => api.post(`/projects/${projectId}/areas`, data);

export const getItems = () => api.get('/items');
export const createItem = (data: any) => api.post('/items', data);

export const getVendors = () => api.get('/vendors');
export const createVendor = (data: any) => api.post('/vendors', data);
