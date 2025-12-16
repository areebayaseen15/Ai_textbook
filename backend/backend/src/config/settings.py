from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

class Settings(BaseModel):
    app_title: str = os.getenv("APP_TITLE", "RAG Chatbot")
    app_version: str = os.getenv("APP_VERSION", "1.0.0")
    debug: bool = os.getenv("DEBUG", "False").lower() == "true"

    # Qdrant settings
    qdrant_host: str = os.getenv("QDRANT_HOST", "")
    qdrant_port: int = int(os.getenv("QDRANT_PORT", "6333"))
    qdrant_api_key: str = os.getenv("QDRANT_API_KEY", "")
    qdrant_collection_name: str = os.getenv("QDRANT_COLLECTION_NAME", "book_content")

    # Cohere settings
    cohere_api_key: str = os.getenv("COHERE_API_KEY", "")

    # Database settings
    database_url: str = os.getenv("DATABASE_URL", "")

    # RAG settings
    chunk_size_min: int = 300
    chunk_size_max: int = 500
    max_response_length: int = 200  # words

    class Config:
        env_file = ".env"

# Create a single instance of settings
settings = Settings()