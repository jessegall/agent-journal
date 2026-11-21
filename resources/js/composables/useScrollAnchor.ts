import { nextTick, watch } from 'vue';
import type { Ref } from 'vue';

/**
 * Keeps a list where the user scrolled it when its rows change: the first row in view stays at the same height, even
 * when a row above it grows, shrinks or leaves. A list scrolled to its top stays at its top. The list turns the
 * browser's own anchoring off, which not every browser has, so the two never move it twice.
 */
export function useScrollAnchor(list: Ref<HTMLElement | null>, rows: () => unknown): void {
    watch(
        rows,
        async () => {
            const scroller = scrollerOf(list.value);
            const anchor = scroller === undefined ? undefined : firstRowInView(list.value, scroller);

            if (scroller === undefined || anchor === undefined) {
                return;
            }

            const before = anchor.getBoundingClientRect().top;
            await nextTick();

            if (anchor.isConnected) {
                scroller.scrollTop += anchor.getBoundingClientRect().top - before;
            }
        },
        { flush: 'pre' },
    );
}

/**
 * The nearest ancestor that scrolls the list and is scrolled away from its top; none when the list sits at its top.
 */
function scrollerOf(list: HTMLElement | null): HTMLElement | undefined {
    let parent = list?.parentElement ?? null;

    while (parent !== null) {
        const overflow = getComputedStyle(parent).overflowY;

        if ((overflow === 'auto' || overflow === 'scroll') && parent.scrollTop > 0) {
            return parent;
        }

        parent = parent.parentElement;
    }

    return undefined;
}

function firstRowInView(list: HTMLElement | null, scroller: HTMLElement): HTMLElement | undefined {
    const top = scroller.getBoundingClientRect().top;

    return Array.from(list?.children ?? []).find(
        (row): row is HTMLElement => row instanceof HTMLElement && row.getBoundingClientRect().bottom > top,
    );
}
