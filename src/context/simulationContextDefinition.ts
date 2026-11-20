import { createContext } from "react";
import type { Simulation } from "../engine/Simulation";
import type { ProcessConfig, SchedulingAlgorithm, SimulationSnapshot } from "../types";

export interface SimulationContextValue {
  state: SimulationSnapshot;
  metrics: ReturnType<Simulation["getMetrics"]>;
  historyTimes: number[];
  addProcess: (config: Omit<ProcessConfig, "pid">) => void;
  terminateProcess: (pid: number) => void;
  createThread: (pid: number, name?: string) => void;
  joinThread: (tid: number) => void;
  requestIO: (pid: number, duration: number) => void;
  yieldCPU: () => void;
  setAlgorithm: (algorithm: SchedulingAlgorithm, quantum?: number) => void;
  step: () => void;
  reset: () => void;
  rewind: (time: number) => void;
  refresh: () => void;
}

export const SimulationContext = createContext<SimulationContextValue | null>(null);
