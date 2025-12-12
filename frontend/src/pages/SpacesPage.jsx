// src/pages/SpacesPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { spacesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, FolderOpen, Users, Calendar, AlertCircle } from 'lucide-react';

const SpacesPage = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newSpace, setNewSpace] = useState({ title: '', description: '' });
  const [creating, setCreating] = useState(false);
  
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await spacesAPI.getAll();
      setSpaces(response.data);
    } catch (err) {
      setError('Failed to load spaces');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await spacesAPI.create(newSpace);
      setShowCreateModal(false);
      setNewSpace({ title: '', description: '' });
      fetchSpaces();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create space');
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading spaces...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Spaces</h1>
            <p className="text-gray-600 mt-2">Organize your documentation into spaces</p>
          </div>
          {isAdmin && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              <span>Create Space</span>
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Spaces Grid */}
        {spaces.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No spaces yet</h3>
            <p className="text-gray-500 mb-6">
              {isAdmin ? 'Create your first space to get started' : 'No spaces available or you are not a member of any space'}
            </p>
            {isAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                <Plus size={20} />
                <span>Create First Space</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Link
                key={space._id}
                to={`/spaces/${space._id}`}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <FolderOpen className="text-primary" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{space.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{space.description || 'No description'}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Users size={16} />
                    <span>{space.members?.length || 0} members</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-500 text-sm">
                    <Calendar size={16} />
                    <span>{new Date(space.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Space Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Space</h2>
            
            <form onSubmit={handleCreateSpace} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Space Title
                </label>
                <input
                  type="text"
                  required
                  value={newSpace.title}
                  onChange={(e) => setNewSpace({ ...newSpace, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Engineering Team"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newSpace.description}
                  onChange={(e) => setNewSpace({ ...newSpace, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Documentation for the engineering team"
                  rows="4"
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewSpace({ title: '', description: '' });
                    setError('');
                  }}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition font-medium disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpacesPage;