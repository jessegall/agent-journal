import {computed, ref} from "vue";

const hash = ref(location.hash);
window.addEventListener("hashchange", () => {
    hash.value = location.hash;
});

export const route = computed(() => {
    const [path, query = ""] = hash.value.replace(/^#\/?/, "").split("?");
    const [env = "", page = "", n = ""] = path.split("/");
    const params = new URLSearchParams(query);
    const [openType = "", openN = ""] = (params.get("open") || "").split(":");
    return {env, page, n: n ? Number(n) : 0, q: params.get("q") || "", open: openType ? {type: openType, n: Number(openN)} : null};
});

export function go(env, page = "", n = 0, q = "") {
    location.hash = `#/${env}${page ? `/${page}` : ""}${n ? `/${n}` : ""}${q ? `?q=${encodeURIComponent(q)}` : ""}`;
}

export function peek(type, n) {
    const [path] = location.hash.replace(/^#/, "").split("?");
    location.hash = `#${path}?open=${type}:${n}`;
}

export function unpeek() {
    const [path] = location.hash.replace(/^#/, "").split("?");
    location.hash = `#${path}`;
}
