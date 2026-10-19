import {computed} from "vue";
import {refOf} from "../domain/row.js";
import {rows} from "../sync/rows.js";

// The sequence runs in hand here: each live agent's run, with the sequence's steps.
const runs = computed(() =>
    rows("agents")
        .filter((agent) => agent.sequence && agent.status !== "stopped")
        .map((agent) => {
            const sequence = rows("sequences").find((s) => s.id === agent.sequence.sequence_id) || null;
            const titles = sequence ? sequence.steps : [];
            return {sequence, named: agent.sequence.title, opens: `sequences:${agent.sequence.sequence_id}`, about: agent.sequence.about, step: agent.sequence.step, titles, steps: titles.length, agent};
        })
);

export function useRuns(resource) {
    return computed(() =>
        runs.value.filter((r) => (resource().table === "sequences" ? r.sequence?.id === resource().id : r.about === refOf(resource()))).map((r) => ({...r, waiting: false}))
    );
}

export function useBeingWritten(resource) {
    const found = useRuns(resource);
    return computed(() => resource().table !== "sequences" && found.value.length > 0);
}
