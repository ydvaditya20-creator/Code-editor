import React, { useState } from 'react';
import { 
  Folder, 
  FolderOpen, 
  ChevronRight, 
  ChevronDown, 
  FileCode, 
  Plus, 
  FolderPlus, 
  FilePlus, 
  Edit, 
  Trash, 
  Download, 
  Archive
} from 'lucide-react';
import { Project, ProjectFile } from '../types';

export interface TreeNode {
  name: string;
  path: string;
  isFolder: boolean;
  file?: ProjectFile;
  children: TreeNode[];
}

export function buildTree(files: ProjectFile[], folders: string[] = []): TreeNode[] {
  const rootNodes: TreeNode[] = [];

  function findOrCreateFolder(parentChildren: TreeNode[], folderName: string, fullPath: string): TreeNode {
    let existing = parentChildren.find(n => n.isFolder && n.name === folderName);
    if (!existing) {
      existing = {
        name: folderName,
        path: fullPath,
        isFolder: true,
        children: []
      };
      parentChildren.push(existing);
    }
    return existing;
  }

  // 1. Process explicit folders
  folders.forEach(folderPath => {
    const parts = folderPath.split('/').filter(Boolean);
    let currentChildren = rootNodes;
    let currentPath = '';

    parts.forEach(part => {
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const folderNode = findOrCreateFolder(currentChildren, part, currentPath);
      currentChildren = folderNode.children;
    });
  });

  // 2. Process files
  files.forEach(file => {
    const parts = file.name.split('/').filter(Boolean);
    let currentChildren = rootNodes;
    let currentPath = '';

    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const folderNode = findOrCreateFolder(currentChildren, part, currentPath);
      currentChildren = folderNode.children;
    }

    const fileName = parts[parts.length - 1];
    if (!currentChildren.some(n => !n.isFolder && n.name === fileName)) {
      currentChildren.push({
        name: fileName,
        path: file.name,
        isFolder: false,
        file,
        children: []
      });
    }
  });

  function sortNodes(nodes: TreeNode[]): TreeNode[] {
    nodes.sort((a, b) => {
      if (a.isFolder && !b.isFolder) return -1;
      if (!a.isFolder && b.isFolder) return 1;
      return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    });
    nodes.forEach(n => {
      if (n.isFolder && n.children.length > 0) {
        sortNodes(n.children);
      }
    });
    return nodes;
  }

  return sortNodes(rootNodes);
}

export function getFileIconColors(typeOrExt: string) {
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
}

interface FileTreeProps {
  project: Project;
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  onAddFile: (folderPath?: string) => void;
  onAddFolder: (parentFolderPath?: string) => void;
  onRenameFile: (fileId: string) => void;
  onDeleteFile: (fileId: string) => void;
  onRenameFolder: (folderPath: string) => void;
  onDeleteFolder: (folderPath: string) => void;
  onExportZip?: () => void;
}

