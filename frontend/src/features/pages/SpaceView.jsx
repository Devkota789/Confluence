import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { BookMarked, ListChecks, Plus, Search, Sparkles } from 'lucide-react';
import PageTree from '../../components/PageTree';
import WorkspaceShell from '../../components/WorkspaceShell';
import { pagesAPI, spacesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function SpaceView() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const canEdit = isAdmin || user?.role === 'editor';

  const [space, setSpace] = useState(null);
  const [pages, setPages] = useState([]);
  const [query, setQuery] = useState('');
  const [newPageTitle, setNewPageTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [treeLoading, setTreeLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSpaceMeta = async () => {
      try {
        const res = await spacesAPI.getAll();
        const match = res.data.find((item) => item._id === spaceId);
        setSpace(match || null);
      } catch {
        setSpace(null);
      }
    };

    fetchSpaceMeta();
  }, [spaceId]);

  const loadPages = useCallback(async () => {
    if (!spaceId) return;
    setTreeLoading(true);
    try {
      const res = await pagesAPI.getBySpace(spaceId, { query });
      setPages(res.data);
      setError('');
    } catch {
      setError('Unable to fetch pages for this space');
    } finally {
      setTreeLoading(false);
    }
  }, [spaceId, query]);

  useEffect(() => {
    const handle = setTimeout(() => {
      loadPages();
    }, 250);
    return () => clearTimeout(handle);
  }, [loadPages]);

  const createPage = async (event) => {
    event.preventDefault();
    if (!newPageTitle.trim()) return;
    try {
      setCreating(true);
      const res = await pagesAPI.create({ title: newPageTitle.trim(), content: '<p></p>', space: spaceId, parent: null });
      setNewPageTitle('');
      setPages((prev) => [res.data, ...prev]);
      setError('');
      navigate(`/pages/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create page');
    } finally {
      setCreating(false);
    }
  };

  const handleMove = async (sourceId, targetId) => {
    try {
      await pagesAPI.move(sourceId, targetId);
      loadPages();
    } catch {
      setError('Unable to reorganize pages right now');
    }
  };

  const sidebar = (
    <div className="flex h-full flex-col gap-6 text-sm text-slate-600">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Filter</p>
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="w-full border-none bg-transparent text-sm text-slate-700 focus:outline-none"
            placeholder="Search within this space"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">AI suggestion</p>
        <p className="mt-2 text-slate-600">
          Group project briefs under "Delivery" and archive closed initiatives under "Reference" to keep things tidy.
        </p>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <PageTree pages={pages} onMove={canEdit ? handleMove : undefined} onSelect={(pageId) => navigate(`/pages/${pageId}`)} />
      </div>
      <Link to="/spaces" className="text-sm font-semibold text-blue-600 transition hover:text-blue-500">
        ← Back to spaces
      </Link>
    </div>
  );

  const rightSidebar = (
    <div className="space-y-4 text-sm text-slate-600">
      <div className="rounded-2xl border border-slate-100 bg-white p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Health</p>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Pages</span>
            <span className="text-base font-semibold text-slate-900">{pages.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Recently updated</span>
            <span className="text-base font-semibold text-slate-900">{pages.slice(0, 5).length}</span>
          </div>
        </div>
      </div>
      <div className="rounded-2xl bg-linear-to-br from-blue-600 to-indigo-600 p-5 text-white">
        <Sparkles className="h-6 w-6" />
        <h3 className="mt-4 text-lg font-semibold">Make it modular</h3>
        <p className="mt-2 text-sm text-slate-100">
          Break complex docs into smaller subpages and drag them under the right section to keep navigation predictable.
        </p>
      </div>
    </div>
  );

  return (
    <WorkspaceShell
      title={space?.title || 'Space explorer'}
      description={space?.description || 'Navigate nested pages the same way you would drill into folders.'}
      sidebar={sidebar}
      rightSidebar={rightSidebar}
      actions={
        canEdit && (
          <button
            form="create-page"
            type="submit"
            disabled={creating}
            className="flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />
            {creating ? 'Creating...' : 'New page'}
          </button>
        )
      }
    >
      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}

      {canEdit && (
        <form
          id="create-page"
          onSubmit={createPage}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-semibold text-slate-900">Create a page</p>
          <div className="mt-4 grid gap-4 md:grid-cols-[2fr,1fr]">
            <input
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-slate-800 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
              placeholder="Project retro, Roadmap, Meeting notes..."
              value={newPageTitle}
              onChange={(event) => setNewPageTitle(event.target.value)}
            />
            <button
              type="submit"
              disabled={creating}
              className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-60"
            >
              {creating ? 'Creating...' : 'Draft page'}
            </button>
          </div>
        </form>
      )}

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <BookMarked className="h-5 w-5 text-blue-500" />
            <p className="text-sm font-semibold text-slate-900">Structure overview</p>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            Each page inherits permissions and context from its parent, keeping your space structured like a professional knowledge tree.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <ListChecks className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-semibold text-slate-900">Space metrics</p>
          </div>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.4em] text-slate-400">Pages</p>
          <p className="text-4xl font-semibold text-slate-900">{pages.length}</p>
          <p className="text-sm text-slate-500">Documents within this space</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-slate-900">Recently touched pages</p>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Fresh updates</span>
        </div>
        <div className="mt-4 space-y-3">
          {treeLoading && <p className="text-sm text-slate-500">Refreshing structure...</p>}
          {!treeLoading &&
            pages.slice(0, 6).map((page) => (
              <button
                key={page._id}
                onClick={() => navigate(`/pages/${page._id}`)}
                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-2 text-left text-sm text-slate-600 transition hover:border-blue-300"
              >
                <span className="font-medium text-slate-900">{page.title}</span>
                <span className="text-xs text-slate-400">Open →</span>
              </button>
            ))}
          {!treeLoading && pages.length === 0 && <p className="text-sm text-slate-500">No pages yet. Start by creating one.</p>}
        </div>
      </div>
    </WorkspaceShell>
  );
}
