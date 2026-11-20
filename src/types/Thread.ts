
import type { ThreadConfig, ThreadState } from "../types";

export class Thread {
  public tid: number;
  public pid: number;
  public name: string;
  public state: ThreadState;

  // Thread-specific resources
  public programCounter: number;
  public registers: number[];

  // Thread execution information
  public isJoined: boolean;

  constructor(config: ThreadConfig) {
    this.tid = config.tid;
    this.pid = config.pid;
    this.name = config.name;

    this.state = "New";

    this.programCounter = 0;
    this.registers = [0, 0, 0, 0];

    this.isJoined = false;
  }

  setState(state: ThreadState): void {
    this.state = state;
  }

  execute(): void {
    if (this.state === "Running") {
      this.programCounter++;
    }
  }

  join(): void {
    this.isJoined = true;
  }

  terminate(): void {
    this.state = "Terminated";
  }

  getTCB() {
    return {
      tid: this.tid,
      pid: this.pid,
      name: this.name,
      state: this.state,
      programCounter: this.programCounter,
      registers: this.registers,
      isJoined: this.isJoined,
    };
  }
}
