import {route} from "../route.js";
import {transport} from "./transport.js";

const encoded = (value) => encodeURIComponent(value);

function query(fields) {
    const said = new URLSearchParams(
        Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== false)
    );
    return said.toString() ? `?${said}` : "";
}

export class ApiClient {
    constructor({env = () => route.value.env, base = ""} = {}) {
        this.env = env;
        this.base = base;
    }

    at(base, env = this.env) {
        return new ApiClient({base, env: typeof env === "function" ? env : () => env});
    }

    in(env) {
        return this.at(this.base, env);
    }

    url(path) {
        return `${this.base}/api${path}`;
    }

    get(path) {
        return transport.request("GET", this.url(path));
    }

    post(path, body = {}) {
        return transport.request("POST", this.url(path), body);
    }

    here(path) {
        return `/${this.env()}${path}`;
    }

    manifest() {
        return this.get("/manifest");
    }

    identity() {
        return this.get("/identity");
    }

    saveIdentity(body) {
        return this.post("/identity", body);
    }

    pages() {
        return this.get("/pages");
    }

    journals() {
        return this.get("/journals");
    }

    forgetJournal(root) {
        return this.post("/journals/forget", {root});
    }

    summary() {
        return this.get("/summary");
    }

    upstream() {
        return this.get("/upstream");
    }

    upgrade() {
        return this.post("/upgrade");
    }

    stop() {
        return this.post("/stop");
    }

    extension() {
        return this.get("/extension");
    }

    extensionZip() {
        return `${this.base}/extension.zip`;
    }

    services() {
        return this.get("/services");
    }

    serviceLog(id, lines = 200) {
        return this.get(`/services/${id}/log${query({lines})}`);
    }

    setService(id, want) {
        return this.post(`/services/${id}`, {want});
    }

    pluginUrl(page, at) {
        return page.url.replace(page.path, "").replace("127.0.0.1", location.hostname) + at;
    }

    pluginLog(name, lines = 200) {
        return this.get(`/plugins/${name}/log${query({lines})}`);
    }

    onlineAgents() {
        return this.get("/agents");
    }

    agentControls(provider, model = "", effort = "") {
        return this.get(`/agent-controls/${encoded(provider)}${query({model: model || undefined, effort: effort || undefined})}`);
    }

    agentHooks(provider) {
        return this.get(`/agent-hooks/${provider}`);
    }

    saveAgentHooks(provider, hooks) {
        return this.post(`/agent-hooks/${provider}`, {hooks});
    }

    list(type, {last, completed = false, before = 0, since = 0} = {}) {
        return this.get(
            this.here(
                `/${type}${query({last, completed: completed ? "1" : undefined, before: before || undefined, since: since || undefined})}`
            )
        );
    }

    all(type) {
        return this.list(type, {completed: true}).then((got) => got.rows);
    }

    dashboard(types, {last, events = null} = {}) {
        return this.get(this.here(`/dashboard${query({types: types.join(","), completed: "1", last, events})}`));
    }

    show(type, n) {
        return this.get(this.here(`/${type}/${n}`));
    }

    create(type, body) {
        return this.post(this.here(`/${type}`), body);
    }

    act(type, n, action, body = {}) {
        return this.post(this.here(`/${type}/${n}/${action}`), body);
    }

    command(type, action, body = {}) {
        return this.post(this.here(`/${type}/${action}`), body);
    }

    readAll(type, numbers) {
        return this.post(this.here(`/${type}/read-all`), {numbers});
    }

    upload(type, n, file) {
        const body = new FormData();
        body.append("file", file, file.name);
        return this.post(this.here(`/${type}/${n}/upload`), body);
    }

    fileUrl(type, n, name) {
        return this.url(this.here(`/${type}/${n}/files/${encoded(name)}`));
    }

    events(since = 0) {
        return this.get(this.here(`/events${query({since})}`));
    }

    recentEvents(last) {
        return this.get(this.here(`/events${query({since: 0, last})}`));
    }

    settings() {
        return this.get(this.here("/settings"));
    }

    saveSettings(body) {
        return this.post(this.here("/settings"), body);
    }

    search(q) {
        return this.get(this.here(`/search${query({q})}`));
    }

    files() {
        return this.get(this.here("/files"));
    }

    changes() {
        return this.get(this.here("/changes"));
    }

    commit(sha) {
        return this.get(this.here(`/commit/${sha}`));
    }

    projectFile(path) {
        return this.get(this.here(`/file${query({path})}`));
    }

    projectFiles() {
        return this.get(this.here("/project-files"));
    }

    bar() {
        return this.get(this.here("/bar"));
    }

    agents(last) {
        return this.list("agent", {completed: true, last}).then((got) => got.rows);
    }

    appoint(session) {
        return this.post(this.here("/appoint"), {session});
    }

    controlAgent(session, action, value) {
        return this.post(this.here(`/agent/${encoded(session)}/control`), {action, value});
    }

    forceAgent(session) {
        return this.post(this.here(`/agent/${encoded(session)}/force`));
    }

    permitAgent(session, allow) {
        return this.post(this.here(`/agent/${encoded(session)}/permit`), {allow});
    }

    relaunchAgent(session, skip) {
        return this.post(this.here(`/agent/${encoded(session)}/relaunch`), {skip});
    }

    transcript(agent, session, fields) {
        return this.get(this.here(`/agent/${agent}${session ? `/subagent/${session}` : ""}/transcript${query(fields)}`));
    }

    stream() {
        return new EventSource(this.url(this.here("/stream")));
    }

    page(env, page = "") {
        return `${this.base}/#/${env}${page ? `/${page}` : ""}`;
    }

    origin() {
        return this.base || location.origin;
    }

    journal(j) {
        return this.at(j.current ? "" : `http://127.0.0.1:${j.port}`);
    }

    skills(agent = 0) {
        return this.get(this.here(`/skills${query({agent})}`));
    }

    skill(name) {
        return this.get(this.here(`/skills/${name}`));
    }

    loadSkill(name) {
        return this.post(this.here(`/skills/${name}/load`));
    }

    alwaysSkill(name, on) {
        return this.post(this.here(`/skills/${name}/always`), {on});
    }

    report(body) {
        return this.post(this.here("/console"), body);
    }
}

export const api = new ApiClient();
export const onWrite = (fn) =>
    transport.onWrite((url) => {
        const where = new URL(url, location.origin);
        if (where.origin === location.origin) fn(where.pathname.split("/")[3]);
    });
