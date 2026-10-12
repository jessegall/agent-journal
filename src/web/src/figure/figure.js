// A rigged figure drawn in the browser as Blender draws it: posed by a port of clips.py and rig.Posing, shaded as
// toon.py shades it, one held pose for each step of a clip.
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";

// render_clips.py and snaps.py: an orthographic camera eight units in front, framing 5.4 units about a height of 2.4
export const CELL = 224;
const FRAMED_HEIGHT = 5.4;
const FRAMED_MIDDLE = 2.4;
const DISTANCE = 8;
const DEPTH = 3;
// three's own Draco decoder, for the review page, which has no server of its own
const DECODER = "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/";
// the share of the picture below the ground the figure stands on, where the chat box's top edge runs
export const GROUND = (FRAMED_HEIGHT / 2 - FRAMED_MIDDLE) / FRAMED_HEIGHT;

// EEVEE takes 16 samples a pixel through a 1.5 px filter; the browser draws twice as wide, scales down and softens
// by this share of a cell pixel, which measured closest to Blender's own frames
const SUPERSAMPLE = 2;
const SOFTEN = 0.5;

// toon.py; the step is on N.L, worked out from its ramp: a 0.8 grey Diffuse BSDF under a sun of strength pi and the
// render's 0.05 grey world reads 0.8 N.L + 0.04, which crosses LIT_FROM = 0.52 at N.L = 0.6 (measured on a sphere: 0.600)
const LIGHT_FROM = new THREE.Vector3(-0.35, -0.8, 0.5);
const LIT_FROM = 0.6;
const SHADE = new THREE.Vector3(0.6, 0.6, 0.7);
const OUTLINE_COLOUR = new THREE.Vector3(0.02, 0.02, 0.05);
const OUTLINE_WIDTH = 0.036;

// clips.py and rig.py
export const SIDES = {l: 1, r: -1};
const HANG = 82;
const HOLD_LIFT = 12;
const HOLD_SWING = 55;
const HOLD_TWIST = 25;
const HOLD_ROLL = 20;
const RAISED_ROLL = 85;
const WAVE_BACK = 40;
const WAVE_BEND = 25;
const WAVE_SWING = 10;
const CHIN_REST = [0.4, -0.92, 2.1];
const THINK_ELBOW = [0.6, 0.3, -1.0];
const THINK_HAND = [1.0, -0.4, 0.35];
const THINK_TIP = 25;
const SLEEP_TILT = 4;
// what the butler once carried on the platter is left out, so its hands are empty; the cloth stays over the forearm it holds level
const LEFT_OUT = new Set(["butler_tray", "butler_tablet"]);
const LEVEL_ITEMS = new Set(["butler_towel", "colleague_mug"]);
const BUSY_ITEMS = new Set([...LEVEL_ITEMS, "squire_shield", "coach_clipboard"]);
const BLINK_OPENNESS = [1.0, 0.5, 0.06, 0.5];
const MIN_EYE_HEIGHT = 0.06;
const HINGES = {forearm: new THREE.Vector3(0, 0, -1), shin: new THREE.Vector3(1, 0, 0)};

// Blender's Z up and -Y front become the glb's Y up and +Z front
const TO_GLB = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
const FROM_GLB = TO_GLB.clone().invert();

const toBlender = (vector) => vector.clone().applyMatrix4(FROM_GLB);
const translation = (vector) => new THREE.Matrix4().makeTranslation(vector.x, vector.y, vector.z);
const radians = THREE.MathUtils.degToRad;

// Blender's Euler "XYZ" is Rz Ry Rx, which three.js names "ZYX"
const euler = (x, y, z) => new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(radians(x), radians(y), radians(z), "ZYX"));

function aboutPoint(at, turn) {
    return translation(at).multiply(turn).multiply(translation(at.clone().negate()));
}

function sideOf(name) {
    const match = name.match(/^(.*)_([lr])$/);
    return match ? {base: match[1], side: match[2]} : {base: name, side: ""};
}

function hingeAxis(base, side) {
    const {x, y, z} = HINGES[base];
    return side === "l" ? new THREE.Vector3(x, y, z) : new THREE.Vector3(x, -y, -z);
}

// rig.Posing, kept as each bone's move from its rest place (final @ matrix_local⁻¹) in Blender's armature space
class Posing {
    constructor(rig, posture = "stand", stride = 0) {
        this.rig = rig;
        this.final = new Map();
        this.eyes = 1;
        this.eyeTint = null;
        this.hearts = 0;
        this.laptop = false;
        this.posture = posture;
        this.sway = 0;
        this.stride = stride;
    }

    standing(name) {
        const parent = this.rig.parents.get(name);
        return parent ? this.matrix(parent) : new THREE.Matrix4();
    }

    matrix(name) {
        return this.final.get(name) ?? this.standing(name);
    }

    head(name, move) {
        return this.rig.heads.get(name).clone().applyMatrix4(move);
    }

    turn(name, {x = 0, y = 0, z = 0}) {
        const current = this.matrix(name);
        this.final.set(name, aboutPoint(this.head(name, current), euler(x, y, z)).multiply(current));
    }

    face(name, {x = 0, y = 0, z = 0}) {
        const at = this.head(name, this.standing(name));
        const rest = this.rig.heads.get(name).clone().negate();
        this.final.set(
            name,
            translation(at)
                .multiply(euler(x, y, z))
                .multiply(translation(rest))
        );
    }

    lift(name, {x = 0, y = 0, z = 0}) {
        this.final.set(name, translation(new THREE.Vector3(x, y, z)).multiply(this.matrix(name)));
    }

    bend(name, degrees) {
        const {base, side} = sideOf(name);
        const standing = this.standing(name);
        const axis = hingeAxis(base, side).transformDirection(standing).normalize();
        const turn = new THREE.Matrix4().makeRotationAxis(axis, radians(degrees));
        this.final.set(name, aboutPoint(this.head(name, standing), turn).multiply(standing));
    }

    aim(name, direction) {
        const standing = this.standing(name);
        const now = this.rig.along.get(name).clone().transformDirection(standing);
        const turn = new THREE.Matrix4().makeRotationFromQuaternion(
            new THREE.Quaternion().setFromUnitVectors(now, direction.clone().normalize())
        );
        this.final.set(name, aboutPoint(this.head(name, standing), turn).multiply(standing));
    }

    // rig.Posing.reach for an arm: the hand's head put at `target`, the elbow pointing the way `bend` says
    reach(side, target, bend) {
        const [upper, lower, end] = ["upper_arm", "forearm", "hand"].map((role) => `${role}_${side}`);
        const first = this.rig.heads.get(lower).distanceTo(this.rig.heads.get(upper));
        const second = this.rig.heads.get(end).distanceTo(this.rig.heads.get(lower));
        const shoulder = this.head(upper, this.standing(upper));
        const way = target.clone().sub(shoulder);
        const distance = way.length();
        if (distance < Math.abs(first - second) || distance > first + second) {
            throw new Error(`the ${side} arm cannot reach ${distance.toFixed(3)}`);
        }
        const along = way.clone().normalize();
        const back = (first * first - second * second + distance * distance) / (2 * distance);
        const pole = bend.clone();
        if (side === "r") {
            pole.x = -pole.x;
        }
        pole.sub(along.clone().multiplyScalar(pole.dot(along)));
        const middle = shoulder
            .clone()
            .add(along.multiplyScalar(back))
            .add(pole.normalize().multiplyScalar(Math.sqrt(Math.max(first * first - back * back, 0))));
        this.aim(upper, middle.clone().sub(shoulder));
        this.aim(lower, target.clone().sub(middle));
    }

    // rig.Posing.revolve: rotate a snapshot, not a parent already rotated twice.
    revolve(degrees) {
        const turn = new THREE.Matrix4().makeRotationZ(radians(degrees));
        this.final = new Map(this.rig.order.map((name) => [name, turn.clone().multiply(this.matrix(name))]));
    }

    // a point given against the body at rest, carried wherever the root has been lifted or moved
    carried(point) {
        return point.clone().add(this.head("root", this.matrix("root")).sub(this.rig.heads.get("root")));
    }

    // how far the legs of a seated figure swing, from -1 to 1
    swing(sway) {
        this.sway = sway;
    }

    shutEyes(open) {
        this.eyes = Math.max(open, MIN_EYE_HEIGHT);
    }

    // the eyes' colour, as red, green and blue from 0 to 1; none leaves them their own
    tintEyes(colour) {
        this.eyeTint = colour;
    }

    // hearts in place of the eyes, `size` times their own size; 0 leaves the eyes
    heartEyes(size) {
        this.hearts = size;
    }

    // a laptop open on the lap, its lid toward the face
    holdLaptop() {
        this.laptop = true;
    }

    // every bone's move, the whole figure turned `facing` degrees toward the viewer's right as rig.Posing.revolve turns it
    moves(facing) {
        const turn = new THREE.Matrix4().makeRotationZ(radians(facing));
        const moves = new Map();
        for (const name of this.rig.order) {
            const parent = this.rig.parents.get(name);
            moves.set(name, this.final.get(name) ?? (parent ? moves.get(parent) : new THREE.Matrix4()));
        }
        return new Map([...moves].map(([name, move]) => [name, turn.clone().multiply(move)]));
    }
}

const waveOf = (t, turns = 1) => Math.sin(2 * Math.PI * turns * t);

