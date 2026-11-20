import { SystemOverview } from "./SystemOverview";
import { SimulationControls } from "./SimulationControls";
import { GanttChart } from "./GanttChart";
import { ProcessTable } from "./ProcessTable";
import { SimulationTable } from "./SimulationTable";
import { ReadyQueue } from "./ReadyQueue";
import { Metrics } from "./Metrics";
import { KernelPanel } from "../kernel/KernelPanel";
import { TimeMachine } from "../simulation/TImeMachine";
import { WhyExplainer } from "../simulation/WhyExplainer";

export function Dashboard() {
  return (
    <div className="page-content">
      <SystemOverview />
      <SimulationControls />
      <GanttChart />
      <div className="two-column">
        <ReadyQueue />
        <KernelPanel />
      </div>
      <ProcessTable />
      <SimulationTable />
      <div className="two-column">
        <Metrics />
        <WhyExplainer />
      </div>
      <TimeMachine />
    </div>
  );
}
