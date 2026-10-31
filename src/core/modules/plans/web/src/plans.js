import {h} from "vue";
import {StateRows} from "@journal/window-kit";

export default {render: () => h(StateRows, {line: "plan list", events: ["plan.*", "phase.*"], empty: "No plans yet"})};
