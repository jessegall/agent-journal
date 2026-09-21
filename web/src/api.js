let settle = async () => {};

export function onWrite(fn) {
    settle = fn;
}

export async function api(method, path, body, base = "") {
    const res = await fetch(`${base}/api${path}`, {
        method,
        headers: body === undefined ? {} : {"Content-Type": "application/json"},
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const got = await res.json();
    if (!res.ok) throw new Error(got.error || res.statusText);
    if (method !== "GET" && !base) await settle(path);
    return got;
}

const flying = new Map();

export function poll(path, base = "") {
    const key = `${base}${path}`;
    if (!flying.has(key))
        flying.set(
            key,
            api("GET", path, undefined, base).finally(() => flying.delete(key))
        );
    return flying.get(key);
}

export const manifest = () => api("GET", "/manifest");
export const identity = () => api("GET", "/identity");
export const saveIdentity = (body) => api("POST", "/identity", body);
export const onlineAgents = () => api("GET", "/agents");
export const appoint = (env, session) => api("POST", `/${env}/appoint`, {session});
export const agentControls = (provider, model = "") =>
    api("GET", `/agent-controls/${encodeURIComponent(provider)}${model ? `?model=${encodeURIComponent(model)}` : ""}`);
export const controlAgent = (env, session, action, value) =>
    api("POST", `/${env}/agent/${encodeURIComponent(session)}/control`, {action, value});
export const forceAgent = (env, session) => api("POST", `/${env}/agent/${encodeURIComponent(session)}/force`);
export function list(env, type, {last, completed = false, before = 0, base = ""} = {}) {
    const query = new URLSearchParams();
    if (last !== undefined) query.set("last", last);
    if (completed) query.set("completed", "1");
    if (before) query.set("before", before);
    return api("GET", `/${env}/${type}${query.toString() ? `?${query}` : ""}`, undefined, base);
}
export function dashboard(env, types, {last, events = null} = {}) {
    const query = new URLSearchParams({types: types.join(","), completed: "1"});
    if (last !== undefined) query.set("last", last);
    if (events !== null) query.set("events", events);
    return api("GET", `/${env}/dashboard?${query}`);
}
export const all = (env, type, base = "") => list(env, type, {completed: true, base}).then((got) => got.rows);
export const show = (env, type, n) => api("GET", `/${env}/${type}/${n}`);
export const create = (env, type, body, base = "") => api("POST", `/${env}/${type}`, body, base);
export async function upload(env, type, n, file, base = "") {
    const body = new FormData();
    body.append("file", file, file.name);
    const res = await fetch(`${base}/api/${env}/${type}/${n}/upload`, {method: "POST", body});
    if (!res.ok) throw new Error((await res.json()).error || res.statusText);
}
export const act = (env, type, n, action, body = {}, base = "") => api("POST", `/${env}/${type}/${n}/${action}`, body, base);
export const command = (env, type, action, body = {}) => api("POST", `/${env}/${type}/${action}`, body);
export const readAll = (env, type, numbers) => api("POST", `/${env}/${type}/read-all`, {numbers});
export const events = (env, since = 0, last = 0) => api("GET", `/${env}/events?since=${since}&last=${last}`);
export const settings = (env) => api("GET", `/${env}/settings`);
export const saveSettings = (env, body, base = "") => api("POST", `/${env}/settings`, body, base);
export const search = (env, q) => api("GET", `/${env}/search?q=${encodeURIComponent(q)}`);
export const projectFile = (env, path) => api("GET", `/${env}/file?path=${encodeURIComponent(path)}`);
export const projectFiles = (env) => api("GET", `/${env}/project-files`);
export const fileUrl = (env, type, n, name) => `/api/${env}/${type}/${n}/files/${encodeURIComponent(name)}`;
