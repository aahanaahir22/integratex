from __future__ import annotations

from datetime import datetime, timezone
from uuid import uuid4

from .models import ExecutionResponse, FailureResult, TraceEvent


def _time() -> str:
    return datetime.now(timezone.utc).strftime("%H:%M:%S.%f")[:-3]


def create_execution(workflow_id: str) -> ExecutionResponse:
    trace_id = "trc_" + uuid4().hex[:6].upper()
    events = [
        TraceEvent(id="tr-01", step="Webhook verified", connector="Stripe", status="healthy", timestamp=_time(), duration="8ms", message="HMAC signature and replay window accepted", attempt=1, trace_id=trace_id),
        TraceEvent(id="tr-02", step="Customer normalized", connector="Schema mapper", status="healthy", timestamp=_time(), duration="12ms", message="9 fields mapped against customer.v3", attempt=1, trace_id=trace_id),
        TraceEvent(id="tr-03", step="CRM update paused", connector="Policy engine", status="paused", timestamp=_time(), duration="—", message="Existing record mutation requires operator approval", attempt=1, trace_id=trace_id),
        TraceEvent(id="tr-04", step="Order persisted", connector="PostgreSQL", status="healthy", timestamp=_time(), duration="34ms", message=f"Idempotency key {workflow_id[-7:]} claimed successfully", attempt=1, trace_id=trace_id),
    ]
    return ExecutionResponse(execution_id="exec_" + uuid4().hex[:8], status="paused", trace=events)


def run_failure_scenario(scenario_id: str) -> FailureResult:
    trace_id = "trc_fail_" + uuid4().hex[:5]
    names = {
        "rate-limit": ("HubSpot", "HTTP 429 classified as transient; Retry-After respected"),
        "schema-drift": ("Contract Guardian", "Breaking type change detected before execution"),
        "duplicate": ("Idempotency ledger", "Duplicate event mapped to the previous result"),
        "timeout": ("Slack", "Provider timeout isolated after retry budget"),
    }
    connector, message = names[scenario_id]
    recovered = scenario_id != "schema-drift"
    events = [
        TraceEvent(id="fl-1", step="Failure intercepted", connector=connector, status="warning", timestamp=_time(), duration="14ms", message=message, attempt=1, trace_id=trace_id),
        TraceEvent(id="fl-2", step="Recovery policy selected", connector="Policy engine", status="running", timestamp=_time(), duration="7ms", message="Side-effect safety and retry budget evaluated", attempt=1, trace_id=trace_id),
        TraceEvent(id="fl-3", step="Outcome verified" if recovered else "Workflow publication blocked", connector="Verification engine", status="healthy" if recovered else "paused", timestamp=_time(), duration="2.4s" if recovered else "21ms", message="Remote state confirmed" if recovered else "Affected field mapping requires review", attempt=3 if scenario_id == "rate-limit" else 1, trace_id=trace_id),
    ]
    return FailureResult(scenario_id=scenario_id, recovered=recovered, attempts=3 if scenario_id == "rate-limit" else 1, duplicate_side_effects=0, trace=events)
