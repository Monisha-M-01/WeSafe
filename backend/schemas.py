from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

# --- Request / Response Models ---

class CaseCreate(BaseModel):
    title: str
    victim_alias: Optional[str] = "Anonymous"

class CaseResponse(BaseModel):
    id: str
    title: str
    victim_alias: str
    created_at: datetime
    status: str
    merkle_root_hash: Optional[str] = None

    class Config:
        from_attributes = True

class EvidenceItemResponse(BaseModel):
    id: str
    case_id: str
    filename: str
    file_type: str
    platform: str
    sha256_hash: str
    phash: Optional[str] = None
    dhash: Optional[str] = None
    exif_metadata: Optional[Dict[str, Any]] = None
    extracted_text: Optional[str] = None
    sender_identifier: Optional[str] = None
    incident_timestamp: Optional[str] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True

class TimelineEventCreate(BaseModel):
    evidence_id: str
    timestamp_iso: str
    platform: str
    actor_handle: str
    event_type: str
    summary: str
    verbatim_quote: Optional[str] = None
    severity: str = "Medium"
    evidence_sha256: str

class TimelineEventResponse(BaseModel):
    id: int
    case_id: str
    evidence_id: str
    timestamp_iso: str
    platform: str
    actor_handle: str
    event_type: str
    summary: str
    verbatim_quote: Optional[str] = None
    severity: str
    evidence_sha256: str

    class Config:
        from_attributes = True

class PatternFindingResponse(BaseModel):
    id: int
    case_id: str
    pattern_type: str
    title: str
    description: str
    severity: str
    confidence_score: float
    linked_evidence_ids: List[str]
    legal_relevance_note: Optional[str] = None

    class Config:
        from_attributes = True

class ProtectedImageHashCreate(BaseModel):
    label: str
    sha256_hash: str
    phash: str
    dhash: str

class ProtectedImageHashResponse(BaseModel):
    id: int
    case_id: str
    label: str
    sha256_hash: str
    phash: str
    dhash: str
    created_at: datetime
    zero_upload_verified: bool

    class Config:
        from_attributes = True

class ImageMatchResult(BaseModel):
    vault_id: int
    vault_label: str
    sha256_match: bool
    hamming_distance: int
    similarity_percentage: float
    match_status: str

class ImageMatchScanResponse(BaseModel):
    incoming_sha256: str
    incoming_phash: str
    incoming_dhash: str
    matches: List[ImageMatchResult]

class PlatformTakedownItem(BaseModel):
    platform: str
    title: str
    policy_reference: str
    recipient_email_or_url: str
    evidence_citations: List[str]
    sha256_proofs: List[str]
    notice_body: str

class ActionPlanResponse(BaseModel):
    id: Optional[int] = None
    case_id: str
    safety_steps: List[str]
    platform_takedowns: List[Dict[str, Any]]
    authority_report_draft: str
    generated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Gemini Structured Output Schemas ---

class GeminiEvidenceExtraction(BaseModel):
    platform: str = Field(description="Social or chat platform, e.g., WhatsApp, Instagram, SMS, CallLog, X, LinkedIn, Other")
    sender_identifier: str = Field(description="Perpetrator phone number, username, or handle")
    incident_timestamp: str = Field(description="Normalized interaction timestamp in YYYY-MM-DD HH:MM:SS or ISO format")
    event_type: str = Field(description="Message, MissedCall, BlockAttempt, Threat, ImageShare, or Stalking")
    summary: str = Field(description="Concise, objective forensic summary of what this screenshot shows")
    verbatim_quote: str = Field(description="Verbatim exact quotation of threatening/harassing text present in screenshot")
    severity: str = Field(description="Severity classification: Low, Medium, High, or Critical")
    threat_indicators: List[str] = Field(default_factory=list, description="Specific threat markers detected (e.g., NCII threat, stalking, doxxing, barrage)")

class GeminiPatternItem(BaseModel):
    pattern_type: str = Field(description="Category: Repeated Unwanted Contact, Block Evasion / Account Hopping, Escalating Threats, Non-Consensual Image Abuse, or Doxxing / Surveillance")
    title: str = Field(description="Clear title of the pattern, e.g. Cross-Platform Block Evasion")
    description: str = Field(description="Forensic explanation of how the perpetrator exhibited this pattern")
    severity: str = Field(description="High or Critical")
    confidence_score: float = Field(description="Confidence from 0.0 to 1.0")
    linked_evidence_ids: List[str] = Field(description="List of exact Evidence IDs that ground this pattern, e.g. ['EV-001', 'EV-003']")
    legal_relevance_note: str = Field(description="Citation of relevant cyberstalking/harassment legal or platform standard")

class GeminiPatternAnalysisResponse(BaseModel):
    patterns: List[GeminiPatternItem] = Field(description="List of detected forensic behavioral patterns grounded in evidence")

class GeminiPlatformTakedown(BaseModel):
    platform: str = Field(description="Platform name, e.g. Instagram/Meta, WhatsApp, LinkedIn, X")
    title: str = Field(description="Subject line or request title")
    policy_reference: str = Field(description="Exact platform policy, e.g. Meta NCII & Harassment Policy")
    recipient_email_or_url: str = Field(description="Abuse desk email or report link")
    evidence_citations: List[str] = Field(description="Referenced Evidence IDs e.g. EV-003")
    sha256_proofs: List[str] = Field(description="List of corresponding SHA-256 hashes")
    notice_body: str = Field(description="Formal, ready-to-submit legal takedown notice")

class GeminiActionPlanResponse(BaseModel):
    safety_steps: List[str] = Field(description="Ordered list of trauma-informed digital security steps for the survivor")
    platform_takedowns: List[GeminiPlatformTakedown] = Field(description="Formal platform takedown notices citing evidence SHA-256")
    authority_report_draft: str = Field(description="Full structured cyber cell / law enforcement incident complaint brief")
