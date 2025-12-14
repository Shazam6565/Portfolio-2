# Portfolio Chatbot Backend

This directory contains the Python backend for the RAG-based chat interface.

## Setup

1. **Install Dependencies**:

   ```bash
   pip install -r requirements.txt
   ```

2. **Environment Variables**:
   Copy `.env.example` to `.env` and add your OpenAI API Key.

   ```bash
   cp .env.example .env
   # Edit .env and add OPENAI_API_KEY
   ```

3. **Ingest Documents**:
   Place your documents (Resume, Marksheets, etc.) in a folder (e.g., `data/`) mostly text or markdown files work best.
   Run the ingestion script:

   ```bash
   python ingestion.py
   ```

   _Note_: The current script looks for `**/*.md` in `./data`. Modify `ingestion.py` if you have PDFs or other location preferences.

4. **Run Server**:
   ```bash
   uvicorn main:app --reload
   ```
   The API will be available at `http://localhost:8000`.
   Interactive docs at `http://localhost:8000/docs`.

## API Usage

**POST** `/chat`

```json
{
  "message": "What is Shaurya's experience with Python?"
}
```
