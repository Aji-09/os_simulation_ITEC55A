import { useSimulation } from "../../context/useSimulation";
import { formatNumber } from "../../utils/metrics";

export function SimulationTable() {
  const { metrics, state } = useSimulation();

  return (
    <div className="card simulation-table-card">
      <div className="card-header">
        <h3>Scheduling Performance Table</h3>
        <span className="badge">Algorithm: {state.algorithm}</span>
      </div>
      <div className="card-body table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              <th>PID</th>
              <th>Arrival (AT)</th>
              <th>Burst (BT)</th>
              <th>Completion (CT)</th>
              <th>Turnaround (TAT)</th>
              <th>Waiting (WT)</th>
              <th>Response (RT)</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((row) => (
              <tr key={row.pid}>
                <td><strong>P{row.pid}</strong></td>
                <td>{row.arrivalTime}</td>
                <td>{row.burstTime}</td>
                <td>{formatNumber(row.completionTime)}</td>
                <td>{formatNumber(row.turnaroundTime)}</td>
                <td>{formatNumber(row.waitingTime)}</td>
                <td>{formatNumber(row.responseTime)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
