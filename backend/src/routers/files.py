import io
import zipfile
from fastapi.responses import StreamingResponse
from fastapi import APIRouter, UploadFile, File, Form, Response
from datetime import datetime, timedelta, timezone
from database import supabase
from services.links import make_or_validate_slug, consume_link

router = APIRouter()
BUCKET = "files"

@router.post("/upload")
async def upload_file(
    files: list[UploadFile] = File(...),
    custom_slug: str | None = Form(None),
    max_uses: int | None = Form(None),
    expires_in: int = Form(300),
    
):
    slug = make_or_validate_slug(custom_slug)
    expires_at = (datetime.now(timezone.utc) + timedelta(seconds=expires_in)).isoformat()

    for file in files:
        storage_path = f"{slug}/{file.filename}"
        file_bytes = await file.read()
        supabase.storage.from_(BUCKET).upload(storage_path, file_bytes, {"content-type": file.content_type or "application/octet-stream"})
    
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
    file_rows = supabase.table("link_files").select("*").eq("link_id", link["id"]).execute().data
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w") as zf:
        for f in file_rows:
            file_bytes = supabase.storage.from_(BUCKET).download(f["storage_path"])
            zf.writetest(f["original_name"], file_bytes)
    buffer.seek(0)
    return StreamingResponse(buffer, media_type="application/zip", headers={"Content-Disposition": f"attachment; filename={slug}.zip"})
            