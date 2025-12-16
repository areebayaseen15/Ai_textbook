import tiktoken
from typing import List, Tuple
from ..config.settings import settings

class TextProcessor:
    def __init__(self):
        self.enc = tiktoken.get_encoding("cl100k_base")  # Common encoding for token counting

    def count_tokens(self, text: str) -> int:
        """
        Count the number of tokens in a text string
        """
        return len(self.enc.encode(text))

    def chunk_text_by_tokens(self, text: str, min_tokens: int = 300, max_tokens: int = 500) -> List[str]:
        """
        Split text into chunks based on token count (300-500 tokens)
        """
        sentences = self._split_into_sentences(text)
        chunks = []
        current_chunk = ""
        current_token_count = 0

        for sentence in sentences:
            sentence_token_count = self.count_tokens(sentence)

            # If adding this sentence would exceed max tokens
            if current_token_count + sentence_token_count > max_tokens and current_chunk:
                # Add the current chunk if it meets minimum size requirements
                if current_token_count >= min_tokens:
                    chunks.append(current_chunk.strip())
                    current_chunk = sentence
                    current_token_count = sentence_token_count
                else:
                    # If current chunk is too small, add the sentence anyway
                    current_chunk += " " + sentence
                    current_token_count += sentence_token_count
            else:
                # Add sentence to current chunk
                if current_chunk:
                    current_chunk += " " + sentence
                    current_token_count += sentence_token_count + 1  # +1 for the space
                else:
                    current_chunk = sentence
                    current_token_count = sentence_token_count

        # Add the last chunk if it exists
        if current_chunk.strip():
            if current_token_count >= min_tokens or not chunks:
                # If the chunk is at least the minimum size, or if it's the only chunk
                chunks.append(current_chunk.strip())
            else:
                # If the last chunk is too small and there are other chunks, append to the last chunk
                if chunks:
                    chunks[-1] += " " + current_chunk.strip()

        return chunks

    def _split_into_sentences(self, text: str) -> List[str]:
        """
        Split text into sentences using common sentence delimiters
        """
        import re

        # Split by sentence-ending punctuation
        sentences = re.split(r'[.!?]+', text)

        # Clean up and filter empty sentences
        sentences = [s.strip() for s in sentences if s.strip()]

        return sentences

    def validate_selection_mode_input(self, selected_text: str) -> Tuple[bool, str]:
        """
        Validate input for SELECTION MODE
        """
        if not selected_text or not selected_text.strip():
            return False, "Selected text cannot be empty"

        token_count = self.count_tokens(selected_text)
        if token_count < settings.chunk_size_min:
            return False, f"Selected text is too short (minimum {settings.chunk_size_min} tokens)"

        if token_count > settings.chunk_size_max * 10:  # Allow up to 10x max for selection
            return False, f"Selected text is too long (maximum {settings.chunk_size_max * 10} tokens)"

        return True, "Valid selection"

# Create a singleton instance
text_processor = TextProcessor()