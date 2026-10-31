// Each kind of chat mark's own icon (kit/markIcons.js), and for a kind whose marks are of several moves, the icon of the move a card
// stands for: a task completed or started, paused or blocked, a check passed, failed or stopped
const KIND_ICONS = {
    thoughts: "summary",
    faults: "fault",
    visitors: "visitor",
    skills: "skill",
    compactions: "compact",
    rules: "rule",
    memories: "fact",
    reminders: "reminder",
    acknowledgements: "ack",
    task_moves: "task_start",
    task_pauses: "task_pause",
    stuck: "stuck",
    requests: "request",
    filed: "filed",
    questions: "question",
    sequences: "sequence",
    sequence_steps: "step",
    agents: "send",
    subagents: "subagent",
    workers: "worker",
    fitness: "fitness",
    worker_steps: "worker_step",
    worker_tests: "check",
    triggers: "trigger",
    checks: "check",
    commands: "terminal",
    verifiers: "verifier",
    reviewers: "review",
    menus: "menu",
    made: "document",
    commits: "commit",
    worktrees: "worktree",
    pushes: "push",
    branch_switches: "branch",
    plugins: "plugin",
    phones: "phone",
    searches: "search",
    updates: "update",
    suggestions: "bulb",
    conflicts: "conflict",
};

const MOVES = {
    task_moves: (card) => {
        const words = card.label || card.text || "";
        if (/^(created|edited) /i.test(words)) return "filed";
        return /\bcompleted\b|\bdone\b/i.test(words) ? "task_done" : "task_start";
    },
    task_pauses: (card) => (/\bblocked\b/i.test(card.label || card.text || "") ? "task_block" : "task_pause"),
    checks: (card) => ({failed: "check_fail", stopped: "stopped"})[card.ending === "stopped" ? "stopped" : card.outcome] || "check",
    worker_tests: (card) => (card.outcome === "failed" ? "check_fail" : "check"),
};

export const markIcon = (kind, card = {}) => (MOVES[kind] ? MOVES[kind](card) : KIND_ICONS[kind] || "");
