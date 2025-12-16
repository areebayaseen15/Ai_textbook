from typing import Dict, Any, Optional
from datetime import datetime
import time
import logging

logger = logging.getLogger(__name__)

class LoggingService:
    def __init__(self):
        # For now, just log to console/file instead of database to avoid dependency issues
        pass

    def log_interaction(self,
                       question_content: str,
                       response_content: str,
                       mode: str,
                       user_id: Optional[str] = None,
                       session_id: Optional[str] = None,
                       citations: Optional[Dict[str, Any]] = None,
                       response_time_ms: Optional[int] = None):
        """
        Log a chat interaction (currently to console, can be extended to save to file or DB)
        """
        try:
            # For now, just log to console/file instead of database
            log_entry = {
                'timestamp': datetime.now().isoformat(),
                'question': question_content[:100] + "..." if len(question_content) > 100 else question_content,
                'response': response_content[:100] + "..." if len(response_content) > 100 else response_content,
                'mode': mode.upper(),
                'user_id': user_id,
                'session_id': session_id,
                'response_time_ms': response_time_ms
            }
            
            logger.info(f"Interaction logged: {log_entry}")
            print(f"LOGGED: {log_entry}")  # For visibility during development
            
            return True  # Simulate successful logging
        except Exception as e:
            logger.error(f"Error logging interaction: {str(e)}")
            return False

    def log_interaction_with_timer(self,
                                  question_content: str,
                                  response_content: str,
                                  mode: str,
                                  start_time: float,
                                  user_id: Optional[str] = None,
                                  session_id: Optional[str] = None,
                                  citations: Optional[Dict[str, Any]] = None):
        """
        Log a chat interaction with response time calculation
        """
        end_time = time.time()
        response_time_ms = int((end_time - start_time) * 1000)

        return self.log_interaction(
            question_content=question_content,
            response_content=response_content,
            mode=mode,
            user_id=user_id,
            session_id=session_id,
            citations=citations,
            response_time_ms=response_time_ms
        )

# Create a singleton instance
logging_service = LoggingService()