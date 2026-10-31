import {h} from "vue";
import AgentRows from "./AgentRows.vue";

export default {render: () => h(AgentRows, {line: "agent list", empty: "No agents yet"})};
