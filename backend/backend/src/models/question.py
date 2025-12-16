from sqlalchemy import Column, Integer, String, DateTime, Text, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class Question(Base):
    __tablename__ = "questions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)  # The text of the user's question
    mode = Column(String(20), nullable=False)  # BOOK or SELECTION
    selected_text = Column(Text, nullable=True)  # Text provided by user for SELECTION MODE
    timestamp = Column(DateTime(timezone=True), server_default=func.now())  # Automatically set on creation
    user_context = Column(JSON, nullable=True)  # Additional context about the user's session

    def __repr__(self):
        return f"<Question(id={self.id}, content='{self.content[:50]}...', mode='{self.mode}')>"