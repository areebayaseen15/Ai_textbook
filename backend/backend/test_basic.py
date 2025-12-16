"""
Basic test to verify the RAG chatbot implementation
"""
import sys
import os
sys.path.insert(0, os.path.abspath('.'))

def test_imports():
    """Test that all modules can be imported without errors"""
    try:
        from src.config.settings import settings
        print("SUCCESS: Settings imported successfully")

        from src.models import Base, Question, Response, TextSelection, ChatLog, BookContent
        print("SUCCESS: Models imported successfully")

        from src.services.qdrant_service import qdrant_service
        print("SUCCESS: Qdrant service imported successfully")

        from src.services.rag_service import rag_service
        print("SUCCESS: RAG service imported successfully")

        from src.services.ingestion_service import ingestion_service
        print("SUCCESS: Ingestion service imported successfully")

        from src.services.logging_service import logging_service
        print("SUCCESS: Logging service imported successfully")

        from src.api.schemas.request import ChatRequest
        from src.api.schemas.response import ChatResponse
        print("SUCCESS: API schemas imported successfully")

        print("\nAll modules imported successfully!")
        return True
    except ImportError as e:
        print(f"Import error: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error: {e}")
        return False

def test_settings():
    """Test that settings are properly loaded"""
    try:
        from src.config.settings import settings

        # Check that required settings are present
        assert settings.qdrant_host, "Qdrant host not set"
        assert settings.qdrant_api_key, "Qdrant API key not set"
        assert settings.cohere_api_key, "Cohere API key not set"
        assert settings.database_url, "Database URL not set"

        print("SUCCESS: All required settings are present")
        return True
    except Exception as e:
        print(f"Settings error: {e}")
        return False

if __name__ == "__main__":
    print("Running basic tests for RAG Chatbot implementation...\n")

    success = True
    success &= test_imports()
    success &= test_settings()

    if success:
        print("\nSUCCESS: All basic tests passed!")
        print("\nThe RAG Chatbot backend is properly structured and ready for use.")
        print("Next steps:")
        print("1. Run 'python -m src.database_init' to create database tables")
        print("2. Run 'python -m src.run_ingestion' to ingest book content")
        print("3. Start the API with 'uvicorn src.api.main:app --reload'")
    else:
        print("\nFAILURE: Some tests failed!")
        sys.exit(1)