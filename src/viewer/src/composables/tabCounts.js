import {ref, watchEffect} from "vue";
import {lineResult} from "../windows/windowContext.js";

// a count line is the window's list line: a paged answer says its total, an unpaged one holds every row
const listCount = (answer) => ({count: "total" in answer ? answer.total : answer.rows.length, warm: false});

// the number on each open window's tab and sidebar row: its count line, run for the window when it opens and again on
// each event it declares, kept as {count, warm}
export function useTabCounts({catalogue, subscriptions, environment, names}) {
    const counts = ref({});
    const following = new Set();

    async function refresh(entry) {
        const answer = await lineResult(entry.name, entry.count, environment);
        if (answer.ok) counts.value = {...counts.value, [entry.name]: listCount(answer.value)};
    }

    watchEffect(() => {
        for (const name of names()) {
            const entry = catalogue.window(name);
            if (!entry?.count || following.has(name)) continue;
            following.add(name);
            subscriptions.follow(`${name}:count`, entry.events, () => refresh(entry));
            refresh(entry);
        }
    });

    return {counts};
}
