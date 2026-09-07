import { approvals, compiledWorkflow, connectors, evidence, metrics, traceEvents } from './data'
import type { Approval, CompiledWorkflow, Connector, Evidence, Metric, TraceEvent } from './types'

const json = async <T>(path: string, init?: RequestInit, fallback?: T): Promise<T> => {
  try {
    const response = await fetch(path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...(init?.headers ?? {}) },
    })
    if (!response.ok) throw new Error(`Request failed: ${response.status}`)
    return (await response.json()) as T
  } catch {
    if (fallback !== undefined) return fallback
    throw new Error('IntegrateX API is unavailable')
  }
}

export const api = {
  compile: (prompt: string) => json<CompiledWorkflow>('/api/v1/workflows/compile', { method: 'POST', body: JSON.stringify({ prompt }) }, compiledWorkflow),
  execute: (workflowId: string) => json<{ executionId: string; trace: TraceEvent[] }>('/api/v1/executions', { method: 'POST', body: JSON.stringify({ workflow_id: workflowId }) }, { executionId: 'exec_demo_42', trace: traceEvents }),
  connectors: () => json<Connector[]>('/api/v1/connectors', undefined, connectors),
  evidence: () => json<Evidence[]>('/api/v1/evidence', undefined, evidence),
  metrics: () => json<Metric[]>('/api/v1/metrics', undefined, metrics),
  approvals: () => json<Approval[]>('/api/v1/approvals', undefined, approvals),
  decideApproval: (id: string, decision: 'approve' | 'reject') => json<Approval>(`/api/v1/approvals/${id}/${decision}`, { method: 'POST' }, { ...approvals.find((item) => item.id === id)!, status: decision === 'approve' ? 'approved' : 'rejected' }),
}