function breathe(pose, t, amount = 1) {
    pose.turn("spine", {x: 1.0 * amount * waveOf(t)});
    pose.turn("chest", {x: 1.5 * amount * waveOf(t - 0.05)});
    pose.turn("neck", {x: -0.8 * amount * waveOf(t - 0.1)});
    pose.turn("head", {x: -1.2 * amount * waveOf(t - 0.12)});
}

function trunk(pose, {lean = 0, twist = 0, nod = 0, turn = 0, tilt = 0}) {
    pose.turn("spine", {x: lean * 0.4, z: twist * 0.4});
    pose.turn("chest", {x: lean * 0.6, z: twist * 0.6});
    pose.turn("neck", {x: nod * 0.3, z: turn * 0.3, y: tilt * 0.3});
    pose.turn("head", {x: nod * 0.7, z: turn * 0.7, y: tilt * 0.7});
}

function hang(pose, side, swing = 0, bend = 10) {
    pose.turn(`upper_arm_${side}`, {y: SIDES[side] * HANG});
    pose.turn(`upper_arm_${side}`, {x: swing});
    pose.bend(`forearm_${side}`, bend);
}

// clips.hold: `lift` is how far above flat the forearm points, `forward` how far the upper arm swings forward, `tip` how far the hand tips what it holds
function hold(pose, side, lift = HOLD_LIFT, forward = 0, tip = 0) {
    const sign = SIDES[side];
    pose.turn(`upper_arm_${side}`, {y: sign * HANG});
    pose.turn(`upper_arm_${side}`, {x: -forward});
    pose.turn(`upper_arm_${side}`, {z: sign * HOLD_ROLL});
    pose.face(`forearm_${side}`, {y: -sign * lift, z: -sign * HOLD_SWING});
    pose.face(`hand_${side}`, {x: tip, z: -sign * HOLD_TWIST});
}

function armsAtRest(pose, stance, apart = [], swing = {}) {
    for (const side of Object.keys(SIDES)) {
        if (apart.includes(side)) {
            continue;
        }
        if (stance.level.has(side)) {
            hold(pose, side);
            continue;
        }
        hang(pose, side, swing[side] ?? 0);
    }
}

function blinkAt(t, start, frames) {
    const index = t >= start ? Math.floor((t - start) * frames) : -1;
    return index >= 0 && index < BLINK_OPENNESS.length ? BLINK_OPENNESS[index] : 1.0;
}

const freeSide = (stance) => (stance.busy.has("r") ? "l" : "r");

function idle(pose, stance, t) {
    breathe(pose, t);
    armsAtRest(pose, stance);
    pose.swing(waveOf(t));
    pose.shutEyes(blinkAt(t, 0.62, 24));
}

function blink(pose, stance, t) {
    armsAtRest(pose, stance);
    pose.shutEyes(blinkAt(t, 0.15, 6));
}

function nod(pose, stance, t) {
    const dip = Math.max(waveOf(t, 2), 0);
    trunk(pose, {lean: 4 * dip, nod: 26 * dip});
    armsAtRest(pose, stance);
}

function shake(pose, stance, t) {
    trunk(pose, {turn: 28 * waveOf(t, 2), tilt: 4 * waveOf(t, 2)});
    armsAtRest(pose, stance);
}

function wave(pose, stance, t) {
    const side = freeSide(stance);
    const sign = SIDES[side];
    trunk(pose, {twist: -sign * 4, turn: -sign * 8, tilt: -sign * 6});
    armsAtRest(pose, stance, [side]);
    pose.turn(`upper_arm_${side}`, {x: -RAISED_ROLL});
    pose.turn(`upper_arm_${side}`, {z: sign * WAVE_BACK});
    pose.bend(`forearm_${side}`, WAVE_BEND + WAVE_SWING * waveOf(t));
}

function think(pose, stance, t) {
    const side = freeSide(stance);
    const sign = SIDES[side];
    trunk(pose, {nod: 8 + 3 * waveOf(t), turn: -sign * 10 + 3 * waveOf(t), tilt: -sign * 5});
    armsAtRest(pose, stance, [side]);
    const [x, y, z] = CHIN_REST;
    pose.reach(side, pose.carried(new THREE.Vector3(sign * x, y, z)), new THREE.Vector3(...THINK_ELBOW));
    const [across, forward, up] = THINK_HAND;
    pose.aim(`hand_${side}`, new THREE.Vector3(-sign * across, forward, up));
    pose.turn(`hand_${side}`, {x: THINK_TIP});
}

function celebrate(pose, stance, t) {
    const jump = Math.max(Math.sin(2 * Math.PI * 2 * t), 0);
    pose.lift("root", {z: 0.28 * jump});
    pose.turn("hips", {z: 6 * waveOf(t, 2)});
    trunk(pose, {lean: -5, turn: -6 * waveOf(t, 2)});
    const cheering = Object.keys(SIDES).filter((side) => !stance.busy.has(side));
    armsAtRest(pose, stance, cheering);
    for (const side of cheering) {
        const sign = SIDES[side];
        pose.turn(`upper_arm_${side}`, {y: -sign * (62 + 8 * waveOf(t, 2))});
        pose.bend(`forearm_${side}`, 10 + 6 * waveOf(t, 4));
    }
    for (const side of Object.keys(SIDES)) {
        pose.turn(`thigh_${side}`, {x: -18 * jump});
        pose.turn(`shin_${side}`, {x: 34 * jump});
        pose.turn(`foot_${side}`, {x: -10 * jump});
    }
}

function sleep(pose, stance, t) {
    const breath = waveOf(t);
    trunk(pose, {lean: 4 + 1.5 * breath, nod: 8 + 2 * breath, tilt: SIDES[freeSide(stance)] * SLEEP_TILT});
    armsAtRest(pose, stance);
    pose.shutEyes(0.0);
}

function walk(pose, stance, t) {
    pose.stride = t;
    const phase = 2 * Math.PI * t;
    strideUnder(pose);
    pose.turn("hips", {z: 5 * Math.sin(phase)});
    trunk(pose, {lean: 3, twist: -7 * Math.sin(phase), turn: 3 * Math.sin(phase)});
    armsAtRest(pose, stance, [], {l: 22 * Math.sin(phase), r: -22 * Math.sin(phase)});
    strideLegs(pose);
}

// The walk's lower body at `pose.stride` of its cycle: the body bobbing before a clip poses the rest, and the legs stepping after it. Every
// clip drawn on the move walks on these, so the figure goes on thinking or working as it goes; the hips' sway is the walk's own, as a
// clip that reaches for the chin or the lap places its hands against an upper body that does not swing
function strideUnder(pose) {
    pose.lift("root", {z: 0.05 * Math.cos(4 * Math.PI * pose.stride)});
}

function strideLegs(pose) {
    for (const [side, offset] of [
        ["l", 0.0],
        ["r", Math.PI],
    ]) {
        const angle = 2 * Math.PI * pose.stride + offset;
        const thigh = -30 * Math.sin(angle);
        const knee = 42 * Math.max(Math.cos(angle), 0);
        pose.turn(`thigh_${side}`, {x: thigh});
        pose.turn(`shin_${side}`, {x: knee});
        pose.turn(`foot_${side}`, {x: -0.8 * (thigh + knee) + 6});
    }
}

// New clips: a direct numerical port of clips.py, not an interpolated animation.
const ENTRY_DISTANCE = 4.4;
const ENTRY_TRAVEL_END = 0.72;
const ENTRY_TURN_END = 0.94;
const RUN_STRIDE = [1.84, 0.38, 0.2];
const WALK_STRIDE = [1.36, 0.6, 0.16];
const DEPART_TURN = 0.14;
const SEAT_LIFT = 0.2;
// how far each knee bends when sitting on an edge; under a right angle the feet reach ahead of the knees, as a person sits on a wall
const SEAT_SHIN = 66;
const PULL_GRIP_X = 1.51;
const PULL_GRIP_Y = -0.0233463035019455;
const PULL_GRIP_Z = 3.17;
const PULL_WRIST_X = 1.25;
const PULL_WRIST_Z = 2.91;

function ease(t) {
    t = Math.min(Math.max(t, 0), 1);
    return t * t * (3 - 2 * t);
}

function onceTime(t, frames) {
    return Math.min(Math.max((t * frames) / (frames - 1), 0), 1);
}

// how far u is through the stretch from `from` to `to`, held at 0 before and 1 after; eased, and as a swell that rises and falls back to 0
const span = (u, from, to) => Math.min(Math.max((u - from) / (to - from), 0), 1);
const rise = (u, from, to) => ease(span(u, from, to));
const swell = (u, from, to) => Math.sin(Math.PI * span(u, from, to));
const mix = (from, to, k) => from + (to - from) * k;

// a ring that dies away over s from 0 to 1: `turns` swings, damped by `damping`, and exactly still at both ends
const ringing = (s, turns, damping) => Math.exp(-damping * s) * Math.sin(2 * Math.PI * turns * s) * (1 - s);

export function supportsClip(name, stance) {
    return name !== "pull_ups" || !(stance.busy.size || stance.level.size);
}

// A figure sitting on an edge: the root lifted onto the seat before any clip poses it, and after it the thighs forward and the knees bent
// over the edge, swinging as the clip says. Every clip but those that move the whole body is drawn seated this way as well as standing.
function seat(pose) {
    pose.lift("root", {z: SEAT_LIFT});
}

function seatedLegs(pose) {
    for (const [side, sign] of Object.entries(SIDES)) {
        pose.turn(`thigh_${side}`, {x: -88});
        pose.bend(`shin_${side}`, SEAT_SHIN + sign * 9 * pose.sway);
        pose.turn(`foot_${side}`, {x: -sign * 5 * pose.sway});
    }
}

