import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/applications" element={<Applications />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
    </Routes>
  );
}
