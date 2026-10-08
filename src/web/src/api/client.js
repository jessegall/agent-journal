import {href, route} from "../route.js";
import {LONG_WAIT_MS, transport} from "./transport.js";

const encoded = (value) => encodeURIComponent(value);

function query(fields) {
    const query = new URLSearchParams(
        Object.entries(fields).filter(([, value]) => value !== undefined && value !== null && value !== false)
    );
    return query.toString() ? `?${query}` : "";
}

const NO_ENV = "the page does not know its environment yet";

export class ApiClient {
    constructor({env = () => route.value.env, base = ""} = {}) {
        this.env = env;
        this.base = base;
    }

    point(base, env) {
        this.base = base;
        this.env = env;
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
        return path === NO_ENV ? Promise.reject(new Error(NO_ENV)) : transport.request("GET", this.url(path));
    }

    post(path, body = {}, wait = 0) {
        return path === NO_ENV ? Promise.reject(new Error(NO_ENV)) : transport.request("POST", this.url(path), body, wait);
    }

    here(path) {
        return this.env() ? `/${this.env()}${path}` : NO_ENV;
    }

    changelog() {
        return this.get("/changelog");
    }

    checkForUpdate() {
        return this.post("/update/check", {});
    }

    update(yes = false, version = "") {
        return this.post("/update", {yes, ...(version ? {version} : {})});
    }

