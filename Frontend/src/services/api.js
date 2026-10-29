import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.PROD
    ? '/api'
    : 'http://localhost:5000/api',
  withCredentials: true
});

const MAX_RETRIES = 3;
const RETRY_DELAY = 1500;

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config.method !== 'get') return Promise.reject(error);

    const status = error.response?.status;
    const shouldRetry = !error.response || status >= 500;
    if (!shouldRetry) return Promise.reject(error);

    config.retryCount = config.retryCount || 0;
    if (config.retryCount >= MAX_RETRIES) return Promise.reject(error);

    config.retryCount += 1;
    await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY));
    return API(config);
  }
);

export default API;