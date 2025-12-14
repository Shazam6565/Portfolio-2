from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
from langchain_openai import OpenAIEmbeddings
from langchain_chroma import Chroma

load_dotenv()

app = FastAPI(title="Portfolio RAG Chatbot API")

# Add CORS Middleware to allow requests from Frontend (likely localhost:8000 or 8001)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For dev, allow all. For prod, set specific domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@app.get("/")
async def root():
    return {"message": "Portfolio Chatbot API is running"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set")
    
    CHROMA_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")
    
    embedding_function = OpenAIEmbeddings()
    vector_db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    
    # Simple retrieval chain
    from langchain.chains import RetrievalQA
    from langchain_openai import ChatOpenAI
    
    llm = ChatOpenAI(temperature=0.0) # This is where we set the LLM to be used as ChatOpenAI
    retriever = vector_db.as_retriever(search_kwargs={"k": 3}) # k is the number of documents to retrieve
    
    # Custom Prompt Template
    from langchain.prompts import PromptTemplate
    
    template = """You are a helpful AI assistant for Shaurya's Portfolio.
    Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say that you don't know, don't try to make up an answer.
    Keep the answer concise and professional.
    
    Context: {context}
    
    Question: {question}
    
    Helpful Answer:"""
    
    QA_CHAIN_PROMPT = PromptTemplate.from_template(template)

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True,
        chain_type_kwargs={"prompt": QA_CHAIN_PROMPT}
    )
    
    result = qa_chain.invoke({"query": request.message})
    
    response_text = result["result"]
    source_docs = [doc.metadata.get("source", "unknown") for doc in result["source_documents"]]
    
    return {
        "response": response_text,
        "source_documents": list(set(source_docs))
    }