// the body lowered by `depth` on bent knees, the feet flat where they stand; seated or walking, the posture has the legs
function crouch(pose, depth) {
    if (pose.posture !== "stand") return;
    pose.lift("root", {z: -depth});
    fold(pose, depth);
}

// the hands of the figure that carry nothing, carried up through the front to a spot `k` of the way (0 hanging, 1 there), the spot
// given against the body at rest
function handsTo(pose, stance, k, spot, elbow = THINK_ELBOW) {
    armsAtRest(pose, stance, [...stance.free]);
    for (const side of stance.free) {
        handTo(pose, side, k, pose.carried(new THREE.Vector3(SIDES[side] * spot[0], spot[1], spot[2])), new THREE.Vector3(...elbow));
    }
}

// The looks the eyes take on, over whatever the body does: how far they open, the colour they turn, and whether they are hearts. The
// helmet hides everything else, so the eyes carry the expression.
export const EYES = {
    hearts: {open: 1, tint: null, hearts: true},
    amused: {open: 0.3, tint: [1, 0.85, 0.4]},
    startled: {open: 1.5, tint: [1, 1, 1]},
    worried: {open: 0.7, tint: [0.6, 0.75, 1]},
    angry: {open: 0.45, tint: [1, 0.35, 0.3]},
    reading: {open: 0.8, tint: null},
};

function eyesAs(pose, mood, strength = 1) {
    const {open, tint} = EYES[mood];
    pose.shutEyes(mix(1, open, strength));
    if (tint && strength > 0.5) pose.tintEyes(tint);
}

// where the hands rest to type on a laptop on the lap, and where they cover the eyes
const TYPING_HANDS = [0.3, -0.55, 1.55];
const EYE_HANDS = [0.34, -0.82, 2.32];

// head down at a laptop on its lap, the hands moving, and now and then a pause
function type(pose, stance, t) {
    const pause = swell(t, 0.55, 0.75);
    const tap = (1 - pause) * waveOf(t, 6);
    breathe(pose, 0);
    trunk(pose, {lean: 6, nod: 20 - 4 * pause, turn: 2 * waveOf(t)});
    handsTo(pose, stance, 1, [TYPING_HANDS[0], TYPING_HANDS[1], TYPING_HANDS[2] + 0.035 * tap]);
    pose.holdLaptop();
    eyesAs(pose, "reading");
}

// jumps for joy: both arms thrown up and the whole body leaving the ground, or the seat, twice, the head back
function joy(pose, stance, t) {
    const u = onceTime(t, 20);
    const leap = Math.max(Math.sin(2 * Math.PI * 2 * span(u, 0.1, 0.9)), 0) * (1 - 0.3 * u);
    pose.lift("root", {z: 0.32 * leap});
    breathe(pose, 0);
    trunk(pose, {lean: -5 * leap, nod: -14 + 4 * leap});
    flung(pose, stance, 0, 70 + 55 * leap, 6 * waveOf(t, 4));
    tucked(pose, 0.5 * leap);
}

// the hands go up over the eyes, then a slow shake of the head, then the hands come down
function dismay(pose, stance, t) {
    const u = onceTime(t, 28);
    const hands = rise(u, 0, 0.2) * (1 - rise(u, 0.82, 1));
    const shaking = swell(u, 0.28, 0.82);
    breathe(pose, 0);
    trunk(pose, {lean: 4 * hands, nod: 10 * hands, turn: 24 * shaking * waveOf(span(u, 0.28, 0.82), 1.5)});
    handsTo(pose, stance, hands, EYE_HANDS);
    eyesAs(pose, "worried", hands);
}

// looks about, to one side, then the other, as a creature does when nothing is going on
function look_around(pose, stance, t) {
    const u = onceTime(t, 24);
    const look = swell(u, 0.05, 0.5) - swell(u, 0.5, 0.95);
    breathe(pose, 0);
    trunk(pose, {turn: 34 * look, nod: -4 * Math.abs(look), tilt: 4 * look});
    armsAtRest(pose, stance);
}

// stretches both arms up and leans back with a yawn, then settles
function stretch(pose, stance, t) {
    const u = onceTime(t, 24);
    const up = swell(u, 0.05, 0.9);
    breathe(pose, 0);
    trunk(pose, {lean: -10 * up, nod: -10 * up});
    flung(pose, stance, 0, 100 * up);
    pose.shutEyes(1 - 0.9 * swell(u, 0.2, 0.75));
}

function strideFoot(phase, stride, duty, clearance) {
    phase = ((phase % 1) + 1) % 1;
    const span = stride * duty;
    if (phase < duty) {
        return [-span / 2 + stride * phase, 0];
    }
    const flight = (phase - duty) / (1 - duty);
    return [span / 2 - span * ease(flight), clearance * Math.sin(Math.PI * flight)];
}

function stepLeg(pose, side, forward, lift, rootHeight, toe = 0) {
    const thigh = pose.rig.heads.get(`thigh_${side}`);
    const shin = pose.rig.heads.get(`shin_${side}`);
    const foot = pose.rig.heads.get(`foot_${side}`);
    const upper = thigh.z - shin.z,
        lower = shin.z - foot.z;
    const down = upper + lower + rootHeight - lift;
    const cosine = (forward * forward + down * down - upper * upper - lower * lower) / (2 * upper * lower);
    if (cosine < -1 - 1e-10 || cosine > 1 + 1e-10) {
        throw new RangeError(`${side} stride target is outside the unchanged leg reach`);
    }
    const knee = Math.acos(Math.round(cosine * 1e10) / 1e10);
    const hip = Math.atan2(forward, down) - Math.atan2(lower * Math.sin(knee), upper + lower * Math.cos(knee));
    pose.turn(`thigh_${side}`, {x: (hip * 180) / Math.PI});
    pose.bend(`shin_${side}`, (knee * 180) / Math.PI);
    pose.face(`foot_${side}`, {x: toe});
}

// A stride `cycle` steps into its run along the figure's own forward line, faded out by `motion`, posed parent first: the root's bob lowered by `drop`,
// the trunk with idle's first breath, its lean and any `bend` of the trunk on top, the arms not held `apart`, and the legs, folded by `drop` when standing
function stride(pose, stance, cycle, motion, {running = false, lean = running ? 10 : 3, clearance, apart = [], drop = 0, bend = {}} = {}) {
    const [length, duty, lift] = running ? RUN_STRIDE : WALK_STRIDE;
    const halfPhase = cycle % 0.5;
    const flight = running && halfPhase > duty ? Math.max(0, Math.sin((Math.PI * (halfPhase - duty)) / (0.5 - duty))) : 0;
    const rootHeight = motion * (-(running ? 0.075 : 0.11) + (running ? 0.055 * flight : 0)) - drop;
    pose.lift("root", {z: rootHeight});
    breathe(pose, 0);
    trunk(pose, {...bend, lean: lean * motion + (bend.lean ?? 0), nod: (running ? -6 : -2) * motion + (bend.nod ?? 0)});
    const swing = (running ? 24 : 14) * waveOf(cycle) * motion;
    const carried = stance.carried ?? stance.busy;
    const jogging = Object.keys(SIDES).filter((side) => running && !carried.has(side) && !stance.level.has(side) && !apart.includes(side));
    armsAtRest(
        pose,
        stance,
        [...jogging, ...apart],
        Object.fromEntries(Object.entries(SIDES).map(([side, sign]) => [side, carried.has(side) ? 0 : sign * swing]))
    );
    for (const side of jogging) hang(pose, side, SIDES[side] * swing, 10 + 40 * motion);
    if (motion > 0 || drop) {
        for (const [side, offset] of [
            ["l", 0],
            ["r", 0.5],
        ]) {
            const [step, raised] = strideFoot(cycle + offset, length, duty, clearance ?? lift);
            const phase = (cycle + offset) % 1;
            const flightPhase = phase >= duty ? (phase - duty) / (1 - duty) : 0;
            const toe = (running ? 14 : 11) * Math.sin(Math.PI * flightPhase) * motion;
            stepLeg(pose, side, motion * step, motion * raised, rootHeight, toe);
        }
    }
}

// An arrival from the left: off the frame at the start, home by `until`, turned to face the viewer by `faced`; returns the facing to revolve to last
function arrive(pose, stance, u, until, faced, gait = {}) {
    const q = span(u, 0, until);
    const progress = ease(q);
    pose.lift("root", {y: ENTRY_DISTANCE * (1 - progress)});
    stride(pose, stance, (ENTRY_DISTANCE * progress) / (gait.running ? RUN_STRIDE : WALK_STRIDE)[0], 1 - ease((q - 0.76) / 0.24), gait);
    return 90 * (1 - rise(u, until, faced));
}

// A departure toward `way` (1 the viewer's right, -1 the left) from home at `from`: it turns first, then strides off the frame, gathering speed; returns the facing
function depart(pose, stance, u, from, way, gait = {}) {
    const q = span(u, from + DEPART_TURN / 2, 1);
    const progress = (q < 0.3 ? (q * q) / 0.6 : q - 0.15) / 0.85;
    pose.lift("root", {y: -ENTRY_DISTANCE * progress});
    stride(pose, stance, (ENTRY_DISTANCE * progress) / (gait.running ? RUN_STRIDE : WALK_STRIDE)[0], ease(q / 0.25), gait);
    return way * 90 * rise(u, from, from + DEPART_TURN);
}

function entering(pose, stance, t, frames, running = false) {
    pose.revolve(arrive(pose, stance, onceTime(t, frames), ENTRY_TRAVEL_END, ENTRY_TURN_END, {running}));
}

