import {onPhone, PHONE_SENDS_TEXT} from "../platform/phone.js";
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

    // a file the build carries, beside the page: at the root for the viewer, under /p/ for the phone
    publicUrl(path) {
        return onPhone ? `./${path}` : `/${path}`;
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

    developer() {
        return this.get("/developer");
    }

    developerReset() {
        return this.post("/developer/reset");
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

    freshReleases() {
        return this.get("/updates/fresh");
    }

    update() {
        return this.post("/updates", {});
    }

    planTimeline(id) {
        return this.get(this.here(`/plans/${id}/timeline`));
    }

    changelog(skip) {
        return this.get(`/updates/changelog${query({skip})}`);
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

    stream(since = 0) {
        const after = since ? `?since=${since}` : "";
        return new EventSource(this.address("/entries/stream" + after));
    }

    // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
    list(table, {limit, before, after, since, ids = [], closed = false} = {}) {
        return this.get(this.here(`/${table}${query({limit, before, after, since, ids: ids.join(","), closed: closed ? "1" : ""})}`));
    }

    // the own chat of a worker or a subagent, by its session
    chat(session, {limit, before, since} = {}) {
        return this.get(this.here(`/chats/${encodeURIComponent(session)}${query({limit, before, since})}`));
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

    dockRow(table, id) {
        return this.post(this.here(`/docks/${table}/${id}`), {});
    }

    undockRow(table, id) {
        return this.post(this.here(`/docks/${table}/${id}/undock`), {});
    }

    // a button on a message's card names the path it posts to
    press(button) {
        return this.post(this.here(button.path), {}, LONG_WAIT_MS);
    }

    upload(table, id, file) {
        if (onPhone) return Promise.reject(Object.assign(new Error(PHONE_SENDS_TEXT), {status: 403}));
        if (file.size > UPLOAD_LIMIT) return Promise.reject(new Error(overLimit(file)));
        const body = new FormData();
        body.append("file", file, file.name);
        return this.post(this.here(`/${table}/${id}/files`), body);
    }

    fileUrl(table, id, name) {
        return this.address(`/${table}/${id}/files/${encoded(name)}`);
    }

    // a document's revisions in order, and keeping the open one as it is
    docRevisions(id) {
        return this.get(this.here(`/docs/${id}/revisions`));
    }

    keepDoc(id) {
        return this.act("docs", id, "keep");
    }

    // a document or report as a file to download, named by the journal
    exportUrl(table, id) {
        return this.address(`/${table}/${id}/export`);
    }

    // the bytes at a file's address, so the viewer can tell text from a file it must not print
    fileBytes(url) {
        return transport.bytes(url);
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

    // every row and conversation line here that holds all the words
    search(words, {models = [], conversations = false} = {}) {
        const narrowed = {words, models: models.join(","), conversations: conversations ? 1 : ""};
        return this.get(this.here(`/search${query(narrowed)}`));
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

    addPlanTask(id, body) {
        return this.post(this.here(`/plans/${id}/tasks`), body);
    }

    taskLogs(id) {
        return this.get(this.here(`/tasks/${id}/logs`));
    }

    // what starts a sequence, and its steps
    setStartsOn(id, startsOn) {
        return this.act("sequences", id, "starts", {trigger_event: startsOn});
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

    // who holds the Team chat, and the Claim that makes this machine hold it
    teamChat() {
        return this.get("/team-chat");
    }

    claimTeamChat() {
        return this.post("/team-chat/claim", {});
    }

    // lets the Team chat go: its agent here stops after its files are committed and pushed
    releaseTeamChat() {
        return this.post("/team-chat/release", {}, LONG_WAIT_MS);
    }

    // the people's side thread beside an environment's chat, which no agent reads
    sideThread() {
        return this.get(this.here("/side-thread"));
    }

    postSideThread(text) {
        return this.post(this.here("/side-thread"), {text});
    }

    // who the viewer is and who else is on the journal, so it says you only for its own person
    people() {
        return this.get("/people");
    }

    // how this journal stands with its team, or that it has joined none
    team() {
        return this.get("/team");
    }

    // joins a team server with the line its setup or an invitation printed, as journal team join does
    joinTeam(fields) {
        return this.post("/team/join", fields, LONG_WAIT_MS);
    }

    // the team's people, each with their role, when they were last seen and their environments
    teamPeople() {
        return this.get("/team/people");
    }

    // the team's devices, for an admin
    teamDevices() {
        return this.get("/team/devices");
    }

    // revokes one device, so it reaches the team no more
    revokeDevice(id) {
        return this.post(`/team/devices/${encoded(id)}/revoke`, {});
    }

    // an admin's invitation for one email, answered with the line the person joins with
    inviteToTeam(email) {
        return this.post("/team/invite", {email});
    }

    // ends the browser's session on a hosted journal
    signOut() {
        return transport.request("POST", `${this.base}/sign-out`, {});
    }

    // how a shared journal's sync with its team stands, one line for the status bar
    syncLine() {
        return this.get("/sync");
    }

    // the work mode the plan bar's buttons set, and the pause of an agent
    saveMode(mode) {
        return this.post(this.here("/mode"), {mode});
    }

    pauseAgent(id) {
        return this.act("agents", id, "pause");
    }

    resumeAgent(id) {
        return this.act("agents", id, "resume");
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

    activeCards(ids) {
        return this.get(this.here(`/cards/active?ids=${ids.join(",")}`));
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

    skillMoment(name, moment, on) {
        return this.post(this.here(`/skills/${encoded(name)}/moment`), {moment, on});
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

    projectFileUrl(path) {
        return this.address(`/project-files/raw${query({path})}`);
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

    // the phone paired with the journal, a code to pair one and its disconnection
    phones() {
        return this.get("/phones");
    }

    connectPhone(days) {
        return this.post("/phones/connect", {days});
    }

    disconnectPhone(id) {
        return this.post(`/phones/${id}/disconnect`, {});
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

    // the agent profiles and the MCP servers













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

export const api = new ApiClient({base: onPhone ? "/p" : ""});
export const onBlocked = (fn) => transport.onBlocked(fn);
export const onWrite = (fn) =>
    transport.onWrite((url) => {
        const where = new URL(url, location.origin);
        if (where.origin === location.origin) fn(where.pathname.slice(api.base.length).split("/")[2]);
    });
