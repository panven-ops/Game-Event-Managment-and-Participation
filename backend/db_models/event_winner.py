import uuid
from sqlalchemy import Column, ForeignKey, Float, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class Event_Winner(Base):
    __tablename__ = "event_winners"
    id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4)
    event_id = Column(UUID(as_uuid = True), ForeignKey("events.id"), nullable = False)
    participant_id = Column(UUID(as_uuid = True), ForeignKey("participants.id"), nullable = False)
    selected_at = Column(DateTime(timezone = True), server_default = func.now())
    selection_weight = Column(Float, nullable = False)
    rerolled = Column(Boolean, default = False)
    event = relationship("Event")
    participant = relationship("Participants")
