import { memo } from 'react'
import { Check, FileSearch, LockKeyhole, Pause, Zap } from 'lucide-react'
import { Background, Controls, Handle, Position, ReactFlow, type NodeProps } from '@xyflow/react'
import type { CompiledWorkflow, WorkflowNodeData } from '../types'

const IntegrateNode = memo(({ data }: NodeProps) => {
  const item = data as WorkflowNodeData
  return (
    <div className={`flow-node ${item.status}`}>
      <Handle type="target" position={Position.Left} />
      <div className="flow-node-top">
        <span>{item.eyebrow}</span>
        {item.status === 'paused' ? <Pause size={12} /> : <Check size={12} />}
      </div>
      <strong>{item.label}</strong>
      <div className="flow-node-meta">
        <span>{item.connector}</span>
        {item.duration && <em>{item.duration}</em>}
      </div>
      {(item.evidence || item.approval) && (
        <div className="node-signals">
          {item.evidence && <span><FileSearch size={10} /> {item.evidence} source{item.evidence > 1 ? 's' : ''}</span>}
          {item.approval && <span><LockKeyhole size={10} /> approval</span>}
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  )
})

IntegrateNode.displayName = 'IntegrateNode'

const nodeTypes = { integrateNode: IntegrateNode }

export function WorkflowMap({ workflow }: { workflow: CompiledWorkflow }) {
  return (
    <div className="workflow-map">
      <div className="map-chrome">
        <span><Zap size={13} /> LIVE WORKFLOW GRAPH</span>
        <span>DRAG TO INSPECT · SCROLL TO ZOOM</span>
      </div>
      <ReactFlow
        nodes={workflow.nodes}
        edges={workflow.edges}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.45}
        maxZoom={1.4}
        defaultEdgeOptions={{ style: { stroke: '#8c73f5', strokeWidth: 1.6 } }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#433b66" gap={30} size={1} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  )
}
