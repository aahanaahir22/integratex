# IntegrateX Architecture

IntegrateX treats generative AI as a proposal layer, never as an execution authority.

## Request lifecycle

1. The user submits a business outcome to the Compiler Studio.
2. The documentation retriever selects version-bound API evidence.
3. The compiler creates a typed, versioned workflow DAG.
4. Deterministic gates validate connector operations, schemas, scopes, cycles, idempotency and risk.
5. A human reviews the graph and evidence before publication.
6. Celery workers execute connector steps using Redis-backed queues.
7. PostgreSQL records immutable workflow versions, step state and audit events.
8. WebSocket events stream the trace to the React console.
9. Transient failures follow bounded retry policy; permanent failures are isolated.
10. Sensitive or uncertain actions pause for human approval.

## Trust boundaries

| Boundary | Untrusted input | Control |
|---|---|---|
| User → compiler | Natural-language prompt | Length limits and typed compiler output |
| Documentation → RAG | External API documentation | Source allow-list, version metadata and content hashes |
| LLM → workflow | Generated plan | Pydantic, connector registry and policy validation |
| Webhook → platform | External event | HMAC signature, timestamp window and idempotency ledger |
| Worker → provider | Connector request | Egress allow-list, least-privilege scope and secret reference |
| Provider → worker | External response | Timeout, schema validation, size limit and redaction |

## Execution semantics

IntegrateX does not claim impossible distributed exactly-once delivery. It provides effectively-once business behaviour through:

- Provider or platform idempotency keys
- Webhook deduplication
- Transactional state checkpoints
- Bounded retries with jitter
- Explicit compensation operations
- Remote outcome verification

## Current demo vs production adapters

The repository deliberately provides a zero-key, safe simulator so reviewers can run it immediately. Production seams are explicit:

- Lexical documentation retrieval → Sentence Transformers + FAISS index
- Safe connector simulator → provider SDK implementations
- Demo identity → OIDC/JWT organisation principal
- SQLite fallback → PostgreSQL/RDS
- In-process trace fixture → Celery workers and Redis
- Seeded dashboard values → measured OpenTelemetry metrics
