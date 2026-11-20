import { Process } from "./Process";
import { Thread } from "./Threads";
import { Kernel } from "./Kernel";
import type {
  ProcessConfig, ProcessRecord, ThreadRecord, SchedulingAlgorithm,
  SimulationSnapshot, GanttSegment,
} from "../types";

export class Simulation {
  processes: ProcessRecord[] = [];
  threads: ThreadRecord[] = [];
  readyQueue: number[] = [];
  ganttChart: GanttSegment[] = [];
  currentTime = 0;
  currentPid: number | null = null;
  algorithm: SchedulingAlgorithm = "FCFS";
  quantum = 2;
  quantumUsed = 0;
  contextSwitches = 0;
  isComplete = false;
  explanation = "Add processes and start the simulation.";
  kernel = new Kernel();
  private nextPid = 1;
  private nextTid = 1;
  private history: SimulationSnapshot[] = [];

  constructor(config?: { algorithm?: SchedulingAlgorithm; quantum?: number; processes?: ProcessConfig[] }) {
    this.algorithm = config?.algorithm ?? "FCFS";
    this.quantum = config?.quantum ?? 2;
    (config?.processes ?? []).forEach(p => this.createProcess(p));
    this.capture();
  }

  private log(message: string, level: "INFO" | "WARNING" | "ERROR" = "INFO") {
    this.kernel.log(message, this.currentTime, level);
  }

  createProcess(config: Omit<ProcessConfig, "pid"> & { pid?: number }): ProcessRecord {
    const pid = config.pid ?? this.nextPid++;
    if (this.processes.some(p => p.pid === pid)) throw new Error(`PID ${pid} already exists.`);
    this.nextPid = Math.max(this.nextPid, pid + 1);
    const process = Process.create({ ...config, pid });
    this.processes = [...this.processes, process].map(p =>
      p.pid === process.parentPid ? Process.addChild(p, pid) : p
    );
    this.log(`Created process P${pid} (${process.name}).`);
    this.capture();
    return process;
  }

  terminateProcess(pid: number): void {
    const p = this.processes.find(x => x.pid === pid);
    if (!p || p.state === "Terminated") return;
    this.processes = this.processes.map(x => x.pid === pid
      ? { ...x, state: "Terminated", remainingTime: 0, completionTime: this.currentTime }
      : x);
    this.readyQueue = this.readyQueue.filter(id => id !== pid);
    if (this.currentPid === pid) this.currentPid = null;
    this.log(`Terminated process P${pid}.`, "WARNING");
    this.capture();
  }

  createThread(pid: number, name?: string): ThreadRecord {
    const process = this.processes.find(p => p.pid === pid);
    if (!process || process.state === "Terminated") throw new Error("A live parent process is required.");
    const thread = Thread.create({ tid: this.nextTid++, pid, name: name ?? `Thread ${this.nextTid - 1}` });
    this.threads = [...this.threads, thread];
    this.processes = this.processes.map(p => p.pid === pid ? Process.addThread(p, thread.tid) : p);
    this.log(`Created T${thread.tid} under P${pid}.`);
    this.capture();
    return thread;
  }

  joinThread(tid: number): void {
    this.threads = this.threads.map(t => t.tid === tid ? Thread.join(t) : t);
    this.log(`Join requested for T${tid}.`);
    this.capture();
  }

  requestIO(pid: number, duration: number): void {
    if (duration <= 0) throw new Error("I/O duration must be greater than zero.");
    const p = this.processes.find(x => x.pid === pid);
    if (!p || p.state === "Terminated") throw new Error("Process not available.");
    this.processes = this.processes.map(x => x.pid === pid
      ? { ...x, state: "Waiting", ioRemaining: duration, ioRequested: true }
      : x);
    this.readyQueue = this.readyQueue.filter(id => id !== pid);
    if (this.currentPid === pid) {
      this.currentPid = null;
      this.quantumUsed = 0;
    }
    this.log(`P${pid} requested I/O for ${duration} time unit(s).`);
    this.capture();
  }

