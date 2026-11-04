import {h} from "vue";
import AgentRows from "./AgentRows.vue";

const TEXTS = {
    running: {title: "No helpers running", hint: "A helper shows here while it works: a agent the agent sends, a subagent it starts, or a reviewer."},
    closed: {title: "No helper has ended yet", hint: "A helper that finished or was stopped shows here."},
    all: {title: "No helpers yet", hint: "The agents, subagents and reviewers the agent sends show here."},
};

// every agent working for the main one, whatever its role, each as the agents window's card
export default {render: () => h(AgentRows, {line: "agent cards --helpers", empty: "No helpers yet", texts: TEXTS})};