function walk_in(pose, stance, t) {
    entering(pose, stance, t, 40);
}

function run_in(pose, stance, t) {
    entering(pose, stance, t, 28, true);
}

function pull_ups(pose, stance, t) {
    if (!supportsClip("pull_ups", stance)) {
        idle(pose, stance, t);
        return;
    }
    gripping(pose, stance, t, {pull: 0.5 - 0.5 * Math.cos(2 * Math.PI * t), swing: 0});
}

// hangs from a ledge by one hand, `side`, with the body below and the feet loose and swinging a little; the other arm hangs or carries
const dangle = (side) => (pose, stance, t) => gripping(pose, stance, t, {pull: 0, swing: waveOf(t), grips: [side]});

function gripping(pose, stance, t, {pull, swing, grips = Object.keys(SIDES)}) {
    const free = grips.filter((side) => stance.free.has(side));
    armsAtRest(pose, stance, free);
    pose.lift("root", {z: 0.2 + 0.38 * pull});
    trunk(pose, {nod: -3 * pull, turn: 2 * swing});
    for (const [side, sign] of Object.entries(SIDES)) {
        pose.turn(`thigh_${side}`, {x: -8 + 7 * swing * sign});
        pose.bend(`shin_${side}`, 18 + 8 * swing * sign);
        pose.turn(`foot_${side}`, {x: -10});
        if (!free.includes(side)) continue;
        const shoulder = pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`));
        const heads = pose.rig.heads;
        const upper = Math.abs(heads.get(`forearm_${side}`).x - heads.get(`upper_arm_${side}`).x);
        const lower = Math.abs(heads.get(`hand_${side}`).x - heads.get(`forearm_${side}`).x);
        const across = PULL_WRIST_X - sign * shoulder.x,
            up = PULL_WRIST_Z - shoulder.z;
        const bend = Math.acos((across * across + up * up - upper * upper - lower * lower) / (2 * upper * lower));
        const raiseBy = Math.atan2(up, across) - Math.atan2(lower * Math.sin(bend), upper + lower * Math.cos(bend));
        pose.turn(`upper_arm_${side}`, {x: -90});
        pose.turn(`upper_arm_${side}`, {y: (-sign * raiseBy * 180) / Math.PI});
        pose.bend(`forearm_${side}`, (bend * 180) / Math.PI);
        pose.face(`hand_${side}`, {x: -90, y: -sign * 45});
    }
}

// Each voice comes in and goes out in a manner of its own; an entrance ends on idle's first frame and an exit starts on it.
const ENTER_FRAMES = 36;
const EXIT_FRAMES = 28;
const BUTLER_SPRINT = 0.5;
const BUTLER_BOW = 0.36;
const PLATE_PITCH = 16;
const PLATE_ROLL = 7;
const CLIMB_PEEK = -2.78;
const CLIMB_PULLED = -1.54;
const CLIMB_GRIP = new THREE.Vector3(1.0, -0.6, 0.02);
const CLIMB_ELBOW = new THREE.Vector3(1.0, 0.3, -0.3);
const HANGING_ELBOW = new THREE.Vector3(0, 1, 0);
const HOMIE_FLING = {y: -20, z: -50, bend: 30};
const HANG_REACH = 0.97;
const CHIN_ELBOW = new THREE.Vector3(...THINK_ELBOW);
const LANDED = 0.24;
const TUCK = 0.1;
const HOP_RISE = 6.04;
const HOP_FALL = 10.36;
const HOP_REACH = 2.4;
const SQUIRE_CHARGE = 0.52;
const COACH_JOG = 0.42;
const COLLEAGUE_STROLL = 0.6;
const SIP_LIFT = 70;
const SIP_FORWARD = 45;
const SIP_TIP = -25;
const SQUIRE_SHIELD = {y: 30, z: -55, bend: 70};
const SQUIRE_QUILL = {y: -35, z: -80, bend: 10};
const COACH_POINT = {y: 0, z: -15, bend: 0};

// an arm taken from hanging at rest (k 0) toward a shape of its own (k 1): the upper arm's turn from the T about y, then x, then z, and the elbow's bend
function armTo(pose, side, k, {y = HANG, x = 0, z = 0, bend = 10}) {
    const sign = SIDES[side];
    pose.turn(`upper_arm_${side}`, {y: sign * mix(HANG, y, k)});
    pose.turn(`upper_arm_${side}`, {x: x * k});
    pose.turn(`upper_arm_${side}`, {z: sign * z * k});
    pose.bend(`forearm_${side}`, mix(10, bend, k));
}

// the hand carried from hanging (k 0) up through the front to `target` (k 1), the elbow pointing the way `elbow` says; it stays there while the body moves
function handTo(pose, side, k, target, elbow) {
    const shoulder = pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`));
    const toTarget = target.clone().sub(shoulder);
    const hanging = new THREE.Vector3(SIDES[side] * Math.cos(radians(HANG)), 0, -Math.sin(radians(HANG)));
    const way = hanging.lerp(toTarget.clone().normalize(), k).normalize();
    pose.reach(side, shoulder.clone().add(way.multiplyScalar(mix(HANG_REACH, toTarget.length(), k))), HANGING_ELBOW.clone().lerp(elbow, k));
}

const chin = (side) => new THREE.Vector3(SIDES[side] * CHIN_REST[0], CHIN_REST[1], CHIN_REST[2]);

// the legs folded so the feet stand `depth` nearer the hips, flat on whatever they stand on
function fold(pose, depth) {
    for (const side of Object.keys(SIDES)) stepLeg(pose, side, 0, 0, -depth);
}

// whatever a hand holds level rides on after the body has stopped: it pitches and rolls, and rings out by the end of `s`
function slosh(pose, stance, s) {
    [...stance.level].sort().forEach((side, index) => {
        const lag = Math.max(s - 0.05 * index, 0);
        pose.turn(`hand_${side}`, {x: PLATE_PITCH * ringing(lag, 3, 2.5), y: SIDES[side] * PLATE_ROLL * ringing(lag, 2.5, 3)});
    });
}

// how hard the whistle is blown at u: a short blast at each of `blasts`
const blowing = (u, blasts) => blasts.reduce((sum, at) => sum + swell(u, at, at + 0.05), 0);

const heldUp = (stance) => [...stance.carried].filter((side) => !stance.busy.has(side));

function butler_enter(pose, stance, u) {
    const brake = swell(u, BUTLER_SPRINT, BUTLER_SPRINT + 0.22);
    const facing = arrive(pose, stance, u, BUTLER_SPRINT, BUTLER_SPRINT + 0.14, {
        running: true,
        lean: 15,
        drop: 0.12 * brake,
        bend: {lean: -7 * brake, nod: 5 * brake},
    });
    slosh(pose, stance, span(u, BUTLER_SPRINT, 1));
    pose.revolve(facing);
}

function butler_exit(pose, stance, u) {
    const bow = swell(u, 0, BUTLER_BOW);
    pose.revolve(depart(pose, stance, u, BUTLER_BOW, -1, {bend: {lean: 30 * bow, nod: 24 * bow}}));
}

// the homie climbs up from behind the box: his head shows first, his hands slap onto the edge, he pulls up and springs onto it
function homie_enter(pose, stance, u) {
    const spring = span(u, 0.55, 0.72);
    const landed = u < 0.72 ? 0 : LANDED * (1 - rise(u, 0.84, 1));
    const height =
        u < 0.55
            ? mix(-4.4, CLIMB_PEEK, rise(u, 0, 0.16)) + (CLIMB_PULLED - CLIMB_PEEK) * rise(u, 0.3, 0.55)
            : u < 0.72
              ? mix(CLIMB_PULLED, -LANDED, spring) + 1.2 * Math.sin(Math.PI * spring)
              : -landed;
    pose.lift("root", {z: height});
    breathe(pose, 0);
    trunk(pose, {
        turn: 25 * Math.sin(2 * Math.PI * span(u, 0.06, 0.2)),
        lean: 14 * (landed / LANDED) + 8 * rise(u, 0.3, 0.55) * (1 - spring),
        nod: -10 * swell(u, 0.86, 1),
    });
    const grip = u >= 0.2 && u < 0.55 ? rise(u, 0.2, 0.27) : 0;
    const fling = swell(u, 0.55, 0.74);
    armsAtRest(pose, stance, grip || fling ? Object.keys(SIDES) : []);
    for (const side of Object.keys(SIDES)) {
        if (grip) {
            handTo(pose, side, grip, new THREE.Vector3(SIDES[side] * CLIMB_GRIP.x, CLIMB_GRIP.y, CLIMB_GRIP.z), CLIMB_ELBOW);
        } else if (fling) {
            armTo(pose, side, fling, HOMIE_FLING);
        }
    }
    fold(pose, u < 0.72 ? mix(0, LANDED, spring) + TUCK * Math.sin(Math.PI * spring) : landed);
}

// the homie springs off the box and drops out of sight below its edge, arms up all the way down
function homie_exit(pose, stance, u) {
    const flight = span(u, 0.3, 1);
    const ready = rise(u, 0.05, 0.3);
    const up = rise(u, 0.3, 0.42);
    pose.lift("root", {y: -HOP_REACH * flight, z: u < 0.3 ? -LANDED * ready : -LANDED + HOP_RISE * flight - HOP_FALL * flight * flight});
    breathe(pose, 0);
    trunk(pose, {lean: 15 * ready * (1 - up), nod: 18 * ready * (1 - up)});
    for (const side of Object.keys(SIDES)) {
        armTo(pose, side, ready, {y: mix(HANG, -60, up), x: mix(40, 0, up), z: -60 * up, bend: 15 * up});
    }
    fold(pose, u < 0.3 ? LANDED * ready : LANDED * (1 - up) + 2 * TUCK * swell(u, 0.36, 0.62));
    pose.revolve(-35 * rise(u, 0, 0.2));
}

