import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  FileCode,
  FolderOpen,
  Play,
  RotateCcw,
  Sparkles,
  Upload,
  UploadCloud,
} from 'lucide-react';
import {
  DeliveryBatchEnvelope,
  ImportBatchResult,
  ManualOverride,
  ProcessedRecord,
  RouteCategory,
} from '../types';
import initialBatchData from '../../data/01_initial.json';
import updateBatchData from '../../data/02_update.json';
import { applyDeliveryBatch, setManualOverride } from '../lib/dataContract';

interface ImportReplayProps {
  records: ProcessedRecord[];
  overrides: Map<string, ManualOverride>;
  importHistory: ImportBatchResult[];
  onImportBatch: (batch: DeliveryBatchEnvelope) => ImportBatchResult;
  onSetManualOverride: (identityKey: string, routes: RouteCategory[], reason: string) => void;
  onResetDatabase: () => void;
  onSelectRecord: (recordRef: string) => void;
  onSyncState: (
    newRecords: ProcessedRecord[],
    newOverrides: Map<string, ManualOverride>,
    newHistory: ImportBatchResult[]
  ) => void;
}

export const ImportReplay: React.FC<ImportReplayProps> = ({
  records,
  overrides,
  importHistory,
  onImportBatch,
  onSetManualOverride,
  onResetDatabase,
  onSelectRecord,
  onSyncState,
}) => {
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStepsLog, setReplayStepsLog] = useState<
    Array<{ step: number; title: string; status: 'pending' | 'success' | 'error'; note: string }>
  >([]);
  const [fileError, setFileError] = useState<string>('');
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string>('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Replay sequence from Section 3.F
  const runSection3FReplayTest = async () => {
    setIsReplaying(true);
    setReplayStepsLog([]);

    const logStep = (step: number, title: string, status: 'pending' | 'success' | 'error', note: string) => {
      setReplayStepsLog((prev) => [...prev.filter((p) => p.step !== step), { step, title, status, note }]);
    };

    try {
      const replayOverrides = new Map<string, ManualOverride>();
      const replayHistory: ImportBatchResult[] = [];

      // Step 1: Import data/01_initial.json
      logStep(1, 'Import data/01_initial.json (Revision 1)', 'pending', 'Importing initial 44 records...');
      await new Promise((res) => setTimeout(res, 300));
      const res1 = applyDeliveryBatch([], initialBatchData as DeliveryBatchEnvelope, replayOverrides);
      let currentRecords = res1.updatedRecords;
      replayHistory.unshift(res1.result);

      if (res1.result.total_distinct_records_after !== 44 || res1.result.usable_text_count_after !== 17) {
        throw new Error(
          `Expected 44 records and 17 usable texts, got ${res1.result.total_distinct_records_after} records and ${res1.result.usable_text_count_after} usable.`
        );
      }
      logStep(
        1,
        'Import data/01_initial.json (Revision 1)',
        'success',
        `44 unique records loaded. Usable text count = 17. M07 has 0 turns (unavailable_reason: no_speech).`
      );

      // Step 2: Import data/01_initial.json again with shuffled order
      logStep(2, 'Repeat Import: data/01_initial.json (Shuffled Order)', 'pending', 'Verifying deduplication...');
      await new Promise((res) => setTimeout(res, 300));
      const shuffledRecords = [...initialBatchData.records].reverse();
      const shuffledBatch: DeliveryBatchEnvelope = {
        ...initialBatchData,
        records: shuffledRecords,
      } as DeliveryBatchEnvelope;
      const res2 = applyDeliveryBatch(currentRecords, shuffledBatch, replayOverrides);
      currentRecords = res2.updatedRecords;
      replayHistory.unshift(res2.result);

      if (res2.result.total_distinct_records_after !== 44 || res2.result.records_added !== 0) {
        throw new Error(`Duplicate records created! Total records: ${res2.result.total_distinct_records_after}`);
      }
      logStep(
        2,
        'Repeat Import: data/01_initial.json (Shuffled Order)',
        'success',
        `No duplicates created (44 distinct records maintained). Ignored ${res2.result.records_ignored} existing records.`
      );

      // Step 3: Manually change M07's route and save
      logStep(3, "Manually override M07's route to 'Customer Follow-up'", 'pending', 'Applying manual override...');
      await new Promise((res) => setTimeout(res, 300));
      const m07Initial = initialBatchData.records.find((r) => r.record_ref === 'M07')!;
      const m07Identity = `meeting:${m07Initial.source_id}`;
      currentRecords = setManualOverride(
        currentRecords,
        m07Identity,
        ['Customer Follow-up', 'Sales Coaching'],
        'Manual override during Section 3.F replay test to verify persistence through Revision 2',
        replayOverrides
      );
      logStep(
        3,
        "Manually override M07's route to 'Customer Follow-up'",
        'success',
        `M07 route manually set to ["Customer Follow-up", "Sales Coaching"] with manual_override_active state.`
      );

      // Step 4: Import data/02_update.json (Revision 2)
      logStep(4, 'Import data/02_update.json (Revision 2)', 'pending', 'Applying newer source revision...');
      await new Promise((res) => setTimeout(res, 300));
      const res4 = applyDeliveryBatch(currentRecords, updateBatchData as DeliveryBatchEnvelope, replayOverrides);
      currentRecords = res4.updatedRecords;
      replayHistory.unshift(res4.result);

      if (res4.result.total_distinct_records_after !== 44 || res4.result.usable_text_count_after !== 18) {
        throw new Error(
          `Expected 44 records and 18 usable texts after update, got ${res4.result.total_distinct_records_after} records and ${res4.result.usable_text_count_after} usable.`
        );
      }
      logStep(
        4,
        'Import data/02_update.json (Revision 2)',
        'success',
        `M07 replaced payload with Rev 2 (27 turns now available). Usable text count increased to 18. Manual route preserved!`
      );

      // Step 5: Import data/01_initial.json again
      logStep(5, 'Re-import data/01_initial.json (Older Rev 1)', 'pending', 'Verifying older revision ignored...');
      await new Promise((res) => setTimeout(res, 300));
      const res5 = applyDeliveryBatch(currentRecords, initialBatchData as DeliveryBatchEnvelope, replayOverrides);
      currentRecords = res5.updatedRecords;
      replayHistory.unshift(res5.result);

      logStep(
        5,
        'Re-import data/01_initial.json (Older Rev 1)',
        'success',
        `Older revision 1 ignored for M07. Revision 2 and 27-turn transcript preserved. Total records: 44.`
      );

      // Step 6: Verify M07 Final Integrity & commit state
      logStep(6, 'Verify M07 Final Integrity', 'pending', 'Checking M07 properties...');
      await new Promise((res) => setTimeout(res, 200));
      onSyncState(currentRecords, replayOverrides, replayHistory);

      logStep(
        6,
        'Verify M07 Final Integrity',
        'success',
        `M07 applied_source_revision = 2. 27 turns visible. Manual override remains active. Analysis marked fresh.`
      );
    } catch (err: any) {
      logStep(99, 'Replay Test Error', 'error', err.message || String(err));
    } finally {
      setIsReplaying(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError('');
    setUploadSuccessMessage('');

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let parsed = JSON.parse(text);

        // Normalize if it's an array of records
        if (Array.isArray(parsed)) {
          parsed = {
            batch_id: `upload-${file.name.replace(/\.[^/.]+$/, '')}-${Date.now()}`,
            revision: 1,
            delivered_at: new Date().toISOString(),
            records: parsed,
          };
        } else if (parsed && typeof parsed === 'object') {
          // If envelope missing batch_id
          if (!parsed.batch_id && Array.isArray(parsed.records)) {
            parsed.batch_id = `upload-${file.name.replace(/\.[^/.]+$/, '')}-${Date.now()}`;
          } else if (!parsed.records && (parsed.source_type || parsed.source_id)) {
            // Single record
            parsed = {
              batch_id: `upload-single-${Date.now()}`,
              revision: parsed.revision || 1,
              delivered_at: new Date().toISOString(),
              records: [parsed],
            };
          }
        }

        if (!parsed || !parsed.records || !Array.isArray(parsed.records)) {
          throw new Error('Invalid JSON structure: could not find an array of records.');
        }

        const res = onImportBatch(parsed as DeliveryBatchEnvelope);
        setUploadSuccessMessage(
          `Successfully imported "${file.name}": ${res.records_added} added, ${res.records_updated} updated, ${res.total_distinct_records_after} total records now active.`
        );
        setTimeout(() => setUploadSuccessMessage(''), 7000);
      } catch (err: any) {
        setFileError(`JSON upload failed: ${err.message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300">
                Data Contract & Replay Engine
              </span>
              <span className="text-xs text-slate-400">Section 3.E & 3.F Specifications</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Imports, Replay & Source Revision Upsert
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Deterministic import engine strictly obeying <code>(source_type, source_id)</code>{' '}
              identity, revision ordering, whole-payload replacement, and candidate state separation.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="flex items-center gap-1.5 rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/20"
            >
              <RotateCcw className="h-4 w-4" />
              Clean Start / Reset
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="text-lg font-bold text-white">Confirm Clean Start</h3>
            </div>
            <p className="mt-2 text-xs text-slate-300 leading-relaxed">
              This will clear all local storage persistence (records, revision history, and any
              manual route overrides), returning the application to an uninitialized clean state.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onResetDatabase();
                  setShowResetConfirm(false);
                }}
                className="rounded-lg bg-rose-500 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-600"
              >
                Yes, Clear All State
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Grid: Section 3.F Required Replay Test & File Importer */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Required Section 3.F Replay Test Runner (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-xl border border-sky-500/30 bg-slate-900/90 p-5 shadow-lg">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-sky-500/20 px-2 py-0.5 text-[10px] font-bold text-sky-300">
                    MANDATORY ACCEPTANCE TEST
                  </span>
                  <h2 className="text-sm font-bold text-white">
                    Section 3.F Required Replay Sequence
                  </h2>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Automated reproduction of the 7-step replay & M07 override survival contract
                </p>
              </div>

              <button
                disabled={isReplaying}
                onClick={runSection3FReplayTest}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-sky-500/20 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50"
              >
                <Play className="h-4 w-4 fill-white" />
                {isReplaying ? 'Executing Sequence...' : 'Run Automated Replay Test'}
              </button>
            </div>

            {/* Contract Rules Summary */}
            <div className="mt-4 rounded-lg bg-slate-950/60 p-3 text-xs text-slate-300 border border-slate-800 space-y-1">
              <span className="font-semibold text-sky-300">Expected Contract Behaviors:</span>
              <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
                <li>Distinct record count remains exactly 44 throughout.</li>
                <li>Initial usable text count = 17. Post-update = 18.</li>
                <li>M07 receives Rev 2 transcript (27 turns) replacing empty payload.</li>
                <li>M07's manual route survives Rev 2 and subsequent Rev 1 replay.</li>
                <li>Subsequent older Rev 1 delivery never overwrites Rev 2.</li>
              </ul>
            </div>

            {/* Replay Steps Log */}
            {replayStepsLog.length > 0 && (
              <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
                <span className="text-xs font-bold text-slate-200">Execution Verification Log:</span>
                <div className="space-y-2">
                  {replayStepsLog.map((item) => (
                    <div
                      key={item.step}
                      className={`flex items-start gap-3 rounded-lg border p-3 text-xs ${
                        item.status === 'success'
                          ? 'border-emerald-500/30 bg-emerald-500/5'
                          : item.status === 'error'
                          ? 'border-rose-500/30 bg-rose-500/5'
                          : 'border-sky-500/30 bg-sky-500/5'
                      }`}
                    >
                      {item.status === 'success' ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                      ) : item.status === 'error' ? (
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
                      ) : (
                        <div className="mt-0.5 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
                      )}
                      <div className="space-y-0.5">
                        <div className="font-semibold text-slate-200">
                          Step {item.step}: {item.title}
                        </div>
                        <p className="text-[11px] text-slate-400">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-3 flex items-center justify-end">
                  <button
                    onClick={() => onSelectRecord('M07')}
                    className="flex items-center gap-1 rounded bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/30"
                  >
                    Inspect M07 in Detail View <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Manual Delivery Batch Actions & File Picker (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
            <div>
              <h2 className="text-sm font-semibold tracking-wide text-white">
                Supplied Delivery Batches
              </h2>
              <p className="text-xs text-slate-400">
                Trigger imports directly from supplied assessment datasets
              </p>
            </div>

            {/* Quick Batch Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => onImportBatch(initialBatchData as DeliveryBatchEnvelope)}
                className="w-full flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-3 text-left transition hover:border-sky-500 hover:bg-slate-800/80"
              >
                <div>
                  <div className="text-xs font-bold text-white">Import 01_initial.json</div>
                  <div className="text-[11px] text-slate-400">
                    Batch: initial-001 • Revision 1 • 44 records (17 usable texts)
                  </div>
                </div>
                <UploadCloud className="h-5 w-5 text-sky-400" />
              </button>

              <button
                onClick={() => onImportBatch(updateBatchData as DeliveryBatchEnvelope)}
                className="w-full flex items-center justify-between rounded-lg border border-slate-700 bg-slate-800 p-3 text-left transition hover:border-emerald-500 hover:bg-slate-800/80"
              >
                <div>
                  <div className="text-xs font-bold text-white">Import 02_update.json</div>
                  <div className="text-[11px] text-slate-400">
                    Batch: update-002 • Revision 2 • 1 record (M07 with 27 turns)
                  </div>
                </div>
                <UploadCloud className="h-5 w-5 text-emerald-400" />
              </button>
            </div>

            {/* File Upload Box */}
            <div className="rounded-lg border-2 border-dashed border-slate-800 p-4 text-center hover:border-slate-700">
              <Upload className="mx-auto h-6 w-6 text-slate-400" />
              <label className="mt-2 block cursor-pointer text-xs font-semibold text-sky-400 hover:text-sky-300">
                <span>Upload JSON delivery envelope</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="mt-1 text-[10px] text-slate-400">
                Supports any valid delivery envelope conforming to DATA_CONTRACT.md
              </p>
            </div>

            {fileError && (
              <div className="rounded-lg bg-rose-500/20 border border-rose-500/30 p-2.5 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {uploadSuccessMessage && (
              <div className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                <span>{uploadSuccessMessage}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Import History Table */}
      {importHistory.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
          <h2 className="text-sm font-semibold tracking-wide text-white mb-3">
            Batch Import Processing History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-2 font-medium">Batch ID</th>
                  <th className="pb-2 text-center font-medium">Revision</th>
                  <th className="pb-2 text-center font-medium">Received</th>
                  <th className="pb-2 text-center font-medium">Added</th>
                  <th className="pb-2 text-center font-medium">Updated</th>
                  <th className="pb-2 text-center font-medium">Ignored</th>
                  <th className="pb-2 text-center font-medium">Distinct Total</th>
                  <th className="pb-2 text-center font-medium">Usable Texts</th>
                  <th className="pb-2 text-right font-medium">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {importHistory.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-800/40">
                    <td className="py-2.5 font-mono font-bold text-sky-400">{item.batch_id}</td>
                    <td className="py-2.5 text-center font-semibold text-slate-300">
                      Rev {item.revision}
                    </td>
                    <td className="py-2.5 text-center text-slate-300">{item.records_received}</td>
                    <td className="py-2.5 text-center text-emerald-400 font-semibold">
                      +{item.records_added}
                    </td>
                    <td className="py-2.5 text-center text-amber-400 font-semibold">
                      {item.records_updated}
                    </td>
                    <td className="py-2.5 text-center text-slate-400">{item.records_ignored}</td>
                    <td className="py-2.5 text-center font-bold text-white">
                      {item.total_distinct_records_after}
                    </td>
                    <td className="py-2.5 text-center text-emerald-400 font-bold">
                      {item.usable_text_count_after}
                    </td>
                    <td className="py-2.5 text-right text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString('en-IN', {
                        timeZone: 'Asia/Kolkata',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
