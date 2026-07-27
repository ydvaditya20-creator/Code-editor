import React, { useRef, useEffect, useState } from 'react';
import { 
  Search, 
  Copy, 
  Check, 
  Trash, 
  CornerDownRight, 
  AlignLeft, 
  Plus, 
  Folder,
  FileCode,
  FileJson,
  Scissors,
  Wand2,
  ZoomIn,
  ZoomOut,
  MoreVertical,
  Undo,
  Redo,
  Save,
  Pencil,
  X
} from 'lucide-react';
import { Project, ProjectFile, EditorSettings, EditorThemeId } from '../types';

interface EditorAreaProps {
  project: Project;
  activeFile: ProjectFile;
  onFileContentChange: (fileId: string, content: string) => void;
  onSelectFile: (fileId: string) => void;
  onAddFile: (name: string, type: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFile?: (fileId: string) => void;
  settings: EditorSettings;
  setSettings: React.Dispatch<React.SetStateAction<EditorSettings>>;
  onRunCode?: () => void;
}

export default function EditorArea({ 
  project,
  activeFile,
  onFileContentChange,
  onSelectFile,
  onAddFile,
  onDeleteFile,
  onRenameFile,
  settings,
  setSettings,
  onRunCode
}: EditorAreaProps) {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [fileMenuState, setFileMenuState] = useState<{ fileId: string; x: number; y: number } | null>(null);
  const [cursorPos, setCursorPos] = useState({ line: 1, column: 1 });
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNoRef = useRef<HTMLDivElement>(null);

  // Custom Undo/Redo History Ref
  const historyRef = useRef<Record<string, { stack: string[]; index: number }>>({});

  // Ensure history is initialized for current active file
  useEffect(() => {
    if (activeFile && !historyRef.current[activeFile.id]) {
      historyRef.current[activeFile.id] = {
        stack: [activeFile.content],
        index: 0
      };
    }
  }, [activeFile?.id]);

  // Wrapper for updating content and registering history
  const handleContentChange = (fileId: string, newValue: string) => {
    const fileHistory = historyRef.current[fileId] || { stack: [], index: -1 };
    const currentStack = [...fileHistory.stack.slice(0, fileHistory.index + 1)];
    
    if (currentStack[currentStack.length - 1] !== newValue) {
      currentStack.push(newValue);
      if (currentStack.length > 150) {
        currentStack.shift();
      }
      historyRef.current[fileId] = {
        stack: currentStack,
        index: currentStack.length - 1
      };
    }
    onFileContentChange(fileId, newValue);
  };

  const handleUndo = (fileId: string) => {
    const fileHistory = historyRef.current[fileId];
    if (fileHistory && fileHistory.index > 0) {
      const newIndex = fileHistory.index - 1;
      fileHistory.index = newIndex;
      const prevContent = fileHistory.stack[newIndex];
      onFileContentChange(fileId, prevContent);
    }
  };

  const handleRedo = (fileId: string) => {
    const fileHistory = historyRef.current[fileId];
    if (fileHistory && fileHistory.index < fileHistory.stack.length - 1) {
      const newIndex = fileHistory.index + 1;
      fileHistory.index = newIndex;
      const nextContent = fileHistory.stack[newIndex];
      onFileContentChange(fileId, nextContent);
    }
  };

  const canUndo = (fileId: string) => {
    const fileHistory = historyRef.current[fileId];
    return fileHistory ? fileHistory.index > 0 : false;
  };

  const canRedo = (fileId: string) => {
    const fileHistory = historyRef.current[fileId];
    return fileHistory ? fileHistory.index < fileHistory.stack.length - 1 : false;
  };

  const handleSaveFileToDevice = (fileName: string, content: string) => {
    try {
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to save file:", err);
      alert("Failed to save file. Please try copying the code instead.");
    }
  };

  const getThemeStyles = (theme: EditorThemeId) => {
    switch (theme) {
      case 'cyberpunk':
        return {
          wrapper: 'bg-[#1a0b2e] text-[#00ffcc] font-mono border-fuchsia-950',
          linesColumn: 'bg-[#110522] text-[#ff007f] border-r border-fuchsia-950/40',
          textarea: 'bg-transparent text-[#00ffcc] caret-[#ff007f] selection:bg-[#ff007f]/40',
          activeLine: 'bg-[#ff007f]/10 border-l-2 border-[#ff007f]'
        };
      case 'monokai':
        return {
          wrapper: 'bg-[#272822] text-[#f8f8f2] font-mono border-[#1e1f1c]',
          linesColumn: 'bg-[#1e1f1c] text-[#75715e] border-r border-[#272822]',
          textarea: 'bg-transparent text-[#f8f8f2] caret-[#f92672] selection:bg-[#49483e]',
          activeLine: 'bg-[#3e3d32]/60 border-l-2 border-[#a6e22e]'
        };
      case 'dracula':
        return {
          wrapper: 'bg-[#282a36] text-[#f8f8f2] font-mono border-[#1e1f29]',
          linesColumn: 'bg-[#1e1f29] text-[#6272a4] border-r border-[#282a36]',
          textarea: 'bg-transparent text-[#f8f8f2] caret-[#ff79c6] selection:bg-[#44475a]',
          activeLine: 'bg-[#44475a]/30 border-l-2 border-[#bd93f9]'
        };
      case 'solarized':
        return {
          wrapper: 'bg-[#fdf6e3] text-[#586e75] font-mono border-[#eee8d5]',
          linesColumn: 'bg-[#eee8d5] text-[#93a1a1] border-r border-[#fdf6e3]',
          textarea: 'bg-transparent text-[#586e75] caret-[#b58900] selection:bg-[#eee8d5]',
          activeLine: 'bg-[#eee8d5]/45 border-l-2 border-[#b58900]'
        };
      case 'light':
        return {
          wrapper: 'bg-white text-slate-800 font-mono border-slate-200',
          linesColumn: 'bg-slate-50 text-slate-400 border-r border-slate-200',
          textarea: 'bg-transparent text-slate-800 caret-indigo-600 selection:bg-indigo-100',
          activeLine: 'bg-indigo-50/50 border-l-2 border-indigo-500'
        };
      case 'midnight':
        return {
          wrapper: 'bg-[#0a0a14] text-[#818cf8] font-mono border-[#1e1b4b]',
          linesColumn: 'bg-[#05050d] text-[#4f46e5] border-r border-[#1e1b4b]/40',
          textarea: 'bg-transparent text-[#e0e7ff] caret-[#818cf8] selection:bg-[#312e81]',
          activeLine: 'bg-[#312e81]/30 border-l-2 border-[#6366f1]'
        };
      case 'emerald':
        return {
          wrapper: 'bg-[#061c15] text-[#34d399] font-mono border-[#062f21]',
          linesColumn: 'bg-[#02120e] text-[#059669] border-r border-[#062f21]/40',
          textarea: 'bg-transparent text-[#e6f4ea] caret-[#34d399] selection:bg-[#064e3b]',
          activeLine: 'bg-[#064e3b]/35 border-l-2 border-[#10b981]'
        };
      case 'crimson':
        return {
          wrapper: 'bg-[#1c050a] text-[#f43f5e] font-mono border-[#3b0712]',
          linesColumn: 'bg-[#120205] text-[#be123c] border-r border-[#3b0712]/40',
          textarea: 'bg-transparent text-[#ffe4e6] caret-[#f43f5e] selection:bg-[#4c0519]',
          activeLine: 'bg-[#4c0519]/35 border-l-2 border-[#e11d48]'
        };
      case 'slate':
      default:
        return {
          wrapper: 'bg-slate-900 text-slate-100 font-mono border-slate-850',
          linesColumn: 'bg-slate-950 text-slate-500 border-r border-slate-850/80',
          textarea: 'bg-transparent text-slate-100 caret-indigo-400 selection:bg-slate-800',
          activeLine: 'bg-indigo-500/10 border-l-2 border-indigo-500'
        };
    }
  };

  const activeCode = activeFile ? activeFile.content : '';
  const themeClass = getThemeStyles(settings.theme);

  // Sync scroll between textarea and line numbers
  const handleScroll = () => {
    const textarea = textareaRef.current;
    const lineNumbers = lineNoRef.current;
    if (textarea && lineNumbers) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
  };

  useEffect(() => {
    handleScroll();
  }, [activeCode]);

  // Support Keyboard Shortcuts (Ctrl+S and Ctrl+/)
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (onRunCode) {
          onRunCode();
          console.log("Compile triggered successfully via hotkey (Ctrl + S)");
        }
      }

      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const val = textarea.value;

