import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import JoditEditor from 'jodit-react';
import {
  ChevronRight,
  Clock,
  FileText,
  Folder,
  FolderOpen,
  Home,
  Menu,
  Plus,
  Search,
  Settings,
  Star,
  X,
} from 'lucide-react';
import 'jodit/es2021/jodit.min.css';
import { pagesAPI, spacesAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const emojiBySpace = {
  engineering: '⚙️',
  product: '📦',
  marketing: '📣',
  design: '🎨',
  finance: '💰',
  ops: '🛠️',
};

const getSpaceSymbol = (name = '') => {
  const key = name.trim().toLowerCase();
  return emojiBySpace[key] || '📁';
};

const buildPageStructure = (pages = []) => {
  const sanitized = pages.map((page) => ({
    ...page,
    _id: String(page._id),
    parent: page.parent ? String(page.parent) : null,
  }));

  const lookup = {};
  const nodes = sanitized.map((page) => {
    const node = { ...page, children: [], depth: 0 };
    lookup[node._id] = node;
    return node;
  });

  const roots = [];
  nodes.forEach((node) => {
    if (node.parent && lookup[node.parent]) {
      lookup[node.parent].children.push(node);
    } else {
      roots.push(node);
    }
  });

  const assignDepth = (branch, depth = 0) => {
    branch
      .sort((a, b) => a.title.localeCompare(b.title))
      .forEach((child) => {
        child.depth = depth;
        if (child.children.length > 0) {
          assignDepth(child.children, depth + 1);
        }
      });
  };

  assignDepth(roots);

  return { tree: roots, lookup, flat: sanitized };
};

const filterNodes = (nodes = [], term = '') => {
  if (!term) return nodes;
  const needle = term.toLowerCase();

  const walk = (branch) =>
    branch
      .map((node) => {
        const childMatches = walk(node.children);
        if (node.title.toLowerCase().includes(needle) || childMatches.length) {
          return { ...node, children: childMatches };
        }
        return null;
      })
      .filter(Boolean);

  return walk(nodes);
};

const formatTimestamp = (value) => {
  if (!value) return 'Never edited';
  try {
    return new Date(value).toLocaleString();
  } catch {
    return value;
  }
};

const AUTOSAVE_TEXT = {
  idle: 'All changes saved',
  typing: 'Unsaved changes',
  saving: 'Saving…',
  saved: 'Saved just now',
  error: 'Autosave failed',
};

export default function SpaceView() {
  const { spaceId } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const canEdit = isAdmin || user?.role === 'editor';

  const [spaces, setSpaces] = useState([]);
  const [spaceLoading, setSpaceLoading] = useState(true);
  const [pagesBySpace, setPagesBySpace] = useState({});
  const [expandedSpaces, setExpandedSpaces] = useState(() => new Set());
  const [activeSpaceId, setActiveSpaceId] = useState(spaceId || null);
  const [activePageId, setActivePageId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.innerWidth < 768 : false));
  const [pageLoading, setPageLoading] = useState(false);
  const [loadingTreeFor, setLoadingTreeFor] = useState(null);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [editorTitle, setEditorTitle] = useState('');
  const [editorContent, setEditorContent] = useState('');
  const [lastEdited, setLastEdited] = useState('');
  const [autosaveState, setAutosaveState] = useState('idle');

  const editorRef = useRef(null);
  const autosaveTimer = useRef(null);
  const hydrationRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const initials = useMemo(() => {
    if (!user?.name) return 'PH';
    return user.name
      .split(' ')
      .map((chunk) => chunk[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  }, [user?.name]);

  const fetchSpaces = useCallback(async () => {
    setSpaceLoading(true);
    try {
      const res = await spacesAPI.getAll();
      setSpaces(res.data);
      setActiveSpaceId((prev) => {
        if (prev) return prev;
        return res.data[0]?._id || null;
      });
      setExpandedSpaces((prev) => {
        if (prev.size > 0 || !res.data[0]?._id) return prev;
        const next = new Set(prev);
        next.add(res.data[0]._id);
        return next;
      });
    } catch {
      setError('Unable to load spaces right now');
    } finally {
      setSpaceLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSpaces();
  }, [fetchSpaces]);

  useEffect(() => {
    if (!spaceId) return;
    setActiveSpaceId(spaceId);
    setExpandedSpaces((prev) => {
      const next = new Set(prev);
      next.add(spaceId);
      return next;
    });
  }, [spaceId]);

  const fetchPagesForSpace = useCallback(
    async (targetSpaceId) => {
      if (!targetSpaceId) return;
      setLoadingTreeFor(targetSpaceId);
      try {
        const res = await pagesAPI.getBySpace(targetSpaceId);
        setPagesBySpace((prev) => ({
          ...prev,
          [targetSpaceId]: buildPageStructure(res.data || []),
        }));
      } catch {
        setError('Unable to load pages for this space');
      } finally {
        setLoadingTreeFor((current) => (current === targetSpaceId ? null : current));
      }
    },
    []
  );

  useEffect(() => {
    if (activeSpaceId && !pagesBySpace[activeSpaceId]) {
      fetchPagesForSpace(activeSpaceId);
    }
  }, [activeSpaceId, fetchPagesForSpace, pagesBySpace]);

  const handleSpaceToggle = (id) => {
    setExpandedSpaces((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        if (!pagesBySpace[id]) {
          fetchPagesForSpace(id);
        }
      }
      return next;
    });
    setActiveSpaceId(id);
  };

  const handlePageSelect = async (space, pageId) => {
    setError('');
    setStatusMessage('');
    if (isMobile) {
      setMobileSidebarOpen(false);
    }
    setPageLoading(true);
    hydrationRef.current = false;
    setActiveSpaceId(space);
    setActivePageId(pageId);
    try {
      const res = await pagesAPI.getById(pageId);
      const page = res.data;
      setEditorTitle(page.title || 'Untitled page');
      setEditorContent(page.content || '');
      setLastEdited(page.updatedAt || page.createdAt || '');
      setAutosaveState('idle');
      setStatusMessage('');
      setTimeout(() => {
        hydrationRef.current = true;
      }, 0);
    } catch {
      setError('We could not open that page');
    } finally {
      setPageLoading(false);
    }
  };

  const handleCreatePage = async () => {
    if (!canEdit || !activeSpaceId) return;
    const title = window.prompt('Name your new page');
    if (!title || !title.trim()) return;
    try {
      setStatusMessage('Creating page…');
      const res = await pagesAPI.create({
        title: title.trim(),
        content: '<p>Start typing…</p>',
        space: activeSpaceId,
        parent: null,
      });
      await fetchPagesForSpace(activeSpaceId);
      handlePageSelect(activeSpaceId, res.data._id);
      setStatusMessage('Page created');
    } catch (err) {
      setStatusMessage('Unable to create page');
      setError(err.response?.data?.message || 'Unable to create page right now');
    }
  };

  const handleCreateSpace = async () => {
    if (!isAdmin) {
      navigate('/spaces');
      return;
    }
    const title = window.prompt('Space name');
    if (!title || !title.trim()) return;
    try {
      const res = await spacesAPI.create({ title: title.trim(), description: '' });
      await fetchSpaces();
      setActiveSpaceId(res.data._id);
      setExpandedSpaces((prev) => {
        const next = new Set(prev);
        next.add(res.data._id);
        return next;
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to create a space');
    }
  };

  useEffect(() => () => {
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }
  }, []);

  useEffect(() => {
    if (!canEdit) return;
    if (!activePageId || !hydrationRef.current) return;

    setAutosaveState((prev) => (prev === 'saving' ? prev : 'typing'));
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }

    autosaveTimer.current = setTimeout(async () => {
      setAutosaveState('saving');
      try {
        await pagesAPI.update(activePageId, { title: editorTitle, content: editorContent });
        const timestamp = new Date().toISOString();
        setLastEdited(timestamp);
        setAutosaveState('saved');
        setStatusMessage('');
        setPagesBySpace((prev) => {
          if (!activeSpaceId || !prev[activeSpaceId]) return prev;
          const updatedFlat = prev[activeSpaceId].flat.map((entry) =>
            entry._id === activePageId ? { ...entry, title: editorTitle, updatedAt: timestamp } : entry
          );
          return {
            ...prev,
            [activeSpaceId]: buildPageStructure(updatedFlat),
          };
        });
      } catch (err) {
        setAutosaveState('error');
        setStatusMessage(err.response?.data?.message || 'Autosave failed');
      }
    }, 1000);

    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, [editorTitle, editorContent, activePageId, activeSpaceId, canEdit]);

  const breadcrumb = useMemo(() => {
    if (!activeSpaceId) return [];
    const selectedSpace = spaces.find((item) => item._id === activeSpaceId);
    if (!selectedSpace) return [];
    const items = [
      {
        id: selectedSpace._id,
        label: selectedSpace.title,
        type: 'space',
        icon: getSpaceSymbol(selectedSpace.title),
      },
    ];
    if (activePageId && pagesBySpace[activeSpaceId]?.lookup) {
      const lookup = pagesBySpace[activeSpaceId].lookup;
      let current = lookup[activePageId];
      const stack = [];
      while (current) {
        stack.unshift({ id: current._id, label: current.title, type: 'page' });
        current = current.parent ? lookup[current.parent] : null;
      }
      return [...items, ...stack];
    }
    return items;
  }, [activePageId, activeSpaceId, pagesBySpace, spaces]);

  const editorConfig = useMemo(
    () => ({
      readonly: !canEdit,
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
    [canEdit]
  );

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setSidebarCollapsed((prev) => !prev);
    }
  };

  const renderPageBranch = (nodeList, space) =>
    nodeList.map((node) => (
      <div key={node._id}>
        <button
          type="button"
          onClick={() => handlePageSelect(space, node._id)}
          className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${
            activePageId === node._id ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-slate-700 hover:bg-[#F3F4F6]'
          }`}
          style={{ paddingLeft: `${node.depth * 24 + 24}px` }}
        >
          <FileText className="h-4 w-4" />
          <span className="flex-1 truncate font-medium">{node.title}</span>
        </button>
        {node.children.length > 0 && renderPageBranch(node.children, space)}
      </div>
    ));

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#F9FAFB]" data-testid="workspace-sidebar">
      <div className="sticky top-0 border-b border-[#E5E7EB] bg-[#F9FAFB] p-4">
        <div className="flex items-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-sm text-slate-600">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search pages..."
            className="flex-1 border-none bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {spaceLoading ? (
          <p className="text-sm text-slate-500">Loading spaces…</p>
        ) : spaces.length === 0 ? (
          <p className="text-sm text-slate-500">No spaces yet.</p>
        ) : (
          spaces.map((space) => {
            const expanded = expandedSpaces.has(space._id);
            const structure = pagesBySpace[space._id];
            const nodes = searchTerm
              ? filterNodes(structure?.tree || [], searchTerm)
              : structure?.tree || [];
            const pageCount = structure?.flat?.length || 0;
            return (
              <div key={space._id} className="mb-2">
                <button
                  type="button"
                  onClick={() => handleSpaceToggle(space._id)}
                  className={`flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-semibold transition ${
                    expanded ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-700 hover:bg-[#F3F4F6]'
                  } ${activeSpaceId === space._id ? 'ring-1 ring-inset ring-[#D1D5DB]' : ''}`}
                >
                  <ChevronRight
                    className={`h-4 w-4 text-slate-400 transition ${expanded ? 'rotate-90' : ''}`}
                  />
                  {expanded ? (
                    <FolderOpen className="h-4 w-4 text-[#9CA3AF]" />
                  ) : (
                    <Folder className="h-4 w-4 text-[#9CA3AF]" />
                  )}
                  <span className="text-base">{getSpaceSymbol(space.title)}</span>
                  <span className="flex-1 truncate">{space.title}</span>
                  <span className="text-xs font-medium text-slate-400">{pageCount}</span>
                </button>
                <div
                  className={`mt-1 overflow-hidden transition-all ${expanded ? 'max-h-[1200px]' : 'max-h-0'}`}
                >
                  {loadingTreeFor === space._id ? (
                    <p className="px-4 py-2 text-xs text-slate-500">Loading pages…</p>
                  ) : nodes.length === 0 ? (
                    <p className="px-4 py-2 text-xs text-slate-400">No pages yet</p>
                  ) : (
                    renderPageBranch(nodes, space._id)
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      <div className="sticky bottom-0 border-t border-[#E5E7EB] bg-[#F9FAFB] p-4">
        <button
          type="button"
          onClick={handleCreatePage}
          disabled={!canEdit || !activeSpaceId}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#2563EB] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus className="h-4 w-4" />
          Create Page
        </button>
        <button
          type="button"
          onClick={handleCreateSpace}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-[#F3F4F6]"
        >
          <Folder className="h-4 w-4 text-slate-500" />
          Create Space
        </button>
      </div>
    </div>
  );

  const mainContent = (
    <div className="flex-1 bg-white" style={{ minHeight: 'calc(100vh - 56px)' }}>
      <div className="border-b border-[#E5E7EB] bg-white px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-[#6B7280]">
          <Home className="h-4 w-4 text-[#9CA3AF]" />
          {breadcrumb.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4 text-[#D1D5DB]" />
              {index === 0 ? (
                <span className="inline-flex items-center gap-1 font-semibold text-[#111827]">
                  <span>{item.icon}</span>
                  {item.label}
                </span>
              ) : (
                <span className={index === breadcrumb.length - 1 ? 'font-semibold text-[#111827]' : ''}>
                  {item.label}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-b border-[#E5E7EB] bg-white px-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <input
              className="w-full border-none bg-transparent text-3xl font-semibold text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none"
              value={editorTitle}
              onChange={(event) => setEditorTitle(event.target.value)}
              placeholder="Untitled page"
              readOnly={!canEdit || !activePageId}
            />
            <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-[#6B7280]">
              <span className="inline-flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {lastEdited ? `Last edited ${formatTimestamp(lastEdited)}` : 'No edits yet'}
              </span>
              <span className={`text-xs font-semibold ${autosaveState === 'error' ? 'text-red-500' : 'text-[#2563EB]'}`}>
                {AUTOSAVE_TEXT[autosaveState]}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-full border border-[#E5E7EB] p-2 text-[#6B7280] transition hover:text-[#111827]">
              <Star className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-[#E5E7EB] p-2 text-[#6B7280] transition hover:text-[#111827]">
              <Settings className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {error && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {statusMessage && (
          <div className="mb-4 rounded-md border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-sm text-[#1D4ED8]">
            {statusMessage}
          </div>
        )}

        {!activePageId ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed border-[#D1D5DB] bg-[#F9FAFB] text-center">
            <FileText className="mb-4 h-10 w-10 text-[#9CA3AF]" />
            <p className="text-lg font-semibold text-[#111827]">Choose a page to start editing</p>
            <p className="mt-1 text-sm text-[#6B7280]">Select a document from the sidebar to load it in the editor.</p>
          </div>
        ) : pageLoading ? (
          <div className="rounded-lg border border-dashed border-[#D1D5DB] bg-[#F9FAFB] p-6 text-sm text-[#6B7280]">
            Loading page content…
          </div>
        ) : (
          <div className="min-h-[520px] rounded-lg border border-[#E5E7EB] bg-white p-4 shadow-sm">
            <JoditEditor
              ref={editorRef}
              value={editorContent}
              config={editorConfig}
              onBlur={(newContent) => canEdit && setEditorContent(newContent)}
              onChange={(newContent) => canEdit && setEditorContent(newContent)}
            />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-[#F3F4F6] text-[#111827]"
      style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}
    >
      <header className="fixed inset-x-0 top-0 z-30 h-14 border-b border-[#E5E7EB] bg-white px-4 shadow-[0_2px_12px_rgba(15,23,42,0.08)]">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="rounded-full border border-[#E5E7EB] p-2 text-[#111827] transition hover:bg-[#F3F4F6]"
            >
              <Menu className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2 text-lg font-semibold text-[#111827]">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2563EB]/10 text-[#2563EB]">PH</span>
              Project Hub
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="rounded-full border border-[#E5E7EB] p-2 text-[#6B7280] transition hover:text-[#111827]">
              <Star className="h-4 w-4" />
            </button>
            <button className="rounded-full border border-[#E5E7EB] p-2 text-[#6B7280] transition hover:text-[#111827]">
              <Settings className="h-4 w-4" />
            </button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2563EB]/10 text-sm font-semibold text-[#2563EB]">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <div className="pt-14">
        <div className="mx-auto flex max-w-7xl">
          <div className="hidden md:block" style={{ width: sidebarCollapsed ? 0 : 280 }}>
            <div
              className={`h-[calc(100vh-56px)] overflow-hidden border-r border-[#E5E7EB] transition-all duration-300 ${
                sidebarCollapsed ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {!sidebarCollapsed && sidebarContent}
            </div>
          </div>

          {mainContent}
        </div>
      </div>

      <div
        className={`fixed inset-0 z-40 bg-black/40 transition md:hidden ${
          mobileSidebarOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div
          className={`ml-auto flex h-full w-72 flex-col border-l border-[#E5E7EB] bg-white shadow-xl transition ${
            mobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#E5E7EB] p-4">
            <p className="text-sm font-semibold">Navigation</p>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="rounded-full border border-[#E5E7EB] p-1 text-[#6B7280]"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{sidebarContent}</div>
        </div>
      </div>
    </div>
  );
}
