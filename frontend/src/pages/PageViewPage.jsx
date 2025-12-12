// src/pages/PageViewPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { pagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Edit, Trash2, Save, X, Calendar, User, History, AlertCircle } from 'lucide-react';

const PageViewPage = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [saving, setSaving] = useState(false);
  
  const { user, isAdmin } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'editor';

  useEffect(() => {
    fetchPage();
  }, [pageId]);

  const fetchPage = async () => {
    try {
      const response = await pagesAPI.getById(pageId);
      setPage(response.data);
      setEditedContent(response.data.content);
    } catch (err) {
      setError('Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    try {
      await pagesAPI.update(pageId, { content: editedContent });
      setIsEditing(false);
      fetchPage();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update page');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;

    try {
      await pagesAPI.delete(pageId);
      navigate(`/spaces/${page.space}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete page');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading page...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <AlertCircle size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">The page you're looking for doesn't exist</p>
        <button
          onClick={() => navigate('/spaces')}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition"
        >
          Back to Spaces
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{page.title}</h1>
              <div className="flex items-center space-x-6 text-sm text-gray-500">
                {page.createdBy && (
                  <div className="flex items-center space-x-2">
                    <User size={16} />
                    <span>Created by {page.createdBy.name}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Updated {new Date(page.updatedAt || page.createdAt).toLocaleDateString()}</span>
                </div>
                {page.versions && page.versions.length > 0 && (
                  <div className="flex items-center space-x-2 text-primary">
                    <History size={16} />
                    <span>{page.versions.length} {page.versions.length === 1 ? 'version' : 'versions'}</span>
                  </div>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <div className="flex space-x-2">
                {canEdit && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition"
                  >
                    <Edit size={18} />
                    <span>Edit</span>
                  </button>
                )}
                {isAdmin && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
                  >
                    <Trash2 size={18} />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                rows="20"
              />
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(page.content);
                    setError('');
                  }}
                  className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
                >
                  <X size={18} />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition disabled:opacity-50"
                >
                  <Save size={18} />
                  <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Content Display */}
        {!isEditing && (
          <div className="bg-white rounded-xl shadow-md p-8">
            <div className="prose prose-lg max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="bg-gray-100 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {page.content}
              </ReactMarkdown>
            </div>
          </div>
        )}

        {/* Version History */}
        {page.versions && page.versions.length > 0 && !isEditing && (
          <div className="bg-white rounded-xl shadow-md p-8 mt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
              <History size={24} />
              <span>Version History</span>
            </h2>
            <div className="space-y-3">
              {page.versions.map((version, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900">Version {page.versions.length - index}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(version.editedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PageViewPage;