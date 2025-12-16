
// src/pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FileText, Users, Zap, Shield, ArrowRight } from 'lucide-react';

const HomePage = () => {
  const { user, isAdmin } = useAuth();

  const features = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: 'Document Everything',
      description: 'Create and organize documentation with markdown support',
      color: 'bg-blue-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Collaborate Together',
      description: 'Work with your team in shared spaces',
      color: 'bg-green-500'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Fast & Simple',
      description: 'Intuitive interface for quick documentation',
      color: 'bg-yellow-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Role-Based Access',
      description: 'Control who can view and edit content',
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Welcome back, <span className="text-blue-600">{user?.name}</span>! 👋
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Your collaborative documentation platform. Create, organize, and share knowledge with your team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/spaces" 
              className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-lg shadow-lg hover:shadow-xl"
            >
              Browse Spaces
              <ArrowRight className="ml-2" size={20} />
            </Link>
            {isAdmin && (
              <Link 
                to="/admin" 
                className="inline-flex items-center px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-lg shadow-lg hover:shadow-xl"
              >
                <Shield className="mr-2" size={20} />
                Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* User Info Card */}
        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Your Account</h3>
              <p className="text-gray-600 mt-1">{user?.email}</p>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-full">
              <span className="text-blue-600 font-medium capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            What You Can Do
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className={`${feature.color} w-16 h-16 rounded-lg flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-20 bg-linear-to-r from-blue-600 to-sky-500 rounded-2xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-4">Quick Start Guide</h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <span className="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">1</span>
              <p className="text-lg">Browse existing spaces or create a new one (Admin only)</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">2</span>
              <p className="text-lg">Create pages within spaces to document your work</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">3</span>
              <p className="text-lg">Collaborate with team members in shared spaces</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="bg-white text-blue-600 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">4</span>
              <p className="text-lg">Use markdown to format your content beautifully</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;