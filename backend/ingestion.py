import os
from langchain_community.document_loaders import DirectoryLoader, TextLoader, PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma
from dotenv import load_dotenv

import shutil

load_dotenv()

DATA_PATH = "/Users/shauryatiwari/Desktop/gits/ST-PRTFLO-2/backend/data"
CHROMA_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")

def ingest_documents():
    # 0. Clear logic
    if os.path.exists(CHROMA_PATH):
        shutil.rmtree(CHROMA_PATH)
        print(f"Cleared existing DB at {CHROMA_PATH}")

    # 1. Load Documents
    if not os.path.exists(DATA_PATH):
        os.makedirs(DATA_PATH)
        print(f"Created {DATA_PATH}. Please add your marksheets/resumes there.")
        return

    print("Loading documents...")
    documents = []
    # Load MD
    loader_md = DirectoryLoader(DATA_PATH, glob="**/*.md", loader_cls=TextLoader)
    documents.extend(loader_md.load())
    
    # Load TXT
    loader_txt = DirectoryLoader(DATA_PATH, glob="**/*.txt", loader_cls=TextLoader)
    documents.extend(loader_txt.load())
    
    # Load PDF
    loader_pdf = DirectoryLoader(DATA_PATH, glob="**/*.pdf", loader_cls=PyPDFLoader)
    documents.extend(loader_pdf.load())
    
    # You can add more loaders for PDF, etc.
    
    if not documents:
        print("No documents found to ingest.")
        return
        
    print(f"Loaded {len(documents)} documents.")
    for i, doc in enumerate(documents):
        print(f"Doc {i} length: {len(doc.page_content)}")
        print(f"Doc {i} sample: {doc.page_content[:100]}...")

    # 2. Split Text
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

    # 3. Embed and Store
    if not os.getenv("OPENAI_API_KEY"):
        print("OPENAI_API_KEY not found. Cannot generate embeddings.")
        return

    embedding_function = OpenAIEmbeddings()
    
    # Initialize Chroma
    db = Chroma.from_documents(
        documents=chunks, 
        embedding=embedding_function, 
        persist_directory=CHROMA_PATH
    )
    
    print(f"Saved {len(chunks)} chunks to {CHROMA_PATH}.")

if __name__ == "__main__":
    ingest_documents()
