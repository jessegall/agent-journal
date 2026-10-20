import {computed, ref, shallowRef} from "vue";
import {choose, environment} from "./state/environment.js";

const hash = ref(location.hash);
const isPage = shallowRef(null);

const RENAMED = {integrations: "mcp"};

function leaveOldAddress() {
    if (!isPage.value) return;
    const [path, query] = location.hash.replace(/^#\/?/, "").split("?");
    const [first = "", ...rest] = path.split("/");
    if (RENAMED[first]) {
        location.replace(`#/${[RENAMED[first], ...rest].join("/")}${query ? `?${query}` : ""}`);
        hash.value = location.hash;
        return;
    }
    if (!first || isPage.value(first)) return;
    choose(first);
    location.replace(`#/${rest.join("/")}${query ? `?${query}` : ""}`);
    hash.value = location.hash;
}

window.addEventListener("hashchange", () => {
    hash.value = location.hash;
    leaveOldAddress();
});

export function knowPages(test) {
    isPage.value = test;
    leaveOldAddress();
}

export const route = computed(() => {
    const [path, query = ""] = hash.value.replace(/^#\/?/, "").split("?");
    const [page = "", n = ""] = path.split("/");
    const params = new URLSearchParams(query);
    const stack = (params.get("open") || "")
        .split(",")
        .filter(Boolean)
        .map((entry) => {
            const [part, env = ""] = entry.split("@");
            const [table = "", id = "", comment = ""] = part.split(":");
            return {table, id: Number(id), comment: Number(comment) || 0, env};
        });
    return {
        env: environment.value,
        page,
        n: n ? (/^\d+$/.test(n) ? Number(n) : n) : 0,
        q: params.get("q") || "",
        sub: params.get("sub") || "",
        tab: params.get("tab") || "",
        plugin: params.get("plugin") || "",
        install: params.get("install") || "",
        line: Number(params.get("line") || 0),
        at: params.get("at") || "",
        stack,
        open: stack[stack.length - 1] || null,
    };
});

export const href = {
    page: (page = "", n = 0, q = "") => `#/${page}${n ? `/${n}` : ""}${q ? `?q=${encodeURIComponent(q)}` : ""}`,
    file: (path, line = 0, sub = "") => `#/file?q=${encodeURIComponent(path)}${line ? `&line=${line}` : ""}${sub ? `&sub=${sub}` : ""}`,
    reportUpdates: () => "#/reports?sub=updates",
    opened: (page, ref) => `${href.page(page)}?open=${ref}`,
};

export function go(page = "", n = 0, q = "") {
    location.hash = href.page(page, n, q);
}

export function goIn(env, page = "", n = 0, q = "") {
    choose(env);
    go(page, n, q);
}

export function showFile(path, line = 0, env = "") {
    if (env) choose(env);
    location.hash = href.file(path, line);
}

const entry = (open) => `${open.table}:${open.id}${open.comment ? `:${open.comment}` : ""}${open.env ? `@${open.env}` : ""}`;

export function opening(stack, sub = "") {
    const [path, query = ""] = location.hash.replace(/^#/, "").split("?");
    const kept = [...new URLSearchParams(query)]
        .filter(([key]) => key !== "open" && key !== "sub")
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`);
    const parts = [...kept, ...(stack.length ? [`open=${stack.map(entry).join(",")}`] : []), ...(sub ? [`sub=${sub}`] : [])].join("&");
    location.replace(`#${path}${parts ? `?${parts}` : ""}`);
}

const inChat = {};

export function openInChat(table, open) {
    inChat[table] = open;
    return () => inChat[table] === open && delete inChat[table];
}

export function peek(table, id, comment = 0, sub = "") {
    if (table === "plugins") return (location.hash = `#/plugins?plugin=${id}`);
    if (!comment && !sub && inChat[table]?.(id)) return;
    const stack = route.value.stack;
    const at = stack.findIndex((open) => open.table === table && open.id === id);
    opening([...(at < 0 ? stack : stack.slice(0, at)), {table, id, comment}], sub);
}

export function peekThere(env, table, id, comment = 0, sub = "") {
    if (env === route.value.env) return peek(table, id, comment, sub);
    const stack = route.value.stack;
    const at = stack.findIndex((open) => open.table === table && open.id === id && open.env === env);
    opening([...(at < 0 ? stack : stack.slice(0, at)), {table, id, comment, env}], sub);
}

const ROW_REF = /^[a-z_]+:\d+(@.+)?$/;

export const isRef = (link) => ROW_REF.test(link);

// the row ref a link to this journal's own address names with open=, or "": such a link opens in place, not in a new tab
export function refOfOwnLink(link, origin = window.location.origin) {
    if (!link.startsWith(origin)) return "";
    const open = new URL(link).searchParams.get("open") || "";
    const first = open.split(",")[0];
    return isRef(first) ? first : "";
}

export function peekRef(ref) {
    const [row, env] = ref.split("@");
    const [table, id] = row.split(":");
    return env ? peekThere(env, table, Number(id)) : peek(table, Number(id));
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

export function swap(table, id) {
    opening([...route.value.stack.slice(0, -1), {table, id, comment: 0}]);
}

export function showSession(sub) {
    const [path, query = ""] = location.hash.replace(/^#/, "").split("?");
    const params = new URLSearchParams(query);
    if (sub) params.set("sub", sub);
    else params.delete("sub");
    const rest = params.toString().replace(/%3A/g, ":");
    location.replace(`#${path}${rest ? `?${rest}` : ""}`);
}

export function showTab(tab) {
    const [path, query = ""] = location.hash.replace(/^#/, "").split("?");
    const params = new URLSearchParams(query);
    params.set("tab", tab);
    location.replace(`#${path}?${params.toString().replace(/%3A/g, ":").replace(/%2C/g, ",")}`);
}

export function unpeek() {
    opening(route.value.stack.slice(0, -1));
}

export const PAGES = ["settings", "files", "search", "attachments", "skills", "profiles", "plugins", "secrets", "mcp", "chart", "file", "resources", "about"];
