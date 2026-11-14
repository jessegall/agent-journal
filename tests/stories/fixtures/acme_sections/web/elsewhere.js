import {h} from "vue";
import {InspectorPart, useWindow} from "@journal/window-kit";

// a section on every inspector but the plan's, naming the row it is shown for
export default {
    setup() {
        const row = useWindow().option("row");
        return () => h(InspectorPart, {title: "Elsewhere"}, () => h("p", {"data-section-elsewhere": ""}, `Row ${row.value.id}`));
    },
};
