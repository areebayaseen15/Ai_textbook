from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class ChatLog(Base):
    __tablename__ = "chat_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_content = Column(Text, nullable=False)  # The original question text
    response_content = Column(Text, nullable=False)  # The system's response text
    mode = Column(String(20), nullable=False)  # The mode used for this interaction (BOOK or SELECTION)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())  # Automatically set on creation
    user_id = Column(String, nullable=True)  # Identifier for the user (if available)
    session_id = Column(String, nullable=True)  # Identifier for the conversation session
    citations = Column(JSON, nullable=True)  # Citations included in the response
    response_time_ms = Column(Integer, nullable=True)  # Time taken to generate the response

    def __repr__(self):
        return f"<ChatLog(id={self.id}, mode='{self.mode}', timestamp={self.timestamp})>"