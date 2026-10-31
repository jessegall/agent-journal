import {meta} from "./tables.js";

// What starts a sequence on its own, each kind with the fields it is written with and a plain sentence for it.
export const TRIGGER_KINDS = [
    {value: "row", label: "A record is made", fields: [{name: "moment", label: "Record and moment", placeholder: "plan.created"}]},
    {value: "phrase", label: "You ask for it", fields: [{name: "text", label: "Words you write", placeholder: "give me an update"}]},
    {value: "command", label: "A command runs", fields: [{name: "pattern", label: "Pattern on the command line", placeholder: "^git push"}]},
    {value: "file", label: "A file is edited", fields: [{name: "pattern", label: "Files, as a path glob", placeholder: "src/**/*.py"}]},
    {
        value: "file-text",
        label: "An edit adds a text",
        fields: [
            {name: "pattern", label: "Files, as a path glob", placeholder: "src/**/*.py"},
            {name: "text", label: "Text in the new content", placeholder: "TODO"},
        ],
    },
    {
        value: "tool",
        label: "A tool is used",
        fields: [
            {name: "tool", label: "Tool name", placeholder: "Edit"},
            {name: "pattern", label: "Pattern on its input, if any", placeholder: "migrations/"},
        ],
    },
];

export const kindOf = (value) => TRIGGER_KINDS.find((kind) => kind.value === value) || TRIGGER_KINDS[0];

export const blankTrigger = (value = "row") => ({trigger_type: value, moment: "", text: "", pattern: "", tool: ""});

const quoted = (text) => `“${text}”`;

function rowWords(moment) {
    const [table, happened] = moment.split(".");
    const title = (meta(table)?.title || table).toLowerCase();
    return happened === "created" ? `a ${title} is made` : `a ${title} reaches ${happened.replaceAll("_", " ")}`;
}

const WORDS = {
    row: (t) => `When ${rowWords(t.moment)}`,
    phrase: (t) => `When you ask ${quoted(t.text)}`,
    command: (t) => `When a command matching ${quoted(t.pattern)} runs`,
    file: (t) => `When a file matching ${quoted(t.pattern)} is edited`,
    "file-text": (t) => `When an edit to ${quoted(t.pattern)} adds ${quoted(t.text)}`,
    tool: (t) => `When ${t.tool} is used${t.pattern ? ` with ${quoted(t.pattern)} in its input` : ""}`,
};

// One trigger as a sentence, and what starts a sequence as a list of them.
export const triggerWords = (trigger) => WORDS[trigger.trigger_type](trigger);

export const startWords = (sequence) => ((sequence.triggers || []).length ? sequence.triggers.map(triggerWords) : ["Only when you or the agent start it"]);

// A trigger as the server takes it: only the fields its kind reads, trimmed.
export function triggerBody(trigger) {
    const named = kindOf(trigger.trigger_type).fields.map((field) => [field.name, (trigger[field.name] || "").trim()]);
    return {trigger_type: trigger.trigger_type, ...Object.fromEntries(named.filter(([, value]) => value))};
}

// The first thing missing from the triggers, in plain words, or nothing.
export function triggersProblem(triggers) {
    for (const trigger of triggers) {
        const required = kindOf(trigger.trigger_type).fields.filter((field) => !(trigger.trigger_type === "tool" && field.name === "pattern"));
        const empty = required.find((field) => !(trigger[field.name] || "").trim());
        if (empty) return `${kindOf(trigger.trigger_type).label}: fill in ${empty.label.toLowerCase()}.`;
    }
    return "";
}
