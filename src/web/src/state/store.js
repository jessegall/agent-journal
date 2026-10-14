import {reactive} from "vue";

// What the avatar modules read, kept in the shape they expect: the agents as v3 shaped them, the settings as a tree, nothing dumping.
export const store = reactive({agents: [], online: [], settings: {}, dumping: false, counts: {question: 0, waiting: 0, suggestion: 0}, voice: "butler"});

const STATUS = {Idle: "idle", SessionStarted: "idle", TurnWritten: "idle", SessionEnded: "stopped", Compacting: "compacting"};
const EVENT = {ToolStarting: "PreToolUse", ToolFinished: "PostToolUse"};
const PAUSED = new Set(["waiting", "awaiting", "halted", "at_mark", "loading_skill"]);

// A v4 agent row as the figure modules read an agent: a title, and data with a status, the moment it changed, and the tool in flight
export function shaped(agent) {
    const activity = agent.activity || {};
    const status = agent.state === "ended" ? "stopped" : PAUSED.has(agent.state) ? "waiting" : STATUS[activity.kind] || "working";
    const at = new Date(activity.at || agent.updated_at).getTime() / 1000;
    return {n: agent.id, title: agent.session, data: {status, at, tool: activity.tool || "", event: EVENT[activity.kind] || "", asking: agent.state === "waiting", parent: undefined}};
}

export function fillStore(agents, settings, counts, voice) {
    store.agents = agents.map(shaped);
    store.online = agents.filter((a) => a.state !== "ended").map((a) => ({session: a.session}));
    store.settings = tree(settings);
    store.counts = counts;
    store.voice = voice;
}

function tree(flat) {
    const out = {};
    for (const [key, value] of Object.entries(flat || {})) {
        const parts = key.split(".");
        let at = out;
        for (const part of parts.slice(0, -1)) at = at[part] = at[part] || {};
        at[parts[parts.length - 1]] = value;
    }
    return out;
}
