from fastapi import APIRouter, HTTPException, Request
from typing import Optional
import time
from ...services.rag_service import rag_service
from ...services.logging_service import logging_service
from ...api.schemas.request import ChatRequest
from ...api.schemas.response import ChatResponse, Citation
from ...config.settings import settings

router = APIRouter()

@router.post("/", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint that handles both BOOK MODE and SELECTION MODE queries
    """
    start_time = time.time()

    try:
        # Process the query based on mode
        result = rag_service.process_query(
            query=request.content,
            mode=request.mode,
            selected_text=request.selected_text
        )

        # Log the interaction
        logging_service.log_interaction_with_timer(
            question_content=request.content,
            response_content=result['content'],
            mode=request.mode,
            start_time=start_time,
            citations=result.get('citations', [])
        )

        # Format citations properly for the response
        formatted_citations = []
        if result.get('citations'):
            for citation in result['citations']:
                formatted_citations.append(Citation(
                    chapter=citation.get('chapter', ''),
                    section=citation.get('section', ''),
                    url=citation.get('url', '')
                ))

        # Create and return the response
        response = ChatResponse(
            content=result['content'],
            citations=formatted_citations if formatted_citations else None,
            confidence=result.get('confidence')
        )

        return response

    except Exception as e:
        # Log the error interaction
        logging_service.log_interaction_with_timer(
            question_content=request.content,
            response_content="Error processing request",
            mode=request.mode,
            start_time=start_time,
            citations=[]
        )

        raise HTTPException(status_code=500, detail=str(e))

@router.post("/ingest")
async def ingest_endpoint(request: Request):
    """
    Ingest endpoint for processing book content
    """
    from ...services.ingestion_service import ingestion_service

    try:
        # For now, we'll use the default book URL
        # In a full implementation, we might take the URL from the request
        chunks_processed = ingestion_service.ingest_book()

        return {
            "status": "success",
            "chunks_processed": chunks_processed,
            "message": f"Successfully ingested {chunks_processed} content chunks"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during ingestion: {str(e)}")