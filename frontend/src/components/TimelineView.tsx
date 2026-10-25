import React, { useState } from 'react';
import { TimelineEvent, EvidenceItem } from '../types/reclaim';
import { Clock, MessageSquare, PhoneMissed, Shield, Eye, ShieldAlert, Hash } from 'lucide-react';

interface TimelineViewProps {
  events: TimelineEvent[];
  evidenceList: EvidenceItem[];
}

export const TimelineView: React.FC<TimelineViewProps> = ({ events, evidenceList }) => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('ALL');
  const [activeEvidenceModal, setActiveEvidenceModal] = useState<EvidenceItem | null>(null);

  const platforms = ['ALL', ...Array.from(new Set(events.map(e => e.platform)))];

  const filteredEvents = selectedPlatform === 'ALL'
    ? events
    : events.filter(e => e.platform === selectedPlatform);

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'calllog':
        return <PhoneMissed className="w-3.5 h-3.5 text-amber-400" />;
      case 'whatsapp':
        return <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />;
      case 'instagram':
        return <MessageSquare className="w-3.5 h-3.5 text-pink-400" />;
      default:
        return <MessageSquare className="w-3.5 h-3.5 text-blue-400" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40">
            <ShieldAlert className="w-3 h-3" /> Critical
          </span>
        );
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-500/40">
            High Severity
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
            Medium
          </span>
        );
    }
  };

  const handleOpenExhibit = (evidenceId: string) => {
    const found = evidenceList.find(e => e.id === evidenceId);
    if (found) {
      setActiveEvidenceModal(found);
    }
  };

  return (
    <div className="space-y-4">
      {/* Platform Filter Chips */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" />
          <h4 className="text-sm font-bold text-white uppercase tracking-wider">
            Chronological Forensic Timeline ({events.length} Events)
          </h4>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => setSelectedPlatform(p)}
              className={`text-xs px-2.5 py-1 rounded-md transition-all font-medium ${
                selectedPlatform === p
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Event List */}
      {filteredEvents.length === 0 ? (
        <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs">
          No timeline events recorded yet. Upload a screenshot above or click "Load Demo Case".
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {filteredEvents.map((event, idx) => (
            <div
              key={event.id || idx}
              className="relative bg-slate-900/90 rounded-xl border border-slate-800 p-4 transition-all hover:border-slate-700 shadow-md group"
            >
              {/* Timeline dot */}
              <div className="absolute -left-[27px] top-4 w-3.5 h-3.5 rounded-full bg-slate-950 border-2 border-emerald-500 group-hover:scale-125 transition-transform" />

              <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    {getPlatformIcon(event.platform)}
                    {event.platform}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    From: <b className="text-slate-200">{event.actor_handle}</b>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-slate-400">
                    {event.timestamp_iso}
                  </span>
                  {getSeverityBadge(event.severity)}
                </div>
              </div>

              {/* Verbatim quote or summary */}
              {event.verbatim_quote && (
                <div className="my-2.5 p-3 rounded-lg bg-slate-950/80 border-l-2 border-rose-500/80 text-xs text-slate-200 italic font-sans leading-relaxed">
                  "{event.verbatim_quote}"
                </div>
              )}

              <p className="text-xs text-slate-400 mb-3">
                {event.summary}
              </p>

              {/* Exhibit & Crypto Proof Footer */}
              <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono">
                <button
                  onClick={() => handleOpenExhibit(event.evidence_id)}
                  className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30 transition-all"
                >
                  <Eye className="w-3 h-3" />
                  <span>Inspect Exhibit [{event.evidence_id}]</span>
                </button>

                <div className="flex items-center gap-1 text-slate-500">
                  <Hash className="w-3 h-3" />
                  <span className="truncate max-w-[200px]" title={event.evidence_sha256}>
                    SHA: {event.evidence_sha256.substring(0, 16)}...
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Exhibit Inspection Modal */}
      {activeEvidenceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  Exhibit Verification [{activeEvidenceModal.id}]
                </h3>
              </div>
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-slate-800"
              >
                Close ✕
              </button>
            </div>

            <div className="space-y-2.5 text-xs font-mono">
              <div>
                <span className="text-slate-400 block">Original Filename:</span>
                <span className="text-slate-200 font-semibold">{activeEvidenceModal.filename}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Platform & Type:</span>
                <span className="text-emerald-400">{activeEvidenceModal.platform} ({activeEvidenceModal.file_type})</span>
              </div>
              <div>
                <span className="text-slate-400 block">SHA-256 Cryptographic Hash (Immutable):</span>
                <div className="p-2 rounded bg-slate-950 text-emerald-300 break-all select-all border border-slate-800">
                  {activeEvidenceModal.sha256_hash}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-400 block">Perceptual pHash:</span>
                  <span className="text-slate-300">{activeEvidenceModal.phash || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Perceptual dHash:</span>
                  <span className="text-slate-300">{activeEvidenceModal.dhash || 'N/A'}</span>
                </div>
              </div>
              {activeEvidenceModal.exif_metadata && (
                <div>
                  <span className="text-slate-400 block">EXIF Audit:</span>
                  <pre className="p-2 rounded bg-slate-950 text-[10px] text-slate-300 overflow-x-auto border border-slate-800">
                    {JSON.stringify(activeEvidenceModal.exif_metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setActiveEvidenceModal(null)}
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                Verified & Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
