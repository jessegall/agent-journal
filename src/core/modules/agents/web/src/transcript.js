import {h} from "vue";
import {useWindow} from "@journal/window-kit";
import TranscriptRows from "./TranscriptRows.vue";

export default {
    setup() {
        return () => h(TranscriptRows, {line: `agent transcript ${useWindow().agent}`});
    },
};
