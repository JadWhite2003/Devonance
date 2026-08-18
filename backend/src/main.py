from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time, secrets, os, shutil

app = FastAPI()
storage: dict[str, dict] = {}
EXPIRY_SECONDS = 300

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class PasteRequest(BaseModel):
    content: str
    
@app.post("/paste")
def create_paste(req: PasteRequest):
    paste_id = secrets.token_urlsafe(6)
    storage[paste_id] = {
        "content": req.content,
        "expires_at": time.time() + EXPIRY_SECONDS
        
    }
    return {"id": paste_id, "url" : f"/paste/{paste_id}"}

@app.get("/paste/{paste_id}")
def get_paste(paste_id: str):
    item = storage.get(paste_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found/expired")
    if time.time() > item["expires_at"]:
        del storage[paste_id]
        raise HTTPException(status_code=404, detail="Not found/expired")
    return{"content": item["content"]}

@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    file_id = secrets.token_urlsafe(6)
    saved_path = os.path.join(UPLOAD_DIR, file_id)
    
    with open(saved_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    storage[file_id] = {
        "type": "file",
        "path": saved_path,
        "original_name": file.filename,
        "expires_at": time.time() + EXPIRY_SECONDS
    }
    return {"id":file_id, "url": f"/download/{file_id}"}

@app.get("/download/{file_id}")
def download_file(file_id: str):
    from fastapi.responses import FileResponse

    item = storage.get(file_id)
    if not item:
        raise HTTPException(status_code=404, detail="Not found/expired")
    if time.time() > item["expires_at"]:
        os.remove(item["path"])
        del storage[file_id]
        raise HTTPException(status_code=404, detail="Not found/expired")
    return FileResponse(item["path"], filename=item["original_name"])

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

