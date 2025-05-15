import axios from 'axios';


const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});


export const uploadImages = async (files: File[], modelName: string) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });
  formData.append('modelName', modelName);

  const { data } = await api.post('/predict', formData);
  return data;
};