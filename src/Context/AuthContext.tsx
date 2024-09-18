import useCheckAuth from "@/hooks/api/auth/useCheckAuth";
import {
  useState,
  createContext,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { AuthContextType } from "types";
const AuthContext = createContext<AuthContextType | null>(null);
function AuthContextProvider({ children }: { children: ReactNode }) {
  const { user: authUser } = useCheckAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthContextType["user"]>(null);

  useEffect(() => {
    if (authUser) {
      setIsAuthenticated(true);
      setUser(authUser);
      console.log("auth state", authUser.isAuthenticated);
    }
  }, [authUser, isAuthenticated]);
  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, user, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthContextProvider");
  }
  return context;
};

export default AuthContextProvider;
