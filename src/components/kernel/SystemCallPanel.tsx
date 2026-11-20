import { useState } from "react";
import { useSimulation } from "../../context/useSimulation";

export function SystemCallPanel() {
  const { state, yieldCPU, requestIO } = useSimulation();
  const [selectedPid, setSelectedPid] = useState<number>(state.processes[0]?.pid ?? 1);
  const [callDuration, setCallDuration] = useState<number>(2);

  return (
    <div className="system-call-wrapper">
      <p className="description">Simulate user space invoking kernel system calls:</p>
      <div className="syscall-actions">
        <div className="syscall-row">
          <label>Target Process:</label>
          <select
            value={selectedPid}
            onChange={(e) => setSelectedPid(Number(e.target.value))}
          >
            {state.processes.map((p) => (
              <option key={p.pid} value={p.pid}>
                P{p.pid} ({p.name}) - {p.state}
              </option>
            ))}
          </select>
        </div>

        <div className="syscall-buttons">
          <button
            className="btn btn-sm btn-outline-primary"
            onClick={() => yieldCPU()}
            disabled={state.currentPid === null}
          >
            <code>sys_yield()</code>
          </button>

          <button
            className="btn btn-sm btn-outline-warning"
            onClick={() => requestIO(selectedPid, callDuration)}
          >
            <code>sys_io_wait({callDuration})</code>
          </button>
        </div>
        <div className="duration-row">
          <label>I/O Ticks:</label>
          <input
            type="number"
            min="1"
            max="10"
            value={callDuration}
            onChange={(e) => setCallDuration(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}
