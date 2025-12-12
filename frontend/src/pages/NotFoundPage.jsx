// src/pages/NotFoundPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
          <div className="text-6xl mb-4">🔍</div>
        </div>
        
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-xl text-gray-600 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium shadow-lg hover:shadow-xl"
          >
            <Home size={20} />
            <span>Go to Homepage</span>
          </Link>
          
          <Link
            to="/spaces"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-primary hover:text-primary transition font-medium"
          >
            <Search size={20} />
            <span>Browse Spaces</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;