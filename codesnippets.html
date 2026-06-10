<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ICPA Interview Mastery</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Fira+Code&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Inter', system-ui, sans-serif; }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
        const { useState, useMemo } = React;

        const ACCENT = "#00E5FF";
        const ACCENT2 = "#7C3AED";
        const BG = "#0A0E1A";
        const SURFACE = "#111827";
        const SURFACE2 = "#1F2937";
        const BORDER = "#1E2D45";
        const TEXT = "#E2E8F0";
        const MUTED = "#64748B";
        const SUCCESS = "#10B981";
        const WARN = "#F59E0B";
        const DANGER = "#EF4444";

        const CATEGORIES = [
          { id: "all", label: "All", icon: "⚡" },
          { id: "dsa", label: "DSA", icon: "🔢" },
          { id: "rag", label: "RAG / Retrieval", icon: "🔍" },
          { id: "llm", label: "LLM & Agents", icon: "🤖" },
          { id: "backend", label: "Backend / API", icon: "⚙️" },
          { id: "devops", label: "DevOps / MLOps", icon: "🚀" },
          { id: "sysdesign", label: "System Design", icon: "🏗️" },
          { id: "missing", label: "🆕 Missing Gaps", icon: "⭐" },
        ];

        const DIFFICULTY = {
          easy: { label: "Easy", color: SUCCESS },
          medium: { label: "Medium", color: WARN },
          hard: { label: "Hard", color: DANGER },
        };

        const questions = [
          // ─── DSA ───────────────────────────────────────────────
          {
            id: 1, cat: "dsa", difficulty: "medium",
            title: "LRU Cache for LLM Response Caching",
            icpa: "ICPA Layer 1 caches TF-IDF intent results for repeated German email patterns — same LRU logic prevents redundant classification calls.",
            pattern: "Ordered Dict eviction | O(1) get/put",
            interview_angle: "Explain how you'd cache ChromaDB query results in ICPA to reduce embedding calls by ~40%.",
            code: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cache = OrderedDict()
        self.capacity = capacity

    def get(self, key: str) -> str:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)      # mark as recently used
        return self.cache[key]

    def put(self, key: str, value: str) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False) # evict LRU`,
            tip: "ICPA hook: 'In our Layer 1 TF-IDF fast-path, I wrap the classifier with an LRU cache keyed on normalized email hash — this alone cut repeat classification from 10ms to <1ms for 30% of traffic.'"
          },
          {
            id: 2, cat: "dsa", difficulty: "medium",
            title: "Merge Intervals — Document Chunk Overlap",
            icpa: "BGE-M3 chunking in ICPA uses overlapping spans (stride=50 tokens). Merge logic ensures no context is double-counted when assembling final context window.",
            pattern: "Sort + greedy merge | O(n log n)",
            interview_angle: "Why do you use overlapping chunks in RAG, and how do you deduplicate retrieved overlapping spans?",
            code: `def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    for start, end in intervals[1:]:
        if start <= merged[-1][1]:
            merged[-1][1] = max(merged[-1][1], end)  # extend
        else:
            merged.append([start, end])
    return merged

# ICPA usage: merge overlapping token spans from BGE-M3 chunker
spans = [[0, 512], [462, 974], [900, 1412]]
print(merge_intervals(spans))  # [[0, 974], [900, 1412]] -> then de-overlap`,
            tip: "Explain chunk_overlap=50 rationale: preserves sentence boundary context across chunk edges, critical for German compound-noun-heavy insurance emails."
          },
          {
            id: 3, cat: "dsa", difficulty: "easy",
            title: "Top-K Frequent Tokens — Keyword Extraction",
            icpa: "ICPA Layer 1 TF-IDF uses token frequency as a signal. Top-K extraction identifies domain keywords (Schadensregulierung, DST, MER) for classification.",
            pattern: "Counter + heap | O(n log k)",
            interview_angle: "How do you build vocabulary for TF-IDF without sklearn on-the-fly? Walk through token frequency approach.",
            code: `import collections, heapq

def top_k_frequent(text: str, k: int) -> list[str]:
    counts = collections.Counter(text.split())
    return heapq.nlargest(k, counts.keys(), key=counts.get)

# ICPA: extract domain-specific German insurance terms
email = "Schadensregulierung DST Schadensregulierung AER DST DST"
print(top_k_frequent(email, 2))  # ['DST', 'Schadensregulierung']`,
            tip: "Segue: 'We discovered that 8 German domain terms cover ~70% of routing decisions — this insight shaped our TF-IDF vocabulary size from 50k → 2k tokens, dropping classification latency from 40ms to 10ms.'"
          },
          {
            id: 4, cat: "dsa", difficulty: "easy",
            title: "Valid Parentheses — Tool Call JSON Validation",
            icpa: "ICPA LangGraph agents receive structured JSON tool calls. Layer 3's NeMo Guardrails pre-validates brace balance before JSON parsing to avoid expensive parse errors.",
            pattern: "Stack-based matching | O(n)",
            interview_angle: "How do you validate LLM tool call output before Pydantic parsing? Why add a pre-check?",
            code: `def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            if not stack or stack[-1] != mapping[char]:
                return False
            stack.pop()
        else:
            stack.append(char)
    return not stack

# ICPA: pre-validate LLM JSON tool call before Pydantic
raw = '{"tool": "retrieve_policy", "args": {"case_id": "DST-001"}}'
if is_valid(raw):
    import json; parsed = json.loads(raw)`,
            tip: "Show awareness: 'We log validation failures to CloudWatch — it caught a model regression where a quantized Llama3.2 started producing malformed JSON 3% of the time.'"
          },
          {
            id: 5, cat: "dsa", difficulty: "hard",
            title: "Token Bucket Rate Limiter — LLM API Throttling",
            icpa: "ICPA FastAPI gateway uses token-bucket rate limiting per tenant to cap Ollama/Cohere API spend. Prevents burst abuse without hard per-second caps.",
            pattern: "Token refill + time-based drain | O(1) per request",
            interview_angle: "Why token bucket over fixed window for LLM rate limiting? What's the burst behavior?",
            code: `import time

class TokenBucket:
    def __init__(self, rate: float, capacity: float):
        self.rate = rate          # tokens/sec refill
        self.capacity = capacity  # max burst
        self.tokens = capacity
        self.last_time = time.time()

    def consume(self, tokens: float = 1.0) -> bool:
        now = time.time()
        elapsed = now - self.last_time
        self.tokens = min(
            self.capacity,
            self.tokens + elapsed * self.rate
        )
        self.last_time = now
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False  # rate-limited

# ICPA: 10 req/sec per tenant, burst up to 30
limiter = TokenBucket(rate=10, capacity=30)`,
            tip: "Production detail: 'In ICPA, we store token state in Redis with Lua scripts for atomicity — pure Python works for single-node but EKS multi-pod needs distributed state.'"
          },
          {
            id: 6, cat: "dsa", difficulty: "medium",
            title: "Sliding Window Max — Streaming Token Score Buffer",
            icpa: "ICPA's RAG Streaming Evaluation Platform buffers real-time RAGAS faithfulness scores across a 10-chunk window to detect score degradation trends.",
            pattern: "Monotonic deque | O(n)",
            interview_angle: "How do you detect real-time RAG quality degradation in a streaming pipeline without recomputing all history?",
            code: `import collections

def max_sliding_window(scores: list[float], k: int) -> list[float]:
    dq = collections.deque()  # stores indices, monotonically decreasing
    result = []
    for i, score in enumerate(scores):
        if dq and dq[0] < i - k + 1:
            dq.popleft()               # evict out-of-window
        while dq and scores[dq[-1]] < score:
            dq.pop()                   # maintain monotone
        dq.append(i)
        if i >= k - 1:
            result.append(scores[dq[0]])
    return result

# ICPA Streaming Eval: detect faithfulness window drops
scores = [0.91, 0.89, 0.72, 0.68, 0.91, 0.88, 0.76]
print(max_sliding_window(scores, 3))`,
            tip: "Story: 'This pattern revealed a Cohere Rerank cold-start issue — first 3 requests after pod restart scored 0.68 vs steady-state 0.91, which we'd never caught with batch evaluation.'"
          },
          {
            id: 7, cat: "dsa", difficulty: "medium",
            title: "Trie — Intent Prefix / Autocomplete for Case Types",
            icpa: "ICPA supports 5 German case types: DST, MIN, MDR, AER, MER. Trie-based prefix search powers the admin console autocomplete and fallback keyword router.",
            pattern: "Prefix tree | O(m) insert/search where m=word length",
            interview_angle: "How do you handle the case where intent TF-IDF confidence is borderline? What's the fallback?",
            code: `class TrieNode:
    def __init__(self):
        self.children: dict[str, 'TrieNode'] = {}
        self.is_end = False
        self.case_type: str | None = None  # ICPA extension

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, keyword: str, case_type: str):
        node = self.root
        for char in keyword.lower():
            node = node.children.setdefault(char, TrieNode())
        node.is_end = True
        node.case_type = case_type

    def search_prefix(self, prefix: str) -> list[str]:
        node = self.root
        for char in prefix.lower():
            if char not in node.children:
                return []
            node = node.children[char]
        return self._collect(node, prefix)

    def _collect(self, node: TrieNode, path: str) -> list[str]:
        results = [path] if node.is_end else []
        for char, child in node.children.items():
            results.extend(self._collect(child, path + char))
        return results

# ICPA case-type terms
trie = Trie()
for kw, ct in [("schaden", "DST"), ("mindest", "MIN"), ("mdr", "MDR")]:
    trie.insert(kw, ct)`,
            tip: "Nuance: 'Our Layer 1 TF-IDF handles 65% of traffic. The remaining 35% escalates to RAG — but before that, Trie prefix-match catches obvious keywords at ~0.1ms, escalating only truly ambiguous emails to the 200ms RAG layer.'"
          },
          {
            id: 8, cat: "dsa", difficulty: "hard",
            title: "Cycle Detection in Directed Graph — LangGraph Validation",
            icpa: "ICPA's 9-agent LangGraph StateGraph is validated on startup to ensure no unintended routing cycles (infinite loops between agents).",
            pattern: "DFS + recursion stack | O(V+E)",
            interview_angle: "How do you validate a LangGraph topology before deploying? What happens if there IS an intended cycle?",
            code: `def has_cycle(graph: dict[str, list[str]]) -> bool:
    """Detect unintended cycles in LangGraph agent routing graph."""
    visited: set[str] = set()
    rec_stack: set[str] = set()

    def dfs(node: str) -> bool:
        visited.add(node)
        rec_stack.add(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
            elif neighbor in rec_stack:
                return True  # back-edge = cycle
        rec_stack.remove(node)
        return False

    return any(dfs(n) for n in graph if n not in visited)

# ICPA 9-agent graph (simplified)
icpa_graph = {
    "intent_classifier": ["rag_retriever", "guardrails"],
    "rag_retriever":     ["reranker"],
    "reranker":          ["answer_generator"],
    "answer_generator":  ["output_validator"],
    "output_validator":  ["END"],  # no cycle
    "guardrails":        ["END"],
}
print(has_cycle(icpa_graph))  # False - safe to deploy`,
            tip: "Important: 'LangGraph DOES support intentional cycles (e.g., reflection/retry loops). We validate expected cycles in CI with an allow-list; unrecognised back-edges fail the deployment gate.'"
          },
          {
            id: 9, cat: "dsa", difficulty: "medium",
            title: "Merge K Sorted Lists — Multi-Shard Vector DB Results",
            icpa: "Production ICPA ChromaDB runs 3 shards for German/English/Technical domain collections. Results must be merged by cosine similarity score before reranking.",
            pattern: "Min-heap merge | O(n log k)",
            interview_angle: "If ChromaDB shards return top-5 each, how do you merge and return global top-5 efficiently?",
            code: `import heapq
from dataclasses import dataclass, field

@dataclass(order=True)
class ScoredDoc:
    score: float = field(compare=True)
    content: str = field(compare=False)
    shard: int = field(compare=False)

def merge_shard_results(shards: list[list[ScoredDoc]], top_k: int = 5) -> list[ScoredDoc]:
    """Merge top-k from multiple ChromaDB shards by cosine similarity."""
    heap: list[tuple[float, int, int]] = []  # (-score, shard_idx, doc_idx)
    for s_i, shard in enumerate(shards):
        if shard:
            heapq.heappush(heap, (-shard[0].score, s_i, 0))
    result = []
    while heap and len(result) < top_k:
        neg_score, s_i, d_i = heapq.heappop(heap)
        result.append(shards[s_i][d_i])
        if d_i + 1 < len(shards[s_i]):
            next_doc = shards[s_i][d_i + 1]
            heapq.heappush(heap, (-next_doc.score, s_i, d_i + 1))
    return result`,
            tip: "Precision note: 'We use negated scores because Python's heapq is a min-heap. In ICPA, after merge we apply Cohere Rerank as a second-pass to correct cross-shard score calibration differences.'"
          },
          {
            id: 10, cat: "dsa", difficulty: "medium",
            title: "Thread-Safe Singleton — LLM Client Instance",
            icpa: "ICPA's Ollama llama3.2 and Cohere clients are expensive to initialise. Singleton pattern with double-checked locking ensures one client per pod.",
            pattern: "Double-checked locking | Thread safety",
            interview_angle: "Why use Singleton for LLM clients? How does this differ in async (asyncio) vs threaded contexts?",
            code: `import threading
from anthropic import Anthropic  # or Ollama, Cohere

class LLMClientSingleton:
    _instance: 'LLMClientSingleton | None' = None
    _lock = threading.Lock()

    def __new__(cls):
        if cls._instance is None:
            with cls._lock:                      # acquire lock
                if cls._instance is None:        # re-check after lock
                    cls._instance = super().__new__(cls)
                    cls._instance._client = Anthropic()  # expensive init
        return cls._instance

    def complete(self, prompt: str) -> str:
        return self._client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1024,
            messages=[{"role": "user", "content": prompt}]
        ).content[0].text

# ICPA: all 9 LangGraph agents share one Ollama client
client1 = LLMClientSingleton()
client2 = LLMClientSingleton()
assert client1 is client2  # True`,
            tip: "Async nuance: 'In asyncio context, threading.Lock causes deadlocks. We use asyncio.Lock() instead, and in FastAPI we register the client as a lifespan dependency — instantiated once on startup.'"
          },
          {
            id: 11, cat: "dsa", difficulty: "medium",
            title: "Min-Heap from Scratch — Priority Queue for Request Scheduling",
            icpa: "ICPA EKS pod autoscaler uses a priority queue to process high-SLA insurance claims (DST/AER types) before lower-priority MDR/MIN cases.",
            pattern: "Heap invariant + bubble-up | O(log n) push/pop",
            interview_angle: "When would you use a priority queue over a FIFO queue in an AI backend?",
            code: `class MinHeap:
    def __init__(self): self.heap: list = []

    def push(self, val):
        self.heap.append(val)
        self._bubble_up(len(self.heap) - 1)

    def pop(self):
        if len(self.heap) == 1:
            return self.heap.pop()
        root = self.heap[0]
        self.heap[0] = self.heap.pop()
        self._bubble_down(0)
        return root

    def _bubble_up(self, i: int):
        while i > 0:
            parent = (i - 1) // 2
            if self.heap[i] < self.heap[parent]:
                self.heap[i], self.heap[parent] = self.heap[parent], self.heap[i]
                i = parent
            else: break

    def _bubble_down(self, i: int):
        n = len(self.heap)
        while True:
            smallest, l, r = i, 2*i+1, 2*i+2
            if l < n and self.heap[l] < self.heap[smallest]: smallest = l
            if r < n and self.heap[r] < self.heap[smallest]: smallest = r
            if smallest == i: break
            self.heap[i], self.heap[smallest] = self.heap[smallest], self.heap[i]
            i = smallest`,
            tip: "'DST and AER cases have SLA < 2 hours, MDR/MIN have 24-hour SLA. Priority = (sla_deadline, arrival_time) tuple — Python tuple comparison makes this trivial.'"
          },

          // ─── RAG / RETRIEVAL ───────────────────────────────────
          {
            id: 12, cat: "rag", difficulty: "easy",
            title: "Recursive Character Text Splitter",
            icpa: "ICPA uses this exact pattern for German insurance emails — first split by paragraphs, then lines, then '. ' (sentences). Critical for BGE-M3 512-token input limit.",
            pattern: "Recursive separator cascade | preserves semantic units",
            interview_angle: "Why not just split by fixed token count? What breaks in German compound-noun documents?",
            code: `def recursive_split(
    text: str,
    separators: list[str] = ["\\n\\n", "\\n", ". ", " "],
    chunk_size: int = 512,
    chunk_overlap: int = 50
) -> list[str]:
    """Mirrors LangChain's RecursiveCharacterTextSplitter logic."""
    if not separators or len(text) <= chunk_size:
        return [text]

    sep = separators[0]
    if sep not in text:
        return recursive_split(text, separators[1:], chunk_size, chunk_overlap)

    chunks = []
    current = ""
    for part in text.split(sep):
        if len(current) + len(part) > chunk_size:
            if current:
                chunks.append(current.strip())
            # overlap: keep last N chars
            current = current[-chunk_overlap:] + sep + part
        else:
            current = current + (sep if current else "") + part
    if current:
        chunks.append(current.strip())
    return chunks`,
            tip: "'Schadensregulierungsantrag' is one German word = 30 chars but semantically dense. Fixed-token splitting mid-word destroys embedding quality. Paragraph-first respects claim structure.'"
          },
          {
            id: 13, cat: "rag", difficulty: "easy",
            title: "Cosine Similarity from Scratch",
            icpa: "Core metric for ChromaDB vector search in ICPA. Understanding geometry explains why BGE-M3 multilingual embeddings outperformed OpenAI ada-002 for German text.",
            pattern: "Dot product / product of norms | O(d)",
            interview_angle: "What's the difference between cosine similarity and L2 distance for retrieval? When does it matter?",
            code: `import numpy as np

def cosine_similarity(v1: list[float], v2: list[float]) -> float:
    a, b = np.array(v1), np.array(v2)
    dot = np.dot(a, b)
    norm_a, norm_b = np.linalg.norm(a), np.linalg.norm(b)
    if norm_a == 0 or norm_b == 0:
        return 0.0  # guard against zero vectors
    return float(dot / (norm_a * norm_b))`,
            tip: "'This is exactly why ICPA uses cosine over L2 — emails vary wildly in length. A 50-word urgent claim and a 5000-word detailed claim about the same DST case should retrieve equally.'"
          },
          {
            id: 14, cat: "rag", difficulty: "hard",
            title: "Maximal Marginal Relevance (MMR) — Diverse Retrieval",
            icpa: "ICPA retrieves 20 candidate chunks then applies MMR to select the final 5 passed to the prompt. Prevents the LLM seeing 5 near-identical policy excerpts.",
            pattern: "Iterative greedy selection balancing relevance+diversity",
            interview_angle: "Without MMR, what failure mode do you see in insurance document RAG? How did it affect RAGAS scores?",
            code: `import numpy as np

def cosine_sim(a, b) -> float:
    a, b = np.array(a), np.array(b)
    return float(np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b) + 1e-9))

def mmr(query_emb, doc_embs, k=5, lambda_mult=0.6):
    """Returns indices of top-k diverse+relevant documents."""
    selected = []
    remaining = list(range(len(doc_embs)))

    while len(selected) < k and remaining:
        scores = []
        for i in remaining:
            rel = cosine_sim(query_emb, doc_embs[i])
            red = max((cosine_sim(doc_embs[i], doc_embs[j]) for j in selected), default=0.0)
            scores.append(lambda_mult * rel - (1 - lambda_mult) * red)
        best = remaining[int(np.argmax(scores))]
        selected.append(best)
        remaining.remove(best)
    return selected`,
            tip: "'Before MMR, RAGAS context recall was high but faithfulness was 72% — LLM got confused by 4 near-identical policy clauses. MMR lambda=0.6 pushed faithfulness to 86%. Cohere Rerank then took it to 91%.'"
          },
          {
            id: 15, cat: "rag", difficulty: "hard",
            title: "Cohere Rerank Integration — ICPA's 72%→91% Faithfulness Jump",
            icpa: "This is the centrepiece of ICPA RAG improvement. Cohere Rerank v3 rescores 20 candidates using cross-attention, far outperforming bi-encoder cosine similarity alone.",
            pattern: "Two-stage retrieval: bi-encoder → cross-encoder rerank",
            interview_angle: "Why not just use the cross-encoder from the start? What's the latency/cost trade-off?",
            code: `import cohere
from dataclasses import dataclass

@dataclass
class RankedDoc:
    content: str
    original_rank: int
    rerank_score: float

class ICPARerankPipeline:
    def __init__(self, chroma_collection, cohere_api_key: str):
        self.collection = chroma_collection
        self.co = cohere.Client(cohere_api_key)
        self.pre_rerank_faithfulness = 0.72
        self.post_rerank_faithfulness = 0.91  # 26% improvement

    def retrieve_and_rerank(self, query, initial_k=20, final_k=5):
        # Stage 1: fast bi-encoder retrieval (ChromaDB)
        results = self.collection.query(query_texts=[query], n_results=initial_k)
        candidates = results["documents"][0]

        # Stage 2: Cohere Rerank (cross-attention, understands German)
        reranked = self.co.rerank(
            query=query, documents=candidates, top_n=final_k,
            model="rerank-multilingual-v3.0"
        )
        return [
            RankedDoc(content=candidates[r.index], original_rank=r.index, rerank_score=r.relevance_score)
            for r in reranked.results
        ]`,
            tip: "'The key insight: bi-encoder embeds query and docs independently — misses interaction signals. Cross-encoder attends to the (query, doc) pair jointly. For insurance claims, query-document co-attention is crucial because the SAME clause means different things in DST vs AER context.'"
          },
          {
            id: 16, cat: "rag", difficulty: "medium",
            title: "HyDE — Hypothetical Document Embeddings",
            icpa: "ICPA handles ambiguous German queries ('Was gilt bei Totalschaden?'). HyDE generates a hypothetical policy answer first, then retrieves — dramatically improving recall for vague queries.",
            pattern: "LLM-augmented query expansion before retrieval",
            interview_angle: "What's the risk of HyDE? When does it fail? Did you A/B test it?",
            code: `async def hyde_retrieval(query, llm, retriever, num_hypothetical=3):
    """
    Instead of embedding the sparse query, generate N hypothetical
    answers and embed those — they live in the same semantic space
    as the actual document chunks.
    """
    hyde_prompt = f"""You are an insurance policy expert.
Write a concise paragraph that would ANSWER this question if it were
in a policy document. Do not say you don't know.
Question: {query}
Answer:"""
    hypothetical_doc = await llm.ainvoke(hyde_prompt)
    results = await retriever.ainvoke(hypothetical_doc.content)
    original_results = await retriever.ainvoke(query)

    seen = set()
    combined = []
    for doc in results + original_results:
        if doc.page_content not in seen:
            seen.add(doc.page_content)
            combined.append(doc)
    return combined[:10]  # top-10 for reranking`,
            tip: "'HyDE improved RAGAS context recall from 0.74 to 0.83 for ambiguous queries in ICPA — but hurt precision on specific policy-number queries. We route: specific queries → direct retrieval, ambiguous queries → HyDE.'"
          },
          {
            id: 17, cat: "rag", difficulty: "medium",
            title: "RAGAS Faithfulness — LLM-as-Judge Implementation",
            icpa: "ICPA faithfulness improved from 72% to 91%. RAGAS faithfulness is the PRIMARY metric — it measures atomic claim support, not surface text overlap.",
            pattern: "Claim decomposition → per-claim entailment checking",
            interview_angle: "How does RAGAS faithfulness differ from BLEU/ROUGE? Why is it better for RAG?",
            code: `import json

def evaluate_faithfulness_v2(question, answer, context, llm):
    """
    RAGAS faithfulness = (supported claims) / (total claims)
    """
    # Step 1: Decompose
    decompose_prompt = f"""Break this answer into atomic factual claims.
Return as JSON list of strings.
Answer: {answer}"""
    claims_raw = llm.invoke(decompose_prompt).content
    claims = json.loads(claims_raw)

    # Step 2: Verify each claim
    supported = 0
    for claim in claims:
        verify_prompt = f"""Context: {context}
Claim: {claim}
Is this claim FULLY supported by the context? Answer only YES or NO."""
        verdict = llm.invoke(verify_prompt).content.strip().upper()
        if "YES" in verdict:
            supported += 1

    faithfulness = supported / len(claims) if claims else 0.0
    return {"faithfulness": round(faithfulness, 3)}`,
            tip: "'RAGAS faithfulness is a hallucination detector. BLEU measures n-gram overlap with reference — useless when there's no ground-truth reference. LLM-as-judge scales to production without human annotation.'"
          },
          {
            id: 18, cat: "rag", difficulty: "medium",
            title: "Semantic Cache for RAG Queries",
            icpa: "ICPA processes repetitive German claim queries (same policy questions across hundreds of similar cases). Semantic cache reduced Cohere API costs by ~35%.",
            pattern: "Embedding similarity threshold → cache hit/miss",
            interview_angle: "What threshold do you use? What breaks at 0.99 vs 0.90?",
            code: `from sentence_transformers import SentenceTransformer
import numpy as np
import time

class ICPASemanticCache:
    def __init__(self, threshold=0.97, ttl_seconds=3600):
        self.model = SentenceTransformer('BAAI/bge-m3')
        self.cache = []
        self.threshold = threshold   # 0.97 for insurance (high precision needed)
        self.ttl = ttl_seconds

    def get(self, query):
        q_emb = self.model.encode(query)
        now = time.time()
        for entry in self.cache:
            if now - entry["ts"] > self.ttl:
                continue  # expired
            if self._cosine(q_emb, entry["emb"]) >= self.threshold:
                return entry["answer"]
        return None

    def set(self, query, answer):
        emb = self.model.encode(query)
        self.cache.append({"query": query, "answer": answer, "emb": emb, "ts": time.time()})`,
            tip: "'0.97 threshold matters for insurance — 0.95 would merge distinct policy questions. Production: we use Redis with vector search (not in-memory list) for persistence across EKS pods.'"
          },
          {
            id: 19, cat: "rag", difficulty: "medium",
            title: "Multi-Query Retrieval — Query Expansion",
            icpa: "For complex German insurance queries spanning multiple clauses, ICPA generates 3 query variants to increase context recall before Cohere Rerank narrows down.",
            pattern: "LLM query fan-out → deduplication → rerank",
            interview_angle: "What's the latency cost of multi-query? How do you run it without serialising the requests?",
            code: `import asyncio
import json

async def multi_query_retrieval(query, llm, retriever, num_variants=3):
    """Generate query variants and union results."""
    expand_prompt = f"""Generate {num_variants} different search queries
for the same information need. Return as JSON array.
Original query: {query}"""

    variants_raw = await llm.ainvoke(expand_prompt)
    variants = json.loads(variants_raw.content)
    all_queries = [query] + variants[:num_variants]

    # Run ALL retrievals concurrently
    results_list = await asyncio.gather(
        *[retriever.ainvoke(q) for q in all_queries],
        return_exceptions=True
    )

    # Deduplicate by content hash
    seen = set()
    unique_docs = []
    for results in results_list:
        if isinstance(results, Exception):
            continue
        for doc in results:
            if doc.page_content not in seen:
                seen.add(doc.page_content)
                unique_docs.append(doc)
    return unique_docs`,
            tip: "'asyncio.gather is crucial — 4 sequential retrievals × 50ms = 200ms. Concurrent = 50ms total. In ICPA's FastAPI endpoint, this keeps the 99th percentile under 800ms end-to-end.'"
          },
          {
            id: 20, cat: "rag", difficulty: "medium",
            title: "PII Anonymization Before Embedding",
            icpa: "ICPA processes German insurance claims with real customer data (policy numbers, names, phones). PII must be masked before sending to Cohere API or ChromaDB.",
            pattern: "Regex pattern matching + token replacement",
            interview_angle: "What's the risk of PII in embeddings? Can you reverse-engineer PII from an embedding vector?",
            code: `import re
from dataclasses import dataclass

@dataclass
class AnonymizationResult:
    anonymized_text: str
    pii_found: list[str]
    entity_map: dict[str, str]

def anonymize_german_insurance_pii(text):
    """ICPA-grade PII anonymization for German insurance emails."""
    entity_map = {}
    pii_found = []
    counter = {"EMAIL": 0, "PHONE": 0, "POLICY": 0, "IBAN": 0}

    def replace(match, entity_type):
        counter[entity_type] += 1
        token = f"[{entity_type}_{counter[entity_type]}]"
        entity_map[token] = match.group()
        return token

    # German phone formats
    text = re.sub(r'(\+49\s?|0)[1-9]\d{1,2}[\s\-]?\d{6,8}', lambda m: replace(m, "PHONE"), text)
    # Email
    text = re.sub(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', lambda m: replace(m, "EMAIL"), text)
    # German IBAN
    text = re.sub(r'\bDE\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}\b', lambda m: replace(m, "IBAN"), text)
    # Policy numbers (ICPA format)
    text = re.sub(r'\b(DST|MIN|MDR|AER|MER)-\d{4}-\d{6}\b', lambda m: replace(m, "POLICY"), text)
    return AnonymizationResult(text, pii_found, entity_map)`,
            tip: "'Embeddings DO leak PII — membership inference attacks can probe nearby vectors. ICPA uses anonymization + GDPR data processing agreements with Cohere as a processor. We never embed raw customer data.'"
          },

          // ─── LLM & AGENTS ─────────────────────────────────────
          {
            id: 21, cat: "llm", difficulty: "hard",
            title: "LangGraph StateGraph — ICPA 9-Agent Architecture",
            icpa: "This IS the ICPA Layer 3. 9 named agents in a StateGraph: IntentValidator, DocumentRetriever, Reranker, ContextAssembler, AnswerGenerator, QualityChecker, PIIGuard, OutputFormatter, AuditLogger.",
            pattern: "TypedDict state + conditional edges + checkpointing",
            interview_angle: "Walk me through how state flows from IntentValidator to AnswerGenerator. What happens on quality check failure?",
            code: `from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class ICPAState(TypedDict):
    raw_email: str
    case_type: str             # DST | MIN | MDR | AER | MER
    intent_confidence: float
    retrieved_docs: list[dict]
    answer: str
    faithfulness_score: float

def route_after_intent(state):
    """Conditional edge: high confidence → direct answer, low → RAG."""
    if state["intent_confidence"] > 0.85:
        return "context_assembler"
    return "document_retriever"

def route_after_quality(state):
    if state["faithfulness_score"] >= 0.85:
        return "pii_guard"
    return "answer_generator"  # retry with refined context

# Build graph
builder = StateGraph(ICPAState)
# ... add nodes and edges ...`,
            tip: "'The retry loop (quality_checker → answer_generator) was key to our 91% faithfulness. Max 2 retries. If score still < 0.85, we return a 'confidence: low' flag to the human agent queue rather than hallucinate.'"
          },
          {
            id: 22, cat: "llm", difficulty: "medium",
            title: "NeMo Guardrails — Input/Output Safety",
            icpa: "ICPA Layer 3 uses NeMo Guardrails to block prompt injection (attackers embedding instructions in claim emails), off-topic queries, and PII leakage in responses.",
            pattern: "Pattern matching + LLM-based classification for safety",
            interview_angle: "Can NeMo Guardrails be bypassed? What's your defence-in-depth strategy?",
            code: `import re
from enum import Enum

class GuardrailResult(Enum):
    ALLOWED = "allowed"
    BLOCKED_INJECTION = "blocked_injection"
    BLOCKED_PII_OUTPUT = "blocked_pii_output"

class ICPAGuardrails:
    INJECTION_PATTERNS = [
        r"ignore (previous|all|your) (instructions|rules|constraints)",
        r"you are now (a|an|the)",
        r"system prompt",
        r"act as (a|an|the)",
    ]

    def check_input(self, query):
        q_lower = query.lower()
        for pattern in self.INJECTION_PATTERNS:
            if re.search(pattern, q_lower, re.IGNORECASE):
                return GuardrailResult.BLOCKED_INJECTION
        return GuardrailResult.ALLOWED`,
            tip: "'Defence in depth: (1) NeMo blocks obvious injections, (2) Pydantic validates output structure, (3) PII guard scans response, (4) audit log captures everything. No single layer is sufficient.'"
          },
          {
            id: 23, cat: "llm", difficulty: "medium",
            title: "Model Context Protocol (MCP) Server",
            icpa: "ICPA exposes internal tools (ChromaDB query, case-status lookup, policy fetch) as MCP tools so Claude/GPT-4 orchestrators can call them natively via tool-use.",
            pattern: "FastMCP server exposing typed tools over stdio/SSE",
            interview_angle: "How is MCP different from LangChain tools? What transport does ICPA use?",
            code: `from mcp.server.fastmcp import FastMCP
import chromadb

mcp = FastMCP("ICPA-MCP-Server", version="1.0.0")
chroma = chromadb.HttpClient(host="chromadb-service", port=8000)
collection = chroma.get_collection("icpa_insurance_policies")

@mcp.tool()
def search_policy_documents(query: str, case_type: str, top_k: int = 5):
    results = collection.query(
        query_texts=[query],
        where={"case_type": case_type},
        n_results=top_k
    )
    return {"documents": results["documents"][0], "metadatas": results["metadatas"][0]}

if __name__ == "__main__":
    mcp.run(transport="sse")  # SSE for AWS EKS HTTP transport`,
            tip: "'MCP vs LangChain tools: MCP is a protocol standard — any compliant LLM (Claude, GPT-4, Gemini) can call ICPA tools without custom integration code. LangChain tools are framework-specific.'"
          },
          {
            id: 24, cat: "llm", difficulty: "medium",
            title: "Async Concurrent LLM Calls — Multi-Agent Parallelism",
            icpa: "ICPA's ContextAssembler runs 3 sub-queries concurrently (German policy text, English summary, case precedents) using asyncio.gather before merging context.",
            pattern: "asyncio.gather for I/O-bound concurrent LLM calls",
            interview_angle: "When would you use asyncio.gather vs asyncio.wait? What happens when one call fails?",
            code: `import asyncio

async def icpa_parallel_retrieval(case_id, case_type, retriever):
    """Retrieve from 3 sources concurrently."""
    async def fetch(query, query_type):
        try:
            docs = await retriever.ainvoke(query)
            return {"type": query_type, "docs": docs}
        except Exception as e:
            return {"type": query_type, "error": str(e)}

    queries = [
        (f"{case_type} Versicherungsbedingungen {case_id}", "german_policy"),
        (f"{case_type} insurance terms english summary", "english_summary"),
        (f"similar cases resolved {case_type}", "precedents"),
    ]

    results = await asyncio.gather(
        *[fetch(q, qt) for q, qt in queries],
        return_exceptions=False
    )
    return [r for r in results if "error" not in r]`,
            tip: "'asyncio.gather is faster but fails together by default. For ICPA, we use return_exceptions=False and wrap each coro in try/except — partial results are better than full failure for insurance queries.'"
          },
          {
            id: 25, cat: "llm", difficulty: "medium",
            title: "Structured Output Parsing with Pydantic + Retry",
            icpa: "ICPA's AnswerGenerator must produce structured JSON (answer, confidence, sources, case_recommendation). Pydantic parser with retry ensures the LLM output matches schema.",
            pattern: "PydanticOutputParser + OutputFixingParser fallback",
            interview_angle: "What happens when the LLM produces partial JSON? How many retries before giving up?",
            code: `from pydantic import BaseModel, Field, validator

class ICPAResponse(BaseModel):
    answer: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    case_recommendation: str  # APPROVE|REJECT|ESCALATE|MORE_INFO

    @validator("case_recommendation")
    def validate_recommendation(cls, v):
        allowed = {"APPROVE", "REJECT", "ESCALATE", "MORE_INFO"}
        if v.upper() not in allowed:
            raise ValueError(f"Must be one of {allowed}")
        return v.upper()

async def generate_with_retry(chain, inputs, max_retries=2):
    for attempt in range(max_retries + 1):
        try:
            return await chain.ainvoke(inputs)
        except Exception as e:
            if attempt == max_retries:
                return ICPAResponse(
                    answer="Escalating to human agent.",
                    confidence=0.0,
                    case_recommendation="ESCALATE"
                )
            inputs["temperature"] = 0.1 * (attempt + 1)`,
            tip: "'We log every parse failure to LangSmith. In production, >95% of responses parse on first attempt with our prompt. The 5% that fail: 80% succeed on retry, 20% escalate to human agents.'"
          },
          {
            id: 26, cat: "llm", difficulty: "medium",
            title: "Tool Calling with Retry (Tenacity)",
            icpa: "ICPA's ChromaDB and Cohere Rerank tools are external services that can transiently fail. Tenacity retry with exponential backoff prevents cascade failures.",
            pattern: "Exponential backoff with jitter | Circuit breaker companion",
            interview_angle: "What's the difference between retry and circuit breaker? When do you use each?",
            code: `from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
import httpx
import cohere

class ICPAToolRegistry:
    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=1, max=8),
        retry=retry_if_exception_type((httpx.TimeoutException, cohere.TooManyRequestsError))
    )
    async def call_cohere_rerank(self, query, documents, top_n=5):
        co = cohere.AsyncClient()
        result = await co.rerank(
            query=query, documents=documents, top_n=top_n,
            model="rerank-multilingual-v3.0"
        )
        return result.results

# Retry vs Circuit Breaker:
# - Retry: transient failures, expects eventual success
# - Circuit Breaker: persistent failures, stops hammering a down service`,
            tip: "'In ICPA, Cohere has rate limits (300 req/min on our tier). Tenacity handles rate limit 429s gracefully. For Ollama (local), we use circuit breaker — pod crash means retrying forever would queue up 100+ requests.'"
          },
          {
            id: 27, cat: "llm", difficulty: "medium",
            title: "LangSmith Tracing — Production Observability",
            icpa: "ICPA uses LangSmith to trace every agent execution in the 9-node StateGraph. Critical for debugging faithfulness drops and agent routing issues.",
            pattern: "@traceable decorator + nested run context",
            interview_angle: "How do you diagnose a faithfulness drop from 91% to 78% in production? What traces do you check?",
            code: `from langsmith import traceable, Client
from langsmith.run_helpers import get_current_run_tree

@traceable(
    name="icpa_rag_pipeline",
    run_type="chain",
    tags=["production", "layer3"]
)
async def icpa_rag_pipeline(email_content, case_type, thread_id):
    """Full ICPA pipeline — traced in LangSmith."""
    retrieved = await traced_retrieval(email_content, case_type)
    reranked = await traced_rerank(email_content, retrieved)
    answer = await traced_generation(email_content, reranked)

    run_tree = get_current_run_tree()
    if run_tree:
        run_tree.extra["faithfulness"] = answer.get("faithfulness_score")
    return answer`,
            tip: "'After our Cohere model upgrade to rerank-v3.0 caused a 2-day faithfulness dip, LangSmith traces showed the score drop started exactly at 14:32 on deploy day. Without tracing, we'd have blamed the data.'"
          },
          {
            id: 28, cat: "llm", difficulty: "hard",
            title: "HITL (Human-in-the-Loop) with LangGraph interrupt()",
            icpa: "ICPA cases with confidence < 0.6 or case_recommendation=ESCALATE pause the graph and notify a human agent via Kafka event. Human approves/rejects, graph resumes.",
            pattern: "interrupt() + checkpointer + resume with Command",
            interview_angle: "How do you implement HITL without blocking the event loop? What happens to state during the pause?",
            code: `from langgraph.graph import StateGraph, END
from langgraph.checkpoint.postgres import PostgresSaver
from langgraph.types import interrupt, Command

def quality_gate(state):
    """Gate that triggers HITL for low-confidence cases."""
    if state["confidence"] < 0.6 or state["case_recommendation"] == "ESCALATE":
        human_input = interrupt({
            "message": "Low confidence case requires human review",
            "current_answer": state["answer"],
            "options": ["APPROVE", "REJECT", "MORE_INFO"]
        })
        state["human_decision"] = human_input["decision"]
    return state

# Resume the graph after human decision:
# graph.invoke(Command(resume={"decision": "APPROVE"}), config={"thread_id": "case_DST_001"})

# PostgresSaver stores state so pod restarts don't lose it
checkpointer = PostgresSaver.from_conn_string("postgresql://...")`,
            tip: "'In ICPA, HITL cases appear in the human agent dashboard as 'Pending Review'. The graph thread can be paused for HOURS. PostgresSaver means pod restarts don't lose state — critical for insurance SLA compliance.'"
          },

          // ─── BACKEND / API ────────────────────────────────────
          {
            id: 29, cat: "backend", difficulty: "easy",
            title: "FastAPI with Pydantic v2 — ICPA Chat Endpoint",
            icpa: "ICPA's FastAPI gateway is the entry point for all email processing requests. Pydantic v2 validates input structure with field-level error messages.",
            pattern: "FastAPI + Pydantic v2 with model validators",
            interview_angle: "What changed between Pydantic v1 and v2? Why does it matter for a high-throughput endpoint?",
            code: `from pydantic import BaseModel, Field, model_validator
from fastapi import FastAPI, BackgroundTasks
from typing import Literal

app = FastAPI(title="ICPA Insurance Processing API", version="2.1.0")

class ICPARequest(BaseModel):
    model_config = {"str_strip_whitespace": True}  # Pydantic v2

    email_content: str = Field(..., min_length=10, max_length=50_000)
    case_type: Literal["DST", "MIN", "MDR", "AER", "MER"] | None = None
    language: Literal["de", "en", "auto"] = "auto"

    @model_validator(mode='after')
    def validate_german_content(self):
        if self.language in ("de", "auto"):
            german_markers = ["versicherung", "schaden", "police", "antrag"]
            # Language detection handles validation
        return self

@app.post("/v1/process")
async def process_insurance_email(request: ICPARequest, background_tasks: BackgroundTasks):
    background_tasks.add_task(log_request_audit, request)
    return {"case_type": request.case_type or "AUTO", "confidence": 0.91}`,
            tip: "'Pydantic v2 is 5-17x faster than v1 for validation due to Rust core. In ICPA with 1000 req/min, validation overhead dropped from 3ms to 0.2ms per request.'"
          },
          {
            id: 30, cat: "backend", difficulty: "medium",
            title: "Streaming SSE Response — Real-time LLM Output",
            icpa: "ICPA's human agent dashboard streams LLM reasoning tokens in real-time so agents can see the answer being generated, enabling early intervention.",
            pattern: "Server-Sent Events with async generator",
            interview_angle: "What's the difference between SSE and WebSockets for LLM streaming? Why did you choose SSE?",
            code: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import asyncio
import json

app = FastAPI()

@app.get("/v1/stream/{case_id}")
async def stream_icpa_answer(case_id, query):
    async def generate_sse():
        yield f"event: metadata\\ndata: {json.dumps({'case_id': case_id})}\\n\\n"

        async for chunk in llm.astream(f"Process insurance query: {query}"):
            if chunk.content:
                yield f"data: {json.dumps({'token': chunk.content})}\\n\\n"
                await asyncio.sleep(0)

        yield "event: done\\ndata: [DONE]\\n\\n"

    return StreamingResponse(
        generate_sse(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"}
    )`,
            tip: "'The X-Accel-Buffering: no header is critical when behind nginx on EKS — without it, nginx buffers the entire response before forwarding, killing the streaming UX.'"
          },
          {
            id: 31, cat: "backend", difficulty: "hard",
            title: "Redis Rate Limiting — Per-Tenant Token Budget",
            icpa: "ICPA serves multiple Vodafone subsidiary tenants. Redis-based sliding window rate limiting enforces per-tenant LLM token budgets to control costs.",
            pattern: "Redis sliding window with Lua atomicity",
            interview_angle: "Why Lua scripts for rate limiting? What breaks with non-atomic Redis INCR?",
            code: `import redis.asyncio as aioredis
from fastapi import HTTPException
import time

# Lua script for atomic sliding window rate limiting
RATE_LIMIT_SCRIPT = """
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])

redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
local current = redis.call('ZCARD', key)

if current >= limit then
    return 0  -- rate limited
end

redis.call('ZADD', key, now, now .. math.random())
redis.call('EXPIRE', key, window)
return 1  -- allowed
"""

async def icpa_rate_limit(tenant_id, endpoint, limit=100, window_seconds=60):
    client = aioredis.Redis()
    key = f"ratelimit:{tenant_id}:{endpoint}"
    allowed = await client.eval(RATE_LIMIT_SCRIPT, 1, key, int(time.time()*1000), window_seconds*1000, limit)
    if not allowed:
        raise HTTPException(status_code=429, detail="Rate limit exceeded")`,
            tip: "'ICPA serves 8 tenants with different SLAs. VodafoneDE gets 500 req/min, smaller subsidiaries get 50. Redis sorted set with Lua gives us per-tenant control with microsecond overhead.'"
          },
          {
            id: 32, cat: "backend", difficulty: "medium",
            title: "Async Producer-Consumer — LLM Request Queue",
            icpa: "ICPA's Layer 3 processes emails via an asyncio queue — producers receive HTTP requests, consumers call Ollama. Decouples ingestion from LLM throughput.",
            pattern: "asyncio.Queue + bounded worker pool",
            interview_angle: "What's the queue depth you run ICPA at? How do you handle queue saturation?",
            code: `import asyncio
import uuid
from dataclasses import dataclass, field

@dataclass(order=True)
class ICPATask:
    priority: int
    task_id: str = field(compare=False, default_factory=lambda: str(uuid.uuid4()))
    email_content: str = field(compare=False)
    case_type: str = field(compare=False)

class ICPARequestQueue:
    def __init__(self, max_workers=4, max_queue_size=100):
        self.queue = asyncio.PriorityQueue(maxsize=max_queue_size)
        self.max_workers = max_workers

    async def enqueue(self, task):
        try:
            self.queue.put_nowait(task)
            return True
        except asyncio.QueueFull:
            return False  # caller should return 503

    async def worker(self, worker_id):
        while True:
            task = await self.queue.get()
            try:
                result = await process_icpa_task(task)
            except Exception as e:
                print(f"[Worker-{worker_id}] Task {task.task_id} failed: {e}")
            finally:
                self.queue.task_done()`,
            tip: "'4 workers matches our Ollama GPU concurrency — adding more workers doesn't help if Ollama is the bottleneck. Queue size of 100 gives ~25 seconds of buffer at peak load before we return 503.'"
          },
          {
            id: 33, cat: "backend", difficulty: "medium",
            title: "Prometheus Metrics for LLM Observability",
            icpa: "ICPA exposes Prometheus metrics to Grafana: LLM latency, faithfulness scores, token usage, and per-case-type throughput. Critical for cost and SLA monitoring.",
            pattern: "Histogram + Counter + Gauge with labels",
            interview_angle: "Why use Histogram instead of Summary for LLM latency? What percentiles does ICPA track?",
            code: `from prometheus_client import Counter, Histogram, Gauge, make_asgi_app
from fastapi import FastAPI

PIPELINE_LATENCY = Histogram(
    'icpa_pipeline_latency_seconds',
    'End-to-end pipeline latency',
    ['case_type', 'layer'],
    buckets=[.05, .1, .25, .5, 1, 2, 5, 10]
)
FAITHFULNESS_SCORE = Histogram(
    'icpa_faithfulness_score',
    'RAGAS faithfulness score per case',
    ['case_type'],
    buckets=[.5, .6, .7, .75, .8, .85, .9, .95, 1.0]
)
TOKEN_USAGE = Counter(
    'icpa_llm_tokens_total',
    'LLM tokens consumed',
    ['model', 'operation']
)

app = FastAPI()
app.mount("/metrics", make_asgi_app())`,
            tip: "'Histogram vs Summary: Histogram is aggregatable across pods (Prometheus can sum histograms from 10 pods). Summary is per-pod — can't aggregate. Critical in EKS with 3 replicas. ICPA tracks p50, p95, p99 latency.'"
          },

          // ─── DEVOPS / MLOPS ───────────────────────────────────
          {
            id: 34, cat: "devops", difficulty: "medium",
            title: "AWS EKS Deployment — ICPA Production Setup",
            icpa: "ICPA runs on AWS EKS with Argo CD GitOps. The LLM pipeline, ChromaDB, and Ollama are separate Kubernetes services. HPA scales on GPU utilization.",
            pattern: "Kubernetes manifests + HPA + resource requests/limits",
            interview_angle: "How does your HPA scale for LLM workloads vs traditional CPU services?",
            code: `# icpa-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: icpa-fastapi
spec:
  replicas: 3
  selector:
    matchLabels: { app: icpa-fastapi }
  template:
    spec:
      containers:
      - name: icpa-fastapi
        image: registry.example.com/icpa:2.1.0
        resources:
          requests: { memory: "2Gi", cpu: "500m" }
          limits:   { memory: "4Gi", cpu: "2000m" }
        readinessProbe:
          httpGet: { path: /health, port: 8000 }
          initialDelaySeconds: 10
        livenessProbe:
          httpGet: { path: /health, port: 8000 }
          failureThreshold: 3
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: icpa-hpa
spec:
  scaleTargetRef: { kind: Deployment, name: icpa-fastapi }
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target: { type: Utilization, averageUtilization: 70 }`,
            tip: "'GPU HPA is tricky — we use custom metrics (queue depth from Prometheus) rather than CPU/GPU %. CPU scales the FastAPI pods; Ollama is a DaemonSet (one per GPU node), so we scale by adding GPU nodes via Karpenter.'"
          },
          {
            id: 35, cat: "devops", difficulty: "medium",
            title: "Argo CD GitOps — ICPA CI/CD Pipeline",
            icpa: "ICPA uses Argo CD GitOps: git push to main → GitHub Actions → Docker build → ECR → Argo CD auto-sync to EKS. Reduced deployment from 3 days to 15 minutes.",
            pattern: "GitOps: declarative state in git, reconciled by Argo CD",
            interview_angle: "What's the difference between Argo CD and Flux? Why GitOps over Helm direct-apply?",
            code: `# .github/workflows/icpa-deploy.yml
name: ICPA CI/CD Pipeline
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - name: Run RAGAS Evaluation Gate
      run: |
        pytest tests/ragas_gate.py -v
        # Fail deployment if faithfulness < 0.88 on test suite

  build-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - name: Build and push to ECR
      run: |
        aws ecr get-login-password | docker login --username AWS \\
          --password-stdin $ECR_REGISTRY
        docker build -t icpa:latest .
        docker push $ECR_REGISTRY/icpa:latest

    - name: Update Argo CD values
      run: |
        sed -i "s|tag: .*|tag: latest|" k8s/icpa/values.yaml
        git commit -am "ci: deploy" && git push`,
            tip: "'The RAGAS gate in CI is the key innovation — we catch faithfulness regressions before deployment, not after. This gate blocked 3 releases in 6 months that would have degraded production quality.'"
          },
          {
            id: 36, cat: "devops", difficulty: "hard",
            title: "OpenTelemetry Distributed Tracing — ICPA Pipeline",
            icpa: "ICPA's 9-agent pipeline spans multiple services (FastAPI, ChromaDB, Ollama, Cohere). OTel traces the full request from HTTP intake to final response.",
            pattern: "OTel SDK + automatic instrumentation + Jaeger/Grafana Tempo",
            interview_angle: "How do you correlate OTel traces with LangSmith traces? What does a slow Cohere trace look like?",
            code: `from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.httpx import HTTPXClientInstrumentor

def setup_telemetry(service_name="icpa-pipeline"):
    exporter = OTLPSpanExporter(endpoint="http://otel-collector:4317")
    provider = TracerProvider()
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)

    FastAPIInstrumentor.instrument()
    HTTPXClientInstrumentor().instrument()

tracer = trace.get_tracer("icpa.pipeline")

def otel_traced(span_name, attributes={}):
    def decorator(func):
        async def wrapper(*args, **kwargs):
            with tracer.start_as_current_span(span_name) as span:
                for k, v in attributes.items():
                    span.set_attribute(k, v)
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    span.record_exception(e)
                    raise
        return wrapper
    return decorator`,
            tip: "'Combining OTel + LangSmith: OTel gives infrastructure-level traces (network, DB queries), LangSmith gives LLM-specific traces (prompts, token counts). We correlate via trace_id passed as metadata to LangSmith.'"
          },

          // ─── SYSTEM DESIGN ────────────────────────────────────
          {
            id: 37, cat: "sysdesign", difficulty: "hard",
            title: "System Design: ICPA End-to-End Architecture",
            icpa: "This IS your ICPA system. 3-layer architecture: fast-path TF-IDF → RAG with reranking → LangGraph multi-agent. Each layer has different latency/cost/accuracy trade-offs.",
            pattern: "Layered fallback + cost optimization + observability",
            interview_angle: "Why not run all emails through the LangGraph agent? What's the cost/latency argument for the TF-IDF fast-path?",
            code: `"""
ICPA System Design — Key Architecture Decisions

Layer 1: TF-IDF Intent Classifier
  - Handles: 65% of traffic (clear intent, high confidence)
  - Latency: ~10ms
  - Cost: Near-zero (no API calls)
  - When: confidence > 0.85

Layer 2: ChromaDB RAG + BGE-M3 + Cohere Rerank
  - Handles: 25% of traffic (ambiguous intent, needs context)
  - Latency: ~300ms (retrieval 50ms + rerank 200ms + LLM 50ms)
  - When: TF-IDF confidence 0.6-0.85

Layer 3: 9-Agent LangGraph StateGraph
  - Handles: 10% of traffic (complex multi-step)
  - Latency: ~2-5s
  - When: confidence < 0.6 OR multi-clause question

Key Metrics Achieved:
  - RAG faithfulness: 72% → 91% (Cohere Rerank)
  - ~$15k/year infrastructure savings
  - p99 latency: <800ms for Layer 1+2, <5s for Layer 3
"""`,
            tip: "'The $15k savings came from eliminating PEGA BPM licensing and 3 dedicated BPM engineers. The 3-layer architecture was a cost optimization — pure LangGraph for all traffic would cost 30x more.'"
          },
          {
            id: 38, cat: "sysdesign", difficulty: "hard",
            title: "Design: RAG Streaming Evaluation Platform",
            icpa: "Real-time RAGAS score streaming as documents are retrieved. Allows monitoring faithfulness, precision, recall without waiting for batch jobs.",
            pattern: "Streaming pipeline with windowed aggregation",
            interview_angle: "How does real-time evaluation differ from batch? What's the latency of computing RAGAS online?",
            code: `from collections import deque

class StreamingRAGEvaluator:
    def __init__(self, window_size=100, alert_threshold=0.85):
        self.window = deque(maxlen=window_size)
        self.ema = None
        self.alpha = 0.1
        self.threshold = alert_threshold

    async def evaluate_async(self, question, answer, context, llm):
        score = await compute_faithfulness_async(question, answer, context, llm)
        self.window.append(score)

        if self.ema is None:
            self.ema = score
        else:
            self.ema = self.alpha * score + (1 - self.alpha) * self.ema

        window_avg = sum(self.window) / len(self.window)
        if window_avg < self.threshold:
            await self._trigger_alert(window_avg, score)`,
            tip: "'The key selling point: batch evaluation is a rearview mirror. Streaming evaluation is a windshield. In ICPA, we detected a Cohere model change within 47 minutes instead of 24 hours.'"
          },
          {
            id: 39, cat: "sysdesign", difficulty: "hard",
            title: "Design: Multi-Agent Orchestration with Redis + NeMo",
            icpa: "Redis pub/sub for cross-agent communication, NeMo Guardrails for safety, orchestrator pattern for task decomposition.",
            pattern: "Pub/Sub orchestration + safety rails + task decomposition",
            interview_angle: "How do agents communicate in your system? What's the difference between orchestrator and choreography patterns?",
            code: `import redis.asyncio as aioredis
import json, uuid, asyncio

class ICPAOrchestrator:
    def __init__(self, redis_url):
        self.redis = aioredis.from_url(redis_url)
        self.pending = {}

    async def dispatch_task(self, agent_type, payload, timeout=30.0):
        correlation_id = str(uuid.uuid4())
        task = {"correlation_id": correlation_id, **payload}

        future = asyncio.get_event_loop().create_future()
        self.pending[correlation_id] = future

        await self.redis.xadd(f"icpa:tasks:{agent_type}", {"task": json.dumps(task)})

        try:
            return await asyncio.wait_for(future, timeout=timeout)
        except asyncio.TimeoutError:
            del self.pending[correlation_id]
            return {"error": f"Agent {agent_type} timeout"}`,
            tip: "'Orchestrator vs Choreography: ICPA uses orchestrator because NeMo Guardrails must gate EVERY response centrally. In choreography, a rogue agent could bypass safety checks.'"
          },

          // ─── 🆕 MISSING GAPS ──────────────────────────────────
          {
            id: 40, cat: "missing", difficulty: "hard",
            title: "🆕 vLLM Serving — High-Throughput LLM Inference",
            icpa: "ICPA currently uses Ollama. vLLM is the production upgrade path: PagedAttention for 24x throughput, continuous batching, compatible with llama3.2.",
            pattern: "PagedAttention + continuous batching + OpenAI-compatible API",
            interview_angle: "How does vLLM's PagedAttention differ from Ollama's serving? What's the throughput difference?",
            code: `# vLLM server startup
# vllm serve meta-llama/Llama-3.2-3B-Instruct \\
#   --tensor-parallel-size 1 \\
#   --max-model-len 8192 \\
#   --enable-prefix-caching

from openai import AsyncOpenAI

vllm_client = AsyncOpenAI(
    base_url="http://vllm-service:8000/v1",
    api_key="token-abc123"
)

async def generate_with_vllm(prompt, system_prompt, max_tokens=512):
    response = await vllm_client.chat.completions.create(
        model="meta-llama/Llama-3.2-3B-Instruct",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt}
        ],
        max_tokens=max_tokens,
        temperature=0.1
    )
    return response.choices[0].message.content