// the squire charges in, shield up and quill held aloft like a sword, skids to a stop and lowers both
function squire_enter(pose, stance, u) {
    const shield = [...stance.busy];
    const quill = heldUp(stance);
    const charge = 1 - rise(u, 0.7, 0.92);
    const skid = swell(u, SQUIRE_CHARGE, SQUIRE_CHARGE + 0.2);
    const facing = arrive(pose, stance, u, SQUIRE_CHARGE, SQUIRE_CHARGE + 0.14, {
        running: true,
        lean: 14,
        apart: [...shield, ...quill],
        drop: 0.14 * skid,
        bend: {lean: -6 * skid},
    });
    shield.forEach((side) => armTo(pose, side, charge, SQUIRE_SHIELD));
    quill.forEach((side) => armTo(pose, side, charge, SQUIRE_QUILL));
    pose.shutEyes(1 - 0.45 * charge);
    pose.revolve(facing);
}

// the squire salutes with the quill before his face, turns and marches off
function squire_exit(pose, stance, u) {
    const quill = heldUp(stance);
    const salute = rise(u, 0, 0.12) * (1 - rise(u, 0.24, 0.34));
    const facing = depart(pose, stance, u, 0.34, -1, {
        clearance: 0.18,
        lean: 0,
        apart: salute ? quill : [],
        bend: {nod: 10 * swell(u, 0.1, 0.26)},
    });
    if (salute) quill.forEach((side) => handTo(pose, side, salute, chin(side), CHIN_ELBOW));
    pose.revolve(facing);
}

// the coach jogs in, jogs on the spot a few steps, then stops and blows the whistle twice
function coach_enter(pose, stance, u) {
    const side = freeSide(stance);
    const jog = rise(u, COACH_JOG, COACH_JOG + 0.04) * (1 - rise(u, 0.62, 0.7));
    const cycle = 6 * span(u, COACH_JOG, 0.7);
    const bob = -0.05 * jog * Math.abs(waveOf(cycle));
    const whistling = rise(u, 0.7, 0.76) * (1 - rise(u, 0.9, 0.98));
    const blast = blowing(u, [0.77, 0.83]);
    pose.lift("root", {z: bob});
    const facing = arrive(pose, stance, u, COACH_JOG, COACH_JOG + 0.1, {
        running: true,
        lean: 6,
        apart: whistling ? [side] : [],
        bend: {nod: 7 * blast, lean: 2 * blast},
    });
    if (whistling) handTo(pose, side, whistling, chin(side), CHIN_ELBOW);
    if (jog) {
        for (const [leg, offset] of [
            ["l", 0],
            ["r", 0.5],
        ])
            stepLeg(pose, leg, 0, 0.22 * jog * Math.max(waveOf(cycle + offset), 0), bob);
    }
    pose.shutEyes(1 - 0.6 * blast);
    pose.revolve(facing);
}

// the coach blows the whistle, points the way with the free hand and jogs off that way
function coach_exit(pose, stance, u) {
    const side = freeSide(stance);
    const whistling = rise(u, 0, 0.06) * (1 - rise(u, 0.2, 0.26));
    const pointing = rise(u, 0.26, 0.32) * (1 - rise(u, 0.42, 0.5));
    const blast = blowing(u, [0.07, 0.13]);
    const facing = depart(pose, stance, u, 0.4, SIDES[side], {
        running: true,
        lean: 6,
        apart: whistling || pointing ? [side] : [],
        bend: {nod: 7 * blast, lean: 2 * blast},
    });
    if (whistling) handTo(pose, side, whistling, chin(side), CHIN_ELBOW);
    if (pointing) armTo(pose, side, pointing, COACH_POINT);
    pose.shutEyes(1 - 0.6 * blast);
    pose.revolve(facing);
}

// the colleague strolls in with the mug, stops, and takes a sip
function colleague_enter(pose, stance, u) {
    const lifted = rise(u, 0.72, 0.8) * (1 - rise(u, 0.9, 0.98));
    const tipped = swell(u, 0.78, 0.92);
    const level = [...stance.level].sort();
    const facing = arrive(pose, stance, u, COLLEAGUE_STROLL, COLLEAGUE_STROLL + 0.12, {
        apart: lifted ? level : [],
        bend: {nod: -8 * tipped},
    });
    if (lifted) level.forEach((side) => hold(pose, side, mix(HOLD_LIFT, SIP_LIFT, lifted), SIP_FORWARD * lifted, SIP_TIP * tipped));
    pose.shutEyes(1 - 0.7 * tipped);
    pose.revolve(facing);
}

// the colleague gives a small wave with the free hand, turns and strolls off that way
function colleague_exit(pose, stance, u) {
    const side = freeSide(stance);
    const waving = rise(u, 0, 0.08) * (1 - rise(u, 0.24, 0.32));
    const facing = depart(pose, stance, u, 0.3, SIDES[side], {apart: waving ? [side] : [], bend: {tilt: -SIDES[side] * 5 * waving}});
    if (waving)
        armTo(pose, side, waving, {y: 0, x: -RAISED_ROLL, z: WAVE_BACK, bend: WAVE_BEND + WAVE_SWING * waveOf(span(u, 0, 0.32), 2)});
    pose.revolve(facing);
}

// the bare robot, with no manner of its own, walks in and turns to the viewer, and walks off
function bare_enter(pose, stance, u) {
    pose.revolve(arrive(pose, stance, u, ENTRY_TRAVEL_END, ENTRY_TURN_END));
}

function bare_exit(pose, stance, u) {
    pose.revolve(depart(pose, stance, u, 0, -1));
}

const ENTRANCES = {
    bare: bare_enter,
    butler: butler_enter,
    homie: homie_enter,
    squire: squire_enter,
    coach: coach_enter,
    colleague: colleague_enter,
};
const EXITS = {bare: bare_exit, butler: butler_exit, homie: homie_exit, squire: squire_exit, coach: coach_exit, colleague: colleague_exit};

function enter(pose, stance, t) {
    ENTRANCES[stance.voice](pose, stance, onceTime(t, ENTER_FRAMES));
}

function exit(pose, stance, t) {
    EXITS[stance.voice](pose, stance, onceTime(t, EXIT_FRAMES));
}

// What the figure does while the agent works, and the moments it marks; each pose starts and ends on idle's first frame unless it loops
const SEARCH_CROUCH = 0.2;
const CHASE_REACH = 1.4;
const TAP_LIFT = 0.13;

// rummages through a pile in front of it with the free hand, looking down and from side to side
function search(pose, stance, t) {
    const side = freeSide(stance);
    const sweep = waveOf(t);
    crouch(pose, SEARCH_CROUCH);
    breathe(pose, 0);
    trunk(pose, {lean: 26, nod: 20, turn: -SIDES[side] * 28 * sweep, twist: -SIDES[side] * 10 * sweep});
    armsAtRest(pose, stance, [side]);
    armTo(pose, side, 1, {y: 55, z: -55 + 30 * sweep, bend: 35});
    eyesAs(pose, "reading");
}

// writes in small strokes with the free hand at chest height, head bent over it; the squire writes with his quill
function write(pose, stance, t) {
    const side = freeSide(stance);
    breathe(pose, 0);
    trunk(pose, {lean: 6, nod: 16, turn: -SIDES[side] * 10});
    armsAtRest(pose, stance, [side]);
    armTo(pose, side, 1, {y: 40 + 6 * waveOf(t, 2), z: -70 + 10 * waveOf(t), bend: 75 + 8 * waveOf(t, 2)});
}

// hammers away with the free hand, the body dipping into each blow
function work(pose, stance, t) {
    const side = freeSide(stance);
    const raised = 0.5 + 0.5 * Math.cos(2 * Math.PI * t);
    const blow = 1 - raised;
    crouch(pose, 0.04 * blow);
    breathe(pose, 0);
    trunk(pose, {lean: 8 + 6 * blow, nod: 10});
    armsAtRest(pose, stance, [side]);
    armTo(pose, side, 1, {y: mix(75, -45, raised), z: -50, bend: mix(15, 105, raised)});
}

// points up at what waits for the user, looking at it, the arm bobbing a little
function point(pose, stance, t) {
    const side = freeSide(stance);
    breathe(pose, 0);
    trunk(pose, {nod: -14, lean: -3, tilt: -SIDES[side] * 5});
    armsAtRest(pose, stance, [side]);
    armTo(pose, side, 1, {y: -50 + 4 * waveOf(t), z: -35, bend: 6});
    eyesAs(pose, "worried", 0.6);
}

// the arms of a jump or a fall, those that carry nothing: swung back by `back` degrees and out and up by `up` degrees
function flung(pose, stance, back, up, flail = 0) {
    armsAtRest(pose, stance, [...stance.free]);
    for (const side of stance.free) {
        const sign = SIDES[side];
        pose.turn(`upper_arm_${side}`, {x: back + flail * sign});
        pose.turn(`upper_arm_${side}`, {y: -sign * up});
        pose.bend(`forearm_${side}`, 10 + 0.2 * up);
    }
}

