const REGISTER_URL = import.meta.env.VITE_REGISTER_URI;
const LOGIN_URL = import.meta.env.VITE_LOGIN_URI;

if (!REGISTER_URL || !LOGIN_URL) {
  throw new Error("Missing environment variables for API URLs");
}

const config = {
  REGISTER_URL: "http://localhost:5000/api/auth/register",
  LOGIN_URL: "http://localhost:5000/api/auth/login",
  ROTATE_TOKEN_URL: "http://localhost:5000/api/auth/rotate-token",
};

export default config;
