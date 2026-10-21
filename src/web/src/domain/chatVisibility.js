export const VISIBILITY_GROUPS = [
    {
        title: "Agent",
        kinds: [
            {key: "thoughts", label: "Thoughts", icon: "bulb"},
            {key: "skills", label: "Skills the agent loads", icon: "book"},
            {key: "subagents", label: "Subagents", icon: "agents"},
            {key: "compactions", label: "Conversation compacted", icon: "gauge"},
            {key: "made", label: "Documents the agent made", icon: "docs"},
            {key: "searches", label: "Searches the agent ran", icon: "search"},
            {key: "stuck", label: "Agent stuck", icon: "warn"},
            {key: "acknowledgements", label: "Acknowledged reminders", icon: "check"},
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
        title: "Work",
        kinds: [
            {key: "commands", label: "Long commands and outputs", icon: "terminal"},
            {key: "commits", label: "Commits", icon: "branch"},
            {key: "worktrees", label: "Worktrees", icon: "branch"},
            {key: "checks", label: "Checks passing and failing", icon: "check"},
            {key: "questions", label: "Questions asked and answered", icon: "questions"},
            {key: "filed", label: "Filed from your messages", icon: "inbox"},
        ],
    },
    {
        title: "The journal",
        kinds: [
            {key: "sequences", label: "Sequences starting and finishing", icon: "list"},
            {key: "sequence_steps", label: "Every step of a sequence", icon: "list"},
            {key: "triggers", label: "Triggers", icon: "bolt"},
            {key: "menus", label: "Menus the journal answered", icon: "bolt"},
            {key: "suggestions", label: "Suggestions", icon: "bulb"},
            {key: "plugins", label: "Plugin notes", icon: "plug"},
            {key: "phones", label: "Phones paired", icon: "phone"},
            {key: "faults", label: "The journal's own faults", icon: "warn"},
            {key: "visitors", label: "Visitor comments", icon: "chat"},
        ],
    },
];

// Which choice above shows or hides each kind of turn the chat draws.
const TURN_KINDS = {thought: "thoughts", receipt: "filed", visitor: "visitors"};
export const HIDDEN_KEY = "chat_hidden";
export const DEFAULT_HIDDEN = ["acknowledgements", "sequence_steps"];

export const turnKind = (kind) => TURN_KINDS[kind];

export const kindOf = (turn) => {
    if (turn.kind === "message") return turn.acknowledgement ? "acknowledgements" : "";
    return turn.data?.shows || turnKind(turn.kind) || "";
};

export const visibleIn = (hidden) => (turn) => !hidden.includes(kindOf(turn));

export const visibilityChoices = (hidden) =>
    VISIBILITY_GROUPS.map((group) => ({...group, kinds: group.kinds.map((kind) => ({...kind, on: !hidden.includes(kind.key)}))}));

export const toggled = (hidden, key) => (hidden.includes(key) ? hidden.filter((k) => k !== key) : [...hidden, key]);
