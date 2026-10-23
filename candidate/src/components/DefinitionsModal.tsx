import React from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  ShieldAlert,
  Sparkles,
  X,
} from 'lucide-react';
import { EVIDENCE_FINDINGS, REJECTED_DECISION } from '../lib/findingsData';

interface DefinitionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DefinitionsModal: React.FC<DefinitionsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-sky-400" />
            <h2 className="text-lg font-bold text-white">
              Methodology, Metric Denominators & Evidence Findings
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Section 1: Metric Denominators */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400">
            1. Headline Metric Denominators & Safe Baseline Calculations
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 text-xs text-slate-300">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
              <span className="font-bold text-white">Distinct Source Records (44)</span>
              <p className="text-slate-400">
                Denominator: 44 unique pairs of <code>(source_type, source_id)</code>. Contains 30
                calls and 14 meetings. Never deduplicated by name, phone, or array position.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
              <span className="font-bold text-emerald-400">Usable Text Coverage (40.91%)</span>
              <p className="text-slate-400">
                Denominator: 18 usable texts / 44 total records post-update (17 pre-update). A call
                is usable if <code>payload.transcript</code> is nonblank; a meeting is usable if{' '}
                <code>transcript_payload.turns</code> contains at least one nonblank turn.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
              <span className="font-bold text-amber-400">Unusable / Missing Text (59.09%)</span>
              <p className="text-slate-400">
                Denominator: 26 records / 44 total records post-update. Represents upstream
                unanswered calls (B01–B20) or cancelled/unscheduled meetings. Strict rule: zero
                substantive analysis is inferred from absent text.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-1.5">
              <span className="font-bold text-violet-400">Telephony Connection Rate (33.33%)</span>
              <p className="text-slate-400">
                Denominator: 10 calls with <code>is_connected === true</code> divided by 30 calls with
                non-null <code>is_connected</code>. This is an upstream telecom status, distinct from
                substantive text coverage.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Attribution & Date Conventions */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400">
            2. Date Conventions & Staff Role Attribution
          </h3>
          <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs text-slate-300 space-y-2">
            <p>
              <strong>Date & Timezone:</strong> All selected activity falls on{' '}
              <strong>21 August 2026</strong> in <strong>Asia/Kolkata</strong>. Calls use{' '}
              <code>started_at</code>; meetings use <code>starts_at</code>. Delivery envelopes
              arrived on 22 August 2026; these are distinct concepts.
            </p>
            <p>
              <strong>Staff Role Attribution:</strong> Telephony reps (Arun, Leela, Kiran, Meera,
              Dev) represent caller accounts. Meeting organizers (team06–team14) represent calendar
              invite creators; the data does not establish that an organizer attended or acted as
              the salesperson.
            </p>
          </div>
        </div>

        {/* Section 3: Evidence-Backed Findings */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-sky-400">
            3. Three Evidence-Backed Findings (With Passage Citations)
          </h3>
          <div className="space-y-3">
            {EVIDENCE_FINDINGS.map((finding) => (
              <div
                key={finding.id}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 text-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-sm">{finding.title}</h4>
                  <span className="font-mono text-sky-400 text-[11px] font-bold">
                    {finding.sourceReference}
                  </span>
                </div>
                <p className="text-slate-300">
                  <strong>Observation:</strong> {finding.observation}
                </p>
                <div className="rounded bg-slate-900 p-2.5 border border-slate-800 font-mono text-[11px] text-amber-200 italic">
                  "{finding.passageQuote}"
                </div>
                <p className="text-slate-300">
                  <strong>Product Decision Influenced:</strong> {finding.productDecision}
                </p>
                <p className="text-slate-400 text-[11px]">
                  <strong>Where Reflected:</strong> {finding.reflectedIn}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Deliberately Rejected Decision */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400">
            4. Deliberately Rejected Decision & Accepted Trade-Off
          </h3>
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-rose-300 text-sm">{REJECTED_DECISION.title}</h4>
            <p>
              <strong>Rejected Alternative:</strong> {REJECTED_DECISION.rejectedAlternative}
            </p>
            <p>
              <strong>Why Rejected:</strong> {REJECTED_DECISION.whyRejected}
            </p>
            <p>
              <strong>Trade-Off Accepted:</strong> {REJECTED_DECISION.tradeOffAccepted}
            </p>
            <p className="text-slate-400 text-[11px]">
              <strong>Where Reflected:</strong> {REJECTED_DECISION.reflectedIn}
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="rounded-lg bg-sky-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-sky-400"
          >
            Close Definitions
          </button>
        </div>
      </div>
    </div>
  );
};
