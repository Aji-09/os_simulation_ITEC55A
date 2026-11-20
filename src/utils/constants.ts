import type { ProcessState, SchedulingAlgorithm } from "../types";

export const PROCESS_STATES: ProcessState[] = [
  "New", "Ready", "Running", "Waiting", "Terminated",
];

export const SCHEDULING_ALGORITHMS: SchedulingAlgorithm[] = ["FCFS", "RR"];
export const DEFAULT_TIME_QUANTUM = 2;

export const DEFAULT_PROCESSES = [
  { pid: 1, name: "Registration", arrivalTime: 0, burstTime: 5, priority: 1, parentPid: null },
  { pid: 2, name: "Consultation", arrivalTime: 1, burstTime: 3, priority: 2, parentPid: null },
  { pid: 3, name: "Laboratory", arrivalTime: 2, burstTime: 4, priority: 3, parentPid: null },
];
