import {h} from "vue";
import {ButtonSlot, useWindow} from "@journal/window-kit";

// the sample's window: it declares its own button slot and draws it for a plan, with no help from the journal's own windows
export default {
    setup() {
        const {environment} = useWindow();
        return () => h("section", {"data-findings": ""}, [
            h("p", "Acme findings"),
            h(ButtonSlot, {name: "findings.row", row: {id: 1, state: "ready"}, environment}),
        ]);
    },
};
