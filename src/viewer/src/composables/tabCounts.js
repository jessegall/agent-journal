import {ref, watchEffect} from "vue";
import {lineResult} from "../windows/windowContext.js";

// the number on each open window's tab: its count line, run for the window when it opens and again on each event it
// declares, answering {count, warm}
export function useTabCounts({catalogue, subscriptions, environment, names}) {
    const counts = ref({});
    const following = new Set();

    async function refresh(entry) {
        const answer = await lineResult(entry.name, entry.count, environment);
        if (answer.ok) counts.value = {...counts.value, [entry.name]: answer.value};
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
