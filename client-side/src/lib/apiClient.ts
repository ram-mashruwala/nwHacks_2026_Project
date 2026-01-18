import axios, { type AxiosInstance } from 'axios';

const apiClient: AxiosInstance = axios.create({
  baseURL: "/api", // Relative URL, uses Vite proxy
  timeout: 31000, // Request timeout in milliseconds
  headers: {
    'X-Custom-Header': 'foobar',
    'Content-Type': 'application/json',
  }
});

export default apiClient;

export const resOk = (statusCode: number) => {
  return statusCode >= 200 && statusCode < 300;
}
