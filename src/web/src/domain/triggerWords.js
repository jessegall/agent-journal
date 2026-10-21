import {meta} from "./tables.js";
import {rows} from "../sync/rows.js";

// What a trigger does when its words come up: version 4's four actions, in the user's words.
export const DOES = [
    {
        value: "nudge",
        label: "Remind the agent",
        short: "It reminds the agent.",
        hint: "A short note only the agent sees. It carries on with its work.",
        ask: "What to remind the agent of",
        example: "Add the change to src/CHANGELOG.md in plain words.",
    },
    {
        value: "instruct",
        label: "Tell the agent to do something now",
        short: "It tells the agent to do something now.",
        hint: "The agent sees “Do this now:” followed by your text.",
        ask: "What the agent should do",
        example: "Stop and ask me before you touch the database.",
    },
    {
        value: "deny",
        label: "Block a command or file change",
        short: "It blocks the command.",
        hint: "The command or file change is refused, and the agent is given your reason.",
        ask: "Reason the agent is given",
        example: "Never force-push. Ask me first.",
    },
    {
        value: "sequence",
        label: "Start a sequence",
        short: "It starts a sequence.",
        hint: "Starts the sequence you pick below. Nothing is sent.",
        ask: "",
        example: "",
    },
];

export const EXAMPLES = [
    {name: "Block a command", phrases: ["push --force"], action: "deny", text: "Never force-push. Ask me first."},
    {name: "Remind the agent when a word appears", phrases: ["CHANGELOG"], action: "nudge", text: "Add the change to src/CHANGELOG.md in plain words."},
    {name: "Tell the agent to stop and ask", phrases: ["migration"], action: "instruct", text: "Stop and ask me before you touch the database."},
];

export const doesOf = (value) => DOES.find((option) => option.value === value) || DOES[0];

// The sequences a trigger starts: the server names the triggers that start each sequence.
export const startedBy = (id) => rows("sequences").filter((s) => (s.trigger_ids || []).includes(id));

const quoted = (word) => `“${word}”`;

export function wordsText(words) {
    if (!words.length) return "";
    const quotes = words.slice(0, 3).map(quoted);
    const more = words.length - 3;
    if (more > 0) return `${quotes.join(", ")} or ${more} other ${more === 1 ? "phrase" : "phrases"}`;
    return quotes.length > 1 ? `${quotes.slice(0, -1).join(", ")} or ${quotes.at(-1)}` : quotes[0];
}

const DOING = {
    nudge: (text) => `remind the agent ${text}`,
    instruct: (text) => `tell the agent to do this now: ${text}`,
    deny: (text) => `block it and tell the agent ${text}`,
    sequence: (text) => `start the sequence ${text}`,
};

// What a trigger does, as one sentence.
export function sentence(trigger) {
    if (!trigger.phrases.length) return "Add the words to watch for and choose what happens.";
    return `When ${wordsText(trigger.phrases)} comes up, ${DOING[trigger.action](trigger.text ? quoted(trigger.text) : "(no text yet)")}.`;
}

// When a sequence starts by itself: by hand only, when a row of a table is created, or when a trigger matches.
export function startWords(sequence) {
    const trigger = rows("triggers").find((t) => (sequence.trigger_ids || []).includes(t.id));
    if (trigger) return `When the trigger on ${wordsText(trigger.phrases)} matches`;
    if (!sequence.trigger_event) return "Only when you or the agent start it";
    const table = sequence.trigger_event.split(".")[0];
    return `When a ${(meta(table)?.title || table).toLowerCase()} is created`;
}
