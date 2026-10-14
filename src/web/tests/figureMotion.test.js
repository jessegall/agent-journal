import {describe, expect, it} from "vitest";
import {FALLS} from "../src/domain/falls.js";
import {KEPT_WITHIN, aimedAt, catching, eased, fallFrame, floorAt, floorBelow, legAt, underWalker} from "../src/domain/figureMotion.js";

const floor = (id, top, left = 0, right = 1000, kind = id === "home" ? "compose" : id) => ({id, kind, left, right, top, vy: 0});
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

    it("is carried by a bubble the chat scrolls, however fast, and only a floor at home lets it drop", () => {
        const scrolled = [floor("b1", 800, 0, 1000, "bubble"), floor("home", 900)];
        expect(underWalker(scrolled, "b1", 400, 500)).toEqual({falls: false, dx: 0, dy: 300});
    });

    it("lands on a bubble it passes only when it lets a bubble catch it, else falls home", () => {
        const floors = [floor("b1", 600, 0, 1000, "bubble"), floor("home", 800)];
        expect(fallTo({x: 400, y: 500}, catching(floors, true)).landed.id).toBe("b1");
        expect(fallTo({x: 400, y: 500}, catching(floors, false)).landed.id).toBe("home");
    });
});

describe("a hop stepped in code", () => {
    it("rises as the browser eased it, quick off the ground and slow at the top, and falls slow at first and quick at the end", () => {
        const jump = {x: 0, y: 0, ms: 400, lead: 100, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)"};
        const from = {x: 0, y: 100};
        expect(legAt(jump, from, 50).y).toBe(100);
        expect(100 - legAt(jump, from, 300).y).toBeGreaterThan(70);
        expect(legAt(jump, from, 600).y).toBe(0);
        const fall = {...jump, y: 200, lead: 0, easing: "cubic-bezier(0.55, 0, 0.9, 0.6)"};
        expect(legAt(fall, from, 200).y - 100).toBeLessThan(30);
        expect(eased("linear", 0.25)).toBe(0.25);
    });
});

describe("a hop and the floor it is headed for", () => {
    // a jump straight up from a stroll at 500 onto a floor whose top is 300, set off from 400, 500
    const trip = {to: {x: 400, y: 300}, legs: []};
    const jump = {x: 400, y: 300, ms: 400, lead: 0, easing: "cubic-bezier(0.2, 0.7, 0.4, 1)", hopping: true};
    const from = {x: 400, y: 500};

    it("lands on the new top of a floor that rose while it was in the air", () => {
        const aimed = aimedAt(trip, jump, from, {x: 400, y: 260});
        expect(legAt(aimed.leg, aimed.from, 400)).toEqual({x: 400, y: 260});
        expect(aimed.trip.to.y).toBe(260);
    });

    it("stays upright on a floor that moved sideways, and is left alone by one that stood still", () => {
        const aimed = aimedAt(trip, jump, from, {x: 450, y: 300});
        expect([aimed.leg.x, aimed.from.x]).toEqual([450, 450]);
        expect(aimedAt(trip, jump, from, {x: 400, y: 300}).trip).toBe(trip);
    });

    it("falls from its point in the arc when its floor goes, and lands on the floor under it", () => {
        const midway = legAt(jump, from, 200);
        expect(midway.y).toBeLessThan(500);
        let state = {x: midway.x, y: midway.y, speed: 0, landed: null};
        for (let frame = 0; frame < 600 && !state.landed; frame++) state = fallFrame(state, [floor("home", 500)], FRAME, FALLS.butler, 112);
        expect([state.x, state.y, state.landed.id]).toEqual([400, 500, "home"]);
    });
});

describe("the floor a walker keeps to", () => {
    it("is the one nearest its feet when the floor moved a few pixels as it got up to go, and none when it set off in the air", () => {
        const floors = [floor("home", 506), floor("foot", 900)];
        expect(floorAt(floors, 300, 500)).toBe(null);
        expect(floorAt(floors, 300, 500, KEPT_WITHIN)?.id).toBe("home");
        expect(floorAt([floor("home", 520), floor("foot", 900)], 300, 500, KEPT_WITHIN)).toBe(null);
    });

    it("falls when it keeps to no floor, rather than walking on at the height it set off at", () => {
        expect(underWalker([floor("home", 540)], null, 400, 500).falls).toBe(true);
        expect(underWalker([floor("home", 506)], "home", 400, 500).falls).toBe(true);
        expect(underWalker([floor("home", 495)], "home", 400, 500)).toEqual({falls: false, dx: 0, dy: -5});
    });
});
