import React from 'react';
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  Lightbulb,
  ShieldAlert,
  Sparkles,
  Target,
} from 'lucide-react';
import { MANAGER_BRIEF_2026_08_21 } from '../lib/managerBriefData';

interface ManagerBriefViewProps {
  onSelectRecord: (recordRef: string) => void;
}

export const ManagerBriefView: React.FC<ManagerBriefViewProps> = ({ onSelectRecord }) => {
  const brief = MANAGER_BRIEF_2026_08_21;

  const getSectionIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Compass className="h-5 w-5 text-sky-400" />;
      case 1:
        return <Sparkles className="h-5 w-5 text-indigo-400" />;
      case 2:
        return <Lightbulb className="h-5 w-5 text-amber-400" />;
      case 3:
        return <Target className="h-5 w-5 text-emerald-400" />;
      case 4:
        return <ShieldAlert className="h-5 w-5 text-rose-400" />;
      default:
        return <FileText className="h-5 w-5 text-sky-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-emerald-950/40 p-6 shadow-xl">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-300">
                Executive Synthesis
              </span>
              <span className="text-xs text-slate-400">
                {brief.briefDate} • {brief.timezone}
              </span>
            </div>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Manager Intelligence Brief
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Evidence-based operational brief synthesizing all 18 usable conversations following
              the Revision 2 update delivery.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-right">
            <span className="block text-[10px] uppercase font-semibold text-slate-400">
              Delivery Timestamp
            </span>
            <span className="text-xs font-bold text-white">{brief.generatedAt}</span>
          </div>
        </div>

        {/* Transparency Disclosure */}
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-sky-500/20 bg-sky-500/10 p-3 text-xs text-sky-200">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-sky-400" />
          <p>
            <strong>Method Transparency Note:</strong> {brief.disclosureNote}
          </p>
        </div>
      </div>

      {/* Sections Accordion / Cards */}
      <div className="space-y-6">
        {brief.sections.map((section, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col justify-between gap-2 border-b border-slate-800 pb-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-slate-800 p-2">{getSectionIcon(idx)}</div>
                <div>
                  <h2 className="text-base font-bold text-white">{section.title}</h2>
                  {section.badge && (
                    <span className="text-xs text-slate-400 font-medium">
                      Focus Area: {section.badge}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Bullet Points */}
            <ul className="space-y-2.5 text-xs text-slate-300">
              {section.content.map((point, pIdx) => {
                const parts = point.split(':');
                const hasLead = parts.length > 1;
                return (
                  <li key={pIdx} className="flex items-start gap-2 leading-relaxed">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
                    <span>
                      {hasLead ? (
                        <>
                          <strong className="text-white font-semibold">{parts[0]}:</strong>
                          {parts.slice(1).join(':')}
                        </>
                      ) : (
                        point
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>

            {/* Traceable Source Citations */}
            {section.traceableReferences && section.traceableReferences.length > 0 && (
              <div className="mt-4 rounded-lg bg-slate-950/60 p-3 border border-slate-800/80">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                  Traceable Supporting Records:
                </span>
                <div className="flex flex-wrap gap-2">
                  {section.traceableReferences.map((refItem, rIdx) => {
                    const cleanRef = refItem.ref.split(' ')[0];
                    return (
                      <button
                        key={rIdx}
                        onClick={() => {
                          if (['C01','C02','C03','C04','C05','C06','C07','C08','C09','C10','M01','M02','M03','M04','M06','M07','M09','M10'].includes(cleanRef)) {
                            onSelectRecord(cleanRef);
                          }
                        }}
                        className="flex items-center gap-1.5 rounded bg-slate-800 hover:bg-slate-700 px-2 py-1 text-[11px] font-mono text-sky-300 transition"
                      >
                        <span className="font-bold">{refItem.ref}</span>
                        <span className="font-sans text-slate-400 text-[10px]">({refItem.note})</span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-400" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

function Info(props: any) {
  return <AlertCircle {...props} />;
}
