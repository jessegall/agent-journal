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

// a word in a command line, in quotes when it holds anything but letters, digits, dashes and dots
const quoted = (text) => (/^[\w.-]+$/.test(text) ? text : `"${text.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`);

// what a `who` asks of `memory list`
const WHO_FLAGS = {[MAIN]: " --main-agent", [OTHERS]: " --other-agents", [EVERYONE]: ""};
const whoFlags = (who) => (isAgent(who) ? ` --agent ${agentIdOf(who)}` : WHO_FLAGS[who]);

// a list leaves removed memories out unless it asks for them
const STATE_FLAGS = {active: " --state active", removed: " --removed --state removed", all: " --removed"};

// the memories of one `who` in the environment: active, removed or both, those holding every word searched, in the order asked
export function memoryLine({who, environment, state = "active", search = "", order = "newest", limit = PAGE_ROWS}) {
    const searchFlag = search.trim() ? ` --search ${quoted(search.trim())}` : "";
    return `memory list${whoFlags(who)} --environment ${quoted(environment)}${STATE_FLAGS[state]}${searchFlag} --order ${order} --limit ${limit}`;
}

// the number of active memories of one `who`, read as a page of one row
export const countLine = (who, environment) => memoryLine({who, environment, limit: 1});

export const ROLES = [
    {key: "all", label: "All", flag: ""},
    {key: "writing", label: "Writing access", flag: " --access writing"},
    {key: "reading", label: "Read-only access", flag: " --access read-only"},
];

// the agents holding memories: those at work or those ended, of one kind, whose name holds every word
export function agentsLine({environment, ended, role = "all", name = "", limit = AGENT_ROWS}) {
    const roleFlag = ROLES.find((choice) => choice.key === role).flag;
    const nameFlag = name.trim() ? ` --name ${quoted(name.trim())}` : "";
    return `memory agents --environment ${quoted(environment)}${roleFlag}${nameFlag} ${ended ? "--ended" : "--working"} --limit ${limit}`;
}

// the agents behind a page of memories, read together by number
export const namesLine = (ids) => `memory agents --agents ${[...new Set(ids)].join(" ")} --limit ${new Set(ids).size}`;
