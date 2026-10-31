import {rowsOf} from "../domain/plans.js";
import {watchEffect} from "vue";
import {holding, rows} from "../sync/rows.js";
import {wholePlans} from "./wholePlans.js";
import {wholeTasks} from "./wholeTasks.js";

// Read the rows of these ids the viewer does not hold yet.
function held(table, ids) {
    const known = new Set(rows(table).map((row) => row.id));
    const missing = [...new Set(ids.filter((id) => id && !known.has(id)))];
    if (missing.length) holding(table, missing).catch((error) => console.error(error));
}

// The tasks of these plans, read whole since only a task read by id names its worker, and the workers holding them; a plan held as a list row alone names no tasks, so it is read whole first.
export function usePlanRows(plans) {
    const planTasks = () => {
        const ids = new Set(plans().flatMap(rowsOf));
        return rows("tasks").filter((t) => ids.has(t.id));
    };
    wholePlans(() => plans().map((p) => p.id));
    wholeTasks(planTasks);
    watchEffect(() => held("tasks", plans().flatMap(rowsOf)));
    watchEffect(() => held("workers", planTasks().map((t) => t.worker_id)));
}
