export interface SchedulingInput {
  pid: number;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
}
export interface ProcessMetrics {
  pid: number; arrivalTime: number; burstTime: number;
  completionTime: number; turnaroundTime: number;
  waitingTime: number; responseTime: number; remainingTime: number;
}
export interface SchedulingResult {
  algorithm: "FCFS" | "RR";
  ganttChart: GanttSegment[];
  processRows: ProcessMetrics[];
  averageWaitingTime: number;
  averageTurnaroundTime: number;
  averageResponseTime: number;
  contextSwitches: number;
  totalTime: number;
}
export interface GanttSegment { pid: number; startTime: number; endTime: number }

export function runFCFS(processes: SchedulingInput[]): SchedulingResult {
  const sorted = [...processes].sort((a, b) => a.arrivalTime - b.arrivalTime || a.pid - b.pid);
  let time = 0;
  const ganttChart: GanttSegment[] = [];
  const processRows: ProcessMetrics[] = [];

  for (const p of sorted) {
    const start = Math.max(time, p.arrivalTime);
    const completion = start + p.burstTime;
    ganttChart.push({ pid: p.pid, startTime: start, endTime: completion });
    processRows.push({
      pid: p.pid, arrivalTime: p.arrivalTime, burstTime: p.burstTime,
      completionTime: completion, turnaroundTime: completion - p.arrivalTime,
      waitingTime: start - p.arrivalTime, responseTime: start - p.arrivalTime,
      remainingTime: 0,
    });
    time = completion;
  }

  const avg = (key: "waitingTime" | "turnaroundTime" | "responseTime") =>
    processRows.length ? processRows.reduce((sum, row) => sum + row[key], 0) / processRows.length : 0;

  return {
    algorithm: "FCFS", ganttChart, processRows,
    averageWaitingTime: avg("waitingTime"),
    averageTurnaroundTime: avg("turnaroundTime"),
    averageResponseTime: avg("responseTime"),
    contextSwitches: Math.max(0, ganttChart.length - 1),
    totalTime: time,
  };
}
