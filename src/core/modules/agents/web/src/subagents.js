import {h} from "vue";
import AgentRows from "./AgentRows.vue";

const TEXTS = {
    running: {title: "No helpers running", hint: "A helper shows here while it works: a subagent it starts, or a reviewer."},
    idle: {title: "No helpers idle", hint: "Helpers ready for another job show here."},
    retired: {title: "No helpers retired", hint: "Helpers that will not be used again show here."},
    all: {title: "No helpers yet", hint: "The agents, subagents and reviewers the agent sends show here."},
};

// every agent working for the main one, whatever its role, each as the agents window's card
export default {render: () => h(AgentRows, {line: "agent cards --helpers", empty: "No helpers yet", texts: TEXTS})};
