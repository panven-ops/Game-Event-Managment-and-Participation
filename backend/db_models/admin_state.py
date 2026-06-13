from sqlalchemy import Integer, Column
from .database import Base

class AdminState(Base):
    __tablename__ = "admin_state"

    id = Column(Integer, primary_key = True, default = 1)
    token_version = Column(Integer, nullable = False, default = 0)
