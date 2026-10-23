import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Info,
  Layers,
  MessageSquare,
  PhoneCall,
  Quote,
  RotateCcw,
  Save,
  ShieldAlert,
  Sparkles,
  Tag,
  User,
  Video,
} from 'lucide-react';
import {
  ProcessedRecord,
  RouteCategory,
} from '../types';
import { formatKolkataTime } from '../lib/intelligenceEngine';

interface ConversationDetailProps {
  record: ProcessedRecord;
  allRecords: ProcessedRecord[];
  onSelectRecord: (recordRef: string) => void;
  onSaveManualOverride: (identityKey: string, routes: RouteCategory[], reason: string) => void;
  onResetManualOverride: (identityKey: string) => void;
}

const AVAILABLE_ROUTES: RouteCategory[] = [
  'Customer Follow-up',
  'Deal / Commercial Next Step',
  'Sales Coaching',
  'Partner / Vendor Coordination',
  'Nurture / No Immediate Action',
  'Manual Review',
];

export const ConversationDetail: React.FC<ConversationDetailProps> = ({
  record,
  allRecords,
  onSelectRecord,
  onSaveManualOverride,
  onResetManualOverride,
}) => {
  const [selectedRoutes, setSelectedRoutes] = useState<RouteCategory[]>(record.active_routes);
  const [overrideReason, setOverrideReason] = useState<string>(
    record.manual_override?.reason || ''
  );
  const [isEditingOverride, setIsEditingOverride] = useState<boolean>(false);
  const [saveToast, setSaveToast] = useState<string>('');

  // Synchronize state when record changes
  React.useEffect(() => {
    setSelectedRoutes(record.active_routes);
    setOverrideReason(record.manual_override?.reason || '');
    setIsEditingOverride(false);
  }, [record.identityKey, record.active_routes, record.manual_override]);

  const toggleRoute = (route: RouteCategory) => {
    if (selectedRoutes.includes(route)) {
      if (selectedRoutes.length > 1) {
        setSelectedRoutes(selectedRoutes.filter((r) => r !== route));
      }
    } else {
      setSelectedRoutes([...selectedRoutes, route]);
    }
  };

  const handleSave = () => {
    onSaveManualOverride(record.identityKey, selectedRoutes, overrideReason.trim() || 'Manager manual override');
    setIsEditingOverride(false);
    setSaveToast('Manual override saved successfully.');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const handleReset = () => {
    onResetManualOverride(record.identityKey);
    setSelectedRoutes(record.suggested_routes);
    setOverrideReason('');
    setIsEditingOverride(false);
    setSaveToast('Reset to automated suggestion.');
    setTimeout(() => setSaveToast(''), 3000);
  };

  const { display: kolkataDisplay, timeOnly } = formatKolkataTime(record.activityTimestamp);
  const isCall = record.source_type === 'call';
  const a = record.analysis;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xl font-extrabold text-sky-400">
                {record.record_ref}
              </span>
              <span
                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ${
                  isCall
                    ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                    : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                }`}
              >
                {isCall ? <PhoneCall className="h-3.5 w-3.5" /> : <Video className="h-3.5 w-3.5" />}
                <span className="capitalize">{record.source_type}</span>
              </span>

              <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-xs font-semibold text-slate-300">
                Rev {record.applied_source_revision}
              </span>

              {record.manual_override ? (
                <span className="rounded border border-amber-500/40 bg-amber-500/20 px-2 py-0.5 text-xs font-bold text-amber-300">
                  MANUAL OVERRIDE ACTIVE
                </span>
              ) : (
                <span className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                  Automated Route Active
                </span>
              )}

              {record.analysis_freshness === 'fresh' && (
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-emerald-400">
                  Analysis Fresh (Rev {a?.sourceRevisionAnalysed || record.applied_source_revision})
                </span>
              )}

              {record.analysis_freshness === 'pending_review' && (
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-xs font-semibold text-amber-300">
                  Pending Review
                </span>
              )}
            </div>

            <h1 className="text-xl font-bold text-white sm:text-2xl">
              {record.titleOrOutcome}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-sky-400" />
                {kolkataDisplay} (Asia/Kolkata)
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="h-3.5 w-3.5 text-sky-400" />
                {record.personLabel} ({record.personRole})
              </span>
              <span>•</span>
              <span className="font-mono text-slate-400">
                Identity: ({record.source_type}, {record.source_id.slice(0, 16)}...)
              </span>
            </div>
          </div>

          {/* Quick Record Switcher */}
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400">Switch Record:</label>
            <select
              value={record.record_ref}
              onChange={(e) => onSelectRecord(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none font-mono"
            >
              {allRecords.map((r) => (
                <option key={r.record_ref} value={r.record_ref}>
                  {r.record_ref} ({r.source_type}) - {r.hasUsableText ? '✓ Text' : 'No Text'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {saveToast && (
          <div className="mt-3 rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 text-xs font-medium text-emerald-300">
            {saveToast}
          </div>
        )}
      </div>

      {/* Main Grid: Left = Transcript & Evidence, Right = Intelligence & Route Editor */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Source Transcript / Evidence Viewer (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-white">
                  Source Transcript & Evidence
                </h2>
                <p className="text-xs text-slate-400">
                  {record.hasUsableText
                    ? isCall
                      ? 'Adapted Telephone Transcript'
                      : `Video Meeting Transcript (${record.transcript_payload?.turns.length || 0} Turns)`
                    : 'No Usable Speech Text Available'}
                </p>
              </div>

              <span
                className={`rounded px-2 py-0.5 text-xs font-semibold ${
                  record.hasUsableText
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {record.hasUsableText ? 'Usable Supplied Text' : 'Unusable / Missing Text'}
              </span>
            </div>

            {/* Content Display */}
            <div className="mt-4">
              {/* Case 1: Unusable / Missing text */}
              {!record.hasUsableText && (
                <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-5 text-xs text-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-amber-300">
                        Zero Usable Conversation Speech Supplied
                      </h3>
                      <p>
                        {isCall ? (
                          <>
                            This telephony call had duration of{' '}
                            <strong>{(record.payload as any).duration_seconds} seconds</strong> and
                            an observed outcome of{' '}
                            <strong>"{(record.payload as any).observed_outcome || 'unresponsive'}"</strong>.
                            Transcript field is null in the assessment delivery.
                          </>
                        ) : (
                          <>
                            This calendar meeting had recording status{' '}
                            <strong>"{(record.payload as any).recording_status}"</strong> and
                            unavailable reason{' '}
                            <strong>
                              "{record.transcript_payload?.unavailable_reason || 'no turns'}"
                            </strong>.
                          </>
                        )}
                      </p>
                      <p className="text-[11px] text-amber-200/80">
                        <strong>Data Contract Guarantee:</strong> In accordance with assignment
                        rules, zero substantive analysis, deal forecast, or attendee roles have been
                        inferred from absent text.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Case 2: Meeting with 1-based turns */}
              {record.hasUsableText && !isCall && record.transcript_payload?.turns && (
                <div className="max-h-[600px] space-y-3 overflow-y-auto pr-2">
                  {record.transcript_payload.turns.map((turn, index) => {
                    const turnNumber = index + 1; // 1-based turn number
                    const isTeamMember = turn.speaker.toLowerCase().includes('team member');
                    return (
                      <div
                        key={turnNumber}
                        id={`turn-${turnNumber}`}
                        className={`rounded-lg border p-3 text-xs transition ${
                          isTeamMember
                            ? 'border-indigo-500/20 bg-indigo-950/20'
                            : 'border-slate-800 bg-slate-950/40'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-slate-800 px-1.5 py-0.2 font-mono font-bold text-sky-400">
                              Turn {turnNumber}
                            </span>
                            <span className="font-semibold text-slate-200">
                              {turn.speaker}
                            </span>
                          </div>
                          <span className="font-mono text-slate-400">{turn.timecode}</span>
                        </div>
                        <p className="mt-2 text-slate-300 leading-relaxed">{turn.text}</p>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Case 3: Call with full transcript */}
              {record.hasUsableText && isCall && (record.payload as any).transcript && (
                <div className="max-h-[600px] overflow-y-auto rounded-lg border border-slate-800 bg-slate-950/60 p-4 text-xs leading-relaxed text-slate-200">
                  <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2 text-[11px] text-slate-400">
                    <span>
                      Rep: {(record.payload as any).rep_name} (
                      {(record.payload as any).rep_email})
                    </span>
                    <span>Duration: {(record.payload as any).duration_seconds}s</span>
                  </div>
                  <p className="whitespace-pre-line">
                    {(record.payload as any).transcript}
                  </p>
                </div>
              )}
            </div>

            {/* Supporting Citations Box */}
            {a && a.citations.length > 0 && (
              <div className="mt-4 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4 text-xs">
                <div className="flex items-center gap-2 text-sky-400 font-semibold">
                  <Quote className="h-4 w-4" />
                  <span>Key Supporting Evidence Citations</span>
                </div>
                <div className="mt-2 space-y-2">
                  {a.citations.map((c, i) => (
                    <div key={i} className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-sky-300 font-bold">
                        <span>{c.reference}</span>
                        {c.context && <span className="font-sans font-normal text-slate-400">({c.context})</span>}
                      </div>
                      <p className="mt-1 italic text-slate-200">"{c.quoteOrTurn}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Intelligence Analysis & Routing Controller (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          {/* Panel 1: Differentiated Intelligence Analysis */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-white">
                  Revenue Intelligence Analysis
                </h2>
                <p className="text-xs text-slate-400">
                  {a ? `Analysed from Source Rev ${a.sourceRevisionAnalysed}` : 'No Analysis Available'}
                </p>
              </div>

              {a && (
                <span className="rounded bg-sky-500/10 px-2 py-0.5 text-[11px] font-semibold text-sky-300">
                  Evidence-Derived
                </span>
              )}
            </div>

            {a ? (
              <div className="space-y-4 text-xs">
                {/* What Happened */}
                <div>
                  <h3 className="font-semibold text-sky-300 uppercase tracking-wider text-[11px]">
                    What Happened
                  </h3>
                  <p className="mt-1 text-slate-300 leading-relaxed">{a.whatHappened}</p>
                </div>

                {/* Why It Matters */}
                <div>
                  <h3 className="font-semibold text-amber-300 uppercase tracking-wider text-[11px]">
                    Why It Matters
                  </h3>
                  <p className="mt-1 text-slate-300 leading-relaxed">{a.whyItMatters}</p>
                </div>

                {/* Supported Next Steps & Owner */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-emerald-300 uppercase tracking-wider text-[11px]">
                      Supported Next Steps
                    </h3>
                    {a.owner && (
                      <span className="rounded bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-bold text-emerald-400">
                        Owner: {a.owner}
                      </span>
                    )}
                  </div>
                  <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                    {a.supportedNextSteps.map((step, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Uncertainties & Evidence Limitations */}
                <div>
                  <h3 className="font-semibold text-rose-300 uppercase tracking-wider text-[11px]">
                    Uncertainties & Missing Evidence
                  </h3>
                  <ul className="mt-1.5 space-y-1 text-slate-300 list-disc list-inside">
                    {a.uncertainties.map((u, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">
                Substantive analysis cannot be produced because this record contains no usable
                speech transcript.
              </p>
            )}
          </div>

          {/* Panel 2: Multi-Route & Manual Correction Controller */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-white">
                  Routing & Manual Decisions
                </h2>
                <p className="text-xs text-slate-400">
                  Manager multi-route override and review state control
                </p>
              </div>

              {record.manual_override ? (
                <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[11px] font-bold text-amber-300">
                  Manual Override
                </span>
              ) : (
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] text-slate-400">
                  Automated
                </span>
              )}
            </div>

            {/* Automated Suggestion Reference */}
            <div className="rounded-lg bg-slate-950/60 p-3 text-xs border border-slate-800 space-y-1">
              <span className="text-[10px] uppercase font-semibold text-slate-400">
                System Suggested Route(s):
              </span>
              <div className="flex flex-wrap gap-1">
                {record.suggested_routes.map((rt) => (
                  <span
                    key={rt}
                    className="rounded bg-slate-800 px-2 py-0.5 font-medium text-slate-300 text-[11px]"
                  >
                    {rt}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 italic">
                "{record.suggested_route_reason}"
              </p>
            </div>

            {/* Active Routes & Editor */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">
                Select Active Destinations (Multi-Route Supported):
              </label>

              <div className="grid grid-cols-1 gap-2">
                {AVAILABLE_ROUTES.map((route) => {
                  const isChecked = selectedRoutes.includes(route);
                  return (
                    <button
                      key={route}
                      type="button"
                      onClick={() => {
                        toggleRoute(route);
                        setIsEditingOverride(true);
                      }}
                      className={`flex items-center justify-between rounded-lg border p-2.5 text-xs font-medium transition ${
                        isChecked
                          ? 'border-sky-500/50 bg-sky-500/10 text-white'
                          : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span>{route}</span>
                      <span
                        className={`h-4 w-4 rounded border flex items-center justify-center text-[10px] ${
                          isChecked
                            ? 'border-sky-500 bg-sky-500 text-slate-950 font-bold'
                            : 'border-slate-700'
                        }`}
                      >
                        {isChecked ? '✓' : ''}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Override Reason Input */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">
                  Manager Rationale / Override Reason:
                </label>
                <textarea
                  rows={2}
                  value={overrideReason}
                  onChange={(e) => {
                    setOverrideReason(e.target.value);
                    setIsEditingOverride(true);
                  }}
                  placeholder="Explain why this route was selected or modified..."
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 p-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1.5 rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400 transition shadow-sm"
                >
                  <Save className="h-3.5 w-3.5" />
                  Save Route Override
                </button>

                {record.manual_override && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset to Automated
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
