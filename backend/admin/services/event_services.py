from fastapi import HTTPException
from datetime import datetime, timezone
from db_models.event import Event

def get_active_event(db):
    return db.query(Event).filter(Event.status == "active").first()

def get_event_status(db):
    event = db.query(Event).filter(Event.status == "active").first()

    if not event:
        event = db.query(Event).order_by(Event.created_at.desc()).first()

    if not event:
        return {"active": False}

    now = datetime.now(timezone.utc)

    time_to_end = (event.ends_at - now if event.ends_at else None)

    return {
        "id": event.id,
        "active": event.status == "active",
        "title": event.title,
        "status": event.status,
        "starts_at": event.starts_at,
        "ends_at": event.ends_at,
        "time_to_end": str(time_to_end) if time_to_end else None
        }

def start_event(db, event_id):
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code = 404, detail = "Event not found")

    db.query(Event).filter(Event.status == "active", Event.id != event_id).update({"status": "ended"}, synchronize_session = "fetch")


    event.status = "active"
    event.starts_at = datetime.now(timezone.utc)
    event.is_started = True
    event.auto_end = False
    event.auto_start = False
    event.scheduled_end = None
    event.scheduled_start = None
    event.is_stopped = False
    db.commit()
    db.refresh(event)

    return {"message": "Event has started"}

def stop_event(db, event_id):

    event = db.query(Event).filter(Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code = 404, detail = "Event not found")


    event.status = "ended"
    event.ends_at = datetime.now(timezone.utc)
    event.is_stopped = True
    db.commit()
    db.refresh(event)

    return {"message": "Event has ended"}
