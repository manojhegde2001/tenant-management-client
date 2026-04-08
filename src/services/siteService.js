import API from '../api/axios';

export const getSites = async () => {
  const { data } = await API.get('/sites');
  return data.data;
};

export const createSite = async (siteData) => {
  const { data } = await API.post('/sites', siteData);
  return data.data;
};

export const updateSite = async (id, siteData) => {
  const { data } = await API.put(`/sites/${id}`, siteData);
  return data.data;
};

export const deleteSite = async (id) => {
  const { data } = await API.delete(`/sites/${id}`);
  return data;
};