# PagedAttention: KV-cache as virtual pages, allocated on demand
# Result: 24x more concurrent requests on same GPU`,
            tip: "'Frame it: ICPA has Ollama today, but I am evaluating vLLM for next quarter. PagedAttention solves our GPU memory waste on variable-length insurance emails.'"
          },
          {
            id: 41, cat: "missing", difficulty: "hard",
            title: "🆕 LoRA Fine-tuning — Domain Adaptation for German Insurance",
            icpa: "Critical gap: ICPA uses llama3.2 out-of-box. Fine-tuning on German insurance data could push faithfulness from 91% to 95%+ while reducing context window needs.",
            pattern: "LoRA: freeze base model, train rank-decomposition matrices",
            interview_angle: "Why LoRA instead of full fine-tuning? What's the memory reduction?",
            code: `from peft import LoraConfig, TaskType

lora_config = LoraConfig(
    task_type=TaskType.CAUSAL_LM,
    r=16,                    # rank: 16 is good balance
    lora_alpha=32,           # scaling: typically 2*r
    target_modules=["q_proj", "v_proj", "k_proj"],
    lora_dropout=0.05,
    bias="none"
)
# Memory comparison:
# Full fine-tune llama-3.2-3B: ~24GB VRAM
# LoRA r=16:                   ~6GB VRAM (4x reduction)
# QLoRA (4-bit + LoRA):        ~3GB VRAM (8x reduction!)`,
            tip: "'Frame as roadmap: ICPA v3.0 plan. LoRA fine-tuning on 2000 labeled insurance cases would let us reduce RAG context from 5 chunks to 2, cutting Cohere Rerank cost by 60%.'"
          },
          {
            id: 42, cat: "missing", difficulty: "medium",
            title: "🆕 LiteLLM AI Gateway — Multi-Provider LLM Routing",
            icpa: "ICPA v2 uses Ollama directly. LiteLLM adds: provider failover (Ollama → Claude → GPT-4), cost tracking per tenant, A/B testing between models.",
            pattern: "Proxy pattern with retry/fallback across LLM providers",
            interview_angle: "How would you add LiteLLM to ICPA without changing all agent code?",
            code: `# litellm_config.yaml
"""
model_list:
  - model_name: icpa-primary
    litellm_params:
      model: ollama/llama3.2
      api_base: http://ollama:11434

  - model_name: icpa-fallback
    litellm_params:
      model: anthropic/claude-haiku-4-5
      api_key: os.environ/ANTHROPIC_KEY

router_settings:
  routing_strategy: latency-based
  fallback_models: [icpa-fallback]
"""

# ICPA code change: ONE line change (endpoint URL)
from openai import AsyncOpenAI
llm_client = AsyncOpenAI(
    base_url="http://litellm-gateway:4000",  # single endpoint
    api_key="sk-icpa-internal"
)`,
            tip: "'Frame: currently ICPA is locked to Ollama. If Ollama goes down, entire system fails. LiteLLM adds resilience with zero agent code changes.'"
          },
          {
            id: 43, cat: "missing", difficulty: "hard",
            title: "🆕 Agentic RAG — Self-RAG / CRAG Patterns",
            icpa: "Beyond basic RAG: Self-RAG adds retrieval necessity check. CRAG adds web fallback when vector DB confidence is low.",
            pattern: "Retrieval grading + conditional retrieval + web fallback",
            interview_angle: "What's the difference between Self-RAG, CRAG, and Adaptive RAG?",
            code: `import asyncio

class CRAGPipeline:
    """Corrective RAG (CRAG) — grades retrieved documents."""

    async def grade_document(self, query, doc):
        prompt = f"""Grade this retrieved document for relevance.
Query: {query}
Document: {doc[:500]}...
Output: CORRECT, INCORRECT, or AMBIGUOUS"""
        return (await self.grader.ainvoke(prompt)).content.strip()

    async def run(self, query):
        docs = await self.retriever.ainvoke(query)
        grades = await asyncio.gather(
            *[self.grade_document(query, d.page_content) for d in docs]
        )

        correct_docs = [d for d, g in zip(docs, grades) if g == "CORRECT"]
        incorrect_count = sum(1 for g in grades if g == "INCORRECT")

        if len(correct_docs) >= 3:
            context = "\\n".join(d.page_content for d in correct_docs[:5])
        elif incorrect_count > len(docs) * 0.6:
            # Majority graded incorrect → web fallback
            web_results = await self.web_searcher.ainvoke(query)
            context = web_results
        else:
            # Mixed: use correct + web supplement
            web_results = await self.web_searcher.ainvoke(query)
            context = "\\n".join(d.page_content for d in correct_docs) + "\\n" + web_results

        return {"context": context}`,
            tip: "'Self-RAG fits ICPA for routine queries. CRAG fits ICPA for new policy types introduced after our vector DB was last updated.'"
          },
          {
            id: 44, cat: "missing", difficulty: "medium",
            title: "🆕 QA Testing for LLM Systems — RAGAS Regression Suite",
            icpa: "Critical missing piece: automated CI/CD quality gate using RAGAS. Catches faithfulness regressions before deployment.",
            pattern: "Golden dataset + RAGAS metrics as CI assertions",
            interview_angle: "How do you prevent LLM regression in CI/CD? What's your golden dataset strategy?",
            code: `import pytest
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_recall

ICPA_GOLDEN_CASES = [
    {
        "question": "Wie hoch ist die Deckung bei DST-Totalschaden?",
        "answer": "Die Deckung beträgt bis zu 50.000 EUR...",
        "contexts": ["§12 Allgemeine Bedingungen..."],
        "ground_truth": "Deckung bis 50.000 EUR gemäß §12 AVB"
    },
    # ... 99 more cases
]

@pytest.mark.asyncio
async def test_icpa_ragas_quality_gate(icpa_pipeline, llm, embeddings):
    """CI quality gate: fail deployment if RAGAS metrics degrade."""
    results = []
    for case in ICPA_GOLDEN_CASES:
        output = await icpa_pipeline.run(case["question"])
        results.append({**output, "ground_truth": case["ground_truth"]})

    scores = evaluate(results, metrics=[faithfulness, answer_relevancy, context_recall])

    assert scores["faithfulness"] >= 0.88, f"Faithfulness {scores['faithfulness']:.3f} below threshold"
    assert scores["answer_relevancy"] >= 0.80
    assert scores["context_recall"] >= 0.75
    print(f"✅ RAGAS Gate Passed: {scores}")`,
            tip: "'This is the missing piece. You measured 72%→91% faithfulness but now you need to PROTECT that 91%. RAGAS in CI is exactly how.'"
          },
          {
            id: 45, cat: "missing", difficulty: "hard",
            title: "🆕 Circuit Breaker Pattern for LLM Services",
            icpa: "When Cohere Rerank service goes down, ICPA should fall back to cross-encoder reranking, not cascade-fail all 9 agents.",
            pattern: "CLOSED → OPEN → HALF-OPEN state machine",
            interview_angle: "What's the difference between retry and circuit breaker? Draw the state machine.",
            code: `import time
from enum import Enum
from dataclasses import dataclass, field

class CircuitState(Enum):
    CLOSED = "closed"        # normal operation
    OPEN = "open"            # failures exceeded threshold
    HALF_OPEN = "half_open"  # testing if service recovered

@dataclass
class CircuitBreaker:
    name: str
    fail_threshold: int = 5
    reset_timeout: float = 60.0
    success_threshold: int = 2

    state: CircuitState = field(default=CircuitState.CLOSED, init=False)
    failure_count: int = field(default=0, init=False)
    last_failure_time: float = field(default=0.0, init=False)

    async def call(self, func, *args, fallback=None, **kwargs):
        if self.state == CircuitState.OPEN:
            if time.time() - self.last_failure_time > self.reset_timeout:
                self.state = CircuitState.HALF_OPEN
            else:
                if fallback:
                    return await fallback(*args, **kwargs)
                raise Exception(f"Circuit OPEN for {self.name}")

        try:
            result = await func(*args, **kwargs)
            self._on_success()
            return result
        except Exception:
            self._on_failure()
            if fallback:
                return await fallback(*args, **kwargs)
            raise

    def _on_success(self):
        if self.state == CircuitState.HALF_OPEN:
            self.state = CircuitState.CLOSED
            self.failure_count = 0

    def _on_failure(self):
        self.failure_count += 1
        self.last_failure_time = time.time()
        if self.failure_count >= self.fail_threshold:
            self.state = CircuitState.OPEN

cohere_breaker = CircuitBreaker("cohere-rerank", fail_threshold=5)

async def icpa_rerank_with_fallback(query, docs):
    return await cohere_breaker.call(
        cohere_rerank_api, query, docs,
        fallback=cross_encoder_rerank
    )`,
            tip: "'In ICPA, Cohere goes down maybe twice a year. Without circuit breaker, all 9 agents wait for timeout (30s), queue fills. With circuit breaker: fail fast, serve from cross-encoder, recover silently.'"
          },
          {
            id: 46, cat: "missing", difficulty: "medium",
            title: "🆕 GraphRAG / Knowledge Graph Enhancement",
            icpa: "For complex ICPA cases spanning multiple policy sections, GraphRAG can link related policy clauses via entity relationships.",
            pattern: "Entity extraction → graph construction → graph-traversal retrieval",
            interview_angle: "When does flat vector RAG fail that GraphRAG solves?",
            code: `import networkx as nx

class ICPAKnowledgeGraph:
    def __init__(self):
        self.graph = nx.DiGraph()

    def add_policy_entity(self, entity, entity_type, metadata):
        self.graph.add_node(entity, type=entity_type, **metadata)

    def add_relationship(self, from_entity, relation, to_entity):
        self.graph.add_edge(from_entity, to_entity, relation=relation)

    def get_related_clauses(self, query_entities, max_hops=2):
        """Find all policy clauses related to query entities within N hops."""
        related = set()
        for entity in query_entities:
            if entity not in self.graph:
                continue
            for node in nx.single_source_shortest_path_length(self.graph, entity, cutoff=max_hops):
                if self.graph.nodes[node].get("type") == "policy_clause":
                    related.add(node)
        return list(related)

# Build knowledge graph
icpa_kg = ICPAKnowledgeGraph()
icpa_kg.add_policy_entity("§12_Totalschaden", "policy_clause", {"section": "12"})
icpa_kg.add_policy_entity("DST", "case_type", {"sla_hours": 2})
icpa_kg.add_relationship("DST", "governed_by", "§12_Totalschaden")`,
            tip: "'GraphRAG is a future ICPA v3 candidate. Current ICPA: flat vector RAG works for 91% of cases. The 9% failures are multi-clause interaction questions — exactly what GraphRAG solves.'"
          },
          {
            id: 47, cat: "missing", difficulty: "medium",
            title: "🆕 Async Context Manager — Database Connection Pooling",
            icpa: "ICPA's FastAPI uses async SQLAlchemy for PostgreSQL. Connection pooling prevents session leaks across async requests.",
            pattern: "Async context manager + connection pool lifecycle",
            interview_angle: "What's the difference between async context manager and regular one?",
            code: `from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from contextlib import asynccontextmanager
from fastapi import FastAPI

Base = declarative_base()
DATABASE_URL = "postgresql+asyncpg://icpa:password@postgres-service:5432/icpa_db"

engine = create_async_engine(
    DATABASE_URL,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,    # health check before use
)

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

@asynccontextmanager
async def get_db_session():
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

@asynccontextmanager
async def lifespan(app):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()

app = FastAPI(lifespan=lifespan)`,
            tip: "'pool_pre_ping=True is critical in EKS — Kubernetes network policies can silently drop idle DB connections. Pre-ping detects dead connections before query execution.'"
          },
          {
            id: 48, cat: "missing", difficulty: "medium",
            title: "🆕 Dependency Injection in FastAPI — Service Layer Pattern",
            icpa: "ICPA uses FastAPI DI to inject: LLM clients, ChromaDB collection, Redis client into route handlers without global state.",
            pattern: "Depends() + lifespan + singleton factory",
            interview_angle: "Why dependency injection over global variables in FastAPI?",
            code: `from fastapi import FastAPI, Depends
from contextlib import asynccontextmanager
import chromadb
import redis.asyncio as aioredis

class ICPAServices:
    def __init__(self):
        self.chroma = None
        self.redis = None
        self.collection = None

services = ICPAServices()

@asynccontextmanager
async def lifespan(app):
    services.chroma = chromadb.AsyncHttpClient(host="chromadb-service")
    services.collection = await services.chroma.get_collection("icpa_policies")
    services.redis = aioredis.from_url("redis://redis-service:6379")
    print("✅ ICPA Services initialized")
    yield
    await services.redis.close()

app = FastAPI(lifespan=lifespan)

def get_chroma_collection():
    return services.collection

async def get_redis():
    return services.redis

@app.post("/v1/process")
async def process_email(
    request: ICPARequest,
    collection=Depends(get_chroma_collection),
    redis=Depends(get_redis),
):
    docs = await collection.query(query_texts=[request.email_content])
    return {"docs": docs}

# Testing: override dependencies
app.dependency_overrides[get_redis] = lambda: MockRedis()`,
            tip: "'DI vs global state: global state = untestable, DI = inject mocks in tests. ICPA has 100% test coverage of route handlers by overriding dependencies with fixtures.'"
          },
          {
            id: 49, cat: "missing", difficulty: "medium",
            title: "🆕 NER Integration in ICPA Pipeline",
            icpa: "Named Entity Recognition extracts case IDs, policy numbers, dates from emails BEFORE sending to ChromaDB — enriches metadata for filtered retrieval.",
            pattern: "spaCy/transformers NER → metadata extraction → filtered vector search",
            interview_angle: "How does NER improve RAG retrieval? Give a concrete ICPA example.",
            code: `import spacy
from spacy.language import Language
import re

nlp = spacy.blank("de")

@Language.component("insurance_ner")
def insurance_ner_component(doc):
    new_ents = list(doc.ents)
    case_pattern = re.compile(r'\\b(DST|MIN|MDR|AER|MER)-\\d{4}-\\d{6}\\b')
    for match in case_pattern.finditer(doc.text):
        span = doc.char_span(match.start(), match.end(), label="ICPA_CASE_ID")
        if span:
            new_ents.append(span)
    doc.ents = new_ents
    return doc

nlp.add_pipe("insurance_ner", last=True)

def extract_icpa_entities(email_text):
    doc = nlp(email_text)
    entities = {"case_ids": [], "case_type": None}
    for ent in doc.ents:
        if ent.label_ == "ICPA_CASE_ID":
            entities["case_ids"].append(ent.text)
            entities["case_type"] = ent.text.split("-")[0]
    return entities

def ner_enhanced_retrieval(email, collection):
    entities = extract_icpa_entities(email)
    where_filter = {}
    if entities["case_type"]:
        where_filter["case_type"] = entities["case_type"]
    return collection.query(
        query_texts=[email],
        where=where_filter if where_filter else None,
        n_results=20
    )`,
            tip: "'NER-enhanced retrieval reduced false positives by 28% in ICPA. Without NER, an AER email retrieved DST Totalschaden chunks (same keywords, different case type).'"
          },
          {
            id: 50, cat: "missing", difficulty: "hard",
            title: "🆕 Terraform — ICPA Infrastructure as Code",
            icpa: "ICPA EKS cluster, RDS PostgreSQL, ElastiCache Redis, ECR, and IAM roles are all Terraform-managed. Reduced provisioning from 3 days to 15 minutes.",
            pattern: "Terraform modules + remote state + EKS NodeGroups",
            interview_angle: "How do you manage secrets in Terraform? What's the difference between Terraform state locking and Argo CD?",
            code: `# main.tf — ICPA EKS Cluster
terraform {
  required_providers {
    aws = { source = "hashicorp/aws", version = "~> 5.0" }
  }
  backend "s3" {
    bucket         = "icpa-terraform-state"
    key            = "prod/icpa.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "icpa-terraform-locks"  # state locking
    encrypt        = true
  }
}

module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  name    = "icpa-vpc"
  cidr    = "10.0.0.0/16"
  azs             = ["eu-central-1a", "eu-central-1b", "eu-central-1c"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24", "10.0.3.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24", "10.0.103.0/24"]
  enable_nat_gateway = true
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  cluster_name    = "icpa-prod"
  cluster_version = "1.29"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  eks_managed_node_groups = {
    cpu_workers = {
      instance_types = ["m6i.xlarge"]
      min_size = 3; max_size = 10; desired_size = 3
    }
    gpu_workers = {
      instance_types = ["g4dn.xlarge"]
      min_size = 1; max_size = 4; desired_size = 1
      labels = { "gpu" = "true" }
      taints = [{ key = "nvidia.com/gpu"; value = "true"; effect = "NO_SCHEDULE" }]
    }
  }
}

resource "aws_db_instance" "icpa_postgres" {
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.medium"
  db_name              = "icpa_checkpoints"
  allocated_storage    = 100
  storage_encrypted    = true
  multi_az             = true
  deletion_protection  = true
}`,
            tip: "'DynamoDB locking prevents concurrent Terraform runs from corrupting state. ICPA used to have manual EKS setup taking 3 days; Terraform brings it to 15 minutes for disaster recovery.'"
          },
        ];

        const SUMMARY_STATS = {
          total: questions.length,
          byCategory: {
            dsa: questions.filter(q => q.cat === "dsa").length,
            rag: questions.filter(q => q.cat === "rag").length,
            llm: questions.filter(q => q.cat === "llm").length,
            backend: questions.filter(q => q.cat === "backend").length,
            devops: questions.filter(q => q.cat === "devops").length,
            sysdesign: questions.filter(q => q.cat === "sysdesign").length,
            missing: questions.filter(q => q.cat === "missing").length,
          }
        };

        function App() {
          const [activeCategory, setActiveCategory] = useState("all");
          const [activeDifficulty, setActiveDifficulty] = useState("all");
          const [search, setSearch] = useState("");
          const [openId, setOpenId] = useState(null);
          const [showCode, setShowCode] = useState({});
          const [showTip, setShowTip] = useState({});

          const filtered = useMemo(() => {
            return questions.filter(q => {
              if (activeCategory !== "all" && q.cat !== activeCategory) return false;
              if (activeDifficulty !== "all" && q.difficulty !== activeDifficulty) return false;
              if (search) {
                const s = search.toLowerCase();
                return q.title.toLowerCase().includes(s) ||
                       q.icpa.toLowerCase().includes(s) ||
                       q.pattern.toLowerCase().includes(s);
              }
              return true;
            });
          }, [activeCategory, activeDifficulty, search]);

          const toggleCode = (id) => setShowCode(p => ({ ...p, [id]: !p[id] }));
          const toggleTip = (id) => setShowTip(p => ({ ...p, [id]: !p[id] }));

          return (
            <div style={{
              background: BG,
              minHeight: "100vh",
              fontFamily: "'Inter', system-ui, sans-serif",
              color: TEXT,
            }}>
              {/* Header */}
              <div style={{
                background: `linear-gradient(135deg, #0D1B2A 0%, #1A0A2E 50%, #0A1628 100%)`,
                borderBottom: `1px solid ${BORDER}`,
                padding: "32px 24px 24px",
              }}>
                <div style={{ maxWidth: 1100, margin: "0 auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                    <span style={{
                      background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT2})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      fontSize: 28, fontWeight: 800, letterSpacing: "-0.5px"
                    }}>
                      ICPA Interview Mastery
                    </span>
                  </div>
                  <p style={{ color: MUTED, fontSize: 14, marginBottom: 24 }}>
                    {SUMMARY_STATS.total} questions · All mapped to your ICPA / VOIS production experience · {SUMMARY_STATS.byCategory.missing} new gap-filler concepts
                  </p>

                  {/* Stats bar */}
                  <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 24 }}>
                    {[
                      { label: "DSA", count: SUMMARY_STATS.byCategory.dsa, color: "#3B82F6" },
                      { label: "RAG", count: SUMMARY_STATS.byCategory.rag, color: "#10B981" },
                      { label: "LLM/Agents", count: SUMMARY_STATS.byCategory.llm, color: ACCENT2 },
                      { label: "Backend", count: SUMMARY_STATS.byCategory.backend, color: "#F59E0B" },
                      { label: "DevOps", count: SUMMARY_STATS.byCategory.devops, color: "#EF4444" },
                      { label: "System Design", count: SUMMARY_STATS.byCategory.sysdesign, color: "#EC4899" },
                      { label: "🆕 Gaps", count: SUMMARY_STATS.byCategory.missing, color: ACCENT },
                    ].map(s => (
                      <div key={s.label} style={{
                        background: SURFACE2,
                        border: `1px solid ${BORDER}`,
                        borderRadius: 8,
                        padding: "6px 12px",
                        display: "flex", alignItems: "center", gap: 6
                      }}>
                        <span style={{ color: s.color, fontWeight: 700, fontSize: 16 }}>{s.count}</span>
                        <span style={{ color: MUTED, fontSize: 12 }}>{s.label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Search */}
                  <input
                    placeholder="Search questions, patterns, or ICPA components..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{
                      width: "100%", maxWidth: 500,
                      background: SURFACE2,
                      border: `1px solid ${BORDER}`,
                      borderRadius: 8,
                      padding: "10px 16px",
                      color: TEXT,
                      fontSize: 14,
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>
              </div>

              <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>
                {/* Category Filter */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
                      style={{
                        background: activeCategory === cat.id
                          ? `linear-gradient(135deg, ${ACCENT}22, ${ACCENT2}22)`
                          : SURFACE,
                        border: `1px solid ${activeCategory === cat.id ? ACCENT : BORDER}`,
                        borderRadius: 20,
                        padding: "6px 14px",
                        color: activeCategory === cat.id ? ACCENT : MUTED,
                        fontSize: 13, fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.15s"
                      }}>
                      {cat.icon} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Difficulty Filter */}
                <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
                  {["all", "easy", "medium", "hard"].map(d => (
                    <button key={d} onClick={() => setActiveDifficulty(d)}
                      style={{
                        background: activeDifficulty === d ? SURFACE2 : "transparent",
                        border: `1px solid ${activeDifficulty === d ? BORDER : "transparent"}`,
                        borderRadius: 6,
                        padding: "4px 10px",
                        color: d === "all" ? TEXT :
                               d === "easy" ? SUCCESS :
                               d === "medium" ? WARN : DANGER,
                        fontSize: 12, fontWeight: 600,
                        cursor: "pointer"
                      }}>
                      {d === "all" ? "All Levels" : d.charAt(0).toUpperCase() + d.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Results count */}
                <p style={{ color: MUTED, fontSize: 13, marginBottom: 16 }}>
                  Showing {filtered.length} of {questions.length} questions
                </p>

                {/* Question Cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {filtered.map(q => {
                    const isOpen = openId === q.id;
                    const diffColor = DIFFICULTY[q.difficulty].color;
                    const catIcon = CATEGORIES.find(c => c.id === q.cat)?.icon || "•";

                    return (
                      <div key={q.id} style={{
                        background: SURFACE,
                        border: `1px solid ${isOpen ? ACCENT + "44" : BORDER}`,
                        borderRadius: 12,
                        overflow: "hidden",
                        transition: "border-color 0.2s",
                      }}>
                        {/* Card Header */}
                        <div
                          onClick={() => setOpenId(isOpen ? null : q.id)}
                          style={{
                            padding: "16px 20px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 16,
                          }}>
                          {/* Number */}
                          <span style={{
                            minWidth: 32, height: 32,
                            background: SURFACE2,
                            borderRadius: 8,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 12, fontWeight: 700,
                            color: MUTED, flexShrink: 0
                          }}>
                            {q.id}
                          </span>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
                              <span style={{ fontSize: 15, fontWeight: 700, color: TEXT }}>
                                {q.title}
                              </span>
                            </div>
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                              <span style={{
                                background: diffColor + "22",
                                border: `1px solid ${diffColor}44`,
                                color: diffColor,
                                borderRadius: 4, padding: "2px 8px",
                                fontSize: 11, fontWeight: 600
                              }}>
                                {DIFFICULTY[q.difficulty].label}
                              </span>
                              <span style={{
                                background: SURFACE2,
                                color: MUTED,
                                borderRadius: 4, padding: "2px 8px",
                                fontSize: 11
                              }}>
                                {catIcon} {CATEGORIES.find(c => c.id === q.cat)?.label}
                              </span>
                              <span style={{
                                color: MUTED, fontSize: 11,
                                fontFamily: "monospace",
                                background: SURFACE2,
                                padding: "2px 8px", borderRadius: 4
                              }}>
                                {q.pattern}
                              </span>
                            </div>
                          </div>

                          <span style={{
                            color: isOpen ? ACCENT : MUTED,
                            fontSize: 18, flexShrink: 0,
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s"
                          }}>▾</span>
                        </div>

                        {/* Expanded Content */}
                        {isOpen && (
                          <div style={{ borderTop: `1px solid ${BORDER}`, padding: "0 20px 20px" }}>

                            {/* ICPA Mapping */}
                            <div style={{
                              background: `linear-gradient(135deg, ${ACCENT2}11, ${ACCENT}08)`,
                              border: `1px solid ${ACCENT2}33`,
                              borderRadius: 10,
                              padding: "12px 16px",
                              marginTop: 16, marginBottom: 12
                            }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT2, marginBottom: 6, letterSpacing: "0.05em" }}>
                                🔗 ICPA / VOIS PROJECT MAPPING
                              </div>
                              <p style={{ color: TEXT, fontSize: 13, lineHeight: 1.6, margin: 0 }}>
                                {q.icpa}
                              </p>
                            </div>

                            {/* Interview Angle */}
                            <div style={{
                              background: SURFACE2,
                              border: `1px solid ${BORDER}`,
                              borderRadius: 10,
                              padding: "12px 16px",
                              marginBottom: 12
                            }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: WARN, marginBottom: 6, letterSpacing: "0.05em" }}>
                                🎯 LIKELY INTERVIEW QUESTION
                              </div>
                              <p style={{ color: TEXT, fontSize: 13, lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                                "{q.interview_angle}"
                              </p>
                            </div>

                            {/* Code Toggle */}
                            <button
                              onClick={() => toggleCode(q.id)}
                              style={{
                                background: showCode[q.id] ? SURFACE2 : `${ACCENT}11`,
                                border: `1px solid ${showCode[q.id] ? BORDER : ACCENT + "44"}`,
                                borderRadius: 8,
                                padding: "8px 16px",
                                color: showCode[q.id] ? MUTED : ACCENT,
                                fontSize: 13, fontWeight: 600,
                                cursor: "pointer",
                                marginRight: 8,
                                marginBottom: 8
                              }}>
                              {showCode[q.id] ? "▾ Hide Code" : "▸ Show Code"}
                            </button>

                            <button
                              onClick={() => toggleTip(q.id)}
                              style={{
                                background: showTip[q.id] ? SURFACE2 : `${SUCCESS}11`,
                                border: `1px solid ${showTip[q.id] ? BORDER : SUCCESS + "44"}`,
                                borderRadius: 8,
                                padding: "8px 16px",
                                color: showTip[q.id] ? MUTED : SUCCESS,
                                fontSize: 13, fontWeight: 600,
                                cursor: "pointer",
                                marginBottom: 8
                              }}>
                              {showTip[q.id] ? "▾ Hide Answer Script" : "▸ Show Answer Script"}
                            </button>

                            {showCode[q.id] && (
                              <pre style={{
                                background: "#0D1117",
                                border: `1px solid ${BORDER}`,
                                borderRadius: 10,
                                padding: "16px",
                                overflowX: "auto",
                                fontSize: 12,
                                lineHeight: 1.65,
                                color: "#A5F3FC",
                                margin: "8px 0",
                                fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                                whiteSpace: "pre-wrap",
                                wordBreak: "break-word"
                              }}>
                                {q.code}
                              </pre>
                            )}

                            {showTip[q.id] && (
                              <div style={{
                                background: `${SUCCESS}11`,
                                border: `1px solid ${SUCCESS}33`,
                                borderRadius: 10,
                                padding: "12px 16px",
                                marginTop: 8
                              }}>
                                <div style={{ fontSize: 11, fontWeight: 700, color: SUCCESS, marginBottom: 6, letterSpacing: "0.05em" }}>
                                  💬 WORD-FOR-WORD ANSWER SCRIPT
                                </div>
                                <p style={{ color: TEXT, fontSize: 13, lineHeight: 1.7, margin: 0 }}>
                                  {q.tip}
                                </p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {filtered.length === 0 && (
                  <div style={{ textAlign: "center", padding: "60px 20px", color: MUTED }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
                    <p>No questions match your filters.</p>
                  </div>
                )}

                {/* Footer */}
                <div style={{
                  marginTop: 40, paddingTop: 24,
                  borderTop: `1px solid ${BORDER}`,
                  textAlign: "center", color: MUTED, fontSize: 12
                }}>
                  <p>Chandan Sahoo · Senior AI Backend Engineer · ICPA @ VOIS</p>
                  <p style={{ marginTop: 4 }}>
                    Key metric to lead with: RAG faithfulness 72%→91% (Cohere Rerank) ·
                    9-agent LangGraph StateGraph · AWS EKS + Argo CD GitOps ·
                    80% reduction in data prep effort · ~$15k/year savings
                  </p>
                </div>
              </div>
            </div>
          );
        }

        const root = ReactDOM.createRoot(document.getElementById('root'));
        root.render(<App />);
    </script>
</body>
</html>
