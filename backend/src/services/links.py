import re
import secrets
from database import supabase
from fastapi import HTTPException

SLUG_RE = re.compile(r"^[a-zA-Z0-9_-]{3,32}$")

def make_or_validate_slug(custom_slug: str | None) -> str:
    """Return a vali, unused slug the users custom link or a random one"""
    if custom_slug:
        if not SLUG_RE.match(custom_slug):
            raise HTTPException(status_code=400, detail="Custom slug must be 3-32 characters long and can only contain letters, numbers, underscores, and hyphens.")
        existing = supabase.table("links").select("slug").eq("slug", custom_slug).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Custom slug is already in use.")
        return custom_slug
    
    for _ in range(5):
        slug = secrets.token_urlsafe(6)
        existing = supabase.table("links").select("slug").eq("slug", slug).execute()
        if not existing.data:
            return slug
        raise HTTPException(status_code=500, detail="Could not generate a unique URL. Please try again.")
    
def consume_link(slug: str) -> dict:
    """Atomically validate + increment the use cound using postgres function, returns the link if valid, otherwise raises an error"""
    result = supabase.rpc("consume_link", {"p_slug": slug}).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Link not found or expired.")
    return result.data[0]