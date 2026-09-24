import {route} from "../route.js";
import {LONG_WAIT_MS, transport} from "./transport.js";

const encoded = (value) => encodeURIComponent(value);

function query(fields) {
    const query = new URLSearchParams(
        Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== false)
    );
    return query.toString() ? `?${query}` : "";
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

    post(path, body = {}, wait = 0) {
        return transport.request("POST", this.url(path), body, wait);
    }

    here(path) {
        return `/${this.env()}${path}`;
    }

    changelog() {
        return this.get("/changelog");
    }

    checkForUpdate() {
        return this.post("/update/check", {});
    }

    update() {
        return this.post("/update", {});
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

    pluginDashboard(n, name) {
        return this.get(this.here(`/plugin/${n}/dashboard/${encodeURIComponent(name)}`));
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

    list(type, {last, completed = false, before = 0, since = 0, only = [], by = ""} = {}) {
        return this.get(
            this.here(
                `/${type}${query({last, completed: completed ? "1" : undefined, before: before || undefined, since: since || undefined, n: only.join(",") || undefined, by: by || undefined})}`
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

    installPlugin(source) {
        return this.post(this.here("/plugin/install"), {source, yes: true}, LONG_WAIT_MS);
    }

    upgradePlugin(n, again) {
        return this.post(this.here(`/plugin/${n}/upgrade`), {yes: true, again}, LONG_WAIT_MS);
    }

    planTimeline(n) {
        return this.command("plan", "timeline", {n});
    }

    hidePreview(type, n) {
        return this.act(type, n, "set", {key: "hide_preview", value: "true"});
    }

    revision(n, number) {
        return this.act("doc", n, "revision", {number});
    }

    command(type, action, body = {}) {
        return this.post(this.here(`/${type}/${action}`), body);
    }

    tasks(agent) {
        return this.command("todo", "tasks", {agent});
    }

    board({plan, agent} = {}) {
        return this.command("todo", "board", {plan: plan || 0, agent: agent || ""});
    }

    shift(n, lane, {why, how} = {}) {
        return this.act("todo", n, "shift", {lane, why: why || "", how: how || ""});
    }

    cancelWork(board) {
        return this.act("board", board, "cancel");
    }

    reviseWork(board, text, idempotency) {
        return this.act("board", board, "revise", {text, idempotency});
    }

    followUpWork(board, text, idempotency) {
        return this.act("board", board, "follow_up", {text, idempotency});
    }

    requestWork(board, text, idempotency) {
        return this.act("board", board, "request", {text, idempotency});
    }

    handWork(board, document, text, idempotency) {
        return this.act("board", board, "hand", {document, text, idempotency});
    }

    ticketBoard(n) {
        return this.act("ticket", n, "board");
    }

    moveTicket(n, stage) {
        return this.act("ticket", n, "move", {stage});
    }

    readAll(type, numbers) {
        return this.post(this.here(`/${type}/read-all`), {numbers});
    }

    upload(type, n, file) {
        const body = new FormData();
        body.append("file", file, file.name);
        return this.post(this.here(`/${type}/${n}/upload`), body);
    }

    markdownUrl(type, n) {
        return this.url(this.here(`/${type}/${n}/markdown`));
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

    fileDiff(path) {
        return this.get(this.here(`/diff${query({path})}`));
    }

    previewPlugin(source) {
        return this.post(this.here("/plugins/preview"), {source});
    }

    previewUpgrade(n) {
        return this.post(this.here(`/plugins/${n}/upgrade-preview`), {});
    }

    findFiles(q) {
        return this.get(this.here(`/project-files/find${query({q})}`));
    }

    projectFiles(folder = "") {
        return this.get(this.here(`/project-files${query({folder})}`));
    }

    bar() {
        return this.get(this.here("/bar"));
    }

    agents(last) {
        return this.list("agent", {completed: true, last, by: "updated"}).then((got) => got.rows);
    }

    launchAgent(n, agent) {
        return this.act("environment", n, "launch", {agent});
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

    pauseAgent(session) {
        return this.post(this.here(`/agent/${encoded(session)}/pause`));
    }

    resumeAgent(session) {
        return this.post(this.here(`/agent/${encoded(session)}/resume`));
    }

    permitAgent(session, allow) {
        return this.post(this.here(`/agent/${encoded(session)}/permit`), {allow});
    }

    organization() {
        return this.post(this.here("/ticket/organization"), {});
    }

    agentScreen(session, since) {
        return this.get(this.here(`/agent/${encoded(session)}/screen${query({since})}`));
    }

    agentKeys(session, text) {
        return this.post(this.here(`/agent/${encoded(session)}/keys`), {text});
    }

    runShell(session, command, now = false) {
        return this.post(this.here(`/agent/${encoded(session)}/shell`), {command, now});
    }

    relaunchAgent(session, skip) {
        return this.post(this.here(`/agent/${encoded(session)}/relaunch`), {skip});
    }

    transcript(agent, session, fields) {
        return this.get(this.here(`/agent/${agent}${session ? `/subagent/${session}` : ""}/transcript${query(fields)}`));
    }

    agentLinks(agent, session) {
        return this.get(this.here(`/agent/${agent}${session ? `/subagent/${encoded(session)}` : ""}/links`));
    }

    edits(agent, since, last) {
        return this.get(this.here(`/agent/${agent}/edits${query({since, last})}`));
    }

    olderEdits(agent, before, last) {
        return this.get(this.here(`/agent/${agent}/edits/older${query({before, last})}`));
    }

    editedFile(agent, id, side) {
        return this.get(this.here(`/agent/${agent}/edits/file${query({id, side})}`));
    }

    terminal(agent, level) {
        return this.get(this.here(`/agent/${agent}/terminal${query({level})}`));
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

    skillKeywords(name, keywords) {
        return this.post(this.here(`/skills/${name}/keywords`), {keywords});
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
