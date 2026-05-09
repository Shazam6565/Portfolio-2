---
title: Portfolio RAG Backend
emoji: 🤖
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# Portfolio Chatbot Backend

This directory contains the Python backend for the RAG-based chat interface and is also the deployable unit pushed to a Hugging Face Space.

## Hugging Face Space

The frontmatter above is required by Hugging Face Spaces. `app_port: 7860` must match the port `Dockerfile` exposes and `uvicorn` binds to.

Set the `GROQ_API_KEY` (and optionally `TAVILY_API_KEY`) as Space **Secrets** in the Space settings — never commit them.

## Local Setup

1. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and add your Groq API Key.

   ```bash
   cp .env.example .env
   # Edit .env and add GROQ_API_KEY
   ```

3. **Ingest Documents**:
   The profile source lives at `data/shaurya_rag_profile.txt`. Run:

   ```bash
   python ingest.py
   ```

   This builds the persistent Chroma collection at `chroma_profile/`.

4. **Run Server**:
   ```bash
   uvicorn main:app --reload
   ```
   Local API at `http://localhost:8000`. Interactive docs at `http://localhost:8000/docs`.

## API Usage

**POST** `/chat`

```json
{
  "message": "What is Shaurya's experience with Python?"
}
```
