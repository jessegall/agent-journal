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
