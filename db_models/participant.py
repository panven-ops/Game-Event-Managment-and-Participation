import uuid
from sqlalchemy import Column, String, Text, DateTime, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class Participants(Base):
    __tablename__ = "participants"
    id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4)
    username = Column(String, unique = True, nullable = False, index = True)
    normalized_username = Column(String, unique = True, nullable = False, index = True)
    win_count = Column(Integer, default = 0)
    discord_id = Column(String, nullable = True)
    created_at = Column(DateTime(timezone = True), server_default = func.now())
    last_submission_at = Column(DateTime(timezone = True))
    last_win_at = Column(DateTime(timezone = True), nullable = True)
    entries = relationship("Entry", back_populates = "participant")
