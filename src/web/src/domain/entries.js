import {meta} from "./tables.js";
import {seconds} from "./row.js";

// A timeline entry as the viewer reads it: a row made, changed or deleted names its table and id; an agent's hook and a
// line typed to it are the agents' and the nudges' own.
const ROW_CHANGES = ["created", "updated", "deleted"];

export const isRowChange = (entry) => ROW_CHANGES.includes(entry.kind);

export const tableOf = (entry) => (isRowChange(entry) ? entry.data.table : entry.kind === "nudge" ? "nudges" : "agents");

export const atOf = (entry) => seconds(entry.created_at);

export const whoOf = (entry) => (entry.actor || "system").split(":")[0];

// The fields whose change closes a row of a table, so a change of one reads as its closing.
const CLOSES = {tasks: "finished_at", questions: "answer", notices: "closed_at", shares: "stopped_at", secrets: "deleted_at"};

export const closes = (entry) => entry.kind === "updated" && (entry.data.changed || []).includes(CLOSES[entry.data.table]);

export const known = (entry) => !isRowChange(entry) || Boolean(meta(entry.data.table));
