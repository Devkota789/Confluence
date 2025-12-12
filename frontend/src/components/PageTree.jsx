import React, { useMemo, useState } from 'react';
import { ChevronRight, FileText, FolderTree, GripVertical } from 'lucide-react';

const PageTree = ({ pages = [], onMove, onSelect }) => {
  const [expanded, setExpanded] = useState(new Set());
  const [draggingId, setDraggingId] = useState(null);

  const normalizedPages = useMemo(() => {
    return pages.map((page) => ({
      ...page,
      _id: String(page._id),
      parent: page.parent ? String(page.parent) : null,
    }));
  }, [pages]);

  const parentLookup = useMemo(() => {
    const map = new Map();
    normalizedPages.forEach((page) => {
      if (page.parent) {
        map.set(page._id, page.parent);
      }
    });
    return map;
  }, [normalizedPages]);

  const tree = useMemo(() => {
    const record = new Map();
    const roots = [];

    normalizedPages.forEach((page) => {
      record.set(page._id, { ...page, children: [] });
    });

    record.forEach((node) => {
      if (node.parent && record.has(node.parent)) {
        record.get(node.parent).children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots.sort((a, b) => a.title.localeCompare(b.title));
  }, [normalizedPages]);

  const toggleNode = (id) => {
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleDragStart = (event, pageId) => {
    event.dataTransfer.setData('text/plain', pageId);
    event.dataTransfer.effectAllowed = 'move';
    setDraggingId(pageId);
  };

  const handleDragEnd = () => setDraggingId(null);

  const preventDefault = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const isDescendant = (sourceId, targetId) => {
    let cursor = parentLookup.get(targetId);
    while (cursor) {
      if (cursor === sourceId) return true;
      cursor = parentLookup.get(cursor);
    }
    return false;
  };

  const handleDrop = (event, targetId) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain');
    setDraggingId(null);
    if (!sourceId || sourceId === targetId) return;
    if (isDescendant(sourceId, targetId)) return;
    if (onMove) onMove(sourceId, targetId);
  };

  const handleRootDrop = (event) => {
    event.preventDefault();
    const sourceId = event.dataTransfer.getData('text/plain');
    setDraggingId(null);
    if (!sourceId) return;
    if (onMove) onMove(sourceId, null);
  };

  const renderNode = (node, level = 0) => {
    const hasChildren = node.children.length > 0;
    const open = expanded.has(node._id) || level === 0;

    return (
      <div key={node._id} className="text-sm text-slate-700">
        <div
          draggable={Boolean(onMove)}
          onDragStart={(event) => handleDragStart(event, node._id)}
          onDragEnd={handleDragEnd}
          onDragOver={preventDefault}
          onDrop={(event) => handleDrop(event, node._id)}
          className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2 transition hover:bg-slate-100 ${
            draggingId === node._id ? 'opacity-60' : ''
          }`}
          onClick={() => (onSelect ? onSelect(node._id) : null)}
        >
          <GripVertical className="h-4 w-4 text-slate-300" />
          {hasChildren ? (
            <button
              type="button"
              className={`flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-slate-500 transition hover:border-slate-400 hover:text-slate-700 ${
                open ? 'bg-slate-100' : 'bg-white'
              }`}
              onClick={(event) => {
                event.stopPropagation();
                toggleNode(node._id);
              }}
            >
              <ChevronRight className={`h-3 w-3 transition ${open ? 'rotate-90' : ''}`} />
            </button>
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
            </span>
          )}
          <span className="flex-1 truncate font-medium text-slate-800">{node.title}</span>
        </div>
        {hasChildren && open && (
          <div className="ml-6 border-l border-dashed border-slate-200 pl-4">
            {node.children
              .sort((a, b) => a.title.localeCompare(b.title))
              .map((child) => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {onMove && draggingId && (
        <div
          className="rounded-2xl border border-dashed border-blue-300 bg-blue-50/60 p-3 text-center text-xs font-semibold text-blue-600"
          onDragOver={preventDefault}
          onDrop={handleRootDrop}
        >
          Drop here to move page to the top level
        </div>
      )}

      {tree.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
          No pages yet. Create your first document to populate the tree.
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
            <FolderTree className="h-4 w-4 text-slate-500" />
            Hierarchy
          </div>
          {tree.map((node) => renderNode(node))}
        </div>
      )}
    </div>
  );
};

export default PageTree;
