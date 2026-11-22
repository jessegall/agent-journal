import type { Ref } from 'vue';

const TYPE_AHEAD_RESET_MILLISECONDS = 500;
const ENABLED_ITEM = ':not(:disabled):not([aria-disabled="true"])';
const ITEM_SELECTOR = ['menuitem', 'menuitemcheckbox', 'menuitemradio']
    .map((role) => `[role="${role}"]${ENABLED_ITEM}`)
    .join(', ');

/**
 * The keyboard movement of a menu panel: Down and Up move between its enabled items and wrap, Home and End go to the
 * first and last, and typing letters moves to the next item whose text starts with them. A disabled item is skipped.
 * The panel's own keydown listener is `onKeydown`.
 */
export function useMenuKeys(panel: Ref<HTMLElement | null>) {
    let typed = '';
    let lastTypedAt = 0;

    function items(): HTMLElement[] {
        if (panel.value === null) {
            return [];
        }

        return Array.from(panel.value.querySelectorAll<HTMLElement>(ITEM_SELECTOR));
    }

    function focusAt(position: 'first' | 'last'): void {
        const shown = items();

        shown[position === 'first' ? 0 : shown.length - 1]?.focus();
    }

    function focusTyped(character: string): void {
        const now = Date.now();
        typed = now - lastTypedAt > TYPE_AHEAD_RESET_MILLISECONDS ? character : typed + character;
        lastTypedAt = now;

        const shown = items();
        const current = shown.indexOf(document.activeElement as HTMLElement);
        const ordered = [...shown.slice(current + 1), ...shown.slice(0, current + 1)];
        const wanted = typed.toLowerCase();

        ordered.find((item) => (item.textContent ?? '').trim().toLowerCase().startsWith(wanted))?.focus();
    }

    function onKeydown(event: KeyboardEvent): void {
        const shown = items();

        if (shown.length === 0) {
            return;
        }

        const current = shown.indexOf(document.activeElement as HTMLElement);
        const targets: Record<string, number> = {
            ArrowDown: current + 1,
            ArrowUp: current - 1,
            Home: 0,
            End: shown.length - 1,
        };

        if (event.key in targets) {
            event.preventDefault();
            shown[(targets[event.key] + shown.length) % shown.length].focus();

            return;
        }

        if (event.key.length === 1 && event.key !== ' ' && !event.ctrlKey && !event.metaKey && !event.altKey) {
            focusTyped(event.key);
        }
    }

    return { items, focusAt, onKeydown };
}
