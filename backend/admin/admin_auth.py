import os
from dotenv import load_dotenv
from fastapi import Header, HTTPException, Request

load_dotenv()

ADMIN_SECRET = os.getenv("ADMIN_SUPER_SECRET_KEY")

def verify_admin(request: Request, authorization: str = Header(None)):

    if request.method == "OPTIONS":
        return True

    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization")

    try:
        scheme, token = authorization.split()

    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization format")

    if scheme.lower() != "bearer" or token != ADMIN_SECRET:
        raise HTTPException(status_code=401, detail="Unauthorized")

    return True
