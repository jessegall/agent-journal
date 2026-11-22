import type { DropTarget } from './dropPreviewBox';

export type CompassTarget = Exclude<DropTarget, 'strip'>;
export type Point = { x: number; y: number };

const CELL = 26;
const CELL_GAP = 3;
const PITCH = CELL + CELL_GAP;
const HIT_RADIUS = 14;

/** Where each compass cell sits from the centre, in cell pitches, and the menu item that reaches the same target. */
export const compassTargets: Record<CompassTarget, { column: number; row: number; menuLabel: string }> = {
    center: { column: 1, row: 1, menuLabel: 'Join pane' },
    left: { column: 0, row: 1, menuLabel: 'Dock left' },
    right: { column: 2, row: 1, menuLabel: 'Dock right' },
    up: { column: 1, row: 0, menuLabel: 'Dock top' },
    down: { column: 1, row: 2, menuLabel: 'Dock bottom' },
};

export const compassSize = CELL * 3 + CELL_GAP * 2;

/** The target the pointer aims at: within 14px of a cell's point, 29px from the centre for a side. Null elsewhere. */
export function compassTargetAt(pointer: Point, center: Point): CompassTarget | null {
    const names = Object.keys(compassTargets) as CompassTarget[];

    return (
        names.find((name) => {
            const { column, row } = compassTargets[name];
            const cell = { x: center.x + (column - 1) * PITCH, y: center.y + (row - 1) * PITCH };

            return Math.hypot(pointer.x - cell.x, pointer.y - cell.y) <= HIT_RADIUS;
        }) ?? null
    );
}
