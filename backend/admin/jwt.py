import os
from dotenv import load_dotenv
from datetime import datetime, timezone, timedelta
from fastapi import HTTPException, Request, Depends
from jose import jwt, JWTError
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from db_models.database import get_db
from db_models.admin_state import AdminState


load_dotenv()


SECRET_KEY = os.getenv("JWT_SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_AT = 10 #minutes
REFRESH_TOKEN_EXPIRES_AT = 7 #days
ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")


pwd_context = CryptContext(schemes = ["bcrypt"], deprecated = "auto")

def verify_password(plain: str, hashed: str) -> bool:

    return pwd_context.verify(plain,hashed)


def get_create_admin(db: Session) -> AdminState:

    state = db.query(AdminState).filter(AdminState.id == 1).first()

    if not state:
        state = AdminState(id = 1, token_version = 0)
        db.add(state)
        db.commit()
        db.refresh(state)

    return state

def token_increment(db: Session) -> int:

    state = get_create_admin(db)
    state.token_version += 1
    db.commit()
    db.refresh(state)

    return state.token_version


def create_access_token(token_version: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes = ACCESS_TOKEN_EXPIRES_AT)

    payload = {"sub":"admin",
        "exp":expire,
        "type":"access",
        "token_version": token_version}

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def create_refresh_token(token_version: int) -> str:
    expire = datetime.now(timezone.utc) + timedelta(days = REFRESH_TOKEN_EXPIRES_AT)


    payload = {"sub" : "admin",
        "exp" : expire,
        "type" : "refresh",
        "token_version" : token_version}

    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def verify_admin(request: Request, db: Session = Depends(get_db)):

    if request.method == "OPTIONS":
        return True


    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code = 401, detail = "Missing authorization")

    try:
        scheme, token = auth_header.split()

    except ValueError:
        raise HTTPException(status_code = 401, detail = "False authorization format")

    if scheme.lower() != "bearer":
        raise HTTPException(status_code = 401, detail = "False authorization format")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

    except JWTError:
        raise HTTPException(status_code = 401, detail = "Expired or invalid token")

    if payload.get("type") != "access":
        raise HTTPException(status_code = 401, detail = "Wrong token type")

    token_version = payload.get("token_version")
    state = get_create_admin(db)

    if token_version != state.token_version:
        raise HTTPException(status_code = 401, detail = "Token invalid")

    return True
