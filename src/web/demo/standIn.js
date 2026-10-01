import {readState, writeState} from "./storage.js";

const NOTICE = "Not in the demo";
const RECORDED = "This is a recording: the next message waits in the field";
const PAGE = 25;

const asked = (url) => new URL(url, location.origin);
const lately = (value) => typeof value === "number" && value > 1.6e9 && value < 2.2e9;
const stripped = ({by, ...row}) => row;
const counts = (rows) => ({all: rows.length, open: rows.filter((r) => !r.completed).length, unread: 0});

export class StandIn {
    constructor(demo) {
        this.demo = demo;
        this.state = readState() || this.fresh(0);
    }

    shift() {
        if (!this.state.shift) this.state.shift = Date.now() / 1000 - this.demo.moments[0].at;
        return this.state.shift;
    }

    get moment() {
        return this.demo.moments[this.state.at];
    }

    fresh(at) {
        const {rows, events, settings} = structuredClone(this.demo.moments[at]);
        const sent = this.state ? this.state.sent : {};
        return this.stamped(this.unbranded({at, rows, events, settings, shift: this.state ? this.state.shift : 0, sent}));
    }

    unbranded(state) {
        (state.rows.agent || []).forEach((row) => delete row.data.provider);
        return state;
    }

    stamped(state) {
        (state.rows.message || [])
            .filter((row) => state.sent[row.n])
            .forEach((row) => (row.data = {...row.data, idempotency: state.sent[row.n]}));
        return state;
    }

    step() {
        if (this.state.at + 1 >= this.demo.moments.length) return false;
        this.state = this.fresh(this.state.at + 1);
        this.save();
        return true;
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
        const parts = where.pathname
            .replace(/^\/api\/?/, "")
            .split("/")
            .filter(Boolean);
        const found = method === "GET" ? this.read(parts, where.searchParams) : this.write(parts, body || {});
        return new Response(this.dated(found === undefined ? this.notice() : found), {status: 200});
    }

    dated(found) {
        return JSON.stringify(found, (key, value) => (lately(value) ? value + this.shift() : value));
    }

    top(name) {
        const {manifest, identity, pages, agents} = this.moment;
        return {
            manifest,
            identity,
            pages,
            journals: [{port: 0, project: manifest.project, version: "demo", root: "", current: true, running: true}],
            summary: this.summary(),
            upstream: {newer: false, installs: false},
            agents,
            services: [],
        }[name];
    }

    summary() {
        const {summary} = this.moment;
        const todos = this.held("todo").filter((r) => !r.completed).length;
        return {...summary, environments: summary.environments.map((env) => ({...env, counts: {...env.counts, todos}}))};
    }

    list(type, query) {
        const since = query.get("since") ? Number(query.get("since")) - this.shift() : 0;
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
        if (second === "events")
            return this.state.events.filter((e) => e.id > Number(query.get("since") || 0)).slice(-Number(query.get("last") || 100));
        if (second === "settings") return this.state.settings;
        if (second === "bar") return this.moment.bar;
        if (second === "family") return this.moment.family;
        if (second === "agent" && parts[3] === "edits") return this.edits(third, parts[4], query);
        if (!this.moment.manifest.types[second]) return undefined;
        if (!third) return this.list(second, query);
        const row = this.held(second).find((r) => r.n === Number(third));
        return row && stripped(row);
    }

    edits(agent, which, query) {
        const feed = this.moment[`edits.${agent}`] || {cursor: 0, edits: [], older: false};
        if (which === "older") return {edits: [], older: false};
        if (which === "file") return (this.moment[`edited.${agent}`] || {})[query.get("id")];
        const since = Number(query.get("since") || 0) - this.shift();
        const edits = feed.edits.filter((card) => card.at > since);
        return {cursor: edits.length ? edits.at(-1).at : since, edits, older: false};
    }

    dashboard(query) {
        const types = (query.get("types") || "").split(",").filter(Boolean);
        const events = query.get("events");
        const got = {
            rows: Object.fromEntries(
                types.map((type) => [type, this.list(type, new URLSearchParams({last: query.get("last") || PAGE, completed: "1"}))])
            ),
            counts: Object.fromEntries(types.map((type) => [type, counts(this.held(type))])),
        };
        return events === null ? got : {...got, events: this.state.events.slice(-Number(events)), settings: this.state.settings};
    }

    write(parts, body) {
        const [, second, third, fourth] = parts;
        if (second === "settings") return this.change(() => this.saved(body));
        if (second === "mode") return this.change(() => (this.state.settings.work_modes = {...this.state.settings.work_modes, mode: body.mode}));
        if (parts.length === 1 || !this.moment.manifest.types[second]) return undefined;
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
        if (type === "message" && this.player) return this.sent(body);
        const rows = this.held(type);
        const at = Date.now() / 1000;
        const n = Math.max(0, ...rows.map((r) => r.n)) + 1;
        const row = {
            n,
            title: "",
            abstract: "",
            brief: "",
            sections: [],
            refs: [],
            seen: ["user"],
            data: {},
            created: at,
            updated: at,
            deleted: 0,
            completed: 0,
            outcome: "",
            type,
            ref: `${type}:${n}`,
        };
        Object.assign(
            row,
            ["title", "abstract", "brief"].reduce((made, name) => (body[name] === undefined ? made : {...made, [name]: body[name]}), {})
        );
        if (!row.title) row.title = String(row.brief).split("\n")[0].slice(0, 80);
        rows.push(row);
        this.record(row, "created", "user");
        return this.change(() => stripped(row));
    }

    sent(body) {
        const message = this.player.send();
        if (!message) return {demo: true, notice: RECORDED};
        this.state.sent[message.n] = body.idempotency;
        this.stamped(this.state);
        this.save();
        return stripped(this.held("message").find((row) => row.n === message.n));
    }

    act(row, action, body) {
        const at = Date.now() / 1000;
        const done = {
            complete: () => Object.assign(row, {completed: at, outcome: body.outcome || body.how || ""}),
            reopen: () => Object.assign(row, {completed: 0, outcome: ""}),
            delete: () => Object.assign(row, {deleted: at}),
            update: () =>
                Object.assign(
                    row,
                    ...["title", "abstract", "brief"].filter((name) => body[name] !== undefined).map((name) => ({[name]: body[name]}))
                ),
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
