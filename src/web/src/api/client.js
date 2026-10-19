import {href, route} from "../route.js";
import {UPLOAD_LIMIT, overLimit} from "../chat/attachments.js";
import {LONG_WAIT_MS, transport} from "./transport.js";

const encoded = (value) => encodeURIComponent(value);

function query(fields) {
    const query = new URLSearchParams(
        Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== false && value !== "")
    );
    return query.toString() ? `?${query}` : "";
}

const NO_ENV = "the page does not know its environment yet";

export const ENV_HEADER = "X-Journal-Env";

// The journal's API: every path the viewer asks for is named here, under /journal, scoped to the environment by its header.
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
        return `${this.base}/journal${path}`;
    }

    headers() {
        return this.env() ? {[ENV_HEADER]: this.env()} : {};
    }

    get(path) {
        return path === NO_ENV ? Promise.reject(new Error(NO_ENV)) : transport.request("GET", this.url(path), undefined, 0, this.headers());
    }

    post(path, body = {}, wait = 0) {
        return path === NO_ENV ? Promise.reject(new Error(NO_ENV)) : transport.request("POST", this.url(path), body, wait, this.headers());
    }

    here(path) {
        return this.env() ? path : NO_ENV;
    }

    // an address the browser opens itself, a link, a picture or a stream, cannot carry a header, so it names the environment in its query
    address(path) {
        return this.url(`${this.here(path)}${path.includes("?") ? "&" : "?"}env=${encoded(this.env())}`);
    }

    publicUrl(path) {
        return `/${path}`;
    }

    // each voice's 3D figure file, by voice; a file is named by a hash of its content
    voiceFigures() {
        return transport.request("GET", this.publicUrl("voices/figures/figures.json"));
    }

    voiceFigureUrl(file) {
        return this.publicUrl(`voices/figures/${file}`);
    }

    figureDecoderUrl() {
        return this.publicUrl("voices/figures/draco/");
    }

    // the journal as a whole

    manifest() {
        return this.get("/manifest");
    }

    identity() {
        return this.get("/identity");
    }

    journals() {
        return this.get("/journals");
    }

    summary() {
        return this.get("/summary");
    }

    bar() {
        return this.get(this.here("/bar"));
    }

    settings() {
        return this.get(this.here("/settings"));
    }

    saveSettings(body) {
        return this.post(this.here("/settings"), body);
    }

    releases() {
        return this.get("/updates");
    }

    update() {
        return this.post("/updates", {});
    }

    // whether a version 3 journal is kept in .journal/version-3, and where bringing it across stands
    migration() {
        return this.get(this.here("/migration"));
    }

    putMigrationOff() {
        return this.post(this.here("/migration/later"), {});
    }

    startMigration() {
        return this.post(this.here("/migration/start"), {});
    }

    // the timeline the viewer stays live by: the entries after an id, or the newest, and the same as a stream
    entries(since = 0, last = 0) {
        return this.get(this.here(`/entries${query({since, last})}`));
    }

    stream() {
        return new EventSource(this.address("/entries/stream"));
    }

    // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
    list(table, {limit, before, after, since, ids = [], closed = false} = {}) {
        return this.get(this.here(`/${table}${query({limit, before, after, since, ids: ids.join(","), closed: closed ? "1" : ""})}`));
    }

    show(table, id) {
        return this.get(this.here(`/${table}/${id}`));
    }

    create(table, body) {
        return this.post(this.here(`/${table}`), body);
    }

    change(table, id, body) {
        return this.post(this.here(`/${table}/${id}`), body);
    }

    act(table, id, act, body = {}, wait = 0) {
        return this.post(this.here(`/${table}/${id}/${act}`), body, wait);
    }

    // a button on a message's card names the path it posts to
    press(button) {
        return this.post(this.here(button.path), {}, LONG_WAIT_MS);
    }

    upload(table, id, file) {
        if (file.size > UPLOAD_LIMIT) return Promise.reject(new Error(overLimit(file)));
        const body = new FormData();
        body.append("file", file, file.name);
        return this.post(this.here(`/${table}/${id}/files`), body);
    }

    fileUrl(table, id, name) {
        return this.address(`/${table}/${id}/files/${encoded(name)}`);
    }

    // messages

    readMessages(ids) {
        return this.post(this.here("/messages/read"), {ids});
    }

    // the buttons pressed on a message's card, kept so the chat shows them spent
    pressed(id, labels) {
        return this.act("messages", id, "press", {pressed: labels});
    }

    // comments: a message of the user's written under a row, named as tasks:12
    comment(on, text) {
        return this.create("comments", {on, text});
    }

    // the documents a search finds, best first, and the files attached to messages, a page at a time
    locateDocs(words) {
        return this.get(this.here(`/docs/search${query({words})}`));
    }

    attachments({kind, shelf, search, last, skip}) {
        return this.get(this.here(`/attachments${query({kind, shelf, search, last, skip})}`));
    }

    // a plan's tasks
    planTasks(id) {
        return this.get(this.here(`/plans/${id}/tasks`));
    }

    taskLogs(id) {
        return this.get(this.here(`/tasks/${id}/logs`));
    }

    // what starts a sequence, and its steps
    setStartsOn(id, startsOn) {
        return this.act("sequences", id, "starts", {starts_on: startsOn});
    }

    setSteps(id, steps) {
        return this.act("sequences", id, "steps", {steps});
    }

    // agents

    liveAgents() {
        return this.get("/agents/live");
    }

    agentControls(provider, model = "", effort = "") {
        return this.get(`/agents/controls/${encoded(provider)}${query({model, effort})}`);
    }

    controlAgent(id, action, value) {
        return this.act("agents", id, "control", {action, value});
    }

    runShell(id, command) {
        return this.act("agents", id, "shell", {command});
    }

    skipSequenceStep(id) {
        return this.act("agents", id, "skip-step");
    }

    endSequence(id) {
        return this.act("agents", id, "end-sequence");
    }

    transcript(agent, session, fields) {
        return this.get(this.here(`/agents/${agent}${session ? `/subagents/${encoded(session)}` : ""}/transcript${query(fields)}`));
    }

    workerTranscript(id, fields = {}) {
        return this.get(this.here(`/workers/${id}/transcript${query(fields)}`));
    }

    edits(agent, since) {
        return this.get(this.here(`/agents/${agent}/edits${query({since})}`));
    }

    editedFile(agent, path) {
        return this.get(this.here(`/agents/${agent}/edits/file${query({path})}`));
    }

    terminal(agent, after = 0) {
        return this.get(this.here(`/agents/${agent}/terminal${query({after})}`));
    }

    launchAgent(environment, agent) {
        return this.act("environments", environment, "launch", {agent});
    }

    stopAgentIn(environment) {
        return this.act("environments", environment, "stop");
    }

    removeEnvironment(environment) {
        return this.act("environments", environment, "remove");
    }

    readOutput(id) {
        return this.get(this.here(`/outputs/${id}`));
    }

    // skills and voices

    skills(agent = 0) {
        return this.get(this.here(`/skills${query({agent})}`));
    }

    skill(name) {
        return this.get(this.here(`/skills/${encoded(name)}`));
    }

    loadSkill(name) {
        return this.post(this.here(`/skills/${encoded(name)}/load`));
    }

    voices() {
        return this.get(this.here("/voices"));
    }

    chooseVoice(name) {
        return this.post(this.here("/voices/choose"), {name});
    }

    // the project's files

    projectFiles(folder = "") {
        return this.get(this.here(`/project-files${query({folder})}`));
    }

    findFiles(q) {
        return this.get(this.here(`/project-files/find${query({q})}`));
    }

    projectFile(path) {
        return this.get(this.here(`/project-files/file${query({path})}`));
    }

    fileDiff(path) {
        return this.get(this.here(`/project-files/diff${query({path})}`));
    }

    // secrets

    secretsFile() {
        return this.get(this.here("/secrets/where"));
    }

    // share links and the tunnel that carries them

    shareOpens(target) {
        return this.get(this.here(`/shares/opens${query({target})}`));
    }

    tunnel() {
        return this.get("/tunnel");
    }

    services() {
        return this.get("/tunnel/services");
    }

    tunnelCause() {
        return this.get("/tunnel/cause");
    }

    tunnelAnswering() {
        return this.get("/tunnel/answering");
    }

    tunlerVersion() {
        return this.get("/tunnel/version");
    }

    tunnelDomains() {
        return this.get("/tunnel/domains");
    }

    tunnelRecheck() {
        return this.post("/tunnel/check", {});
    }

    restartTunnel() {
        return this.post("/tunnel/restart", {});
    }

    tunnelLogin(login) {
        return this.post("/tunnel/login", login);
    }

    tunnelLogout() {
        return this.post("/tunnel/logout", {});
    }

    installTunler(host) {
        return this.post("/tunnel/install", {host}, LONG_WAIT_MS);
    }

    updateTunler() {
        return this.post("/tunnel/update", {}, LONG_WAIT_MS);
    }

    tunnelRelease(domain) {
        return this.post("/tunnel/release", {domain});
    }

    tunnelReaddress() {
        return this.post("/tunnel/readdress", {});
    }

    // plugins

    previewPlugin(source) {
        return this.post(this.here("/plugins/preview"), {source}, LONG_WAIT_MS);
    }

    installPlugin(source) {
        return this.post(this.here("/plugins"), {source}, LONG_WAIT_MS);
    }

    previewUpgrade(id) {
        return this.act("plugins", id, "upgrade-preview", {}, LONG_WAIT_MS);
    }

    upgradePlugin(id) {
        return this.act("plugins", id, "upgrade", {}, LONG_WAIT_MS);
    }

    pluginLog(id, lines = 200) {
        return this.get(this.here(`/plugins/${id}/log${query({lines})}`));
    }

    pluginRecord(id) {
        return this.get(this.here(`/plugins/${id}/record`));
    }

    pluginDashboard(id) {
        return this.get(this.here(`/plugins/${id}/dashboard`));
    }

    // the workflows, the agent profiles and the MCP servers

    chart() {
        return this.get("/chart");
    }

    chartOne(id) {
        return this.get(`/chart/${id}`);
    }

    chartStanding(id) {
        return this.get(`/chart/${id}/standing`);
    }

    chartNew(body) {
        return this.post("/chart", body);
    }

    chartSave(id, body) {
        return this.post(`/chart/${id}`, body);
    }

    chartRemove(id) {
        return this.post(`/chart/${id}/remove`, {});
    }

    chartReset(id) {
        return this.post(`/chart/${id}/reset`, {});
    }

    chartOff(id) {
        return this.post(`/chart/${id}/off`, {});
    }

    chartOn(id) {
        return this.post(`/chart/${id}/on`, {});
    }

    chartOrder(trigger, order) {
        return this.post("/chart/order", {trigger, order});
    }

    chartRuns(last = 10) {
        return this.get(`/chart/runs?last=${last}`);
    }

    chartTry(body) {
        return this.post("/chart/try", body);
    }

    agentProfiles() {
        return this.get("/profiles");
    }

    saveAgentProfile(name, body) {
        return this.post(`/profiles/${encoded(name)}`, body);
    }

    mcp() {
        return this.get("/mcp");
    }

    mcpInstall(name) {
        return this.post("/mcp/install", {name});
    }

    mcpKey(name, value) {
        return this.post(`/mcp/${encoded(name)}/key`, {value});
    }

    mcpSignIn(name) {
        return this.post(`/mcp/${encoded(name)}/sign-in`, {});
    }

    mcpRemove(name) {
        return this.post(`/mcp/${encoded(name)}/remove`, {});
    }

    mcpCheck() {
        return this.post("/mcp/check", {}, LONG_WAIT_MS);
    }

    page(env = "", page = "") {
        return `${this.base}/${env ? `?env=${encoded(env)}` : ""}${href.page(page)}`;
    }

    origin() {
        return this.base || location.origin;
    }
}

export const api = new ApiClient();
export const onBlocked = (fn) => transport.onBlocked(fn);
export const onWrite = (fn) =>
    transport.onWrite((url) => {
        const where = new URL(url, location.origin);
        if (where.origin === location.origin) fn(where.pathname.slice(api.base.length).split("/")[2]);
    });