// the legs tucked up under a body in the air, `tuck` from 0 to 1
function tucked(pose, tuck, kick = 0) {
    for (const [side, sign] of Object.entries(SIDES)) {
        pose.turn(`thigh_${side}`, {x: -24 * tuck + kick * sign});
        pose.turn(`shin_${side}`, {x: 44 * tuck});
        pose.turn(`foot_${side}`, {x: -8 * tuck});
    }
}

// a jump up to a perch: crouch with the arms swung back, push off with them swinging up, and leave the ground with the legs tucked
function jump(pose, stance, t) {
    const u = onceTime(t, 16);
    const crouch = rise(u, 0, 0.26) * (1 - rise(u, 0.26, 0.36));
    const air = rise(u, 0.3, 0.45);
    pose.lift("root", {z: 0.1 * air});
    breathe(pose, 0);
    trunk(pose, {lean: 14 * crouch - 6 * air, nod: -4 * air});
    flung(pose, stance, 40 * crouch, 80 * rise(u, 0.26, 0.42) * (1 - 0.4 * rise(u, 0.6, 1)));
    fold(pose, 0.28 * crouch);
    tucked(pose, air);
}

// a jump that turns over backwards on the way: the crouch, then the body tucked and turned all the way round about its hips in the air
function backflip(pose, stance, t) {
    const u = onceTime(t, 22);
    const crouch = rise(u, 0, 0.26) * (1 - rise(u, 0.26, 0.34));
    const turn = rise(u, 0.3, 0.86);
    const air = rise(u, 0.28, 0.4) * (1 - rise(u, 0.86, 0.95));
    pose.lift("root", {z: 0.1 * air});
    pose.turn("hips", {x: 360 * turn});
    breathe(pose, 0);
    trunk(pose, {lean: 12 * crouch});
    flung(pose, stance, 30 * crouch, 55 * air);
    fold(pose, 0.28 * crouch);
    tucked(pose, 1.2 * air);
}

// a fall down to a perch: the arms thrown up and flailing, the legs kicking, the body leaning back as it drops
function fall(pose, stance, t) {
    const u = onceTime(t, 12);
    const drop = rise(u, 0, 0.2);
    // the first instant is a gasp: the head and arms snap back and up before the flailing starts
    const gasp = swell(u, 0, 0.3);
    pose.lift("root", {z: 0.1 * drop});
    breathe(pose, 0);
    trunk(pose, {lean: -9 * drop - 8 * gasp, nod: -6 * drop - 10 * gasp, tilt: 4 * waveOf(t, 3) * drop});
    flung(pose, stance, 0, (70 + 8 * waveOf(t, 3)) * drop + 25 * gasp, 14 * waveOf(t, 3) * drop);
    eyesAs(pose, "startled", Math.max(gasp, 0.6 * drop));
    tucked(pose, 0.5 * drop, 14 * waveOf(t, 3) * drop);
}

// the landing after either: the knees take the weight, the body folds forward and the arms spread for balance, then it stands
function land(pose, stance, t) {
    const u = onceTime(t, 10);
    const dip = rise(u, 0, 0.2) * (1 - rise(u, 0.2, 1));
    breathe(pose, 0);
    trunk(pose, {lean: 16 * dip, nod: 8 * dip});
    flung(pose, stance, 0, 38 * dip);
    fold(pose, 0.32 * dip);
}

// the squire runs after a bug when a check goes red, quill out ahead of him, and comes back
function squire_chase(pose, stance, t) {
    const u = onceTime(t, 24);
    const out = u < 0.5;
    const reach = CHASE_REACH * (out ? ease(span(u, 0, 0.5)) : 1 - ease(span(u, 0.5, 1)));
    const motion = Math.sqrt(Math.max(Math.sin(Math.PI * u), 0));
    const quill = heldUp(stance);
    pose.lift("root", {y: out ? -reach : reach});
    stride(pose, stance, 4 * u, motion, {running: true, lean: 12, apart: quill});
    quill.forEach((side) => armTo(pose, side, motion, SQUIRE_QUILL));
    pose.revolve((out ? 90 : -90) * Math.min(1, 3 * Math.sin(Math.PI * u)));
}

// Each voice's one pointed remark after a long wait on the user, played once
// the butler taps his foot, patiently
function butler_pointed(pose, stance, u) {
    const tap = TAP_LIFT * Math.max(waveOf(3 * u), 0) * swell(u, 0, 1);
    breathe(pose, 0);
    trunk(pose, {tilt: 8 * swell(u, 0, 1), nod: 6 * swell(u, 0, 1), turn: 10 * swell(u, 0, 1)});
    armsAtRest(pose, stance);
    stepLeg(pose, "r", 0, tap, 0, (15 * tap) / TAP_LIFT);
}

// the homie shrugs: arms out, palms up, head on one side
function homie_pointed(pose, stance, u) {
    const shrug = swell(u, 0, 1);
    breathe(pose, 0);
    trunk(pose, {tilt: 14 * shrug, nod: -8 * shrug});
    for (const side of Object.keys(SIDES)) armTo(pose, side, shrug, {y: 30, z: -15, bend: 100});
}

// the coach gives one long blast on the whistle
function coach_pointed(pose, stance, u) {
    const side = freeSide(stance);
    const whistling = rise(u, 0, 0.15) * (1 - rise(u, 0.8, 1));
    const blast = swell(u, 0.2, 0.75);
    breathe(pose, 0);
    trunk(pose, {lean: -4 * blast, nod: -6 * blast});
    armsAtRest(pose, stance, whistling ? [side] : []);
    if (whistling) handTo(pose, side, whistling, chin(side), CHIN_ELBOW);
    pose.shutEyes(1 - 0.7 * blast);
}

// the colleague looks at the time on the free wrist, then at you
function colleague_pointed(pose, stance, u) {
    const side = freeSide(stance);
    const wrist = rise(u, 0, 0.2) * (1 - rise(u, 0.6, 0.85));
    breathe(pose, 0);
    trunk(pose, {nod: 18 * wrist * (1 - rise(u, 0.35, 0.5)), turn: -SIDES[side] * 8 * wrist});
    armsAtRest(pose, stance, wrist ? [side] : []);
    if (wrist) handTo(pose, side, wrist, chin(side), CHIN_ELBOW);
}

// the squire wags his quill at you, tut tut
function squire_pointed(pose, stance, u) {
    const quill = heldUp(stance);
    const raised = rise(u, 0, 0.2) * (1 - rise(u, 0.75, 1));
    breathe(pose, 0);
    trunk(pose, {tilt: -5 * raised, nod: 4 * raised});
    armsAtRest(pose, stance, raised ? quill : []);
    if (raised) quill.forEach((side) => armTo(pose, side, raised, {y: -10, z: -70 + 15 * waveOf(3 * u), bend: 60}));
}

const POINTED = {
    bare: butler_pointed,
    butler: butler_pointed,
    homie: homie_pointed,
    coach: coach_pointed,
    colleague: colleague_pointed,
    squire: squire_pointed,
};

function pointed(pose, stance, t) {
    POINTED[stance.voice](pose, stance, onceTime(t, 20));
}

// What a posture does to the legs of whatever clip is drawn in it: what it sets before the clip poses the body, and what it lays over the
// legs after. Standing, the clip has the legs to itself.
const LEGS = {
    sit: {under: seat, over: seatedLegs},
    walk: {under: strideUnder, over: strideLegs},
};

// The postures a clip is drawn in: a gesture standing, seated on an edge or on the move, its legs laid by the posture; a move of the whole
// body on its feet alone; a hang from its hands alone; and the laptop only on a lap
const GESTURE = ["stand", "sit", "walk"];
const MOVE = ["stand"];
const HANGING = ["hang"];
const ON_A_LAP = ["sit"];

// Every clip plays out before another starts, so the figure never reads as cut off: one that plays once to its end, a loop to the end of
// its cycle or of the stretch it names as `leaves`. A clip that is `cutShort` gives way the moment something else is wanted instead, as the
// walk does the moment there is nowhere left to go; a beat, a reaction, a hop or a landing never is.

