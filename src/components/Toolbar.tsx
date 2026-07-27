import React from 'react';
import { 
  Play, 
  RotateCcw, 
  Download, 
  Settings, 
  FileCode, 
  ChevronDown, 
  Sparkles, 
  Copy, 
  Check, 
  Trash2,
  Tv
} from 'lucide-react';
import { CODE_TEMPLATES } from '../templates';
import { EditorSettings, CodeFiles, EditorThemeId, WorkspaceLayoutId } from '../types';

interface ToolbarProps {
  files: CodeFiles;
  settings: EditorSettings;
  setSettings: React.Dispatch<React.SetStateAction<EditorSettings>>;
  onLoadTemplate: (templateId: string) => void;
  onRunCode: () => void;
  onResetCode: () => void;
  onFormatCode: () => void;
  isLiveLoading: boolean;
  onToggleFloatingScreen?: () => void;
  isFloatingScreenOpen?: boolean;
}

export default function Toolbar({
  files,
  settings,
  setSettings,
  onLoadTemplate,
  onRunCode,
  onResetCode,
  onFormatCode,
  isLiveLoading,
  onToggleFloatingScreen,
  isFloatingScreenOpen
}: ToolbarProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState('starter');
  const [copied, setCopied] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);

  const handleDownload = () => {
    // Generate an absolute standalone HTML file with inline CSS and JS
    const combinedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Web Code App</title>
  <style>
    /* User Stylesheet */
    ${files.css}
  </style>
</head>
<body>
  <!-- User Markup -->
  ${files.html}

  <script>
    /* User Scripts */
    ${files.js}
  </script>
</body>
</html>`;

    const blob = new Blob([combinedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'web-code-app.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    const combinedHTML = `<!-- HTML -->\n${files.html}\n\n/* CSS */\n${files.css}\n\n// JavaScript\n${files.js}`;
    navigator.clipboard.writeText(combinedHTML);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="toolbar-container" className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 bg-slate-950 p-4 text-slate-200">
      {/* Brand Logo & Title */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-lg shadow-indigo-500/20">
          <FileCode className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-md font-bold tracking-tight text-white flex items-center gap-2">
            AI Code Editor
            <span className="hidden sm:inline-block rounded-md bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-400 border border-indigo-500/20">
              Live Compiler
            </span>
          </h1>
          <p className="text-xs text-slate-400">Html, Css and JS sandbox</p>
        </div>
      </div>

      {/* Action Controls & Interactive Tools */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Template Select Dropdown */}
        <div className="relative flex items-center">
          <div className="pointer-events-none absolute left-3 text-slate-400">
            <Sparkles className="h-4 w-4" />
          </div>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={(e) => {
              setSelectedTemplate(e.target.value);
              onLoadTemplate(e.target.value);
            }}
            className="h-9 w-[190px] sm:w-[220px] rounded-lg border border-slate-800 bg-slate-900 pl-9 pr-8 text-xs font-medium text-slate-200 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none"
          >
            <option disabled value="">-- Load a Template --</option>
            {CODE_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                [{tmpl.category}] {tmpl.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 text-slate-400">
            <ChevronDown className="h-3 w-3" />
          </div>
        </div>

        {/* Format Code */}
        <button
          id="format-code-btn"
          onClick={onFormatCode}
          title="Tidy up user codes formatting"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Format</span>
        </button>

        {/* Run Code Trigger */}
        <button
          id="run-code-btn"
          onClick={onRunCode}
          className="flex h-9 items-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white hover:bg-emerald-500 active:scale-95 shadow-lg shadow-emerald-600/10 transition"
        >
          <Play className="h-3.5 w-3.5 fill-current" />
          <span>{settings.liveUpdate ? 'Running Live' : 'Run Code'}</span>
          {isLiveLoading && (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
          )}
        </button>

        <div className="h-6 w-px bg-slate-800 mx-1 hidden sm:block" />

        {/* Copy All Combined Code */}
        <button
          id="copy-all-btn"
          onClick={handleCopyAll}
          title="Copy HTML + CSS + JS"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        {/* Download Standalone ZIP / Page */}
        <button
          id="download-app-btn"
          onClick={handleDownload}
          title="Download single-file HTML executable app"
          className="flex h-9 items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden md:inline">Export HTML</span>
        </button>

        {/* Reset / Erase Code */}
        <button
          id="reset-code-btn"
          onClick={onResetCode}
          title="Reset to blank canvas"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:border-red-900/30 hover:bg-red-950/20 hover:text-red-400 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>

        {/* Floating Screen Toggle Button */}
        {onToggleFloatingScreen && (
          <button
            id="toggle-floating-screen-btn"
            onClick={onToggleFloatingScreen}
            title="Floating Screen Mode (Multi-tasking popup window & clipboard context scratchpad)"
            className={`flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-bold transition shadow-sm cursor-pointer ${
              isFloatingScreenOpen
                ? 'bg-indigo-600 text-white shadow-indigo-600/30 border border-indigo-400'
                : 'border border-indigo-500/40 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 hover:text-white'
            }`}
          >
            <Tv className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">Floating Screen</span>
          </button>
        )}

        {/* Settings Toggle Trigger */}
        <div className="relative">
          <button
            id="toggle-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            className={`flex h-9 w-9 items-center justify-center rounded-lg border transition ${
              showSettings 
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400' 
                : 'border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Settings className="h-4 w-4" />
          </button>

          {/* Quick Settings Dropdown Panel */}
          {showSettings && (
            <div id="settings-dropdown-panel" className="absolute right-0 mt-2 z-50 w-72 rounded-xl border border-slate-800 bg-slate-900 p-4 shadow-xl shadow-black/60 animate-fade">
              <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                Editor Custom Settings
              </h3>
              
              <div className="flex flex-col gap-3.5 text-xs text-slate-300">
                {/* Theme selection option */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">Color Theme:</span>
                  <select
                    id="theme-select"
                    value={settings.theme}
                    onChange={(e) => setSettings({ ...settings, theme: e.target.value as EditorThemeId })}
                    className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="slate">Slate Classic</option>
                    <option value="cyberpunk">Cyber Neon</option>
                    <option value="monokai">Monokai Pro</option>
                    <option value="dracula">Dracula Dark</option>
                    <option value="solarized">Solarized Warm</option>
                    <option value="light">Classic Light</option>
                  </select>
                </div>

                {/* Font Size Selector */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">Font Size (px):</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setSettings({ ...settings, fontSize: Math.max(11, settings.fontSize - 1) })}
                      className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 hover:bg-slate-700 font-bold"
                    >
                      -
                    </button>
                    <span className="w-6 text-center font-mono">{settings.fontSize}</span>
                    <button
                      onClick={() => setSettings({ ...settings, fontSize: Math.min(24, settings.fontSize + 1) })}
                      className="flex h-6 w-6 items-center justify-center rounded bg-slate-800 hover:bg-slate-700 font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Tab Spacing Options */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">Tab Indent Size:</span>
                  <select
                    id="tab-size-select"
                    value={settings.tabSize}
                    onChange={(e) => setSettings({ ...settings, tabSize: parseInt(e.target.value) })}
                    className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="2">2 Spaces</option>
                    <option value="4">4 Spaces</option>
                    <option value="8">8 Spaces</option>
                  </select>
                </div>

                {/* Workspace Split Layout Options */}
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium">Split Layout:</span>
                  <select
                    id="layout-select"
                    value={settings.layout}
                    onChange={(e) => setSettings({ ...settings, layout: e.target.value as WorkspaceLayoutId })}
                    className="rounded-md border border-slate-700 bg-slate-950 px-2 py-1 text-xs outline-none focus:border-indigo-500"
                  >
                    <option value="split-vertical">Side-by-Side (Vertical)</option>
                    <option value="split-horizontal">Top-and-Bottom (Horizontal)</option>
                  </select>
                </div>

                <hr className="border-slate-800" />

                {/* Word Wrap Toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium">Word Wrapping:</span>
                  <input
                    type="checkbox"
                    checked={settings.wordWrap}
                    onChange={(e) => setSettings({ ...settings, wordWrap: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="relative w-9 h-5 bg-slate-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                </label>

                {/* Show Line Numbers Toggle */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium">Line Numbers:</span>
                  <input
                    type="checkbox"
                    checked={settings.showLineNumbers}
                    onChange={(e) => setSettings({ ...settings, showLineNumbers: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="relative w-9 h-5 bg-slate-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                </label>

                {/* Real-time live updating */}
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="font-medium">Auto Live Preview:</span>
                  <input
                    type="checkbox"
                    checked={settings.liveUpdate}
                    onChange={(e) => setSettings({ ...settings, liveUpdate: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="relative w-9 h-5 bg-slate-750 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-slate-400 after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600 peer-checked:after:bg-white"></div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
