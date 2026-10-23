import React from 'react';
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Download,
  HelpCircle,
  Inbox as InboxIcon,
  Layers,
  RotateCcw,
  Sparkles,
  UploadCloud,
} from 'lucide-react';

export type ActiveTab =
  | 'dashboard'
  | 'inbox'
  | 'detail'
  | 'brief'
  | 'replay'
  | 'exports'
  | 'definitions';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  recordCount: number;
  usableCount: number;
  selectedRef: string | null;
  onResetDatabase: () => void;
  onOpenDefinitions: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  recordCount,
  usableCount,
  selectedRef,
  onResetDatabase,
  onOpenDefinitions,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-500 p-0.5 shadow-lg shadow-sky-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
              <Sparkles className="h-5 w-5 text-sky-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white sm:text-lg">SpendNest</span>
              <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-sky-300">
                Revenue Intelligence
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Selected 21 Aug 2026 • Asia/Kolkata • {recordCount} Records ({usableCount} Usable)
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden items-center gap-1 md:flex">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-sky-500/15 text-sky-400 shadow-sm shadow-sky-500/10 border border-sky-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('inbox')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'inbox'
                ? 'bg-sky-500/15 text-sky-400 shadow-sm shadow-sky-500/10 border border-sky-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <InboxIcon className="h-4 w-4" />
            Inbox
            <span className="ml-1 rounded-full bg-slate-800 px-1.5 py-0.2 text-[10px] font-semibold text-slate-300">
              {recordCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('detail')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'detail'
                ? 'bg-sky-500/15 text-sky-400 shadow-sm shadow-sky-500/10 border border-sky-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" />
            Inspection {selectedRef ? `(${selectedRef})` : ''}
          </button>

          <button
            onClick={() => setActiveTab('brief')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'brief'
                ? 'bg-sky-500/15 text-sky-400 shadow-sm shadow-sky-500/10 border border-sky-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Manager Brief
            <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[9px] font-bold text-emerald-400">
              21 Aug
            </span>
          </button>

          <button
            onClick={() => setActiveTab('replay')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'replay'
                ? 'bg-sky-500/15 text-sky-400 shadow-sm shadow-sky-500/10 border border-sky-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <UploadCloud className="h-4 w-4" />
            Imports & Replay
          </button>

          <button
            onClick={() => setActiveTab('exports')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              activeTab === 'exports'
                ? 'bg-sky-500/15 text-sky-400 shadow-sm shadow-sky-500/10 border border-sky-500/30'
                : 'text-slate-300 hover:bg-slate-900 hover:text-white'
            }`}
          >
            <Download className="h-4 w-4" />
            Exports & Manifest
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenDefinitions}
            className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white"
            title="Methodology, Denominators & Definitions"
          >
            <HelpCircle className="h-3.5 w-3.5 text-sky-400" />
            <span className="hidden sm:inline">Definitions</span>
          </button>

          <button
            onClick={onResetDatabase}
            className="flex items-center gap-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2.5 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-500/20 hover:text-rose-200"
            title="Clean Start / Reset Local State"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Clean Start</span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Row */}
      <div className="flex items-center gap-1 overflow-x-auto border-t border-slate-800/80 px-4 py-2 md:hidden">
        {(['dashboard', 'inbox', 'detail', 'brief', 'replay', 'exports'] as ActiveTab[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium capitalize ${
                activeTab === tab
                  ? 'bg-sky-500 text-slate-950 font-bold'
                  : 'text-slate-300 hover:bg-slate-900'
              }`}
            >
              {tab === 'detail' ? `Inspection ${selectedRef ? `(${selectedRef})` : ''}` : tab}
            </button>
          )
        )}
      </div>
    </header>
  );
};
