import {h} from "vue";
import AgentRows from "./AgentRows.vue";

const TEXTS = {
    running: {title: "No agents running", hint: "A worker or a subagent shows here while it works."},
    closed: {title: "No agent has ended yet", hint: "A worker or a subagent that finished or was stopped shows here."},
    all: {title: "No agents yet", hint: "The workers and subagents the main agent sends show here."},
};

export default {render: () => h(AgentRows, {line: "agent cards --helpers", empty: "No agents yet", texts: TEXTS})};
