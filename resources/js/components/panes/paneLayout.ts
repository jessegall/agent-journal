import type { IconName } from '@/components/kit/Icon.vue';
import type { WindowPlace } from '@/types/generated';

/**
 * Home lays out windows in a tree. Leaves are panes that hold windows as tabs. Each split divides the available
 * space between its two children at a ratio.
 */
export type Pane = {
    type: 'pane';
    id: string;
    windows: string[];
    active: string | null;
    limitWidth: boolean;
};

export type Split = {
    type: 'split';
    id: string;
    axis: 'row' | 'column';
    ratio: number;
    first: LayoutNode;
    second: LayoutNode;
};

export type LayoutNode = Pane | Split;

/** Whether the node is the pane with that id. */
function isPane(node: LayoutNode, paneId: string): node is Pane {
    return node.type === 'pane' && node.id === paneId;
}

/** Whether the node is the split with that id. */
function isSplit(node: LayoutNode, splitId: string): node is Split {
    return node.type === 'split' && node.id === splitId;
}

/**
 * A window a pane can hold: its key in the layout, and the title, icon and count its tab shows.
 */
export type PaneWindow = {
    key: string;
    title: string;
    icon: IconName;
    count?: number;
    // Where the window sits in a work layout, when it declares a place.
    place?: WindowPlace;
};

export type SplitSide = 'left' | 'right' | 'above' | 'below';

/**
 * One choice of a pane's or a tab's menu: its words, what it does, and whether a separator starts its group.
 */
export type MenuEntry = {
    label: string;
    run: () => void;
    disabled?: boolean;
    startsGroup?: boolean;
};

/**
 * Where a dragged window lands on a pane: as a tab (centre) or in a new half on one side.
 */
export type DropZone = 'centre' | SplitSide;

/** The height of a pane's tab strip, where a drop always lands as a tab. */
export const TAB_STRIP_HEIGHT = 34;

/** A drop this close to a pane's edge, as a share of the pane, splits it on that side. */
export const EDGE_SHARE = 0.25;

/** A pane is never narrower or lower than this, in pixels. */
export const SMALLEST_PANE = 140;

/** A splitter dragged this close to the middle, in pixels, settles in the middle. */
export const SNAP_DISTANCE = 14;

/** The arrow keys move a splitter by this share of its space. */
export const KEYBOARD_STEP = 0.05;

function newId(prefix: string): string {
    return `${prefix}-${crypto.randomUUID()}`;
}

/**
 * What joins a window's key and a copy's own id in the copy's key, such as web.plans~c4f1a2b9.
 */
const COPY_MARK = '~';

/**
 * The key of the window a pane tab shows: the key itself, or for a copy the key of the window it copies.
 */
export function originalKeyOf(windowKey: string): string {
    return windowKey.split(COPY_MARK)[0];
}

/**
 * The copy's own id in its key, or null for the window itself.
 */
export function copyIdOf(windowKey: string): string | null {
    const [, copyId] = windowKey.split(COPY_MARK);

    return copyId ?? null;
}

/**
 * Opens a further copy of a window as the active tab of a pane, under a new key of its own that the copy keeps when
 * it is moved; the window it copies stays where it is.
 */
export function copyWindow(
    node: LayoutNode,
    windowKey: string,
    paneId: string,
): LayoutNode {
    return copyWindowAs(node, newCopyKey(windowKey), paneId);
}

/**
 * A new key for a further copy of a window.
 */
function newCopyKey(windowKey: string): string {
    return `${originalKeyOf(windowKey)}${COPY_MARK}${crypto.randomUUID().replaceAll('-', '').slice(0, 12)}`;
}

/**
 * Opens a further copy of a window where its kind is read: beside the copies already open, else in the largest pane
 * that holds none of the windows to keep clear of (such as the chat and the Project tree), else in a new pane at the
 * right. Answers the new layout and the copy's key.
 */
export function openCopy(
    node: LayoutNode,
    windowKey: string,
    clearOf: string[],
): { grid: LayoutNode; key: string } {
    const key = newCopyKey(windowKey);
    const original = originalKeyOf(windowKey);
    const holdsOriginal = (each: Pane) => each.windows.some((shown) => originalKeyOf(shown) === original);
    const holdsClear = (each: Pane) => each.windows.some((shown) => clearOf.includes(originalKeyOf(shown)));
    const beside = panesIn(node).find(holdsOriginal);

    if (beside !== undefined) {
        return { grid: copyWindowAs(node, key, beside.id), key };
    }

    const largest = paneBoxes(node)
        .filter((box) => !holdsClear(box.pane))
        .sort((first, second) => second.width * second.height - first.width * first.height)[0];

    if (largest !== undefined) {
        return { grid: copyWindowAs(node, key, largest.pane.id), key };
    }

    return { grid: addPaneAtRight(node, key), key };
}

function copyWindowAs(node: LayoutNode, copyKey: string, paneId: string): LayoutNode {
    return mapNodes(node, (each) => {
        if (each.type !== 'pane' || each.id !== paneId) {
            return each;
        }

        return {
            ...each,
            windows: [...each.windows, copyKey],
            active: copyKey,
        };
    });
}

export function pane(windows: string[], id: string = newId('pane')): Pane {
    return {
        type: 'pane',
        id,
        windows,
        active: windows[0] ?? null,
        limitWidth: false,
    };
}

/**
 * The default layout puts chat on the left and the other windows in tabs on the right.
 */
export function defaultLayout(
    chatWindow: string,
    otherWindows: string[],
): LayoutNode {
    if (otherWindows.length === 0) {
        return pane([chatWindow], 'pane-chat');
    }

    return {
        type: 'split',
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
        isSplit(each, splitId)
            ? { ...each, ratio: settledRatio(ratio, spaceSize) }
            : each,
    );
}

