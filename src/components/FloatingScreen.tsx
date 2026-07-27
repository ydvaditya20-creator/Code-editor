import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  ExternalLink, 
  Copy, 
  Clipboard, 
  X, 
  Minimize2, 
  Maximize2, 
  Move, 
  Sparkles, 
  FileCode, 
  Plus, 
  Check, 
  RefreshCcw, 
  Eye, 
  StickyNote, 
  Layers,
  Zap,
  ArrowRight
} from 'lucide-react';
import { Project, ProjectFile } from '../types';

interface FloatingScreenProps {
  project: Project;
  activeFile?: ProjectFile;
  onUpdateFileContent?: (fileId: string, content: string) => void;
  onAddFile?: (name: string, type: string) => void;
  isOpen: boolean;
  onClose: () => void;
  runCounter: number;
}

export default function FloatingScreen({
  project,
  activeFile,
  onUpdateFileContent,
  onAddFile,
  isOpen,
  onClose,
  runCounter
}: FloatingScreenProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'context'>('context');
  const [position, setPosition] = useState({ x: 20, y: 70 });
  const [size, setSize] = useState({ width: 420, height: 500 });
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTransparent, setIsTransparent] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({ startX: 0, startY: 0, posX: 20, posY: 70 });

  // Context & Scratchpad states
  const [contextText, setContextText] = useState(() => {
    return localStorage.getItem('floating_context_scratchpad') || '';
  });
  const [copied, setCopied] = useState(false);
  const [pasteSuccess, setPasteSuccess] = useState(false);
  const [popoutWindow, setPopoutWindow] = useState<Window | null>(null);

  // Save scratchpad
  useEffect(() => {
    localStorage.setItem('floating_context_scratchpad', contextText);
  }, [contextText]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: position.x,
      posY: position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      
      const newX = Math.max(10, Math.min(window.innerWidth - 100, dragRef.current.posX + dx));
      const newY = Math.max(10, Math.min(window.innerHeight - 80, dragRef.current.posY + dy));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Generate SrcDoc for live preview
  const generateSrcDoc = () => {
    if (!project) return '';

    const htmlFiles = project.files.filter(f => f.type === 'html');
    const entryHtmlFile = htmlFiles.find(f => f.name === 'index.html') || htmlFiles[0] || project.files[0];
    const htmlContent = entryHtmlFile ? entryHtmlFile.content : '<h1>Floating Preview Screen</h1>';

    const cssFiles = project.files.filter(f => f.type === 'css');
    const combinedCSS = cssFiles.map(f => f.content).join('\n\n');

    const jsFiles = [...project.files.filter(f => f.type === 'js')];
    jsFiles.sort((a, b) => (a.name === 'main.js' ? 1 : b.name === 'main.js' ? -1 : 0));
    const jsExecBlocks = jsFiles.map(f => f.content).join('\n\n');

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; font-family: system-ui, sans-serif; background: #ffffff; color: #111; }
    ${combinedCSS}
  </style>
</head>
<body>
  ${htmlContent}
  <script>
    try {
      ${jsExecBlocks}
    } catch(e) {
      console.error(e);
    }
  </script>
</body>
</html>`;
  };

  // Pop-out Standalone Browser Window for True Desktop Floating Experience
  const handlePopOutStandaloneWindow = () => {
    if (popoutWindow && !popoutWindow.closed) {
      popoutWindow.focus();
      return;
    }

    const win = window.open(
      '',
      'FloatingAppPreview',
      'width=450,height=600,top=100,left=100,resizable=yes,scrollbars=yes,status=no,toolbar=no,menubar=no'
    );

    if (win) {
      const src = generateSrcDoc();
      win.document.open();
      win.document.write(src);
      win.document.close();
      setPopoutWindow(win);
    } else {
      alert("Pop-up window blocked by browser. Please allow popups for this site!");
    }
  };

  // Keep popout window updated when code changes
  useEffect(() => {
    if (popoutWindow && !popoutWindow.closed) {
      try {
        const src = generateSrcDoc();
        popoutWindow.document.open();
        popoutWindow.document.write(src);
        popoutWindow.document.close();
      } catch (err) {
        console.error("Popout window refresh error:", err);
      }
    }
  }, [project, runCounter]);

  // Paste from clipboard helper
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setContextText(prev => prev ? `${prev}\n\n${text}` : text);
        setPasteSuccess(true);
        setTimeout(() => setPasteSuccess(false), 2000);
      }
    } catch (err) {
      alert("Clipboard access error or permission denied. Please paste directly into the box.");
    }
  };

  // Extract Code Blocks from pasted Markdown text
  const extractCodeBlocks = (text: string) => {
    const codeBlockRegex = /```([a-zA-Z0-9]*)\n([\s\S]*?)```/g;
    const blocks: { language: string; code: string }[] = [];
    let match;
    while ((match = codeBlockRegex.exec(text)) !== null) {
      blocks.push({
        language: match[1] || 'txt',
        code: match[2].trim()
      });
    }
    return blocks;
  };

  const codeBlocks = extractCodeBlocks(contextText);

  if (!isOpen) return null;

  return (
    <div
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        width: isMinimized ? '280px' : `${size.width}px`,
        height: isMinimized ? '44px' : `${size.height}px`,
        zIndex: 9999
      }}
      className={`fixed flex flex-col rounded-2xl border border-indigo-500/40 bg-slate-950/95 backdrop-blur-xl shadow-2xl transition-opacity duration-200 ${
        isTransparent ? 'opacity-40 hover:opacity-100' : 'opacity-100'
      }`}
    >
      {/* HEADER / DRAG BAR */}
      <div
        onMouseDown={handleMouseDown}
        className="flex items-center justify-between px-3 py-2 bg-slate-900/90 rounded-t-2xl border-b border-slate-800 cursor-move select-none"
      >
        <div className="flex items-center gap-2">
          <Move className="h-3.5 w-3.5 text-indigo-400" />
          <span className="text-xs font-black text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Tv className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            Floating Screen
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Transparency Toggle */}
          {!isMinimized && (
            <button
              onClick={() => setIsTransparent(!isTransparent)}
              className={`p-1 rounded text-[10px] font-bold transition ${
                isTransparent ? 'bg-indigo-500/20 text-indigo-300' : 'text-slate-400 hover:text-white'
              }`}
              title={isTransparent ? "Make Opaque" : "Make Semi-Transparent"}
            >
              <Eye className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Standalone Window Pop-Out */}
          <button
            onClick={handlePopOutStandaloneWindow}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded transition cursor-pointer"
            title="Pop-out Floating Window (Opens standalone desktop floating window)"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </button>

          {/* Minimize / Expand */}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded transition cursor-pointer"
            title={isMinimized ? "Expand Screen" : "Minimize Screen"}
          >
            {isMinimized ? <Maximize2 className="h-3.5 w-3.5" /> : <Minimize2 className="h-3.5 w-3.5" />}
          </button>

          {/* Close */}
          <button
            onClick={onClose}
            className="p-1 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded transition cursor-pointer"
            title="Close Floating Screen"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* MINIMIZED VIEW */}
      {isMinimized && (
        <div className="flex items-center justify-between px-3 py-1 text-[11px] text-slate-400 font-medium">
          <span className="truncate">Floating Scratchpad & Preview</span>
          <button
            onClick={() => setIsMinimized(false)}
            className="text-indigo-400 font-bold hover:underline"
          >
            Open
          </button>
        </div>
      )}

      {/* EXPANDED VIEW CONTENT */}
      {!isMinimized && (
        <div className="flex-1 flex flex-col min-h-0 p-3 space-y-3">
          {/* TAB BAR */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('context')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'context'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <StickyNote className="h-3.5 w-3.5" />
              <span>Context & Notes</span>
            </button>

            <button
              onClick={() => setActiveTab('preview')}
              className={`flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Eye className="h-3.5 w-3.5" />
              <span>Floating Live Screen</span>
            </button>
          </div>

          {/* TAB 1: CONTEXT & CLIPBOARD SCRATCHPAD */}
          {activeTab === 'context' && (
            <div className="flex-1 flex flex-col min-h-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Clipboard className="h-3 w-3 text-indigo-400" />
                  <span>Clipboard Context & Prompts</span>
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handlePasteFromClipboard}
                    className="flex items-center gap-1 py-1 px-2 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] font-bold border border-indigo-500/30 transition cursor-pointer"
                    title="Paste from Clipboard"
                  >
                    {pasteSuccess ? <Check className="h-3 w-3 text-emerald-400" /> : <Clipboard className="h-3 w-3" />}
                    <span>{pasteSuccess ? 'Pasted!' : 'Paste Clipboard'}</span>
                  </button>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(contextText);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    className="flex items-center gap-1 py-1 px-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-[10px] font-bold border border-slate-800 transition cursor-pointer"
                  >
                    {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copied ? 'Copied' : 'Copy All'}</span>
                  </button>
                </div>
              </div>

              {/* Text Area */}
              <textarea
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                placeholder="Paste code snippets, ChatGPT prompts, or notes here to keep them handy while working..."
                className="flex-1 w-full bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-indigo-500 resize-none thin-scrollbar"
              />

              {/* Action Buttons for Active File */}
              {contextText && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        if (activeFile && onUpdateFileContent) {
                          onUpdateFileContent(activeFile.id, activeFile.content + '\n\n' + contextText);
                          alert(`Appended context into file "${activeFile.name}"!`);
                        }
                      }}
                      className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-md"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>Append to {activeFile?.name || 'Active File'}</span>
                    </button>

                    <button
                      onClick={() => setContextText('')}
                      className="py-1.5 px-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded-lg text-xs font-bold border border-slate-800 transition cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>

                  {/* Extracted Code Blocks */}
                  {codeBlocks.length > 0 && (
                    <div className="space-y-1 max-h-24 overflow-y-auto thin-scrollbar">
                      <span className="text-[10px] font-bold text-amber-400">Detected Code Blocks ({codeBlocks.length}):</span>
                      {codeBlocks.map((blk, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-[10px]">
                          <span className="font-mono text-indigo-400 uppercase font-bold">{blk.language || 'code'}</span>
                          <button
                            onClick={() => {
                              if (onAddFile) {
                                onAddFile(`extracted_${idx + 1}.${blk.language || 'js'}`, blk.language || 'js');
                              }
                            }}
                            className="flex items-center gap-1 text-emerald-400 font-bold hover:underline"
                          >
                            <Plus className="h-3 w-3" />
                            <span>Create File</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: FLOATING LIVE SCREEN PREVIEW */}
          {activeTab === 'preview' && (
            <div className="flex-1 flex flex-col min-h-0 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                  <Eye className="h-3 w-3 text-emerald-400" />
                  <span>Live App Render</span>
                </span>

                <button
                  onClick={handlePopOutStandaloneWindow}
                  className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition"
                >
                  <ExternalLink className="h-3 w-3" />
                  <span>Pop Out Window</span>
                </button>
              </div>

              {/* Embedded Live IFrame */}
              <div className="flex-1 rounded-xl border border-slate-800 bg-white overflow-hidden shadow-inner relative">
                <iframe
                  title="Floating Preview"
                  srcDoc={generateSrcDoc()}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-modals allow-forms allow-same-origin"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
