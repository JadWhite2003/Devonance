from fastapi import APIRouter, HTTPException
from database import supabase

router = APIRouter()

@router.get("/links/{slug}/info")
def get_link_info(slug: str):
    row = supabase.table("links").select("slug, type, expires_at, max_uses, use_count").eq("slug", slug).execute().data
    if not row:
        raise HTTPException(status_code=404, detail="Link not found")
    link = row [0]
    return {
        "type": link["type"],
        "expired": ...
    }
    
    #This is a read only peek so loading the page doesn't use up a one time use link.