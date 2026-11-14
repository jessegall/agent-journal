// @vitest-environment node
import {readFileSync} from "node:fs";
import * as THREE from "three";
import {expect, test} from "vitest";

const {BIG_MALLET, CLIPS, FIGHT_EYES, Posing, RIFLE, RIFLE_PARTS, bigMalletOf, bugOf, burstKick, crucifixOf, rifleLine, rifleOf} = await import("../src/figure/figure.js");
const {ACTS, smashAt, smashPlan, splatDrops} = await import("../src/figure/acts.js");
const {SHOWPIECES, choicesFor} = await import("../src/figure/pile.js");
const {reactionTo} = await import("../src/figure/reactions.js");
const {beatsAfter, cardsOfMarks} = await import("../src/domain/figureState.js");
const {FRAMED} = await import("../src/figure/frame.js");

const {rig, stances} = JSON.parse(readFileSync(new URL("./figureRig.json", import.meta.url)));
const vectors = (table) => new Map(Object.entries(table).map(([name, at]) => [name, new THREE.Vector3(...at)]));
const RIG = {order: rig.order, parents: new Map(Object.entries(rig.parents)), heads: vectors(rig.heads), along: vectors(rig.along), eyes: rig.eyes.map((at) => new THREE.Vector3(...at))};
const stanceOf = (voice) => Object.fromEntries(Object.entries(stances[voice]).map(([key, value]) => [key, Array.isArray(value) ? new Set(value) : value]));
const VOICES = Object.keys(stances);
const clipNamed = (name) => CLIPS.find((clip) => clip.name === name);

// `name` posed `u` of the way through for `voice`: the pose, where a bone's head is, and the bounds of a prop group built by `make`
function posed(name, u, voice = "butler") {
    const pose = new Posing(RIG, "stand", 0);
    clipNamed(name).pose(pose, stanceOf(voice), u);
    const moves = pose.moves(0);
    return {pose, at: (bone) => RIG.heads.get(bone).clone().applyMatrix4(moves.get(bone))};
}
const sizeOf = (make) => {
    const root = new THREE.Group();
    make(root);
    root.updateMatrixWorld(true);
    return new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
};

test("the bug shot's rifle is drawn in 3D the right way up, held in both hands at the right shoulder, the left on its handguard, each burst kicking it back", () => {
    // a solid with depth, its magazine under the barrel and its sights on top, as built in the pose's own axes, up along z
    expect(sizeOf(rifleOf).y).toBeGreaterThan(0.05);
    expect(RIFLE_PARTS.magazine[0][2]).toBeLessThan(RIFLE_PARTS.barrel.up);
    expect(RIFLE_PARTS.sight[0][2]).toBeGreaterThan(RIFLE_PARTS.receiver[0][2]);
    // held only by its pitch toward the floor, so it never turns over
    expect(Math.abs(RIFLE.down)).toBeLessThan(30);
    const act = ACTS.bug_shot;
    for (const voice of VOICES) {
        for (let u = act.draw[1] + 0.01; u < act.drops[0]; u += 0.02) {
            const {pose, at} = posed("bug_shot", u, voice);
            const rifle = pose.props.get("rifle");
            const label = `${voice} ${u.toFixed(2)}`;
            expect(rifle, label).toMatchObject({bone: "hand_r", frame: "root"});
            // Measure the actual held rifle, which turns with the whole body rather than staying across the camera plane.
            const moves = pose.moves(0);
            const rotation = new THREE.Matrix4().extractRotation(moves.get(rifle.frame)).multiply(new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(...["x", "y", "z"].map((axis) => THREE.MathUtils.degToRad(rifle.turn[axis] || 0)), "ZYX")));
            const along = new THREE.Vector3(1, 0, 0).transformDirection(rotation);
            const grip = pose.grip("r", [0, 0, 0]).applyMatrix4(moves.get("hand_r"));
            const fore = pose.grip("l", [0, 0, 0]).applyMatrix4(moves.get("hand_l")).sub(grip);
            const off = fore.clone().addScaledVector(along, -fore.dot(along)).length();
            expect(fore.dot(along), label).toBeGreaterThan(0.2);
            expect(off, label).toBeLessThan(0.3);
            const butt = (RIFLE_PARTS.stock[0][0] - RIFLE_PARTS.stock[1][0] / 2) * RIFLE_PARTS.scale;
            expect(grip.clone().addScaledVector(along, butt).distanceTo(at("upper_arm_r")), `${label} shouldered`).toBeLessThan(0.35);
        }
    }
    // a kick at each burst, and the rifle drawn back along its line with it
    const kicks = Array.from({length: 400}, (_, step) => burstKick(act.shots[0] + ((act.shots[1] - act.shots[0]) * step) / 400));
    const peaks = kicks.filter((kick, index) => index > 0 && index < kicks.length - 1 && kick > 0.95 && kick > kicks[index - 1] && kick >= kicks[index + 1]);
    expect(peaks.length).toBe(act.count);
    expect(rifleLine(1).grip.x).toBeLessThan(rifleLine(0).grip.x);
});

