import { useSimulation } from "../../context/useSimulation";

export function KernelLog() {
  const { state } = useSimulation();

  return (
    <div className="kernel-logs-wrapper">
      {state.logs.length === 0 ? (
        <p className="empty-message">No kernel logs yet.</p>
      ) : (
        <div className="log-list">
          {state.logs.map((log) => (
            <div key={log.id} className={`log-entry log-${log.level.toLowerCase()}`}>
              <span className="log-time">[T={log.timestamp}]</span>
              <span className="log-level">{log.level}</span>
              <span className="log-msg">{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
