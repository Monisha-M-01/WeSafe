import React, { useState } from 'react';
import { EvidenceItem } from '../types/reclaim';
import { GitBranch, ShieldCheck, ShieldAlert, Cpu, Lock, CheckCircle2, RefreshCw } from 'lucide-react';
import { soundFX } from '../utils/soundEffects';

interface MerkleTreeVisualizerProps {
  evidenceList: EvidenceItem[];
  masterMerkleRoot: string;
}

export const MerkleTreeVisualizer: React.FC<MerkleTreeVisualizerProps> = ({
  evidenceList,
  masterMerkleRoot
}) => {
  const [tamperedExhibit, setTamperedExhibit] = useState<string | null>(null);

  const handleToggleTamper = (id: string) => {
    if (tamperedExhibit === id) {
      setTamperedExhibit(null);
      soundFX.playSeal();
    } else {
      setTamperedExhibit(id);
      soundFX.playAlert();
    }
  };

  const isTampered = !!tamperedExhibit;

  // Level 0: Leaves
  const leaves = evidenceList.slice(0, 4);

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-5 h-5 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Interactive Merkle Tree Forensic Verification Graph
            </h4>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visualizes pairwise mathematical cryptographic hashing. Modifying even 1 byte in any exhibit breaks the Master Seal.
          </p>
        </div>

        {/* Live Tamper Test Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleToggleTamper(leaves[2]?.id || 'EV-003')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all border ${
              isTampered
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/20 animate-pulse'
                : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isTampered ? 'animate-spin' : ''}`} />
            <span>{isTampered ? 'Reset Integrity Test' : '⚡ Simulate Tampering on EV-003'}</span>
          </button>
        </div>
      </div>

      {/* Visual Merkle Graph */}
      <div className="flex flex-col items-center gap-6 py-4 overflow-x-auto">
        {/* Top Node: Master Merkle Root */}
        <div className="flex flex-col items-center">
          <div className={`p-4 rounded-2xl border transition-all duration-300 max-w-md text-center ${
            isTampered
              ? 'bg-rose-950/40 border-rose-500/80 shadow-xl shadow-rose-500/20 text-rose-300'
              : 'bg-emerald-950/40 border-emerald-500/80 shadow-xl shadow-emerald-500/20 text-emerald-300'
          }`}>
            <div className="flex items-center justify-center gap-2 mb-1">
              {isTampered ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400 animate-bounce" />
                  <span className="text-xs font-bold text-rose-400 font-mono tracking-wider">
                    [TAMPER DETECTED // MASTER ROOT INVALIDATED]
                  </span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-400 font-mono tracking-wider">
                    MASTER MERKLE INTEGRITY ROOT (SEALED)
                  </span>
                </>
              )}
            </div>
            <div className="text-[11px] font-mono break-all font-semibold bg-black/40 px-3 py-1.5 rounded-lg border border-white/5">
              {isTampered
                ? 'FAIL_9e2b10a48d...DISCREPANCY_DETECTED'
                : (masterMerkleRoot || '09927625f4c33f0f47139ebe43b7dba352a571127090cdce9a07cb419433de4e')}
            </div>
          </div>

          {/* Stem connector */}
          <div className={`w-0.5 h-8 transition-colors ${isTampered ? 'bg-rose-500' : 'bg-cyan-500/60'}`} />
        </div>

        {/* Level 1: Pairwise Branches */}
        <div className="grid grid-cols-2 gap-8 md:gap-16 w-full max-w-2xl">
          {/* Branch A (EV-001 + EV-002) */}
          <div className="flex flex-col items-center">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center w-full">
              <span className="text-[10px] font-mono text-cyan-400 block font-bold mb-1">
                Node Hash [EV-001 + EV-002]
              </span>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                sha256(h1 + h2) • 4a8f90c1...71e2
              </div>
            </div>
            <div className="w-0.5 h-6 bg-slate-700" />
          </div>

          {/* Branch B (EV-003 + EV-004) */}
          <div className="flex flex-col items-center">
            <div className={`p-3 rounded-xl border text-center w-full transition-all ${
              isTampered
                ? 'bg-rose-950/30 border-rose-500/60 text-rose-300'
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              <span className={`text-[10px] font-mono block font-bold mb-1 ${
                isTampered ? 'text-rose-400' : 'text-cyan-400'
              }`}>
                {isTampered ? '⚠️ Corrupted Hash [EV-003* + EV-004]' : 'Node Hash [EV-003 + EV-004]'}
              </span>
              <div className="text-[10px] font-mono truncate">
                {isTampered ? 'MISMATCH_e7c390...4f19' : 'sha256(h3 + h4) • c821a990...4f19'}
              </div>
            </div>
            <div className={`w-0.5 h-6 ${isTampered ? 'bg-rose-500' : 'bg-slate-700'}`} />
          </div>
        </div>

        {/* Level 0: Leaves (Individual Exhibits) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
          {leaves.map((ev, idx) => {
            const isThisTampered = tamperedExhibit === ev.id;
            return (
              <div
                key={ev.id || idx}
                onClick={() => handleToggleTamper(ev.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer select-none text-left ${
                  isThisTampered
                    ? 'bg-rose-950/40 border-rose-500 text-rose-200 shadow-lg shadow-rose-500/20'
                    : 'bg-slate-950/80 border-slate-800 hover:border-cyan-500/50 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className={`text-xs font-mono font-bold ${
                    isThisTampered ? 'text-rose-400' : 'text-emerald-400'
                  }`}>
                    [{ev.id}]
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                    {ev.platform}
                  </span>
                </div>
                <div className="text-[11px] font-sans font-medium text-slate-200 truncate">
                  {ev.filename}
                </div>
                <div className="text-[10px] font-mono text-slate-500 mt-2 truncate" title={ev.sha256_hash}>
                  {isThisTampered ? 'TAMPERED_MODIFIED_BYTES_XX' : `SHA: ${ev.sha256_hash.substring(0, 14)}...`}
                </div>
                <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className={isThisTampered ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {isThisTampered ? 'BROKEN' : 'VALID LEAF'}
                  </span>
                  <span className="text-slate-500 text-[9px] underline">Click to test</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
