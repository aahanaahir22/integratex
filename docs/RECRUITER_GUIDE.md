# Engineering Review Guide

IntegrateX is designed to be reviewed at two levels: a fast interactive product tour and a deeper code-and-architecture inspection.

## Five-minute review path

| Time | Product surface | What to inspect | Engineering evidence |
|---:|---|---|---|
| 0:00 | Intro + Mission Control | Visual system, operational state and system principle | React, Framer Motion, responsive/reduced-motion CSS |
| 0:45 | Compiler Studio | Intent compilation, typed DAG and validation gates | `backend/app/compiler.py`, `validator.py`, Pydantic models |
| 1:45 | Evidence Vault | Source version, hash and grounding reason | `backend/app/rag.py`, evidence-linked operations |
| 2:30 | Guard Rail | Proposed mutation diff and explicit decision | Role-gated approval endpoint and immutable audit event |
| 3:15 | Failure Lab | 429, timeout, schema drift and duplicate webhook | Bounded retry, outcome verification and idempotency ledger |
| 4:15 | Repository | Tests, delivery, threat model and evaluation honesty | GitHub Actions, Docker Compose, documented AWS target |

## What makes the project distinctive

Most portfolio workflow projects stop after drawing a node graph or calling an LLM. IntegrateX concentrates on the harder production questions:

- Which exact documentation justified a generated operation?
- Which deterministic checks must pass before execution?
- What happens when a provider times out after accepting a write?
- How are duplicate deliveries prevented from creating duplicate business effects?
- Which mutations require a human decision?
- How can an operator reconstruct what happened from an immutable trace?

The answer is encoded in the architecture: evidence-bound compilation, typed plans, policy gates, durable execution seams, idempotency, bounded recovery and auditability.

## Code review map

| Concern | Primary files |
|---|---|
| API and security boundary | `backend/app/main.py`, `auth.py`, `models.py` |
| Workflow compilation | `backend/app/compiler.py`, `validator.py` |
| Evidence retrieval | `backend/app/rag.py`, `catalog.py` |
| Durable execution seam | `backend/app/execution.py`, `celery_app.py` |
| Connector safety | `backend/app/connectors.py`, `provider.py` |
| Product experience | `frontend/src/components/`, `frontend/src/styles.css` |
| Verification | `backend/tests/test_api.py`, `.github/workflows/ci.yml` |
| Deployment | `docker-compose.yml`, `.github/workflows/pages.yml`, `infra/AWS.md` |

## Evaluation standard

The public console contains seeded values so the experience works immediately. They are not represented as measured production results. The repository includes a reproducible protocol for converting the implementation into defensible performance claims. That distinction is intentional engineering evidence, not a limitation hidden from reviewers.

## Strong interview close

“The hardest design choice was keeping probabilistic interpretation separate from execution authority. The model may explain intent, but schemas, scopes, policies, idempotency and approval boundaries are enforced by deterministic code. That separation lets the product feel AI-native without making critical side effects unreviewable.”
