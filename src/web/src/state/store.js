import {computed, reactive} from "vue";
import {kept, remembered} from "../composables/remembered.js";

export const store = reactive({
    spec: null,
    drafting: 0,
    dumping: false,
    dumpShown: 0,
    dumpFiles: [],
    pane: "chat",
    skill: "",
    pluginPage: null,
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
    wide: false,
    sideMini: remembered("journal.side.mini", false),
    board: {
        lanes: [],
        agents: [],
        slots: null,
        roles: [],
        questions: [],
        drafting: {},
        expected: 0,
        planHold: "",
        loaded: false,
        lens: remembered("journal.board.lens", {plan: 0, agent: "", done: true, board: 0}),
    },
    focus: "",
    extension: {here: false, held: []},
    sideOpen: false,
    activityOpen: false,
});

kept("journal.activity", () => store.activity);
kept("journal.side.mini", () => store.sideMini);
kept("journal.board.lens", () => store.board.lens);

export const types = computed(() => (store.spec ? store.spec.priority.map((t) => ({name: t, ...store.spec.types[t]})) : []));
export const meta = (type) => store.spec.types[type];
export const word = (type, method) => meta(type).command_names[method] || method;
export const label = (type, field, fallback) => meta(type).labels[field] || fallback;
export const counted = (type, key = "open") => (store.counts && store.counts[type] && store.counts[type][key]) || 0;
const stopped = (a) => (a.data.status === "stopped" ? 1 : 0);
export const agent = computed(
    () =>
        [...store.agents].filter((a) => !a.data.parent).sort((a, b) => stopped(a) - stopped(b) || (b.data.at || 0) - (a.data.at || 0))[0] ||
        null
);
export const feedOn = computed(() => !store.settings || store.settings.features.file_feed !== false);
export const boardOn = computed(() => !store.settings || store.settings.features.kanban !== false);
export const autoOn = computed(() => !!(store.settings && store.settings.features["work_tracking.auto"]));
export const sharingOn = computed(() => !store.settings || store.settings.features.sharing !== false);
