import { useState } from "react";
import { useSimulation } from "../../context/useSimulation";

export function ProcessTable() {
  const { state, requestIO, terminateProcess } = useSimulation();
  const [ioDuration, setIoDuration] = useState<number>(2);

  const getStatusClass = (status: string) => {
    switch (status) {
      case "Running": return "status-running";
      case "Ready": return "status-ready";
      case "Waiting": return "status-waiting";
      case "Terminated": return "status-terminated";
      default: return "status-new";
    }
  };

  return (
    <div className="card process-table-card">
      <div className="card-header">
        <h3>Process Control Block (PCB) List</h3>
        <span className="badge">{state.processes.length} Processes</span>
      </div>
      <div className="card-body table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>Name</th>
              <th>Arrival</th>
              <th>Burst</th>
              <th>Remaining</th>
              <th>Priority</th>
              <th>PC</th>
              <th>State</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {state.processes.map((p) => (
              <tr key={p.pid} className={p.pid === state.currentPid ? "row-active" : ""}>
                <td><strong>P{p.pid}</strong></td>
                <td>{p.name}</td>
                <td>{p.arrivalTime}</td>
                <td>{p.burstTime}</td>
                <td>{p.remainingTime}</td>
                <td>{p.priority}</td>
                <td><code>0x{p.registers.programCounter.toString(16).padStart(2, "0")}</code></td>
                <td>
                  <span className={`status-pill ${getStatusClass(p.state)}`}>
                    {p.state} {p.state === "Waiting" ? `(${p.ioRemaining}t)` : ""}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-sm btn-outline-warning"
                      onClick={() => requestIO(p.pid, ioDuration)}
                      disabled={p.state === "Terminated" || p.state === "Waiting"}
                      title="Request I/O operation"
                    >
                      I/O ({ioDuration}t)
                    </button>
                    <button
                      className="btn-sm btn-outline-danger"
                      onClick={() => terminateProcess(p.pid)}
                      disabled={p.state === "Terminated"}
                      title="Terminate Process"
                    >
                      Kill
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="table-footer-controls">
          <label>I/O Duration for Manual Requests:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={ioDuration}
            onChange={(e) => setIoDuration(Math.max(1, parseInt(e.target.value, 10) || 1))}
          />
        </div>
      </div>
    </div>
  );
}
