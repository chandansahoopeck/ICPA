import { useState } from "react";

const categories = [
  { id: "python", label: "Python Core", icon: "🐍", color: "#22d3ee" },
  { id: "dsa", label: "DSA / Problem Solving", icon: "🧮", color: "#f59e0b" },
  { id: "genai", label: "GenAI / LLM", icon: "🤖", color: "#a78bfa" },
  { id: "system", label: "System Design", icon: "🏗️", color: "#34d399" },
];

const questions = [
  // ── PYTHON CORE ──────────────────────────────────────────────────────────
  {
    id: 1, cat: "python",
    q: "Reverse a string and a list in Python.",
    tags: ["string", "list", "slicing"],
    answer: `# String
s = "hello"
print(s[::-1])          # "olleh"
print(''.join(reversed(s)))  # "olleh"

# List
lst = [1, 2, 3, 4]
print(lst[::-1])         # [4, 3, 2, 1]
lst.reverse()            # in-place, returns None
print(lst)               # [4, 3, 2, 1]`,
    note: "lst[::-1] creates a new list. lst.reverse() mutates in-place and returns None — a common gotcha."
  },
  {
    id: 2, cat: "python",
    q: "How do you get all values, keys, and key-value pairs from a dict?",
    tags: ["dict", "methods"],
    answer: `d = {"a": 1, "b": 2, "c": 3}

d.keys()    # dict_keys(['a','b','c'])
d.values()  # dict_values([1, 2, 3])
d.items()   # dict_items([('a',1),('b',2),('c',3)])

# Safe access
d.get("x", "default")   # "default" — never raises KeyError

# Merge (Python 3.9+)
d2 = {"d": 4}
merged = d | d2          # {'a':1,'b':2,'c':3,'d':4}`,
    note: "Use .get() defensively in production code to avoid KeyError crashes."
  },
  {
    id: 3, cat: "python",
    q: "When do you use list, set, dict, tuple, string, array, and collections?",
    tags: ["data structures", "when to use"],
    answer: `list    → Ordered, mutable, duplicates OK. O(1) append, O(n) search.
            Use: sequences, stacks (append/pop), queues (deque preferred).

set     → Unordered, unique items. O(1) add/lookup/delete.
            Use: deduplication, membership tests, set ops (union/intersect).

dict    → Key→value mapping. O(1) get/set. Keys must be hashable.
            Use: caches, counters, configs, lookup tables.

tuple   → Ordered, IMMUTABLE. Hashable → can be dict key or set member.
            Use: fixed records, function return values, namedtuple for clarity.

str     → Immutable sequence of chars. Interned in CPython.
            Use: text; build with ''.join(list) not += in loops (O(n²)).

array   → Typed, memory-efficient numeric array (module: array / numpy).
            Use: large numeric datasets where memory matters.

collections:
  Counter     → freq counting:  Counter("aabbc") → {a:2,b:2,c:1}
  defaultdict → auto-init keys:  defaultdict(list)
  deque       → O(1) appendleft/popleft — use for BFS queues
  namedtuple  → readable tuples:  Point = namedtuple('Point','x y')
  OrderedDict → preserves insert order (less needed in Python 3.7+)`,
    note: "In interviews, always justify your choice: 'I used a set here for O(1) membership checks instead of a list.'"
  },
  {
    id: 4, cat: "python",
    q: "What are the key list methods and their complexities?",
    tags: ["list", "complexity"],
    answer: `lst.append(x)      → O(1)  — add to end
lst.pop()          → O(1)  — remove from end
lst.pop(0)         → O(n)  — avoid! use deque.popleft() instead
lst.insert(i, x)   → O(n)
lst.remove(x)      → O(n)  — removes first occurrence
lst.index(x)       → O(n)
lst.sort()         → O(n log n) — Timsort, in-place
sorted(lst)        → O(n log n) — returns new list
lst.extend(other)  → O(k) — k = len(other)
x in lst           → O(n)  — use set for O(1)

# Useful patterns
lst = [x**2 for x in range(10) if x % 2 == 0]  # list comprehension
flat = [x for sub in nested for x in sub]       # flatten nested`,
    note: "Know that list is backed by a dynamic array — append is amortized O(1) due to doubling."
  },
  {
    id: 5, cat: "python",
    q: "Explain Python decorators with a practical example.",
    tags: ["decorators", "functions", "advanced"],
    answer: `import time, functools

def timer(func):
    @functools.wraps(func)   # preserves func.__name__
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {time.perf_counter()-start:.4f}s")
        return result
    return wrapper

@timer
def heavy_query(n):
    return sum(range(n))

heavy_query(10_000_000)  # heavy_query took 0.2341s

# In production AI: used for retry logic, auth checks,
# rate limiting, and logging LLM calls`,
    note: "Always use @functools.wraps to preserve the original function's metadata — important for LangChain/FastAPI introspection."
  },
  {
    id: 6, cat: "python",
    q: "What is the difference between *args and **kwargs?",
    tags: ["functions", "unpacking"],
    answer: `def func(*args, **kwargs):
    print(args)    # tuple of positional args
    print(kwargs)  # dict of keyword args

func(1, 2, 3, name="Chandan", role="AI Engineer")
# (1, 2, 3)
# {'name': 'Chandan', 'role': 'AI Engineer'}

# Practical: forwarding params to LLM API
def call_llm(prompt, **llm_kwargs):
    return openai.chat.completions.create(
        model="gpt-4o",
        messages=[{"role":"user","content":prompt}],
        **llm_kwargs   # temperature, max_tokens, etc.
    )`,
    note: "Critical for building flexible LLM wrapper functions — you never know all params callers will pass."
  },
  {
    id: 7, cat: "python",
    q: "Explain generators and when to use them in AI pipelines.",
    tags: ["generators", "memory", "streaming"],
    answer: `# Generator function — yields one item at a time
def stream_chunks(text, size=100):
    for i in range(0, len(text), size):
        yield text[i:i+size]

# Uses O(1) memory regardless of text size
for chunk in stream_chunks(huge_text):
    process(chunk)

# Generator expression — lazy evaluation
squares = (x**2 for x in range(10**6))  # no memory spike

# Real-world: LLM streaming responses
async def stream_llm(prompt):
    async for chunk in client.chat.completions.stream(prompt):
        yield chunk.choices[0].delta.content or ""`,
    note: "In ICPA, streaming generators prevent OOM when processing 10k+ .msg email files in batch."
  },
  {
    id: 8, cat: "python",
    q: "What are Python's async/await patterns and when do you use them?",
    tags: ["async", "concurrency", "fastapi"],
    answer: `import asyncio, httpx

# async def = coroutine, must be awaited
async def fetch_embedding(text: str) -> list[float]:
    async with httpx.AsyncClient() as client:
        resp = await client.post("/embed", json={"text": text})
        return resp.json()["embedding"]

# Run concurrently — not sequentially!
async def batch_embed(texts: list[str]):
    tasks = [fetch_embedding(t) for t in texts]
    return await asyncio.gather(*tasks)   # all fire at once

# FastAPI automatically handles async routes
@app.post("/classify")
async def classify(request: ClaimRequest):
    embedding = await fetch_embedding(request.text)
    ...

# Rule of thumb:
# I/O bound (API calls, DB, file)  → async/await
# CPU bound (ML inference, numpy)  → multiprocessing / ThreadPoolExecutor`,
    note: "In your ICPA FastAPI service, async routes handle concurrent claim emails without blocking the event loop."
  },

  // ── DSA / PROBLEM SOLVING ────────────────────────────────────────────────
  {
    id: 9, cat: "dsa",
    q: "Two Sum: Given sorted array [2,7,11,15], target=9 — return indices of two numbers that add to target.",
    tags: ["two pointers", "array", "classic"],
    answer: `def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        s = numbers[left] + numbers[right]
        if s == target:
            return [left, right]        # 0-indexed
        elif s < target:
            left += 1
        else:
            right -= 1
    return []

# numbers = [2, 7, 11, 15], target = 9
print(two_sum_sorted([2,7,11,15], 9))   # [0, 1]

# Time: O(n)  |  Space: O(1)
# Works ONLY because array is sorted!
# Unsorted → use hash map: O(n) time + O(n) space`,
    note: "Two-pointer pattern is the key insight here because the array is SORTED. Always state this assumption."
  },
  {
    id: 10, cat: "dsa",
    q: "Find the first non-repeating character in a string. Return -1 if all repeat. s = 'aabccdeff'",
    tags: ["string", "hash map", "Counter"],
    answer: `from collections import Counter

def first_unique(s: str) -> str:
    freq = Counter(s)           # {'a':2,'b':1,'c':2,'d':1,'e':1,'f':2}
    for ch in s:                # preserve order
        if freq[ch] == 1:
            return ch
    return -1

print(first_unique("aabccdeff"))  # 'b'
print(first_unique("aabb"))       # -1

# Time: O(n)  |  Space: O(k) where k = unique chars (max 26 for lowercase)

# Alternative without Counter — single pass with OrderedDict:
from collections import OrderedDict
def first_unique_v2(s):
    seen = OrderedDict()
    for ch in s:
        seen[ch] = seen.get(ch, 0) + 1
    for ch, cnt in seen.items():
        if cnt == 1:
            return ch
    return -1`,
    note: "Two-pass with Counter is cleaner; single-pass with OrderedDict shows deeper knowledge."
  },
  {
    id: 11, cat: "dsa",
    q: "Implement an LRU Cache (Least Recently Used) — used in RAG/embedding caches.",
    tags: ["LRU", "OrderedDict", "cache", "design"],
    answer: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()

    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)   # mark as recently used
        return self.cache[key]

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)  # evict LRU (front)

