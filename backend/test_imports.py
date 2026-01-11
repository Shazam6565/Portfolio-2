import sys
import os

print(f"Python execution environment: {sys.executable}")
print(f"Python version: {sys.version}")

try:
    import langchain
    print(f"langchain version: {langchain.__version__}")
except ImportError:
    print("langchain not installed")

try:
    from langchain.chains import RetrievalQA
    print("Successfully imported RetrievalQA")
except ImportError as e:
    print(f"Failed to import RetrievalQA: {e}")
    sys.exit(1)

try:
    from langchain_openai import ChatOpenAI
    print("Successfully imported ChatOpenAI")
except ImportError as e:
    print(f"Failed to import ChatOpenAI: {e}")
    sys.exit(1)

print("All imports successful")
