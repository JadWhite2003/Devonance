from fastapi import APIRouter, HTTPException
from database import supabase

router = APIRouter()

@router.get("/links/{slug}/info")
def get_link_info(slug: str):
    rows = supabase.table("links").select("*").eq("slug", slug).execute().data
    if not rows:
        raise HTTPException(status_code=404, detail="Link not found")
    link = rows [0]
    
    result = {"type": link["type"]}
    
    if link["type"] == "file":
        files = supabase.table("link_files").select("original_name").eq("link_id",link["id"] ).execute().data
        result["files"] = [f["original_name"] for f in files]
    
    return result
    
    #This is a read only peek so loading the page doesn't use up a one time use link.