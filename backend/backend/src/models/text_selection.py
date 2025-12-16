from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class TextSelection(Base):
    __tablename__ = "text_selections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)  # The selected text content
    start_position = Column(Integer, nullable=True)  # Starting character position in source
    end_position = Column(Integer, nullable=True)  # Ending character position in source
    chapter_reference = Column(String, nullable=True)  # Chapter/section identifier from source
    page_reference = Column(String, nullable=True)  # Page number if applicable
    timestamp = Column(DateTime(timezone=True), server_default=func.now())  # Automatically set on creation

    def __repr__(self):
        return f"<TextSelection(id={self.id}, content='{self.content[:50]}...', chapter='{self.chapter_reference}')>"