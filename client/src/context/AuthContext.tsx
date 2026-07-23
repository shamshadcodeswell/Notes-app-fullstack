import { createContext, useContext, useState, useEffect } from "react";
import config from "../config";

interface AuthContextType {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const refreshToken = async () => {
      try {
        const res = await fetch(import.meta.env.VITE_ROTATE_TOKEN_URI, {
          method: "POST",
          credentials: "include",
        });
        if (res.ok) {
          const json = await res.json();
          setAccessToken(json.accessToken);
        }
      } catch (error) {
        // no valid refresh cookie — user needs to login
      } finally {
        setLoading(false);
      }
    };
    refreshToken();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isAuthenticated: !!accessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