export const CLIPS = [
    {name: "idle", frames: 24, fps: 8, loops: true, leaves: 8, postures: GESTURE, pose: idle},
    {name: "blink", frames: 6, fps: 12, loops: false, postures: GESTURE, pose: blink},
    {name: "nod", frames: 10, fps: 12, loops: false, postures: GESTURE, pose: nod},
    {name: "shake", frames: 12, fps: 12, loops: false, postures: GESTURE, pose: shake},
    {name: "wave", frames: 12, fps: 12, loops: true, postures: GESTURE, pose: wave},
    {name: "think", frames: 12, fps: 6, loops: true, postures: GESTURE, pose: think},
    {name: "celebrate", frames: 12, fps: 10, loops: true, postures: MOVE, pose: celebrate},
    {name: "sleep", frames: 18, fps: 6, loops: true, postures: GESTURE, pose: sleep},
    {name: "walk", frames: 12, fps: 12, loops: true, cutShort: true, postures: MOVE, pose: walk},
    {name: "walk_in", frames: 40, fps: 12, loops: false, postures: MOVE, pose: walk_in},
    {name: "run_in", frames: 28, fps: 12, loops: false, postures: MOVE, pose: run_in},
    {name: "pull_ups", frames: 24, fps: 10, loops: true, postures: MOVE, pose: pull_ups},
    {name: "hang_l", frames: 24, fps: 8, loops: true, leaves: 8, postures: HANGING, pose: dangle("l")},
    {name: "hang_r", frames: 24, fps: 8, loops: true, leaves: 8, postures: HANGING, pose: dangle("r")},
    {name: "enter", frames: 36, fps: 12, loops: false, postures: MOVE, pose: enter},
    {name: "exit", frames: 28, fps: 12, loops: false, postures: MOVE, pose: exit},
    {name: "search", frames: 12, fps: 10, loops: true, postures: GESTURE, pose: search},
    {name: "write", frames: 12, fps: 12, loops: true, postures: GESTURE, pose: write},
    {name: "work", frames: 8, fps: 10, loops: true, postures: GESTURE, pose: work},
    {name: "point", frames: 12, fps: 8, loops: true, postures: GESTURE, pose: point},
    {name: "jump", frames: 16, fps: 20, loops: false, postures: MOVE, pose: jump},
    {name: "fall", frames: 12, fps: 12, loops: false, postures: MOVE, pose: fall},
    {name: "backflip", frames: 22, fps: 20, loops: false, postures: MOVE, pose: backflip},
    {name: "land", frames: 10, fps: 20, loops: false, postures: MOVE, pose: land},
    {name: "type", frames: 24, fps: 8, loops: true, leaves: 8, postures: ON_A_LAP, pose: type},
    {name: "joy", frames: 20, fps: 14, loops: false, postures: GESTURE, pose: joy},
    {name: "dismay", frames: 28, fps: 10, loops: false, postures: GESTURE, pose: dismay},
    {name: "look_around", frames: 24, fps: 10, loops: false, postures: GESTURE, pose: look_around},
    {name: "stretch", frames: 24, fps: 8, loops: false, postures: GESTURE, pose: stretch},
    {name: "squire_chase", frames: 24, fps: 12, loops: false, postures: MOVE, pose: squire_chase},
    {name: "pointed", frames: 20, fps: 10, loops: false, postures: MOVE, pose: pointed},
];

// An eye closes about its own middle before the head carries it, as rig.Figure.shut_eyes scales the eye object
const SKINNED = /* glsl */ `
    #include <common>
    #include <skinning_pars_vertex>
    attribute vec3 hullNormal;
    uniform float push;
    uniform float openness;
    uniform float eyeMiddle;
    varying vec3 worldNormal;

    void main() {
        #include <beginnormal_vertex>
        #ifdef HULL
            objectNormal = hullNormal;
        #endif
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <begin_vertex>
        transformed.y = eyeMiddle + (transformed.y - eyeMiddle) * openness;
        #include <skinning_vertex>
        transformed += normalize(objectNormal) * push;
        worldNormal = normalize(mat3(modelMatrix) * objectNormal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
`;

const FLAT = /* glsl */ `
    uniform vec3 colour;
    uniform vec3 light;
    uniform vec3 shade;
    uniform float litFrom;
    varying vec3 worldNormal;

    void main() {
        vec3 normal = normalize(worldNormal);
        if (!gl_FrontFacing) {
            normal = -normal;
        }
        float lit = step(litFrom, dot(normal, light));
        gl_FragColor = vec4(colour * mix(shade, vec3(1.0), lit), 1.0);
        #include <colorspace_fragment>
    }
`;

const LINE = /* glsl */ `
    uniform vec3 colour;

    void main() {
        gl_FragColor = vec4(colour, 1.0);
        #include <colorspace_fragment>
    }
`;

function vertexUniforms(mesh, push) {
    const position = mesh.geometry.attributes.position;
    let middle = 0;
    for (let i = 0; i < position.count; i++) {
        middle += position.getY(i) / position.count;
    }
    // a quantized glb scales each mesh up from small units, so the outline is pushed in the mesh's own units
    return {push: {value: push / mesh.getWorldScale(new THREE.Vector3()).x}, openness: {value: 1}, eyeMiddle: {value: middle}};
}

function flatMaterial(mesh) {
    const {r, g, b} = mesh.material.color;
    return new THREE.ShaderMaterial({
        vertexShader: SKINNED,
        fragmentShader: FLAT,
        side: THREE.DoubleSide,
        uniforms: {
            ...vertexUniforms(mesh, 0),
            colour: {value: new THREE.Vector3(r, g, b)},
            light: {value: LIGHT_FROM.clone().normalize().applyMatrix4(TO_GLB)},
            shade: {value: SHADE},
            litFrom: {value: LIT_FROM},
        },
    });
}

function outlineMaterial(mesh) {
    return new THREE.ShaderMaterial({
        vertexShader: SKINNED,
        fragmentShader: LINE,
        side: THREE.BackSide,
        defines: {HULL: ""},
        uniforms: {...vertexUniforms(mesh, OUTLINE_WIDTH), colour: {value: OUTLINE_COLOUR}},
    });
}

// Solidify pushes each vertex along its smooth normal; a flat-shaded mesh arrives split, so its corners are averaged
// again, leaving out a corner facing the other way, which is the back layer of a two-sided piece at the same point
const SAME_VERTEX = -0.5;

function addHullNormals(geometry) {
    const position = geometry.attributes.position;
    const normals = Array.from({length: position.count}, (_, i) => new THREE.Vector3().fromBufferAttribute(geometry.attributes.normal, i));
    const corners = new Map();
    const key = (i) => `${position.getX(i).toFixed(5)},${position.getY(i).toFixed(5)},${position.getZ(i).toFixed(5)}`;
    for (let i = 0; i < position.count; i++) {
        const group = corners.get(key(i)) ?? [];
        group.push(i);
        corners.set(key(i), group);
    }
    const hull = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i++) {
        const sum = new THREE.Vector3();
        for (const j of corners.get(key(i)).filter((j) => normals[i].dot(normals[j]) > SAME_VERTEX)) {
            sum.add(normals[j]);
        }
        sum.normalize().toArray(hull, i * 3);
    }
    geometry.setAttribute("hullNormal", new THREE.BufferAttribute(hull, 3));
}

function handsHolding(meshes, items) {
    const sides = new Set();
    for (const mesh of meshes.filter((mesh) => items.has(mesh.userData.item))) {
        sides.add(new THREE.Box3().setFromObject(mesh).getCenter(new THREE.Vector3()).x >= 0 ? "l" : "r");
    }
    return sides;
}

function rigOf(root) {
    const bones = [];
    root.traverse((node) => node.isBone && bones.push(node));
    const parents = new Map(bones.map((bone) => [bone.name, bone.parent.isBone ? bone.parent.name : ""]));
    const rest = new Map(bones.map((bone) => [bone.name, bone.matrixWorld.clone()]));
    const heads = new Map(bones.map((bone) => [bone.name, toBlender(new THREE.Vector3().setFromMatrixPosition(bone.matrixWorld))]));
    const along = new Map(
        bones.map((bone) => [bone.name, new THREE.Vector3().setFromMatrixColumn(bone.matrixWorld, 1).transformDirection(FROM_GLB)])
    );
    return {bones, order: bones.map((bone) => bone.name), parents, rest, heads, along};
}

// The glb's bytes; a host that serves no .glb, such as a claude.ai artifact, carries it as base64 in <url>.txt
async function glbBytes(url) {
    const glb = await fetch(url);
    if (glb.ok) {
        return glb.arrayBuffer();
    }
    const text = await fetch(`${url}.txt`).then((response) => response.text());
    return Uint8Array.from(atob(text), (character) => character.charCodeAt(0)).buffer;
}

// The figure of one voice from its glb, its worn pieces drawn and the body parts they cover left out (rig.assemble)
export async function loadFigure(url, wardrobe, voice) {
    const [bytes, manifest] = await Promise.all([glbBytes(url), fetch(wardrobe).then((response) => response.json())]);
    const bare = voice === "bare";
    const covered = new Set((bare ? [] : manifest.outfits[voice]).flatMap((item) => manifest.assets[item].hide_base_parts));
    return figureOf(bytes, voice, DECODER, (mesh) => !covered.has(mesh.name) && !(bare && mesh.userData.item));
}

// The figure in a glb's bytes, posed by the clips: every mesh `shows` keeps is drawn, shaded and outlined; `decoder` is where Draco's decoder is served
export async function figureOf(bytes, voice, decoder, shows = () => true) {
    const gltf = await new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath(decoder)).parseAsync(bytes, "");
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);
    const meshes = [];
    scene.traverse((node) => node.isSkinnedMesh && meshes.push(node));
    const eyes = {materials: [], shapes: [], hearts: []};
    for (const mesh of meshes) {
        mesh.visible = shows(mesh) && !LEFT_OUT.has(mesh.userData.item);
        addHullNormals(mesh.geometry);
        const hull = new THREE.SkinnedMesh(mesh.geometry, outlineMaterial(mesh));
        hull.bind(mesh.skeleton, mesh.bindMatrix);
        hull.visible = mesh.visible;
        hull.frustumCulled = mesh.frustumCulled = false;
        mesh.material = flatMaterial(mesh);
        mesh.parent.add(hull);
        hull.position.copy(mesh.position);
        hull.quaternion.copy(mesh.quaternion);
        hull.scale.copy(mesh.scale);
        if (mesh.name.startsWith("eye_")) {
            mesh.material.userData.colour = mesh.material.uniforms.colour.value.toArray();
            eyes.materials.push(mesh.material, hull.material);
            eyes.shapes.push(mesh, hull);
            eyes.hearts.push(heartOver(mesh));
        }
    }
    const carried = meshes.filter((mesh) => mesh.visible);
    const busy = handsHolding(carried, BUSY_ITEMS);
    const stance = {
        voice,
        level: handsHolding(carried, LEVEL_ITEMS),
        busy,
        carried: handsHolding(carried, new Set([...BUSY_ITEMS, "squire_quill"])),
        free: new Set(Object.keys(SIDES).filter((side) => !busy.has(side))),
    };
    const laptop = laptopOf();
    scene.add(laptop);
    return {scene, rig: rigOf(scene), stance, eyes, laptop};
}

