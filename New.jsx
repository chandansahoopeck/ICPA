import { useState } from "react";

const SECTIONS = [
  {
    id: "overview",
    icon: "🏗️",
    label: "ICPA Overview",
    color: "#00D4FF",
    subsections: [
      {
        title: "What is ICPA?",
        content: `ICPA (Intelligent Claims Process Automation / Intelligent Customer Process Automation) is a production system at Vodafone Germany that automates the processing of German insurance damage-claim emails (Schadenregulierung). 

Real-world context from your screenshots:
• Emails arrive at schaden.regulierung@vodafone.com from external companies like Real-Bau-GmbH
• Subject format: "WG: [bzgl. M-523113 | 2100042064] Vodafone Rechnung 2100042064 Objekt: M-523113"
• Attachments include Mahnung (dunning letters), Storno (cancellation) PDFs
• Processed through the ICPA portal at s.de.vodafone.com — creating Email Triage (ET) cases like ET-289077
• System resolves cases as RESOLVED-COMPLETED automatically`,
        code: `# Real email metadata extracted by your pipeline
email_meta = {
    "case_id": "ET-289077",
    "from": "pascal.block@Real-Bau-GmbH.de",
    "to": "schaden.regulierung@vodafone.com",
    "subject": "WG: [bzgl. M-523113 | 2100042064] Vodafone Rechnung 2100042064",
    "attachments": ["Mahnung Vodafone 210004206.pdf", "Storno Rg 2100042064.pdf"],
    "language": "de",
    "case_type": "DST"  # Damage Settlement — parent case
}

# 5 case types in ICPA (from your Confluence screenshot):
CASE_TYPES = {
    "DST": "Damage Settlement (Parent Case) — created from Email Triage",
    "MIN": "Missing Document Invoice — retrieve invoice, send to customer",
    "MDR": "Missing Document Damage Report — fetch damage report from customer upload",
    "AER": "Automatic Email Response — send templated reply for known topics",
    "MER": "Manual Email Response — agent writes custom reply body"
}`
      },
      {
        title: "The 3-Layer Architecture — End to End",
        content: `Your 3-tier classification service handles 10,000+ emails/month with zero API inference cost on 95% of traffic. Each tier escalates only what it can't resolve — classic cost-aware design.

Tier 1 — TF-IDF Fast Path: ~10ms, handles ~75% of traffic — known/frequent German claim patterns
Tier 2 — ChromaDB RAG: ~100ms, handles ~20% — semantically similar but not exact matches
Tier 3 — Ollama llama3.2 LLM: ~1.5s, handles only ~5% — novel, ambiguous, edge-case emails

Total cost: ₹0 on 95% of traffic (tiers 1+2 are local/free). LLM tier uses Ollama (local), so even tier 3 = zero external API cost.`,
        code: `# Tier 1: TF-IDF Fast Path
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
import joblib

class TFIDFClassifier:
    def __init__(self, model_path="tfidf_model.pkl"):
        self.vectorizer = joblib.load(f"{model_path}_vectorizer")
        self.clf = joblib.load(f"{model_path}_clf")
        self.CONFIDENCE_THRESHOLD = 0.85  # tunable via REST API

    def classify(self, text: str) -> dict:
        vec = self.vectorizer.transform([text])
        proba = self.clf.predict_proba(vec)[0]
        confidence = max(proba)
        label = self.clf.classes_[proba.argmax()]
        return {"label": label, "confidence": confidence, "tier": 1}

# FastAPI orchestration — the 3-tier pipeline
from fastapi import FastAPI
from chromadb import Client
from langchain_ollama import OllamaLLM

app = FastAPI()
tfidf_clf = TFIDFClassifier()
chroma_client = Client()
llm = OllamaLLM(model="llama3.2")

@app.post("/classify")
async def classify_email(email_text: str, subject: str):
    # Tier 1
    result = tfidf_clf.classify(email_text)
    if result["confidence"] >= 0.85:
        return {**result, "tier_used": 1, "latency_ms": 10}

    # Tier 2 — RAG
    collection = chroma_client.get_collection("claims_kb")
    results = collection.query(query_texts=[email_text], n_results=3)
    if results["distances"][0][0] < 0.25:  # close semantic match
        return {"label": results["metadatas"][0][0]["label"],
                "confidence": 1 - results["distances"][0][0],
                "tier_used": 2, "latency_ms": 100}

    # Tier 3 — LLM escalation
    prompt = f"""Classify this German insurance claim email into one of:
    DST, MIN, MDR, AER, MER.
    Email: {email_text[:1000]}
    Subject: {subject}
    Respond with JSON: {{"label": "...", "reason": "..."}}"""
    response = llm.invoke(prompt)
    return {"raw_llm": response, "tier_used": 3, "latency_ms": 1500}`
      }
    ]
  },
  {
    id: "extract_msg",
    icon: "📧",
    label: "extract_msg",
    color: "#FF6B35",
    subsections: [
      {
        title: "extract_msg — Reading Outlook .msg Files",
        content: `Outlook saves emails as binary .msg files (MAPI format). Python's extract_msg library decodes these — giving you the sender, body, subject, attachments, and all metadata without needing Outlook installed.

Why this matters in ICPA: Vodafone receives thousands of German claim emails as .msg files from the Outlook mail server. Your pipeline reads them programmatically, no human needed.`,
        code: `import extract_msg
import os
from pathlib import Path

def process_outlook_email(msg_path: str) -> dict:
    """Extract all data from an Outlook .msg file"""
    msg = extract_msg.Message(msg_path)
    
    # Core fields
    email_data = {
        "sender": msg.sender,           # "Pascal Block <pascal.block@Real-Bau-GmbH.de>"
        "to": msg.to,
        "cc": msg.cc,
        "subject": msg.subject,          # "WG: [bzgl. M-523113 | 2100042064]..."
        "date": msg.date,                # "1 Jun 2026 16:34:08"
        "body": msg.body,                # Plain text body
        "html_body": msg.htmlBody,       # HTML version if available
    }
    
    # Extract attachments (PDFs, images etc.)
    attachments = []
    for attachment in msg.attachments:
        att_data = {
            "filename": attachment.longFilename or attachment.shortFilename,
            "mime_type": attachment.mimetype,
            "data": attachment.data      # raw bytes
        }
        # Save attachment to disk for AWS Textract OCR
        att_path = Path(f"/tmp/attachments/{att_data['filename']}")
        att_path.write_bytes(att_data["data"])
        att_data["saved_path"] = str(att_path)
        attachments.append(att_data)
    
    email_data["attachments"] = attachments
    msg.close()  # IMPORTANT: always close
    return email_data

# Batch process a mailbox folder
def batch_process_mailbox(folder: str) -> list:
    results = []
    for msg_file in Path(folder).glob("*.msg"):
        try:
            data = process_outlook_email(str(msg_file))
            results.append(data)
        except Exception as e:
            print(f"Failed {msg_file}: {e}")
    return results

# Your ICPA use case: extract invoice/object numbers from subjects
import re

def extract_case_numbers(subject: str) -> dict:
    """
    Input: "WG: [bzgl. M-523113 | 2100042064] Vodafone Rechnung 2100042064 Objekt: M- 523113"
    """
    obj_match = re.search(r'M[-\s](\d+)', subject)
    invoice_match = re.search(r'(\d{10})', subject)  # 10-digit invoice
    return {
        "object_number": obj_match.group(1) if obj_match else None,
        "invoice_number": invoice_match.group(1) if invoice_match else None,
    }
# → {"object_number": "523113", "invoice_number": "2100042064"}`
      }
    ]
  },
  {
    id: "sklearn",
    icon: "🤖",
    label: "scikit-learn / TF-IDF",
    color: "#4CAF50",
    subsections: [
      {
        title: "TF-IDF + Logistic Regression (Tier 1)",
        content: `TF-IDF (Term Frequency-Inverse Document Frequency) is the backbone of Tier 1. It converts text to numeric vectors based on word importance across the corpus. Combined with Logistic Regression, it's blazing fast (~10ms) and interpretable.

TF = (count of word in doc) / (total words in doc)
IDF = log(total docs / docs containing word)
TF-IDF = TF × IDF  →  high for rare-but-present words

Interview tip: "Why TF-IDF over embeddings for Tier 1?" → Speed (10ms vs 100ms), interpretability, no GPU needed, perfect for high-frequency known patterns.`,
        code: `import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# --- Data Prep ---
df = pd.read_csv("icpa_emails.csv")
# Columns: email_text, label (DST/MIN/MDR/AER/MER), confidence

# German-aware text preprocessing
import re
def preprocess_german(text: str) -> str:
    text = text.lower()
    text = re.sub(r'[^\w\säöüß]', ' ', text)  # keep German chars
    text = re.sub(r'\s+', ' ', text).strip()
    return text

df['clean_text'] = df['email_text'].apply(preprocess_german)

X_train, X_test, y_train, y_test = train_test_split(
    df['clean_text'], df['label'], test_size=0.2, stratify=df['label'], random_state=42
)

# --- Pipeline ---
pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        max_features=10_000,
        ngram_range=(1, 2),        # unigrams + bigrams
        sublinear_tf=True,         # log(1+tf) smoothing
        min_df=2,                  # ignore ultra-rare terms
        analyzer='word',
        token_pattern=r'(?u)\b\w+\b'  # handles German compound words
    )),
    ('clf', LogisticRegression(
        C=5.0,                     # inverse regularization strength
        max_iter=1000,
        class_weight='balanced',   # handles imbalanced classes
        solver='lbfgs',
        multi_class='multinomial'
    ))
])

pipeline.fit(X_train, y_train)

# Evaluation
y_pred = pipeline.predict(X_test)
print(classification_report(y_test, y_pred, target_names=['AER','DST','MDR','MER','MIN']))

# Cross-validation for robustness
cv_scores = cross_val_score(pipeline, df['clean_text'], df['label'], cv=5)
print(f"CV Accuracy: {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

# Confidence extraction (key for tier escalation logic)
proba = pipeline.predict_proba(["Rechnung nicht bezahlt, Objekt M-523113"])
labels = pipeline.classes_
confidence_map = dict(zip(labels, proba[0]))
# → {'AER': 0.02, 'DST': 0.89, 'MDR': 0.04, 'MER': 0.03, 'MIN': 0.02}

joblib.dump(pipeline, "icpa_tfidf_pipeline.pkl")`
      },
      {
        title: "MLOps: MLflow Experiment Tracking",
        content: `MLflow tracks every training run — hyperparameters, metrics, model artifacts. Critical for comparing TF-IDF variants, choosing thresholds, and auditing production models.`,
        code: `import mlflow
import mlflow.sklearn

mlflow.set_experiment("icpa-tier1-tfidf")

with mlflow.start_run(run_name="tfidf_logistic_v3"):
    # Log hyperparameters
    mlflow.log_param("max_features", 10_000)
    mlflow.log_param("ngram_range", "(1,2)")
    mlflow.log_param("C", 5.0)
    mlflow.log_param("confidence_threshold", 0.85)
    
    pipeline.fit(X_train, y_train)
    
    # Log metrics
    train_acc = pipeline.score(X_train, y_train)
    test_acc = pipeline.score(X_test, y_test)
    mlflow.log_metric("train_accuracy", train_acc)
    mlflow.log_metric("test_accuracy", test_acc)
    
    # Log confusion matrix as artifact
    cm = confusion_matrix(y_test, y_pred)
    np.savetxt("/tmp/confusion_matrix.csv", cm, delimiter=",")
    mlflow.log_artifact("/tmp/confusion_matrix.csv")
    
    # Log the model itself
    mlflow.sklearn.log_model(pipeline, "tfidf_pipeline",
                             registered_model_name="ICPA-Tier1-Classifier")
    
    print(f"Run ID: {mlflow.active_run().info.run_id}")`
      }
    ]
  },
  {
    id: "pandas_numpy",
    icon: "🐼",
    label: "pandas / numpy",
    color: "#9C27B0",
    subsections: [
      {
        title: "Data Pipeline: 10,000 Emails → Training Dataset",
        content: `Your ML data pipeline converts raw .msg files into labelled training datasets. pandas handles the tabular transformation; numpy handles numerical operations on embeddings and confidence arrays.

Key pipeline step: extract → OCR → PII anonymize → translate → label → export`,
        code: `import pandas as pd
import numpy as np
from datetime import datetime

# --- Building the dataset from extracted emails ---
def build_training_dataset(processed_emails: list) -> pd.DataFrame:
    df = pd.DataFrame(processed_emails)
    
    # 1. Parse dates properly
    df['date'] = pd.to_datetime(df['date'], format='mixed', utc=True)
    df['hour'] = df['date'].dt.hour
    df['weekday'] = df['date'].dt.day_name()
    
    # 2. Feature engineering
    df['text_length'] = df['clean_text'].str.len()
    df['word_count'] = df['clean_text'].str.split().str.len()
    df['has_attachment'] = df['attachments'].apply(lambda x: len(x) > 0)
    df['attachment_count'] = df['attachments'].apply(len)
    
    # Extract structured fields from subject
    df[['object_number','invoice_number']] = df['subject'].apply(
        lambda s: pd.Series(extract_case_numbers(s))
    )
    
    # 3. Handle missing values
    df['body'] = df['body'].fillna('')
    df['cc'] = df['cc'].fillna('none')
    
    # 4. Label distribution check
    print("Label distribution:")
    print(df['label'].value_counts(normalize=True).round(3))
    
    return df

# --- NumPy: Working with confidence arrays ---
def analyze_confidence_distribution(confidence_scores: list) -> dict:
    arr = np.array(confidence_scores)
    
    stats = {
        "mean": np.mean(arr),
        "std": np.std(arr),
        "p50": np.percentile(arr, 50),
        "p75": np.percentile(arr, 75),
        "p90": np.percentile(arr, 90),
        "p95": np.percentile(arr, 95),
        # % of traffic hitting each tier
        "tier1_rate": np.mean(arr >= 0.85),   # ~0.75
        "tier2_rate": np.mean((arr >= 0.60) & (arr < 0.85)),  # ~0.20
        "tier3_rate": np.mean(arr < 0.60),     # ~0.05
    }
    return stats

# --- Batch embedding similarity (numpy cosine sim) ---
def cosine_similarity_batch(query_vec: np.ndarray, corpus_vecs: np.ndarray) -> np.ndarray:
    """Faster than sklearn for large batches"""
    query_norm = query_vec / (np.linalg.norm(query_vec) + 1e-8)
    corpus_norms = corpus_vecs / (np.linalg.norm(corpus_vecs, axis=1, keepdims=True) + 1e-8)
    return corpus_norms @ query_norm  # shape: (N,)`
      }
    ]
  },
  {
    id: "rag",
    icon: "🔍",
    label: "RAG & ChromaDB",
    color: "#FF9800",
    subsections: [
      {
        title: "Tier 2: ChromaDB RAG Semantic Retrieval",
        content: `ChromaDB stores embeddings of historical claim emails with their resolved labels. When Tier 1 lacks confidence, Tier 2 does semantic similarity search — finding the closest past case.

Your RAG evaluation platform improved faithfulness from 72% → 91% using MMR retrieval + metadata filtering + prompt grounding (RAGAS metrics).`,
        code: `import chromadb
from chromadb.utils import embedding_functions
from langchain_community.vectorstores import Chroma
from langchain_cohere import CohereEmbeddings
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import EmbeddingsFilter

# --- Build the knowledge base ---
chroma_client = chromadb.PersistentClient(path="./icpa_chromadb")

# Use Cohere embeddings (multilingual — handles German!)
cohere_ef = embedding_functions.CohereEmbeddingFunction(
    api_key="COHERE_API_KEY", model_name="embed-multilingual-v3.0"
)

collection = chroma_client.get_or_create_collection(
    name="claims_kb",
    embedding_function=cohere_ef,
    metadata={"hnsw:space": "cosine"}
)

# Index historical resolved emails
def index_resolved_emails(resolved_cases: list):
    documents, metadatas, ids = [], [], []
    for case in resolved_cases:
        documents.append(case['clean_text'])
        metadatas.append({
            "case_type": case['label'],      # DST, MIN, MDR, etc.
            "object_number": case.get('object_number', ''),
            "invoice_number": case.get('invoice_number', ''),
            "resolved_date": case['resolved_date'],
        })
        ids.append(case['case_id'])
    collection.add(documents=documents, metadatas=metadatas, ids=ids)

# --- MMR Retrieval (avoids redundant results) ---
def rag_classify(email_text: str, email_meta: dict) -> dict:
    # Metadata pre-filter — only look at cases with same invoice pattern
    where_filter = {}
    if email_meta.get('invoice_number'):
        where_filter = {"invoice_number": email_meta['invoice_number']}
    
    results = collection.query(
        query_texts=[email_text],
        n_results=5,
        where=where_filter if where_filter else None,
        include=["distances", "metadatas", "documents"]
    )
    
    distances = results['distances'][0]
    best_distance = distances[0]
    best_meta = results['metadatas'][0][0]
    
    # RAGAS-informed threshold: < 0.25 cosine distance = confident match
    if best_distance < 0.25:
        return {
            "label": best_meta['case_type'],
            "confidence": round(1 - best_distance, 3),
            "tier_used": 2,
            "retrieved_case": results['ids'][0][0],
            "context": results['documents'][0][0][:300]
        }
    return {"escalate_to_tier3": True}

# --- RAGAS Evaluation (your RAG Streaming Evaluation Platform) ---
from ragas import evaluate
from ragas.metrics import faithfulness, context_precision, answer_relevancy
from datasets import Dataset

def evaluate_rag_quality(rag_results: list) -> dict:
    dataset = Dataset.from_list([{
        "question": r['email_text'],
        "answer": r['generated_response'],
        "contexts": [r['retrieved_context']],
        "ground_truth": r['correct_label']
    } for r in rag_results])
    
    scores = evaluate(dataset, metrics=[faithfulness, context_precision, answer_relevancy])
    return scores
    # Before tuning: faithfulness ~0.72
    # After MMR + metadata filter + prompt grounding: ~0.91`
      }
    ]
  },
  {
    id: "dsa",
    icon: "⚡",
    label: "DSA Patterns",
    color: "#E91E63",
    subsections: [
      {
        title: "DSA Patterns Most Relevant to ICPA",
        content: `Interview-critical patterns that directly apply to your pipeline. You'll be asked about these in the context of real-world AI systems.`,
        code: `# --- PATTERN 1: Priority Queue (Heap) ---
# Use case: Email priority routing — urgent claims (Mahnung/dunning) processed first
import heapq
from dataclasses import dataclass, field

@dataclass(order=True)
class EmailTask:
    priority: int          # lower = higher priority
    case_id: str = field(compare=False)
    email_text: str = field(compare=False)

priority_queue = []

def enqueue_email(case_id, email_text, email_type):
    priority = {"Mahnung": 1, "DST": 2, "MIN": 3, "AER": 4}.get(email_type, 5)
    heapq.heappush(priority_queue, EmailTask(priority, case_id, email_text))

def dequeue_next():
    return heapq.heappop(priority_queue)

# O(log n) push/pop — scales to 10,000+ emails in queue

# --- PATTERN 2: Sliding Window ---
# Use case: Rate limiting LLM API calls (Tier 3) — max 100 calls/minute
from collections import deque
import time

class RateLimiter:
    def __init__(self, max_calls: int, window_seconds: int):
        self.max_calls = max_calls
        self.window = window_seconds
        self.calls = deque()  # stores timestamps

    def can_call(self) -> bool:
        now = time.time()
        # Remove timestamps outside the window
        while self.calls and self.calls[0] < now - self.window:
            self.calls.popleft()
        if len(self.calls) < self.max_calls:
            self.calls.append(now)
            return True
        return False  # backpressure — queue the email

llm_limiter = RateLimiter(max_calls=100, window_seconds=60)

# --- PATTERN 3: LRU Cache ---
# Use case: Cache TF-IDF classification results for duplicate emails
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1024)
def classify_cached(text_hash: str, text: str) -> str:
    return tfidf_pipeline.predict([text])[0]

def classify_with_cache(email_text: str) -> str:
    text_hash = hashlib.md5(email_text.encode()).hexdigest()
    return classify_cached(text_hash, email_text)

# --- PATTERN 4: Two Pointers (chunking) ---
# Use case: Splitting long email bodies for RAG context windows
def chunk_email_text(text: str, chunk_size: int = 512, overlap: int = 50) -> list:
    tokens = text.split()
    chunks = []
    left = 0
    while left < len(tokens):
        right = min(left + chunk_size, len(tokens))
        chunks.append(" ".join(tokens[left:right]))
        left = right - overlap  # overlap ensures context continuity
    return chunks

# --- PATTERN 5: Graph / BFS (LangGraph state machine) ---
# ICPA case flow: Email Triage → DST → MIN/MDR/AER/MER
from collections import defaultdict

case_flow_graph = defaultdict(list)
case_flow_graph["ET"].append("DST")      # EmailTriage → DamageSettlement
case_flow_graph["DST"].extend(["MIN", "MDR", "AER", "MER"])
case_flow_graph["MIN"].append("RESOLVED")
case_flow_graph["MDR"].append("RESOLVED")

def get_all_reachable_states(start: str) -> set:
    """BFS to find all possible case states from a starting point"""
    visited, queue = set(), [start]
    while queue:
        node = queue.pop(0)
        if node not in visited:
            visited.add(node)
            queue.extend(case_flow_graph[node])
    return visited
# get_all_reachable_states("ET") → {"ET","DST","MIN","MDR","AER","MER","RESOLVED"}`
      }
    ]
  },
  {
    id: "system_design",
    icon: "🏛️",
    label: "System Design",
    color: "#00BCD4",
    subsections: [
      {
        title: "ICPA System Design — Full Architecture",
        content: `How to present the ICPA system design in an interview. Key components, data flows, failure modes, and trade-offs.`,
        code: `"""
ICPA SYSTEM DESIGN — INTERVIEW ANSWER TEMPLATE

┌─────────────────────────────────────────────────────────────────┐
│                         EMAIL INGESTION                          │
│  Outlook Server → extract_msg → S3 Raw Storage                  │
│  (Trigger: SQS queue, ~10k emails/month)                         │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                      PRE-PROCESSING PIPELINE                      │
│  1. AWS Textract OCR  (for PDF attachments: Mahnung, Storno)     │
│  2. German→English translation (Helsinki-NLP/opus-mt)            │
│  3. PII Anonymisation (spaCy NER + regex)                        │
│     • IBAN, phone, name, Vodafone account numbers masked         │
│  4. Structured data extraction (invoice#, object#, case type)   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    3-TIER CLASSIFICATION                          │
│                                                                   │
│  Email Text                                                       │
│      │                                                            │
│      ▼                                                            │
│  [TIER 1] TF-IDF + LR  →  confidence ≥ 0.85?  → ROUTE          │
│      │ NO (25%)                                                   │
│      ▼                                                            │
│  [TIER 2] ChromaDB RAG →  distance < 0.25?     → ROUTE          │
│      │ NO (5%)                                                    │
│      ▼                                                            │
│  [TIER 3] Ollama llama3.2                       → ROUTE          │
│                                                                   │
│  Routing: DST→MDR/MIN/AER/MER case creation in ICPA portal      │
└─────────────────────┬───────────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────────┐
│                    OBSERVABILITY & MLOPS                          │
│  LangSmith: trace every RAG + LLM call                           │
│  MLflow: track model variants, accuracy, confidence histograms   │
│  Prometheus + Grafana: tier distribution, latency percentiles    │
│  EFK Stack: application logs                                      │
└─────────────────────────────────────────────────────────────────┘

KEY DESIGN DECISIONS (interview talking points):

1. WHY 3-TIER vs single LLM?
   - Cost: LLM API = $0.002/call × 10,000/month = $20/month saved
   - Latency: P95 latency drops from 1.5s → 15ms average
   - Reliability: Tiers 1+2 work even if LLM is down

2. WHY ChromaDB over Pinecone/Weaviate?
   - Free, local deployment, no data egress (GDPR compliance for German data!)
   - Sufficient for 10k-100k document corpus

3. WHY Ollama for LLM?
   - Zero API cost, data never leaves Vodafone infra (PII compliance)
   - llama3.2 sufficient for structured classification

4. SCALING BOTTLENECK?
   - Tier 3 (LLM): Rate limiter + queue with Redis
   - Textract OCR: parallel async calls with asyncio.gather()
   - ChromaDB: HNSW index handles up to 1M vectors efficiently
"""

# Interview follow-up: "How would you scale to 10x traffic?"
scaling_plan = {
    "tier1_tfidf": "Stateless, add replicas behind Kubernetes HPA",
    "tier2_chromadb": "Shard by case type; or migrate to Qdrant for distributed mode",
    "tier3_llm": "vLLM serving + batch inference; or move to async queue (Celery/Kafka)",
    "preprocessing": "AWS Textract async API + SQS for parallel PDF processing",
    "observability": "Increase Prometheus scrape targets; add Kafka for LangSmith event streaming"
}`
      }
    ]
  },
  {
    id: "streaming",
    icon: "🌊",
    label: "Streaming & Async",
    color: "#3F51B5",
    subsections: [
      {
        title: "WebSocket Streaming — RAG Evaluation Platform",
        content: `Your RAG Streaming Evaluation Platform streams LLM responses in real-time via WebSocket, then auto-evaluates with RAGAS. This is production-grade streaming architecture.`,
        code: `# FastAPI WebSocket streaming + RAGAS evaluation
from fastapi import FastAPI, WebSocket
from langchain_ollama import OllamaLLM
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from langchain_core.callbacks import AsyncCallbackHandler
import asyncio, json

app = FastAPI()

class WebSocketStreamCallback(AsyncCallbackHandler):
    def __init__(self, websocket: WebSocket):
        self.websocket = websocket
        self.full_response = ""

    async def on_llm_new_token(self, token: str, **kwargs):
        self.full_response += token
        await self.websocket.send_json({"type": "token", "data": token})

    async def on_llm_end(self, response, **kwargs):
        await self.websocket.send_json({"type": "done", "full": self.full_response})

@app.websocket("/ws/classify")
async def classify_stream(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_json()
    email_text = data['email_text']

    # Stream LLM response
    callback = WebSocketStreamCallback(websocket)
    llm = OllamaLLM(model="llama3.2", callbacks=[callback], streaming=True)

    # Retrieve context first
    context = rag_retrieve(email_text)
    prompt = f"Context: {context}\n\nClassify this claim email: {email_text}"

    # This streams tokens back to the client in real-time
    response = await llm.ainvoke(prompt)

    # After streaming completes, evaluate with RAGAS async
    asyncio.create_task(evaluate_and_publish(email_text, response, context))

async def evaluate_and_publish(question, answer, context):
    """Run RAGAS eval and publish to Kafka"""
    from aiokafka import AIOKafkaProducer
    scores = evaluate_rag_quality([{
        "email_text": question, "generated_response": answer,
        "retrieved_context": context, "correct_label": "DST"
    }])
    
    producer = AIOKafkaProducer(bootstrap_servers='kafka:9092')
    await producer.start()
    await producer.send('ragas-metrics', json.dumps(scores).encode())
    await producer.stop()

# Async batch processing (OCR + classification in parallel)
async def process_emails_parallel(email_paths: list) -> list:
    async def process_one(path):
        email_data = extract_msg_async(path)
        # Parallel: OCR + classification
        ocr_result, classification = await asyncio.gather(
            run_textract_ocr(email_data['attachments']),
            classify_async(email_data['body'])
        )
        return {**email_data, "ocr": ocr_result, "label": classification}

    # Process all emails concurrently (respect rate limits)
    semaphore = asyncio.Semaphore(10)  # max 10 concurrent
    async def bounded(path):
        async with semaphore:
            return await process_one(path)

    return await asyncio.gather(*[bounded(p) for p in email_paths])`
      }
    ]
  },
  {
    id: "production",
    icon: "🔥",
    label: "Production Issues",
    color: "#F44336",
    subsections: [
      {
        title: "Real Production Issues & How to Handle Them",
        content: `These are the issues you'll face (and discuss in interviews) when running ML pipelines in production at scale.`,
        code: `# --- ISSUE 1: Model Drift ---
# TF-IDF model trained on 2024 emails may miss new claim patterns in 2026
# Solution: Monitor confidence distribution; retrain when tier3_rate > 8%

from prometheus_client import Histogram, Counter, start_http_server

tier_counter = Counter('icpa_tier_usage', 'Emails processed per tier', ['tier'])
confidence_hist = Histogram('icpa_confidence', 'Classification confidence',
                            buckets=[0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0])

def classify_with_metrics(email_text: str) -> dict:
    result = classify_email_pipeline(email_text)
    tier_counter.labels(tier=str(result['tier_used'])).inc()
    confidence_hist.observe(result['confidence'])
    return result

# Alert rule (Prometheus): tier3_rate > 0.08 for 1h → retrain trigger

# --- ISSUE 2: PII Leakage in LLM prompts ---
import spacy
nlp = spacy.load("de_core_news_sm")  # German model

def anonymize_pii(text: str) -> tuple[str, dict]:
    doc = nlp(text)
    replacements = {}
    anonymized = text
    
    for ent in reversed(doc.ents):  # reversed to preserve indices
        if ent.label_ in ["PER", "ORG", "LOC", "MISC"]:
            placeholder = f"[{ent.label_}_{hash(ent.text) % 1000:03d}]"
            replacements[placeholder] = ent.text
            anonymized = anonymized[:ent.start_char] + placeholder + anonymized[ent.end_char:]
    
    # Regex for IBAN, phone, German postal codes
    anonymized = re.sub(r'DE\d{2}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{4}\s?\d{2}', '[IBAN]', anonymized)
    anonymized = re.sub(r'\+49[\s-]?\d{3,5}[\s-]?\d{6,8}', '[PHONE]', anonymized)
    return anonymized, replacements

# --- ISSUE 3: ChromaDB memory growth ---
# After indexing 100k documents, HNSW index can use 2-4GB RAM
# Solution: periodic compaction + evict old cases

def maintain_chromadb_health():
    collection = chroma_client.get_collection("claims_kb")
    count = collection.count()
    
    if count > 50_000:
        # Delete cases older than 1 year
        old_cases = collection.query(
            query_texts=["placeholder"],
            where={"resolved_date": {"$lt": "2025-01-01"}},
            n_results=1000
        )
        collection.delete(ids=old_cases['ids'][0])
        print(f"Pruned old cases. New count: {collection.count()}")

# --- ISSUE 4: Ollama cold start latency ---
# First LLM call after idle = 3-5s model load
# Solution: keepalive ping

import httpx, asyncio

async def warmup_ollama():
    async with httpx.AsyncClient() as client:
        await client.post("http://localhost:11434/api/generate",
                          json={"model": "llama3.2", "prompt": "ping", "stream": False},
                          timeout=30)

# Run warmup on startup and every 5 minutes
@app.on_event("startup")
async def startup():
    await warmup_ollama()
    asyncio.create_task(periodic_warmup())

async def periodic_warmup():
    while True:
        await asyncio.sleep(300)  # every 5 mins
        await warmup_ollama()`
      }
    ]
  },
  {
    id: "cost",
    icon: "💰",
    label: "Cost & Budget",
    color: "#8BC34A",
    subsections: [
      {
        title: "Cost Architecture — Zero Inference Cost Design",
        content: `Your ICPA system achieves $0 LLM inference cost on 95% of traffic. Here's the full cost breakdown and how to present it in interviews.`,
        code: `"""
ICPA COST BREAKDOWN (10,000 emails/month)

COMPUTE COSTS:
├── AWS EKS cluster (t3.medium × 3):   ~$150/month
├── AWS Textract OCR:
│   ├── 10,000 emails × 2 PDFs avg
│   ├── 20,000 pages × $0.0015/page    = $30/month
├── S3 storage (raw .msg + processed): ~$5/month
└── Total AWS:                          ~$185/month

LLM INFERENCE COSTS:
├── Tier 1 (TF-IDF): 7,500 emails      = $0 (sklearn, local)
├── Tier 2 (ChromaDB RAG): 2,000 emails = $0 (local)
│   └── Cohere embeddings (indexing only, one-time): ~$2
├── Tier 3 (Ollama llama3.2): 500 emails = $0 (local, self-hosted)
└── Total LLM cost:                     = $0/month ✓

BEFORE ICPA (manual processing):
├── 2 FTE × €3,000/month               = €6,000/month
├── Error rate: ~15% manual mistakes
└── Processing time: 3-4 days per case

AFTER ICPA:
├── AWS + infra:                        ~$185/month (~€170)
├── 80% reduction in manual data prep
├── Processing time: minutes
└── ROI: (€6,000 - €170) / €170 = 35x monthly ROI

$15k/year cloud savings referenced in your resume:
Previous architecture used GPT-4 API for all emails:
10,000 × ~500 tokens input + 100 tokens output
= 10,000 × 600 tokens × $0.01/1k tokens (GPT-4)
= $600/month = $7,200/year

With 3-tier (Ollama for tier3 only):
= 500 × 600 tokens × $0 (Ollama local)
= $0 + $185 infra = $2,220/year saved from GPT-4 alone
Plus manual effort reduction savings ≈ $15k/year total
"""

# Cost monitoring in code
from dataclasses import dataclass

@dataclass
class CostTracker:
    textract_pages: int = 0
    tier3_calls: int = 0
    
    def monthly_cost(self) -> dict:
        return {
            "textract_usd": self.textract_pages * 0.0015,
            "llm_usd": 0,  # Ollama = free
            "estimated_total_aws": self.textract_pages * 0.0015 + 185,
        }
    
    def log_textract_call(self, pages: int):
        self.textract_pages += pages
        if self.monthly_cost()['textract_usd'] > 50:
            alert("Textract costs exceeding $50 budget")

tracker = CostTracker()`
      }
    ]
  },
  {
    id: "interview",
    icon: "🎯",
    label: "Interview Prep",
    color: "#FF5722",
    subsections: [
      {
        title: "Top Interview Q&A — Publicis Sapient L1",
        content: `These are the exact questions you should expect for a Senior Associate AI Engineer role with your ICPA background.`,
        code: `"""
Q1: "Explain your 3-tier architecture and the trade-offs you made."

ANSWER STRUCTURE:
1. Problem: 10k German claim emails/month, need accurate classification,
   zero tolerance for PII leakage, budget constraint (no expensive APIs)
2. Solution: Cost-aware cascade
   - Tier 1: TF-IDF (10ms, $0) handles 75% — known patterns, deterministic
   - Tier 2: ChromaDB RAG (100ms, $0) handles 20% — semantic similarity
   - Tier 3: Ollama local LLM (1.5s, $0) handles 5% — novel/ambiguous
3. Trade-offs:
   - vs single LLM: 30x faster average latency, $0 inference cost
   - vs BERT fine-tune: TF-IDF is interpretable, no GPU, instant retrain
   - ChromaDB vs Pinecone: GDPR compliance (data stays on-prem, German law)
4. Results: 80% reduction in manual data prep, 10k+ emails/month

---

Q2: "How does RAG work and how did you improve faithfulness from 72% to 91%?"

ANSWER:
RAG = Retrieval-Augmented Generation. Instead of asking the LLM to answer 
from parametric memory alone, we first retrieve relevant context from a 
knowledge base, then ground the answer in that context.

Steps I took to improve faithfulness:
1. MMR (Maximal Marginal Relevance) retrieval — avoids redundant context chunks
   that confuse the LLM
2. Metadata filtering — filter by invoice number / object number before 
   semantic search, so retrieved context is always from the same case
3. Prompt grounding — explicit instruction: "Answer ONLY based on the 
   provided context. If not in context, say 'insufficient information.'"
4. Chunk overlap tuning — 50-token overlap prevents context boundary artifacts
Result: faithfulness 72% → 91% (RAGAS metric), 60% reduction in LLM escalations

---

Q3: "How did you handle PII in a GDPR-compliant way?"

Pipeline:
1. spaCy de_core_news_sm NER → detects PER, ORG, LOC entities
2. Regex patterns → IBAN (DE\d{20}), phone numbers, Vodafone account IDs
3. Anonymize BEFORE any external API call (even Cohere embeddings)
4. Mapping table (placeholder → original) stored encrypted in AWS Secrets Manager
5. Never logged in LangSmith traces — PII fields filtered before export

---

Q4: "LangGraph vs LangChain — when do you use each?"

LangChain: Linear pipelines — RAG chains, simple sequential steps
LangGraph: Stateful multi-agent workflows with conditional branching

In your multi-agent system:
- Router Agent (LangGraph node) → classifies intent
- Research Agent (LangGraph node) → tool use (web search, calculator)
- Synthesis Agent (LangGraph node) → assembles response
- Redis RedisSaver → persistent state across conversation turns
- NeMo Guardrails → pre-agent safety check (94% routing accuracy)

Use LangGraph when: you need cycles, conditional edges, human-in-the-loop,
multi-agent coordination, or persistent state.

---

Q5: "What's your approach to LLM evaluation?"

Three layers:
1. RAGAS automated metrics (faithfulness, context_precision, answer_relevancy)
   - Run after every response in staging via LLM-as-a-Judge
   - Published to Kafka, consumed by MLflow dashboard
2. LangSmith tracing — every chain call logged with inputs/outputs/latency
3. Confidence threshold monitoring — if tier3_rate exceeds 8%, trigger retrain
   (MLflow alert → GitHub Actions → retrain pipeline → staging deploy)
"""

# Bonus: Code question — "Implement a confidence-based router"
def smart_router(email_text: str, thresholds: dict = None) -> dict:
    if thresholds is None:
        thresholds = {"tier1": 0.85, "tier2": 0.75}
    
    # Tier 1
    t1 = tfidf_classify(email_text)
    if t1["confidence"] >= thresholds["tier1"]:
        return {"tier": 1, **t1}
    
    # Tier 2
    t2 = chromadb_retrieve(email_text)
    if t2 and (1 - t2["distance"]) >= thresholds["tier2"]:
        return {"tier": 2, **t2}
    
    # Tier 3
    t3 = llm_classify(email_text)
    return {"tier": 3, **t3}`
      }
    ]
  }
];

