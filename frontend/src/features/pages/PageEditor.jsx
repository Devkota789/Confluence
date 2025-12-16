import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertTriangle, RefreshCw, Save, X, Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, Image, AlignLeft, AlignCenter, AlignRight, Undo, Redo } from 'lucide-react';

// Mock API for demo
const pagesAPI = {
  getById: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      data: {
        title: 'Sample Page Title',
        content: '<p>Start editing your content here...</p>'
      }
    };
  },
  update: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { data };
  }
};

export default function PageEditor() {
  const pageId = '123';
  const editorRef = useRef(null);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [originalData, setOriginalData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const hasUnsavedChanges = useMemo(() => {
    if (!originalData) return false;
    return title !== originalData.title || content !== originalData.content;
  }, [title, content, originalData]);

  const fetchPage = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await pagesAPI.getById(pageId);
      setTitle(res.data.title);
      setContent(res.data.content || '');
      setOriginalData({ title: res.data.title, content: res.data.content || '' });
    } catch (err) {
      setError('Unable to load page. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [pageId]);

  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const savePage = async () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      setSuccessMessage('');
      await pagesAPI.update(pageId, { title, content });
      setOriginalData({ title, content });
      setSuccessMessage('Page saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasUnsavedChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to discard them?')) {
        setTitle(originalData.title);
        setContent(originalData.content);
      }
    }
  };

  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertLink = () => {
    const url = prompt('Enter URL:');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.innerHTML);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex flex-col p-4 md:p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">Edit Page</h1>
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={savePage}
                disabled={isSaving || !title.trim() || !hasUnsavedChanges}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Page
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Success Alert */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2 mb-4">
              <div className="flex-1">
                <p className="text-green-800 text-sm">{successMessage}</p>
              </div>
              <button
                onClick={() => setSuccessMessage('')}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter page title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex-1 flex flex-col">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Content
          </label>
          
          {/* Toolbar */}
          <div className="border border-gray-300 rounded-t-lg bg-gray-50 p-2 flex flex-wrap gap-1 flex-shrink-0">
            <button
              onClick={() => executeCommand('bold')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('italic')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('underline')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Underline"
            >
              <Underline className="w-4 h-4" />
            </button>
            
            <div className="w-px bg-gray-300 mx-1" />
            
            <button
              onClick={() => executeCommand('insertUnorderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('insertOrderedList')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            
            <div className="w-px bg-gray-300 mx-1" />
            
            <button
              onClick={insertLink}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert Link"
            >
              <LinkIcon className="w-4 h-4" />
            </button>
            <button
              onClick={insertImage}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Insert Image"
            >
              <Image className="w-4 h-4" />
            </button>
            
            <div className="w-px bg-gray-300 mx-1" />
            
            <button
              onClick={() => executeCommand('justifyLeft')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('justifyCenter')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('justifyRight')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            
            <div className="w-px bg-gray-300 mx-1" />
            
            <button
              onClick={() => executeCommand('undo')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Undo"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={() => executeCommand('redo')}
              className="p-2 hover:bg-gray-200 rounded transition-colors"
              title="Redo"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Editor Area */}
          <div
            ref={editorRef}
            contentEditable
            dangerouslySetInnerHTML={{ __html: content }}
            onInput={handleContentChange}
            onBlur={handleContentChange}
            className="border border-t-0 border-gray-300 rounded-b-lg p-4 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-y-auto"
          />
          
          {hasUnsavedChanges && (
            <p className="text-sm text-amber-600 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              You have unsaved changes
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
            