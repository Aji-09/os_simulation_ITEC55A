import { useSimulation } from "../../context/useSimulation";

export function ReadyQueue() {
  const { state } = useSimulation();

  return (
    <div className="card ready-queue-card">
      <div className="card-header">
        <h3>Ready Queue</h3>
        <span className="badge">{state.readyQueue.length} Waiting</span>
      </div>
      <div className="card-body">
        {state.readyQueue.length === 0 ? (
          <p className="empty-message">Ready queue is empty.</p>
        ) : (
          <div className="queue-list">
            {state.readyQueue.map((pid, index) => {
              const proc = state.processes.find((p) => p.pid === pid);
              return (
                <div key={pid} className="queue-item">
                  <div className="queue-index">#{index + 1}</div>
                  <div className="queue-info">
                    <span className="queue-pid">P{pid}</span>
                    <span className="queue-name">{proc?.name ?? "Process"}</span>
                    <span className="queue-burst">Remaining: {proc?.remainingTime}t</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
