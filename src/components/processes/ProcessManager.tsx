import { useState } from "react";
import { useSimulation } from "../../context/useSimulation";
import { ProcessForm } from "./ProcessForm";
import { ProcessDetails } from "./ProcessDetails";
import { ProcessTree } from "./ProcessTree";

export function ProcessManager() {
  const { state } = useSimulation();
  const [selectedPid, setSelectedPid] = useState<number | null>(state.processes[0]?.pid ?? null);

  const selectedProcess = state.processes.find((p) => p.pid === selectedPid) ?? null;

  return (
    <div className="process-manager-page">
      <div className="manager-grid">
        <div className="manager-col">
          <ProcessForm />
          <ProcessTree
            processes={state.processes}
            selectedPid={selectedPid}
            onSelect={(pid) => setSelectedPid(pid)}
          />
        </div>
        <div className="manager-col">
          <ProcessDetails process={selectedProcess} />
        </div>
      </div>
    </div>
  );
}
