from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Case, EvidenceItem, TimelineEvent, PatternFinding, ProtectedImageHash, ActionPlan
from ..services.pdf_passport_service import generate_evidence_passport_pdf
from ..services.crypto_service import compute_case_merkle_root

router = APIRouter(prefix="/api/cases/{case_id}", tags=["Evidence Passport"])

@router.get("/passport.pdf")
def download_passport_pdf(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    evidence_items = db.query(EvidenceItem).filter(EvidenceItem.case_id == case_id).order_by(EvidenceItem.uploaded_at.asc()).all()
    timeline_events = db.query(TimelineEvent).filter(TimelineEvent.case_id == case_id).order_by(TimelineEvent.timestamp_iso.asc()).all()
    patterns = db.query(PatternFinding).filter(PatternFinding.case_id == case_id).all()
    protected_hashes = db.query(ProtectedImageHash).filter(ProtectedImageHash.case_id == case_id).all()
    action_plan = db.query(ActionPlan).filter(ActionPlan.case_id == case_id).first()

    pdf_bytes = generate_evidence_passport_pdf(
        case=case,
        evidence_items=evidence_items,
        timeline_events=timeline_events,
        patterns=patterns,
        protected_hashes=protected_hashes,
        action_plan=action_plan
    )

    filename = f"RECLAIM_Evidence_Passport_{case_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="{filename}"'
        }
    )

@router.get("/verify-merkle")
def verify_merkle_integrity(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    evidence_items = db.query(EvidenceItem).filter(EvidenceItem.case_id == case_id).all()
    sha_list = [e.sha256_hash for e in evidence_items]
    recalculated_root = compute_case_merkle_root(sha_list)

    is_valid = bool(case.merkle_root_hash and (case.merkle_root_hash.lower() == recalculated_root.lower()))

    return {
        "case_id": case_id,
        "recorded_merkle_root": case.merkle_root_hash,
        "recalculated_merkle_root": recalculated_root,
        "total_exhibits_verified": len(evidence_items),
        "integrity_verified": is_valid,
        "tampering_detected": not is_valid if len(evidence_items) > 0 else False
    }