// A laptop drawn in the flat colours of the chat's own: its hinge at the origin, its keyboard toward the body (-z), its lid opened a little
// past upright with the screen toward the face and the mark on its back
const LAPTOP = {width: 1.0, depth: 0.55, thickness: 0.09, open: 105};
const LAPTOP_COLOURS = {base: 0x474a52, lid: 0x2b2e38, screen: 0x1b1d24, edge: 0xa9adb8, mark: 0x5e64c9};

function laptopOf() {
    const {width, depth, thickness, open} = LAPTOP;
    const flat = (geometry, colour) => {
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: colour, side: THREE.DoubleSide}));
        mesh.frustumCulled = false;
        return mesh;
    };
    const slab = (colour, w, h, d) => {
        const mesh = flat(new THREE.BoxGeometry(w, h, d), colour);
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({color: LAPTOP_COLOURS.edge})));
        return mesh;
    };
    const base = slab(LAPTOP_COLOURS.base, width, thickness, depth);
    base.position.set(0, thickness / 2, -depth / 2);
    const lid = slab(LAPTOP_COLOURS.lid, width, depth, thickness);
    lid.position.set(0, depth / 2, thickness / 2);
    const screen = flat(new THREE.PlaneGeometry(width * 0.88, depth * 0.82), LAPTOP_COLOURS.screen);
    screen.position.set(0, depth / 2, -0.002);
    const mark = flat(new THREE.CircleGeometry(depth * 0.12, 20), LAPTOP_COLOURS.mark);
    mark.position.set(0, depth / 2, thickness + 0.002);
    const hinge = new THREE.Group();
    hinge.position.y = thickness;
    hinge.rotation.x = radians(open - 90);
    hinge.add(lid, screen, mark);
    const laptop = new THREE.Group();
    laptop.matrixAutoUpdate = false;
    laptop.visible = false;
    laptop.add(base, hinge);
    return laptop;
}

// Where the laptop sits: level on the thighs with its hinge out past the knees, clear of the body, turned the way the thighs point, so it
// turns with the figure
const LAP_REACH = 1.5;
const THIGH_TOP = 0.3;

function lapOf(world) {
    const at = (name) => new THREE.Vector3().setFromMatrixPosition(world.get(name));
    const hips = at("thigh_l").add(at("thigh_r")).multiplyScalar(0.5);
    const knees = at("shin_l").add(at("shin_r")).multiplyScalar(0.5);
    const forward = knees.clone().sub(hips).setY(0).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    const hinge = hips.lerp(knees, LAP_REACH).addScaledVector(up, THIGH_TOP);
    return new THREE.Matrix4().makeBasis(up.clone().cross(forward), up, forward).setPosition(hinge);
}

// A heart the size of an eye, drawn flat toward the viewer, its point down
const HEART = (() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.5);
    shape.bezierCurveTo(-0.16, -0.3, -0.5, -0.16, -0.5, 0.12);
    shape.bezierCurveTo(-0.5, 0.4, -0.2, 0.5, 0, 0.26);
    shape.bezierCurveTo(0.2, 0.5, 0.5, 0.4, 0.5, 0.12);
    shape.bezierCurveTo(0.5, -0.16, 0.16, -0.3, 0, -0.5);
    return new THREE.ShapeGeometry(shape, 12);
})();
const HEART_SIZE = 0.42;
const HEART_COLOUR = new THREE.Color(1, 0.3, 0.5);

// a heart over an eye, carried by the head as the eye is, hidden until the eyes are hearts
function heartOver(eye) {
    const bounds = new THREE.Box3().setFromBufferAttribute(eye.geometry.attributes.position).applyMatrix4(eye.matrixWorld);
    const centre = bounds.getCenter(new THREE.Vector3()).setZ(bounds.max.z + 0.01);
    const head = eye.skeleton.getBoneByName("head");
    const holder = new THREE.Group();
    holder.matrixAutoUpdate = false;
    holder.matrix.copy(head.matrixWorld).invert().multiply(translation(centre));
    const heart = new THREE.Mesh(HEART, new THREE.MeshBasicMaterial({color: HEART_COLOUR}));
    heart.frustumCulled = false;
    heart.visible = false;
    holder.add(heart);
    head.add(holder);
    return heart;
}

// Each bone's move `k` of the way from the moves in `from` to those in `to`: its head carried along a straight line and its turn eased the
// short way round, so a change of clip, posture or facing flows from the last pose drawn instead of jumping to the next
function blended(rig, from, to, k) {
    return new Map(
        [...to].map(([name, move]) => {
            const rest = rig.heads.get(name);
            const head = rest.clone().applyMatrix4(from.get(name)).lerp(rest.clone().applyMatrix4(move), k);
            const turn = new THREE.Quaternion().setFromRotationMatrix(from.get(name));
            turn.slerp(new THREE.Quaternion().setFromRotationMatrix(move), k);
            return [
                name,
                translation(head)
                    .multiply(new THREE.Matrix4().makeRotationFromQuaternion(turn))
                    .multiply(translation(rest.clone().negate())),
            ];
        })
    );
}

// the figure's bones placed for the pose, turned `facing` degrees, eased from `blend.from` by `blend.k` while a blend is given; the moves
// placed are returned, so the next change can ease from them
function place(figure, pose, facing, blend) {
    const moves = blend ? blended(figure.rig, blend.from, pose.moves(facing), blend.k) : pose.moves(facing);
    const world = new Map();
    for (const bone of figure.rig.bones) {
        const placed = TO_GLB.clone().multiply(moves.get(bone.name)).multiply(FROM_GLB).multiply(figure.rig.rest.get(bone.name));
        world.set(bone.name, placed);
        const parentWorld = bone.parent.isBone ? world.get(bone.parent.name) : bone.parent.matrixWorld;
        parentWorld.clone().invert().multiply(placed).decompose(bone.position, bone.quaternion, bone.scale);
    }
    for (const material of figure.eyes.materials) {
        material.uniforms.openness.value = pose.eyes;
        if (material.uniforms.light) material.uniforms.colour.value.set(...(pose.eyeTint ?? material.userData.colour));
    }
    figure.laptop.visible = pose.laptop;
    if (pose.laptop) {
        figure.laptop.matrix.copy(lapOf(world));
        figure.laptop.matrixWorldNeedsUpdate = true;
    }
    for (const shape of figure.eyes.shapes) shape.visible = !pose.hearts;
    for (const heart of figure.eyes.hearts) {
        heart.visible = pose.hearts > 0;
        heart.scale.setScalar(HEART_SIZE * pose.hearts);
    }
    return moves;
}

// A look the eyes take on over whatever the body does, `seconds` into a look that lasts `lasts` seconds: taken on at once and let go at the
// end, the head turned to the viewer meanwhile so the eyes are seen. Hearts beat as a heart does, a strong swell and a weaker one.
const BEAT_SECONDS = 0.8;
const LOOK_TURN = 0.8;

function lookAs(pose, {mood, seconds, lasts}, facing) {
    const strength = span(seconds, 0, 0.15) * (1 - span(seconds, lasts - 0.3, lasts));
    const sideways = ((facing + 180) % 360) - 180;
    pose.turn("neck", {z: -0.3 * LOOK_TURN * sideways * strength});
    pose.turn("head", {z: -0.7 * LOOK_TURN * sideways * strength});
    if (EYES[mood].hearts) {
        const beat = (seconds % BEAT_SECONDS) / BEAT_SECONDS;
        pose.heartEyes(strength * (1 + 0.28 * swell(beat, 0, 0.3) + 0.14 * swell(beat, 0.3, 0.55)));
    } else {
        eyesAs(pose, mood, strength);
    }
}

// One renderer for every picture on a page: it poses the figure, draws it and copies the result onto a canvas
export class Stage {
    constructor() {
        const half = FRAMED_HEIGHT / 2;
        this.camera = new THREE.OrthographicCamera(-half, half, half, -half, DISTANCE - DEPTH, DISTANCE + DEPTH);
        this.camera.position.set(0, FRAMED_MIDDLE, DISTANCE);
        this.camera.lookAt(0, FRAMED_MIDDLE, 0);
        this.renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
        this.renderer.setPixelRatio(1);
        this.renderer.setClearColor(0x000000, 0);
    }

    // The clip's pose at this frame in `posture`, the figure turned `facing` degrees, with the look `eyes` takes on, drawn to fill the canvas;
    // on the move, `stride` is how far through its step the walk is, and during a change `blend` eases from the moves drawn before it. It
    // returns the moves it drew.
    draw(figure, clip, frame, facing, canvas, {posture = "stand", eyes = null, stride = 0, blend = null} = {}) {
        const pose = new Posing(figure.rig, posture, stride);
        LEGS[posture]?.under(pose);
        clip.pose(pose, figure.stance, frame / clip.frames);
        LEGS[posture]?.over(pose);
        if (eyes) lookAs(pose, eyes, facing);
        const moves = place(figure, pose, facing, blend);
        const size = canvas.width * SUPERSAMPLE;
        if (this.renderer.domElement.width !== size) {
            this.renderer.setSize(size, size, false);
        }
        this.renderer.render(figure.scene, this.camera);
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingQuality = "high";
        context.filter = `blur(${(SOFTEN * canvas.width) / CELL}px)`;
        context.drawImage(this.renderer.domElement, 0, 0, canvas.width, canvas.height);
        return moves;
    }
}
