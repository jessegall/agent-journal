import {describe, expect, it} from "vitest";
import {FALLS} from "../src/domain/falls.js";
import {fallFrame, floorAt, floorBelow, legAt, underWalker} from "../src/domain/figureMotion.js";

const floor = (id, top, left = 0, right = 1000) => ({id, kind: id, left, right, top, vy: 0});
const FRAME = 1 / 60;

function fallTo(body, floors) {
    let state = {...body, speed: 0, landed: null};
    for (let frame = 0; frame < 600 && !state.landed; frame++) state = fallFrame(state, floors, FRAME, FALLS.butler, 112);
    return state;
}

describe("a walking figure and the floor under it", () => {
    it("stands on the floor at its feet, and on none the snapshot does not hold", () => {
        const floors = [floor("home", 500), floor("foot", 900)];
        expect(floorAt(floors, 300, 501)?.id).toBe("home");
        expect(floorAt(floors, 300, 420)).toBe(null);
    });

    it("falls from where it is when its floor drops 40px mid-walk, lands on the lower floor and can replan from there", () => {
        const before = [floor("home", 500), floor("foot", 900)];
        const leg = {x: 600, y: 388, ms: 1000, lead: 0};
        const halfway = legAt(leg, {x: 200, y: 388}, 500);
        expect(halfway.x).toBe(400);
        expect(underWalker(before, "home", 400, 500)).toEqual({falls: false, dx: 0, dy: 0});
        const after = [floor("home", 540), floor("foot", 900)];
        expect(underWalker(after, "home", 400, 500).falls).toBe(true);
        const landed = fallTo({x: 400, y: 500}, after);
        expect([landed.x, landed.y, landed.landed.id]).toEqual([400, 540, "home"]);
    });

    it("falls to the window's foot when its floor vanishes", () => {
        const after = [floor("foot", 900)];
        expect(underWalker(after, "home", 400, 500).falls).toBe(true);
        expect(fallTo({x: 400, y: 500}, after).landed.id).toBe("foot");
    });

    it("is carried by a floor that rises under it, and never lands on a floor its feet were already below", () => {
        expect(underWalker([floor("home", 480)], "home", 400, 500)).toEqual({falls: false, dx: 0, dy: -20});
        expect(floorBelow([floor("bar", 450), floor("foot", 900)], 400, 500).id).toBe("foot");
    });

    it("is carried back inside a floor that narrowed past its feet, as when the side panel opens", () => {
        expect(underWalker([floor("home", 500, 100, 300), floor("foot", 900)], "home", 350, 500)).toEqual({falls: false, dx: -50, dy: 0});
    });
});
