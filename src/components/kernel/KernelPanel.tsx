import { useState } from "react";
import { useSimulation } from "../../context/useSimulation";
import { KernelLog } from "./KernelLog";
import { SystemCallPanel } from "./SystemCallPanel";

export function KernelPanel() {
  const { state } = useSimulation();
  const [activeTab, setActiveTab] = useState<"logs" | "syscalls">("logs");

  return (
    <div className="card kernel-panel-card">
      <div className="card-header">
        <div className="header-tabs">
          <button
            className={`tab-btn ${activeTab === "logs" ? "active" : ""}`}
            onClick={() => setActiveTab("logs")}
          >
            Kernel Event Log ({state.logs.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "syscalls" ? "active" : ""}`}
            onClick={() => setActiveTab("syscalls")}
          >
            System Calls
          </button>
        </div>
        <span className={`badge ${state.mode === "Kernel Mode" ? "badge-danger" : "badge-info"}`}>
          {state.mode}
        </span>
      </div>
      <div className="card-body">
        {activeTab === "logs" ? <KernelLog /> : <SystemCallPanel />}
      </div>
    </div>
  );
}
