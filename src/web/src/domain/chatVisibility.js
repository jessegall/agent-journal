import {store} from "../state/store.js";

export const VISIBILITY_GROUPS = [
    {
        title: "Agent",
        kinds: [
            {key: "thoughts", label: "Thoughts", icon: "bulb"},
            {key: "skills", label: "Skills the agent loads", icon: "book"},
            {key: "subagents", label: "Subagents", icon: "agents"},
            {key: "compactions", label: "Conversation compacted", icon: "gauge"},
            {key: "made", label: "Documents the agent made", icon: "docs"},
            {key: "acknowledgements", label: "Replies that only say a reminder was seen", icon: "check"},
        ],
    },
    {
        title: "Reminders",
        kinds: [
            {key: "rules", label: "Rules", icon: "rules"},
            {key: "facts", label: "Facts", icon: "pins"},
            {key: "reminders", label: "Reminders", icon: "reminders"},
        ],
    },
    {
        title: "Other",
        kinds: [
            {key: "commands", label: "Long commands and outputs", icon: "terminal"},
            {key: "commits", label: "Commits", icon: "branch"},
            {key: "sequences", label: "Sequences", icon: "list"},
            {key: "triggers", label: "Triggers", icon: "bolt"},
            {key: "plugins", label: "Plugin notes", icon: "plug"},
            {key: "visitors", label: "Visitor comments", icon: "chat"},
            {key: "filed", label: "Filed from your messages", icon: "inbox"},
            {key: "notes", label: "Notices", icon: "bell"},
        ],
    },
];

const chatKinds = () => store.spec.chat_kinds;
export const HIDDEN_KEY = "chat_hidden";
export const DEFAULT_HIDDEN = ["acknowledgements"];

const KINDS = {
    message: (t) => (t.data.acknowledgement ? "acknowledgements" : ""),
    thought: () => "thoughts",
    skill: () => "skills",
    subagent: () => "subagents",
    compacted: () => "compactions",
    made: () => "made",
    receipt: () => "filed",
    whisper: (t) => chatKinds().recalled[(t.data.row || "").split(":")[0]] || "rules",
    card: (t) => (t.data.visitor ? "visitors" : t.data.name && t.data.side !== "user" ? "plugins" : chatKinds().marked[t.data.icon] || "notes"),
};

export const kindOf = (turn) => (KINDS[turn.type] ? KINDS[turn.type](turn) : "");

export const visibleIn = (hidden) => (turn) => !hidden.includes(kindOf(turn));

export const visibilityChoices = (hidden) =>
    VISIBILITY_GROUPS.map((group) => ({...group, kinds: group.kinds.map((kind) => ({...kind, on: !hidden.includes(kind.key)}))}));

export const toggled = (hidden, key) => (hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]);
