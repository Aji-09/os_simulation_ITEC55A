import { useSimulation } from "../../context/useSimulation";

export function WhyExplainer() {
  const { state } = useSimulation();

  return (
    <div className="card why-explainer-card">
      <div className="card-header">
        <h3>OS Decision Explanation</h3>
        <span className="badge">Why did this happen?</span>
      </div>
      <div className="card-body">
        <div className="explanation-callout">
          <p className="explanation-text">{state.explanation}</p>
        </div>
        <div className="explanation-context">
          <div className="info-point">
            <strong>Current State:</strong> {state.currentPid ? `P${state.currentPid} executing in ${state.mode}` : "CPU Idle"}
          </div>
          <div className="info-point">
            <strong>Algorithm:</strong> {state.algorithm === "FCFS" ? "First-Come, First-Served non-preemptive selection" : `Round Robin with time slice = ${state.quantum}`}
          </div>
        </div>
      </div>
    </div>
  );
}
