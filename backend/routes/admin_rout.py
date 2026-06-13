from fastapi import HTTPException, Depends, APIRouter
from sqlalchemy.orm import Session
from db_models.database import get_db
from admin.services.event_services import (get_event_status as svc_get_event_status, start_event as svc_start_event, stop_event as svc_stop_event)
from admin.services.participants_services import get_participants_overview, get_dashboard_stats
from admin.services.moderation_services import approve_entry, reject_entry, pending_entry, get_grouped_pendings
from admin.jwt import verify_admin
from admin.winner_selection import get_winner
from db_models.event import Event
from datetime import datetime


router = APIRouter(prefix = "/admin", tags = ["admin"], dependencies = [Depends(verify_admin)])

@router.get("/event/status")
def get_event_status(db: Session = Depends(get_db)):

    return svc_get_event_status(db)


@router.post("/event/start")
def start_event(event_id: str, db: Session = Depends(get_db)):

    return svc_start_event(db, event_id)


@router.post("/event/stop")
def stop_event(event_id: str, db: Session = Depends(get_db)):

    return svc_stop_event(db, event_id)


@router.get("/participants")
def participants_list(db: Session = Depends(get_db)):

    return get_participants_overview(db)


@router.get("/dashboard")
def get_dashboard(db: Session = Depends(get_db)):

    return get_dashboard_stats(db)


@router.post("/winner/select")
def get_winner_selection(db: Session = Depends(get_db)):

    return get_winner(db)

@router.post("/event/schedule")
def scheduled_event(event_id: str, scheduled_start: datetime, scheduled_end: datetime, auto_pick_winner:bool = False, db: Session = Depends(get_db)):
    event = db.query(Event).filter(Event.id == event_id).first()

    if not event:
        raise HTTPException(status_code = 404, detail = "Event not found")

    event.scheduled_start = scheduled_start
    event.scheduled_end = scheduled_end
    event.auto_start = True
    event.auto_end = True
    event.auto_pick_winner = auto_pick_winner
    event.status = "scheduled"

    db.commit()

    return {"message": "Event Scheduled"}

@router.post("/entry/{entry_id}/approve")
def approve(entry_id: str, db: Session = Depends(get_db)):

    result = approve_entry(db, entry_id)

    if not result:
        raise HTTPException(status_code = 404, detail = "entry not found")

    return {"message": "entry approved"}


@router.post("/entry/{entry_id}/reject")
def reject(entry_id:str, db: Session = Depends(get_db)):

    result = reject_entry(db, entry_id)

    if not result:
        raise HTTPException(status_code = 404, detail = "Entry not found")

    return {"message": "entry rejected"}

@router.get("/entry/pending")
def pending(db: Session = Depends(get_db)):

    return pending_entry(db)


@router.get("/participants/pendings")
def all_pendings(db: Session = Depends(get_db)):

    return get_grouped_pendings(db)



@router.get("/event/create")
def create_event(title: str, db: Session = Depends(get_db)):
    event = Event(
        title=title,
        status="pending"
    )
    db.add(event)
    db.commit()
    db.refresh(event)
    return {"message": "Event created", "id": str(event.id)}
