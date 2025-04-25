import axios from "axios";
import useAuthStore from "@/store/auth-store";
import { jwtDecode } from "jwt-decode";


const AUTH_API_URL = "http://127.0.0.1:8000/api";
// Instance pour auth-service
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth: ajoute le token
authApi.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Auth: refresh automatique si 401
authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken, login, logout } = useAuthStore.getState();
        if (!refreshToken) throw new Error("No refresh token");

        const res = await axios.post(`${AUTH_API_URL}/auth/refresh`, {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token: newRefreshToken } = res.data;
        const decoded = jwtDecode(access_token);

        login(
          {
            id: decoded.user_id,
            email: decoded.email,
            role: decoded.role || "user",
          },
          access_token,
          newRefreshToken || refreshToken
        );

        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return authApi(originalRequest);
      } catch (refreshError) {
        logout();
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);




export { authApi,  };
