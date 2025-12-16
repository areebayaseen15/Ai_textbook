from typing import List, Dict, Any, Optional
from ..config.settings import settings
from .qdrant_service import qdrant_service
import cohere
import logging
import re

logger = logging.getLogger(__name__)

class RAGService:
    def __init__(self):
        self.cohere_client = cohere.Client(settings.cohere_api_key)
        self.qdrant_service = qdrant_service

    def _generate_response_with_citations(self, query: str, context: str) -> Dict[str, Any]:
        """
        Generate a response using Cohere with the provided context
        """
        try:
            # Create a prompt that includes the context and query
            prompt = f"""
            Based on the following context, answer the question. If the answer is not in the context, respond with "The answer is not found in the selected text."

            Context: {context}

            Question: {query}

            Answer:
            """

            # Use Cohere to generate the response
            response = self.cohere_client.generate(
                model='command-r-plus',
                prompt=prompt,
                max_tokens=300,  # Limit response length
                temperature=0.3,  # Lower temperature for more consistent responses
            )

            generated_text = response.generations[0].text.strip()

            # Extract citations from the context (simplified approach)
            citations = self._extract_citations(context)

            # Ensure response is within length limits
            if len(generated_text.split()) > settings.max_response_length:
                # Truncate to max response length
                words = generated_text.split()
                truncated_response = ' '.join(words[:settings.max_response_length])
                generated_text = truncated_response

            return {
                'content': generated_text,
                'citations': citations,
                'confidence': 0.8  # Default confidence for now
            }
        except Exception as e:
            logger.error(f"Error generating response with Cohere: {str(e)}")
            return {
                'content': "The answer is not found in the selected text.",
                'citations': [],
                'confidence': 0.0
            }

    def _extract_citations(self, context: str) -> List[Dict[str, str]]:
        """
        Extract citation information from the context
        This is a simplified approach - in a real implementation, you'd have more sophisticated parsing
        """
        citations = []

        # Look for chapter/section patterns in the context
        chapter_matches = re.findall(r'Chapter\s+([IVX\d]+|[\w\s]+)', context, re.IGNORECASE)
        section_matches = re.findall(r'Section\s+([\d\.]+|[\w\s]+)', context, re.IGNORECASE)

        # Create unique citations
        unique_chapters = list(set(chapter_matches))
        unique_sections = list(set(section_matches))

        for chapter in unique_chapters[:3]:  # Limit to first 3 chapters found
            citations.append({
                'chapter': f'Chapter {chapter}',
                'section': '',
                'url': 'https://ai-textbook-orcin.vercel.app/'  # Default book URL
            })

        for section in unique_sections[:3]:  # Limit to first 3 sections found
            citations.append({
                'chapter': '',
                'section': f'Section {section}',
                'url': 'https://ai-textbook-orcin.vercel.app/'
            })

        return citations

    def _search_book_content(self, query: str, limit: int = 5) -> str:
        """
        Search the book content using Qdrant and return relevant passages
        """
        try:
            results = self.qdrant_service.search_similar(query, limit)

            if not results:
                return ""

            # Combine the content from search results
            combined_content = "\n\n".join([result['content'] for result in results])

            # Add metadata to the context for citation extraction
            context_with_metadata = combined_content
            for result in results:
                if result.get('chapter') or result.get('section'):
                    context_with_metadata += f"\n\nSource: {result.get('chapter', '')} {result.get('section', '')} - {result.get('url', '')}"

            logger.info(f"Found {len(results)} relevant passages for query: {query[:50]}...")
            return context_with_metadata
        except Exception as e:
            logger.error(f"Error searching book content: {str(e)}")
            return ""

    def query_book_mode(self, query: str) -> Dict[str, Any]:
        """
        Handle BOOK MODE queries - search the entire book
        """
        logger.info(f"Processing BOOK MODE query: {query[:50]}...")

        # Search the book content for relevant passages
        context = self._search_book_content(query)

        if not context.strip():
            # No relevant content found in the book
            return {
                'content': "The answer is not found in the selected text.",
                'citations': [],
                'confidence': 0.0
            }

        # Generate response with the found context
        return self._generate_response_with_citations(query, context)

    def query_selection_mode(self, query: str, selected_text: str) -> Dict[str, Any]:
        """
        Handle SELECTION MODE queries - only use the provided selected text
        """
        logger.info(f"Processing SELECTION MODE query: {query[:50]}...")

        if not selected_text or not selected_text.strip():
            # No selected text provided
            return {
                'content': "The answer is not found in the selected text.",
                'citations': [],
                'confidence': 0.0
            }

        # Generate response using only the selected text as context
        return self._generate_response_with_citations(query, selected_text)

    def process_query(self, query: str, mode: str, selected_text: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a query based on the specified mode
        """
        if mode.upper() == "BOOK":
            return self.query_book_mode(query)
        elif mode.upper() == "SELECTION":
            return self.query_selection_mode(query, selected_text)
        else:
            # Invalid mode
            return {
                'content': "The answer is not found in the selected text.",
                'citations': [],
                'confidence': 0.0
            }

# Create a singleton instance
rag_service = RAGService()