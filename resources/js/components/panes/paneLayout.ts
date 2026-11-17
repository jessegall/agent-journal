import type { IconName } from '@/components/kit/Icon.vue';

/**
 * The arrangement of Home's windows, as version 5's pane grid keeps it (panes/PaneGrid.vue): a tree whose leaves are
 * panes holding window keys as tabs, and whose inner nodes split their space in two at a ratio. Every function returns
 * a new layout and leaves the one it was given unchanged.
 */
export type Pane = {
    kind: 'pane';
    id: string;
    windows: string[];
    active: string | null;
    limitWidth: boolean;
};

export type Split = {
    kind: 'split';
    id: string;
    axis: 'row' | 'column';
    ratio: number;
    first: LayoutNode;
    second: LayoutNode;
};

export type LayoutNode = Pane | Split;

/**
 * A window a pane can hold: its key in the layout, and the title, icon and count its tab shows.
 */
export type PaneWindow = {
    key: string;
    title: string;
    icon: IconName;
    count?: number;
};

export type SplitSide = 'right' | 'below';

/** A pane is never narrower or lower than this, in pixels. */
export const SMALLEST_PANE = 140;

/** A splitter dragged this close to the middle, in pixels, settles in the middle. */
export const SNAP_DISTANCE = 14;

/** The arrow keys move a splitter by this share of its space. */
export const KEYBOARD_STEP = 0.05;

let nextId = 0;

function newId(prefix: string): string {
    nextId += 1;

    return `${prefix}-${Date.now().toString(36)}-${nextId}`;
}

export function pane(windows: string[], id: string = newId('pane')): Pane {
    return {
        kind: 'pane',
        id,
        windows,
        active: windows[0] ?? null,
        limitWidth: false,
    };
}

/**
 * Version 5's Default preset: the chat alone on the left, every other window as a tab on the right.
 */
export function defaultLayout(
    chatWindow: string,
    otherWindows: string[],
): LayoutNode {
    if (otherWindows.length === 0) {
        return pane([chatWindow], 'pane-chat');
    }

    return {
        kind: 'split',
        id: 'split-home',
        axis: 'row',
        ratio: 0.5,
        first: pane([chatWindow], 'pane-chat'),
        second: pane(otherWindows, 'pane-windows'),
    };
}

/**
 * The ratio a splitter ends at when dragged to the given ratio over a space of the given size: never leaving a pane
 * below the smallest size, and snapping to the middle when it comes close.
 */
export function settledRatio(ratio: number, spaceSize: number): number {
    if (spaceSize <= SMALLEST_PANE * 2) {
        return 0.5;
    }

    const smallest = SMALLEST_PANE / spaceSize;
    const clamped = Math.min(Math.max(ratio, smallest), 1 - smallest);

    return Math.abs(clamped - 0.5) * spaceSize <= SNAP_DISTANCE ? 0.5 : clamped;
}

export function withRatio(
    node: LayoutNode,
    splitId: string,
    ratio: number,
    spaceSize: number,
): LayoutNode {
    return mapNodes(node, (each) =>
        each.kind === 'split' && each.id === splitId
            ? { ...each, ratio: settledRatio(ratio, spaceSize) }
            : each,
    );
}

/**
 * A double-click on a splitter puts it back in the middle.
 */
export function centreSplit(node: LayoutNode, splitId: string): LayoutNode {
    return mapNodes(node, (each) =>
        each.kind === 'split' && each.id === splitId
            ? { ...each, ratio: 0.5 }
            : each,
    );
}

export function activate(
    node: LayoutNode,
    paneId: string,
    windowKey: string,
): LayoutNode {
    return mapNodes(node, (each) =>
        each.kind === 'pane' &&
        each.id === paneId &&
        each.windows.includes(windowKey)
            ? { ...each, active: windowKey }
            : each,
    );
}

/**
 * Version 5's Limit width: the pane's window keeps to a readable width in the middle of the pane, or uses it all again.
 */
export function toggleLimitWidth(node: LayoutNode, paneId: string): LayoutNode {
    return mapNodes(node, (each) =>
        each.kind === 'pane' && each.id === paneId
            ? { ...each, limitWidth: !each.limitWidth }
            : each,
    );
}

/**
 * Takes a window out of whatever pane holds it. The pane stays, empty if it was the last window, as version 5 shows
 * "Nothing is open in this pane".
 */
export function closeWindow(node: LayoutNode, windowKey: string): LayoutNode {
    return mapNodes(node, (each) => {
        if (each.kind !== 'pane' || !each.windows.includes(windowKey)) {
            return each;
        }

        const windows = each.windows.filter((key) => key !== windowKey);
        const active =
            each.active === windowKey ? (windows[0] ?? null) : each.active;

        return { ...each, windows, active };
    });
}

/**
 * Removes a pane, and the split that held it gives its whole space to the other side. The last pane cannot be removed.
 */
export function closePane(node: LayoutNode, paneId: string): LayoutNode {
    if (node.kind === 'pane') {
        return node;
    }

    if (node.first.kind === 'pane' && node.first.id === paneId) {
        return node.second;
    }

    if (node.second.kind === 'pane' && node.second.id === paneId) {
        return node.first;
    }

    return {
        ...node,
        first: closePane(node.first, paneId),
        second: closePane(node.second, paneId),
    };
}

/**
 * Moves a window into a pane as its active tab, at the given place among the tabs or last.
 */
export function moveWindow(
    node: LayoutNode,
    windowKey: string,
    paneId: string,
    place?: number,
): LayoutNode {
    return mapNodes(closeWindow(node, windowKey), (each) => {
        if (each.kind !== 'pane' || each.id !== paneId) {
            return each;
        }

        const windows = [...each.windows];
        windows.splice(place ?? windows.length, 0, windowKey);

        return { ...each, windows, active: windowKey };
    });
}

/**
 * Splits a pane in two and puts the window in the new half, to the right of it or below it.
 */
export function splitPane(
    node: LayoutNode,
    paneId: string,
    windowKey: string,
    side: SplitSide,
): LayoutNode {
    const withoutWindow = closeWindow(node, windowKey);

    return mapNodes(withoutWindow, (each) => {
        if (each.kind !== 'pane' || each.id !== paneId) {
            return each;
        }

        return {
            kind: 'split',
            id: newId('split'),
            axis: side === 'right' ? 'row' : 'column',
            ratio: 0.5,
            first: each,
            second: pane([windowKey]),
        };
    });
}

/**
 * Every window key the layout shows, in the order of its panes and tabs.
 */
export function windowsIn(node: LayoutNode): string[] {
    return node.kind === 'pane'
        ? node.windows
        : [...windowsIn(node.first), ...windowsIn(node.second)];
}

export function panesIn(node: LayoutNode): Pane[] {
    return node.kind === 'pane'
        ? [node]
        : [...panesIn(node.first), ...panesIn(node.second)];
}

function mapNodes(
    node: LayoutNode,
    change: (each: LayoutNode) => LayoutNode,
): LayoutNode {
    const changed = change(node);

    if (changed.kind === 'pane' || changed !== node) {
        return changed;
    }

    return {
        ...changed,
        first: mapNodes(changed.first, change),
        second: mapNodes(changed.second, change),
    };
}
