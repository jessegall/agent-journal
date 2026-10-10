import {describe, expect, it} from "vitest";
import {picturesOf} from "../src/composables/voiceRigs.js";

describe("the mascot's pictures load before it shows", () => {
    it("names every image a rig draws once, each layer's file and all of its states", () => {
        const rig = {
            layers: [
                {name: "head", file: "head.png", states: {rest: "head.png", complete: "head_full.png"}},
                {name: "eyes", file: "eyes_open.png", states: {open: "eyes_open.png", closed: "eyes_closed.png"}},
                {name: "hat", file: "hat.png"},
            ],
        };
        expect(picturesOf(rig).sort()).toEqual(["eyes_closed.png", "eyes_open.png", "hat.png", "head.png", "head_full.png"]);
    });
});
