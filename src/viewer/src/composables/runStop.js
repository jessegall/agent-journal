import {computed, ref} from "vue";
import {meta} from "../domain/tables.js";
import {capitalised} from "../format/sentence.js";
import {useScope} from "./scope.js";

const STOPPING_MS = 700;

// The stop of a run from the chat, where its card names a run the journal can stop: a check's, or a watched command's output, whose
// process group is killed. Stopping, the run says so for a moment, and then that the user stopped it, at the figure it had reached
export function useRunStop(card) {
    const scope = useScope();
    const phase = ref("");
    const reached = ref("");
    const target = computed(() => {
        if (card().check) return {table: "checks", id: card().check};
        return card().output ? {table: "outputs", id: card().output} : null;
    });
    // a check by its title, a watched output by the command it runs
    const named = computed(() => {
        const {table, id} = target.value;
        if (table === "outputs") return `command ${card().line || id}`;
        const row = (scope.rows(table) || []).find((r) => r.id === id);
        return `${meta(table).title.toLowerCase()} ${row?.title || id}`;
    });
    const stoppable = computed(() => Boolean(target.value) && !card().ending && !phase.value);
    const what = computed(() => (target.value ? `the ${named.value}` : ""));
    const title = computed(() => (target.value ? `${capitalised(named.value)} stopped by you` : ""));
    const line = computed(() => `${title.value}${reached.value ? ` at ${reached.value}` : ""}`);

    function stop() {
        const {table, id} = target.value;
        reached.value = card().count || card().figure || "";
        phase.value = "stopping";
        const settle = setTimeout(() => (phase.value = "stopped"), STOPPING_MS);
        scope.api.act(table, id, "stop").catch(() => {
            clearTimeout(settle);
            phase.value = "";
        });
    }

    return {stoppable, what, phase, title, line, stop};
}
