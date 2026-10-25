import datetime
from sqlalchemy import (
    Column,
    String,
    Integer,
    Float,
    Boolean,
    DateTime,
    Text,
    JSON,
    ForeignKey
)
from sqlalchemy.orm import relationship
from .database import Base

class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    victim_alias = Column(String, default="Anonymous")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="ACTIVE")
    merkle_root_hash = Column(String, nullable=True)

    evidence_items = relationship("EvidenceItem", back_populates="case", cascade="all, delete-orphan")
    timeline_events = relationship("TimelineEvent", back_populates="case", cascade="all, delete-orphan")
    patterns = relationship("PatternFinding", back_populates="case", cascade="all, delete-orphan")
    protected_hashes = relationship("ProtectedImageHash", back_populates="case", cascade="all, delete-orphan")
    action_plans = relationship("ActionPlan", back_populates="case", cascade="all, delete-orphan")


class EvidenceItem(Base):
    __tablename__ = "evidence_items"

    id = Column(String, primary_key=True, index=True)  # e.g., EV-001
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    filename = Column(String, nullable=False)
    file_type = Column(String, default="image/png")
    platform = Column(String, default="Other")  # WhatsApp, Instagram, SMS, CallLog, X, Other
    sha256_hash = Column(String, index=True, nullable=False)
    phash = Column(String, nullable=True)
    dhash = Column(String, nullable=True)
    exif_metadata = Column(JSON, default=dict)
    extracted_text = Column(Text, nullable=True)
    sender_identifier = Column(String, nullable=True)
    incident_timestamp = Column(String, nullable=True)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="evidence_items")
    timeline_events = relationship("TimelineEvent", back_populates="evidence")


class TimelineEvent(Base):
    __tablename__ = "timeline_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    evidence_id = Column(String, ForeignKey("evidence_items.id"), nullable=False)
    timestamp_iso = Column(String, nullable=False)
    platform = Column(String, nullable=False)
    actor_handle = Column(String, nullable=False)
    event_type = Column(String, default="Message")  # Message, MissedCall, BlockAttempt, Threat, ImageShare
    summary = Column(Text, nullable=False)
    verbatim_quote = Column(Text, nullable=True)
    severity = Column(String, default="Medium")  # Low, Medium, High, Critical
    evidence_sha256 = Column(String, nullable=False)

    case = relationship("Case", back_populates="timeline_events")
    evidence = relationship("EvidenceItem", back_populates="timeline_events")


class PatternFinding(Base):
    __tablename__ = "pattern_findings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    pattern_type = Column(String, nullable=False)  # Repeated Unwanted Contact, Block Evasion / Account Hopping, Escalating Threats, Non-Consensual Image Abuse, Doxxing / Surveillance
    title = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    severity = Column(String, default="High")  # High, Critical
    confidence_score = Column(Float, default=0.95)
    linked_evidence_ids = Column(JSON, default=list)  # ["EV-001", "EV-003"]
    legal_relevance_note = Column(Text, nullable=True)

    case = relationship("Case", back_populates="patterns")


class ProtectedImageHash(Base):
    __tablename__ = "protected_image_hashes"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    label = Column(String, nullable=False)
    sha256_hash = Column(String, nullable=False)
    phash = Column(String, nullable=False)
    dhash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    zero_upload_verified = Column(Boolean, default=True)

    case = relationship("Case", back_populates="protected_hashes")


class ActionPlan(Base):
    __tablename__ = "action_plans"

    id = Column(Integer, primary_key=True, autoincrement=True)
    case_id = Column(String, ForeignKey("cases.id"), nullable=False)
    safety_steps = Column(JSON, default=list)
    platform_takedowns = Column(JSON, default=list)
    authority_report_draft = Column(Text, nullable=True)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)

    case = relationship("Case", back_populates="action_plans")
