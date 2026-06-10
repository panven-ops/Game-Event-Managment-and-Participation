from fastapi import Depends, APIRouter
from sqlalchemy.orm import Session
from db_models.database import get_db
from admin.services.event_services import get_event_status as svc_get_event_status

router = APIRouter(tags=["public"])

@router.get("/event/status")
def get_public_event_status(db: Session = Depends(get_db)):
    return svc_get_event_status(db)
