import { useState } from "react";

const SECTIONS = [
  {
    id: "agentic",
    label: "Agentic Flows",
    icon: "🤖",
    color: "#00d4ff",
    questions: [
      {
        q: "Counter, Iteration, Guardrails & Production-Grade Agentic Flows (LangChain + LangGraph)",
        tags: ["LangGraph", "NeMo", "Production"],
        answer: `
**Counter & Iteration in LangGraph:**
In LangGraph, each node in the graph is a step. You maintain a \`state\` dict passed between nodes. A counter tracks how many times a loop has run — critical for preventing infinite agent loops.

\`\`\`python
from typing import TypedDict
from langgraph.graph import StateGraph, END

class AgentState(TypedDict):
    messages: list
    iteration_count: int
    max_iterations: int

def should_continue(state: AgentState):
    if state["iteration_count"] >= state["max_iterations"]:
        return END  # Hard stop
    return "agent_node"

def agent_node(state: AgentState):
    # Your LLM call here
    return {"iteration_count": state["iteration_count"] + 1}
\`\`\`

**Why Guardrails?**
In my ICPA project, I used **NeMo Guardrails** on the LangGraph multi-agent system to:
1. **Input rail** — Block PII leakage (GDPR) before it hits the LLM
2. **Output rail** — Validate classification output format (must be one of DST/MIN/MDR/AER/MER)
3. **Topical rail** — Prevent the agent from going off-topic on German insurance domain
4. **Loop guard** — If iteration > 5 with no resolution, escalate to human review

**Production Agentic Flow (ICPA Pattern):**
\`\`\`
Email In → spaCy PII Strip → TF-IDF Fast Path (60%)
                           ↓ (miss)
                    ChromaDB RAG (35%)
                           ↓ (miss)
              LangGraph Multi-Agent (5%)
              ├── ClassifierAgent
              ├── ValidationAgent
              └── FallbackAgent → Human Escalation
\`\`\`

**Key production concerns:**
- Redis for state persistence across agent steps
- LangSmith for observability (trace every agent call)
- Timeout per node (avoid hanging agents)
- Dead letter queue for failed classifications
        `,
        practice: "How would you implement a retry mechanism with exponential backoff in a LangGraph node that calls an external API?",
        practiceAnswer: `Add a retry counter to state. In the node, catch exceptions and increment. Use \`time.sleep(2**retry)\`. Route to END if retry > 3. Always log to LangSmith with trace_id.`
      },
      {
        q: "Difference Between LangChain and LangGraph",
        tags: ["LangChain", "LangGraph", "Architecture"],
        answer: `
| Feature | LangChain | LangGraph |
|---|---|---|
| **Mental model** | Linear chain / pipeline | Directed graph (nodes + edges) |
| **Flow control** | Sequential or simple branching | Conditional edges, cycles, loops |
| **State** | Passed implicitly | Explicit TypedDict state |
| **Use case** | Simple RAG, single-agent | Multi-agent, workflows with loops |
| **Debugging** | Callbacks | LangSmith traces per node |
| **Best for** | Prototyping | Production agentic systems |

**Simple analogy:** LangChain is a conveyor belt. LangGraph is a factory floor with workers who can pass work back to each other.

**In ICPA:** I used LangChain for the RAG pipeline (retriever → prompt → LLM → output). I used LangGraph for the multi-agent orchestration where the ValidationAgent could send work BACK to the ClassifierAgent if confidence < 0.7.

\`\`\`python
# LangChain (linear)
chain = retriever | prompt | llm | output_parser

# LangGraph (graph with conditional routing)
graph.add_conditional_edges(
    "classifier",
    lambda s: "validator" if s["confidence"] > 0.7 else "reprocess"
)
\`\`\`
        `,
        practice: "When would you choose LangChain over LangGraph for a production system?",
        practiceAnswer: `LangChain for: simple single-pass RAG, document Q&A, straightforward summarization pipelines. LangGraph for: multi-step agents that need to loop, systems where agent A's output feeds back to agent B, stateful workflows, anything needing human-in-the-loop.`
      },
      {
        q: "Conversational Memory in LangGraph",
        tags: ["Memory", "Redis", "LangGraph"],
        answer: `
**Types of memory in LangGraph:**

1. **In-graph state** (short-term) — \`messages\` list in TypedDict, lives for one session
2. **Checkpointer** (session persistence) — SQLite or Redis-backed, survives restarts
3. **External memory** (long-term) — Vector DB (ChromaDB) for semantic retrieval of past context

\`\`\`python
from langgraph.checkpoint.redis import RedisSaver

# In ICPA, Redis checkpoint for session state
checkpointer = RedisSaver.from_conn_string("redis://localhost:6379")

graph = StateGraph(AgentState)
# ... add nodes/edges ...
app = graph.compile(checkpointer=checkpointer)

# Each conversation gets a thread_id
config = {"configurable": {"thread_id": "claim-session-42"}}
result = app.invoke({"messages": [...]}, config=config)
\`\`\`

**Memory strategies:**
- **Window buffer** — Keep last N messages (cheap, fast)
- **Summary memory** — Summarize old messages via LLM (expensive but compact)
- **Entity memory** — Track key entities across turns (claim_id, case_type)
- **Vector memory** — Embed and store past turns, retrieve by similarity (used in ICPA for recurring claim patterns)

**What I used:** Redis checkpointer + entity memory to track claim_id, detected case_type, and confidence score across multi-turn interactions with the insurance ops team.
        `,
        practice: "What happens to conversational memory if the Redis pod crashes mid-session?",
        practiceAnswer: `With Redis RDB/AOF persistence configured, the last checkpoint is recovered on restart. Without persistence, the session state is lost. In ICPA, I configured Redis with AOF (append-only file) + a fallback to rebuild state from the email itself if checkpoint is missing.`
      },
      {
        q: "How Do You Define Which Agent to Call?",
        tags: ["Routing", "Supervisor", "Multi-Agent"],
        answer: `
**Three patterns for agent routing:**

**1. Conditional Edges (LangGraph native):**
\`\`\`python
def route_classifier(state):
    if state["confidence"] >= 0.85:
        return "formatter"  # high confidence → format & send
    elif state["confidence"] >= 0.60:
        return "validator"  # medium → validate
    else:
        return "llm_fallback"  # low → LLM

graph.add_conditional_edges("classifier", route_classifier)
\`\`\`

**2. Supervisor Agent (LLM decides):**
\`\`\`python
# Supervisor LLM reads current state and outputs next_agent
supervisor_prompt = """
Given the current state: {state}
Available agents: [classifier, validator, escalation, formatter]
Which agent should handle this next? Return ONLY the agent name.
"""
\`\`\`

**3. Intent-based routing (what I use in ICPA):**
- TF-IDF score → if high, skip agents, go straight to formatter
- Keyword match (e.g., "Schadensfall" → DST agent)
- LLM confidence threshold → determines LangGraph path

**In ICPA specifically:**
The three-tier cascade IS the routing logic. The LangGraph multi-agent layer only activates when both TF-IDF and RAG fail. Within LangGraph, a lightweight intent classifier (single LLM call) routes to one of 5 case-type specialist nodes.
        `,
        practice: "What's the risk of using an LLM as a supervisor agent for routing in production?",
        practiceAnswer: `Latency (adds 200-500ms per routing decision), cost (every routing step costs tokens), and non-determinism (LLM may route inconsistently). Mitigation: Use rule-based routing as primary, LLM supervisor only as fallback; cache routing decisions for similar inputs.`
      },
      {
        q: "GitHub Push → Review → Commit → JIRA Agent Architecture",
        tags: ["Agentic", "CI/CD", "Multi-Agent"],
        answer: `
**Architecture of the GitHub Auto-Review Agent:**

\`\`\`
GitHub Push Event (Webhook)
        ↓
[Orchestrator Agent - LangGraph]
        ↓
   ┌────┴──────────────────────┐
   ↓                           ↓
[Code Review Agent]    [Security Scan Agent]
- LLM reviews diff     - Bandit / Semgrep scan
- Style, logic bugs    - OWASP top 10 check
- Suggests fixes       - Dependency CVE check
   ↓                           ↓
   └────────────┬──────────────┘
                ↓
        [Decision Node]
        /           \\
   PASS              FAIL
     ↓                 ↓
[Auto-Commit]    [JIRA Creator Agent]
- Apply LLM      - Create ticket
  suggested      - Assign to team
  fixes          - Severity label
- Push to PR     - Link to commit
\`\`\`

\`\`\`python
# Simplified LangGraph for this
class CIState(TypedDict):
    diff: str
    review_result: dict
    security_issues: list
    jira_tickets: list

def security_agent(state):
    issues = run_bandit_scan(state["diff"])
    return {"security_issues": issues}

def jira_agent(state):
    for issue in state["security_issues"]:
        create_jira_ticket(
            project=map_severity_to_team(issue["severity"]),
            summary=issue["description"],
            labels=["auto-generated", "security"]
        )

def route_after_review(state):
    if state["security_issues"]:
        return "jira_agent"
    return "auto_commit"
\`\`\`

**Tools per agent:**
- Code Review Agent: \`github.get_diff()\`, LLM call
- Security Agent: \`subprocess.run(['bandit', '-r', ...])\`, \`safety check\`
- JIRA Agent: JIRA REST API (\`POST /rest/api/3/issue\`)
- Auto-Commit: GitHub API \`create_commit\`
        `,
        practice: "How would you prevent the auto-commit agent from committing breaking changes?",
        practiceAnswer: `Run a test suite (pytest) as a node before auto-commit. If tests fail, route to JIRA instead of auto-commit. Also: only allow auto-commit on non-main branches, require PR approval for main. Add a human-in-the-loop checkpoint for critical repos.`
      }
    ]
  },
  {
    id: "rag",
    label: "RAG & Retrieval",
    icon: "🔍",
    color: "#a78bfa",
    questions: [
      {
        q: "Parsing Retrieval Chunks — Strategies & Top-K",
        tags: ["RAG", "ChromaDB", "Chunking"],
        answer: `
**Chunk Parsing Strategies:**

| Strategy | Chunk Size | Use Case |
|---|---|---|
| Fixed-size | 256-512 tokens | Simple docs, uniform content |
| Sentence-based | 1-3 sentences | QA, precise retrieval |
| Paragraph-based | ~500 tokens | Reports, emails |
| **Semantic chunking** | Variable | Best for mixed content |
| Hierarchical | Parent + child | Complex docs, ICPA emails |

**In ICPA (German Insurance Emails):**
I used **paragraph-level chunking with overlap**:
\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,  # overlap preserves context across boundaries
    separators=["\\n\\n", "\\n", ".", " "]
)
\`\`\`

**Top-K Selection:**
- Start with **k=5**, evaluate recall@k
- In ICPA: k=3 worked best (emails are short, focused)
- For long documents: k=10 with re-ranking

**MMR (Maximal Marginal Relevance) — what I used:**
Avoids returning 5 near-identical chunks. Balances relevance AND diversity:
\`\`\`python
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 5, "fetch_k": 20, "lambda_mult": 0.6}
)
# lambda_mult: 1.0 = pure relevance, 0.0 = pure diversity
\`\`\`

**Result in ICPA:** MMR improved RAGAS faithfulness from **72% → 91%**, reduced LLM escalation from **40% → 12%**.

**Metadata filtering (also used in ICPA):**
\`\`\`python
retriever = vectorstore.as_retriever(
    search_kwargs={"filter": {"case_type": "DST"}, "k": 3}
)
\`\`\`
        `,
        practice: "What's the tradeoff between smaller vs larger chunk sizes in RAG?",
        practiceAnswer: `Small chunks (128 tokens): precise retrieval, lose context. Large chunks (1024 tokens): rich context, noisy retrieval, hit LLM token limits. Optimal for ICPA emails: 400-600 tokens with 10% overlap. Use hybrid: store small child chunks for retrieval, fetch parent chunk for LLM context.`
      },
      {
        q: "RAG Bug: Email Sending 10x Instead of Once — How to Solve?",
        tags: ["RAG", "Idempotency", "Production Bug"],
        answer: `
**Root Causes (in order of likelihood):**

**1. Missing idempotency key** — Most common
\`\`\`python
# BAD: No deduplication
def process_claim(email_id, classification):
    send_email(classification)  # called multiple times = multiple sends

# GOOD: Idempotency check
def process_claim(email_id, classification):
    key = f"processed:{email_id}"
    if redis_client.exists(key):
        logger.info(f"Already processed {email_id}, skipping")
        return
    send_email(classification)
    redis_client.setex(key, 86400, "done")  # 24hr TTL
\`\`\`

**2. LangGraph node re-execution** — Graph re-runs email send node
\`\`\`python
# Add sent flag to state
class AgentState(TypedDict):
    email_sent: bool  # guard flag

def email_node(state):
    if state["email_sent"]:
        return state  # no-op
    send_email(state["result"])
    return {"email_sent": True}
\`\`\`

**3. Retry logic without dedup** — Failed API call triggers retries → each retry sends email
\`\`\`python
# Use idempotency_key in email API call
email_client.send(
    to=recipient,
    subject=subject,
    idempotency_key=f"claim-{email_id}-{date}"  # Email provider deduplicates
)
\`\`\`

**4. Message queue re-delivery** — SQS/Kafka delivers message multiple times
- Set \`message deduplication ID\` on SQS FIFO queue
- Ensure \`visibility timeout\` > processing time

**5. ChromaDB duplicate chunks** — Same email indexed twice → RAG returns it twice → classified twice
\`\`\`python
# Check before inserting
if not vectorstore.get(where={"email_id": email_id})["ids"]:
    vectorstore.add_documents(chunks, ids=[email_id])
\`\`\`

**In ICPA, my actual fix:** Redis-based idempotency key + LangGraph \`email_sent\` state flag + SQS FIFO queue with deduplication ID.
        `,
        practice: "What's the difference between idempotency and exactly-once delivery?",
        practiceAnswer: `Idempotency: calling an operation N times has the same effect as calling it once (client-side guarantee via dedup keys). Exactly-once delivery: the message system guarantees the message is processed exactly once (infrastructure-level, harder). In practice, use idempotent operations + at-least-once delivery (SQS) = safe deduplication without needing exactly-once guarantees.`
      }
    ]
  },
  {
    id: "python",
    label: "Python Core",
    icon: "🐍",
    color: "#34d399",
    questions: [
      {
        q: "map(), filter(), reduce() in Python",
        tags: ["Functional", "Python", "Built-ins"],
        answer: `
**map(function, iterable)** — Transform each element
\`\`\`python
# Use case: normalize confidence scores in ICPA
scores = [0.85, 0.72, 0.91, 0.60]
normalized = list(map(lambda x: round(x, 2), scores))
# [0.85, 0.72, 0.91, 0.6]

# More Pythonic: list comprehension
normalized = [round(x, 2) for x in scores]
\`\`\`

**filter(function, iterable)** — Keep elements where function returns True
\`\`\`python
# Use case: filter low-confidence results for LLM escalation
low_conf = list(filter(lambda x: x < 0.70, scores))
# [0.72, 0.60]  ← these go to LangGraph

# Pythonic:
low_conf = [x for x in scores if x < 0.70]
\`\`\`

**reduce(function, iterable)** — Fold iterable to single value
\`\`\`python
from functools import reduce

# Use case: combine chunk scores into final RAG score
chunk_scores = [0.82, 0.79, 0.88]
max_score = reduce(lambda a, b: a if a > b else b, chunk_scores)
# 0.88

# But just use: max(chunk_scores) in practice
\`\`\`

**When to actually use each:**
| Function | Use when | Pythonic alt |
|---|---|---|
| map | Transform all elements | List comp |
| filter | Subset elements | List comp with if |
| reduce | Aggregate to one value | sum(), max(), min() |

**Real use in ICPA pipeline:**
\`\`\`python
# Chain all three
results = list(
    map(format_output,
        filter(lambda r: r["confidence"] > 0.7,
               map(classify_email, raw_emails)))
)
\`\`\`
        `,
        practice: "What's the difference between map() and a list comprehension in terms of performance?",
        practiceAnswer: `map() is lazy (returns iterator, no memory allocation until consumed). List comprehension is eager (creates list immediately). For large datasets: use map() if you only iterate once. Use list comp if you need the full list or need to index into it. In production AI pipelines, use map() with generators for streaming processing.`
      },
      {
        q: "Sync vs Async — Where to Use Each",
        tags: ["Async", "FastAPI", "Performance"],
        answer: `
**Sync:** Blocking. Each line waits for the previous to finish.
**Async:** Non-blocking. While waiting for I/O, run other tasks.

\`\`\`python
# SYNC — bad for multiple I/O calls
def process_3_claims(claims):
    for claim in claims:
        result = call_llm(claim)  # blocks for 2s each = 6s total
        send_email(result)        # blocks for 500ms each

# ASYNC — concurrent I/O
import asyncio

async def process_claim(claim):
    result = await call_llm_async(claim)   # yields control while waiting
    await send_email_async(result)

async def process_all(claims):
    await asyncio.gather(*[process_claim(c) for c in claims])
    # All 3 run concurrently → ~2.5s total
\`\`\`

**Decision framework:**
| Scenario | Use |
|---|---|
| File I/O, network calls, DB queries | async |
| CPU-heavy (ML inference, numpy) | sync (or multiprocessing) |
| FastAPI endpoint with LLM call | async def |
| Batch data processing | sync + ThreadPoolExecutor |
| LangGraph nodes calling APIs | async nodes |

**In ICPA FastAPI:**
\`\`\`python
# Email processing endpoint — async because:
# 1. Calls ChromaDB (network)
# 2. Calls Ollama (network)
# 3. Sends email notification (network)
@app.post("/classify")
async def classify_email(email: EmailRequest):
    # Can handle 100s of concurrent requests
    result = await pipeline.process(email)
    return result
\`\`\`

**Gotcha:** \`async def\` with \`requests\` library (sync) blocks the event loop! Use \`httpx\` or \`aiohttp\` instead.
        `,
        practice: "How do you run a CPU-bound ML inference function without blocking an async FastAPI server?",
        practiceAnswer: `Use run_in_executor() to offload to a thread/process pool: \`result = await loop.run_in_executor(executor, cpu_bound_fn, args)\`. Or use Celery/background tasks for long-running ML jobs. In ICPA, TF-IDF inference is fast enough (~5ms) to run sync, but Ollama calls go async.`
      },
      {
        q: "OOP: Encapsulation, Abstract Classes (ABC), Inheritance",
        tags: ["OOP", "Python", "Design Patterns"],
        answer: `
**Encapsulation** — Hide internal state, expose via methods
\`\`\`python
class EmailClassifier:
    def __init__(self):
        self._model = None          # private: single underscore = convention
        self.__api_key = "secret"   # name-mangled: __ = stronger private

    @property
    def model(self):
        return self._model          # controlled access

    def load_model(self, path):
        self._model = joblib.load(path)  # internal implementation hidden
\`\`\`

**Abstract Base Classes (ABC)** — Define interface, force subclass implementation
\`\`\`python
from abc import ABC, abstractmethod

class BaseClassifier(ABC):
    @abstractmethod
    def classify(self, text: str) -> dict:
        """Must be implemented by all classifiers"""
        pass

    @abstractmethod
    def get_confidence(self) -> float:
        pass

    def preprocess(self, text):        # shared concrete method
        return text.lower().strip()

class TFIDFClassifier(BaseClassifier):
    def classify(self, text):
        processed = self.preprocess(text)
        return {"label": self.model.predict([processed])[0]}

    def get_confidence(self):
        return self._confidence

# BaseClassifier()  ← TypeError! Can't instantiate abstract class
\`\`\`

**Inheritance** — Extend base class behavior
\`\`\`python
class RAGClassifier(TFIDFClassifier):
    def __init__(self, vectorstore):
        super().__init__()           # call parent __init__
        self.vectorstore = vectorstore

    def classify(self, text):
        # Override parent method
        chunks = self.vectorstore.similarity_search(text, k=3)
        return self._classify_with_context(text, chunks)

    def _classify_with_context(self, text, chunks):
        # New method only in RAGClassifier
        ...
\`\`\`

**In ICPA:** BaseClassifier → TFIDFClassifier (tier 1) → RAGClassifier (tier 2) → LLMClassifier (tier 3). All share the same \`classify()\` interface. The orchestrator doesn't care which tier it's calling.
        `,
        practice: "What's the difference between @abstractmethod and just raising NotImplementedError in the base class?",
        practiceAnswer: `@abstractmethod prevents instantiation of the base class itself at class creation time (TypeError on __init__). NotImplementedError only raises at call time. ABC is more explicit contract — the Python interpreter enforces it, not the developer. Use ABC for library code where others will subclass you; NotImplementedError for quick internal patterns.`
      },
      {
        q: "Operations on List, Dictionary, Set, Tuple",
        tags: ["Data Structures", "Python", "Complexity"],
        answer: `
**LIST** — Ordered, mutable, duplicates allowed
\`\`\`python
emails = ["claim_1.msg", "claim_2.msg"]
emails.append("claim_3.msg")     # O(1)
emails.insert(0, "urgent.msg")   # O(n) — shifts elements
emails.pop()                     # O(1) — from end
emails.pop(0)                    # O(n) — from front
emails.sort()                    # O(n log n)
"claim_1.msg" in emails          # O(n) — linear search
\`\`\`

**DICT** — Key-value, ordered (Py 3.7+), mutable
\`\`\`python
classification = {"email_id": "e001", "case_type": "DST", "confidence": 0.92}
classification["status"] = "processed"    # O(1) insert
classification.get("priority", "normal")  # O(1) safe get
del classification["status"]              # O(1)
"case_type" in classification             # O(1) — hash lookup
classification.items()                    # view of (k,v) pairs
\`\`\`

**SET** — Unordered, unique, mutable — BEST for membership tests
\`\`\`python
processed_ids = {"e001", "e002", "e003"}
processed_ids.add("e004")        # O(1)
processed_ids.discard("e001")    # O(1) — no error if missing
"e002" in processed_ids          # O(1) ← USE SETS for dedup!

# Set operations (useful for ICPA deduplication)
batch_a = {"e001", "e002", "e003"}
batch_b = {"e002", "e003", "e004"}
new_emails = batch_b - batch_a   # difference: {"e004"}
all_emails = batch_a | batch_b   # union: {"e001","e002","e003","e004"}
\`\`\`

**TUPLE** — Ordered, immutable, duplicates allowed
\`\`\`python
# Use for fixed data, function returns, dict keys
case_info = ("DST", 0.92, "processed")  # immutable record
case_type, confidence, status = case_info  # unpacking

# Tuples as dict keys (lists can't be)
cache = {("DST", "Schadensfall"): "claim_result"}
\`\`\`

**Quick Complexity Reference:**
| Op | List | Dict | Set | Tuple |
|---|---|---|---|---|
| Access | O(1) | O(1) | N/A | O(1) |
| Search | O(n) | O(1) | O(1) | O(n) |
| Insert | O(1) | O(1) | O(1) | N/A |
| Delete | O(n) | O(1) | O(1) | N/A |
        `,
        practice: "In ICPA, you need to track which email_ids have been processed to prevent duplicates. Which data structure and why?",
        practiceAnswer: `Set — O(1) membership test (\`email_id in processed_set\`). If persistence needed, back it with Redis SET (same O(1) semantics). Dict would work but wastes memory storing unnecessary values. List would be O(n) on every membership check — terrible for 10K+ emails.`
      }
    ]
  },
  {
    id: "dsa",
    label: "DSA & Coding",
    icon: "⚡",
    color: "#fb923c",
    questions: [
      {
        q: "Two Sum in Sorted Array → Return Indices",
        tags: ["Two Pointer", "Binary Search", "O(n)"],
        answer: `
**Input:** numbers = [2, 7, 11, 15], target = 9
**Output:** [0, 1] (2 + 7 = 9)

**Approach 1: Two Pointers (sorted array — optimal)**
\`\`\`python
def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1

    while left < right:
        current_sum = numbers[left] + numbers[right]
        if current_sum == target:
            return [left, right]
        elif current_sum < target:
            left += 1   # need bigger sum → move left pointer right
        else:
            right -= 1  # need smaller sum → move right pointer left

    return []

# numbers = [2, 7, 11, 15], target = 9
# left=0(2), right=3(15) → 17 > 9 → right=2
# left=0(2), right=2(11) → 13 > 9 → right=1
# left=0(2), right=1(7)  → 9 == 9 → return [0, 1] ✓
\`\`\`

**Time: O(n) | Space: O(1)**

**Approach 2: HashMap (unsorted array)**
\`\`\`python
def two_sum_unsorted(nums, target):
    seen = {}  # value → index
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []
\`\`\`

**Time: O(n) | Space: O(n)**

**When to use which:**
- Sorted array → Two pointers (O(1) space)
- Unsorted array → HashMap
- Multiple pairs needed → Two pointers (just don't return early)

**AI/production connection:**
Two-pointer pattern appears in sliding window for streaming token processing, attention score filtering, and merge-sorted retrieval result lists.
        `,
        practice: "Variation: Find all pairs in an unsorted array that sum to target (return all pairs, no duplicates).",
        practiceAnswer: `Sort first O(n log n), then two pointers. Skip duplicates: while left < right and nums[left] == nums[left-1]: left += 1. Returns all unique pairs. Time: O(n log n), Space: O(1) if not counting output.`
      },
      {
        q: "First Non-Repeating Character",
        tags: ["HashMap", "String", "O(n)"],
        answer: `
**Input:** s = "aabccdeff"
**Output:** "b" (first char that appears only once)

**Approach: Two-pass with OrderedDict/Counter**
\`\`\`python
from collections import Counter

def first_non_repeating(s: str) -> str:
    freq = Counter(s)          # Pass 1: count all chars O(n)

    for char in s:             # Pass 2: find first with freq=1 O(n)
        if freq[char] == 1:
            return char

    return "-1"

# s = "aabccdeff"
# freq = {a:2, b:1, c:2, d:1, e:1, f:2}
# Walk: a→2, a→2, b→1 ✓ return "b"
\`\`\`

**Time: O(n) | Space: O(1)** (at most 26 lowercase chars in Counter)

**Single-pass with LinkedHashMap (interview flex):**
\`\`\`python
from collections import OrderedDict

def first_non_repeating_v2(s: str) -> str:
    seen = OrderedDict()
    for char in s:
        seen[char] = seen.get(char, 0) + 1

    for char, count in seen.items():
        if count == 1:
            return char
    return "-1"
\`\`\`

**Edge cases to mention:**
- All unique: "abcde" → "a"
- All repeating: "aabb" → "-1"
- Single char: "a" → "a"
- Empty string: "" → "-1"

**Walkthrough for "aabccdeff":**
\`\`\`
a:2, a:2, b:1✓ → return "b"
\`\`\`
        `,
        practice: "Variation: Find the first repeating character (instead of non-repeating).",
        practiceAnswer: `Use a set instead of counter. Walk through string: if char already in seen → return it. Else add to seen. Time: O(n), Space: O(min(n, alphabet_size)). For "aabccdeff": a → not in seen, add. a → IN seen → return "a".`
      }
    ]
  }
];

