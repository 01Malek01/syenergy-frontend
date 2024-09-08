import useCheckAuth from "@/hooks/api/useCheckAuth";
import { useState, createContext, useContext, useEffect } from "react";
const AuthContext = createContext(null);


function AuthContextProvider({ children }) {
  const { user: authUser } = useCheckAuth();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

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
