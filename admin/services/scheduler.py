from apscheduler.schedulers.background import BackgroundScheduler
from db_models.database import SessionLocal
from .event_scheduler import run_scheduler

scheduler = BackgroundScheduler()

def start_scheduler():
    scheduler.add_job(func = job_runner, trigger = "interval", seconds = 30, id = "event_scheduler_job", replace_existing = True)

    scheduler.start()


def job_runner():
    db = SessionLocal()

    try:
        run_scheduler(db)
    finally:
        db.close()
