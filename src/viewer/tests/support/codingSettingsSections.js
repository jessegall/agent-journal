const AGENT_SETTINGS = "coding.agent-settings";
// the sections the coding suite adds, as suite sections reads them
export const CODING_SECTIONS = [
    {key: "workers", label: "Workers", icon: "work", window: AGENT_SETTINGS, tabs: ["work"], group: "agents", next_section: "reviews", draws_modules: ["journal.suites.coding", "journal.suites.coding.workers", "journal.core.helpers"]},
    {key: "helpers", label: "Helpers", icon: "agents", window: AGENT_SETTINGS, tabs: ["agents", "assign"], group: "agents", next_section: "tools", draws_modules: []},
    {key: "tests", label: "Tests", icon: "todos", window: AGENT_SETTINGS, tabs: ["tests"], group: "agents", next_section: "tools", draws_modules: []},
    {key: "advanced", label: "Advanced", icon: "layout", window: AGENT_SETTINGS, tabs: ["advanced"], group: "agents", next_section: "", draws_modules: []},
];
