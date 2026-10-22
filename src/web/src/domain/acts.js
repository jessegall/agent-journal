import {isClosed} from "./row.js";

// What the viewer offers to do to a row: each act is the last word of its path, its label, and whether it asks how it ended
// or is a removal. Which acts a row offers follows from its table and its state.
const act = (name, label, more = {}) => ({name, label, asks: false, danger: false, ...more});
const DELETE = act("delete", "Delete", {danger: true});
const UNSTARTED = ["open", "parked", "blocked"];
const UNAPPROVED = ["draft", "ready", "reviewing"];
const RUNNING = ["started", "blocked"];

const ACTS = {
    tasks: (r) => [
        ...(UNSTARTED.includes(r.state) ? [act("start", "Start")] : []),
        ...(isClosed(r) ? [act("reopen", "Reopen")] : [act("finish", "Finish", {asks: true})]),
        DELETE,
    ],
    plans: (r) => [
        ...(UNAPPROVED.includes(r.state) ? [act("approve", "Approve")] : []),
        ...(["approved", "parked"].includes(r.state) ? [act("start", "Start")] : []),
        ...(RUNNING.includes(r.state) ? [act("suspend", "Park"), act("finish", "Finish")] : []),
        ...(isClosed(r) ? [] : [act("abandon", "Abandon", {danger: true})]),
    ],
    notices: (r) => (isClosed(r) ? [] : [act("close", "Close")]),
    checks: () => [act("run", "Run now")],
    shares: (r) => [...(!r.approved && !r.stopped_at ? [act("approve", "Accept")] : []), ...(r.stopped_at ? [] : [act("stop", "Stop sharing", {danger: true})])],
    facts: () => [DELETE],
    rules: () => [DELETE],
    reminders: () => [DELETE],
    comments: () => [DELETE],
    secrets: (r) => (r.deleted_at ? [act("restore", "Restore")] : [DELETE]),
};

export const actsOf = (row) => (ACTS[row.table] ? ACTS[row.table](row) : []);

// The fields a row of the table may be edited in, each with how it is written: a line or a block of text.
const EDITS = {
    tasks: {title: "line", brief: "text"},
    plans: {title: "line", brief: "text"},
    docs: {title: "line", abstract: "text", body: "text"},
    reports: {title: "line", abstract: "text", body: "text"},
    collections: {title: "line", abstract: "text"},
    facts: {text: "text"},
    reminders: {text: "text"},
    rules: {text: "text", reason: "text"},
};

export const editsOf = (row) => (isClosed(row) ? {} : EDITS[row.table] || {});

// The fields a new row of the table is written with in the viewer.
const CREATES = {...EDITS, checks: {title: "line", command: "line", brief: "text"}, dumps: {brief: "text"}};

export const createsOf = (table) => CREATES[table] || {};
