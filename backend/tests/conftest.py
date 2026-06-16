# ruff: noqa: E402
import sys
import os

os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["JWT_SECRET_KEY"] = "test-secret-key-for-ci"
os.environ["ADMIN_USERNAME"] = "admin"
os.environ["ADMIN_PASSWORD_HASH"] = "$2b$12$zvnCJhPHgPm.U0nHWgCH7uAjCpuHxGI1RXuDkHPYn2SXEnEtDgAUO"
os.environ["ENVIRONMENT"] = "test"

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db_models.database import Base, get_db
from main import app

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEST_DB_PATH = os.path.join(BASE_DIR, "test.db")
TEST_DB_URL = f"sqlite:///{TEST_DB_PATH}"

engine_test = create_engine(TEST_DB_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine_test)
Base.metadata.create_all(bind=engine_test)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    yield TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    yield
    Base.metadata.drop_all(bind=engine_test)
    Base.metadata.create_all(bind=engine_test)