export default function ICPAGuide() {
  const [activeSection, setActiveSection] = useState("overview");
  const [activeSubsection, setActiveSubsection] = useState(0);
  const [copiedCode, setCopiedCode] = useState(null);

  const section = SECTIONS.find(s => s.id === activeSection);

  const copyCode = (code, idx) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(idx);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div style={{
      display: "flex",
      height: "100vh",
      fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
      background: "#0A0E1A",
      color: "#E2E8F0",
      overflow: "hidden"
    }}>
      {/* Sidebar */}
      <div style={{
        width: "220px",
        minWidth: "220px",
        background: "#0D1117",
        borderRight: "1px solid #1E2433",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        padding: "0"
      }}>
        {/* Logo */}
        <div style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid #1E2433",
          background: "linear-gradient(135deg, #0D1117, #111827)"
        }}>
          <div style={{ fontSize: "11px", color: "#6B7280", letterSpacing: "0.15em", marginBottom: "4px" }}>VODAFONE · ICPA</div>
          <div style={{ fontSize: "15px", fontWeight: "700", color: "#E2E8F0", letterSpacing: "-0.02em" }}>
            Master Guide
          </div>
          <div style={{ fontSize: "10px", color: "#4B5563", marginTop: "2px" }}>Interview & Production</div>
        </div>

        {/* Nav */}
        <nav style={{ padding: "8px 0", flex: 1 }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => { setActiveSection(s.id); setActiveSubsection(0); }}
              style={{
                display: "flex", alignItems: "center", gap: "10px",
                width: "100%", padding: "10px 16px",
                background: activeSection === s.id ? `${s.color}18` : "transparent",
                border: "none",
                borderLeft: activeSection === s.id ? `3px solid ${s.color}` : "3px solid transparent",
                color: activeSection === s.id ? s.color : "#6B7280",
                cursor: "pointer", fontSize: "12px", textAlign: "left",
                transition: "all 0.15s ease", fontFamily: "inherit"
              }}>
              <span style={{ fontSize: "14px" }}>{s.icon}</span>
              <span style={{ fontWeight: activeSection === s.id ? "600" : "400" }}>{s.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 16px", borderTop: "1px solid #1E2433", fontSize: "10px", color: "#374151" }}>
          Chandan Sahoo · ICPA @ Vodafone
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          padding: "16px 28px",
          borderBottom: "1px solid #1E2433",
          background: "#0D1117",
          display: "flex", alignItems: "center", gap: "16px"
        }}>
          <span style={{ fontSize: "22px" }}>{section.icon}</span>
          <div>
            <div style={{ fontSize: "18px", fontWeight: "700", color: section.color, letterSpacing: "-0.02em" }}>
              {section.label}
            </div>
            <div style={{ fontSize: "11px", color: "#4B5563" }}>
              {section.subsections.length} topic{section.subsections.length > 1 ? "s" : ""}
            </div>
          </div>

          {/* Subsection tabs */}
          {section.subsections.length > 1 && (
            <div style={{ display: "flex", gap: "8px", marginLeft: "auto" }}>
              {section.subsections.map((sub, i) => (
                <button key={i} onClick={() => setActiveSubsection(i)}
                  style={{
                    padding: "6px 14px", borderRadius: "20px",
                    border: `1px solid ${i === activeSubsection ? section.color : "#1E2433"}`,
                    background: i === activeSubsection ? `${section.color}22` : "transparent",
                    color: i === activeSubsection ? section.color : "#4B5563",
                    cursor: "pointer", fontSize: "11px", fontFamily: "inherit",
                    transition: "all 0.15s"
                  }}>
                  {i + 1}. {sub.title.split("—")[0].split(":")[0].trim().slice(0, 25)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content area */}
        <div style={{ flex: 1, overflowY: "auto", padding: "28px" }}>
          {section.subsections.map((sub, subIdx) => {
            if (section.subsections.length > 1 && subIdx !== activeSubsection) return null;
            return (
              <div key={subIdx}>
                {/* Section title */}
                <div style={{
                  fontSize: "16px", fontWeight: "700", color: "#E2E8F0",
                  marginBottom: "16px", letterSpacing: "-0.01em",
                  paddingBottom: "10px", borderBottom: `1px solid ${section.color}33`
                }}>
                  {sub.title}
                </div>

                {/* Prose explanation */}
                <div style={{
                  background: "#111827",
                  border: "1px solid #1E2433",
                  borderRadius: "8px",
                  padding: "18px 20px",
                  marginBottom: "20px",
                  fontSize: "13px", lineHeight: "1.75", color: "#9CA3AF",
                  whiteSpace: "pre-wrap"
                }}>
                  {sub.content.split('\n').map((line, i) => {
                    if (line.startsWith('•')) {
                      return (
                        <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                          <span style={{ color: section.color, flexShrink: 0 }}>▸</span>
                          <span>{line.slice(1).trim()}</span>
                        </div>
                      );
                    }
                    if (line.match(/^(Tier \d|Step|Note:|Interview|Before|After|Q\d)/)) {
                      return <div key={i} style={{ color: section.color, fontWeight: "600", marginTop: "8px", marginBottom: "2px" }}>{line}</div>;
                    }
                    return <div key={i} style={{ marginBottom: line === '' ? "8px" : "2px" }}>{line}</div>;
                  })}
                </div>

                {/* Code block */}
                {sub.code && (
                  <div style={{ position: "relative" }}>
                    <div style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      background: "#161B27",
                      borderTop: "1px solid #1E2433",
                      borderLeft: "1px solid #1E2433",
                      borderRight: "1px solid #1E2433",
                      borderTopLeftRadius: "8px", borderTopRightRadius: "8px",
                      padding: "8px 16px"
                    }}>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FF5F57" }} />
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#FEBC2E" }} />
                        <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#28C840" }} />
                      </div>
                      <span style={{ fontSize: "11px", color: "#4B5563" }}>python</span>
                      <button onClick={() => copyCode(sub.code, subIdx)}
                        style={{
                          padding: "3px 10px", borderRadius: "4px",
                          border: `1px solid ${copiedCode === subIdx ? section.color : "#2D3748"}`,
                          background: copiedCode === subIdx ? `${section.color}22` : "transparent",
                          color: copiedCode === subIdx ? section.color : "#6B7280",
                          cursor: "pointer", fontSize: "11px", fontFamily: "inherit",
                          transition: "all 0.15s"
                        }}>
                        {copiedCode === subIdx ? "✓ Copied" : "Copy"}
                      </button>
                    </div>
                    <pre style={{
                      background: "#0D1117",
                      border: "1px solid #1E2433",
                      borderTop: "none",
                      borderBottomLeftRadius: "8px", borderBottomRightRadius: "8px",
                      padding: "20px",
                      margin: "0",
                      overflowX: "auto",
                      fontSize: "12px", lineHeight: "1.65",
                      color: "#A3BE8C",
                    }}>
                      <code style={{ fontFamily: "inherit" }}>
                        {sub.code.split('\n').map((line, i) => {
                          let color = "#A3BE8C";
                          if (line.trim().startsWith('#')) color = "#6A9955";
                          else if (line.includes('"""') || (line.trim().startsWith('"') && !line.includes("=") && !line.includes("("))) color = "#CE9178";
                          else if (/^(def |class |import |from |async def |@)/.test(line.trim())) color = "#569CD6";
                          else if (line.includes('→') || line.includes('├') || line.includes('└') || line.includes('│')) color = "#4B5563";
                          return (
                            <span key={i} style={{ display: "block", color }}>
                              {line}
                            </span>
                          );
                        })}
                      </code>
                    </pre>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
