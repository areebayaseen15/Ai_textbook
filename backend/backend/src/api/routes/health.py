from fastapi import APIRouter
from ...api.schemas.response import HealthResponse
from ...services.qdrant_service import qdrant_service
from ...config.database import engine
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
        "database": "disconnected",
        "api": "running"
    }

    # Check Qdrant connection
    try:
        info = qdrant_service.get_collection_info()
        if info:
            services_status["qdrant"] = "connected"
        else:
            services_status["qdrant"] = "connection_error"
    except Exception as e:
        logger.error(f"Qdrant health check failed: {str(e)}")
        services_status["qdrant"] = f"error: {str(e)}"

    # Check database connection
    try:
        conn = engine.connect()
        conn.close()
        services_status["database"] = "connected"
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        services_status["database"] = f"error: {str(e)}"

    # Overall status
    all_healthy = all(status == "connected" for service, status in services_status.items() if service != "api")

    return HealthResponse(
        status="healthy" if all_healthy else "degraded",
        services=services_status
    )