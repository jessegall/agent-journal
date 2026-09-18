import {computed, ref} from "vue";

const hash = ref(location.hash);
window.addEventListener("hashchange", () => {
    hash.value = location.hash;
});

export const route = computed(() => {
    const [path, query = ""] = hash.value.replace(/^#\/?/, "").split("?");
    const [env = "main", page = "", n = ""] = path.split("/");
    return {env, page, n: n ? Number(n) : 0, q: new URLSearchParams(query).get("q") || ""};
});

export function go(env, page = "", n = 0, q = "") {
    location.hash = `#/${env}${page ? `/${page}` : ""}${n ? `/${n}` : ""}${q ? `?q=${encodeURIComponent(q)}` : ""}`;
}
