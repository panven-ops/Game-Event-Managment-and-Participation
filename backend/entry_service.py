from fastapi import HTTPException
from sqlalchemy.sql import func
from db_models.entries import Entry
from db_models.participant import Participants
from db_models.event import Event
from cloudinary_client import upload_image


Allowed_Types = [
    "image/png",
    "image/jpeg",
    "image/webp"
    ]

def upload_entry_service(db, username, file):

    if file.content_type not in Allowed_Types:
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


    count = db.query(Entry).filter(Entry.participant_id == participant.id, Entry.event_id == event.id, Entry.is_overflow == False).count()

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
