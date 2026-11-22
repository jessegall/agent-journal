import {
    addPaneAtRight,
    closeWindow,
    defaultLayout,
    moveWindow,
    originalKeyOf,
    pane,
    panesIn,
    splitPane,
    windowsIn,
} from './paneLayout';
import type { DropZone, LayoutNode } from './paneLayout';

/**
 * Everything Home shows: the pane grid and the windows detached from it, floating over it in the order they are
 * stacked, the last on top. Version 5 keeps both in one layout (windows/layoutStore.js); a saved layout is this shape.
 * Every function returns a new arrangement and leaves the one it was given unchanged.
 */
export type DetachedWindow = {
    key: string;
    left: number;
    top: number;
    width: number;
    height: number;
    isMinimised: boolean;
};

export type Arrangement = {
    grid: LayoutNode;
    detached: DetachedWindow[];
};

export type Screen = { width: number; height: number };

/** A floating window's size when it opens, the size the design gives the Tasks window. */
export const DETACHED_SIZE = { width: 420, height: 330 };
/** The smallest a floating window is resized to. */
export const SMALLEST_DETACHED = { width: 260, height: 180 };
export const DETACHED_START = 80;

/** At least this much of a detached window's bar stays on screen. */
export const BAR_KEPT_ON_SCREEN = 48;

/** Where a dragged window was let go over a pane: on a zone of it, or among its tabs at a place. */
export type DropTarget =
    | { paneId: string; zone: DropZone }
    | { paneId: string; zone: 'tabs'; place: number };

export function defaultArrangement(
    firstWindow: string,
    otherWindows: string[],
): Arrangement {
    return { grid: defaultLayout(firstWindow, otherWindows), detached: [] };
}

/**
 * Day one: the first window, the chat, alone and centred at the reading width; every other window waits in the add
 * bar and opens floating where it is opened.
 */
export function firstWindowOnly(firstWindow: string): Arrangement {
    return {
        grid: { ...pane([firstWindow], 'pane-chat'), limitWidth: true },
        detached: [],
    };
}

export function sameArrangement(one: Arrangement, other: Arrangement): boolean {
    return JSON.stringify(one) === JSON.stringify(other);
}

export function shownWindows(arrangement: Arrangement): string[] {
    return [
        ...windowsIn(arrangement.grid),
        ...arrangement.detached.map((each) => each.key),
    ];
}

/**
 * Lands a dragged window: among a pane's tabs, as a pane's tab, or in a new half of a pane. A detached window lands
 * the same way and stops floating.
 */
export function dropWindow(
    arrangement: Arrangement,
    windowKey: string,
    target: DropTarget,
): Arrangement {
    if (!panesIn(arrangement.grid).some((pane) => pane.id === target.paneId)) {
        return arrangement;
    }

    const detached = arrangement.detached.filter(
        (each) => each.key !== windowKey,
    );

    if (target.zone === 'tabs') {
        return {
            grid: moveWindow(
                arrangement.grid,
                windowKey,
                target.paneId,
                target.place,
            ),
            detached,
        };
    }

    if (target.zone === 'centre') {
        return {
            grid: moveWindow(arrangement.grid, windowKey, target.paneId),
            detached,
        };
    }

    return {
        grid: splitPane(
            arrangement.grid,
            target.paneId,
            windowKey,
            target.zone,
        ),
        detached,
    };
}

/** A layout the layouts menu offers, by the name the design gives it. */
export type Preset = { name: string; arrangement: Arrangement };

/**
 * Two parts side by side (a row) or one above the other (a column); a part Home lacks drops out and leaves the other.
 */
function splitOf(
    axis: 'row' | 'column',
    ratio: number,
    first: LayoutNode | null,
    second: LayoutNode | null,
): LayoutNode | null {
    if (first === null || second === null) {
        return first ?? second;
    }

    return { type: 'split', id: `split-${windowsIn(first)[0]}`, axis, ratio, first, second };
}

/** A pane holding one window, or nothing when Home does not have that window. */
function paneOf(windowKey: string | undefined): LayoutNode | null {
    return windowKey === undefined ? null : pane([windowKey], `pane-${windowKey}`);
}