const SIMILAR_QUESTIONS = [
  { cat: "LangGraph", q: "How do you implement human-in-the-loop in LangGraph?", hint: "interrupt_before=['node_name'] in compile()" },
  { cat: "LangGraph", q: "What is a StateGraph vs MessageGraph?", hint: "StateGraph = custom TypedDict state. MessageGraph = built-in messages list, simpler for chatbots." },
  { cat: "RAG", q: "What's the difference between dense and sparse retrieval?", hint: "Dense: embeddings (semantic). Sparse: BM25/TF-IDF (keyword). Hybrid = both." },
  { cat: "RAG", q: "How do you evaluate RAG quality?", hint: "RAGAS metrics: faithfulness, answer relevancy, context precision, context recall." },
  { cat: "Python", q: "What's the difference between *args and **kwargs?", hint: "*args = positional tuple. **kwargs = keyword dict. *args comes before **kwargs." },
  { cat: "Python", q: "Explain generators vs list comprehensions.", hint: "Generator: lazy, uses yield, one item at a time. List comp: eager, stores all in memory." },
  { cat: "Python", q: "What is a decorator? Give a production example.", hint: "@retry, @lru_cache, @app.route. They wrap functions to add behavior without changing code." },
  { cat: "DSA", q: "Sliding window: max sum subarray of size k", hint: "Maintain running sum. Add new element, remove leftmost. O(n) vs O(n*k) brute force." },
  { cat: "DSA", q: "Valid parentheses: () [] {} balanced check", hint: "Stack. Push open brackets. On close bracket, check if stack top matches. If not → invalid." },
  { cat: "DSA", q: "Reverse a linked list", hint: "prev=None, curr=head. While curr: next=curr.next, curr.next=prev, prev=curr, curr=next. Return prev." },
  { cat: "OOP", q: "What's the difference between @classmethod and @staticmethod?", hint: "@classmethod gets cls as first arg (can create instances). @staticmethod gets no implicit arg (pure utility)." },
  { cat: "OOP", q: "Explain the MRO (Method Resolution Order) in Python.", hint: "C3 linearization. Python searches class hierarchy left-to-right, depth-first, no duplicates. Use ClassName.__mro__ to inspect." }
];

