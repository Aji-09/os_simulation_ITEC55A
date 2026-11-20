import type {
  SchedulingInput,
  SchedulingResult,
  ProcessMetrics,
  GanttSegment,
} from "./FCFS";

export function runRoundRobin(
  processes: SchedulingInput[],
  quantum: number,
): SchedulingResult {
  if (!Number.isInteger(quantum) || quantum <= 0)
    throw new Error("Quantum must be a positive integer.");
  const sorted = [...processes].sort(
    (a, b) => a.arrivalTime - b.arrivalTime || a.pid - b.pid,
  );
  const remaining = new Map(sorted.map((p) => [p.pid, p.burstTime]));
  const firstStart = new Map<number, number>();
  const completion = new Map<number, number>();
  const queue: SchedulingInput[] = [];
  const ganttChart: GanttSegment[] = [];
  let time = 0;
  let next = 0;

  while (next < sorted.length || queue.length) {
    while (next < sorted.length && sorted[next].arrivalTime <= time)
      queue.push(sorted[next++]);
    if (!queue.length) {
      if (next < sorted.length) time = sorted[next].arrivalTime;
      continue;
    }
    const p = queue.shift()!;
    const start = time;
    const slice = Math.min(quantum, remaining.get(p.pid)!);
    if (!firstStart.has(p.pid)) firstStart.set(p.pid, start);
    time += slice;
    remaining.set(p.pid, remaining.get(p.pid)! - slice);
    ganttChart.push({ pid: p.pid, startTime: start, endTime: time });
    while (next < sorted.length && sorted[next].arrivalTime <= time)
      queue.push(sorted[next++]);
    if (remaining.get(p.pid)! > 0) queue.push(p);
    else completion.set(p.pid, time);
  }

  const processRows: ProcessMetrics[] = sorted.map((p) => {
    const ct = completion.get(p.pid)!;
    const tat = ct - p.arrivalTime;
    return {
      pid: p.pid,
      arrivalTime: p.arrivalTime,
      burstTime: p.burstTime,
      completionTime: ct,
      turnaroundTime: tat,
      waitingTime: tat - p.burstTime,
      responseTime: firstStart.get(p.pid)! - p.arrivalTime,
      remainingTime: 0,
    };
  });
  const avg = (key: "waitingTime" | "turnaroundTime" | "responseTime") =>
    processRows.length
      ? processRows.reduce((sum, row) => sum + row[key], 0) / processRows.length
      : 0;
  let contextSwitches = 0;
  for (let i = 1; i < ganttChart.length; i++)
    if (ganttChart[i].pid !== ganttChart[i - 1].pid) contextSwitches++;

  return {
    algorithm: "RR",
    ganttChart,
    processRows,
    averageWaitingTime: avg("waitingTime"),
    averageTurnaroundTime: avg("turnaroundTime"),
    averageResponseTime: avg("responseTime"),
    contextSwitches,
    totalTime: time,
  };
}
