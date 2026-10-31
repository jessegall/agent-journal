import {h} from "vue";
import {StateRows} from "@journal/window-kit";

export default {render: () => h(StateRows, {line: "task list", events: ["task.*"], empty: "No tasks yet"})};
