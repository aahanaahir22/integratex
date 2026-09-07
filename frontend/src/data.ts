import type { Approval, CompiledWorkflow, Connector, Evidence, FailureScenario, Metric, TraceEvent } from './types'

export const defaultPrompt = 'When a Stripe test payment succeeds, verify the webhook, validate the customer, update HubSpot, save the order in PostgreSQL, and notify the sales team in Slack. Retry temporary failures, but ask for approval before changing an existing CRM record.'

export const connectors: Connector[] = [
  { id: 'stripe', name: 'Stripe', short: 'ST', category: 'Payments', status: 'healthy', auth: 'OAuth 2.0', version: '2026-06', operations: 42, latency: 118, scopes: ['events.read', 'payments.read'], color: '#9d7bff', lastContractTest: '2m ago' },
  { id: 'hubspot', name: 'HubSpot', short: 'HS', category: 'CRM', status: 'healthy', auth: 'OAuth 2.0', version: 'v3', operations: 31, latency: 186, scopes: ['crm.objects.contacts.write'], color: '#ff7b4d', lastContractTest: '6m ago' },
  { id: 'slack', name: 'Slack', short: 'SL', category: 'Communication', status: 'healthy', auth: 'OAuth 2.0', version: 'v2', operations: 27, latency: 94, scopes: ['chat:write'], color: '#76e6c5', lastContractTest: '8m ago' },
  { id: 'github', name: 'GitHub', short: 'GH', category: 'Developer tools', status: 'healthy', auth: 'GitHub App', version: '2022-11-28', operations: 54, latency: 132, scopes: ['issues:write', 'metadata:read'], color: '#f2f1ff', lastContractTest: '12m ago' },
  { id: 'postgres', name: 'PostgreSQL', short: 'PG', category: 'Database', status: 'healthy', auth: 'Secret reference', version: '16', operations: 18, latency: 34, scopes: ['orders:write'], color: '#70b8ff', lastContractTest: '18m ago' },
  { id: 'webhook', name: 'Universal Webhook', short: 'WH', category: 'Trigger', status: 'warning', auth: 'HMAC-SHA256', version: 'v1', operations: 12, latency: 61, scopes: ['events:receive'], color: '#ffce66', lastContractTest: '1h ago' },
]

export const evidence: Evidence[] = [
  { id: 'stripe-doc-142', connector: 'Stripe', title: 'Webhook signature verification', section: 'Receive events securely', excerpt: 'Verify every webhook event by validating the signature header against the raw request payload and endpoint secret.', version: '2026-06', confidence: 0.98, source: 'docs.stripe.com/webhooks/signatures', hash: 'a9c4…f21e' },
  { id: 'hubspot-doc-318', connector: 'HubSpot', title: 'CRM contacts API', section: 'Create or update contacts', excerpt: 'Use a unique identifier to locate an existing contact before applying an update with the required object write scope.', version: 'v3', confidence: 0.95, source: 'developers.hubspot.com/crm/contacts', hash: '7bd1…92aa' },
  { id: 'slack-doc-091', connector: 'Slack', title: 'chat.postMessage', section: 'Sending messages', excerpt: 'Posts a message to a public channel, private channel, or direct message with the chat:write OAuth scope.', version: 'v2', confidence: 0.97, source: 'api.slack.com/methods/chat.postMessage', hash: '83dd…b2c0' },
  { id: 'integratex-policy-07', connector: 'IntegrateX', title: 'Sensitive mutation policy', section: 'CRM update controls', excerpt: 'Updates to an existing customer record require an explicit approval when the workflow is operating in guarded mode.', version: 'policy-1.4', confidence: 1, source: 'internal://policies/sensitive-mutations', hash: 'b41f…190d' },
]