/**
 * The design's layouts, built from Home's windows in the order the domains declare them, the chat first: Just the
 * chat; A first window, the next one floating; Docked, two windows docked right while the chat keeps its reading width;
 * Windows only, the other windows in a grid. A layout that would repeat an earlier one is left out.
 */
export function designPresets(windowKeys: string[], screen: Screen): Preset[] {
    const [chat, second, third, fourth] = windowKeys;
    const dayOne = firstWindowOnly(chat);
    const chatPane = dayOne.grid;
    const docked = splitOf('row', 0.64, chatPane, splitOf('column', 0.36, paneOf(second), paneOf(third)));
    const windowsOnly = splitOf('row', 0.55, paneOf(second), splitOf('column', 0.55, paneOf(third), paneOf(fourth)));
    const candidates: Preset[] = [
        { name: 'Just the chat', arrangement: dayOne },
        ...(second === undefined
            ? []
            : [
                  {
                      name: 'A first window',
                      arrangement: floatNewWindow(dayOne, second, screen, { top: DETACHED_START, right: screen.width }),
                  },
              ]),
        ...(docked === null ? [] : [{ name: 'Docked', arrangement: { grid: docked, detached: [] } }]),
        ...(windowsOnly === null ? [] : [{ name: 'Windows only', arrangement: { grid: windowsOnly, detached: [] } }]),
    ];

    return candidates.filter((preset, index) =>
        candidates
            .slice(0, index)
            .every((earlier) => !sameArrangement(earlier.arrangement, preset.arrangement)),
    );
}

/**
 * Where the desk starts and ends on screen: below the bars, and at Home's right edge.
 */
export type DeskEdges = { top: number; right: number };

/** How far a new floating window keeps from the desk's edges, and how far each further one steps in. */
const FLOAT_MARGIN = 24;

/**
 * Opens a window that was not shown as a floating window at the desk's top right, under the bars, each further one a
 * step down and to the left, as the design floats a window where it was opened.
 */
export function floatNewWindow(
    arrangement: Arrangement,
    windowKey: string,
    screen: Screen,
    desk: DeskEdges,
): Arrangement {
    const step = arrangement.detached.length * FLOAT_MARGIN;
    const width = Math.min(DETACHED_SIZE.width, screen.width - 16);
    const place = {
        left: desk.right - width - FLOAT_MARGIN - step,
        top: desk.top + FLOAT_MARGIN + step,
    };

    return detachWindow(arrangement, windowKey, place, screen);
}

/**
 * Takes a window out of the grid and floats it at the given place, at the opening size, on top of the others.
 */
export function detachWindow(
    arrangement: Arrangement,
    windowKey: string,
    place: { left: number; top: number },
    screen: Screen,
): Arrangement {
    const window: DetachedWindow = {
        key: windowKey,
        ...place,
        width: Math.min(DETACHED_SIZE.width, screen.width - 16),
        height: Math.min(DETACHED_SIZE.height, screen.height - 16),
        isMinimised: false,
    };

    return keptOnScreen(
        {
            grid: closeWindow(arrangement.grid, windowKey),
            detached: [
                ...arrangement.detached.filter(
                    (each) => each.key !== windowKey,
                ),
                window,
            ],
        },
        screen,
    );
}

/**
 * Puts a detached window back in the grid as version 5 does: into the only pane when that pane is empty, otherwise in
 * a new pane at the right.
 */
export function dockWindow(
    arrangement: Arrangement,
    windowKey: string,
): Arrangement {
    const detached = arrangement.detached.filter(
        (each) => each.key !== windowKey,
    );
    const panes = panesIn(arrangement.grid);

    if (panes.length === 1 && panes[0].windows.length === 0) {
        return {
            grid: moveWindow(arrangement.grid, windowKey, panes[0].id),
            detached,
        };
    }

    return { grid: addPaneAtRight(arrangement.grid, windowKey), detached };
}

/**
 * Closes a detached window; it waits in the add bar again.
 */
