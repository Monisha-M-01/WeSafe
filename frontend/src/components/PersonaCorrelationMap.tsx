import React from 'react';
import { TimelineEvent, PatternFinding } from '../types/reclaim';
import { Network, ArrowRight, ShieldAlert, Smartphone, Instagram, Linkedin, Flame } from 'lucide-react';

interface PersonaCorrelationMapProps {
  timelineEvents: TimelineEvent[];
  patterns: PatternFinding[];
}

export const PersonaCorrelationMap: React.FC<PersonaCorrelationMapProps> = ({
  timelineEvents,
  patterns
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Network className="w-5 h-5 text-rose-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Perpetrator Block-Evasion Network & Channel Hop Map
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Correlating burner accounts across phone, social media, and professional networks to establish premeditated stalking.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 flex items-center gap-1.5 font-bold">
            <Flame className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
            <span>Escalation Threat: High</span>
          </span>
        </div>
      </div>

      {/* Visual Persona Hop Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
        {/* Node 1: Mobile Phone & WhatsApp */}
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 relative group hover:border-emerald-400 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold flex items-center gap-1">
              <Smartphone className="w-3 h-3" /> Origin Channel
            </span>
            <span className="text-[10px] font-mono text-slate-400">2026-10-21</span>
          </div>
          <h5 className="text-sm font-bold text-white font-mono">+91-98201-XXXXX</h5>
          <p className="text-xs text-slate-400 mt-1">
            WhatsApp threat + 18 nocturnal calls within 32 minutes.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-400">
            <span>DEFENSIVE ACTION:</span>
            <span className="text-rose-400 font-bold">Number Blocked</span>
          </div>
        </div>

        {/* Transition 1 Arrow */}
        <div className="hidden md:flex absolute left-[31%] top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-amber-400 shadow-lg">
          <ArrowRight className="w-4 h-4 animate-pulse" />
        </div>

        {/* Node 2: Instagram Burner Account */}
        <div className="p-4 rounded-xl bg-slate-950 border border-pink-500/40 relative group hover:border-pink-400 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 font-bold flex items-center gap-1">
              <Instagram className="w-3 h-3" /> Block Evasion #1
            </span>
            <span className="text-[10px] font-mono text-slate-400">2026-10-22</span>
          </div>
          <h5 className="text-sm font-bold text-white font-mono">@maya_watch_blr99</h5>
          <p className="text-xs text-slate-400 mt-1">
            Explicit NCII extortion: threatened to send photos to employer HR.
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-400">
            <span>EVASION CONFIRMATION:</span>
            <span className="text-pink-400 font-bold">"Made a new page"</span>
          </div>
        </div>

        {/* Transition 2 Arrow */}
        <div className="hidden md:flex absolute left-[65%] top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-slate-800 border border-slate-700 items-center justify-center text-rose-400 shadow-lg">
          <ArrowRight className="w-4 h-4 animate-pulse" />
        </div>

        {/* Node 3: LinkedIn Professional Channel */}
        <div className="p-4 rounded-xl bg-slate-950 border border-blue-500/40 relative group hover:border-blue-400 transition-all shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 font-bold flex items-center gap-1">
              <Linkedin className="w-3 h-3" /> Block Evasion #2
            </span>
            <span className="text-[10px] font-mono text-slate-400">2026-10-23</span>
          </div>
          <h5 className="text-sm font-bold text-white font-mono">@r_verma_backup2</h5>
          <p className="text-xs text-slate-400 mt-1">
            Cross-platform coercion: "Check your Instagram DM. Clock is ticking."
          </p>
          <div className="mt-3 pt-2 border-t border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-400">
            <span>TACTIC:</span>
            <span className="text-blue-400 font-bold">Workplace Escalation</span>
          </div>
        </div>
      </div>
    </div>
  );
};