export const compiledWorkflow: CompiledWorkflow = {
  id: 'wf_7H2K9',
  name: 'Payment → Revenue Signal',
  version: 3,
  summary: 'Verifies a Stripe test event, normalizes customer data, guards the CRM mutation, persists the order, and emits a sales notification.',
  confidence: 94,
  risk: 'Guarded',
  nodes: [
    { id: 'trigger', type: 'integrateNode', position: { x: 0, y: 165 }, data: { label: 'Payment succeeded', eyebrow: 'TRIGGER', connector: 'Stripe', status: 'healthy', evidence: 1 } },
    { id: 'verify', type: 'integrateNode', position: { x: 260, y: 40 }, data: { label: 'Verify signature', eyebrow: 'VALIDATE', connector: 'Policy engine', status: 'healthy', duration: '8ms', evidence: 1 } },
    { id: 'transform', type: 'integrateNode', position: { x: 260, y: 290 }, data: { label: 'Normalize customer', eyebrow: 'TRANSFORM', connector: 'Schema mapper', status: 'healthy', duration: '12ms' } },
    { id: 'hubspot', type: 'integrateNode', position: { x: 550, y: 40 }, data: { label: 'Upsert CRM contact', eyebrow: 'GUARDED ACTION', connector: 'HubSpot', status: 'paused', approval: true, evidence: 2 } },
    { id: 'postgres', type: 'integrateNode', position: { x: 550, y: 290 }, data: { label: 'Persist order', eyebrow: 'IDEMPOTENT WRITE', connector: 'PostgreSQL', status: 'healthy', duration: '34ms' } },
    { id: 'slack', type: 'integrateNode', position: { x: 850, y: 165 }, data: { label: 'Notify sales', eyebrow: 'ACTION', connector: 'Slack', status: 'healthy', duration: '94ms', evidence: 1 } },
  ],
  edges: [
    { id: 'e1', source: 'trigger', target: 'verify', animated: true },
    { id: 'e2', source: 'trigger', target: 'transform', animated: true },
    { id: 'e3', source: 'verify', target: 'hubspot', animated: true },
    { id: 'e4', source: 'transform', target: 'postgres', animated: true },
    { id: 'e5', source: 'hubspot', target: 'slack', animated: true },
    { id: 'e6', source: 'postgres', target: 'slack', animated: true },
  ],
  evidenceIds: evidence.map((item) => item.id),
  validations: ['6 operations supported', '4 evidence sources attached', 'Required OAuth scopes present', 'No cyclic dependencies', 'CRM mutation guarded', 'Idempotency key configured'],
}

export const traceEvents: TraceEvent[] = [
  { id: 'tr-01', step: 'Webhook verified', connector: 'Stripe', status: 'healthy', timestamp: '14:32:08.041', duration: '8ms', message: 'HMAC signature and replay window accepted', attempt: 1, traceId: 'trc_91BX' },
  { id: 'tr-02', step: 'Customer normalized', connector: 'Schema mapper', status: 'healthy', timestamp: '14:32:08.053', duration: '12ms', message: '9 fields mapped against customer.v3', attempt: 1, traceId: 'trc_91BX' },
  { id: 'tr-03', step: 'CRM update paused', connector: 'Policy engine', status: 'paused', timestamp: '14:32:08.067', duration: '—', message: 'Existing record mutation requires operator approval', attempt: 1, traceId: 'trc_91BX' },
  { id: 'tr-04', step: 'Order persisted', connector: 'PostgreSQL', status: 'healthy', timestamp: '14:32:08.101', duration: '34ms', message: 'Idempotency key pi_7K2Y claimed successfully', attempt: 1, traceId: 'trc_91BX' },
]

export const failureScenarios: FailureScenario[] = [
  { id: 'rate-limit', code: '429', name: 'Rate-limit surge', description: 'HubSpot returns 429 twice before recovering.', target: 'HubSpot · contacts.upsert', recovery: 'Respect Retry-After + jittered backoff', severity: 'medium' },
  { id: 'schema-drift', code: '∆', name: 'Schema drift', description: 'A required CRM field changes from string to object.', target: 'HubSpot · customer.v3', recovery: 'Block, diff contract, propose remapping', severity: 'high' },
  { id: 'duplicate', code: '2×', name: 'Duplicate webhook', description: 'Stripe delivers the same payment event twice.', target: 'Stripe · webhook gateway', recovery: 'Return previous result from idempotency ledger', severity: 'low' },
  { id: 'timeout', code: 'T/O', name: 'Provider timeout', description: 'Slack exceeds the configured step deadline.', target: 'Slack · chat.postMessage', recovery: 'Retry within budget, then isolate to DLQ', severity: 'medium' },
]

export const metrics: Metric[] = [
  { label: 'Workflow success', value: '97.8%', delta: '+2.4%', tone: '#76e6c5', points: [42, 48, 44, 57, 61, 69, 76, 72, 84, 91] },
  { label: 'Recovery rate', value: '93.4%', delta: '+4.1%', tone: '#9d7bff', points: [35, 41, 49, 45, 58, 62, 67, 73, 81, 87] },
  { label: 'P95 overhead', value: '286ms', delta: '-18ms', tone: '#70b8ff', points: [82, 74, 78, 66, 62, 57, 61, 49, 44, 38] },
  { label: 'Grounded plans', value: '96.1%', delta: '+1.7%', tone: '#ffce66', points: [50, 57, 54, 62, 64, 71, 74, 81, 82, 89] },
]

export const approvals: Approval[] = [
  { id: 'apr_81M', action: 'Update existing CRM contact', workflow: 'Payment → Revenue Signal', risk: 'Sensitive mutation', requestedBy: 'workflow-compiler', createdAt: '18 seconds ago', reason: 'The email address already exists in HubSpot. The proposed action changes lifecycle_stage and latest_order_value.', status: 'pending' },
  { id: 'apr_11Q', action: 'Replay external notification', workflow: 'Support escalation sync', risk: 'Duplicate communication', requestedBy: 'recovery-engine', createdAt: '7 minutes ago', reason: 'The previous request timed out after the provider accepted the message. Delivery state is uncertain.', status: 'pending' },
]
