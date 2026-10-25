export interface Case {
  id: string;
  title: string;
  victim_alias: string;
  created_at: string;
  status: string;
  merkle_root_hash?: string;
}

export interface EvidenceItem {
  id: string;
  case_id: string;
  filename: string;
  file_type: string;
  platform: string;
  sha256_hash: string;
  phash?: string;
  dhash?: string;
  exif_metadata?: Record<string, any>;
  extracted_text?: string;
  sender_identifier?: string;
  incident_timestamp?: string;
  uploaded_at: string;
}

export interface TimelineEvent {
  id: number;
  case_id: string;
  evidence_id: string;
  timestamp_iso: string;
  platform: string;
  actor_handle: string;
  event_type: string;
  summary: string;
  verbatim_quote?: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  evidence_sha256: string;
}

export interface PatternFinding {
  id: number;
  case_id: string;
  pattern_type: string;
  title: string;
  description: string;
  severity: 'High' | 'Critical';
  confidence_score: number;
  linked_evidence_ids: string[];
  legal_relevance_note?: string;
}

export interface ProtectedImageHash {
  id: number;
  case_id: string;
  label: string;
  sha256_hash: string;
  phash: string;
  dhash: string;
  created_at: string;
  zero_upload_verified: boolean;
}

export interface ImageMatchResult {
  vault_id: number;
  vault_label: string;
  sha256_match: boolean;
  hamming_distance: number;
  similarity_percentage: number;
  match_status: string;
}

export interface ImageMatchScanResponse {
  incoming_sha256: string;
  incoming_phash: string;
  incoming_dhash: string;
  matches: ImageMatchResult[];
}

export interface PlatformTakedownItem {
  platform: string;
  title: string;
  policy_reference: string;
  recipient_email_or_url: string;
  evidence_citations: string[];
  sha256_proofs: string[];
  notice_body: string;
}

export interface ActionPlan {
  id?: number;
  case_id: string;
  safety_steps: string[];
  platform_takedowns: PlatformTakedownItem[];
  authority_report_draft: string;
  generated_at?: string;
}

export interface MerkleVerificationResponse {
  case_id: string;
  recorded_merkle_root: string;
  recalculated_merkle_root: string;
  total_exhibits_verified: number;
  integrity_verified: boolean;
  tampering_detected: boolean;
}
