import {computed, reactive} from "vue";
import {kept, remembered} from "../composables/remembered.js";

export const store = reactive({
    spec: null,
    identity: null,
    rows: {},
    counts: {},
    events: [],
    settings: null,
    agents: [],
    online: [],
    journals: [],
    pages: [],
    bar: null,
    stream: null,
    booted: false,
    activity: remembered("journal.activity", true),
    wide: remembered("journal.wide", false),
    focus: "",
    detached: false,
    extension: {here: false, holding: false, pending: false, everywhere: false},
    chatWindow: remembered("journal.window", {
        x: Math.max(16, window.innerWidth - 468),
        y: 84,
        w: 440,
        h: Math.min(680, Math.max(360, window.innerHeight - 140)),
    }),
});

kept("journal.activity", () => store.activity);
kept("journal.wide", () => store.wide);
kept("journal.window", () => store.chatWindow);

export const types = computed(() => (store.spec ? store.spec.priority.map((t) => ({name: t, ...store.spec.types[t]})) : []));
export const navTypes = (scope) => types.value.filter((t) => t.in_sidebar && t.scope === scope);
export const meta = (type) => store.spec.types[type];
export const word = (type, method) => meta(type).command_names[method] || method;
export const label = (type, field, fallback) => meta(type).labels[field] || fallback;
export const counted = (type, key = "open") => (store.counts && store.counts[type] && store.counts[type][key]) || 0;
export const agent = computed(
    () => [...store.agents].filter((a) => !a.data.parent).sort((a, b) => (b.data.at || 0) - (a.data.at || 0))[0] || null
);
export const autoOn = computed(() => !!(store.settings && store.settings.features["work.auto"]));
