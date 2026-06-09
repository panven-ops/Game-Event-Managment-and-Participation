import uuid
from sqlalchemy import Column, String, DateTime, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class Event(Base):
    __tablename__ = "events"
    id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4)
    title = Column(String, nullable = False)
    description = Column(Text)
    status = Column(String, default = "scheduled")
    starts_at = Column(DateTime(timezone = True))
    ends_at = Column(DateTime(timezone = True))
    scheduled_start = Column(DateTime(timezone = True), nullable = True)
    scheduled_end = Column(DateTime(timezone = True), nullable = True)
    auto_start = Column(Boolean, default = False)
    auto_end = Column(Boolean, default = False)
    is_started = Column(Boolean, default=False)
    is_stopped = Column(Boolean, default=False)
    winner_selected = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone = True), server_default = func.now())
    auto_pick_winner = Column(Boolean, default = False)
    entries = relationship("Entry", back_populates = "event")
