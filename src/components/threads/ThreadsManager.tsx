import { useState } from "react";
import { useSimulation } from "../../context/useSimulation";
import { ThreadsDetails } from "./ThreadsDetails";

export function ThreadsManager() {
  const { state, createThread } = useSimulation();
  const [targetPid, setTargetPid] = useState<number>(state.processes[0]?.pid ?? 1);
  const [threadName, setThreadName] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetPid) return;
    createThread(targetPid, threadName.trim() || undefined);
    setThreadName("");
  };

  const eligibleProcesses = state.processes.filter((p) => p.state !== "Terminated");

  return (
    <div className="threads-manager-page">
      <div className="card spawn-thread-card">
        <div className="card-header">
          <h3>Spawn New Thread (Multithreading)</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleCreate} className="form-inline-grid">
            <div className="form-group">
              <label>Parent Process:</label>
              <select
                value={targetPid}
                onChange={(e) => setTargetPid(Number(e.target.value))}
                disabled={eligibleProcesses.length === 0}
              >
                {eligibleProcesses.map((p) => (
                  <option key={p.pid} value={p.pid}>
                    P{p.pid} ({p.name}) - {p.state}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Thread Name:</label>
              <input
                type="text"
                placeholder="e.g. Worker-1 / Query Task"
                value={threadName}
                onChange={(e) => setThreadName(e.target.value)}
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={eligibleProcesses.length === 0}
              >
                + Spawn Thread
              </button>
            </div>
          </form>
        </div>
      </div>

      <ThreadsDetails />
    </div>
  );
}
