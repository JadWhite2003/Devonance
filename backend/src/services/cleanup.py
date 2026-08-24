from datetime import datetime, timezone
from database import supabase

BUCKET = "files"

def delete_expired_links():
    now = datetime.now(timezone.utc).isoformat()
    expired = supabase.table("links").select("*").lt("expires_at", now).execute().data
    
    for link in expired:
        if link["type"] == "file" and link["storage_path"]:
            supabase.storage.from_(BUCKET).remove([link["storage_path"]])
            
    supabase.table("links").delete().lt("expires_at", now).execute()