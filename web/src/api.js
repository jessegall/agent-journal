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
    if (method !== "GET" && !base) await settle();
    return got;
}

export const manifest = () => api("GET", "/manifest");
export const onlineAgents = () => api("GET", "/agents");
export const appoint = (env, session) => api("POST", `/${env}/appoint`, {session});
export const agentControls = (provider) => api("GET", `/agent-controls/${encodeURIComponent(provider)}`);
export const controlAgent = (env, session, action, value) => api("POST", `/${env}/agent/${encodeURIComponent(session)}/control`, {action, value});
export const agentUsage = (provider) => api("GET", `/agent-usage/${encodeURIComponent(provider)}`);
export const all = (env, type, base = "") => api("GET", `/${env}/${type}`, undefined, base);
export const show = (env, type, n) => api("GET", `/${env}/${type}/${n}`);
export const create = (env, type, body) => api("POST", `/${env}/${type}`, body);
export const act = (env, type, n, action, body = {}, base = "") => api("POST", `/${env}/${type}/${n}/${action}`, body, base);
export const readAll = (env, type, numbers) => api("POST", `/${env}/${type}/read-all`, {numbers});
export const events = (env, since = 0) => api("GET", `/${env}/events?since=${since}`);
export const settings = (env) => api("GET", `/${env}/settings`);
export const saveSettings = (env, body, base = "") => api("POST", `/${env}/settings`, body, base);
export const search = (env, q) => api("GET", `/${env}/search?q=${encodeURIComponent(q)}`);
export const projectFile = (env, path) => api("GET", `/${env}/file?path=${encodeURIComponent(path)}`);
export const fileUrl = (env, type, n, name) => `/api/${env}/${type}/${n}/files/${encodeURIComponent(name)}`;
