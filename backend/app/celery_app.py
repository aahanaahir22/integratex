from __future__ import annotations

import os

from celery import Celery

from .connectors import registry


REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
celery_app = Celery("integratex", broker=REDIS_URL, backend=REDIS_URL)
celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    task_track_started=True,
    broker_connection_retry_on_startup=True,
)


class TransientConnectorError(RuntimeError):
    pass


@celery_app.task(
    bind=True,
    autoretry_for=(TransientConnectorError,),
    retry_backoff=True,
    retry_jitter=True,
    retry_kwargs={"max_retries": 3},
)
def execute_connector_step(self, connector: str, operation: str, payload: dict) -> dict:
    """Deployment execution seam.

    Real connector SDKs replace the safe simulator behind this task. The
    idempotency key is required before a side-effecting operation is accepted.
    """
    adapter = registry.get(connector)
    if adapter is None:
        raise ValueError(f"connector is not allow-listed: {connector}")
    result = adapter.execute(operation, payload)
    return {
        "connector": result.connector,
        "operation": result.operation,
        "status": result.observed_status,
        "remote_id": result.remote_id,
        "idempotency_key": payload["idempotency_key"],
        "simulated": result.simulated,
    }
