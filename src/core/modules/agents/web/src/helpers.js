import {h} from "vue";
import AgentRows from "./AgentRows.vue";

const TEXTS = {
    running: {title: "No helpers working", hint: "Helpers with a running process appear here."},
    idle: {title: "No helpers idle", hint: "Kept helpers whose process has stopped appear here."},
    retired: {title: "No helpers retired", hint: "Retired helpers appear here."},
    all: {title: "No helpers yet", hint: "Helpers started by the agent appear here."},
};

// every agent working for the main one, whatever its role, each as the agents window's card
export default {render: () => h(AgentRows, {line: "agent cards", empty: "No helpers yet", texts: TEXTS})};
