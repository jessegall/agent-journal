// the sections of the Settings page in the design's groups and order, each with its icon, and what draws it: the declared settings of some modules, one of the page's own bodies,
// or another window (the agent settings are drawn by their window, a tab or two for each section). A declared module no section names goes under Advanced.
export const GROUPS = [
    {key: "viewer", title: "Viewer", sections: ["look", "sidebar"]},
    {key: "agents", title: "Agents", sections: ["workers", "reviews", "helpers", "tests", "tools", "commands", "hooks", "advanced"]},
    {key: "connections", title: "Connections", sections: ["tunnel", "tunler", "phones"]},
    {key: "project", title: "Project", sections: ["environments", "developer"]},
];

const AGENT_WINDOW = "coding.agent-settings";
export const SECTIONS = {
    look: {label: "Look", icon: "style", modules: ["journal.core.viewer", "journal.core.voices", "journal.core.chat", "journal.core.messages", "journal.core.overview"]},
    sidebar: {label: "Sidebar", icon: "sidepanel", modules: ["journal.core.docking"]},
    workers: {label: "Workers", icon: "work", window: AGENT_WINDOW, tabs: ["work"]},
    reviews: {label: "Reviews", icon: "eye", modules: ["journal.core.reviews", "journal.core.plan_reviews"]},
    helpers: {label: "Helpers", icon: "agents", window: AGENT_WINDOW, tabs: ["agents", "assign"]},
    tests: {label: "Tests", icon: "todos", window: AGENT_WINDOW, tabs: ["tests"]},
    tools: {label: "Program tools", icon: "tools", modules: ["journal.core.claude_code", "journal.core.codex"]},
    commands: {label: "Command classification", icon: "terminal", body: "commands"},
    hooks: {label: "Hooks", icon: "hook", window: "settings.project-hooks"},
    advanced: {label: "Advanced", icon: "layout", window: AGENT_WINDOW, tabs: ["advanced"]},
    tunnel: {label: "Tunnel", icon: "broadcast", modules: ["journal.core.tunnel"]},
    tunler: {label: "Tunler", icon: "plug", modules: ["journal.tunnels.tunler"]},
    phones: {label: "Phones", icon: "phone", modules: ["journal.core.phone"]},
    environments: {label: "Environments", icon: "folder", body: "environments"},
    developer: {label: "Developer", icon: "code", modules: ["journal.core.developer"]},
};

// the modules the agent settings window draws itself, so no section lists them again
export const DRAWN_ELSEWHERE = ["journal.suites.coding", "journal.suites.coding.workers", "journal.core.helpers"];


// the section a module's declared settings are in
export function sectionOf(module) {
    if (DRAWN_ELSEWHERE.includes(module)) return null;
    return Object.entries(SECTIONS).find(([, section]) => section.modules?.includes(module))?.[0] ?? "advanced";
}

