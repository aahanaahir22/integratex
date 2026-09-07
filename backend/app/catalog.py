from __future__ import annotations

from .models import Approval, ConnectorPassport, Evidence, Metric


CONNECTORS = [
    ConnectorPassport(id="stripe", name="Stripe", short="ST", category="Payments", status="healthy", auth="OAuth 2.0", version="2026-06", operations=42, latency=118, scopes=["events.read", "payments.read"], color="#9d7bff", last_contract_test="2m ago"),
    ConnectorPassport(id="hubspot", name="HubSpot", short="HS", category="CRM", status="healthy", auth="OAuth 2.0", version="v3", operations=31, latency=186, scopes=["crm.objects.contacts.write"], color="#ff7b4d", last_contract_test="6m ago"),
    ConnectorPassport(id="slack", name="Slack", short="SL", category="Communication", status="healthy", auth="OAuth 2.0", version="v2", operations=27, latency=94, scopes=["chat:write"], color="#76e6c5", last_contract_test="8m ago"),
    ConnectorPassport(id="github", name="GitHub", short="GH", category="Developer tools", status="healthy", auth="GitHub App", version="2022-11-28", operations=54, latency=132, scopes=["issues:write", "metadata:read"], color="#f2f1ff", last_contract_test="12m ago"),
    ConnectorPassport(id="postgres", name="PostgreSQL", short="PG", category="Database", status="healthy", auth="Secret reference", version="16", operations=18, latency=34, scopes=["orders:write"], color="#70b8ff", last_contract_test="18m ago"),
    ConnectorPassport(id="webhook", name="Universal Webhook", short="WH", category="Trigger", status="warning", auth="HMAC-SHA256", version="v1", operations=12, latency=61, scopes=["events:receive"], color="#ffce66", last_contract_test="1h ago"),
]


EVIDENCE = [
    Evidence(id="stripe-doc-142", connector="Stripe", title="Webhook signature verification", section="Receive events securely", excerpt="Verify every webhook event by validating the signature header against the raw request payload and endpoint secret.", version="2026-06", confidence=0.98, source="https://docs.stripe.com/webhooks/signatures", hash="a9c4…f21e", operation="webhooks.verify", tokens=["stripe", "payment", "webhook", "signature", "verify", "event"]),
    Evidence(id="hubspot-doc-318", connector="HubSpot", title="CRM contacts API", section="Create or update contacts", excerpt="Use a unique identifier to locate an existing contact before applying an update with the required object write scope.", version="v3", confidence=0.95, source="https://developers.hubspot.com/docs/api/crm/contacts", hash="7bd1…92aa", operation="contacts.upsert", tokens=["hubspot", "crm", "contact", "customer", "update", "upsert"]),
    Evidence(id="slack-doc-091", connector="Slack", title="chat.postMessage", section="Sending messages", excerpt="Posts a message to a channel or direct message with the chat:write OAuth scope.", version="v2", confidence=0.97, source="https://api.slack.com/methods/chat.postMessage", hash="83dd…b2c0", operation="chat.postMessage", tokens=["slack", "message", "notify", "notification", "sales", "channel"]),
    Evidence(id="postgres-doc-204", connector="PostgreSQL", title="Transactional order persistence", section="Idempotent inserts", excerpt="A unique business key and transactional upsert prevent duplicate order rows when an event is delivered more than once.", version="16", confidence=0.93, source="https://www.postgresql.org/docs/current/sql-insert.html", hash="1ea3…f8b2", operation="orders.upsert", tokens=["postgresql", "database", "order", "save", "persist", "idempotency"]),
    Evidence(id="integratex-policy-07", connector="IntegrateX", title="Sensitive mutation policy", section="CRM update controls", excerpt="Updates to an existing customer record require explicit approval when the workflow is operating in guarded mode.", version="policy-1.4", confidence=1.0, source="internal://policies/sensitive-mutations", hash="b41f…190d", operation="policy.guard", tokens=["approval", "guarded", "existing", "customer", "crm", "update"]),
]


APPROVALS = [
    Approval(id="apr_81M", action="Update existing CRM contact", workflow="Payment → Revenue Signal", risk="Sensitive mutation", requested_by="workflow-compiler", created_at="18 seconds ago", reason="The email address already exists in HubSpot. The proposed action changes lifecycle_stage and latest_order_value."),
    Approval(id="apr_11Q", action="Replay external notification", workflow="Support escalation sync", risk="Duplicate communication", requested_by="recovery-engine", created_at="7 minutes ago", reason="The previous request timed out after the provider accepted the message. Delivery state is uncertain."),
]


METRICS = [
    Metric(label="Workflow success", value="97.8%", delta="+2.4%", tone="#76e6c5", points=[42, 48, 44, 57, 61, 69, 76, 72, 84, 91]),
    Metric(label="Recovery rate", value="93.4%", delta="+4.1%", tone="#9d7bff", points=[35, 41, 49, 45, 58, 62, 67, 73, 81, 87]),
    Metric(label="P95 overhead", value="286ms", delta="-18ms", tone="#70b8ff", points=[82, 74, 78, 66, 62, 57, 61, 49, 44, 38]),
    Metric(label="Grounded plans", value="96.1%", delta="+1.7%", tone="#ffce66", points=[50, 57, 54, 62, 64, 71, 74, 81, 82, 89]),
]
