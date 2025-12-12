import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, Plus, Search, Sparkles, Users } from 'lucide-react';
import WorkspaceShell from '../../components/WorkspaceShell';
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
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create space');
    } finally {
      setCreating(false);
    }
  };

  const filteredSpaces = useMemo(() => {
    if (!query.trim()) return spaces;
    return spaces.filter((space) => space.title.toLowerCase().includes(query.toLowerCase()));
  }, [query, spaces]);

  const sidebar = (
    <div className="space-y-6 text-sm">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Search</p>
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-full border-none bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
            placeholder="Filter spaces"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Overview</p>
        <p className="mt-3 text-3xl font-semibold text-slate-900">{spaces.length}</p>
        <p className="text-xs text-slate-500">Spaces in this workspace</p>
      </div>

      <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Tip</p>
        <p className="mt-2 text-slate-600">
          Organize work like folders—spaces collect strategy docs, runbooks, and project briefs in one place.
        </p>
      </div>
    </div>
  );

  const rightSidebar = (
    <div className="space-y-4 text-sm text-slate-600">
      <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 p-5 text-white">
        <Sparkles className="h-6 w-6" />
        <h3 className="mt-4 text-lg font-semibold">Best practices</h3>
        <p className="mt-2 text-sm text-slate-100">
          Keep each space focused on a single program. Use nested pages for roadmaps, retros, and SOPs.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Activity</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Teams involved</span>
            <span className="flex items-center gap-1 text-sm font-semibold text-slate-800">
              <Users className="h-4 w-4" />
              {spaces.reduce((acc, space) => acc + (space.members?.length || 0), 0)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Templates suggested</span>
            <span className="text-sm font-semibold text-slate-800">Quarterly plan · Postmortem</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <WorkspaceShell
      title="Spaces & folders"
      description="Curate focused hubs for every team, program, or initiative."
      sidebar={sidebar}
      rightSidebar={rightSidebar}
      actions={
        isAdmin && (
          <button
            form="create-space"
            type="submit"
            disabled={creating}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {creating ? 'Creating...' : 'New space'}
          </button>
        )
      }
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      {isAdmin && (
        <form
          id="create-space"
          onSubmit={createSpace}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-slate-900">Create a new space</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
              placeholder="Space title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
              placeholder="Description (optional)"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>
        </form>
      )}

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

        {!loading &&
          filteredSpaces.map((space) => (
            <Link
              key={space._id}
              to={`/spaces/${space._id}`}
              className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50/80 p-5 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                    <FolderOpen className="h-6 w-6" />
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">{space.title}</p>
                    <p className="text-sm text-slate-500">{space.description || 'No description provided'}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Open →</span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
                  <Users className="h-3.5 w-3.5" />
                  {(space.members || []).length} members
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1">
                  {new Date(space.createdAt).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
      </div>
    </WorkspaceShell>
  );
}
