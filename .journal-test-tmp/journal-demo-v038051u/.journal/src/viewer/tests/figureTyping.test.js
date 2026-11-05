// @vitest-environment node
import {describe, expect, it} from "vitest";
import {CLIPS, TYPING_SECONDS} from "../src/figure/figure.js";
import {givesWay} from "../src/figure/pile.js";
import {ASIDE, SEATED, cornerAt, seatAt, seatedFacing} from "../src/figure/places.js";
import {answerTo} from "../src/figure/reactions.js";
import {canSwitch} from "../src/figure/timeline.js";

const named = Object.fromEntries(CLIPS.map((clip) => [clip.name, clip]));
const LAPTOP = ["type", "type_ponder"];
// the page's display frames a second, at which VoiceFigure.vue steps the clip on screen
const DISPLAY_FPS = 60;

// The seconds at which the clip on screen gives way to a beat that comes `after` seconds into it, stepped as VoiceFigure.vue steps: the
// beat is wanted from then on, and the clip on screen stays until it has played out (timeline.js canSwitch) or may be cut (pile.js givesWay)
function beatShownAt(clip, after) {
    let last = 0;
    for (let tick = 1; tick < DISPLAY_FPS * 30; tick++) {
        const seconds = tick / DISPLAY_FPS;
        const index = Math.floor(seconds * clip.fps);
        const wanted = seconds >= after;
        if (wanted && (canSwitch(clip, index, last) || givesWay({clip}, seconds))) return seconds;
        last = index;
    }
    return Infinity;
}

describe("the figure at its laptop", () => {
    it("keeps typing 5 seconds once it starts: a moment a second in waits behind it, then plays", () => {
        const memory = {reacted: new Map(), played: [], tally: {plain: 0, last: ""}};
        const moment = {beat: "task_finished", time: 1, card: ""};
        const answer = answerTo(moment, "butler", memory, 1, () => 0, () => true);
        expect(answer.beat.clip).toBe("nod");
        for (const name of LAPTOP) {
            const clip = named[name];
            expect(clip.least, name).toBe(TYPING_SECONDS);
            const shownAt = beatShownAt(clip, 1);
            expect(shownAt, name).toBeGreaterThanOrEqual(TYPING_SECONDS);
            expect(shownAt, name).toBeLessThan(TYPING_SECONDS + clip.leaves / clip.fps);
        }
    });

    it("plays the moment as it comes once the typing has gone on 5 seconds, and drops it for a trip that drops everything", () => {
        expect(beatShownAt(named.type, 7)).toBeLessThan(7 + named.type.leaves / named.type.fps);
        expect(givesWay({clip: named.type}, 1, {urgent: true})).toBe(true);
        expect(givesWay({clip: named.type}, 1)).toBe(false);
        expect(givesWay({clip: named.idle}, 0.1)).toBe(true);
    });

    it("sits turned aside on every spot, three-quarters or side-on, never square to the camera", () => {
        const box = {left: 100, width: 400, top: 300};
        const spots = [seatAt(box, "left", {size: 100}), seatAt(box, "right", {size: 100}), cornerAt(box, "left", {size: 100}), cornerAt(box, "right", {size: 100})];
        const faces = [...spots.map((spot) => spot.face), ...Array.from({length: 360}, (_, face) => face)];
        for (const name of LAPTOP)
            for (const face of faces) {
                const facing = seatedFacing(named[name], face);
                const turn = Math.abs(((((facing + 180) % 360) + 360) % 360) - 180);
                expect(turn, `${name} on a spot facing ${face}`).toBeGreaterThanOrEqual(ASIDE);
            }
        expect(spots.filter((spot) => SEATED.has(spot.posture)).map((spot) => seatedFacing(named.type, spot.face))).toEqual([290, 70]);
        expect(seatedFacing(named.idle, 0)).toBe(0);
    });
});
