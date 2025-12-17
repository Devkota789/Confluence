import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FolderOpen, Plus, Users, X } from 'lucide-react';
import { toast } from 'react-toastify';
import WorkspaceShell from '../../components/WorkspaceShell';
import SpaceCard from '../../components/SpaceCard';
import { spacesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SpaceList() {
  const { isAdmin } = useAuth();
  const [spaces, setSpaces] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const loadSpaces = async () => {
    setLoading(true);
    try {
      const res = await spacesAPI.getAll();
      setSpaces(res.data);
      setError('');
    } catch {
      setError('Unable to load spaces');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSpaces();
  }, []);

  const createSpace = async (event) => {
    event.preventDefault();
    if (!isAdmin) return;
    try {
      setCreating(true);
      const res = await spacesAPI.create({ title, description });
      setSpaces((prev) => [res.data, ...prev]);
      setTitle('');
      setDescription('');
      setError('');
      setShowModal(false);
      toast.success('Space created successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create space');
    } finally {
      setCreating(false);
    }
  };

  const filteredSpaces = useMemo(() => {
    if (!query.trim()) return spaces;
    return spaces.filter((space) => space.title.toLowerCase().includes(query.toLowerCase()));
  }, [query, spaces]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredSpaces.length / pageSize)),
    [filteredSpaces.length]
  );

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredSpaces.length / pageSize));
    setPage((prev) => Math.min(prev, maxPage));
  }, [filteredSpaces.length]);

  const paginatedSpaces = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredSpaces.slice(start, start + pageSize);
  }, [filteredSpaces, page]);

  return (
    <WorkspaceShell
      title="Spaces & folders"
      description="Curate focused hubs for every team, program, or initiative."
      sidebar={null}
      rightSidebar={null}
      searchQuery={query}
      onSearchChange={setQuery}
      searchPlaceholder="Search spaces..."
      actions={
        isAdmin && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            <Plus className="h-4 w-4" />
            New space
          </button>
        )
      }
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {/* Removed the old form */}

      <div className="grid gap-4">
        {loading && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            Fetching your spaces...
          </div>
        )}

        {!loading && filteredSpaces.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
            No spaces match "{query || 'current filter'}".
          </div>
        )}

          {!loading && filteredSpaces.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {paginatedSpaces.map((space) => (
                <Link key={space._id} to={`/spaces/${space._id}`}>
                  <div className="p-0">
                    <SpaceCard space={space} />
                  </div>
                </Link>
              ))}
            </div>
          )}

        {!loading && filteredSpaces.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600">
            <span>
              Showing {paginatedSpaces.length} of {filteredSpaces.length} spaces
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 transition hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <span className="text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1 font-semibold text-slate-700 transition hover:border-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* Modal for creating space */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Create New Space</h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={createSpace}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Space Title *
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter space title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
                    placeholder="Enter description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Space'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}    </WorkspaceShell>
  );
}