function Tag({ label, color }) {
  return (
    <span style={{
      background: color + "22",
      color: color,
      border: `1px solid ${color}44`,
      borderRadius: "4px",
      padding: "2px 8px",
      fontSize: "11px",
      fontFamily: "'JetBrains Mono', monospace",
      fontWeight: 600,
      letterSpacing: "0.5px"
    }}>{label}</span>
  );
}

function CodeBlock({ children }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={{ position: "relative", margin: "10px 0" }}>
      <button onClick={copy} style={{
        position: "absolute", top: 8, right: 8, background: copied ? "#34d399" : "#374151",
        color: "#fff", border: "none", borderRadius: "4px", padding: "3px 8px",
        fontSize: "11px", cursor: "pointer", zIndex: 10, fontFamily: "monospace"
      }}>{copied ? "✓" : "copy"}</button>
      <pre style={{
        background: "#0d1117", color: "#e6edf3", padding: "16px",
        borderRadius: "8px", overflowX: "auto", fontSize: "13px",
        lineHeight: 1.6, margin: 0, fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
        border: "1px solid #30363d"
      }}><code>{children.trim()}</code></pre>
    </div>
  );
}

function renderAnswer(text) {
  const lines = text.trim().split("\n");
  const elements = [];
  let i = 0;
  let tableBuffer = [];
  let inCode = false;
  let codeBuffer = [];

  while (i < lines.length) {
    const line = lines[i];

    if (line.startsWith("```")) {
      if (!inCode) { inCode = true; codeBuffer = []; }
      else {
        elements.push(<CodeBlock key={i}>{codeBuffer.join("\n")}</CodeBlock>);
        inCode = false; codeBuffer = [];
      }
      i++; continue;
    }
    if (inCode) { codeBuffer.push(line); i++; continue; }

    if (line.startsWith("|")) {
      tableBuffer.push(line);
      i++;
      if (i >= lines.length || !lines[i].startsWith("|")) {
        const rows = tableBuffer.filter(r => !r.match(/^\|[-| ]+\|$/));
        const headers = rows[0].split("|").filter(Boolean).map(h => h.trim());
        const dataRows = rows.slice(1);
        elements.push(
          <div key={i} style={{ overflowX: "auto", margin: "10px 0" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", fontSize: "13px" }}>
              <thead>
                <tr>{headers.map((h, j) => (
                  <th key={j} style={{ background: "#1e2433", color: "#94a3b8", padding: "8px 12px", textAlign: "left", borderBottom: "1px solid #2d3748", fontFamily: "'JetBrains Mono', monospace", fontSize: "12px" }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {dataRows.map((row, ri) => (
                  <tr key={ri} style={{ background: ri % 2 === 0 ? "#0f1624" : "#131929" }}>
                    {row.split("|").filter(Boolean).map((cell, ci) => (
                      <td key={ci} style={{ padding: "7px 12px", color: "#c9d1d9", borderBottom: "1px solid #1e2433", fontSize: "13px" }}>{cell.trim()}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableBuffer = [];
      }
      continue;
    }

    if (line.startsWith("**") && line.endsWith("**") && !line.slice(2, -2).includes("**")) {
      elements.push(<p key={i} style={{ fontWeight: 700, color: "#f0f6fc", margin: "12px 0 4px", fontSize: "14px" }}>{line.slice(2, -2)}</p>);
    } else if (line.startsWith("**")) {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      elements.push(
        <p key={i} style={{ color: "#c9d1d9", margin: "5px 0", lineHeight: 1.7, fontSize: "14px" }}>
          {parts.map((p, j) => p.startsWith("**") ? <strong key={j} style={{ color: "#f0f6fc" }}>{p.slice(2, -2)}</strong> : p)}
        </p>
      );
    } else if (line.match(/^#{1,3} /)) {
      const lvl = line.match(/^(#{1,3})/)[0].length;
      elements.push(<p key={i} style={{ fontWeight: 700, color: "#f0f6fc", margin: "14px 0 6px", fontSize: lvl === 1 ? "16px" : "14px" }}>{line.replace(/^#+\s/, "")}</p>);
    } else if (line.trim() === "") {
      elements.push(<div key={i} style={{ height: "6px" }} />);
    } else {
      elements.push(<p key={i} style={{ color: "#c9d1d9", margin: "4px 0", lineHeight: 1.7, fontSize: "14px" }}>{line}</p>);
    }
    i++;
  }
  return elements;
}

function QuestionCard({ q, color, idx }) {
  const [open, setOpen] = useState(false);
  const [showPractice, setShowPractice] = useState(false);

  return (
    <div style={{
      background: "#0f1624",
      border: `1px solid ${open ? color + "55" : "#1e2d3d"}`,
      borderRadius: "10px",
      marginBottom: "10px",
      overflow: "hidden",
      transition: "border-color 0.2s",
      boxShadow: open ? `0 0 20px ${color}11` : "none"
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: "100%", background: "none", border: "none", padding: "16px 20px",
        cursor: "pointer", display: "flex", alignItems: "flex-start", gap: "12px",
        textAlign: "left"
      }}>
        <span style={{
          background: color + "22", color, border: `1px solid ${color}44`,
          borderRadius: "6px", padding: "3px 9px", fontSize: "12px",
          fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, flexShrink: 0
        }}>Q{idx + 1}</span>
        <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "14px", lineHeight: 1.5, flex: 1 }}>{q.q}</span>
        <span style={{ color, fontSize: "18px", flexShrink: 0, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>›</span>
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${color}22`, padding: "0 20px 16px" }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", padding: "12px 0 14px" }}>
            {q.tags.map((t, i) => <Tag key={i} label={t} color={color} />)}
          </div>
          <div>{renderAnswer(q.answer)}</div>

          {q.practice && (
            <div style={{ marginTop: "16px", background: "#0a0e1a", borderRadius: "8px", border: `1px solid ${color}33`, overflow: "hidden" }}>
              <button onClick={() => setShowPractice(!showPractice)} style={{
                width: "100%", background: "none", border: "none", padding: "12px 16px",
                cursor: "pointer", display: "flex", alignItems: "center", gap: "8px"
              }}>
                <span style={{ fontSize: "14px" }}>🎯</span>
                <span style={{ color: color, fontWeight: 600, fontSize: "13px" }}>Practice Q: {q.practice}</span>
                <span style={{ color, marginLeft: "auto" }}>{showPractice ? "▲" : "▼"}</span>
              </button>
              {showPractice && (
                <div style={{ padding: "0 16px 12px", borderTop: `1px solid ${color}22` }}>
                  <p style={{ color: "#94a3b8", fontSize: "13px", lineHeight: 1.7, margin: "10px 0 0" }}>
                    💡 {q.practiceAnswer}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [activeSection, setActiveSection] = useState("agentic");
  const [practiceFilter, setPracticeFilter] = useState("All");
  const section = SECTIONS.find(s => s.id === activeSection);
  const cats = ["All", ...new Set(SIMILAR_QUESTIONS.map(q => q.cat))];
  const filtered = practiceFilter === "All" ? SIMILAR_QUESTIONS : SIMILAR_QUESTIONS.filter(q => q.cat === practiceFilter);
  const [revealedHints, setRevealedHints] = useState({});

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060d1b",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#e2e8f0"
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0a0e1a 0%, #0f1624 100%)",
        borderBottom: "1px solid #1e2d3d",
        padding: "28px 24px 24px",
        position: "sticky", top: 0, zIndex: 50
      }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <div style={{
              background: "linear-gradient(135deg, #00d4ff, #a78bfa)",
              borderRadius: "8px", width: "36px", height: "36px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px"
            }}>⚔️</div>
            <div>
              <h1 style={{ margin: 0, fontSize: "20px", fontWeight: 800, color: "#f0f6fc", letterSpacing: "-0.3px" }}>
                PS Interview Battle Guide
              </h1>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b", fontFamily: "'JetBrains Mono', monospace" }}>
                Senior Associate AI Engineer · Publicis Sapient · Bangalore
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "16px" }}>
            {SECTIONS.map(s => (
              <button key={s.id} onClick={() => setActiveSection(s.id)} style={{
                background: activeSection === s.id ? s.color + "22" : "transparent",
                border: `1px solid ${activeSection === s.id ? s.color : "#1e2d3d"}`,
                color: activeSection === s.id ? s.color : "#64748b",
                borderRadius: "20px", padding: "6px 14px",
                fontSize: "13px", fontWeight: 600, cursor: "pointer",
                transition: "all 0.15s"
              }}>
                {s.icon} {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>
        {/* Section header */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{
            fontSize: "22px", fontWeight: 800, color: section.color,
            margin: "0 0 4px", display: "flex", alignItems: "center", gap: "8px"
          }}>
            {section.icon} {section.label}
          </h2>
          <p style={{ color: "#475569", fontSize: "13px", margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>
            {section.questions.length} questions · tap to expand · includes practice Q
          </p>
        </div>

        {section.questions.map((q, i) => (
          <QuestionCard key={i} q={q} color={section.color} idx={i} />
        ))}

        {/* Complexity Cheatsheet */}
        {activeSection === "dsa" && (
          <div style={{
            background: "#0f1624", border: "1px solid #fb923c33", borderRadius: "10px",
            padding: "20px", marginTop: "16px"
          }}>
            <h3 style={{ color: "#fb923c", margin: "0 0 14px", fontSize: "15px" }}>⏱ Complexity Cheatsheet (Interview Must-Know)</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[
                ["Two Pointer (sorted)", "O(n)", "O(1)"],
                ["HashMap lookup", "O(1) avg", "O(n)"],
                ["Sliding Window", "O(n)", "O(1)"],
                ["Binary Search", "O(log n)", "O(1)"],
                ["BFS/DFS", "O(V+E)", "O(V)"],
                ["Sorting (TimSort)", "O(n log n)", "O(n)"],
                ["Counter/freq map", "O(n)", "O(k)"],
                ["Stack operations", "O(1)", "O(n)"],
              ].map(([name, time, space], i) => (
                <div key={i} style={{ background: "#0a0e1a", borderRadius: "6px", padding: "10px 14px" }}>
                  <div style={{ color: "#e2e8f0", fontWeight: 600, fontSize: "13px", marginBottom: "4px" }}>{name}</div>
                  <div style={{ display: "flex", gap: "12px" }}>
                    <span style={{ color: "#34d399", fontSize: "12px", fontFamily: "monospace" }}>T: {time}</span>
                    <span style={{ color: "#a78bfa", fontSize: "12px", fontFamily: "monospace" }}>S: {space}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ICPA Context Banner */}
        <div style={{
          background: "linear-gradient(135deg, #0a1628, #0d1f3c)",
          border: "1px solid #1e3a5f", borderRadius: "10px",
          padding: "16px 20px", marginTop: "20px"
        }}>
          <p style={{ margin: "0 0 8px", color: "#60a5fa", fontWeight: 700, fontSize: "13px" }}>
            🏭 ICPA Project Connection
          </p>
          <p style={{ margin: 0, color: "#94a3b8", fontSize: "13px", lineHeight: 1.6 }}>
            Ground every answer in ICPA: <span style={{ color: "#60a5fa" }}>3-tier cascade</span> (TF-IDF 5ms → ChromaDB RAG 200ms → Ollama 2s) · 
            <span style={{ color: "#a78bfa" }}> LangGraph multi-agent</span> with NeMo Guardrails + Redis state · 
            <span style={{ color: "#34d399" }}> MMR retrieval</span> improved faithfulness 72%→91% · 
            <span style={{ color: "#fb923c" }}> FastAPI + EKS</span> + MLflow + LangSmith observability
          </p>
        </div>

        {/* Similar Practice Questions */}
        <div style={{ marginTop: "32px" }}>
          <h2 style={{ color: "#f0f6fc", fontSize: "18px", fontWeight: 800, margin: "0 0 16px" }}>
            🎯 Similar Practice Questions
          </h2>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
            {cats.map(c => (
              <button key={c} onClick={() => setPracticeFilter(c)} style={{
                background: practiceFilter === c ? "#1e2d3d" : "transparent",
                border: `1px solid ${practiceFilter === c ? "#475569" : "#1e2d3d"}`,
                color: practiceFilter === c ? "#e2e8f0" : "#64748b",
                borderRadius: "16px", padding: "5px 12px", fontSize: "12px",
                fontWeight: 600, cursor: "pointer"
              }}>{c}</button>
            ))}
          </div>
          <div style={{ display: "grid", gap: "8px" }}>
            {filtered.map((item, i) => (
              <div key={i} style={{
                background: "#0f1624", border: "1px solid #1e2d3d",
                borderRadius: "8px", padding: "14px 16px",
                display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px"
              }}>
                <div style={{ flex: 1 }}>
                  <span style={{
                    background: "#1e2d3d", color: "#60a5fa",
                    fontSize: "11px", fontWeight: 700, padding: "2px 7px",
                    borderRadius: "4px", marginRight: "8px", fontFamily: "monospace"
                  }}>{item.cat}</span>
                  <span style={{ color: "#c9d1d9", fontSize: "14px" }}>{item.q}</span>
                  {revealedHints[i] && (
                    <p style={{ color: "#94a3b8", fontSize: "13px", margin: "8px 0 0", lineHeight: 1.6 }}>
                      💡 {item.hint}
                    </p>
                  )}
                </div>
                <button onClick={() => setRevealedHints(h => ({ ...h, [i]: !h[i] }))} style={{
                  background: "#1e2d3d", border: "none", color: "#60a5fa",
                  borderRadius: "6px", padding: "5px 10px", fontSize: "12px",
                  cursor: "pointer", flexShrink: 0
                }}>{revealedHints[i] ? "hide" : "hint"}</button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: "32px", padding: "20px" }}>
          <p style={{ color: "#1e2d3d", fontSize: "12px", fontFamily: "monospace" }}>
            Built for Pogo · PS Senior Associate AI Engineer Interview · All answers grounded in ICPA production experience
          </p>
        </div>
      </div>
    </div>
  );
}
