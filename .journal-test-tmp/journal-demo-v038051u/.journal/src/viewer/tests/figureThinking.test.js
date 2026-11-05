import {readFileSync} from "node:fs";
import {dirname} from "node:path";
import {fileURLToPath} from "node:url";
import * as THREE from "three";
import {createApp, h} from "vue";
import {describe, expect, it} from "vitest";
import {CLIPS, LIGHT_BULB, PONDERING, Posing, lightBulbOf, lightFromBulb} from "../src/figure/figure.js";
import {ACTS} from "../src/figure/acts.js";
import {GROUNDED, HELD, clipFor, clipOf} from "../src/domain/figureState.js";
import {thinkingAct, workMoments} from "../src/figure/reactions.js";
import {choicesFor} from "../src/figure/pile.js";
import FigureAct from "../src/chat/FigureAct.vue";
import {seeded} from "./support/seeded.js";

const {rig, stances} = JSON.parse(readFileSync(`${dirname(fileURLToPath(import.meta.url))}/figureRig.json`));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));
const named = Object.fromEntries(CLIPS.map((clip) => [clip.name, clip]));

// the clip `name` posed at `t` of its loop for the butler, whose free hand is the right, in `posture`: where its finger grips, where the
// cheek is as the head carries it, where the elbow of that arm is and where the other hand grips, and how the head is turned
function thinking(t, name = "think_cloud", posture = "stand") {
    const pose = new Posing(RIG, posture, 0);
    named[name].pose(pose, stanceOf("butler"), t);
    const moves = pose.moves(0);
    return {
        pose,
        finger: pose.grip("r", [0, 0, 0]).applyMatrix4(moves.get("hand_r")),
        cheek: new THREE.Vector3(-PONDERING.cheek[0], PONDERING.cheek[1], PONDERING.cheek[2]).applyMatrix4(moves.get("head")),
        elbow: pose.head("forearm_r", moves.get("forearm_r")),
        folded: pose.grip("l", [0, 0, 0]).applyMatrix4(moves.get("hand_l")),
        head: moves.get("head"),
    };
}

// FigureAct drawing the clip `name` at `u`, the eyes at the middle of a 100 pixel picture a third of the way down
function cloudOver(name, u) {
    const root = document.createElement("div");
    createApp({render: () => h(FigureAct, {name, u, hand: {x: 0.3, y: 0.4, out: -1, other: {x: 0.7, y: 0.6}}, head: {x: 0.5, y: 0.3}, feet: 0.9, size: 100, room: {left: 0, right: 0}})}).mount(root);
    return root;
}

// the clips the figure shows thinking in: the thinking act's three plays, and stopping to think at the laptop while it types
const THINKING_CLIPS = ["ponder", "think_cloud", "got_it", "type_ponder"];
// the middle of the cloud in the thinking act's play with the cloud alone
const CLOUDED = (ACTS.think_cloud.cloud[0] + ACTS.think_cloud.cloud[1]) / 2;

// the thinking act's plays over `seconds` of the agent thinking, looked at once a second, each {at, clip}
function playsOver(seconds, random) {
    const memory = new Map();
    const plays = [];
    for (let at = 0; at < seconds; at++) {
        const clip = thinkingAct(memory, at, random);
        if (clip) plays.push({at, clip});
    }
    return plays;
}

// the thinking act posed at `u` of its way through for the butler: its pose, and where the eyes are as the head carries them
function pondering(u) {
    const pose = new Posing(RIG, "stand", 0);
    named.ponder.pose(pose, stanceOf("butler"), u);
    const moves = pose.moves(0);
    return {pose, at: (name) => pose.head(name, moves.get(name)), head: moves.get("head")};
}

// FigureAct drawing the thinking act at `u`
const drawnAt = (u) => cloudOver("ponder", u);