export default function FileTree({
  project,
  activeFileId,
  onSelectFile,
  onAddFile,
  onAddFolder,
  onRenameFile,
  onDeleteFile,
  onRenameFolder,
  onDeleteFolder,
  onExportZip
}: FileTreeProps) {
  // Store expanded folder paths
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set(['src', 'src/components', 'src/js', 'src/css'])
  );

  const treeNodes = buildTree(project.files, project.folders || []);

  const toggleFolder = (folderPath: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(folderPath)) {
        next.delete(folderPath);
      } else {
        next.add(folderPath);
      }
      return next;
    });
  };

  const renderTree = (nodes: TreeNode[], depth: number = 0) => {
    return nodes.map(node => {
      if (node.isFolder) {
        const isExpanded = expandedFolders.has(node.path);
        return (
          <div key={node.path} className="select-none">
            {/* Folder Header Row */}
            <div
              onClick={() => toggleFolder(node.path)}
              style={{ paddingLeft: `${depth * 12 + 6}px` }}
              className="group flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-900/60 transition cursor-pointer text-xs font-bold text-slate-300 hover:text-white"
            >
              <div className="flex items-center gap-1.5 truncate pr-2">
                <span className="text-slate-500">
                  {isExpanded ? (
                    <ChevronDown className="h-3.5 w-3.5" />
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5" />
                  )}
                </span>
                <span className="text-amber-400">
                  {isExpanded ? (
                    <FolderOpen className="h-3.5 w-3.5 fill-amber-400/20" />
                  ) : (
                    <Folder className="h-3.5 w-3.5 fill-amber-400/20" />
                  )}
                </span>
                <span className="truncate">{node.name}</span>
              </div>

              {/* Folder Hover Actions */}
              <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddFile(node.path);
                  }}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded transition cursor-pointer"
                  title={`Add file inside ${node.path}`}
                >
                  <FilePlus className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAddFolder(node.path);
                  }}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-amber-400 rounded transition cursor-pointer"
                  title={`Add subfolder inside ${node.path}`}
                >
                  <FolderPlus className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRenameFolder(node.path);
                  }}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-indigo-400 rounded transition cursor-pointer"
                  title="Rename folder"
                >
                  <Edit className="h-3 w-3" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteFolder(node.path);
                  }}
                  className="p-1 hover:bg-slate-800 text-slate-400 hover:text-red-400 rounded transition cursor-pointer"
                  title="Delete folder and contents"
                >
                  <Trash className="h-3 w-3" />
                </button>
              </div>
            </div>

            {/* Folder Children */}
            {isExpanded && node.children.length > 0 && (
              <div className="border-l border-slate-900/80 ml-2">
                {renderTree(node.children, depth + 1)}
              </div>
            )}

            {isExpanded && node.children.length === 0 && (
              <div 
                style={{ paddingLeft: `${(depth + 1) * 12 + 20}px` }}
                className="py-1 text-[10px] text-slate-600 italic select-none"
              >
                (empty folder)
              </div>
            )}
          </div>
        );
      }

      // File Row
      const file = node.file!;
      const isFileActive = activeFileId === file.id;
      const colors = getFileIconColors(file.type);
      const isProtected = ['index.html', 'style.css', 'main.js'].includes(file.name);

      return (
        <div
          key={file.id}
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
          className={`group flex items-center justify-between w-full text-xs py-1.5 px-2 rounded-lg transition select-none ${
            isFileActive
              ? 'bg-indigo-500/15 text-indigo-400 font-extrabold border-l-2 border-indigo-500 shadow-sm'
              : 'text-slate-300 hover:bg-slate-900/40 hover:text-white'
          }`}
        >
          <button
            onClick={() => onSelectFile(file.id)}
            className="flex-1 text-left flex items-center gap-1.5 truncate pr-2 cursor-pointer"
          >
            <span className={`text-[9px] font-black tracking-wide ${colors.text} ${colors.bg} rounded px-1 shrink-0`}>
              {file.type.toUpperCase()}
            </span>
            <span className="truncate">{node.name}</span>
          </button>

          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[9px] text-slate-600 font-mono group-hover:hidden">
              {(new Blob([file.content]).size / 1024).toFixed(1)}K
            </span>

            {/* File Actions */}
            <div className="hidden group-hover:flex items-center gap-1">
              <button
                onClick={() => onRenameFile(file.id)}
                className="text-slate-500 hover:text-indigo-400 p-0.5 transition cursor-pointer"
                title="Rename file"
              >
                <Edit className="h-3 w-3" />
              </button>
              {!isProtected && (
                <button
                  onClick={() => onDeleteFile(file.id)}
                  className="text-slate-500 hover:text-red-400 p-0.5 transition cursor-pointer"
                  title="Delete file"
                >
                  <Trash className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 text-xs">
      {/* File Explorer Header Toolbar */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-900">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <Folder className="h-3.5 w-3.5 text-indigo-400" />
          <span>Files & Folders</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddFile()}
            className="p-1 hover:bg-slate-900 text-slate-400 hover:text-indigo-400 rounded transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
            title="New File"
          >
            <FilePlus className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">File</span>
          </button>

          <button
            onClick={() => onAddFolder()}
            className="p-1 hover:bg-slate-900 text-slate-400 hover:text-amber-400 rounded transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
            title="New Folder"
          >
            <FolderPlus className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Folder</span>
          </button>

          <button
            onClick={onExportZip}
            className="p-1 hover:bg-emerald-500/10 text-slate-400 hover:text-emerald-400 rounded transition cursor-pointer flex items-center gap-1 text-[10px] font-bold"
            title="Download Project ZIP"
          >
            <Archive className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">ZIP</span>
          </button>
        </div>
      </div>

      {/* File & Folder Tree */}
      <div className="flex-1 overflow-y-auto thin-scrollbar space-y-0.5 pr-1 max-h-[300px]">
        {treeNodes.length > 0 ? (
          renderTree(treeNodes)
        ) : (
          <div className="text-slate-600 text-[11px] p-2 italic">
            No files in project. Click "+ File" above to add one.
          </div>
        )}
      </div>
    </div>
  );
}
