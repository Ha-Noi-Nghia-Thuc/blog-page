import { Route, Routes } from "react-router-dom";
import Header from "./components/layout/header";
import AuthPage from "./pages/auth.page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Header />}>
        <Route path="/sign-in" element={<AuthPage formType="sign-in" />} />
        <Route path="/sign-up" element={<AuthPage formType="sign-up" />} />
      </Route>
    </Routes>
  );
}

export default App;
