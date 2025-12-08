import { Navigate, Route, Routes } from "react-router-dom";
import Register from "./features/auth/Register";
import { Login } from "./features/auth/Login";
import Dashboard from "./features/dashboard/Dashboard";
import Home from "./features/home/Home";
import { ProtectedRoute, PublicRoute } from "./routes/RouteGuards";

const App = () => {
  const token = localStorage.getItem("token");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Routes>
        <Route element={<PublicRoute redirectTo="/dashboard" />}>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route element={<ProtectedRoute redirectTo="/login" />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
};

export default App;