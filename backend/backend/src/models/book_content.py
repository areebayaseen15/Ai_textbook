from sqlalchemy import Column, Integer, String, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
import uuid
from sqlalchemy.dialects.postgresql import UUID

Base = declarative_base()

class BookContent(Base):
    __tablename__ = "book_content"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    content = Column(Text, nullable=False)  # The text content of this chunk
    chunk_index = Column(Integer, nullable=False)  # Position of this chunk in the book
    chapter = Column(String, nullable=False)  # Chapter name/identifier
    section = Column(String, nullable=True)  # Section name/identifier
    url = Column(String, nullable=False)  # URL reference to the content source
    vector_id = Column(String, nullable=False)  # ID in the vector database
    token_count = Column(Integer, nullable=False)  # Number of tokens in this chunk
    created_at = Column(DateTime(timezone=True), server_default=func.now())  # Automatically set on creation

    def __repr__(self):
        return f"<BookContent(id={self.id}, chapter='{self.chapter}', section='{self.section}', chunk_index={self.chunk_index})>"