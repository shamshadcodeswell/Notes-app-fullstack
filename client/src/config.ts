const REGISTER_URL = import.meta.env.VITE_REGISTER_URI;
const LOGIN_URL = import.meta.env.VITE_LOGIN_URI;
const ROTATE_URL = import.meta.env.VITE_ROTATE_TOKEN_URI;
const LOGOUT_URL = import.meta.env.VITE_LOGOUT_URI;

if (!REGISTER_URL || !LOGIN_URL || !ROTATE_URL || !LOGOUT_URL) {
  throw new Error("Missing environment variables for API URLs");
}

const config = {
  REGISTER_URL,
  LOGIN_URL,
  ROTATE_TOKEN_URL: ROTATE_URL,
  LOGOUT_URL,
};

export default config;
