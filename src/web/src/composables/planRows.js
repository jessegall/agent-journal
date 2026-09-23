import {watchEffect} from "vue";
import {rowsOf} from "../layout/statusline.js";
import {holding, rows} from "../sync/rows.js";

export function usePlanRows(plans) {
    watchEffect(() => {
        const known = new Set(rows("todo").map((t) => t.n));
        const missing = plans()
            .flatMap(rowsOf)
            .filter((n) => !known.has(n));
        if (missing.length) holding("todo", missing);
    });
}
