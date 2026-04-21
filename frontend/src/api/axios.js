import axios from "axios";

const API = axios.create({
    baseURL: "https://recipe-backend-af0v.onrender.com/api",
    withCredentials: true
});

// 🔥 RESPONSE INTERCEPTOR
API.interceptors.response.use(
    res => res,
    async (error) => {
        const originalRequest = error.config;

        // agar 401 hai aur retry nahi hua
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await API.post("/auth/refresh");

                // 🔁 retry original request
                return API(originalRequest);

            } catch (err) {
                // refresh bhi fail → logout
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default API;