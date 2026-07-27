import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import EditorArea from './components/EditorArea';
import PreviewPanel from './components/PreviewPanel';
import FileTree from './components/FileTree';
import FloatingScreen from './components/FloatingScreen';
import GitHubApkModal from './components/GitHubApkModal';
import { CODE_TEMPLATES } from './templates';
import { CODE_SNIPPETS } from './snippets';
import { 
  Project, 
  ProjectFile, 
  EditorSettings, 
  EditorThemeId, 
  WorkspaceLayoutId 
} from './types';
import { 
  Folder, 
  FileCode, 
  Sparkles, 
  Wand2, 
  Settings, 
  Play, 
  RotateCcw, 
  RefreshCcw,
  Download, 
  Copy, 
  Check, 
  Trash2, 
  Maximize2, 
  Minimize2, 
  ChevronDown, 
  ChevronRight, 
  Info, 
  X, 
  Files, 
  Code2, 
  Cpu, 
  Layers, 
  LayoutGrid,
  Menu,
  Sparkle,
  Plus,
  Trash,
  Globe,
  Terminal,
  ZoomIn,
  ZoomOut,
  Edit,
  Sliders,
  Tv,
  MoreVertical,
  FolderArchive,
  Lock,
  Github,
  Workflow
} from 'lucide-react';

const LOCAL_STORAGE_PROJECTS_KEY = 'ai_code_editor_projects_multi';
const LOCAL_STORAGE_ACTIVE_PROJECT_KEY = 'ai_code_editor_active_project_id';
const LOCAL_STORAGE_SETTINGS_KEY = 'ai_code_editor_settings_v2';

const DEFAULT_SETTINGS: EditorSettings = {
  fontSize: 14,
  tabSize: 2,
  theme: 'slate',
  layout: 'fullscreen-editor', // Default to Fullscreen Editor as requested
  wordWrap: false,
  liveUpdate: true,
  showLineNumbers: true
};

