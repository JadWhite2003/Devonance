from fastapi import APIRouter
from datetime import datetime, timedelta, timezone
from database import supabase
from models import PasteRequest, LinkResponse
from services.links import make_or_validate_slug, consume_link

router = APIRouter()

@router.post("/paste", response_model=LinkResponse)
def create_paste(req: PasteRequest):
    slug = make_or_validate_slug(req.custom_slug)
    expires_at = (datetime.now(timezone.utc) + timedelta(seconds=req.expire_in)).isoformat()
    
    supabase.table("links").insert({
        "slug": slug,
        "type": "paste",
        "content": req.content,
        "max_uses": req.max_uses,
        "expires_at": expires_at
    }).execute()
    
    return {"slug": slug, "url": f"/paste/{slug}"}

@router.get("/paste/{slug}")
def get_paste(slug: str):
    link = consume_link(slug)
    return {"content": link["content"]}