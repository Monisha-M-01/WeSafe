import React, { useState } from 'react';
import { Shield, ShieldAlert, Zap, Lock, Volume2, VolumeX, Eye, Activity } from 'lucide-react';
import { Case } from '../types/reclaim';
import { soundFX } from '../utils/soundEffects';

interface NavbarProps {
  currentCase: Case | null;
  onSeedDemo: () => Promise<void>;
  onQuickExit: () => void;
  discreetMode: boolean;
  onToggleDiscreetMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCase,
  onSeedDemo,
  onQuickExit,
  discreetMode,
  onToggleDiscreetMode
}) => {
  const [seeding, setSeeding] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const handleSeed = async () => {
    try {
      setSeeding(true);
      soundFX.playClick();
      await onSeedDemo();
      soundFX.playSeal();
    } finally {
      setSeeding(false);
    }
  };

  const toggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    soundFX.enabled = next;
    if (next) soundFX.playClick();
  };

  const truncatedMerkle = currentCase?.merkle_root_hash
    ? `${currentCase.merkle_root_hash.substring(0, 8)}...${currentCase.merkle_root_hash.substring(currentCase.merkle_root_hash.length - 8)}`
    : 'PENDING_SEAL';

  return (
    <header className="sticky top-0 z-50 bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/25 ring-1 ring-emerald-400/30">
            <Shield className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-wider bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                {discreetMode ? 'RECLAIM STUDY' : 'RECLAIM'}
              </span>
              <span className="text-[10px] font-mono tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold uppercase flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Forensic v1.0
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              {discreetMode ? 'Digital Communication Archive & Research Interface' : 'AI Digital Safety & Cryptographic Evidence Response Platform'}
            </p>
          </div>
        </div>

        {/* Action Controls & Panic Exit */}
        <div className="flex items-center flex-wrap gap-2.5">
          {/* Active Merkle Hash Badge */}
          {currentCase && (
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono shadow-inner">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-slate-400">Root:</span>
              <span className="text-emerald-300 font-semibold" title={currentCase.merkle_root_hash}>
                {truncatedMerkle}
              </span>
              <span className="text-[10px] bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded font-bold uppercase">
                Sealed
              </span>
            </div>
          )}

          {/* Sound FX Toggle */}
          <button
            onClick={toggleAudio}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs transition-all active:scale-95"
            title={audioEnabled ? 'Mute synthesized sound effects' : 'Enable synthesized sound effects'}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Discreet Mode Toggle */}
          <button
            onClick={() => { onToggleDiscreetMode(); soundFX.playClick(); }}
            className={`p-2 rounded-xl border text-xs transition-all active:scale-95 ${
              discreetMode
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Discreet Research View (inoffensive academic disguise)"
          >
            <Eye className="w-4 h-4" />
          </button>

          {/* 1-Click Demo Case Button for Judges */}
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold transition-all shadow-sm hover:shadow-amber-500/15 active:scale-95"
            title="Load complete multi-platform stalking scenario with 4 exhibits and pre-computed patterns"
          >
            <Zap className={`w-3.5 h-3.5 text-amber-400 ${seeding ? 'animate-spin' : ''}`} />
            <span>{seeding ? 'Seeding Case...' : '⚡ Load Demo Case (Maya)'}</span>
          </button>

          {/* Quick Exit Panic Button */}
          <button
            onClick={onQuickExit}
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 active:scale-95 group"
            title="Emergency Quick Exit: Press ESC twice or click to wipe screen and redirect to Google Weather"
          >
            <ShieldAlert className="w-4 h-4 transition-transform group-hover:scale-110" />
            <span>QUICK EXIT</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 bg-rose-800 text-[10px] rounded-md font-mono border border-rose-500/40">
              ESC × 2
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
};
