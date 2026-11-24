import { onBeforeUnmount } from 'vue';
import { detachWindow, dropWindow } from '@/components/panes/arrangement';
import type { DropTarget } from '@/components/panes/arrangement';
import { panesIn, zoneAt } from '@/components/panes/paneLayout';
import { usePaneLayout } from './usePaneLayout';

/**
 * Dragging a window by its tab, or from the add bar, as version 5 does (composables/paneDrag.js): a press that moves
 * less than 6 px is a click; past that a ghost follows the pointer, aimed at a tab strip, a pane's zone, or outside
 * every pane, which detaches the window. Escape drops nothing.
 */
const DRAG_THRESHOLD = 6;

export function useWindowDrag(): {
    grab: (
        event: PointerEvent,
        windowKey: string,
        fromPaneId: string | null,
        onClick: () => void,
    ) => void;
    grabToAdd: (add: (key: string) => void) => (event: PointerEvent, key: string) => void;
} {
    const store = usePaneLayout();
    let release: (() => void) | null = null;

    function aimAtTabs(
        x: number,
        y: number,
        windowKey: string,
        fromPaneId: string | null,
    ): DropTarget | null | undefined {
        for (const strip of document.querySelectorAll<HTMLElement>(
            '[data-tabs-of]',
        )) {
            const box = strip.getBoundingClientRect();

            if (
                x < box.left ||
                x > box.right ||
                y < box.top ||
                y > box.bottom
            ) {
                continue;
            }

            const paneId = strip.dataset.tabsOf ?? '';
            const pane = panesIn(store.layout.value).find(
                (each) => each.id === paneId,
            );

            if (paneId === fromPaneId && pane?.windows.length === 1) {
                return null;
            }

            const place = [...strip.querySelectorAll<HTMLElement>('[data-tab]')]
                .filter((tab) => tab.dataset.tab !== windowKey)
                .filter((tab) => {
                    const tabBox = tab.getBoundingClientRect();

                    return tabBox.left + tabBox.width / 2 < x;
                }).length;

            return { paneId, zone: 'tabs', place };
        }

        return undefined;
    }

    function aim(
        x: number,
        y: number,
        windowKey: string,
        fromPaneId: string | null,
    ): DropTarget | 'detach' | null {
        const onTabs = aimAtTabs(x, y, windowKey, fromPaneId);

        if (onTabs !== undefined) {
            return onTabs;
        }

        for (const section of document.querySelectorAll<HTMLElement>(
            '[data-pane-id]',
        )) {
            const box = section.getBoundingClientRect();

            if (
                x < box.left ||
                x > box.right ||
                y < box.top ||
                y > box.bottom
            ) {
                continue;
            }

            const paneId = section.dataset.paneId ?? '';
            const pane = panesIn(store.layout.value).find(
                (each) => each.id === paneId,
            );
            const zone = zoneAt(box, x, y, (pane?.windows.length ?? 0) > 0);

            if (
                paneId === fromPaneId &&
                (zone === 'centre' || pane?.windows.length === 1)
            ) {
                return null;
            }

            return { paneId, zone };
        }

        return 'detach';
    }

    function land(
        windowKey: string,
        fromPaneId: string | null,
        target: DropTarget | 'detach',
        x: number,
        y: number,
    ): void {
        if (target === 'detach') {
            store.apply(
                detachWindow(
                    store.arrangement.value,
                    windowKey,
                    { left: x - 40, top: y - 12 },
                    store.screen(),
                ),
            );

            return;
        }

        const pane = panesIn(store.layout.value).find(
            (each) => each.id === target.paneId,
        );

        const dropsNewWindowOnFullPane =
            fromPaneId === null &&
            target.zone === 'centre' &&
            pane !== undefined &&
            pane.windows.length > 0;

        if (dropsNewWindowOnFullPane) {
            store.splitOffer.value = { paneId: target.paneId, windowKey };

            return;
        }

        store.apply(dropWindow(store.arrangement.value, windowKey, target));
    }

    function grab(
        event: PointerEvent,
        windowKey: string,
        fromPaneId: string | null,
        onClick: () => void,
    ): void {
        if (event.button !== 0) {
            return;
        }

        event.preventDefault();
        const start = { x: event.clientX, y: event.clientY };
        let isMoving = false;

        const move = (moved: PointerEvent): void => {
            if (
                !isMoving &&
                Math.abs(moved.clientX - start.x) +
                    Math.abs(moved.clientY - start.y) <
                    DRAG_THRESHOLD
            ) {
                return;
            }

            isMoving = true;
            document.body.classList.add('dragging-window');
            store.drag.value = {
                windowKey,
                fromPaneId,
                x: moved.clientX,
                y: moved.clientY,
                target: aim(
                    moved.clientX,
                    moved.clientY,
                    windowKey,
                    fromPaneId,
                ),
            };
        };

        const end = (): void => {
            window.removeEventListener('pointermove', move);
            window.removeEventListener('pointerup', up);
            window.removeEventListener('pointercancel', end);
            window.removeEventListener('keydown', escape);
            document.body.classList.remove('dragging-window');
            store.drag.value = null;
            release = null;
        };

        const up = (lifted: PointerEvent): void => {
            const target = isMoving
                ? aim(lifted.clientX, lifted.clientY, windowKey, fromPaneId)
                : null;
            end();

            if (!isMoving) {
                onClick();

                return;
            }

            if (target !== null) {
                land(
                    windowKey,
                    fromPaneId,
                    target,
                    lifted.clientX,
                    lifted.clientY,
                );
            }
        };

        const escape = (pressed: KeyboardEvent): void => {
            if (pressed.key === 'Escape') {
                end();
            }
        };

        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
        window.addEventListener('pointercancel', end);
        window.addEventListener('keydown', escape);
        release = end;
    }

    onBeforeUnmount(() => release?.());

    /**
     * The grab of a window from the add menu: a click adds it, a drag places it where it is dropped.
     */
    function grabToAdd(add: (key: string) => void): (event: PointerEvent, key: string) => void {
        return (event, key) => grab(event, key, null, () => add(key));
    }

    return { grab, grabToAdd };
}
