import {wordLabel} from "./labels.js";

export {cliOf} from "./modelNames.js";
const HIDDEN = new Set(["id", "version", "metadata", "title", "brief", "body", "abstract", "state"]);
const firstUpper = (words) => words.charAt(0).toUpperCase() + words.slice(1);
const fieldLabel = (name) => firstUpper(name.replace(/_at$/, "").replaceAll("_", " "));

export const titleOf = (noun, row, id) => row?.title || row?.name || `${noun} ${id}`;

// what the panel's head says of a row with no page of its own: its type and number, then its state
export const headingOf = (noun, row, id) => [firstUpper(`${noun} ${id}`), row?.state && firstUpper(row.state)].filter(Boolean).join(" · ");

// an agent by name: the one it was given, otherwise its role and number, such as Worker 412
const agentNameOf =(agent) => agent.given_name || `${wordLabel(agent.role)} ${agent.id}`;

// who made a row, by name: an agent's name, otherwise the name of the actor; "" while the creator is not read
export const creatorNameOf = (actor, agent) => (actor?.type === "agent" && agent ? agentNameOf(agent) : actor?.name ?? "");

// who a row belongs to, by name, for a row an agent owns: the main agent when no agent does; "" for a row no agent owns
export const ownerNameOf = (row, agent) => (!row || !("agent_id" in row) ? "" : row.agent_id === null ? "Main agent" : agent ? agentNameOf(agent) : "");

// the fields of a row with no page of its own, with a label a person reads: everything but what the head and the text already show,
// empty ones, row numbers and an unchanged updated time left out; the names of whom the row belongs to and who made it stand in for their row numbers,
// and the task it is tied to is a link
export const fieldsOf = (row, shownText = "", creator = "", owner = "") => [
    ...(owner ? [{name: "owner", label: "Belongs to", value: owner, isTime: false}] : []),
    ...(creator ? [{name: "creator", label: "Created by", value: creator, isTime: false}] : []),
    ...Object.entries(row ?? {})
        .filter(([name, value]) => !HIDDEN.has(name) && !name.endsWith("_id") && value !== null && value !== "" && typeof value !== "object" && value !== shownText)
        .filter(([name, value]) => name !== "updated_at" || value !== row.created_at)
        .map(([name, value]) => ({name, label: fieldLabel(name), value, isTime: name.endsWith("_at")})),
    ...(row?.task_id ? [{name: "task", label: "Task", value: `Task ${row.task_id}`, isTime: false, link: {table: "tasks", id: row.task_id}}] : []),
];

const STATE_BADGES = {reviewing: "Under review"};

// the badge a docked row shows: the one its dock declares, or the one its state asks for
export const dockBadgeOf = (declared, row) => declared || STATE_BADGES[row?.state] || "";
