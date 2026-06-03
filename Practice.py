## If you don't know how many arguments you want to pass in
def total_sum(*number):
    return sum(number)

print(total_sum(1, 2, 3, 4, 5))

## Functions with keyword arguments(kwargs) -- key value pairs
def show_profile(**details):
    if "username" in details:
        print(f"user: {details['username']}")
    else:
        print("user not specified")
        
show_profile(username="Pogo") 

## higher order function - accept or return a function
def operate(func, value):
    return func(value)

def child(n):
    return n ** 4

print(operate(child, 2))

# Lambda function - One linear function without def, using "lambda" keyword
double = lambda x: x * 2
print(double(6))

result = operate(lambda x: x + 10, 5) ## lambda with higher order function
print(result)

# Closures - Remember values fom their outer function, maintain state without using global variables
def power(base):
    def raise_to(exp):
        return base ** exp
    return raise_to
square = power(2)
print(square(5))

# Decorators - Modify or enhance function behaviour without changing their code: logging, authentication & performance tracking
def logger(func):
    def wrapper(*args, **kwargs):
        print("Function starting")
        result = func(*args, **kwargs)
        print("Function finished")
        return result
    return wrapper

@logger
def say_name(name):
    print(f"hi, {name}")
say_name("Dhadi")   
       
# File hnadling
file = open("deco.py", "r")
data = file.read()
print(data)
file.close()

with open ("deco.py", "r") as file:
    content = file.read()
    print(content)
    
# Error handling
try:
    print(10 / 0)
except ZeroDivisionError:
    print("Error: Division by zero")

# APIs and web basics
import requests
response = requests.get("https://api.github.com")
print(response.status_code)
#print(response.json())

# Problem solving
numbers = [1, 8, 9, 0, 3]
numbers.sort()
print(numbers)

# Flatten list
matrix = [[1,2], [3,4]]
flat = [num for row in matrix for num in row]
print(flat)

## Reverse a list
nums = [1, 2, 3]
reversed = nums[::-1]
print(reversed)

# dataframe
import pandas as pd
data = {
    "Product_ID" : [1, 2, 3],
    "City": ["A,B,C", "B,C", "C,D"]
}

df = pd.DataFrame(data)
print(df)

 ## Strings
 # Write a function that takes a raw email string and masks any email addresses with [EMAIL_REDACTED] and any 10-digit phone numbers with [PHONE_REDACTED].
  
