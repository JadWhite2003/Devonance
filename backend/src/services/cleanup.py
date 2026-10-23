import logging

from datetime import datetime, timezone
from database import supabase

BUCKET = "files"
BATCH_SIZE = 100
MAX_PER_RUN = 500

logger = logging.getLogger(__name__)

def _chunks(items: list, size: int):
    for i in range(0, len(items), size):
        yield items[i : i + size]

def delete_expired_links():
    now = datetime.now(timezone.utc).isoformat()
    expired = (supabase.table("links").select("id, storage_path").lt("expires_at", now).limit(MAX_PER_RUN).execute().data)
    links_deleted = 0
    files_deleted = 0
    
    for batch in _chunks(expired, BATCH_SIZE):
        ids = [l["id"] for l in batch]
        
        file_rows = ( supabase.table("link_files").select("storage_path").in_("link_id", ids).execute().data)
        paths = [r["storage_path"] for r in file_rows]
        paths += [l["storage_path"] for l in batch if l.get("storage_path")]
        
        try:
            if paths:
                supabase.storage.from_(BUCKET).remove(paths)
            supabase.table("links").delete().in_("id", ids).execute()
        except Exception:
            logger.exception("Cleanup failed for a batch of %d links", len(ids))
            continue
        
    files_deleted += len(paths)
    links_deleted += len(ids)
    
    return {"links_deleted": links_deleted, "files_deleted": files_deleted}