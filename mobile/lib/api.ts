import axios from "axios";
import * as SecureStore from "expo-secure-store";


let _onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(fn: () => void) {
    _onUnauthorized = fn;
}


// export const API_BASE_URL = "http://192.168.0.101:5000/api";
export const API_BASE_URL = "https://social-feed-app-chi.vercel.app/api";

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});


api.interceptors.request.use(
    async (config) => {
        const token = await SecureStore.getItemAsync("auth_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);


api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error?.response?.status;


        if (status === 401) {
            _onUnauthorized?.();
            return Promise.reject(new Error("Session expired. Please log in again."));
        }

        const message =
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong";

            console.log(error?.response);
            

        console.error("API Error:", message, "Details:", error.status || error);
        return Promise.reject(new Error(message));
    }
);

export default api;



export const authApi = {
    register: (data: { username: string; email: string; password: string }) =>
        api.post("/auth/register", data),
    login: (data: { email: string; password: string }) =>
        api.post("/auth/login", data),
    getMe: () => api.get("/auth/me"),
    updatePushToken: (pushToken: { pushToken: string }) =>
        api.put("/auth/push-token", {pushToken}),
};

//Posts

export const postsApi = {
    getPosts: (params?: { page?: number; limit?: number; username?: string }) => api.get(`/posts?page=${params?.page || 1}&limit=${params?.limit || 10}${params?.username ? `&username=${params.username}` : ''}`),
    getPostById: (id: string) => api.get(`/posts/${id}`),
    createPost: (text: string) => api.post("/posts", { content: text }),
    toggleLike: (id: string) => api.post(`/posts/${id}/like`),
    addComment: (id: string, text: string) =>
        api.post(`/posts/${id}/comment`, { content: text }),
    getComments: (id: string, params?: { page?: number; limit?: number }) =>
        api.get(`/posts/${id}/comments`, { params }),
};
