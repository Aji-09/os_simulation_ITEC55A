import { useSimulation } from "../../context/useSimulation";

export function SystemOverview() {
  const { state } = useSimulation();

  const currentProcess = state.processes.find((p) => p.pid === state.currentPid);

  return (
    <div className="system-overview-grid">
      <div className="stat-card">
        <span className="stat-label">Current Time</span>
        <span className="stat-value primary">T = {state.currentTime}</span>
        <span className="stat-sub">Ticks elapsed</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">CPU Status</span>
        <span className={`stat-value ${state.currentPid ? "active" : "idle"}`}>
          {state.currentPid ? `P${state.currentPid} (${currentProcess?.name ?? "Process"})` : "Idle"}
        </span>
        <span className="stat-sub">Mode: {state.mode}</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Algorithm</span>
        <span className="stat-value">
          {state.algorithm}
          {state.algorithm === "RR" ? ` (Q=${state.quantum})` : ""}
        </span>
        <span className="stat-sub">CPU Scheduler</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Context Switches</span>
        <span className="stat-value">{state.contextSwitches}</span>
        <span className="stat-sub">Total switches</span>
      </div>

      <div className="stat-card">
        <span className="stat-label">Simulation Status</span>
        <span className={`stat-value ${state.isComplete ? "completed" : "in-progress"}`}>
          {state.isComplete ? "Completed" : "Running"}
        </span>
        <span className="stat-sub">{state.readyQueue.length} process(es) ready</span>
      </div>
    </div>
  );
}
