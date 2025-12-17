// src/components/Layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { LogOut, User, Home, FileText, Shield, Moon, Sun } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin, isSuperAdmin } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-900 shadow z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-blue-700 dark:text-blue-300">
              <span>📚</span>
              <span>Confluence</span>
            </Link>

            <div className="hidden md:flex items-center gap-2">
              <Link to="/" className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Home</Link>
              <Link to="/spaces" className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Spaces</Link>
              {isSuperAdmin && (
                <Link to="/admin" className="px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Admin</Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={toggleTheme} className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 text-sm">
                  <User size={16} />
                  <div className="flex flex-col">
                    <span className="font-medium">{user.name}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</span>
                  </div>
                </div>
                <button onClick={handleLogout} className="px-3 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 rounded">Logout</button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-3 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800">Login</Link>
                <Link to="/register" className="px-3 py-1 bg-blue-600 text-white rounded">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;