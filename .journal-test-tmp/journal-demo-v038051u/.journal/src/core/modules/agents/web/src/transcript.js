import {h} from "vue";
import {useWindow} from "@journal/window-kit";
import TranscriptRows from "./TranscriptRows.vue";

export default {
    setup() {
        const agent = useWindow().agent;
        return () => h(TranscriptRows, {line: `agent transcript ${agent}`, agent: Number(agent)});
    },
};
