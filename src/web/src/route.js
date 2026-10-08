import {computed, ref} from "vue";

const hash = ref(location.hash);
window.addEventListener("hashchange", () => {
    hash.value = location.hash;
});

export const route = computed(() => {
    const [path, query = ""] = hash.value.replace(/^#\/?/, "").split("?");
    const [env = "", page = "", n = ""] = path.split("/");
    const params = new URLSearchParams(query);
    const stack = (params.get("open") || "")
        .split(",")
        .filter(Boolean)
        .map((entry) => {
            const [part, env = ""] = entry.split("@");
            const [type = "", n = "", comment = ""] = part.split(":");
            return {type, n: Number(n), comment: Number(comment) || 0, env};
        });
    return {
        env,
        page,
        n: n ? (/^\d+$/.test(n) ? Number(n) : n) : 0,
        q: params.get("q") || "",
        sub: params.get("sub") || "",
        plugin: params.get("plugin") || "",
        line: Number(params.get("line") || 0),
        at: params.get("at") || "",
        stack,
        open: stack[stack.length - 1] || null,
    };
});

export const href = {
    page: (env, page = "", n = 0, q = "") =>
        `#/${env}${page ? `/${page}` : ""}${n ? `/${n}` : ""}${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    file: (env, path, line = 0, sub = "") =>
        `#/${env}/file?q=${encodeURIComponent(path)}${line ? `&line=${line}` : ""}${sub ? `&sub=${sub}` : ""}`,
    commit: (env, sha) => `#/${env}/commit/${sha}`,
    pluginPage: (env, page) => `#/${env}/page/${page.plugin}.${page.name}`,
    organization: (env, domain = "") => `#/${env}/organization${domain ? `/${domain}` : ""}`,
    reportUpdates: (env) => `#/${env}/report?sub=updates`,
    opened: (env, page, ref) => `${href.page(env, page)}?open=${ref}`,
};

export function go(env, page = "", n = 0, q = "") {
    location.hash = href.page(env, page, n, q);
}

export function showFile(env, path, line = 0) {
    location.hash = href.file(env, path, line);
}

const entry = (open) => `${open.type}:${open.n}${open.comment ? `:${open.comment}` : ""}${open.env ? `@${open.env}` : ""}`;

export function opening(stack, sub = "") {
    const [path, query = ""] = location.hash.replace(/^#/, "").split("?");
    const kept = [...new URLSearchParams(query)].filter(([key]) => key !== "open" && key !== "sub").map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
    const parts = [...kept, ...(stack.length ? [`open=${stack.map(entry).join(",")}`] : []), ...(sub ? [`sub=${sub}`] : [])].join("&");
    location.replace(`#${path}${parts ? `?${parts}` : ""}`);
}

const inChat = {};

export function openInChat(type, open) {
    inChat[type] = open;
    return () => inChat[type] === open && delete inChat[type];
}

export function peek(type, n, comment = 0, sub = "") {
    if (type === "plugin") return (location.hash = `#/${route.value.env}/plugins?plugin=${n}`);
    if (!comment && !sub && inChat[type]?.(n)) return;
    const stack = route.value.stack;
    const at = stack.findIndex((open) => open.type === type && open.n === n);
    opening([...(at < 0 ? stack : stack.slice(0, at)), {type, n, comment}], sub);
}

export function peekThere(env, type, n, comment = 0, sub = "") {
    if (env === route.value.env) return peek(type, n, comment, sub);
    const stack = route.value.stack;
    const at = stack.findIndex((open) => open.type === type && open.n === n && open.env === env);
    opening([...(at < 0 ? stack : stack.slice(0, at)), {type, n, comment, env}], sub);
}

export function peekRef(ref) {
    const [row, env] = ref.split("@");
    const [type, n] = row.split(":");
    return env ? peekThere(env, type, Number(n)) : peek(type, Number(n));
}

export function chipTarget(event) {
    const chip = event.target.closest("[data-peek]");
    if (!chip) return "";
    event.preventDefault();
    event.stopPropagation();
    return chip.dataset.peek;
}

export function peekChip(event) {
    const target = chipTarget(event);
    if (target) peekRef(target);
}

export function swap(type, n) {
    opening([...route.value.stack.slice(0, -1), {type, n, comment: 0}]);
}

export function showSession(sub) {
    const [path, query = ""] = location.hash.replace(/^#/, "").split("?");
    const params = new URLSearchParams(query);
    if (sub) params.set("sub", sub);
    else params.delete("sub");
    const rest = params.toString().replace(/%3A/g, ":");
    location.replace(`#${path}${rest ? `?${rest}` : ""}`);
}

export function unpeek() {
    opening(route.value.stack.slice(0, -1));
}

export const PAGES = [
    "settings",
    "search",
    "files",
    "commit",
    "skills",
    "plugins",
    "page",
    "hub",
    "file",
    "kanban",
    "organization",
    "resources",
    "about",
];
