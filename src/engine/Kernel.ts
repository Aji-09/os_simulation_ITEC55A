import type { KernelLogEntry, KernelMode, LogLevel } from "../types";

export class Kernel {
  mode: KernelMode = "User Mode";
  logs: KernelLogEntry[] = [];
  private nextLogId = 1;

  log(message: string, timestamp: number, level: LogLevel = "INFO"): void {
    this.logs = [
      { id: this.nextLogId++, timestamp, level, message },
      ...this.logs,
    ];
  }

  systemCall<T>(name: string, timestamp: number, operation: () => T): T {
    this.mode = "Kernel Mode";
    this.log(`System call invoked: ${name}`, timestamp);
    try {
      const result = operation();
      this.log(`System call completed: ${name}`, timestamp);
      return result;
    } catch (error) {
      this.log(`System call failed: ${name}`, timestamp, "ERROR");
      throw error;
    } finally {
      this.mode = "User Mode";
    }
  }

  contextSwitch(previousPid: number | null, nextPid: number | null, timestamp: number): void {
    if (previousPid === nextPid) return;
    this.log(
      `Context switch: ${previousPid === null ? "Idle" : `P${previousPid}`} → ${nextPid === null ? "Idle" : `P${nextPid}`}`,
      timestamp,
    );
  }
}
