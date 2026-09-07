from fastapi.testclient import TestClient

from app.main import app


def test_health() -> None:
    with TestClient(app) as client:
        response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_compiler_returns_grounded_typed_plan() -> None:
    prompt = "When Stripe payment succeeds, update the existing HubSpot contact, save the order in PostgreSQL, and notify Slack."
    with TestClient(app) as client:
        response = client.post("/api/v1/workflows/compile", json={"prompt": prompt})
    assert response.status_code == 200
    body = response.json()
    assert body["risk"] == "Guarded"
    assert len(body["nodes"]) == 6
    assert "hubspot-doc-318" in body["evidenceIds"]
    hubspot = next(node for node in body["nodes"] if node["id"] == "hubspot")
    assert hubspot["data"]["approval"] is True
    assert hubspot["data"]["status"] == "paused"


def test_failure_lab_prevents_duplicate_side_effects() -> None:
    with TestClient(app) as client:
        response = client.post("/api/v1/failure-lab/scenarios", json={"scenarioId": "duplicate"})
    assert response.status_code == 200
    assert response.json()["duplicateSideEffects"] == 0
    assert response.json()["recovered"] is True


def test_evidence_missing_returns_404() -> None:
    with TestClient(app) as client:
        response = client.get("/api/v1/evidence/not-real")
    assert response.status_code == 404


def test_approval_requires_an_authorized_role() -> None:
    with TestClient(app) as client:
        response = client.post(
            "/api/v1/approvals/apr_81M/approve",
            headers={"X-Demo-Role": "auditor"},
        )
    assert response.status_code == 403


def test_compiled_workflow_can_be_read_back() -> None:
    prompt = "When Stripe payment succeeds, update HubSpot and notify Slack after saving the order."
    with TestClient(app) as client:
        compiled = client.post("/api/v1/workflows/compile", json={"prompt": prompt}).json()
        response = client.get(f"/api/v1/workflows/{compiled['id']}")
    assert response.status_code == 200
    assert response.json()["sourcePrompt"] == prompt
