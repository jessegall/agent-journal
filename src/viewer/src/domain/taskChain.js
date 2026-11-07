// A task's place in what waits on what: the levels of tasks that wait on it, the nearest last, and the tasks it waits on in turn,
// from the tasks and the [task, blocker] pairs of one `task graph` read.
export function chainAround(taskId, graph) {
    const tasks = new Map(graph.tasks.map((task) => [task.id, task]));
    const waitersOf = (id) => graph.edges.filter(([, blocker]) => blocker === id).map(([waiter]) => waiter);
    const seen = new Set([taskId]);
    const above = [];
    for (let level = waitersOf(taskId); level.length; level = [...new Set(level.flatMap(waitersOf))].filter((id) => !seen.has(id))) {
        level.forEach((id) => seen.add(id));
        above.push(level.map((id) => tasks.get(id)));
    }
    const below = [];
    const blockers = new Set([taskId]);
    for (let edge = graph.edges.find(([waiter]) => waiter === taskId); edge && !blockers.has(edge[1]); edge = graph.edges.find(([waiter]) => waiter === edge[1])) {
        blockers.add(edge[1]);
        below.push(tasks.get(edge[1]));
    }
    return {above: above.reverse(), below};
}
