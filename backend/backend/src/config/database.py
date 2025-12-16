# Mock database module to avoid import errors during startup
# This is only for startup purposes - the actual database connection will be handled later if needed

class MockEngine:
    def connect(self):
        raise Exception("Database not available in mock mode")
    
    def __getattr__(self, name):
        # Return a callable that raises an exception
        def mock_method(*args, **kwargs):
            raise Exception(f"Database not available in mock mode - trying to call {name}")
        return mock_method

# Create a mock engine that won't trigger SQLAlchemy errors at import time
engine = MockEngine()

class MockSessionLocal:
    def __call__(self):
        return self
    
    def __enter__(self):
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        pass
    
    def add(self, obj):
        pass
    
    def commit(self):
        pass
    
    def refresh(self, obj):
        pass
    
    def close(self):
        pass

SessionLocal = MockSessionLocal()

# Base class for models (empty implementation)
class MockBase:
    pass

Base = MockBase()

def get_db():
    """
    Mock dependency function to get database session
    """
    yield MockSessionLocal()