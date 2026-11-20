import { useSimulation } from "../../context/useSimulation";

export function ThreadsDetails() {
  const { state, joinThread } = useSimulation();

  return (
    <div className="card thread-details-card">
      <div className="card-header">
        <h3>Active Threads (TCB List)</h3>
        <span className="badge">{state.threads.length} Total</span>
      </div>
      <div className="card-body table-responsive">
        {state.threads.length === 0 ? (
          <p className="empty-message">No threads currently active. Use the form above to spawn a thread.</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>TID</th>
                <th>Parent PID</th>
                <th>Thread Name</th>
                <th>State</th>
                <th>PC</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {state.threads.map((t) => (
                <tr key={t.tid}>
                  <td><strong>T{t.tid}</strong></td>
                  <td>P{t.pid}</td>
                  <td>{t.name}</td>
                  <td>
                    <span className={`status-pill status-${t.state.toLowerCase()}`}>
                      {t.state}
                    </span>
                  </td>
                  <td><code>0x{t.programCounter.toString(16).padStart(2, "0")}</code></td>
                  <td>{t.isJoined ? "Yes (Joined)" : "Independent"}</td>
                  <td>
                    <button
                      className="btn-sm btn-outline-primary"
                      onClick={() => joinThread(t.tid)}
                      disabled={t.isJoined || t.state === "Terminated"}
                    >
                      {t.isJoined ? "Joined" : "Join Thread"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
