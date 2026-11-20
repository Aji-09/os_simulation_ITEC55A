import type { ProcessRecord } from "../../types";

export function ProcessDetails({ process }: { process: ProcessRecord | null }) {
  if (!process) {
    return (
      <div className="card process-details-card">
        <div className="card-header">
          <h3>Process Hardware Context (PCB)</h3>
        </div>
        <div className="card-body">
          <p className="empty-message">Select a process to view register and execution state.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card process-details-card">
      <div className="card-header">
        <h3>PCB Details: P{process.pid} ({process.name})</h3>
        <span className={`status-pill status-${process.state.toLowerCase()}`}>{process.state}</span>
      </div>
      <div className="card-body">
        <div className="details-grid">
          <div className="detail-item">
            <span className="label">PID:</span>
            <span className="val">{process.pid}</span>
          </div>
          <div className="detail-item">
            <span className="label">Parent PID:</span>
            <span className="val">{process.parentPid ?? "None (Init)"}</span>
          </div>
          <div className="detail-item">
            <span className="label">Priority:</span>
            <span className="val">{process.priority}</span>
          </div>
          <div className="detail-item">
            <span className="label">Burst Time:</span>
            <span className="val">{process.burstTime}t</span>
          </div>
          <div className="detail-item">
            <span className="label">Remaining:</span>
            <span className="val">{process.remainingTime}t</span>
          </div>
          <div className="detail-item">
            <span className="label">Executed:</span>
            <span className="val">{process.executedTime}t</span>
          </div>
        </div>

        <h4 className="section-title">CPU Registers (Saved Context)</h4>
        <div className="registers-grid">
          <div className="reg-box">
            <span className="reg-name">Program Counter (PC)</span>
            <span className="reg-val">0x{process.registers.programCounter.toString(16).padStart(4, "0")}</span>
          </div>
          <div className="reg-box">
            <span className="reg-name">Accumulator (ACC)</span>
            <span className="reg-val">{process.registers.accumulator}</span>
          </div>
          {process.registers.generalPurpose.map((r, i) => (
            <div key={i} className="reg-box">
              <span className="reg-name">R{i}</span>
              <span className="reg-val">{r}</span>
            </div>
          ))}
        </div>

        <h4 className="section-title">Children & Threads</h4>
        <p className="subtext">
          Child PIDs: {process.childPids.length > 0 ? process.childPids.map(id => `P${id}`).join(", ") : "None"}
        </p>
        <p className="subtext">
          Attached Threads: {process.threadIds.length > 0 ? process.threadIds.map(tid => `T${tid}`).join(", ") : "None"}
        </p>
      </div>
    </div>
  );
}
