import {rowsOf} from "../domain/plans.js";
import {watchEffect} from "vue";
import {holding, rows} from "../sync/rows.js";

// The tasks of these plans, read when the viewer does not hold them yet.
export function usePlanRows(plans) {
    watchEffect(() => {
        const known = new Set(rows("tasks").map((t) => t.id));
        const missing = plans()
            .flatMap(rowsOf)
            .filter((id) => !known.has(id));
        if (missing.length) holding("tasks", missing).catch((error) => console.error(error));
    });
}