  yieldCPU(): void {
    if (this.currentPid === null) return;
    const pid = this.currentPid;
    this.processes = this.processes.map(p => p.pid === pid ? { ...p, state: "Ready" } : p);
    if (!this.readyQueue.includes(pid)) this.readyQueue.push(pid);
    this.currentPid = null;
    this.quantumUsed = 0;
    this.explanation = `P${pid} yielded the CPU and returned to the ready queue.`;
    this.log(`P${pid} yielded the CPU.`);
    this.capture();
  }

  setAlgorithm(algorithm: SchedulingAlgorithm, quantum = this.quantum): void {
    this.algorithm = algorithm;
    this.quantum = Math.max(1, Math.floor(quantum));
    this.log(`Scheduling algorithm changed to ${algorithm}${algorithm === "RR" ? ` (quantum ${this.quantum})` : ""}.`);
    this.capture();
  }

  private admitArrivals(): void {
    for (const p of this.processes) {
      if (p.state === "New" && p.arrivalTime <= this.currentTime) {
        this.processes = this.processes.map(x => x.pid === p.pid ? { ...x, state: "Ready" } : x);
        if (!this.readyQueue.includes(p.pid)) this.readyQueue.push(p.pid);
        this.log(`P${p.pid} entered the ready queue.`);
      }
    }
  }

  private advanceIO(): void {
    this.processes = this.processes.map(p => {
      if (p.state !== "Waiting" || p.ioRemaining <= 0) return p;
      const left = p.ioRemaining - 1;
      if (left === 0) {
        this.log(`I/O completed for P${p.pid}; process moved to Ready.`);
        if (!this.readyQueue.includes(p.pid)) this.readyQueue.push(p.pid);
        return { ...p, ioRemaining: 0, ioRequested: false, state: "Ready" };
      }
      return { ...p, ioRemaining: left };
    });
  }

  private chooseNext(): void {
    if (this.currentPid !== null) return;
    const nextPid = this.readyQueue.shift();
    if (nextPid === undefined) return;
    const previous = this.currentPid;
    this.currentPid = nextPid;
    this.quantumUsed = 0;
    this.processes = this.processes.map(p => p.pid === nextPid ? {
      ...p,
      state: "Running",
      firstStartTime: p.firstStartTime ?? this.currentTime,
    } : p);
    this.kernel.contextSwitch(previous, nextPid, this.currentTime);
    this.contextSwitches += previous === nextPid ? 0 : 1;
    this.explanation = `P${nextPid} was selected from the front of the ready queue.`;
    this.log(`CPU dispatched P${nextPid}.`);
  }

  step(): SimulationSnapshot {
    if (this.isComplete) return this.snapshot();
    this.admitArrivals();
    this.advanceIO();

    if (this.currentPid !== null) {
      const running = this.processes.find(p => p.pid === this.currentPid);
      if (running?.state !== "Running") this.currentPid = null;
    }
    this.chooseNext();

    if (this.currentPid === null) {
      const future = this.processes.some(p => p.state === "New" || p.state === "Waiting");
      if (future) {
        this.ganttChart.push({ pid: null, startTime: this.currentTime, endTime: this.currentTime + 1 });
        this.explanation = "CPU is idle because no process is ready.";
        this.currentTime++;
        this.finishCheck();
        this.capture();
        return this.snapshot();
      }
      this.finishCheck();
      this.capture();
      return this.snapshot();
    }

    const pid = this.currentPid;
    this.processes = this.processes.map(p => p.pid === pid ? {
      ...p,
      remainingTime: Math.max(0, p.remainingTime - 1),
      executedTime: p.executedTime + 1,
      registers: { ...p.registers, programCounter: p.registers.programCounter + 1 },
    } : p);
    this.quantumUsed++;
    this.appendGantt(pid);
    this.currentTime++;

    const updated = this.processes.find(p => p.pid === pid)!;
    if (updated.remainingTime === 0) {
      this.processes = this.processes.map(p => p.pid === pid
        ? { ...p, state: "Terminated", completionTime: this.currentTime }
        : p);
      this.currentPid = null;
      this.quantumUsed = 0;
      this.log(`P${pid} completed execution.`);
      this.explanation = `P${pid} finished its CPU burst at time ${this.currentTime}.`;
    } else if (
      this.algorithm === "RR" &&
      this.quantumUsed >= this.quantum
    ) {
      this.processes = this.processes.map(p => p.pid === pid ? { ...p, state: "Ready" } : p);
      this.readyQueue.push(pid);
      this.currentPid = null;
      this.quantumUsed = 0;
      this.log(`Time quantum expired for P${pid}; returned to ready queue.`);
      this.explanation = `P${pid} used its full time quantum and was preempted.`;
    }

    this.finishCheck();
    this.capture();
    return this.snapshot();
  }

