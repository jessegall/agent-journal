import {h} from "vue";
import AgentRows from "./AgentRows.vue";

const TEXTS = {
    running: {title: "No agents working", hint: "Agents with work in progress appear here."},
    idle: {title: "No agents idle", hint: "Kept agents whose process has stopped appear here."},
    retired: {title: "No agents retired", hint: "Retired agents appear here."},
    all: {title: "No agents yet", hint: "Helpers started by the main agent appear here."},
};

export default {render: () => h(AgentRows, {empty: "No agents yet", texts: TEXTS})};
