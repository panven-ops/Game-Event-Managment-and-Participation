import os
from dotenv import load_dotenv
from fastapi import APIRouter, HTTPException, Depends, Request, Response
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from db_models.database import get_db
from admin.jwt import (verify_password,create_access_token,create_refresh_token,get_create_admin,token_increment,REFRESH_TOKEN_EXPIRES_AT,ALGORITHM,SECRET_KEY)
from jose import JWTError, jwt


load_dotenv()

router = APIRouter(prefix="/auth", tags=["auth"])

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")
IS_PROD = os.getenv("ENVIRONMENT") == "production"


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
def login(body: LoginRequest, response: Response, db: Session = Depends(get_db)):

    if body.username != ADMIN_USERNAME:
        raise HTTPException(status_code = 401, detail = "Wrong credential")
    if not verify_password(body.password, ADMIN_PASSWORD_HASH):
        raise HTTPException(status_code = 401, detail = "Wrong credential")

    state = get_create_admin(db)
    version = state.token_version

    access_token = create_access_token(version)
    refresh_token = create_refresh_token(version)

    response.set_cookie(key = "refresh_token",
                        value = refresh_token,
                        httponly = True,
                        secure = IS_PROD,
                        samesite = "strict" if IS_PROD else "lax",
                        max_age = 60 * 60 * 24 * REFRESH_TOKEN_EXPIRES_AT)

    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh")
def refresh(request: Request, response: Response, db: Session = Depends(get_db)):

    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code = 401, detail = "No refresh token")

    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
    except JWTError:
        raise HTTPException(status_code = 401, detail = "Invalid or Expired Token")

    if payload.get("type") != "refresh":
        raise HTTPException(status_code = 401, detail = "Wrong token type")

    state = get_create_admin(db)
    if payload.get("token_version") != state.token_version:
        raise HTTPException(status_code = 401, detail = "Invalidated token")

    new_access_token = create_access_token(state.token_version)

    return {"access_token": new_access_token, "token_type": "bearer"}


@router.post("/logout")
def logout(response: Response, db: Session = Depends(get_db)):

    token_increment(db)

    response.delete_cookie(key = "refresh_token",
                           httponly = True,
                           secure = IS_PROD,
                           samesite = "strict" if IS_PROD else "lax")

    return {"message": "Succesfully logout!"}
