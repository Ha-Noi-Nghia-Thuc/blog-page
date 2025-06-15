import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import Header from "./components/layout/header";
import AuthPage from "./pages/auth.page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Header />}>
          <Route path="/sign-in" element={<AuthPage formType="sign-in" />} />
          <Route path="/sign-up" element={<AuthPage formType="sign-up" />} />
        </Route>
      </Routes>
      <Toaster
        position="bottom-right"
        closeButton
        duration={3000}
        toastOptions={{
          style: {
            fontFamily: "var(--font-body)",
          },
          success: {
            style: {
              background: "#f0f0f0",
              color: "#333",
            },
          },
          error: {
            style: {
              background: "#333",
              color: "#f0f0f0",
            },
          },
          info: {
            style: {
              background: "#e0e0e0",
              color: "#444",
            },
          },
          warning: {
            style: {
              background: "#d0d0d0",
              color: "#555",
            },
          },
        }}
      />
    </>
  );
}

export default App;
