import {rows} from "../sync/rows.js";
import {store} from "../state/store.js";
import {eventWords} from "./moments.js";

const USER = "user";
const START = "start";
const TRIGGERED = /^trigger:(\d+)$/;

export const WHERE = [
    {value: USER, label: "You write one of the words", hint: "Only in your own messages to the agent."},
    {value: "text", label: "A word is written", hint: "In your messages, the agent's chat messages or a file the agent writes."},
    {value: "commands", label: "The agent runs a command with a word in it", hint: "Only commands in the agent's terminal."},
    {
        value: "both",
        label: "A word is written or run",
        hint: "In your messages, the agent's chat messages, the files it writes or the commands it runs.",
    },
    {
        value: "everything",
        label: "A word appears anywhere",
        hint: "All of that, plus files the agent opens, what it searches for and web addresses it visits.",
    },
];

export const KEYWORD_WHERE = [
    {value: "text", label: "The agent writes one of the words", hint: "In a chat message or a file."},
    {value: "commands", label: "The agent runs a command with a word in it", hint: "Only commands in the agent's terminal."},
    {value: "both", label: "The agent writes or runs one of the words", hint: "In a chat message, a file or a command."},
    {
        value: "everything",
        label: "One of the words appears anywhere",
        hint: "All of that, plus files the agent opens, what it searches for and web addresses it visits.",
    },
];

export const DOES = [
    {
        value: "message",
        label: "Send a message from you",
        short: "It sends a message from you.",
        hint: "A message from you appears in the chat, and the agent answers it.",
        ask: "The message, as you would write it",
        example: "Please run the full test suite before you push.",
    },
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
        hint: "The command or file change is refused, and the agent is given your reason. A chat message can't be taken back, so the agent is only warned.",
        ask: "Reason the agent is given",
        example: "Never force-push. Ask me first.",
    },
    {
        value: "hold",
        label: "Hold the agent's writes",
        short: "It holds the agent's writes.",
        hint: "The agent cannot write until this stops being true. Helpers and subagents are not held.",
        ask: "What the agent is told while it is held",
        example: "Read your messages before you carry on.",
    },
    {
        value: START,
        label: "Start a sequence",
        short: "It starts a sequence.",
        hint: "Starts the sequence you pick below. Nothing is sent.",
        ask: "",
        example: "",
    },
];

export const WHEN = [
    {value: "words", label: "When a word is written", hint: "A word you choose shows up in a message or a command."},
    {
        value: "state",
        label: "When something in the journal is true",
        hint: "For example, a message of yours has waited too long for an answer.",
    },
];

// The facts a trigger can watch come from the server, in the manifest: {value, label, phrase, unit}.
export const facts = () => store.spec.facts;
// What the number past is counted in is the word after it in the phrase: "more than {over} minutes".
export const unitOf = (fact) => fact.phrase.split("{over}")[1].trim().split(" ")[0];

// What a trigger that has never matched is still waiting for, so the editor names the half that is empty rather than stopping at "never".
export const neverMatched = (values) => {
    if (values.when !== "state") return "Never matched. Nothing the agent wrote or ran has carried these words yet.";
    const gate = ONLY_WHEN.find((one) => one.value === values.only_when);
    if (gate && gate.value !== "any") return `Never matched. It only watches while the agent is ${gate.label.toLowerCase()}.`;
    return "Never matched. What it watches for has not been true yet.";
};

export const ONLY_WHEN = [
    {value: "any", label: "Either"},
    {value: "idle", label: "Idle"},
    {value: "working", label: "Working"},
];

export const REPEATS = [
    {value: 0, label: "Once for each"},
    {value: 5, label: "Every 5 minutes"},
    {value: 15, label: "Every 15 minutes"},
    {value: 60, label: "Every hour"},
];

export const STATE_DOES = ["nudge", "instruct", "hold"];

export const factOf = (value) => facts().find((fact) => fact.value === value) || facts()[0];

export const EXAMPLES = [
    {
        name: "Hold the agent while a message waits",
        title: "Answer waiting messages",
        when: "state",
        fact: "message.unanswered.created",
        over: 5,
        only_when: "any",
        does: "hold",
        text: "Answer message {{n}} before you carry on.",
    },
    {
        name: "Block a command",
        title: "No force push",
        words: ["push --force"],
        words_in: "commands",
        does: "deny",
        text: "Never force-push. Ask me first.",
    },
    {
        name: "Remind the agent when a word appears",
        title: "Mention the changelog",
        words: ["CHANGELOG"],
        words_in: "both",
        does: "nudge",
        text: "Add the change to src/CHANGELOG.md in plain words.",
    },
    {
        name: "Start a sequence when you say something",
        title: "Release checklist",
        words: ["ready to release"],
        words_in: USER,
        does: START,
        text: "",
    },
    {
        name: "Send a message from you",
        title: "Ask for tests",
        words: ["git push"],
        words_in: "commands",
        does: "message",
        text: "Please run the full test suite before you push.",
    },
];

