import {h} from "vue";
import {useWindow} from "@journal/window-kit";
import AgentRows from "./AgentRows.vue";

export default {
    setup() {
        const line = `agent list --parent ${useWindow().agent}`;
        return () => h(AgentRows, {line, empty: "No subagents yet"});
    },
};