# Production context: caching embedding vectors
# so identical prompts don't re-hit the embedding API
cache = LRUCache(1000)
cache.put("embed:hello world", [0.1, 0.2, ...])`,
    note: "In your RAG platform, LRU caching embeddings avoids redundant Cohere/OpenAI API calls — mention this!"
  },
  {
    id: 12, cat: "dsa",
    q: "Find duplicate elements in a list without using extra space.",
    tags: ["array", "set", "duplicates"],
    answer: `# Method 1: O(n) time, O(n) space — most readable
def find_duplicates(nums):
    seen, dupes = set(), set()
    for n in nums:
        if n in seen: dupes.add(n)
        else: seen.add(n)
    return list(dupes)

# Method 2: Using Counter
from collections import Counter
def find_duplicates_v2(nums):
    return [k for k,v in Counter(nums).items() if v > 1]

# Method 3: In-place O(1) space (sorted array trick)
def find_duplicates_v3(nums):
    nums.sort()
    return [nums[i] for i in range(1, len(nums)) if nums[i] == nums[i-1]]

print(find_duplicates([1,2,3,2,4,3,5]))  # [2, 3]`,
    note: "Know all three approaches — interviewer may ask for O(1) space solution after your first answer."
  },
  {
    id: 13, cat: "dsa",
    q: "Check if a string is a palindrome (ignore case and non-alphanumeric).",
    tags: ["string", "two pointers"],
    answer: `def is_palindrome(s: str) -> bool:
    cleaned = [c.lower() for c in s if c.isalnum()]
    return cleaned == cleaned[::-1]

# Two-pointer approach (O(1) space):
def is_palindrome_v2(s: str) -> bool:
    s = s.lower()
    l, r = 0, len(s) - 1
    while l < r:
        while l < r and not s[l].isalnum(): l += 1
        while l < r and not s[r].isalnum(): r -= 1
        if s[l] != s[r]: return False
        l += 1; r -= 1
    return True

print(is_palindrome("A man, a plan, a canal: Panama"))  # True`,
    note: "The two-pointer version is O(1) space — always mention space complexity alongside time complexity."
  },
  {
    id: 14, cat: "dsa",
    q: "Flatten a nested list of arbitrary depth.",
    tags: ["recursion", "list", "flatten"],
    answer: `# Recursive approach
def flatten(lst):
    result = []
    for item in lst:
        if isinstance(item, list):
            result.extend(flatten(item))
        else:
            result.append(item)
    return result

# Generator approach (memory-efficient for huge lists)
def flatten_gen(lst):
    for item in lst:
        if isinstance(item, list):
            yield from flatten_gen(item)
        else:
            yield item

nested = [1, [2, [3, 4], 5], [6, 7]]
print(flatten(nested))             # [1,2,3,4,5,6,7]
print(list(flatten_gen(nested)))   # [1,2,3,4,5,6,7]`,
    note: "The generator version is production-safe for deeply nested structures — no stack overflow risk with yield from."
  },
  {
    id: 15, cat: "dsa",
    q: "Valid parentheses: Given a string '({[]})' check if brackets are balanced.",
    tags: ["stack", "string", "classic"],
    answer: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for ch in s:
        if ch in mapping:
            top = stack.pop() if stack else '#'
            if mapping[ch] != top:
                return False
        else:
            stack.append(ch)
    return len(stack) == 0

print(is_valid("({[]})"))  # True
print(is_valid("({[})"))   # False

# Time: O(n)  |  Space: O(n)`,
    note: "Classic stack pattern — every opening bracket pushed, every closing bracket triggers a pop+check."
  },
  {
    id: 16, cat: "dsa",
    q: "Find the maximum subarray sum (Kadane's algorithm).",
    tags: ["dynamic programming", "array", "Kadane"],
    answer: `def max_subarray(nums: list[int]) -> int:
    max_sum = current = nums[0]
    for n in nums[1:]:
        current = max(n, current + n)
        max_sum = max(max_sum, current)
    return max_sum

print(max_subarray([-2,1,-3,4,-1,2,1,-5,4]))  # 6  ([4,-1,2,1])

# AI context: finding peak latency windows in time-series
# log data — same sliding window pattern`,
    note: "Time O(n), Space O(1). Mention 'this is a DP problem reduced to a single variable' to impress."
  },
  {
    id: 17, cat: "dsa",
    q: "Group anagrams from a list of strings.",
    tags: ["hash map", "string", "sorting"],
    answer: `from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))   # sorted chars as hashable key
        groups[key].append(s)
    return list(groups.values())

words = ["eat","tea","tan","ate","nat","bat"]
print(group_anagrams(words))
# [['eat','tea','ate'], ['tan','nat'], ['bat']]

# Time: O(n * k log k) where k = max string length`,
    note: "sorted() on a string returns a list — wrap in tuple() to make it hashable as a dict key."
  },

  // ── GENAI / LLM ──────────────────────────────────────────────────────────
  {
    id: 18, cat: "genai",
    q: "Explain RAG (Retrieval-Augmented Generation) and why it beats pure LLM fine-tuning for your use case.",
    tags: ["RAG", "architecture", "LLM"],
    answer: `RAG = Retrieval + Generation pipeline:
1. Embed query → vector search in ChromaDB/Weaviate
2. Retrieve top-k relevant chunks
3. Inject chunks into LLM prompt as context
4. LLM generates answer grounded in retrieved docs

Why RAG over fine-tuning for ICPA:
✓ No retraining cost when new claim types added
✓ Retrieval is auditable (you can log what was retrieved)
✓ Handles knowledge cutoff — fresh docs → fresh answers
✓ Smaller LLM works well with good context injection
✗ Fine-tuning is better for: style/format learning,
  domain-specific token patterns, very low latency needs

In ICPA: TF-IDF handles ~75% → ChromaDB RAG handles ~20%
→ only ~5% escalates to Ollama LLM (zero API cost).`,
    note: "Always frame RAG in terms of business impact: cost, auditability, freshness. You have real numbers — use them."
  },
  {
    id: 19, cat: "genai",
    q: "What is the difference between semantic search and keyword search? When do you use each?",
    tags: ["embeddings", "TF-IDF", "search"],
    answer: `Keyword search (TF-IDF / BM25):
- Matches exact or stemmed tokens
- Fast: O(1) lookup via inverted index
- Fails: synonyms, paraphrases, multilingual
- Best for: known terminology, structured fields

Semantic search (dense embeddings):
- Embeds query + docs into vector space
- Finds meaning-similar docs even with different words
- Uses cosine similarity / ANN (HNSW in ChromaDB)
- Best for: natural language queries, multilingual content

Hybrid search (production best practice):
- Run both, combine scores with weighted fusion
- Handles both exact terms AND semantic meaning

In ICPA: TF-IDF fast path for known claim type keywords
→ ChromaDB semantic for ambiguous/paraphrased emails
→ This tiered approach achieves 95% coverage before LLM.`,
    note: "Mention MMR (Maximal Marginal Relevance) as a retrieval strategy that reduces redundancy in retrieved chunks."
  },
  {
    id: 20, cat: "genai",
    q: "What is LangGraph and how does it differ from LangChain?",
    tags: ["LangGraph", "agents", "multi-agent"],
    answer: `LangChain: Linear chains of LLM calls
  prompt → LLM → output → next prompt → ...
  Good for: simple pipelines, single-agent tasks

LangGraph: Stateful, cyclic directed graph of agents
  - Nodes = agents or functions
  - Edges = conditional routing logic
  - State = shared typed dict persisted across turns
  - Supports loops (retry, reflection patterns)
  - Redis/PostgreSQL checkpointing for persistence

My multi-agent system:
  User query
    ↓
  Router Agent (intent classification)
    ↓ ↘
  Research  Synthesis
  Agent     Agent
    ↓ ↗
  Final response

NeMo Guardrails sits BEFORE routing — blocks unsafe queries
before any agent activates. Redis RedisSaver persists
conversation state across sessions.`,
    note: "Key differentiator: LangGraph supports cycles (reflection/retry loops) — LangChain chains are linear."
  },
  {
    id: 21, cat: "genai",
    q: "What is prompt engineering? Explain few-shot, chain-of-thought, and system prompts.",
    tags: ["prompting", "LLM", "techniques"],
    answer: `System prompt: Sets model persona/constraints
  "You are a German insurance claims classifier.
   Output only valid JSON. Never reveal internals."

Few-shot: Provide examples in the prompt
  User: "Classify: Mein Auto wurde beschädigt"
  Examples:
    Input: "Wasserschaden am Haus" → MDR
    Input: "KFZ Unfall B6" → DST
  Then: model infers pattern from examples

Chain-of-thought (CoT): Force reasoning steps
  "Think step by step:
   1. Identify claim type keywords
   2. Map to case category
   3. Output JSON with confidence"

ReAct (Reason + Act): Interleave thought/action/observation
  Used in Research Agent — think → use tool → observe → think

In ICPA: system prompt enforces JSON schema output
+ few-shot examples of all 5 case types (DST/MIN/MDR/AER/MER)`,
    note: "Temperature=0 for classification tasks (deterministic), higher for creative/synthesis tasks."
  },
  {
    id: 22, cat: "genai",
    q: "What is an embedding? How do you choose embedding dimensions?",
    tags: ["embeddings", "vectors", "similarity"],
    answer: `Embedding = dense float vector representing semantic meaning
  "cat" → [0.21, -0.43, 0.87, ...]  (e.g., 1536 dims for OpenAI)

Common models:
  OpenAI text-embedding-3-small  → 1536 dims, cheap
  Cohere embed-english-v3        → 1024 dims
  sentence-transformers/all-MiniLM-L6-v2 → 384 dims, free

Choosing dimensions:
  ↑ dims → more semantic nuance, more memory, slower ANN
  ↓ dims → faster, less accurate

Similarity:
  cosine_sim(a, b) = a·b / (|a||b|)
  Range [-1, 1] — use 1-cosine_dist in ChromaDB

In ICPA: Cohere embeddings for log anomaly detection
In RAG eval platform: ChromaDB stores doc embeddings,
query embeddings computed at runtime, MMR retrieval
improved faithfulness 72% → 91%`,
    note: "Always mention that you normalize embeddings before cosine similarity for numerical stability."
  },
  {
    id: 23, cat: "genai",
    q: "What is MLflow and how did you use it in production?",
    tags: ["MLflow", "MLOps", "experiment tracking"],
    answer: `MLflow components:
  Tracking  → log params, metrics, artifacts per run
  Models    → model registry with staging/production versions
  Projects  → reproducible ML code packaging
  Serve     → REST inference endpoints

In ICPA:
  mlflow.start_run() wraps each training experiment
  Log: vectorizer params, confidence thresholds,
       classification metrics (F1, precision/recall per class)
  Compare: TF-IDF vocab_size=5000 vs 10000
  Register best model → promote to "Production" stage
  Docker image pulls from MLflow Model Registry

In RAG eval platform:
  Track RAGAS metrics per retrieval config:
  - k=3 MMR → faithfulness=0.72
  - k=5 MMR + metadata filter → faithfulness=0.91
  Each config = one MLflow run → compare in UI`,
    note: "Mention model registry staging workflow: None → Staging → Production → Archived. Shows MLOps maturity."
  },
  {
    id: 24, cat: "genai",
    q: "What is RAGAS and how do you evaluate a RAG pipeline?",
    tags: ["RAGAS", "evaluation", "RAG"],
    answer: `RAGAS = Retrieval Augmented Generation Assessment Suite

4 core metrics:
  Faithfulness      → Is answer grounded in retrieved context?
                      (facts in answer ∈ retrieved chunks)
  Answer Relevancy  → Does answer address the question?
  Context Precision → Are retrieved chunks all relevant?
  Context Recall    → Did retrieval find all needed info?

My RAG eval platform:
  Per-query eval pipeline:
  1. User query → retriever → LLM → answer
  2. RAGAS evaluates: (query, answer, retrieved_chunks)
  3. Metrics published to Kafka topic
  4. Live WebSocket dashboard shows trend
  5. MLflow tracks experiment variants

Results:
  Baseline (k=3, cosine)         → faithfulness: 72%
  MMR + metadata filter + prompt → faithfulness: 91%
  LLM escalation rate: 40% → 12% after retrieval tuning`,
    note: "Mention that RAGAS uses an LLM as judge — so quality of eval itself depends on the judge model (meta-evaluation)."
  },
  {
    id: 25, cat: "genai",
    q: "Explain LoRA/PEFT fine-tuning. When would you recommend it over RAG?",
    tags: ["LoRA", "fine-tuning", "PEFT"],
    answer: `LoRA (Low-Rank Adaptation):
  Instead of updating all W params:
  W_new = W + ΔW  where  ΔW = A × B
  A: (d × r),  B: (r × d),  r << d (rank=4 to 64)

  Trainable params = 2 × d × r  vs  d²  full weight
  At r=16, d=4096: 131K vs 16.7M params — 99% reduction

PEFT = Parameter-Efficient Fine-Tuning (umbrella term):
  LoRA, QLoRA, Prefix Tuning, Adapter layers

QLoRA: LoRA + 4-bit quantized base model → fits on 1 GPU

Use fine-tuning when:
  ✓ Specialized output FORMAT (structured JSON schema)
  ✓ Domain-specific vocabulary (German insurance terms)
  ✓ Style consistency across all outputs
  ✓ Latency critical — no retrieval step

Use RAG when:
  ✓ Knowledge changes frequently
  ✓ Need source attribution/auditability
  ✓ Limited GPU for training

For ICPA: RAG is better — claim documents change weekly`,
    note: "Interviewer will likely ask this. The honest answer is: production systems often use BOTH — RAG + LoRA fine-tuned model."
  },
  {
    id: 26, cat: "genai",
    q: "What is vector database? Compare ChromaDB, Pinecone, Weaviate, FAISS.",
    tags: ["vector DB", "ChromaDB", "Weaviate"],
    answer: `Vector DB stores high-dimensional embeddings + metadata
ANN (Approximate Nearest Neighbor) search via HNSW index
O(log n) query time vs O(n) brute force

ChromaDB:
  ✓ Open source, embedded mode (no server)
  ✓ LangChain native integration
  ✓ Good for dev/small production
  ✗ Limited horizontal scaling

Pinecone:
  ✓ Managed cloud, auto-scale, low latency SLA
  ✓ Production-grade, metadata filtering
  ✗ Paid, vendor lock-in

Weaviate:
  ✓ Hybrid search (dense + BM25 built-in)
  ✓ GraphQL API, rich schema
  ✓ Self-hosted or cloud
  ✗ More complex setup

FAISS (Meta):
  ✓ Fastest in-memory ANN, research standard
  ✗ No persistence, no metadata, bare-metal only

My choice: ChromaDB for ICPA (on-prem, German data residency)
           Weaviate for hybrid search use cases`,
    note: "HNSW = Hierarchical Navigable Small World graph. Knowing the index type shows depth."
  },

  // ── SYSTEM DESIGN ─────────────────────────────────────────────────────────
  {
    id: 27, cat: "system",
    q: "Design a production LLM classification service that handles 10k emails/day with fallback tiers.",
    tags: ["system design", "ICPA", "architecture"],
    answer: `Email → FastAPI ingestion endpoint
         ↓
  [Tier 1] TF-IDF + Logistic Regression
    ← confidence > 0.85 → return classification (75% emails)
         ↓ (low confidence)
  [Tier 2] ChromaDB RAG + semantic retrieval
    ← confidence > 0.70 → return classification (20% emails)
         ↓ (still uncertain)
  [Tier 3] Ollama llama3.2 LLM
    ← always returns result (~5% emails)

Supporting components:
  AWS Textract: OCR on PDF attachments before classification
  spaCy NER: PII anonymization (GDPR — German data residency)
  MLflow: experiment tracking, model registry
  LangSmith: trace every RAG + LLM call
  Confidence threshold: configurable via REST API (no redeploy)
  Docker + EKS: containerized, horizontally scalable

Result: 95% emails handled without LLM → zero inference cost`,
    note: "This IS your ICPA system — describe it with confidence. The cascading architecture is genuinely impressive."
  },
  {
    id: 28, cat: "system",
    q: "How do you handle PII in an AI pipeline? (GDPR compliance)",
    tags: ["PII", "GDPR", "security", "spaCy"],
    answer: `Pipeline steps:
1. Raw email arrives → NEVER stored as-is
2. spaCy NER identifies PII entities:
   PERSON, ORG, LOC, DATE, EMAIL, PHONE
3. Replace with typed placeholders:
   "Max Mustermann" → "[PERSON_1]"
   "mueller@gmail.com" → "[EMAIL_1]"
4. Anonymized text flows into TF-IDF / ChromaDB / LLM
5. Original PII stored in separate encrypted store
   (if needed for business response)

Additional controls:
  - German data residency: all infra on AWS eu-central-1
  - No external LLM APIs for 95% of traffic (Ollama is local)
  - Audit logs for every classification decision
  - Retention policy: raw emails deleted after 30 days

In code: spacy.load("de_core_news_sm") for German NER
Custom regex for German IBANs, Kfz plates, Steuernummern`,
    note: "GDPR compliance + local inference is a MAJOR differentiator — Vodafone Germany requires this. Emphasize it."
  },
  {
    id: 29, cat: "system",
    q: "What is CI/CD for ML models? Describe your GitOps workflow.",
    tags: ["MLOps", "GitOps", "Argo CD", "CI/CD"],
    answer: `ML CI/CD = code + model + data versioning integrated

My workflow:
  Git push → GitHub Actions CI:
    ├── pytest: unit + integration tests
    ├── data validation (Great Expectations)
    ├── model training + MLflow logging
    ├── threshold check: F1 > 0.90 to pass
    └── Docker image build + push to ECR

  Argo CD (GitOps):
    ├── Watches Helm chart values in Git
    ├── Detects image tag change
    ├── Syncs to EKS cluster automatically
    └── 99.9% deployment success rate

  Rollback: git revert → Argo CD auto-reverts cluster

  Model versioning in MLflow Registry:
    Staging → integration tests → promote to Production
    Previous Production stays as "Archived" for instant rollback

Monitoring post-deploy:
  Prometheus metrics: latency P50/P95/P99
  LangSmith: LLM call traces + hallucination alerts`,
    note: "Mention model drift detection as the next evolution: EVIDENTLYAI or Alibi Detect for production model monitoring."
  },
  {
    id: 30, cat: "system",
    q: "How does token bucket rate limiting work? Implement it in Python.",
    tags: ["rate limiting", "algorithm", "API design"],
    answer: `Token bucket algorithm:
  - Bucket holds max N tokens
  - Tokens refill at rate R tokens/second
  - Each request consumes 1 token
  - If bucket empty → reject request (429)

import time

class TokenBucket:
    def __init__(self, capacity: int, refill_rate: float):
        self.capacity = capacity
        self.tokens = capacity
        self.refill_rate = refill_rate   # tokens per second
        self.last_refill = time.monotonic()

    def consume(self, tokens: int = 1) -> bool:
        now = time.monotonic()
        elapsed = now - self.last_refill
        # Refill proportional to elapsed time
        self.tokens = min(
            self.capacity,
            self.tokens + elapsed * self.refill_rate
        )
        self.last_refill = now
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True    # allowed
        return False        # rate limited

# FastAPI middleware usage:
limiter = TokenBucket(capacity=100, refill_rate=10)
# 100 burst, 10 req/sec sustained

# Production: use Redis for distributed rate limiting
# across multiple FastAPI replicas on EKS`,
    note: "In distributed systems, use Redis INCR + EXPIRE for atomic rate limiting across pods — no single-instance state."
  },
  {
    id: 31, cat: "system",
    q: "Explain the difference between gRPC and REST. When did you choose gRPC?",
    tags: ["gRPC", "REST", "microservices", "performance"],
    answer: `REST:
  Protocol: HTTP/1.1, JSON payloads
  Pros: human-readable, universal tooling, browser native
  Cons: verbose (headers + JSON), HTTP/1.1 HOL blocking
  Use: public APIs, browser clients, simple CRUD

gRPC:
  Protocol: HTTP/2 + Protocol Buffers (binary)
  Pros: ~10x smaller payload, multiplexing, streaming,
        strongly-typed contracts (.proto files),
        auto-generated client/server code
  Cons: not human-readable, browser support limited
  Use: internal microservices, high-throughput, low latency

My choice: gRPC for internal Go microservices at VOIS
  - Service-to-service: classification → enrichment → routing
  - Go goroutines + worker pools + gRPC streaming
  - Result: 10k+ RPS, 40% lower latency vs REST
  - .proto contract enforced at compile time → no runtime type errors

When REST: external client APIs, webhook receivers,
           any browser-facing endpoint`,
    note: "Mention streaming RPC types: unary, server-streaming, client-streaming, bidirectional — shows gRPC depth."
  },
  {
    id: 32, cat: "genai",
    q: "What is NeMo Guardrails and how did you implement it?",
    tags: ["NeMo", "guardrails", "safety", "LangGraph"],
    answer: `NeMo Guardrails = NVIDIA's framework for adding
programmable safety rails to LLM applications

Types of rails:
  Input rails   → check user query BEFORE LLM processes
  Output rails  → check LLM response BEFORE returning
  Topic rails   → block off-topic conversations
  Jailbreak rails → detect prompt injection attempts

My implementation in LangGraph multi-agent system:
  1. User message → NeMo input rail checks:
     - Is query about allowed topics? (insurance claims)
     - Does it attempt jailbreak?
     - Any toxic/harmful content?
  2. If blocked → return safe refusal, no agent activation
  3. If allowed → Router Agent activates

Configuration (Colang language):
  define user ask off-topic
    "tell me a joke"
    "what is the weather"

  define flow handle off-topic
    user ask off-topic
    bot say "I can only assist with insurance claim queries."

Result: 100% guardrail rejection rate on defined
unsafe/off-topic categories in testing.`,
    note: "Colang is NeMo's custom DSL for defining conversation flows. Knowing this name shows genuine hands-on use."
  },
];

