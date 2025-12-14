import os
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.chains import RetrievalQA
from dotenv import load_dotenv

load_dotenv()

CHROMA_PATH = os.getenv("CHROMA_DB_PATH", "./chroma_db")

def test_rag():
    if not os.getenv("OPENAI_API_KEY"):
        print("Error: OPENAI_API_KEY not found in environment.")
        return

    print("Initializing RAG pipeline...")
    embedding_function = OpenAIEmbeddings()
    
    if not os.path.exists(CHROMA_PATH):
        print(f"Error: Chroma DB not found at {CHROMA_PATH}")
        return

    vector_db = Chroma(persist_directory=CHROMA_PATH, embedding_function=embedding_function)
    
    llm = ChatOpenAI(temperature=0.0)
    retriever = vector_db.as_retriever(search_kwargs={"k": 3})
    
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=retriever,
        return_source_documents=True
    )
    
    query = "What is Shaurya's git username?"
    print(f"\nQuerying: '{query}'")
    
    
    result = qa_chain.invoke({"query": query})
    print("\n--- Answer ---")
    print(result["result"])
    
    print("\n--- Sources ---")
    for doc in result["source_documents"]:
        print(f"- {doc.metadata.get('source', 'unknown')}")


if __name__ == "__main__":
    test_rag()
