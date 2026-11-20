export type ProcessState = "New" | "Ready" | "Running" | "Waiting" | "Terminated";
export type ThreadState = "New" | "Ready" | "Running" | "Blocked" | "Terminated";
export type KernelMode = "User Mode" | "Kernel Mode";
export type SchedulingAlgorithm = "FCFS" | "RR";
export type LogLevel = "INFO" | "WARNING" | "ERROR";

export interface CPURegisters {
  programCounter: number;
  accumulator: number;
  generalPurpose: number[];
}

export interface ProcessConfig {
  pid: number;
  name: string;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  parentPid: number | null;
  ioAfter?: number | null;
  ioDuration?: number;
}

export interface ProcessRecord extends ProcessConfig {
  remainingTime: number;
  state: ProcessState;
  registers: CPURegisters;
  childPids: number[];
  threadIds: number[];
  firstStartTime: number | null;
  completionTime: number | null;
  executedTime: number;
  ioRemaining: number;
  ioRequested: boolean;
}

export interface ThreadConfig {
  tid: number;
  pid: number;
  name: string;
}

export interface ThreadRecord extends ThreadConfig {
  state: ThreadState;
  programCounter: number;
  registers: number[];
  isJoined: boolean;
}

export interface GanttSegment {
  pid: number | null;
  startTime: number;
  endTime: number;
}

export interface KernelLogEntry {
  id: number;
  timestamp: number;
  level: LogLevel;
  message: string;
}

export interface ProcessMetrics {
  pid: number;
  arrivalTime: number;
  burstTime: number;
  completionTime: number | null;
  turnaroundTime: number | null;
  waitingTime: number | null;
  responseTime: number | null;
  remainingTime: number;
}

export interface SimulationSnapshot {
  currentTime: number;
  currentPid: number | null;
  mode: KernelMode;
  processes: ProcessRecord[];
  threads: ThreadRecord[];
  readyQueue: number[];
  ganttChart: GanttSegment[];
  logs: KernelLogEntry[];
  contextSwitches: number;
  algorithm: SchedulingAlgorithm;
  quantum: number;
  isComplete: boolean;
  explanation: string;
}

export interface SchedulingInput {
  pid: number;
  arrivalTime: number;
  burstTime: number;
  priority?: number;
}
