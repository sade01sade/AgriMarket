import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Admin pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import ModerationQueue from "./pages/admin/ModerationQueue";
import ManageCommodities from "./pages/admin/ManageCommodities";
import ManageMarkets from "./pages/admin/ManageMarkets";
import ManageUsers from "./pages/admin/ManageUsers";

// Reporter pages
import ReporterDashboard from "./pages/reporter/ReporterDashboard";
import SubmitPrice from "./pages/reporter/SubmitPrice";
import MyReports from "./pages/reporter/MyReports";

// Farmer pages
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import SearchPrices from "./pages/farmer/SearchPrices";
import PriceTrends from "./pages/farmer/PriceTrends";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/unauthorized" element={
            <div className="flex items-center justify-center h-screen text-gray-500">
              Access Denied
            </div>
          } />

          {/* Admin */}
          <Route path="/admin" element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Layout><AdminDashboard /></Layout>
            </RoleRoute>
          } />
          <Route path="/admin/moderation" element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Layout><ModerationQueue /></Layout>
            </RoleRoute>
          } />
          <Route path="/admin/commodities" element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Layout><ManageCommodities /></Layout>
            </RoleRoute>
          } />
          <Route path="/admin/markets" element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Layout><ManageMarkets /></Layout>
            </RoleRoute>
          } />
          <Route path="/admin/users" element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Layout><ManageUsers /></Layout>
            </RoleRoute>
          } />

          {/* Reporter */}
          <Route path="/reporter" element={
            <RoleRoute allowedRoles={["REPORTER"]}>
              <Layout><ReporterDashboard /></Layout>
            </RoleRoute>
          } />
          <Route path="/reporter/submit" element={
            <RoleRoute allowedRoles={["REPORTER"]}>
              <Layout><SubmitPrice /></Layout>
            </RoleRoute>
          } />
          <Route path="/reporter/reports" element={
            <RoleRoute allowedRoles={["REPORTER"]}>
              <Layout><MyReports /></Layout>
            </RoleRoute>
          } />

          {/* Farmer */}
          <Route path="/farmer" element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <Layout><FarmerDashboard /></Layout>
            </RoleRoute>
          } />
          <Route path="/farmer/search" element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <Layout><SearchPrices /></Layout>
            </RoleRoute>
          } />
          <Route path="/farmer/trends" element={
            <RoleRoute allowedRoles={["FARMER"]}>
              <Layout><PriceTrends /></Layout>
            </RoleRoute>
          } />

          {/* Default */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}