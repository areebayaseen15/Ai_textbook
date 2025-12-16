from .services.ingestion_service import ingestion_service

def run_ingestion():
    """
    Run the book ingestion process from command line
    """
    print("Starting book content ingestion...")
    try:
        chunks_count = ingestion_service.ingest_book()
        print(f"Ingestion completed successfully! Added {chunks_count} content chunks to the vector database.")
    except Exception as e:
        print(f"Error during ingestion: {str(e)}")
        raise

if __name__ == "__main__":
    run_ingestion()