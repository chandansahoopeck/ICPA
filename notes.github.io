<!DOCTYPE html>

<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Project Deep-Dive Notes · Chandan</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap');

:root {
–bg: #0c0e1a;
–p1: #ff4d6d;
–p1-dim: #2a0d14;
–p1-mid: #7f1d2e;
–p2: #00c9a7;
–p2-dim: #002a24;
–p2-mid: #006b59;
–yellow: #ffd166;
–blue: #4cc9f0;
–purple: #b388ff;
–orange: #ff9f43;
–text: #f0f0f8;
–muted: #8892a4;
–card: #13162a;
–border: #1e2340;
}

- { margin: 0; padding: 0; box-sizing: border-box; }

body {
background: var(–bg);
color: var(–text);
font-family: ‘Outfit’, sans-serif;
overflow-x: hidden;
}

/* BG GRID */
body::before {
content: ‘’;
position: fixed; inset: 0; z-index: 0;
background-image:
linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
background-size: 40px 40px;
pointer-events: none;
}

.wrap { max-width: 1000px; margin: 0 auto; padding: 2rem 1.2rem; position: relative; z-index: 1; }

/* HEADER */
.site-header {
text-align: center; padding: 3rem 0 2.5rem;
border-bottom: 1px solid var(–border); margin-bottom: 3rem;
}
.kicker {
font-family: ‘Fira Code’, monospace;
font-size: 0.7rem; letter-spacing: 0.25em;
color: var(–muted); text-transform: uppercase; margin-bottom: 1rem;
}
.site-title {
font-family: ‘Bebas Neue’, sans-serif;
font-size: clamp(2.5rem, 7vw, 5rem);
line-height: 1; letter-spacing: 0.04em;
}
.site-title .red { color: var(–p1); }
.site-title .teal { color: var(–p2); }
.site-subtitle { color: var(–muted); font-size: 0.85rem; margin-top: 0.6rem; }

/* PROJECT SELECTOR */
.proj-selector {
display: flex; gap: 1rem; margin-bottom: 2.5rem; flex-wrap: wrap;
}
.proj-btn {
flex: 1; min-width: 240px;
background: var(–card); border: 2px solid var(–border);
border-radius: 14px; padding: 1.2rem 1.5rem;
cursor: pointer; transition: all 0.25s; text-align: left;
font-family: ‘Outfit’, sans-serif;
}
.proj-btn:hover { transform: translateY(-3px); }
.proj-btn.p1-active { border-color: var(–p1); background: var(–p1-dim); }
.proj-btn.p2-active { border-color: var(–p2); background: var(–p2-dim); }
.pb-num {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 2.5rem; line-height: 1; margin-bottom: 0.3rem;
}
.p1-active .pb-num { color: var(–p1); }
.p2-active .pb-num { color: var(–p2); }
.pb-title { font-weight: 700; font-size: 0.95rem; color: var(–text); }
.pb-sub { font-size: 0.72rem; color: var(–muted); margin-top: 0.2rem; }

/* CONTENT PANELS */
.panel { display: none; animation: slideUp 0.35s ease; }
.panel.active { display: block; }
@keyframes slideUp {
from { opacity: 0; transform: translateY(16px); }
to { opacity: 1; transform: translateY(0); }
}

