import {ref, watch} from "vue";
import {remember, remembered} from "./remembered.js";

const KEY = "journal.agents.only-working";

export const onlyWorking = ref(remembered(KEY, false));
watch(onlyWorking, (on) => remember(KEY, on));