describe("the figure thinking", () => {
    it("shows no thinking pose between plays of the act: thinking, or running a command, it stands as it does idle", () => {
        expect([HELD.thinking, HELD.running]).toEqual(["idle", "idle"]);
        const scene = {mode: GROUNDED, place: {posture: "stand", face: 0}, state: "thinking", doing: clipOf("thinking"), doingFacing: 0};
        expect(clipFor(scene, () => true).clip).toBe("idle");
        expect(Object.values(HELD).filter((clip) => THINKING_CLIPS.includes(clip)), "no thinking clip is ever held").toEqual([]);
        expect(ACTS.idle, "nothing drawn over it").toBeUndefined();
        const idle = new Posing(RIG, "stand", 0);
        named.idle.pose(idle, stanceOf("butler"), 0);
        expect([idle.eyeGlance, idle.props.size], "nor its eyes nor a bulb").toEqual([[0, 0], 0]);
        expect(CLIPS.some((clip) => clip.name === "think"), "the cloudless chin pose is gone").toBe(false);
    });

    it("draws the thought cloud with its three pulsing dots wherever it shows thinking, and no thinking pose without it", () => {
        const thinkingClips = CLIPS.filter((clip) => /think|ponder|got_it/.test(clip.name)).map((clip) => clip.name);
        expect(thinkingClips.sort(), "every thinking clip").toEqual([...THINKING_CLIPS].sort());
        for (let frame = 0; frame < named.type_ponder.frames; frame++) {
            const drawn = cloudOver("type_ponder", frame / named.type_ponder.frames);
            expect(drawn.querySelector("[data-thought-cloud]"), `type_ponder ${frame}`).not.toBe(null);
            expect(drawn.querySelectorAll("[data-thought-dot]").length, `type_ponder ${frame}`).toBe(3);
        }
        for (const name of ["ponder", "think_cloud"]) {
            const {puffs, cloud} = ACTS[name];
            for (let step = 0; step < 10; step++) {
                const u = puffs[1] + (step / 10) * (cloud[1] - puffs[1]);
                expect(cloudOver(name, u).querySelectorAll("[data-thought-dot]").length, `${name} ${u}`).toBe(3);
                expect(thinking(u, name).finger.distanceTo(thinking(u, name).cheek), `${name} ${u} the finger at the cheek under the cloud`).toBeLessThan(0.05);
            }
        }
        for (let step = 0; step <= 10; step++) {
            const u = step / 10;
            expect(cloudOver("got_it", u).querySelector("[data-thought-cloud]"), `got_it ${u} no cloud`).toBe(null);
            expect(thinking(u, "got_it").pose.eyeGlance, `got_it ${u} no thinking pose`).toEqual([0, 0]);
        }
    });

    it("under the cloud tilts its head up and aside with its finger along its cheek, that elbow on the other arm folded across it, swaying a little", () => {
        const {elbow, folded, head, finger, cheek} = thinking(CLOUDED);
        expect(finger.distanceTo(cheek), "the finger at the cheek").toBeLessThan(0.05);
        expect(Math.abs(new THREE.Vector3(0, 0, 1).transformDirection(head).x), "tilted").toBeGreaterThan(0.15);
        expect(new THREE.Vector3(0, -1, 0).transformDirection(head).z, "and up").toBeGreaterThan(0.1);
        expect(folded.z, "the other hand under the elbow").toBeLessThan(elbow.z);
        expect(folded.distanceTo(elbow), "close under it").toBeLessThan(0.45);
        const {cloud} = ACTS.think_cloud;
        const sways = Array.from({length: 20}, (_, index) => thinking(cloud[0] + 0.05 + (index / 20) * (cloud[1] - cloud[0] - 0.1)).head.elements[0]);
        expect(Math.max(...sways) - Math.min(...sways), "it sways").toBeGreaterThan(0.005);
        const laptop = thinking(0, "type_ponder", "sit");
        expect(laptop.finger.distanceTo(laptop.cheek), "at the laptop too").toBeLessThan(0.05);
        expect(laptop.pose.laptop).toBe(true);
    });

    it("glances up and aside with its eyes in their usual soft shape, never bare round dots, with no bulb under the cloud alone", () => {
        for (const [name, t, posture] of [["think_cloud", CLOUDED, "stand"], ["type_ponder", 0.3, "sit"]]) {
            const {pose} = thinking(t, name, posture);
            expect(pose.eyeShape, `${name} the usual shape`).toBe(null);
            const [aside, up] = pose.eyeGlance;
            expect(up, `${name} up`).toBeGreaterThan(0.2);
            expect(Math.abs(aside), `${name} to one side`).toBeGreaterThan(0.2);
        }
        for (let frame = 0; frame < named.think_cloud.frames; frame++) expect(thinking(frame / named.think_cloud.frames).pose.props.get("light_bulb"), `${frame}`).toBeUndefined();
    });
});

