import { lookInSession, removeFromSession } from "@/lib/session";
import { createContext, useEffect, useState } from "react";

const defaultUserAuth = {
  token: null,
  first_name: "",
  last_name: "",
  username: "",
  profile_img: "",
  bio: "",
  joinedAt: null,
};

export const AuthContext = createContext({
  userAuth: defaultUserAuth,
  setUserAuth: () => {},
});

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState(defaultUserAuth);

  useEffect(() => {
    try {
      const storedUser = lookInSession("user");
      if (storedUser && typeof storedUser === "object" && storedUser.token) {
        setUserAuth({ ...defaultUserAuth, ...storedUser });
      }
    } catch (error) {
      console.error("Failed to load user from session:", error);
      removeFromSession("user");
    }
  }, []);

  const contextValue = {
    userAuth,
    setUserAuth: (newUserAuth) => {
      if (newUserAuth && typeof newUserAuth === "object") {
        setUserAuth({ ...defaultUserAuth, ...newUserAuth });
      } else {
        setUserAuth(defaultUserAuth);
      }
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
