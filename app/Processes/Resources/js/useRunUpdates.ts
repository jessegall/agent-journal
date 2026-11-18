import type { RunSnapshotData } from '@generated/types/processes';
import { router } from '@inertiajs/vue3';
import { onBeforeUnmount, onMounted, ref, type Ref } from 'vue';

/**
 * A run update as the server broadcasts it: the run, its update number and the reading each changed part now shows.
 */
export type RunChangedUpdate = {
    runId: string;
    sequence: number;
    parts: { partRunId: string; readerRevisionId: string; assessmentId: string; offsets: Record<string, number> }[];
};

/**
 * Keeps a run page current: it remembers the last update number it applied; an update with an older number is a
 * replay and is ignored, and one that skips a number means updates were missed, so the page reloads its snapshot
 * instead of applying it. A replay's provisional reading never replaces the assessment shown until it is published.
 */
export function useRunUpdates(
    snapshot: Ref<RunSnapshotData>,
    listen: (handler: (update: RunChangedUpdate) => void) => () => void,
) {
    const applied = ref(snapshot.value.sequence);
    let stop: () => void = () => undefined;

    function reloadSnapshot(): void {
        router.reload({
            only: ['data'],
            onSuccess: () => {
                applied.value = snapshot.value.sequence;
            },
        });
    }

    function receive(update: RunChangedUpdate): void {
        if (update.runId !== snapshot.value.runId || update.sequence <= applied.value) {
            return;
        }
        if (update.sequence !== applied.value + 1) {
            reloadSnapshot();

            return;
        }
        applied.value = update.sequence;
        reloadSnapshot();
    }

    onMounted(() => {
        stop = listen(receive);
    });
    onBeforeUnmount(() => stop());

    return { applied };
}
