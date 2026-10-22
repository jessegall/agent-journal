// A rigged figure drawn in the browser as Blender draws it: posed by a port of clips.py and rig.Posing, shaded as
// toon.py shades it, one held pose for each step of a clip.
import * as THREE from "three";
import {blendMoves} from "./blend.js";
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
const HANG = 65;
const ARM_CLEAR_RAISE = 25;
const ARM_RAISE_SPAN = 25;
const HOLD_LIFT = -6;
// how far a forearm held level turns in from pointing out to the side, past forward, so it lies across the waist as a waiter's does
const HOLD_SWING = 95;
const HOLD_TWIST = 25;
// how far the hand holding something level turns back from the forearm's line at the wrist, kept as it was before the forearm was laid
// across the waist
const HOLD_WRIST = 30;
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
const SLEEP_FRAMES = 18;
// what the butler once carried on the platter is left out, so its hands are empty; the cloth stays over the forearm it holds level
const LEFT_OUT = new Set(["butler_tray"]);
// what a figure holds only in the poses that use it, as the butler's tablet while he writes or searches
const TABLET = "butler_tablet";
// the butler's cloth, kept in his pocket and drawn only to polish his visor
const CLOTH = "butler_towel";
// how far the hand holding the tablet tips it up toward the face, and where on it the free hand touches, from that hand toward the free side
const TABLET_TIP = 65;
const TABLET_TOUCH = [-0.3, -0.22, 0.18];
const LEVEL_ITEMS = new Set(["butler_towel", "colleague_mug"]);
const BUSY_ITEMS = new Set([...LEVEL_ITEMS, "squire_shield", "coach_clipboard"]);
// what a figure carries in its hands, put away while it holds a prop so it never holds two things
const IN_HAND = new Set([...BUSY_ITEMS, "squire_quill"]);
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
export class Posing {
    constructor(rig, posture = "stand", stride = 0) {
        this.rig = rig;
        this.final = new Map();
        this.eyes = 1;
        this.eyeTint = null;
        this.hearts = 0;
        this.laptop = false;
        this.tablet = false;
        this.cloth = false;
        this.glass = "";
        this.book = null;
        this.props = new Map();
        this.stowed = new Set();
        this.keep = new Set();
        this.tap = 0;
        this.gaze = null;
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

    // Rotate a snapshot, not a parent already rotated twice.
    turnAll({x = 0, y = 0, z = 0}, at = new THREE.Vector3()) {
        const turn = aboutPoint(at, euler(x, y, z));
        this.final = new Map(this.rig.order.map((name) => [name, turn.clone().multiply(this.matrix(name))]));
    }

    revolve(degrees) {
        this.turnAll({z: degrees});
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

    // the tablet in the hand at the end of the forearm held across the waist, for the free hand to write on or swipe
    holdTablet() {
        this.tablet = true;
    }

    // the cloth out of the pocket, in the hand that keeps it
    holdCloth() {
        this.cloth = true;
    }

    // a magnifying glass, comically large, in the hand on `side`
    holdGlass(side) {
        this.glass = side;
    }

    holdBook(open, page, visible) {
        this.book = {open, page, visible};
    }

    holdProp(name, side, offset = [0, 0, 0], turn = {}) {
        this.props.set(name, {bone: `hand_${side}`, frame: `hand_${side}`, at: this.grip(side, offset), turn});
    }

    // a prop in the hand on `side` that keeps turned as the body is, not as the hand is, so a glass or a trophy stays upright
    holdUpright(name, side, offset = [0, 0, 0], turn = {}) {
        this.props.set(name, {bone: `hand_${side}`, frame: "root", at: this.grip(side, offset), turn});
    }

    // a prop worn on the head, `offset` from the head's own place at rest, as the hat lifted from it or the sunglasses put on
    wearProp(name, offset, turn = {}) {
        this.props.set(name, {bone: "head", frame: "head", at: this.rig.heads.get("head").clone().add(new THREE.Vector3(...offset)), turn});
    }

    // where the hand on `side` grips at rest, `offset` from its own grip
    grip(side, offset) {
        return this.rig.heads.get(`hand_${side}`).clone().add(new THREE.Vector3(SIDES[side] * (HAND.grip + offset[0]), HAND.forward + offset[1], offset[2]));
    }

    putAway(...items) {
        items.forEach((item) => this.stowed.add(item));
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
    pose.face(`hand_${side}`, {x: tip, z: -sign * (HOLD_SWING - HOLD_WRIST)});
}

function armsAtRest(pose, stance, apart = [], swing = {}, level = stance.level) {
    for (const side of Object.keys(SIDES)) {
        if (apart.includes(side)) {
            continue;
        }
        if (level.has(side)) {
            hold(pose, side);
            continue;
        }
        hang(pose, side, swing[side] ?? 0);
        if (stance.shield?.has(side)) pose.turn(`hand_${side}`, {y: -SIDES[side] * SHIELD_ROLL, z: SIDES[side] * SHIELD_TURN});
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
        armTo(pose, side, 1, {y: -ARM_CLEAR_RAISE, bend: 10 + 6 * waveOf(t, 4)});
    }
    for (const side of Object.keys(SIDES)) {
        pose.turn(`thigh_${side}`, {x: -18 * jump});
        pose.turn(`shin_${side}`, {x: 34 * jump});
        pose.turn(`foot_${side}`, {x: -10 * jump});
    }
}

function sleep(pose, stance, t) {
    const frame = t * (ACTING.yawnFrames + SLEEP_FRAMES);
    if (frame < ACTING.yawnFrames) return yawn(pose, stance, frame / ACTING.yawnFrames);
    const breath = waveOf((frame - ACTING.yawnFrames) / SLEEP_FRAMES);
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
const PULL_ROOT = {back: 0.58, up: 0.36, rise: 0.38};
const PULL_ELBOW = new THREE.Vector3(1, -1, -1);

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
        pose.turn(`foot_${side}`, {x: -sign * 5 * pose.sway + (side === "r" ? pose.tap : 0)});
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
const TYPING_HANDS = [0.3, -0.45, 2.0];
const EYE_HANDS = [0.46, -0.82, 2.04];

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
    for (const side of stance.free) pose.face(`hand_${side}`, {z: -SIDES[side] * 90 * hands});
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
    pose.lift("root", {y: PULL_ROOT.back, z: PULL_ROOT.up + PULL_ROOT.rise * pull});
    trunk(pose, {nod: -3 * pull, turn: 2 * swing});
    armsAtRest(pose, stance, free);
    for (const [side, sign] of Object.entries(SIDES)) {
        pose.turn(`thigh_${side}`, {x: -8 + 7 * swing * sign});
        pose.bend(`shin_${side}`, 18 + 8 * swing * sign);
        pose.turn(`foot_${side}`, {x: -10});
        if (!free.includes(side)) continue;
        pose.reach(side, new THREE.Vector3(sign * PULL_WRIST_X, 0, PULL_WRIST_Z), PULL_ELBOW);
        pose.face(`hand_${side}`, {x: -90});
    }
}

// Each voice comes in and goes out in a manner of its own; an entrance ends on idle's first frame and an exit starts on it.
const ENTER_FRAMES = 36;
const EXIT_FRAMES = 28;
const BUTLER_SPRINT = 0.5;
const BUTLER_BOW = 0.36;
const PLATE_PITCH = 16;
const PLATE_ROLL = 7;
const CLIMB_PEEK = -2.45;
const CLIMB_PULLED = -1.54;
const CLIMB_GRIP = new THREE.Vector3(1.0, -0.6, 0.02);
const CLIMB_ELBOW = new THREE.Vector3(1, -1, -1);
const HANGING_ELBOW = new THREE.Vector3(0, 1, 0);
const HOMIE_FLING = {y: -15, z: -10, bend: 15};
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
const SQUIRE_SHIELD = {y: 60, z: -10, bend: 15};
// how far a shield hanging at the side is turned from facing forward, so it is carried edge on, its face to the side
const SHIELD_TURN = 60;
// and how far it is rolled in its own plane, so its point hangs straight down
const SHIELD_ROLL = 45;
const SQUIRE_QUILL = {y: 30, z: -25, bend: 10};
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
            pose.face(`hand_${side}`, {z: -SIDES[side] * 90 * grip});
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
        armTo(pose, side, ready, {y: mix(HANG, -15, up), x: mix(40, 0, up), z: -10 * up, bend: 10});
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
    if (lifted) sipMotion(pose, stance, lifted, tipped);
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

// where the glance is across one slow search cycle: one way, a pause, the other way, a pause, back to centre, a longer rest
function glanceOf(t) {
    return rise(t, 0, 0.22) - 2 * rise(t, 0.32, 0.62) + rise(t, 0.7, 0.85);
}

// rummages through a pile in front of it with the free hand, looking down and slowly from side to side
function search(pose, stance, t) {
    const side = freeSide(stance);
    const sweep = glanceOf(t);
    crouch(pose, SEARCH_CROUCH);
    breathe(pose, 0);
    trunk(pose, {lean: 26, nod: 20, turn: -SIDES[side] * 28 * sweep, twist: -SIDES[side] * 10 * sweep});
    armsAtRest(pose, stance, [side]);
    armTo(pose, side, 1, {y: 30, z: -60 + 25 * sweep, bend: 80});
    pose.holdGlass(side);
    eyesAs(pose, "reading");
}

const READING = {
    intro: 12,
    hold: 48,
    outro: 12,
    fps: 12,
    ready: 3,
    opens: 11,
    pageEvery: 24,
    pageFrom: 12,
    pageTo: 20,
    nod: 12,
    lineNod: 0.8,
    scan: 3,
    lines: 4,
    referenceArm: 0.985,
    forward: 0.68,
    drop: 0.3,
    drawDrop: 0.18,
    elbow: [1, -1, -1],
    wristTurn: 90,
};
const READ_FRAMES = READING.intro + READING.hold + READING.outro;

export const HAND = {grip: 0.34, forward: 0.02};
export const ACTING = {
    intro: 8, hold: 32, outro: 8, fps: 12,
    yawnFrames: 28, pastimeFrames: 40, greetingFrames: 24,
    hopFrames: 20, stumbleFrames: 24,
    elbow: [1, -0.15, -0.35],
    wrist: [0.72, -0.72, 1.76],
    supportLift: 0.22, watchLift: 0.3, whistleLift: 0.25, clothLift: 0.2, clothTurn: -90, compactFps: 6,
    tap: 10, rock: 3, turn: 12, nod: 8,
    writeStroke: 0.035, writeHeight: 0.02,
    pocket: [0.83, -0.35, 1.46],
    watch: [0.74, -0.72, 2.04],
    glance: 22, hop: 0.18, stumble: 12,
    writingWrist: [0.38, -0.76, 2.1],
    yawnWrist: [0.48, -0.86, 2.12], whistleWrist: [0.48, -0.82, 2.2],
    sipWrist: [0.7, -0.63, 2.17], shieldWrist: [0.22, -0.64, 2.13],
    wipeWrist: [0.1, -0.7, 1.9], saluteWrist: [1.28, -0.32, 2.59],
    gestureIn: 0.2, gestureOut: 0.8,
    yawnEyes: 0.94, yawnSpan: [0.08, 0.92],
    pastimeSpan: [0.3, 0.7], whistleEyes: 0.65, sipEyes: 0.5, sipTip: 12,
    headphoneEyes: 0.4, beats: 4, sways: 2, wipes: 3, wipeLift: 0.035,
    wipeAcross: 0.04, bowLean: 18, bowNod: 10,
    leapSpan: [0.18, 0.78], catchSpan: [0.15, 0.45], recoverSpan: [0.45, 0.85], recover: 0.3,
};
export const WRITING = {butler: "writing_stylus", coach: "writing_pencil", colleague: "writing_pen", homie: "writing_marker", squire: "writing_quill"};
const HELD_FRAMES = ACTING.intro + ACTING.hold + ACTING.outro;
// The wait, one long round: the watch taken out and held up for over five seconds, put back, and a while of whistling idly before the
// next look, so the watch is never taken out and put away again in a quick loop. Spans are shares of the held part.
export const WAIT = {intro: 8, hold: 144, outro: 8, watchOut: [0.04, 0.12], watchBack: [0.6, 0.68], whistleSpan: [0.7, 0.98], beats: 12, sways: 3};
const WAIT_FRAMES = WAIT.intro + WAIT.hold + WAIT.outro;
const READ_GAZE = {across: 0.04, top: 0.52, bottom: 0.44, forward: [0, -1, 0]};

function heldTime(t) {
    const frame = t * HELD_FRAMES;
    const held = frame >= ACTING.intro && frame < ACTING.intro + ACTING.hold;
    const draw = frame < ACTING.intro ? frame : HELD_FRAMES - 1 - frame;
    return {frame, held, ready: held ? 1 : rise(draw, 0, ACTING.intro - 1), phase: held ? (frame - ACTING.intro) / ACTING.hold : 0};
}

function waitTime(t) {
    const frame = t * WAIT_FRAMES;
    const held = frame >= WAIT.intro && frame < WAIT.intro + WAIT.hold;
    const draw = frame < WAIT.intro ? frame : WAIT_FRAMES - 1 - frame;
    return {ready: held ? 1 : rise(draw, 0, WAIT.intro - 1), phase: held ? (frame - WAIT.intro) / WAIT.hold : 0};
}

function gestureTime(t, frames) {
    const u = onceTime(t, frames);
    return {u, ready: rise(u, 0, ACTING.gestureIn) * (1 - rise(u, ACTING.gestureOut, 1))};
}

function handGrip(pose, side, offset = [0, 0, 0]) {
    return pose.rig.heads.get(`hand_${side}`).clone()
        .add(new THREE.Vector3(SIDES[side] * (HAND.grip + offset[0]), HAND.forward + offset[1], offset[2]))
        .applyMatrix4(pose.matrix(`hand_${side}`));
}

function propHand(pose, side, ready, target, turn = {}) {
    if (!ready) return;
    handTo(pose, side, ready, pose.carried(new THREE.Vector3(SIDES[side] * target[0], target[1], target[2])), new THREE.Vector3(...ACTING.elbow));
    pose.face(`hand_${side}`, {z: -SIDES[side] * 90 * ready, ...turn});
}

function eyesToward(pose, target, amount = 1) {
    const centre = pose.rig.eyes.reduce((sum, eye) => sum.add(eye), new THREE.Vector3()).divideScalar(pose.rig.eyes.length);
    const pivot = pose.head("head", pose.standing("head"));
    const way = target.clone().sub(pivot);
    const above = centre.z - pose.rig.heads.get("head").z;
    const pitch = Math.asin(THREE.MathUtils.clamp(above / way.length(), -1, 1)) - Math.atan2(way.z, Math.hypot(way.x, way.y));
    const yaw = Math.atan2(way.x, -way.y);
    pose.face("head", {x: THREE.MathUtils.radToDeg(pitch) * amount, z: THREE.MathUtils.radToDeg(yaw) * amount});
    pose.gaze = {target: target.toArray(), forward: READ_GAZE.forward};
}


function read(pose, stance, t) {
    const frame = t * READ_FRAMES;
    const held = frame >= READING.intro && frame < READING.intro + READING.hold;
    const taking = frame < READING.intro ? frame : READ_FRAMES - 1 - frame;
    const ready = held ? 1 : rise(taking, 0, READING.ready);
    const open = held ? 1 : rise(taking, READING.ready, READING.opens);
    const phase = held ? (frame - READING.intro) % READING.pageEvery : 0;
    const page = held ? rise(phase, READING.pageFrom, READING.pageTo) : 0;
    const scan = held ? (frame - READING.intro) / READING.hold : 0;
    breathe(pose, 0);

    armsAtRest(pose, stance);
    const scale = Math.min(...Object.keys(SIDES).map((side) => {
        const at = (name) => pose.rig.heads.get(`${name}_${side}`);
        return at("upper_arm").distanceTo(at("forearm")) + at("forearm").distanceTo(at("hand"));
    })) / READING.referenceArm;
    const shoulders = Object.keys(SIDES).map((side) => pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`)));
    const middle = shoulders[0].clone().add(shoulders[1]).multiplyScalar(0.5);
    const turn = bookTurn(open);
    const grip = bookGrip("l", open).add(bookGrip("r", open)).multiplyScalar(0.5).applyMatrix4(turn);
    const at = new THREE.Vector3(middle.x - grip.x * scale, middle.z - (READING.drop + READING.drawDrop * (1 - ready)) * scale - grip.y * scale, -middle.y + READING.forward * scale - grip.z * scale);
    const matrix = new THREE.Matrix4().makeTranslation(at.x, at.y, at.z)
        .multiply(turn)
        .scale(new THREE.Vector3(scale, scale, scale));
    for (const [side, sign] of Object.entries(SIDES)) {
        const target = toBlender(bookGrip(side, open).applyMatrix4(matrix));
        if (!ready) continue;
        handTo(pose, side, ready, target, new THREE.Vector3(...READING.elbow));
        const inward = THREE.MathUtils.radToDeg(Math.atan2(BOOK.closedGrip * (1 - open), BOOK.gripBack));
        pose.face(`hand_${side}`, {z: -sign * (READING.wristTurn + inward) * ready});
    }
    const line = Math.floor(phase / (READING.pageEvery / READING.lines));
    const along = (phase % (READING.pageEvery / READING.lines)) / (READING.pageEvery / READING.lines - 1);
    const target = new THREE.Vector3(mix(-READ_GAZE.across, READ_GAZE.across, along), mix(READ_GAZE.top, READ_GAZE.bottom, line / (READING.lines - 1)), -BOOK.pages).applyMatrix4(matrix);
    eyesToward(pose, toBlender(target), open);
    pose.holdBook(open, page, held || taking >= READING.ready);
    eyesAs(pose, "reading", open);
}

// The butler draws his cloth from his pocket, polishes his visor in small circles, and tucks it away again
const POCKET = [0.55, -0.35, 1.35];
const VISOR = [0.65, -0.92, 2.04];
const POLISH_ELBOW = [0.7, 0.2, -1.0];
const POLISH_RUB = 0.06;
function polish(pose, stance, t) {
    breathe(pose, t);
    const sides = [...stance.cloth];
    armsAtRest(pose, stance, sides);
    const up = rise(t, 0.15, 0.3) * (1 - rise(t, 0.75, 0.9));
    const out = rise(t, 0.08, 0.15) * (1 - rise(t, 0.88, 0.95));
    const rub = rise(t, 0.3, 0.35) * (1 - rise(t, 0.7, 0.75));
    trunk(pose, {nod: 6 * up, tilt: 4 * rub * Math.sin(2 * Math.PI * 3 * t)});
    for (const side of sides) {
        const sign = SIDES[side];
        const circle = 2 * Math.PI * 4 * t;
        const at = POCKET.map((p, axis) => p + (VISOR[axis] - p) * up);
        const target = new THREE.Vector3(sign * (at[0] + POLISH_RUB * rub * Math.cos(circle)), at[1], at[2] + POLISH_RUB * rub * Math.sin(circle));
        handTo(pose, side, out, pose.carried(target), new THREE.Vector3(sign * POLISH_ELBOW[0], POLISH_ELBOW[1], POLISH_ELBOW[2]));
        pose.face(`hand_${side}`, {z: -sign * 90 * out});
        if (out > 0.5) pose.holdCloth();
    }
    eyesAs(pose, rub > 0.5 ? "amused" : "reading");
}

// The watch is looked at long in the wait, then put away while the figure whistles idly, swaying, before it looks again.
function waiting(pose, stance, t) {
    const {ready, phase} = waitTime(t);
    const butler = stance.voice === "butler";
    const watch = butler ? rise(phase, ...WAIT.watchOut) * (1 - rise(phase, ...WAIT.watchBack)) * ready : 0;
    const tune = swell(phase, ...WAIT.whistleSpan) * ready;
    breathe(pose, 0);
    trunk(pose, {turn: ACTING.turn * ready * (1 - watch), nod: ACTING.nod * (watch - tune / 2), lean: ACTING.rock * waveOf(phase, WAIT.sways) * (butler ? tune : ready)});
    armsAtRest(pose, stance);
    pose.tap = ACTING.tap * Math.max(waveOf(phase, WAIT.beats), 0) * ready;
    if (pose.posture === "stand") pose.turn("foot_r", {x: pose.tap});
    if (watch) {
        const target = ACTING.pocket.map((value, axis) => mix(value, ACTING.watch[axis], watch));
        propHand(pose, "r", watch, target);
        pose.putAway(...IN_HAND);
        if (watch > 0.5) pose.holdProp("pocket_watch", "r", [0, 0, ACTING.watchLift], {z: -90});
    }
    if (tune) pose.shutEyes(1 - ACTING.whistleEyes * tune);
}

function yawn(pose, stance, t) {
    const {u, ready} = gestureTime(t, ACTING.yawnFrames);
    const side = freeSide(stance);
    breathe(pose, 0);
    trunk(pose, {lean: -ACTING.rock * ready, nod: -ACTING.nod * ready});
    armsAtRest(pose, stance);
    propHand(pose, side, ready, ACTING.yawnWrist);
    if (ready) pose.putAway(...IN_HAND);
    pose.shutEyes(1 - ACTING.yawnEyes * swell(u, ...ACTING.yawnSpan));
}

function whistle(pose, stance, t) {
    const {u, ready} = gestureTime(t, ACTING.pastimeFrames);
    const blast = swell(u, ...ACTING.pastimeSpan);
    const side = freeSide(stance);
    breathe(pose, 0);
    trunk(pose, {lean: -ACTING.rock * blast, nod: -ACTING.nod * blast});
    armsAtRest(pose, stance);
    propHand(pose, side, ready, ACTING.whistleWrist);
    if (ready) pose.putAway(...IN_HAND, "coach_whistle");
    if (ready > 0.5) pose.holdProp("hand_whistle", side, [0, 0, ACTING.whistleLift], {z: SIDES[side] * 90});
    pose.shutEyes(1 - ACTING.whistleEyes * blast);
}

function sipMotion(pose, stance, ready, tipped) {
    for (const side of stance.level) {
        propHand(pose, side, ready, ACTING.sipWrist, {x: -ACTING.sipTip * tipped});
    }
}

function sip(pose, stance, t) {
    const {u, ready} = gestureTime(t, ACTING.pastimeFrames);
    breathe(pose, 0);
    trunk(pose, {nod: -ACTING.rock * ready});
    armsAtRest(pose, stance);
    sipMotion(pose, stance, ready, swell(u, ...ACTING.pastimeSpan));
    pose.shutEyes(1 - ACTING.sipEyes * swell(u, ...ACTING.pastimeSpan));
}

function headphones(pose, stance, t) {
    const {u, ready} = gestureTime(t, ACTING.pastimeFrames);
    breathe(pose, 0);
    trunk(pose, {nod: ACTING.nod * waveOf(u, ACTING.beats) * ready, tilt: ACTING.rock * waveOf(u, ACTING.sways) * ready});
    armsAtRest(pose, stance);
    pose.swing(waveOf(u, ACTING.sways) * ready);
    pose.shutEyes(1 - ACTING.headphoneEyes * ready);
}

function shieldPolish(pose, stance, t) {
    const {u, ready} = gestureTime(t, ACTING.pastimeFrames);
    const shield = [...stance.shield][0];
    if (!shield) return idle(pose, stance, t);
    const cloth = shield === "l" ? "r" : "l";
    breathe(pose, 0);
    trunk(pose, {nod: ACTING.nod * ready});
    armsAtRest(pose, stance);
    propHand(pose, shield, ready, ACTING.shieldWrist);
    propHand(pose, cloth, ready, [ACTING.wipeWrist[0], ACTING.wipeWrist[1] + ACTING.wipeAcross * waveOf(u, ACTING.wipes), ACTING.wipeWrist[2] + ACTING.wipeLift * waveOf(u, ACTING.wipes * 2)]);
    if (ready) {
        pose.putAway("squire_quill");
        pose.keep.add("squire_shield");
    }
    if (ready > 0.5) pose.holdProp("polishing_cloth", cloth, [0, 0, ACTING.clothLift], {x: ACTING.clothTurn});
}

function writing(pose, stance, t) {
    const {ready, phase} = heldTime(t);
    const stroke = ACTING.writeStroke * waveOf(phase, ACTING.beats);
    breathe(pose, 0);
    trunk(pose, {nod: ACTING.nod * ready, lean: ACTING.rock * ready});
    armsAtRest(pose, stance);
    propHand(pose, "l", ready, ACTING.wrist);
    propHand(pose, "r", ready, [ACTING.writingWrist[0] + stroke, ACTING.writingWrist[1], ACTING.writingWrist[2]]);
    if (ready) pose.putAway(...IN_HAND);
    if (ready >= 1) {
        const tablet = stance.voice === "butler";
        const surface = TOOLS.paper.thickness * (tablet ? 2.5 : 0.5);
        const tipLift = ACTING.wrist[2] + ACTING.supportLift + surface + TOOLS.pen.length / 2 + TOOLS.pen.tip - ACTING.writingWrist[2];
        pose.holdProp(WRITING[stance.voice] || "writing_pen", "r", [0, 0, tipLift], {z: -90});
        pose.holdProp(stance.voice === "butler" ? "writing_tablet" : "writing_paper", "l", [0, -ACTING.wrist[0], ACTING.supportLift], {z: 90});
    }
    eyesAs(pose, "reading", ready);
}

function compacting(pose, stance, t) {
    const {ready, phase} = heldTime(t);
    breathe(pose, 0);
    trunk(pose, {nod: ACTING.nod * ready});
    armsAtRest(pose, stance);
    propHand(pose, "l", ready, ACTING.wrist);
    propHand(pose, "r", ready, [ACTING.wrist[0] + ACTING.writeStroke * waveOf(phase, ACTING.sways), ACTING.wrist[1], ACTING.wrist[2] + ACTING.writeHeight * Math.max(waveOf(phase, ACTING.sways), 0)]);
    if (ready) pose.putAway(...IN_HAND);
    if (ready >= 1) {
        pose.holdProp("papers", "l", [0, -ACTING.wrist[0], ACTING.supportLift], {z: 90});
        pose.props.get("papers").phase = phase;
    }
}

function bow(pose, stance, t) {
    const {ready} = gestureTime(t, ACTING.greetingFrames);
    breathe(pose, 0);
    trunk(pose, {lean: ACTING.bowLean * ready, nod: ACTING.bowNod * ready});
    armsAtRest(pose, stance);
    if (ready) pose.putAway(...IN_HAND);
}

function salute(pose, stance, t) {
    const {ready} = gestureTime(t, ACTING.greetingFrames);
    const side = freeSide(stance);
    breathe(pose, 0);
    trunk(pose, {nod: -ACTING.rock * ready});
    armsAtRest(pose, stance);
    propHand(pose, side, ready, ACTING.saluteWrist);
    if (ready) pose.putAway(...IN_HAND);
}

function startled(pose, stance, t) {
    const {u, ready} = gestureTime(t, ACTING.hopFrames);
    const leap = swell(u, ...ACTING.leapSpan);
    crouch(pose, ACTING.hop * swell(u, 0, ACTING.leapSpan[0]));
    pose.lift("root", {z: ACTING.hop * leap});
    breathe(pose, 0);
    trunk(pose, {lean: -ACTING.rock * leap});
    flung(pose, stance, 0, ARM_CLEAR_RAISE * leap);
    if (pose.posture === "stand") tucked(pose, leap);
    eyesAs(pose, "startled", ready);
}

function stumble(pose, stance, t) {
    const {u, ready} = gestureTime(t, ACTING.stumbleFrames);
    const catchStep = swell(u, ...ACTING.catchSpan) - ACTING.recover * swell(u, ...ACTING.recoverSpan);
    breathe(pose, 0);
    trunk(pose, {lean: ACTING.stumble * catchStep, tilt: ACTING.rock * catchStep});
    flung(pose, stance, 0, ARM_CLEAR_RAISE * ready);
    eyesAs(pose, "startled", Math.max(catchStep, 0));
}

function glance(pose, stance, t) {
    const {ready} = gestureTime(t, ACTING.greetingFrames);
    breathe(pose, 0);
    trunk(pose, {turn: ACTING.glance * ready, nod: -ACTING.rock * ready});
    armsAtRest(pose, stance);
}

// a figure that has a tablet tips it up toward its face in the hand holding it, and touches it with the free hand, `stroke` off the
// spot it touches
function onTablet(pose, stance, side, stroke) {
    for (const held of stance.tablet) {
        const sign = SIDES[held];
        pose.face(`hand_${held}`, {x: TABLET_TIP, z: -sign * HOLD_TWIST});
        const touch = TABLET_TOUCH.map((at, axis) => at + stroke[axis]);
        const spot = pose.head(`hand_${held}`, pose.matrix(`hand_${held}`)).add(new THREE.Vector3(sign * touch[0], touch[1], touch[2]));
        pose.reach(side, spot, new THREE.Vector3(-sign * THINK_ELBOW[0], THINK_ELBOW[1], THINK_ELBOW[2]));
        pose.holdTablet();
    }
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
    armTo(pose, side, 1, {y: mix(75, 20, raised), z: -35, bend: mix(15, 55, raised)});
}

// points up at what waits for the user, looking at it, the arm bobbing a little
function point(pose, stance, t) {
    const side = freeSide(stance);
    breathe(pose, 0);
    trunk(pose, {nod: -14, lean: -3, tilt: -SIDES[side] * 5});
    armsAtRest(pose, stance, [side]);
    armTo(pose, side, 1, {y: -12 + 3 * waveOf(t), z: -15, bend: 10});
    eyesAs(pose, "worried", 0.6);
}

// the arms of a jump or a fall, those that carry nothing: swung back by `back` degrees and out and up by `up` degrees
function flung(pose, stance, back, up, flail = 0) {
    armsAtRest(pose, stance, [...stance.free]);
    for (const side of stance.free) {
        const sign = SIDES[side];
        const amount = Math.min(Math.max(up / ARM_RAISE_SPAN, 0), 1);
        armTo(pose, side, amount, {x: back + flail * sign, y: -Math.min(up, ARM_CLEAR_RAISE), bend: 10});
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

const BACKFLIP_RAISE = 25;
const BACKFLIP_TURN = 360;

// a jump that turns over backwards on the way: the crouch, then the body tucked and turned all the way round about its hips in the air
function backflip(pose, stance, t) {
    const u = onceTime(t, 22);
    const crouch = rise(u, 0, 0.26) * (1 - rise(u, 0.26, 0.34));
    const turn = rise(u, 0.3, 0.86);
    const air = rise(u, 0.28, 0.4) * (1 - rise(u, 0.86, 0.95));
    pose.lift("root", {z: 0.1 * air});
    breathe(pose, 0);
    trunk(pose, {lean: 12 * crouch});
    flung(pose, stance, 30 * crouch, BACKFLIP_RAISE * air);
    fold(pose, 0.28 * crouch);
    tucked(pose, 1.2 * air);
    pose.turnAll({x: BACKFLIP_TURN * turn}, pose.head("hips", pose.matrix("hips")));
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
    if (raised) quill.forEach((side) => armTo(pose, side, raised, {y: 30, z: -25 + 5 * waveOf(3 * u), bend: 10}));
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

// Each voice's answer to one of its own faces, put by the agent on the user's message: a gesture in the voice's manner, played once, starting
// and ending at rest. The hand that gestures is the free one; what the other carries stays in it.
export const REACTING = {
    frames: 36, fps: 12,
    hatOn: 1.101, hatLift: 0.15, hatTip: 12, hatGrip: 35, hatReach: 0.85, hatBow: 22, hatNod: 14,
    monocleWrist: [0.55, -0.8, 2.62], monocleWorn: [0.354, -0.95, 0.66], monoclePeer: 8, monocleTilt: 9,
    toastWrist: [0.78, -0.72, 2.55], toastClink: 0.12, sipWrist: [0.42, -0.78, 2.38], sipTip: 20,
    shakaWrist: [1.22, -0.25, 2.72], shakaWaggle: 28, shakaWaggles: 3,
    shadesWrist: [0.5, -0.82, 2.55], shadesWorn: [0, -0.96, 0.66], shadesLean: 7, shadesTilt: 10,
    fireWrist: [0.48, -0.86, 2.28], fireSize: 2.4,
    thumbWrist: [0.62, -0.84, 2.3],
    glassesWrist: [0.32, -0.8, 2.47], peerLean: 12, peerTurn: 18,
    heartWrist: [0.18, -0.58, 2.12], thanksBow: 14,
    popperWrist: [0.95, -0.45, 2.85], popAt: 0.4, popHop: 0.12,
    flex: {y: 0, x: -85, z: 15, bend: 115}, flexPump: 15,
    trophy: {y: -55, x: 15, z: 0, bend: 15}, trophyHop: 0.1,
    sword: {y: -62, x: 18, z: 0, bend: 12}, swordThrust: 12,
    shieldWrist: [0.24, -0.78, 2.3], shieldCrouch: 0.08, shieldBump: 0.5,
    castleWrist: [0.55, -0.88, 2.34],
};

// what the hand that does not gesture carries stays in it while the gesturing hand holds a prop
const keepCarrying = (pose) => BUSY_ITEMS.forEach((item) => pose.keep.add(item));

// the clip's time as {u, ready}, ready rising from rest and back to it over the whole clip
const reacting = (t) => gestureTime(t, REACTING.frames);

// the hand on `side` taken from hanging toward `target` (k), and turned so its back faces out and its grip points up
function handUp(pose, side, k, target, turn = {}) {
    propHand(pose, side, k, target, {x: -60 * k, ...turn});
}

// the butler lifts his hat off by the brim, bows a little with it held up, and puts it back on
function hat_tip(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = freeSide(stance);
    const sign = SIDES[side];
    const lifted = rise(u, 0.22, 0.34) * (1 - rise(u, 0.68, 0.8));
    const bow = swell(u, 0.32, 0.72);
    breathe(pose, 0);
    trunk(pose, {lean: REACTING.hatBow * bow, nod: REACTING.hatNod * bow});
    armsAtRest(pose, stance, ready ? [side] : []);
    const offset = [0, 0, REACTING.hatOn + REACTING.hatLift * lifted];
    const turn = {x: 0.6 * REACTING.hatTip * lifted, y: sign * REACTING.hatTip * lifted};
    const head = pose.matrix("head");
    const hat = euler(turn.x, turn.y, 0);
    const grip = radians(REACTING.hatGrip);
    const brim = new THREE.Vector3(sign * REACTION_PROPS.hat.brim * Math.cos(grip), -REACTION_PROPS.hat.brim * Math.sin(grip), 0).applyMatrix4(hat).add(pose.rig.heads.get("head")).add(new THREE.Vector3(...offset));
    const up = new THREE.Vector3(0, 0, 1).applyMatrix4(hat).transformDirection(head);
    const target = brim.applyMatrix4(head).addScaledVector(up, -REACTING.hatReach);
    if (ready) {
        handTo(pose, side, ready, target, new THREE.Vector3(...ACTING.elbow));
        pose.aim(`hand_${side}`, pose.rig.along.get(`hand_${side}`).clone().transformDirection(pose.matrix(`hand_${side}`)).lerp(up, ready));
    }
    if (u > 0.22 && u < 0.8) {
        pose.putAway("butler_bowler_hat");
        pose.wearProp("bowler_hat", offset, turn);
    }
    eyesAs(pose, "amused", bow);
}

// the butler brings up a monocle, screws it into his eye, peers through it a moment, and lets it drop
function monocle(pose, stance, t) {
    const {u} = reacting(t);
    const side = freeSide(stance);
    const sign = SIDES[side];
    const raised = rise(u, 0, 0.2) * (1 - rise(u, 0.82, 1));
    const peer = rise(u, 0.26, 0.36) * (1 - rise(u, 0.66, 0.76));
    breathe(pose, 0);
    trunk(pose, {lean: REACTING.monoclePeer * peer, nod: REACTING.monoclePeer * peer, tilt: sign * REACTING.monocleTilt * peer});
    armsAtRest(pose, stance, raised ? [side] : []);
    const away = 1 - 0.35 * peer;
    handUp(pose, side, raised, REACTING.monocleWrist.map((value, axis) => (axis === 2 ? value - 0.25 * (1 - away) : value)));
    const [x, y, z] = REACTING.monocleWorn;
    if (u > 0.18 && u < 0.8) pose.wearProp("monocle", [sign * x, y, z]);
    else if (raised > 0.4) pose.holdUpright("monocle", side, [0, 0, 0.2]);
    eyesAs(pose, "startled", 0.6 * peer);
}

// the butler raises a glass of champagne to you, clinks it toward you, and takes a sip
function toast(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = freeSide(stance);
    const clink = swell(u, 0.3, 0.42);
    const sip = swell(u, 0.5, 0.78);
    breathe(pose, 0);
    trunk(pose, {lean: 4 * clink, nod: -6 * sip});
    armsAtRest(pose, stance, ready ? [side] : []);
    const target = REACTING.toastWrist.map((value, axis) => mix(value, REACTING.sipWrist[axis], sip) + (axis === 1 ? -REACTING.toastClink * clink : 0));
    handUp(pose, side, ready, target);
    if (ready > 0.3) pose.holdUpright("champagne_flute", side, [0, 0, 0.1], {x: REACTING.sipTip * sip, y: SIDES[side] * REACTING.sipTip * sip});
    pose.shutEyes(1 - 0.7 * sip);
    if (clink > 0.5) eyesAs(pose, "amused", clink);
}

// the homie throws a shaka up beside his head and waggles it, leaning back easy
function shaka(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = freeSide(stance);
    const sign = SIDES[side];
    breathe(pose, 0);
    trunk(pose, {lean: -5 * ready, tilt: -sign * 8 * ready, turn: -sign * 6 * ready});
    armsAtRest(pose, stance, ready ? [side] : []);
    handUp(pose, side, ready, REACTING.shakaWrist, {y: REACTING.shakaWaggle * waveOf(span(u, 0.2, 0.8), REACTING.shakaWaggles) * ready});
    if (ready > 0.5) pose.holdUpright("shaka", side, [0, 0, 0.32]);
    eyesAs(pose, "amused", ready);
}

// the homie puts on a pair of sunglasses, leans back and nods slowly to himself, then takes them off again
function shades(pose, stance, t) {
    const {u} = reacting(t);
    const side = freeSide(stance);
    const sign = SIDES[side];
    const putting = rise(u, 0, 0.15) * (1 - rise(u, 0.15, 0.3));
    const taking = rise(u, 0.72, 0.86) * (1 - rise(u, 0.86, 1));
    const worn = u > 0.22 && u < 0.82;
    const cool = rise(u, 0.28, 0.38) * (1 - rise(u, 0.66, 0.76));
    breathe(pose, 0);
    trunk(pose, {lean: -REACTING.shadesLean * cool, tilt: sign * REACTING.shadesTilt * cool, nod: 6 * cool * Math.max(waveOf(span(u, 0.38, 0.66), 2), 0)});
    const hand = Math.max(putting, taking);
    armsAtRest(pose, stance, hand ? [side] : []);
    handUp(pose, side, hand, REACTING.shadesWrist);
    if (worn) pose.wearProp("sunglasses", REACTING.shadesWorn);
    else if (hand > 0.4) pose.holdUpright("sunglasses", side, [0, -0.1, 0.25]);
}

// the homie holds up a hand with a flame on it, nods along to how hot that was, shakes it out and blows on his fingers
function fire(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = freeSide(stance);
    const burning = rise(u, 0.18, 0.28) * (1 - rise(u, 0.66, 0.74));
    const shaking = swell(u, 0.66, 0.84);
    breathe(pose, 0);
    trunk(pose, {nod: 8 * burning * Math.max(waveOf(span(u, 0.28, 0.66), 3), 0) + 6 * shaking, tilt: SIDES[side] * 5 * burning});
    armsAtRest(pose, stance, ready ? [side] : []);
    handUp(pose, side, ready, REACTING.fireWrist, {y: 25 * shaking * waveOf(u, 9)});
    if (burning > 0.02) {
        pose.holdUpright("flame", side, [0, 0, 0.18]);
        Object.assign(pose.props.get("flame"), {phase: u, size: REACTING.fireSize * burning});
    }
    eyesAs(pose, shaking > 0.3 ? "startled" : "amused", Math.max(burning, shaking));
}

// the colleague gives a thumbs up and a firm nod
function thumbs_up(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = freeSide(stance);
    const nodded = swell(u, 0.35, 0.6);
    breathe(pose, 0);
    trunk(pose, {nod: 14 * nodded, lean: 3 * ready});
    armsAtRest(pose, stance, ready ? [side] : []);
    handUp(pose, side, ready, REACTING.thumbWrist, {y: 0});
    if (ready > 0.5) {
        pose.holdUpright("thumb", side, [0, 0, 0.3]);
        keepCarrying(pose);
    }
    eyesAs(pose, "amused", nodded);
}

// the colleague pushes his glasses up his nose, leans in and looks it over, one side and the other
function peer(pose, stance, t) {
    const {u} = reacting(t);
    const side = freeSide(stance);
    const push = rise(u, 0, 0.14) * (1 - rise(u, 0.24, 0.36));
    const leaning = rise(u, 0.26, 0.38) * (1 - rise(u, 0.8, 0.95));
    const look = swell(u, 0.38, 0.58) - swell(u, 0.58, 0.8);
    breathe(pose, 0);
    trunk(pose, {lean: REACTING.peerLean * leaning, nod: 6 * leaning, turn: REACTING.peerTurn * look});
    armsAtRest(pose, stance, push ? [side] : []);
    const [x, y, z] = REACTING.glassesWrist;
    handUp(pose, side, push, [x, y, z + 0.08 * rise(u, 0.12, 0.22)]);
    eyesAs(pose, "reading", leaning);
}

// the colleague puts a hand to his chest and gives a small bow, eyes closed: thanks
function thanks(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = freeSide(stance);
    const bow = swell(u, 0.25, 0.8);
    breathe(pose, 0);
    trunk(pose, {lean: REACTING.thanksBow * bow, nod: 10 * bow});
    armsAtRest(pose, stance, ready ? [side] : []);
    propHand(pose, side, ready, REACTING.heartWrist, {x: -20 * ready});
    pose.shutEyes(1 - 0.85 * bow);
}

// the coach pulls a party popper over his head; the confetti bursts out and he hops with it
function party_popper(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = freeSide(stance);
    const hop = swell(u, REACTING.popAt, REACTING.popAt + 0.2);
    pose.lift("root", {z: REACTING.popHop * hop});
    breathe(pose, 0);
    trunk(pose, {lean: -4 * hop, nod: -8 * hop});
    armsAtRest(pose, stance, ready ? [side] : []);
    handUp(pose, side, ready, REACTING.popperWrist);
    if (ready > 0.4) {
        pose.holdUpright("party_popper", side, [0, 0, 0.1], {y: SIDES[side] * 25});
        pose.props.get("party_popper").burst = span(u, REACTING.popAt, 0.95);
        keepCarrying(pose);
    }
    eyesAs(pose, "amused", hop);
}

// the coach flexes the free arm, pumping it twice, chest out
function flex(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = freeSide(stance);
    const pump = Math.max(waveOf(span(u, 0.25, 0.75), 2), 0);
    breathe(pose, 0);
    trunk(pose, {lean: -5 * ready, twist: -SIDES[side] * 10 * ready, tilt: SIDES[side] * 4 * ready, nod: -4 * ready});
    armsAtRest(pose, stance, ready ? [side] : []);
    if (ready) armTo(pose, side, ready, {...REACTING.flex, bend: REACTING.flex.bend + REACTING.flexPump * pump});
    eyesAs(pose, "angry", 0.6 * pump);
}

// the coach holds a trophy up over his head and bounces with it twice
function trophy(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = freeSide(stance);
    const bounce = Math.max(waveOf(span(u, 0.25, 0.75), 2), 0);
    pose.lift("root", {z: REACTING.trophyHop * bounce});
    breathe(pose, 0);
    trunk(pose, {nod: -12 * ready, lean: -4 * ready});
    armsAtRest(pose, stance, ready ? [side] : []);
    if (ready) armTo(pose, side, ready, REACTING.trophy);
    if (ready > 0.4) {
        pose.holdUpright("trophy", side, [0, 0, 0.3]);
        keepCarrying(pose);
    }
    eyesAs(pose, "amused", ready);
}

// the squire puts the quill away, draws a sword and raises it high, thrusting it up twice, onwards
function sword(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = heldUp(stance)[0] || freeSide(stance);
    const thrust = Math.max(waveOf(span(u, 0.25, 0.75), 2), 0);
    breathe(pose, 0);
    trunk(pose, {lean: -4 * ready, nod: -10 * ready});
    armsAtRest(pose, stance, ready ? [side] : []);
    if (ready) armTo(pose, side, ready, {...REACTING.sword, y: REACTING.sword.y - REACTING.swordThrust * thrust});
    if (ready) pose.putAway("squire_quill");
    if (ready > 0.4) {
        pose.holdUpright("sword", side, [0, 0, 0.15], {x: -15});
        keepCarrying(pose);
    }
    eyesAs(pose, "angry", ready);
}

// the squire raises his shield before him and braces behind it as a blow lands, then lowers it
function shield_up(pose, stance, t) {
    const {u, ready} = reacting(t);
    const shield = [...stance.shield][0];
    if (!shield) return idle(pose, stance, t);
    const bump = swell(u, REACTING.shieldBump, REACTING.shieldBump + 0.12);
    crouch(pose, REACTING.shieldCrouch * ready);
    breathe(pose, 0);
    trunk(pose, {lean: 8 * ready - 8 * bump, nod: 6 * ready});
    armsAtRest(pose, stance, ready ? [shield] : []);
    const [x, y, z] = REACTING.shieldWrist;
    propHand(pose, shield, ready, [x, y + 0.08 * bump, z]);
    pose.keep.add("squire_shield");
    eyesAs(pose, bump > 0.3 ? "startled" : "angry", ready);
}

// the squire holds out a small castle on his palm, the realm he keeps, and bows his head over it
function castle(pose, stance, t) {
    const {u, ready} = reacting(t);
    const side = heldUp(stance)[0] || freeSide(stance);
    const bow = swell(u, 0.35, 0.75);
    breathe(pose, 0);
    trunk(pose, {nod: 12 * bow, lean: 4 * bow});
    armsAtRest(pose, stance, ready ? [side] : []);
    propHand(pose, side, ready, REACTING.castleWrist, {x: -30 * ready});
    if (ready) pose.putAway("squire_quill");
    if (ready > 0.4) {
        pose.holdUpright("castle", side, [0, 0, 0.12]);
        keepCarrying(pose);
    }
    eyesAs(pose, "amused", bow);
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
// its cycle or of the stretch it names as `leaves`. An `interruptible` clip gives way the moment something else is wanted instead, as the
// walk does the moment there is nowhere left to go and a fall the moment its feet meet the ground; a beat, a reaction, a jump or a
// landing never is.

export const CLIPS = [
    {name: "idle", frames: 24, fps: 8, loops: true, leaves: 8, postures: GESTURE, pose: idle},
    {name: "blink", frames: 6, fps: 12, loops: false, postures: GESTURE, pose: blink},
    {name: "nod", frames: 10, fps: 12, loops: false, postures: GESTURE, pose: nod},
    {name: "shake", frames: 12, fps: 12, loops: false, postures: GESTURE, pose: shake},
    {name: "wave", frames: 12, fps: 12, loops: true, postures: GESTURE, pose: wave},
    {name: "think", frames: 12, fps: 6, loops: true, postures: GESTURE, pose: think},
    {name: "celebrate", frames: 12, fps: 10, loops: true, postures: MOVE, pose: celebrate},
    {name: "sleep", frames: ACTING.yawnFrames + SLEEP_FRAMES, intro: ACTING.yawnFrames, leaves: SLEEP_FRAMES, fps: 6, loops: true, postures: GESTURE, pose: sleep},
    {name: "walk", frames: 12, fps: 12, loops: true, interruptible: true, postures: MOVE, pose: walk},
    {name: "walk_in", frames: 40, fps: 12, loops: false, postures: MOVE, pose: walk_in},
    {name: "run_in", frames: 28, fps: 12, loops: false, postures: MOVE, pose: run_in},
    {name: "pull_ups", frames: 24, fps: 10, loops: true, postures: MOVE, pose: pull_ups},
    {name: "hang_l", frames: 24, fps: 8, loops: true, leaves: 8, postures: HANGING, pose: dangle("l")},
    {name: "hang_r", frames: 24, fps: 8, loops: true, leaves: 8, postures: HANGING, pose: dangle("r")},
    {name: "enter", frames: 36, fps: 12, loops: false, postures: MOVE, pose: enter},
    {name: "exit", frames: 28, fps: 12, loops: false, postures: MOVE, pose: exit},
    {name: "search", frames: 80, fps: 10, loops: true, postures: GESTURE, pose: search},
    {name: "read", frames: READ_FRAMES, fps: READING.fps, loops: true, intro: READING.intro, outro: READING.outro, leaves: READING.pageEvery, postures: GESTURE, pose: read},
    {name: "write", frames: HELD_FRAMES, intro: ACTING.intro, outro: ACTING.outro, leaves: ACTING.hold, fps: ACTING.fps, loops: true, postures: GESTURE, pose: writing},
    {name: "waiting", frames: WAIT_FRAMES, intro: WAIT.intro, outro: WAIT.outro, leaves: WAIT.hold, fps: ACTING.fps, loops: true, postures: ["stand", "sit"], pose: waiting},
    {name: "compacting", frames: HELD_FRAMES, intro: ACTING.intro, outro: ACTING.outro, leaves: ACTING.hold, fps: ACTING.compactFps, loops: true, postures: GESTURE, pose: compacting},
    {name: "yawn", frames: ACTING.yawnFrames, fps: ACTING.fps, loops: false, postures: GESTURE, pose: yawn},
    {name: "whistle", frames: ACTING.pastimeFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["coach"], pose: whistle},
    {name: "sip", frames: ACTING.pastimeFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["colleague"], pose: sip},
    {name: "headphones", frames: ACTING.pastimeFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["homie"], pose: headphones},
    {name: "shield_polish", frames: ACTING.pastimeFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: shieldPolish},
    {name: "bow", frames: ACTING.greetingFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["butler"], pose: bow},
    {name: "salute", frames: ACTING.greetingFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: salute},
    {name: "startled", frames: ACTING.hopFrames, fps: ACTING.fps, loops: false, postures: GESTURE, pose: startled},
    {name: "stumble", frames: ACTING.stumbleFrames, fps: ACTING.fps, loops: false, postures: ["walk"], pose: stumble},
    {name: "glance", frames: ACTING.greetingFrames, fps: ACTING.fps, loops: false, postures: GESTURE, pose: glance},
    {name: "work", frames: 8, fps: 10, loops: true, postures: GESTURE, pose: work},
    {name: "point", frames: 12, fps: 8, loops: true, postures: GESTURE, pose: point},
    {name: "jump", frames: 16, fps: 20, loops: false, postures: MOVE, pose: jump},
    {name: "fall", frames: 12, fps: 12, loops: false, interruptible: true, postures: MOVE, pose: fall},
    {name: "backflip", frames: 22, fps: 20, loops: false, postures: MOVE, pose: backflip},
    {name: "land", frames: 10, fps: 20, loops: false, postures: MOVE, pose: land},
    {name: "type", frames: 24, fps: 8, loops: true, leaves: 8, postures: ON_A_LAP, pose: type},
    {name: "joy", frames: 20, fps: 14, loops: false, postures: GESTURE, pose: joy},
    {name: "dismay", frames: 28, fps: 10, loops: false, postures: GESTURE, pose: dismay},
    {name: "look_around", frames: 24, fps: 10, loops: false, postures: GESTURE, pose: look_around},
    {name: "polish", frames: 40, fps: 12, loops: false, postures: GESTURE, voices: ["butler"], pose: polish},
    {name: "stretch", frames: 24, fps: 8, loops: false, postures: GESTURE, pose: stretch},
    {name: "squire_chase", frames: 24, fps: 12, loops: false, postures: MOVE, pose: squire_chase},
    {name: "pointed", frames: 20, fps: 10, loops: false, postures: MOVE, pose: pointed},
    {name: "hat_tip", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["butler"], pose: hat_tip},
    {name: "monocle", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["butler"], pose: monocle},
    {name: "toast", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["butler"], pose: toast},
    {name: "shaka", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["homie"], pose: shaka},
    {name: "shades", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["homie"], pose: shades},
    {name: "fire", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["homie"], pose: fire},
    {name: "thumbs_up", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["colleague"], pose: thumbs_up},
    {name: "peer", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["colleague"], pose: peer},
    {name: "thanks", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["colleague"], pose: thanks},
    {name: "party_popper", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["coach"], pose: party_popper},
    {name: "flex", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["coach"], pose: flex},
    {name: "trophy", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["coach"], pose: trophy},
    {name: "sword", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: sword},
    {name: "shield_up", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: shield_up},
    {name: "castle", frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: castle},
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
    const eyes = [];
    root.traverse((mesh) => {
        if (!mesh.isSkinnedMesh || !mesh.name.startsWith("eye_") || !mesh.userData.hull) return;
        eyes.push(toBlender(new THREE.Box3().setFromBufferAttribute(mesh.geometry.attributes.position).getCenter(new THREE.Vector3()).applyMatrix4(mesh.matrixWorld)));
    });
    return {bones, order: bones.map((bone) => bone.name), parents, rest, heads, along, eyes};
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
        mesh.visible = shows(mesh) && !LEFT_OUT.has(mesh.userData.item) && mesh.userData.item !== TABLET && mesh.userData.item !== CLOTH;
        addHullNormals(mesh.geometry);
        const hull = new THREE.SkinnedMesh(mesh.geometry, outlineMaterial(mesh));
        hull.bind(mesh.skeleton, mesh.bindMatrix);
        hull.visible = mesh.visible;
        mesh.userData.hull = hull;
        hull.userData.item = mesh.userData.item;
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
    const tablet = meshes.filter((mesh) => mesh.userData.item === TABLET && shows(mesh));
    const cloth = meshes.filter((mesh) => mesh.userData.item === CLOTH && shows(mesh));
    const stance = {
        voice,
        level: handsHolding(carried, LEVEL_ITEMS),
        busy,
        carried: handsHolding(carried, IN_HAND),
        free: new Set(Object.keys(SIDES).filter((side) => !busy.has(side))),
        tablet: handsHolding(tablet, new Set([TABLET])),
        cloth: handsHolding(cloth, new Set([CLOTH])),
        shield: handsHolding(carried, new Set(["squire_shield"])),
    };
    const laptop = laptopOf();
    const glass = glassOf();
    const book = bookOf();
    const propByName = propsOf();
    scene.add(laptop, glass, book, ...propByName.values());
    const hulls = (shown) => shown.flatMap((mesh) => [mesh, mesh.userData.hull]);
    const inHand = carried.filter((mesh) => IN_HAND.has(mesh.userData.item));
    const stowable = hulls(carried.filter((mesh) => mesh.userData.item));
    return {scene, rig: rigOf(scene), stance, eyes, laptop, glass, book, propByName, props: [...propByName.values()], stowable, tablet: hulls(tablet), cloth: hulls(cloth), inHand: hulls(inHand)};
}

// A laptop drawn in the flat colours of the chat's own: its hinge at the origin, its keyboard toward the body (-z), its lid opened a little
// past upright with the screen toward the face and the mark on its back
const LAPTOP = {width: 1.7, depth: 0.62, thickness: 0.1, open: 105};
const LAPTOP_COLOURS = {base: 0x474a52, lid: 0x2b2e38, screen: 0x1b1d24, edge: 0xa9adb8, mark: 0x5e64c9};

// a mesh of one flat colour, seen from both sides and never culled, for the props the figure holds
const flat = (geometry, colour) => {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: colour, side: THREE.DoubleSide}));
    mesh.frustumCulled = false;
    return mesh;
};

function laptopOf() {
    const {width, depth, thickness, open} = LAPTOP;
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

// A magnifying glass in the same flat colours, comically large as the figure is drawn small: its handle from the origin up its y axis, its
// lens in the plane of x and y above the handle
const GLASS = {radius: 0.52, rim: 0.08, handle: 0.5, grip: 0.07};
const GLASS_COLOURS = {rim: 0x2b2e38, lens: 0xcfe6ff, handle: 0x474a52, edge: 0xa9adb8};
// how far the handle leans forward of upright, held out in front of the body
const GLASS_LEAN = 40;

function glassOf() {
    const {radius, rim, handle, grip} = GLASS;
    const flat = (geometry, colour, more = {}) => {
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: colour, side: THREE.DoubleSide, ...more}));
        mesh.frustumCulled = false;
        return mesh;
    };
    const ring = flat(new THREE.TorusGeometry(radius, rim, 12, 48), GLASS_COLOURS.rim);
    ring.position.y = handle + radius;
    ring.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CircleGeometry(radius + rim, 48)), new THREE.LineBasicMaterial({color: GLASS_COLOURS.edge})));
    const lens = flat(new THREE.CircleGeometry(radius, 48), GLASS_COLOURS.lens, {transparent: true, opacity: 0.35, depthWrite: false});
    lens.position.y = handle + radius;
    const shaft = flat(new THREE.CylinderGeometry(grip, grip * 1.2, handle, 16), GLASS_COLOURS.handle);
    shaft.position.y = handle / 2;
    const glass = new THREE.Group();
    glass.matrixAutoUpdate = false;
    glass.visible = false;
    glass.add(shaft, ring, lens);
    return glass;
}

export const BOOK = {
    width: 0.82,
    height: 1.2,
    cover: 0.055,
    pages: 0.06,
    spine: 0.18,
    inset: 0.035,
    open: 160,
    tilt: 8,
    gripHeight: 0.02,
    gripSide: 0.1,
    closedGrip: 0.2,
    gripBack: 0.6,
    leaf: 0.004,
    curl: 2,
    pageSegments: 12,
    pageBow: 0.24,
    lines: 5,
    lineWidth: 0.004,
};
const BOOK_COLOURS = {cover: 0x6366f1, spine: 0x35374b, pages: 0xf3eedf, paper: 0xfffbef, edge: 0x232532, rule: 0xc6beac};
const bookAngle = (open) => radians((180 - BOOK.open * open) / 2);

function bookContact(side, open) {
    const sign = SIDES[side];
    const reach = side === "l" ? 1 : open;
    return new THREE.Vector3(sign * BOOK.width * reach, BOOK.gripHeight, BOOK.cover / 2)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), sign * bookAngle(open))
        .add(new THREE.Vector3(sign * BOOK.spine / 2, 0, 0));
}

function bookBasis(open) {
    const across = bookContact("l", open).sub(bookContact("r", open)).normalize();
    const up = new THREE.Vector3(0, 1, 0);
    return new THREE.Matrix4().makeBasis(across, up, across.clone().cross(up));
}

function bookTurn(open) {
    return new THREE.Matrix4().makeRotationX(radians(BOOK.tilt)).multiply(bookBasis(open).invert());
}

function bookGrip(side, open) {
    const basis = bookBasis(open);
    const across = new THREE.Vector3().setFromMatrixColumn(basis, 0);
    const forward = new THREE.Vector3().setFromMatrixColumn(basis, 2);
    return bookContact(side, open).addScaledVector(across, SIDES[side] * (BOOK.gripSide + BOOK.closedGrip * (1 - open))).addScaledVector(forward, -BOOK.gripBack);
}

export const TOOLS = {
    pen: {radius: 0.027, length: 0.58, tip: 0.08, sides: 12, markerScale: 1.8, pencilSides: 6, bandScale: 1.05, bandAt: 1 / 3},
    feather: {at: 1 / 4, points: [[0, 0], [-0.12, 0.18], [-0.08, 0.42], [0.03, 0.6], [0.14, 0.34], [0.1, 0.12]]},
    paper: {width: 1.58, depth: 0.54, thickness: 0.012, count: 4, spread: 0.04, tabletLayers: 3, screenWidth: 0.91, screenDepth: 0.85, screenLift: 2},
    watch: {radius: 0.38, depth: 0.09, ring: 0.08, sides: 24, faceScale: 0.85, faceGap: 0.002, handDepth: 0.014,
        minuteWidth: 0.024, minuteLength: 0.72, minuteAt: 0.25, minuteGap: 0.014,
        hourWidth: 0.02, hourLength: 0.5, hourAt: 0.13, hourGap: 0.016, hourTurn: -Math.PI / 3,
        ringTube: 0.02, ringRadialSegments: 8, ringTubularSegments: 16},
    whistle: {body: [0.13, 0.1, 0.16], mouthpiece: [0.08, 0.04, 0.15], mouthAt: [0, 0.01, -0.12]},
    cloth: {width: 0.35, depth: 0.26, thickness: 0.02},
    colours: {ink: 0x272936, silver: 0xa9adb8, paper: 0xf3eedf, white: 0xf4f2ed, accent: 0x6366f1, pencil: 0xd6b06b},
};

function propsOf() {
    const props = new Map();
    const group = (name) => {
        const root = new THREE.Group();
        root.name = name;
        root.visible = false;
        root.matrixAutoUpdate = false;
        props.set(name, root);
        return root;
    };
    const part = (root, name, geometry, colour, at = [0, 0, 0]) => {
        const mesh = flat(geometry, colour);
        mesh.name = `${root.name}_${name}`;
        mesh.position.set(...at);
        root.add(mesh);
        return mesh;
    };
    const {pen, paper, watch, cloth, colours} = TOOLS;
    for (const name of Object.values(WRITING)) {
        const root = group(name);
        const marker = name === "writing_marker";
        const pencil = name === "writing_pencil";
        const radius = pen.radius * (marker ? pen.markerScale : 1);
        part(root, "barrel", new THREE.CylinderGeometry(radius, radius, pen.length, pencil ? pen.pencilSides : pen.sides), pencil ? colours.pencil : colours.ink);
        const tip = part(root, "nib", new THREE.ConeGeometry(radius, pen.tip, pen.sides), colours.silver, [0, -(pen.length + pen.tip) / 2, 0]);
        tip.rotation.z = Math.PI;
        part(root, "band", new THREE.CylinderGeometry(radius * pen.bandScale, radius * pen.bandScale, pen.tip / 2, pen.sides), colours.accent, [0, pen.length * pen.bandAt, 0]);
        if (name === "writing_quill") {
            const feather = new THREE.Shape();
            feather.moveTo(...TOOLS.feather.points[0]);
            for (const point of TOOLS.feather.points.slice(1)) feather.lineTo(...point);
            feather.closePath();
            part(root, "feather", new THREE.ShapeGeometry(feather), colours.white, [0, pen.length * TOOLS.feather.at, 0]);
        }
        const nib = new THREE.Object3D();
        nib.name = "tip";
        nib.position.y = -pen.length / 2 - pen.tip;
        root.add(nib);
        root.userData.tip = nib;
    }
    for (const name of ["papers", "writing_paper", "writing_tablet"]) {
        const root = group(name);
        const tablet = name === "writing_tablet";
        const count = name === "papers" ? paper.count : 1;
        root.userData.sheets = [];
        for (let index = 0; index < count; index++) {
            const sheet = part(root, `sheet_${index}`, new THREE.BoxGeometry(paper.width, paper.thickness * (tablet ? paper.tabletLayers : 1), paper.depth), tablet ? colours.ink : colours.paper, [0, index * paper.thickness, 0]);
            root.userData.sheets.push(sheet);
        }
        if (tablet) part(root, "screen", new THREE.BoxGeometry(paper.width * paper.screenWidth, paper.thickness, paper.depth * paper.screenDepth), colours.accent, [0, paper.thickness * paper.screenLift, 0]);
    }
    props.get("papers").userData.shape = ({phase}) => {
        const square = rise(phase, 0, 0.3) * (1 - rise(phase, 0.8, 1));
        props.get("papers").userData.sheets.forEach((sheet, index) => {
            sheet.position.x = paper.spread * index * (1 - square);
            sheet.rotation.y = paper.spread * index * (1 - square);
        });
    };
    const clock = group("pocket_watch");
    const rim = part(clock, "rim", new THREE.CylinderGeometry(watch.radius, watch.radius, watch.depth, watch.sides), colours.silver);
    rim.rotation.x = Math.PI / 2;
    part(clock, "face", new THREE.CircleGeometry(watch.radius * watch.faceScale, watch.sides), colours.white, [0, 0, watch.depth / 2 + watch.faceGap]);
    part(clock, "minute", new THREE.BoxGeometry(watch.minuteWidth, watch.radius * watch.minuteLength, watch.handDepth), colours.ink, [0, watch.radius * watch.minuteAt, watch.depth / 2 + watch.minuteGap]);
    const hour = part(clock, "hour", new THREE.BoxGeometry(watch.hourWidth, watch.radius * watch.hourLength, watch.handDepth), colours.ink, [watch.radius * watch.hourAt, 0, watch.depth / 2 + watch.hourGap]);
    hour.rotation.z = watch.hourTurn;
    part(clock, "ring", new THREE.TorusGeometry(watch.ring, watch.ringTube, watch.ringRadialSegments, watch.ringTubularSegments), colours.silver, [0, watch.radius + watch.ring, 0]);
    const whistle = group("hand_whistle");
    part(whistle, "body", new THREE.BoxGeometry(...TOOLS.whistle.body), colours.accent);
    part(whistle, "mouthpiece", new THREE.BoxGeometry(...TOOLS.whistle.mouthpiece), colours.silver, TOOLS.whistle.mouthAt);
    const wipe = group("polishing_cloth");
    part(wipe, "fold", new THREE.BoxGeometry(cloth.width, cloth.thickness, cloth.depth), colours.white);
    reactionPropsOf(group, part);
    return props;
}

// The things the voices bring out when the agent answers with one of their faces, sized against the figure, each standing up its y axis
// with its front toward the viewer (+z): the butler's bowler as it sits on his head, from its brim, so it can be lifted off and put back
export const REACTION_PROPS = {
    hat: {brim: 1.084, brimDepth: 0.074, crown: 0.9, crownHeight: 0.787, band: 0.905, bandFrom: 0.104, bandDepth: 0.137, sides: 32},
    monocle: {radius: 0.2, tube: 0.028, chain: 0.55, chainWidth: 0.012},
    flute: {base: 0.13, baseDepth: 0.025, stem: 0.022, stemLength: 0.35, rim: 0.12, bottom: 0.05, bowl: 0.4, fill: 0.27},
    shades: {lens: [0.56, 0.34, 0.05], apart: 0.37, bridge: [0.2, 0.05, 0.05], temple: [0.04, 0.04, 0.7], shine: [0.2, 0.035, 0.01]},
    flame: {outer: [0.17, 0.55], inner: [0.09, 0.32], sides: 12, flickers: 7},
    finger: {radius: 0.09, length: 0.22, splay: 0.6},
    popper: {mouth: 0.14, length: 0.45, sides: 12},
    confetti: {count: 18, size: 0.08, reach: 1.5, fall: 0.9, spin: 9},
    trophy: {base: [0.38, 0.12, 0.38], stem: [0.05, 0.08, 0.22], rim: 0.3, bottom: 0.12, cup: 0.38, handle: 0.12, handleTube: 0.03},
    sword: {grip: [0.035, 0.26], guard: [0.42, 0.06, 0.07], blade: [0.09, 1.3, 0.025], point: 0.15, pommel: 0.06},
    castle: {wall: [0.6, 0.3, 0.25], crenel: [0.1, 0.08, 0.25], tower: [0.11, 0.5], roof: [0.15, 0.24], gate: [0.14, 0.18], pole: 0.24, flag: 0.14},
    colours: {hat: 0x292a3b, band: 0xf4f2ed, gold: 0xe8b84a, glass: 0xdde6ee, champagne: 0xf1d27a, lens: 0x14161c, flame: 0xff7a1a,
        fire: 0xffd23f, hand: 0xf5ecdf, wood: 0x7a4a26, stone: 0xc9c2b4, confetti: [0x6366f1, 0xe8b84a, 0xef476f, 0x06d6a0, 0x118ab2]},
};

function reactionPropsOf(group, part) {
    const {hat, monocle, flute, shades, flame, finger, popper, confetti, trophy, sword, castle, colours} = REACTION_PROPS;
    const ink = TOOLS.colours.ink, silver = TOOLS.colours.silver, accent = TOOLS.colours.accent;
    const bowler = group("bowler_hat");
    part(bowler, "brim", new THREE.CylinderGeometry(hat.brim, hat.brim, hat.brimDepth, hat.sides), colours.hat, [0, hat.brimDepth / 2, 0]);
    part(bowler, "crown", new THREE.SphereGeometry(hat.crown, hat.sides, 12, 0, 2 * Math.PI, 0, Math.PI / 2), colours.hat).scale.y = hat.crownHeight / hat.crown;
    part(bowler, "band", new THREE.CylinderGeometry(hat.band, hat.band, hat.bandDepth, hat.sides), colours.band, [0, hat.bandFrom + hat.bandDepth / 2, 0]);
    const glass = group("monocle");
    part(glass, "ring", new THREE.TorusGeometry(monocle.radius, monocle.tube, 8, 24), colours.gold);
    part(glass, "lens", new THREE.CircleGeometry(monocle.radius, 24), colours.glass);
    part(glass, "chain", new THREE.CylinderGeometry(monocle.chainWidth, monocle.chainWidth, monocle.chain, 6), colours.gold, [monocle.radius * 0.7, -monocle.radius * 0.7 - monocle.chain / 2, 0]);
    const toast = group("champagne_flute");
    part(toast, "base", new THREE.CylinderGeometry(flute.base, flute.base, flute.baseDepth, 16), colours.glass, [0, -flute.stemLength / 2, 0]);
    part(toast, "stem", new THREE.CylinderGeometry(flute.stem, flute.stem, flute.stemLength, 8), colours.glass);
    part(toast, "bowl", new THREE.CylinderGeometry(flute.rim, flute.bottom, flute.bowl, 16, 1, true), colours.glass, [0, (flute.stemLength + flute.bowl) / 2, 0]);
    part(toast, "wine", new THREE.CylinderGeometry(flute.rim * 0.9, flute.bottom * 0.9, flute.fill, 16), colours.champagne, [0, flute.stemLength / 2 + flute.fill / 2 + 0.01, 0]);
    const cool = group("sunglasses");
    for (const sign of [1, -1]) {
        part(cool, `lens_${sign}`, new THREE.BoxGeometry(...shades.lens), colours.lens, [sign * shades.apart, 0, 0]);
        part(cool, `temple_${sign}`, new THREE.BoxGeometry(...shades.temple), ink, [sign * (shades.apart + shades.lens[0] / 2), shades.lens[1] / 4, -shades.temple[2] / 2]);
        part(cool, `shine_${sign}`, new THREE.BoxGeometry(...shades.shine), TOOLS.colours.white, [sign * shades.apart - shades.lens[0] / 5, shades.lens[1] / 4, shades.lens[2] / 2]).rotation.z = 0.5;
    }
    part(cool, "bridge", new THREE.BoxGeometry(...shades.bridge), ink, [0, shades.lens[1] / 4, 0]);
    const fire = group("flame");
    const outer = part(fire, "outer", new THREE.ConeGeometry(flame.outer[0], flame.outer[1], flame.sides), colours.flame, [0, flame.outer[1] / 2, 0]);
    const inner = part(fire, "inner", new THREE.ConeGeometry(flame.inner[0], flame.inner[1], flame.sides), colours.fire, [0, flame.inner[1] / 2, 0.03]);
    fire.userData.shape = ({phase, size}) => {
        const flicker = 1 + 0.18 * Math.sin(2 * Math.PI * flame.flickers * phase) + 0.08 * Math.sin(2 * Math.PI * 2.3 * flame.flickers * phase);
        fire.scale.set(size * (2 - flicker), size * flicker, size * (2 - flicker));
        outer.rotation.z = inner.rotation.z = 0.12 * Math.sin(2 * Math.PI * 1.7 * flame.flickers * phase);
    };
    const digit = () => new THREE.CapsuleGeometry(finger.radius, finger.length, 4, 8);
    part(group("thumb"), "thumb", digit(), colours.hand, [0, finger.length / 2 + finger.radius, 0]);
    const shaka = group("shaka");
    for (const sign of [1, -1]) part(shaka, `finger_${sign}`, digit(), colours.hand, [sign * finger.length * 0.6, finger.length / 2, 0]).rotation.z = -sign * finger.splay;
    const party = group("party_popper");
    part(party, "cone", new THREE.ConeGeometry(popper.mouth, popper.length, popper.sides, 1, true), accent, [0, popper.length / 2, 0]).rotation.x = Math.PI;
    part(party, "rim", new THREE.TorusGeometry(popper.mouth, 0.02, 6, popper.sides), colours.gold, [0, popper.length, 0]).rotation.x = Math.PI / 2;
    const pieces = Array.from({length: confetti.count}, (_, index) => {
        const piece = part(party, `confetti_${index}`, new THREE.PlaneGeometry(confetti.size, confetti.size), colours.confetti[index % colours.confetti.length]);
        const around = index * 2.39996;
        const lean = 0.25 + 0.5 * ((index * 7) % confetti.count) / confetti.count;
        piece.userData.way = new THREE.Vector3(Math.sin(lean) * Math.cos(around), Math.cos(lean), Math.sin(lean) * Math.sin(around));
        return piece;
    });
    party.userData.shape = ({burst}) => {
        for (const [index, piece] of pieces.entries()) {
            piece.visible = burst > 0 && burst < 1;
            const out = confetti.reach * Math.sqrt(burst);
            piece.position.set(piece.userData.way.x * out, popper.length + piece.userData.way.y * out - confetti.fall * burst * burst, piece.userData.way.z * out);
            piece.rotation.set(confetti.spin * burst + index, confetti.spin * burst * 0.7, index);
        }
    };
    const cup = group("trophy");
    part(cup, "base", new THREE.BoxGeometry(...trophy.base), colours.wood, [0, -trophy.stem[2] - trophy.base[1] / 2, 0]);
    part(cup, "stem", new THREE.CylinderGeometry(trophy.stem[0], trophy.stem[1], trophy.stem[2], 12), colours.gold, [0, -trophy.stem[2] / 2, 0]);
    part(cup, "cup", new THREE.CylinderGeometry(trophy.rim, trophy.bottom, trophy.cup, 16), colours.gold, [0, trophy.cup / 2, 0]);
    for (const sign of [1, -1]) part(cup, `handle_${sign}`, new THREE.TorusGeometry(trophy.handle, trophy.handleTube, 6, 12), colours.gold, [sign * trophy.rim, trophy.cup * 0.6, 0]);
    const blade = group("sword");
    part(blade, "grip", new THREE.CylinderGeometry(sword.grip[0], sword.grip[0], sword.grip[1], 8), colours.wood);
    part(blade, "pommel", new THREE.SphereGeometry(sword.pommel, 8, 6), colours.gold, [0, -sword.grip[1] / 2 - sword.pommel / 2, 0]);
    part(blade, "guard", new THREE.BoxGeometry(...sword.guard), colours.gold, [0, sword.grip[1] / 2 + sword.guard[1] / 2, 0]);
    part(blade, "blade", new THREE.BoxGeometry(...sword.blade), silver, [0, sword.grip[1] / 2 + sword.guard[1] + sword.blade[1] / 2, 0]);
    const point = part(blade, "point", new THREE.ConeGeometry(sword.blade[0] / Math.SQRT2, sword.point, 4), silver, [0, sword.grip[1] / 2 + sword.guard[1] + sword.blade[1] + sword.point / 2, 0]);
    point.rotation.y = Math.PI / 4;
    point.scale.z = sword.blade[2] / sword.blade[0];
    const keep = group("castle");
    part(keep, "wall", new THREE.BoxGeometry(...castle.wall), colours.stone, [0, castle.wall[1] / 2, 0]);
    for (const x of [-1, 0, 1]) part(keep, `crenel_${x}`, new THREE.BoxGeometry(...castle.crenel), colours.stone, [x * castle.wall[0] / 3, castle.wall[1] + castle.crenel[1] / 2, 0]);
    for (const sign of [1, -1]) {
        part(keep, `tower_${sign}`, new THREE.CylinderGeometry(castle.tower[0], castle.tower[0], castle.tower[1], 12), colours.stone, [sign * castle.wall[0] / 2, castle.tower[1] / 2, 0]);
        part(keep, `roof_${sign}`, new THREE.ConeGeometry(...castle.roof, 12), accent, [sign * castle.wall[0] / 2, castle.tower[1] + castle.roof[1] / 2, 0]);
    }
    part(keep, "gate", new THREE.PlaneGeometry(...castle.gate), ink, [0, castle.gate[1] / 2, castle.wall[2] / 2 + 0.005]);
    const top = castle.tower[1] + castle.roof[1];
    part(keep, "pole", new THREE.CylinderGeometry(0.01, 0.01, castle.pole, 4), ink, [castle.wall[0] / 2, top + castle.pole / 2, 0]);
    const pennant = new THREE.Shape();
    pennant.moveTo(0, 0);
    pennant.lineTo(castle.flag, -castle.flag / 3);
    pennant.lineTo(0, -castle.flag * 2 / 3);
    pennant.closePath();
    part(keep, "flag", new THREE.ShapeGeometry(pennant), colours.gold, [castle.wall[0] / 2, top + castle.pole, 0]);
}

// A prop's place: at its spot on the bone that carries it, turned as `frame` is turned
function heldPropOf(moves, {bone, frame, at, turn}) {
    const placed = at.clone().applyMatrix4(moves.get(bone));
    return TO_GLB.clone().multiply(translation(placed)).multiply(new THREE.Matrix4().extractRotation(moves.get(frame)))
        .multiply(euler(turn.x || 0, turn.y || 0, turn.z || 0)).multiply(FROM_GLB);
}

// every prop placed where the pose holds it, and one whose shape moves, as the papers squared or the confetti flying, shaped as it says
function moveProps(figure, pose, moves) {
    for (const [name, prop] of figure.propByName) {
        const held = pose.props.get(name);
        prop.visible = Boolean(held);
        if (!held) continue;
        prop.matrix.copy(heldPropOf(moves, held));
        prop.matrixWorldNeedsUpdate = true;
        prop.userData.shape?.(held);
    }
}


function bookOf() {
    const slab = (name, colour, width, height, depth) => {
        const mesh = flat(new THREE.BoxGeometry(width, height, depth), colour);
        mesh.name = name;
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry), new THREE.LineBasicMaterial({color: BOOK_COLOURS.edge})));
        return mesh;
    };
    const book = new THREE.Group();
    book.name = "reading_book";
    book.matrixAutoUpdate = false;
    book.visible = false;
    const spine = slab("book_spine", BOOK_COLOURS.spine, BOOK.spine, BOOK.height, BOOK.cover);
    book.add(spine);
    const hinges = {}, covers = {}, pages = {}, grips = {};
    for (const [side, sign] of Object.entries(SIDES)) {
        const hinge = new THREE.Group();
        hinge.name = `book_hinge_${side}`;
        hinge.position.x = sign * BOOK.spine / 2;
        const cover = slab(`book_cover_${side}`, BOOK_COLOURS.cover, BOOK.width, BOOK.height, BOOK.cover);
        cover.position.set(sign * BOOK.width / 2, 0, BOOK.cover / 2);
        const block = slab(`book_pages_${side}`, BOOK_COLOURS.pages, BOOK.width - BOOK.inset, BOOK.height - BOOK.inset * 2, BOOK.pages);
        block.position.set(sign * (BOOK.width - BOOK.inset) / 2, 0, -BOOK.pages / 2);
        for (let line = 1; line <= BOOK.lines; line++) {
            const rule = flat(new THREE.BoxGeometry(BOOK.width - BOOK.inset, BOOK.lineWidth, BOOK.lineWidth), BOOK_COLOURS.rule);
            rule.position.set(block.position.x, -BOOK.height / 2 + BOOK.inset, -BOOK.pages * line / (BOOK.lines + 1));
            hinge.add(rule);
        }
        hinge.add(cover, block);
        book.add(hinge);
        hinges[side] = hinge;
        covers[side] = cover;
        pages[side] = block;
        const grip = new THREE.Object3D();
        grip.name = `book_grip_${side}`;
        book.add(grip);
        grips[side] = grip;
    }
    const leaf = flat(new THREE.PlaneGeometry(BOOK.width - BOOK.inset, BOOK.height - BOOK.inset * 2, BOOK.pageSegments, 1), BOOK_COLOURS.paper);
    leaf.geometry.translate(-(BOOK.width - BOOK.inset) / 2, 0, 0);
    leaf.name = "book_turning_page";
    const edge = new THREE.LineLoop(new THREE.BufferGeometry(), new THREE.LineBasicMaterial({color: BOOK_COLOURS.rule}));
    edge.frustumCulled = false;
    leaf.add(edge);
    leaf.userData.edge = edge;
    book.add(leaf);
    book.userData = {hinges, covers, pages, grips, leaf};
    return book;
}

function heldBookOf(world, open) {
    const at = (name) => new THREE.Vector3().setFromMatrixPosition(world.get(name));
    const left = at("hand_l"), right = at("hand_r");
    const across = left.clone().sub(right).normalize();
    const up = new THREE.Vector3(0, 1, 0).addScaledVector(across, -across.y).normalize();
    const forward = across.clone().cross(up).normalize();
    const turn = new THREE.Matrix4().makeBasis(across, up, forward).multiply(bookTurn(open));
    const scale = left.distanceTo(right) / bookGrip("l", open).distanceTo(bookGrip("r", open));
    const middle = bookGrip("l", open).add(bookGrip("r", open)).multiplyScalar(0.5).applyMatrix4(turn).multiplyScalar(scale);
    return turn.scale(new THREE.Vector3(scale, scale, scale)).setPosition(left.add(right).multiplyScalar(0.5).sub(middle));
}

function openBook(book, open, page) {
    const angle = bookAngle(open);
    for (const [side, sign] of Object.entries(SIDES)) {
        book.userData.hinges[side].rotation.y = sign * angle;
        book.userData.grips[side].position.copy(bookGrip(side, open));
    }
    const leaf = book.userData.leaf;
    const surface = BOOK.pages + BOOK.leaf;
    leaf.position.set(mix(-BOOK.spine / 2 + surface * Math.sin(angle), BOOK.spine / 2 - surface * Math.sin(angle), page), 0, -surface * Math.cos(angle));
    leaf.rotation.y = -angle - radians(BOOK.open * open) * page;
    leaf.visible = open > 0;
    const curl = BOOK.curl * Math.sin(Math.PI * page);
    const width = BOOK.width - BOOK.inset;
    const positions = leaf.geometry.attributes.position;
    for (let row = 0; row < 2; row++) {
        for (let column = 0; column <= BOOK.pageSegments; column++) {
            const fraction = 1 - column / BOOK.pageSegments;
            const at = row * (BOOK.pageSegments + 1) + column;
            const bow = BOOK.pageBow * Math.sin(Math.PI * page) * fraction * fraction;
            positions.setX(at, (curl ? -width * Math.sin(curl * fraction) / curl : -width * fraction) - Math.sin(leaf.rotation.y) * bow);
            positions.setZ(at, (curl ? width * (1 - Math.cos(curl * fraction)) / curl : 0) + Math.cos(leaf.rotation.y) * bow);
        }
    }
    positions.needsUpdate = true;
    const rim = [];
    for (let column = 0; column <= BOOK.pageSegments; column++) rim.push(new THREE.Vector3().fromBufferAttribute(positions, column));
    for (let column = BOOK.pageSegments; column >= 0; column--) rim.push(new THREE.Vector3().fromBufferAttribute(positions, BOOK.pageSegments + 1 + column));
    leaf.userData.edge.geometry.setFromPoints(rim);
}

// Where the glass is held: its handle in the hand on `side`, leaning forward of upright the way the body faces, its lens square to the body
function heldGlassOf(world, side) {
    const at = (name) => new THREE.Vector3().setFromMatrixPosition(world.get(name));
    const up = new THREE.Vector3(0, 1, 0);
    const across = at("thigh_r").sub(at("thigh_l")).setY(0).normalize();
    const forward = up.clone().cross(across);
    const handle = up.clone().multiplyScalar(Math.cos(radians(GLASS_LEAN))).addScaledVector(forward, Math.sin(radians(GLASS_LEAN)));
    const facing = across.clone().cross(handle).normalize();
    return new THREE.Matrix4().makeBasis(across, handle, facing).setPosition(at(`hand_${side}`));
}

// Where the laptop sits: level on the thighs with its hinge at the knees, its keyboard back over the thighs, turned the way the thighs
// point, so it turns with the figure
const LAP_REACH = 1.95;
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

// the figure's bones placed for the pose, turned `facing` degrees, eased from `blend.from` by `blend.k` while a blend is given; the moves
// placed are returned, so the next change can ease from them
function place(figure, pose, facing, blend) {
    const target = pose.moves(facing);
    const result = blend ? blendMoves(figure.rig, blend.from, target, blend.k, blend.previous) : {moves: target, settled: true};
    if (blend) blend.settled = result.settled;
    const moves = result.moves;
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
    figure.glass.visible = Boolean(pose.glass);
    figure.book.visible = Boolean(pose.book?.visible);
    if (figure.book.visible) {
        openBook(figure.book, pose.book.open, pose.book.page);
        figure.book.matrix.copy(heldBookOf(world, pose.book.open));
        figure.book.matrixWorldNeedsUpdate = true;
    }
    if (pose.glass) {
        figure.glass.matrix.copy(heldGlassOf(world, pose.glass));
        figure.glass.matrixWorldNeedsUpdate = true;
    }
    for (const part of figure.tablet) part.visible = pose.tablet;
    const occupied = pose.glass || pose.laptop || pose.book || pose.props.size > 0;
    for (const part of figure.stowable) part.visible = !pose.stowed.has(part.userData.item);
    for (const part of figure.inHand) part.visible = !pose.stowed.has(part.userData.item) && (!occupied || pose.keep.has(part.userData.item));
    moveProps(figure, pose, moves);
    for (const part of figure.cloth) part.visible = pose.cloth;
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
    if (!pose.gaze) {
        pose.turn("neck", {z: -0.3 * LOOK_TURN * sideways * strength});
        pose.turn("head", {z: -0.7 * LOOK_TURN * sideways * strength});
    }
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

    headAt(figure, moves) {
        if (!moves) return {x: 0.5, y: 0.3};
        const at = figure.rig.eyes.reduce((sum, eye) => sum.add(eye), new THREE.Vector3()).divideScalar(figure.rig.eyes.length);
        at.applyMatrix4(moves.get("head")).applyMatrix4(TO_GLB).project(this.camera);
        return {x: (at.x + 1) / 2, y: (1 - at.y) / 2};
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
