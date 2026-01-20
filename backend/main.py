from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv

# Import the new logic
from .query import answer_fit_question

load_dotenv()

app = FastAPI(title="Portfolio RAG Chatbot API")

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[dict]] = []

@app.get("/")
async def root():
    return {"message": "Portfolio Chatbot API (Advanced RAG) is running"}

@app.post("/chat")
async def chat_endpoint(request: ChatRequest):
    if not os.getenv("OPENAI_API_KEY"):
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not set")
    
    try:
        # Use the advanced RAG + Comparative function
        response_text = answer_fit_question(request.message)
        
        return {
            "response": response_text
        }
    except Exception as e:
        print(f"Error processing request: {e}")
        raise HTTPException(status_code=500, detail=str(e))