export const doesOf = (value) => DOES.find((option) => option.value === value) || DOES[1];

export const startedBy = (n) => rows("sequence").filter((s) => !s.deleted && s.data.starts_on === `trigger:${n}`);

export const whereReason = (trigger) =>
    trigger.does === "deny" ? {[USER]: "Your messages are never blocked, so a blocking trigger can't watch them."} : {};

export const doesReason = (trigger) =>
    trigger.words_in === USER
        ? {deny: "Your messages are never blocked, so this isn't available while the trigger only watches them."}
        : {};

const quoted = (word) => `“${word}”`;

export function wordsText(words) {
    if (!words.length) return "";
    const quotes = words.slice(0, 3).map(quoted);
    const more = words.length - 3;
    if (more > 0) return `${quotes.join(", ")} or ${more} other ${more === 1 ? "phrase" : "phrases"}`;
    return quotes.length > 1 ? `${quotes.slice(0, -1).join(", ")} or ${quotes.at(-1)}` : quotes[0];
}

const watching = (words, where) =>
    ({
        [USER]: `When you write ${words}`,
        text: `When ${words} appears in what you or the agent write`,
        commands: `When the agent runs a command with ${words}`,
        both: `When ${words} appears in what is written or run`,
        everything: `When ${words} appears anywhere in the agent's work or your messages`,
    })[where] || `When ${words} appears`;

function doing(trigger, sequences) {
    const text = trigger.text ? [{text: quoted(trigger.text)}] : [{text: "no text yet", muted: true}];
    const titles = sequences.flatMap((s, i) => [...(i ? [{text: " and "}] : []), {text: s.title, bold: true}]);
    return {
        message: [{text: "send a message from you, "}, ...text],
        nudge: [{text: "remind the agent "}, ...text],
        instruct: [{text: "tell the agent to do this now: "}, ...text],
        deny: [{text: "block it and tell the agent "}, ...text],
        hold: [{text: "hold the agent's writes until that stops being true, saying "}, ...text],
        start: sequences.length
            ? [{text: "start the sequence "}, ...titles]
            : [{text: "start a sequence. "}, {text: "None is picked yet, so nothing happens", muted: true, stop: true}],
    }[trigger.does];
}

const keyed = (parts) => parts.map((part, i) => ({...part, key: `part-${i}`}));
const EMPTY = "Add the words to watch for and choose what happens, and this sentence will say what the trigger does.";

const GATES = {idle: " while the agent is idle", working: " while the agent is working"};
function stateWatching(trigger) {
    return `When ${factOf(trigger.fact).phrase.replace("{over}", trigger.over)}${GATES[trigger.only_when] || ""}, `;
}

function repeating(trigger) {
    if (!["nudge", "instruct"].includes(trigger.does)) return [];
    if (!trigger.timing) return [{text: " It says so once for each."}];
    return [{text: ` It says so again every ${trigger.timing} minutes, at most ${trigger.most} times for each.`}];
}

export function sentence(trigger, sequences) {
    const state = trigger.when === "state";
    if (!state && !trigger.words.length) return keyed([{text: EMPTY, muted: true}]);
    const opening = state ? stateWatching(trigger) : `${watching(wordsText(trigger.words), trigger.words_in)}, `;
    const parts = [{text: opening}, ...doing(trigger, sequences)];
    const last = parts.at(-1);
    const closed = last.stop || /[.!?]”?$/.test(last.text) ? parts : [...parts, {text: "."}];
    return keyed(state ? [...closed, ...repeating(trigger)] : closed);
}

export const plain = (parts) => parts.map((part) => part.text).join("");

export function startWords(sequence) {
    const start = sequence.data.starts_on;
    if (!start) return "Only when you or the agent start it";
    const [, n] = TRIGGERED.exec(start) || [];
    if (!n) return `When ${eventWords(start)}`;
    const trigger = rows("trigger").find((t) => t.n === Number(n));
    return trigger ? `When the trigger ${trigger.title} matches (${wordsText(trigger.data.words)})` : `When trigger ${n} matches`;
}

export const startsOnTrigger = (sequence) => TRIGGERED.test(sequence.data.starts_on || "");
