export type NavId = 'overview' | 'studio' | 'failure' | 'connectors' | 'evidence' | 'analytics' | 'approvals'

export type Status = 'healthy' | 'warning' | 'error' | 'paused' | 'running'

export interface Connector {
  id: string
  name: string
  short: string
  category: string
  status: Status
  auth: string
  version: string
  operations: number
  latency: number
  scopes: string[]
  color: string
  lastContractTest: string
}

export interface Evidence {
  id: string
  connector: string
  title: string
  section: string
  excerpt: string
  version: string
  confidence: number
  source: string
  hash: string
}

export interface WorkflowNodeData extends Record<string, unknown> {
  label: string
  eyebrow: string
  connector: string
  status: Status
  duration?: string
  evidence?: number
  approval?: boolean
}

export interface CompiledWorkflow {
  id: string
  name: string
  version: number
  summary: string
  confidence: number
  risk: string
  nodes: Array<{
    id: string
    type: string
    position: { x: number; y: number }
    data: WorkflowNodeData
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    animated?: boolean
  }>
  evidenceIds: string[]
  validations: string[]
}

export interface TraceEvent {
  id: string
  step: string
  connector: string
  status: Status
  timestamp: string
  duration: string
  message: string
  attempt: number
  traceId: string
}

export interface FailureScenario {
  id: string
  code: string
  name: string
  description: string
  target: string
  recovery: string
  severity: 'low' | 'medium' | 'high'
}

export interface Approval {
  id: string
  action: string
  workflow: string
  risk: string
  requestedBy: string
  createdAt: string
  reason: string
  status: 'pending' | 'approved' | 'rejected'
}

export interface Metric {
  label: string
  value: string
  delta: string
  tone: string
  points: number[]
}
