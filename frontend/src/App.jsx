import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import Home from "./features/home/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import Dashboard from "./features/dashboard/Dashboard";
import SpaceList from "./features/pages/SpaceList";
import SpaceView from "./features/pages/SpaceView";
import PageView from "./features/pages/PageView";
import PageEditor from "./features/pages/PageEditor";
import PageVersions from "./features/pages/PageVersions";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/spaces"
          element={
            <ProtectedRoute>
              <SpaceList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/space/:id"
          element={
            <ProtectedRoute>
              <SpaceView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/page/:id"
          element={
            <ProtectedRoute>
              <PageView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/page/:id/edit"
          element={
            <ProtectedRoute>
              <PageEditor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/page/:id/versions"
          element={
            <ProtectedRoute>
              <PageVersions />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </AuthProvider>
  );
}
