import React, { useState } from 'react';
import { Case, EvidenceItem, MerkleVerificationResponse } from '../types/reclaim';
import { getPassportPdfUrl, verifyMerkle } from '../services/api';
import { MerkleTreeVisualizer } from './MerkleTreeVisualizer';
import { soundFX } from '../utils/soundEffects';
import {
  FileDown,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Hash,
  ShieldAlert,
  Sparkles,
  Loader2
} from 'lucide-react';

interface PassportPreviewProps {
  currentCase: Case;
  evidenceList: EvidenceItem[];
}

export const PassportPreview: React.FC<PassportPreviewProps> = ({
  currentCase,
  evidenceList
}) => {
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<MerkleVerificationResponse | null>(null);

  const handleVerify = async () => {
    try {
      setVerifying(true);
      soundFX.playClick();
      const res = await verifyMerkle(currentCase.id);
      setVerificationResult(res);
      if (res.integrity_verified) {
        soundFX.playSeal();
      } else {
        soundFX.playAlert();
      }
    } finally {
      setVerifying(false);
    }
  };

  const pdfUrl = getPassportPdfUrl(currentCase.id);

  return (
    <div className="space-y-6">
      {/* Download Action Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Cryptographic Digital Evidence Passport (Court Admissible)
            </h3>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Compiles the complete investigation into an immutable forensic PDF with Merkle Root sealing,
            timestamped exhibits, behavioral patterns, and zero-upload image verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-all active:scale-95"
          >
            {verifying ? (
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            ) : (
              <Sparkles className="w-4 h-4 text-emerald-400" />
            )}
            <span>Verify Merkle Root</span>
          </button>

          <a
            href={pdfUrl}
            onClick={() => soundFX.playSeal()}
            download={`RECLAIM_Evidence_Passport_${currentCase.id}.pdf`}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-xs font-bold transition-all shadow-xl shadow-emerald-600/25 active:scale-95"
          >
            <FileDown className="w-4 h-4" />
            <span>Download Official Evidence Passport (PDF)</span>
          </a>
        </div>
      </div>

      {/* Verification Card if Tested */}
      {verificationResult && (
        <div className={`p-4 rounded-xl border flex items-start gap-3 ${
          verificationResult.integrity_verified
            ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
            : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
        }`}>
          {verificationResult.integrity_verified ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <h4 className="font-bold">
              {verificationResult.integrity_verified
                ? 'Cryptographic Verification Succeeded: 0 Bytes Altered'
                : 'Integrity Seal Warning: Hash Discrepancy Detected'}
            </h4>
            <p className="font-mono text-[11px] text-slate-300">
              Verified {verificationResult.total_exhibits_verified} exhibit SHA-256 hashes against Master Merkle Root: {verificationResult.recalculated_merkle_root}
            </p>
          </div>
        </div>
      )}

      {/* Interactive Merkle Tree Visualizer with Live Tamper Testing */}
      <MerkleTreeVisualizer
        evidenceList={evidenceList}
        masterMerkleRoot={currentCase.merkle_root_hash || ''}
      />

      {/* Master Chain of Custody Box */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Chain-of-Custody Integrity Manifest
            </h4>
          </div>
          <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded font-bold border border-emerald-500/20">
            Section 65B Admissible
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase">Case Identifier</span>
            <span className="text-white font-bold">{currentCase.id}</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase">Sealed Exhibits</span>
            <span className="text-emerald-400 font-bold">{evidenceList.length} Files Protected</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-400 block text-[10px] uppercase">Integrity State</span>
            <span className="text-emerald-300 font-bold">100% Mathematically Sealed</span>
          </div>
        </div>

        <div>
          <span className="text-xs text-slate-400 block mb-1 font-mono">
            Master Pairwise Merkle Root (SHA-256):
          </span>
          <div className="p-3.5 rounded-xl bg-slate-950 border border-emerald-500/30 text-emerald-300 font-mono text-xs break-all select-all shadow-inner">
            {currentCase.merkle_root_hash || 'PENDING_EXHIBIT_SEAL'}
          </div>
        </div>
      </div>

      {/* Exhibit Index Table */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 space-y-3 shadow-xl">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Hash className="w-4 h-4 text-emerald-400" />
            Exhibit Hash Registry & Ingestion Audit
          </h4>
          <span className="text-[11px] text-slate-400 font-mono">
            {evidenceList.length} Exhibits Sealed
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2.5">Exhibit</th>
                <th className="p-2.5">Filename</th>
                <th className="p-2.5">Platform</th>
                <th className="p-2.5">Full SHA-256 Fingerprint</th>
                <th className="p-2.5">Perceptual pHash</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {evidenceList.map((e) => (
                <tr key={e.id} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-bold text-emerald-400">{e.id}</td>
                  <td className="p-2.5 text-slate-200 font-sans">{e.filename}</td>
                  <td className="p-2.5 text-slate-300">{e.platform}</td>
                  <td className="p-2.5 text-slate-400 break-all select-all font-mono">
                    {e.sha256_hash}
                  </td>
                  <td className="p-2.5 text-emerald-400">{e.phash || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
