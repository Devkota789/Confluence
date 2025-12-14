import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import { AlertTriangle, RefreshCw, Save, X } from 'lucide-react';
import 'jodit/es2021/jodit.min.css';
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
      height: '100vh',
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

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Fixed Header */}
      <header className="fixed top-16 left-0 right-0 z-10 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <div className="text-sm text-gray-500">
            Editing: {title || 'Untitled Page'}
          </div>
        </div>
        <button
          onClick={savePage}
          disabled={isSaving || !title.trim()}
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-500 disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving…' : 'Save'}
        </button>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        {error && (
          <div className="absolute top-20 left-6 right-6 z-20 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
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
          <div className="flex items-center justify-center h-screen">
            <div className="text-sm text-gray-500">Loading editor…</div>
          </div>
        ) : (
          <div className="relative">
            <input
              className="absolute top-0 left-0 right-0 z-10 w-full border-none bg-white px-6 py-4 text-3xl font-bold text-gray-900 placeholder-gray-400 focus:outline-none shadow-md"
              placeholder="Page title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <JoditEditor
              ref={editorRef}
              value={content}
              config={editorConfig}
              onBlur={handleEditorBlur}
              onChange={handleEditorChange}
            />
          </div>
        )}
      </main>
    </div>
  );
}
