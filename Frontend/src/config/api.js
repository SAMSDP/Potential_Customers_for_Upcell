// config/api.js
const DEFAULT_NGROK_URL = "https://actual-hamster-renewing.ngrok-free.app"; // replace with your ngrok url

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL && import.meta.env.VITE_API_BASE_URL !== ""
    ? import.meta.env.VITE_API_BASE_URL
    : DEFAULT_NGROK_URL;
