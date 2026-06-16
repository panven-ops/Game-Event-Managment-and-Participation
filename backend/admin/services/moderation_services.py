from db_models.entries import Entry
from db_models.participant import Participants

def approve_entry(db, entry_id):

    entry = db.query(Entry).filter(Entry.id == entry_id).first()

    if not entry:
        return None

    entry.status = "approved"

    db.commit()

    return entry

def reject_entry(db, entry_id):

    entry = db.query(Entry).filter(Entry.id == entry_id).first()

    if not entry:
        return None

    entry.status = "rejected"

    db.commit()

    return entry

def pending_entry(db):

    entry = db.query(Entry).filter(Entry.status == "pending").all()

    result = []

    for e in entry:
        participant = db.query(Participants).filter(Participants.id == e.participant_id).first()

        result.append({
            "entry_id": str(e.id),
            "username": participant.username if participant else "Unknown",
            "screenshot_url": e.screenshot_url,
            "created_at": e.created_at,
            "is_overflow": e.is_overflow
            })

    return result

def get_grouped_pendings(db):

    participant = db.query(Participants).all()

    result = []

    for part in participant:
        entries = db.query(Entry).filter(Entry.participant_id == part.id).all()

        if not entries:
            continue

        pending_entries = [e for e in entries if e.status == "pending"]

        if not pending_entries:
            continue

        approved = [ e for e in entries if e.status == "approved"]
        rejected = [e for e in entries if e.status == "rejected"]
        overflow = [e for e in entries if e.is_overflow]

        result.append({
            "participant_id": str(part.id),
            "username": part.username,
            "total_entries": len(entries),
            "approved": len(approved),
            "rejected": len(rejected),
            "pending_count": len(pending_entries),
            "overflow_count": len(overflow),
            "entries": [{
                "entry_id": str(e.id),
                "url": e.screenshot_url,
                "status": e.status,
                "is_overflow": e.is_overflow,
                "created_at": e.created_at
                } for e in pending_entries]
            })

    return result
