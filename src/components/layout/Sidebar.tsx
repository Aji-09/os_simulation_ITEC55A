export function Sidebar({
  activeTab,
  onTabChange,
}: {
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "processes", label: "Processes", icon: "⚙️" },
    { id: "threads", label: "Threads", icon: "🧵" },
    { id: "kernel", label: "Kernel & Logs", icon: "🛡️" },
    { id: "story", label: "Scenario & Story", icon: "🏥" },
  ];

  return (
    <aside className="app-sidebar">
      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => onTabChange(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
