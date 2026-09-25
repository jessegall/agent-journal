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
        line: Number(params.get("line") || 0),
        at: params.get("at") || "",
        stack,
        open: stack[stack.length - 1] || null,
    };
});

export function go(env, page = "", n = 0, q = "") {
    location.hash = `#/${env}${page ? `/${page}` : ""}${n ? `/${n}` : ""}${q ? `?q=${encodeURIComponent(q)}` : ""}`;
}

export function showFile(env, path, line = 0) {
    location.hash = `#/${env}/file?q=${encodeURIComponent(path)}${line ? `&line=${line}` : ""}`;
}

const entry = (open) => `${open.type}:${open.n}${open.comment ? `:${open.comment}` : ""}${open.env ? `@${open.env}` : ""}`;

function opening(stack, sub = "") {
    const [path] = location.hash.replace(/^#/, "").split("?");
    location.replace(`#${path}${stack.length ? `?open=${stack.map(entry).join(",")}` : ""}${sub ? `&sub=${sub}` : ""}`);
}

const inChat = {};

export function openInChat(type, open) {
    inChat[type] = open;
    return () => inChat[type] === open && delete inChat[type];
}

export function peek(type, n, comment = 0, sub = "") {
    if (!comment && !sub && inChat[type]?.(n)) return;
    const stack = route.value.stack;
    const at = stack.findIndex((open) => open.type === type && open.n === n);
    opening([...(at < 0 ? stack : stack.slice(0, at)), {type, n, comment}], sub);
}

export function peekThere(env, type, n) {
    if (env === route.value.env) return peek(type, n);
    const stack = route.value.stack;
    const at = stack.findIndex((open) => open.type === type && open.n === n && open.env === env);
    opening([...(at < 0 ? stack : stack.slice(0, at)), {type, n, comment: 0, env}]);
}

export function peekIn(env, type, n, sub = "") {
    location.hash = `#/${env}?open=${type}:${n}${sub ? `&sub=${sub}` : ""}`;
}

export function peekRef(ref) {
    const [type, n] = ref.split(":");
    peek(type, Number(n));
}

export function peekChip(e) {
    const chip = e.target.closest("[data-peek]");
    if (!chip) return;
    e.preventDefault();
    e.stopPropagation();
    peekRef(chip.dataset.peek);
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
