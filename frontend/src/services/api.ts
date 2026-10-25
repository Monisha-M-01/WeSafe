import {
  Case,
  EvidenceItem,
  TimelineEvent,
  PatternFinding,
  ProtectedImageHash,
  ImageMatchScanResponse,
  ActionPlan,
  MerkleVerificationResponse
} from '../types/reclaim';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export async function seedDemoCase(): Promise<Case> {
  const res = await fetch(`${BASE_URL}/cases/seed-demo`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to seed demo case');
  return res.json();
}

export async function listCases(): Promise<Case[]> {
  const res = await fetch(`${BASE_URL}/cases`);
  if (!res.ok) throw new Error('Failed to fetch cases');
  return res.json();
}

export async function getCase(caseId: string): Promise<Case> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}`);
  if (!res.ok) throw new Error('Failed to fetch case');
  return res.json();
}

export async function createCase(title: string, victim_alias: string = 'Anonymous'): Promise<Case> {
  const res = await fetch(`${BASE_URL}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, victim_alias })
  });
  if (!res.ok) throw new Error('Failed to create case');
  return res.json();
}

export async function uploadEvidence(
  caseId: string,
  file: File,
  clientSha256?: string
): Promise<EvidenceItem> {
  const formData = new FormData();
  formData.append('file', file);
  if (clientSha256) {
    formData.append('client_sha256', clientSha256);
  }

  const res = await fetch(`${BASE_URL}/cases/${caseId}/evidence/upload`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to upload evidence');
  return res.json();
}

export async function listEvidence(caseId: string): Promise<EvidenceItem[]> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/evidence`);
  if (!res.ok) throw new Error('Failed to fetch evidence items');
  return res.json();
}

export async function getTimeline(caseId: string): Promise<TimelineEvent[]> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/timeline`);
  if (!res.ok) throw new Error('Failed to fetch timeline');
  return res.json();
}

export async function analyzePatterns(caseId: string): Promise<PatternFinding[]> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/patterns/analyze`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to analyze patterns');
  return res.json();
}

export async function getPatterns(caseId: string): Promise<PatternFinding[]> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/patterns`);
  if (!res.ok) throw new Error('Failed to fetch patterns');
  return res.json();
}

export async function registerProtectedHash(
  caseId: string,
  payload: { label: string; sha256_hash: string; phash: string; dhash: string }
): Promise<ProtectedImageHash> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/image-shield/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to register protected image hash');
  return res.json();
}

export async function getVaultHashes(caseId: string): Promise<ProtectedImageHash[]> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/image-shield/vault`);
  if (!res.ok) throw new Error('Failed to fetch vault hashes');
  return res.json();
}

export async function scanSuspectedImage(
  caseId: string,
  file: File
): Promise<ImageMatchScanResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const res = await fetch(`${BASE_URL}/cases/${caseId}/image-shield/scan`, {
    method: 'POST',
    body: formData
  });
  if (!res.ok) throw new Error('Failed to scan suspected image');
  return res.json();
}

export async function generateActionPlan(caseId: string): Promise<ActionPlan> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/response-plan/generate`, {
    method: 'POST'
  });
  if (!res.ok) throw new Error('Failed to generate action plan');
  return res.json();
}

export async function getActionPlan(caseId: string): Promise<ActionPlan> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/response-plan`);
  if (!res.ok) throw new Error('Failed to fetch action plan');
  return res.json();
}

export async function verifyMerkle(caseId: string): Promise<MerkleVerificationResponse> {
  const res = await fetch(`${BASE_URL}/cases/${caseId}/verify-merkle`);
  if (!res.ok) throw new Error('Failed to verify merkle integrity');
  return res.json();
}

export function getPassportPdfUrl(caseId: string): string {
  return `${BASE_URL}/cases/${caseId}/passport.pdf`;
}
