import { computed, onBeforeUnmount, ref, watch } from 'vue';
import type { ComputedRef } from 'vue';

const POLL_MILLISECONDS = 700;
const POLL_LIMIT = 10;

/**
 * Asks again every 700 ms, ten times at most, while a window's read still waits for the project's host; each new
 * answer the window gets starts the next wait. After the tenth the window gives up and offers Retry, which starts over.
 */
export function usePendingPoll(
    answer: () => unknown,
    waits: () => boolean,
    ask: () => void,
): { gaveUp: ComputedRef<boolean>; retry: () => void; restart: () => void } {
    const polls = ref(0);
    let timer: ReturnType<typeof setTimeout> | undefined;

    const gaveUp = computed(() => waits() && polls.value >= POLL_LIMIT);

    function restart(): void {
        polls.value = 0;
    }

    function retry(): void {
        restart();
        ask();
    }

    watch(
        answer,
        () => {
            clearTimeout(timer);

            if (!waits() || gaveUp.value) {
                return;
            }

            timer = setTimeout(() => {
                polls.value += 1;
                ask();
            }, POLL_MILLISECONDS);
        },
        { immediate: true },
    );

    onBeforeUnmount(() => clearTimeout(timer));

    return { gaveUp, retry, restart };
}
