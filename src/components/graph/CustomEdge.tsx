import { memo } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer } from '@xyflow/react';

interface CustomEdgeData {
  label: 'CONTAINS' | 'IMPORTS';
  isHighlighted?: boolean;
}

const CustomEdge = memo(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}: EdgeProps & { data: CustomEdgeData }) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isImport = data?.label === 'IMPORTS';
  const isHighlighted = data?.isHighlighted || selected;
  
  const edgeColor = isImport 
    ? isHighlighted ? 'hsl(280, 80%, 60%)' : 'hsl(280, 80%, 40%)'
    : isHighlighted ? 'hsl(38, 92%, 50%)' : 'hsl(220, 10%, 30%)';
  
  return (
    <>
      <path
        id={id}
        className={`react-flow__edge-path transition-all duration-200 ${
          isHighlighted ? 'opacity-100' : 'opacity-60'
        }`}
        d={edgePath}
        strokeWidth={isHighlighted ? 2 : 1.5}
        stroke={edgeColor}
        fill="none"
        strokeDasharray={isImport ? '5,5' : undefined}
        style={{
          filter: isHighlighted ? `drop-shadow(0 0 4px ${edgeColor})` : undefined,
        }}
      />
      <EdgeLabelRenderer>
        <div
          className={`
            absolute text-[9px] font-medium px-1.5 py-0.5 rounded
            pointer-events-none transition-opacity duration-200
            ${isHighlighted ? 'opacity-100' : 'opacity-0'}
            ${isImport ? 'bg-edge-imports/20 text-edge-imports' : 'bg-edge-active/20 text-edge-active'}
          `}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          {data?.label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
});

CustomEdge.displayName = 'CustomEdge';

export default CustomEdge;
