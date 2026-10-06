import {api} from "../api/client.js";
import {phone} from "../api/phone.js";
import {closeWord, meta, SHARED} from "../domain/spec.js";
import {shiftQuestion} from "../board/moves.js";
import {kindWord} from "./kinds.js";
import {place} from "./outbox.js";
import {todoLane} from "./todo.js";

const HIDDEN = new Set([
    "comments",
    "files",
    "folder",
    "force_delete",
    "index",
    "paths",
    "react",
    "read",
    "restore",
    "section",
    "set",
    "show",
    "stamp",
    "tag",
    "members",
    "revision",
    "revisions",
    "timeline",
    "phases",
    "progress",
    "items",
    "ask",
    "answer",
    "process",
    "declare",
    "file",
    "reply",
    "report",
    "note",
    "item",
    "drop",
    "cut",
    "field",
    "log",
    "review",
    "approve",
    "ready",
    "build",
    "phase",
    "rephrase",
    "stage",
    "tickets",
    "place",
    "gate",
    "touched",
    "configure",
]);
const PRIORITIES = [
    ["critical", "Critical"],
    ["high", "High"],
    ["default", "Normal"],
    ["low", "Low"],
];
const ORDER = [
    "start",
    "complete",
    "finish",
    "unblock",
    "block",
    "comment",
    "priority",
    "assign",
    "unassign",
    "shift",
    "after",
    "share",
    "plan",
    "collect",
    "link",
    "unlink",
    "attach",
    "detach",
    "update",
    "move",
    "reopen",
];
const LAST = ["abandon", "strike", "delete"];
const CLOSES = {
    todo: "Mark done",
    doc: "Mark final",
    report: "Archive",
    message: "Mark as handled",
    fact: "Strike it",
    rule: "Strike it",
    trigger: "Turn it off",
    sequence: "Turn it off",
    work: "End it",
};
const LINK_HINT = "For example: todo:12 or doc:4";

const text = (name, label, more = {}) => ({name, label, required: true, ...more});
const optional = (name, label, more = {}) => ({name, label, required: false, ...more});
const closed = (row) => Boolean(row.completed);
const standing = (row) => !row.completed;
const named = (row) => `${kindWord(row.type)} ${row.n}`;

async function roles() {
    const got = await api.organization();
    const picked = (got.domains || []).flatMap((domain) =>
        (domain.roles || []).map((role) => ({value: `${domain.name}/${role.name}`, label: role.title || role.name, sub: domain.title || domain.name}))
    );
    return picked;
}

async function environments(row) {
    const [project, here] = place.value.split("/");
    const places = await phone.places();
    const mine = places.find((one) => one.project === project) || {environments: []};
    return mine.environments.filter((name) => name !== here).map((name) => ({value: name, label: name}));
}

async function lanes(row) {
    const board = await api.board();
    const card = board.lanes.flatMap((lane) => lane.cards.map((one) => ({...one, lane: lane.key}))).find((one) => one.n === row.n);
    const current = card?.lane || todoLane(row);
    return board.lanes
        .filter((lane) => lane.key === current || (card?.targets || []).includes(lane.key))
        .map((lane) => ({value: lane.key, label: lane.title, check: lane.key === current, card: card || {...row, lane: current}}));
}

async function collections(row) {
    const got = await api.list("collection", {last: 50});
    return got.rows.map((one) => ({value: one.n, label: one.title, check: one.refs.includes(row.ref)}));
}

const stepsText = (row) => row.sections.map((step) => [step.title, step.body].filter(Boolean).join("\n")).join("\n\n");
const stepsOf = (text) =>
    text
        .split(/\n\s*\n/)
        .map((part) => part.trim().split("\n"))
        .filter(([title]) => title)
        .map(([title, ...body]) => ({title: title.trim(), body: body.join("\n").trim()}));
const refsOf = (row) => row.refs.map((ref) => ({value: ref, label: ref}));
const filesOf = (row) => Object.keys(row.data.files || {}).map((name) => ({value: name, label: name}));

