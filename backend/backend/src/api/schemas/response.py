from pydantic import BaseModel
from typing import List, Optional, Dict, Any

class Citation(BaseModel):
    chapter: Optional[str] = None
    section: Optional[str] = None
    url: Optional[str] = None

class ChatResponse(BaseModel):
    content: str
    citations: Optional[List[Citation]] = None
    confidence: Optional[float] = None

class IngestionResponse(BaseModel):
    status: str
    chunks_processed: int
    message: str

class HealthResponse(BaseModel):
    status: str
    services: Dict[str, str]