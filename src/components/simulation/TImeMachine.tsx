import { useSimulation } from "../../context/useSimulation";

export function TimeMachine() {
  const { state, historyTimes, rewind } = useSimulation();

  return (
    <div className="card time-machine-card">
      <div className="card-header">
        <h3>Time Machine (History & Rewind)</h3>
        <span className="badge">Current T: {state.currentTime}</span>
      </div>
      <div className="card-body">
        <p className="description">
          Rewind simulation execution to any previous timestamp snapshot.
        </p>
        <div className="timeline-buttons">
          {historyTimes.map((t: number) => (
            <button
              key={t}
              className={`timeline-btn ${t === state.currentTime ? "active" : ""}`}
              onClick={() => rewind(t)}
            >
              T={t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
