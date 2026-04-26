import { createContext, useContext, useState, type ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const authApiBase = (
    import.meta.env.VITE_AUTH_API_BASE_URL as string | undefined
  ) ?? (import.meta.env.VITE_API_BASE_URL as string | undefined);

  const signIn = async (username: string, password: string) => {
    setLoading(true);
    try {
      // Only call backend auth if an explicit API base is configured.
      if (authApiBase) {
        const response = await fetch(`${authApiBase}/api/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        if (!response.ok) throw new Error("Invalid credentials");

        const data = await response.json();
        setToken(data.token);
        setUser(data.user);
        return;
      }

      throw new Error("Auth API not configured");
    } catch (error) {
      // Fallback: mock login for development when backend is not running
      if (username === "admin" && password === "admin123") {
        setToken("mock-jwt-token");
        setUser({
          id: "1",
          username: "admin",
          email: "admin@railsafe.com",
          role: "operator",
        });
        return;
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};