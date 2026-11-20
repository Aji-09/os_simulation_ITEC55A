import { useState, useEffect, useRef } from "react";
import { useSimulation } from "../../context/useSimulation";
import type { SchedulingAlgorithm } from "../../types";

export function SimulationControls() {
  const { state, step, reset, setAlgorithm, yieldCPU } = useSimulation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // ms per step
  const timerRef = useRef<number | null>(null);

  const isRunning = isPlaying && !state.isComplete;

  useEffect(() => {
    if (!isRunning) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => {
      step();
    }, speed);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speed, step]);

  const handleAlgorithmChange = (algo: SchedulingAlgorithm) => {
    setAlgorithm(algo, state.quantum);
  };

  const handleQuantumChange = (q: number) => {
    if (q > 0) setAlgorithm("RR", q);
  };

  return (
    <div className="card simulation-controls-card">
      <div className="controls-row">
        <div className="button-group">
          <button
            className="btn btn-primary"
            onClick={() => step()}
            disabled={state.isComplete || isRunning}
          >
            ⏭ Step
          </button>

          <button
            className={`btn ${isRunning ? "btn-warning" : "btn-success"}`}
            onClick={() => setIsPlaying(!isRunning)}
            disabled={state.isComplete}
          >
            {isRunning ? "⏸ Pause" : "▶ Play"}
          </button>

          <button
            className="btn btn-danger"
            onClick={() => {
              setIsPlaying(false);
              reset();
            }}
          >
            🔄 Reset
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => yieldCPU()}
            disabled={state.currentPid === null}
          >
            ✋ Yield CPU
          </button>
        </div>

        <div className="setting-group">
          <label>Algorithm:</label>
          <select
            value={state.algorithm}
            onChange={(e) => handleAlgorithmChange(e.target.value as SchedulingAlgorithm)}
            disabled={isRunning}
          >
            <option value="FCFS">First-Come, First-Served (FCFS)</option>
            <option value="RR">Round Robin (RR)</option>
          </select>

          {state.algorithm === "RR" && (
            <div className="quantum-input">
              <label>Quantum:</label>
              <input
                type="number"
                min="1"
                max="20"
                value={state.quantum}
                onChange={(e) => handleQuantumChange(parseInt(e.target.value, 10) || 1)}
                disabled={isRunning}
              />
            </div>
          )}

          <div className="speed-input">
            <label>Speed:</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
            >
              <option value={2000}>0.5x (Slow)</option>
              <option value={1000}>1x (Normal)</option>
              <option value={500}>2x (Fast)</option>
              <option value={200}>5x (Turbo)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
