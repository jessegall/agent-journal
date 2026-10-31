import {isClosed} from "./row.js";

// What the viewer offers to do to a row: each act is the last word of its path, its label, whether it asks for a word first and
// which field it sends that word as (how it ended, unless it names another), or is a removal. Which acts a row offers follows from
// its table and its state.
const act = (name, label, more = {}) => ({name, label, asks: false, field: "how", danger: false, ...more});
const DELETE = act("delete", "Delete", {danger: true});
const UNSTARTED = ["open", "paused", "blocked"];
const RUNNING = ["started", "blocked"];

const ACTS = {
    tasks: (r) => [
        ...(UNSTARTED.includes(r.state) ? [act("start", "Start")] : []),
        ...(isClosed(r) ? [act("reopen", "Reopen")] : [act("finish", "Finish", {asks: true})]),
        DELETE,
    ],
    plans: (r) => [
        ...(r.state === "ready" ? [act("approve", "Approve")] : []),
        ...(["approved", "paused"].includes(r.state) ? [act("start", "Start")] : []),
        ...(RUNNING.includes(r.state) ? [act("pause", "Pause"), act("finish", "Finish")] : []),
        ...(isClosed(r) ? [] : [act("abandon", "Abandon", {danger: true})]),
    ],
    notices: (r) => (isClosed(r) ? [] : [act("close", "Close")]),
    checks: (r) => (r.progress ? [act("stop", "Stop", {danger: true})] : [act("run", "Run now")]),
    shares: (r) => [...(!r.approved && !r.stopped_at ? [act("approve", "Accept")] : []), ...(r.stopped_at ? [] : [act("stop", "Stop sharing", {danger: true})])],
    memories: (r) => (r.removed_at ? [] : [act("weigh", "Weigh", {asks: true, field: "weight"}), act("remove", "Remove", {danger: true})]),
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
    memories: {text: "text", weight: "line"},
    reminders: {text: "text"},
    rules: {text: "text", reason: "text"},
};

export const editsOf = (row) => (isClosed(row) ? {} : EDITS[row.table] || {});

// The fields a new row of the table is written with in the viewer.
const CREATES = {...EDITS, checks: {title: "line", command: "line", brief: "text"}, dumps: {brief: "text"}};

export const createsOf = (table) => CREATES[table] || {};
