// const BASE_URL = "https://kovoschool-backend.vercel.app/api";
const BASE_URL = "http://127.0.0.1:8000//api";

export const getHeadersWithAuth = () => {
  const token = localStorage.getItem("access");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const getPrivateUrl = (endpoint: string) => `${BASE_URL}/${endpoint}`;
