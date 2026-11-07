export const NODE = {width: 188, height: 52, gapX: 40, gapY: 12};

// each task placed by how long a chain of waits it stands on: what waits on nothing on the left, what waits on it to the right
export function taskGraphLayout(tasks, edges) {
    const waitsOn = new Map(tasks.map((task) => [task.id, []]));
    for (const [taskId, waitsOnId] of edges) waitsOn.get(taskId)?.push(waitsOnId);
    const depths = new Map();
    const depth = (id, seen = new Set()) => {
        if (depths.has(id)) return depths.get(id);
        if (seen.has(id)) return 0;
        const below = (waitsOn.get(id) ?? []).map((other) => depth(other, new Set([...seen, id])) + 1);
        const found = below.length ? Math.max(...below) : 0;
        depths.set(id, found);
        return found;
    };
    const rows = new Map();
    const nodes = tasks.map((task) => {
        const column = depth(task.id);
        const row = rows.get(column) ?? 0;
        rows.set(column, row + 1);
        return {task, x: column * (NODE.width + NODE.gapX), y: row * (NODE.height + NODE.gapY)};
    });
    const at = new Map(nodes.map((node) => [node.task.id, node]));
    const lines = edges.filter(([from, to]) => at.has(from) && at.has(to)).map(([from, to]) => ({key: `${from}-${to}`, from: at.get(to), to: at.get(from)}));
    return {
        nodes,
        lines,
        width: Math.max(0, ...nodes.map((node) => node.x + NODE.width)),
        height: Math.max(0, ...nodes.map((node) => node.y + NODE.height)),
    };
}
