from db_models.participant import Participants
from db_models.event import Event
from db_models.entries import Entry


def get_participants_overview(db):
    event = db.query(Event).filter(Event.status == "active").first()

    if not event:
        return []

    participants = db.query(Participants).all()

    result = []

    for p in participants:
        entries =db.query(Entry).filter(Entry.participant_id == p.id, Entry.event_id == event.id).all()

        approved = [e for e in entries if e.status == "approved" and not e.is_overflow]
        overflow = [e for e in entries if e.is_overflow]
        rejected = [e for e in entries if e.status == "rejected"]
        pending = [e for e in entries if e.status == "pending"]

        result.append({
            "participant": str(p.id),
            "username": p.username,
            "approved_count": len(approved),
            "rejected_count": len(rejected),
            "pending_count": len(pending),
            "overflow_count": len(overflow),
            "can_upload": len(approved) < 4,
            "eligible": len(approved) > 0,
            "entries": [{
                "url": e.screenshot_url,
                "status": e.status,
                "overflow": e.is_overflow}
            for e in entries
            ]
        })

    return result

def get_dashboard_stats(db):
    event = db.query(Event).filter(Event.status == "active").first()

    if not event:
        return {"active": False}

    total_participants = db.query(Participants).count()

    total_entries = db.query(Entry).filter(Entry.event_id == event.id).count()

    overflow_entries = db.query(Entry).filter(Entry.event_id == event.id, Entry.is_overflow == True).count()

    return {
        "event": event.title,
        "participants": total_participants,
        "entries": total_entries,
        "overflow_entries": overflow_entries
        }
