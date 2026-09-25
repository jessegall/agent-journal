import {computed} from "vue";
import {route} from "../route.js";
import {rows} from "../sync/rows.js";

const runsOf = (s) =>
    Object.entries(s.data.runs || {})
        .map(([key, run]) => ({
            sequence: s,
            env: key.split("|")[0],
            about: key.split("|").slice(1).join("|"),
            step: run.step,
            at: run.at,
            titles: run.titles || s.sections.map((part) => part.title),
        }))
        .filter((r) => r.env === route.value.env);

const inHand = computed(() =>
    rows("sequence")
        .filter((s) => !s.deleted && !s.completed)
        .flatMap(runsOf)
        .reduce((first, r) => (!first || r.at < first.at ? r : first), null)
);

export function useRuns(resource) {
    return computed(() =>
        (resource().type === "sequence" ? [resource()] : rows("sequence").filter((s) => !s.deleted))
            .flatMap(runsOf)
            .filter((r) => resource().type === "sequence" || r.about === resource().ref)
            .map((r) => ({...r, waiting: !!inHand.value && inHand.value.at !== r.at}))
    );
}

export function useBeingWritten(resource) {
    const runs = useRuns(resource);
    return computed(() => resource().type !== "sequence" && runs.value.length > 0);
}

export function useStepAbout(refs) {
    return computed(() => {
        const run = rows("sequence")
            .filter((s) => !s.deleted)
            .flatMap(runsOf)
            .filter((r) => refs().includes(r.about))
            .reduce((last, r) => (!last || r.at > last.at ? r : last), null);
        return run ? run.titles[run.step - 1] || "" : "";
    });
}
