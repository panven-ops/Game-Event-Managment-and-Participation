from fastapi import UploadFile, File, APIRouter, Depends, Form
from sqlalchemy.orm import Session
from entry_service import upload_entry_service
from db_models.database import get_db

router = APIRouter(prefix="/entry", tags=["entry"])


@router.post("/upload")
async def upload_entry(username: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):

    return await upload_entry_service(db, username, file)
