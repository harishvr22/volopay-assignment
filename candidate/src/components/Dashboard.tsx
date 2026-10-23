import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  MessageSquare,
  PhoneCall,
  ShieldAlert,
  Sparkles,
  Upload,
  UploadCloud,
  User,
  Users,
  Video,
} from 'lucide-react';
import { DeliveryBatchEnvelope, ProcessedRecord, RouteCategory, SourceType } from '../types';
import initialBatchData from '../../data/01_initial.json';
import updateBatchData from '../../data/02_update.json';

interface DashboardProps {
  records: ProcessedRecord[];
  onSelectRecord: (recordRef: string) => void;
  onFilterInbox: (filter: { sourceType?: SourceType | 'all'; person?: string; route?: RouteCategory | 'all'; usableText?: 'usable' | 'unusable' | 'all' }) => void;
  onOpenDefinitions: () => void;
  onImportBatch?: (batch: DeliveryBatchEnvelope) => void;
  onNavigateToReplay?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  records,
  onSelectRecord,
  onFilterInbox,
  onOpenDefinitions,
  onImportBatch,
  onNavigateToReplay,
}) => {
  const [selectedPerson, setSelectedPerson] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<SourceType | 'all'>('all');

  // Filtered slice for person & source-type filters
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      if (selectedType !== 'all' && r.source_type !== selectedType) return false;
      if (selectedPerson !== 'all' && r.personLabel !== selectedPerson) return false;
      return true;
    });
  }, [records, selectedType, selectedPerson]);

  // Global counts & denominators
  const totalDistinct = records.length;
  const callsCount = records.filter((r) => r.source_type === 'call').length;
  const meetingsCount = records.filter((r) => r.source_type === 'meeting').length;

  const usableCount = records.filter((r) => r.hasUsableText).length;
  const unusableCount = records.filter((r) => !r.hasUsableText).length;
  const usableRate = totalDistinct > 0 ? ((usableCount / totalDistinct) * 100).toFixed(1) : '0';

  // Calls connection metric
  const callsWithConnectedFlag = records.filter(
    (r) => r.source_type === 'call' && (r.payload as any).is_connected !== null && (r.payload as any).is_connected !== undefined
  );
  const connectedCalls = callsWithConnectedFlag.filter((r) => (r.payload as any).is_connected === true);
  const connectionRate =
    callsWithConnectedFlag.length > 0
      ? ((connectedCalls.length / callsWithConnectedFlag.length) * 100).toFixed(1)
      : '0';

  // Manual overrides count
  const manualOverridesCount = records.filter((r) => !!r.manual_override).length;

  // Distinct persons
  const callReps = useMemo(() => {
    const reps = new Set<string>();
    records.filter((r) => r.source_type === 'call').forEach((r) => reps.add(r.personLabel));
    return Array.from(reps).sort();
  }, [records]);

  const meetingOrganizers = useMemo(() => {
    const orgs = new Set<string>();
    records.filter((r) => r.source_type === 'meeting').forEach((r) => orgs.add(r.personLabel));
    return Array.from(orgs).sort();
  }, [records]);

  const allPersons = useMemo(() => {
    const list = new Set<string>();
    records.forEach((r) => list.add(r.personLabel));
    return Array.from(list).sort();
  }, [records]);

  // Route breakdown
  const routeCounts = useMemo(() => {
    const counts: Record<RouteCategory, number> = {
      'Customer Follow-up': 0,
      'Deal / Commercial Next Step': 0,
      'Sales Coaching': 0,
      'Partner / Vendor Coordination': 0,
      'Nurture / No Immediate Action': 0,
      'Manual Review': 0,
    };
    records.forEach((r) => {
      r.active_routes.forEach((route) => {
        counts[route] = (counts[route] || 0) + 1;
      });
    });
    return counts;
  }, [records]);

  // Activity breakdown by person
  const personActivity = useMemo(() => {
    const map = new Map<
      string,
      {
        person: string;
        role: 'Call Rep' | 'Meeting Organizer';
        total: number;
        usable: number;
        unusable: number;
        calls: number;
        meetings: number;
        records: ProcessedRecord[];
      }
    >();

    records.forEach((r) => {
      const existing = map.get(r.personLabel) || {
        person: r.personLabel,
        role: r.personRole,
        total: 0,
        usable: 0,
        unusable: 0,
        calls: 0,
        meetings: 0,
        records: [],
      };

      existing.total++;
      if (r.hasUsableText) existing.usable++;
      else existing.unusable++;
      if (r.source_type === 'call') existing.calls++;
      else existing.meetings++;
      existing.records.push(r);
      map.set(r.personLabel, existing);
    });

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
  }, [records]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImportBatch) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        let parsed = JSON.parse(text);

        if (Array.isArray(parsed)) {
          parsed = {
            batch_id: `upload-${file.name.replace(/\.[^/.]+$/, '')}-${Date.now()}`,
            revision: 1,
            delivered_at: new Date().toISOString(),
            records: parsed,
          };
        } else if (parsed && typeof parsed === 'object') {
          if (!parsed.batch_id && Array.isArray(parsed.records)) {
            parsed.batch_id = `upload-${file.name.replace(/\.[^/.]+$/, '')}-${Date.now()}`;
          } else if (!parsed.records && (parsed.source_type || parsed.source_id)) {
            parsed = {
              batch_id: `upload-single-${Date.now()}`,
              revision: parsed.revision || 1,
              delivered_at: new Date().toISOString(),
              records: [parsed],
            };
          }
        }

        if (parsed?.records && Array.isArray(parsed.records)) {
          onImportBatch(parsed as DeliveryBatchEnvelope);
        }
      } catch (err: any) {
        console.error('Failed to parse uploaded JSON', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Context */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-sky-500/30 bg-sky-500/10 px-2.5 py-0.5 text-xs font-semibold text-sky-300">
                Operational Overview
              </span>
              <span className="text-xs text-slate-400">
                Selected Records for 21 August 2026 (Asia/Kolkata)
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Manager Revenue Intelligence Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              {totalDistinct > 0
                ? `Evidence-grounded workspace tracking ${totalDistinct} interactions across telephony and video meetings. Zero fabricated pipeline, unverified attendees, or assumed outcomes.`
                : 'Evidence-grounded workspace. Ingest source delivery envelopes to track telephony and video meetings.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenDefinitions}
              className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-slate-700 hover:text-white"
            >
              Methodology & Denominators
            </button>
            <button
              onClick={() => onFilterInbox({ sourceType: 'all' })}
              className="rounded-lg bg-sky-500 px-3 py-2 text-xs font-semibold text-slate-950 shadow-md shadow-sky-500/20 transition hover:bg-sky-400"
            >
              {totalDistinct > 0 ? `View All ${totalDistinct} in Inbox` : 'View Inbox'}
            </button>
          </div>
        </div>
      </div>

      {totalDistinct === 0 ? (
        /* Empty State Onboarding Card */
        <div className="rounded-2xl border-2 border-dashed border-sky-500/30 bg-slate-900/60 p-8 sm:p-12 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
            <Sparkles className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white sm:text-2xl">
            Clean Initial State • Ready for Ingestion
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
            All predefined data has been cleared. To view conversations, run revenue intelligence analysis, and generate evidence-grounded routes, please upload a custom JSON delivery batch or import a supplied batch.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {onImportBatch && (
              <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-sky-500 px-5 py-3 text-xs font-bold text-slate-950 shadow-lg shadow-sky-500/20 hover:bg-sky-400 transition">
                <Upload className="h-4 w-4" />
                <span>Upload Delivery Batch JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            )}

            {onImportBatch && (
              <button
                onClick={() => onImportBatch(initialBatchData as DeliveryBatchEnvelope)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-semibold text-slate-200 hover:border-sky-500 hover:bg-slate-700 transition"
              >
                <UploadCloud className="h-4 w-4 text-sky-400" />
                <span>Import 01_initial.json (44 records)</span>
              </button>
            )}

            {onImportBatch && (
              <button
                onClick={() => onImportBatch(updateBatchData as DeliveryBatchEnvelope)}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-semibold text-slate-200 hover:border-emerald-500 hover:bg-slate-700 transition"
              >
                <UploadCloud className="h-4 w-4 text-emerald-400" />
                <span>Import 02_update.json (Rev 2)</span>
              </button>
            )}

            {onNavigateToReplay && (
              <button
                onClick={onNavigateToReplay}
                className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition"
              >
                <span>Go to Imports & Replay</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* KPI Metric Cards with Explicit Mathematical Denominators */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Distinct Records */}
        <div
          onClick={() => onFilterInbox({ sourceType: 'all', person: 'all', route: 'all', usableText: 'all' })}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm transition hover:border-sky-500/50 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Distinct Source Records
            </span>
            <div className="rounded-lg bg-sky-500/10 p-2 text-sky-400 group-hover:bg-sky-500/20">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white">{totalDistinct}</span>
            <span className="text-xs text-slate-400">Total Unique</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-sky-400">{callsCount} Calls</span>
            <span>•</span>
            <span className="font-semibold text-indigo-400">{meetingsCount} Meetings</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Click to inspect full dataset in inbox. Key: (source_type, source_id).
          </p>
        </div>

        {/* Card 2: Usable Text Coverage */}
        <div
          onClick={() => onFilterInbox({ usableText: 'usable' })}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm transition hover:border-emerald-500/50 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Usable Text Coverage
            </span>
            <div className="rounded-lg bg-emerald-500/10 p-2 text-emerald-400 group-hover:bg-emerald-500/20">
              <MessageSquare className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-400">{usableCount}</span>
            <span className="text-sm font-medium text-slate-400">/ {totalDistinct} ({usableRate}%)</span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>Nonblank transcript or turns</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Denominator: {totalDistinct} distinct records ({usableCount} with usable text).
          </p>
        </div>

        {/* Card 3: Unusable / Missing Text */}
        <div
          onClick={() => onFilterInbox({ usableText: 'unusable' })}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm transition hover:border-amber-500/50 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Missing / Silent Text
            </span>
            <div className="rounded-lg bg-amber-500/10 p-2 text-amber-400 group-hover:bg-amber-500/20">
              <AlertCircle className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-400">{unusableCount}</span>
            <span className="text-sm font-medium text-slate-400">
              / {totalDistinct} ({totalDistinct > 0 ? ((unusableCount / totalDistinct) * 100).toFixed(1) : 0}%)
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>20 voicemail/unanswered calls • 6 meetings</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Strict rule: No substantive analysis inferred from absent text.
          </p>
        </div>

        {/* Card 4: Source-Reported Connection Rate */}
        <div
          onClick={() => onFilterInbox({ sourceType: 'call' })}
          className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm transition hover:border-violet-500/50 hover:bg-slate-900"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Telephony Connection Rate
            </span>
            <div className="rounded-lg bg-violet-500/10 p-2 text-violet-400 group-hover:bg-violet-500/20">
              <PhoneCall className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-violet-400">{connectionRate}%</span>
            <span className="text-sm text-slate-400">
              ({connectedCalls.length} / {callsWithConnectedFlag.length})
            </span>
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs text-slate-400">
            <span>Upstream stored classification</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            Denominator: 30 calls with non-null is_connected. Does not equal text coverage.
          </p>
        </div>
      </div>

      {/* Interactive Person and Source-Type Filter Bar */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="h-4 w-4 text-sky-400" />
          <span>Dashboard Activity Slicing:</span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Source Type Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-slate-400">Source:</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
            >
              <option value="all">All Sources ({records.length})</option>
              <option value="call">Calls Only ({callsCount})</option>
              <option value="meeting">Meetings Only ({meetingsCount})</option>
            </select>
          </div>

          {/* Person Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-xs text-slate-400">Person:</label>
            <select
              value={selectedPerson}
              onChange={(e) => setSelectedPerson(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
            >
              <option value="all">All People ({allPersons.length})</option>
              <optgroup label="Call Representatives (5)">
                {callReps.map((rep) => (
                  <option key={rep} value={rep}>
                    {rep} (Rep)
                  </option>
                ))}
              </optgroup>
              <optgroup label="Meeting Organizers (9)">
                {meetingOrganizers.map((org) => (
                  <option key={org} value={org}>
                    {org} (Organizer)
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          {(selectedType !== 'all' || selectedPerson !== 'all') && (
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedPerson('all');
              }}
              className="text-xs text-sky-400 hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Multi-Route Distribution & Selected Activity by Person */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Route Taxonomy Distribution (5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-white">
                  Routing & Review Distribution
                </h2>
                <p className="text-xs text-slate-400">
                  Active category assignments across 44 records
                </p>
              </div>
              <span className="rounded bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
                Multi-Route Model
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {(
                [
                  { route: 'Customer Follow-up', color: 'bg-emerald-500', text: 'text-emerald-400' },
                  { route: 'Deal / Commercial Next Step', color: 'bg-sky-500', text: 'text-sky-400' },
                  { route: 'Sales Coaching', color: 'bg-amber-500', text: 'text-amber-400' },
                  { route: 'Partner / Vendor Coordination', color: 'bg-indigo-500', text: 'text-indigo-400' },
                  { route: 'Nurture / No Immediate Action', color: 'bg-slate-500', text: 'text-slate-300' },
                  { route: 'Manual Review', color: 'bg-rose-500', text: 'text-rose-400' },
                ] as const
              ).map(({ route, color, text }) => {
                const count = routeCounts[route] || 0;
                const pct = totalDistinct > 0 ? Math.round((count / totalDistinct) * 100) : 0;
                return (
                  <div
                    key={route}
                    onClick={() => onFilterInbox({ route })}
                    className="group cursor-pointer rounded-lg border border-slate-800/80 bg-slate-950/40 p-3 transition hover:border-slate-700 hover:bg-slate-900"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                        <span className="font-medium text-slate-200 group-hover:text-white">
                          {route}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${text}`}>{count}</span>
                        <span className="text-[10px] text-slate-400">({pct}%)</span>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="mt-2 h-1.5 w-full rounded-full bg-slate-800">
                      <div
                        className={`h-1.5 rounded-full ${color} transition-all`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-[11px] text-slate-400">
              <span className="font-semibold text-slate-300">Note on Multi-Route Totals: </span>
              Because complex conversations can have multiple supported destinations (e.g. C03 has
              both Customer Follow-up & Deal Next Step), assigned route counts may sum to more than 44 unique records.
              {manualOverridesCount > 0 && (
                <span className="ml-1 text-sky-400 font-semibold">
                  ({manualOverridesCount} manual override active).
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Activity Breakdown by Person (7 cols) */}
        <div className="space-y-4 lg:col-span-7">
          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold tracking-wide text-white">
                  Activity by Person & Role
                </h2>
                <p className="text-xs text-slate-400">
                  Strict distinction: Call Reps vs Calendar Meeting Organizers
                </p>
              </div>
              <span className="text-xs text-slate-400">
                Showing {filteredRecords.length} records
              </span>
            </div>

            {/* Information Alert */}
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-sky-500/20 bg-sky-500/10 p-3 text-xs text-sky-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <strong>Attribution Boundary:</strong> Meeting organizers are calendar invite
                creators; data does not establish that an organizer attended or served as the
                salesperson. Telephony reps reflect account logins.
              </p>
            </div>

            {/* Person Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2 font-medium">Person / Identifier</th>
                    <th className="pb-2 font-medium">Role</th>
                    <th className="pb-2 text-center font-medium">Total</th>
                    <th className="pb-2 text-center font-medium">Usable Text</th>
                    <th className="pb-2 text-center font-medium">No Text</th>
                    <th className="pb-2 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {personActivity.map((row) => (
                    <tr
                      key={row.person}
                      className="group transition hover:bg-slate-800/40"
                    >
                      <td className="py-2.5 font-medium text-slate-200">
                        <div className="flex items-center gap-1.5">
                          {row.role === 'Call Rep' ? (
                            <PhoneCall className="h-3.5 w-3.5 text-sky-400" />
                          ) : (
                            <Video className="h-3.5 w-3.5 text-indigo-400" />
                          )}
                          <span>{row.person}</span>
                        </div>
                      </td>
                      <td className="py-2.5">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                            row.role === 'Call Rep'
                              ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          }`}
                        >
                          {row.role}
                        </span>
                      </td>
                      <td className="py-2.5 text-center font-bold text-white">
                        {row.total}
                      </td>
                      <td className="py-2.5 text-center font-semibold text-emerald-400">
                        {row.usable}
                      </td>
                      <td className="py-2.5 text-center text-slate-400">
                        {row.unusable}
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => onFilterInbox({ person: row.person })}
                          className="text-[11px] text-sky-400 hover:text-sky-300 hover:underline"
                        >
                          View Records →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
};
