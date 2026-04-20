
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Applications from "./pages/Applications";
import Settings from "./pages/Settings";
import ForgotPassword from "./pages/ForgotPassword";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import PrivateRoute from "./components/PrivateRoute";
import ResetPassword from "./pages/ResetPassword";
import ApplicationDetails from "./pages/ApplicationDetails";
import ArchivedApplications from "./pages/ArchivedApplications";
import Analytics from "./pages/Analytics";

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
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/applications/archived" element={<ArchivedApplications />} />
      <Route path="/applications/:id" element={<ApplicationDetails />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
}
