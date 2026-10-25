import React, { useState, useRef } from 'react';
import { UploadCloud, CheckCircle2, ShieldCheck, AlertCircle, FileText, Loader2 } from 'lucide-react';
import { computeClientSHA256 } from '../utils/clientCrypto';
import { uploadEvidence } from '../services/api';
import { EvidenceItem } from '../types/reclaim';

interface EvidenceUploaderProps {
  caseId: string;
  onUploaded: (item: EvidenceItem) => void;
}

export const EvidenceUploader: React.FC<EvidenceUploaderProps> = ({ caseId, onUploaded }) => {
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [clientHash, setClientHash] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file) return;
    setError(null);
    setProcessing(true);
    setFileName(file.name);
    setStatusMessage('1. Computing client-side SHA-256 digest in browser memory...');

    try {
      // Step 1: Client-side cryptographic hash
      const hash = await computeClientSHA256(file);
      setClientHash(hash);
      setStatusMessage('2. Browser digest verified. Sending to RECLAIM forensic pipeline...');

      // Step 2: Ingestion & Gemini Vision OCR / Timeline Extraction
      const item = await uploadEvidence(caseId, file, hash);
      setStatusMessage('3. Evidence sealed & Multimodal timeline event extracted!');
      onUploaded(item);

      setTimeout(() => {
        setProcessing(false);
        setStatusMessage(null);
        setClientHash(null);
        setFileName(null);
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Evidence upload failed');
      setProcessing(false);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const onDragLeave = () => setDragActive(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-emerald-400" />
            Cryptographic Evidence Ingestion
          </h3>
          <p className="text-xs text-slate-400">
            Upload WhatsApp, Instagram, or SMS screenshots. Web Crypto computes SHA-256 before transmission.
          </p>
        </div>
        <span className="hidden sm:inline-flex text-[11px] font-mono font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20">
          Client-Side Hashing Active
        </span>
      </div>

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          dragActive
            ? 'border-emerald-500 bg-emerald-500/10 scale-[1.01]'
            : 'border-slate-700 hover:border-slate-500 bg-slate-950/50 hover:bg-slate-900/50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />

        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 border border-slate-700">
            {processing ? (
              <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6 text-slate-300" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-200">
              Drag & drop screenshot here, or <span className="text-emerald-400 underline">browse</span>
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supports PNG, JPG, WEBP • Zero compression • Automatic EXIF metadata audit
            </p>
          </div>
        </div>
      </div>

      {/* Real-time Crypto Sealing Progress */}
      {processing && (
        <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
            <span>{statusMessage}</span>
          </div>

          {clientHash && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 flex flex-col gap-1 font-mono text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span>File: {fileName}</span>
                <span className="text-emerald-400 flex items-center gap-1 font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" /> Client Sealed
                </span>
              </div>
              <div className="text-slate-300 bg-slate-900 px-2 py-1 rounded truncate">
                SHA-256: {clientHash}
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
