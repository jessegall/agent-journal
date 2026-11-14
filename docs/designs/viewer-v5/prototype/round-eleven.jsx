// Round eleven (message 121164): the questions the chat and the Questions window show. A question's time is a clock time, as the chat's are.
// The chat's card is round-fifteen.jsx's QuestionCard; the Questions window is round-sixteen-windows.jsx's.

const Q11_QUESTIONS = [
  {id: 88, at: "14:02", by: "main", plan: 1133, text: "Keep the developer pages in the sidebar, or move them into Settings?", context: "Plan 1133 moves every page onto the shared layouts. Numbers, Request log and System logs are for developers only.", options: ["In the sidebar", "Into Settings"], recommended: "In the sidebar"},
  {id: 87, at: "13:47", by: "worker-4", plan: 1131, text: "May the plan card show the agent's profile beside its name?", context: "Task 9682 trims the agent badges on plan cards.", options: ["Yes, the profile too", "Only the name"], recommended: "Only the name"},
  {id: 86, at: "13:09", by: "main", plan: null, text: "Run the full test suite now, or after plan 1131 is merged?", options: ["Now", "After the merge"], recommended: "After the merge", state: "answered", answer: "After the merge"},
  {id: 85, at: "12:10", by: "helper-851", plan: 1133, text: "Should the splash screen also play when a window regains focus?", options: ["Every focus", "Only the first focus"], recommended: "Only the first focus", state: "answered", answer: "Only the first focus"},
];

Object.assign(window, {Q11_QUESTIONS});
