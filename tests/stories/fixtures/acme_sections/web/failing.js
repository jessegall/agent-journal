import {h, ref} from "vue";
import {InspectorPart, useWindow} from "@journal/window-kit";

// reads a plan that does not exist and draws the failure it is answered with
export default {
    setup() {
        const context = useWindow();
        const failure = ref("");
        context.read("plan show 99999").then((answer) => (failure.value = answer.error));
        return () => h(InspectorPart, {title: "Failing"}, () => h("p", {role: "alert", "data-section-failure": ""}, failure.value));
    },
};
