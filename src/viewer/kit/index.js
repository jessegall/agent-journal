export {default as EmptyState} from "../src/kit/EmptyState.vue";
export {default as Btn} from "../src/kit/Btn.vue";
export {default as CloseButton} from "../src/kit/CloseButton.vue";
export {default as RowList} from "./RowList.vue";
export {default as StateRows} from "./StateRows.vue";
export {useRows} from "./useRows.js";
export {WINDOW_CONTEXT, useWindow} from "./windowContextKey.js";

// the kit's own version: a breaking change to the window context, or a new Vue minor version, is a new major version
export const KIT_VERSION = "1.0.0";
export const KIT_VUE = "3.5";
