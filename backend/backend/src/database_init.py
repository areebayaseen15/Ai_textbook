from .config.database import engine, Base
from .models import Base as ModelBase

def init_db():
    """
    Initialize the database by creating all tables
    """
    print("Initializing database tables...")

    # Create all tables defined in the models
    ModelBase.metadata.create_all(bind=engine)

    print("Database tables created successfully!")

if __name__ == "__main__":
    init_db()