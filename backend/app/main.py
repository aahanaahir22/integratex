from __future__ import annotations

from contextlib import asynccontextmanager
from datetime import datetime, timezone
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from .auth import Principal, current_principal, require_approver
from .catalog import APPROVALS, CONNECTORS, EVIDENCE, METRICS
from .compiler import compile_workflow
from .database import AuditEvent, ExecutionRecord, WorkflowRecord, get_session, init_db, persist_workflow
from .execution import create_execution, run_failure_scenario
from .models import Approval, CompileRequest, CompiledWorkflow, ExecutionRequest, ExecutionResponse, FailureRequest, FailureResult, Health
from .provider import interpret_prompt


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


app = FastAPI(
    title="IntegrateX API",
    version="0.1.0",
    description="Evidence-backed workflow compilation, guarded execution, and integration resilience simulation.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()"
    return response


@app.get("/", tags=["system"])
def root() -> dict[str, str]:
    return {"name": "IntegrateX", "docs": "/docs", "health": "/health"}


@app.get("/health", response_model=Health, tags=["system"])
def health() -> Health:
    return Health()


@app.get("/ready", response_model=Health, tags=["system"])
def ready() -> Health:
    return Health()


@app.post("/api/v1/workflows/compile", response_model=CompiledWorkflow, tags=["compiler"])
async def compile_endpoint(request: CompileRequest, session: Session = Depends(get_session)) -> CompiledWorkflow:
    workflow = compile_workflow(request)
    interpretation = await interpret_prompt(request.prompt)
    if interpretation is not None and not interpretation.clarification_required:
        workflow = workflow.model_copy(update={"name": interpretation.workflow_name, "summary": interpretation.summary})
    persist_workflow(session, workflow.model_dump(by_alias=True))
    return workflow


@app.post("/api/v1/executions", response_model=ExecutionResponse, tags=["execution"])
def execute_endpoint(request: ExecutionRequest, session: Session = Depends(get_session)) -> ExecutionResponse:
    result = create_execution(request.workflow_id)
    record = ExecutionRecord(
        id=result.execution_id,
        organization_id=request.organization_id,
        workflow_id=request.workflow_id,
        status=result.status,
        trace=[event.model_dump(by_alias=True) for event in result.trace],
    )
    session.add(record)
    session.add(AuditEvent(id="aud_" + uuid4().hex[:9], organization_id=request.organization_id, action="workflow.execution.created", actor="demo-user", resource_id=result.execution_id, payload={"workflow_id": request.workflow_id, "status": result.status}))
    session.commit()
    return result


@app.get("/api/v1/executions/{execution_id}", tags=["execution"])
def execution_detail(execution_id: str, session: Session = Depends(get_session)):
    record = session.get(ExecutionRecord, execution_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Execution not found")
    return {"executionId": record.id, "workflowId": record.workflow_id, "status": record.status, "trace": record.trace, "createdAt": record.created_at}


@app.get("/api/v1/workflows/{workflow_id}", tags=["compiler"])
def workflow_detail(workflow_id: str, session: Session = Depends(get_session)):
    record = session.get(WorkflowRecord, workflow_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Workflow not found")
    return record.plan


@app.get("/api/v1/audit", tags=["observability"])
def audit_list(session: Session = Depends(get_session), principal: Principal = Depends(current_principal)):
    events = session.query(AuditEvent).filter(AuditEvent.organization_id == principal.organization_id).order_by(AuditEvent.created_at.desc()).limit(100).all()
    return [{"id": event.id, "action": event.action, "actor": event.actor, "resourceId": event.resource_id, "payload": event.payload, "createdAt": event.created_at} for event in events]


@app.post("/api/v1/failure-lab/scenarios", response_model=FailureResult, tags=["resilience"])
def failure_endpoint(request: FailureRequest) -> FailureResult:
    return run_failure_scenario(request.scenario_id)


@app.get("/api/v1/connectors", tags=["connectors"])
def connector_list():
    return CONNECTORS


@app.get("/api/v1/evidence", tags=["rag"])
def evidence_list():
    return EVIDENCE


@app.get("/api/v1/evidence/{evidence_id}", tags=["rag"])
def evidence_detail(evidence_id: str):
    item = next((item for item in EVIDENCE if item.id == evidence_id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Evidence not found")
    return item


@app.get("/api/v1/metrics", tags=["observability"])
def metric_list():
    return METRICS


@app.get("/api/v1/approvals", response_model=list[Approval], tags=["approvals"])
def approval_list():
    return APPROVALS


def decide_approval(approval_id: str, decision: str, session: Session, principal: Principal) -> Approval:
    require_approver(principal)
    item = next((item for item in APPROVALS if item.id == approval_id), None)
    if item is None:
        raise HTTPException(status_code=404, detail="Approval not found")
    if decision not in {"approved", "rejected"}:
        raise HTTPException(status_code=400, detail="Invalid decision")
    item.status = decision
    session.add(AuditEvent(id="aud_" + uuid4().hex[:9], organization_id=principal.organization_id, action=f"approval.{decision}", actor=principal.subject, resource_id=approval_id, payload={"decision": decision, "time": datetime.now(timezone.utc).isoformat()}))
    session.commit()
    return item


@app.post("/api/v1/approvals/{approval_id}/approve", response_model=Approval, tags=["approvals"])
def approve(approval_id: str, session: Session = Depends(get_session), principal: Principal = Depends(current_principal)) -> Approval:
    return decide_approval(approval_id, "approved", session, principal)


@app.post("/api/v1/approvals/{approval_id}/reject", response_model=Approval, tags=["approvals"])
def reject(approval_id: str, session: Session = Depends(get_session), principal: Principal = Depends(current_principal)) -> Approval:
    return decide_approval(approval_id, "rejected", session, principal)


@app.websocket("/ws/executions/{execution_id}")
async def execution_stream(websocket: WebSocket, execution_id: str):
    await websocket.accept()
    result = create_execution(execution_id)
    try:
        for event in result.trace:
            await websocket.send_json(event.model_dump(by_alias=True))
        await websocket.send_json({"type": "stream.complete", "status": result.status})
    except WebSocketDisconnect:
        return
    finally:
        await websocket.close()
