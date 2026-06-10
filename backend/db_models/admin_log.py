import uuid
from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from .database import Base

class AdminLog(Base):
    __tablename__ = "admin_logs"
    id = Column(UUID(as_uuid = True), primary_key = True, default = uuid.uuid4)
    admin_id = Column(UUID(as_uuid = True))
    action = Column(String , nullable = False)
    target_entry_id = Column(UUID(as_uuid = True))
    created_at = Column(DateTime(timezone = True), server_default = func.now())
