import random
from db_models.participant import Participants
from db_models.event import Event
from db_models.entries import Entry
from db_models.event_winner import Event_Winner
from .winner_weight import winner_rate

def get_winner(db):

    event = db.query(Event).filter(Event.status == "active").first()

    if not event:
        return {"error": "No active Event!"}

    participants = db.query(Participants).all()

    eligible = []
    weights = []

    for p in participants:
        entries = db.query(Entry).filter(Entry.participant_id == p.id, Entry.event_id == event.id, Entry.status == "approved", Entry.is_overflow == False).all()

        if len(entries) == 0:
            continue

        weight = winner_rate(p)

        eligible.append(p)
        weights.append(weight)

    if not eligible:
        return {"error": "No eligible participants"}

    winner = random.choices(eligible, weights = weights, k = 1)[0]

    db_winner = Event_Winner(
        event_id = event.id,
        participant_id = winner.id,
        selection_weight = 1 / (1 + winner.win_count)
        )

    db.add(db_winner)

    winner.win_count += 1

    db.commit()

    return {"winner": winner.username}
