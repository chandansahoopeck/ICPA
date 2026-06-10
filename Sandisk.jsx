import { useState } from "react";

const SECTIONS = [
  { id: "overview", label: "🗺 Overview & Strategy", icon: "🗺" },
  { id: "python", label: "🐍 Python & FastAPI", icon: "🐍" },
  { id: "dsa", label: "📊 DSA", icon: "📊" },
  { id: "sysdesign", label: "🏗 System Design", icon: "🏗" },
  { id: "devops", label: "⚙️ DevOps / K8s / CI-CD", icon: "⚙️" },
  { id: "observability", label: "📡 Observability (OTel)", icon: "📡" },
  { id: "authnz", label: "🔐 Auth (OAuth/JWT)", icon: "🔐" },
  { id: "kafka", label: "🔄 Kafka & Data", icon: "🔄" },
  { id: "genai", label: "🤖 GenAI / LangGraph", icon: "🤖" },
  { id: "mlops", label: "🔬 MLOps / LLMOps", icon: "🔬" },
  { id: "microservices", label: "🧩 Microservices", icon: "🧩" },
  { id: "behavioral", label: "💬 Behavioral", icon: "💬" },
  { id: "questions", label: "❓ Questions to Ask", icon: "❓" },
];

const data = {
  overview: {
    title: "Overview & Interview Strategy",
    blocks: [
      {
        heading: "Role in One Line",
        content: "SanDisk wants a Senior AI Platform Engineer who bridges GenAI product delivery and cloud-native infrastructure — someone who can build the pipes (K8s, CI/CD, Helm, GitOps) AND the AI applications (RAG, agents, LLMs) riding those pipes, while evangelizing best practices across teams.",
      },
      {
        heading: "Your Positioning (ICPA → SanDisk)",
        content: `Frame everything through ICPA → AI Platform mindset:
• "At Vodafone I built ICPA — a production AI platform processing 50K docs/day. SanDisk's role is the natural next step: building that same platform capability as a reusable self-service layer for multiple AI teams."
• Emphasize: platform thinking, reusable blueprints, developer experience (DX), not just a one-off project.
• Lead with numbers: RAGAS faithfulness 72→91%, LLM escalation 40→12%, zero LLM inference cost on 95% traffic.`,
      },
      {
        heading: "Interview Round Expectations",
        content: `Typical structure for this level:
1. Technical Screen (45 min) — Python/FastAPI, async, DSA medium, system design sketch
2. Deep Dive 1 (60 min) — K8s/DevOps/GitOps, CI/CD, Helm, blue-green/canary
3. Deep Dive 2 (60 min) — GenAI stack, LangGraph agents, RAG, MLOps
4. System Design (60 min) — design an AI platform/pipeline end-to-end
5. Behavioral / Cross-functional (45 min) — stakeholder influence, Agile, collaboration`,
      },
      {
        heading: "Primary vs Secondary Skills Map",
        content: `PRIMARY (must nail): FastAPI, CI/CD (Jenkins + GitOps), K8s/OpenShift, Docker/Helm/JFrog, OTel (Prometheus/Grafana/Loki), Kafka, OAuth 2.0, Microservices, Agile
SECONDARY (show depth selectively): GenAI (GPT/Llama/HF), LangChain/LangGraph, Vector stores, MLOps, DL fundamentals, PyTorch/TF
Map to ICPA: Almost everything in Primary maps directly to your stack. Secondary = your ICPA Tier 3 + GenAI layers.`,
      },
    ],
  },

  python: {
    title: "Python & FastAPI",
    blocks: [
      {
        heading: "FastAPI Deep Dive — Must Know",
        content: `Key FastAPI concepts SanDisk will probe:

1. Dependency Injection
\`\`\`python
from fastapi import Depends, FastAPI

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db  # generator-based cleanup
    finally:
        db.close()

@app.get("/classify/{doc_id}")
async def classify(doc_id: str, db=Depends(get_db), auth=Depends(verify_token)):
    ...
\`\`\`

2. Background Tasks
\`\`\`python
from fastapi import BackgroundTasks

@app.post("/ingest")
async def ingest(doc: DocRequest, bg: BackgroundTasks):
    bg.add_task(process_document, doc.id)  # non-blocking
    return {"status": "queued"}
\`\`\`

3. Lifespan (startup/shutdown)
\`\`\`python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    await warm_up_models()  # startup
    yield
    await cleanup_connections()  # shutdown

app = FastAPI(lifespan=lifespan)
\`\`\`

4. Middleware (for OTel tracing, auth)
\`\`\`python
@app.middleware("http")
async def add_trace_id(request: Request, call_next):
    trace_id = str(uuid4())
    request.state.trace_id = trace_id
    response = await call_next(request)
    response.headers["X-Trace-Id"] = trace_id
    return response
\`\`\``,
      },
      {
        heading: "Async / Concurrency Depth",
        content: `SanDisk explicitly requires: multiprocessing, multithreading, async I/O, performance profiling.

ASYNCIO PATTERNS:
\`\`\`python
import asyncio

# Concurrent LLM calls
async def classify_batch(docs: list[str]) -> list[str]:
    tasks = [call_llm(doc) for doc in docs]
    return await asyncio.gather(*tasks, return_exceptions=True)

# Semaphore to rate-limit LLM API
sem = asyncio.Semaphore(10)  # max 10 concurrent
async def safe_llm_call(prompt: str):
    async with sem:
        return await call_llm(prompt)
\`\`\`

THREAD POOL for CPU-bound (e.g. TF-IDF vectorization):
\`\`\`python
from concurrent.futures import ThreadPoolExecutor
import asyncio

executor = ThreadPoolExecutor(max_workers=4)

async def tfidf_classify(text: str):
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(executor, sync_tfidf, text)
\`\`\`

PERFORMANCE PROFILING:
- cProfile + snakeviz for CPU profiling
- memory_profiler for memory leaks
- py-spy for production sampling (no code change)
- uvicorn --workers for multi-process FastAPI

ICPA CONTEXT: "In ICPA, Tier 1 TF-IDF was CPU-bound — we offloaded it via run_in_executor to avoid blocking the async event loop, keeping p99 latency under 10ms for 60% of traffic."`,
      },
      {
        heading: "Advanced Python Patterns",
        content: `DATACLASSES + PYDANTIC (key for FastAPI):
\`\`\`python
from pydantic import BaseModel, Field, validator

class ClassificationRequest(BaseModel):
    document_id: str
    content: str
    language: str = "de"  # German default for ICPA
    
    @validator("content")
    def check_not_empty(cls, v):
        if not v.strip():
            raise ValueError("content cannot be empty")
        return v
\`\`\`

DECORATORS for cross-cutting concerns:
\`\`\`python
import functools, time
from opentelemetry import trace

tracer = trace.get_tracer(__name__)

def traced(span_name: str):
    def decorator(fn):
        @functools.wraps(fn)
        async def wrapper(*args, **kwargs):
            with tracer.start_as_current_span(span_name):
                return await fn(*args, **kwargs)
        return wrapper
    return decorator

@traced("tier1.classify")
async def tfidf_classify(text: str): ...
\`\`\`

GENERATORS for streaming LLM output:
\`\`\`python
from fastapi.responses import StreamingResponse

async def stream_llm(prompt: str):
    async for chunk in llm.astream(prompt):
        yield f"data: {chunk}\\n\\n"

@app.post("/stream")
async def stream(req: Request):
    return StreamingResponse(stream_llm(req.prompt), media_type="text/event-stream")
\`\`\``,
      },
      {
        heading: "Unit / BDD / Performance Testing",
        content: `UNIT TESTING (pytest):
\`\`\`python
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_classify_dst():
    async with AsyncClient(app=app, base_url="http://test") as client:
        resp = await client.post("/classify", json={"content": "Kündigung DST..."})
    assert resp.status_code == 200
    assert resp.json()["label"] == "DST"
\`\`\`

BDD / GHERKIN (pytest-bdd):
\`\`\`gherkin
Feature: Document Classification
  Scenario: German insurance cancellation classified as DST
    Given a document with content "Kündigung Versicherung"
    When I POST to /classify
    Then the response label is "DST"
    And the confidence is greater than 0.85
\`\`\`
\`\`\`python
from pytest_bdd import scenario, given, when, then

@scenario("classify.feature", "German insurance cancellation classified as DST")
def test_dst(): pass

@given("a document with content 'Kündigung Versicherung'")
def doc(context): context["doc"] = {"content": "Kündigung Versicherung"}
\`\`\`

PERFORMANCE TESTING (locust):
\`\`\`python
from locust import HttpUser, task, between

class ClassifyUser(HttpUser):
    wait_time = between(0.1, 0.5)
    
    @task
    def classify(self):
        self.client.post("/classify", json={"content": "Test doc"})
\`\`\``,
      },
    ],
  },

  dsa: {
    title: "DSA — Targeted for This Role",
    blocks: [
      {
        heading: "What to Expect",
        content: `SanDisk is a platform/infra-heavy role. Expect:
- 1-2 medium LeetCode problems (not hard DP)
- Focus areas: queues, heaps, graphs, sliding window, hash maps
- Platform-relevant: rate limiting, LRU cache, task scheduling, message queue simulation
- May embed DSA in system design (e.g. "design a priority queue for doc processing")`,
      },
      {
        heading: "LRU Cache (core platform pattern)",
        content: `\`\`\`python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = OrderedDict()
    
    def get(self, key: int) -> int:
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)  # mark as recently used
        return self.cache[key]
    
    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.cap:
            self.cache.popitem(last=False)  # evict LRU
\`\`\`
ICPA CONTEXT: "We use Redis as an LRU semantic cache in front of ChromaDB. Cache hit rate ~40% on repeated similar queries, reducing Tier 2 latency from 200ms to ~5ms for cached queries."`,
      },
      {
        heading: "Rate Limiter (Token Bucket)",
        content: `\`\`\`python
import time
import asyncio
from collections import defaultdict

class TokenBucketRateLimiter:
    def __init__(self, rate: float, capacity: float):
        self.rate = rate        # tokens/sec refill
        self.capacity = capacity
        self.tokens = defaultdict(lambda: capacity)
        self.last_refill = defaultdict(time.time)
    
    def allow(self, user_id: str) -> bool:
        now = time.time()
        elapsed = now - self.last_refill[user_id]
        # Refill tokens
        self.tokens[user_id] = min(
            self.capacity,
            self.tokens[user_id] + elapsed * self.rate
        )
        self.last_refill[user_id] = now
        
        if self.tokens[user_id] >= 1:
            self.tokens[user_id] -= 1
            return True
        return False

# FastAPI middleware usage
limiter = TokenBucketRateLimiter(rate=10, capacity=100)
\`\`\``,
      },
      {
        heading: "Sliding Window (Kafka consumer lag monitoring)",
        content: `\`\`\`python
from collections import deque

def max_throughput_window(throughput: list[int], k: int) -> list[int]:
    """Max docs processed in any k-second window (monitoring use case)"""
    dq = deque()  # stores indices of useful elements
    result = []
    
    for i, val in enumerate(throughput):
        # Remove elements outside window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        # Remove smaller elements (they'll never be max)
        while dq and throughput[dq[-1]] < val:
            dq.pop()
        dq.append(i)
        if i >= k - 1:
            result.append(throughput[dq[0]])
    return result
\`\`\``,
      },
      {
        heading: "Priority Queue — Doc Processing Scheduler",
        content: `\`\`\`python
import heapq
from dataclasses import dataclass, field

@dataclass(order=True)
class Document:
    priority: int
    doc_id: str = field(compare=False)
    content: str = field(compare=False)

class DocumentScheduler:
    def __init__(self):
        self.heap = []
    
    def push(self, doc_id: str, content: str, priority: int):
        heapq.heappush(self.heap, Document(-priority, doc_id, content))  # max-heap
    
    def pop(self) -> Document:
        return heapq.heappop(self.heap)
    
    def peek(self) -> Document:
        return self.heap[0] if self.heap else None

# ICPA: MDR/AER documents get higher priority than DST
scheduler = DocumentScheduler()
scheduler.push("doc1", "MDR compliance review...", priority=10)
scheduler.push("doc2", "DST cancellation...", priority=3)
\`\`\``,
      },
      {
        heading: "Graph — Microservice Dependency Resolution",
        content: `\`\`\`python
from collections import defaultdict, deque

def topological_sort(services: dict[str, list[str]]) -> list[str]:
    """Deploy services in correct order (no circular deps)"""
    in_degree = defaultdict(int)
    graph = defaultdict(list)
    
    for svc, deps in services.items():
        for dep in deps:
            graph[dep].append(svc)
            in_degree[svc] += 1
        if svc not in in_degree:
            in_degree[svc] = 0
    
    queue = deque([s for s, d in in_degree.items() if d == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    if len(result) != len(services):
        raise ValueError("Circular dependency detected!")
    return result
\`\`\``,
      },
    ],
  },

  sysdesign: {
    title: "System Design",
    blocks: [
      {
        heading: "Most Likely Question: Design an AI Platform",
        content: `"Design a self-service AI platform that lets development teams deploy and run GenAI applications at scale."

FRAMEWORK (use this structure):
1. Requirements clarification (2 min)
2. High-level architecture (5 min)
3. Component deep dives (20 min)
4. Scaling, reliability, failure modes (10 min)
5. Trade-offs & alternatives (5 min)`,
      },
      {
        heading: "AI Platform — Full Architecture",
        content: `COMPONENTS:

┌─────────────────────────────────────────────────────────┐
│                    Developer Portal                      │
│        (Self-service UI / API for deploying AI apps)     │
└──────────────────────┬──────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │     Control Plane (FastAPI) │
        │  - App registration         │
        │  - Model registry (MLflow)  │
        │  - Config management        │
        └──────────────┬──────────────┘
                       │
     ┌─────────────────▼──────────────────┐
     │        Kubernetes / OpenShift       │
     │  ┌────────┐  ┌────────┐ ┌────────┐ │
     │  │RAG Svc │  │Agent   │ │LLM Svc │ │
     │  │(Tier2) │  │Orchest.│ │(Ollama)│ │
     │  └────────┘  └────────┘ └────────┘ │
     │      KEDA autoscaling (Kafka lag)   │
     └──────────────┬─────────────────────┘
                    │
     ┌──────────────▼─────────────────────┐
     │        Data / Storage Layer         │
     │  Kafka │ Redis │ Qdrant │ Postgres  │
     └─────────────────────────────────────┘
                    │
     ┌──────────────▼─────────────────────┐
     │     Observability (OTel Collector)  │
     │  Prometheus │ Loki │ Grafana │Tempo │
     └─────────────────────────────────────┘

CI/CD:
GitHub → Jenkins pipeline → JFrog Artifactory (image storage)
→ Argo CD (GitOps) → K8s deployment (blue/green via Argo Rollouts)`,
      },
      {
        heading: "Design: Document Processing Pipeline (ICPA-scale)",
        content: `"Design a system that classifies 50,000 insurance documents/day with <500ms SLA."

ANSWER (your ICPA):

INGESTION:
- AWS Textract OCR → Kafka topic (doc.raw) → consumer group
- 3-tier classification:
  Tier 1: TF-IDF (5ms, 60% traffic) → cache in Redis
  Tier 2: ChromaDB RAG (200ms, 28% traffic)
  Tier 3: Ollama llama3.2 (2s, 12% traffic)

SCALING:
- KEDA scales consumers based on Kafka consumer group lag
- Each tier deployed as independent K8s Deployment
- HPA on CPU for Tier 1, custom metric (queue depth) for Tier 3

RELIABILITY:
- Dead Letter Queue (DLQ) for failed classifications
- Circuit breaker (LangGraph conditional edges) to prevent Tier 3 overload
- NeMo Guardrails for LLM output validation

STORAGE:
- Redis: semantic cache + session state (TTL 1hr)
- ChromaDB/Qdrant: embeddings (Cohere Embed v3)
- PostgreSQL: audit trail, classification results
- MLflow: model versioning + experiment tracking`,
      },
      {
        heading: "Blue/Green & Canary Deployment Design",
        content: `BLUE/GREEN:
- Two identical K8s Deployments: blue (live) + green (new version)
- Service selector toggles between them
- Zero-downtime: shift 100% traffic instantly, rollback = re-toggle
- Use case: major model version upgrades

\`\`\`yaml
# Argo Rollout (blue/green)
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    blueGreen:
      activeService: ai-svc-active
      previewService: ai-svc-preview
      autoPromotionEnabled: false  # manual approval
\`\`\`

CANARY:
- Gradually shift traffic: 5% → 25% → 50% → 100%
- Monitor RAGAS faithfulness, error rate at each step
- Argo Rollouts + Prometheus metrics gate

\`\`\`yaml
strategy:
  canary:
    steps:
    - setWeight: 5
    - pause: {duration: 10m}
    - analysis:
        templates: [{templateName: success-rate}]
    - setWeight: 50
    - pause: {duration: 30m}
\`\`\`

ICPA CONTEXT: "We use blue/green for llama3.2 model upgrades — testing on green with shadow traffic before switching the service selector. Canary for FastAPI microservice updates with RAGAS as the promotion gate."`,
      },
      {
        heading: "State Externalization & Container Immutability",
        content: `JD explicitly mentions: "state externalization, container layering strategy and immutability"

STATE EXTERNALIZATION:
- NEVER store session/state in containers (stateless pods)
- Redis: ephemeral state (LangGraph agent checkpoints, rate limit counters)
- PostgreSQL: durable state (classification results, audit logs)
- K8s ConfigMaps/Secrets: environment config (never bake into image)

CONTAINER IMMUTABILITY:
- Immutable images: no SSH, no runtime changes
- All config via environment variables or mounted ConfigMaps
- Use multi-stage Dockerfile to minimize attack surface:
\`\`\`dockerfile
# Build stage
FROM python:3.11-slim AS builder
COPY requirements.txt .
RUN pip install --user -r requirements.txt

# Runtime stage (minimal)
FROM python:3.11-slim
COPY --from=builder /root/.local /root/.local
COPY app/ /app
USER nonroot  # security: non-root
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0"]
\`\`\`

CONTAINER LAYERING:
- Base: python:3.11-slim (shared across all services)
- Deps layer: pip install (cached if requirements.txt unchanged)
- App layer: copy source (changes every build)
- Stored in JFrog Artifactory with immutable tags (git SHA, not 'latest')`,
      },
    ],
  },

  devops: {
    title: "DevOps — K8s, CI/CD, GitOps, Helm",
    blocks: [
      {
        heading: "Kubernetes / OpenShift Deep Dive",
        content: `CORE K8s OBJECTS for AI platform:

1. Deployments: stateless AI microservices
2. StatefulSets: vector DB (Qdrant), Kafka
3. Jobs/CronJobs: batch embedding ingestion
4. HPA: CPU/memory based scaling
5. KEDA: custom metric scaling (Kafka lag, queue depth)

KEDA FOR AI WORKLOADS:
\`\`\`yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: classifier-scaler
spec:
  scaleTargetRef:
    name: classifier-deployment
  triggers:
  - type: kafka
    metadata:
      bootstrapServers: kafka:9092
      topic: doc.raw
      consumerGroup: classifier-group
      lagThreshold: "100"  # scale up if lag > 100
  minReplicaCount: 2
  maxReplicaCount: 20
\`\`\`

RESOURCE MANAGEMENT:
\`\`\`yaml
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
    nvidia.com/gpu: "1"  # for LLM inference
  limits:
    memory: "2Gi"
    cpu: "2000m"
\`\`\`

OPENSHIFT BRIDGING from EKS:
- OpenShift = K8s + RBAC hardening + SCCs (Security Context Constraints)
- SCCs replace K8s PodSecurityPolicies — stricter default (no root)
- Route objects replace K8s Ingress
- imagestreams replace direct registry pulls
- "In ICPA we ran EKS; bridging to OpenShift means: use SCCs, Routes, and oc CLI instead of kubectl for cluster-specific ops."`,
      },
      {
        heading: "Helm — Chart Design for AI Services",
        content: `HELM CHART STRUCTURE:
\`\`\`
ai-platform/
├── Chart.yaml
├── values.yaml              # defaults
├── values-staging.yaml      # env overrides
├── values-prod.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── hpa.yaml
    ├── configmap.yaml
    ├── secret.yaml          # external-secrets ref
    └── rollout.yaml         # Argo Rollouts
\`\`\`

KEY PATTERNS:
\`\`\`yaml
# values.yaml
image:
  repository: artifactory.company.com/ai/classifier
  tag: "{{ .Values.gitSha }}"  # immutable, no 'latest'
  
model:
  tier1: tfidf
  tier2: chromadb
  tier3: llama3.2
  
autoscaling:
  enabled: true
  kafkaLagThreshold: 100
  
observability:
  otelCollector: "http://otel-collector:4317"
  samplingRate: 0.1  # 10% trace sampling in prod
\`\`\`

HELM + GITOPS: Helm chart in Git → Argo CD watches → applies to cluster. No kubectl apply manually in prod.`,
      },
      {
        heading: "Jenkins CI Pipeline",
        content: `\`\`\`groovy
// Jenkinsfile
pipeline {
  agent { label 'k8s-agent' }
  
  environment {
    IMAGE = "artifactory.company.com/ai/classifier"
    TAG = "\${GIT_COMMIT[0..7]}"
  }
  
  stages {
    stage('Test') {
      steps {
        sh 'pytest tests/ --cov=app --cov-report=xml'
        sh 'python -m pytest tests/bdd/ -v'  // BDD tests
      }
    }
    
    stage('Security Scan') {
      steps {
        sh 'trivy image --exit-code 1 --severity HIGH,CRITICAL .'
        sh 'bandit -r app/ -ll'  // Python security linting
      }
    }
    
    stage('Build & Push') {
      steps {
        sh "docker build -t \${IMAGE}:\${TAG} ."
        sh "docker push \${IMAGE}:\${TAG}"
        // JFrog Artifactory stores with SHA tag
      }
    }
    
    stage('Update GitOps Repo') {
      steps {
        sh """
          git clone https://github.com/company/k8s-manifests
          cd k8s-manifests
          helm upgrade --install classifier ./charts/ai-classifier \\
            --set image.tag=\${TAG} \\
            --values values-staging.yaml
          git add . && git commit -m "Deploy \${TAG}"
          git push  // Argo CD picks this up
        """
      }
    }
  }
  
  post {
    failure { slackSend(message: "Build failed: \${TAG}") }
  }
}
\`\`\``,
      },
      {
        heading: "GitOps — Argo CD",
        content: `GITOPS PRINCIPLES:
1. Git = single source of truth for desired state
2. No direct kubectl apply in production
3. Argo CD continuously reconciles actual vs desired
4. Rollback = git revert + push

ARGO CD APP SETUP:
\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: ai-classifier-prod
spec:
  project: ai-platform
  source:
    repoURL: https://github.com/company/k8s-manifests
    targetRevision: main
    path: charts/ai-classifier
    helm:
      valueFiles: [values-prod.yaml]
  destination:
    server: https://kubernetes.default.svc
    namespace: ai-prod
  syncPolicy:
    automated:
      prune: true      # remove deleted resources
      selfHeal: true   # revert manual changes
\`\`\`

DEPLOYMENT STRATEGY (per env):
- Dev: auto-sync on every commit
- Staging: auto-sync + automated canary (5% → 50% → 100%)
- Prod: manual promotion gate after staging validation`,
      },
      {
        heading: "JFrog Artifactory",
        content: `ROLE IN AI PLATFORM:
- Container image registry (Docker repos)
- Helm chart repository
- Python wheel/package store (internal libs)
- Model artifact storage (ONNX, PyTorch checkpoints)

KEY PRACTICES:
1. Immutable tags: always use git SHA, never :latest in prod
2. Promotion: image promoted from dev-repo → staging-repo → prod-repo (never rebuilt)
3. Security: Xray scanning for CVEs on push
4. Cleanup policies: auto-delete images older than 90 days (except pinned prod releases)

ICPA CONTEXT: "We stored all Docker images in JFrog with git SHA tags. Jenkins pushes to dev-docker-local, after staging validation Argo CD promotion policy moves image to prod-docker-local. This ensures prod only runs images validated through full pipeline."`,
      },
    ],
  },

  observability: {
    title: "Observability — OTel, Prometheus, Grafana, Loki",
    blocks: [
      {
        heading: "OpenTelemetry (OTel) — Core Concepts",
        content: `THREE PILLARS:
1. Traces: distributed request flow across services (Tempo/Jaeger)
2. Metrics: numeric time-series (Prometheus)
3. Logs: structured events (Loki)

OTel COLLECTOR architecture:
App → OTel SDK → OTel Collector → [Prometheus, Loki, Tempo]
                                      ↓           ↓       ↓
                                  Grafana Dashboard (unified)

INSTRUMENTATION in FastAPI:
\`\`\`python
from opentelemetry import trace, metrics
from opentelemetry.exporter.otlp.proto.grpc.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor

# Setup
provider = TracerProvider()
provider.add_span_processor(
    BatchSpanProcessor(OTLPSpanExporter(endpoint="http://otel-collector:4317"))
)
trace.set_tracer_provider(provider)

# Auto-instrument FastAPI (traces all requests)
FastAPIInstrumentor.instrument_app(app)

# Custom spans
tracer = trace.get_tracer("icpa.classifier")

async def classify_document(doc_id: str, text: str):
    with tracer.start_as_current_span("classify") as span:
        span.set_attribute("doc.id", doc_id)
        span.set_attribute("doc.tier", "tier1")
        result = await tfidf_classify(text)
        span.set_attribute("classification.label", result.label)
        return result
\`\`\``,
      },
      {
        heading: "Custom Metrics — AI-specific",
        content: `\`\`\`python
from opentelemetry import metrics

meter = metrics.get_meter("icpa.classifier")

# Counters
classification_counter = meter.create_counter(
    "icpa_classifications_total",
    description="Total documents classified"
)

# Histograms (latency)
classification_latency = meter.create_histogram(
    "icpa_classification_duration_seconds",
    description="Classification latency"
)

# Gauges (live values)
queue_depth = meter.create_observable_gauge(
    "icpa_kafka_queue_depth",
    callbacks=[lambda: kafka_consumer_lag()]
)

# Usage in classification
def classify(text: str, tier: str):
    start = time.time()
    result = _classify(text)
    classification_counter.add(1, {"tier": tier, "label": result.label})
    classification_latency.record(
        time.time() - start, {"tier": tier}
    )
    return result
\`\`\`

KEY AI PLATFORM METRICS TO INSTRUMENT:
- Model inference latency (p50/p90/p99 per tier)
- Classification distribution per label (DST/MIN/MDR/AER/MER)
- RAGAS faithfulness score (from LangSmith export → Prometheus)
- LLM escalation rate (% reaching Tier 3)
- Cache hit rate (Redis semantic cache)
- Token usage per request (cost monitoring)`,
      },
      {
        heading: "Grafana Dashboards — What to Design",
        content: `ICPA / AI PLATFORM DASHBOARD PANELS:

Row 1 — Traffic:
- Request rate (req/s) by service
- Error rate (4xx, 5xx)
- Kafka consumer lag

Row 2 — Latency:
- p50/p90/p99 per classification tier
- End-to-end pipeline latency

Row 3 — AI Quality:
- LLM escalation rate (goal: <15%)
- Classification distribution by label
- RAGAS faithfulness trend

Row 4 — Infrastructure:
- CPU/memory per pod
- KEDA scaling events
- GPU utilization (Tier 3 pods)

LOKI LOG QUERIES (LogQL):
\`\`\`logql
# Error logs for classifier service
{app="classifier", env="prod"} |= "ERROR" | json

# Slow LLM requests (>3s)
{app="llm-service"} | json | duration > 3000ms

# PII detection events (GDPR audit)
{app="pii-anonymizer"} |= "PII_DETECTED" | json
  | line_format "{{.doc_id}} {{.pii_type}}"
\`\`\``,
      },
      {
        heading: "Alerting Strategy",
        content: `PROMETHEUS ALERTMANAGER RULES:
\`\`\`yaml
groups:
- name: ai-platform
  rules:
  - alert: HighLLMEscalationRate
    expr: |
      rate(icpa_classifications_total{tier="tier3"}[5m]) /
      rate(icpa_classifications_total[5m]) > 0.20
    for: 5m
    labels:
      severity: warning
    annotations:
      summary: "LLM escalation rate >20% (ICPA target: <12%)"
  
  - alert: ClassificationLatencyHigh
    expr: histogram_quantile(0.99, icpa_classification_duration_seconds) > 0.5
    for: 2m
    labels:
      severity: critical
  
  - alert: KafkaConsumerLag
    expr: kafka_consumer_lag > 10000
    for: 1m
    labels:
      severity: warning
\`\`\`

SRE CONTEXT: Error budget = 1 - SLO. If SLO is 99.5% availability, error budget = 0.5% = ~3.6 hrs/month. Track burn rate to prevent exhaustion.`,
      },
    ],
  },

  authnz: {
    title: "Authentication & Authorization — OAuth 2.0 / JWT",
    blocks: [
      {
        heading: "OAuth 2.0 Flows — Which When",
        content: `FLOWS MAP:

1. Authorization Code + PKCE
   → User-facing apps (web/mobile)
   → Most secure for interactive login
   → PKCE prevents auth code interception

2. Client Credentials
   → Service-to-service (M2M)
   → AI microservice calling another AI service
   → No user involved
   ICPA USE: FastAPI service authenticating to Kafka Schema Registry, MLflow, internal APIs

3. Device Code Flow
   → CLI tools (Claude Code, kubectl plugins)

4. Implicit (DEPRECATED — don't use)

CLIENT CREDENTIALS FLOW:
\`\`\`
Service A → POST /oauth/token
  {grant_type: client_credentials, client_id, client_secret, scope}
← {access_token (JWT), expires_in, token_type: Bearer}

Service A → GET /api/models
  Authorization: Bearer <JWT>
← 200 OK
\`\`\``,
      },
      {
        heading: "JWT Deep Dive",
        content: `JWT STRUCTURE: header.payload.signature

HEADER: {"alg": "RS256", "typ": "JWT", "kid": "key-id-1"}
PAYLOAD:
\`\`\`json
{
  "sub": "service-classifier",
  "iss": "https://auth.company.com",
  "aud": ["ai-platform-api"],
  "exp": 1718000000,
  "iat": 1717996400,
  "scope": "classify:read classify:write",
  "roles": ["ai-engineer"]
}
\`\`\`
SIGNATURE: RS256(base64(header) + "." + base64(payload), privateKey)

VALIDATION (FastAPI):
\`\`\`python
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
import jwt
from jwt import PyJWKClient

jwks_client = PyJWKClient("https://auth.company.com/.well-known/jwks.json")

async def verify_token(token: str = Depends(HTTPBearer())):
    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token.credentials)
        payload = jwt.decode(
            token.credentials,
            signing_key.key,
            algorithms=["RS256"],
            audience="ai-platform-api",
            issuer="https://auth.company.com"
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {e}")
\`\`\`

JWKS: Public key endpoint. Client fetches keys by kid to validate JWT signature. Key rotation: new kid added, old kid deprecated gracefully.`,
      },
      {
        heading: "RBAC in AI Platform",
        content: `SCOPES + ROLES FOR AI PLATFORM:
\`\`\`
Roles:
- ai-consumer: can call /classify, /query
- ai-developer: + deploy models, view metrics
- ai-admin: + manage models, update config, view audit logs

Scope-based access:
- classify:read → GET /classify
- model:deploy → POST /models/{id}/deploy
- audit:read → GET /audit/logs
\`\`\`

K8s SERVICE ACCOUNT → OIDC:
\`\`\`yaml
# Pod uses ServiceAccount → projected token
# Validated by OIDC provider (Keycloak/Okta)
spec:
  serviceAccountName: classifier-sa
  volumes:
  - name: token
    projected:
      sources:
      - serviceAccountToken:
          audience: ai-platform-api
          expirationSeconds: 3600
\`\`\`

ICPA CONTEXT: "We used JWT Client Credentials for service-to-service calls between the FastAPI gateway and Ollama inference service. JWT validated at API gateway layer with PyJWKClient fetching keys from our Keycloak JWKS endpoint. Scope 'llm:infer' required for Tier 3 escalation."`,
      },
    ],
  },

  kafka: {
    title: "Kafka & Data Engineering",
    blocks: [
      {
        heading: "Kafka Core Concepts — Platform Relevance",
        content: `KEY CONCEPTS:
- Topic: named stream of records
- Partition: ordered, immutable log; parallelism unit
- Consumer Group: load-balanced consumers; each partition → one consumer
- Offset: position in partition (committed after processing)
- Broker: Kafka server; cluster = multiple brokers
- Replication factor: copies for fault tolerance (3 in prod)

AI PLATFORM TOPICS:
\`\`\`
doc.raw           → raw OCR output (partition by doc_type)
doc.classified    → classification results
doc.dlq           → dead letter queue (failed docs)
model.events      → model deployment/rollback events
audit.log         → GDPR compliance audit trail
\`\`\`

ICPA FLOW:
Textract OCR → Kafka (doc.raw) → Tier 1 consumer group
              → if uncertain → Tier 2 consumer group
              → if still uncertain → Tier 3 consumer group
              → results → Kafka (doc.classified)`,
      },
      {
        heading: "Python Kafka Consumer (aiokafka)",
        content: `\`\`\`python
from aiokafka import AIOKafkaConsumer, AIOKafkaProducer
import asyncio, json

async def classification_consumer():
    consumer = AIOKafkaConsumer(
        "doc.raw",
        bootstrap_servers="kafka:9092",
        group_id="tier1-classifier",
        enable_auto_commit=False,  # manual commit for at-least-once
        value_deserializer=lambda m: json.loads(m.decode("utf-8")),
        max_poll_records=100  # batch processing
    )
    
    producer = AIOKafkaProducer(
        bootstrap_servers="kafka:9092",
        value_serializer=lambda v: json.dumps(v).encode()
    )
    
    await consumer.start()
    await producer.start()
    
    try:
        async for msg in consumer:
            try:
                result = await classify(msg.value)
                
                if result.confidence >= 0.85:
                    # High confidence → output topic
                    await producer.send("doc.classified", result.dict())
                else:
                    # Low confidence → escalate to Tier 2
                    await producer.send("doc.tier2", msg.value)
                
                await consumer.commit()  # commit after successful processing
                
            except Exception as e:
                # Send to DLQ with error context
                await producer.send("doc.dlq", {
                    **msg.value,
                    "error": str(e),
                    "partition": msg.partition,
                    "offset": msg.offset
                })
                await consumer.commit()
    finally:
        await consumer.stop()
        await producer.stop()
\`\`\``,
      },
      {
        heading: "Kafka + KEDA Autoscaling",
        content: `KEDA CONSUMER LAG SCALING:
\`\`\`yaml
apiVersion: keda.sh/v1alpha1
kind: ScaledObject
metadata:
  name: tier1-scaler
spec:
  scaleTargetRef:
    name: tier1-classifier
  minReplicaCount: 2
  maxReplicaCount: 20
  triggers:
  - type: kafka
    metadata:
      bootstrapServers: kafka.kafka-ns:9092
      topic: doc.raw
      consumerGroup: tier1-classifier
      lagThreshold: "50"      # scale up when lag > 50/replica
      offsetResetPolicy: latest
\`\`\`

PARTITIONING STRATEGY:
- Partition by doc_type (DST/MIN/MDR/AER/MER): ensures ordering per type
- 10 partitions × 3 replicas (replication factor)
- Max consumer group size = number of partitions (10)

EXACTLY-ONCE vs AT-LEAST-ONCE:
- AT-LEAST-ONCE: simpler, idempotent consumers required
- EXACTLY-ONCE: Kafka transactions (enable.idempotence=true) — use for financial/audit topics
- ICPA: used at-least-once with idempotent classification (same doc_id = same result)`,
      },
      {
        heading: "Redis in the Stack",
        content: `USE CASES IN AI PLATFORM:

1. Semantic Cache (reduce LLM calls):
\`\`\`python
import redis.asyncio as redis
import hashlib, json

r = redis.from_url("redis://redis:6379")

async def cached_classify(text: str) -> dict:
    key = f"classify:{hashlib.md5(text.encode()).hexdigest()}"
    cached = await r.get(key)
    if cached:
        return json.loads(cached)
    
    result = await actual_classify(text)
    await r.setex(key, 3600, json.dumps(result))  # TTL 1hr
    return result
\`\`\`

2. LangGraph State Persistence:
\`\`\`python
from langgraph.checkpoint.redis import RedisSaver

checkpointer = RedisSaver.from_conn_info(host="redis", port=6379)
graph = workflow.compile(checkpointer=checkpointer)
\`\`\`

3. Rate Limiting (per client_id):
\`\`\`python
async def check_rate_limit(client_id: str, limit: int = 100) -> bool:
    key = f"rate:{client_id}:{int(time.time() // 60)}"  # per-minute window
    count = await r.incr(key)
    if count == 1:
        await r.expire(key, 60)
    return count <= limit
\`\`\``,
      },
    ],
  },

  genai: {
    title: "GenAI Stack — LangGraph, RAG, Agents",
    blocks: [
      {
        heading: "LangGraph Multi-Agent Architecture (ICPA)",
        content: `ICPA AGENT GRAPH:

\`\`\`
                 ┌──────────────┐
                 │ Orchestrator │ (LangGraph StateGraph)
                 └──────┬───────┘
                        │
          ┌─────────────┼─────────────┐
          ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ PII      │  │Classifier│  │Validator │
   │Anonymizer│  │  Agent   │  │  Agent   │
   └──────────┘  └──────────┘  └──────────┘
   (Presidio/    (3-tier)       (NeMo Guards)
    spaCy)
\`\`\`

\`\`\`python
from langgraph.graph import StateGraph, END
from typing import TypedDict, Annotated
import operator

class ClassificationState(TypedDict):
    doc_id: str
    raw_text: str
    anonymized_text: str
    tier1_result: dict
    tier2_result: dict
    final_label: str
    confidence: float
    messages: Annotated[list, operator.add]

workflow = StateGraph(ClassificationState)
workflow.add_node("anonymize", anonymize_pii)
workflow.add_node("tier1_classify", tfidf_classify)
workflow.add_node("tier2_classify", rag_classify)
workflow.add_node("tier3_classify", llm_classify)
workflow.add_node("validate", nemo_validate)

# Conditional routing (key pattern)
def route_after_tier1(state):
    if state["confidence"] >= 0.85:
        return "validate"
    return "tier2_classify"

workflow.add_conditional_edges("tier1_classify", route_after_tier1)
workflow.set_entry_point("anonymize")
workflow.add_edge("anonymize", "tier1_classify")
\`\`\``,
      },
      {
        heading: "RAG Pipeline Architecture",
        content: `FULL RAG STACK:

INDEXING (offline):
\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_cohere import CohereEmbeddings
from langchain_community.vectorstores import Qdrant

splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=64,
    separators=["\\n\\n", "\\n", ". "]
)

embeddings = CohereEmbeddings(model="embed-multilingual-v3.0")  # German support
vectorstore = Qdrant(embeddings=embeddings, collection_name="insurance_docs")

async def ingest_document(doc: str, metadata: dict):
    chunks = splitter.split_text(doc)
    await vectorstore.aadd_texts(chunks, metadatas=[metadata]*len(chunks))
\`\`\`

RETRIEVAL (online):
\`\`\`python
from langchain.retrievers import EnsembleRetriever, BM25Retriever

# Hybrid: BM25 (keyword) + dense (semantic) with RRF
bm25 = BM25Retriever.from_texts(corpus, k=5)
dense = vectorstore.as_retriever(search_kwargs={"k": 5})

hybrid = EnsembleRetriever(
    retrievers=[bm25, dense],
    weights=[0.4, 0.6]  # tune based on RAGAS
)

async def rag_classify(state: ClassificationState):
    docs = await hybrid.ainvoke(state["anonymized_text"])
    context = "\\n".join([d.page_content for d in docs])
    # → pass to LLM with context
\`\`\`

EVALUATION (RAGAS):
\`\`\`python
from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision

result = evaluate(
    dataset=test_dataset,
    metrics=[faithfulness, answer_relevancy, context_precision]
)
# ICPA: faithfulness 72% → 91% after hybrid retrieval + reranking
\`\`\``,
      },
      {
        heading: "Model Selection — GPT vs Llama vs HF",
        content: `DECISION FRAMEWORK (what SanDisk wants you to articulate):

GPT-4o / Claude:
✅ Best quality, function calling, vision
✅ No infra management
❌ Cost at scale, data privacy, vendor lock-in
Use when: high-stakes tasks, external APIs OK, cost < quality concern

Llama 3.x (Ollama/vLLM):
✅ On-prem/private cloud (GDPR compliance!)
✅ Zero marginal inference cost
✅ Fine-tunable
❌ Infra overhead, GPU required for large models
Use when: data privacy required, high volume, controlled environment
ICPA: Ollama llama3.2 for on-prem German insurance data (GDPR)

HuggingFace (smaller models):
✅ Specialized models (NER, classification, translation)
✅ Low latency (bert-base: 10ms vs GPT: 500ms)
✅ Fine-tune on domain data
Use when: specific tasks, latency-sensitive, budget-constrained

QUANTIZATION: llama3.2 Q4_K_M via Ollama → 4GB vs 16GB FP16, ~5% quality loss acceptable for classification

VLLM vs Ollama:
- vLLM: production multi-GPU, PagedAttention for KV cache, higher throughput
- Ollama: local dev, single GPU/CPU, simpler ops
- ICPA used Ollama; production SanDisk → vLLM on K8s with GPU nodes`,
      },
      {
        heading: "NeMo Guardrails & PII (Security)",
        content: `NEMO GUARDRAILS:
\`\`\`python
from nemoguardrails import LLMRails, RailsConfig

config = RailsConfig.from_path("./guardrails_config/")
rails = LLMRails(config)

async def safe_llm_classify(text: str) -> str:
    response = await rails.generate_async(
        messages=[{"role": "user", "content": text}]
    )
    return response

# guardrails_config/config.yml
# define rails:
#   input: check for jailbreak, PII in prompt
#   output: check factuality, no hallucinated policy numbers
\`\`\`

PRESIDIO PII ANONYMIZATION:
\`\`\`python
from presidio_analyzer import AnalyzerEngine
from presidio_anonymizer import AnonymizerEngine

analyzer = AnalyzerEngine()
anonymizer = AnonymizerEngine()

def anonymize_pii(state: ClassificationState) -> ClassificationState:
    results = analyzer.analyze(
        text=state["raw_text"],
        entities=["PERSON", "EMAIL_ADDRESS", "IBAN_CODE", "PHONE_NUMBER"],
        language="de"  # German
    )
    anonymized = anonymizer.anonymize(state["raw_text"], results)
    return {**state, "anonymized_text": anonymized.text}
\`\`\`

GDPR COMPLIANCE STORY: "German insurance emails contain PII — policyholder names, IBANs, addresses. We anonymize before any LLM call, store only anonymized text in ChromaDB, and maintain an audit log of PII entities detected (not the values) for GDPR compliance."`,
      },
    ],
  },

  mlops: {
    title: "MLOps / LLMOps",
    blocks: [
      {
        heading: "MLflow — Model Lifecycle",
        content: `MLFLOW IN ICPA:
\`\`\`python
import mlflow
import mlflow.sklearn

with mlflow.start_run(run_name="tfidf-v2.1"):
    # Log params
    mlflow.log_param("vectorizer", "TfidfVectorizer")
    mlflow.log_param("max_features", 50000)
    mlflow.log_param("ngram_range", "(1,2)")
    
    # Train
    model = train_tfidf(X_train, y_train)
    
    # Log metrics
    mlflow.log_metric("accuracy", 0.94)
    mlflow.log_metric("ragas_faithfulness", 0.91)
    mlflow.log_metric("llm_escalation_rate", 0.12)
    
    # Log model with signature
    mlflow.sklearn.log_model(
        model, "tfidf-classifier",
        registered_model_name="icpa-tier1-classifier"
    )

# Promotion via API
client = mlflow.MlflowClient()
client.transition_model_version_stage(
    name="icpa-tier1-classifier",
    version=3,
    stage="Production"  # Staging → Production after RAGAS gate
)
\`\`\``,
      },
      {
        heading: "LangSmith — LLM Observability",
        content: `LANGSMITH FOR LLM TRACING:
\`\`\`python
from langsmith import Client, traceable

client = Client()

@traceable(name="tier3-llm-classify")
async def llm_classify(text: str, context: str) -> dict:
    # All inputs/outputs/latency auto-logged to LangSmith
    response = await llm.ainvoke(
        prompt.format(text=text, context=context)
    )
    return {"label": response.label, "reasoning": response.reasoning}
\`\`\`

WHAT TO MONITOR IN LANGSMITH:
- Token usage per request (cost tracking)
- Latency distribution (p99 < 3s target)
- RAGAS scores per doc_type
- Prompt regression testing (golden dataset)
- Hallucination detection via faithfulness score

LANGFUSE (alternative to LangSmith, open-source):
- Self-hosted (better for data privacy at SanDisk/Vodafone)
- Same tracing + evaluation capabilities
- Integrates with OTel collector`,
      },
      {
        heading: "A/B Testing Models — Argo Rollouts",
        content: `MODEL A/B TEST SETUP:
\`\`\`yaml
# Argo Rollout with experiment
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      steps:
      - experiment:
          duration: 1h
          templates:
          - name: llama3.2-v1  # control
            specRef: llama-v1
          - name: llama3.2-v2  # challenger
            specRef: llama-v2
          analyses:
          - name: ragas-comparison
            templateName: ragas-analysis
\`\`\`

ANALYSIS TEMPLATE:
\`\`\`yaml
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: ragas-analysis
spec:
  metrics:
  - name: ragas-faithfulness
    provider:
      prometheus:
        address: http://prometheus:9090
        query: |
          avg(ragas_faithfulness{model="{{args.model-name}}"})
    successCondition: result[0] >= 0.88
\`\`\``,
      },
      {
        heading: "Fine-tuning vs RAG vs Prompt Engineering",
        content: `DECISION MATRIX (articulate this in interviews):

PROMPT ENGINEERING:
✅ No cost, immediate
✅ Works well for instruction-following
❌ Context window limit, no domain knowledge
Use when: task is well-defined, model already capable

RAG:
✅ Up-to-date knowledge, citations, no retraining
✅ Cost-effective for large knowledge bases
❌ Retrieval quality bottleneck, latency
Use when: factual QA over documents, knowledge changes frequently
ICPA: RAG for insurance policy lookup in Tier 2

FINE-TUNING:
✅ Model learns domain style/format
✅ Smaller model can match larger base model
❌ Expensive (GPU hours), data curation, drift risk
Use when: consistent output format required, domain-specific terminology
Example: Fine-tune llama3.2 on German insurance classification labels

DEEP LEARNING CONTEXT:
- Overfitting: validation loss rises while train loss falls → dropout, early stopping, data augmentation
- Transfer learning: freeze pretrained layers, fine-tune top layers
- LoRA/QLoRA: parameter-efficient fine-tuning (~1% of params updated)`,
      },
    ],
  },

  microservices: {
    title: "Microservices Architecture & Patterns",
    blocks: [
      {
        heading: "Core Patterns — AI Platform Context",
        content: `PATTERNS SanDisk will probe:

1. API GATEWAY: Single entry point, auth, rate limiting, routing
   → FastAPI gateway → routes to tier1/tier2/tier3 services

2. CIRCUIT BREAKER: Prevent cascade failure
\`\`\`python
from circuitbreaker import circuit

@circuit(failure_threshold=5, recovery_timeout=30)
async def call_tier3_llm(text: str):
    return await llm_service.classify(text)
# After 5 failures → open circuit → fallback to "uncertain" label
\`\`\`

3. SIDECAR (Istio): Service mesh proxy alongside each pod
   → mTLS between services, traffic management, retries

4. SAGA (distributed transactions):
   Ingest doc → classify → store result → notify
   Each step has compensating transaction for rollback

5. CQRS: Separate read/write paths
   - Write: Kafka → classifier → PostgreSQL
   - Read: PostgreSQL replica / Redis cache → API

6. EVENT SOURCING: Kafka as source of truth
   - All classification events stored as immutable log
   - Can replay to rebuild state (audit, debugging)`,
      },
      {
        heading: "Service Communication",
        content: `SYNC (REST/gRPC):
- REST: external APIs, simple request-response
- gRPC: inter-service (binary, streaming, typed)
  → ~7x faster than REST for internal calls

\`\`\`python
# gRPC service definition
syntax = "proto3";
service Classifier {
  rpc Classify (ClassifyRequest) returns (ClassifyResponse);
  rpc ClassifyStream (stream ClassifyRequest) returns (stream ClassifyResponse);
}
\`\`\`

ASYNC (Kafka/Redis PubSub):
- Kafka: reliable, persistent, ordered, replay
- Redis PubSub: ephemeral, low-latency notifications

CHOICE GUIDANCE:
- User-facing latency-sensitive → REST/gRPC
- Background processing → Kafka
- Realtime updates (UI push) → WebSocket + Redis PubSub
- ICPA: used REST (FastAPI) for sync tier routing, Kafka for async batch ingestion`,
      },
      {
        heading: "App Configuration — Modern Techniques",
        content: `JD MENTIONS: "Modern Application configuration techniques"

PATTERNS:
1. 12-Factor App: config from environment variables (not code)

2. K8s ConfigMaps + Secrets:
\`\`\`yaml
envFrom:
- configMapRef:
    name: ai-platform-config
- secretRef:
    name: ai-platform-secrets  # from Vault/AWS Secrets Manager
\`\`\`

3. External Secrets Operator (ESO):
   AWS Secrets Manager / HashiCorp Vault → K8s Secret (sync)
   No secrets in Git ever

4. Feature Flags (LaunchDarkly/flagd):
\`\`\`python
if feature_flags.get("enable_llama3_3"):
    model = "llama3.3"
else:
    model = "llama3.2"
\`\`\`

5. Kustomize overlays:
   base/ → overlays/dev, overlays/staging, overlays/prod
   Helm values files per env (already covered)

ICPA: "We never stored API keys in Docker images. All secrets from AWS Secrets Manager via External Secrets Operator into K8s Secrets. ConfigMaps for non-sensitive config (model names, thresholds). Feature flags for gradual model rollouts."`,
      },
    ],
  },

  behavioral: {
    title: "Behavioral — STAR Stories",
    blocks: [
      {
        heading: "Influence Dev Teams to Adopt AI",
        content: `JD: "Strong desire and ability to influence development teams and help them adopt AI"

STAR:
S: At Publicis Sapient, dev teams were skeptical of AI tools adding complexity
T: I needed to build internal adoption of GenAI patterns without mandating it
A: Built a self-service AI playground — FastAPI + Streamlit wrapper around our RAG pipeline. Teams could test their own docs without writing any AI code. Ran 3 lunch-and-learn sessions with live demos. Created a decision tree: "should your use case use RAG, fine-tuning, or prompt engineering?" — shared as Confluence playbook.
R: 4 teams adopted RAG patterns within 2 months. Reduced GenAI PoC time from 6 weeks to 10 days with the reusable platform.

KEY QUOTE: "I believe the best way to drive AI adoption isn't evangelizing — it's reducing friction. Make the first success easy, and teams self-select."`,
      },
      {
        heading: "Platform Mindset Story",
        content: `JD: "Have a platform mindset and build common, reusable solutions"

STAR:
S: Multiple teams at Vodafone were building one-off GenAI PoCs — separate vector stores, different embedding models, no shared observability
T: As the AI Platform lead for ICPA, I saw the fragmentation risk
A: Extracted ICPA's core into a reusable platform: standardized the 3-tier classification pipeline as a template, published Helm charts for RAG + LLM deployment, defined OTel instrumentation standards (span naming, metric naming), published RAGAS evaluation templates as CI gates
R: ICPA became the reference architecture. Two subsequent AI projects at Vodafone adopted it, cutting their initial setup from 8 weeks to 2 weeks.`,
      },
      {
        heading: "Technical Deep Dive Under Pressure",
        content: `"Tell me about a time you had to make a critical technical decision quickly"

STAR:
S: ICPA in production — LLM escalation rate spiked from 12% to 38% overnight. 50K docs/day but Ollama was timing out
T: Fix within 4 hours before business hours
A: Used OTel traces to identify: Tier 2 ChromaDB retrieval latency had jumped from 200ms to 900ms. Root cause: ChromaDB index fragmentation after a bulk re-indexing job. Implemented two fixes: (1) ChromaDB HNSW index rebuild with correct ef_construction, (2) added circuit breaker in LangGraph to bypass Tier 2 and go directly to Tier 3 with context from Redis cache.
R: Escalation rate back to 14% within 2 hours. Added ChromaDB health check to CI pipeline to prevent recurrence.`,
      },
      {
        heading: "Cross-functional / Global Collaboration",
        content: `JD: "Work effectively in a global organization, across time zones"

ICPA was built with a distributed team: Bangalore AI/ML team + Germany business stakeholders + London DevOps team.

Key practices:
- Async-first: all design decisions documented in Confluence before meetings
- Architecture Decision Records (ADRs): for major choices (why ChromaDB vs Qdrant, why Ollama vs GPT-4)
- OKR alignment: tied RAGAS faithfulness target to business KPI (classification error rate)
- Regular demos to German stakeholders — translated metrics into business language: "12% of emails still need human review" not "12% LLM escalation rate"`,
      },
      {
        heading: "Agile / SRE Practices",
        content: `AGILE:
- Sprint ceremonies: daily standup, sprint planning, retro, demo
- Definition of Done: unit tests + BDD scenarios passing, OTel instrumented, Helm chart updated, Confluence documented
- Story pointing: Fibonacci; AI stories often underestimated → added AI-specific buffer (research spikes)

SRE PRACTICES:
- SLOs: 99.5% availability, <500ms p99 classification latency
- Error budgets: calculated monthly, reviewed in sprint retros
- Runbooks: for each alert in Grafana (what to check, escalation path)
- Chaos engineering: intentionally killed ChromaDB pods to verify circuit breaker works
- Postmortems: blameless, 5-why root cause analysis, published to team Confluence`,
      },
    ],
  },

  questions: {
    title: "Questions to Ask SanDisk",
    blocks: [
      {
        heading: "Technical Questions",
        content: `1. "What's the current state of the AI platform — greenfield, or are you migrating existing AI workloads to it?"

2. "Which vector store are you using today, and what's driving the scale requirements — document count, query rate, or embedding dimensions?"

3. "Is the K8s environment OpenShift or vanilla EKS/GKE? Any plans to standardize?"

4. "How are you currently handling LLM inference at scale — vLLM, Triton, or managed APIs like Azure OpenAI?"

5. "What's the observability stack today — is OTel Collector already deployed, or is that part of what I'd be building?"`,
      },
      {
        heading: "Platform & Team Questions",
        content: `6. "What does 'self-service for developers' mean in practice here — are teams deploying models via GitOps PRs, or is there a UI portal?"

7. "How do you currently handle model governance — approval workflows before a model goes to production?"

8. "What's the team structure — platform engineers + AI engineers co-located, or separate platform and product teams?"

9. "What's the biggest pain point you're trying to solve in the first 6 months for this hire?"

10. "How do you measure success for the AI platform — developer adoption, model performance, cost reduction?"`,
      },
    ],
  },
};

