import { useSimulation } from "../../context/useSimulation";
import { calculateAverages, formatNumber } from "../../utils/metrics";

export function Metrics() {
  const { metrics } = useSimulation();
  const summary = calculateAverages(metrics);

  return (
    <div className="card metrics-card">
      <div className="card-header">
        <h3>Metrics Summary</h3>
        <span className="badge">{summary.completedCount} / {metrics.length} Done</span>
      </div>
      <div className="card-body">
        <div className="metrics-grid">
          <div className="metric-box">
            <span className="metric-title">Avg Waiting Time</span>
            <span className="metric-value">{formatNumber(summary.averageWaitingTime)}</span>
            <span className="metric-unit">ticks</span>
          </div>

          <div className="metric-box">
            <span className="metric-title">Avg Turnaround Time</span>
            <span className="metric-value">{formatNumber(summary.averageTurnaroundTime)}</span>
            <span className="metric-unit">ticks</span>
          </div>

          <div className="metric-box">
            <span className="metric-title">Avg Response Time</span>
            <span className="metric-value">{formatNumber(summary.averageResponseTime)}</span>
            <span className="metric-unit">ticks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
