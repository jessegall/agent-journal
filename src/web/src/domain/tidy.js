import dagre from "@dagrejs/dagre";

// A workflow laid out top down by a layered graph layout, so no two cards overlap and every line runs downward: the
// shipped drawings' hand-set places need it, and Tidy up offers it for any workflow.
const GAP = {between: 48, ranks: 44};

export function tidy(nodes, lines, {width, heightOf}) {
    const graph = new dagre.graphlib.Graph();
    graph.setGraph({rankdir: "TB", nodesep: GAP.between, ranksep: GAP.ranks, marginx: 0, marginy: 0});
    graph.setDefaultEdgeLabel(() => ({}));
    for (const node of nodes) graph.setNode(String(node.id), {width, height: heightOf(node)});
    for (const line of lines) {
        if (graph.hasNode(String(line.from)) && graph.hasNode(String(line.to))) graph.setEdge(String(line.from), String(line.to));
    }
    dagre.layout(graph);
    return nodes.map((node) => {
        const placed = graph.node(String(node.id));
        return {...node, x: Math.round(placed.x - width / 2), y: Math.round(placed.y - placed.height / 2)};
    });
}

// Whether any two cards cover the same ground.
export function overlapping(nodes, {width, heightOf}) {
    const boxes = nodes.map((n) => ({l: n.x, t: n.y, r: n.x + width, b: n.y + heightOf(n)}));
    return boxes.some((a, i) => boxes.some((b, j) => i < j && a.l < b.r && b.l < a.r && a.t < b.b && b.t < a.b));
}