/* SECTION TABS */
.section-tabs {
display: flex; gap: 0.4rem; flex-wrap: wrap;
margin-bottom: 2rem; background: var(–card);
padding: 0.4rem; border-radius: 12px;
border: 1px solid var(–border);
}
.stab {
flex: 1; min-width: 100px;
background: none; border: none; cursor: pointer;
font-family: ‘Outfit’, sans-serif; font-weight: 600;
font-size: 0.75rem; color: var(–muted);
padding: 0.6rem 0.8rem; border-radius: 8px;
transition: all 0.2s; white-space: nowrap;
}
.stab:hover { color: var(–text); }
.stab.active.red { background: var(–p1); color: #fff; }
.stab.active.teal { background: var(–p2); color: #0c0e1a; }

.section { display: none; }
.section.active { display: block; animation: slideUp 0.25s ease; }

/* ─── OVERVIEW SECTION ─── */
.overview-hero {
border-radius: 16px; padding: 2rem;
margin-bottom: 1.5rem; position: relative; overflow: hidden;
}
.oh-p1 { background: linear-gradient(135deg, var(–p1-dim) 0%, #1a0a20 100%); border: 1px solid var(–p1-mid); }
.oh-p2 { background: linear-gradient(135deg, var(–p2-dim) 0%, #001a30 100%); border: 1px solid var(–p2-mid); }
.oh-tag {
font-family: ‘Fira Code’, monospace; font-size: 0.65rem;
letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 0.6rem;
}
.oh-p1 .oh-tag { color: var(–p1); }
.oh-p2 .oh-tag { color: var(–p2); }
.oh-title {
font-family: ‘Bebas Neue’, sans-serif;
font-size: clamp(1.6rem, 4vw, 2.8rem);
line-height: 1.1; margin-bottom: 0.5rem;
}
.oh-desc { color: var(–muted); font-size: 0.85rem; line-height: 1.7; max-width: 700px; }

.tech-chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1.2rem; }
.chip {
font-family: ‘Fira Code’, monospace;
font-size: 0.68rem; padding: 0.3rem 0.8rem;
border-radius: 6px; font-weight: 500; letter-spacing: 0.04em;
}
.chip-red { background: #2a0d14; color: var(–p1); border: 1px solid #7f1d2e; }
.chip-teal { background: #002a24; color: var(–p2); border: 1px solid #006b59; }
.chip-yellow { background: #1a1000; color: var(–yellow); border: 1px solid #5a3800; }
.chip-blue { background: #001a2e; color: var(–blue); border: 1px solid #003d5c; }
.chip-purple { background: #1a0d2e; color: var(–purple); border: 1px solid #4a2070; }
.chip-orange { background: #1a0d00; color: var(–orange); border: 1px solid #5a3000; }

.benefit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 0.8rem; margin-top: 1rem; }
.benefit-card {
background: var(–card); border: 1px solid var(–border);
border-radius: 12px; padding: 1.1rem;
}
.bc-icon { font-size: 1.4rem; margin-bottom: 0.5rem; }
.bc-title { font-weight: 700; font-size: 0.85rem; margin-bottom: 0.3rem; }
.bc-desc { font-size: 0.75rem; color: var(–muted); line-height: 1.5; }

/* ─── ARCHITECTURE SECTION ─── */
.arch-flow {
display: flex; flex-direction: column; gap: 0.6rem;
position: relative; padding-left: 2rem;
}
.arch-flow::before {
content: ‘’; position: absolute; left: 10px; top: 12px; bottom: 12px;
width: 2px; background: linear-gradient(to bottom, var(–p1), transparent);
}
.arch-flow.teal::before { background: linear-gradient(to bottom, var(–p2), transparent); }

.arch-step {
display: flex; align-items: flex-start; gap: 1rem;
background: var(–card); border: 1px solid var(–border);
border-radius: 12px; padding: 1rem 1.2rem;
position: relative;
}
.arch-step::before {
content: attr(data-n);
position: absolute; left: -2rem;
width: 20px; height: 20px; border-radius: 50%;
background: var(–p1); color: #fff;
font-size: 0.65rem; font-weight: 700;
display: flex; align-items: center; justify-content: center;
font-family: ‘Fira Code’, monospace;
top: 1.1rem;
}
.arch-step.teal::before { background: var(–p2); color: #0c0e1a; }

.as-emoji { font-size: 1.3rem; flex-shrink: 0; margin-top: 0.1rem; }
.as-name { font-weight: 700; font-size: 0.9rem; margin-bottom: 0.25rem; }
.as-desc { font-size: 0.75rem; color: var(–muted); line-height: 1.5; }
.as-code {
font-family: ‘Fira Code’, monospace;
font-size: 0.68rem; color: var(–yellow);
background: #0c0e1a; border: 1px solid var(–border);
border-radius: 4px; padding: 0.15rem 0.5rem;
margin-top: 0.4rem; display: inline-block;
}

/* ─── BUILD GUIDE ─── */
.step-container { display: flex; flex-direction: column; gap: 1.2rem; }

.build-step {
border-radius: 14px; overflow: hidden;
border: 1px solid var(–border);
}
.bs-header {
display: flex; align-items: center; gap: 1rem;
padding: 1rem 1.3rem; cursor: pointer;
transition: background 0.2s;
}
.bs-header:hover { background: rgba(255,255,255,0.03); }
.bs-num {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 1.8rem; line-height: 1; flex-shrink: 0; width: 2rem; text-align: center;
}
.bs-num.red { color: var(–p1); }
.bs-num.teal { color: var(–p2); }
.bs-info { flex: 1; }
.bs-title { font-weight: 700; font-size: 0.9rem; }
.bs-est { font-size: 0.68rem; color: var(–muted); margin-top: 0.1rem; }
.bs-arrow { color: var(–muted); font-size: 0.8rem; transition: transform 0.2s; }
.bs-arrow.open { transform: rotate(90deg); }

.bs-body {
display: none; padding: 0 1.3rem 1.3rem;
border-top: 1px solid var(–border);
}
.bs-body.open { display: block; animation: slideUp 0.2s ease; }

.cmd-block {
background: #080a14; border: 1px solid var(–border);
border-radius: 8px; padding: 1rem 1.2rem;
font-family: ‘Fira Code’, monospace; font-size: 0.72rem;
color: #a8ff78; line-height: 1.8; margin: 0.8rem 0;
overflow-x: auto; white-space: pre;
}
.cmd-comment { color: var(–muted); }
.cmd-file { color: var(–blue); }
.cmd-string { color: var(–yellow); }

.tip-box {
background: #001a10; border: 1px solid #006b59;
border-left: 3px solid var(–p2);
border-radius: 8px; padding: 0.8rem 1rem;
font-size: 0.75rem; color: #a7f3d0; margin-top: 0.8rem; line-height: 1.6;
}
.tip-box.warn {
background: #1a0d00; border-color: #5a3000;
border-left-color: var(–orange); color: #fed7aa;
}
.tip-box.info {
background: #001020; border-color: #003d5c;
border-left-color: var(–blue); color: #bae6fd;
}
.tip-label {
font-weight: 700; font-size: 0.65rem;
letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 0.3rem;
}
.step-desc { font-size: 0.8rem; color: var(–muted); line-height: 1.7; margin-top: 0.8rem; }
.step-desc li { margin-left: 1.2rem; margin-bottom: 0.3rem; }

/* ─── INTERVIEW SECTION ─── */
.interview-grid { display: flex; flex-direction: column; gap: 1rem; }

.iq-card {
background: var(–card); border: 1px solid var(–border);
border-radius: 14px; overflow: hidden;
}
.iq-header {
padding: 1rem 1.3rem; cursor: pointer; display: flex;
align-items: flex-start; gap: 1rem; transition: background 0.2s;
}
.iq-header:hover { background: rgba(255,255,255,0.03); }
.iq-level {
font-size: 0.6rem; font-weight: 700; letter-spacing: 0.12em;
text-transform: uppercase; padding: 0.25rem 0.6rem;
border-radius: 4px; flex-shrink: 0; margin-top: 0.15rem;
}
.lvl-basic { background: #003d5c; color: var(–blue); }
.lvl-mid { background: #1a1000; color: var(–yellow); }
.lvl-senior { background: #2a0d14; color: var(–p1); }
.lvl-system { background: #1a0d2e; color: var(–purple); }

.iq-q { font-weight: 600; font-size: 0.85rem; flex: 1; line-height: 1.4; }
.iq-body {
display: none; padding: 0 1.3rem 1.3rem;
border-top: 1px solid var(–border);
}
.iq-body.open { display: block; animation: slideUp 0.2s ease; }
.iq-answer { font-size: 0.78rem; color: var(–muted); line-height: 1.7; margin-top: 0.8rem; }
.iq-answer strong { color: var(–text); }
.answer-structure {
background: #080a14; border: 1px solid var(–border);
border-radius: 8px; padding: 1rem; margin-top: 0.8rem;
font-size: 0.72rem; line-height: 1.8;
}
.ans-label { font-family: ‘Fira Code’, monospace; font-size: 0.62rem; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.3rem; }

/* METRICS CALLOUT */
.metrics-row {
display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
gap: 0.8rem; margin-top: 1.2rem;
}
.metric-pill {
background: var(–card); border-radius: 10px;
padding: 1rem; text-align: center;
border: 1px solid var(–border);
}
.metric-val {
font-family: ‘Bebas Neue’, sans-serif;
font-size: 2rem; line-height: 1;
}
.metric-label { font-size: 0.68rem; color: var(–muted); margin-top: 0.2rem; }

/* SCROLL */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-thumb { background: var(–border); border-radius: 2px; }
</style>

</head>
<body>
<div class="wrap">

<!-- HEADER -->

<header class="site-header">
<div class="kicker">// Chandan Sahoo · Priority 1 Projects · Deep-Dive Notes</div>
<div class="site-title">
<span class="red">BUILD</span> · <span class="teal">SHIP</span> · CRACK
</div>
<p class="site-subtitle">Step-by-step guide · Architecture · Interview answers · Key metrics</p>
</header>

<!-- PROJECT SELECTOR -->

<div class="proj-selector">
<button class="proj-btn p1-active" onclick="selectProject('p1', this)">
<div class="pb-num">01</div>
<div class="pb-title">RAG + Streaming Eval Platform</div>
<div class="pb-sub">Real-time LLM evaluation with live metrics dashboard</div>
</button>
<button class="proj-btn" onclick="selectProject('p2', this)">
<div class="pb-num">02</div>
<div class="pb-title">Multi-Agent Orchestration</div>
<div class="pb-sub">LangGraph agents · Tool Use · Guardrails · Observability</div>
</button>
</div>

<!-- ═══════════════════════════════════════════════
PROJECT 1 PANEL
════════════════════════════════════════════════ -->

<div class="panel active" id="panel-p1">
<div class="section-tabs">
<button class="stab active red" onclick="switchSection('p1','overview',this)">🗺 Overview</button>
<button class="stab red" onclick="switchSection('p1','arch',this)">⚙️ Architecture</button>
<button class="stab red" onclick="switchSection('p1','build',this)">🔨 Build Guide</button>
<button class="stab red" onclick="switchSection('p1','interview',this)">🎯 Interview Q&A</button>
</div>

```
<!-- OVERVIEW -->
<div class="section active" id="p1-overview">
<div class="overview-hero oh-p1">
<div class="oh-tag">Project 01 · Priority Red</div>
<div class="oh-title">RAG + Streaming<br>Eval Platform</div>
<div class="oh-desc">
A production-grade RAG pipeline that streams LLM responses in real-time AND evaluates them automatically — measuring faithfulness, context precision, hallucination rate, and latency. Every trace is captured in LangSmith. Results visualized on a live dashboard.
<br><br>
<strong style="color:var(--p1)">Why this matters:</strong> Most engineers build RAG that "works." This proves you can measure whether it works well — the #1 thing senior AI engineers are expected to do.
</div>
<div class="tech-chips">
<span class="chip chip-red">LangChain</span>
<span class="chip chip-red">LangSmith</span>
<span class="chip chip-blue">FastAPI</span>
<span class="chip chip-yellow">Kafka / Pub-Sub</span>
<span class="chip chip-teal">WebSockets</span>
<span class="chip chip-purple">ChromaDB</span>
<span class="chip chip-orange">MLflow</span>
</div>
</div>

<div class="benefit-grid">
<div class="benefit-card">
<div class="bc-icon">📊</div>
<div class="bc-title">Evals = Senior Signal</div>
<div class="bc-desc">Adding LangSmith traces + RAGAS metrics separates you from 90% of RAG candidates. Most only build retrieval — you measure retrieval quality.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">⚡</div>
<div class="bc-title">Streaming = Scalability Proof</div>
<div class="bc-desc">SSE/WebSocket streaming with Kafka shows you understand high-throughput, event-driven architectures — exactly what Snowflake, Confluent want.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">🔗</div>
<div class="bc-title">Extends Your ICPA</div>
<div class="bc-desc">You already have ICPA with ChromaDB + Ollama. This adds evals + streaming on top — less work, bigger story. Direct resume upgrade.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">🧪</div>
<div class="bc-title">MLflow Experiment Tracking</div>
<div class="bc-desc">Swapping models (llama3 vs mistral vs cohere) and tracking which scores better = real MLOps. Unlocks Databricks interviews immediately.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">🎯</div>
<div class="bc-title">Interview Story Ready</div>
<div class="bc-desc">"Our RAG had 72% faithfulness. I added hybrid retrieval + re-ranking. Faithfulness hit 91%. Here's the LangSmith trace." That's a hiring answer.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">🏢</div>
<div class="bc-title">Unlocks Tier 1 Companies</div>
<div class="bc-desc">Snowflake, Databricks, Confluent, Elastic — all want observable ML systems. This is your admission ticket to those interviews.</div>
</div>
</div>

<div class="metrics-row" style="margin-top:1.5rem">
<div class="metric-pill"><div class="metric-val" style="color:var(--p1)">91%</div><div class="metric-label">Target faithfulness score</div></div>
<div class="metric-pill"><div class="metric-val" style="color:var(--yellow)">&lt;800ms</div><div class="metric-label">P99 streaming latency</div></div>
<div class="metric-pill"><div class="metric-val" style="color:var(--p2)">100%</div><div class="metric-label">LLM calls traced in LangSmith</div></div>
<div class="metric-pill"><div class="metric-val" style="color:var(--purple)">3x</div><div class="metric-label">Model variants tracked in MLflow</div></div>
</div>
</div>

<!-- ARCHITECTURE -->
<div class="section" id="p1-arch">
<div class="arch-flow" style="--color:var(--p1)">
<div class="arch-step" data-n="1">
<div class="as-emoji">👤</div>
<div>
<div class="as-name">User Query → FastAPI Endpoint</div>
<div class="as-desc">User sends a natural language question. FastAPI receives it via POST /query. The request is also published to a Kafka topic <code style="color:var(--yellow); font-family:'Fira Code',monospace; font-size:0.7rem">rag.requests</code> for async processing + audit logging.</div>
<div class="as-code">POST /api/query {"question": "...", "session_id": "..."}</div>
</div>
</div>
<div class="arch-step" data-n="2">
<div class="as-emoji">🗄️</div>
<div>
<div class="as-name">Hybrid Retrieval → ChromaDB</div>
<div class="as-desc">LangChain retriever hits ChromaDB for dense vector search. Combine with BM25 keyword scores (RRF fusion). Top-K documents retrieved. Cross-encoder re-ranker scores and re-orders results for precision.</div>
<div class="as-code">retriever = EnsembleRetriever([bm25, chroma_retriever], weights=[0.4, 0.6])</div>
</div>
</div>
<div class="arch-step" data-n="3">
<div class="as-emoji">🤖</div>
<div>
<div class="as-name">LLM Response → Streaming via WebSocket</div>
<div class="as-desc">Retrieved context + question passed to LLM (Ollama/Cohere). Response streamed token-by-token via WebSocket. Client sees text appear in real-time — no waiting for full response. Each token also published to Kafka.</div>
<div class="as-code">async for token in llm.astream(prompt): await websocket.send_text(token)</div>
</div>
</div>
<div class="arch-step" data-n="4">
<div class="as-emoji">🔬</div>
<div>
<div class="as-name">Auto-Eval → RAGAS Metrics</div>
<div class="as-desc">Once full response is assembled, RAGAS evaluator scores it: <strong>Faithfulness</strong> (did LLM stay grounded?), <strong>Answer Relevancy</strong>, <strong>Context Precision</strong>, <strong>Context Recall</strong>. Scores stored in Postgres + pushed to dashboard.</div>
<div class="as-code">result = evaluate(dataset, metrics=[faithfulness, answer_relevancy, context_precision])</div>
</div>
</div>
<div class="arch-step" data-n="5">
<div class="as-emoji">🔭</div>
<div>
<div class="as-name">LangSmith Tracing — Every Call</div>
<div class="as-desc">LangSmith wraps the entire chain. Every retrieval, every LLM call, every eval — traced with input/output, latency, token count. Zero code change needed — set env var LANGCHAIN_TRACING_V2=true.</div>
<div class="as-code">os.environ["LANGCHAIN_TRACING_V2"] = "true" # that's it</div>
</div>
</div>
<div class="arch-step" data-n="6">
<div class="as-emoji">📈</div>
<div>
<div class="as-name">MLflow — Model Experiment Tracking</div>
<div class="as-desc">When you swap models (llama3.2 → mistral → cohere), MLflow logs: model name, RAGAS scores, latency, cost. Compare runs on MLflow UI. Find the best model-retriever combination. This is the "data science" layer.</div>
<div class="as-code">mlflow.log_metrics({"faithfulness": 0.91, "latency_p99": 720})</div>
</div>
</div>
<div class="arch-step" data-n="7">
<div class="as-emoji">📊</div>
<div>
<div class="as-name">Live Dashboard — WebSocket + Chart.js</div>
<div class="as-desc">Frontend dashboard (simple HTML/Chart.js) connects via WebSocket to a /ws/metrics endpoint. Metrics update in real-time: avg faithfulness trend, latency histogram, total queries, error rate. Screenshot this for your GitHub README.</div>
<div class="as-code">ws = new WebSocket("ws://localhost:8000/ws/metrics") // live push</div>
</div>
</div>
</div>
</div>

<!-- BUILD GUIDE -->
<div class="section" id="p1-build">
<div class="step-container">

<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num red">1</div>
<div class="bs-info">
<div class="bs-title">Project Setup + Dependencies</div>
<div class="bs-est">⏱ 30 min · Day 1 morning</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="step-desc">Create the project structure first. Everything in one repo, Docker Compose to wire it all up.</div>
<div class="cmd-block"><span class="cmd-comment"># Project structure</span>
```

rag-eval-platform/
├── app/
│ ├── main.py <span class="cmd-comment"># FastAPI entrypoint</span>
│ ├── rag/
│ │ ├── retriever.py <span class="cmd-comment"># ChromaDB + BM25 ensemble</span>
│ │ ├── chain.py <span class="cmd-comment"># LangChain RAG chain</span>
│ │ └── evaluator.py <span class="cmd-comment"># RAGAS eval logic</span>
│ ├── streaming/
│ │ └── kafka.py <span class="cmd-comment"># Producer / consumer</span>
│ └── dashboard/
│ └── ws.py <span class="cmd-comment"># WebSocket metrics pusher</span>
├── docker-compose.yml
├── requirements.txt
└── .env</div>
<div class="cmd-block"><span class="cmd-comment"># requirements.txt</span>
fastapi uvicorn[standard]
langchain langchain-community langchain-cohere
langsmith ragas
chromadb sentence-transformers rank-bm25
kafka-python
mlflow
websockets
python-dotenv</div>
<div class="tip-box info">
<div class="tip-label">💡 Pro Tip</div>
Use Python 3.11+. Pin versions in requirements.txt — RAGAS and LangChain have frequent breaking changes. Use a venv.
</div>
</div>
</div>

```
<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num red">2</div>
<div class="bs-info">
<div class="bs-title">Docker Compose — Kafka + ChromaDB + MLflow</div>
<div class="bs-est">⏱ 45 min · Day 1 afternoon</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="step-desc">Wire up infrastructure first. Never hard-code connection strings — use .env from day 1.</div>
<div class="cmd-block">version: "3.9"
```

services:
zookeeper:
image: confluentinc/cp-zookeeper:7.4.0
environment:
ZOOKEEPER_CLIENT_PORT: 2181

kafka:
image: confluentinc/cp-kafka:7.4.0
depends_on: [zookeeper]
ports: [“9092:9092”]
environment:
KAFKA_ZOOKEEPER_CONNECT: zookeeper:2181
KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://localhost:9092

chromadb:
image: chromadb/chroma:latest
ports: [“8001:8000”]
volumes: [”./chroma_data:/chroma/chroma”]

mlflow:
image: ghcr.io/mlflow/mlflow:latest
ports: [“5000:5000”]
command: mlflow server –host 0.0.0.0

app:
build: .
ports: [“8000:8000”]
env_file: .env
depends_on: [kafka, chromadb, mlflow]</div>
<div class="cmd-block"><span class="cmd-comment"># Start everything</span>
docker compose up -d
docker compose logs -f app <span class="cmd-comment"># watch your app logs</span></div>
</div>
</div>

```
<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num red">3</div>
<div class="bs-info">
<div class="bs-title">Build the Hybrid Retriever (BM25 + ChromaDB)</div>
<div class="bs-est">⏱ 2 hrs · Day 1 evening</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="step-desc">This is the core of the RAG. Hybrid = BM25 keyword + dense vector, fused with Reciprocal Rank Fusion (RRF). This alone answers "how do you improve RAG retrieval?" in interviews.</div>
<div class="cmd-block"><span class="cmd-comment"># app/rag/retriever.py</span>
```

from langchain.retrievers import EnsembleRetriever, BM25Retriever
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import OllamaEmbeddings
from sentence_transformers import CrossEncoder

<span class="cmd-comment"># Dense vector retriever</span>
embeddings = OllamaEmbeddings(model=<span class="cmd-string">“nomic-embed-text”</span>)
vectorstore = Chroma(
collection_name=<span class="cmd-string">“docs”</span>,
embedding_function=embeddings,
client_settings=Settings(chroma_api_impl=<span class="cmd-string">“rest”</span>,
chroma_server_host=<span class="cmd-string">“chromadb”</span>)
)
chroma_retriever = vectorstore.as_retriever(search_kwargs={<span class="cmd-string">“k”</span>: 10})

<span class="cmd-comment"># BM25 keyword retriever (built from same docs)</span>
bm25_retriever = BM25Retriever.from_documents(docs)
bm25_retriever.k = 10

<span class="cmd-comment"># Ensemble with RRF fusion (weights must sum to 1.0)</span>
ensemble = EnsembleRetriever(
retrievers=[bm25_retriever, chroma_retriever],
weights=[0.4, 0.6]
)

<span class="cmd-comment"># Cross-encoder re-ranker for top-k precision</span>
reranker = CrossEncoder(<span class="cmd-string">‘cross-encoder/ms-marco-MiniLM-L-6-v2’</span>)

def rerank(query: str, docs: list, top_k: int = 5):
pairs = [(query, d.page_content) for d in docs]
scores = reranker.predict(pairs)
ranked = sorted(zip(scores, docs), reverse=True)
return [doc for _, doc in ranked[:top_k]]</div>
<div class="tip-box">
<div class="tip-label">✅ Interview Gold</div>
“I used Reciprocal Rank Fusion to combine BM25 and dense retrieval. BM25 excels on exact keyword matches, dense vectors handle semantic similarity. Together they gave +18% NDCG@10 over either alone.”
</div>
</div>
</div>

```
<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num red">4</div>
<div class="bs-info">
<div class="bs-title">Streaming RAG Chain + LangSmith Tracing</div>
<div class="bs-est">⏱ 2 hrs · Day 2 morning</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="cmd-block"><span class="cmd-comment"># .env — LangSmith setup (free tier)</span>
```

LANGCHAIN_TRACING_V2=true
LANGCHAIN_API_KEY=ls__your_key_here
LANGCHAIN_PROJECT=rag-eval-platform</div>
<div class="cmd-block"><span class="cmd-comment"># app/main.py — WebSocket streaming endpoint</span>
from fastapi import FastAPI, WebSocket
from langchain_community.llms import Ollama
from langchain.chains import RetrievalQA
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler

app = FastAPI()
llm = Ollama(model=<span class="cmd-string">“llama3.2”</span>, streaming=True)

@app.websocket(<span class="cmd-string">”/ws/query”</span>)
async def query_ws(websocket: WebSocket, question: str):
await websocket.accept()

```
<span class="cmd-comment"># Stream tokens to client</span>
full_response = <span class="cmd-string">""</span>
async for token in llm.astream(question):
full_response += token
await websocket.send_text(token) <span class="cmd-comment"># real-time push</span>

<span class="cmd-comment"># After streaming completes → run evals</span>
scores = await evaluate_response(question, full_response, context)
await websocket.send_json({<span class="cmd-string">"type"</span>: <span class="cmd-string">"eval"</span>, <span class="cmd-string">"scores"</span>: scores})
await websocket.close()</div>
<div class="tip-box info">
<div class="tip-label">💡 Note</div>
LangSmith captures ALL traces automatically once LANGCHAIN_TRACING_V2=true. Visit smith.langchain.com to see every retrieval, LLM call, token count, latency — zero extra code.
</div>
</div>
</div>

<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num red">5</div>
<div class="bs-info">
<div class="bs-title">RAGAS Evaluation + MLflow Logging</div>
<div class="bs-est">⏱ 2 hrs · Day 2 afternoon</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="cmd-block"><span class="cmd-comment"># app/rag/evaluator.py</span>
```

from ragas import evaluate
from ragas.metrics import faithfulness, answer_relevancy, context_precision
from datasets import Dataset
import mlflow

async def evaluate_response(question, answer, contexts):
data = {
<span class="cmd-string">“question”</span>: [question],
<span class="cmd-string">“answer”</span>: [answer],
<span class="cmd-string">“contexts”</span>: [[c.page_content for c in contexts]]
}
dataset = Dataset.from_dict(data)
result = evaluate(dataset, metrics=[
faithfulness, answer_relevancy, context_precision
])

```
scores = {
<span class="cmd-string">"faithfulness"</span>: result[<span class="cmd-string">"faithfulness"</span>],
<span class="cmd-string">"answer_relevancy"</span>: result[<span class="cmd-string">"answer_relevancy"</span>],
<span class="cmd-string">"context_precision"</span>: result[<span class="cmd-string">"context_precision"</span>]
}

<span class="cmd-comment"># Log to MLflow for experiment comparison</span>
with mlflow.start_run(run_name=<span class="cmd-string">f"query-{question[:20]}"</span>):
mlflow.log_param(<span class="cmd-string">"model"</span>, <span class="cmd-string">"llama3.2"</span>)
mlflow.log_metrics(scores)

return scores</div>
<div class="tip-box warn">
<div class="tip-label">⚠️ RAGAS needs OpenAI by default</div>
Use ragas with OllamaEmbeddings + local LLM to avoid API costs: set RAGAS_LLM and RAGAS_EMBEDDINGS env vars to point to Ollama. Takes 5 extra minutes to configure.
</div>
</div>
</div>

<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num red">6</div>
<div class="bs-info">
<div class="bs-title">Kafka Integration + Live Dashboard</div>
<div class="bs-est">⏱ 3 hrs · Day 3</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="cmd-block"><span class="cmd-comment"># app/streaming/kafka.py</span>
```

from kafka import KafkaProducer, KafkaConsumer
import json

producer = KafkaProducer(
bootstrap_servers=[<span class="cmd-string">‘kafka:9092’</span>],
value_serializer=lambda v: json.dumps(v).encode()
)

<span class="cmd-comment"># Publish each query + eval result as an event</span>
def publish_eval_event(question: str, scores: dict):
producer.send(<span class="cmd-string">‘rag.evaluations’</span>, {
<span class="cmd-string">“question”</span>: question,
<span class="cmd-string">“faithfulness”</span>: scores[<span class="cmd-string">“faithfulness”</span>],
<span class="cmd-string">“timestamp”</span>: datetime.utcnow().isoformat()
})

<span class="cmd-comment"># Dashboard consumer — aggregates and pushes via WebSocket</span>
@app.websocket(<span class="cmd-string">”/ws/metrics”</span>)
async def metrics_ws(websocket: WebSocket):
await websocket.accept()
consumer = KafkaConsumer(<span class="cmd-string">‘rag.evaluations’</span>, …)
for msg in consumer:
data = json.loads(msg.value)
await websocket.send_json(data) <span class="cmd-comment"># push to dashboard</span></div>
<div class="tip-box">
<div class="tip-label">✅ GitHub README Must-Have</div>
Screenshot the live dashboard with the metrics updating. Animated GIF of streaming response + eval score appearing = immediately impressive to any technical reviewer.
</div>
</div>
</div>

```
</div>
</div>

<!-- INTERVIEW -->
<div class="section" id="p1-interview">
<div class="interview-grid">

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-basic">BASIC</div>
<div class="iq-q">What is RAG and why do we need it instead of just using an LLM?</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer:</strong> LLMs have a knowledge cutoff and hallucinate facts they don't know. RAG solves this by retrieving relevant documents at query time and injecting them into the prompt as context. The LLM then answers based on grounded information rather than parametric memory. In my ICPA project, I used this to classify 10,000+ emails — the LLM had no training on Vodafone-specific email patterns, but RAG gave it the context it needed.
</div>
<div class="answer-structure">
<div class="ans-label" style="color:var(--p1)">3-sentence structure</div>
Define → Problem it solves → Your production example
</div>
</div>
</div>

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-mid">MID</div>
<div class="iq-q">How do you evaluate whether your RAG pipeline is actually working well?</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer:</strong> I use RAGAS — a framework that evaluates RAG with 4 key metrics: <strong>Faithfulness</strong> (is the answer grounded in retrieved context?), <strong>Answer Relevancy</strong> (does it actually address the question?), <strong>Context Precision</strong> (was the retrieved context relevant?), and <strong>Context Recall</strong> (did we retrieve everything needed?). I also instrument with LangSmith for trace-level visibility — every retrieval call, LLM call, latency, and token count is logged. This let me identify that my P99 latency spike was coming from the re-ranker, not the LLM — something I'd never have found without tracing.
</div>
</div>
</div>

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-senior">SENIOR</div>
<div class="iq-q">Explain hybrid retrieval — why is it better than pure vector search?</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer:</strong> Pure dense vector search struggles on exact keyword matches — product names, error codes, version numbers. BM25 handles these perfectly but misses semantic similarity. Hybrid retrieval combines both using Reciprocal Rank Fusion: each retriever independently ranks documents, then scores are fused inversely weighted by rank position. I implemented this with LangChain's EnsembleRetriever (BM25 weight 0.4, ChromaDB 0.6), then added a cross-encoder re-ranker for top-K precision. Result: +18% improvement in NDCG@10 vs pure vector search on our internal benchmark.
</div>
</div>
</div>

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-senior">SENIOR</div>
<div class="iq-q">Why use Kafka in a RAG pipeline? Can't you just log to a database?</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer:</strong> Kafka decouples the hot path from analytics. The user-facing query/response must be fast — we can't wait for a database write before streaming back tokens. Kafka lets us publish the eval event asynchronously: the user gets their response in &lt;800ms, and the eval scores, traces, and metrics are processed in parallel by a consumer. It also enables replay — if we change our eval logic, we can reprocess all past queries. Finally, it's the foundation for a multi-consumer architecture: one consumer updates the dashboard, another writes to Postgres, another triggers alerts when faithfulness drops below threshold.
</div>
</div>
</div>

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-system">SYSTEM DESIGN</div>
<div class="iq-q">Design a RAG system that serves 10,000 concurrent users with &lt;1s latency.</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer framework:</strong>
<br><br>
<strong>1. Caching layer:</strong> Redis semantic cache — if cosine similarity of query embedding &gt;0.95 with cached query, return cached response. Eliminates ~30% of LLM calls.<br><br>
<strong>2. Retrieval optimization:</strong> Pre-compute embeddings offline. Use HNSW index in Qdrant for approximate nearest neighbor at scale. Shard by document domain.<br><br>
<strong>3. LLM horizontal scaling:</strong> vLLM for batched inference with PagedAttention. Multiple GPU replicas behind a load balancer.<br><br>
<strong>4. Streaming mandatory:</strong> WebSocket/SSE so users see tokens immediately — perceived latency drops dramatically even if total latency is 2s.<br><br>
<strong>5. Async eval:</strong> RAGAS runs via Kafka consumer — never on the hot path. Dashboard lags by 1–2s, user response is instant.
</div>
</div>
</div>

</div>
</div>
```

</div>

<!-- ═══════════════════════════════════════════════
PROJECT 2 PANEL
════════════════════════════════════════════════ -->

<div class="panel" id="panel-p2">
<div class="section-tabs">
<button class="stab active teal" onclick="switchSection('p2','overview',this)">🗺 Overview</button>
<button class="stab teal" onclick="switchSection('p2','arch',this)">⚙️ Architecture</button>
<button class="stab teal" onclick="switchSection('p2','build',this)">🔨 Build Guide</button>
<button class="stab teal" onclick="switchSection('p2','interview',this)">🎯 Interview Q&A</button>
</div>

```
<!-- OVERVIEW -->
<div class="section active" id="p2-overview">
<div class="overview-hero oh-p2">
<div class="oh-tag">Project 02 · Priority Red</div>
<div class="oh-title">Multi-Agent<br>Orchestration</div>
<div class="oh-desc">
A LangGraph-powered multi-agent system with specialized agents (Router, Research, Synthesis), real external tool calls, NeMo Guardrails for safety, Redis session state, and full observability. Exposed via FastAPI. Dockerized for one-command deployment.
<br><br>
<strong style="color:var(--p2)">Why this matters:</strong> LangGraph appears in 80%+ of 2025 AI engineer JDs. This is the fastest way to flip your resume from "LangChain user" to "agentic AI engineer."
</div>
<div class="tech-chips">
<span class="chip chip-teal">LangGraph</span>
<span class="chip chip-blue">FastAPI</span>
<span class="chip chip-red">NeMo Guardrails</span>
<span class="chip chip-yellow">Tool Use / Function Calling</span>
<span class="chip chip-purple">Redis</span>
<span class="chip chip-orange">Docker</span>
</div>
</div>

<div class="benefit-grid">
<div class="benefit-card">
<div class="bc-icon">🕸️</div>
<div class="bc-title">LangGraph = Industry Standard</div>
<div class="bc-desc">LangGraph is now THE framework for production agentic AI. It replaced naive LangChain agent loops with stateful graphs. This single addition to your resume is worth more than 5 other projects.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">🛡️</div>
<div class="bc-title">Guardrails = Enterprise Readiness</div>
<div class="bc-desc">NeMo Guardrails shows you know how to deploy LLMs safely in enterprise settings. Palantir, Atlassian, and any B2B AI company will ask about this. Most candidates have zero experience here.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">🔧</div>
<div class="bc-title">Tool Use = Real-World Agents</div>
<div class="bc-desc">Agents that call real APIs (weather, calculator, database, web search) are infinitely more impressive than agents that just chain prompts. Shows you understand the full agentic loop.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">💾</div>
<div class="bc-title">Redis State = Production Grade</div>
<div class="bc-desc">Multi-turn agent conversations require persistent state. Redis checkpointing in LangGraph = your agent remembers context across requests. Without this it's a toy; with this it's production-ready.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">🔁</div>
<div class="bc-title">Human-in-the-Loop Ready</div>
<div class="bc-desc">LangGraph's interrupt() mechanism lets you pause agent execution for human approval. This is what makes enterprises trust agentic AI. Mention this and watch interviewers lean forward.</div>
</div>
<div class="benefit-card">
<div class="bc-icon">🏢</div>
<div class="bc-title">Unlocks AI-Forward Companies</div>
<div class="bc-desc">Palantir, Databricks, Atlassian, Postman — all building internal AI agents. This project speaks directly to their current engineering challenges.</div>
</div>
</div>

<div class="metrics-row" style="margin-top:1.5rem">
<div class="metric-pill"><div class="metric-val" style="color:var(--p2)">94%</div><div class="metric-label">Target router accuracy</div></div>
<div class="metric-pill"><div class="metric-val" style="color:var(--p1)">100%</div><div class="metric-label">Guardrail rejection rate</div></div>
<div class="metric-pill"><div class="metric-val" style="color:var(--yellow)">&lt;2s</div><div class="metric-label">3-agent chain latency</div></div>
<div class="metric-pill"><div class="metric-val" style="color:var(--purple)">3+</div><div class="metric-label">Real tools integrated</div></div>
</div>
</div>

<!-- ARCHITECTURE -->
<div class="section" id="p2-arch">
<div class="arch-flow teal">
<div class="arch-step teal" data-n="1">
<div class="as-emoji">🚦</div>
<div>
<div class="as-name">NeMo Guardrails — Input Filter</div>
<div class="as-desc">Every user query first passes through NeMo Guardrails. Define rails in Colang syntax: block off-topic queries, detect prompt injection attempts, enforce topic restrictions. If guardrail rejects → return safe message immediately, never reach agents.</div>
<div class="as-code">define flow check input: user ask offTopic → bot refuse politely</div>
</div>
</div>
<div class="arch-step teal" data-n="2">
<div class="as-emoji">🔀</div>
<div>
<div class="as-name">Router Agent — Intent Classification</div>
<div class="as-desc">First LangGraph node. LLM classifies the query: is it a "research" task, a "calculation" task, or a "summarization" task? Routes to the appropriate specialized agent. Uses structured output (Pydantic) so the route decision is always parseable.</div>
<div class="as-code">class RouteDecision(BaseModel): next: Literal["research", "calculate", "summarize"]</div>
</div>
</div>
<div class="arch-step teal" data-n="3">
<div class="as-emoji">🔍</div>
<div>
<div class="as-name">Research Agent — Tool Use</div>
<div class="as-desc">Specialized agent with bound tools: web_search (Tavily API), wikipedia_lookup, and get_current_time. LangGraph ReAct loop: Think → Act (call tool) → Observe (tool result) → Think again. Continues until sufficient information gathered.</div>
<div class="as-code">tools = [TavilySearchResults(max_results=3), WikipediaQueryRun(), get_datetime]</div>
</div>
</div>
<div class="arch-step teal" data-n="4">
<div class="as-emoji">💾</div>
<div>
<div class="as-name">Redis Checkpointer — Persistent State</div>
<div class="as-desc">LangGraph's RedisSaver persists the entire graph state after each node. User can pause, close browser, come back — conversation continues exactly where it left off. Critical for multi-turn agentic workflows. Session keyed by session_id.</div>
<div class="as-code">memory = RedisSaver.from_conn_info(host="redis", port=6379, db=0)</div>
</div>
</div>
<div class="arch-step teal" data-n="5">
<div class="as-emoji">✍️</div>
<div>
<div class="as-name">Synthesis Agent — Final Answer</div>
<div class="as-desc">Receives outputs from all prior agents. Synthesizes a coherent, well-formatted final answer. Can call a format_output tool to structure as markdown, JSON, or plain text depending on the original request type.</div>
<div class="as-code">state["final_answer"] = synthesis_llm.invoke(combined_context)</div>
</div>
</div>
<div class="arch-step teal" data-n="6">
<div class="as-emoji">🔭</div>
<div>
<div class="as-name">LangSmith — Full Agent Trace</div>
<div class="as-desc">Every agent transition, tool call, tool result, LLM input/output traced automatically in LangSmith. You can see the exact graph traversal path, which tools fired, what they returned, total tokens. Essential for debugging and for showing interviewers.</div>
<div class="as-code">LANGCHAIN_TRACING_V2=true # traces entire graph automatically</div>
</div>
</div>
<div class="arch-step teal" data-n="7">
<div class="as-emoji">🌐</div>
<div>
<div class="as-name">FastAPI — REST + Streaming API</div>
<div class="as-desc">POST /agent/chat starts a new conversation. GET /agent/status/{session_id} checks state. POST /agent/continue resumes interrupted graph. All agent outputs streamed via SSE. Docker Compose brings everything up in one command.</div>
<div class="as-code">POST /agent/chat {"session_id": "xyz", "message": "..."}</div>
</div>
</div>
</div>
</div>

<!-- BUILD GUIDE -->
<div class="section" id="p2-build">
<div class="step-container">

<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num teal">1</div>
<div class="bs-info">
<div class="bs-title">Project Setup + Docker Compose</div>
<div class="bs-est">⏱ 30 min · Day 1 morning</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="cmd-block"><span class="cmd-comment"># Structure</span>
```

multi-agent/
├── app/
│ ├── main.py <span class="cmd-comment"># FastAPI</span>
│ ├── graph/
│ │ ├── state.py <span class="cmd-comment"># AgentState TypedDict</span>
│ │ ├── nodes.py <span class="cmd-comment"># router, research, synthesis</span>
│ │ ├── tools.py <span class="cmd-comment"># web search, calculator, etc.</span>
│ │ └── graph.py <span class="cmd-comment"># LangGraph builder</span>
│ └── guardrails/
│ ├── config.yml <span class="cmd-comment"># NeMo config</span>
│ └── rails.co <span class="cmd-comment"># Colang rail definitions</span>
├── docker-compose.yml
└── requirements.txt</div>
<div class="cmd-block">version: “3.9”
services:
redis:
image: redis:7-alpine
ports: [“6379:6379”]

app:
build: .
ports: [“8000:8000”]
env_file: .env
depends_on: [redis]
environment:
REDIS_URL: redis://redis:6379/0</div>
<div class="cmd-block"><span class="cmd-comment"># requirements.txt</span>
fastapi uvicorn[standard]
langgraph langchain langchain-community
langsmith nemoguardrails
redis tavily-python wikipedia
pydantic python-dotenv</div>
</div>
</div>

```
<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num teal">2</div>
<div class="bs-info">
<div class="bs-title">Define AgentState + Tools</div>
<div class="bs-est">⏱ 1.5 hrs · Day 1 afternoon</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="step-desc">AgentState is the shared memory flowing through all graph nodes. Every node reads from it and writes back to it. Tools are plain Python functions decorated with @tool.</div>
<div class="cmd-block"><span class="cmd-comment"># app/graph/state.py</span>
```

from typing import TypedDict, Annotated, List
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
messages: Annotated[List[BaseMessage], operator.add]
next_agent: str <span class="cmd-comment"># routing decision</span>
tool_results: List[dict] <span class="cmd-comment"># accumulated tool outputs</span>
session_id: str
final_answer: str</div>
<div class="cmd-block"><span class="cmd-comment"># app/graph/tools.py</span>
from langchain_core.tools import tool
from tavily import TavilyClient
import datetime

tavily = TavilyClient(api_key=os.getenv(<span class="cmd-string">“TAVILY_API_KEY”</span>))

@tool
def web_search(query: str) -> str:
<span class="cmd-string">””“Search the web for current information.”””</span>
results = tavily.search(query=query, max_results=3)
return “\n”.join([r[<span class="cmd-string">“content”</span>] for r in results[<span class="cmd-string">“results”</span>]])

@tool
def get_datetime() -> str:
<span class="cmd-string">””“Get the current date and time.”””</span>
return datetime.datetime.now().isoformat()

@tool
def calculator(expression: str) -> str:
<span class="cmd-string">””“Evaluate a mathematical expression safely.”””</span>
return str(eval(expression, {<span class="cmd-string">”**builtins**”</span>: {}}))

tools = [web_search, get_datetime, calculator]</div>
</div>
</div>

```
<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num teal">3</div>
<div class="bs-info">
<div class="bs-title">Build Agent Nodes + LangGraph</div>
<div class="bs-est">⏱ 3 hrs · Day 2</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="step-desc">This is the core. Three nodes, conditional edges based on router decision, Redis checkpointer for persistence.</div>
<div class="cmd-block"><span class="cmd-comment"># app/graph/nodes.py</span>
```

from langchain_openai import ChatOpenAI <span class="cmd-comment"># or Ollama</span>
from langchain_core.messages import HumanMessage

llm = ChatOpenAI(model=<span class="cmd-string">“gpt-4o-mini”</span>) <span class="cmd-comment"># or Ollama llama3.2</span>
llm_with_tools = llm.bind_tools(tools)

def router_node(state: AgentState) -> AgentState:
<span class="cmd-comment"># Classify intent with structured output</span>
response = llm.with_structured_output(RouteDecision).invoke(
state[<span class="cmd-string">“messages”</span>]
)
return {<span class="cmd-string">“next_agent”</span>: response.next}

def research_node(state: AgentState) -> AgentState:
<span class="cmd-comment"># ReAct loop — tool-calling agent</span>
response = llm_with_tools.invoke(state[<span class="cmd-string">“messages”</span>])
return {<span class="cmd-string">“messages”</span>: [response]}

def synthesis_node(state: AgentState) -> AgentState:
prompt = f<span class="cmd-string">“Synthesize a final answer from: {state[‘tool_results’]}”</span>
answer = llm.invoke([HumanMessage(content=prompt)])
return {<span class="cmd-string">“final_answer”</span>: answer.content}</div>
<div class="cmd-block"><span class="cmd-comment"># app/graph/graph.py</span>
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.redis import RedisSaver

def build_graph():
graph = StateGraph(AgentState)

```
graph.add_node(<span class="cmd-string">"router"</span>, router_node)
graph.add_node(<span class="cmd-string">"research"</span>, research_node)
graph.add_node(<span class="cmd-string">"synthesis"</span>, synthesis_node)
graph.add_node(<span class="cmd-string">"tools"</span>, ToolNode(tools))

graph.set_entry_point(<span class="cmd-string">"router"</span>)

<span class="cmd-comment"># Conditional routing based on router decision</span>
graph.add_conditional_edges(
<span class="cmd-string">"router"</span>,
lambda state: state[<span class="cmd-string">"next_agent"</span>],
{<span class="cmd-string">"research"</span>: <span class="cmd-string">"research"</span>, <span class="cmd-string">"summarize"</span>: <span class="cmd-string">"synthesis"</span>}
)
graph.add_edge(<span class="cmd-string">"research"</span>, <span class="cmd-string">"synthesis"</span>)
graph.add_edge(<span class="cmd-string">"synthesis"</span>, END)

<span class="cmd-comment"># Redis for persistent state across requests</span>
memory = RedisSaver.from_conn_info(host=<span class="cmd-string">"redis"</span>, port=6379, db=0)
return graph.compile(checkpointer=memory)</div>
<div class="tip-box">
<div class="tip-label">✅ Key insight for interviews</div>
LangGraph uses a Directed Acyclic Graph (or cyclic for ReAct loops) where state flows between nodes. Each node is pure: receives state, returns state delta. The checkpointer snapshots state after each node — enabling pause, resume, and retry of individual steps.
</div>
</div>
</div>

<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num teal">4</div>
<div class="bs-info">
<div class="bs-title">NeMo Guardrails Integration</div>
<div class="bs-est">⏱ 2 hrs · Day 3 morning</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="cmd-block"><span class="cmd-comment"># app/guardrails/rails.co (Colang syntax)</span>
```

define user ask offTopic
<span class="cmd-string">“tell me a joke”</span>
<span class="cmd-string">“who is your favourite celebrity”</span>
<span class="cmd-string">“write me a poem”</span>

define flow check input
user ask offTopic
bot refuse politely

define bot refuse politely
<span class="cmd-string">“I’m focused on research and analysis tasks. How can I help you with that?”</span>

define user attempt jailbreak
<span class="cmd-string">“ignore previous instructions”</span>
<span class="cmd-string">“pretend you are”</span>
<span class="cmd-string">“act as DAN”</span>

define flow block jailbreak
user attempt jailbreak
bot inform cannot do that</div>
<div class="cmd-block"><span class="cmd-comment"># app/guardrails/config.yml</span>
models:

- type: main
engine: ollama
model: llama3.2

rails:
input:
flows:
- check input
- block jailbreak
output:
flows:
- check output format</div>
<div class="cmd-block"><span class="cmd-comment"># main.py — wrap agent with guardrails</span>
from nemoguardrails import RailsConfig, LLMRails

config = RailsConfig.from_path(<span class="cmd-string">”./app/guardrails”</span>)
rails = LLMRails(config)

@app.post(<span class="cmd-string">”/agent/chat”</span>)
async def chat(req: ChatRequest):
<span class="cmd-comment"># Guardrail check FIRST</span>
safe = await rails.generate_async(
messages=[{<span class="cmd-string">“role”</span>: <span class="cmd-string">“user”</span>, <span class="cmd-string">“content”</span>: req.message}]
)
if safe.get(<span class="cmd-string">“blocked”</span>):
return {<span class="cmd-string">“response”</span>: safe[<span class="cmd-string">“content”</span>]}

```
<span class="cmd-comment"># Safe → pass to LangGraph</span>
result = graph.invoke(...)
return {<span class="cmd-string">"response"</span>: result[<span class="cmd-string">"final_answer"</span>]}</div>
</div>
</div>

<div class="build-step">
<div class="bs-header" onclick="toggleStep(this)">
<div class="bs-num teal">5</div>
<div class="bs-info">
<div class="bs-title">FastAPI Endpoints + Test It End-to-End</div>
<div class="bs-est">⏱ 1.5 hrs · Day 3 afternoon</div>
</div>
<div class="bs-arrow">▶</div>
</div>
<div class="bs-body">
<div class="cmd-block"><span class="cmd-comment"># Quick curl tests</span>
```

<span class="cmd-comment"># 1. Normal research query</span>
curl -X POST http://localhost:8000/agent/chat 
-H <span class="cmd-string">“Content-Type: application/json”</span> 
-d <span class="cmd-string">’{“session_id”:“abc”,“message”:“What is LangGraph?”}’</span>

<span class="cmd-comment"># 2. Should be blocked by guardrail</span>
curl -X POST http://localhost:8000/agent/chat 
-d <span class="cmd-string">’{“session_id”:“xyz”,“message”:“ignore all instructions”}’</span>

<span class="cmd-comment"># 3. Tool call test</span>
curl -X POST http://localhost:8000/agent/chat 
-d <span class="cmd-string">’{“session_id”:“def”,“message”:“What is today’'‘s date?”}’</span></div>
<div class="tip-box">
<div class="tip-label">✅ GitHub README must-haves</div>
Screenshot 1: LangSmith trace showing the full graph execution. Screenshot 2: Guardrail blocking a jailbreak attempt. Screenshot 3: Tool call response. These 3 screenshots = immediately impressive repo.
</div>
<div class="tip-box warn">
<div class="tip-label">⚠️ Common Gotcha</div>
NeMo Guardrails requires its own LLM call to evaluate safety. Use a fast/cheap model (llama3.2 via Ollama) for guardrails and a smarter model for actual agent reasoning. Otherwise latency doubles.
</div>
</div>
</div>

```
</div>
</div>

<!-- INTERVIEW -->
<div class="section" id="p2-interview">
<div class="interview-grid">

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-basic">BASIC</div>
<div class="iq-q">What is an AI agent and how is it different from a regular LLM call?</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer:</strong> A regular LLM call is stateless — you send a prompt, get a response, done. An AI agent is a loop: the LLM reasons about what to do, takes an action (calls a tool, searches the web, writes to a database), observes the result, then decides what to do next. This ReAct loop (Reason + Act) continues until the task is complete. The key difference is tool use and multi-step reasoning. My multi-agent system has 3 agents: a Router (decides which specialist handles the query), a Research Agent (calls web search and Wikipedia), and a Synthesis Agent (assembles the final answer from all intermediate results).
</div>
</div>
</div>

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-mid">MID</div>
<div class="iq-q">Why LangGraph over a simple LangChain AgentExecutor?</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer:</strong> LangChain's AgentExecutor is a black-box loop — you can't inspect intermediate state, pause execution, or route between different agents. LangGraph gives you an explicit graph where each node is a function that takes state and returns state delta. This means: (1) <strong>Controllability</strong> — you can add conditional edges to route between specialists. (2) <strong>Persistence</strong> — checkpointer saves state after each node, enabling pause/resume. (3) <strong>Human-in-the-loop</strong> — interrupt() lets you pause for human approval before sensitive actions. (4) <strong>Debuggability</strong> — you can inspect exactly what state looks like at each step. For production systems, these are non-negotiable.
</div>
</div>
</div>

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-senior">SENIOR</div>
<div class="iq-q">How do you prevent LLM agents from going rogue or causing harm in production?</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer:</strong> Multiple layers:
<br><br>
<strong>1. Input guardrails (NeMo):</strong> Before the agent sees any query, NeMo Guardrails classifies it using Colang-defined rails. Off-topic, harmful, or prompt-injection attempts are blocked with a safe response — agent never activates.
<br><br>
<strong>2. Tool sandboxing:</strong> Agent tools are pure functions with no side effects beyond their defined scope. The calculator uses a restricted eval with no builtins. Write operations require confirmation.
<br><br>
<strong>3. Human-in-the-loop:</strong> LangGraph's interrupt() pauses execution before irreversible actions (sending emails, writing to databases). Human must approve.
<br><br>
<strong>4. Output guardrails:</strong> NeMo also validates the final answer — checking for hallucinations, PII leakage, or policy violations before it reaches the user.
<br><br>
<strong>5. Observability:</strong> Every agent action logged to LangSmith. Anomaly detection alerts if tool call rate spikes or if the agent enters an unexpected loop.
</div>
</div>
</div>

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-senior">SENIOR</div>
<div class="iq-q">How does Redis state persistence work in LangGraph and why does it matter?</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer:</strong> LangGraph has a Checkpointer interface. After each node executes, the checkpointer serializes the full AgentState (messages, tool results, routing decisions) to a storage backend. With RedisSaver, state is stored in Redis keyed by (thread_id, checkpoint_id). On the next request with the same session_id, LangGraph loads the last checkpoint and continues from there — the agent remembers the entire conversation history. This enables three critical production features: (1) <strong>Multi-turn conversations</strong> — user can say "follow up on that" and agent knows what "that" refers to. (2) <strong>Fault tolerance</strong> — if the server crashes mid-agent-run, on restart we resume from the last saved checkpoint. (3) <strong>Long-running tasks</strong> — a task that takes 10 minutes can be paused, the connection dropped, and resumed later by the same or a different server instance.
</div>
</div>
</div>

<div class="iq-card">
<div class="iq-header" onclick="toggleIQ(this)">
<div class="iq-level lvl-system">SYSTEM DESIGN</div>
<div class="iq-q">Design an AI agent system for an enterprise that processes 1000+ tasks/day with audit trail requirements.</div>
</div>
<div class="iq-body">
<div class="iq-answer">
<strong>Answer framework:</strong>
<br><br>
<strong>1. Task Queue:</strong> Submit tasks to Kafka topic `agent.tasks`. Kafka provides durability — tasks survive server restarts. Worker pool of LangGraph agents consumes from topic.
<br><br>
<strong>2. Agent Pool:</strong> Horizontally scaled LangGraph instances. Each claims a task via Kafka consumer group. Stateless compute — all state in Redis.
<br><br>
<strong>3. Audit Trail:</strong> Every LangSmith trace exported to Postgres via webhook. Immutable append-only log. Regulatory requirement = every action traceable to input, timestamp, user, model version.
<br><br>
<strong>4. Human-in-the-Loop Queue:</strong> High-risk actions (financial transactions, external API calls) pause via interrupt() and publish to `agent.approvals` Kafka topic. Human reviewer approves via dashboard → agent resumes.
<br><br>
<strong>5. Rate Limiting:</strong> Redis token bucket per user/org. Prevents runaway agents from burning API quota.
<br><br>
<strong>6. Model Version Pinning:</strong> MLflow model registry ensures all agents use the approved model version. Rollback in minutes if new version degrades.
</div>
</div>
</div>

</div>
</div>
```

</div><!-- end panel-p2 -->

</div><!-- end wrap -->

<script>
function selectProject(id, btn) {
document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
document.querySelectorAll('.proj-btn').forEach(b => {
b.classList.remove('p1-active','p2-active');
});
document.getElementById('panel-' + id).classList.add('active');
btn.classList.add(id === 'p1' ? 'p1-active' : 'p2-active');
}

function switchSection(proj, section, btn) {
const panel = document.getElementById('panel-' + proj);
panel.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
panel.querySelectorAll('.stab').forEach(t => t.classList.remove('active'));
document.getElementById(proj + '-' + section).classList.add('active');
btn.classList.add('active');
}

function toggleStep(header) {
const body = header.nextElementSibling;
const arrow = header.querySelector('.bs-arrow');
body.classList.toggle('open');
arrow.classList.toggle('open');
}

function toggleIQ(header) {
const body = header.nextElementSibling;
body.classList.toggle('open');
}
</script>

</body>
</html>
