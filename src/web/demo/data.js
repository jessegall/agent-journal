import {PRESETS, arranged, fresh} from "../src/domain/panes.js";
import manifest from "./manifest.json";
import recorded from "./moments.json";
import {expand} from "./moments.js";
import rows from "./rows.json";
import settings from "./settings.json";

const OPENING = "jesse";
const COLOR = "#ffc53d";

function eventsOf() {
    const events = [];
    Object.values(rows).forEach((held) => held.forEach((row) => events.push({at: row.created, type: row.type, n: row.n, action: "created", actor: row.by})));
    events.sort((a, b) => a.at - b.at).forEach((event, index) => Object.assign(event, {id: index + 1, data: {}, handled: true}));
    return events;
}

function summarized() {
    const counts = {messages: 0, questions: 0, todos: rows.todo.filter((r) => !r.completed).length, suggestions: 0, prompts: 0};
    const env = {name: "main", agent: null, work: null, last: null, plans: [], subagents: [], auto: false, silent: false, counts, owner: ""};
    return {project: manifest.project, root: "", version: "demo", start: "main", color: COLOR, environments: [env], helpers: []};
}

function staticMoment() {
    const identity = {project: manifest.project, color: COLOR, default_color: COLOR, custom_color: "", root: "", version: "demo", environments: ["main"]};
    return {at: 0, manifest, identity, pages: [], summary: summarized(), agents: [], settings, mode: {mode: "hands-on"}, bar: {queue: []}, family: {members: [], links: []}, events: eventsOf(), rows};
}

export async function loadDemo() {
    const preset = PRESETS.find((p) => p.key === OPENING);
    const layout = arranged(fresh(), preset.shape).layout;
    const moments = recorded.moments.length ? expand(recorded) : [staticMoment()];
    return {moments: moments.map((moment) => ({...moment, settings: {...moment.settings, viewer: {...moment.settings.viewer, layout}}}))};
}
