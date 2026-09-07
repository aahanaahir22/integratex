from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field


def to_camel(value: str) -> str:
    first, *rest = value.split("_")
    return first + "".join(part.capitalize() for part in rest)


class APIModel(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        serialize_by_alias=True,
    )


Status = Literal["healthy", "warning", "error", "paused", "running"]


class Position(APIModel):
    x: float
    y: float


class WorkflowNodeData(APIModel):
    label: str
    eyebrow: str
    connector: str
    status: Status = "healthy"
    duration: str | None = None
    evidence: int | None = None
    approval: bool = False
    operation: str | None = None
    retry_policy: dict[str, Any] | None = None
    idempotency_key: str | None = None


class WorkflowNode(APIModel):
    id: str
    type: str = "integrateNode"
    position: Position
    data: WorkflowNodeData


class WorkflowEdge(APIModel):
    id: str
    source: str
    target: str
    animated: bool = True


class CompileRequest(APIModel):
    prompt: str = Field(min_length=20, max_length=4_000)
    mode: Literal["guarded", "draft"] = "guarded"


class CompiledWorkflow(APIModel):
    id: str
    name: str
    version: int
    summary: str
    confidence: int = Field(ge=0, le=100)
    risk: Literal["Low", "Guarded", "High"]
    nodes: list[WorkflowNode]
    edges: list[WorkflowEdge]
    evidence_ids: list[str]
    validations: list[str]
    source_prompt: str


class ConnectorPassport(APIModel):
    id: str
    name: str
    short: str
    category: str
    status: Status
    auth: str
    version: str
    operations: int
    latency: int
    scopes: list[str]
    color: str
    last_contract_test: str


class Evidence(APIModel):
    id: str
    connector: str
    title: str
    section: str
    excerpt: str
    version: str
    confidence: float = Field(ge=0, le=1)
    source: str
    hash: str
    operation: str
    tokens: list[str] = Field(default_factory=list)


class ExecutionRequest(APIModel):
    workflow_id: str
    organization_id: str = "org_demo"


class TraceEvent(APIModel):
    id: str
    step: str
    connector: str
    status: Status
    timestamp: str
    duration: str
    message: str
    attempt: int
    trace_id: str


class ExecutionResponse(APIModel):
    execution_id: str
    status: Literal["running", "paused", "completed", "failed"]
    trace: list[TraceEvent]


class FailureRequest(APIModel):
    scenario_id: Literal["rate-limit", "schema-drift", "duplicate", "timeout"]
    target: str | None = None


class FailureResult(APIModel):
    scenario_id: str
    recovered: bool
    attempts: int
    duplicate_side_effects: int
    trace: list[TraceEvent]


class Approval(APIModel):
    id: str
    action: str
    workflow: str
    risk: str
    requested_by: str
    created_at: str
    reason: str
    status: Literal["pending", "approved", "rejected"] = "pending"


class Metric(APIModel):
    label: str
    value: str
    delta: str
    tone: str
    points: list[int]


class Health(APIModel):
    status: Literal["healthy"] = "healthy"
    service: str = "integratex-api"
    version: str = "0.1.0"
    time: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
