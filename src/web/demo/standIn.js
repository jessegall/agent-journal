import {readState, writeState} from "./storage.js";

const NOTICE = "Not in the demo";
const PAGE = 25;

const asked = (url) => new URL(url, location.origin);
const stripped = ({by, ...row}) => row;
const counts = (rows) => ({all: rows.length, open: rows.filter((r) => !r.completed).length, unread: 0});

export class StandIn {
    constructor(demo) {
        this.demo = demo;
        this.state = readState() || this.fresh();
    }

    fresh() {
        const events = [];
        Object.values(this.demo.rows).forEach((rows) =>
            rows.forEach((row) => events.push({at: row.created, type: row.type, n: row.n, action: "created", actor: row.by}))
        );
        events.sort((a, b) => a.at - b.at).forEach((event, index) => Object.assign(event, {id: index + 1, data: {}, handled: true}));
        return {rows: this.demo.rows, events, settings: this.demo.settings, mode: "hands-on"};
    }

    save() {
        writeState(this.state);
    }

    held(type) {
        return (this.state.rows[type] = this.state.rows[type] || []);
    }

    notice() {
        return {demo: true, notice: NOTICE};
    }

    answer(method, url, body) {
        const where = asked(url);
        const parts = where.pathname.replace(/^\/api\/?/, "").split("/").filter(Boolean);
        const found = method === "GET" ? this.read(parts, where.searchParams) : this.write(parts, body || {});
        return new Response(JSON.stringify(found === undefined ? this.notice() : found), {status: 200});
    }

    top(name) {
        return {
            manifest: this.demo.manifest,
            identity: {project: this.demo.manifest.project, color: "#ffc53d", default_color: "#ffc53d", custom_color: "", root: "", version: "demo", environments: ["main"]},
            pages: [],
            journals: [{port: 0, project: this.demo.manifest.project, version: "demo", root: "", current: true, running: true}],
            summary: this.summary(),
            upstream: {newer: false, installs: false},
            agents: [],
            services: [],
        }[name];
    }

    summary() {
        const project = this.demo.manifest.project;
        const counts = {messages: 0, questions: 0, todos: this.held("todo").filter((r) => !r.completed).length, suggestions: 0, prompts: 0};
        const env = {name: "main", agent: null, work: null, last: null, plans: [], subagents: [], auto: false, silent: false, counts, owner: ""};
        return {project, root: "", version: "demo", start: "main", color: "#ffc53d", environments: [env], helpers: []};
    }

    list(type, query) {
        const since = Number(query.get("since") || 0);
        const before = Number(query.get("before") || 0);
        const only = (query.get("n") || "").split(",").filter(Boolean).map(Number);
        const last = Number(query.get("last") || PAGE);
        let rows = this.held(type).filter((r) => !r.deleted || since);
        if (!query.get("completed")) rows = rows.filter((r) => !r.completed);
        if (since) rows = rows.filter((r) => r.updated > since);
        if (before) rows = rows.filter((r) => r.n < before);
        if (only.length) rows = rows.filter((r) => only.includes(r.n));
        rows = rows.sort((a, b) => a.n - b.n);
        return {rows: rows.slice(-last).map(stripped), more: rows.length > last};
    }

    read(parts, query) {
        const [first, second, third] = parts;
        if (parts.length === 1) return this.top(first);
        if (second === "dashboard") return this.dashboard(query);
        if (second === "events") return this.state.events.filter((e) => e.id > Number(query.get("since") || 0)).slice(-Number(query.get("last") || 100));
        if (second === "settings") return this.state.settings;
        if (second === "mode") return {mode: this.state.mode};
        if (second === "bar") return {queue: []};
        if (second === "family") return {members: [], links: []};
        if (!this.demo.manifest.types[second]) return undefined;
        if (!third) return this.list(second, query);
        const row = this.held(second).find((r) => r.n === Number(third));
        return row && stripped(row);
    }

    dashboard(query) {
        const types = (query.get("types") || "").split(",").filter(Boolean);
        const events = query.get("events");
        const got = {
            rows: Object.fromEntries(types.map((type) => [type, this.list(type, new URLSearchParams({last: query.get("last") || PAGE, completed: "1"}))])),
            counts: Object.fromEntries(types.map((type) => [type, counts(this.held(type))])),
        };
        return events === null ? got : {...got, events: this.state.events.slice(-Number(events)), settings: this.state.settings};
    }

    write(parts, body) {
        const [, second, third, fourth] = parts;
        if (second === "settings") return this.change(() => this.saved(body));
        if (second === "mode") return this.change(() => (this.state.mode = body.mode));
        if (parts.length === 1 || !this.demo.manifest.types[second]) return undefined;
        if (!third) return this.create(second, body);
        if (third === "linked_to") return [];
        const row = this.held(second).find((r) => r.n === Number(third));
        return row && fourth ? this.act(row, fourth, body) : undefined;
    }

    saved(body) {
        const settings = this.state.settings;
        Object.entries(body).forEach(([group, values]) => (settings[group] = {...(settings[group] || {}), ...values}));
        return settings;
    }

    change(make) {
        const got = make();
        this.save();
        return got === undefined ? {} : got;
    }

    record(row, action, actor) {
        const id = this.state.events.length + 1;
        this.state.events.push({id, at: Date.now() / 1000, type: row.type, n: row.n, action, actor, data: {}, handled: true});
    }

    create(type, body) {
        const rows = this.held(type);
        const at = Date.now() / 1000;
        const n = Math.max(0, ...rows.map((r) => r.n)) + 1;
        const row = {n, title: "", abstract: "", brief: "", sections: [], refs: [], seen: ["user"], data: {}, created: at, updated: at, deleted: 0, completed: 0, outcome: "", type, ref: `${type}:${n}`};
        Object.assign(row, ["title", "abstract", "brief"].reduce((made, name) => (body[name] === undefined ? made : {...made, [name]: body[name]}), {}));
        if (!row.title) row.title = String(row.brief).split("\n")[0].slice(0, 80);
        rows.push(row);
        this.record(row, "created", "user");
        return this.change(() => stripped(row));
    }

    act(row, action, body) {
        const at = Date.now() / 1000;
        const done = {
            complete: () => Object.assign(row, {completed: at, outcome: body.outcome || body.how || ""}),
            reopen: () => Object.assign(row, {completed: 0, outcome: ""}),
            delete: () => Object.assign(row, {deleted: at}),
            update: () => Object.assign(row, ...["title", "abstract", "brief"].filter((name) => body[name] !== undefined).map((name) => ({[name]: body[name]}))),
            set: () => Object.assign(row.data, {[body.key]: body.value}),
            read: () => row,
            react: () => row,
        }[action];
        if (!done) return undefined;
        done();
        row.updated = at;
        this.record(row, action === "complete" ? "completed" : action === "read" ? "stamped" : "updated", "user");
        return this.change(() => stripped(row));
    }
}
