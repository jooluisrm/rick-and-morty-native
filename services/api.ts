import axios from 'axios';

const api = axios.create({
  baseURL: 'https://rickandmortyapi.com/api', // Substitua pela URL da sua futura API
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
