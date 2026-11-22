import type { TaskGraphEdge, TaskGraphNode } from '@generated/types/tasks';

/**
 * Where the graph puts its nodes: a column for each depth of waiting, so a task always stands to the right of every
 * task it waits for, and a row for each place in its column. The numbers are the canvas's own pixels.
 */
export const NODE_WIDTH = 188;
export const NODE_HEIGHT = 44;
export const COLUMN_GAP = 72;
export const ROW_GAP = 14;

export type Placement = { x: number; y: number };

/**
 * The depth of each task: 0 for one that waits for none, else one more than the deepest task it waits for. A wait that
 * would close a loop is not followed, so the depth is always found.
 */
export function depthsOf(nodes: TaskGraphNode[], edges: TaskGraphEdge[]): Record<string, number> {
    const prerequisites = new Map<string, string[]>();

    for (const edge of edges) {
        prerequisites.set(edge.dependentId, [...(prerequisites.get(edge.dependentId) ?? []), edge.prerequisiteId]);
    }

    const depths: Record<string, number> = {};
    const walking = new Set<string>();

    function depthOf(id: string): number {
        if (id in depths) {
            return depths[id];
        }

        if (walking.has(id)) {
            return 0;
        }

        walking.add(id);
        const deepest = Math.max(-1, ...(prerequisites.get(id) ?? []).map(depthOf));
        walking.delete(id);
        depths[id] = deepest + 1;

        return depths[id];
    }

    nodes.forEach((node) => depthOf(node.id));

    return depths;
}

/**
 * The node ids of each column, by depth, in the order the nodes came.
 */
export function columnsOf(nodes: TaskGraphNode[], edges: TaskGraphEdge[]): string[][] {
    const depths = depthsOf(nodes, edges);
    const columns: string[][] = [];

    for (const node of nodes) {
        const depth = depths[node.id] ?? 0;
        columns[depth] = [...(columns[depth] ?? []), node.id];
    }

    return Array.from(columns, (column) => column ?? []);
}

/**
 * The canvas position of each node and the size the canvas needs.
 */
export function layoutOf(
    nodes: TaskGraphNode[],
    edges: TaskGraphEdge[],
): { placements: Record<string, Placement>; width: number; height: number } {
    const columns = columnsOf(nodes, edges);
    const placements: Record<string, Placement> = {};

    columns.forEach((column, columnIndex) => {
        column.forEach((id, rowIndex) => {
            placements[id] = {
                x: columnIndex * (NODE_WIDTH + COLUMN_GAP),
                y: rowIndex * (NODE_HEIGHT + ROW_GAP),
            };
        });
    });

    const tallest = Math.max(0, ...columns.map((column) => column.length));

    return {
        placements,
        width: Math.max(0, columns.length * (NODE_WIDTH + COLUMN_GAP) - COLUMN_GAP),
        height: Math.max(0, tallest * (NODE_HEIGHT + ROW_GAP) - ROW_GAP),
    };
}

/**
 * The tasks reached from a task along the waits in one direction, the task itself not counted.
 */
function reachedFrom(id: string, edges: TaskGraphEdge[], from: 'prerequisiteId' | 'dependentId'): Set<string> {
    const to = from === 'prerequisiteId' ? 'dependentId' : 'prerequisiteId';
    const reached = new Set<string>();
    const pending = [id];

    while (pending.length > 0) {
        const current = pending.pop() as string;

        for (const edge of edges) {
            if (edge[from] === current && !reached.has(edge[to]) && edge[to] !== id) {
                reached.add(edge[to]);
                pending.push(edge[to]);
            }
        }
    }

    return reached;
}

/**
 * The task and everything it needs finished before it, and everything that needs it, followed both ways.
 */
export function chainOf(id: string, edges: TaskGraphEdge[]): Set<string> {
    return new Set([id, ...reachedFrom(id, edges, 'dependentId'), ...reachedFrom(id, edges, 'prerequisiteId')]);
}

/**
 * The tasks the most other tasks wait for, directly or through others; none when no task waits for another.
 */
export function bottlenecksOf(nodes: TaskGraphNode[], edges: TaskGraphEdge[]): Set<string> {
    const waitingOnIt = nodes.map((node) => ({
        id: node.id,
        count: reachedFrom(node.id, edges, 'prerequisiteId').size,
    }));
    const most = Math.max(0, ...waitingOnIt.map((entry) => entry.count));

    return new Set(most === 0 ? [] : waitingOnIt.filter((entry) => entry.count === most).map((entry) => entry.id));
}
