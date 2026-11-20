import { useCallback, useState, useMemo, type ReactNode } from "react";
import { Simulation } from "../engine/Simulation";
import { DEFAULT_PROCESSES, DEFAULT_TIME_QUANTUM } from "../utils/constants";
import { SimulationContext, type SimulationContextValue } from "./simulationContextDefinition";
import type { SimulationSnapshot } from "../types";

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [sim] = useState(() => new Simulation({
    algorithm: "FCFS",
    quantum: DEFAULT_TIME_QUANTUM,
    processes: DEFAULT_PROCESSES,
  }));

  const [state, setState] = useState<SimulationSnapshot>(() => sim.snapshot());

  const refresh = useCallback(() => {
    setState(sim.snapshot());
  }, [sim]);

  const runAction = useCallback((action: () => unknown) => {
    action();
    refresh();
  }, [refresh]);

  const value = useMemo<SimulationContextValue>(() => ({
    state,
    metrics: sim.getMetrics(),
    historyTimes: sim.getHistoryTimes(),
    addProcess: config => runAction(() => sim.createProcess(config)),
    terminateProcess: pid => runAction(() => sim.terminateProcess(pid)),
    createThread: (pid, name) => runAction(() => sim.createThread(pid, name)),
    joinThread: tid => runAction(() => sim.joinThread(tid)),
    requestIO: (pid, duration) => runAction(() => sim.requestIO(pid, duration)),
    yieldCPU: () => runAction(() => sim.yieldCPU()),
    setAlgorithm: (algorithm, quantum) => runAction(() => sim.setAlgorithm(algorithm, quantum)),
    step: () => runAction(() => sim.step()),
    reset: () => runAction(() => sim.reset()),
    rewind: time => runAction(() => sim.rewind(time)),
    refresh,
  }), [state, sim, runAction, refresh]);

  return <SimulationContext.Provider value={value}>{children}</SimulationContext.Provider>;
}
