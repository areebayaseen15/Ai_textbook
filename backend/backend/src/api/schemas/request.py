from pydantic import BaseModel
from typing import Optional
from enum import Enum

class ModeEnum(str, Enum):
    BOOK = "BOOK"
    SELECTION = "SELECTION"

class ChatRequest(BaseModel):
    content: str
    mode: ModeEnum
    selected_text: Optional[str] = None

    class Config:
        # Allow the mode to be case-insensitive
        use_enum_values = True

class IngestionRequest(BaseModel):
    url: str