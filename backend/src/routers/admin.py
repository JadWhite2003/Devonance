import os
import secrets
from fastapi import APIRouter, Header, HTTPException
from services.cleanup import delete_expired_links

router = APIRouter()

@router.post("/internal/cleanup")
def run_cleanup(x_cron_secret: str | None = Header(default=None)):
    excepted = os.environ.get("CRON_SECRET")
    if not excepted or not x_cron_secret or not secrets.compare_digest(x_cron_secret, excepted):
        raise HTTPException(401, "Unauthorized")
    return delete_expired_links()
   