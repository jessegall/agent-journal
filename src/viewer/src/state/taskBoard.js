import {kept, remembered} from "../platform/storage.js";
import {reactive} from "vue";

const DISPLAY_KEY = "journal.tasks.display";

// The tasks dialog as the user left it: the view, the task in the inspector, the filter, the folded groups and the new task being written.
export const taskBoard = reactive({
    view: "list",
    selected: 0,
    inspecting: false,
    statuses: [],
    words: "",
    folded: {},
    unfolded: {},
    draft: null,
    display: remembered(DISPLAY_KEY, {grouping: "plan", showDone: false, number: true, wait: true}),
});

kept(DISPLAY_KEY, () => taskBoard.display);
