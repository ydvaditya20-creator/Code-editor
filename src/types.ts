export type EditorThemeId = 'slate' | 'cyberpunk' | 'monokai' | 'dracula' | 'solarized' | 'light' | 'midnight' | 'emerald' | 'crimson';
export type WorkspaceLayoutId = 'split-vertical' | 'split-horizontal' | 'fullscreen-editor' | 'fullscreen-preview';

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  theme: EditorThemeId;
  layout: WorkspaceLayoutId;
  wordWrap: boolean;
  liveUpdate: boolean;
  showLineNumbers: boolean;
}

export interface ProjectFile {
  id: string;
  name: string;
  type: string;
  content: string;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  files: ProjectFile[];
  folders?: string[];
  activeFileId: string;
}

export interface CodeFiles {
  html: string;
  css: string;
  js: string;
}

export interface CodeTemplate {
  id: string;
  name: string;
  description: string;
  html: string;
  css: string;
  js: string;
  category: 'Starter' | 'Interactive' | 'Games' | 'CSS Art';
}

export interface ConsoleLogMessage {
  type: 'log' | 'info' | 'warn' | 'error';
  args: string[];
  timestamp: string;
}

