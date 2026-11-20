import { useSimulation } from "../../context/useSimulation";

const PID_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f59e0b", // Amber
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#f97316", // Orange
  "#64748b", // Slate
];

export function GanttChart() {
  const { state } = useSimulation();

  const getColor = (pid: number | null) => {
    if (pid === null) return "#94a3b8"; // Gray for idle
    return PID_COLORS[(pid - 1) % PID_COLORS.length];
  };

  const totalDuration = Math.max(state.currentTime, 1);

  return (
    <div className="card gantt-chart-card">
      <div className="card-header">
        <h3>Gantt Chart (CPU Timeline)</h3>
        <span className="badge">T = 0 to {state.currentTime}</span>
      </div>
      <div className="card-body">
        {state.ganttChart.length === 0 ? (
          <p className="empty-message">No CPU activity yet. Click &quot;Step&quot; or &quot;Play&quot; to begin.</p>
        ) : (
          <div className="gantt-container">
            <div className="gantt-bars">
              {state.ganttChart.map((seg, idx) => {
                const duration = seg.endTime - seg.startTime;
                const widthPercent = (duration / totalDuration) * 100;
                return (
                  <div
                    key={idx}
                    className="gantt-segment"
                    style={{
                      width: `${Math.max(widthPercent, 4)}%`,
                      backgroundColor: getColor(seg.pid),
                    }}
                    title={`${seg.pid ? `P${seg.pid}` : "Idle"}: [${seg.startTime} - ${seg.endTime}]`}
                  >
                    <span className="segment-label">{seg.pid ? `P${seg.pid}` : "Idle"}</span>
                    <span className="segment-duration">{duration}t</span>
                  </div>
                );
              })}
            </div>

            <div className="gantt-ticks">
              {state.ganttChart.map((seg, idx) => (
                <div key={idx} className="gantt-tick-group">
                  <span className="tick-start">{seg.startTime}</span>
                  {idx === state.ganttChart.length - 1 && (
                    <span className="tick-end">{seg.endTime}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