  private appendGantt(pid: number): void {
    const last = this.ganttChart[this.ganttChart.length - 1];
    if (last && last.pid === pid && last.endTime === this.currentTime) last.endTime++;
    else this.ganttChart.push({ pid, startTime: this.currentTime, endTime: this.currentTime + 1 });
  }

  private finishCheck(): void {
    this.isComplete = this.processes.length > 0 &&
      this.processes.every(p => p.state === "Terminated");
    if (this.isComplete) {
      this.currentPid = null;
      this.explanation = "All processes have completed.";
    }
  }

  snapshot(): SimulationSnapshot {
    return {
      currentTime: this.currentTime,
      currentPid: this.currentPid,
      mode: this.kernel.mode,
      processes: structuredClone(this.processes),
      threads: structuredClone(this.threads),
      readyQueue: [...this.readyQueue],
      ganttChart: structuredClone(this.ganttChart),
      logs: structuredClone(this.kernel.logs),
      contextSwitches: this.contextSwitches,
      algorithm: this.algorithm,
      quantum: this.quantum,
      isComplete: this.isComplete,
      explanation: this.explanation,
    };
  }

  private capture(): void {
    this.history.push(this.snapshot());
  }

  rewind(time: number): SimulationSnapshot {
    const target = [...this.history].reverse().find(s => s.currentTime <= time);
    if (!target) return this.snapshot();
    this.currentTime = target.currentTime;
    this.currentPid = target.currentPid;
    this.processes = structuredClone(target.processes);
    this.threads = structuredClone(target.threads);
    this.readyQueue = [...target.readyQueue];
    this.ganttChart = structuredClone(target.ganttChart);
    this.kernel.logs = structuredClone(target.logs);
    this.contextSwitches = target.contextSwitches;
    this.algorithm = target.algorithm;
    this.quantum = target.quantum;
    this.isComplete = target.isComplete;
    this.explanation = target.explanation;
    this.history = this.history.filter(s => s.currentTime <= target.currentTime);
    return this.snapshot();
  }

  reset(): void {
    const configs = this.processes.map(({ pid, name, arrivalTime, burstTime, priority, parentPid, ioAfter, ioDuration }) =>
      ({ pid, name, arrivalTime, burstTime, priority, parentPid, ioAfter, ioDuration }));
    const algorithm = this.algorithm;
    const quantum = this.quantum;
    this.processes = [];
    this.threads = [];
    this.readyQueue = [];
    this.ganttChart = [];
    this.currentTime = 0;
    this.currentPid = null;
    this.quantumUsed = 0;
    this.contextSwitches = 0;
    this.isComplete = false;
    this.kernel = new Kernel();
    this.history = [];
    this.nextPid = 1;
    this.nextTid = 1;
    this.algorithm = algorithm;
    this.quantum = quantum;
    configs.forEach(p => this.createProcess(p));
    this.log("Simulation reset.");
    this.capture();
  }

  getMetrics() {
    return this.processes.map(p => {
      const completion = p.completionTime;
      const turnaround = completion === null ? null : completion - p.arrivalTime;
      const waiting = turnaround === null ? null : turnaround - p.burstTime;
      const response = p.firstStartTime === null ? null : p.firstStartTime - p.arrivalTime;
      return {
        pid: p.pid, arrivalTime: p.arrivalTime, burstTime: p.burstTime,
        completionTime: completion, turnaroundTime: turnaround,
        waitingTime: waiting, responseTime: response, remainingTime: p.remainingTime,
      };
    });
  }

  getHistoryTimes(): number[] {
    return [...new Set(this.history.map(s => s.currentTime))].sort((a, b) => a - b);
  }
}
