import { useState } from "react";
import { ThemeProvider } from "./context/ThemeContext";
import { SimulationProvider } from "./context/SimulationContext";
import { Header } from "./components/layout/Header";
import { Sidebar } from "./components/layout/Sidebar";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ProcessManager } from "./components/processes/ProcessManager";
import { ThreadsManager } from "./components/threads/ThreadsManager";
import { KernelPanel } from "./components/kernel/KernelPanel";
import { StoryView } from "./components/simulation/StoryView";
import "./App.css";

function MainContent({ activeTab }: { activeTab: string }) {
  switch (activeTab) {
    case "processes":
      return <ProcessManager />;
    case "threads":
      return <ThreadsManager />;
    case "kernel":
      return (
        <div className="page-content">
          <KernelPanel />
        </div>
      );
    case "story":
      return (
        <div className="page-content">
          <StoryView />
        </div>
      );
    case "dashboard":
    default:
      return <Dashboard />;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <ThemeProvider>
      <SimulationProvider>
        <div className="app-container">
          <Header activeTab={activeTab} />
          <div className="app-body">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="main-content">
              <MainContent activeTab={activeTab} />
            </main>
          </div>
        </div>
      </SimulationProvider>
    </ThemeProvider>
  );
}
