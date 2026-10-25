import React, { useState } from 'react';
import { PatternFinding, TimelineEvent } from '../types/reclaim';
import { analyzePatterns } from '../services/api';
import { PersonaCorrelationMap } from './PersonaCorrelationMap';
import { soundFX } from '../utils/soundEffects';
import { Radar, ShieldAlert, Sparkles, Scale, Link2, CheckCircle2, Loader2, Network } from 'lucide-react';

interface PatternRadarProps {
  caseId: string;
  patterns: PatternFinding[];
  timelineEvents?: TimelineEvent[];
  onPatternsUpdated: (newPatterns: PatternFinding[]) => void;
  onHighlightEvidence?: (evidenceId: string) => void;
}

export const PatternRadar: React.FC<PatternRadarProps> = ({
  caseId,
  patterns,
  timelineEvents = [],
  onPatternsUpdated,
  onHighlightEvidence
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunAnalysis = async () => {
    try {
      setAnalyzing(true);
      setError(null);
      soundFX.playClick();
      const updated = await analyzePatterns(caseId);
      onPatternsUpdated(updated);
      soundFX.playAlert();
    } catch (err: any) {
      setError(err.message || 'Pattern analysis failed');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-rose-400" />
            <h3 className="text-base font-bold text-white">
              Behavioral Harassment & Escalation Radar
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Correlates timestamps, burner accounts, and extortion threats across exhibits. Detects block evasion,
            call barrages, and NCII extortion grounded in exact evidence IDs.
          </p>
        </div>

        <button
          onClick={handleRunAnalysis}
          disabled={analyzing}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/20 active:scale-95 disabled:opacity-50"
        >
          {analyzing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Analyzing Stalking Vectors...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run AI Pattern Analysis</span>
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
          {error}
        </div>
      )}

      {/* Visual Persona Correlation & Channel Hop Map */}
      <PersonaCorrelationMap
        timelineEvents={timelineEvents}
        patterns={patterns}
      />

      {/* Pattern Cards Grid */}
      {patterns.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <Radar className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-semibold text-slate-300">No Harassment Patterns Analyzed Yet</h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "Run AI Pattern Analysis" above or load Maya's demo case to see cross-platform block evasion and contact barrage detection.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {patterns.map((pat, idx) => (
            <div
              key={pat.id || idx}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg group relative overflow-hidden"
            >
              <div className="space-y-3">
                {/* Badge Row */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-semibold truncate">
                    {pat.pattern_type}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded font-bold">
                      {Math.round(pat.confidence_score * 100)}% Match
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                        pat.severity === 'Critical'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      }`}
                    >
                      {pat.severity}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h4 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors">
                  {pat.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {pat.description}
                </p>

                {/* Legal Relevance Citation */}
                {pat.legal_relevance_note && (
                  <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-slate-300 flex items-start gap-2">
                    <Scale className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-amber-400 font-semibold block text-[10px] uppercase">
                        Legal Statutory Citation
                      </span>
                      <span>{pat.legal_relevance_note}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Linked Evidence Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between flex-wrap gap-2 text-[11px]">
                <span className="text-slate-500 flex items-center gap-1 font-mono">
                  <Link2 className="w-3 h-3" /> Grounded In:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {pat.linked_evidence_ids.map((evId) => (
                    <button
                      key={evId}
                      onClick={() => {
                        soundFX.playClick();
                        onHighlightEvidence && onHighlightEvidence(evId);
                      }}
                      className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30 transition-all text-[11px]"
                    >
                      {evId}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
