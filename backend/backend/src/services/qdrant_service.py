import uuid
from typing import List, Optional, Dict, Any
from qdrant_client import QdrantClient
from qdrant_client.http import models
from qdrant_client.http.models import Distance, VectorParams, PointStruct
from ..config.settings import settings
import logging
import cohere

logger = logging.getLogger(__name__)

class QdrantService:
    def __init__(self):
        # Initialize Qdrant client with provided credentials
        self.client = QdrantClient(
            host=settings.qdrant_host,
            port=settings.qdrant_port,
            api_key=settings.qdrant_api_key,
            https=True
        )
        self.collection_name = settings.qdrant_collection_name
        self.vector_size = 1024  # Cohere embeddings size

        # Initialize Cohere client for embeddings
        self.cohere_client = cohere.Client(settings.cohere_api_key)

        # Ensure the collection exists
        self._ensure_collection()

    def _ensure_collection(self):
        """Ensure the Qdrant collection exists with proper configuration"""
        try:
            # Check if collection exists
            self.client.get_collection(self.collection_name)
            logger.info(f"Collection '{self.collection_name}' already exists")
        except:
            # Create collection if it doesn't exist
            self.client.create_collection(
                collection_name=self.collection_name,
                vectors_config=VectorParams(size=self.vector_size, distance=Distance.COSINE),
            )
            logger.info(f"Created collection '{self.collection_name}'")

    def add_embeddings(self, texts: List[str], payloads: List[Dict[str, Any]]) -> List[str]:
        """
        Add text embeddings to the Qdrant collection

        Args:
            texts: List of text chunks to embed
            payloads: List of metadata for each text chunk

        Returns:
            List of point IDs for the added embeddings
        """
        if not texts:
            return []

        # Generate embeddings using Cohere
        response = self.cohere_client.embed(
            texts=texts,
            model='embed-english-v3.0',  # Using Cohere's English embedding model
            input_type='search_document'  # Specify this is for search documents
        )
        embeddings = response.embeddings

        # Generate unique IDs for each point
        point_ids = [str(uuid.uuid4()) for _ in texts]

        # Prepare points for insertion
        points = []
        for point_id, text, payload, embedding in zip(point_ids, texts, payloads, embeddings):
            points.append(
                PointStruct(
                    id=point_id,
                    vector=embedding,  # Use the actual embedding vector from Cohere
                    payload=payload
                )
            )

        # Add points to collection
        self.client.upsert(
            collection_name=self.collection_name,
            points=points
        )

        logger.info(f"Added {len(texts)} embeddings to collection '{self.collection_name}'")
        return point_ids

    def search_similar(self, query_text: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search for similar content in the Qdrant collection

        Args:
            query_text: The query text to find similar content for
            limit: Maximum number of results to return

        Returns:
            List of similar content with metadata
        """
        try:
            # Generate embedding for the query text using Cohere
            query_response = self.cohere_client.embed(
                texts=[query_text],
                model='embed-english-v3.0',
                input_type='search_query'  # Specify this is a search query
            )
            query_embedding = query_response.embeddings[0]

            # Search in Qdrant using the embedded query
            results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_embedding,
                limit=limit
            )

            # Extract content and metadata from results
            similar_content = []
            for result in results:
                similar_content.append({
                    'content': result.payload.get('content', ''),
                    'chapter': result.payload.get('chapter', ''),
                    'section': result.payload.get('section', ''),
                    'url': result.payload.get('url', ''),
                    'score': result.score
                })

            logger.info(f"Found {len(similar_content)} similar items for query: {query_text[:50]}...")
            return similar_content
        except Exception as e:
            logger.error(f"Error searching similar content: {str(e)}")
            return []

    def delete_collection(self):
        """Delete the entire collection (useful for reindexing)"""
        try:
            self.client.delete_collection(self.collection_name)
            logger.info(f"Deleted collection '{self.collection_name}'")
        except Exception as e:
            logger.error(f"Error deleting collection: {str(e)}")

    def get_collection_info(self):
        """Get information about the collection"""
        try:
            info = self.client.get_collection(self.collection_name)
            return {
                'name': info.config.params.vectors.size,
                'vector_size': info.config.params.vectors.size,
                'points_count': info.points_count
            }
        except Exception as e:
            logger.error(f"Error getting collection info: {str(e)}")
            return None

# Create a singleton instance
qdrant_service = QdrantService()