import re
def anonymize_pii(text: str) -> str:
    # Mask emails
    text = re.sub(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', '[EMAIL_REDACTED]', text)
    # Mask 10-digit phone numbers (with or without spaces/dashes)
    text = re.sub(r'\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b', '[PHONE_REDACTED]', text)
    return text

# Test
raw_email = "Contact me at john.doe@example.com or call 123-456-7890 for the damage claim."
print(anonymize_pii(raw_email)) 
# Output: Contact me at [EMAIL_REDACTED] or call [PHONE_REDACTED] for the damage claim.

## List 
# Real-World Use Case (Your Experience): Storing batches of retrieved document chunks from ChromaDB before passing them to the Ollama llama3.2 LLM, 
# or holding a batch of Kafka messages before processing.
# Q: What is the difference between list.append() and list.extend()?
# A: append() adds its argument as a single element to the end of the list (increasing length by 1). extend() iterates over its argument and adds each element to the list.
# Q: How would you filter a list of 10,000 RAG chunks to only keep those with a relevance score > 0.8, Pythonically?
# A: Using a list comprehension: [chunk for chunk in rag_chunks if chunk['score'] > 0.8]. This is faster and more readable than a standard for loop with .append().
#🛠️ Practice Problem: RAG Chunk Filtering & Sorting
# You have a list of dictionaries representing retrieved chunks. Filter out chunks with score < 0.7, and sort the remaining chunks by score in descending order.
rag_chunks = [
    {"id": 1, "text": "Claim policy A", "score": 0.85},
    {"id": 2, "text": "Irrelevant noise", "score": 0.45},
    {"id": 3, "text": "Claim policy B", "score": 0.92},
    {"id": 4, "text": "Claim policy C", "score": 0.71}
]

# Filter and sort in one go (or two steps for readability)
filtered_sorted = sorted(
    [chunk for chunk in rag_chunks if chunk["score"] >= 0.7],
    key=lambda x: x["score"],
    reverse=True
)
print(filtered_sorted)
# Output: [{'id': 3, 'text': 'Claim policy B', 'score': 0.92}, {'id': 1, 'text': 'Claim policy A', 'score': 0.85}, {'id': 4, 'text': 'Claim policy C', 'score': 0.71}]

## Tuples (tuple)
# Returning multiple values from a FastAPI endpoint or a LangChain tool (e.g., returning (status_code, response_time_ms, payload_dict)), or defining immutable configuration states for LangGraph agents.
# You have a list of tuples representing log entries: (timestamp, log_level, message). Extract all unique log levels and create a new list containing only the messages for "ERROR" level logs.
logs = [
    ("10:00:01", "INFO", "System started"),
    ("10:00:05", "ERROR", "Database connection failed"),
    ("10:00:10", "WARN", "High memory usage"),
    ("10:00:15", "ERROR", "Timeout on LLM API")
]

# 1. Extract unique log levels using a set comprehension on the tuple
unique_levels = {log[1] for log in logs}
print("Unique levels:", unique_levels)

# 2. Extract ERROR messages using tuple unpacking in list comprehension
error_messages = [msg for ts, level, msg in logs if level == "ERROR"]
print("Error messages:", error_messages)

## Dictionary(dict)
# Storing and merging RAGAS evaluation metrics (e.g., faithfulness, context_precision, answer_relevancy) from multiple evaluation runs, or managing FastAPI application settings and LLM tool parameters.
# You have two dictionaries representing RAGAS metrics from two different model runs. Merge them. If a metric exists in both, calculate the average of the two scores.
run_1 = {"faithfulness": 0.85, "context_precision": 0.90, "answer_relevancy": 0.80}
run_2 = {"faithfulness": 0.95, "context_precision": 0.88, "latency_ms": 150}

merged_metrics = {}
all_keys = set(run_1.keys()) | set(run_2.keys())

for key in all_keys:
    if key in run_1 and key in run_2:
        merged_metrics[key] = (run_1[key] + run_2[key]) / 2
    else:
        merged_metrics[key] = run_1.get(key) or run_2.get(key)

print(merged_metrics)
# Output: {'context_precision': 0.89, 'latency_ms': 150, 'faithfulness': 0.9, 'answer_relevancy': 0.8}

## Sets (set)
# Deduplicating retrieved document chunks from ChromaDB to prevent the LLM from processing the same context twice, or tracking unique user intents/anomalies in your GenAI Log Analysis Engine.
# Your RAG pipeline sometimes retrieves duplicate document chunks (same doc_id). You have a list of retrieved chunks. Use a set to filter out duplicates while preserving the original order of the first occurrence.
retrieved_chunks = [
    {"doc_id": "A", "text": "Policy details"},
    {"doc_id": "B", "text": "Claim steps"},
    {"doc_id": "A", "text": "Policy details"}, # Duplicate
    {"doc_id": "C", "text": "Contact info"}
]

seen_ids = set()
unique_chunks = []

for chunk in retrieved_chunks:
    if chunk["doc_id"] not in seen_ids:
        unique_chunks.append(chunk)
        seen_ids.add(chunk["doc_id"])

print(unique_chunks)
# Output: [{'doc_id': 'A', 'text': 'Policy details'}, {'doc_id': 'B', 'text': 'Claim steps'}, {'doc_id': 'C', 'text': 'Contact info'}]

## Combined Problem: Log Parsing → List of Dicts → Deduplication: Your GenAI Log Analysis Engine ingests raw, messy log streams from EFK. You need to parse them, structure them, and remove duplicate log entries 
# (e.g., retry loops generating the same error) before sending them to the Cohere embedding model.
# The Challenge: Parse a multi-line string, extract fields using Regex, and deduplicate based on a unique message_hash while preserving the original chronological order.

import re
from typing import List, Dict, Any

RAW_LOGS = """
2024-05-10T10:00:01Z [ERROR] [rag-service] doc_id:101 Failed to connect to ChromaDB. Hash: a1b2c3
2024-05-10T10:00:02Z [INFO] [api-gateway] Request received for /v1/evaluate. Hash: x9y8z7
2024-05-10T10:00:03Z [ERROR] [rag-service] doc_id:101 Failed to connect to ChromaDB. Hash: a1b2c3
2024-05-10T10:00:04Z [WARN] [llm-router] Ollama latency high (1500ms). Hash: m4n5o6
"""

def parse_and_deduplicate_logs(raw_text: str) -> List[Dict[str, Any]]:
    # 1. Define regex to capture: timestamp, level, service, message, hash
    pattern = r"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z)\s+\[(\w+)\]\s+\[([\w-]+)\]\s+(.*?)\s+Hash:\s+(\w+)"
    
    parsed_logs = []
    seen_hashes = set()
    
    for line in raw_text.strip().split('\n'):
        match = re.search(pattern, line)
        if match:
            timestamp, level, service, message, msg_hash = match.groups()
            
            # 2. Deduplication logic (O(1) lookup)
            if msg_hash not in seen_hashes:
                parsed_logs.append({
                    "timestamp": timestamp,
                    "level": level,
                    "service": service,
                    "message": message.strip(),
                    "hash": msg_hash
                })
                seen_hashes.add(msg_hash)
                
    return parsed_logs

clean_logs = parse_and_deduplicate_logs(RAW_LOGS)
import json
print(json.dumps(clean_logs, indent=2))

##  Python Typing (TypedDict vs. Pydantic v2): You are building the FastAPI endpoint for your RAG Streaming Evaluation Platform. You need to validate incoming 
# requests to ensure RAGAS metrics are strictly between 0.0 and 1.0, and that the context isn't empty.
# The Challenge: Know when to use TypedDict (lightweight, no runtime overhead) vs. Pydantic v2 (runtime validation, serialization, FastAPI integration).
from typing import TypedDict, List, Annotated
from pydantic import BaseModel, Field, field_validator, ValidationError
from uuid import UUID, uuid4

# --- Approach 1: TypedDict (Best for internal function returns, zero runtime cost) ---
class InternalMetricDict(TypedDict):
    faithfulness: float
    context_precision: float
    run_id: str

# --- Approach 2: Pydantic v2 (Best for FastAPI I/O, strict validation) ---
class RAGEvaluationRequest(BaseModel):
    query: str = Field(..., min_length=5, description="The user's search query")
    context_chunks: List[str] = Field(..., min_length=1, description="Retrieved documents")
    llm_response: str
    # Pydantic v2 generates UUIDs automatically if not provided
    run_id: UUID = Field(default_factory=uuid4) 

    # Pydantic v2 Validator: Ensure faithfulness score is valid (0.0 to 1.0)
    @field_validator('context_chunks')
    @classmethod
    def check_context_not_empty(cls, v: List[str]) -> List[str]:
        if not v or all(not chunk.strip() for chunk in v):
            raise ValueError("Context chunks cannot be empty or just whitespace")
        return v

# Testing Pydantic Validation
try:
    # This will FAIL validation (context is empty)
    bad_request = RAGEvaluationRequest(
        query="What is the claim policy?",
        context_chunks=["   "], 
        llm_response="The policy covers water damage."
    )
except ValidationError as e:
    print("Validation Caught:", e.errors()[0]['msg'])

# This will PASS
good_request = RAGEvaluationRequest(
    query="What is the claim policy?",
    context_chunks=["Policy section 4.1 covers water damage."],
    llm_response="The policy covers water damage."
)
print(f"\nValid Request Run ID: {good_request.run_id}")

## Async Python Patterns: Concurrent LLM Calls with Rate Limiting: Your RAG Evaluation Platform needs to evaluate 50 retrieved chunks concurrently using an LLM-as-a-Judge. 
# However, the Ollama/OpenAI API has a rate limit (e.g., max 5 concurrent requests).
# The Challenge: Use asyncio.gather for concurrency, but implement an asyncio.Semaphore to prevent overwhelming the LLM API (a massive green flag in senior backend interviews).
import asyncio
import time
from typing import List

# Simulated LLM-as-a-Judge API call
async def mock_llm_evaluate(chunk_id: str, semaphore: asyncio.Semaphore) -> dict:
    # Acquire semaphore: if 5 tasks are running, the 6th will wait here
    async with semaphore:
        print(f"Starting evaluation for {chunk_id}...")
        await asyncio.sleep(1)  # Simulate network/LLM latency
        print(f"Finished evaluation for {chunk_id}")
        return {"chunk_id": chunk_id, "faithfulness": 0.95}

async def evaluate_rag_chunks_batch(chunk_ids: List[str], max_concurrency: int = 5) -> List[dict]:
    semaphore = asyncio.Semaphore(max_concurrency)
    
    # Create a list of tasks
    tasks = [mock_llm_evaluate(c_id, semaphore) for c_id in chunk_ids]
    
    # asyncio.gather runs them concurrently, respecting the semaphore limit
    print(f"\nStarting batch evaluation of {len(chunk_ids)} chunks (Max concurrency: {max_concurrency})")
    start_time = time.time()
    
    results = await asyncio.gather(*tasks)
    
    print(f"Batch completed in {time.time() - start_time:.2f} seconds")
    return results

# Run the async event loop
if __name__ == "__main__":
    chunks_to_eval = [f"chunk_{i}" for i in range(1, 13)] # 12 chunks
    # If we didn't use a semaphore, this would try to run all 12 at once.
    # With semaphore=5, it runs in batches of 5, taking ~3 seconds total.
    asyncio.run(evaluate_rag_chunks_batch(chunks_to_eval, max_concurrency=5))
    
##     
