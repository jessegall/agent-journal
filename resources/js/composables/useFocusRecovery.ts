import type { Ref } from 'vue';
import { nextTick, ref } from 'vue';

/**
 * Takes the focus back to a sensible place when what held it disappears after a read: the item now at the place the
 * removed one had, else the last one, else the pane itself; and says once, in the pane's own polite live region, what
 * happened. Every window of a pane uses this one helper, so removal behaves the same everywhere.
 */
export function useFocusRecovery(pane: Ref<HTMLElement | null>, itemSelector: string) {
    const announcement = ref('');

    async function afterRemoval(position: number, message: string): Promise<void> {
        announcement.value = message;
        await nextTick();
        const root = pane.value;

        if (root === null) {
            return;
        }

        const items = Array.from(root.querySelectorAll<HTMLElement>(itemSelector));
        const next = items[Math.min(position, items.length - 1)];

        (next ?? root).focus();
    }

    return { announcement, afterRemoval };
}
