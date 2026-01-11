import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 1. The Main Server Address (No trailing slash, no /api)
export const SERVER_URL = "http://10.0.2.2:5000";

// 2. The API URL (Used for axios/fetch calls)
export const BASE_URL = `${SERVER_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
});

// 🔐 Always attach token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
