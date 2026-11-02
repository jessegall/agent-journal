import {h} from "vue";
import AgentRows from "./AgentRows.vue";

const isHelper = (row) => row.role !== "main";

// every agent working for the main one, whatever its role, each as the agents window's card
export default {render: () => h(AgentRows, {line: "agent list", empty: "No helpers yet", only: isHelper})};
