import { computed, ref } from "vue";

const hash = ref(location.hash);
window.addEventListener("hashchange", () => { hash.value = location.hash; });

export const route = computed(() => {
  const [env = "main", type = "", n = ""] = hash.value.replace(/^#\/?/, "").split("/");
  return { env, type, n: n ? Number(n) : 0 };
});

export function go(env, type, n) {
  location.hash = `#/${env}/${type}${n ? `/${n}` : ""}`;
}
