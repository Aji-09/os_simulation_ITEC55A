import { useSimulation } from "../../context/useSimulation";
import { useTheme } from "../../context/ThemeContext";

export function Header({ activeTab }: { activeTab: string }) {
  const { state, step } = useSimulation();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-left">
        <div><img src ="/logo.png" height = "50px" width ="50px"></img></div>
        <div className="header-titles">
          <h1>Operating System Simulation</h1>
          <span className="course-code">ITEC55A • Process & Thread Concurrency Simulator</span>
        </div>
      </div>

      <div className="header-center">
        <span className="current-view-badge">View: {activeTab.toUpperCase()}</span>
        <span className="health-scenario-tag">Scenario: Health Center</span>
      </div>

      <div className="header-right">
        <button
          className="theme-toggle-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          aria-label="Toggle theme"
        >
          <span className="theme-icon">{theme === "dark" ? "☀️" : "🌙"}</span>
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        </button>

        <div className={`mode-indicator ${state.mode === "Kernel Mode" ? "kernel" : "user"}`}>
          <span className="indicator-dot"></span>
          <span>{state.mode}</span>
        </div>

        <button
          className="btn-quick-step"
          onClick={() => step()}
          disabled={state.isComplete}
          title="Advance 1 simulation tick"
        >
          Tick (T={state.currentTime}) ⏩
        </button>
      </div>
    </header>
  );
}
