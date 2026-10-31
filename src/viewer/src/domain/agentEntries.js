import {ago} from "../format/time.js";
import {seconds} from "./row.js";
import {judgedLine, verifierName, verifierWord} from "./verifiers.js";
import {WORKER_WORDS, stateAt, workerEnding, workerName, workerQueueLine, workerState} from "./workers.js";

// What each kind of sent agent shows in the one agent dropdown: its name, its state in words, a tone, when it was last active and what it worked on or judged
const REVIEWER_WORDS = {reviewing: "Reviewing", reviewed: "Idle", "ended without a review": "Ended without a review", retired: "Retired"};
const REVIEWER_TONES = {reviewing: "active", reviewed: "idle", retired: "ended"};
const VERIFIER_TONES = {verifying: "active", judged: "idle"};

const active = (at) => (at ? `Active ${ago(at) || "just now"}` : "");
const activeAt = (row) => seconds(row.updated_at) || seconds(row.created_at);

export const workerEntry = (row) => {
    const state = workerState(row);
    return {id: row.id, name: workerName(row), state: state === "finished" ? workerEnding(row) : WORKER_WORDS[state], tone: state === "running" ? "active" : state === "finished" ? "ended" : "idle", active: active(stateAt(row)), work: [workerQueueLine(row), row.brief].filter(Boolean).join(" · ")};
};

export const verifierEntry = (row) => ({id: row.id, name: verifierName(row), state: verifierWord(row), tone: VERIFIER_TONES[row.state] || "ended", active: active(activeAt(row)), work: judgedLine(row)});

export const reviewerEntry = (row) => ({id: row.id, name: row.name || `Reviewer ${row.id}`, state: REVIEWER_WORDS[row.state] || row.state, tone: REVIEWER_TONES[row.state] || "ended", active: active(activeAt(row)), work: row.brief || ""});

// a noteworthy moment of a worker, from the mark written for it: what happened, in the mark's words, and when; it opens the worker its mark names
export const momentEntry = (message) => ({key: `moment-${message.id}`, id: Number(String(message.data.row || "").split(":")[1]) || 0, name: message.text, state: message.data.detail || message.data.summary || "", tone: "idle", active: ago(seconds(message.created_at)) || ""});

// newest first, so the agent sent last is on top
export const newestFirst = (entries) => [...entries].sort((a, b) => b.id - a.id);
