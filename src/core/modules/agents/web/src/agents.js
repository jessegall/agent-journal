import {h} from "vue";
import AgentRows from "./AgentRows.vue";

const TEXTS = {
    running: {title: "No agents running", hint: "Active agents appear here."},
    idle: {title: "No agents idle", hint: "Agents available for another job appear here."},
    retired: {title: "No agents retired", hint: "Retired agents appear here."},
    all: {title: "No agents yet", hint: "Agents and helpers started by the main agent appear here."},
};

export default {render: () => h(AgentRows, {line: "agent cards --include-main", empty: "No agents yet", texts: TEXTS})};
