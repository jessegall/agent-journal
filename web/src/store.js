import { computed, reactive } from "vue";
import * as http from "./api.js";
import { route } from "./route.js";

export const store = reactive({ spec: null, rows: {}, events: [], settings: null, agents: [], stream: null, activity: true });

export const types = computed(() => (store.spec ? store.spec.priority.map((t) => ({ name: t, ...store.spec.types[t] })) : []));
export const navTypes = (scope) => types.value.filter((t) => t.nav && t.scope === scope);
export const meta = (type) => store.spec.types[type];
export const word = (type, method) => (meta(type).names[method] || method);
export const label = (type, field, fallback) => (meta(type).labels[field] || fallback);

export function rows(type) {
  return store.rows[type] || [];
}

export async function load(type) {
  store.rows[type] = await http.all(route.value.env, type);
  return store.rows[type];
}

export async function reload() {
  const env = route.value.env;
  const [events, settings, agents] = await Promise.all([http.events(env), http.settings(env), http.all(env, "agent")]);
  store.events = events;
  store.settings = settings;
  store.agents = agents;
  await Promise.all(Object.keys(store.rows).map(load));
}

export function listen() {
  if (store.stream) store.stream.close();
  const env = route.value.env;
  store.stream = new EventSource(`/api/${env}/stream`);
  store.stream.onmessage = () => reload();
}

export async function boot() {
  store.spec = await http.manifest();
  await Promise.all(types.value.filter((t) => t.name !== "nudge").map((t) => load(t.name)));
  await reload();
  listen();
}

export const open = (type) => rows(type).filter((r) => !r.completed);
export const unseenByUser = (type) => open(type).filter((r) => !r.seen.includes("user"));
export const agent = computed(() => [...store.agents].sort((a, b) => (b.data.at || 0) - (a.data.at || 0))[0] || null);
export const autoOn = computed(() => !!(store.settings && store.settings.features.auto));

export function age(at) {
  if (!at) return "";
  const s = Math.max(0, Date.now() / 1000 - at);
  if (s < 60) return "now";
  if (s < 3600) return `${Math.floor(s / 60)}m`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export const linkedTo = (ref) => types.value.flatMap((t) => rows(t.name).filter((r) => r.refs.includes(ref) && !r.deleted));

export function byRef(ref) {
  const [type, n] = ref.split(":");
  return rows(type).find((r) => r.n === Number(n)) || null;
}
