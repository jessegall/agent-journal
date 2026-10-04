import {reactive} from "vue";
import {kept, remembered} from "../composables/remembered.js";
import {AGENT_VIEW} from "../domain/orchestra.js";

const AGENT_VIEW_KEY = "journal.agents.view";
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
});

kept(AGENT_VIEW_KEY, () => ui.agentView);
