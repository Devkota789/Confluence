import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import 'jodit/es2021/jodit.min.css';
import WorkspaceShell from '../../components/WorkspaceShell';
import { pagesAPI } from '../../services/api';

export default function PageEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPage = useCallback(async () => {
    setLoading(true);
    try {
      const res = await pagesAPI.getById(pageId);
      setTitle(res.data.title);
      setContent(res.data.content || '');
      setError('');
    } catch {
      setError('Unable to load page for editing');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  const savePage = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    try {
      setIsSaving(true);
      await pagesAPI.update(pageId, { title, content });
      setError('');
      navigate(`/pages/${pageId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setIsSaving(false);
    }
  };

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      placeholder: 'Start typing...',
      height: '100%',
      toolbarAdaptive: false,
      buttons: [
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'ul',
        'ol',
        '|',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        '|',
        'image',
        'table',
        'link',
        '|',
        'align',
        'undo',
        'redo',
        '|',
        'hr',
        'copyformat',
        'fullsize',
      ],
      uploader: {
        insertImageAsBase64URI: true,
      },
    }),
    []
  );

  const handleEditorBlur = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  const handleEditorChange = useCallback((newContent) => {
    setContent(newContent);
  }, []);

  const sidebar = useMemo(
    () => (
      <div className="space-y-5 text-sm text-slate-600">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Editing tips</p>
          <p className="mt-2 text-slate-500">
            Keep sections short and link to specs or dashboards for supporting data.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Status</p>
          <p className="mt-2 font-semibold text-slate-900">{isSaving ? 'Saving changes…' : 'Drafting'}</p>
          <p className="text-xs text-slate-500">Changes persist when you click Save.</p>
        </div>
      </div>
    ),
    [isSaving]
  );

  return (
    <WorkspaceShell
      title="Page editor"
      description="Craft structured documentation with rich media, embeds, and callouts."
      sidebar={sidebar}
      actions={
        <>
          <button
            onClick={() => navigate(-1)}
            className="rounded-2xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-300"
          >
            Cancel
          </button>
          <button
            onClick={savePage}
            disabled={isSaving || !title.trim()}
            className="rounded-2xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:opacity-60"
          >
            {isSaving ? 'Saving…' : 'Save page'}
          </button>
        </>
      }
    >
      {error && (
        <div className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertTriangle className="h-4 w-4" />
          {error}
          <button
            className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-red-600"
            onClick={fetchPage}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Retry
          </button>
        </div>
      )}

      {loading ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          Loading editor…
        </div>
      ) : (
        <div className="space-y-6">
          <input
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-2xl font-semibold text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:outline-none"
            placeholder="Page title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <div className="min-h-[520px] rounded-2xl border border-slate-200 bg-white p-2">
            <JoditEditor
              ref={editorRef}
              value={content}
              config={editorConfig}
              onBlur={handleEditorBlur}
              onChange={handleEditorChange}
            />
          </div>
        </div>
      )}
    </WorkspaceShell>
  );
}
