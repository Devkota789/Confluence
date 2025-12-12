import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CalendarDays, Clock3, Edit3, History, Share2, User } from 'lucide-react';
import WorkspaceShell from '../../components/WorkspaceShell';
import { pagesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function PageView() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const canEdit = isAdmin || user?.role === 'editor';

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadPage = useCallback(async () => {
    try {
      const res = await pagesAPI.getById(pageId);
      setPage(res.data);
      setError('');
    } catch {
      setError('Unable to load this page');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this page?')) return;
    try {
      await pagesAPI.delete(pageId);
      navigate(page?.space ? `/spaces/${page.space}` : '/spaces');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete this page');
    }
  };

  const rightSidebar = useMemo(() => {
    if (!page) return null;
    return (
      <div className="space-y-5 text-sm text-slate-600">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Page details</p>
          <div className="mt-4 space-y-3">
            {page.createdBy && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400" />
                <span>{page.createdBy.name}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-slate-400" />
              <span>{new Date(page.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-slate-400" />
              <span>
                Updated {page.updatedAt ? new Date(page.updatedAt).toLocaleString() : 'recently'}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">Versions</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900">{page.versions?.length || 0}</p>
          <p className="text-xs text-slate-500">Snapshots stored automatically whenever edits occur.</p>
          <button
            onClick={() => navigate(`/pages/${pageId}/versions`)}
            className="mt-4 inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300"
          >
            <History className="h-4 w-4" />
            View history
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-xs text-slate-500">
          Keep sections short and link out to deeper specs. Readers scan faster when content is chunked.
        </div>
      </div>
    );
  }, [navigate, page, pageId]);

  const renderedContent = useMemo(() => {
    if (!page || !page.content) return '<p>No content yet.</p>';
    const trimmed = page.content.trim();
    const looksHtml = /^<([a-z]+)([^>]*)>/i.test(trimmed);
    if (looksHtml) return trimmed;
    return `<p>${trimmed.replace(/\n/g, '<br />')}</p>`;
  }, [page]);

  if (loading) {
    return (
      <WorkspaceShell title="Page" description="Loading...">
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Fetching page content...
        </div>
      </WorkspaceShell>
    );
  }

  if (!page) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <History className="mb-4 h-10 w-10 text-red-400" />
        <p className="text-lg font-semibold text-slate-900">Page not available</p>
        <p className="text-sm text-slate-500">{error}</p>
      </div>
    );
  }

  return (
    <WorkspaceShell
      title={page.title}
      description={page.description || 'Living documentation for your team'}
      rightSidebar={rightSidebar}
      actions={
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => navigate(`/pages/${pageId}/versions`)}
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300"
          >
            <History className="h-4 w-4" />
            Versions
          </button>
          {isAdmin && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center gap-2 rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              Delete
            </button>
          )}
          {canEdit && (
            <button
              onClick={() => navigate(`/pages/${pageId}/edit`)}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              <Edit3 className="h-4 w-4" />
              Edit page
            </button>
          )}
        </div>
      }
    >
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-3xl border border-slate-100 bg-linear-to-br from-slate-50 to-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
          {page.createdBy && (
            <span className="inline-flex items-center gap-2">
              <User className="h-4 w-4" />
              {page.createdBy.name}
            </span>
          )}
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4" />
            {new Date(page.createdAt).toLocaleDateString()}
          </span>
          <span className="inline-flex items-center gap-2">
            <Clock3 className="h-4 w-4" />
            Updated {page.updatedAt ? new Date(page.updatedAt).toLocaleString() : 'recently'}
          </span>
          <button className="ml-auto inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-300">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      <article
        className="prose max-w-none text-slate-800"
        dangerouslySetInnerHTML={{ __html: renderedContent }}
      />
    </WorkspaceShell>
  );
}
