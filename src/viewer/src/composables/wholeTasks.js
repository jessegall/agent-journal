import {watch} from "vue";
import {isClosed} from "../domain/row.js";
import {wholeRows} from "../sync/rows.js";

// Reads whole, in one request, the open tasks a list shows that the viewer holds as list rows alone, since a task's plan comes with a task read by id.
export function wholeTasks(tasks) {
    const asked = new Set();
    watch(
        () => tasks().filter((t) => !isClosed(t) && !("plan_id" in t) && !asked.has(`${t.id}/${t.updated_at}`)),
        (summaries) => {
            if (!summaries.length) return;
            summaries.forEach((t) => asked.add(`${t.id}/${t.updated_at}`));
            wholeRows("tasks", summaries.map((t) => t.id)).catch((error) => console.error(error));
        },
        {immediate: true}
    );
}
