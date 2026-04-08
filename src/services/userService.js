import API from '../api/axios';

export const getUsers = async (params) => {
  const { data } = await API.get('/users', { params });
  return data;
};

export const createUser = async (userData) => {
  const { data } = await API.post('/users', userData);
  return data.data;
};

export const updateUser = async (id, userData) => {
  const { data } = await API.put(`/users/${id}`, userData);
  return data.data;
};

export const deactivateUser = async (id) => {
  const { data } = await API.delete(`/users/${id}`);
  return data;
};