        const lineStart = val.lastIndexOf('\n', start - 1) + 1;
        let lineEnd = val.indexOf('\n', end);
        if (lineEnd === -1) lineEnd = val.length;

        const currentLine = val.substring(lineStart, lineEnd);
        let updatedLine = '';

        let prefix = '// ';
        let suffix = '';

        if (activeFile?.type === 'html') {
          prefix = '<!-- ';
          suffix = ' -->';
        } else if (activeFile?.type === 'css') {
          prefix = '/* ';
          suffix = ' */';
        }

        if (currentLine.startsWith(prefix)) {
          updatedLine = currentLine.replace(prefix, '');
          if (suffix) {
            updatedLine = updatedLine.replace(suffix, '');
          }
        } else {
          updatedLine = prefix + currentLine + suffix;
        }

        const updatedVal = val.substring(0, lineStart) + updatedLine + val.substring(lineEnd);
        handleContentChange(activeFile.id, updatedVal);

        setTimeout(() => {
          textarea.focus();
          textarea.selectionStart = lineStart;
          textarea.selectionEnd = lineStart + updatedLine.length;
        }, 30);
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [activeFile, onRunCode, handleContentChange]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const val = textarea.value;
      const tabSpace = ' '.repeat(settings.tabSize);

      const updatedVal = val.substring(0, start) + tabSpace + val.substring(end);
      handleContentChange(activeFile.id, updatedVal);

      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + settings.tabSize;
      }, 0);
    }
  };

  const handleSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const textBeforeCursor = textarea.value.substring(0, textarea.selectionStart);
    const lines = textBeforeCursor.split('\n');
    setCursorPos({
      line: lines.length,
      column: lines[lines.length - 1].length + 1
    });
  };

  const handleClearCurrent = () => {
    if (window.confirm(`Are you sure you want to clear "${activeFile?.name}" editor content?`)) {
      handleContentChange(activeFile.id, '');
    }
  };

  const handleReplace = () => {
    if (!searchQuery) return;
    const currentCode = activeFile.content;
    const updated = currentCode.split(searchQuery).join(replaceQuery);
    handleContentChange(activeFile.id, updated);
  };

  const getFileIconColor = (typeOrExt: string) => {
    const ext = typeOrExt.toLowerCase();
    if (['html', 'htm', 'xhtml', 'svg', 'xml'].includes(ext)) {
      return { text: 'text-orange-500', bg: 'bg-orange-500/10 border-orange-500/30' };
    }
    if (['css', 'scss', 'sass', 'less'].includes(ext)) {
      return { text: 'text-sky-500', bg: 'bg-sky-500/10 border-sky-500/30' };
    }
    if (['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'].includes(ext)) {
      return { text: 'text-yellow-500', bg: 'bg-yellow-500/10 border-yellow-500/30' };
    }
    if (['json', 'json5', 'yaml', 'yml'].includes(ext)) {
      return { text: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' };
    }
    if (['py', 'python'].includes(ext)) {
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' };
    }
    if (['md', 'txt', 'doc'].includes(ext)) {
      return { text: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/30' };
    }
    if (['sql', 'db'].includes(ext)) {
      return { text: 'text-pink-400', bg: 'bg-pink-500/10 border-pink-500/30' };
    }
    if (['php', 'java', 'c', 'cpp', 'cs', 'go', 'rs', 'rb'].includes(ext)) {
      return { text: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' };
    }
    return { text: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/30' };
  };

  // Pinch-to-zoom gesture handling for touch screens
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchStartDist !== null) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const delta = dist - touchStartDist;
      if (Math.abs(delta) > 15) {
        setSettings(prev => ({
          ...prev,
          fontSize: Math.min(32, Math.max(10, prev.fontSize + (delta > 0 ? 1 : -1)))
        }));
        setTouchStartDist(dist);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStartDist(null);
  };

  const handleInsertSymbol = (symbol: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const val = textarea.value;

    const updatedVal = val.substring(0, start) + symbol + val.substring(end);
    onFileContentChange(activeFile.id, updatedVal);

    // Set cursor position right after the inserted symbol and restore focus
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + symbol.length;
    }, 50);
  };

  const codeLines = activeCode.split('\n');

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const promptCreateFile = () => {
    let name = window.prompt("Enter new file name (e.g. data.json, script.py, config.yml, page.html, main.js) or leave empty to open creation dialog:");
    if (name === null) return;
    const trimmed = name.trim();
    if (!trimmed) {
      onAddFile('', '');
      return;
    }
    
    let ext = 'js';
    let finalName = trimmed;
    if (trimmed.includes('.')) {
      ext = trimmed.split('.').pop()?.toLowerCase() || 'txt';
    } else {
      finalName = `${trimmed}.js`;
      ext = 'js';
    }

    onAddFile(finalName, ext);
  };

  const handleZoomIn = () => {
    setSettings(prev => ({ ...prev, fontSize: Math.min(32, prev.fontSize + 1) }));
  };

  const handleZoomOut = () => {
    setSettings(prev => ({ ...prev, fontSize: Math.max(10, prev.fontSize - 1) }));
  };

  return (
    <div 
      id="editor-area-wrapper" 
      className="flex flex-col flex-1 h-full min-h-0 bg-slate-900 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Code Tab Selection Header */}
      <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-2 select-none shrink-0 overflow-x-auto thin-scrollbar w-full">
        <div className="flex items-center gap-1.5 py-1 shrink-0">
          {project.files.map((file) => {
            const isFileActive = activeFile?.id === file.id;
            const colors = getFileIconColor(file.type);
            return (
              <div
                key={file.id}
                className={`group flex items-center gap-1.5 border border-slate-850 rounded-lg px-2 py-0.5 text-xs font-bold transition duration-200 outline-none ${
                  isFileActive 
                    ? `border-indigo-500/50 text-indigo-400 bg-indigo-500/10` 
                    : 'border-transparent text-slate-400 hover:bg-slate-900/65 hover:text-slate-200'
                }`}
              >
                {/* Clicking on the file tab itself selects it */}
                <div 
                  onClick={() => {
                    onSelectFile(file.id);
                    setTimeout(() => textareaRef.current?.focus(), 50);
                  }}
                  className="flex items-center gap-1 cursor-pointer"
                >
                  <span className={`${colors.text} text-[9px] font-extrabold px-1 py-0.5 rounded bg-slate-900`}>
                    {file.type.toUpperCase()}
                  </span>
                  <span className="truncate max-w-[100px] text-[11px]">{file.name}</span>
                </div>

                {/* 3-Dot Options Dropdown Trigger */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    setFileMenuState(
                      fileMenuState?.fileId === file.id 
                        ? null 
                        : { fileId: file.id, x: rect.right, y: rect.bottom }
                    );
                  }}
                  className="p-1 rounded hover:bg-slate-800/80 text-slate-500 hover:text-slate-200 transition cursor-pointer"
                  title="File Options"
                >
                  <MoreVertical className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Viewport-fixed Options Menu */}
      {fileMenuState && (() => {
        const file = project.files.find(f => f.id === fileMenuState.fileId);
        if (!file) return null;
        return (
          <>
            <div 
              className="fixed inset-0 z-50 cursor-default" 
              onClick={() => setFileMenuState(null)} 
            />
            <div 
              className="fixed w-48 rounded-xl bg-slate-950 border border-slate-800 shadow-2xl p-1.5 z-50 text-xs flex flex-col gap-0.5 animate-fade"
              style={{ 
                top: `${fileMenuState.y + 6}px`, 
                left: `${Math.min(window.innerWidth - 200, fileMenuState.x - 180)}px` 
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-2.5 py-1 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 mb-1 select-none">
                File Actions
              </div>

              {/* Copy File Option */}
              <button
                onClick={() => {
                  navigator.clipboard.writeText(file.content);
                  setFileMenuState(null);
                  alert(`"${file.name}" code copied to clipboard!`);
                }}
                className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition cursor-pointer font-semibold"
              >
                <Copy className="h-3.5 w-3.5 text-indigo-400" />
                <span>Copy File</span>
              </button>

              {/* Rename File Option */}
              <button
                onClick={() => {
                  setFileMenuState(null);
                  if (onRenameFile) {
                    onRenameFile(file.id);
                  }
                }}
                className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition cursor-pointer font-semibold"
              >
                <Pencil className="h-3.5 w-3.5 text-amber-400" />
                <span>Rename File</span>
              </button>

              {/* Save File Option */}
              <button
                onClick={() => {
                  handleSaveFileToDevice(file.name, file.content);
                  setFileMenuState(null);
                }}
                className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 rounded-lg transition cursor-pointer font-semibold animate-pulse-once"
              >
                <Save className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                <span>Save/Download File</span>
              </button>

              {/* Toggle Search & Replace Option */}
              <button
                onClick={() => {
                  setShowSearch(!showSearch);
                  setFileMenuState(null);
                }}
                className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition cursor-pointer font-semibold"
              >
                <Search className="h-3.5 w-3.5 text-sky-400" />
                <span>Find and Replace</span>
              </button>

              {/* Import File Option (Device) */}
              <button
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = `.${file.type}`;
                  input.onchange = (event: any) => {
                    const selectedFile = event.target.files[0];
                    if (!selectedFile) return;
                    const reader = new FileReader();
                    reader.onload = (e: any) => {
                      const text = e.target.result;
                      handleContentChange(file.id, text);
                      alert(`Successfully imported content into "${file.name}"!`);
                    };
                    reader.readAsText(selectedFile);
                  };
                  input.click();
                  setFileMenuState(null);
                }}
                className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition cursor-pointer font-semibold"
              >
                <CornerDownRight className="h-3.5 w-3.5 text-amber-400" />
                <span>Import File</span>
              </button>

              <div className="border-t border-slate-900 my-1" />

              {/* Undo Option */}
              <button
                onClick={() => {
                  handleUndo(file.id);
                  setFileMenuState(null);
                }}
                disabled={!canUndo(file.id)}
                className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg transition font-semibold ${
                  canUndo(file.id)
                    ? 'hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 cursor-pointer'
                    : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <Undo className="h-3.5 w-3.5" />
                <span>Undo Change</span>
              </button>

              {/* Redo Option */}
              <button
                onClick={() => {
                  handleRedo(file.id);
                  setFileMenuState(null);
                }}
                disabled={!canRedo(file.id)}
                className={`flex items-center gap-2 w-full text-left px-2 py-1.5 rounded-lg transition font-semibold ${
                  canRedo(file.id)
                    ? 'hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 cursor-pointer'
                    : 'text-slate-600 cursor-not-allowed opacity-50'
                }`}
              >
                <Redo className="h-3.5 w-3.5" />
                <span>Redo Change</span>
              </button>

              <div className="border-t border-slate-900 my-1" />

              {/* Delete Option (only if not index.html, style.css, main.js) */}
              {['index.html', 'style.css', 'main.js'].indexOf(file.name) === -1 ? (
                <button
                  onClick={() => {
                    onDeleteFile(file.id);
                    setFileMenuState(null);
                  }}
                  className="flex items-center gap-2 w-full text-left px-2 py-1.5 hover:bg-red-500/10 hover:text-red-400 text-red-400 rounded-lg transition cursor-pointer font-semibold"
                >
                  <Trash className="h-3.5 w-3.5" />
                  <span>Delete File</span>
                </button>
              ) : (
                <div className="px-2.5 py-1 text-[9px] text-slate-500 italic select-none">
                  System Protected File
                </div>
              )}
            </div>
          </>
        );
      })()}

      {/* 📱 Quick Symbol Toolbar for Mobile Coding (Signature of eo Code Studio!) */}
      <div 
        id="quick-symbol-toolbar"
        className="flex items-center gap-1 bg-[#0a0d17] border-b border-slate-800 px-3 py-1 overflow-x-auto thin-scrollbar shrink-0 select-none scroll-smooth"
      >
        <span className="text-[10px] font-black uppercase text-slate-500 mr-2 shrink-0 tracking-wider">Symbols:</span>
        {[';', '{', '}', '(', ')', '[', ']', '<', '>', '"', "'", '/', '=', '+', '-', '*', '%', '!', '?', ':', '_', '$'].map((sym) => (
          <button
            key={sym}
            onClick={() => handleInsertSymbol(sym)}
            className="px-3 py-1 text-xs font-mono font-bold bg-slate-900 border border-slate-800 hover:border-indigo-500 text-slate-300 hover:text-white rounded transition active:scale-90 cursor-pointer shrink-0"
          >
            {sym}
          </button>
        ))}
      </div>

      {/* Embedded Search & Replace bar */}
      {showSearch && (
        <div id="search-replace-overlay" className="flex flex-wrap items-center gap-2 border-b border-slate-800 bg-slate-900/60 p-2 text-[11px] shrink-0">
          <div className="flex items-center gap-1.5 rounded bg-slate-950 px-2 py-1 border border-slate-800">
            <span className="text-slate-500 font-medium select-none">Find:</span>
            <input
              type="text"
              id="find-input-field"
              placeholder="Query..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-slate-100 outline-none w-28 sm:w-36 font-mono text-xs"
            />
          </div>
          <div className="flex items-center gap-1.5 rounded bg-slate-950 px-2 py-1 border border-slate-800">
            <span className="text-slate-500 font-medium select-none">Replace:</span>
            <input
              type="text"
              id="replace-input-field"
              placeholder="Text..."
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              className="bg-transparent text-slate-100 outline-none w-28 sm:w-36 font-mono text-xs"
            />
          </div>
          <button
            id="apply-replace-btn"
            onClick={handleReplace}
            className="rounded bg-indigo-600 hover:bg-indigo-500 px-3 py-1 font-bold text-white transition cursor-pointer text-[10px]"
          >
            Replace All
          </button>
          
          <button
            onClick={() => setShowSearch(false)}
            className="ml-auto p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            title="Close Search & Replace"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* Actual Line-Numbered Textarea viewport */}
      <div 
        id="code-input-viewport" 
        className={`flex-1 flex relative min-h-0 text-[13px] md:text-sm overflow-hidden ${themeClass.wrapper}`}
        style={{ fontSize: `${settings.fontSize}px` }}
      >
        {/* Dynamic Line Numbers Column */}
        {settings.showLineNumbers && (
          <div
            id="line-numbers-container"
            ref={lineNoRef}
            className={`w-8 select-none text-right pr-1.5 py-4 overflow-hidden font-mono text-[11px] sm:text-[12px] leading-[18px] flex flex-col shrink-0 ${themeClass.linesColumn}`}
          >
            {codeLines.map((_, idx) => (
              <span 
                key={idx} 
                className={`block h-[18px] transition-colors ${
                  cursorPos.line === idx + 1 ? 'text-indigo-400 font-bold' : ''
                }`}
              >
                {idx + 1}
              </span>
            ))}
          </div>
        )}

        {/* Text Area Input */}
        <textarea
          id="code-input-textarea"
          ref={textareaRef}
          value={activeCode}
          onChange={(e) => handleContentChange(activeFile.id, e.target.value)}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          className={`flex-1 resize-none border-none p-4 font-mono leading-[18px] outline-none h-full overflow-y-auto whitespace-pre ${
            settings.wordWrap ? 'whitespace-pre-wrap break-all' : 'overflow-x-auto'
          } ${themeClass.textarea}`}
          placeholder={
            activeFile?.type === 'html' 
              ? '<!-- Write HTML markup here... -->' 
              : activeFile?.type === 'css' 
                ? '/* Write CSS rules here... */' 
                : '// Write interactive JavaScript here...'
          }
        />
      </div>
    </div>
  );
}
