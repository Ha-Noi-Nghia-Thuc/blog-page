import { lookInSession } from "@/lib/session";
import React, { createContext, useEffect, useState } from "react";

export const AuthContext = createContext({
  userAuth: {
    token: null,
    first_name: "",
    last_name: "",
    username: "",
    profile_img: "",
  },
  setUserAuth: () => {},
});

export const AuthProvider = ({ children }) => {
  const [userAuth, setUserAuth] = useState({
    token: null,
    first_name: "",
    last_name: "",
    username: "",
    profile_img: "",
  });

  useEffect(() => {
    try {
      const storedUser = lookInSession("user");
      if (storedUser) {
        setUserAuth(
          typeof storedUser === "string" ? JSON.parse(storedUser) : storedUser
        );
      }
    } catch (error) {
      console.error("Failed to load user from session:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userAuth, setUserAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
