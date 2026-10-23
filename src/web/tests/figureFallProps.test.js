// @vitest-environment node
import {expect, test} from "vitest";
import * as THREE from "three";
import {CLIPS, Posing} from "../src/figure/figure.js";

// a rig whose every bone stands at rest where the pose functions ask for it, enough to see what a clip holds and puts away
const atRest = (make) => ({get: () => make(), has: () => true, set() {}, forEach() {}, *[Symbol.iterator]() {}});
const RIG = {parents: atRest(() => ""), heads: atRest(() => new THREE.Vector3()), tails: atRest(() => new THREE.Vector3(0, 0, 0.1)),
    rest: atRest(() => new THREE.Matrix4()), along: atRest(() => new THREE.Vector3(0, 1, 0)), order: [], eyes: []};
// a butler's stance: a tray level in its left hand, the right free
const STANCE = {voice: "butler", level: new Set(["l"]), busy: new Set(["l"]), carried: new Set(), free: new Set(["r"]), tablet: new Set(), cloth: new Set(), shield: new Set()};

test("a figure that falls puts the clip's props away, the book, the glass, the laptop and the pens, and keeps what it carries in hand", () => {
    const fall = CLIPS.find((clip) => clip.name === "fall");
    for (let frame = 0; frame < fall.frames; frame++) {
        const pose = new Posing(RIG, "stand", 0);
        fall.pose(pose, STANCE, frame / fall.frames);
        expect({laptop: pose.laptop, book: pose.book, props: [...pose.props.keys()], stowed: [...pose.stowed]})
            .toEqual({laptop: false, book: null, props: [], stowed: []});
    }
});
