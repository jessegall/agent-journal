import {h} from "vue";
import AgentRows from "./AgentRows.vue";

const TEXTS = {
    running: {title: "No agents running", hint: "An agent shows here while it works."},
    idle: {title: "No agents idle", hint: "Agents ready for another job show here."},
    retired: {title: "No agents retired", hint: "Agents that will not be used again show here."},
    all: {title: "No agents yet", hint: "The agents and subagents the main agent sends show here."},
};

export default {render: () => h(AgentRows, {line: "agent cards", empty: "No agents yet", texts: TEXTS})};
