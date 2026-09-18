let settle = async () => {};

export function onWrite(fn) {
    settle = fn;
}

export async function api(method, path, body) {
    const res = await fetch(`/api${path}`, {
        method,
        headers: {"Content-Type": "application/json"},
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const got = await res.json();
    if (!res.ok) throw new Error(got.error || res.statusText);
    if (method !== "GET") await settle();
    return got;
}

export const manifest = () => api("GET", "/manifest");
export const all = (env, type) => api("GET", `/${env}/${type}`);
export const show = (env, type, n) => api("GET", `/${env}/${type}/${n}`);
export const create = (env, type, body) => api("POST", `/${env}/${type}`, body);
export const act = (env, type, n, action, body = {}) => api("POST", `/${env}/${type}/${n}/${action}`, body);
export const events = (env, since = 0) => api("GET", `/${env}/events?since=${since}`);
export const settings = (env) => api("GET", `/${env}/settings`);
export const saveSettings = (env, body) => api("POST", `/${env}/settings`, body);
export const search = (env, q) => api("GET", `/${env}/search?q=${encodeURIComponent(q)}`);
export const fileUrl = (env, type, n, name) => `/api/${env}/${type}/${n}/files/${encodeURIComponent(name)}`;