const CodeBlock = ({ code }) => (
  <pre style={{
    background: "#0f172a",
    border: "1px solid #1e293b",
    borderRadius: 8,
    padding: "14px 16px",
    fontSize: 12.5,
    lineHeight: 1.7,
    overflowX: "auto",
    color: "#e2e8f0",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    margin: "10px 0 0",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  }}>
    {code}
  </pre>
);

export default function App() {
  const [activeCat, setActiveCat] = useState("all");
  const [openId, setOpenId] = useState(null);
  const [search, setSearch] = useState("");
  const [revealed, setRevealed] = useState({});

  const filtered = questions.filter(q => {
    const matchCat = activeCat === "all" || q.cat === activeCat;
    const matchSearch = search === "" ||
      q.q.toLowerCase().includes(search.toLowerCase()) ||
      q.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const catColor = (id) => categories.find(c => c.id === id)?.color || "#94a3b8";
  const catIcon = (id) => categories.find(c => c.id === id)?.icon || "•";

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #020617 0%, #0f172a 50%, #0c1628 100%)",
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      color: "#e2e8f0",
      padding: "0 0 60px",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(90deg, #1e3a5f 0%, #0f2744 100%)",
        borderBottom: "1px solid #1e3a5f",
        padding: "28px 24px 20px",
        position: "sticky", top: 0, zIndex: 100,
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <span style={{ fontSize: 26 }}>🚀</span>
            <div>
              <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-0.5px", color: "#f0f9ff" }}>
                GenAI Interview Prep
              </div>
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 1 }}>
                Senior AI Engineer · Bangalore · {questions.length} Questions
              </div>
            </div>
            <div style={{
              marginLeft: "auto",
              background: "#0f172a",
              border: "1px solid #22d3ee33",
              borderRadius: 20,
              padding: "4px 14px",
              fontSize: 12,
              color: "#22d3ee",
              fontWeight: 600,
            }}>
              🎯 Interview Ready
            </div>
          </div>

          {/* Search */}
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="🔍  Search questions, tags..."
            style={{
              width: "100%", boxSizing: "border-box",
              background: "#0f172a", border: "1px solid #1e3a5f",
              borderRadius: 8, padding: "9px 14px",
              color: "#e2e8f0", fontSize: 13, marginTop: 14,
              outline: "none",
            }}
          />

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
            <button onClick={() => setActiveCat("all")} style={{
              padding: "6px 14px", borderRadius: 20, border: "none",
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: activeCat === "all" ? "#22d3ee" : "#1e293b",
              color: activeCat === "all" ? "#0f172a" : "#94a3b8",
              transition: "all 0.15s",
            }}>All ({questions.length})</button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setActiveCat(c.id)} style={{
                padding: "6px 14px", borderRadius: 20, border: "none",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: activeCat === c.id ? c.color : "#1e293b",
                color: activeCat === c.id ? "#0f172a" : "#94a3b8",
                transition: "all 0.15s",
              }}>
                {c.icon} {c.label} ({questions.filter(q => q.cat === c.id).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "20px 16px 0" }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "#475569" }}>
            No questions match "{search}"
          </div>
        )}
        {filtered.map((item, idx) => {
          const isOpen = openId === item.id;
          const isRevealed = revealed[item.id];
          const color = catColor(item.cat);
          return (
            <div key={item.id} style={{
              background: isOpen ? "#0f1e35" : "#0f172a",
              border: `1px solid ${isOpen ? color + "44" : "#1e293b"}`,
              borderRadius: 10,
              marginBottom: 10,
              transition: "all 0.2s",
              overflow: "hidden",
            }}>
              {/* Question row */}
              <div
                onClick={() => setOpenId(isOpen ? null : item.id)}
                style={{
                  padding: "14px 16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 12,
                  userSelect: "none",
                }}
              >
                <div style={{
                  minWidth: 28, height: 28,
                  background: color + "22",
                  borderRadius: 6,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color,
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#f1f5f9", lineHeight: 1.5 }}>
                    {item.q}
                  </div>
                  <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 10, padding: "2px 8px", borderRadius: 10,
                      background: color + "22", color, fontWeight: 600,
                    }}>{catIcon(item.cat)} {categories.find(c => c.id === item.cat)?.label}</span>
                    {item.tags.slice(0, 3).map(t => (
                      <span key={t} style={{
                        fontSize: 10, padding: "2px 8px", borderRadius: 10,
                        background: "#1e293b", color: "#64748b",
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
                <div style={{
                  color: "#475569", fontSize: 16,
                  transform: isOpen ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s",
                  marginTop: 2,
                }}>▾</div>
              </div>

              {/* Answer */}
              {isOpen && (
                <div style={{ padding: "0 16px 16px", borderTop: "1px solid #1e293b" }}>
                  <div style={{ paddingTop: 14 }}>
                    {!isRevealed ? (
                      <button
                        onClick={() => setRevealed(r => ({ ...r, [item.id]: true }))}
                        style={{
                          background: color + "22", border: `1px solid ${color}44`,
                          color, borderRadius: 8, padding: "10px 20px",
                          fontSize: 13, fontWeight: 700, cursor: "pointer",
                          width: "100%",
                        }}
                      >
                        👁 Reveal Answer
                      </button>
                    ) : (
                      <>
                        <CodeBlock code={item.answer} />
                        {item.note && (
                          <div style={{
                            marginTop: 12,
                            background: "#1e3a1e",
                            border: "1px solid #166534",
                            borderRadius: 8,
                            padding: "10px 14px",
                            fontSize: 12.5,
                            color: "#86efac",
                            lineHeight: 1.6,
                          }}>
                            💡 <strong>Interview tip:</strong> {item.note}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        maxWidth: 820, margin: "32px auto 0",
        padding: "0 16px",
        borderTop: "1px solid #1e293b",
        paddingTop: 20,
        textAlign: "center",
        fontSize: 12,
        color: "#334155",
      }}>
        Built for Chandan Sahoo · Senior AI Engineer Interview Prep · Bangalore 2026
      </div>
    </div>
  );
}