const COMMON = {
    complete: {
        label: (row) => CLOSES[row.type] || closeWord(row.type),
        when: standing,
        fields: [optional("how", "How did it end? You can leave this empty.", {placeholder: "Say how it ended", area: true})],
        result: (row) => (row.type === "todo" ? `Marked ${named(row)} done` : `Closed ${named(row)}`),
        undo: (row) => ({word: "reopen", body: {why: "Undone on the phone right after it was closed"}, result: `${named(row)} is open again`}),
    },
    reopen: {
        label: "Reopen",
        when: closed,
        fields: [text("why", "Why reopen it?", {placeholder: "Say what is still missing"})],
        result: (row) => `Reopened ${named(row)}`,
    },
    update: {
        label: "Edit title and details",
        fields: [
            text("title", "Title", {value: (row) => row.title, placeholder: "At most 80 characters"}),
            optional("abstract", "One short line about it", {value: (row) => row.abstract}),
            optional("brief", "Details", {value: (row) => row.brief, area: true}),
        ],
        result: (row) => `Saved ${named(row)}`,
    },
    comment: {
        label: "Comment",
        when: (row) => meta(row.type).takes_comments,
        fields: [text("text", "Your comment", {placeholder: "Write a comment", area: true})],
        result: () => "Comment added",
    },
    link: {label: "Link to another item", fields: [text("ref", "Which item?", {placeholder: LINK_HINT})], result: () => "Linked"},
    unlink: {label: "Remove a link", when: (row) => row.refs.length > 0, pick: refsOf, name: "ref", result: () => "Link removed"},
    move: {
        label: "Move to another environment",
        sub: "It leaves this environment",
        when: standing,
        pick: environments,
        name: "env",
        result: (row, env) => `Moved ${named(row)} to ${env}`,
    },
    attach: {label: "Attach files", upload: true, result: () => "Attached"},
    detach: {label: "Remove a file", when: (row) => filesOf(row).length > 0, pick: filesOf, name: "name", result: () => "File removed"},
    delete: {
        label: "Delete",
        danger: true,
        fields: [optional("why", "Why delete it? You can leave this empty.")],
        button: "Delete",
        result: (row) => `Deleted ${named(row)}`,
        gone: true,
    },
};

const OWN = {
    todo: {
        start: {label: "Start it", when: (row) => standing(row) && todoLane(row) !== "doing", result: (row) => `Started ${named(row)}`},
        block: {
            label: "Block",
            sub: "Stops work on it; you give the reason",
            when: (row) => standing(row) && !row.data.blocked,
            fields: [text("why", "Why is it blocked? A reason is needed.", {placeholder: "For example: waits for the second phone"})],
            result: (row) => `Blocked ${named(row)}`,
        },
        unblock: {label: "Unblock", when: (row) => standing(row) && Boolean(row.data.blocked), result: (row) => `Unblocked ${named(row)}`},
        priority: {
            label: "Change priority",
            when: standing,
            pick: (row) => PRIORITIES.map(([value, label]) => ({value, label, check: (row.priority_name || "default") === value})),
            name: "value",
            result: (row, level) => `Priority of ${named(row)} is ${level.toLowerCase()}`,
        },
        assign: {
            label: "Assign to a role",
            when: standing,
            pick: roles,
            name: "to",
            empty: "No roles yet. Roles come from Organization.",
            result: (row, to) => `Assigned ${named(row)} to ${to}`,
        },
        unassign: {label: "Assign to nobody", when: (row) => standing(row) && Boolean(row.data.assigned), result: (row) => `No one has ${named(row)}`},
        shift: {label: "Move to another lane", pick: lanes, name: "lane", ask: true, result: (row, lane) => `Moved ${named(row)} to ${lane}`},
        after: {
            label: "Wait on another to-do",
            when: standing,
            fields: [text("waits", "Which to-do does it wait on?", {placeholder: "Its number, for example 12"})],
            result: (row) => `${named(row)} waits now`,
        },
        strike: {
            label: "Strike it",
            sub: "Drops it on the record, with your reason",
            danger: true,
            when: standing,
            fields: [text("why", "Why drop it?")],
            result: (row) => `Struck ${named(row)}`,
        },
    },
    plan: {
        start: {label: "Start the plan", when: (row) => row.data.status === "approved", result: (row) => `Started ${named(row)}`},
        park: {label: "Pause the plan", when: standing, result: (row) => `Paused ${named(row)}`},
        continue: {label: "Go on to the next phase", when: (row) => row.data.status === "waiting", result: (row) => `${named(row)} goes on`},
        abandon: {
            label: "Close without finishing",
            danger: true,
            when: standing,
            fields: [optional("why", "Why stop it here?")],
            result: (row) => `Closed ${named(row)}`,
        },
        finish: {label: "Finish the plan", when: standing, result: (row) => `Finished ${named(row)}`},
    },
    doc: {
        draft: {label: "Mark as draft", when: (row) => row.data.status !== "writing", result: (row) => `${named(row)} is a draft again`},
        hide: {label: "Hide from lists", when: (row) => !row.data.hidden, result: () => "Hidden from lists"},
        unhide: {label: "Show in lists", when: (row) => Boolean(row.data.hidden), result: () => "Shown in lists"},
        keep: null,
        supersede: {label: "Replaced by another document", fields: [text("by", "Which document replaces it?", {placeholder: "Its number"})], result: () => "Saved"},
    },
    report: {doc: {label: "Make a document from it", result: () => "Made a document"}, dismiss: {label: "Hide from the chat", when: standing, result: () => "Hidden"}},
    ticket: {move: {label: "Move to another stage", fields: [text("stage", "Which stage?")], result: (row) => `Moved ${named(row)}`}},
    fact: {promote: {label: "Make it a rule", when: standing, result: () => "Made it a rule"}},
    rule: {
        pin: {label: "Pin to the chat", result: () => "Pinned to the chat"},
        inject: {label: "Load at every session start", result: () => "Loads at every start"},
        uninject: {label: "Stop loading at session start", result: () => "No longer loads at start"},
    },
    message: {archive: {label: "Archive", fields: [text("why", "Why archive it?")], result: () => "Archived"}, edit: {label: "Change the words", fields: [text("text", "Your message", {value: (row) => row.brief, area: true})], result: () => "Changed"}},
    question: {dismiss: {label: "Dismiss", when: standing, fields: [optional("why", "Why dismiss it?")], result: () => "Dismissed"}, complete: null},
    suggestion: {complete: null},
    sequence: {
        run: {label: "Run it now", fields: [optional("about", "What is it about?")], result: () => "Started"},
        steps: {
            label: "Edit the steps",
            fields: [text("steps", "The steps: a title line, then what to do; a blank line between steps", {value: stepsText, area: true})],
            shape: ({steps}) => ({steps: JSON.stringify(stepsOf(steps))}),
            result: () => "Steps saved",
        },
    },
    check: {run: {label: "Run it now", result: () => "Running"}},
    tool: {run: {label: "Run it", fields: [optional("args", "With what?")], result: () => "Ran"}},
    profile: {duplicate: {label: "Make a copy", result: () => "Copied"}},
    collection: {
        add: {label: "Add items", fields: [text("refs", "Which items?", {placeholder: LINK_HINT})], result: () => "Added"},
        remove: {label: "Take an item out", when: (row) => row.refs.length > 0, pick: refsOf, name: "ref", result: () => "Taken out"},
    },
    helper: {say: {label: "Send it a message", fields: [text("text", "Your words", {area: true})], result: () => "Sent"}, stop: {label: "Stop it", danger: true, result: () => "Stopped"}},
    plugin: {upgrade: {label: "Check for updates", body: {yes: true}, result: () => "Updated"}, enable: {label: "Turn on", result: () => "Turned on"}, disable: {label: "Turn off", result: () => "Turned off"}, clear_log: {label: "Clear its log", result: () => "Log cleared"}},
};

