import { Route, Routes } from "react-router-dom";
import Header from "./components/layout/header";
import AuthPage from "./pages/auth.page";
import { Toaster } from "sonner";
import { createContext, useEffect, useState } from "react";
import { lookInSession } from "./lib/session";

export const UserContext = createContext({});

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="/sign-in" element={<AuthPage formType="sign-in" />} />
          <Route path="/sign-up" element={<AuthPage formType="sign-up" />} />
        </Route>
      </Routes>
      <Toaster position="bottom-right" richColors closeButton duration={1000} />
    </>
  );
}

export default App;
