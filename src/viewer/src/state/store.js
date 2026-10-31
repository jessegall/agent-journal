import {reactive} from "vue";
import {kept, remembered} from "../platform/storage.js";
import {NOBODY} from "../domain/people.js";

export const store = reactive({
    spec: null,
    drafting: 0,
    quoting: null,
    dumping: false,
    dumpSelected: 0,
    dumpFiles: [],
    pane: "chat",
    skill: "",
    pluginPage: null,
    identity: null,
    rows: {},
    elsewhere: {},
    paging: {size: {}, more: {}},
    counts: {},
    entries: [],
    settings: null,
    agents: [],
    live: [],
    journals: [],
    summary: null,
    people: NOBODY,
    offline: false,
    tunnel: null,
    agentWrites: {},
    bar: null,
    streamOpen: false,
    booted: false,
    activity: remembered("journal.activity", true),
    wide: false,
    sideMini: remembered("journal.side.mini", false),
    focus: "",
    sideOpen: false,
    activityOpen: false,
});

kept("journal.activity", () => store.activity);
kept("journal.side.mini", () => store.sideMini);