describe("the thinking act", () => {
    const act = ACTS.ponder;
    const middle = (act.cloud[0] + act.cloud[1]) / 2;

    it("plays while the agent thinks, at most once in a cooldown of 30 to 60 seconds, drawn afresh each time", () => {
        expect(workMoments("thinking", false, 0, 1).moments.map((moment) => moment.beat)).toContain("pondering");
        expect(workMoments("running", false, 0, 1).moments.map((moment) => moment.beat)).not.toContain("pondering");
        const random = seeded(2772);
        const waits = Array.from({length: 30}, () => {
            const memory = new Map();
            choicesFor({moment: "pondering", memory, now: 1000});
            thinkingAct(memory, 1000, random);
            let at = 1001;
            while (!choicesFor({moment: "pondering", memory, now: at}).some((entry) => entry.kind !== "nothing")) at++;
            return at - 1000;
        });
        for (const wait of waits) {
            expect(wait, "never sooner than 30 seconds").toBeGreaterThanOrEqual(30);
            expect(wait, "never later than 60").toBeLessThanOrEqual(60);
        }
        expect(Math.max(...waits) - Math.min(...waits), "a different wait each time").toBeGreaterThan(10);
        const plays = playsOver(30 * 60, seeded(45291));
        plays.slice(1).forEach((play, index) => expect(play.at - plays[index].at, "at most once per cooldown").toBeGreaterThanOrEqual(30));
        for (const name of ["ponder", "think_cloud", "got_it"]) expect(named[name].loops, `${name} played once`).toBe(false);
    });

    it("gives the cloud and the bulb each a cooldown of its own, the bulb lighting only at the end of a thinking that played, never alone", () => {
        const plays = playsOver(30 * 60, seeded(45291));
        const clips = plays.map((play) => play.clip);
        expect(clips.length, "half an hour of thinking plays it a number of times").toBeGreaterThan(5);
        expect(clips.includes("got_it"), "the bulb never lights without the thinking before it").toBe(false);
        const lit = clips.filter((clip) => clip === "ponder").length;
        expect(lit, "the bulb on some plays").toBeGreaterThan(0);
        expect(lit, "never on every play").toBeLessThan(clips.length);
        const cloudAt = plays.map((play) => play.at);
        cloudAt.slice(1).forEach((at, index) => expect(at - cloudAt[index], "the cloud's own cooldown").toBeGreaterThanOrEqual(90));
        const bulbAt = plays.filter((play) => play.clip !== "think_cloud").map((play) => play.at);
        bulbAt.slice(1).forEach((at, index) => expect(at - bulbAt[index], "the bulb's own cooldown").toBeGreaterThanOrEqual(150));
        const {lights} = ACTS.ponder;
        expect(lights[0], "the bulb comes at the end of the play").toBeGreaterThan(ACTS.ponder.cloud[1]);
    });

    it("tilts its head up and to one side, its finger along its cheek, swaying a little, its eyes glancing up in their usual shape", () => {
        const {pose, at, head} = pondering(middle);
        const tilted = new THREE.Vector3(0, 0, 1).transformDirection(head);
        expect(Math.abs(tilted.x), "tilted to one side").toBeGreaterThan(0.15);
        const looks = new THREE.Vector3(0, -1, 0).transformDirection(head);
        expect(looks.z, "and up").toBeGreaterThan(0.1);
        const cheek = new THREE.Vector3(-PONDERING.cheek[0], PONDERING.cheek[1], PONDERING.cheek[2]).applyMatrix4(head);
        const grip = pose.grip("r", [0, 0, 0]).applyMatrix4(pose.moves(0).get("hand_r"));
        expect(grip.distanceTo(cheek), "the finger at the cheek").toBeLessThan(0.05);
        expect(at("hand_r").z, "the hand up by the head").toBeGreaterThan(RIG.heads.get("chest").z);
        expect(pose.eyeShape).toBe(null);
        expect(pose.eyeGlance[1]).toBeGreaterThan(0.2);
        const sways = Array.from({length: 20}, (_, index) => pondering(act.cloud[0] + 0.05 + (index / 20) * (act.cloud[1] - act.cloud[0] - 0.1)).head.elements[0]);
        expect(Math.max(...sways) - Math.min(...sways), "it sways").toBeGreaterThan(0.01);
    });

    it("draws a thought cloud over the head rising from three puffs, its three dots pulsing one after another", () => {
        const drawn = drawnAt(middle);
        const cloud = drawn.querySelector("[data-thought-cloud]");
        expect(cloud).not.toBe(null);
        const dots = [...drawn.querySelectorAll("[data-thought-dot]")];
        expect(dots.length).toBe(3);
        const seconds = act.frames / act.fps;
        const brightest = Array.from({length: 12}, (_, step) => {
            const u = middle + ((step / 12) * act.pulse) / seconds;
            const lit = [...drawnAt(u).querySelectorAll("[data-thought-dot]")].map((dot) => Number(dot.getAttribute("opacity")));
            return lit.indexOf(Math.max(...lit));
        });
        expect(new Set(brightest), "each dot has its turn").toEqual(new Set([0, 1, 2]));
        const order = brightest.filter((dot, index) => index === 0 || dot !== brightest[index - 1]);
        order.slice(1).forEach((dot, index) => expect(dot, "one after another").toBe((order[index] + 1) % 3));
        expect(drawnAt(act.cloud[0] / 2).querySelector("[data-thought-cloud]"), "none before it begins").toBe(null);
        expect(drawnAt(act.lights[1]).querySelector("[data-thought-dot]"), "gone once the bulb lights").toBe(null);
    });

    it("ends a play with the bulb in the 3D light bulb, over the head, switched on and lighting the head, the finger raised, 'got it'", () => {
        const glowing = (act.lights[1] + act.fades[0]) / 2;
        const {pose, at} = pondering(glowing);
        const bulb = pose.props.get("light_bulb");
        expect(bulb, "the bulb at the end of the play").toBeDefined();
        expect([bulb.size, bulb.lit, pose.bulbLit]).toEqual([1, 1, 1]);
        expect(bulb.at.z, "just above the head").toBeGreaterThan(RIG.heads.get("head").z + 1.2);
        expect(Math.sign(bulb.at.x), "over the raised hand").toBe(Math.sign(at("hand_r").x));
        expect(at("hand_r").z, "the hand raised").toBeGreaterThan(RIG.heads.get("upper_arm_r").z + 0.4);
        expect(pondering(middle).pose.props.get("light_bulb"), "not while it thinks").toBeUndefined();
        expect(pondering(act.appears[1]).pose.bulbLit, "there, switched off, before it lights").toBe(0);
        expect(pondering(act.fades[1]).pose.bulbLit, "out again as it fades").toBe(0);
        expect(CLIPS.some((clip) => clip.name === "bulb"), "the bulb is the act's own end, never a clip apart").toBe(false);
        expect(drawnAt(glowing).querySelector("[data-bulb]"), "drawn in 3D, never flat on the page").toBe(null);
        const alone = new Posing(RIG, "stand", 0);
        named.got_it.pose(alone, stanceOf("butler"), (ACTS.got_it.lights[1] + ACTS.got_it.fades[0]) / 2);
        expect(alone.bulbLit, "the bulb alone lights too").toBe(1);
    });

    it("models the bulb with a glass globe, a filament and a screw base, glowing warm when lit", () => {
        const root = new THREE.Group();
        root.name = "light_bulb";
        lightBulbOf(root);
        const names = [];
        root.traverse((node) => node.name && names.push(node.name));
        for (const part of ["light_bulb_glass", "light_bulb_base", "light_bulb_thread_0", "light_bulb_contact"]) expect(names, part).toContain(part);
        const filament = [];
        root.traverse((node) => node.isMesh && node.geometry.type === "TubeGeometry" && filament.push(node));
        expect(filament.length, "the filament and its two wires").toBe(3);
        let glass;
        root.traverse((node) => node.name === "light_bulb_glass" && (glass = node));
        root.userData.shape({size: 1, lit: 0});
        const off = glass.material.uniforms.colour.value.clone();
        root.userData.shape({size: 1, lit: 1});
        const on = glass.material.uniforms.colour.value.clone();
        expect(on.x, "warm").toBeGreaterThan(on.z + 0.3);
        expect(off.z, "clear glass when off").toBeGreaterThan(on.z);
        expect(filament[0].material.color.r).toBeGreaterThan(0.9);
    });

    it("casts its warm light from where it hangs onto the figure while it glows, and none once it is out", () => {
        const light = {bulbAt: {value: new THREE.Vector3()}, bulbGlow: {value: new THREE.Vector3()}};
        const prop = new THREE.Group();
        prop.matrix.makeTranslation(1, 4, 0);
        const figure = {bulbLight: light, propByName: new Map([["light_bulb", prop]])};
        lightFromBulb(figure, {bulbLit: 1});
        expect(light.bulbGlow.value.x).toBeCloseTo(LIGHT_BULB.colours.warm[0] * LIGHT_BULB.strength);
        expect(light.bulbGlow.value.x, "warm, more red than blue").toBeGreaterThan(light.bulbGlow.value.z);
        expect(light.bulbAt.value.toArray()).toEqual([1, 4 + LIGHT_BULB.globe, 0]);
        lightFromBulb(figure, {bulbLit: 0});
        expect(light.bulbGlow.value.toArray()).toEqual([0, 0, 0]);
    });

    it("keeps the eyes in their usual soft shape all through the act, never bare round dots", () => {
        for (let frame = 0; frame < named.ponder.frames; frame++) expect(pondering(frame / named.ponder.frames).pose.eyeShape, `${frame}`).toBe(null);
    });
});
