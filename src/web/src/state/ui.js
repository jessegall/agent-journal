import {kept, remembered} from "../platform/storage.js";
import {reactive} from "vue";
import {AGENT_VIEW} from "../domain/orchestra.js";

const AGENT_VIEW_KEY = "journal.agents.view";
const DRAFTS_KEY = "journal.drafts";
const THREAD_FEED_KEY = "journal.thread.feed";
const keptView = remembered(AGENT_VIEW_KEY, {});

export const ui = reactive({
    agentView: {
        ...AGENT_VIEW,
        ...keptView,
        states: {...AGENT_VIEW.states, ...(keptView.states || {})},
        kinds: {...AGENT_VIEW.kinds, ...(keptView.kinds || {})},
    },
    dragged: null,
    landing: null,
    lightbox: {pictures: [], at: -1},
    away: {open: false, since: 0, back: 0, left: 0, hidden: false},
    flash: {at: Date.now()},
    prefill: "",
    drafts: remembered(DRAFTS_KEY, {}),
    threadFeed: remembered(THREAD_FEED_KEY, null),
    litCard: 0,
    stopsOpen: 0,
});

kept(AGENT_VIEW_KEY, () => ui.agentView);
kept(DRAFTS_KEY, () => ui.drafts);
kept(THREAD_FEED_KEY, () => ui.threadFeed);
