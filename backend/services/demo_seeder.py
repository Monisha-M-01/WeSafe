import datetime
from sqlalchemy.orm import Session
from ..models import Case, EvidenceItem, TimelineEvent, PatternFinding, ProtectedImageHash, ActionPlan
from .crypto_service import compute_case_merkle_root

def seed_fictional_demo_case(db: Session) -> Case:
    """
    Seeds Maya's complete fictional case (#RC-2026-089) into the database.
    Idempotent: removes previous instance if present.
    """
    case_id = "RC-2026-089"
    existing = db.query(Case).filter(Case.id == case_id).first()
    if existing:
        db.delete(existing)
        db.commit()

    case = Case(
        id=case_id,
        title="Case #RC-2026-089: Multi-Platform Stalking, Block Evasion & Image Extortion",
        victim_alias="Maya S.",
        created_at=datetime.datetime.utcnow(),
        status="CRYPTOGRAPHICALLY_SEALED"
    )
    db.add(case)
    db.flush()

    # Evidence Items
    ev1_sha = "a1b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0"
    ev2_sha = "b2c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef01"
    ev3_sha = "c3d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef012"
    ev4_sha = "d4e5f60718293a4b5c6d7e8f90123456789abcdef0123456789abcdef0123"

    ev1 = EvidenceItem(
        id="EV-001",
        case_id=case_id,
        filename="whatsapp_transit_stalking.png",
        file_type="image/png",
        platform="WhatsApp",
        sha256_hash=ev1_sha,
        phash="f8e4b2c19a637101",
        dhash="d492a1e8c370b511",
        exif_metadata={"dimensions": "1080x2400", "format": "PNG"},
        extracted_text="Why did you block me after work? I know you take the 7:15 PM metro from Indiranagar. Answer me.",
        sender_identifier="+91-98201-XXXXX",
        incident_timestamp="2026-10-21 19:22:00"
    )

    ev2 = EvidenceItem(
        id="EV-002",
        case_id=case_id,
        filename="call_log_nocturnal_barrage.png",
        file_type="image/png",
        platform="CallLog",
        sha256_hash=ev2_sha,
        phash="f8e4b2c19a637102",
        dhash="d492a1e8c370b512",
        exif_metadata={"dimensions": "1080x2340", "format": "PNG"},
        extracted_text="18 Missed Calls from +91-98201-XXXXX between 23:10 and 23:42.",
        sender_identifier="+91-98201-XXXXX",
        incident_timestamp="2026-10-21 23:42:00"
    )

    ev3 = EvidenceItem(
        id="EV-003",
        case_id=case_id,
        filename="instagram_burner_extortion.png",
        file_type="image/png",
        platform="Instagram",
        sha256_hash=ev3_sha,
        phash="f8e4b2c19a637103",
        dhash="d492a1e8c370b513",
        exif_metadata={"dimensions": "1080x2400", "format": "PNG"},
        extracted_text="Blocking my number won't help you Maya. I made a new page. Talk to me by midnight or I send those college trip photos to your HR manager at TechCorp.",
        sender_identifier="@maya_watch_blr99",
        incident_timestamp="2026-10-22 21:05:00"
    )

    ev4 = EvidenceItem(
        id="EV-004",
        case_id=case_id,
        filename="linkedin_workplace_coercion.png",
        file_type="image/png",
        platform="LinkedIn",
        sha256_hash=ev4_sha,
        phash="f8e4b2c19a637104",
        dhash="d492a1e8c370b514",
        exif_metadata={"dimensions": "1170x2532", "format": "PNG"},
        extracted_text="Check your Instagram DM. Clock is ticking.",
        sender_identifier="@r_verma_backup2",
        incident_timestamp="2026-10-23 09:15:00"
    )

    db.add_all([ev1, ev2, ev3, ev4])
    db.flush()

    # Timeline Events
    t1 = TimelineEvent(
        case_id=case_id,
        evidence_id="EV-001",
        timestamp_iso="2026-10-21 19:22:00",
        platform="WhatsApp",
        actor_handle="+91-98201-XXXXX",
        event_type="Threat",
        summary="Physical stalking intimidation referencing victim's daily transit schedule.",
        verbatim_quote="Why did you block me after work? I know you take the 7:15 PM metro from Indiranagar. Answer me.",
        severity="High",
        evidence_sha256=ev1_sha
    )

    t2 = TimelineEvent(
        case_id=case_id,
        evidence_id="EV-002",
        timestamp_iso="2026-10-21 23:42:00",
        platform="CallLog",
        actor_handle="+91-98201-XXXXX",
        event_type="MissedCall",
        summary="18 missed voice/video calls across 32 minutes immediately after phone block.",
        verbatim_quote="[Call Log Record: 18 Missed Calls from +91-98201-XXXXX]",
        severity="High",
        evidence_sha256=ev2_sha
    )

    t3 = TimelineEvent(
        case_id=case_id,
        evidence_id="EV-003",
        timestamp_iso="2026-10-22 21:05:00",
        platform="Instagram",
        actor_handle="@maya_watch_blr99",
        event_type="Threat",
        summary="Creation of Instagram burner handle to evade phone block; explicit NCII distribution deadline.",
        verbatim_quote="Blocking my number won't help you Maya. I made a new page. Talk to me by midnight or I send those college trip photos to your HR manager at TechCorp.",
        severity="Critical",
        evidence_sha256=ev3_sha
    )

    t4 = TimelineEvent(
        case_id=case_id,
        evidence_id="EV-004",
        timestamp_iso="2026-10-23 09:15:00",
        platform="LinkedIn",
        actor_handle="@r_verma_backup2",
        event_type="Threat",
        summary="Cross-platform professional harassment referencing Instagram deadline.",
        verbatim_quote="Check your Instagram DM. Clock is ticking.",
        severity="Critical",
        evidence_sha256=ev4_sha
    )

    db.add_all([t1, t2, t3, t4])

    # Pattern Findings
    p1 = PatternFinding(
        case_id=case_id,
        pattern_type="Block Evasion / Account Hopping",
        title="Cross-Platform Block Evasion & Burner Account Hopping",
        description="Perpetrator switched sequentially from blocked primary phone (+91-98201-XXXXX) to new Instagram handle (@maya_watch_blr99) and secondary professional account (@r_verma_backup2) to bypass communication boundaries.",
        severity="Critical",
        confidence_score=0.98,
        linked_evidence_ids=["EV-001", "EV-003", "EV-004"],
        legal_relevance_note="Violates Section 78 (Stalking) of Bharatiya Nyaya Sanhita (BNS) & Section 66D IT Act (Personation). Establishes deliberate circumvention of protective blocking."
    )

    p2 = PatternFinding(
        case_id=case_id,
        pattern_type="Repeated Unwanted Contact",
        title="High-Velocity Harassment Barrage",
        description="Recorded 18 incoming call attempts and threatening messages clustered within a 32-minute window between 23:10 and 23:42 on 2026-10-21.",
        severity="High",
        confidence_score=0.99,
        linked_evidence_ids=["EV-001", "EV-002"],
        legal_relevance_note="Fulfills legal standard for persistent nuisance and intentional infliction of emotional distress under Section 79 BNS."
    )

    p3 = PatternFinding(
        case_id=case_id,
        pattern_type="Escalating Threats",
        title="NCII Extortion & Workplace Doxxing Ultimatum",
        description="Direct extortion threat to disseminate non-consensual personal photographs to victim's employer (TechCorp HR) with an explicit midnight deadline.",
        severity="Critical",
        confidence_score=0.97,
        linked_evidence_ids=["EV-003", "EV-004"],
        legal_relevance_note="Actionable under Sections 66E, 67A IT Act (NCII Violation) and Section 308 BNS (Extortion)."
    )

    db.add_all([p1, p2, p3])

    # Protected Image Vault Records
    vault1 = ProtectedImageHash(
        case_id=case_id,
        label="Private Vault Photo 01 (College Trip)",
        sha256_hash="e83f29b471029cba8410294cba94817294817203948172938471928374615243",
        phash="f8e4b2c19a637104",
        dhash="d492a1e8c370b512",
        zero_upload_verified=True
    )
    vault2 = ProtectedImageHash(
        case_id=case_id,
        label="Private Vault Photo 02 (Personal Portrait)",
        sha256_hash="7481928374615243e83f29b471029cba8410294cba9481729481720394817293",
        phash="a1b2c3d4e5f60718",
        dhash="9a8b7c6d5e4f3a21",
        zero_upload_verified=True
    )
    db.add_all([vault1, vault2])

    # Action Plan
    action = ActionPlan(
        case_id=case_id,
        safety_steps=[
            "IMMEDIATE: Lock down mutual contact visibility and switch Instagram, LinkedIn, and Facebook profiles to Strict Private mode.",
            "COMMUNICATION HYGIENE: Do NOT respond or negotiate with burner accounts; all defensive communications are now preserved in RECLAIM.",
            "DEVICE PRESERVATION: Keep device backups without deleting message threads, as cryptographic exhibit hashes have been established.",
            "WORKPLACE SECURITY: Discreetly inform HR/Office Security of potential unauthorized impersonation or harassing outreach targeting company channels.",
            "LOCATION PRIVACY: Disable geotagging in camera settings and alter routine transit schedules (Indiranagar Metro route noted in EV-001)."
        ],
        platform_takedowns=[
            {
                "platform": "Instagram / Meta",
                "title": "URGENT: NCII Extortion, Impersonation & Target Harassment Takedown Notice",
                "policy_reference": "Meta Non-Consensual Intimate Image (NCII) Policy & Coordinated Harassment Standard",
                "recipient_email_or_url": "https://www.instagram.com/hacked/ and ncii-takedowns@support.meta.com",
                "evidence_citations": ["EV-003"],
                "sha256_proofs": [ev3_sha],
                "notice_body": f"Formal Notice of Policy Breach:\nAccount @maya_watch_blr99 has violated Meta Community Guidelines by sending direct threats of non-consensual image distribution and workplace extortion targeting the victim. Cryptographic proof sealed under exhibit [EV-003, SHA-256: {ev3_sha}]. Demand immediate account suspension and IP-level block enforcement."
            },
            {
                "platform": "WhatsApp Inc.",
                "title": "Urgent Stalking & Abuse Escalation Report",
                "policy_reference": "WhatsApp Terms of Service — Section: Acceptable Use & Harassment Prevention",
                "recipient_email_or_url": "support@whatsapp.com / grievance_officer_india@whatsapp.com",
                "evidence_citations": ["EV-001", "EV-002"],
                "sha256_proofs": [ev1_sha, ev2_sha],
                "notice_body": f"Urgent Report of Criminal Harassment:\nPhone number +91-98201-XXXXX has engaged in systematic physical stalking intimidation and nocturnal call barrages against the user. Evidence preserved under exhibits [EV-001, EV-002]. Request immediate termination of associated WhatsApp services and preservation of call session records pursuant to Rule 3(1)(d) IT Intermediary Guidelines."
            }
        ],
        authority_report_draft="""CRIMINAL COMPLAINT BRIEF: CYBER STALKING, EXTORTION & NCII INTIMIDATION
Filed with: National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in) & Bengaluru Cyber Police Station
Case Reference: Case #RC-2026-089 (Subject: Maya S.)
Status: Cryptographically Sealed Master Merkle Manifest Established

1. COMPLAINANT SUMMARY:
Victim is a working professional subjected to multi-platform targeted harassment, nocturnal call flooding, and explicit extortion threats.

2. SUSPECT IDENTIFIERS & BURNER PROFILES:
- Primary Mobile / WhatsApp: +91-98201-XXXXX
- Instagram Burner Handle: @maya_watch_blr99
- Secondary Profile: @r_verma_backup2

3. CHRONOLOGY OF OFFENCES:
- 2026-10-21: Ingestion of stalking threat referencing victim's physical transit routine (Indiranagar Metro).
- 2026-10-21 (Night): 18 consecutive missed calls within 32 minutes following initial block.
- 2026-10-22: Burner profile @maya_watch_blr99 generated to evade block with explicit ultimatum to leak intimate images to employer HR.
- 2026-10-23: Cross-platform escalation to professional networks.

4. STATUTORY VIOLATIONS:
- Section 78 & 79, Bharatiya Nyaya Sanhita (BNS) 2023 (Cyber Stalking & Insulting Modesty of Women)
- Sections 66E, 66D, and 67A, Information Technology Act 2000 (Privacy Violation, Personation, NCII Extortion)
- Section 308, BNS (Extortion)

5. CHAIN OF CUSTODY CERTIFICATE:
All original screenshot exhibits have been cryptographically digested into SHA-256 hashes with in-memory perceptual verification. Modifying a single bit of any exhibit invalidates the Case Master Integrity Root."""
    )
    db.add(action)

    # Calculate Merkle Root
    all_hashes = [ev1_sha, ev2_sha, ev3_sha, ev4_sha]
    case.merkle_root_hash = compute_case_merkle_root(all_hashes)

    db.commit()
    db.refresh(case)
    return case
