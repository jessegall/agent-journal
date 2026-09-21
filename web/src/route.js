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
            const [type = "", n = "", comment = ""] = entry.split(":");
            return {type, n: Number(n), comment: Number(comment) || 0};
        });
    return {
        env,
        page,
        n: n ? (/^\d+$/.test(n) ? Number(n) : n) : 0,
        q: params.get("q") || "",
        sub: params.get("sub") || "",
        at: params.get("at") || "",
        stack,
        open: stack[stack.length - 1] || null,
    };
});

export function go(env, page = "", n = 0, q = "") {
    location.hash = `#/${env}${page ? `/${page}` : ""}${n ? `/${n}` : ""}${q ? `?q=${encodeURIComponent(q)}` : ""}`;
}

const entry = (open) => `${open.type}:${open.n}${open.comment ? `:${open.comment}` : ""}`;

function opening(stack, sub = "") {
    const [path] = location.hash.replace(/^#/, "").split("?");
    location.hash = `#${path}${stack.length ? `?open=${stack.map(entry).join(",")}` : ""}${sub ? `&sub=${sub}` : ""}`;
}

export function peek(type, n, comment = 0, sub = "") {
    const stack = route.value.stack;
    const at = stack.findIndex((open) => open.type === type && open.n === n);
    opening([...(at < 0 ? stack : stack.slice(0, at)), {type, n, comment}], sub);
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
    location.hash = `#${path}${rest ? `?${rest}` : ""}`;
}

export function unpeek() {
    opening(route.value.stack.slice(0, -1));
}
