import type { Ref } from 'vue';
import { onBeforeUnmount, watch } from 'vue';
import type { TerminalControlHandle } from './useTerminalControl';

/**
 * How long the terminal area's size must hold still before the controlling view sends it.
 */
const SETTLE_MILLISECONDS = 250;

/**
 * The rows and columns of monospaced cells that fit the area, measured with one cell of the screen's own font.
 */
function cellsOf(area: HTMLElement): { rows: number; columns: number } {
    const probe = document.createElement('span');
    probe.textContent = 'M';
    probe.className = 'font-mono leading-tight';
    probe.style.visibility = 'hidden';
    probe.style.position = 'absolute';
    area.appendChild(probe);
    const cell = probe.getBoundingClientRect();
    probe.remove();
    const box = area.getBoundingClientRect();

    return {
        rows: Math.max(1, Math.floor(box.height / Math.max(1, cell.height))),
        columns: Math.max(1, Math.floor(box.width / Math.max(1, cell.width))),
    };
}

/**
 * While this view holds control, gives the session the size of its terminal area once the size settled; a view
 * that only watches never resizes and its screen scrolls inside the area instead. Giving back stops observing.
 */
export function useTerminalResize(area: Ref<HTMLElement | null>, control: TerminalControlHandle): void {
    let observer: ResizeObserver | null = null;
    let settle = 0;
    let sent = '';

    function stop(): void {
        observer?.disconnect();
        observer = null;
        window.clearTimeout(settle);
        sent = '';
    }

    function sizeChanged(): void {
        window.clearTimeout(settle);
        settle = window.setTimeout(() => {
            if (area.value === null) {
                return;
            }
            const { rows, columns } = cellsOf(area.value);
            const size = `${rows}x${columns}`;

            if (size === sent) {
                return;
            }
            sent = size;
            void control.resize(rows, columns);
        }, SETTLE_MILLISECONDS);
    }

    watch(
        () => control.view.value.state === 'controlling' && area.value !== null,
        (observing) => {
            stop();

            if (!observing || area.value === null) {
                return;
            }
            observer = new ResizeObserver(sizeChanged);
            observer.observe(area.value);
        },
        { immediate: true },
    );

    onBeforeUnmount(stop);
}
