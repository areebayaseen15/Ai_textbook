from sqlalchemy import Column, Integer, String, DateTime, Text, JSON, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class Response(Base):
    __tablename__ = "responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)  # The text of the system's answer
    citations = Column(JSON, nullable=True)  # References to source chapters/sections/URLs
    confidence = Column(Integer, nullable=True)  # Confidence score for the response (0-100)
    source_passages = Column(JSON, nullable=True)  # The passages from which the answer was derived
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id"), nullable=False)  # Foreign key linking to the question
    timestamp = Column(DateTime(timezone=True), server_default=func.now())  # Automatically set on creation

    def __repr__(self):
        return f"<Response(id={self.id}, content='{self.content[:50]}...', question_id={self.question_id})>"