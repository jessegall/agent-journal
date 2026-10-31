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

// which part of a list a read asks for, which keys it apart from the other parts of the same list: its newest page, a page
// before or after a row, its changes since a moment, the rows of these ids or of these tasks, and each of those among its closed
// rows; two reads of different ids are two reads, so neither takes the other's answer
const readKind = ({before, after, since, ids = [], tasks = [], closed = false, docked = false}) =>
    [docked ? "docked" : "", closed ? "closed" : "", tasks.length ? `tasks:${tasks.join(",")}` : ids.length ? `ids:${ids.join(",")}` : before ? "older" : after ? "newer" : since ? "changes" : "page"].filter(Boolean).join(".");

const NO_ENV = "the page does not know its environment yet";

export const ENV_HEADER = "X-Journal-Env";
export const REQUEST_TIME_HEADER = "X-Journal-Request-At";

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

    // every request names its environment, and the moment it was sent, from which the journal counts its time
    headers() {
        return {[REQUEST_TIME_HEADER]: String(Date.now()), ...(this.env() ? {[ENV_HEADER]: this.env()} : {})};
    }

    // a read keyed by what it reads, within this environment: by default its endpoint, never its query
    get(path, key = path.split("?")[0]) {
        return path === NO_ENV ? Promise.reject(new Error(NO_ENV)) : transport.request("GET", this.url(path), undefined, 0, this.headers(), `${this.env()} ${key}`);
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

    supervised() {
        return this.get("/supervised");
    }

    clientError(error) {
        return this.post("/client-errors", error);
    }

    developerReset() {
        return this.post("/developer/reset");
    }

    // the nudges each agent was sent, counted since the last reset
    developerNudges() {
        return this.get("/developer/nudges");
    }

    developerNudgesReset() {
        return this.post("/developer/nudges/reset");
    }

    // how well the environment's readers read its runs
    developerReaders() {
        return this.get(this.here("/developer/readers"));
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

    forceUpdate() {
        return this.post("/updates/force", {});
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
        return transport.stream(this.address("/entries/stream" + after));
    }

    // a resource's rows: a page with its counts, one row, a new one, a change, and an act on one
    list(table, {limit, before, after, since, ids = [], tasks = [], closed = false, docked = false} = {}) {
        const path = this.here(`/${table}${query({limit, before, after, since, ids: ids.join(","), tasks: tasks.join(","), closed: closed ? "1" : "", docked: docked ? "1" : ""})}`);
        return this.get(path, `${table}.${readKind({before, after, since, ids, tasks, closed, docked})}`);
    }

    // the own chat of a worker or a subagent, by its session
    chat(session, {limit, before, since, docked = false} = {}) {
        const path = this.here(`/chats/${encodeURIComponent(session)}${query({limit, before, since, docked: docked ? "1" : ""})}`);
        return this.get(path, `chats/${session}.${readKind({before, since, docked})}`);
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

    // the message made with the key the page sent it with, once the environment's host has made it
    sentMessage(key) {
        return this.get(this.here(`/messages/sent/${encodeURIComponent(key)}`));
    }

    // the buttons pressed on a message's card, kept so the chat shows them spent
    pressed(id, labels) {
        return this.act("messages", id, "press", {pressed: labels});
    }

    // a comment: a message of the user's written under a row, named as tasks:12, or under a chat message as a reply to it
    comment(on, text) {
        return this.create("messages", {on, text});
    }

    // every comment under one row, named as reports:12: the messages written under it
    commentsOn(on) {
        return this.get(this.here(`/messages${query({on})}`), "messages.on");
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

    attachments({file_type, shelf, search, last, skip}) {
        return this.get(this.here(`/attachments${query({file_type, shelf, search, last, skip})}`));
    }

    // a plan's tasks
    planTasks(id) {
        return this.get(this.here(`/plans/${id}/tasks`));
    }

    addPlanTask(id, body) {
        return this.post(this.here(`/plans/${id}/tasks`), body);
    }

    // sets how a plan's agent is told to test, by a plan testing template's title, or none
    setPlanTesting(id, title) {
        return this.post(this.here(`/plans/${id}/testing`), {title});
    }

    // the plan testing templates a plan may follow
    planTestingTemplates() {
        return this.get(this.here("/plan-testing"));
    }

    taskLogs(id) {
        return this.get(this.here(`/tasks/${id}/logs`));
    }

    // what starts a sequence, and its steps
    setTriggers(id, triggers) {
        return this.act("sequences", id, "triggers", {triggers});
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

    stopJob(agent, job) {
        return this.post(this.here(`/agents/${agent}/jobs/${encoded(job)}/stop`), {});
    }

    skipSequenceStep(id) {
        return this.act("agents", id, "skip-step");
    }

    endSequence(id) {
        return this.act("agents", id, "end-sequence");
    }

    transcript(agent, session, fields) {
        const path = `/agents/${agent}${session ? `/subagents/${encoded(session)}` : ""}/transcript`;
        return this.get(this.here(`${path}${query(fields)}`), `${path}.${readKind(fields)}`);
    }

    verifierTranscript(id, fields = {}) {
        return this.get(this.here(`/verifiers/${id}/transcript${query(fields)}`), `/verifiers/${id}/transcript.${readKind(fields)}`);
    }

    workerTranscript(id, fields = {}) {
        return this.get(this.here(`/workers/${id}/transcript${query(fields)}`), `/workers/${id}/transcript.${readKind(fields)}`);
    }

    edits(agent, since, fields = {}) {
        return this.get(this.here(`/agents/${agent}/edits${query({since, ...fields})}`));
    }

    editedText(agent, edit) {
        return this.get(this.here(`/agents/${agent}/edits/text${query({edit})}`));
    }

    editedImageUrl(agent, edit) {
        return this.address(`/agents/${agent}/edits/image${query({edit})}`);
    }

    terminal(agent, after = 0) {
        return this.get(this.here(`/agents/${agent}/terminal${query({after})}`));
    }


    // who the viewer is and who else is on the journal, so it says you only for its own person
    people() {
        return this.get("/people");
    }

    // whether this journal is connected to a team, and as whom; the one team, or the team named
    team(team = "") {
        return this.get(`/team${query({team})}`);
    }

    // every team this journal is connected to, with as whom, the role and how many people, devices and shared items
    teams() {
        return this.get("/teams");
    }

    // connects to a team by its server's URL: a new server's makes this person its admin, an invitation URL a member, a bare URL logs in
    connectTeam(fields) {
        return this.post("/team/connect", fields, LONG_WAIT_MS);
    }

    // disconnects from one team, the one or the one named; what was imported from its library stays
    disconnectTeam(team = "") {
        return this.post("/team/disconnect", {team});
    }

    // an invitation URL for a person's email; admins only
    inviteToTeam(email, team = "") {
        return this.post("/team/invite", {email, team});
    }

    // the team's devices and people, and a device revoked; admins only
    teamDevices(team = "") {
        return this.get(`/team/devices${query({team})}`);
    }

    revokeTeamDevice(device, team = "") {
        return this.post("/team/revoke", {device, team});
    }

    teamPeople(team = "") {
        return this.get(`/team/people${query({team})}`);
    }

    // changes this person's own password on the team
    changeTeamPassword(old, fresh, team = "") {
        return this.post("/team/password", {old, new: fresh, team});
    }

    // the library's items, each with its newest version and the version this journal imported, by kind and words
    libraryItems(type, search, team = "") {
        return this.get(`/library/items${query({type, search, team})}`);
    }

    // one library item with every version and its note, and the version this journal imported
    libraryItem(type, name, team = "") {
        return this.get(`/library/items/${encodeURIComponent(type)}/${encodeURIComponent(name)}${query({team})}`);
    }

    // every copy here that came from the library, with the version it came from and the row or file it is
    libraryCopies(team = "") {
        return this.get(`/library/copies${query({team})}`);
    }

    // publishes a sequence or template, by its number, or a profile, by its name, as the library's next version
    publishLibraryItem(type, reference, note, description, team = "") {
        return this.post(`/library/items/${encodeURIComponent(type)}/publish`, {reference, note, description, team}, LONG_WAIT_MS);
    }

    // imports a library item's version as this journal's own copy; accept writes a reader or a sequence whose script or powers were read
    importLibraryItem(type, name, version, accept = false, team = "") {
        return this.post(`/library/items/${encodeURIComponent(type)}/${encodeURIComponent(name)}/import`, {version, accept, team});
    }

    // updates the imported copy to the newest version; replace writes over a copy edited here
    updateLibraryItem(type, name, replace, team = "") {
        return this.post(`/library/items/${encodeURIComponent(type)}/${encodeURIComponent(name)}/update`, {replace, team});
    }

    // the work mode the plan bar's buttons set, and the pause of an agent
    saveMode(mode) {
        return this.post(this.here("/mode"), {mode});
    }

    // the project's conversations Claude Code and Codex kept on this machine, newest first, for a new environment to carry on from
    pastSessions() {
        return this.get("/environments/sessions");
    }

    // how far a new environment's chat has been filled from its past session, in percent, null when it is not being filled
    filledPercent(name) {
        return this.get(`/environments/filling?name=${encodeURIComponent(name)}`);
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

    leftWorktrees() {
        return this.get(this.here("/worktrees"));
    }

    removeLeftWorktree(name) {
        return this.post(this.here(`/worktrees/${encodeURIComponent(name)}/removal`));
    }

    removeWorktree(environment) {
        return this.act("environments", environment, "worktree-removal");
    }

    // one page of an output: the newest, the lines after a position, or the page before one
    // the workers' noteworthy moments, newest first, read from the marks written for them in the chat
    workerActivity() {
        const path = this.here("/workers/activity");
        return this.get(path, path);
    }

    // the outputs still running in this environment, each with its card and whether it is docked
    runningOutputs() {
        return this.get(this.here("/outputs/running"));
    }

    readOutput(id, {after, before} = {}) {
        const path = this.here(`/outputs/${id}${query({after, before})}`);
        return this.get(path, path);
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

    // the project's repository

    gitBranches(skip = 0, last = 30) {
        return this.get(this.here(`/git/branches${query({skip, last})}`));
    }

    gitCommits(skip = 0, last = 30) {
        return this.get(this.here(`/git/commits${query({skip, last})}`));
    }

    gitPulls() {
        return this.get(this.here("/git/pulls"));
    }

    // secrets

    secretsFile() {
        return this.get(this.here("/secrets/where"));
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

    upgradePlugin(id, ref) {
        return this.act("plugins", id, "upgrade", {ref}, LONG_WAIT_MS);
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













    gitHooks() {
        return this.get(this.here("/git-hooks"));
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

    mcpAdd(server) {
        return this.post("/mcp/add", server, LONG_WAIT_MS);
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
