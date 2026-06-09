import uuid
from sqlalchemy import Column, String, DateTime, UniqueConstraint, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base

class Entry(Base):
    __tablename__ = "entries"
    id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4)
    participant_id = Column(UUID(as_uuid = True), ForeignKey("participants.id"), nullable = False)
    event_id = Column(UUID(as_uuid = True), ForeignKey("events.id"), nullable = False)
    screenshot_url = Column(String, nullable = False, index = True)
    status = Column(String, default = "pending")
    ip_hash = Column(String)
    is_overflow = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone = True), server_default = func.now())
    deleted_at = Column(DateTime(timezone = True))
    participant = relationship("Participants", back_populates = "entries")
    event = relationship("Event", back_populates = "entries")



