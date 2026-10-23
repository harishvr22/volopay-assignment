import React, { useEffect, useState } from 'react';
import {
  applyDeliveryBatch,
  clearPersistedState,
  loadPersistedState,
  resetManualOverride,
  savePersistedState,
  setManualOverride,
} from './lib/dataContract';
import {
  DeliveryBatchEnvelope,
  ImportBatchResult,
  ManualOverride,
  ProcessedRecord,
  RouteCategory,
  SourceType,
} from './types';
import initialBatchData from '../data/01_initial.json';
import updateBatchData from '../data/02_update.json';
import { Navbar, ActiveTab } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Inbox } from './components/Inbox';
import { ConversationDetail } from './components/ConversationDetail';
import { ImportReplay } from './components/ImportReplay';
import { ManagerBriefView } from './components/ManagerBriefView';
import { ExportsView } from './components/ExportsView';
import { DefinitionsModal } from './components/DefinitionsModal';

import { MessageSquare } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [records, setRecords] = useState<ProcessedRecord[]>([]);
  const [overrides, setOverrides] = useState<Map<string, ManualOverride>>(new Map());
  const [importHistory, setImportHistory] = useState<ImportBatchResult[]>([]);
  const [selectedRef, setSelectedRef] = useState<string>('');
  const [isDefinitionsOpen, setIsDefinitionsOpen] = useState(false);
  const [inboxFilter, setInboxFilter] = useState<{
    sourceType?: SourceType | 'all';
    person?: string;
    route?: RouteCategory | 'all';
    usableText?: 'usable' | 'unusable' | 'all';
  }>({});

  // Initialize state on mount - start completely clean unless user already imported
  useEffect(() => {
    const persisted = loadPersistedState();

    if (persisted.records.length > 0) {
      setRecords(persisted.records);
      setOverrides(persisted.overrides);
      setImportHistory(persisted.history);
      const m07 = persisted.records.find((r) => r.record_ref === 'M07');
      setSelectedRef(m07 ? m07.record_ref : persisted.records[0].record_ref);
    } else {
      // Clean start: 0 predefined records until uploaded or imported
      setRecords([]);
      setOverrides(new Map());
      setImportHistory([]);
      setSelectedRef('');
    }
  }, []);

  // Sync state to persistence whenever updated
  const syncState = (
    newRecords: ProcessedRecord[],
    newOverrides: Map<string, ManualOverride>,
    newHistory: ImportBatchResult[]
  ) => {
    setRecords(newRecords);
    setOverrides(newOverrides);
    setImportHistory(newHistory);
    savePersistedState(newRecords, newOverrides, newHistory);
  };

  // Import handler
  const handleImportBatch = (batch: DeliveryBatchEnvelope): ImportBatchResult => {
    const { updatedRecords, result } = applyDeliveryBatch(records, batch, overrides);
    const newHistory = [result, ...importHistory];
    syncState(updatedRecords, overrides, newHistory);
    if (updatedRecords.length > 0) {
      const m07 = updatedRecords.find((r) => r.record_ref === 'M07');
      setSelectedRef(m07 ? m07.record_ref : updatedRecords[0].record_ref);
    }
    return result;
  };

  // Manual override handler
  const handleSaveManualOverride = (
    identityKey: string,
    routes: RouteCategory[],
    reason: string
  ) => {
    const updated = setManualOverride(records, identityKey, routes, reason, overrides);
    syncState(updated, overrides, importHistory);
  };

  // Reset override handler
  const handleResetManualOverride = (identityKey: string) => {
    const updated = resetManualOverride(records, identityKey, overrides);
    syncState(updated, overrides, importHistory);
  };

  // Clean start reset handler
  const handleResetDatabase = () => {
    clearPersistedState();
    setRecords([]);
    setOverrides(new Map());
    setImportHistory([]);
    setSelectedRef('');
    setActiveTab('replay');
  };

  // Navigation helpers
  const handleSelectRecord = (ref: string) => {
    setSelectedRef(ref);
    setActiveTab('detail');
  };

  const handleFilterInbox = (filter: {
    sourceType?: SourceType | 'all';
    person?: string;
    route?: RouteCategory | 'all';
    usableText?: 'usable' | 'unusable' | 'all';
  }) => {
    setInboxFilter(filter);
    setActiveTab('inbox');
  };

  const currentRecord = records.find((r) => r.record_ref === selectedRef) || records[0];
  const usableCount = records.filter((r) => r.hasUsableText).length;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 antialiased selection:bg-sky-500 selection:text-slate-950">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        recordCount={records.length}
        usableCount={usableCount}
        selectedRef={selectedRef}
        onResetDatabase={handleResetDatabase}
        onOpenDefinitions={() => setIsDefinitionsOpen(true)}
      />

      <main className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        {activeTab === 'dashboard' && (
          <Dashboard
            records={records}
            onSelectRecord={handleSelectRecord}
            onFilterInbox={handleFilterInbox}
            onOpenDefinitions={() => setIsDefinitionsOpen(true)}
            onImportBatch={handleImportBatch}
            onNavigateToReplay={() => setActiveTab('replay')}
          />
        )}

        {activeTab === 'inbox' && (
          <Inbox
            records={records}
            selectedRef={selectedRef}
            onSelectRecord={handleSelectRecord}
            initialFilter={inboxFilter}
            onNavigateToReplay={() => setActiveTab('replay')}
          />
        )}

        {activeTab === 'detail' && (
          currentRecord ? (
            <ConversationDetail
              record={currentRecord}
              allRecords={records}
              onSelectRecord={handleSelectRecord}
              onSaveManualOverride={handleSaveManualOverride}
              onResetManualOverride={handleResetManualOverride}
            />
          ) : (
            <div className="space-y-4 pb-12">
              <div className="rounded-2xl border-2 border-dashed border-sky-500/30 bg-slate-900/60 p-8 sm:p-12 text-center shadow-xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
                  <MessageSquare className="h-8 w-8" />
                </div>
                <h2 className="mt-4 text-xl font-bold text-white sm:text-2xl">
                  No Conversation Selected
                </h2>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
                  Zero conversation records are currently loaded in the workspace. Upload a JSON delivery batch or import data to inspect turns and evidence.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => setActiveTab('replay')}
                    className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-sky-500/20 hover:bg-sky-400 transition"
                  >
                    Go to Imports & Replay
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {activeTab === 'brief' && <ManagerBriefView onSelectRecord={handleSelectRecord} />}

        {activeTab === 'replay' && (
          <ImportReplay
            records={records}
            overrides={overrides}
            importHistory={importHistory}
            onImportBatch={handleImportBatch}
            onSetManualOverride={handleSaveManualOverride}
            onResetDatabase={handleResetDatabase}
            onSelectRecord={handleSelectRecord}
            onSyncState={syncState}
          />
        )}

        {activeTab === 'exports' && (
          <ExportsView
            records={records}
            onNavigateToReplay={() => setActiveTab('replay')}
          />
        )}
      </main>

      <DefinitionsModal
        isOpen={isDefinitionsOpen}
        onClose={() => setIsDefinitionsOpen(false)}
      />
    </div>
  );
}

export default App;
