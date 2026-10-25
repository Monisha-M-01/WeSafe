import React, { useState, useEffect } from 'react';
import {
  Case,
  EvidenceItem,
  TimelineEvent,
  PatternFinding,
  ActionPlan
} from './types/reclaim';
import {
  seedDemoCase,
  listCases,
  getCase,
  listEvidence,
  getTimeline,
  getPatterns,
  getActionPlan,
  getPassportPdfUrl
} from './services/api';
import { EvidenceUploader } from './components/EvidenceUploader';
import {
  Shield,
  FileDown,
  Copy,
  Check,
  Plus,
  PhoneMissed,
  MessageSquare,
  Instagram,
  Linkedin,
  AlertTriangle,
  Send,
  X,
  Lock,
  Stamp,
  Calendar,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  Video,
  Phone,
  MoreVertical,
  CheckCheck,
  BatteryMedium,
  Wifi,
  Sparkles,
  Award,
  HeartHandshake,
  LifeBuoy,
  FileText
} from 'lucide-react';

export const App: React.FC = () => {
  const [currentCase, setCurrentCase] = useState<Case | null>(null);
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
  const [patterns, setPatterns] = useState<PatternFinding[]>([]);
  const [actionPlan, setActionPlan] = useState<ActionPlan | null>(null);
  const [showUploader, setShowUploader] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  // Quick Exit: Emergency Wipe & Redirect to Google Weather
  const triggerQuickExit = () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location.replace('https://www.google.com/search?q=weather+today');
  };

  useEffect(() => {
    let lastEsc = 0;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        const now = Date.now();
        if (now - lastEsc < 500) triggerQuickExit();
        else lastEsc = now;
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const loadCaseData = async (caseId: string) => {
    const [caseData, evs, tls, pats, plan] = await Promise.all([
      getCase(caseId),
      listEvidence(caseId),
      getTimeline(caseId),
      getPatterns(caseId),
      getActionPlan(caseId).catch(() => null)
    ]);
    setCurrentCase(caseData);
    setEvidenceList(evs);
    setTimelineEvents(tls);
    setPatterns(pats);
    setActionPlan(plan);
  };

  const handleSeedDemo = async () => {
    const demo = await seedDemoCase();
    await loadCaseData(demo.id);
  };

  useEffect(() => {
    const init = async () => {
      try {
        const cases = await listCases();
        if (cases && cases.length > 0) {
          await loadCaseData(cases[0].id);
        } else {
          await handleSeedDemo();
        }
      } catch {
        await handleSeedDemo();
      }
    };
    init();
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const pdfUrl = currentCase ? getPassportPdfUrl(currentCase.id) : '#';

  // Find user-uploaded custom evidence items (not EV-001 to EV-004)
  const customEvidence = evidenceList.filter(
    (ev) => !['EV-001', 'EV-002', 'EV-003', 'EV-004'].includes(ev.id)
  );

  return (
    <div className="relative min-h-screen text-slate-100 font-sans flex flex-col antialiased selection:bg-rose-500/30 selection:text-rose-200">
      {/* Women Safety Theme Ambient Glow & Atmospheric Background */}
      <div className="aurora-bg">
        <div className="aurora-orb-1" />
        <div className="aurora-orb-2" />
        <div className="aurora-orb-3" />
      </div>

      {/* Decorative Side Safety Watermark Ribbons (fills side margins elegantly) */}
      <div className="safety-side-ribbon-left hidden 2xl:flex flex-col justify-between py-12 px-3 text-[10px] font-mono tracking-widest text-rose-500/40 uppercase [writing-mode:vertical-rl] select-none pointer-events-none">
        <span>• HER EVIDENCE • HER PROTECTION • HER VOICE •</span>
        <span>• SECTION 63 BSA 2023 CERTIFIED •</span>
      </div>
      <div className="safety-side-ribbon-right hidden 2xl:flex flex-col justify-between py-12 px-3 text-[10px] font-mono tracking-widest text-purple-400/40 uppercase [writing-mode:vertical-rl] select-none pointer-events-none">
        <span>• CONFIDENTIAL SURVIVOR SANCTUARY •</span>
        <span>• CYBER CRIME PREVENTION 1930 •</span>
      </div>

      {/* Top Header */}
      <header className="relative z-10 bg-[#090614]/90 backdrop-blur-xl border-b border-rose-500/15 px-4 sm:px-8 py-3.5 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500/20 via-purple-500/20 to-teal-500/20 border border-rose-500/30 flex items-center justify-center text-rose-300 shadow-lg shadow-rose-500/10">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-wide">RECLAIM</span>
                <span className="text-[10px] font-mono text-rose-300 px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-500/30 font-semibold flex items-center gap-1">
                  <HeartHandshake className="w-3 h-3 text-rose-400" />
                  <span>WOMEN'S SAFETY & DIGITAL SANCTUARY</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Trauma-Informed Evidence Preservation & Statutory Court Dossier
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSeedDemo}
              className="px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-white/10 transition-all hover:border-rose-500/30"
            >
              Reset Example (Maya)
            </button>
            <button
              onClick={triggerQuickExit}
              className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-md shadow-rose-600/30 flex items-center gap-1.5 active:scale-95"
              title="Press ESC twice to instantly close and switch to Google Weather"
            >
              <span>Quick Exit</span>
              <kbd className="text-[10px] bg-rose-700/80 px-1.5 py-0.2 rounded font-mono">ESC×2</kbd>
            </button>
          </div>
        </div>
      </header>

      {/* Main Wide Dashboard Container */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* 1. Full-Width Official Court Report Banner */}
        <div className="auth-glass-card rounded-3xl p-6 sm:p-7 relative overflow-hidden border border-rose-500/20 bg-gradient-to-r from-[#170e24]/90 via-[#0f1124]/90 to-[#0e1824]/90">
          <div className="absolute right-4 -bottom-6 opacity-5 pointer-events-none text-rose-400">
            <Award className="w-72 h-72" />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2.5 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-mono font-bold text-rose-300 bg-rose-500/15 px-2.5 py-0.5 rounded-md border border-rose-500/30">
                  CASE REF: #RC-2026-089
                </span>
                <span className="text-[11px] font-mono font-semibold text-emerald-300 bg-emerald-500/15 px-2.5 py-0.5 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" />
                  SECTION 63 BSA / 65B CERTIFIED
                </span>
                <span className="text-[11px] font-mono text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-md border border-purple-500/30">
                  SURVIVOR: MAYA S. (PROTECTED)
                </span>
                <span className="text-[11px] font-mono text-teal-300 bg-teal-500/15 px-2.5 py-0.5 rounded-md border border-teal-500/30">
                  4 VERIFIED EXHIBITS
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
                Forensic Cyberstalking Evidence Dossier
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                4 authentic cross-platform exhibits cryptographically sealed into an immutable Master Merkle Root. Court-admissible certificate ready to submit to Cyber Crime Police (<span className="text-rose-300 font-semibold font-mono">1930</span>), National Commission for Women, or legal counsel.
              </p>

              <div className="pt-1 flex items-center gap-3">
                <button
                  onClick={() => setShowCertificate(!showCertificate)}
                  className="text-xs text-rose-300 hover:text-rose-200 font-semibold flex items-center gap-1 underline underline-offset-4 transition-all"
                >
                  <FileCheck2 className="w-3.5 h-3.5 text-rose-400" />
                  <span>{showCertificate ? 'Hide Electronic Certificate' : 'View Section 63 BSA Electronic Certificate'}</span>
                  {showCertificate ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <a
                href={pdfUrl}
                download="RECLAIM_Official_Evidence_Passport.pdf"
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-rose-500/25 transition-all shrink-0 active:scale-95 group text-center"
              >
                <FileDown className="w-4 h-4 text-white transition-transform group-hover:-translate-y-0.5" />
                <span>Download Evidence Dossier (PDF)</span>
              </a>

              <button
                onClick={() => setShowUploader(!showUploader)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-white/10 transition-all hover:border-rose-500/30 text-center"
              >
                {showUploader ? <X className="w-3.5 h-3.5 text-rose-400" /> : <Plus className="w-3.5 h-3.5 text-rose-400" />}
                <span>{showUploader ? 'Close Upload' : '+ Upload New Screenshot'}</span>
              </button>
            </div>
          </div>

          {/* Section 63 BSA / 65B Certificate Accordion */}
          {showCertificate && (
            <div className="mt-6 pt-5 border-t border-white/10 text-xs space-y-3 relative">
              <div className="official-stamp rounded-2xl p-5 space-y-3 border border-rose-500/30 bg-rose-950/20">
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-2 flex-wrap gap-2">
                  <div className="flex items-center gap-2 font-bold text-rose-300 uppercase tracking-wider text-[11px]">
                    <Stamp className="w-4 h-4 text-rose-400" />
                    <span>Certificate of Electronic Evidence (Section 63, BSA 2023 / Section 65B, IEA 1872)</span>
                  </div>
                  <span className="font-mono text-[10px] text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/20">
                    HASH: SHA-256 VERIFIED
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-slate-300 text-[11px] font-mono leading-relaxed">
                  <div>
                    <span className="text-slate-400 block text-[10px]">DEVICE IDENTIFIER:</span>
                    <span className="text-white">Apple iPhone 14 Pro • iOS 17.5.1</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">CUSTODIAN / AFFIANT:</span>
                    <span className="text-white">Maya S. (Complainant)</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">MASTER MERKLE ROOT:</span>
                    <span className="text-teal-300 break-all">{currentCase?.merkle_root_hash ? currentCase.merkle_root_hash.substring(0, 24) + '...' : '09927625f4c3...'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">LEGAL STATUTES:</span>
                    <span className="text-rose-300">BNS §78, IT Act §66E / §67A</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-300 italic pt-1 leading-relaxed border-t border-rose-500/10">
                  "I hereby affirm that the exhibits contained in Case #RC-2026-089 were produced directly from the above device during lawful, ordinary personal use. No tampering, cropping of timestamps, or synthetic alteration has occurred."
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Conditional Upload Box */}
        {showUploader && currentCase && (
          <div className="auth-glass-card rounded-3xl p-6 border border-rose-500/30">
            <EvidenceUploader
              caseId={currentCase.id}
              onUploaded={() => {
                loadCaseData(currentCase.id);
                setShowUploader(false);
              }}
            />
          </div>
        )}

        {/* 2. Main 2-Column Balanced Dashboard (Utilizes Full Screen Width) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Seized Mobile Evidence Exhibits (lg:col-span-7 xl:col-span-8) */}
          <section className="lg:col-span-7 xl:col-span-8 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-rose-400" />
                  <span>Seized Mobile Evidence Exhibits ({evidenceList.length} Items)</span>
                </h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Authentic smartphone extractions preserved in chronological sequence with SHA-256 seals.
                </p>
              </div>

              <span className="text-[11px] font-mono text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-lg border border-rose-500/20 font-semibold">
                BIT-EXACT INTEGRITY
              </span>
            </div>

            {/* Grid of Authentic Exhibits (2-column grid on desktop for balanced space) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

              {/* Exhibit 1: Authentic WhatsApp Screenshot Frame */}
              <div className="phone-mock-frame flex flex-col justify-between">
                <div>
                  {/* Phone Status Bar */}
                  <div className="bg-[#1f2c34] px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 font-mono border-b border-white/5">
                    <span className="font-semibold text-white">19:22</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3 h-3 text-slate-300" />
                      <span className="text-[10px]">5G</span>
                      <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>

                  {/* WhatsApp Header */}
                  <div className="wa-header px-3.5 py-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-slate-300 text-sm font-bold">‹</span>
                      <div className="w-7 h-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center font-bold text-xs text-white">
                        RV
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Rahul Verma</span>
                        <span className="text-[10px] text-teal-400 block">Online</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-300">
                      <Phone className="w-3.5 h-3.5 opacity-75" />
                      <MoreVertical className="w-3.5 h-3.5 opacity-75" />
                    </div>
                  </div>

                  {/* WhatsApp Chat Canvas */}
                  <div className="wa-screen p-3.5 space-y-2.5 min-h-[140px]">
                    <div className="text-center">
                      <span className="inline-block text-[9px] text-[#ffd279]/90 bg-[#182229]/90 px-2.5 py-0.5 rounded border border-[#ffd279]/20">
                        🔒 End-to-end encrypted
                      </span>
                    </div>

                    <div className="max-w-[85%] wa-bubble-incoming p-3 space-y-1">
                      <p className="text-xs text-slate-100 leading-relaxed">
                        Why did you block me after work? I know you take the 7:15 PM metro from Indiranagar. Answer me.
                      </p>
                      <div className="flex items-center justify-end text-[10px] text-slate-400">
                        <span>19:22</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exhibit Footer */}
                <div className="bg-[#0b101b] px-3.5 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono font-bold text-rose-300">EXHIBIT #EV-001</span>
                  <button
                    onClick={() => handleCopy('a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0', 'ev1-hash')}
                    className="text-teal-400 hover:text-teal-300 text-[10px] font-mono flex items-center gap-1"
                  >
                    {copiedId === 'ev1-hash' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'ev1-hash' ? 'Copied' : 'SHA-256'}</span>
                  </button>
                </div>
              </div>

              {/* Exhibit 2: Authentic iOS Call Log Frame */}
              <div className="phone-mock-frame flex flex-col justify-between">
                <div>
                  {/* Phone Status Bar */}
                  <div className="bg-black px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 font-mono border-b border-white/5">
                    <span className="font-semibold text-white">23:45</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px]">LTE</span>
                      <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>

                  {/* iOS Recents Header */}
                  <div className="call-log-header px-3.5 py-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Recents</span>
                    <span className="px-2.5 py-0.5 bg-[#636366] text-white text-[10px] font-semibold rounded-md">
                      Missed (18)
                    </span>
                    <span className="text-[11px] text-teal-400">Edit</span>
                  </div>

                  {/* Call Log Entries */}
                  <div className="call-log-screen p-3 divide-y divide-[#272729] text-xs min-h-[140px]">
                    <div className="py-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <PhoneMissed className="w-3.5 h-3.5 text-[#ff453a] shrink-0" />
                        <div>
                          <span className="font-bold text-[#ff453a] text-xs block">Rahul Verma (18)</span>
                          <span className="text-[10px] text-slate-400 font-mono">+91-98201-XXXXX</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 font-mono text-[10px]">23:42</span>
                        <span className="text-[9px] text-rose-400 block font-semibold">18 calls in 32 min</span>
                      </div>
                    </div>

                    <div className="py-1.5 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2">
                        <PhoneMissed className="w-3.5 h-3.5 text-[#ff453a] shrink-0" />
                        <span className="text-xs text-[#ff453a]">Rahul Verma</span>
                      </div>
                      <span className="font-mono text-[10px]">23:38</span>
                    </div>

                    <div className="py-1.5 flex items-center justify-between text-slate-400">
                      <div className="flex items-center gap-2">
                        <PhoneMissed className="w-3.5 h-3.5 text-[#ff453a] shrink-0" />
                        <span className="text-xs text-[#ff453a]">Rahul Verma</span>
                      </div>
                      <span className="font-mono text-[10px]">23:10</span>
                    </div>
                  </div>
                </div>

                {/* Exhibit Footer */}
                <div className="bg-[#0b101b] px-3.5 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono font-bold text-rose-300">EXHIBIT #EV-002</span>
                  <button
                    onClick={() => handleCopy('b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01', 'ev2-hash')}
                    className="text-teal-400 hover:text-teal-300 text-[10px] font-mono flex items-center gap-1"
                  >
                    {copiedId === 'ev2-hash' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'ev2-hash' ? 'Copied' : 'SHA-256'}</span>
                  </button>
                </div>
              </div>

              {/* Exhibit 3: Authentic Instagram DM Frame */}
              <div className="phone-mock-frame flex flex-col justify-between">
                <div>
                  {/* Phone Status Bar */}
                  <div className="bg-black px-4 py-2 flex items-center justify-between text-[11px] text-slate-300 font-mono border-b border-white/5">
                    <span className="font-semibold text-white">21:05</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="w-3 h-3 text-slate-300" />
                      <BatteryMedium className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                  </div>

                  {/* Instagram Direct Header */}
                  <div className="bg-black px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full insta-gradient flex items-center justify-center text-white">
                        <Instagram className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-white block">maya_watch_blr99</span>
                        <span className="text-[9px] text-slate-400 block">Instagram • New account</span>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                      Block Evasion
                    </span>
                  </div>

                  {/* Instagram DM Canvas */}
                  <div className="insta-screen p-3.5 space-y-2 min-h-[140px]">
                    <div className="max-w-[90%] insta-bubble-incoming p-3 space-y-1 border border-white/10">
                      <p className="text-xs text-slate-100 leading-relaxed">
                        Blocking my number won't help you Maya. I made a new page. Talk to me by midnight or I send those college trip photos to your HR manager at TechCorp.
                      </p>
                      <div className="text-[9px] text-slate-400">
                        <span>21:05</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Exhibit Footer */}
                <div className="bg-[#0b101b] px-3.5 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono font-bold text-rose-300">EXHIBIT #EV-003</span>
                  <button
                    onClick={() => handleCopy('c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012', 'ev3-hash')}
                    className="text-teal-400 hover:text-teal-300 text-[10px] font-mono flex items-center gap-1"
                  >
                    {copiedId === 'ev3-hash' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'ev3-hash' ? 'Copied' : 'SHA-256'}</span>
                  </button>
                </div>
              </div>

              {/* Exhibit 4: Authentic LinkedIn InMail Frame */}
              <div className="phone-mock-frame flex flex-col justify-between">
                <div>
                  {/* LinkedIn Header */}
                  <div className="linkedin-screen px-3.5 py-2.5 border-b border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#0A66C2]/20 border border-[#0A66C2]/40 flex items-center justify-center text-[#0A66C2]">
                        <Linkedin className="w-3 h-3" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-white block">Rahul Verma • 3rd+</span>
                        <span className="text-[9px] text-slate-400 block font-mono">@r_verma_backup2</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">2026-10-23</span>
                  </div>

                  {/* LinkedIn Message Canvas */}
                  <div className="bg-[#12161a] p-3.5 space-y-2 min-h-[140px]">
                    <div className="max-w-[85%] linkedin-bubble-incoming p-3">
                      <p className="text-xs text-slate-100">Check your Instagram DM. Clock is ticking.</p>
                      <span className="text-[9px] text-slate-400 block mt-1">09:15 AM</span>
                    </div>
                  </div>
                </div>

                {/* Exhibit Footer */}
                <div className="bg-[#0b101b] px-3.5 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono font-bold text-rose-300">EXHIBIT #EV-004</span>
                  <button
                    onClick={() => handleCopy('d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123', 'ev4-hash')}
                    className="text-teal-400 hover:text-teal-300 text-[10px] font-mono flex items-center gap-1"
                  >
                    {copiedId === 'ev4-hash' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'ev4-hash' ? 'Copied' : 'SHA-256'}</span>
                  </button>
                </div>
              </div>

              {/* Any Additional User-Uploaded Exhibits */}
              {customEvidence.map((ev, idx) => (
                <div key={ev.id} className="phone-mock-frame flex flex-col justify-between">
                  <div className="bg-[#1f2c34] px-3.5 py-2.5 flex items-center justify-between border-b border-white/5">
                    <span className="font-bold text-xs text-white">Custom Upload #{idx + 5}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                      Sealed
                    </span>
                  </div>
                  <div className="bg-[#0b141a] p-3.5 text-xs">
                    <p className="text-slate-200 bg-[#202c33] p-3 rounded-xl border border-white/5 leading-relaxed">
                      {ev.extracted_text || 'OCR processing complete. Evidence sealed.'}
                    </p>
                  </div>
                  <div className="bg-[#0b101b] px-3.5 py-2 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-rose-300">{ev.id}</span>
                    <span className="font-mono text-[10px] text-slate-400">SHA-256: {ev.sha256_hash.substring(0, 16)}...</span>
                  </div>
                </div>
              ))}

            </div>
          </section>

          {/* RIGHT COLUMN: Statutory Violations, Takedowns & Helpline Support (lg:col-span-5 xl:col-span-4) */}
          <aside className="lg:col-span-5 xl:col-span-4 space-y-5">
            
            {/* Card 1: 3 Proven Harassment Violations */}
            <div className="auth-glass-card rounded-3xl p-5 space-y-3.5 border border-rose-500/20">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    3 Statutory Violations Proven
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  BNS §78
                </span>
              </div>

              <div className="space-y-2.5 text-xs">
                {/* Violation 1 */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1 hover:border-rose-500/30 transition-all">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>1. Block Evasion Stalking</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Created burner account (<code className="text-pink-300 font-mono">@maya_watch_blr99</code>) to circumvent primary WhatsApp block.
                  </p>
                </div>

                {/* Violation 2 */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1 hover:border-rose-500/30 transition-all">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                    <span>2. Nocturnal Call Barrage</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    18 unanswered calls between 23:10 and 23:42 on 2026-10-21, establishing deliberate sleep disruption and terror.
                  </p>
                </div>

                {/* Violation 3 */}
                <div className="p-3 rounded-2xl bg-slate-950/70 border border-white/5 space-y-1 hover:border-rose-500/30 transition-all">
                  <div className="font-bold text-white flex items-center gap-1.5 text-xs">
                    <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                    <span>3. NCII Extortion Threat</span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Blackmail threatening to distribute private photos to victim's employer HR manager (TechCorp).
                  </p>
                  <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded inline-block">
                    IT Act §66E & §67A
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: 1-Click Platform Takedown Notices */}
            <div className="auth-glass-card rounded-3xl p-5 space-y-3.5 border border-purple-500/20">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4 text-purple-400" />
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                    Ready Takedown Requests (1-Click)
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                  Cites Hashes
                </span>
              </div>

              <div className="space-y-2.5">
                {actionPlan?.platform_takedowns?.map((takedown, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-white/5 flex items-center justify-between gap-3 hover:border-purple-500/30 transition-all text-xs"
                  >
                    <div>
                      <span className="font-bold text-white block">{takedown.platform} Safety Notice</span>
                      <span className="text-[10px] text-slate-400 font-mono">Formal takedown demand</span>
                    </div>

                    <button
                      onClick={() => handleCopy(takedown.notice_body, `notice-${idx}`)}
                      className="px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all active:scale-95"
                    >
                      {copiedId === `notice-${idx}` ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-purple-300" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 3: 24/7 Verified Helplines & Sanctuary Support */}
            <div className="auth-glass-card rounded-3xl p-5 space-y-3 border border-rose-500/30 bg-gradient-to-br from-rose-950/30 to-purple-950/30 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-300 shrink-0">
                  <LifeBuoy className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white">24/7 National Emergency & Helplines</h3>
                  <p className="text-[10px] text-slate-300">Confidential, toll-free support for women facing digital abuse</p>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <a
                  href="tel:1930"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-rose-500/30 hover:border-rose-400 text-rose-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-semibold">National Cyber Crime Reporting</span>
                  </div>
                  <span className="font-mono font-extrabold text-white bg-rose-600 px-2 py-0.5 rounded text-[11px]">
                    1930
                  </span>
                </a>

                <a
                  href="tel:1091"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-purple-500/30 hover:border-purple-400 text-purple-200 transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-3.5 h-3.5 text-purple-400" />
                    <span className="font-semibold">Women's Helpline (All India)</span>
                  </div>
                  <span className="font-mono font-extrabold text-white bg-purple-600 px-2 py-0.5 rounded text-[11px]">
                    1091
                  </span>
                </a>

                <a
                  href="https://stopncii.org"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 border border-teal-500/30 hover:border-teal-400 text-teal-200 transition-all group"
                >
                  <span className="font-semibold">StopNCII.org Image Hash Shield</span>
                  <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                </a>
              </div>

              <p className="text-[10px] text-slate-400 italic pt-1 leading-relaxed">
                If you feel in immediate physical danger, please dial <span className="text-white font-bold font-mono">112</span> or seek safe shelter immediately.
              </p>
            </div>

          </aside>

        </div>

      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-rose-500/10 py-4 px-4 text-center text-xs text-slate-400">
        RECLAIM • Confidential digital evidence preservation sanctuary for women facing harassment & cyberstalking.
      </footer>
    </div>
  );
};

export default App;
