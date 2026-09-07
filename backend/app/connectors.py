from __future__ import annotations

from dataclasses import dataclass
from threading import Lock
from typing import Any, Protocol


class ConnectorError(RuntimeError):
    pass


class UnsupportedOperation(ConnectorError):
    pass


@dataclass(frozen=True)
class ConnectorResult:
    connector: str
    operation: str
    remote_id: str
    observed_status: str
    simulated: bool = True


class Connector(Protocol):
    name: str
    supported_operations: set[str]

    def execute(self, operation: str, payload: dict[str, Any]) -> ConnectorResult: ...


class IdempotencyLedger:
    def __init__(self) -> None:
        self._results: dict[str, ConnectorResult] = {}
        self._lock = Lock()

    def get(self, key: str) -> ConnectorResult | None:
        with self._lock:
            return self._results.get(key)

    def record(self, key: str, result: ConnectorResult) -> ConnectorResult:
        with self._lock:
            previous = self._results.get(key)
            if previous is not None:
                return previous
            self._results[key] = result
            return result


class SafeConnectorSimulator:
    def __init__(self, name: str, operations: set[str], ledger: IdempotencyLedger) -> None:
        self.name = name
        self.supported_operations = operations
        self.ledger = ledger

    def execute(self, operation: str, payload: dict[str, Any]) -> ConnectorResult:
        if operation not in self.supported_operations:
            raise UnsupportedOperation(f"{self.name} does not allow {operation}")
        key = str(payload.get("idempotency_key", ""))
        if not key:
            raise ConnectorError("side-effecting operations require an idempotency key")
        previous = self.ledger.get(key)
        if previous is not None:
            return previous
        result = ConnectorResult(
            connector=self.name,
            operation=operation,
            remote_id=f"sim_{self.name.lower()}_{key[-6:]}",
            observed_status="accepted",
        )
        return self.ledger.record(key, result)


ledger = IdempotencyLedger()
registry: dict[str, Connector] = {
    "HubSpot": SafeConnectorSimulator("HubSpot", {"contacts.upsert"}, ledger),
    "PostgreSQL": SafeConnectorSimulator("PostgreSQL", {"orders.upsert"}, ledger),
    "Slack": SafeConnectorSimulator("Slack", {"chat.postMessage"}, ledger),
}