export function closeDetached(
    arrangement: Arrangement,
    windowKey: string,
): Arrangement {
    return {
        ...arrangement,
        detached: arrangement.detached.filter((each) => each.key !== windowKey),
    };
}

export function changeDetached(
    arrangement: Arrangement,
    windowKey: string,
    change: Partial<Omit<DetachedWindow, 'key'>>,
    screen: Screen,
): Arrangement {
    return keptOnScreen(
        {
            ...arrangement,
            detached: arrangement.detached.map((each) =>
                each.key === windowKey ? { ...each, ...change } : each,
            ),
        },
        screen,
    );
}

/**
 * The detached window clicked last is drawn over the others.
 */
export function bringToFront(
    arrangement: Arrangement,
    windowKey: string,
): Arrangement {
    const window = arrangement.detached.find((each) => each.key === windowKey);

    if (!window || arrangement.detached.at(-1) === window) {
        return arrangement;
    }

    return {
        ...arrangement,
        detached: [
            ...arrangement.detached.filter((each) => each !== window),
            window,
        ],
    };
}

/**
 * Every detached window no smaller than version 5's smallest and no larger than the screen, with at least 48 px of
 * its bar on screen, so a window left outside after the browser shrinks can be reached again.
 */
export function keptOnScreen(
    arrangement: Arrangement,
    screen: Screen,
): Arrangement {
    return {
        ...arrangement,
        detached: arrangement.detached.map((each) => {
            const width = clamp(
                each.width,
                SMALLEST_DETACHED.width,
                Math.max(SMALLEST_DETACHED.width, screen.width),
            );
            const height = clamp(
                each.height,
                SMALLEST_DETACHED.height,
                Math.max(SMALLEST_DETACHED.height, screen.height),
            );

            return {
                ...each,
                width,
                height,
                left: clamp(
                    each.left,
                    BAR_KEPT_ON_SCREEN - width,
                    screen.width - BAR_KEPT_ON_SCREEN,
                ),
                top: clamp(each.top, 0, screen.height - BAR_KEPT_ON_SCREEN),
            };
        }),
    };
}

/**
 * Applies a stored or imported arrangement to the windows Home has now: a window no longer there is left out, and a
 * pane that showed it shows its next tab. Anything that is not an arrangement gives null.
 */
export function arrangementFrom(
    value: unknown,
    knownWindows: string[],
): Arrangement | null {
    if (
        !isRecord(value) ||
        !isNode(value.grid) ||
        !Array.isArray(value.detached)
    ) {
        return null;
    }

    if (!value.detached.every(isDetachedWindow)) {
        return null;
    }

    const gone = shownWindows({
        grid: value.grid,
        detached: value.detached,
    }).filter((key) => !knownWindows.includes(originalKeyOf(key)));

    return {
        grid: gone.reduce((grid, key) => closeWindow(grid, key), value.grid),
        detached: value.detached.filter((each) => !gone.includes(each.key)),
    };
}

function isNode(value: unknown): value is LayoutNode {
    if (!isRecord(value) || typeof value.id !== 'string') {
        return false;
    }

    if (value.type === 'pane') {
        return (
            Array.isArray(value.windows) &&
            value.windows.every((key) => typeof key === 'string') &&
            (value.active === null || typeof value.active === 'string') &&
            typeof value.limitWidth === 'boolean'
        );
    }

    return (
        value.type === 'split' &&
        (value.axis === 'row' || value.axis === 'column') &&
        typeof value.ratio === 'number' &&
        value.ratio > 0 &&
        value.ratio < 1 &&
        isNode(value.first) &&
        isNode(value.second)
    );
}

function isDetachedWindow(value: unknown): value is DetachedWindow {
    return (
        isRecord(value) &&
        typeof value.key === 'string' &&
        ['left', 'top', 'width', 'height'].every(
            (field) => typeof value[field] === 'number',
        ) &&
        typeof value.isMinimised === 'boolean'
    );
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
}

function clamp(value: number, smallest: number, largest: number): number {
    return Math.min(Math.max(value, smallest), largest);
}