export default function SanDiskPrep() {
  const [active, setActive] = useState("overview");
  const [openBlock, setOpenBlock] = useState(null);
  const [search, setSearch] = useState("");

  const section = data[active];

  const filteredBlocks = search
    ? section.blocks.filter(
        (b) =>
          b.heading.toLowerCase().includes(search.toLowerCase()) ||
          b.content.toLowerCase().includes(search.toLowerCase())
      )
    : section.blocks;

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Inter', system-ui, sans-serif", background: "#0f1117", color: "#e2e8f0" }}>
      {/* Sidebar */}
      <div style={{
        width: 230, minWidth: 230, background: "#161b27", borderRight: "1px solid #1e2736",
        overflowY: "auto", padding: "16px 0"
      }}>
        <div style={{ padding: "0 16px 16px", borderBottom: "1px solid #1e2736" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#60a5fa", letterSpacing: "0.1em", textTransform: "uppercase" }}>SanDisk Interview</div>
          <div style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Prep Guide 2026</div>
        </div>
        {SECTIONS.map((s) => (
          <button
            key={s.id}
            onClick={() => { setActive(s.id); setOpenBlock(null); setSearch(""); }}
            style={{
              display: "block", width: "100%", textAlign: "left",
              padding: "9px 16px", fontSize: 12.5, fontWeight: active === s.id ? 600 : 400,
              background: active === s.id ? "#1e3a5f" : "transparent",
              color: active === s.id ? "#93c5fd" : "#94a3b8",
              border: "none", cursor: "pointer",
              borderLeft: active === s.id ? "3px solid #3b82f6" : "3px solid transparent",
              transition: "all 0.15s"
            }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "28px 32px" }}>
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#f1f5f9", margin: 0 }}>{section.title}</h1>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search this section..."
            style={{
              marginTop: 12, width: "100%", maxWidth: 400, padding: "7px 12px",
              background: "#1e2736", border: "1px solid #2d3748", borderRadius: 6,
              color: "#e2e8f0", fontSize: 13, outline: "none"
            }}
          />
        </div>

        {/* Blocks */}
        {filteredBlocks.map((block, i) => (
          <div
            key={i}
            style={{
              background: "#161b27", border: "1px solid #1e2736",
              borderRadius: 8, marginBottom: 12, overflow: "hidden"
            }}
          >
            <button
              onClick={() => setOpenBlock(openBlock === i ? null : i)}
              style={{
                width: "100%", textAlign: "left", padding: "14px 18px",
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 600, color: "#e2e8f0" }}>{block.heading}</span>
              <span style={{ color: "#60a5fa", fontSize: 18, fontWeight: 300 }}>
                {openBlock === i ? "−" : "+"}
              </span>
            </button>
            {openBlock === i && (
              <div style={{ padding: "0 18px 18px", borderTop: "1px solid #1e2736" }}>
                <pre style={{
                  margin: "14px 0 0", fontSize: 12.5, lineHeight: 1.7,
                  whiteSpace: "pre-wrap", wordBreak: "break-word",
                  color: "#cbd5e1", fontFamily: "inherit"
                }}>
                  {block.content.split("```").map((part, idx) => {
                    if (idx % 2 === 1) {
                      const lines = part.split("\n");
                      const lang = lines[0].trim();
                      const code = lines.slice(1).join("\n");
                      return (
                        <span key={idx}>
                          <code style={{
                            display: "block", background: "#0d1117",
                            border: "1px solid #2d3748", borderRadius: 6,
                            padding: "12px 14px", fontSize: 11.5,
                            fontFamily: "'Fira Code', 'Cascadia Code', monospace",
                            color: "#a5f3fc", margin: "8px 0", whiteSpace: "pre-wrap"
                          }}>
                            {lang && <span style={{ color: "#64748b", fontSize: 10 }}>{lang}{"\n"}</span>}
                            {code}
                          </code>
                        </span>
                      );
                    }
                    return <span key={idx}>{part}</span>;
                  })}
                </pre>
              </div>
            )}
          </div>
        ))}

        {filteredBlocks.length === 0 && (
          <div style={{ color: "#64748b", fontSize: 14, marginTop: 40, textAlign: "center" }}>
            No results for "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
