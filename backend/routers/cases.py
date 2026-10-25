import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Case
from ..schemas import CaseCreate, CaseResponse
from ..services.demo_seeder import seed_fictional_demo_case

router = APIRouter(prefix="/api/cases", tags=["Cases"])

@router.post("", response_model=CaseResponse)
def create_case(case_in: CaseCreate, db: Session = Depends(get_db)):
    case_id = f"RC-{uuid.uuid4().hex[:8].upper()}"
    new_case = Case(
        id=case_id,
        title=case_in.title,
        victim_alias=case_in.victim_alias or "Anonymous",
        status="ACTIVE"
    )
    db.add(new_case)
    db.commit()
    db.refresh(new_case)
    return new_case

@router.get("", response_model=List[CaseResponse])
def list_cases(db: Session = Depends(get_db)):
    return db.query(Case).order_by(Case.created_at.desc()).all()

@router.get("/{case_id}", response_model=CaseResponse)
def get_case(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

@router.post("/seed-demo", response_model=CaseResponse)
def seed_demo_case(db: Session = Depends(get_db)):
    """1-click Fictional Demo Case loader for judging."""
    case = seed_fictional_demo_case(db)
    return case
