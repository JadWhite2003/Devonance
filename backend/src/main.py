from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from dotenv import load_dotenv
from pathlib import Path

src_dir = Path(__file__).resolve().parent
print("src_dir:", src_dir)
print("routers exists:", (src_dir / "routers").is_dir())
print("src contents:", list(src_dir.iterdir()))

sys.path.insert(0, str(Path(__file__).resolve().parent))

from routers import paste, files, links

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://devonance.vercel.app"],
    allow_origin_regex=r"https://devonance-.*\.vercel\.app",
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(paste.router)
app.include_router(files.router)
app.include_router(links.router)

