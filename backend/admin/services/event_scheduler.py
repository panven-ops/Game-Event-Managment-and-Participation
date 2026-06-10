from datetime import datetime, timezone
from sqlalchemy.orm import Session
from db_models.event import Event
from .event_services import start_event, stop_event
from admin.winner_selection import get_winner

def run_scheduler(db: Session):
    now = datetime.now(timezone.utc)

    events = db.query(Event).filter(Event.status != "ended").all()

    for event in events:
        if event.auto_start and event.scheduled_start and event.status in ["scheduled", "inactive"] and not event.is_started and now >= event.scheduled_start:

            event.is_started = True
            event.status = "active"
            event.starts_at = now
            db.commit()

        if event.auto_end and event.scheduled_end and event.status == "active" and not event.is_stopped and now >= event.scheduled_end and event.scheduled_end > event.starts_at :

            event.is_stopped = True
            event.status = "ended"
            event.ends_at = now

            db.commit()

            if event.auto_pick_winner and not event.winner_selected:

                event.winner_selected = True
                db.commit()

                get_winner(db)
