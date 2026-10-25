from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Case, ProtectedImageHash
from ..schemas import (
    ProtectedImageHashCreate,
    ProtectedImageHashResponse,
    ImageMatchScanResponse
)
from ..services.image_hash_service import compare_image_against_vault

router = APIRouter(prefix="/api/cases/{case_id}/image-shield", tags=["Image Shield Vault"])

@router.post("/register", response_model=ProtectedImageHashResponse)
def register_protected_hash(
    case_id: str,
    payload: ProtectedImageHashCreate,
    db: Session = Depends(get_db)
):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    vault_entry = ProtectedImageHash(
        case_id=case_id,
        label=payload.label,
        sha256_hash=payload.sha256_hash,
        phash=payload.phash,
        dhash=payload.dhash,
        zero_upload_verified=True
    )
    db.add(vault_entry)
    db.commit()
    db.refresh(vault_entry)
    return vault_entry

@router.get("/vault", response_model=List[ProtectedImageHashResponse])
def get_vault_hashes(case_id: str, db: Session = Depends(get_db)):
    return db.query(ProtectedImageHash).filter(ProtectedImageHash.case_id == case_id).all()

@router.post("/scan", response_model=ImageMatchScanResponse)
async def scan_suspected_image(
    case_id: str,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    """
    In-memory perceptual scan of a suspected screenshot or repost against
    the case's protected vault records using Hamming distance.
    The file is never saved to disk.
    """
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    content = await file.read()
    if not content:
        raise HTTPException(status_code=400, detail="Empty image uploaded")

    vault_records = db.query(ProtectedImageHash).filter(ProtectedImageHash.case_id == case_id).all()
    results = compare_image_against_vault(content, vault_records)
    return results
