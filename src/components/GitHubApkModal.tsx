import React, { useState } from 'react';
import { 
  Github, 
  Workflow, 
  Download, 
  Smartphone, 
  CheckCircle2, 
  Terminal, 
  ArrowRight, 
  ExternalLink, 
  FileCode, 
  Sparkles, 
  Copy, 
  Check, 
  X, 
  Layers, 
  Zap, 
  Play,
  FolderArchive
} from 'lucide-react';
import { Project } from '../types';

interface GitHubApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onGenerateAndroidConfigs: () => void;
  onExportZip: () => void;
}

export default function GitHubApkModal({
  isOpen,
  onClose,
  project,
  onGenerateAndroidConfigs,
  onExportZip
}: GitHubApkModalProps) {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'guide' | 'yaml' | 'download'>('guide');

  if (!isOpen) return null;

  const hasAndroidYml = project.files.some(f => f.name.includes('android-build.yml'));

  const gitCommands = [
    `git init`,
    `git add .`,
    `git commit -m "Add project with GitHub Action APK workflow"`,
    `git branch -M main`,
    `git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git`,
    `git push -u origin main`
  ].join('\n');

  const handleCopyCommands = (text: string, stepIndex: number) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-slate-900 border border-indigo-500/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950/80 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 shadow-inner">
              <Github className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                <span>GitHub Actions APK Builder</span>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                  Auto-Build Workflow
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Upload your project to GitHub and automatically build a native Android .APK file using YML Actions!
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex items-center gap-2 px-6 pt-3 bg-slate-950/40 border-b border-slate-800">
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'guide'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Play className="h-3.5 w-3.5" />
            <span>Step-by-Step Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('yaml')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'yaml'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Workflow className="h-3.5 w-3.5" />
            <span>Workflow YML File</span>
          </button>

          <button
            onClick={() => setActiveTab('download')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-bold border-b-2 transition cursor-pointer ${
              activeTab === 'download'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FolderArchive className="h-3.5 w-3.5" />
            <span>Download & Setup</span>
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 thin-scrollbar">

          {/* QUICK ACTION BANNER */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-300">
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>1-Click GitHub Actions Auto-Setup</span>
              </div>
              <p className="text-xs text-slate-300">
                Generate <code className="text-indigo-300 font-mono">android-build.yml</code>, <code className="text-indigo-300 font-mono">capacitor.config.json</code>, and <code className="text-indigo-300 font-mono">AndroidManifest.xml</code> directly in your workspace!
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  onGenerateAndroidConfigs();
                }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer ${
                  hasAndroidYml
                    ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {hasAndroidYml ? <CheckCircle2 className="h-4 w-4" /> : <Zap className="h-4 w-4" />}
                <span>{hasAndroidYml ? 'YML Already Injected' : 'Inject Android YML Action'}</span>
              </button>

              <button
                onClick={onExportZip}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
                title="Download Project ZIP"
              >
                <Download className="h-4 w-4" />
                <span>Export .ZIP</span>
              </button>
            </div>
          </div>

          {/* TAB 1: STEP-BY-STEP GUIDE */}
          {activeTab === 'guide' && (
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                <span>How to Upload & Build APK on GitHub Actions</span>
              </h3>

              <div className="grid grid-cols-1 gap-3">
                
                {/* STEP 1 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-400 flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px]">1</span>
                      <span>Inject Android YML Workflow & Download Code</span>
                    </span>
                    <button
                      onClick={onGenerateAndroidConfigs}
                      className="text-[10px] font-bold text-indigo-400 hover:underline"
                    >
                      Inject YML Files Now
                    </button>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-7">
                    Click <strong>"Inject Android YML Action"</strong> above, then click <strong>"Export .ZIP"</strong> to download your project code with <code className="text-indigo-300">.github/workflows/android-build.yml</code> already included.
                  </p>
                </div>

                {/* STEP 2 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-400 flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px]">2</span>
                      <span>Create New GitHub Repository</span>
                    </span>
                    <a
                      href="https://github.com/new"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:underline"
                    >
                      <span>Open github.com/new</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-7">
                    Open GitHub, create a new repository (Public or Private), and leave it empty (without initializing README).
                  </p>
                </div>

                {/* STEP 3 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-400 flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px]">3</span>
                      <span>Push Code to GitHub (Terminal or Upload)</span>
                    </span>
                    <button
                      onClick={() => handleCopyCommands(gitCommands, 3)}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-white"
                    >
                      {copiedStep === 3 ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedStep === 3 ? 'Copied' : 'Copy Git Commands'}</span>
                    </button>
                  </div>
                  <div className="pl-7 space-y-2">
                    <p className="text-xs text-slate-300">Unzip your project, open terminal inside the folder, and run:</p>
                    <pre className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono text-indigo-300 overflow-x-auto select-all">
                      {gitCommands}
                    </pre>
                  </div>
                </div>

                {/* STEP 4 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-indigo-400 flex items-center gap-2">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px]">4</span>
                      <span>GitHub Actions Auto-Builds Your APK!</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-7">
                    Once pushed, click on the <strong>"Actions"</strong> tab on your GitHub repository. You will see the <strong>"Build Android APK"</strong> workflow running automatically!
                  </p>
                </div>

                {/* STEP 5 */}
                <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-400 flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      <span>Download APK & Install on Phone</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed pl-7">
                    When the workflow finishes (~2 mins, green checkmark), click on the completed run, scroll down to <strong>Artifacts</strong>, and download your <strong><code className="text-emerald-300">android-debug-apk</code></strong>! Install it on your phone for real use!
                  </p>
                </div>

              </div>
            </div>
          )}

          {/* TAB 2: YML FILE PREVIEW */}
          {activeTab === 'yaml' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Workflow className="h-4 w-4 text-indigo-400" />
                  <span>.github/workflows/android-build.yml</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Triggers on push to main branch
                </span>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 thin-scrollbar">
{`name: Build Android APK (GitHub Actions)

on:
  push:
    branches: [ main, master ]
  workflow_dispatch:

jobs:
  build-android-apk:
    name: Build Android Debug APK
    runs-on: ubuntu-latest

    steps:
      - name: 1. Checkout Source Code
        uses: actions/checkout@v4

      - name: 2. Setup Node.js Environment (v20)
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: 3. Setup Java JDK 17 (Required for Gradle)
        uses: actions/setup-java@v4
        with:
          distribution: 'zulu'
          java-version: '17'

      - name: 4. Setup Android SDK Tools
        uses: android-actions/setup-android@v3

      - name: 5. Install Dependencies
        run: npm ci || npm install

      - name: 6. Build Web Production Assets (Vite)
        run: npm run build

      - name: 7. Initialize Capacitor (If not already initialized)
        run: |
          if [ ! -f "capacitor.config.json" ]; then
            npx cap init "eo Code Studio" "com.eocodestudio.editor" --web-dir=dist
          fi

      - name: 8. Add Android Platform
        run: |
          if [ ! -d "android" ]; then
            npx cap add android
          fi

      - name: 9. Inject Permissions into AndroidManifest
        run: |
          MANIFEST_PATH="android/app/src/main/AndroidManifest.xml"
          if [ -f "$MANIFEST_PATH" ]; then
            grep -q "READ_EXTERNAL_STORAGE" $MANIFEST_PATH || sed -i '/<application/i \\    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />' $MANIFEST_PATH
            grep -q "WRITE_EXTERNAL_STORAGE" $MANIFEST_PATH || sed -i '/<application/i \\    <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />' $MANIFEST_PATH
            grep -q "MANAGE_EXTERNAL_STORAGE" $MANIFEST_PATH || sed -i '/<application/i \\    <uses-permission android:name="android.permission.MANAGE_EXTERNAL_STORAGE" />' $MANIFEST_PATH
            grep -q "INTERNET" $MANIFEST_PATH || sed -i '/<application/i \\    <uses-permission android:name="android.permission.INTERNET" />' $MANIFEST_PATH
          fi

      - name: 10. Synchronize Web Assets to Android
        run: npx cap sync android

      - name: 11. Compile Android Debug APK with Gradle
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleDebug

      - name: 12. Upload Compiled APK Artifact
        uses: actions/upload-artifact@v4
        with:
          name: eo-code-studio-app-debug.apk
          path: android/app/build/outputs/apk/debug/app-debug.apk
          retention-days: 30`}
              </pre>
            </div>
          )}

          {/* TAB 3: DOWNLOAD & SETUP */}
          {activeTab === 'download' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-black text-white flex items-center gap-2">
                  <FolderArchive className="h-4 w-4 text-indigo-400" />
                  <span>Download Project Files with GitHub Actions Config</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  When you download your project as a .ZIP, all the Android build files and GitHub workflow configurations will be bundled cleanly.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={onGenerateAndroidConfigs}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Generate YML Files</span>
                  </button>

                  <button
                    onClick={onExportZip}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow cursor-pointer"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download Project (.ZIP)</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}
        <div className="flex items-center justify-between px-6 py-3 bg-slate-950 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
            <span>Ready for GitHub Actions compilation</span>
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
