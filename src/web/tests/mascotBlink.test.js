import {describe, expect, it} from "vitest";
import {BLINK, DEFAULT_SCHEDULE, blinkOf} from "../src/domain/mascots.js";
import {EYES, fileOf} from "../src/domain/rig.js";

const eyes = {name: EYES, file: "eyes_open.png", states: {open: "eyes_open.png", closed: "eyes_closed.png", happy: "eyes_happy.png"}};
const hat = {name: "hat", file: "hat.png"};

describe("the mascot's blink", () => {
    it("comes every two to six seconds, shuts for a varied moment, and now and then twice", () => {
        expect(DEFAULT_SCHEDULE.blink).toEqual({min: 2, max: 6});
        const quick = blinkOf(() => 0);
        const slow = blinkOf(() => 0.999);
        expect(quick.shut).toBe(BLINK.shut.min);
        expect(slow.shut).toBeCloseTo(BLINK.shut.max, 0);
        expect(quick.twice).toBe(true);
        expect(slow.twice).toBe(false);
    });

    it("shuts the eyes over whatever the pose shows, and nothing else", () => {
        const pose = {eyes: {state: "happy"}};
        expect(fileOf(eyes, pose)).toBe("eyes_happy.png");
        expect(fileOf(eyes, pose, "closed")).toBe("eyes_closed.png");
        expect(fileOf(hat, pose, "closed")).toBe("hat.png");
    });
});
