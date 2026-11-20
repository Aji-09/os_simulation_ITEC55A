import { scenario } from "../../data/scenarios";

export function StoryView() {
  return (
    <div className="card story-view-card">
      <div className="card-header">
        <div>
          <h3>Real-World Analogy: {scenario.name}</h3>
          <p className="subtitle">{scenario.description}</p>
        </div>
      </div>
      <div className="card-body">
        <div className="mapping-grid">
          {scenario.mappings.map((item, idx) => (
            <div key={idx} className="mapping-card">
              <div className="mapping-header">
                <span className="os-badge">{item.osTerm}</span>
                <span className="arrow">↔</span>
                <span className="story-badge">{item.storyTerm}</span>
              </div>
              <p className="mapping-desc">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
