import axios from 'axios';

// Yeh automatically check kar lega ke app local chal rahi hai ya Vercel par
const API = axios.create({
  baseURL: import.meta.env.PROD 
    ? '/api' // Production (Vercel) par yeh chalega
    : 'http://localhost:5000/api', // Local development par yeh chalega
  withCredentials: true // Agar cookies / sessions use kar rahe hain
});

export default API;