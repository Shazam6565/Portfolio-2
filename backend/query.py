import os
import re
import sys
import requests
from pathlib import Path
from dotenv import load_dotenv

from langchain_groq import ChatGroq
from langchain_community.embeddings import HuggingFaceEmbeddings
from langchain_chroma import Chroma
from langchain_core.prompts import PromptTemplate

# Load env variables
load_dotenv()

PROJ_ROOT = Path(__file__).parent
CHROMA_PATH = PROJ_ROOT / "chroma_profile"

def get_db():
    if not CHROMA_PATH.exists():
        raise FileNotFoundError(f"Chroma DB not found at {CHROMA_PATH}. Run ingest.py first.")
    
    return Chroma(
        persist_directory=str(CHROMA_PATH),
        embedding_function=HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
    )

def fetch_role_context(company: str, role: str) -> str:
    """
    Fetches job description/role responsibilities from external sources (Tavily).
    Returns a string summary or empty string if failed/no key.
    """
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key:
        print("Warning: TAVILY_API_KEY not set. Skipping external role research.")
        return ""
        
    query = f"{company} {role} job description responsibilities requirements"
    print(f"Fetching external context for: {company} - {role}...")
    
    try:
        resp = requests.post(
            "https://api.tavily.com/search",
            json={
                "api_key": api_key,
                "query": query,
                "search_depth": "advanced",
                "max_results": 5,
                "include_answer": True
            },
            timeout=10
        )
        resp.raise_for_status()
        data = resp.json()
        
        # Construct context from results
        results = data.get("results", [])
        context_parts = []
        if data.get("answer"):
             context_parts.append(f"AI Summary: {data['answer']}")
             
        for r in results:
            context_parts.append(f"Source: {r.get('url', 'N/A')}\n{r.get('content', '')}")
            
        return "\n\n".join(context_parts)
        
    except Exception as e:
        print(f"Error fetching external context: {e}")
        return ""

def answer_fit_question(query: str):
    db = get_db()
    llm = ChatGroq(model="llama-3.1-8b-instant", temperature=0.2)

    # 1. Retrieve Profile Context
    print("Searching internal profile...")
    docs = db.similarity_search(query, k=6)
    profile_ctx = "\n\n".join([
        f"[SECTION: {d.metadata.get('section', 'Unknown')}]\n{d.page_content}"
        for d in docs
    ])

    # 2. Intent Detection & Routing
    # We check if the user is explicitly asking for a "fit" or "role" evaluation.
    is_fit_query = bool(re.search(r"(fit|role|job|position|company|apply|hiring)", query, re.IGNORECASE))
    
    if not is_fit_query:
        # Simple RAG for general questions
        prompt_template = """You are Shaurya's AI portfolio assistant.
        
=== CANDIDATE PROFILE ===
{profile_ctx}

=== USER QUESTION ===
{query}

=== INSTRUCTIONS ===
Answer the question naturally and concisely based on the profile. 
If it's a greeting, just greet back and mention what you can do (e.g., "I can analyze Shaurya's fit for potential roles or answer questions about his experience.").
Do NOT invent information not in the profile.
"""
        prompt = prompt_template.format(profile_ctx=profile_ctx, query=query)
        print("detected General Query")
        response = llm.invoke(prompt)
        return response.content

    # ... Existing Fit Analysis Logic ...
    
    # 3. Extract Company/Role (Simple Heuristic for demo)
    company_match = re.search(r"(?:fit for|fitting for|role at|position at|job at|work at) ([A-Za-z0-9\s]+?)(?:\?|$| role)", query, re.IGNORECASE)
    role_match = re.search(r"(?:as a|position of|role of) ([A-Za-z0-9\s]+)", query, re.IGNORECASE)

    company = company_match.group(1).strip() if company_match else "Unknown Company"
    role = role_match.group(1).strip() if role_match else "Software Engineer"
    
    # 3b. Fetch External Context (Only if company is identified)
    role_ctx = ""
    if company != "Unknown Company":
        role_ctx = fetch_role_context(company, role)
    
    if not role_ctx:
        role_ctx = "External context unavailable. Evaluate based on general knowledge of the role and provided profile data."

    # 4. Construct Fit Prompt
    prompt_template = """You are an expert technical recruiter evaluating candidate-role fit.

=== CANDIDATE PROFILE ===
{profile_ctx}

=== ROLE REQUIREMENTS ===
Company: {company}
Role: {role}
Context:
{role_ctx}

=== USER QUESTION ===
{query}

=== ANALYSIS FRAMEWORK ===
Provide a structured assessment:

1. ROLE CORE REQUIREMENTS
   - List 5-7 key technical skills/experiences required for this role.

2. CANDIDATE STRENGTHS ALIGNMENT
   - Map Shaurya's experience to each requirement.
   - Cite specific projects/achievements.
   - Highlight exceptional matches.

3. POTENTIAL GAPS
   - Identify missing or weak areas.
   - Assess severity (critical vs minor).

4. OVERALL VERDICT
   - Fit score (0-100)
   - Recommendation (Strong Fit / Good Fit / Marginal / Poor Fit)
   - 2-3 sentence summary reasoning.

Be specific, evidence-based, and balanced.
"""
    
    prompt = prompt_template.format(
        profile_ctx=profile_ctx,
        company=company,
        role=role,
        role_ctx=role_ctx,
        query=query
    )

    # 5. Invoke LLM
    print("Generating analysis...")
    response = llm.invoke(prompt)
    return response.content

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_query = " ".join(sys.argv[1:])
    else:
        print("Usage: python query.py 'Is he a good fit for Google?'")
        # Default test query
        user_query = "Is Shaurya a good fit for a Forward Deployed Engineer role at Palantir?"
    
    print(f"\nQUERY: {user_query}\n")
    answer = answer_fit_question(user_query)
    print("\n=== ANALYSIS ===\n")
    print(answer)
