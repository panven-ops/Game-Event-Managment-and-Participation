from fastapi import HTTPException
from sqlalchemy.sql import func
from db_models.entries import Entry
from db_models.participant import Participants
from db_models.event import Event
from cloudinary_client import upload_image
import re
import magic

def sanitize_username(username: str) -> str:
    username = username.strip()

    if len(username) < 3:
        raise HTTPException(status_code = 400, detail = "Username must be at least 3 characters.")

    if len(username) >= 15:
        raise HTTPException(status_code = 400, detail = "Username must be at most 15 characters")

    if not re.match(r'^[a-zA-Z0-9_.\-]+$', username):
        raise HTTPException(status_code = 400, detail = "Username contains invalid characters")

    return username


Allowed_Types = [
    "image/png",
    "image/jpeg",
    "image/webp"
    ]

async def upload_entry_service(db, username, file):
    username = sanitize_username(username)

    header = await file.read(2048)
    await file.seek(0)

    mime = magic.from_buffer(header, mime = True)

    if mime not in Allowed_Types:
        raise HTTPException(status_code = 400, detail = "Invalid file type!")

    event = db.query(Event).filter(Event.status == "active").first()

    if not event:
        raise HTTPException(status_code = 404, detail = "Event not active")

    normalized = username.strip().lower()

    participant = db.query(Participants).filter(Participants.normalized_username == normalized).first()

    if not participant:
        participant = Participants(username = username.strip(), normalized_username = normalized)

        db.add(participant)
        db.commit()
        db.refresh(participant)


    total_count = db.query(Entry).filter(Entry.participant_id == participant.id, Entry.event_id == event.id).count()

    if total_count >= 6:
        raise HTTPException(status_code = 429, detail = "Maximum entry limit reached!")

    count = db.query(Entry).filter(Entry.participant_id == participant.id, Entry.event_id == event.id, Entry.is_overflow == False).count() # noqa: E712

    is_overflow = count >= 4

    image_url = upload_image(file)


    entry = Entry(participant_id = participant.id,
                  event_id = event.id,
                  screenshot_url = image_url,
                  status = "pending",
                  is_overflow = is_overflow)

    db.add(entry)
    participant.last_submission_at = func.now()
    db.commit()
    db.refresh(entry)

    return {"message": "Succesfully Uploaded Screenshot",
            "image_url": image_url,
            "entry_id": str(entry.id),
            "overflow": is_overflow}
