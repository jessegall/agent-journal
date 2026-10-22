// @vitest-environment node
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {expect, test} from "vitest";
import {CLIPS, Posing} from "../src/figure/figure.js";
import {REACTIONS, VOICE_FACES, answerTo} from "../src/figure/reactions.js";
import {facesAfter} from "../src/domain/figureState.js";

// the figures' own skeleton and what each voice carries, as figure.js figureOf reads them from the voices' glbs
const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {
    order: rig.order,
    parents: new Map(Object.entries(rig.parents)),
    heads: vectors(rig.heads),
    along: vectors(rig.along),
    eyes: rig.eyes.map((at) => new THREE.Vector3(...at)),
};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));

// each built-in voice's faces, as the server's catalogue gives them to the agent
const catalogue = readFileSync(new URL("../../journal/features/voices/support/builtin_catalogue.py", import.meta.url), "utf8");
const BUILT_IN = Object.fromEntries(
    [...catalogue.matchAll(/Voice\("(\w+)",[\s\S]*?emoji="([^"]+)"\)/g)].map(([, voice, emoji]) => [voice, emoji.split(" ")])
);

const clipNamed = (name) => CLIPS.find((clip) => clip.name === name);

function posed(clip, voice, t, posture = "stand") {
    const pose = new Posing(RIG, posture, 0);
    clip.pose(pose, stanceOf(voice), t);
    return pose;
}

// every bone's move, to compare a pose with the figure at rest
const movesOf = (pose) => [...pose.moves(0)].map(([name, move]) => [name, move.elements.map((n) => Math.round(n * 1e4) / 1e4 + 0)]);

test("every face of every built-in voice has a clip of that voice's own, which the agent's face on a message calls for", () => {
    expect(Object.keys(BUILT_IN).sort()).toEqual(["butler", "coach", "colleague", "homie", "squire"]);
    for (const [voice, faces] of Object.entries(BUILT_IN)) {
        expect(faces.length, voice).toBe(3);
        for (const face of faces) {
            const clip = clipNamed(VOICE_FACES[voice][face]);
            expect(clip, `${voice} ${face}`).toBeDefined();
            expect(clip.voices, `${voice} ${face}`).toEqual([voice]);
            expect(REACTIONS.find((each) => each.moment === `agent_reacted:${face}` && each.voice === voice).clip).toBe(clip.name);
        }
    }
    const clips = Object.values(VOICE_FACES).flatMap((faces) => Object.values(faces));
    expect(new Set(clips).size).toBe(15);
});

test("each face's clip poses on every frame in every posture it is drawn in, and starts and ends at rest with nothing in hand", () => {
    for (const [voice, faces] of Object.entries(VOICE_FACES)) {
        const rest = movesOf(posed(clipNamed("idle"), voice, 0));
        for (const name of Object.values(faces)) {
            const clip = clipNamed(name);
            const steps = clip.frames * 5;
            for (const posture of clip.postures) {
                for (let step = 0; step <= steps; step++) expect(() => posed(clip, voice, step / steps, posture), `${name} ${posture} ${step}`).not.toThrow();
            }
            const moved = Array.from({length: clip.frames}, (_, frame) => JSON.stringify(movesOf(posed(clip, voice, frame / clip.frames))));
            expect(moved.slice(1).filter((each, frame) => each !== moved[frame]).length, name).toBeGreaterThan(clip.frames / 2);
            for (const t of [0, (clip.frames - 1) / clip.frames]) {
                const pose = posed(clip, voice, t);
                expect(movesOf(pose), `${name} at ${t}`).toEqual(rest);
                expect([Math.round(pose.eyes * 1e4) / 1e4, pose.eyeTint, pose.props.size, pose.stowed.size], `${name} at ${t}`).toEqual([1, null, 0, 0]);
            }
        }
    }
});

test("the agent's face plays its voice's clip once, the user's same face only changes the eyes, and a reload plays nothing again", () => {
    const at = (seconds) => new Date(seconds * 1000).toISOString();
    const rows = [
        {table: "reactions", id: 1, author: "agent", face: "🎩", message_id: 7, created_at: at(100)},
        {table: "reactions", id: 2, author: "user", face: "🎩", message_id: 8, created_at: at(101)},
    ];
    const memory = {reacted: new Map(), played: []};
    const answer = (moment) => answerTo(moment, "butler", memory, 200, () => 0.99, (clip) => Boolean(clipNamed(clip)));
    const seen = facesAfter(rows, 99);
    expect(seen.map((moment) => moment.beat)).toEqual(["agent_reacted:🎩", "reacted:🎩"]);
    expect(seen.map(answer)).toEqual([{beat: {clip: "hat_tip", card: ""}}, {look: "amused"}]);
    // the next look starts from the newest face seen, so the face is not played twice
    expect(facesAfter(rows, Math.max(...seen.map((moment) => moment.time)))).toEqual([]);
    // a figure that mounts after the face was put on, as after a reload, starts its looks from then and so never sees it
    expect(facesAfter(rows, 150)).toEqual([]);
    // a face from another voice's set plays nothing on this one
    expect(answerTo({beat: "agent_reacted:🏆", time: 1}, "butler", memory, 200, () => 0, (clip) => clipNamed(clip)?.voices?.includes("butler"))).toBe(null);
});
