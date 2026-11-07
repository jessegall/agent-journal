// @vitest-environment node
import {describe, expect, it} from "vitest";

const {tripTo} = await import("../src/figure/places.js");
const {PERCHED, climbs, mayLeave, perchedAfter} = await import("../src/figure/perches.js");

const FIGURE = {size: 112, below: 0.05};
// standing on the compose box, and a bubble's top well above it, up the chat
const HOME = {x: 400, y: 700, posture: "stand", face: 0};
const BUBBLE = {x: 420, y: 420, posture: "stand", face: 0};

// the trip from home up onto the bubble, by a hop or on the pogo stick, as the page draws it (chat/VoiceFigure.vue setOff)
const upOnto = (pogo) => tripTo(HOME, BUBBLE, FIGURE, {pogo, random: () => 0.99});

describe("landing on a bubble on purpose", () => {
    it("by a hop or by the pogo stick, the figure stays there four seconds before any trip away", () => {
        for (const pogo of [false, true]) {
            const trip = upOnto(pogo);
            expect(trip.legs.some((leg) => leg.clip === (pogo ? "pogo" : "jump")), `${pogo ? "pogo" : "hop"}`).toBe(true);
            expect(climbs(trip.legs)).toBe(true);
            const landed = 100;
            const perched = perchedAfter(climbs(trip.legs), "bubble", landed);
            for (const after of [0, 0.5, 1, 2, 3, 3.9]) expect(mayLeave(perched, landed + after, false), `${pogo ? "pogo" : "hop"}: ${after}s after landing`).toBe(false);
            expect(mayLeave(perched, landed + PERCHED.seconds, false), "free to go after four seconds").toBe(true);
            expect(PERCHED.seconds).toBe(4);
        }
    });

    it("an urgent trip, as for the end of a long run, still takes it off at once", () => {
        const perched = perchedAfter(climbs(upOnto(false).legs), "bubble", 100);
        expect(mayLeave(perched, 100.5, true)).toBe(true);
    });

    it("holds the figure only on a bubble it jumped up onto: a walk, a fall down or a landing at home leaves it free to go", () => {
        const walk = tripTo(HOME, {...HOME, x: 600}, FIGURE, {random: () => 0.99});
        expect(climbs(walk.legs), "a walk along").toBe(false);
        const down = tripTo(BUBBLE, HOME, FIGURE, {random: () => 0.99});
        expect(climbs(down.legs), "a fall down").toBe(false);
        expect(perchedAfter(false, "bubble", 100)).toBe(null);
        expect(perchedAfter(true, "dock", 100), "up onto the bars docked at home").toBe(null);
        expect(mayLeave(null, 100, false)).toBe(true);
    });
});
