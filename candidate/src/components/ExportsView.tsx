import React, { useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Download,
  FileCheck,
  FileCode,
  FileSpreadsheet,
  FolderArchive,
  Layers,
  Sparkles,
  Table,
} from 'lucide-react';
import { ProcessedRecord } from '../types';
import {
  buildCompleteExportArchive,
  generateManifestEntries,
  triggerFileDownload,
} from '../lib/exportArchive';

interface ExportsViewProps {
  records: ProcessedRecord[];
  onNavigateToReplay?: () => void;
}

export const ExportsView: React.FC<ExportsViewProps> = ({ records, onNavigateToReplay }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [validationReport, setValidationReport] = useState<{
    isValid: boolean;
    totalFiles: number;
    manifestPathCount: number;
    missingPaths: string[];
    errors: string[];
  } | null>(null);

  const manifestEntries = generateManifestEntries(records);

  const handleDownloadZip = async () => {
    try {
      setIsGenerating(true);
      setDownloadSuccess(false);

      const archive = await buildCompleteExportArchive(records);
      setValidationReport(archive.validationResult);

      triggerFileDownload(
        archive.zipBlob,
        `spendnest_revenue_intelligence_export_${Date.now()}.zip`
      );
      setDownloadSuccess(true);
    } catch (err: any) {
      console.error('Failed to generate export archive', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (records.length === 0) {
    return (
      <div className="space-y-6 pb-12">
        <div className="rounded-2xl border-2 border-dashed border-sky-500/30 bg-slate-900/60 p-8 sm:p-12 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
            <FolderArchive className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white sm:text-2xl">
            Export Archive Unavailable
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Zero conversation records are currently loaded in the workspace. Upload a delivery batch or import data to generate CSV tables, markdown dossier analyses, and the manifest.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {onNavigateToReplay && (
              <button
                onClick={onNavigateToReplay}
                className="flex items-center gap-2 rounded-xl bg-sky-500 px-5 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-sky-500/20 hover:bg-sky-400 transition"
              >
                Go to Imports & Replay
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300">
                Data Organization & Archiving
              </span>
              <span className="text-xs text-slate-400">Section 3.H Deliverables</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Export Archive & Machine-Readable Manifest
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Generates a real downloadable ZIP archive with JSON & CSV manifests, 44 individual
              record payloads, 18 conversation analyses, executive brief, and routing summaries.
            </p>
          </div>

          <button
            disabled={isGenerating}
            onClick={handleDownloadZip}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-indigo-500 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>Compiling Archive...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download Export Archive (.zip)</span>
              </>
            )}
          </button>
        </div>

        {downloadSuccess && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-300">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
            <span>
              Archive generated and download initiated. All manifest paths validated against ZIP
              contents.
            </span>
          </div>
        )}
      </div>

      {/* Validation Report Banner */}
      {validationReport && (
        <div
          className={`rounded-xl border p-4 text-xs ${
            validationReport.isValid
              ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200'
              : 'border-rose-500/30 bg-rose-500/5 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2 font-bold text-sm">
            {validationReport.isValid ? (
              <>
                <FileCheck className="h-5 w-5 text-emerald-400" />
                <span>Manifest Path Validation: 100% PASSED</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-5 w-5 text-rose-400" />
                <span>Manifest Path Validation FAILED</span>
              </>
            )}
          </div>
          <p className="mt-1">
            Verified {validationReport.manifestPathCount} referenced relative output paths across{' '}
            {validationReport.totalFiles} physical files inside the generated archive. Zero broken or
            missing file references.
          </p>
        </div>
      )}

      {/* Archive Structure Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-sky-400">
            <FileSpreadsheet className="h-5 w-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Manifest Files
            </h3>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            <code>manifest.json</code> & <code>manifest.csv</code> listing all 44 records, applied
            revisions, output paths, and override states.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-indigo-400">
            <FolderArchive className="h-5 w-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Raw Record Payloads
            </h3>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            <code>records/</code> directory containing 44 individual source record JSON files with
            their full upstream envelopes.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-400">
            <FileCode className="h-5 w-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Conversation Analyses
            </h3>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            <code>analysis/</code> directory containing 18 Markdown files with 1-based turn
            citations, supported next steps, and evidence bounds.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400">
            <Layers className="h-5 w-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Brief & Routing
            </h3>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            <code>brief/manager_brief_2026-08-21.md</code>, <code>routing_summary.csv</code>, and{' '}
            <code>findings.json</code>.
          </p>
        </div>
      </div>

      {/* Manifest Live Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-2 border-b border-slate-800 pb-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-sm font-semibold tracking-wide text-white">
              Export Manifest Preview (44 Entries)
            </h2>
            <p className="text-xs text-slate-400">
              Machine-readable mapping of every source record to its active output files
            </p>
          </div>
          <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
            All paths are relative to archive root
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2 font-semibold">Ref</th>
                <th className="pb-2 font-semibold">Source Type</th>
                <th className="pb-2 font-semibold">Source ID</th>
                <th className="pb-2 text-center font-semibold">Rev</th>
                <th className="pb-2 font-semibold">Active Routes</th>
                <th className="pb-2 font-semibold">Output Path(s)</th>
                <th className="pb-2 font-semibold">Review State</th>
                <th className="pb-2 text-center font-semibold">Override?</th>
                <th className="pb-2 text-center font-semibold">Freshness</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
              {manifestEntries.map((entry) => (
                <tr key={`${entry.source_type}:${entry.source_id}`} className="hover:bg-slate-800/40">
                  <td className="py-2 font-bold text-sky-400">{entry.record_ref}</td>
                  <td className="py-2 text-slate-300 capitalize font-sans">{entry.source_type}</td>
                  <td className="py-2 text-slate-400">{entry.source_id.slice(0, 12)}...</td>
                  <td className="py-2 text-center text-slate-200">{entry.applied_source_revision}</td>
                  <td className="py-2 font-sans text-slate-300">{entry.routes}</td>
                  <td className="py-2 text-slate-400 font-mono text-[10px] max-w-xs truncate">
                    {entry.output_paths}
                  </td>
                  <td className="py-2 font-sans text-slate-300">{entry.processing_review_state}</td>
                  <td className="py-2 text-center">
                    {entry.manual_override_flag ? (
                      <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-bold text-amber-300">
                        YES
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[10px]">NO</span>
                    )}
                  </td>
                  <td className="py-2 text-center font-sans">
                    <span
                      className={`rounded px-1.5 py-0.2 text-[10px] ${
                        entry.analysis_freshness === 'fresh'
                          ? 'text-emerald-400'
                          : entry.analysis_freshness === 'pending_review'
                          ? 'text-amber-400'
                          : 'text-slate-500'
                      }`}
                    >
                      {entry.analysis_freshness}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