const EXTRA = [
    {
        key: "collect",
        label: "Add to a collection",
        when: (row) => Boolean(meta("collection")) && row.type !== "collection",
        pick: collections,
        run: (row, n) => api.addToCollection(n, row.ref),
        result: () => "Added to the collection",
    },
    {key: "share", label: "Share", when: (row) => SHARED.includes(row.type), share: true},
    {
        key: "plan",
        label: "Make a plan from it",
        when: (row) => row.type === "doc" && closed(row),
        run: (row) => api.planFromDoc(row.n),
        result: () => "The agent writes the plan",
    },
];

const readable = (word) => word.replaceAll("_", " ").replace(/^./, (first) => first.toUpperCase());

const methodOf = (type, word) => Object.entries(meta(type).command_names).find(([, alias]) => alias === word)?.[0] || word;

function guessed(word, parameters) {
    return {
        label: readable(word),
        confirm: true,
        fields: Object.entries(parameters).map(([name, required]) => ({name, label: readable(name), required})),
    };
}

function described(row, word, parameters) {
    const method = methodOf(row.type, word);
    const own = OWN[row.type] || {};
    if (method in own && !own[method]) return null;
    if (own[method] || own[word]) return own[method] || own[word];
    if (COMMON[method]) return COMMON[method];
    return HIDDEN.has(method) ? null : guessed(word, parameters);
}

const labelOf = (entry, row) => (typeof entry.label === "function" ? entry.label(row) : entry.label);

export function itemActions(row) {
    const kind = row && meta(row.type);
    if (!kind) return [];
    const words = Object.entries(kind.row_actions || {})
        .map(([word, parameters]) => ({word, entry: described(row, word, parameters)}))
        .filter(({entry}) => entry && (!entry.when || entry.when(row)))
        .map(({word, entry}) => ({key: word, word, ...entry, label: labelOf(entry, row)}));
    const extra = EXTRA.filter((entry) => entry.when(row)).map((entry) => ({...entry, label: labelOf(entry, row)}));
    return [...words, ...extra].sort((one, other) => rankOf(one, row) - rankOf(other, row));
}

function rankOf(action, row) {
    const method = action.word ? methodOf(row.type, action.word) : action.key;
    if (LAST.includes(method)) return 1000 + LAST.indexOf(method);
    return ORDER.includes(method) ? ORDER.indexOf(method) : 500;
}

export const valuesOf = (fields, row) => Object.fromEntries(fields.map((field) => [field.name, field.value ? field.value(row) || "" : ""]));

export async function perform(row, action, body = {}) {
    if (action.run) return action.run(row, body.value);
    return api.act(row.type, row.n, action.word, {...(action.body || {}), ...(action.shape ? action.shape(body) : body)});
}

export function resultOf(action, row, value = "") {
    return action.result ? action.result(row, value) : `Done: ${action.label.toLowerCase()} on ${named(row)}`;
}

export const laneQuestion = (choice) => shiftQuestion(choice.card, choice.value);