export default function App() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProjectId, setCurrentProjectId] = useState<string>('');
  const [settings, setSettings] = useState<EditorSettings>(DEFAULT_SETTINGS);
  const [previewScale, setPreviewScale] = useState(1.0);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [showLivePage, setShowLivePage] = useState(true); // Control overlay sliding panel state

  const [runCounter, setRunCounter] = useState(0);
  const [isLiveLoading, setIsLiveLoading] = useState(false);
  const [showWelcomeHint, setShowWelcomeHint] = useState(false);
  
  // Clean Workspace Sidebar State (Always default to showing File Explorer Drawer)
  const [activeSidebarTab, setActiveSidebarTab] = useState<'explorer' | 'templates' | 'snippets' | 'settings'>('explorer');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Snippet Category Filter
  const [activeSnippetCat, setActiveSnippetCat] = useState<'HTML Markup' | 'CSS Styling' | 'JS Actions'>('HTML Markup');

  // Modals / Overlay states for clutter-free design
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showSnippetsModal, setShowSnippetsModal] = useState(false);
  const [showActionsDropdown, setShowActionsDropdown] = useState(false);
  
  // Custom dialog state variables to replace iframe-blocked window.prompt and window.confirm
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [newFileType, setNewFileType] = useState<string>('js');

  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  const [showRenameFileModal, setShowRenameFileModal] = useState(false);
  const [renameFileId, setRenameFileId] = useState('');
  const [renameFileName, setRenameFileName] = useState('');

  const [showRenameProjectModal, setShowRenameProjectModal] = useState(false);
  const [renameProjectName, setRenameProjectName] = useState('');

  // Floating Screen state
  const [showFloatingScreen, setShowFloatingScreen] = useState(false);

  // GitHub APK Modal state
  const [showGitHubApkModal, setShowGitHubApkModal] = useState(false);

  // 4.8 CUSTOM CONFIRM MODAL STATE
  const [confirmModal, setConfirmModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
  } | null>(null);

  const triggerConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
    confirmText = "Delete",
    cancelText = "Cancel"
  ) => {
    setConfirmModal({
      show: true,
      title,
      message,
      confirmText,
      cancelText,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(null);
      }
    });
  };
  
  // Action Feedbacks
  const [copiedAll, setCopiedAll] = useState(false);
  const [explorerExpanded, setExplorerExpanded] = useState(true);

  // Initialize projects and settings on mount
  useEffect(() => {
    // 1. Parse Settings
    const savedSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(parsed);
      } catch (e) {
        console.error('Failed to parse saved settings', e);
      }
    }

    // 2. Parse Projects
    const savedProjects = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
    const savedActiveProjectId = localStorage.getItem(LOCAL_STORAGE_ACTIVE_PROJECT_KEY);

    if (savedProjects) {
      try {
        const parsedProjects: Project[] = JSON.parse(savedProjects);
        setProjects(parsedProjects);
        
        if (savedActiveProjectId && parsedProjects.find(p => p.id === savedActiveProjectId)) {
          setCurrentProjectId(savedActiveProjectId);
        } else if (parsedProjects.length > 0) {
          setCurrentProjectId(parsedProjects[0].id);
        }
      } catch (e) {
        console.error('Failed to parse saved projects', e);
        bootstrapDefaultProjects();
      }
    } else {
      // Migrate from old simple files if they existed
      const savedOldFiles = localStorage.getItem('ai_code_editor_files');
      if (savedOldFiles) {
        try {
          const oldFiles = JSON.parse(savedOldFiles);
          const migratedProject: Project = {
            id: 'migrated-default',
            name: 'My Migrated Project',
            createdAt: new Date().toISOString(),
            files: [
              { id: 'mig-html', name: 'index.html', type: 'html', content: oldFiles.html || '' },
              { id: 'mig-css', name: 'style.css', type: 'css', content: oldFiles.css || '' },
              { id: 'mig-js', name: 'main.js', type: 'js', content: oldFiles.js || '' }
            ],
            activeFileId: 'mig-html'
          };
          setProjects([migratedProject]);
          setCurrentProjectId('migrated-default');
        } catch (e) {
          bootstrapDefaultProjects();
        }
      } else {
        bootstrapDefaultProjects();
      }
    }
  }, []);

  // Save projects to LocalStorage on change
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(projects));
    }
  }, [projects]);

  // Save active project id to LocalStorage on change
  useEffect(() => {
    if (currentProjectId) {
      localStorage.setItem(LOCAL_STORAGE_ACTIVE_PROJECT_KEY, currentProjectId);
    }
  }, [currentProjectId]);

  // Save settings on change
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  // Generate multi-project default templates
  const bootstrapDefaultProjects = () => {
    const list: Project[] = [];
    
    // Seed projects from built-in templates
    CODE_TEMPLATES.forEach((tmpl) => {
      list.push({
        id: tmpl.id,
        name: tmpl.name,
        createdAt: new Date().toISOString(),
        files: [
          { id: `${tmpl.id}-html`, name: 'index.html', type: 'html', content: tmpl.html },
          { id: `${tmpl.id}-css`, name: 'style.css', type: 'css', content: tmpl.css },
          { id: `${tmpl.id}-js`, name: 'main.js', type: 'js', content: tmpl.js }
        ],
        activeFileId: `${tmpl.id}-html`
      });
    });

    setProjects(list);
    setCurrentProjectId(list[0].id);
  };

  // Find active structures
  const activeProject = projects.find((p) => p.id === currentProjectId);
  const activeFile = activeProject?.files.find((f) => f.id === activeProject.activeFileId) || activeProject?.files[0];

  // Auto-run preview in background if liveUpdate is enabled
  useEffect(() => {
    if (!settings.liveUpdate || !activeProject) return;

    setIsLiveLoading(true);
    const timeout = setTimeout(() => {
      setRunCounter((prev) => prev + 1);
      setIsLiveLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [projects, currentProjectId, settings.liveUpdate]);

  // Handle file editing
  const handleFileContentChange = (fileId: string, value: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id === currentProjectId) {
          return {
            ...p,
            files: p.files.map((f) => {
              if (f.id === fileId) {
                return { ...f, content: value };
              }
              return f;
            })
          };
        }
        return p;
      })
    );
  };

  const handleSelectFile = (fileId: string) => {
    setProjects((prevProjects) =>
      prevProjects.map((p) => {
        if (p.id === currentProjectId) {
          return { ...p, activeFileId: fileId };
        }
        return p;
      })
    );
  };

  // Multi-File & Folder actions
  const handleAddFileInActiveProject = (name: string, type?: string, folderPath?: string) => {
    if (!activeProject) return;
    
    let rawName = name.trim();
    if (!rawName) return;

    let fullPath = rawName;
    if (folderPath) {
      if (rawName.startsWith(folderPath + '/')) {
        fullPath = rawName;
      } else {
        fullPath = `${folderPath}/${rawName}`;
      }
    }
    fullPath = fullPath.replace(/\/+/g, '/').replace(/^\/+/g, '');

    let fileExt = type || 'js';
    if (fullPath.includes('.')) {
      const parts = fullPath.split('.');
      fileExt = parts[parts.length - 1].toLowerCase() || 'txt';
    } else {
      fullPath = `${fullPath}.${fileExt}`;
    }

    // Check duplication
    const exists = activeProject.files.some(f => f.name.toLowerCase() === fullPath.toLowerCase());
    if (exists) {
      alert(`File "${fullPath}" already exists inside this project.`);
      return;
    }

    // Extract directory parts to auto-add to project.folders
    const newFolders: string[] = [];
    if (fullPath.includes('/')) {
      const dirParts = fullPath.split('/');
      dirParts.pop(); // remove file name
      let acc = '';
      dirParts.forEach(p => {
        acc = acc ? `${acc}/${p}` : p;
        newFolders.push(acc);
      });
    }

    // Initial content template based on extension
    const baseFileName = fullPath.split('/').pop() || fullPath;
    let defaultContent = `// Custom file: ${baseFileName}`;
    if (['html', 'htm', 'xhtml', 'svg', 'xml'].includes(fileExt)) {
      defaultContent = `<!-- Custom file ${baseFileName} -->\n<div class="custom-card">\n  <h2>Hello from ${baseFileName}!</h2>\n</div>`;
    } else if (['css', 'scss', 'sass', 'less'].includes(fileExt)) {
      defaultContent = `/* Custom styles for ${baseFileName} */\n.custom-card {\n  padding: 20px;\n  border-radius: 8px;\n}`;
    } else if (['json', 'json5'].includes(fileExt)) {
      defaultContent = `{\n  "name": "${baseFileName}",\n  "status": "active"\n}`;
    } else if (['py', 'python'].includes(fileExt)) {
      defaultContent = `# Python script: ${baseFileName}\nprint("Hello from ${baseFileName}!")`;
    } else if (['md', 'markdown', 'txt'].includes(fileExt)) {
      defaultContent = `# ${baseFileName}\n\nWrite notes or docs here.`;
    }

    const newFile: ProjectFile = {
      id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name: fullPath,
      type: fileExt,
      content: defaultContent
    };

    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        const mergedFolders = Array.from(new Set([...(p.folders || []), ...newFolders]));
        return {
          ...p,
          files: [...p.files, newFile],
          folders: mergedFolders,
          activeFileId: newFile.id
        };
      }
      return p;
    }));
  };

  const handleAddFolder = (parentFolderPath?: string) => {
    if (!activeProject) return;

    let promptMsg = "Enter new folder name (e.g. components, styles, utils):";
    if (parentFolderPath) {
      promptMsg = `Enter new subfolder name inside "${parentFolderPath}":`;
    }

    const folderName = window.prompt(promptMsg);
    if (!folderName) return;

    const trimmed = folderName.trim().replace(/^\/+|\/+$/g, '');
    if (!trimmed) return;

    const fullFolderPath = parentFolderPath 
      ? `${parentFolderPath}/${trimmed}`
      : trimmed;

    const currentFolders = activeProject.folders || [];
    if (currentFolders.includes(fullFolderPath)) {
      alert(`Folder "${fullFolderPath}" already exists.`);
      return;
    }

    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        return {
          ...p,
          folders: [...(p.folders || []), fullFolderPath]
        };
      }
      return p;
    }));
  };

  const handleRenameFolder = (oldFolderPath: string) => {
    if (!activeProject) return;

    const newFolderPath = window.prompt(`Rename folder "${oldFolderPath}" to:`, oldFolderPath);
    if (!newFolderPath) return;

    const trimmedNew = newFolderPath.trim().replace(/^\/+|\/+$/g, '');
    if (!trimmedNew || trimmedNew === oldFolderPath) return;

    const updatedFiles = activeProject.files.map(file => {
      if (file.name === oldFolderPath || file.name.startsWith(oldFolderPath + '/')) {
        const relative = file.name.substring(oldFolderPath.length);
        return {
          ...file,
          name: `${trimmedNew}${relative}`
        };
      }
      return file;
    });

    const updatedFolders = (activeProject.folders || []).map(f => {
      if (f === oldFolderPath || f.startsWith(oldFolderPath + '/')) {
        const relative = f.substring(oldFolderPath.length);
        return `${trimmedNew}${relative}`;
      }
      return f;
    });

    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        return {
          ...p,
          files: updatedFiles,
          folders: updatedFolders
        };
      }
      return p;
    }));
  };

  const handleDeleteFolder = (folderPath: string) => {
    if (!activeProject) return;

    triggerConfirm(
      "Delete Folder",
      `Are you sure you want to delete folder "${folderPath}" and all files inside it?`,
      () => {
        const remainingFiles = activeProject.files.filter(f => 
          f.name !== folderPath && !f.name.startsWith(folderPath + '/')
        );

        const remainingFolders = (activeProject.folders || []).filter(f => 
          f !== folderPath && !f.startsWith(folderPath + '/')
        );

        let nextActiveId = activeProject.activeFileId;
        const wasActiveInFolder = activeProject.files.some(f => 
          f.id === activeProject.activeFileId && f.name.startsWith(folderPath + '/')
        );

        if (wasActiveInFolder) {
          nextActiveId = remainingFiles[0]?.id || '';
        }

        setProjects(prev => prev.map(p => {
          if (p.id === currentProjectId) {
            return {
              ...p,
              files: remainingFiles,
              folders: remainingFolders,
              activeFileId: nextActiveId
            };
          }
          return p;
        }));
      },
      "Delete Folder"
    );
  };

  const handleExportProjectZip = async () => {
    if (!activeProject) return;

    try {
      const zip = new JSZip();

      activeProject.files.forEach(file => {
        zip.file(file.name, file.content);
        if (file.name === 'android-build.yml' || file.name.endsWith('/android-build.yml')) {
          zip.file('.github/workflows/android-build.yml', file.content);
        }
      });

      if (activeProject.folders && Array.isArray(activeProject.folders)) {
        activeProject.folders.forEach(f => {
          zip.folder(f);
        });
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const safeName = activeProject.name.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
      a.download = `${safeName || 'project'}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("ZIP Generation Error:", err);
      alert("Error generating project ZIP package.");
    }
  };

  const handleRemoveFile = (fileId: string) => {
    if (!activeProject) return;
    const fileToDelete = activeProject.files.find(f => f.id === fileId);
    if (!fileToDelete) return;

    if (['index.html', 'style.css', 'main.js'].indexOf(fileToDelete.name) !== -1) {
      alert("Essential source files (index.html, style.css, main.js) cannot be deleted.");
      return;
    }

    triggerConfirm(
      "Delete File",
      `Are you sure you want to delete the file "${fileToDelete.name}"? This action cannot be undone.`,
      () => {
        // Switch active if we are deleting currently selected file
        const newFiles = activeProject.files.filter(f => f.id !== fileId);
        let nextActiveId = activeProject.activeFileId;
        if (activeProject.activeFileId === fileId) {
          nextActiveId = newFiles[0]?.id || '';
        }

        setProjects(prev => prev.map(p => {
          if (p.id === currentProjectId) {
            return {
              ...p,
              files: newFiles,
              activeFileId: nextActiveId
            };
          }
          return p;
        }));
      },
      "Delete File"
    );
  };

  const handleRenameFile = (fileId: string) => {
    if (!activeProject) return;
    const file = activeProject.files.find(f => f.id === fileId);
    if (!file) return;

    if (['index.html', 'style.css', 'main.js'].indexOf(file.name) !== -1) {
      alert("Essential source files cannot be renamed to protect workspace compilations.");
      return;
    }

    setRenameFileId(fileId);
    setRenameFileName(file.name);
    setShowRenameFileModal(true);
  };

  const submitRenameFile = () => {
    const name = renameFileName.trim();
    if (!name) {
      alert("Please enter a valid file name.");
      return;
    }

    let ext = 'txt';
    if (name.includes('.')) {
      const parts = name.split('.');
      ext = parts[parts.length - 1].toLowerCase() || 'txt';
    }

    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        return {
          ...p,
          files: p.files.map(f => {
            if (f.id === renameFileId) {
              return { ...f, name, type: ext };
            }
            return f;
          })
        };
      }
      return p;
    }));
    setShowRenameFileModal(false);
  };

  // Multi-Project actions
  const handleCreateProject = () => {
    setNewProjectName('');
    setShowNewProjectModal(true);
  };

  const submitCreateProject = () => {
    const name = newProjectName.trim();
    if (!name) {
      alert("Please enter a valid project name.");
      return;
    }

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name,
      createdAt: new Date().toISOString(),
      files: [
        { id: `html-${Date.now()}`, name: 'index.html', type: 'html', content: '<!-- Custom Sandbox -->\n<div class="hello-container">\n  <h1>My Brand New Project</h1>\n  <p>Start writing dynamic codes here!</p>\n</div>' },
        { id: `css-${Date.now()}`, name: 'style.css', type: 'css', content: '/* Custom Styles */\nbody {\n  background: #0f172a;\n  color: #f1f5f9;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  height: 100vh;\n  margin: 0;\n}\n.hello-container {\n  text-align: center;\n  padding: 30px;\n  background: #1e293b;\n  border-radius: 12px;\n  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);\n}' },
        { id: `js-${Date.now()}`, name: 'main.js', type: 'js', content: '// Write scripts here\nconsole.log("New Project sandboxed successfully!");' }
      ],
      activeFileId: `html-${Date.now()}`
    };

    setProjects(prev => [newProj, ...prev]);
    setCurrentProjectId(newProj.id);
    setShowNewProjectModal(false);
  };

  const handleSwitchProject = (projId: string) => {
    setCurrentProjectId(projId);
  };

  const handleDeleteProject = (projId: string) => {
    if (projects.length <= 1) {
      alert("You must keep at least one project inside your active workspace.");
      return;
    }

    const proj = projects.find(p => p.id === projId);
    if (!proj) return;

    triggerConfirm(
      "Delete Project",
      `Are you absolutely sure you want to delete the project "${proj.name}"? This action cannot be reverted and will delete all associated files.`,
      () => {
        const remaining = projects.filter(p => p.id !== projId);
        setProjects(remaining);
        setCurrentProjectId(remaining[0].id);
      },
      "Delete Project"
    );
  };

  const handleRenameProject = () => {
    if (!activeProject) return;
    setRenameProjectName(activeProject.name);
    setShowRenameProjectModal(true);
  };

  const submitRenameProject = () => {
    const name = renameProjectName.trim();
    if (!name) {
      alert("Please enter a valid project name.");
      return;
    }

    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        return { ...p, name };
      }
      return p;
    }));
    setShowRenameProjectModal(false);
  };

  const handleManualRun = () => {
    setRunCounter((prev) => prev + 1);
    setIsLiveLoading(true);
    setTimeout(() => {
      setIsLiveLoading(false);
      // Automatically slide preview open in Fullscreen Editor when running
      if (settings.layout === 'fullscreen-editor') {
        setShowLivePage(true);
      }
    }, 700);
  };

  const handleGenerateAndroidConfigs = () => {
    if (!activeProject) return;

    // Check if files already exist
    const hasYml = activeProject.files.some(f => f.name.includes('android-build.yml'));
    if (hasYml) {
      alert("Android APK GitHub actions configuration files already exist in this project!");
      return;
    }

    const ymlContent = `# .github/workflows/android-build.yml
# This workflow automates building a fully native Android APK from your code studio projects
# To use: Push your code to a GitHub repository, click Actions, and download your compiled app-debug.apk!

name: Build Android APK (Capacitor wrapper)

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: '18'

      - name: Setup Java JDK 17
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: Setup Android SDK
        uses: android-actions/setup-android@v3

      - name: Install Base Wrap Dependencies
        run: |
          npm init -y
          npm install @capacitor/core @capacitor/cli @capacitor/android
          # Create a dummy distribution directory to satisfy Capacitor
          mkdir -p dist
          # Build a clean bundle of index.html, style.css, and main.js
          cp index.html dist/index.html
          cp style.css dist/style.css || touch dist/style.css
          cp main.js dist/main.js || touch dist/main.js

      - name: Initialize Capacitor Configuration
        run: |
          npx cap init "${activeProject.name}" "com.codestudio.app" --web-dir=dist

      - name: Add Android Native Platform
        run: |
          npx cap add android

      - name: Inject Storage Read & Write Permissions into AndroidManifest
        run: |
          # Inject android read/write permissions into AndroidManifest.xml
          MANIFEST_PATH="android/app/src/main/AndroidManifest.xml"
          if [ -f "$MANIFEST_PATH" ]; then
            sed -i '/<application/i \\    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />\\n    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />\\n    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />' $MANIFEST_PATH
          fi

      - name: Synchronize Capacitor Project Assets
        run: |
          npx cap sync android

      - name: Build Debug Android APK with Gradle
        run: |
          cd android
          ./gradlew assembleDebug

      - name: Upload Compiled APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: android-debug-apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
`;

    const capacitorContent = `{
  "appId": "com.codestudio.app",
  "appName": "${activeProject.name}",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https"
  }
}`;

    const manifestContent = `<!-- Add this in your project's android/app/src/main/AndroidManifest.xml file -->
<!-- Placing these permissions guarantees full file read/write access to device folders & system files -->

<manifest xmlns:android="http://schemas.microsoft.com/apk/res/android"
    package="com.codestudio.app">

    <!-- Essential Read & Write Device File Permissions -->
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
    
    <!-- Required for Android 11+ (API 30+) to access arbitrary files / device folders -->
    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" android:minSdkVersion="30" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="${activeProject.name}"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/AppTheme">
        
        <!-- Add other activity configurations below -->
    </application>
</manifest>`;

    const storageHelperContent = `// device-storage-helper.js
// Use these lightweight methods to read and write files directly on your local device's folders.
// Works seamlessly in web browsers and inside Android Capacitor/WebView app containers!

/**
 * Prompt user to select and read a text file from their local device files/folders
 */
export async function readDeviceFile() {
  try {
    // 1. Try modern Web File System Access API
    if ('showOpenFilePicker' in window) {
      const [fileHandle] = await window.showOpenFilePicker();
      const file = await fileHandle.getFile();
      const contents = await file.text();
      return { name: file.name, content: contents, handle: fileHandle };
    }
  } catch (err) {
    console.warn("Modern File System Access API not available or user cancelled:", err);
  }

  // 2. Fallback to standard input file selector
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = (evt) => {
        resolve({ name: file.name, content: evt.target.result });
      };
      reader.readAsText(file);
    };
    input.click();
  });
}

