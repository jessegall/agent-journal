import {h, ref, watch} from "vue";
import {InspectorPart, useWindow} from "@journal/window-kit";

// the sample section: it reads the plan it is shown for and draws its title, again when the plan changes
export default {
    setup() {
        const context = useWindow();
        const row = context.option("row");
        const title = ref("");

        async function load() {
            const answer = await context.read(`plan show ${row.value.id}`);
            title.value = answer.ok ? answer.value.title : answer.error;
        }

        watch(() => row.value.id, load, {immediate: true});
        context.follow(["plan.*"], load);
        return () => h(InspectorPart, {title: "Notes"}, () => h("p", {"data-plan-notes": ""}, `Notes on ${title.value}`));
    },
};
