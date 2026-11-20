export interface ScenarioMapping {
  osTerm: string;
  storyTerm: string;
  explanation: string;
}

export const scenario = {
  name: "Health Center",
  description: "A health center processes patients through registration, consultation, and laboratory services.",
  mappings: [
    { osTerm: "Process", storyTerm: "Patient visit", explanation: "Each patient visit is a task that needs system resources." },
    { osTerm: "CPU", storyTerm: "Available service staff", explanation: "The CPU performs work for one selected process at a time." },
    { osTerm: "Ready Queue", storyTerm: "Patients waiting for service", explanation: "Patients who are ready but not currently being served wait in line." },
    { osTerm: "I/O Waiting", storyTerm: "Waiting for laboratory results", explanation: "A process can pause while waiting for an external operation." },
    { osTerm: "Context Switch", storyTerm: "Staff changes to another patient", explanation: "The CPU changes from one process to another." },
    { osTerm: "Thread", storyTerm: "A task within one patient visit", explanation: "Threads are smaller execution paths belonging to a process." },
    { osTerm: "Kernel", storyTerm: "Health center coordinator", explanation: "The kernel coordinates access to shared system resources." },
  ] satisfies ScenarioMapping[],
};
