from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time, secrets

app = FastAPI()
storage: dict[str, dict] = {}
EXPIRY_SECONDS = 300

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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

