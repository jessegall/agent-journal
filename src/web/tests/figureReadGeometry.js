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

function trianglesTouch(a, b) {
    const first = edgesOf(a), second = edgesOf(b);
    const normalA = cross(first[0], first[1]), normalB = cross(second[0], second[1]);
    const axes = [normalA, normalB, ...first.flatMap((edge) => second.map((other) => cross(edge, other)))];
    // In-plane axes also separate coplanar triangles.
    axes.push(...first.map((edge) => cross(normalA, edge)), ...second.map((edge) => cross(normalB, edge)));
    return !axes.some((axis) => separated(a, b, axis));
}

export function surfacesIntersect(first, second) {
    return first.some((a) => second.some((b) => boxesTouch(a.bounds, b.bounds) && trianglesTouch(a.points, b.points)));
}
