export const SHOWN_GROUPS = [
    {
        title: "The agent at work",
        kinds: [
            {key: "thoughts", label: "Thoughts", icon: "bulb"},
            {key: "skills", label: "Skills it loads", icon: "book"},
            {key: "subagents", label: "Subagents", icon: "agents"},
            {key: "compactions", label: "Context compacted", icon: "gauge"},
            {key: "made", label: "Documents it made", icon: "docs"},
        ],
    },
    {
        title: "Recalled for the agent",
        kinds: [
            {key: "rules", label: "Rules", icon: "rules"},
            {key: "facts", label: "Facts", icon: "pins"},
            {key: "reminders", label: "Reminders", icon: "reminders"},
        ],
    },
    {
        title: "Marks",
        kinds: [
            {key: "commands", label: "Long commands and outputs", icon: "terminal"},
            {key: "commits", label: "Commits", icon: "branch"},
            {key: "sequences", label: "Sequences", icon: "list"},
            {key: "triggers", label: "Triggers", icon: "bolt"},
            {key: "plugins", label: "Plugin notes", icon: "plug"},
            {key: "visitors", label: "Visitor comments", icon: "chat"},
            {key: "filed", label: "Filed from your messages", icon: "inbox"},
            {key: "notes", label: "Other journal notes", icon: "bell"},
        ],
    },
];

const RECALLED = {rule: "rules", fact: "facts", reminder: "reminders"};
const MARKED = {terminal: "commands", branch: "commits", list: "sequences", bolt: "triggers"};
const KINDS = {
    thought: () => "thoughts",
    skill: () => "skills",
    subagent: () => "subagents",
    compacted: () => "compactions",
    made: () => "made",
    receipt: () => "filed",
    whisper: (t) => RECALLED[(t.data.row || "").split(":")[0]] || "rules",
    card: (t) => (t.data.visitor ? "visitors" : t.data.name ? "plugins" : MARKED[t.data.icon] || "notes"),
};

export const kindOf = (turn) => (KINDS[turn.type] ? KINDS[turn.type](turn) : "");

export const shownIn = (hidden) => (turn) => !hidden.includes(kindOf(turn));

export const shownChoices = (hidden) =>
    SHOWN_GROUPS.map((group) => ({...group, kinds: group.kinds.map((kind) => ({...kind, on: !hidden.includes(kind.key)}))}));

export const toggled = (hidden, key) => (hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]);
