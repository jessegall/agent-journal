export const YES = "Yes, I want this";
export const NO = "No, don't do this";
export const NO_CAP = "The agent won't suggest it again";
export const CLOSE_NOTE = "Close it and it won't open again. The suggestion stays in the chat.";
export const NETWORK_TIP = "Check your network, then try again.";
export const FROM_JOURNAL = "The journal suggests plugins that fit the languages your project is written in.";

const WAITING = {running: "installing", failed: "failed"};
const DECIDED = {accept: "accepted", adjust: "adjusted", decline: "declined", install: "installed"};
const OPEN = ["fresh", "failed"];

export const phaseOf = (s) => (s.completed ? DECIDED[s.data.decision] || "declined" : WAITING[s.data.install?.state] || "fresh");

export const isOpen = (phase) => OPEN.includes(phase);

export const pluginName = (s) => s.data.name || s.data.plugin || "";

export const fromWhom = (s) => (s.data.plugin ? "from the journal" : "from the agent");

export const failure = (s) => s.data.install?.why || "";

export const networkTip = (s) => (s.data.install?.network ? NETWORK_TIP : "");

export const pinned = (s) => (s.data.commit || "").slice(0, 12);

export function outcomeOf(s, phase, reason) {
    const name = pluginName(s);
    const todo = s.data.todo || 0;
    const outcomes = {
        installing: {tone: "busy", icon: "", text: `Installing ${name}.`, sub: "It can't be stopped halfway. You can leave this page."},
        installed: {tone: "good", icon: "todos", text: `You said yes. ${name} is installed.`, link: s.data.installed || ""},
        failed: {tone: "bad", icon: "warn", text: `Install failed. ${reason} Nothing was kept.`, sub: networkTip(s)},
        accepted: {tone: "good", icon: "todos", text: "You said yes.", todo, after: "", sub: "The agent picks it up like any other to-do."},
        adjusted: {
            tone: "mine",
            icon: "pencil",
            text: "You changed it.",
            todo,
            after: ` with your words${s.data.plugin ? "; the plugin was not installed" : ""}.`,
            quote: s.outcome,
        },
        declined: {tone: "", icon: "close", text: `You said no. ${NO_CAP}.`},
    };
    return outcomes[phase] || null;
}

export const hoursText = (hours) => `${hours} ${hours === 1 ? "hour" : "hours"}`;

export function dueNow(suggestions, hours, now) {
    if (!(hours > 0)) return null;
    const due = suggestions.filter((s) => !s.deleted && !s.completed && !s.data.window_seen && s.created + hours * 3600 <= now);
    return due.sort((a, b) => a.created - b.created)[0] || null;
}

export function choicesFor(s, phase) {
    if (phase === "failed")
        return [
            {act: "yes", primary: true, label: "Try again", caption: "Installs it now"},
            {act: "no", label: NO, caption: `Ends this suggestion for good. ${NO_CAP}`},
        ];
    return [
        {act: "yes", primary: true, label: YES, caption: s.data.plugin ? "Installs it now" : "Adds it as a to-do"},
        {act: "change", label: "Change it first", caption: "Write your version as a to-do"},
        {act: "no", label: NO, caption: NO_CAP},
    ];
}

export function spokenFor(s, phase) {
    const name = pluginName(s);
    const words = {
        installing: `Installing ${name}`,
        installed: `${name} is installed`,
        failed: "Install failed",
        accepted: `You said yes to suggestion ${s.n}`,
        adjusted: `You changed suggestion ${s.n}`,
        declined: `You said no to suggestion ${s.n}`,
    };
    return words[phase] || "";
}