/**
 * A double-click on a splitter puts it back in the middle.
 */
export function centreSplit(node: LayoutNode, splitId: string): LayoutNode {
    return mapNodes(node, (each) =>
        isSplit(each, splitId) ? { ...each, ratio: 0.5 } : each,
    );
}

export function activate(
    node: LayoutNode,
    paneId: string,
    windowKey: string,
): LayoutNode {
    return mapNodes(node, (each) =>
        isPane(each, paneId) && each.windows.includes(windowKey)
            ? { ...each, active: windowKey }
            : each,
    );
}

/**
 * Switches the pane between centred content at a readable width and full-width content.
 */
export function toggleLimitWidth(node: LayoutNode, paneId: string): LayoutNode {
    return mapNodes(node, (each) =>
        isPane(each, paneId) ? { ...each, limitWidth: !each.limitWidth } : each,
    );
}

/**
 * Removes a window from its pane. The pane stays in the grid even when its last window closes.
 */
export function closeWindow(node: LayoutNode, windowKey: string): LayoutNode {
    return mapNodes(node, (each) => {
        if (each.type !== 'pane' || !each.windows.includes(windowKey)) {
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
    if (node.type === 'pane') {
        return node;
    }

    if (isPane(node.first, paneId)) {
        return node.second;
    }

    if (isPane(node.second, paneId)) {
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
        if (each.type !== 'pane' || each.id !== paneId) {
            return each;
        }

        const windows = [...each.windows];
        windows.splice(place ?? windows.length, 0, windowKey);

        return { ...each, windows, active: windowKey };
    });
}

/**
 * Splits a pane in two and puts the window in the new half, on the given side of it.
 */
export function splitPane(
    node: LayoutNode,
    paneId: string,
    windowKey: string,
    side: SplitSide,
): LayoutNode {
    const withoutWindow = closeWindow(node, windowKey);

    return mapNodes(withoutWindow, (each): LayoutNode => {
        if (!isPane(each, paneId)) {
            return each;
        }

        const newPane = pane([windowKey]);
        const isNewPaneFirst = side === 'left' || side === 'above';

        return {
            type: 'split',
            id: newId('split'),
            axis: side === 'left' || side === 'right' ? 'row' : 'column',
            ratio: 0.5,
            first: isNewPaneFirst ? newPane : each,
            second: isNewPaneFirst ? each : newPane,
        };
    });
}

/**
 * Puts a window in a new pane at the right of the grid.
 */
export function addPaneAtRight(
    node: LayoutNode,
    windowKey: string,
): LayoutNode {
    return {
        type: 'split',
        id: newId('split'),
        axis: 'row',
        ratio: 0.5,
        first: closeWindow(node, windowKey),
        second: pane([windowKey]),
    };
}

/**
 * A drop on the tab strip or an empty pane aims at the centre. Elsewhere, it aims at the nearest edge within a
 * quarter of the pane's size, or the centre outside that range.
 */
export function zoneAt(
    box: { left: number; top: number; width: number; height: number },
    x: number,
    y: number,
    isFilled: boolean,
): DropZone {
    if (y - box.top <= TAB_STRIP_HEIGHT || !isFilled) {
        return 'centre';
    }

    const across = (x - box.left) / box.width;
    const down =
        (y - box.top - TAB_STRIP_HEIGHT) /
        Math.max(1, box.height - TAB_STRIP_HEIGHT);
    const distances: [SplitSide, number][] = [
        ['left', across],
        ['right', 1 - across],
        ['above', down],
        ['below', 1 - down],
    ];
    const [side, distance] = distances.sort(
        (one, other) => one[1] - other[1],
    )[0];

    return distance < EDGE_SHARE ? side : 'centre';
}

/**
 * Every window key the layout shows, in the order of its panes and tabs.
 */
export function windowsIn(node: LayoutNode): string[] {
    return node.type === 'pane'
        ? node.windows
        : [...windowsIn(node.first), ...windowsIn(node.second)];
}

export function panesIn(node: LayoutNode): Pane[] {
    return node.type === 'pane'
        ? [node]
        : [...panesIn(node.first), ...panesIn(node.second)];
}

function mapNodes(
    node: LayoutNode,
    change: (each: LayoutNode) => LayoutNode,
): LayoutNode {
    const changed = change(node);

    if (changed.type === 'pane' || changed !== node) {
        return changed;
    }

    return {
        ...changed,
        first: mapNodes(changed.first, change),
        second: mapNodes(changed.second, change),
    };
}

/**
 * Every pane with the share of the grid it covers, left, top, width and height from 0 to 1, as a layout thumbnail
 * draws them.
 */
export function paneBoxes(
    node: LayoutNode,
    box = { left: 0, top: 0, width: 1, height: 1 },
): { pane: Pane; left: number; top: number; width: number; height: number }[] {
    if (node.type === 'pane') {
        return [{ pane: node, ...box }];
    }

    if (node.axis === 'row') {
        const firstWidth = box.width * node.ratio;

        return [
            ...paneBoxes(node.first, { ...box, width: firstWidth }),
            ...paneBoxes(node.second, {
                ...box,
                left: box.left + firstWidth,
                width: box.width - firstWidth,
            }),
        ];
    }

    const firstHeight = box.height * node.ratio;

    return [
        ...paneBoxes(node.first, { ...box, height: firstHeight }),
        ...paneBoxes(node.second, {
            ...box,
            top: box.top + firstHeight,
            height: box.height - firstHeight,
        }),
    ];
}
