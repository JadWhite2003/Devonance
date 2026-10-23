from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys
from dotenv import load_dotenv
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from routers import paste, files, links, admin

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
app.include_router(admin.router)

