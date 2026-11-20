import type { ProcessConfig, ProcessRecord, ProcessState } from "../types";

export class Process {
  static create(config: ProcessConfig): ProcessRecord {
    return {
      ...config,
      remainingTime: config.burstTime,
      state: "New",
      registers: {
        programCounter: 0,
        accumulator: 0,
        generalPurpose: [0, 0, 0, 0],
      },
      childPids: [],
      threadIds: [],
      firstStartTime: null,
      completionTime: null,
      executedTime: 0,
      ioRemaining: 0,
      ioRequested: false,
    };
  }

  static addChild(process: ProcessRecord, childPid: number): ProcessRecord {
    return {
      ...process,
      childPids: process.childPids.includes(childPid)
        ? process.childPids
        : [...process.childPids, childPid],
    };
  }

  static addThread(process: ProcessRecord, threadId: number): ProcessRecord {
    return {
      ...process,
      threadIds: process.threadIds.includes(threadId)
        ? process.threadIds
        : [...process.threadIds, threadId],
    };
  }

  static setState(process: ProcessRecord, state: ProcessState): ProcessRecord {
    return {
      ...process,
      state,
    };
  }
}
