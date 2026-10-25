import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models import Case, TimelineEvent, PatternFinding, ActionPlan
from ..schemas import ActionPlanResponse
from ..services.gemini_service import generate_response_plan

router = APIRouter(prefix="/api/cases/{case_id}/response-plan", tags=["Response Assistant"])

@router.post("/generate", response_model=ActionPlanResponse)
def generate_plan(case_id: str, db: Session = Depends(get_db)):
    case = db.query(Case).filter(Case.id == case_id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")

    events = db.query(TimelineEvent).filter(TimelineEvent.case_id == case_id).order_by(TimelineEvent.timestamp_iso.asc()).all()
    patterns = db.query(PatternFinding).filter(PatternFinding.case_id == case_id).all()

    events_dicts = [
        {
            "evidence_id": e.evidence_id,
            "timestamp_iso": e.timestamp_iso,
            "platform": e.platform,
            "actor_handle": e.actor_handle,
            "summary": e.summary,
            "verbatim_quote": e.verbatim_quote,
            "severity": e.severity,
            "evidence_sha256": e.evidence_sha256
        }
        for e in events
    ]
    patterns_dicts = [
        {
            "pattern_type": p.pattern_type,
            "title": p.title,
            "description": p.description,
            "severity": p.severity,
            "linked_evidence_ids": p.linked_evidence_ids
        }
        for p in patterns
    ]

    generated = generate_response_plan(case.title, patterns_dicts, events_dicts)

    # Save to ActionPlan
    db.query(ActionPlan).filter(ActionPlan.case_id == case_id).delete()

    action = ActionPlan(
        case_id=case_id,
        safety_steps=generated.get("safety_steps", []),
        platform_takedowns=generated.get("platform_takedowns", []),
        authority_report_draft=generated.get("authority_report_draft", ""),
        generated_at=datetime.datetime.utcnow()
    )
    db.add(action)
    db.commit()
    db.refresh(action)
    return action

@router.get("", response_model=ActionPlanResponse)
def get_latest_plan(case_id: str, db: Session = Depends(get_db)):
    action = db.query(ActionPlan).filter(ActionPlan.case_id == case_id).order_by(ActionPlan.generated_at.desc()).first()
    if not action:
        # Generate one on the fly if none exists
        return generate_plan(case_id, db)
    return action
