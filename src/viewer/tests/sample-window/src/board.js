import {defineComponent, h} from "vue";
import {EmptyState, useWindow} from "@journal/window-kit";

export default defineComponent({
    setup() {
        const view = useWindow();
        return () => h(EmptyState, {title: `Board of ${view.window}`});
    },
});
