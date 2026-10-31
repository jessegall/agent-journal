import {watch} from "vue";
import {isWholePlan} from "../domain/plans.js";
import {rows, whole} from "../sync/rows.js";

// Reads whole, once each, the plans of these ids that the viewer holds as list rows alone, since a plan's phases and their task ids come with a plan read by id.
export function wholePlans(ids) {
    const asked = new Set();
    watch(
        () => ids().filter((id) => !asked.has(id) && rows("plans").some((p) => p.id === id && !isWholePlan(p))),
        (missing) =>
            missing.forEach((id) => {
                asked.add(id);
                whole("plans", id);
            }),
        {immediate: true}
    );
}
