import {defineComponent, h} from "vue";
import {EmptyState, useWindow} from "@journal/window-kit";

export default defineComponent({
    setup() {
        const window = useWindow();
        return () => h(EmptyState, {text: `Board of ${window.name}`});
    },
});
