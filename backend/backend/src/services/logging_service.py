from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from datetime import datetime
import time
from ..models.chat_log import ChatLog
from ..config.database import SessionLocal

class LoggingService:
    def __init__(self):
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
        Log a chat interaction to the database
        """
        db = SessionLocal()
        try:
            chat_log = ChatLog(
                question_content=question_content,
                response_content=response_content,
                mode=mode.upper(),
                user_id=user_id,
                session_id=session_id,
                citations=citations,
                response_time_ms=response_time_ms
            )

            db.add(chat_log)
            db.commit()
            db.refresh(chat_log)

            return chat_log.id
        except Exception as e:
            db.rollback()
            print(f"Error logging interaction: {str(e)}")
            raise
        finally:
            db.close()

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