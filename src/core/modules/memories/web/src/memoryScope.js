// Whose memories the page shows, and the command lines that read them. A `who` is a text: "main" for the main agent, "others" for every
// agent but the main one, "everyone" for all, or "agent:<number>" for one agent.

export const MAIN = "main";
export const OTHERS = "others";
export const EVERYONE = "everyone";
export const PAGE_ROWS = 20;
export const AGENT_ROWS = 30;

export const agentOf = (id) => `agent:${id}`;
export const isAgent = (who) => who.startsWith("agent:");
export const isGroup = (who) => who === OTHERS || who === EVERYONE;
export const agentIdOf = (who) => Number(who.slice("agent:".length));

export const ROLES = [
    {key: "all", label: "All", flag: ""},
    {key: "writing", label: "Writing agents", flag: " --access writing"},
    {key: "read-only", label: "Read-only agents", flag: " --access read-only"},
];

