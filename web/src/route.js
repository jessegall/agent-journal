import {computed, ref} from "vue";

const hash = ref(location.hash);
window.addEventListener("hashchange", () => {
    hash.value = location.hash;
});

export const route = computed(() => {
    const [path, query = ""] = hash.value.replace(/^#\/?/, "").split("?");
    const [env = "", page = "", n = ""] = path.split("/");
    const params = new URLSearchParams(query);
    const [openType = "", openN = "", openComment = ""] = (params.get("open") || "").split(":");
    return {
        env,
        page,
        n: n ? (/^\d+$/.test(n) ? Number(n) : n) : 0,
        q: params.get("q") || "",
        open: openType ? {type: openType, n: Number(openN), comment: Number(openComment) || 0} : null,
    };
});

export function go(env, page = "", n = 0, q = "") {
    location.hash = `#/${env}${page ? `/${page}` : ""}${n ? `/${n}` : ""}${q ? `?q=${encodeURIComponent(q)}` : ""}`;
}

export function peek(type, n, comment = 0) {
    const [path] = location.hash.replace(/^#/, "").split("?");
    location.hash = `#${path}?open=${type}:${n}${comment ? `:${comment}` : ""}`;
}

export function unpeek() {
    const [path] = location.hash.replace(/^#/, "").split("?");
    location.hash = `#${path}`;
}
