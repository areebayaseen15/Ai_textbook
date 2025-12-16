from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import chat, health
from ..config.settings import settings

# Create FastAPI app with settings
app = FastAPI(
    title=settings.app_title,
    version=settings.app_version,
    debug=settings.debug
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(health.router, prefix="/api/health", tags=["health"])

@app.get("/")
async def root():
    return {"message": "RAG Chatbot API for Physical AI & Humanoid Robotics Book", "version": settings.app_version}

# This would be the entry point for uvicorn
# Usage: uvicorn src.api.main:app --reload