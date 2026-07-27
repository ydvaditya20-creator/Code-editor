import React, { useEffect, useRef, useState } from 'react';
import { 
  Play, 
  Terminal, 
  RefreshCcw, 
  Maximize2, 
  Minimize2, 
  Trash2, 
  AlertTriangle, 
  XCircle, 
  CheckCircle,
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { Project, ConsoleLogMessage } from '../types';

interface PreviewPanelProps {
  project: Project;
  runCounter: number;
  previewScale: number;
  setPreviewScale: React.Dispatch<React.SetStateAction<number>>;
  consoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
}

export default function PreviewPanel({ 
  project, 
  runCounter,
  previewScale,
  setPreviewScale,
  consoleOpen,
  setConsoleOpen
}: PreviewPanelProps) {
  const [logs, setLogs] = useState<ConsoleLogMessage[]>([]);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [srcDoc, setSrcDoc] = useState('');
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Clear logs on clean run
  useEffect(() => {
    setLogs([]);
    generateSrcDoc();
  }, [runCounter, project]);

  // Listen to message events from the iframe console hooking script
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const data = event.data;
      if (data && data.source === 'code-editor-iframe') {
        const timestamp = new Date().toLocaleTimeString();
        setLogs((prev) => [
          ...prev,
          {
            type: data.type,
            args: data.args,
            timestamp
          }
        ]);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const generateSrcDoc = () => {
    if (!project) return;

    // Find HTML entry file (preference: index.html, else any html file, else first file)
    const htmlFiles = project.files.filter(f => f.type === 'html');
    const entryHtmlFile = htmlFiles.find(f => f.name === 'index.html') || htmlFiles[0] || project.files[0];
    
    let htmlContent = entryHtmlFile ? entryHtmlFile.content : '<h1>No HTML File found. Create index.html to start!</h1>';

    // Combine all CSS files in the project
    const cssFiles = project.files.filter(f => f.type === 'css');
    const combinedCSS = cssFiles.map(f => `/* --- CSS File: ${f.name} --- */\n${f.content}`).join('\n\n');

    // Gather and execute JS files sequentially (putting main.js last if exists)
    const jsFiles = [...project.files.filter(f => f.type === 'js')];
    jsFiles.sort((a, b) => {
      if (a.name === 'main.js') return 1;
      if (b.name === 'main.js') return -1;
      return a.name.localeCompare(b.name);
    });

    const jsExecBlocks = jsFiles.map(f => `
      try {
        // --- Executing JS File: ${f.name} ---
        ${f.content}
      } catch (err) {
        console.error("Runtime error in ${f.name}: " + err.message);
      }
    `).join('\n\n');

    // Reconstruct head and body, embedding compiled CSS and JavaScript hooks
    const compiled = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Live Preview</title>
  
  <style>
    /* Reset scrollbar in preview for aesthetic */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(15, 23, 42, 0.4);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(100, 116, 139, 0.4);
      border-radius: 3px;
    }
    
    /* Inject Combined project CSS styles */
    ${combinedCSS}
  </style>

  <script>
    // Capture and hook logs before user JS executes
    (function() {
      const _log = console.log;
      const _info = console.info;
      const _warn = console.warn;
      const _error = console.error;

      function sendToParent(type, args) {
        const processedArgs = args.map(arg => {
          if (arg === undefined) return 'undefined';
          if (arg === null) return 'null';
          if (typeof arg === 'object') {
            try {
              return JSON.stringify(arg, null, 2);
            } catch(e) {
              return Object.prototype.toString.call(arg);
            }
          }
          return String(arg);
        });

        window.parent.postMessage({
          source: 'code-editor-iframe',
          type,
          args: processedArgs
        }, '*');
      }

      console.log = function(...args) {
        _log.apply(console, args);
        sendToParent('log', args);
      };
      console.info = function(...args) {
        _info.apply(console, args);
        sendToParent('info', args);
      };
      console.warn = function(...args) {
        _warn.apply(console, args);
        sendToParent('warn', args);
      };
      console.error = function(...args) {
        _error.apply(console, args);
        sendToParent('error', args);
      };

      // Listen for runtime errors
      window.onerror = function(message, source, lineno, colno, error) {
        sendToParent('error', [\`Runtime Error: \${message} (Line \${lineno}:\\colno)\`]);
        return false;
      };
    })();
  </script>
</head>
<body>
  <!-- Inject User HTML markup -->
  ${htmlContent}

  <!-- Sequentially execute Javascript files -->
  <script>
    ${jsExecBlocks}
  </script>
</body>
</html>`;
    setSrcDoc(compiled);
  };

  const reloadIframe = () => {
    setLogs([]);
    if (iframeRef.current) {
      iframeRef.current.srcdoc = srcDoc;
    }
    console.log("Live page refreshed.");
  };

  // Pinch-to-zoom scaling gestures for touch screens
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
        setPreviewScale(prev => Math.min(2.5, Math.max(0.02, prev + (delta > 0 ? 0.05 : -0.05))));
        setTouchStartDist(dist);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStartDist(null);
  };

  // Count types of logs
  const errorCount = logs.filter((l) => l.type === 'error').length;
  const warnCount = logs.filter((l) => l.type === 'warn').length;

  return (
    <div 
      id="preview-panel-wrapper" 
      className={`flex flex-col border-t lg:border-t-0 lg:border-l border-slate-800 bg-[#070a13] min-w-0 transition-all relative ${
        isFullscreen ? 'fixed inset-0 z-50 w-screen h-screen' : 'flex-1 h-full'
      }`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Frame sandbox space with zooming capability */}
      <div className="flex-1 min-h-0 bg-white relative overflow-hidden">
        <div 
          className="w-full h-full transition-transform duration-75 origin-top-left"
          style={{
            transform: `scale(${previewScale})`,
            width: `${100 / previewScale}%`,
            height: `${100 / previewScale}%`
          }}
        >
          <iframe
            id="preview-sandbox-iframe"
            ref={iframeRef}
            srcDoc={srcDoc}
            sandbox="allow-scripts allow-modals allow-same-origin allow-popups"
            className="w-full h-full border-none bg-white"
            title="Sandbox Preview"
            referrerPolicy="no-referrer"
          />
        </div>


      </div>

      {/* Interactive Web Console widget - toggled by consoleOpen */}
      {consoleOpen && (
        <div 
          id="console-widget-container" 
          className="border-t border-slate-800 bg-slate-950 flex flex-col shrink-0 h-[200px] md:h-[240px]"
        >
          {/* Console Header Toggle */}
          <div 
            onClick={() => setConsoleOpen(!consoleOpen)}
            className="flex h-10 items-center justify-between px-4 bg-[#0a0f1d] hover:bg-[#10172b] cursor-pointer border-b border-slate-900 select-none"
          >
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Interactive Console Log</span>
              
              {/* Log counters badge */}
              <div className="flex items-center gap-1.5 ml-2">
                {logs.length > 0 && (
                  <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono">
                    {logs.length} logs
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="flex items-center gap-1 rounded bg-red-950/40 border border-red-900/30 px-1.5 py-0.5 text-[10px] text-red-400 font-mono">
                    <XCircle className="h-3 w-3" /> {errorCount}
                  </span>
                )}
                {warnCount > 0 && (
                  <span className="flex items-center gap-1 rounded bg-amber-950/40 border border-amber-900/30 px-1.5 py-0.5 text-[10px] text-amber-400 font-mono">
                    <AlertTriangle className="h-3 w-3" /> {warnCount}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLogs([]);
                }}
                className="flex h-6 w-6 items-center justify-center rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"
                title="Clear logs"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <span className="text-[10px] text-slate-500 font-semibold uppercase">
                Collapse Console
              </span>
            </div>
          </div>

          {/* Real Console Log Entries */}
          <div className="flex-1 overflow-y-auto p-4 font-mono text-xs text-slate-300 flex flex-col gap-2 bg-[#050811]">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-slate-600 gap-1.5 select-none py-6">
                <CheckCircle className="h-6 w-6 text-slate-700" />
                <p className="text-[11px]">Console is empty. Run your application script to see print logs.</p>
              </div>
            ) : (
              logs.map((log, idx) => {
                let textClass = 'text-slate-300';
                let icon = null;

                if (log.type === 'error') {
                  textClass = 'text-rose-400 bg-rose-950/15 border-l-2 border-rose-500 pl-2';
                  icon = <AlertCircle className="h-3 w-3 inline mr-1 text-rose-500 shrink-0" />;
                } else if (log.type === 'warn') {
                  textClass = 'text-amber-400 bg-amber-950/10 border-l-2 border-amber-500 pl-2';
                  icon = <AlertTriangle className="h-3 w-3 inline mr-1 text-amber-500 shrink-0" />;
                } else if (log.type === 'info') {
                  textClass = 'text-sky-400 border-l-2 border-sky-500 pl-2';
                }

                return (
                  <div key={idx} className={`py-1.5 leading-relaxed flex items-start text-[11px] font-mono border-b border-slate-900/65 ${textClass}`}>
                    <span className="text-slate-600 mr-2 text-[10px] select-none shrink-0">{log.timestamp}</span>
                    <div className="flex-1 break-words whitespace-pre-wrap">
                      {icon}
                      {log.args.map((arg, argIdx) => (
                        <span key={argIdx} className="mr-2">
                          {arg}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
