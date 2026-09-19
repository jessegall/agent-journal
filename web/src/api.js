let settle = async () => {};

export function onWrite(fn) {
    settle = fn;
}

export async function api(method, path, body, base = "") {
    const res = await fetch(`${base}/api${path}`, {
        method,
        headers: {"Content-Type": "application/json"},
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const got = await res.json();
    if (!res.ok) throw new Error(got.error || res.statusText);
    if (method !== "GET" && !base) await settle();
    return got;
}

export const manifest = () => api("GET", "/manifest");
export const all = (env, type, base = "") => api("GET", `/${env}/${type}`, undefined, base);
export const show = (env, type, n) => api("GET", `/${env}/${type}/${n}`);
export const create = (env, type, body) => api("POST", `/${env}/${type}`, body);
export const act = (env, type, n, action, body = {}, base = "") => api("POST", `/${env}/${type}/${n}/${action}`, body, base);
export const readAll = (env, type, numbers) => api("POST", `/${env}/${type}/read-all`, {numbers});
export const events = (env, since = 0) => api("GET", `/${env}/events?since=${since}`);
export const settings = (env) => api("GET", `/${env}/settings`);
export const saveSettings = (env, body, base = "") => api("POST", `/${env}/settings`, body, base);
export const search = (env, q) => api("GET", `/${env}/search?q=${encodeURIComponent(q)}`);
export const fileUrl = (env, type, n, name) => `/api/${env}/${type}/${n}/files/${encodeURIComponent(name)}`;
