from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from db_models.database import Base, engine
from dotenv import load_dotenv
from db_models.event import Event
from db_models.participant import Participants
from db_models.entries import Entry
from db_models.admin_log import AdminLog
from routes.entr import router as entries_router
from routes.admin_rout import router as admin_router
from admin.services.scheduler import start_scheduler
from routes.public_route import router as public_router
import os

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    start_scheduler()
    yield

app = FastAPI(lifespan=lifespan)

origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(entries_router)
app.include_router(admin_router)
app.include_router(public_router)

@app.get("/")
def root():
    return {"message": "API is working"}

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Game API",
        version="1.0.0",
        routes=app.routes,
    )
    openapi_schema["components"]["securitySchemes"] = {
        "BearerAuth": {
            "type": "http",
            "scheme": "bearer",
        }
    }
    openapi_schema["security"] = [{"BearerAuth": []}]
    app.openapi_schema = openapi_schema
    return app.openapi_schema

app.openapi = custom_openapi

@app.get("/health")
def health():
    return {"status": "OK"}
