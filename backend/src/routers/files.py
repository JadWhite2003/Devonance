from fastapi import APIRouter, UploadFile, File, Form, Response
from datetime import datetime, timedelta, timezone
from database import supabase
from services.links import make_or_validate_slug, consume_link

router = APIRouter()
BUCKET = "files"

@router.post("/upload")
async def upload_file(
    file: UploadFile = File(...),
    custom_slug: str | None = Form(None),
    max_uses: int | None = Form(None),
    expires_in: int = Form(300),
    
):
    slug = make_or_validate_slug(custom_slug)
    storage_path = f"{slug}/{file.filename}"
    
    file_bytes = await file.read()
    supabase.storage.from_(BUCKET).upload(storage_path, file_bytes, {"content-type": file.content_type or "application/octet-stream"})
    expires_at = (datetime.now(timezone.utc) + timedelta(seconds=expires_in)).isoformat()
    
    supabase.table("links").insert({
        "slug": slug,
        "type": "file",
        "storage_path": storage_path,
        "original_name": file.filename,
        "max_uses": max_uses,
        "expires_at": expires_at
    }).execute()
    
    return {"slug": slug, "url": f"/download/{slug}"}

@router.get("/download/{slug}")
def download_file(slug: str):
    link = consume_link(slug)
    file_bytes = supabase.storage.from_(BUCKET).download(link["storage_path"])
    return Response(content=file_bytes, media_type="application/octet-stream", headers={"Content-Disposition": f"attachment; filename={link['original_name']}"})