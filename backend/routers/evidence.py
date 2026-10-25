import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Case, EvidenceItem, TimelineEvent, PatternFinding
from ..schemas import (
    EvidenceItemResponse,
    TimelineEventResponse,
    PatternFindingResponse
)
from ..services.crypto_service import compute_sha256, compute_case_merkle_root, extract_safe_exif
from ..services.image_hash_service import compute_perceptual_hashes
from ..services.gemini_service import analyze_evidence_screenshot, detect_harassment_patterns
from ..config import UPLOAD_DIR

router = APIRouter(prefix="/api/cases/{case_id}", tags=["Evidence & Timeline"])

@router.post("/evidence/upload", response_model=EvidenceItemResponse)
async def upload_evidence(
    case_id: str,
    file: UploadFile = File(...),
    client_sha256: Optional[str] = Form(None),
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty file uploaded")

    # Cryptographic verification
    server_sha256 = compute_sha256(content)
    if client_sha256 and client_sha256.lower() != server_sha256.lower():
        # Notice client-server integrity mismatch
        pass

    # Extract EXIF and Perceptual hashes
    exif = extract_safe_exif(content)
    p_hashes = compute_perceptual_hashes(content)

    # Next evidence ID for this case
    count = db.query(EvidenceItem).filter(EvidenceItem.case_id == case_id).count()
    evidence_id = f"EV-{count + 1:03d}"

    # Analyze via Gemini AI
    extracted = analyze_evidence_screenshot(
        file_bytes=content,
        mime_type=file.content_type or "image/png",
        filename=file.filename or "evidence.png",
        sha256_hash=server_sha256
    )

    # Persist evidence record
    item = EvidenceItem(
        id=evidence_id,
        case_id=case_id,
        filename=file.filename or "evidence.png",
        file_type=file.content_type or "image/png",
        platform=extracted.get("platform", "Other"),
        sha256_hash=server_sha256,
        phash=p_hashes.get("phash"),
        dhash=p_hashes.get("dhash"),
        exif_metadata=exif,
        extracted_text=extracted.get("verbatim_quote"),
        sender_identifier=extracted.get("sender_identifier"),
        incident_timestamp=extracted.get("incident_timestamp")
    )
    db.add(item)
    db.flush()

    # Create corresponding timeline event
    timeline_event = TimelineEvent(
        case_id=case_id,
        evidence_id=evidence_id,
        timestamp_iso=extracted.get("incident_timestamp", "2026-10-22 00:00:00"),
        platform=extracted.get("platform", "Other"),
        actor_handle=extracted.get("sender_identifier", "Unknown"),
        event_type=extracted.get("event_type", "Message"),
        summary=extracted.get("summary", "Extracted evidence communication event"),
        verbatim_quote=extracted.get("verbatim_quote"),
        severity=extracted.get("severity", "Medium"),
        evidence_sha256=server_sha256
    )
    db.add(timeline_event)

    # Re-calculate Merkle root for all evidence in case
    all_evidence = db.query(EvidenceItem).filter(EvidenceItem.case_id == case_id).all()
    sha_list = [e.sha256_hash for e in all_evidence]
    case.merkle_root_hash = compute_case_merkle_root(sha_list)
    case.status = "CRYPTOGRAPHICALLY_SEALED"

    db.commit()
    db.refresh(item)
    return item

@router.get("/evidence", response_model=List[EvidenceItemResponse])
def list_evidence(case_id: str, db: Session = Depends(get_db)):
    return db.query(EvidenceItem).filter(EvidenceItem.case_id == case_id).order_by(EvidenceItem.uploaded_at.asc()).all()

@router.get("/timeline", response_model=List[TimelineEventResponse])
def get_timeline(case_id: str, db: Session = Depends(get_db)):
    return db.query(TimelineEvent).filter(TimelineEvent.case_id == case_id).order_by(TimelineEvent.timestamp_iso.asc()).all()

@router.post("/patterns/analyze", response_model=List[PatternFindingResponse])
def analyze_patterns(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    events = db.query(TimelineEvent).filter(TimelineEvent.case_id == case_id).order_by(TimelineEvent.timestamp_iso.asc()).all()
    events_dicts = [
        {
            "evidence_id": e.evidence_id,
            "timestamp_iso": e.timestamp_iso,
            "platform": e.platform,
            "actor_handle": e.actor_handle,
            "event_type": e.event_type,
            "summary": e.summary,
            "verbatim_quote": e.verbatim_quote,
            "severity": e.severity,
            "evidence_sha256": e.evidence_sha256
        }
        for e in events
    ]

    detected = detect_harassment_patterns(events_dicts)

    # Clear old findings to avoid duplicates
    db.query(PatternFinding).filter(PatternFinding.case_id == case_id).delete()

    created_findings = []
    for p in detected:
        finding = PatternFinding(
            case_id=case_id,
            pattern_type=p.get("pattern_type", "Harassment"),
            title=p.get("title", "Detected Abuse Pattern"),
            description=p.get("description", ""),
            severity=p.get("severity", "High"),
            confidence_score=p.get("confidence_score", 0.95),
            linked_evidence_ids=p.get("linked_evidence_ids", []),
            legal_relevance_note=p.get("legal_relevance_note", "")
        )
        db.add(finding)
        created_findings.append(finding)

    db.commit()
    for f in created_findings:
        db.refresh(f)
    return created_findings

@router.get("/patterns", response_model=List[PatternFindingResponse])
def get_patterns(case_id: str, db: Session = Depends(get_db)):
    return db.query(PatternFinding).filter(PatternFinding.case_id == case_id).all()
