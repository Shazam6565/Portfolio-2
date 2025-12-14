import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")

def check_db():
    if not os.path.exists(CHROMA_PATH):
        print(f"Chroma DB not found at {CHROMA_PATH}")
        return

    embedding_function = OpenAIEmbeddings()
    db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    
    # Get collection count (this might vary based on Chroma version, but checking via get() is reliable)
    # Note: Chroma client has .count(), but via LangChain wrapper usually we just query or check underlying collection.
    
    # A generic way to "peek" is to just try a similarity search with a dummy query or get all IDs.
    # Since LangChain's Chroma wrapper wraps the client, we can access ._collection in some versions, or just use invoke.
    
    print(f"Connecting to DB at {CHROMA_PATH}...")
    
    # Try fetching a few docs
    # Using get() without filter gets everything (or first batch)
    try:
        # Accessing the underlying chromadb collection object if available
        count = db._collection.count()
        print(f"Total documents in DB: {count}")
        
        if count > 0:
            print("\nSample Document:")
            peek = db._collection.peek(limit=1)
            # peek returns a dict with 'ids', 'embeddings', 'metadatas', 'documents'
            print(f"Content: {peek['documents'][0][:200]}...")
            print(f"Metadata: {peek['metadatas'][0]}")
    except Exception as e:
        print(f"Could not directly access collection stats: {e}")
        print("Trying similarity search...")
        docs = db.similarity_search("programmer", k=1)
        print(f"Found {len(docs)} document(s) for query 'programmer'.")
        if docs:
            print(f"Preview: {docs[0].page_content[:100]}...")

if __name__ == "__main__":
    check_db()
