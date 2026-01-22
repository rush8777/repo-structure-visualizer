import { Code, Layers, Wrench, Server, Play } from 'lucide-react';

export const LogicLegend = () => {
  const items = [
    { icon: Play, label: 'Entry Point', color: 'bg-amber-500/20 text-amber-400' },
    { icon: Code, label: 'Function', color: 'bg-blue-500/20 text-blue-400' },
    { icon: Layers, label: 'Middleware', color: 'bg-purple-500/20 text-purple-400' },
    { icon: Wrench, label: 'Utility', color: 'bg-emerald-500/20 text-emerald-400' },
    { icon: Server, label: 'Service', color: 'bg-rose-500/20 text-rose-400' },
  ];
  
  return (
    <div className="absolute bottom-4 left-4 z-10 p-3 rounded-lg bg-card/90 backdrop-blur-sm border border-border">
      <p className="text-xs font-medium text-muted-foreground mb-2">Logic Node Types</p>
      <div className="flex flex-col gap-1.5">
        {items.map(({ icon: Icon, label, color }) => (
          <div key={label} className="flex items-center gap-2 text-xs">
            <div className={`w-5 h-5 rounded flex items-center justify-center ${color}`}>
              <Icon className="w-3 h-3" />
            </div>
            <span className="text-foreground">{label}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-3 pt-2 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Edge Types</p>
        <div className="flex flex-col gap-1.5 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 bg-blue-500" />
            <span>Function call</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5 bg-purple-500" style={{ background: 'repeating-linear-gradient(90deg, hsl(280, 85%, 65%) 0, hsl(280, 85%, 65%) 4px, transparent 4px, transparent 8px)' }} />
            <span>Middleware</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-0.5" style={{ background: 'repeating-linear-gradient(90deg, hsl(38, 92%, 50%) 0, hsl(38, 92%, 50%) 2px, transparent 2px, transparent 5px)' }} />
            <span>Returns</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogicLegend;
