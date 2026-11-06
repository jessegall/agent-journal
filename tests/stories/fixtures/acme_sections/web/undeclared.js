import {h, ref} from "vue";
import {InspectorPart, useWindow} from "@journal/window-kit";

// reads a line it never declared and draws the refusal
export default {
    setup() {
        const context = useWindow();
        const failure = ref("");
        context.read("task list").then((answer) => (failure.value = answer.error));
        return () => h(InspectorPart, {title: "Undeclared"}, () => h("p", {role: "alert", "data-section-refusal": ""}, failure.value));
    },
};