test("the bug is drawn in 3D, and shot it splatters, its drops flying out at the screen growing as they come before they land and run down", () => {
    const bug = bugOf(FRAMED.height / 112, 0);
    const size = bug.bounds.getSize(new THREE.Vector3());
    expect(size.z).toBeGreaterThan(size.x * 0.3);
    const act = ACTS.bug_shot;
    const flying = Array.from({length: 9}, (_, step) => splatDrops(act.fly[0] + ((act.fly[1] - act.fly[0]) * step) / 8, 112, {x: 200, y: 100}, {x: 56, y: 56}));
    for (let drop = 0; drop < act.lens.length; drop++) {
        for (let step = 1; step < flying.length; step++) expect(flying[step][drop].r, `drop ${drop} step ${step}`).toBeGreaterThan(flying[step - 1][drop].r);
        expect(flying[0][drop].landed).toBe(false);
        expect(flying.at(-1)[drop].landed).toBe(true);
    }
    expect(splatDrops(act.fly[0] - 0.01, 112, {x: 0, y: 0}, {x: 0, y: 0}), "none before the last bug is shot").toEqual([]);
});

test("a fixed run may instead bring the mallet, on its own cooldown: drawn in 3D, swung over the head, it flattens the bug at the blow", () => {
    const choices = choicesFor({moment: "tests_fixed"});
    expect(choices.map((entry) => entry.name)).toEqual(expect.arrayContaining(["bug_shot", "bug_smash", "nod"]));
    expect(choices.find((entry) => entry.name === "bug_smash").cooldown).toBe(SHOWPIECES.bug_smash);
    const memory = new Map();
    const smashed = choicesFor({moment: "tests_fixed", memory, now: 0});
    expect(smashed.some((entry) => entry.name === "bug_smash")).toBe(true);
    memory.set("tests_fixed/bug_smash", 0);
    expect(choicesFor({moment: "tests_fixed", memory, now: 100}).some((entry) => entry.name === "bug_smash")).toBe(false);
    expect(choicesFor({moment: "tests_fixed", memory, now: SHOWPIECES.bug_smash}).some((entry) => entry.name === "bug_smash")).toBe(true);
    expect(sizeOf(bigMalletOf).y).toBeGreaterThan(BIG_MALLET.head);
    const act = ACTS.bug_smash;
    const plan = smashPlan(500, {left: 200, right: 1000, top: 600}, 112);
    expect(smashAt(plan, act.blow - 0.01, 112).bug).toMatchObject({flat: 0, whole: true});
    expect(smashAt(plan, act.blow, 112).bug).toMatchObject({flat: 1, whole: false});
    // the mallet over the head at the top of its raise, its head above the figure's head
    for (const voice of VOICES) {
        const {pose, at} = posed("bug_smash", act.raise[1], voice);
        expect(pose.props.get("big_mallet"), voice).toMatchObject({bone: "hand_r"});
        expect(at("hand_r").z, voice).toBeGreaterThan(at("upper_arm_r").z);
    }
});

test("from taking up the rifle or the mallet until the bug is gone the eyes are in fight mode, narrowed and cycling through the colours, and back to normal after", () => {
    for (const [name, from, to] of [["bug_shot", ACTS.bug_shot.draw[1], ACTS.bug_shot.splat], ["bug_smash", ACTS.bug_smash.raise[0], ACTS.bug_smash.gone[0]]]) {
        const tints = new Set();
        for (let u = from; u < to; u += 0.02) {
            const {pose} = posed(name, u);
            expect(pose.eyes, `${name} ${u}`).toBeLessThan(FIGHT_EYES.open + 0.15);
            tints.add(pose.eyeTint.map((part) => part.toFixed(1)).join());
        }
        expect(tints.size, name).toBeGreaterThan(3);
        expect(posed(name, 0.999).pose.eyeTint, name).toBe(null);
    }
});

test("a sin repented brings the halo now and then, and a sin found the crucifix on its knees, each at its chance and cooldown, for every voice", () => {
    // the plugin's marks in the chat are the moments, never a passed check or a failure
    const mark = (id, tone) => ({id, type: "plugins.card", variant: tone, key: `plugin:code-commandments:sins:src/${id}.py`, text: "src/a.py", outcome: "none", created_at: new Date((100 + id) * 1000).toISOString()});
    const agent = {data: {cards: cardsOfMarks([mark(1, "good"), mark(2, "warn")])}};
    expect(beatsAfter(agent, 0).map((beat) => beat.beat)).toEqual(["sin_fixed", "sin_committed"]);
    for (const [moment, clip] of [["sin_fixed", "halo"], ["sin_committed", "repent"]]) {
        for (const voice of VOICES) {
            const memory = new Map();
            expect(reactionTo(moment, memory, 1000, () => 0.99, voice), `${voice} misses its chance`).toBe(null);
            expect(reactionTo(moment, memory, 1000, () => 0, voice)?.clip, voice).toBe(clip);
            expect(reactionTo(moment, memory, 1299, () => 0, voice), `${voice} cooling down`).toBe(null);
            expect(reactionTo(moment, memory, 1300, () => 0, voice)?.clip, voice).toBe(clip);
        }
    }
    for (const voice of VOICES) {
        // the halo over the head while it shows
        const {pose: holy} = posed("halo", 0.5, voice);
        expect(holy.props.get("halo"), voice).toMatchObject({bone: "head", size: 1});
        // on its knees with the big cross held up before it, in both hands
        const {pose, at} = posed("repent", 0.6, voice);
        expect(pose.props.get("crucifix"), voice).toMatchObject({bone: "hand_r"});
        expect(at("hand_l").distanceTo(at("hand_r")), voice).toBeLessThan(1);
        expect(at("root").z, voice).toBeLessThan(-0.5);
    }
    expect(sizeOf(crucifixOf).z).toBeGreaterThan(0.05);
});
