import logging

from datetime import datetime, timezone, timedelta
from database import supabase

BUCKET = "files"
BATCH_SIZE = 100
MAX_PER_RUN = 500

logger = logging.getLogger(__name__)

def _chunks(items: list, size: int):
    for i in range(0, len(items), size):
        yield items[i : i + size]

def delete_orphaned_files(min_age_minutes: int = 60, max_folders: int = 100) -> int:
    bucket = supabase.storage.from_(BUCKET)
    cutoff = datetime.now(timezone.utc) - timedelta(minutes = min_age_minutes)
    
    folders: list[str] = []
    offset = 0
    while True:
        page = bucket.list("", {"limit": 100, "offset": offset})
        if not page: 
            break
        folders += [i["name"] for i in page if i.get("id") is None]
        if len(page) < 100:
            break
        offset += 100
        
    if not folders:
        return 0
    
    existing: set[str] = set()
    for batch in _chunks(folders, BATCH_SIZE):
        rows = supabase.table("links").select("slug").in_("slug", batch).execute().data
        existing.update(r["slug"] for r in rows)
        
    orphans = [f for f in folders if f not in existing][:max_folders]
    
    paths: list[str] = []
    for folder in orphans:
        for item in bucket.list(folder, {"limit":1000}):
            created = item.get("created_at")
            if created:
                created_dt = datetime.fromisoformat(created.replace("Z", "+00:00"))
                if created_dt > cutoff:
                    continue
            paths.append(f"{folder}/{item['name']}")
            
    for batch in _chunks(paths, BATCH_SIZE):
            bucket.remove(batch)
        
    return len(paths)

def delete_expired_links():
    now = datetime.now(timezone.utc).isoformat()
    expired = (supabase.table("links").select("id, storage_path").lt("expires_at", now).limit(MAX_PER_RUN).execute().data)
    links_deleted = 0
    files_deleted = 0
    orphans_deleted = 0
    
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
        
    orphans_deleted = delete_orphaned_files()
    
    return {"links_deleted": links_deleted, "files_deleted": files_deleted, "orphans_deleted": orphans_deleted}