/**
 * Write/Save a text file directly into the local device folder or download directory
 */
export async function writeDeviceFile(fileName, contentString) {
  try {
    // 1. Try modern Web File System Access API to write/save back directly
    if ('showSaveFilePicker' in window) {
      const handle = await window.showSaveFilePicker({
        suggestedName: fileName,
        types: [{
          description: 'Text Files',
          accept: { 'text/plain': ['.txt', '.html', '.css', '.js', '.json'] },
        }],
      });
      const writable = await handle.createWritable();
      await writable.write(contentString);
      await writable.close();
      return true;
    }
  } catch (err) {
    console.warn("Modern File System Access API not supported or user cancelled:", err);
  }

  // 2. Fallback: Generate an instant auto-download anchor link
  try {
    const blob = new Blob([contentString], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error("Local file download fallback failed:", err);
    return false;
  }
}
`;

    // Add these four files to the project
    const fileYml: ProjectFile = { id: `file-yml-${Date.now()}`, name: 'android-build.yml', type: 'js', content: ymlContent };
    const fileCap: ProjectFile = { id: `file-cap-${Date.now()}`, name: 'capacitor.config.json', type: 'js', content: capacitorContent };
    const fileManifest: ProjectFile = { id: `file-manifest-${Date.now()}`, name: 'AndroidManifest.xml', type: 'html', content: manifestContent };
    const fileStorage: ProjectFile = { id: `file-storage-${Date.now()}`, name: 'device-storage-helper.js', type: 'js', content: storageHelperContent };

    setProjects(prev => prev.map(p => {
      if (p.id === currentProjectId) {
        return {
          ...p,
          files: [...p.files, fileYml, fileCap, fileManifest, fileStorage],
          activeFileId: fileYml.id
        };
      }
      return p;
    }));

    alert("✨ Success! GitHub APK Build Action configs & Native storage permission files have been created in your project! Feel free to edit or view them.");
  };

  const handleResetCode = () => {
    if (!activeFile) return;
    triggerConfirm(
      "Reset Code",
      `Are you sure you want to reset the active file "${activeFile.name}" to a blank template? This will delete all code written inside this file.`,
      () => {
        handleFileContentChange(activeFile.id, '');
        setRunCounter((prev) => prev + 1);
      },
      "Reset File"
    );
  };

  // Format code for active file
  const handleFormatCode = () => {
    if (!activeFile) return;
    const space = ' '.repeat(settings.tabSize);

    const formatHTML = (code: string) => {
      let formatted = '';
      let indent = 0;
      const tokens = code
        .replace(/>\s*</g, '><')
        .replace(/</g, '\n<')
        .replace(/>/g, '>\n')
        .split('\n');

      for (let i = 0; i < tokens.length; i++) {
        const t = tokens[i].trim();
        if (!t) continue;

        if (t.startsWith('</')) {
          indent = Math.max(0, indent - 1);
        }

        formatted += space.repeat(indent) + t + '\n';

        if (t.startsWith('<') && !t.startsWith('</') && !t.endsWith('/>') && !t.startsWith('<!') && !t.includes('img') && !t.includes('input') && !t.includes('br') && !t.includes('hr')) {
          indent++;
        }
      }
      return formatted.trim();
    };

    const formatCSS = (code: string) => {
      return code
        .replace(/\s*([{\};:])\s*/g, '$1')
        .replace(/{/g, ' {\n' + space)
        .replace(/;/g, ';\n' + space)
        .replace(/}\s*/g, '\n}\n\n')
        .replace(new RegExp(space + '}', 'g'), '}')
        .trim();
    };

    const formatJS = (code: string) => {
      return code
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '')
        .join('\n');
    };

    let formatted = activeFile.content;
    if (activeFile.type === 'html') formatted = formatHTML(activeFile.content);
    else if (activeFile.type === 'css') formatted = formatCSS(activeFile.content);
    else if (activeFile.type === 'js') formatted = formatJS(activeFile.content);

    handleFileContentChange(activeFile.id, formatted);
  };

  // Compile full multi-file project into standalone exported HTML
  const handleExportHTML = () => {
    if (!activeProject) return;

    const htmlFiles = activeProject.files.filter(f => f.type === 'html');
    const entryHtmlFile = htmlFiles.find(f => f.name === 'index.html') || htmlFiles[0] || activeProject.files[0];
    let htmlContent = entryHtmlFile ? entryHtmlFile.content : '<h1>No HTML entry file found</h1>';

    const cssFiles = activeProject.files.filter(f => f.type === 'css');
    const combinedCSS = cssFiles.map(f => `/* --- CSS: ${f.name} --- */\n${f.content}`).join('\n\n');

    const jsFiles = [...activeProject.files.filter(f => f.type === 'js')];
    jsFiles.sort((a, b) => {
      if (a.name === 'main.js') return 1;
      if (b.name === 'main.js') return -1;
      return a.name.localeCompare(b.name);
    });
    const combinedJS = jsFiles.map(f => `/* --- Script: ${f.name} --- */\n${f.content}`).join('\n\n');

    const combinedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Standalone Export - ${activeProject.name}</title>
  <style>
    ${combinedCSS}
  </style>
</head>
<body>
  ${htmlContent}

  <script>
    ${combinedJS}
  </script>
</body>
</html>`;

    const blob = new Blob([combinedHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeProject.name.toLowerCase().replace(/\s+/g, '-')}-export.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyAll = () => {
    if (!activeProject) return;
    const combined = activeProject.files.map(f => `// ================== FILE: ${f.name} ==================\n${f.content}`).join('\n\n');
    navigator.clipboard.writeText(combined);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleInjectSnippet = (snippetCode: string) => {
    if (!activeFile) return;
    handleFileContentChange(activeFile.id, activeFile.content ? activeFile.content + '\n' + snippetCode : snippetCode);
  };

  const handleSidebarTabClick = (tab: 'explorer' | 'templates' | 'snippets' | 'settings') => {
    if (activeSidebarTab === tab) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setActiveSidebarTab(tab);
      setSidebarOpen(true);
    }
  };

  const handleCreateFilePrompt = (folderPath?: string) => {
    setNewFileName(folderPath ? `${folderPath}/` : '');
    setNewFileType('js');
    setShowNewFileModal(true);
  };

  const submitCreateFile = () => {
    let name = newFileName.trim();
    if (!name) {
      alert("Please enter a valid file name.");
      return;
    }
    
    let ext = 'js';
    if (name.includes('.')) {
      const parts = name.split('.');
      ext = parts[parts.length - 1].toLowerCase();
      if (!ext) {
        alert("Please provide a valid file extension after the dot (e.g. .json, .py, .txt)");
        return;
      }
    } else {
      ext = newFileType || 'js';
      name = `${name}.${ext}`;
    }

    handleAddFileInActiveProject(name, ext);
    setShowNewFileModal(false);
    setNewFileName('');
  };

  const getFileIconColors = (typeOrExt: string) => {
    const ext = typeOrExt.toLowerCase();
    if (['html', 'htm', 'xhtml', 'svg', 'xml'].includes(ext)) {
      return { text: 'text-orange-500', bg: 'bg-orange-500/10' };
    }
    if (['css', 'scss', 'sass', 'less'].includes(ext)) {
      return { text: 'text-sky-500', bg: 'bg-sky-500/10' };
    }
    if (['js', 'jsx', 'ts', 'tsx', 'mjs', 'cjs'].includes(ext)) {
      return { text: 'text-yellow-500', bg: 'bg-yellow-500/10' };
    }
    if (['json', 'json5', 'yaml', 'yml'].includes(ext)) {
      return { text: 'text-amber-400', bg: 'bg-amber-500/10' };
    }
    if (['py', 'python'].includes(ext)) {
      return { text: 'text-emerald-400', bg: 'bg-emerald-500/10' };
    }
    if (['md', 'txt', 'doc'].includes(ext)) {
      return { text: 'text-slate-400', bg: 'bg-slate-500/10' };
    }
    if (['sql', 'db'].includes(ext)) {
      return { text: 'text-pink-400', bg: 'bg-pink-500/10' };
    }
    if (['php', 'java', 'c', 'cpp', 'cs', 'go', 'rs', 'rb'].includes(ext)) {
      return { text: 'text-purple-400', bg: 'bg-purple-500/10' };
    }
    return { text: 'text-indigo-400', bg: 'bg-indigo-500/10' };
  };

  if (!activeProject || !activeFile) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-950 text-slate-100 flex-col gap-4 font-mono">
        <Sparkles className="h-10 w-10 text-indigo-400 animate-spin" />
        <span>Syncing workspace and initializing templates...</span>
      </div>
    );
  }

  return (
    <div id="app-root-container" className="flex flex-col h-screen w-screen bg-[#06080e] text-slate-100 overflow-hidden font-sans select-none">
      
      {/* 1. TOP Sleek HEADER (Mobile-optimized Code Studio) */}
      <header id="window-title-bar" className="h-14 bg-[#0a0d17] border-b border-slate-900 flex items-center justify-between px-4 shrink-0 relative select-none z-30">
        <div className="flex items-center gap-3">
          {/* Menu Hamburger Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 -ml-2 rounded-lg text-indigo-400 hover:text-white hover:bg-slate-900 transition cursor-pointer"
            title="Toggle Sidebar Workspace Files"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm font-black text-slate-100 tracking-wider flex items-center gap-1.5">
              <span>Studio</span>
              <span className="text-indigo-400 font-extrabold">{activeProject.name}</span>
            </h1>
          </div>
        </div>

        {/* Global Breadcrumb showing current file path */}
        <div className="hidden md:flex items-center justify-center bg-slate-950/60 border border-slate-900 rounded-full py-1 px-4.5 text-[11px] text-slate-400 gap-1.5 max-w-sm truncate">
          <Folder className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
          <span className="text-indigo-400 font-extrabold">{activeFile.name}</span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Floating Screen Toggle Button in Header */}
          <button
            onClick={() => setShowFloatingScreen(!showFloatingScreen)}
            title="Floating Screen Mode (Multi-tasking popup window & clipboard context scratchpad)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow cursor-pointer ${
              showFloatingScreen
                ? 'bg-indigo-600 text-white shadow-indigo-600/30 border border-indigo-400'
                : 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 hover:text-white'
            }`}
          >
            <Tv className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
            <span className="hidden sm:inline">Floating Screen</span>
          </button>

          {/* GitHub Actions APK Modal Button */}
          <button
            onClick={() => setShowGitHubApkModal(true)}
            title="GitHub Actions APK Builder (Auto-build Android .apk from GitHub YML)"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow cursor-pointer bg-slate-900 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-600 hover:text-white"
          >
            <Github className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">GitHub APK</span>
          </button>

          {/* Big Run/Play Button */}
          <button
            onClick={() => {
              if (showLivePage) {
                setShowLivePage(false);
              } else {
                handleManualRun();
                setShowLivePage(true);
              }
            }}
            title={showLivePage ? "Go back to Code Editor" : "Execute application in Live Preview panel"}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/15 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 font-bold text-xs transition shadow active:scale-95 cursor-pointer"
          >
            {showLivePage ? (
              <span className="font-extrabold tracking-wider text-indigo-400 group-hover:text-white">&lt;/&gt;</span>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>Run</span>
              </>
            )}
            {isLiveLoading && (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            )}
          </button>

          {/* Action Menu Trigger (Three Dot Vertical) */}
          <div className="relative">
            <button
              onClick={() => setShowActionsDropdown(!showActionsDropdown)}
              className={`p-2 rounded-lg transition cursor-pointer ${
                showActionsDropdown ? 'bg-slate-900 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
              title="More Actions"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            {/* Dropdown overlay */}
            {showActionsDropdown && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowActionsDropdown(false)} 
                />
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-slate-950 border border-slate-900 shadow-2xl p-2 z-50 animate-fade text-xs flex flex-col gap-0.5">
                  <div className="px-2.5 py-1.5 text-[10px] font-black uppercase text-slate-500 border-b border-slate-900 mb-1">
                    Workspace Actions
                  </div>

                  {showLivePage && (
                    <>
                      <button
                        onClick={() => {
                          setConsoleOpen(!consoleOpen);
                          setShowActionsDropdown(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition"
                      >
                        <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                        <span>{consoleOpen ? 'Hide Console Logs' : 'Show Console Logs'}</span>
                      </button>

                      {/* Compact Zoom Controls */}
                      <div className="flex items-center justify-between px-2.5 py-1.5 hover:bg-slate-900 rounded-lg text-slate-300">
                        <span className="font-bold select-none text-[11px] text-indigo-400 font-mono">
                          Zoom: {Math.round(previewScale * 100)}%
                        </span>
                        <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded px-1 py-0.5">
                          <button
                            onClick={() => setPreviewScale(p => Math.max(0.02, p - 0.1))}
                            className="p-1 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer text-slate-400"
                            title="Zoom Out"
                          >
                            <ZoomOut className="h-3 w-3" />
                          </button>
                          <button
                            onClick={() => setPreviewScale(1.0)}
                            className="text-[9px] px-1.5 py-0.5 hover:text-white hover:bg-slate-800 rounded transition font-bold font-mono text-indigo-400"
                            title="Reset to 100%"
                          >
                            100%
                          </button>
                          <button
                            onClick={() => setPreviewScale(p => Math.min(2.5, p + 0.1))}
                            className="p-1 hover:text-white hover:bg-slate-800 rounded transition cursor-pointer text-slate-400"
                            title="Zoom In"
                          >
                            <ZoomIn className="h-3 w-3" />
                          </button>
                        </div>
                      </div>

                      {/* Refresh Preview button */}
                      <button
                        onClick={() => {
                          setRunCounter(prev => prev + 1);
                          setShowActionsDropdown(false);
                        }}
                        className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition cursor-pointer"
                        title="Refresh Preview Framework"
                      >
                        <RefreshCcw className="h-3.5 w-3.5 text-sky-400" />
                        <span>Refresh Preview</span>
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => {
                      handleFormatCode();
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Format Active Code</span>
                  </button>

                  <button
                    onClick={() => {
                      handleExportHTML();
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Export Standalone HTML</span>
                  </button>

                  <button
                    onClick={() => {
                      handleExportProjectZip();
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition font-semibold"
                  >
                    <FolderArchive className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Download Project (.ZIP)</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowGitHubApkModal(true);
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-emerald-500/10 hover:text-emerald-400 text-slate-300 rounded-lg transition font-semibold"
                    title="Setup GitHub Action & guide for compiling APK"
                  >
                    <Github className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Setup GitHub APK Action</span>
                  </button>

                  <button
                    onClick={() => {
                      handleResetCode();
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-red-500/10 hover:text-red-400 text-slate-400 rounded-lg transition"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Reset Active File</span>
                  </button>

                  <div className="border-t border-slate-900 my-1" />
                  
                  <div className="px-2.5 py-1 text-[10px] font-black uppercase text-slate-500 mb-1">
                    Secondary Views
                  </div>

                  <button
                    onClick={() => {
                      setShowSettingsModal(true);
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition"
                  >
                    <Sliders className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Visual Customizer</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowTemplatesModal(true);
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition"
                  >
                    <LayoutGrid className="h-3.5 w-3.5 text-amber-400" />
                    <span>Load Starter Templates</span>
                  </button>

                  <button
                    onClick={() => {
                      setShowSnippetsModal(true);
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-pink-400" />
                    <span>Insert Code Snippets</span>
                  </button>

                  <div className="border-t border-slate-900 my-1" />

                  <button
                    onClick={() => {
                      setShowLivePage(!showLivePage);
                      setShowActionsDropdown(false);
                    }}
                    className="flex items-center gap-2 w-full text-left px-2.5 py-2 hover:bg-indigo-500/10 hover:text-indigo-400 text-slate-300 rounded-lg transition font-semibold"
                  >
                    <Tv className="h-3.5 w-3.5 text-sky-400" />
                    <span>{showLivePage ? 'Hide Live Preview' : 'Show Live Preview'}</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 2. MAIN SPLIT LAYOUT CONTAINER */}
      <div id="main-workspace-grid" className="flex-1 flex min-h-0 min-w-0 relative">

        {/* 2.2 COLLAPSIBLE SIDEBAR PANEL (240px wide) */}
        {sidebarOpen && (
          <aside id="workspace-sidebar" className="w-60 bg-[#0c0e16] border-r border-slate-900 flex flex-col min-h-0 shrink-0 select-none animate-fade z-20">
            
            {/* Sidebar header */}
            <div className="h-12 border-b border-slate-900 px-3.5 flex items-center justify-between bg-[#080a10]">
              <div className="flex items-center gap-1.5">
                <Folder className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-black tracking-wider text-slate-300 uppercase">
                  Workspace Files
                </span>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-slate-500 hover:text-slate-300 p-1 transition cursor-pointer"
                title="Collapse Sidebar"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Sidebar Contents */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 flex flex-col gap-4">
              
              {/* PROJECT MANAGER COMPONENT */}
              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-900 text-xs">
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Project Workspace</span>
                  <button
                    onClick={handleCreateProject}
                    className="p-1 px-1.5 rounded bg-indigo-600/25 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/20 font-bold text-[9px] flex items-center gap-0.5 cursor-pointer"
                    title="Create new isolated project"
                  >
                    <Plus className="h-2.5 w-2.5" />
                    <span>New</span>
                  </button>
                </div>

                <select
                  id="project-selector"
                  value={currentProjectId}
                  onChange={(e) => handleSwitchProject(e.target.value)}
                  className="w-full h-8 rounded-lg border border-slate-800 bg-slate-900 px-2 text-xs font-bold text-indigo-400 outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      📁 {proj.name}
                    </option>
                  ))}
                </select>

                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={handleRenameProject}
                    className="flex-1 text-[9px] py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold rounded transition cursor-pointer"
                  >
                    Rename
                  </button>
                  {projects.length > 1 && (
                    <button
                      onClick={() => handleDeleteProject(currentProjectId)}
                      className="text-[9px] py-1 px-2 bg-red-950/20 hover:bg-red-900/30 text-red-400 font-bold rounded border border-red-500/10 transition cursor-pointer"
                      title="Delete Project"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>

              {/* HIERARCHICAL FILE & FOLDER TREE (GitHub-style Nested Files/Folders) */}
              <div className="flex-1 flex flex-col min-h-0 overflow-y-auto no-scrollbar">
                <FileTree
                  project={activeProject}
                  activeFileId={activeFile.id}
                  onSelectFile={handleSelectFile}
                  onAddFile={(folderPath) => {
                    handleCreateFilePrompt(folderPath);
                  }}
                  onAddFolder={handleAddFolder}
                  onRenameFile={handleRenameFile}
                  onDeleteFile={handleRemoveFile}
                  onRenameFolder={handleRenameFolder}
                  onDeleteFolder={handleDeleteFolder}
                  onExportZip={handleExportProjectZip}
                />
              </div>

              {/* BOTTOM SHORTCUTS COMPACT SECTION */}
              <div className="border-t border-slate-900 pt-3.5 mt-auto flex flex-col gap-1.5 text-xs select-none">
                <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-1 px-1">
                  Tools & Resources
                </div>

                <button
                  onClick={() => setShowSnippetsModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-950/40 hover:bg-[#151224]/50 border border-slate-900 hover:border-pink-500/25 rounded-xl text-slate-300 hover:text-pink-400 transition cursor-pointer text-left font-semibold"
                >
                  <Wand2 className="h-4 w-4 text-pink-400 shrink-0" />
                  <span>Insert Code Snippets</span>
                </button>

                <button
                  onClick={() => setShowTemplatesModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-950/40 hover:bg-[#1e1a12]/50 border border-slate-900 hover:border-amber-500/25 rounded-xl text-slate-300 hover:text-amber-400 transition cursor-pointer text-left font-semibold"
                >
                  <LayoutGrid className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Starter Templates</span>
                </button>

                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-slate-950/40 hover:bg-[#121824]/50 border border-slate-900 hover:border-indigo-500/25 rounded-xl text-slate-300 hover:text-indigo-400 transition cursor-pointer text-left font-semibold"
                >
                  <Settings className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span>Visual Settings</span>
                </button>
              </div>

            </div>
          </aside>
        )}

        {/* 2.3 ACTIVE WORKSPACE AREA */}
        <div 
          id="workspace-split-layout" 
          className={`flex-1 flex min-h-0 overflow-hidden bg-[#0d0d12] relative ${
            settings.layout === 'split-vertical' ? 'flex-col lg:flex-row' : 'flex-col lg:flex-col'
          }`}
        >
          {/* Welcome guide hint alert banner */}
          {showWelcomeHint && (
            <div id="welcome-alert-banner" className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-slate-950/95 border border-indigo-500/30 rounded-xl px-5 py-3.5 text-slate-100 text-xs shadow-2xl flex items-center justify-between w-[92%] max-w-xl backdrop-blur-md animate-fade select-text">
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-indigo-400 shrink-0" />
                <div>
                  <strong className="text-indigo-300 font-bold">✨ Multi-Project IDE initialized!</strong>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed">
                    Choose and manage files & projects in the sidebar explorer. Touch-pinch (stretch) or use top sliders to zoom in/out code and live preview!
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowWelcomeHint(false)} 
                className="text-slate-500 hover:text-white font-extrabold ml-3 text-sm p-1 cursor-pointer"
                title="Dismiss info banner"
              >
                &times;
              </button>
            </div>
          )}

          {/* CODE EDITOR OR LIVE PREVIEW VIEWPORT (FULL WORKSPACE) */}
          {showLivePage ? (
            <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-slate-950">
              <PreviewPanel
                project={activeProject}
                runCounter={runCounter}
                previewScale={previewScale}
                setPreviewScale={setPreviewScale}
                consoleOpen={consoleOpen}
                setConsoleOpen={setConsoleOpen}
              />
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 min-w-0 bg-[#0e0e13]">
              <EditorArea
                project={activeProject}
                activeFile={activeFile}
                onFileContentChange={handleFileContentChange}
                onSelectFile={handleSelectFile}
                onAddFile={(name, type) => {
                  if (name) {
                    handleAddFileInActiveProject(name, type);
                  } else {
                    handleCreateFilePrompt();
                  }
                }}
                onDeleteFile={handleRemoveFile}
                onRenameFile={handleRenameFile}
                settings={settings}
                setSettings={setSettings}
                onRunCode={handleManualRun}
              />
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. MODALS AND OVERLAYS (Sleek overlay dialogs for distraction-free coding) */}
      {/* ========================================================= */}

      {/* 4.1 VISUAL SETTINGS CUSTOMIZER MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
          <div className="relative w-full max-w-md bg-[#0b0e14] border border-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade z-50">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-[#080a10]">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">Visual Customizer</h3>
              </div>
              <button 
                onClick={() => setShowSettingsModal(false)} 
                className="text-slate-500 hover:text-white p-1 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[70vh] overflow-y-auto no-scrollbar space-y-5 text-xs">
              {/* Theme Selector Swatches */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Theme Palette:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {(['slate', 'cyberpunk', 'monokai', 'dracula', 'solarized', 'light', 'midnight', 'emerald', 'crimson'] as EditorThemeId[]).map((tId) => {
                    const isActive = settings.theme === tId;
                    const getThemeColors = (id: EditorThemeId) => {
                      switch (id) {
                        case 'cyberpunk': return { bg: 'bg-[#ff007f]', text: 'text-[#00ffcc]', name: 'Cyberpunk' };
                        case 'monokai': return { bg: 'bg-[#272822]', text: 'text-[#f92672]', name: 'Monokai' };
                        case 'dracula': return { bg: 'bg-[#282a36]', text: 'text-[#bd93f9]', name: 'Dracula' };
                        case 'solarized': return { bg: 'bg-[#fdf6e3]', text: 'text-[#b58900]', name: 'Solarized' };
                        case 'light': return { bg: 'bg-white', text: 'text-slate-800', name: 'Light UI' };
                        case 'midnight': return { bg: 'bg-[#0a0a14]', text: 'text-[#818cf8]', name: 'Midnight' };
                        case 'emerald': return { bg: 'bg-[#061c15]', text: 'text-[#34d399]', name: 'Emerald' };
                        case 'crimson': return { bg: 'bg-[#1c050a]', text: 'text-[#f43f5e]', name: 'Crimson' };
                        case 'slate':
                        default: return { bg: 'bg-slate-900', text: 'text-indigo-400', name: 'Slate Gray' };
                      }
                    };
                    const info = getThemeColors(tId);
                    return (
                      <button
                        key={tId}
                        onClick={() => setSettings(prev => ({ ...prev, theme: tId }))}
                        className={`flex items-center gap-1.5 p-2 rounded-lg border-2 transition text-left cursor-pointer ${
                          isActive 
                            ? 'border-indigo-500 bg-indigo-500/10' 
                            : 'border-slate-900 bg-slate-950 hover:border-slate-800'
                        }`}
                      >
                        <span className={`h-2.5 w-2.5 rounded-full ${info.bg} border border-slate-800 block shrink-0`} />
                        <span className={`text-[10px] font-bold ${info.text} truncate`}>
                          {info.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Size Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Editor Font Size:</label>
                <div className="flex items-center justify-between bg-slate-950 border border-slate-900 rounded-lg p-2">
                  <button
                    onClick={() => setSettings({ ...settings, fontSize: Math.max(10, settings.fontSize - 1) })}
                    className="h-7 w-7 rounded bg-slate-900 hover:bg-slate-850 font-extrabold flex items-center justify-center text-slate-300 cursor-pointer transition"
                  >
                    -
                  </button>
                  <span className="font-mono text-xs text-indigo-400 font-extrabold">{settings.fontSize}px</span>
                  <button
                    onClick={() => setSettings({ ...settings, fontSize: Math.min(32, settings.fontSize + 1) })}
                    className="h-7 w-7 rounded bg-slate-900 hover:bg-slate-850 font-extrabold flex items-center justify-center text-slate-300 cursor-pointer transition"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Indentation Width */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Spacing Indent:</label>
                <select
                  value={settings.tabSize}
                  onChange={(e) => setSettings({ ...settings, tabSize: Number(e.target.value) })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-900 p-2.5 text-slate-200 font-bold outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value={2}>2 Spaces</option>
                  <option value={4}>4 Spaces</option>
                  <option value={8}>8 Spaces</option>
                </select>
              </div>

              {/* Screen Split Mode */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Layout Screen Split:</label>
                <select
                  value={settings.layout}
                  onChange={(e) => setSettings({ ...settings, layout: e.target.value as WorkspaceLayoutId })}
                  className="w-full rounded-lg bg-slate-950 border border-slate-900 p-2.5 text-slate-200 font-bold outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="fullscreen-editor">Fullscreen Editor (Maximum Code Writing View)</option>
                  <option value="split-vertical">Side-by-Side Split Window</option>
                  <option value="split-horizontal">Top-and-Bottom Split Window</option>
                </select>
              </div>

              <div className="border-t border-slate-900 pt-3.5 space-y-3">
                {/* Auto Live preview toggle */}
                <label className="flex items-center justify-between cursor-pointer group select-none">
                  <span className="text-slate-400 group-hover:text-slate-200 transition font-bold">Auto Live Compile</span>
                  <input
                    type="checkbox"
                    checked={settings.liveUpdate}
                    onChange={(e) => setSettings({ ...settings, liveUpdate: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-900 text-indigo-600 focus:ring-0 cursor-pointer h-4 w-4"
                  />
                </label>

                {/* Word wrap code toggle */}
                <label className="flex items-center justify-between cursor-pointer group select-none">
                  <span className="text-slate-400 group-hover:text-slate-200 transition font-bold">Word Wrap codes</span>
                  <input
                    type="checkbox"
                    checked={settings.wordWrap}
                    onChange={(e) => setSettings({ ...settings, wordWrap: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-900 text-indigo-600 focus:ring-0 cursor-pointer h-4 w-4"
                  />
                </label>

                {/* Show line numbers */}
                <label className="flex items-center justify-between cursor-pointer group select-none">
                  <span className="text-slate-400 group-hover:text-slate-200 transition font-bold">Show Line Numbers</span>
                  <input
                    type="checkbox"
                    checked={settings.showLineNumbers}
                    onChange={(e) => setSettings({ ...settings, showLineNumbers: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-900 text-indigo-600 focus:ring-0 cursor-pointer h-4 w-4"
                  />
                </label>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-slate-900 bg-[#080a10] flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Apply & Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.2 LOAD STARTER TEMPLATES MODAL */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowTemplatesModal(false)} />
          <div className="relative w-full max-w-lg bg-[#0b0e14] border border-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade z-50">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-[#080a10]">
              <div className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4 text-amber-400" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">Load Starter Templates</h3>
              </div>
              <button 
                onClick={() => setShowTemplatesModal(false)} 
                className="text-slate-500 hover:text-white p-1 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto no-scrollbar space-y-3">
              <div className="text-[11px] text-slate-400 mb-2 leading-relaxed">
                Initialize a brand new multi-file project workspace loaded with clean structure & scripts:
              </div>
              
              <div className="grid grid-cols-1 gap-2.5">
                {CODE_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => {
                      triggerConfirm(
                        "Load Template",
                        `Spin up a brand new workspace project for "${tmpl.name}"?`,
                        () => {
                          const newProj: Project = {
                            id: `tmpl-${tmpl.id}-${Date.now()}`,
                            name: tmpl.name,
                            createdAt: new Date().toISOString(),
                            files: [
                              { id: `html-${Date.now()}`, name: 'index.html', type: 'html', content: tmpl.html },
                              { id: `css-${Date.now()}`, name: 'style.css', type: 'css', content: tmpl.css },
                              { id: `js-${Date.now()}`, name: 'main.js', type: 'js', content: tmpl.js }
                            ],
                            activeFileId: `html-${Date.now()}`
                          };
                          setProjects(prev => [newProj, ...prev]);
                          setCurrentProjectId(newProj.id);
                          setShowTemplatesModal(false);
                          console.log(`Initialized new project template: ${tmpl.name}`);
                        },
                        "Load Template"
                      );
                    }}
                    className="text-left bg-slate-950 border border-slate-900 rounded-xl p-3 hover:border-indigo-500 hover:bg-indigo-500/5 transition group flex flex-col cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition truncate">
                        {tmpl.name}
                      </span>
                      <span className="text-[8px] bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded uppercase">
                        {tmpl.category}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal">
                      {tmpl.description}
                    </p>
                    <span className="mt-2 text-[10px] text-indigo-400 font-bold group-hover:underline">
                      + Create brand new workspace &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-slate-900 bg-[#080a10] flex justify-end">
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-300 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.3 INSERT CODE SNIPPETS MODAL */}
      {showSnippetsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowSnippetsModal(false)} />
          <div className="relative w-full max-w-md bg-[#0b0e14] border border-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade z-50">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-[#080a10]">
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-pink-400" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">Insert Code Snippets</h3>
              </div>
              <button 
                onClick={() => setShowSnippetsModal(false)} 
                className="text-slate-500 hover:text-white p-1 transition cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 max-h-[60vh] overflow-y-auto no-scrollbar space-y-4">
              {/* Snippet Category Filter Tabs */}
              <div className="grid grid-cols-3 text-[10px] font-black uppercase tracking-wider border border-slate-900 bg-slate-950 text-center rounded-lg overflow-hidden">
                {(['HTML Markup', 'CSS Styling', 'JS Actions'] as const).map((cat) => {
                  const isActive = activeSnippetCat === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setActiveSnippetCat(cat)}
                      className={`py-2 transition cursor-pointer text-xs ${
                        isActive 
                          ? 'bg-indigo-600 text-white font-black' 
                          : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {cat.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Snippets List */}
              <div className="space-y-2">
                {CODE_SNIPPETS.filter(s => s.category === activeSnippetCat).map((snippet) => (
                  <button
                    key={snippet.id}
                    onClick={() => {
                      handleInjectSnippet(snippet.code);
                      setShowSnippetsModal(false);
                      console.log(`Injected code snippet: ${snippet.name}`);
                    }}
                    className="w-full text-left bg-slate-950 border border-slate-900 rounded-xl p-3 hover:border-pink-500/40 hover:bg-pink-500/5 transition group flex flex-col cursor-pointer text-xs"
                  >
                    <div className="flex items-center justify-between gap-1 w-full">
                      <span className="text-xs font-bold text-slate-200 group-hover:text-pink-400 transition truncate">
                        {snippet.name}
                      </span>
                      {snippet.category === 'HTML Markup' && <Code2 className="h-3.5 w-3.5 text-orange-400 shrink-0" />}
                      {snippet.category === 'CSS Styling' && <Layers className="h-3.5 w-3.5 text-sky-400 shrink-0" />}
                      {snippet.category === 'JS Actions' && <Cpu className="h-3.5 w-3.5 text-yellow-400 shrink-0" />}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1 leading-normal line-clamp-2">
                      {snippet.description}
                    </p>
                    <div className="mt-2 text-[10px] font-bold text-pink-500">
                      + Insert Snippet at bottom of active code
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-4 border-t border-slate-900 bg-[#080a10] flex justify-end">
              <button
                onClick={() => setShowSnippetsModal(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-slate-300 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.4 CUSTOM NEW FILE MODAL */}
      {showNewFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowNewFileModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0b0e14] border border-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-[#080a10]">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">Create Custom File</h3>
              </div>
              <button onClick={() => setShowNewFileModal(false)} className="text-slate-500 hover:text-white transition cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">File Name & Extension</label>
                  <span className="text-[9px] text-emerald-400 font-bold">Dot (.) allows any custom extension</span>
                </div>
                <input
                  type="text"
                  placeholder="e.g. data.json, app.py, script.ts, notes.txt"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitCreateFile();
                  }}
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Quick Extension Preset</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['js', 'html', 'css', 'json', 'py', 'ts', 'txt', 'sql'] as const).map((type) => {
                    const isSelected = newFileName.endsWith(`.${type}`) || (newFileType === type && !newFileName.includes('.'));
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => {
                          setNewFileType(type);
                          if (newFileName) {
                            const base = newFileName.includes('.') 
                              ? newFileName.substring(0, newFileName.lastIndexOf('.')) 
                              : newFileName;
                            setNewFileName(`${base}.${type}`);
                          } else {
                            setNewFileName(`file.${type}`);
                          }
                        }}
                        className={`py-1.5 px-2 border rounded-lg font-mono text-[10px] uppercase font-extrabold transition cursor-pointer ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                            : 'border-slate-850 bg-slate-950 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        .{type}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-900 bg-[#080a10] flex justify-end gap-2">
              <button
                onClick={() => setShowNewFileModal(false)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitCreateFile}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Create File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.5 CUSTOM NEW PROJECT MODAL */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowNewProjectModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0b0e14] border border-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-[#080a10]">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">New Project</h3>
              </div>
              <button onClick={() => setShowNewProjectModal(false)} className="text-slate-500 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. Interactive Dashboard, My Website"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitCreateProject();
                  }}
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-900 bg-[#080a10] flex justify-end gap-2">
              <button
                onClick={() => setShowNewProjectModal(false)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitCreateProject}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.6 CUSTOM RENAME FILE MODAL */}
      {showRenameFileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowRenameFileModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0b0e14] border border-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-[#080a10]">
              <div className="flex items-center gap-2">
                <FileCode className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">Rename File</h3>
              </div>
              <button onClick={() => setShowRenameFileModal(false)} className="text-slate-500 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">File Name</label>
                <input
                  type="text"
                  placeholder="e.g. style.css"
                  value={renameFileName}
                  onChange={(e) => setRenameFileName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitRenameFile();
                  }}
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-900 bg-[#080a10] flex justify-end gap-2">
              <button
                onClick={() => setShowRenameFileModal(false)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitRenameFile}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.7 CUSTOM RENAME PROJECT MODAL */}
      {showRenameProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowRenameProjectModal(false)} />
          <div className="relative w-full max-w-sm bg-[#0b0e14] border border-slate-900 rounded-2xl shadow-2xl overflow-hidden animate-fade z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-[#080a10]">
              <div className="flex items-center gap-2">
                <Folder className="h-4 w-4 text-indigo-400" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">Rename Project</h3>
              </div>
              <button onClick={() => setShowRenameProjectModal(false)} className="text-slate-500 hover:text-white transition">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Project Name</label>
                <input
                  type="text"
                  placeholder="e.g. My Custom Project"
                  value={renameProjectName}
                  onChange={(e) => setRenameProjectName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitRenameProject();
                  }}
                  autoFocus
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-900 bg-[#080a10] flex justify-end gap-2">
              <button
                onClick={() => setShowRenameProjectModal(false)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={submitRenameProject}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4.8 CUSTOM CONFIRMATION MODAL */}
      {confirmModal && confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setConfirmModal(null)} />
          <div className="relative w-full max-w-sm bg-[#0b0e14] border border-red-500/20 rounded-2xl shadow-2xl overflow-hidden animate-fade z-50">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-900 bg-[#080a10]">
              <div className="flex items-center gap-2">
                <Trash className="h-4 w-4 text-red-500 animate-bounce" />
                <h3 className="text-sm font-black text-slate-200 uppercase tracking-wider">
                  {confirmModal.title}
                </h3>
              </div>
              <button onClick={() => setConfirmModal(null)} className="text-slate-500 hover:text-white transition cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5">
              <p className="text-xs text-slate-300 leading-relaxed font-semibold">
                {confirmModal.message}
              </p>
            </div>
            <div className="px-5 py-3.5 border-t border-slate-900 bg-[#080a10] flex justify-end gap-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-850 text-slate-400 font-bold rounded-lg text-xs transition cursor-pointer"
              >
                {confirmModal.cancelText || "Cancel"}
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg text-xs transition cursor-pointer"
              >
                {confirmModal.confirmText || "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING SCREEN WIDGET */}
      <FloatingScreen
        project={activeProject}
        activeFile={activeFile}
        onUpdateFileContent={handleFileContentChange}
        onAddFile={(name, type) => handleAddFileInActiveProject(name, type)}
        isOpen={showFloatingScreen}
        onClose={() => setShowFloatingScreen(false)}
        runCounter={runCounter}
      />

      {/* GITHUB ACTIONS APK BUILDER MODAL */}
      <GitHubApkModal
        isOpen={showGitHubApkModal}
        onClose={() => setShowGitHubApkModal(false)}
        project={activeProject}
        onGenerateAndroidConfigs={handleGenerateAndroidConfigs}
        onExportZip={handleExportProjectZip}
      />
    </div>
  );
}
