import sys
import os

print(f"Python Executable: {sys.executable}")
print(f"CWD: {os.getcwd()}")
print("sys.path:")
for p in sys.path:
    print(f"  {p}")

print("\n--- Tyring imports ---")
try:
    import langchain
    print(f"langchain version: {langchain.__version__}")
    print(f"langchain file: {langchain.__file__}")
except ImportError as e:
    print(f"Failed to import langchain: {e}")

try:
    import langchain.chains
    print("Successfully imported langchain.chains")
except ImportError as e:
    print(f"Failed to import langchain.chains: {e}")

try:
    from langchain.chains import RetrievalQA
    print("Successfully imported RetrievalQA")
except ImportError as e:
    print(f"Failed to import RetrievalQA: {e}")
