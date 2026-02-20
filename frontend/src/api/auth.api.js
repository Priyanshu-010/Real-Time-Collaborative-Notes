import axiosInstance from "./axios";

export const registerUser = async (data) => {
  await axiosInstance.post("/auth/register", data)
}
export const loginUser = async ({email,password}) => {
  await axiosInstance.post("/auth/login", {email, password})
}