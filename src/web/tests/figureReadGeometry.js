const EPSILON = 0.0000001;
const subtract = (a, b) => a.map((value, axis) => value - b[axis]);
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const dot = (a, b) => a.reduce((sum, value, axis) => sum + value * b[axis], 0);
const edgesOf = (points) => points.map((point, index) => subtract(points[(index + 1) % points.length], point));
const boundsOf = (points) => ({low: [0, 1, 2].map((axis) => Math.min(...points.map((point) => point[axis]))), high: [0, 1, 2].map((axis) => Math.max(...points.map((point) => point[axis])))});
const boxesTouch = (a, b) => a.low.every((value, axis) => value <= b.high[axis] && a.high[axis] >= b.low[axis]);

export function trianglesOf(positions, indices = null) {
    const vertices = Array.from({length: positions.length / 3}, (_, index) => Array.from(positions.slice(index * 3, index * 3 + 3)));
    const order = indices || vertices.map((_, index) => index);
    return Array.from({length: order.length / 3}, (_, index) => {
        const points = [0, 1, 2].map((corner) => vertices[order[index * 3 + corner]]);
        return {points, bounds: boundsOf(points)};
    });
}

function separated(a, b, axis) {
    const length = Math.sqrt(dot(axis, axis));
    if (length < EPSILON) return false;
    const direction = axis.map((value) => value / length);
    const first = a.map((point) => dot(point, direction));
    const second = b.map((point) => dot(point, direction));
    return Math.max(...first) < Math.min(...second) - EPSILON || Math.max(...second) < Math.min(...first) - EPSILON;
}

export function trianglesTouch(a, b) {
    const first = edgesOf(a), second = edgesOf(b);
    const normalA = cross(first[0], first[1]), normalB = cross(second[0], second[1]);
    const axes = [normalA, normalB, ...first.flatMap((edge) => second.map((other) => cross(edge, other)))];
    // In-plane axes also separate coplanar triangles.
    axes.push(...first.map((edge) => cross(normalA, edge)), ...second.map((edge) => cross(normalB, edge)));
    return !axes.some((axis) => separated(a, b, axis));
}

const LEAF_TRIANGLES = 8;

function unionBounds(triangles, indices) {
    const low = [Infinity, Infinity, Infinity], high = [-Infinity, -Infinity, -Infinity];
    for (const index of indices) {
        const bounds = triangles[index].bounds;
        for (let axis = 0; axis < 3; axis++) {
            low[axis] = Math.min(low[axis], bounds.low[axis]);
            high[axis] = Math.max(high[axis], bounds.high[axis]);
        }
    }
    return {low, high};
}

// The topology is reused; only posed vertices and bounds change between frames.
export function surfaceTree(triangles, previous = null) {
    const build = (indices) => {
        const bounds = unionBounds(triangles, indices);
        if (indices.length <= LEAF_TRIANGLES) return {bounds, indices};
        const spans = bounds.high.map((value, axis) => value - bounds.low[axis]);
        const axis = spans.indexOf(Math.max(...spans));
        indices.sort((a, b) => {
            const first = triangles[a].bounds, second = triangles[b].bounds;
            return first.low[axis] + first.high[axis] - second.low[axis] - second.high[axis];
        });
        const middle = Math.floor(indices.length / 2);
        return {bounds, left: build(indices.slice(0, middle)), right: build(indices.slice(middle))};
    };
    const refit = (node) => {
        if (node.indices) node.bounds = unionBounds(triangles, node.indices);
        else {
            refit(node.left);
            refit(node.right);
            node.bounds = {
                low: node.left.bounds.low.map((value, axis) => Math.min(value, node.right.bounds.low[axis])),
                high: node.left.bounds.high.map((value, axis) => Math.max(value, node.right.bounds.high[axis])),
            };
        }
        return node;
    };
    const root = previous && previous.triangles.length === triangles.length
        ? refit(previous.root)
        : build(triangles.map((_, index) => index));
    return {triangles, root};
}

export function surfaceIntersection(first, second) {
    const a = Array.isArray(first) ? surfaceTree(first) : first;
    const b = Array.isArray(second) ? surfaceTree(second) : second;
    const pending = [[a.root, b.root]];
    while (pending.length) {
        const [left, right] = pending.pop();
        if (!boxesTouch(left.bounds, right.bounds)) continue;
        if (left.indices && right.indices) {
            for (const first of left.indices) {
                for (const second of right.indices) {
                    const one = a.triangles[first], two = b.triangles[second];
                    if (boxesTouch(one.bounds, two.bounds) && trianglesTouch(one.points, two.points)) return {first, second};
                }
            }
        } else if (left.indices) pending.push([left, right.left], [left, right.right]);
        else if (right.indices) pending.push([left.left, right], [left.right, right]);
        else pending.push([left.left, right.left], [left.left, right.right], [left.right, right.left], [left.right, right.right]);
    }
    return null;
}

export function surfacesIntersect(first, second) {
    return surfaceIntersection(first, second) !== null;
}
