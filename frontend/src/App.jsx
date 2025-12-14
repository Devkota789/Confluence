import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import HomePage from './pages/HomePage';
import SpacesPage from './pages/SpacesPage';
import SpaceDetailPage from './pages/SpaceDetailPage';
import PageViewPage from './pages/PageViewPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import PageEditor from './features/pages/PageEditor';


const LoadingState = () => (
  <div className="flex h-screen items-center justify-center text-slate-600">
    Loading...
  </div>
);

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <LoadingState />;
  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isSuperAdmin } = useAuth();
  if (loading) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace />;
  return isSuperAdmin ? children : <Navigate to="/" replace />;
};

function AppContent() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        }
      />
      <Route
        path="/spaces"
        element={
          <PrivateRoute>
            <SpacesPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/spaces/:spaceId"
        element={
          <PrivateRoute>
            <SpaceDetailPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pages/:pageId"
        element={
          <PrivateRoute>
            <PageViewPage />
          </PrivateRoute>
        }
      />
      <Route
        path="/pages/:pageId/edit"
        element={
          <PrivateRoute>
            <PageEditor />
          </PrivateRoute>
        }
      />
      {/* <Route
        path="/pages/:pageId/versions"
        element={
          <PrivateRoute>
            <PageVersions />
          </PrivateRoute>
        }
      /> */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminPage />
          </AdminRoute>
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppContent />
    </AuthProvider>
  );
}

export default App;