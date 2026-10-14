// @vitest-environment node
import {expect, test} from "vitest";
import {surfacesIntersect, trianglesOf} from "./figureReadGeometry.js";

const surface = (points) => trianglesOf(points.flat());
const face = surface([[0, 0, 0], [1, 0, 0], [0, 1, 0]]);

test("overlapping boxes do not imply intersecting surfaces", () => {
    expect(surfacesIntersect(face, surface([[0.8, 0.8, 0], [1, 0.8, 0], [0.8, 1, 0]]))).toBe(false);
    expect(surfacesIntersect(face, surface([[0, 0, 1], [1, 0, 1], [0, 1, 1]]))).toBe(false);
});

test("crossing, coplanar and touching triangles are detected", () => {
    expect(surfacesIntersect(face, surface([[0.2, 0.2, -1], [0.2, 0.2, 1], [0.6, 0.2, 0]]))).toBe(true);
    expect(surfacesIntersect(face, surface([[0.1, 0.1, 0], [0.3, 0.1, 0], [0.1, 0.3, 0]]))).toBe(true);
    expect(surfacesIntersect(face, surface([[1, 0, 0], [2, 0, 0], [1, 1, 0]]))).toBe(true);
});

test("a reused hierarchy is refitted after a mesh moves", async () => {
    const {surfaceTree, surfaceIntersection} = await import("./figureReadGeometry.js");
    const away = surfaceTree(surface([[0, 0, 2], [1, 0, 2], [0, 1, 2]]));
    expect(surfacesIntersect(away, face)).toBe(false);
    const moved = surfaceTree(surface([[0.1, 0.1, 0], [0.3, 0.1, 0], [0.1, 0.3, 0]]), away);
    expect(surfaceIntersection(moved, face)).toEqual({first: 0, second: 0});
    expect(surfacesIntersect([], face)).toBe(false);
});

test("hierarchical pruning agrees with the unpruned triangle check", async () => {
    const {trianglesTouch} = await import("./figureReadGeometry.js");
    let seed = 79;
    const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
    const triangles = (shift = 0) => trianglesOf(Array.from({length: 15 * 9}, () => random() * 4 - 2 + shift));
    for (let sample = 0; sample < 80; sample++) {
        const first = triangles(), second = triangles(sample % 3 === 0 ? 6 : sample % 3 === 1 ? 2 : 0);
        const expected = first.some((a) => second.some((b) => a.bounds.low.every((low, axis) => low <= b.bounds.high[axis] && a.bounds.high[axis] >= b.bounds.low[axis]) && trianglesTouch(a.points, b.points)));
        expect(surfacesIntersect(first, second)).toBe(expected);
    }
});
