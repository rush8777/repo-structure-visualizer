import { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath, EdgeProps } from '@xyflow/react';

interface LogicEdgeData {
  label: string;
  edgeType: 'call' | 'data' | 'middleware' | 'return';
  isHighlighted?: boolean;
}

export const LogicEdgeComponent = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  data,
  markerEnd,
}: EdgeProps) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const edgeData = data as unknown as LogicEdgeData | undefined;
  const label = edgeData?.label;
  const isHighlighted = edgeData?.isHighlighted;

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          ...style,
          strokeWidth: isHighlighted ? 2.5 : 1.5,
        }}
        markerEnd={markerEnd}
      />
      {label && (
        <EdgeLabelRenderer>
          <div
            className={`
              absolute px-2 py-0.5 rounded-full text-[10px] font-medium
              bg-background/90 border border-border backdrop-blur-sm
              pointer-events-auto cursor-default
              transition-opacity duration-200
              ${isHighlighted ? 'opacity-100' : 'opacity-70 hover:opacity-100'}
            `}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

LogicEdgeComponent.displayName = 'LogicEdgeComponent';

export default LogicEdgeComponent;
