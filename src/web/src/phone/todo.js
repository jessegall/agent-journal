import {ago} from "./ago.js";

const IN_HAND = ["doing", "started", "working", "work"];

function state(row) {
    const data = row.data || {};
    if (row.completed) return "Done";
    if (data.blocked) return "Blocked";
    if (data.work || IN_HAND.includes(data.status)) return "In hand";
    if (data.status === "parked") return "Parked";
    return "Open";
}

const waitsOn = (row) => (row.data?.after || []).map((one) => (String(one).includes(":") ? String(one) : `todo:${one}`));

export function todoFacts(row) {
    const data = row.data || {};
    const facts = [{label: "State", value: state(row)}];
    if (typeof data.blocked === "string" && data.blocked && !row.completed) facts.push({label: "Why", value: data.blocked, text: true});
    if (data.priority !== undefined && data.priority !== null && data.priority !== "") facts.push({label: "Priority", value: String(data.priority)});
    if (data.assigned) facts.push({label: "Assigned to", value: data.assigned});
    facts.push({label: "Made", value: ago(row.created)});
    if (row.updated && row.updated !== row.created) facts.push({label: "Updated", value: ago(row.updated)});
    return {facts, after: waitsOn(row)};
}
