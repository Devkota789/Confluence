// src/pages/SpaceDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Plus, FileText, Calendar, User, Search, AlertCircle } from 'lucide-react';

const SpaceDetailPage = () => {
  const { spaceId } = useParams();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', content: '' });
  const [creating, setCreating] = useState(false);
  
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  useEffect(() => {
    fetchPages();
  }, [spaceId]);

  const fetchPages = async () => {
    try {
      const response = await pagesAPI.getBySpace(spaceId, { query: searchQuery });
      setPages(response.data);
    } catch (err) {
      setError('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError('');

    try {
      await pagesAPI.create({
        ...newPage,
        space: spaceId
      });
      setShowCreateModal(false);
      setNewPage({ title: '', content: '' });
      fetchPages();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create page');
    } finally {
      setCreating(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPages();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading pages...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Space Pages</h1>
              <p className="text-gray-600">Browse and manage documentation</p>
            </div>
            {canEdit && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition shadow-md"
              >
                <Plus size={20} />
                <span>New Page</span>
              </button>
            )}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Pages List */}
        {pages.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-md">
            <FileText size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No pages yet</h3>
            <p className="text-gray-500 mb-6">
              {canEdit ? 'Create your first page to start documenting' : 'This space has no pages yet'}
            </p>
            {canEdit && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
              >
                <Plus size={20} />
                <span>Create First Page</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4">
            {pages.map((page) => (
              <Link
                key={page._id}
                to={`/pages/${page._id}`}
                className="bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition border border-gray-200 hover:border-primary"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{page.title}</h3>
                    <p className="text-gray-600 line-clamp-2 mb-4">
                      {page.content?.substring(0, 150)}...
                    </p>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      {page.createdBy && (
                        <div className="flex items-center space-x-2">
                          <User size={16} />
                          <span>{page.createdBy.name}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Calendar size={16} />
                        <span>{new Date(page.updatedAt || page.createdAt).toLocaleDateString()}</span>
                      </div>
                      {page.versions?.length > 0 && (
                        <span className="text-primary">
                          {page.versions.length} {page.versions.length === 1 ? 'version' : 'versions'}
                        </span>
                      )}
                    </div>
                  </div>
                  <FileText className="text-primary ml-4" size={32} />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Page Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Page</h2>
            
            <form onSubmit={handleCreatePage} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={newPage.title}
                  onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Getting Started Guide"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content (Markdown supported)
                </label>
                <textarea
                  required
                  value={newPage.content}
                  onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono"
                  placeholder="# Welcome&#10;&#10;Start writing your documentation..."
                  rows="12"
                />
                <p className="mt-2 text-sm text-gray-500">
                  You can use Markdown to format your content
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setNewPage({ title: '', content: '' });
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
                  {creating ? 'Creating...' : 'Create Page'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceDetailPage;