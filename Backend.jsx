import { useState } from "react";

const SECTIONS = [
  { id: "python-core", label: "Python Core", icon: "🐍" },
  { id: "fastapi", label: "FastAPI & REST", icon: "⚡" },
  { id: "microservices", label: "Microservices", icon: "🔧" },
  { id: "databases", label: "Databases", icon: "🗄️" },
  { id: "messaging", label: "Kafka & RabbitMQ", icon: "📨" },
  { id: "docker-k8s", label: "Docker & K8s", icon: "🐳" },
  { id: "cloud", label: "Cloud & AWS", icon: "☁️" },
  { id: "security", label: "OAuth2 & JWT", icon: "🔐" },
  { id: "observability", label: "Observability", icon: "📊" },
  { id: "testing", label: "Testing & CI/CD", icon: "✅" },
  { id: "system-design", label: "System Design", icon: "🏗️" },
];

const Code = ({ code, lang = "python" }) => (
  <pre style={{
    background: "#0d1117",
    border: "1px solid #21262d",
    borderRadius: "8px",
    padding: "16px",
    overflowX: "auto",
    fontSize: "12.5px",
    lineHeight: "1.7",
    color: "#e6edf3",
    margin: "12px 0",
    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
  }}>
    <code>{code}</code>
  </pre>
);

const Badge = ({ text, color = "#1f6feb" }) => (
  <span style={{
    background: color + "22",
    color: color,
    border: `1px solid ${color}44`,
    borderRadius: "4px",
    padding: "2px 8px",
    fontSize: "11px",
    fontWeight: 600,
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  }}>{text}</span>
);

const Card = ({ title, badge, badgeColor, children }) => (
  <div style={{
    background: "#161b22",
    border: "1px solid #30363d",
    borderRadius: "10px",
    padding: "20px 24px",
    marginBottom: "20px",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
      <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 700, color: "#e6edf3" }}>{title}</h3>
      {badge && <Badge text={badge} color={badgeColor || "#1f6feb"} />}
    </div>
    {children}
  </div>
);

const Tip = ({ children }) => (
  <div style={{
    background: "#0d419d22",
    border: "1px solid #1f6feb55",
    borderLeft: "3px solid #1f6feb",
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#79c0ff",
    margin: "10px 0",
  }}>💡 <strong>Interview tip:</strong> {children}
  </div>
);

const Warn = ({ children }) => (
  <div style={{
    background: "#f0883e11",
    border: "1px solid #f0883e44",
    borderLeft: "3px solid #f0883e",
    borderRadius: "6px",
    padding: "10px 14px",
    fontSize: "13px",
    color: "#f0883e",
    margin: "10px 0",
  }}>⚠️ {children}
  </div>
);

// ── SECTION CONTENT ──────────────────────────────────────────────────
const sections = {
  "python-core": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>OOP, async/await, type hints, generators, decorators — the daily toolkit for production Python.</p>

      <Card title="OOP — SOLID in Practice" badge="Core" badgeColor="#3fb950">
        <Code code={`from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from typing import List, Optional
import asyncio

# Single Responsibility — each class owns one concern
@dataclass
class OrderItem:
    product_id: str
    quantity: int
    unit_price: float

    @property
    def total(self) -> float:
        return self.quantity * self.unit_price


# Open/Closed — extend via inheritance, not mutation
class DiscountStrategy(ABC):
    @abstractmethod
    def apply(self, amount: float) -> float: ...

class PercentageDiscount(DiscountStrategy):
    def __init__(self, pct: float): self.pct = pct
    def apply(self, amount: float) -> float:
        return amount * (1 - self.pct / 100)

class NoDiscount(DiscountStrategy):
    def apply(self, amount: float) -> float: return amount


# Dependency Inversion — depend on abstractions
class OrderService:
    def __init__(self, discount: DiscountStrategy):
        self._discount = discount

    def calculate_total(self, items: List[OrderItem]) -> float:
        raw = sum(i.total for i in items)
        return self._discount.apply(raw)

# Usage
svc = OrderService(PercentageDiscount(10))
items = [OrderItem("SKU-1", 2, 50.0), OrderItem("SKU-2", 1, 30.0)]
print(svc.calculate_total(items))  # 117.0`} />
        <Tip>Interviewers love "what SOLID principle did you use here?" — anchor to DiscountStrategy + DI pattern from your ICPA LLM backend.</Tip>
      </Card>

      <Card title="Async / Await — I/O Concurrency" badge="Critical" badgeColor="#f85149">
        <Code code={`import asyncio
import aiohttp
from contextlib import asynccontextmanager

# Concurrent API calls — not sequential!
async def fetch(session: aiohttp.ClientSession, url: str) -> dict:
    async with session.get(url) as resp:
        resp.raise_for_status()
        return await resp.json()

async def fetch_all(urls: list[str]) -> list[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, u) for u in urls]
        return await asyncio.gather(*tasks, return_exceptions=True)


# Background task pattern (used heavily in FastAPI)
async def send_email(to: str, body: str):
    await asyncio.sleep(0.1)   # simulate SMTP
    print(f"Email sent to {to}")

async def main():
    # fire-and-forget
    asyncio.create_task(send_email("user@example.com", "Welcome!"))
    print("Handler returned — email still sending in background")
    await asyncio.sleep(0.5)   # let task complete in demo

asyncio.run(main())`} />
        <Tip>Distinguish asyncio (single-threaded event loop, I/O-bound) from threading (CPU-bound GIL-limited) and multiprocessing (true parallelism). Know this cold.</Tip>
      </Card>

      <Card title="Generators & Context Managers" badge="Intermediate">
        <Code code={`from typing import Generator
import contextlib

# Generator for lazy data streaming (critical for large pipelines)
def chunked_reader(filepath: str, chunk_size: int = 1024) -> Generator[bytes, None, None]:
    with open(filepath, "rb") as f:
        while chunk := f.read(chunk_size):
            yield chunk

# Process 10 GB file without loading into memory
for chunk in chunked_reader("large_file.bin"):
    process(chunk)


# Custom context manager with __enter__ / __exit__
class DatabaseTransaction:
    def __init__(self, conn): self.conn = conn

    def __enter__(self):
        self.conn.begin()
        return self.conn

    def __exit__(self, exc_type, *_):
        if exc_type:
            self.conn.rollback()
        else:
            self.conn.commit()

# Decorator-based context manager (cleaner)
@contextlib.contextmanager
def managed_transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise`} />
      </Card>

      <Card title="Decorators — Cross-Cutting Concerns" badge="Intermediate">
        <Code code={`import functools, time, logging
from typing import Callable

logger = logging.getLogger(__name__)

def retry(max_attempts: int = 3, delay: float = 1.0, exceptions=(Exception,)):
    """Production-grade retry decorator with exponential backoff."""
    def decorator(fn: Callable):
        @functools.wraps(fn)
        async def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return await fn(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts:
                        raise
                    wait = delay * (2 ** (attempt - 1))
                    logger.warning(f"{fn.__name__} attempt {attempt} failed: {e}. Retrying in {wait}s")
                    await asyncio.sleep(wait)
        return wrapper
    return decorator

def timed(fn: Callable):
    @functools.wraps(fn)
    async def wrapper(*args, **kwargs):
        t0 = time.perf_counter()
        result = await fn(*args, **kwargs)
        logger.info(f"{fn.__name__} took {(time.perf_counter()-t0)*1000:.2f}ms")
        return result
    return wrapper

# Combining decorators
@retry(max_attempts=3, delay=0.5, exceptions=(aiohttp.ClientError,))
@timed
async def call_external_api(url: str) -> dict:
    async with aiohttp.ClientSession() as s:
        async with s.get(url) as r:
            return await r.json()`} />
      </Card>
    </div>
  ),

  "fastapi": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>Production FastAPI patterns — dependency injection, middleware, versioning, and OpenAPI best practices.</p>

      <Card title="App Factory + Lifespan" badge="Core" badgeColor="#3fb950">
        <Code code={`from fastapi import FastAPI
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
import redis.asyncio as aioredis

# ── Lifespan: startup / shutdown ──────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    app.state.db_engine = create_async_engine(
        "postgresql+asyncpg://user:pass@localhost/db",
        pool_size=10, max_overflow=20
    )
    app.state.redis = await aioredis.from_url("redis://localhost:6379")
    print("✅ DB & Redis pools initialised")
    yield
    # Shutdown
    await app.state.db_engine.dispose()
    await app.state.redis.close()
    print("🔒 Connections closed")

def create_app() -> FastAPI:
    app = FastAPI(
        title="Order Service",
        version="1.0.0",
        lifespan=lifespan,
        docs_url="/api/docs",
        redoc_url=None,
    )
    from .routers import orders, health
    app.include_router(orders.router, prefix="/api/v1/orders", tags=["orders"])
    app.include_router(health.router, prefix="/health", tags=["health"])
    return app

app = create_app()`} />
      </Card>

      <Card title="Dependency Injection + DB Session" badge="Core" badgeColor="#3fb950">
        <Code code={`from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator
import jwt

# ── Reusable DB session dep ──────────────────────────
async def get_db(request: Request) -> AsyncGenerator[AsyncSession, None]:
    SessionLocal = sessionmaker(
        request.app.state.db_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with SessionLocal() as session:
        yield session

# ── JWT auth dep ──────────────────────────────────────
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid token")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Token invalid")

    user = await UserRepository(db).get(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# ── Route using both deps ─────────────────────────────
@router.get("/{order_id}", response_model=OrderSchema)
async def get_order(
    order_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = await OrderRepository(db).get(order_id)
    if not order or order.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Order not found")
    return order`} />
      </Card>

      <Card title="Request Validation with Pydantic v2" badge="Core" badgeColor="#3fb950">
        <Code code={`from pydantic import BaseModel, field_validator, model_validator, Field
from typing import Optional
from decimal import Decimal
from datetime import datetime
from uuid import UUID

class CreateOrderRequest(BaseModel):
    model_config = {"str_strip_whitespace": True}

    customer_id: UUID
    items: list[OrderItemSchema] = Field(..., min_length=1, max_length=100)
    coupon_code: Optional[str] = Field(None, pattern=r"^[A-Z0-9]{6,12}$")
    delivery_address: str = Field(..., min_length=10, max_length=500)

    @field_validator("items")
    @classmethod
    def validate_quantities(cls, items):
        for item in items:
            if item.quantity <= 0:
                raise ValueError(f"Quantity must be positive for {item.product_id}")
        return items

    @model_validator(mode="after")
    def check_total(self) -> "CreateOrderRequest":
        total = sum(i.quantity * i.unit_price for i in self.items)
        if total > Decimal("10000.00"):
            raise ValueError("Order total exceeds maximum allowed")
        return self

class OrderResponse(BaseModel):
    id: UUID
    status: str
    total: Decimal
    created_at: datetime

    model_config = {"from_attributes": True}  # ORM mode`} />
        <Tip>Pydantic v2 uses model_config instead of class Config — know the migration. from_attributes replaces orm_mode=True.</Tip>
      </Card>

      <Card title="Middleware — CORS, Rate Limiting, Tracing" badge="Intermediate">
        <Code code={`from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import uuid, time

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com"],
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type"],
)

# Custom request tracing middleware
class TracingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request.state.request_id = request_id
        start = time.perf_counter()

        response = await call_next(request)

        duration = (time.perf_counter() - start) * 1000
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Response-Time"] = f"{duration:.2f}ms"
        logger.info(
            "request",
            extra={"request_id": request_id, "path": request.url.path,
                   "method": request.method, "status": response.status_code,
                   "duration_ms": duration}
        )
        return response

app.add_middleware(TracingMiddleware)`} />
      </Card>

      <Card title="API Versioning Patterns" badge="Architecture">
        <Code code={`# ── Pattern 1: URL prefix versioning (most common) ──
from fastapi import APIRouter

v1_router = APIRouter(prefix="/api/v1")
v2_router = APIRouter(prefix="/api/v2")

@v1_router.get("/users/{id}")
async def get_user_v1(id: UUID): ...

@v2_router.get("/users/{id}")
async def get_user_v2(id: UUID): ...  # may return more fields

app.include_router(v1_router)
app.include_router(v2_router)

# ── Pattern 2: Header versioning ─────────────────────
from fastapi import Header

@router.get("/users/{id}")
async def get_user(
    id: UUID,
    api_version: str = Header(default="1.0", alias="X-API-Version")
):
    if api_version == "2.0":
        return await UserServiceV2.get(id)
    return await UserServiceV1.get(id)`} />
      </Card>
    </div>
  ),

  "microservices": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>Service decomposition, inter-service communication, API gateways, circuit breakers, and event-driven design.</p>

      <Card title="Service Decomposition Principles" badge="Architecture" badgeColor="#a371f7">
        <Code code={`# Domain-Driven Design — bounded contexts map to services
# E-commerce platform decomposition:
#
#  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐
#  │ Order Svc   │  │ Product Svc │  │ Payment Svc  │
#  │  FastAPI    │  │   FastAPI   │  │   FastAPI    │
#  │  Postgres   │  │  MongoDB    │  │   Postgres   │
#  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘
#         │                │                 │
#         └────────────────┴─────────────────┘
#                     Kafka / RabbitMQ
#
# Each service:
#   - Owns its own data store (no shared DB!)
#   - Communicates via APIs or events (not direct DB queries)
#   - Can be deployed independently
#   - Fails without cascading (circuit breaker / bulkhead)

# Stateless design — state lives in Redis/DB, not in-process
class OrderHandler:
    def __init__(self, order_repo: OrderRepository, cache: Redis):
        self._repo = order_repo
        self._cache = cache

    async def get_order(self, order_id: str) -> Order:
        # Check cache first (stateless service, Redis is the state store)
        cached = await self._cache.get(f"order:{order_id}")
        if cached:
            return Order.model_validate_json(cached)
        order = await self._repo.get(order_id)
        await self._cache.setex(f"order:{order_id}", 300, order.model_dump_json())
        return order`} />
        <Tip>The "no shared DB" rule is the most common microservices trap. If two services share a DB, you have a distributed monolith — say this in interviews.</Tip>
      </Card>

      <Card title="Sync Inter-Service Call with Circuit Breaker" badge="Resilience" badgeColor="#f85149">
        <Code code={`import httpx
from circuitbreaker import circuit
from tenacity import retry, stop_after_attempt, wait_exponential

# Circuit breaker — opens after 5 failures, tries again after 60s
@circuit(failure_threshold=5, recovery_timeout=60, expected_exception=httpx.HTTPError)
async def _call_product_service(product_id: str) -> dict:
    async with httpx.AsyncClient(timeout=3.0) as client:
        response = await client.get(
            f"http://product-service/api/v1/products/{product_id}",
            headers={"X-Request-ID": get_request_id()}
        )
        response.raise_for_status()
        return response.json()

# Retry with exponential backoff wrapping the circuit-broken call
@retry(stop=stop_after_attempt(3), wait=wait_exponential(min=0.1, max=2))
async def get_product(product_id: str) -> dict:
    try:
        return await _call_product_service(product_id)
    except Exception as e:
        logger.error(f"Product service unavailable: {e}")
        # Graceful degradation — return cached/default
        cached = await redis.get(f"product:{product_id}")
        if cached:
            return json.loads(cached)
        raise HTTPException(503, "Product service unavailable")

# Service discovery with environment-based config
import os

class ServiceRegistry:
    SERVICES = {
        "product": os.getenv("PRODUCT_SERVICE_URL", "http://product-service:8000"),
        "payment": os.getenv("PAYMENT_SERVICE_URL", "http://payment-service:8001"),
        "notification": os.getenv("NOTIFICATION_SERVICE_URL", "http://notification-service:8002"),
    }

    @classmethod
    def url(cls, name: str) -> str:
        return cls.SERVICES[name]`} />
      </Card>

      <Card title="Event-Driven — Saga Pattern" badge="Pattern" badgeColor="#a371f7">
        <Code code={`# Choreography-based Saga for distributed order processing
# Each service listens for events and emits the next

from enum import Enum
from dataclasses import dataclass
import json

class OrderEvents(str, Enum):
    ORDER_CREATED    = "order.created"
    PAYMENT_PROCESSED = "payment.processed"
    PAYMENT_FAILED   = "payment.failed"
    INVENTORY_RESERVED = "inventory.reserved"
    ORDER_COMPLETED  = "order.completed"
    ORDER_CANCELLED  = "order.cancelled"   # compensating tx

@dataclass
class Event:
    type: str
    aggregate_id: str
    payload: dict
    correlation_id: str  # trace the saga

# Order Service emits:
async def create_order(cmd: CreateOrderCommand) -> Order:
    order = Order.create(cmd)
    await order_repo.save(order)
    await event_bus.publish(Event(
        type=OrderEvents.ORDER_CREATED,
        aggregate_id=str(order.id),
        payload={"items": cmd.items, "total": order.total},
        correlation_id=cmd.correlation_id,
    ))
    return order

# Payment Service listens & emits:
@event_bus.subscribe(OrderEvents.ORDER_CREATED)
async def handle_order_created(event: Event):
    result = await payment_gateway.charge(
        amount=event.payload["total"],
        order_id=event.aggregate_id
    )
    next_event = OrderEvents.PAYMENT_PROCESSED if result.success else OrderEvents.PAYMENT_FAILED
    await event_bus.publish(Event(
        type=next_event,
        aggregate_id=event.aggregate_id,
        payload={"payment_id": result.payment_id},
        correlation_id=event.correlation_id,
    ))

# Compensating transaction on failure
@event_bus.subscribe(OrderEvents.PAYMENT_FAILED)
async def handle_payment_failed(event: Event):
    await order_repo.update_status(event.aggregate_id, "CANCELLED")
    await inventory_service.release_reservation(event.aggregate_id)
    await event_bus.publish(Event(
        type=OrderEvents.ORDER_CANCELLED,
        aggregate_id=event.aggregate_id,
        payload={"reason": "payment_failed"},
        correlation_id=event.correlation_id,
    ))`} />
        <Tip>Know the difference: Choreography (services react to events, less coupling) vs Orchestration (central coordinator, easier to visualise). Relate to your LangGraph orchestrator in ICPA.</Tip>
      </Card>

      <Card title="API Gateway Pattern" badge="Infrastructure">
        <Code code={`# Lightweight gateway with FastAPI + httpx
# Handles: auth, rate limiting, routing, aggregation

from fastapi import FastAPI, Request, Depends
from redis.asyncio import Redis
import httpx

ROUTES = {
    "/orders":    "http://order-service:8000",
    "/products":  "http://product-service:8001",
    "/users":     "http://user-service:8002",
}

@app.api_route("/{path:path}", methods=["GET","POST","PUT","DELETE","PATCH"])
async def gateway(
    path: str,
    request: Request,
    user: dict = Depends(verify_gateway_token),   # auth at gateway
    _: None = Depends(rate_limit),                 # rate limit at gateway
):
    # Route to correct upstream
    upstream = next(
        (url for prefix, url in ROUTES.items() if f"/{path}".startswith(prefix)),
        None
    )
    if not upstream:
        raise HTTPException(404, "Route not found")

    # Forward request (propagate headers, body, query params)
    async with httpx.AsyncClient() as client:
        upstream_url = f"{upstream}/{path}"
        resp = await client.request(
            method=request.method,
            url=upstream_url,
            headers={**dict(request.headers), "X-User-ID": str(user["id"])},
            content=await request.body(),
            params=dict(request.query_params),
        )

    return Response(
        content=resp.content,
        status_code=resp.status_code,
        headers=dict(resp.headers),
    )`} />
      </Card>
    </div>
  ),

  "databases": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>SQLAlchemy async, connection pooling, MongoDB motor, Redis caching, and query optimisation.</p>

      <Card title="SQLAlchemy Async — ORM + Repository Pattern" badge="Core" badgeColor="#3fb950">
        <Code code={`from sqlalchemy import Column, String, Numeric, ForeignKey, Index, func
from sqlalchemy.orm import DeclarativeBase, relationship, selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from uuid import UUID
import uuid

class Base(DeclarativeBase): pass

class Order(Base):
    __tablename__ = "orders"
    __table_args__ = (
        Index("ix_orders_customer_status", "customer_id", "status"),
        Index("ix_orders_created_at", "created_at"),
    )

    id          = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    customer_id = Column(String, nullable=False)
    status      = Column(String, default="PENDING")
    total       = Column(Numeric(12, 2))
    items       = relationship("OrderItem", back_populates="order", lazy="selectin")

# ── Repository abstraction ───────────────────────────
class OrderRepository:
    def __init__(self, session: AsyncSession):
        self._session = session

    async def get(self, order_id: str) -> Order | None:
        result = await self._session.execute(
            select(Order)
            .options(selectinload(Order.items))   # avoid N+1!
            .where(Order.id == order_id)
        )
        return result.scalar_one_or_none()

    async def get_by_customer(
        self, customer_id: str, status: str | None = None,
        limit: int = 20, offset: int = 0
    ) -> list[Order]:
        q = select(Order).where(Order.customer_id == customer_id)
        if status:
            q = q.where(Order.status == status)
        q = q.order_by(Order.created_at.desc()).limit(limit).offset(offset)
        result = await self._session.execute(q)
        return result.scalars().all()

    async def save(self, order: Order) -> Order:
        self._session.add(order)
        await self._session.flush()   # get auto-generated id
        return order`} />
        <Tip>selectinload prevents the N+1 query problem. Mention this explicitly — it shows production awareness. Relates to your Cohere embeddings retrieval pipeline.</Tip>
      </Card>

      <Card title="Database Migrations with Alembic" badge="DevOps">
        <Code code={`# alembic/env.py — async setup
from alembic import context
from sqlalchemy.ext.asyncio import create_async_engine
from app.models import Base

config = context.config

async def run_migrations_online():
    engine = create_async_engine(config.get_main_option("sqlalchemy.url"))
    async with engine.begin() as conn:
        await conn.run_sync(
            context.run_migrations,
            target_metadata=Base.metadata
        )

# ── Generate migration ───────────────────────────────
# $ alembic revision --autogenerate -m "add_orders_table"

# ── Auto-generated migration ─────────────────────────
def upgrade():
    op.create_table(
        "orders",
        sa.Column("id", sa.String(), nullable=False),
        sa.Column("customer_id", sa.String(), nullable=False),
        sa.Column("status", sa.String(), server_default="PENDING"),
        sa.Column("total", sa.Numeric(12, 2)),
        sa.Column("created_at", sa.DateTime(timezone=True),
                  server_default=sa.func.now()),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index("ix_orders_customer_id", "orders", ["customer_id"])

def downgrade():
    op.drop_table("orders")`} />
      </Card>

      <Card title="MongoDB with Motor (Async)" badge="NoSQL">
        <Code code={`from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import IndexModel, ASCENDING, DESCENDING, TEXT
from bson import ObjectId
from typing import Any

class ProductRepository:
    def __init__(self, db: AsyncIOMotorClient):
        self._col = db["ecommerce"]["products"]

    async def ensure_indexes(self):
        await self._col.create_indexes([
            IndexModel([("sku", ASCENDING)], unique=True),
            IndexModel([("category", ASCENDING), ("price", ASCENDING)]),
            IndexModel([("name", TEXT), ("description", TEXT)]),  # full-text
        ])

    async def search(
        self,
        query: str | None = None,
        category: str | None = None,
        min_price: float | None = None,
        max_price: float | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> list[dict]:
        filter_doc: dict[str, Any] = {}
        if query:
            filter_doc["$text"] = {"$search": query}
        if category:
            filter_doc["category"] = category
        if min_price or max_price:
            filter_doc["price"] = {}
            if min_price: filter_doc["price"]["$gte"] = min_price
            if max_price: filter_doc["price"]["$lte"] = max_price

        cursor = self._col.find(filter_doc).sort(
            [("score", {"$meta": "textScore"})] if query else [("created_at", DESCENDING)]
        ).skip((page - 1) * page_size).limit(page_size)

        return await cursor.to_list(length=page_size)

    async def aggregate_revenue_by_category(self) -> list[dict]:
        pipeline = [
            {"$match": {"status": "active"}},
            {"$group": {"_id": "$category", "total_revenue": {"$sum": "$revenue"},
                        "count": {"$sum": 1}}},
            {"$sort": {"total_revenue": -1}},
        ]
        return await self._col.aggregate(pipeline).to_list(None)`} />
      </Card>

      <Card title="Redis — Caching Patterns" badge="Performance">
        <Code code={`import redis.asyncio as aioredis
import json
from functools import wraps
from typing import Callable

redis: aioredis.Redis = None  # injected at startup

# ── Cache-aside decorator ────────────────────────────
def cache(key_template: str, ttl: int = 300):
    def decorator(fn: Callable):
        @wraps(fn)
        async def wrapper(*args, **kwargs):
            cache_key = key_template.format(*args, **kwargs)
            cached = await redis.get(cache_key)
            if cached:
                return json.loads(cached)
            result = await fn(*args, **kwargs)
            await redis.setex(cache_key, ttl, json.dumps(result, default=str))
            return result
        return wrapper
    return decorator

@cache("product:{0}", ttl=600)
async def get_product(product_id: str) -> dict:
    return await product_repo.get(product_id)

# ── Rate limiting with sliding window ────────────────
async def is_rate_limited(user_id: str, limit: int = 100, window: int = 60) -> bool:
    key = f"ratelimit:{user_id}"
    pipe = redis.pipeline()
    now = time.time()
    pipe.zremrangebyscore(key, 0, now - window)
    pipe.zadd(key, {str(now): now})
    pipe.zcard(key)
    pipe.expire(key, window)
    results = await pipe.execute()
    return results[2] > limit

# ── Distributed lock ─────────────────────────────────
from redis.asyncio.lock import Lock

async def process_payment_once(payment_id: str):
    async with Lock(redis, f"lock:payment:{payment_id}", timeout=30):
        # Only one instance processes this payment
        if await redis.get(f"processed:{payment_id}"):
            return  # idempotency check
        await payment_gateway.process(payment_id)
        await redis.setex(f"processed:{payment_id}", 3600, "1")`} />
      </Card>
    </div>
  ),

  "messaging": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>Kafka for event streaming, RabbitMQ for work queues — producers, consumers, dead-letter queues.</p>

      <Card title="Kafka — Producer & Consumer" badge="Core" badgeColor="#3fb950">
        <Code code={`from aiokafka import AIOKafkaProducer, AIOKafkaConsumer
from aiokafka.errors import KafkaConnectionError
import json, asyncio

# ── Producer ────────────────────────────────────────
class EventProducer:
    def __init__(self, bootstrap_servers: str):
        self._producer = AIOKafkaProducer(
            bootstrap_servers=bootstrap_servers,
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
            acks="all",              # wait for all replicas
            enable_idempotence=True, # exactly-once semantics
            compression_type="gzip",
        )

    async def start(self):  await self._producer.start()
    async def stop(self):   await self._producer.stop()

    async def publish(self, topic: str, event: dict, key: str | None = None):
        await self._producer.send_and_wait(
            topic,
            value=event,
            key=key.encode() if key else None,
            headers=[("x-correlation-id", event.get("correlation_id", "").encode())]
        )

# ── Consumer with error handling ─────────────────────
class OrderEventConsumer:
    def __init__(self, bootstrap_servers: str, group_id: str):
        self._consumer = AIOKafkaConsumer(
            "order.events",
            bootstrap_servers=bootstrap_servers,
            group_id=group_id,
            value_deserializer=lambda b: json.loads(b.decode("utf-8")),
            auto_offset_reset="earliest",
            enable_auto_commit=False,   # manual commit for reliability
        )

    async def run(self):
        await self._consumer.start()
        try:
            async for msg in self._consumer:
                try:
                    await self._handle(msg.value)
                    await self._consumer.commit()   # commit only on success
                except Exception as e:
                    logger.error(f"Failed to process {msg.offset}: {e}")
                    await self._send_to_dlq(msg)    # dead-letter queue
        finally:
            await self._consumer.stop()

    async def _handle(self, event: dict):
        handlers = {
            "order.created":    self._on_order_created,
            "payment.processed": self._on_payment_processed,
        }
        handler = handlers.get(event["type"])
        if handler:
            await handler(event)

    async def _send_to_dlq(self, msg):
        await dead_letter_producer.publish(
            "order.events.dlq",
            {"original": msg.value, "offset": msg.offset, "error": "processing_failed"}
        )`} />
        <Tip>DLQ (Dead-Letter Queue) pattern is critical for reliability — always mention you implemented this. Relate to your ICPA email processing pipeline's error handling.</Tip>
      </Card>

      <Card title="Kafka Topics — Partitioning Strategy" badge="Architecture">
        <Code code={`# Topic design decisions:
#
# Partitions = parallelism units
# Key = partitioning key (same key → same partition → ordering guaranteed)
#
# order.events  → key=customer_id  (all events for a customer in order)
# payment.events → key=payment_id  (idempotency per payment)
# audit.log      → key=user_id     (audit trail per user)

# Creating topics programmatically
from aiokafka.admin import AIOKafkaAdminClient, NewTopic

async def setup_topics():
    admin = AIOKafkaAdminClient(bootstrap_servers="kafka:9092")
    await admin.start()
    topics = [
        NewTopic("order.events",   num_partitions=12, replication_factor=3),
        NewTopic("payment.events", num_partitions=6,  replication_factor=3),
        NewTopic("order.events.dlq", num_partitions=2, replication_factor=3),
    ]
    await admin.create_topics(topics, validate_only=False)
    await admin.close()

# Consumer group scaling:
# 12 partitions → max 12 consumers in one group consuming in parallel
# Scale pods in K8s → KEDA triggers on consumer group lag`} />
        <Tip>KEDA scales K8s pods based on Kafka consumer lag. This is exactly what you did in ICPA — connect it explicitly.</Tip>
      </Card>

      <Card title="RabbitMQ — Work Queue Pattern" badge="Queue">
        <Code code={`import aio_pika
import asyncio, json

# ── Publisher ─────────────────────────────────────────
async def publish_email_job(connection: aio_pika.Connection, payload: dict):
    async with connection.channel() as channel:
        await channel.declare_queue(
            "email_jobs",
            durable=True,   # survive broker restart
        )
        await channel.default_exchange.publish(
            aio_pika.Message(
                body=json.dumps(payload).encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
                content_type="application/json",
            ),
            routing_key="email_jobs",
        )

# ── Worker with fair dispatch ─────────────────────────
async def email_worker(connection: aio_pika.Connection):
    async with connection.channel() as channel:
        await channel.set_qos(prefetch_count=1)  # don't overwhelm this worker
        queue = await channel.declare_queue("email_jobs", durable=True)

        async with queue.iterator() as q:
            async for message in q:
                async with message.process():   # ack on success, nack on error
                    try:
                        payload = json.loads(message.body)
                        await send_email(payload["to"], payload["subject"], payload["body"])
                    except Exception as e:
                        logger.error(f"Email failed: {e}")
                        # message.reject() sends to DLQ if configured
                        raise

# ── Dead-letter exchange setup ────────────────────────
async def setup_dlx(channel: aio_pika.Channel):
    dlx = await channel.declare_exchange("email_dlx", aio_pika.ExchangeType.DIRECT)
    dlq = await channel.declare_queue("email_jobs_failed", durable=True)
    await dlq.bind(dlx, routing_key="failed")

    await channel.declare_queue(
        "email_jobs", durable=True,
        arguments={
            "x-dead-letter-exchange": "email_dlx",
            "x-dead-letter-routing-key": "failed",
            "x-message-ttl": 60000,    # 1 min before DLQ
        }
    )`} />
      </Card>
    </div>
  ),

  "docker-k8s": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>Production Dockerfiles, multi-stage builds, K8s manifests, probes, and HPA/KEDA autoscaling.</p>

      <Card title="Multi-Stage Dockerfile" badge="Core" badgeColor="#3fb950">
        <Code code={`# ── Stage 1: Builder ─────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /build
RUN pip install uv           # fast dependency resolver

COPY pyproject.toml uv.lock ./
RUN uv export --no-dev > requirements.txt
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# ── Stage 2: Runtime (minimal) ───────────────────────
FROM python:3.12-slim AS runtime

# Security: non-root user
RUN groupadd -r appuser && useradd -r -g appuser appuser

WORKDIR /app
COPY --from=builder /install /usr/local
COPY --chown=appuser:appuser ./src .

USER appuser

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000",
     "--workers", "1", "--loop", "uvloop"]`} />
      </Card>

      <Card title="K8s Deployment + HPA" badge="Kubernetes" badgeColor="#326ce5">
        <Code code={`# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: order-service
  namespace: production
spec:
  replicas: 3
  selector:
    matchLabels: {app: order-service}
  template:
    metadata:
      labels: {app: order-service}
    spec:
      containers:
      - name: order-service
        image: registry.example.com/order-service:1.2.3
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef: {name: db-secret, key: url}
        - name: REDIS_URL
          valueFrom:
            configMapKeyRef: {name: app-config, key: redis_url}
        resources:
          requests: {cpu: "250m", memory: "256Mi"}
          limits:   {cpu: "500m", memory: "512Mi"}
        readinessProbe:
          httpGet: {path: /health/ready, port: 8000}
          initialDelaySeconds: 10
          periodSeconds: 5
          failureThreshold: 3
        livenessProbe:
          httpGet: {path: /health/live, port: 8000}
          initialDelaySeconds: 30
          periodSeconds: 15
---
# hpa.yaml — scale on CPU + custom Kafka lag metric
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: order-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: order-service
  minReplicas: 2
  maxReplicas: 20
  metrics:
  - type: Resource
    resource:
      name: cpu
      target: {type: Utilization, averageUtilization: 70}
  - type: External   # Kafka lag via KEDA
    external:
      metric:
        name: kafka_consumer_group_lag
      target: {type: AverageValue, averageValue: "100"}`} />
        <Tip>KEDA extends K8s HPA with event-driven scaling — mention it when discussing your ICPA KEDA setup for scaling email processors.</Tip>
      </Card>

      <Card title="Health Check Endpoints" badge="Reliability">
        <Code code={`from fastapi import APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from redis.asyncio import Redis

health_router = APIRouter()

# Liveness — "am I alive?" (restart if this fails)
@health_router.get("/health/live")
async def liveness():
    return {"status": "ok"}

# Readiness — "can I serve traffic?" (remove from LB if this fails)
@health_router.get("/health/ready")
async def readiness(
    db: AsyncSession = Depends(get_db),
    cache: Redis = Depends(get_redis)
):
    checks = {}
    # DB connectivity
    try:
        await db.execute("SELECT 1")
        checks["database"] = "ok"
    except Exception as e:
        checks["database"] = f"error: {e}"

    # Redis connectivity
    try:
        await cache.ping()
        checks["cache"] = "ok"
    except Exception as e:
        checks["cache"] = f"error: {e}"

    healthy = all(v == "ok" for v in checks.values())
    return JSONResponse(
        content={"status": "ok" if healthy else "degraded", "checks": checks},
        status_code=200 if healthy else 503
    )`} />
      </Card>
    </div>
  ),

  "cloud": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>AWS core services, IAM, EKS, SQS/SNS, Secrets Manager, and cloud-native patterns with boto3.</p>

      <Card title="AWS SDK — boto3 Async Patterns" badge="Core" badgeColor="#ff9900">
        <Code code={`import aioboto3
from botocore.exceptions import ClientError
import json

class AWSS3Service:
    def __init__(self, bucket: str):
        self.bucket = bucket
        self.session = aioboto3.Session()

    async def upload(self, key: str, data: bytes, content_type: str = "application/octet-stream"):
        async with self.session.client("s3") as s3:
            await s3.put_object(
                Bucket=self.bucket,
                Key=key,
                Body=data,
                ContentType=content_type,
                ServerSideEncryption="aws:kms",  # encrypt at rest
            )

    async def get_presigned_url(self, key: str, expires: int = 3600) -> str:
        async with self.session.client("s3") as s3:
            return await s3.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket, "Key": key},
                ExpiresIn=expires,
            )

class AWSSQSService:
    def __init__(self, queue_url: str):
        self.queue_url = queue_url
        self.session = aioboto3.Session()

    async def send(self, body: dict, dedup_id: str | None = None):
        async with self.session.client("sqs") as sqs:
            kwargs = dict(
                QueueUrl=self.queue_url,
                MessageBody=json.dumps(body),
                MessageAttributes={"ContentType": {"StringValue": "application/json", "DataType": "String"}},
            )
            if dedup_id:  # for FIFO queues
                kwargs["MessageDeduplicationId"] = dedup_id
            await sqs.send_message(**kwargs)

    async def receive(self, max_messages: int = 10, wait_seconds: int = 20) -> list:
        async with self.session.client("sqs") as sqs:
            resp = await sqs.receive_message(
                QueueUrl=self.queue_url,
                MaxNumberOfMessages=max_messages,
                WaitTimeSeconds=wait_seconds,   # long-polling — reduces cost!
                AttributeNames=["All"],
            )
            return resp.get("Messages", [])`} />
      </Card>

      <Card title="AWS Secrets Manager" badge="Security" badgeColor="#f85149">
        <Code code={`import aioboto3
import json
from functools import lru_cache
from pydantic_settings import BaseSettings

class SecretManager:
    _cache: dict = {}

    @classmethod
    async def get(cls, secret_name: str, use_cache: bool = True) -> dict:
        if use_cache and secret_name in cls._cache:
            return cls._cache[secret_name]

        session = aioboto3.Session()
        async with session.client("secretsmanager", region_name="eu-west-1") as client:
            try:
                resp = await client.get_secret_value(SecretId=secret_name)
                secret = json.loads(resp["SecretString"])
                if use_cache:
                    cls._cache[secret_name] = secret
                return secret
            except client.exceptions.ResourceNotFoundException:
                raise ValueError(f"Secret {secret_name} not found")

# Load settings from Secrets Manager at startup
class Settings(BaseSettings):
    database_url: str = ""
    jwt_secret: str = ""

    @classmethod
    async def from_aws(cls) -> "Settings":
        secrets = await SecretManager.get("prod/order-service/secrets")
        return cls(
            database_url=secrets["DATABASE_URL"],
            jwt_secret=secrets["JWT_SECRET"],
        )`} />
        <Tip>Never hardcode secrets. In K8s, use AWS Secrets Store CSI Driver to sync Secrets Manager → K8s Secrets automatically. Mention this pattern.</Tip>
      </Card>

      <Card title="Lambda Handler Pattern" badge="Serverless">
        <Code code={`from aws_lambda_powertools import Logger, Tracer, Metrics
from aws_lambda_powertools.metrics import MetricUnit
from aws_lambda_powertools.utilities.typing import LambdaContext
from aws_lambda_powertools.utilities.data_classes import SQSEvent
import json

logger   = Logger(service="order-processor")
tracer   = Tracer(service="order-processor")
metrics  = Metrics(namespace="OrderService")

@tracer.capture_lambda_handler
@logger.inject_lambda_context(log_event=True)
@metrics.log_metrics(capture_cold_start_metric=True)
def handler(event: dict, context: LambdaContext) -> dict:
    sqs_event = SQSEvent(event)

    for record in sqs_event.records:
        try:
            body = json.loads(record.body)
            logger.info("Processing order", order_id=body["order_id"])
            process_order(body)
            metrics.add_metric(name="OrdersProcessed", unit=MetricUnit.Count, value=1)
        except Exception as e:
            logger.exception("Order processing failed", order_id=body.get("order_id"))
            metrics.add_metric(name="OrdersFailed", unit=MetricUnit.Count, value=1)
            raise  # Lambda will retry / send to DLQ

    return {"statusCode": 200, "body": "OK"}`} />
      </Card>
    </div>
  ),

  "security": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>JWT creation/validation, OAuth2 PKCE flow, JWKS, and secrets management best practices.</p>

      <Card title="JWT — Create, Sign, Verify" badge="Core" badgeColor="#3fb950">
        <Code code={`import jwt
from datetime import datetime, timedelta, timezone
from uuid import uuid4
from pydantic import BaseModel

SECRET_KEY = "loaded-from-secrets-manager"
ALGORITHM  = "HS256"

class TokenPayload(BaseModel):
    sub: str          # subject (user_id)
    exp: datetime     # expiry
    iat: datetime     # issued at
    jti: str          # unique token ID (for revocation)
    scopes: list[str] # permissions

def create_access_token(user_id: str, scopes: list[str]) -> str:
    now = datetime.now(timezone.utc)
    payload = TokenPayload(
        sub=user_id,
        exp=now + timedelta(minutes=15),   # short-lived!
        iat=now,
        jti=str(uuid4()),
        scopes=scopes,
    )
    return jwt.encode(payload.model_dump(mode="json"), SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(user_id: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {"sub": user_id, "exp": now + timedelta(days=7),
               "iat": now, "jti": str(uuid4()), "type": "refresh"}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

async def verify_token(token: str) -> TokenPayload:
    try:
        raw = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        payload = TokenPayload(**raw)
        # Check revocation list (Redis set of revoked JTIs)
        if await redis.sismember("revoked_tokens", payload.jti):
            raise HTTPException(401, "Token revoked")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(401, f"Invalid token: {e}")`} />
        <Tip>JTI (JWT ID) enables token revocation — critical for logout flows. Store revoked JTIs in Redis with TTL matching the token's remaining lifetime.</Tip>
      </Card>

      <Card title="OAuth2 — Password & Client Credentials" badge="OAuth2" badgeColor="#a371f7">
        <Code code={`from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext

pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

router = APIRouter(prefix="/auth")

# ── Password flow (user login) ────────────────────────
@router.post("/token")
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    user = await UserRepo(db).get_by_email(form.username)
    if not user or not pwd_ctx.verify(form.password, user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Incorrect credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

    scopes = get_user_scopes(user.role)
    return {
        "access_token": create_access_token(str(user.id), scopes),
        "refresh_token": create_refresh_token(str(user.id)),
        "token_type": "bearer",
        "expires_in": 900,
    }

# ── Token refresh ─────────────────────────────────────
@router.post("/token/refresh")
async def refresh_token(refresh_token: str, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise ValueError("Not a refresh token")
    except (jwt.PyJWTError, ValueError):
        raise HTTPException(401, "Invalid refresh token")

    user = await UserRepo(db).get(payload["sub"])
    return {
        "access_token": create_access_token(str(user.id), get_user_scopes(user.role)),
        "token_type": "bearer",
    }

# ── Scope-based authorisation ─────────────────────────
def require_scope(*required: str):
    async def dep(token: str = Depends(oauth2_scheme)) -> TokenPayload:
        payload = await verify_token(token)
        missing = set(required) - set(payload.scopes)
        if missing:
            raise HTTPException(403, f"Missing scopes: {missing}")
        return payload
    return dep

@router.get("/orders", dependencies=[Depends(require_scope("orders:read"))])
async def list_orders(): ...`} />
      </Card>

      <Card title="JWKS — RS256 with Public Key Rotation" badge="Advanced">
        <Code code={`# RS256 — asymmetric: private key signs, public key verifies
# Services only need the public key (JWKS endpoint)

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import base64, json

# Auth service holds private key, exposes JWKS
@app.get("/.well-known/jwks.json")
async def jwks():
    public_key = load_public_key_from_secrets_manager()
    numbers = public_key.public_key().public_numbers()

    def to_base64url(n: int) -> str:
        b = n.to_bytes((n.bit_length() + 7) // 8, "big")
        return base64.urlsafe_b64encode(b).rstrip(b"=").decode()

    return {"keys": [{
        "kty": "RSA", "use": "sig", "alg": "RS256",
        "kid": "key-2025-06",   # rotate by updating kid
        "n": to_base64url(numbers.n),
        "e": to_base64url(numbers.e),
    }]}

# Downstream services verify using JWKS (no shared secret!)
import jwt
from jwt import PyJWKClient

jwks_client = PyJWKClient("https://auth.example.com/.well-known/jwks.json")

async def verify_rs256_token(token: str) -> dict:
    signing_key = jwks_client.get_signing_key_from_jwt(token)
    return jwt.decode(
        token, signing_key.key,
        algorithms=["RS256"],
        audience="order-service",
    )`} />
      </Card>
    </div>
  ),

  "observability": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>Structured logging, Prometheus metrics, distributed tracing with OpenTelemetry, and alerting.</p>

      <Card title="Structured Logging with structlog" badge="Core" badgeColor="#3fb950">
        <Code code={`import structlog, logging, sys

def setup_logging(level: str = "INFO"):
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.stdlib.add_log_level,
            structlog.stdlib.add_logger_name,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.StackInfoRenderer(),
            structlog.processors.JSONRenderer(),  # JSON for log aggregators
        ],
        logger_factory=structlog.stdlib.LoggerFactory(),
        wrapper_class=structlog.make_filtering_bound_logger(
            getattr(logging, level)
        ),
    )

logger = structlog.get_logger()

# Bind context for request-scoped logging
async def dispatch(request: Request, call_next):
    structlog.contextvars.bind_contextvars(
        request_id=request.headers.get("X-Request-ID"),
        user_id=getattr(request.state, "user_id", None),
        path=request.url.path,
        method=request.method,
    )
    try:
        response = await call_next(request)
        logger.info("request_completed", status=response.status_code)
        return response
    except Exception as e:
        logger.error("request_failed", error=str(e), exc_info=True)
        raise
    finally:
        structlog.contextvars.clear_contextvars()

# Usage — all fields appear in every log line automatically
logger.info("order_created", order_id="abc-123", total=99.99, customer_id="cust-456")`} />
        <Tip>JSON structured logs ship to your EFK/ELK stack. Mention your ICPA EFK stack (Elasticsearch + Fluentd + Kibana) and how you correlated LLM traces to email IDs.</Tip>
      </Card>

      <Card title="Prometheus Metrics" badge="Metrics">
        <Code code={`from prometheus_client import Counter, Histogram, Gauge, generate_latest
from fastapi import Response
import time

# ── Define metrics ────────────────────────────────────
REQUEST_COUNT = Counter(
    "http_requests_total",
    "Total HTTP requests",
    ["method", "endpoint", "status_code"]
)
REQUEST_LATENCY = Histogram(
    "http_request_duration_seconds",
    "HTTP request latency",
    ["method", "endpoint"],
    buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0, 2.5]
)
ACTIVE_REQUESTS = Gauge("http_requests_active", "Active HTTP requests")
DB_POOL_SIZE    = Gauge("db_pool_active_connections", "Active DB connections")

# ── Middleware ─────────────────────────────────────────
class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start = time.perf_counter()
        ACTIVE_REQUESTS.inc()
        try:
            response = await call_next(request)
            status = response.status_code
        except Exception:
            status = 500
            raise
        finally:
            duration = time.perf_counter() - start
            ACTIVE_REQUESTS.dec()
            REQUEST_COUNT.labels(request.method, request.url.path, status).inc()
            REQUEST_LATENCY.labels(request.method, request.url.path).observe(duration)
        return response

# ── Expose /metrics endpoint ──────────────────────────
@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")`} />
      </Card>

      <Card title="OpenTelemetry Distributed Tracing" badge="Tracing" badgeColor="#a371f7">
        <Code code={`from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.jaeger.thrift import JaegerExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
from opentelemetry.instrumentation.sqlalchemy import SQLAlchemyInstrumentor
from opentelemetry.instrumentation.redis import RedisInstrumentor

def setup_tracing(service_name: str, jaeger_host: str = "localhost"):
    exporter = JaegerExporter(agent_host_name=jaeger_host, agent_port=6831)
    provider = TracerProvider()
    provider.add_span_processor(BatchSpanProcessor(exporter))
    trace.set_tracer_provider(provider)

    # Auto-instrument frameworks
    FastAPIInstrumentor.instrument()
    SQLAlchemyInstrumentor().instrument()
    RedisInstrumentor().instrument()

tracer = trace.get_tracer(__name__)

# ── Manual spans for business logic ──────────────────
async def process_order(order_id: str):
    with tracer.start_as_current_span("process_order") as span:
        span.set_attribute("order.id", order_id)
        span.set_attribute("service.version", "1.2.3")

        with tracer.start_as_current_span("validate_inventory"):
            items = await inventory_service.check(order_id)
            span.set_attribute("inventory.items_count", len(items))

        with tracer.start_as_current_span("charge_payment") as pay_span:
            result = await payment_service.charge(order_id)
            pay_span.set_attribute("payment.provider", result.provider)
            pay_span.set_attribute("payment.success", result.success)`} />
      </Card>
    </div>
  ),

  "testing": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>pytest fixtures, async testing, API integration tests, mocking, coverage, and CI/CD pipelines.</p>

      <Card title="pytest — Fixtures & Async Tests" badge="Core" badgeColor="#3fb950">
        <Code code={`import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

from app.main import create_app
from app.models import Base
from app.database import get_db

# ── In-memory test DB ─────────────────────────────────
@pytest.fixture(scope="session")
def event_loop():
    import asyncio
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest_asyncio.fixture(scope="session")
async def engine():
    engine = create_async_engine("sqlite+aiosqlite:///:memory:")
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield engine
    await engine.dispose()

@pytest_asyncio.fixture
async def db_session(engine):
    SessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
    async with SessionLocal() as session:
        yield session
        await session.rollback()   # isolate each test

@pytest_asyncio.fixture
async def client(db_session):
    app = create_app()
    app.dependency_overrides[get_db] = lambda: db_session
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
        headers={"Authorization": f"Bearer {make_test_token()}"}
    ) as ac:
        yield ac`} />
      </Card>

      <Card title="Integration & API Tests" badge="Testing">
        <Code code={`import pytest
from decimal import Decimal

class TestOrderAPI:
    @pytest.mark.asyncio
    async def test_create_order_success(self, client, db_session):
        payload = {
            "customer_id": "cust-123",
            "items": [{"product_id": "prod-1", "quantity": 2, "unit_price": 25.00}],
            "delivery_address": "123 Test Street, London",
        }
        resp = await client.post("/api/v1/orders", json=payload)

        assert resp.status_code == 201
        data = resp.json()
        assert data["status"] == "PENDING"
        assert Decimal(str(data["total"])) == Decimal("50.00")
        assert "id" in data

    @pytest.mark.asyncio
    async def test_create_order_empty_items(self, client):
        resp = await client.post("/api/v1/orders", json={
            "customer_id": "cust-123", "items": [],
            "delivery_address": "123 Test Street"
        })
        assert resp.status_code == 422
        errors = resp.json()["detail"]
        assert any("items" in str(e["loc"]) for e in errors)

    @pytest.mark.asyncio
    async def test_get_order_not_found(self, client):
        resp = await client.get("/api/v1/orders/00000000-0000-0000-0000-000000000000")
        assert resp.status_code == 404

# ── Mocking external services ─────────────────────────
from unittest.mock import AsyncMock, patch

@pytest.mark.asyncio
async def test_payment_failure_cancels_order(client):
    with patch("app.services.payment.PaymentGateway.charge",
               new_callable=AsyncMock,
               return_value=PaymentResult(success=False, error="insufficient_funds")):
        resp = await client.post("/api/v1/orders", json=valid_order_payload())
        assert resp.status_code == 402
        assert resp.json()["detail"] == "Payment failed: insufficient_funds"`} />
        <Tip>Use httpx.AsyncClient with ASGITransport — not TestClient — for proper async test coverage. Override get_db to inject test DB session.</Tip>
      </Card>

      <Card title="CI/CD — GitHub Actions Pipeline" badge="DevOps" badgeColor="#f0883e">
        <Code code={`# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:    {branches: [main, develop]}
  pull_request: {branches: [main]}

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: myorg/order-service

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:16
        env: {POSTGRES_PASSWORD: test, POSTGRES_DB: testdb}
        ports: ["5432:5432"]
        options: --health-cmd pg_isready
      redis:
        image: redis:7
        ports: ["6379:6379"]

    steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-python@v5
      with: {python-version: "3.12"}
    - run: pip install uv && uv sync
    - run: uv run ruff check .              # linting
    - run: uv run mypy app/                 # type checking
    - run: |
        uv run pytest tests/ -v \
          --cov=app --cov-report=xml \
          --cov-fail-under=80              # enforce 80% coverage
    - uses: codecov/codecov-action@v4

  build-push:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    - uses: docker/login-action@v3
      with: {registry: ghcr.io, username: \${{ github.actor }}, password: \${{ secrets.GITHUB_TOKEN }}}
    - uses: docker/build-push-action@v5
      with:
        push: true
        tags: \${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }}
        cache-from: type=gha
        cache-to: type=gha,mode=max

  deploy:
    needs: build-push
    runs-on: ubuntu-latest
    steps:
    - uses: azure/setup-kubectl@v3
    - run: |
        kubectl set image deployment/order-service \
          order-service=\${{ env.REGISTRY }}/\${{ env.IMAGE_NAME }}:\${{ github.sha }} \
          -n production`} />
      </Card>
    </div>
  ),

  "system-design": () => (
    <div>
      <p style={{ color: "#8b949e", marginTop: 0 }}>High availability, fault tolerance, scalability patterns, and CAP theorem applied to real systems.</p>

      <Card title="Rate Limiting — Token Bucket" badge="Pattern" badgeColor="#a371f7">
        <Code code={`import asyncio, time
from dataclasses import dataclass, field

@dataclass
class TokenBucket:
    """Thread-safe async token bucket for rate limiting."""
    capacity: float          # max tokens
    refill_rate: float       # tokens/second
    _tokens: float = field(init=False)
    _last_refill: float = field(init=False)
    _lock: asyncio.Lock = field(init=False, default_factory=asyncio.Lock)

    def __post_init__(self):
        self._tokens = self.capacity
        self._last_refill = time.monotonic()

    async def consume(self, tokens: float = 1.0) -> bool:
        async with self._lock:
            now = time.monotonic()
            elapsed = now - self._last_refill
            self._tokens = min(
                self.capacity,
                self._tokens + elapsed * self.refill_rate
            )
            self._last_refill = now
            if self._tokens >= tokens:
                self._tokens -= tokens
                return True       # allowed
            return False          # rate limited

# Distributed rate limiting with Redis (across pods)
async def distributed_rate_limit(
    user_id: str, limit: int = 100, window_secs: int = 60
) -> bool:
    """Sliding window log in Redis — accurate across K8s replicas."""
    key = f"rl:{user_id}:{int(time.time() // window_secs)}"
    count = await redis.incr(key)
    if count == 1:
        await redis.expire(key, window_secs * 2)
    return count <= limit`} />
      </Card>

      <Card title="CQRS + Event Sourcing" badge="Advanced">
        <Code code={`# CQRS: separate read and write models
# Commands mutate state, Queries read from optimised read model

from abc import ABC, abstractmethod
from dataclasses import dataclass

# ── Command side (write) ──────────────────────────────
@dataclass
class PlaceOrderCommand:
    customer_id: str
    items: list
    correlation_id: str

class OrderCommandHandler:
    async def handle(self, cmd: PlaceOrderCommand) -> str:
        # Validate domain invariants
        order = Order.create_from(cmd)
        events = order.pop_domain_events()

        # Persist events (event sourcing)
        await event_store.append(order.id, events)

        # Publish for read model projection
        for event in events:
            await event_bus.publish(event)

        return order.id

# ── Query side (read) — optimised projection ──────────
class OrderProjection:
    """Denormalized read model updated by events."""

    @event_bus.subscribe("order.created")
    async def on_order_created(self, event: dict):
        await read_db.orders.insert_one({
            "_id": event["order_id"],
            "customer_id": event["customer_id"],
            "status": "PENDING",
            "total": event["total"],
            "item_count": len(event["items"]),
            "created_at": event["timestamp"],
        })

    @event_bus.subscribe("order.status_changed")
    async def on_status_changed(self, event: dict):
        await read_db.orders.update_one(
            {"_id": event["order_id"]},
            {"$set": {"status": event["new_status"], "updated_at": event["timestamp"]}}
        )

# Queries hit the fast read model (MongoDB), commands go to Postgres
class OrderQueryService:
    async def get_customer_orders(self, customer_id: str, filters: dict) -> list:
        return await read_db.orders.find(
            {"customer_id": customer_id, **filters}
        ).to_list(50)`} />
        <Tip>CQRS shines when read patterns (pagination, filtering, full-text) differ from write patterns (strict consistency, domain validation). Mention it as your next architectural step for ICPA at scale.</Tip>
      </Card>

      <Card title="CAP Theorem — Practical Choices" badge="Concepts">
        <Code code={`# CAP Theorem: Choose 2 of {Consistency, Availability, Partition Tolerance}
# P is unavoidable in distributed systems → choose CA or CP per use case

# ┌────────────────┬──────────┬────────────┬─────────────────────────────┐
# │ Use case       │ Priority │ Store      │ Why                         │
# ├────────────────┼──────────┼────────────┼─────────────────────────────┤
# │ Payment debit  │ CP       │ Postgres   │ Never double-charge         │
# │ Order history  │ AP       │ Cassandra  │ OK to be slightly stale     │
# │ Product search │ AP       │ Elasticsearch│ Availability > consistency│
# │ Session/cache  │ AP       │ Redis      │ Stale cache < no service    │
# └────────────────┴──────────┴────────────┴─────────────────────────────┘

# Eventual consistency + idempotency for order creation
class OrderService:
    async def create_idempotent(
        self, cmd: CreateOrderCommand, idempotency_key: str
    ) -> Order:
        # Check if already processed (survives retries)
        existing = await redis.get(f"idem:{idempotency_key}")
        if existing:
            return Order.model_validate_json(existing)

        order = await self._create(cmd)

        # Store result for idempotency window (24h)
        await redis.setex(
            f"idem:{idempotency_key}", 86400, order.model_dump_json()
        )
        return order`} />
      </Card>

      <Card title="Database Scaling Patterns" badge="Scale">
        <Code code={`# ── Read replicas ────────────────────────────────────
from sqlalchemy.ext.asyncio import create_async_engine

write_engine = create_async_engine("postgresql+asyncpg://primary/db")
read_engine  = create_async_engine("postgresql+asyncpg://replica/db")

async def get_write_db(): ...   # for mutations
async def get_read_db(): ...    # for queries — scales horizontally

# ── Connection pooling (PgBouncer config) ─────────────
# PgBouncer sits between app and Postgres
# pool_mode = transaction  → connection returned after each tx
# max_client_conn = 1000   → handle many app instances
# default_pool_size = 25   → actual Postgres connections

# ── Partitioning ──────────────────────────────────────
# Range partition orders by month (query planner eliminates partitions)
"""
CREATE TABLE orders (order_id UUID, created_at TIMESTAMPTZ, ...)
PARTITION BY RANGE (created_at);

CREATE TABLE orders_2025_01 PARTITION OF orders
  FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
"""

# ── Sharding with consistent hashing ─────────────────
import hashlib

SHARDS = ["db-shard-0:5432", "db-shard-1:5432", "db-shard-2:5432"]

def get_shard(key: str) -> str:
    """Consistent hash → minimises rebalancing when adding shards."""
    h = int(hashlib.sha256(key.encode()).hexdigest(), 16)
    return SHARDS[h % len(SHARDS)]`} />
      </Card>
    </div>
  ),
};

