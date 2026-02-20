import axiosInstance from "./axios";

export const registerUser = (data) => axiosInstance.post("/auth/register", data)
export const loginUser = (data) => axiosInstance.post("/auth/login", data)