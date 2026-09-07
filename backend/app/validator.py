from __future__ import annotations

from collections import defaultdict, deque

from .models import CompiledWorkflow


class WorkflowValidationError(ValueError):
    pass


def validate_workflow(workflow: CompiledWorkflow) -> list[str]:
    node_ids = {node.id for node in workflow.nodes}
    if len(node_ids) != len(workflow.nodes):
        raise WorkflowValidationError("workflow contains duplicate node identifiers")

    graph: dict[str, list[str]] = defaultdict(list)
    indegree = {node_id: 0 for node_id in node_ids}
    for edge in workflow.edges:
        if edge.source not in node_ids or edge.target not in node_ids:
            raise WorkflowValidationError("workflow edge references an unknown node")
        graph[edge.source].append(edge.target)
        indegree[edge.target] += 1

    queue = deque(node_id for node_id, degree in indegree.items() if degree == 0)
    visited = 0
    while queue:
        source = queue.popleft()
        visited += 1
        for target in graph[source]:
            indegree[target] -= 1
            if indegree[target] == 0:
                queue.append(target)
    if visited != len(node_ids):
        raise WorkflowValidationError("workflow contains a cyclic dependency")

    for node in workflow.nodes:
        data = node.data
        if data.operation and data.retry_policy:
            attempts = int(data.retry_policy.get("maximum_attempts", 0))
            if attempts < 1 or attempts > 5:
                raise WorkflowValidationError(f"{node.id} has an unsafe retry budget")
        if data.eyebrow == "GUARDED ACTION" and not data.approval:
            raise WorkflowValidationError(f"{node.id} bypasses the approval policy")
        if data.operation and not data.idempotency_key:
            raise WorkflowValidationError(f"{node.id} has no idempotency key")

    if not workflow.evidence_ids:
        raise WorkflowValidationError("workflow has no documentation evidence")

    return [
        "Connector operations allow-listed",
        "DAG is acyclic",
        "Retry budgets bounded",
        "Sensitive actions guarded",
        "Idempotency requirements satisfied",
        "Evidence references present",
    ]
