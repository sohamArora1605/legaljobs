// In production (Docker / Render / Vercel), if VITE_API_URL is set, use it;
// otherwise default to same-origin relative '/api' or fallback to 'http://localhost:5000/api' in development.
const isDev = import.meta.env.DEV;
export const API_BASE = import.meta.env.VITE_API_URL || (isDev ? 'http://localhost:5000/api' : '/api');
