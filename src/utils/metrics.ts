import type { ProcessMetrics } from "../types";

export function calculateAverages(rows: ProcessMetrics[]) {
  const completed = rows.filter(r =>
    r.completionTime !== null &&
    r.waitingTime !== null &&
    r.turnaroundTime !== null &&
    r.responseTime !== null
  );
  const average = (key: "waitingTime" | "turnaroundTime" | "responseTime") =>
    completed.length
      ? completed.reduce((sum, row) => sum + (row[key] ?? 0), 0) / completed.length
      : 0;

  return {
    averageWaitingTime: average("waitingTime"),
    averageTurnaroundTime: average("turnaroundTime"),
    averageResponseTime: average("responseTime"),
    completedCount: completed.length,
  };
}

export function formatNumber(value: number | null): string {
  return value === null ? "—" : value.toFixed(2).replace(/\.00$/, "");
}
