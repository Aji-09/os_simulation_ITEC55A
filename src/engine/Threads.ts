import type { ThreadConfig, ThreadRecord, ThreadState } from "../types";

export class Thread {
  static create(config: ThreadConfig): ThreadRecord {
    return {
      ...config,
      state: "New",
      programCounter: 0,
      registers: [0, 0, 0, 0],
      isJoined: false,
    };
  }

  static setState(thread: ThreadRecord, state: ThreadState): ThreadRecord {
    return { ...thread, state };
  }

  static join(thread: ThreadRecord): ThreadRecord {
    return { ...thread, isJoined: true };
  }
}
