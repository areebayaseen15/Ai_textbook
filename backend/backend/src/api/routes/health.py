from fastapi import APIRouter
from ...api.schemas.response import HealthResponse
from ...services.qdrant_service import qdrant_service
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

@router.get("/", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint to verify all services are operational
    """
    services_status = {
        "qdrant": "disconnected",
        "database": "not_required_for_basic_operation",
        "api": "running"
    }

    # Check Qdrant connection
    try:
        # Only try to check if qdrant client is available
        if qdrant_service.client is not None:
            info = qdrant_service.get_collection_info()
            if info:
                services_status["qdrant"] = "connected"
            else:
                services_status["qdrant"] = "available_no_collection"
        else:
            services_status["qdrant"] = "not_configured"
    except Exception as e:
        logger.error(f"Qdrant health check failed: {str(e)}")
        services_status["qdrant"] = f"error: {str(e)}"

    # Overall status - API is running regardless of other services
    return HealthResponse(
        status="running",  # We'll report running instead of healthy to indicate basic functionality
        services=services_status
    )