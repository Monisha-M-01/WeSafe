import React, { useState } from 'react';
import { ActionPlan } from '../types/reclaim';
import { generateActionPlan } from '../services/api';
import { ShieldAlert, CheckSquare, Copy, Check, FileText, Send, Sparkles, Loader2, ExternalLink } from 'lucide-react';

interface ActionAssistantProps {
  caseId: string;
  actionPlan: ActionPlan | null;
  onPlanUpdated: (newPlan: ActionPlan) => void;
}

export const ActionAssistant: React.FC<ActionAssistantProps> = ({
  caseId,
  actionPlan,
  onPlanUpdated
}) => {
  const [activeTab, setActiveTab] = useState<'SAFETY' | 'TAKEDOWNS' | 'CYBER_REPORT'>('SAFETY');
  const [generating, setGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleGenerate = async () => {
    try {
      setGenerating(true);
      const res = await generateActionPlan(caseId);
      onPlanUpdated(res);
    } finally {
      setGenerating(false);
    }
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">
              AI Digital Safety & Platform Takedown Engine
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl">
            Generates platform-specific formal notices citing exact SHA-256 evidence hashes and ready-to-file
            Cyber Crime complaints pursuant to BNS and the IT Act.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-600/20 active:scale-95 disabled:opacity-50"
        >
          {generating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Generating Tailored Legal Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Regenerate Response Plan</span>
            </>
          )}
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('SAFETY')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'SAFETY'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Survivor Safety Checklist</span>
        </button>

        <button
          onClick={() => setActiveTab('TAKEDOWNS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'TAKEDOWNS'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <Send className="w-4 h-4" />
          <span>Platform Takedowns ({actionPlan?.platform_takedowns?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('CYBER_REPORT')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'CYBER_REPORT'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Official Police / Cyber Cell Brief</span>
        </button>
      </div>

      {/* Tab 1: Safety Checklist */}
      {activeTab === 'SAFETY' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              Trauma-Informed Digital Hardening Steps
            </h4>
            <span className="text-xs text-slate-400 font-mono">
              Completed: {Object.values(completedSteps).filter(Boolean).length} / {actionPlan?.safety_steps?.length || 0}
            </span>
          </div>

          <div className="space-y-2.5">
            {actionPlan?.safety_steps?.map((step, idx) => (
              <div
                key={idx}
                onClick={() => toggleStep(idx)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  completedSteps[idx]
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!completedSteps[idx]}
                  onChange={() => {}}
                  className="mt-0.5 rounded border-slate-700 text-emerald-600 focus:ring-0 cursor-pointer"
                />
                <span className={`text-xs leading-relaxed ${completedSteps[idx] ? 'line-through text-slate-500' : ''}`}>
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Platform Takedowns */}
      {activeTab === 'TAKEDOWNS' && (
        <div className="space-y-4">
          {actionPlan?.platform_takedowns?.map((item, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                      {item.platform}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{item.policy_reference}</span>
                  </div>
                  <h4 className="text-sm font-bold text-white pt-1">{item.title}</h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopy(item.notice_body, `takedown-${idx}`)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/90 hover:bg-emerald-600 text-white text-xs font-semibold transition-all active:scale-95"
                  >
                    {copiedIndex === `takedown-${idx}` ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Notice</span>
                      </>
                    )}
                  </button>
                  {item.recipient_email_or_url.startsWith('http') && (
                    <a
                      href={item.recipient_email_or_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                      title="Open Report Portal"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Pre-filled Notice Body */}
              <div className="relative">
                <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                  {item.notice_body}
                </pre>
              </div>

              {/* Cited Exhibits and SHA-256 Hashes */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 text-[11px] font-mono border-t border-slate-800/80">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-500">Cited Evidence:</span>
                  {item.evidence_citations?.map((c) => (
                    <span key={c} className="px-1.5 py-0.5 rounded bg-slate-800 text-emerald-400 font-bold">
                      {c}
                    </span>
                  ))}
                </div>
                <div className="text-slate-500 truncate max-w-sm">
                  SHA-256: {item.sha256_proofs?.[0]?.substring(0, 20)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 3: Official Law Enforcement Brief */}
      {activeTab === 'CYBER_REPORT' && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                Cyber Crime & Police Station First Information Brief
              </h4>
              <p className="text-xs text-slate-400">
                Objective, chronological summary structured for National Cyber Crime Portal (cybercrime.gov.in / 1930).
              </p>
            </div>

            <button
              onClick={() => handleCopy(actionPlan?.authority_report_draft || '', 'police-report')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all active:scale-95"
            >
              {copiedIndex === 'police-report' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied Brief!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Police Brief</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto select-all">
            {actionPlan?.authority_report_draft}
          </pre>
        </div>
      )}
    </div>
  );
};
