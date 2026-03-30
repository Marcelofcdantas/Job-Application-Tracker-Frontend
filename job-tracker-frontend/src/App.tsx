
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import PrivateRoute from "./components/PrivateRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/applications"
        element={
          <PrivateRoute>
            <Applications />
          </PrivateRoute>
        }
      />
      <Route path="/settings" element={<Settings />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
    </Routes>
  );
}