    releases() {
        return this.get("/releases");
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

    startJournal(root, agent) {
        return this.post("/journals/start", {root, agent});
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

    hosting() {
        return this.get("/hosting");
    }

    hostingUpgrade() {
        return this.post("/hosting/upgrade", {});
    }

    hostingTakeDown() {
        return this.post("/hosting/take-down", {});
    }

    hostingMe() {
        return this.get("/hosting/me");
    }

    members() {
        return this.get("/hosting/members");
    }

    inviteMember(name, role) {
        return this.post("/hosting/members", {name, role});
    }

    assignRole(member, role) {
        return this.post("/hosting/members/role", {member, role});
    }

    removeMember(member) {
        return this.post("/hosting/members/remove", {member});
    }

    shareEnvironments(member, environments) {
        return this.post("/hosting/members/environments", {member, environments});
    }

    endLogins(member) {
        return this.post("/hosting/members/end-logins", {member});
    }

    leaveJournal() {
        return this.post("/hosting/leave", {});
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

    connection(address = "") {
        return this.command("environment", "connection", address ? {address} : {});
    }

    connectTo(address, key) {
        return this.command("environment", "connect", key ? {address, key} : {address});
    }

    disconnectFromServer() {
        return this.command("environment", "disconnect");
    }

    tunnelLogin(login) {
        return this.command("share", "login", login);
    }

    tunnelLogout() {
        return this.command("share", "logout");
    }

    tunlerVersion() {
        return this.command("share", "version");
    }

    updateTunler() {
        return this.command("share", "update_tunler");
    }

    installTunler(host) {
        return this.command("share", "install_tunler", {host});
    }

    tunnelAnswering() {
        return this.command("share", "answering");
    }

    tunnelDomains() {
        return this.command("share", "domains");
    }

    tunnelRelease(domain) {
        return this.command("share", "release", {domain});
    }

    tunnelReaddress() {
        return this.command("share", "readdress");
    }

    tunnelCause() {
        return this.command("share", "tunnel_cause");
    }

    restartTunnel() {
        return this.command("share", "restart_tunnel");
    }

    connectPhone(days) {
        return this.command("phone", "connect", {days});
    }

    disconnectPhone(n) {
        return this.act("phone", n, "disconnect");
    }

    allowPhonePasskey(n) {
        return this.act("phone", n, "allow_passkey");
    }

    refusePhonePasskey(n) {
        return this.act("phone", n, "refuse_passkey");
    }

    shareLayout(name, layout, {expires = "7d", once = false} = {}) {
        return this.command("share", "share_layout", {name, layout: JSON.stringify(layout), expires, once});
    }

    async layoutFrom(url) {
        const got = await fetch(url).catch(() => null);
        if (got && got.ok) return got.json();
        throw new Error(
            got && got.status === 410 ? "That link was for one opening and has been used." : "That link doesn't answer any more."
        );
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

    diagnostics(lines = 200) {
        return this.get(this.here(`/diagnostics?lines=${lines}`));
    }

    clearDiagnostics() {
        return this.post(this.here("/diagnostics/clear"));
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

    fieldChoices(type, n) {
        return this.get(this.here(`/${type}/${n}/choices`));
    }

    act(type, n, action, body = {}) {
        return this.post(this.here(`/${type}/${n}/${action}`), body);
    }

    answerSuggestion(n, how) {
        return this.act("suggestion", n, "decide", {how});
    }

    installSuggested(n) {
        return this.post(this.here(`/suggestion/${n}/install`), {}, LONG_WAIT_MS);
    }

    reopenSuggestion(n) {
        return this.act("suggestion", n, "reopen");
    }

    noteSuggestionWindow(n) {
        return this.act("suggestion", n, "note_window");
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

    createSecret(fields) {
        return this.create("secret", fields);
    }

    updateSecret(n, fields) {
        return this.act("secret", n, "update", fields);
    }

    fillSecret(n, field, value) {
        return this.act("secret", n, "fill", {field, value});
    }

    deleteSecret(n) {
        return this.act("secret", n, "delete", {why: "deleted from the viewer"});
    }

    revokeSecretLogin(n) {
        return this.act("secret", n, "revoke_login");
    }

    restoreSecret(n) {
        return this.act("secret", n, "restore");
    }

    secretsFile() {
        return this.command("secret", "where");
    }

    command(type, action, body = {}) {
        return this.post(this.here(`/${type}/${action}`), body);
    }

    press(button) {
        const path = button.n ? `/${button.type}/${button.n}/${button.action}` : `/${button.type}/${button.action}`;
        return this.post(this.here(path), button.body || {}, LONG_WAIT_MS);
    }

    tasks(agent) {
        return this.command("todo", "tasks", {agent});
    }

    touched(n) {
        return this.command("todo", "touched", {n});
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

    dismissQuestion(n, why) {
        return this.act("question", n, "dismiss", {why});
    }

    moveTicket(n, stage) {
        return this.act("ticket", n, "move", {stage});
    }

    stopTicket(n) {
        return this.act("ticket", n, "stop");
    }

    confirmTicket(n) {
        return this.act("ticket", n, "confirm");
    }

    updateTicket(n, fields) {
        return this.act("ticket", n, "update", fields);
    }

    deleteTicket(n, why) {
        return this.act("ticket", n, "delete", {why});
    }

    acceptDependencies(n, only = []) {
        return this.act("ticket", n, "accept_dependencies", only.length ? {only: only.join(",")} : {});
    }

    declineDependencies(n) {
        return this.act("ticket", n, "decline_dependencies");
    }

    buildBoard(n, name, steer) {
        return this.act("board", n, "build", {name, steer});
    }

    startBoard(n) {
        return this.act("board", n, "start");
    }

    retryBoard(n) {
        return this.act("board", n, "retry");
    }

    archiveBoard(n) {
        return this.act("board", n, "complete");
    }

    restoreBoard(n) {
        return this.act("board", n, "reopen", {why: "Restored from the board menu"});
    }

    addedToBoard(n, tickets) {
        return this.act("board", n, "added", {tickets: tickets.join(",")});
    }

    markStage(board, stage, meaning) {
        return this.act("board", board, "meaning", {stage, meaning});
    }

    stopShare(n) {
        return this.act("share", n, "stop");
    }

    approveShare(n) {
        return this.act("share", n, "approve");
    }

    tunnelStatus() {
        return this.command("share", "tunnel");
    }

    tunnelRecheck() {
        return this.command("share", "check_tunnel");
    }

    shareReachable(n) {
        return this.command("share", "reachable", {n});
    }

    shareOpens(ref) {
        return this.command("share", "opens", {ref});
    }

    questionsLinkedTo(ref) {
        return this.command("question", "linked_to", {ref});
    }

    planFromDoc(doc) {
        return this.command("plan", "from_doc", {doc});
    }

    keepDoc(n) {
        return this.act("doc", n, "keep");
    }

    runCheck(n) {
        return this.act("check", n, "run");
    }

    setCheck(n, key, value) {
        return this.act("check", n, "set", {key, value: String(value)});
    }

    closeNotice(n) {
        return this.act("notice", n, "close");
    }

    pinNotice(text, about = "") {
        return this.create("notice", {brief: text, about: about || undefined});
    }

    deleteTurn(type, n) {
        return this.act(type, n, "delete", {why: "deleted from the viewer"});
    }

    editMessage(n, text) {
        return this.act("message", n, "edit", {text});
    }

    stopTask(agent, task, description) {
        return this.act("agent", agent, "stop_task", {task, description});
    }

    updateComment(n, brief) {
        return this.act("comment", n, "update", {brief});
    }

    deleteComment(n) {
        return this.act("comment", n, "delete", {why: "deleted from the viewer"});
    }

    addToCollection(n, refs) {
        return this.act("collection", n, "add", {refs});
    }

    setStartsOn(n, value) {
        return this.act("sequence", n, "set", {key: "starts_on", value});
    }

    setSteps(n, steps) {
        return this.act("sequence", n, "steps", {steps});
    }

    profiles() {
        return this.all("profile");
    }

    profileCallings() {
        return this.command("profile", "callings");
    }

    profileSamples() {
        return this.command("profile", "samples");
    }

    profileNamings() {
        return this.command("profile", "namings");
    }

    createProfile(fields) {
        return this.create("profile", fields);
    }

    updateProfile(n, fields) {
        return this.act("profile", n, "update", fields);
    }

    duplicateProfile(n) {
        return this.act("profile", n, "duplicate");
    }

    deleteProfile(n) {
        return this.act("profile", n, "delete");
    }

    pinRule(n) {
        return this.act("rule", n, "pin");
    }

    configurePlugin(n, key, value) {
        return this.act("plugin", n, "configure", {key, value});
    }

    clearPluginLog(n) {
        return this.act("plugin", n, "clear_log");
    }

    removeEnvironment(n, forced) {
        return this.act("environment", n, "remove", {how: "removed from the viewer", ...(forced ? {yes: true} : {})});
    }

    sweepEnvironment(n, now) {
        return this.act("environment", n, "sweep", now ? {yes: true} : {});
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

    saveMode(mode) {
        return this.post(this.here("/mode"), {mode});
    }

    integration(name) {
        return this.get(this.here(`/integration/${name}`));
    }

    integrationTeams(name) {
        return this.get(this.here(`/integration/${name}/teams`));
    }

    integrationWebhook(name) {
        return this.get(this.here(`/integration/${name}/webhook`));
    }

    checkIntegration(name) {
        return this.post(this.here(`/integration/${name}/check`));
    }

    search(q, archived = false, resources = []) {
        return this.get(this.here(`/search${query({q, ...(archived ? {archived: true} : {}), ...(resources.length ? {resources: resources.join(",")} : {})})}`));
    }

    restore(type, n) {
        return this.act(type, n, "restore");
    }

    searchAttic(q) {
        return this.get(this.here(`/search/attic${query({q})}`));
    }

    unarchive(name) {
        return this.post(this.here("/environment/unarchive"), {name});
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
        return this.post(this.here("/plugins/preview"), {source}, LONG_WAIT_MS);
    }

    previewUpgrade(n) {
        return this.post(this.here(`/plugins/${n}/upgrade-preview`), {}, LONG_WAIT_MS);
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

    stopAgentIn(n) {
        return this.act("environment", n, "stop");
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

    ticketTodos() {
        return this.post(this.here("/ticket/todos"), {});
    }

    organization() {
        return this.post(this.here("/ticket/organization"), {});
    }

    family() {
        return this.get(this.here("/family"));
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

    terminal(agent, level, after = 0) {
        return this.get(this.here(`/agent/${agent}/terminal${query({level, after: after || undefined})}`));
    }

    stream() {
        return new EventSource(this.url(this.here("/stream")));
    }

    page(env, page = "") {
        return `${this.base}/${href.page(env, page)}`;
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
export const onBlocked = (fn) => transport.onBlocked(fn);
export const onWrite = (fn) =>
    transport.onWrite((url) => {
        const where = new URL(url, location.origin);
        if (where.origin === location.origin) fn(where.pathname.slice(api.base.length).split("/")[3]);
    });