// ── MAIN APP ──────────────────────────────────────────────────────────
export default function App() {
  const [active, setActive] = useState("python-core");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const SectionContent = sections[active] || (() => <div />);
  const currentSection = SECTIONS.find(s => s.id === active);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "#0d1117",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      color: "#e6edf3",
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? "230px" : "0px",
        minWidth: sidebarOpen ? "230px" : "0px",
        overflow: "hidden",
        transition: "all 0.2s",
        background: "#010409",
        borderRight: "1px solid #21262d",
        display: "flex",
        flexDirection: "column",
        position: "sticky",
        top: 0,
        height: "100vh",
      }}>
        <div style={{ padding: "18px 16px 12px", borderBottom: "1px solid #21262d" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#58a6ff",
                        letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Python Backend
          </div>
          <div style={{ fontSize: "11px", color: "#484f58", marginTop: "2px" }}>Microservices Guide</div>
        </div>
        <div style={{ overflowY: "auto", flex: 1, padding: "8px 0" }}>
          {SECTIONS.map(s => (
            <button key={s.id} onClick={() => setActive(s.id)} style={{
              width: "100%",
              textAlign: "left",
              padding: "8px 16px",
              background: active === s.id ? "#1f6feb22" : "transparent",
              border: "none",
              borderLeft: `2px solid ${active === s.id ? "#1f6feb" : "transparent"}`,
              color: active === s.id ? "#79c0ff" : "#8b949e",
              fontSize: "13px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "all 0.15s",
            }}>
              <span>{s.icon}</span>
              <span style={{ fontWeight: active === s.id ? 600 : 400 }}>{s.label}</span>
            </button>
          ))}
        </div>
        <div style={{ padding: "12px 16px", borderTop: "1px solid #21262d",
                      fontSize: "11px", color: "#30363d" }}>
          {SECTIONS.length} modules · JD-mapped
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{
          padding: "14px 24px",
          borderBottom: "1px solid #21262d",
          background: "#010409",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}>
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            background: "transparent", border: "1px solid #30363d",
            color: "#8b949e", borderRadius: "6px", padding: "4px 8px",
            cursor: "pointer", fontSize: "14px",
          }}>☰</button>
          <div>
            <span style={{ fontSize: "15px", fontWeight: 700, color: "#e6edf3" }}>
              {currentSection?.icon} {currentSection?.label}
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{
          flex: 1,
          overflowY: "auto",
          padding: "24px",
          maxWidth: "900px",
          width: "100%",
        }}>
          <SectionContent />
        </div>
      </div>
    </div>
  );
}
