import {describe, expect, it} from "vitest";
import {lengthLine, lessonFacts, stepSeconds} from "../demo/pacing.js";

const event = (id, type, action, actor = "agent", data = {}) => ({id, type, action, actor, data, n: 1});
const moment = (at, events) => ({at, events});

describe("lesson pacing", () => {
    const moments = [
        moment(0, [event(1, "agent", "reported", "system")]),
        moment(0.2, [event(1, "agent", "reported", "system"), event(2, "agent", "reported", "system")]),
        moment(0.4, [event(3, "todo", "updated")]),
        moment(1.4, [event(4, "plan", "created")]),
        moment(6, [event(5, "message", "created", "user")]),
    ].map((one, i, all) => ({...one, events: all.slice(0, i + 1).flatMap((m) => m.events).filter((e, j, list) => list.findIndex((o) => o.id === e.id) === j)}));

    it("lets a background step pass in a blink", () => {
        expect(stepSeconds(moments, 1, ["plan"])).toBe(0.3);
    });

    it("gives a quick visible step at least 0.8 seconds", () => {
        expect(stepSeconds(moments, 2, ["plan"])).toBe(0.8);
    });

    it("holds a step that changes the subject for about 3 seconds", () => {
        expect(stepSeconds(moments, 3, ["plan"])).toBe(3);
        expect(stepSeconds(moments, 3, ["report"])).toBeCloseTo(1);
    });

    it("counts what you press and says how long it takes", () => {
        const facts = lessonFacts(moments, ["plan"]);
        expect(facts.presses).toBe(1);
        expect(lengthLine({seconds: 20, presses: 1})).toBe("Under a minute, you press 1 thing");
        expect(lengthLine({seconds: 61, presses: 3})).toBe("About a minute, you press 3 things");
        expect(lengthLine({seconds: 130, presses: 8})).toBe("About 2 minutes, you press 8 things");
    });
});
