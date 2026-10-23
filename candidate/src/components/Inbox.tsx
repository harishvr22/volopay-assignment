import React, { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowUpDown,
  CheckCircle2,
  ChevronRight,
  Filter,
  Inbox as InboxIcon,
  MessageSquare,
  PhoneCall,
  Search,
  SlidersHorizontal,
  Sparkles,
  Video,
} from 'lucide-react';
import { ProcessedRecord, RouteCategory, SourceType } from '../types';
import { formatKolkataTime } from '../lib/intelligenceEngine';

interface InboxProps {
  records: ProcessedRecord[];
  selectedRef: string | null;
  onSelectRecord: (recordRef: string) => void;
  initialFilter?: {
    sourceType?: SourceType | 'all';
    person?: string;
    route?: RouteCategory | 'all';
    usableText?: 'usable' | 'unusable' | 'all';
  };
  onNavigateToReplay?: () => void;
}

export const Inbox: React.FC<InboxProps> = ({
  records,
  selectedRef,
  onSelectRecord,
  initialFilter,
  onNavigateToReplay,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceTypeFilter, setSourceTypeFilter] = useState<SourceType | 'all'>(
    initialFilter?.sourceType || 'all'
  );
  const [routeFilter, setRouteFilter] = useState<RouteCategory | 'all'>(
    initialFilter?.route || 'all'
  );
  const [usableTextFilter, setUsableTextFilter] = useState<'usable' | 'unusable' | 'all'>(
    initialFilter?.usableText || 'all'
  );
  const [personFilter, setPersonFilter] = useState<string>(initialFilter?.person || 'all');
  const [overrideFilter, setOverrideFilter] = useState<'all' | 'override_only' | 'automated_only'>('all');

  // Filter records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      // Source Type
      if (sourceTypeFilter !== 'all' && r.source_type !== sourceTypeFilter) return false;

      // Usable Text
      if (usableTextFilter === 'usable' && !r.hasUsableText) return false;
      if (usableTextFilter === 'unusable' && r.hasUsableText) return false;

      // Route
      if (routeFilter !== 'all' && !r.active_routes.includes(routeFilter)) return false;

      // Person
      if (personFilter !== 'all' && r.personLabel !== personFilter) return false;

      // Override
      if (overrideFilter === 'override_only' && !r.manual_override) return false;
      if (overrideFilter === 'automated_only' && !!r.manual_override) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = r.record_ref.toLowerCase().includes(q);
        const matchesId = r.source_id.toLowerCase().includes(q);
        const matchesPerson = r.personLabel.toLowerCase().includes(q);
        const matchesTitle = r.titleOrOutcome.toLowerCase().includes(q);
        const matchesRoute = r.active_routes.some((rt) => rt.toLowerCase().includes(q));

        let matchesTranscript = false;
        if (r.source_type === 'call') {
          matchesTranscript = !!(r.payload as any).transcript?.toLowerCase().includes(q);
        } else if (r.transcript_payload?.turns) {
          matchesTranscript = r.transcript_payload.turns.some((t) => t.text.toLowerCase().includes(q));
        }

        if (!matchesRef && !matchesId && !matchesPerson && !matchesTitle && !matchesRoute && !matchesTranscript) {
          return false;
        }
      }

      return true;
    });
  }, [
    records,
    sourceTypeFilter,
    usableTextFilter,
    routeFilter,
    personFilter,
    overrideFilter,
    searchQuery,
  ]);

  // Distinct persons for filter dropdown
  const allPersons = useMemo(() => {
    const list = new Set<string>();
    records.forEach((r) => list.add(r.personLabel));
    return Array.from(list).sort();
  }, [records]);

  if (records.length === 0) {
    return (
      <div className="space-y-4 pb-12">
        <div className="rounded-2xl border-2 border-dashed border-sky-500/30 bg-slate-900/60 p-8 sm:p-12 text-center shadow-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-500/10 text-sky-400">
            <InboxIcon className="h-8 w-8" />
          </div>
          <h2 className="mt-4 text-xl font-bold text-white sm:text-2xl">
            Conversation Inbox is Empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
            Zero conversation records are currently loaded in the workspace. Upload a JSON delivery batch or import data in the Imports & Replay section.
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
    <div className="space-y-4 pb-12">
      {/* Header & Search */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            Conversation Intelligence Inbox
          </h1>
          <p className="text-xs text-slate-400">
            Displaying {filteredRecords.length} of {records.length} total source records across telephony and meetings
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search reference, person, quote..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 shadow-sm transition focus:border-sky-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Multi-Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs">
        {/* Source Type Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Type:</span>
          <select
            value={sourceTypeFilter}
            onChange={(e) => setSourceTypeFilter(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Sources</option>
            <option value="call">Calls ({records.filter((r) => r.source_type === 'call').length})</option>
            <option value="meeting">Meetings ({records.filter((r) => r.source_type === 'meeting').length})</option>
          </select>
        </div>

        {/* Usable Text Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Text:</span>
          <select
            value={usableTextFilter}
            onChange={(e) => setUsableTextFilter(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Text States</option>
            <option value="usable">Usable Supplied Text ({records.filter((r) => r.hasUsableText).length})</option>
            <option value="unusable">Unusable / Missing ({records.filter((r) => !r.hasUsableText).length})</option>
          </select>
        </div>

        {/* Route Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Route:</span>
          <select
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All Routes</option>
            <option value="Customer Follow-up">Customer Follow-up</option>
            <option value="Deal / Commercial Next Step">Deal / Commercial Next Step</option>
            <option value="Sales Coaching">Sales Coaching</option>
            <option value="Partner / Vendor Coordination">Partner / Vendor Coordination</option>
            <option value="Nurture / No Immediate Action">Nurture / No Immediate Action</option>
            <option value="Manual Review">Manual Review</option>
          </select>
        </div>

        {/* Person Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Person:</span>
          <select
            value={personFilter}
            onChange={(e) => setPersonFilter(e.target.value)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All People</option>
            {allPersons.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* Override Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400">Override:</span>
          <select
            value={overrideFilter}
            onChange={(e) => setOverrideFilter(e.target.value as any)}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 focus:border-sky-500 focus:outline-none"
          >
            <option value="all">All States</option>
            <option value="override_only">Manual Override Active</option>
            <option value="automated_only">Automated Route Only</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {(sourceTypeFilter !== 'all' ||
          routeFilter !== 'all' ||
          usableTextFilter !== 'all' ||
          personFilter !== 'all' ||
          overrideFilter !== 'all' ||
          searchQuery) && (
          <button
            onClick={() => {
              setSourceTypeFilter('all');
              setRouteFilter('all');
              setUsableTextFilter('all');
              setPersonFilter('all');
              setOverrideFilter('all');
              setSearchQuery('');
            }}
            className="ml-auto text-xs text-sky-400 hover:underline"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Records Table */}
      <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900/80 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400">
                <th className="px-4 py-3 font-semibold">Ref</th>
                <th className="px-3 py-3 font-semibold">Source Type</th>
                <th className="px-3 py-3 font-semibold">Time (Asia/Kolkata)</th>
                <th className="px-3 py-3 font-semibold">Rep / Organizer</th>
                <th className="px-4 py-3 font-semibold">Title or Outcome</th>
                <th className="px-3 py-3 font-semibold text-center">Text Status</th>
                <th className="px-3 py-3 font-semibold">Active Route(s)</th>
                <th className="px-3 py-3 font-semibold text-center">Rev</th>
                <th className="px-3 py-3 font-semibold text-center">Freshness</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400">
                    No records match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => {
                  const isSelected = selectedRef === r.record_ref;
                  const { timeOnly } = formatKolkataTime(r.activityTimestamp);
                  return (
                    <tr
                      key={r.identityKey}
                      onClick={() => onSelectRecord(r.record_ref)}
                      className={`group cursor-pointer transition ${
                        isSelected
                          ? 'bg-sky-500/10 border-l-2 border-l-sky-500'
                          : 'hover:bg-slate-800/50'
                      }`}
                    >
                      {/* Record Ref */}
                      <td className="whitespace-nowrap px-4 py-3 font-mono font-bold text-sky-300">
                        {r.record_ref}
                      </td>

                      {/* Source Type Badge */}
                      <td className="whitespace-nowrap px-3 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                            r.source_type === 'call'
                              ? 'bg-sky-500/10 text-sky-300 border border-sky-500/20'
                              : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          }`}
                        >
                          {r.source_type === 'call' ? (
                            <PhoneCall className="h-3 w-3" />
                          ) : (
                            <Video className="h-3 w-3" />
                          )}
                          <span className="capitalize">{r.source_type}</span>
                        </span>
                      </td>

                      {/* Timestamp in Asia/Kolkata */}
                      <td className="whitespace-nowrap px-3 py-3 text-slate-300">
                        <span>21 Aug, {timeOnly}</span>
                      </td>

                      {/* Rep / Organizer */}
                      <td className="px-3 py-3">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-200">{r.personLabel}</span>
                          <span className="text-[10px] text-slate-400">{r.personRole}</span>
                        </div>
                      </td>

                      {/* Title or Outcome */}
                      <td className="max-w-xs truncate px-4 py-3 font-medium text-slate-300">
                        {r.titleOrOutcome}
                      </td>

                      {/* Usable Text Status */}
                      <td className="whitespace-nowrap px-3 py-3 text-center">
                        {r.hasUsableText ? (
                          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="h-3 w-3" />
                            Usable Text
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-medium text-slate-400">
                            No Text
                          </span>
                        )}
                      </td>

                      {/* Active Routes */}
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap items-center gap-1">
                          {r.active_routes.map((rt) => (
                            <span
                              key={rt}
                              className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                                rt === 'Customer Follow-up'
                                  ? 'bg-emerald-500/15 text-emerald-300'
                                  : rt === 'Deal / Commercial Next Step'
                                  ? 'bg-sky-500/15 text-sky-300'
                                  : rt === 'Sales Coaching'
                                  ? 'bg-amber-500/15 text-amber-300'
                                  : rt === 'Partner / Vendor Coordination'
                                  ? 'bg-indigo-500/15 text-indigo-300'
                                  : rt === 'Nurture / No Immediate Action'
                                  ? 'bg-slate-700 text-slate-300'
                                  : 'bg-rose-500/15 text-rose-300'
                              }`}
                            >
                              {rt}
                            </span>
                          ))}
                          {r.manual_override && (
                            <span className="rounded bg-sky-500/20 px-1 py-0.2 text-[9px] font-bold text-sky-300">
                              OVERRIDE
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Applied Revision */}
                      <td className="whitespace-nowrap px-3 py-3 text-center font-mono text-[11px] font-semibold text-slate-300">
                        Rev {r.applied_source_revision}
                      </td>

                      {/* Freshness Badge */}
                      <td className="whitespace-nowrap px-3 py-3 text-center">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                            r.analysis_freshness === 'fresh'
                              ? 'bg-emerald-500/10 text-emerald-300'
                              : r.analysis_freshness === 'pending_review'
                              ? 'bg-amber-500/10 text-amber-300'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {r.analysis_freshness === 'not_available' ? 'N/A' : r.analysis_freshness}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-4 py-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectRecord(r.record_ref);
                          }}
                          className="inline-flex items-center gap-0.5 rounded px-2 py-1 text-[11px] font-semibold text-sky-400 hover:bg-sky-500/10"
                        >
                          Inspect <ChevronRight className="h-3 w-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
