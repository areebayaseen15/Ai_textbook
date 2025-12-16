import requests
from bs4 import BeautifulSoup
import re
from typing import List, Dict, Any
from ..config.settings import settings
from .qdrant_service import qdrant_service
import tiktoken
import logging

logger = logging.getLogger(__name__)

class IngestionService:
    def __init__(self):
        self.book_url = "https://ai-textbook-orcin.vercel.app/"
        self.enc = tiktoken.get_encoding("cl100k_base")  # Common encoding for token counting

    def fetch_book_content(self) -> str:
        """
        Fetch book content from the Vercel deployment
        """
        try:
            response = requests.get(self.book_url)
            response.raise_for_status()

            # Parse the HTML content
            soup = BeautifulSoup(response.content, 'html.parser')

            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()

            # Get text content
            text = soup.get_text()

            # Clean up text (remove extra whitespace)
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)

            logger.info(f"Fetched book content with {len(text)} characters")
            return text
        except Exception as e:
            logger.error(f"Error fetching book content: {str(e)}")
            raise

    def chunk_text(self, text: str) -> List[Dict[str, Any]]:
        """
        Split text into chunks of 300-500 tokens
        """
        # Split text into sentences to maintain coherence
        sentences = re.split(r'[.!?]+', text)

        chunks = []
        current_chunk = ""
        current_tokens = 0

        for sentence in sentences:
            # Estimate token count for the sentence
            sentence_tokens = len(self.enc.encode(sentence))

            # Check if adding this sentence would exceed max chunk size
            if current_tokens + sentence_tokens > settings.chunk_size_max and current_chunk:
                # Save the current chunk if it's within the acceptable range
                if current_tokens >= settings.chunk_size_min:
                    chunks.append({
                        'content': current_chunk.strip(),
                        'token_count': current_tokens
                    })
                    current_chunk = sentence.strip() + ". "
                    current_tokens = sentence_tokens + 1  # +1 for the period
                else:
                    # If current chunk is too small, add the sentence anyway
                    current_chunk += sentence.strip() + ". "
                    current_tokens += sentence_tokens + 1
            else:
                # Add sentence to current chunk
                current_chunk += sentence.strip() + ". "
                current_tokens += sentence_tokens + 1

        # Add the last chunk if it exists and meets minimum size
        if current_chunk.strip() and len(current_chunk.strip()) > 0:
            if current_tokens >= settings.chunk_size_min:
                chunks.append({
                    'content': current_chunk.strip(),
                    'token_count': current_tokens
                })
            else:
                # If the last chunk is too small, try to append it to the previous chunk if possible
                if chunks:
                    last_chunk = chunks[-1]
                    last_chunk['content'] += " " + current_chunk.strip()
                    last_chunk['token_count'] += current_tokens
                else:
                    # If there are no previous chunks, add this one even if it's small
                    chunks.append({
                        'content': current_chunk.strip(),
                        'token_count': current_tokens
                    })

        logger.info(f"Created {len(chunks)} text chunks from book content")
        return chunks

    def process_book_content(self) -> List[Dict[str, Any]]:
        """
        Process book content into chunks with metadata
        """
        logger.info("Starting book content ingestion process")

        # Fetch the book content
        raw_content = self.fetch_book_content()

        # Chunk the content
        text_chunks = self.chunk_text(raw_content)

        # Create payloads with metadata for each chunk
        payloads = []
        for i, chunk in enumerate(text_chunks):
            payload = {
                'content': chunk['content'],
                'chunk_index': i,
                'chapter': f'Chapter_{i//10 + 1}',  # Basic chapter estimation
                'section': f'Section_{i%10 + 1}',   # Basic section estimation
                'url': self.book_url,
                'token_count': chunk['token_count']
            }
            payloads.append(payload)

        logger.info(f"Prepared {len(payloads)} payloads for embedding")
        return payloads

    def ingest_book(self) -> int:
        """
        Complete ingestion process: fetch, process, and store in Qdrant
        """
        try:
            logger.info("Starting complete book ingestion process")

            # Process the book content
            payloads = self.process_book_content()

            # Extract just the content for embedding
            texts = [payload['content'] for payload in payloads]

            # Add embeddings to Qdrant
            point_ids = qdrant_service.add_embeddings(texts, payloads)

            logger.info(f"Successfully ingested {len(point_ids)} chunks into Qdrant")
            return len(point_ids)
        except Exception as e:
            logger.error(f"Error during ingestion process: {str(e)}")
            raise

# Create a singleton instance
ingestion_service = IngestionService()