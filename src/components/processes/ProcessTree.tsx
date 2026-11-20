import type { ProcessRecord } from "../../types";

export function ProcessTree({
  processes,
  selectedPid,
  onSelect,
}: {
  processes: ProcessRecord[];
  selectedPid: number | null;
  onSelect: (pid: number) => void;
}) {
  const rootProcesses = processes.filter((p) => p.parentPid === null);

  const renderNode = (proc: ProcessRecord, depth = 0) => {
    const children = processes.filter((p) => p.parentPid === proc.pid);
    const isSelected = proc.pid === selectedPid;

    return (
      <div key={proc.pid} className="tree-node-wrapper" style={{ marginLeft: `${depth * 20}px` }}>
        <div
          className={`tree-node ${isSelected ? "selected" : ""} status-${proc.state.toLowerCase()}`}
          onClick={() => onSelect(proc.pid)}
        >
          <span className="tree-icon">📄</span>
          <span className="tree-pid">P{proc.pid}</span>
          <span className="tree-name">({proc.name})</span>
          <span className="tree-state">[{proc.state}]</span>
        </div>
        {children.map((c) => renderNode(c, depth + 1))}
      </div>
    );
  };

  return (
    <div className="card process-tree-card">
      <div className="card-header">
        <h3>Process Hierarchy Tree</h3>
      </div>
      <div className="card-body">
        {processes.length === 0 ? (
          <p className="empty-message">No processes created.</p>
        ) : (
          <div className="tree-container">
            {rootProcesses.map((p) => renderNode(p, 0))}
          </div>
        )}
      </div>
    </div>
  );
}
