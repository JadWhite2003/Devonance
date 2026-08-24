from fastapi import APIRouter
from services.cleanup import delete_expired_links

router = APIRouter()

@router.post("/internal/cleanup")
def run_cleanup():
    delete_expired_links()
    return {"status": "ok"}