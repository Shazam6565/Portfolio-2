import os
import re
import shutil
from pathlib import Path
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

# Load env variables
load_dotenv()

PROJ_ROOT = Path(__file__).parent
DATA_PATH = PROJ_ROOT / "data" / "shaurya_rag_profile.txt"
CHROMA_PATH = PROJ_ROOT / "chroma_profile"  # Distinct from existing chroma_db

CHUNK_SIZE = 600
CHUNK_OVERLAP = 80

def load_and_chunk(path: Path):
    """
    Reads the profile text file and splits it by section headers.
    Returns a list of document dicts with metadata.
    """
    if not path.exists():
        raise FileNotFoundError(f"Profile file not found at {path}")

    raw_text = path.read_text(encoding="utf-8")
    
    # Regex to capture section headers formatted like:
    # ================================================================================
    # SECTION NAME
    # ================================================================================
    # The pattern looks for at least 10 '=' signs, a newline, the title line, a newline, and at least 10 '=' signs
    pattern = r"=+\n([A-Z /()\-]+)\n=+\n"
    
    # Split text by the pattern. 
    # re.split returns [text_before_1st_match, capture_group_1, text_between_1_and_2, capture_group_2, ...]
    splits = re.split(pattern, raw_text)
    
    # The first element is usually the preamble before the first header (or empty if file starts with header)
    # If the file starts with a header, splits[0] is empty. 
    # Logic: iterate 1 -> end, stepping by 2.
    # splits[i] = Title
    # splits[i+1] = Content
    
    docs = []
    
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=CHUNK_SIZE,
        chunk_overlap=CHUNK_OVERLAP,
        separators=["\n\n", "\n", ".", " ", ""]
    )

    # Handle preamble if it exists and is meaningful? 
    # The profile starts with metadata, then section headers. 
    # Let's treat the preamble as "METADATA/INTRO"
    if splits[0].strip():
        preamble_chunks = text_splitter.split_text(splits[0])
        for chunk in preamble_chunks:
            docs.append({"text": chunk, "metadata": {"section": "PREAMBLE"}})

    # Iterate sections
    for i in range(1, len(splits), 2):
        if i + 1 >= len(splits):
            break
            
        title = splits[i].strip()
        content = splits[i+1].strip()
        
        if not content:
            continue
            
        chunks = text_splitter.split_text(content)
        for chunk in chunks:
            docs.append({
                "text": chunk,
                "metadata": {"section": title}
            })
            
    return docs

def ingest():
    """
    Main ingestion function.
    """
    print(f"Reading from: {DATA_PATH}")
    
    # 1. Load and Chunk
    try:
        doc_dicts = load_and_chunk(DATA_PATH)
    except Exception as e:
        print(f"Error processing file: {e}")
        return

    print(f"Extracted {len(doc_dicts)} chunks across various sections.")

    # 2. Prepare for Chroma
    texts = [d["text"] for d in doc_dicts]
    metadatas = [d["metadata"] for d in doc_dicts]

    # 3. Initialize Embedding Function
    if not os.getenv("OPENAI_API_KEY"):
        print("Error: OPENAI_API_KEY not found in environment.")
        return
        
    embedding_function = OpenAIEmbeddings()

    # 4. Clear existing DB if we want a fresh start (Optional, but good for idempotent runs)
    if CHROMA_PATH.exists():
        print(f"Removing existing DB at {CHROMA_PATH}...")
        shutil.rmtree(CHROMA_PATH)

    # 5. Create and Persist
    print(f"Creating vector store at {CHROMA_PATH}...")
    Chroma.from_texts(
        texts=texts,
        metadatas=metadatas,
        embedding=embedding_function,
        persist_directory=str(CHROMA_PATH)
    )
    
    print("✓ Profile ingested successfully")

if __name__ == "__main__":
    ingest()
