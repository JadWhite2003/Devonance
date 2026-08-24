from pydantic import BaseModel, Field

class PasteRequest(BaseModel):
    content: str
    custom_slug: str | None = None
    max_uses: int | None = None
    expires_in: int = 300
    
class LinkResponse(BaseModel):
    slug: str
    url: str