import {PLAN_STATES} from "../domain/plans.js";
import {ago} from "../format/time.js";

const IN_HAND = ["doing", "started", "working", "work"];

function state(row) {
    const data = row.data || {};
    if (row.completed) return "Done";
    if (data.blocked) return "Blocked";
    if (data.work || IN_HAND.includes(data.status)) return "In hand";
    if (data.status === "parked") return "Paused";
    return "Open";
}

const waitsOn = (row) => (row.data?.after || []).map((one) => (String(one).includes(":") ? String(one) : `todo:${one}`));

const PRIORITY = {default: "Normal"};

const named = (level) => (level ? level[0].toUpperCase() + level.slice(1) : "");

function todoFacts(row) {
    const data = row.data || {};
    const facts = [{label: "State", value: state(row)}];
    if (typeof data.blocked === "string" && data.blocked && !row.completed) facts.push({label: "Why", value: data.blocked, text: true});
    facts.push({label: "Priority", value: PRIORITY[row.priority_name] || named(row.priority_name) || String(data.priority ?? "Normal")});
    facts.push({label: "Assigned to", value: data.assigned || "Nobody"});
    facts.push({label: "Made", value: ago(row.created)});
    if (row.updated && row.updated !== row.created) facts.push({label: "Updated", value: ago(row.updated)});
    return {facts, after: waitsOn(row)};
}

const LANES = {Done: "done", Blocked: "held", Paused: "held", "In hand": "doing"};

export const todoLane = (row) => LANES[state(row)] || "todo";

const stateOf = (row) => (row.completed ? "Closed" : (row.type === "plan" && PLAN_STATES[row.data.status]) || "Open");

export function itemFacts(row) {
    if (row.type === "todo") return todoFacts(row);
    const facts = [{label: "State", value: stateOf(row)}, {label: "Made", value: ago(row.created)}];
    if (row.updated && row.updated !== row.created) facts.push({label: "Changed", value: ago(row.updated)});
    if (row.completed) facts.push({label: "Closed", value: ago(row.completed)});
    return {facts, after: []};
}
