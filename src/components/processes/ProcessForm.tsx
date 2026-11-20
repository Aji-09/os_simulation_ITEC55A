import { useState } from "react";
import { useSimulation } from "../../context/useSimulation";

export function ProcessForm() {
  const { state, addProcess } = useSimulation();
  const [name, setName] = useState("");
  const [arrivalTime, setArrivalTime] = useState(0);
  const [burstTime, setBurstTime] = useState(4);
  const [priority, setPriority] = useState(1);
  const [parentPid, setParentPid] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (burstTime <= 0) return;
    addProcess({
      name: name.trim() || `Process-${state.processes.length + 1}`,
      arrivalTime: Math.max(0, arrivalTime),
      burstTime,
      priority,
      parentPid,
    });
    setName("");
    setBurstTime(4);
  };

  return (
    <div className="card process-form-card">
      <div className="card-header">
        <h3>Create New Process</h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label>Process Name:</label>
            <input
              type="text"
              placeholder="e.g. Triage / Lab Check"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Arrival Time:</label>
            <input
              type="number"
              min="0"
              value={arrivalTime}
              onChange={(e) => setArrivalTime(parseInt(e.target.value, 10) || 0)}
            />
          </div>

          <div className="form-group">
            <label>Burst Time (CPU ticks):</label>
            <input
              type="number"
              min="1"
              value={burstTime}
              onChange={(e) => setBurstTime(Math.max(1, parseInt(e.target.value, 10) || 1))}
            />
          </div>

          <div className="form-group">
            <label>Priority:</label>
            <input
              type="number"
              min="1"
              value={priority}
              onChange={(e) => setPriority(parseInt(e.target.value, 10) || 1)}
            />
          </div>

          <div className="form-group">
            <label>Parent Process (Optional):</label>
            <select
              value={parentPid ?? ""}
              onChange={(e) => setParentPid(e.target.value ? Number(e.target.value) : null)}
            >
              <option value="">None (Root Process)</option>
              {state.processes
                .filter((p) => p.state !== "Terminated")
                .map((p) => (
                  <option key={p.pid} value={p.pid}>
                    P{p.pid} ({p.name})
                  </option>
                ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary">
              + Add Process
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
