# IntegrateX Threat Model

## Assets

- Connector credentials and OAuth refresh tokens
- Customer and workflow payloads
- Workflow definitions and execution history
- Approval decisions and audit events
- API documentation indexes

## Highest-risk threats

| Threat | Example | Required mitigation |
|---|---|---|
| Secret leakage | Token appears in a trace | Store secret references, redact headers and sensitive JSON paths |
| SSRF | User configures a metadata-service URL | Connector host allow-list, DNS/IP validation and controlled egress |
| Cross-tenant access | User reads another organisation's run | Organisation-scoped queries and isolation tests |
| Forged webhook | Attacker submits a fake payment event | Provider signature, timestamp window and replay ledger |
| Duplicate side effect | Provider retries a webhook | Idempotency key and previous-result lookup |
| Prompt injection in docs | Retrieved text asks the model to bypass policy | Treat documents as data and enforce deterministic policy after generation |
| Excessive permissions | Connector token can delete all records | Minimum OAuth scopes and operation allow-list |
| Uncertain retry | Timeout occurs after provider accepted request | Verify remote state or request approval before replay |

The public demonstration uses synthetic endpoints and test-mode connectors. It must never contain production credentials or real customer records.
