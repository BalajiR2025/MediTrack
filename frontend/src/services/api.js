import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000/api",
});

API.interceptors.request.use((config) => {
  const username = localStorage.getItem("username");
  const password = localStorage.getItem("password");

  if (username && password) {
    config.auth = {
      username: username,
      password: password,
    };
  }

  return config;
});

export default API;