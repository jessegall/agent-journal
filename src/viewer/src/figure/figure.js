// A rigged figure drawn in the browser as Blender draws it: posed by a port of clips.py and rig.Posing, shaded as
// toon.py shades it, one held pose for each step of a clip.
import * as THREE from "three";
import {ACTS, RUMMAGED, SMASH, flungAt, heldPhases, offSwing, partOf, pogoBounces, pogoHop, swingAt} from "./acts.js";
import {lookAngles} from "./look.js";
import {FRAMED} from "./frame.js";
import {NEWEST_ASIDE, newestScootAt} from "./newest.js";
import {GAIT, RUN, gaitFoot} from "./gait.js";
import {PROP_FADE_SECONDS, fadeProp, propOverlay, restorePropOpacity, transitionProps} from "./propTransition.js";
import {CHANGE_SECONDS, POSTURES, SEATED, SEAT_POSE, signedTurn} from "./places.js";
import {VISOR, glowTurn} from "./visor.js";
import {FRAMES_PER_SECOND, GRID, TICKER, litPixels} from "./visorPixels.js";
import {HEAD, holdsHead} from "./looks.js";
import {LIGHT_COLOURS, PARCEL, UFO, brightness} from "./parcels.js";
import {blendMoves} from "./blend.js";
import {BUTLER, dressButler, topHatBandGeometry, topHatGeometry} from "./butler.js";
import {HEADPHONES, dressHomie, headphoneContacts, headphoneGrip, headphonesAt, headphonesOf, moveHeadphones} from "./homie.js";
import {withoutEars} from "./ears.js";
import {TELEPHONE, phoneHand} from "./phonePlacement.js";
export {TELEPHONE} from "./phonePlacement.js";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";
import {transport} from "../api/transport.js";

// render_clips.py and snaps.py: an orthographic camera eight units in front, framing 5.4 units about a height of 2.4
export const CELL = 224;
const {height: FRAMED_HEIGHT, middle: FRAMED_MIDDLE} = FRAMED;
const DISTANCE = 8;
const DEPTH = 3;
// three's own Draco decoder, for the review page, which has no server of its own
const DECODER = "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/";
// the share of the picture below the ground the figure stands on, where the chat box's top edge runs
export const GROUND = (FRAMED_HEIGHT / 2 - FRAMED_MIDDLE) / FRAMED_HEIGHT;

// the figure's body is drawn twice as wide as its canvas, as EEVEE draws it with 16 samples a pixel through a 1.5 px filter, scaled down
// and softened by SOFTEN of a cell pixel, which measured closest to Blender's own frames, never past SOFTEN_MOST of the canvas's pixels,
// so a picture drawn larger than the cell is no softer to the eye than the chat's
const BODY_SUPERSAMPLE = 2;
const SOFTEN = 0.5;
const SOFTEN_MOST = 0.5;
const softenOn = (canvas) => Math.min((SOFTEN * canvas.width) / CELL, SOFTEN_MOST);
// its screen, and a parcel's server block, are drawn four times as wide, each of those pixels multisampled, and halved twice, each
// halving averaging every two by two pixels into one, so the screen's pixel grid is smooth and crisp, never softened; a single shrink by
// more than two lets a browser that samples bilinearly skip pixels and leave stair steps
const SUPERSAMPLE = 4;

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
const SLEEP_TILT = 4;
const SLEEP_FRAMES = 18;
// what the butler once carried is left out, the platter and the cloth over his arm, so both his hands are empty and hang and swing as
// each other
export const LEFT_OUT = new Set(["butler_tray", "butler_towel"]);
// what a figure holds only in the poses that use it, as the butler's tablet while he writes or searches
const TABLET = "butler_tablet";
// how far the hand holding the tablet tips it up toward the face, and where on it the free hand touches, from that hand toward the free side
const TABLET_TIP = 65;
const TABLET_TOUCH = [-0.3, -0.22, 0.18];
// what a hand holds level, the forearm across the waist as a waiter's is
const LEVEL_ITEMS = new Set(["colleague_mug"]);
const BUSY_ITEMS = new Set([...LEVEL_ITEMS, "squire_shield", "coach_clipboard"]);
// what a figure carries in its hands, put away while it holds a prop so it never holds two things
const IN_HAND = new Set([...BUSY_ITEMS, "squire_quill"]);
const MIN_EYE_HEIGHT = 0.06;
const HINGES = {forearm: new THREE.Vector3(0, 0, -1), shin: new THREE.Vector3(1, 0, 0)};

// Blender's Z up and -Y front become the glb's Y up and +Z front
const TO_GLB = new THREE.Matrix4().set(1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1);
const FROM_GLB = TO_GLB.clone().invert();

const toBlender = (vector) => vector.clone().applyMatrix4(FROM_GLB);
const translation = (vector) => new THREE.Matrix4().makeTranslation(vector.x, vector.y, vector.z);
const radians = THREE.MathUtils.degToRad;

// how much further than the difference of its two bones a limb reaches at the nearest, folded as far as it folds
const FOLDED_REACH = 1.2;
const DESCENDANTS = new WeakMap();

// Cache the bones carried by each joint so later parent edits preserve articulated contact.
function descendantsOf(rig) {
    if (DESCENDANTS.has(rig)) return DESCENDANTS.get(rig);
    const below = new Map(rig.order.map((name) => [name, []]));
    for (const name of rig.order) {
        for (let parent = rig.parents.get(name); parent; parent = rig.parents.get(parent)) below.get(parent)?.push(name);
    }
    DESCENDANTS.set(rig, below);
    return below;
}

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
        this.descendants = descendantsOf(rig);
        this.final = new Map();
        this.eyes = 1;
        this.eyeShape = null;
        this.eyeGlance = [0, 0];
        this.bulbLit = 0;
        this.eyeTint = null;
        this.hearts = 0;
        this.stars = 0;
        this.squeezed = 0;
        this.dozing = 0;
        this.whoa = false;
        this.laptop = false;
        this.tablet = false;
        this.book = null;
        this.props = new Map();
        this.stowed = new Set();
        this.keep = new Set();
        this.inUse = new Set();
        this.tap = 0;
        this.gaze = null;
        this.posture = posture;
        this.sway = 0;
        this.kneesApart = true;
        this.stride = stride;
        this.sky = null;
        this.throws = null;
        this.leanWay = 0;
        this.phoneWay = 1;
        this.walkWay = 0;
        this.screen = null;
        this.facing = 0;
        this.target = null;
        this.headContact = 0;
        this.suspension = null;
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

    // A parent move carries descendants already posed, preserving their local articulation.
    setMove(name, move) {
        const children = (this.descendants.get(name) ?? []).filter((child) => this.final.has(child));
        if (children.length) {
            const change = move.clone().multiply(this.matrix(name).clone().invert());
            for (const child of children) this.final.set(child, change.clone().multiply(this.final.get(child)));
        }
        this.final.set(name, move);
    }

    turn(name, {x = 0, y = 0, z = 0}) {
        const current = this.matrix(name);
        this.setMove(name, aboutPoint(this.head(name, current), euler(x, y, z)).multiply(current));
    }

    face(name, {x = 0, y = 0, z = 0}) {
        const at = this.head(name, this.standing(name));
        const rest = this.rig.heads.get(name).clone().negate();
        this.setMove(
            name,
            translation(at)
                .multiply(euler(x, y, z))
                .multiply(translation(rest))
        );
    }

    lift(name, {x = 0, y = 0, z = 0}) {
        this.setMove(name, translation(new THREE.Vector3(x, y, z)).multiply(this.matrix(name)));
    }

    bend(name, degrees) {
        const {base, side} = sideOf(name);
        const standing = this.standing(name);
        const axis = hingeAxis(base, side).transformDirection(standing).normalize();
        const turn = new THREE.Matrix4().makeRotationAxis(axis, radians(degrees));
        this.setMove(name, aboutPoint(this.head(name, standing), turn).multiply(standing));
    }

    aim(name, direction) {
        const standing = this.standing(name);
        const now = this.rig.along.get(name).clone().transformDirection(standing);
        const turn = new THREE.Matrix4().makeRotationFromQuaternion(
            new THREE.Quaternion().setFromUnitVectors(now, direction.clone().normalize())
        );
        this.setMove(name, aboutPoint(this.head(name, standing), turn).multiply(standing));
    }

    // rig.Posing.reach for an arm: the hand's head put at `target`, the elbow pointing the way `bend` says
    reach(side, target, bend) {
        this.limbTo(side, ["upper_arm", "forearm", "hand"], target, bend);
    }

    // `target` brought in toward the shoulder on `side` until the arm reaches it, `share` of its full length at most, or out from it to as
    // near as the arm folds
    withinReach(side, target, share) {
        const [shoulder, elbow, hand] = ["upper_arm", "forearm", "hand"].map((role) => this.rig.heads.get(`${role}_${side}`));
        const length = (elbow.distanceTo(shoulder) + hand.distanceTo(elbow)) * share;
        const least = this.foldedReach(side);
        const from = this.head(`upper_arm_${side}`, this.standing(`upper_arm_${side}`));
        const way = target.clone().sub(from);
        if (way.length() > length) return from.clone().add(way.setLength(length));
        return way.length() >= least ? target : from.clone().add(way.setLength(least));
    }

    // how near the shoulder on `side` the arm folds the hand at most, FOLDED_REACH beyond the difference of its two bones
    foldedReach(side) {
        const [shoulder, elbow, hand] = ["upper_arm", "forearm", "hand"].map((role) => this.rig.heads.get(`${role}_${side}`));
        return Math.abs(elbow.distanceTo(shoulder) - hand.distanceTo(elbow)) * FOLDED_REACH;
    }

    // the same for a leg: the foot's head put at `target`, the knee pointing the way `bend` says
    step(side, target, bend) {
        this.limbTo(side, ["thigh", "shin", "foot"], target, bend);
    }

    limbTo(side, roles, target, bend) {
        const [upper, lower, end] = roles.map((role) => `${role}_${side}`);
        const first = this.rig.heads.get(lower).distanceTo(this.rig.heads.get(upper));
        const second = this.rig.heads.get(end).distanceTo(this.rig.heads.get(lower));
        const shoulder = this.head(upper, this.standing(upper));
        const way = target.clone().sub(shoulder);
        const distance = way.length();
        if (distance < Math.abs(first - second) || distance > first + second) {
            throw new Error(`the ${upper} cannot reach ${distance.toFixed(3)}`);
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

    // `name` and every bone above it as posed so far turned about its head, as a back bent forward carries the shoulders, arms and head
    bendAbove(name, {x = 0, y = 0, z = 0}) {
        const turn = aboutPoint(this.head(name, this.matrix(name)), euler(x, y, z));
        const above = (bone) => bone === name || (Boolean(bone) && above(this.rig.parents.get(bone)));
        this.final = new Map(this.rig.order.map((bone) => [bone, above(bone) ? turn.clone().multiply(this.matrix(bone)) : this.matrix(bone)]));
    }

    // the whole figure as posed so far moved by `offset`
    offsetAll(offset) {
        const moved = translation(new THREE.Vector3(...offset));
        this.final = new Map(this.rig.order.map((name) => [name, moved.clone().multiply(this.matrix(name))]));
    }

    // a point given against the body at rest, carried wherever the root has been lifted or moved
    carried(point) {
        return point.clone().add(this.head("root", this.matrix("root")).sub(this.rig.heads.get("root")));
    }

    // how far the legs of a seated figure swing, from -1 to 1
    swing(sway) {
        this.sway = sway;
    }

    // seated, the knees kept together straight ahead, not turned out apart, as on a swing or beside a telephone
    kneesTogether() {
        this.kneesApart = false;
    }

    shutEyes(open) {
        this.eyes = Math.max(open, MIN_EYE_HEIGHT);
    }

    // the eyes in their own shape glancing up `up` of their height and aside `aside` of it, toward the figure's left
    glanceEyes(up, aside) {
        this.eyeGlance = [aside, up];
    }

    // the eyes taking on the picture `name` of visorPixels.js PICTURES, `strength` of the way from their own, aside toward `way`, 1 the figure's left
    shapeEyes(name, strength = 1, way = 1) {
        this.eyeShape = strength > 0 ? {name, strength, way} : null;
    }

    // the eyes' colour, as red, green and blue from 0 to 1; none leaves them their own
    tintEyes(colour) {
        this.eyeTint = colour;
    }

    // hearts in place of the eyes, `size` times their own size; 0 leaves the eyes
    heartEyes(size) {
        this.hearts = size;
    }

    // sparkling stars in place of the eyes, `size` times their own size; 0 leaves the eyes
    starEyes(size) {
        this.stars = size;
    }

    // the eyes squeezed shut laughing, a kawaii > <, `size` times their own size; 0 leaves the eyes
    squeezeEyes(size) {
        this.squeezed = size;
    }

    // dozing, a Z on the visor `size` big (visorPixels.js FRAMES z); 0 for none
    doze(size) {
        this.dozing = size;
    }

    // how strongly the visor shows a picture in place of the plain eyes, 0 to 1: a picture of visorPixels.js (shapeEyes), hearts, stars,
    // squeezed shut laughing, a Z or a 'whoa'
    eyesShown() {
        return Math.min(Math.max(this.eyeShape?.strength ?? 0, this.hearts, this.stars, this.squeezed, this.dozing, this.whoa ? 1 : 0), 1);
    }

    // a laptop open on the lap, its lid toward the face
    holdLaptop() {
        this.laptop = true;
    }

    // the tablet in the hand at the end of the forearm held across the waist, for the free hand to write on or swipe
    holdTablet() {
        this.tablet = true;
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

    // a prop standing on the floor at `at` in the figure's units, turned as the figure is and then by `turn`, at `size` of its own size; a
    // crouch lowers the root, so `at` is given raised by as much for the prop to stay on the floor
    standProp(name, at, turn = {}, size = 1) {
        this.props.set(name, {bone: "root", frame: "root", at: new THREE.Vector3(...at), turn, size});
    }

    // the light bulb over the head (LIGHT_BULB) toward `way`, 1 the figure's left, grown in `size` of the way and lit `lit` of the way,
    // both 0 to 1
    lightBulb(size, lit, way) {
        const [x, y, z] = LIGHT_BULB.at;
        this.standProp("light_bulb", [way * x, y, z]);
        Object.assign(this.props.get("light_bulb"), {size, lit});
        this.bulbLit = lit;
    }

    // a prop worn on the head, `offset` from the head's own place at rest, as the hat lifted from it or the sunglasses put on
    wearProp(name, offset, turn = {}) {
        this.props.set(name, {bone: "head", frame: "head", at: this.rig.heads.get("head").clone().add(new THREE.Vector3(...offset)), turn});
    }

    // the bone `name` turned `degrees` about its own length, as the forearm turns the hand over
    roll(name, degrees) {
        const current = this.matrix(name);
        const along = this.rig.along.get(name).clone().transformDirection(current).normalize();
        this.final.set(name, aboutPoint(this.head(name, current), new THREE.Matrix4().makeRotationAxis(along, radians(degrees))).multiply(current));
    }

    // the hand on `side` closed into a fist, its fingers curled in to `share` of the open hand's length, as it grips a handle
    clench(side, share) {
        const name = `hand_${side}`;
        const head = this.rig.heads.get(name);
        const along = this.rig.along.get(name).clone().normalize();
        const scale = new THREE.Matrix4().set(
            1 + (share - 1) * along.x * along.x, (share - 1) * along.x * along.y, (share - 1) * along.x * along.z, 0,
            (share - 1) * along.y * along.x, 1 + (share - 1) * along.y * along.y, (share - 1) * along.y * along.z, 0,
            (share - 1) * along.z * along.x, (share - 1) * along.z * along.y, 1 + (share - 1) * along.z * along.z, 0,
            0, 0, 0, 1,
        );
        this.final.set(name, this.matrix(name).clone().multiply(aboutPoint(head, scale)));
    }

    // where the hand on `side` grips at rest, `offset` from its own grip
    grip(side, offset) {
        return this.rig.heads.get(`hand_${side}`).clone().add(new THREE.Vector3(SIDES[side] * (HAND.grip + offset[0]), HAND.forward + offset[1], offset[2]));
    }

    putAway(...items) {
        items.forEach((item) => this.stowed.add(item));
    }

    // Every bone's move, carried by its suspension after its limbs are posed, then turned `facing` degrees toward the viewer's right.
    // Props use these same moves, so a swing's rider, seat and ropes pivot together about their fixed knots.
    moves(facing) {
        const turn = new THREE.Matrix4().makeRotationZ(radians(facing));
        if (this.suspension) turn.multiply(this.suspension);
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
    pose.restArms = {stance, swing, level};
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

const freeSide = (stance) => (stance.busy.has("r") ? "l" : "r");

// the hand the figure leans out with toward `way` (1 the picture's right, -1 its left), the one on that side, or its free hand when that
// one is busy; with no way given, its free hand
export const reachSide = (stance, way) => {
    const wanted = way === SIDES.l ? "l" : way === SIDES.r ? "r" : null;
    return wanted && !stance.busy.has(wanted) ? wanted : freeSide(stance);
};

function idle(pose, stance, t) {
    breathe(pose, t);
    armsAtRest(pose, stance);
    pose.swing(waveOf(t));
}

function nod(pose, stance, t) {
    const dip = Math.max(waveOf(onceTime(t, 10), 2), 0) ** 2;
    trunk(pose, {lean: 4 * dip, nod: 26 * dip});
    armsAtRest(pose, stance);
}

// Rubbing its hands together before its chest, pleased with a job well done (acts.js hand_rub): the hands meet at `at` (across, forward, up),
// each `apart` to its own side of it, and slide round each other in circles `circle` round turning opposite ways, so each passes the other
// over and under; the head nods `nod` degrees with each rub. Facing the viewer it turns `turn` degrees to its side as the hands come
// together, so the hands are seen rubbing rather than hidden one behind the other; already turned aside, as toward its card, it stays so
export const RUB = {at: [0, -0.62, 1.95], apart: 0.07, circle: 0.13, nod: 8, turn: 70};

function hand_rub(pose, stance, t) {
    const act = ACTS.hand_rub;
    const u = onceTime(t, act.frames);
    const ready = partOf(u, act.together) * (1 - partOf(u, act.apart));
    const angle = 2 * Math.PI * act.rubs * span(u, act.together[1], act.apart[0]);
    breathe(pose, 0);
    trunk(pose, {lean: 4 * ready, nod: RUB.nod * ready * (0.5 + 0.5 * Math.sin(2 * angle))});
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, ready ? Object.keys(SIDES) : []);
    const [x, y, z] = RUB.at;
    for (const [side, sign] of Object.entries(SIDES)) {
        const spot = new THREE.Vector3(x + sign * (RUB.apart + RUB.circle * Math.cos(angle)), y, z + sign * RUB.circle * Math.sin(angle));
        if (ready) handTo(pose, side, ready, pose.withinReach(side, pose.carried(spot), 0.97), new THREE.Vector3(...ACTING.elbow));
    }
    eyesAs(pose, "amused", ready);
    if (Math.abs(Math.sin(radians(pose.facing ?? 0))) < 0.5) pose.revolve(RUB.turn * ready);
}

function shake(pose, stance, t) {
    const u = onceTime(t, 12);
    const ready = rise(u, 0, 0.12) * (1 - rise(u, 0.78, 1));
    trunk(pose, {turn: 28 * waveOf(u, 2) * ready, tilt: 4 * waveOf(u, 2) * ready});
    armsAtRest(pose, stance);
}

function wave(pose, stance, t) {
    const side = freeSide(stance);
    const sign = SIDES[side];
    trunk(pose, {twist: -sign * 4, turn: -sign * 8, tilt: -sign * 6});
    armsAtRest(pose, stance, [side]);
    waveArm(pose, side, t);
}

// the arm on `side` raised and waving
function waveArm(pose, side, t) {
    pose.turn(`upper_arm_${side}`, {x: -RAISED_ROLL});
    pose.turn(`upper_arm_${side}`, {z: SIDES[side] * WAVE_BACK});
    pose.bend(`forearm_${side}`, WAVE_BEND + WAVE_SWING * waveOf(t));
}

// How the figure thinks (thinkingClip, type_ponder): the head tilted `tilt` degrees to the free hand's side and up `nod`, swaying `sway` degrees;
// the free hand's fingers along the cheek at `cheek`, beside the bottom of the head, pointing up along `finger`, its elbow down along
// `elbow`; the other forearm folded across the body under that elbow, its hand `inboard` of the way from the middle out to that elbow
// and `under` it, its own elbow out along `folded`; the eyes glancing up `glance` of their height, and aside; and at the act's end,
// "got it", the hand raised before the shoulder at `gotIt`, its finger up
export const PONDERING = {
    tilt: 22, nod: -12, sway: 4, cheek: [0.38, -0.78, 2.6], finger: [0.2, 0.15, 1], elbow: [0.1, -0.5, -1],
    inboard: 0.1, under: 0.12, folded: [1, -0.6, -0.4], glance: [0.35, 0.3], gotIt: [0.85, -0.45, 2.75],
};

// the wrist of the hand on `side` put so its grip is at `grip`, the hand pointing along `along`, `k` of the way up from hanging
function handAlong(pose, side, k, grip, along, elbow) {
    restingPropArm(pose, side);
    armToward(pose, side, k, grip.clone().addScaledVector(along, -HAND.grip), null, elbow.toArray());
    aimWristToward(pose, side, k, along);
}

// the forearm on `side` folded across the body under the elbow of the arm on `other`, `k` of the way up from hanging
function foldUnder(pose, side, other, k) {
    const elbow = pose.head(`forearm_${other}`, pose.matrix(`forearm_${other}`));
    const under = new THREE.Vector3(elbow.x * PONDERING.inboard, elbow.y, elbow.z - PONDERING.under);
    restingPropArm(pose, side);
    armToward(pose, side, k, pose.withinReach(side, under, 0.97), null, PONDERING.folded);
}

// The figure thinking, `thinking` of the way into the pose, swayed `sway` of its sway, and `got` of the way into "got it", its hand
// `raised` of the way from its cheek up before its shoulder: the head tilted up and aside, the finger at the cheek and that elbow on the
// other arm folded across the body, the eyes glancing up and aside, in their own shape; the thought cloud over it is the page's
// (chat/FigureAct.vue)
function thinks(pose, stance, t, {thinking, sway, got, raised}) {
    const side = freeSide(stance);
    const other = side === "l" ? "r" : "l";
    const sign = SIDES[side];
    breathe(pose, t);
    trunk(pose, {nod: PONDERING.nod * thinking - 10 * got, tilt: -sign * (PONDERING.tilt * thinking + PONDERING.sway * sway), turn: 3 * sway});
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, [...(thinking + got ? [side] : []), ...(thinking ? [other] : [])]);
    if (thinking + got) fingerAtCheek(pose, side, Math.max(thinking, got), raised);
    if (thinking) foldUnder(pose, other, side, thinking);
    pose.glanceEyes(PONDERING.glance[0] * thinking, -sign * PONDERING.glance[1] * thinking);
    eyesAs(pose, "startled", got);
}

// the finger of the hand on `side` along the cheek, as the head is posed, `k` of the way up from hanging and `raised` of the way from
// there up before the shoulder, "got it"
function fingerAtCheek(pose, side, k, raised = 0) {
    const sign = SIDES[side];
    const [x, y, z] = PONDERING.cheek;
    const cheek = new THREE.Vector3(sign * x, y, z).applyMatrix4(pose.matrix("head"));
    const [gx, gy, gz] = PONDERING.gotIt;
    const up = pose.carried(new THREE.Vector3(sign * gx, gy, gz + HAND.grip));
    const [across, forward, rise] = PONDERING.finger;
    handAlong(pose, side, k, cheek.lerp(up, raised), new THREE.Vector3(-sign * across, forward, rise).normalize(), new THREE.Vector3(...PONDERING.elbow));
}

// The pose of a play of the thinking act timed as `act` says (acts.js ponder, think_cloud, got_it): with the cloud, it comes into the
// thinking pose under the thought cloud (chat/FigureAct.vue) and comes out of it at its `rise`; with the bulb, "got it", the head up, the
// eyes wide and the finger raised as the bulb lights
const thinkingClip = (act) => (pose, stance, t) => {
    const u = onceTime(t, act.frames);
    const thinking = act.cloud ? partOf(u, act.into) * (1 - partOf(u, act.rise)) : 0;
    const bulb = Boolean(act.lights);
    const got = bulb ? partOf(u, act.rise) * (1 - partOf(u, act.fades)) : 0;
    thinks(pose, stance, t, {thinking, sway: (act.sways ? Math.sin(2 * Math.PI * act.sways * u) : 0) * thinking, got, raised: bulb ? partOf(u, act.rise) : 0});
    if (bulb && u >= act.appears[0]) pose.lightBulb(partOf(u, act.appears) * (1 - partOf(u, act.goes)), partOf(u, act.lights) * (1 - partOf(u, act.fades)), SIDES[freeSide(stance)]);
};

function celebrate(pose, stance, t) {
    const jump = Math.max(Math.sin(2 * Math.PI * 2 * t), 0) ** 2;
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
    if (frame < ACTING.yawnFrames) {
        yawn(pose, stance, frame / ACTING.yawnFrames);
        const settled = rise(frame, ACTING.yawnFrames - 5, ACTING.yawnFrames);
        trunk(pose, {lean: 4 * settled, nod: 8 * settled, tilt: SIDES[freeSide(stance)] * SLEEP_TILT * settled});
        for (const side of Object.keys(SIDES)) restingPropArm(pose, side);
        yawnHand(pose, freeSide(stance), gestureTime(frame / ACTING.yawnFrames, ACTING.yawnFrames).ready);
        pose.shutEyes(pose.eyes * (1 - settled));
        return;
    }
    const breath = waveOf((frame - ACTING.yawnFrames) / SLEEP_FRAMES);
    breathe(pose, 0);
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

// The running cycle is driven by page distance, as the walk is. Its planted soles move back at exactly the body's pace; the longer
// recovery swings, bent pumping arms and forward lean belong to this clip alone, with a short flight between alternating supports.
function run(pose, stance, t) {
    pose.stride = t;
    const phase = ((t % 1) + 1) % 1;
    const half = phase % 0.5;
    const flight = half > RUN.planted ? Math.sin(Math.PI * (half - RUN.planted) / (0.5 - RUN.planted)) ** 2 : 0;
    const height = -0.2 + 0.055 * flight;
    const pump = Math.sin(2 * Math.PI * phase);
    pose.lift("root", {z: height});
    breathe(pose, 0);
    trunk(pose, {lean: 14, nod: -7, twist: -9 * pump, turn: 4 * pump});
    const carried = stance.carried ?? stance.busy;
    const pumping = Object.keys(SIDES).filter((side) => !carried.has(side) && !stance.level.has(side));
    armsAtRest(pose, stance, pumping);
    for (const side of pumping) hang(pose, side, SIDES[side] * 42 * pump, 72 - SIDES[side] * 10 * pump);
    for (const [side, offset] of [["l", 0], ["r", 0.5]]) {
        const [forward, lifted] = gaitFoot(phase + offset, RUN);
        stepLeg(pose, side, forward, lifted, height, 18 * lifted / RUN.clearance);
    }
}

// The walk's lower body at `pose.stride` of its cycle: the body bobbing before a clip poses the rest, and the legs stepping after it. Every
// clip drawn on the move walks on these, so the figure goes on thinking or working as it goes; the hips' sway is the walk's own, as a
// clip that reaches for the chin or the lap places its hands against an upper body that does not swing
function strideUnder(pose) {
    const height = -0.11 + 0.012 * Math.cos(4 * Math.PI * pose.stride);
    pose.lift("root", {z: height - (pose.strideHeight ?? 0)});
    pose.strideHeight = height;
}

function strideLegs(pose, k = 1) {
    for (const [side, offset] of [["l", 0], ["r", 0.5]]) {
        const [forward, lift] = gaitFoot(pose.stride + offset, GAIT);
        const foot = pose.rig.heads.get(`foot_${side}`);
        const turn = radians(pose.strideTurn ?? 0);
        const around = new THREE.Vector3(0, 0, 1);
        const target = pose.carried(foot).add(new THREE.Vector3(0, forward * k, lift * k - (pose.strideHeight ?? 0)).applyAxisAngle(around, turn));
        pose.step(side, target, new THREE.Vector3(0, -1, 0).applyAxisAngle(around, turn));
        pose.face(`foot_${side}`, {x: -8 * lift / WALK_STRIDE[2] * k, z: pose.strideTurn ?? 0});
    }
}

// New clips: a direct numerical port of clips.py, not an interpolated animation.
const ENTRY_DISTANCE = 4.4;
const ENTRY_TRAVEL_END = 0.72;
const ENTRY_TURN_END = 0.94;
const RUN_STRIDE = [1.84, 0.38, 0.2];
const WALK_STRIDE = [GAIT.length, GAIT.planted, GAIT.clearance];
const DEPART_TURN = 0.14;
const SEAT_LIFT = 0.2;
// sitting on an edge, how far each thigh is raised from hanging, so it slopes down a little over the edge from the hips, and how far each
// knee bends, so the shins hang straight down past the edge, as a person sits on a wall with the legs loose; and how far each thigh turns out
// from straight ahead, the knees forward and apart and the feet hanging apart under them, so a figure seated facing the viewer shows its
// thighs, which pointing straight at the viewer would vanish and leave it short-legged, unless its clip keeps the knees together (Posing
// kneesTogether), as on the swing or at the telephone beside it
const SEAT_THIGH = 66;
const SEAT_SHIN = 68;
export const SEAT_SPREAD = 16;
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
// seated, the body lifted onto the seat, sitting on whatever hangs behind it, as the butler's tails, out of sight under it
function seat(pose) {
    pose.lift("root", {z: SEAT_LIFT});
    pose.putAway(...BUTLER.satOn);
}

// Lounging on a floor's top (places.js POSTURES lounge): sat on it with the legs straight out toward the viewer, the feet up, leaning
// back on both hands set flat on the floor a little behind the hips; the floor line is LOUNGE.floor above the standing feet in the
// figure's units, where the hips' seat meets it
export const LOUNGE = {lean: -24, feet: 18, hands: [0.62, 0.5], floor: 1.4};

function loungedSeat(pose) {
    seat(pose);
    trunk(pose, {lean: LOUNGE.lean, nod: -LOUNGE.lean * 0.6});
}

function loungedLegs(pose) {
    for (const side of Object.keys(SIDES)) {
        pose.turn(`thigh_${side}`, {x: -88});
        pose.turn(`foot_${side}`, {x: LOUNGE.feet});
    }
    for (const [side, sign] of Object.entries(SIDES)) {
        if (pose.inUse.has(side)) continue;
        const flat = new THREE.Vector3(sign * LOUNGE.hands[0], LOUNGE.hands[1], LOUNGE.floor);
        handTo(pose, side, 1, pose.withinReach(side, flat, 0.97), new THREE.Vector3(0.6, 1, 0));
        pose.face(`hand_${side}`, {x: -80});
    }
}

// Sitting composed on a floor's top (places.js POSTURES composed): sat upright with its knees up, its feet flat on the floor before it at
// `feet` (across, forward, up from the standing feet, in the figure's units), their soles on the floor line `ankle` under the ankles,
// never sunk into the floor nor its legs straight out toward the viewer; the floor line is `floor` above the standing feet, as when it
// lounges. Facing the viewer both hands are set flat on the floor at its sides, palms down, `hands` across and forward of the middle;
// turned a little to one side (perches.js composedSpot) only the hand on the side turned away, the other arm left free to move as the clip
// has it, laid over its knee when the clip leaves it hanging at rest, under `free` over the floor line, so it never hangs through the
// floor; leaning on one arm it bends its body `tilt` degrees over to that side, that hand set flat further out, `out` across, and the
// other resting over the front of its knee, `knee` forward and up from the knee. A hand an act holds in use (Posing inUse), as the one
// taking a call, is left as the act has it.
export const COMPOSED = {feet: [0.32, -0.8, LOUNGE.floor + 0.33], hands: [0.78, -0.05], nod: -4, floor: LOUNGE.floor, free: 0.4, lean: {tilt: 12, out: 1.0, knee: [0, -0.2, 0.12]}};

function composedSeat(pose) {
    seat(pose);
    trunk(pose, {nod: COMPOSED.nod});
    if (pose.leanWay) pose.bendAbove("spine", {y: pose.leanWay * COMPOSED.lean.tilt});
}

function composedLegs(pose) {
    for (const [side, sign] of Object.entries(SIDES)) {
        const [x, y, z] = COMPOSED.feet;
        pose.step(side, new THREE.Vector3(sign * x, y, z), new THREE.Vector3(0, -1, 1));
    }
    const leans = pose.leanWay;
    const turned = Math.sign(signedTurn(pose.facing));
    for (const [side, sign] of Object.entries(SIDES)) {
        if (pose.inUse.has(side)) continue;
        if (leans && sign !== leans) restOnKnee(pose, side);
        else if (leans) handFlat(pose, side, COMPOSED.lean.out);
        else if (!turned || sign === turned) handFlat(pose, side, COMPOSED.hands[0]);
        else if (pose.head(`hand_${side}`, pose.matrix(`hand_${side}`)).z < COMPOSED.floor + COMPOSED.free) restOnKnee(pose, side);
    }
}

// the hand on `side` set flat on the floor line of a composed seat, palm down, `across` to its side
function handFlat(pose, side, across) {
    const flat = new THREE.Vector3(SIDES[side] * across, COMPOSED.hands[1], COMPOSED.floor);
    handTo(pose, side, 1, pose.withinReach(side, flat, 0.97), new THREE.Vector3(1, 0.3, 0));
    pose.face(`hand_${side}`, {x: -80});
}

// the hand on `side` resting over the front of its knee, palm down
function restOnKnee(pose, side) {
    const knee = pose.head(`shin_${side}`, pose.matrix(`shin_${side}`)).add(new THREE.Vector3(...COMPOSED.lean.knee));
    handTo(pose, side, 1, pose.withinReach(side, knee, 0.97), new THREE.Vector3(1, 0.3, 0));
    pose.face(`hand_${side}`, {x: -80});
}

function seatedLegs(pose) {
    for (const [side, sign] of Object.entries(SIDES)) {
        pose.turn(`thigh_${side}`, {x: -SEAT_THIGH, z: pose.kneesApart ? sign * SEAT_SPREAD : 0});
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

// The looks the eyes take on, over whatever the body does: how far they open, the colour they turn, whether they are hearts, and the shape
// of the visor's pictures they take on (visorPixels.js). The helmet hides everything else, so the eyes carry the expression.
export const EYES = {
    hearts: {open: 1, tint: null, hearts: true},
    amused: {open: 0.3, tint: [1, 0.85, 0.4]},
    startled: {open: 1.5, tint: [1, 1, 1]},
    worried: {open: 0.7, tint: [0.6, 0.75, 1]},
    angry: {open: 0.45, tint: [1, 0.35, 0.3]},
    reading: {open: 0.8, tint: null},
    admiring: {open: 1.2, tint: [1, 0.86, 0.5]},
    serene: {open: 0.35, tint: [1, 0.93, 0.62]},
};

// The eyes in fight mode, taking on a fixed run's bug: narrowed to `open` and cycling through the rainbow `cycles` times over the act,
// `strength` of the way in
export const FIGHT_EYES = {open: 0.42, cycles: 6};

function fightEyes(pose, t, strength) {
    pose.shutEyes(mix(1, FIGHT_EYES.open, strength));
    if (strength > 0.5) pose.tintEyes(new THREE.Color().setHSL((t * FIGHT_EYES.cycles) % 1, 1, 0.6).toArray());
}

function eyesAs(pose, mood, strength = 1) {
    const {open, tint, shape} = EYES[mood];
    pose.shutEyes(mix(1, open, strength));
    if (tint && strength > 0.5) pose.tintEyes(tint);
    if (shape) pose.shapeEyes(shape, strength);
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
    const u = onceTime(t, ACTS.joy.frames);
    const leap = Math.max(Math.sin(2 * Math.PI * ACTS.joy.jumps * span(u, 0.06, 0.94)), 0) * (1 - 0.3 * u);
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
// the trunk with idle's first breath, its lean and any `bend` of the trunk on top, the arms not held `apart`, and the legs, folded by `drop` when standing,
// their steps `behind` the hips by so much, as when leaning into a push
function stride(pose, stance, cycle, motion, {running = false, lean = running ? 10 : 3, clearance, apart = [], drop = 0, bend = {}, behind = 0} = {}) {
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
    if (motion > 0 || drop || behind) {
        for (const [side, offset] of [
            ["l", 0],
            ["r", 0.5],
        ]) {
            const [step, raised] = strideFoot(cycle + offset, length, duty, clearance ?? lift);
            const phase = (cycle + offset) % 1;
            const flightPhase = phase >= duty ? (phase - duty) / (1 - duty) : 0;
            const toe = (running ? 14 : 11) * Math.sin(Math.PI * flightPhase) * motion;
            stepLeg(pose, side, motion * step + behind, motion * raised, rootHeight, toe);
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

// where the hands take the ladder's rungs climbing it, in the figure's units across, forward and up, and how much higher the upper hand
// reaches; and how high each knee lifts onto the next rung, in degrees
export const LADDER_CLIMB = {grip: [0.32, -0.55, 2.55], reach: 0.55, knee: 48};

// climbs a ladder facing it: each hand in turn reaching up to the next rung as the knee on the other side lifts onto one, the body
// leaning in to the ladder
function ladder_climb(pose, stance, t) {
    const step = Math.sin(2 * Math.PI * t);
    breathe(pose, 0);
    trunk(pose, {lean: 10, nod: -8});
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, Object.keys(SIDES));
    const [x, y, z] = LADDER_CLIMB.grip;
    for (const [side, sign] of Object.entries(SIDES)) {
        const up = (1 + sign * step) / 2;
        handTo(pose, side, 1, pose.withinReach(side, pose.carried(new THREE.Vector3(sign * x, y, z + LADDER_CLIMB.reach * up)), 0.97), new THREE.Vector3(sign, 0.4, -0.6));
        pose.face(`hand_${side}`, {x: -90});
        const knee = LADDER_CLIMB.knee * (1 - up);
        pose.turn(`thigh_${side}`, {x: -knee});
        pose.turn(`shin_${side}`, {x: knee * 1.2});
    }
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
    const toTarget = pose.withinReach(side, target, 0.999999).clone().sub(shoulder);
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
// The figure searching the floor ahead: turned `turn` degrees side-on, leaning `lean` and nodding `nod` degrees down at it, its body
// turned `sweep` degrees each way as its look sweeps along
export const SEARCHING = {sweep: 14, lean: 10, nod: 16, turn: 70};

// where the glass's lens is held as the figure looks from `eyes` at `spot`: `reach` along its sight, so it is before its eyes
export const lensBefore = (eyes, spot, reach) => eyes.clone().add(spot.clone().sub(eyes).setLength(reach));

// The page moves the whole canvas along the floor; only a small stride stays inside it, leaving room for the leading quill.
const CHASE_REACH = 0.25;
const TAP_LIFT = 0.13;

// where the glance is across one slow search cycle: one way, a pause, the other way, a pause, back to centre, a longer rest
function glanceOf(t) {
    return rise(t, 0, 0.22) - 2 * rise(t, 0.32, 0.62) + rise(t, 0.7, 0.85);
}

// looks at the floor well ahead (SEARCHING), sweeping its look along the floor
function search(pose, stance, t) {
    const sign = SIDES[freeSide(stance)];
    const sweep = glanceOf(t);
    crouch(pose, SEARCH_CROUCH);
    breathe(pose, 0);
    trunk(pose, {lean: SEARCHING.lean, nod: SEARCHING.nod, turn: sign * SEARCHING.sweep * sweep});
    armsAtRest(pose, stance);
    eyesAs(pose, "reading");
    if (pose.posture === "stand") pose.revolve(sign * SEARCHING.turn);
}

// The magnifying glass held up to a chat bubble beside the figure, its lens between the eyes and the bubble's text: the text where the look
// is (pose.at, lookToward), `depth` of the figure's units behind its own plane as the page is, else `ahead` of the eyes, out to the free
// hand's side; the lens `out` units from the eyes along the way to the text, clear of the big head, and never past `share` of the way
// there; the figure leaning `lean` degrees toward it, the glass drawn `size` times as large
export const GLASS_BUBBLE = {depth: 0.3, ahead: [1.6, 0.3, 0.2], out: 1.25, share: 0.8, lean: 8, size: 1.2};

// The point of the page the look is at (pose.at), in the figure's units turned with its body (pose.facing), or null with no look
export function lookedPoint(pose, depth) {
    if (!pose.at) return null;
    const point = new THREE.Vector3((pose.at.x - 0.5) * FRAMED_HEIGHT, depth, FRAMED_MIDDLE + (0.5 - pose.at.y) * FRAMED_HEIGHT);
    return point.applyAxisAngle(new THREE.Vector3(0, 0, 1), radians(-pose.facing));
}

// leans against a wall to rest (acts.js lean), the wall out to the way it is (pose.leanWay, 1 the right): the ankles crossed, the outer
// foot over the inner in front of it, then the whole body tilted from the feet toward the wall, its weight on the hand on that side flat
// against it with the elbow bent, the other hand on its hip, settling a little as it breathes
function lean(pose, stance, t) {
    const {wall, contact, tilt, hip, inner, outer, over} = ACTS.lean;
    const way = pose.leanWay || 1;
    const side = way === SIDES.l ? "l" : "r";
    const other = side === "l" ? "r" : "l";
    pose.turn(`thigh_${side}`, {y: SIDES[side] * inner});
    pose.turn(`thigh_${other}`, {y: SIDES[other] * outer, x: -over});
    const feet = new Map(Object.keys(SIDES).map((leg) => {
        const foot = pose.head(`foot_${leg}`, pose.matrix(`foot_${leg}`));
        foot.z = pose.rig.heads.get(`foot_${leg}`).z;
        return [leg, foot];
    }));
    const tilted = way * tilt * (1 + 0.06 * waveOf(t));
    pose.lift("root", {z: -0.12});
    pose.turn("root", {y: tilted});
    breathe(pose, t);
    trunk(pose, {tilt: -tilted * 0.4});
    for (const [leg, foot] of feet) {
        pose.step(leg, foot, new THREE.Vector3(0, -1, 0));
        pose.face(`foot_${leg}`, {});
    }
    armsAtRest(pose, stance, [side, ...(stance.free.has(other) ? [other] : [])]);
    handTo(pose, side, 1, pose.withinReach(side, pose.carried(new THREE.Vector3(way * wall * FRAMED_HEIGHT, 0, contact)), 0.99), new THREE.Vector3(way, 0.2, -1));
    pose.face(`hand_${side}`, {z: -SIDES[side] * 90});
    const onHip = new THREE.Vector3(SIDES[other] * hip[0], hip[1], hip[2]).applyAxisAngle(new THREE.Vector3(0, 1, 0), radians(tilted));
    if (stance.free.has(other)) handTo(pose, other, 1, pose.withinReach(other, pose.carried(onHip), 0.97), new THREE.Vector3(SIDES[other], 0.3, 0));
    eyesAs(pose, "amused", 0.4);
}

// holds the magnifying glass up against a bubble beside it in the hand on that side, the lens between its eyes and the bubble's text,
// scanning along the text through it as its look moves along it, its head following (GLASS_BUBBLE)
function glass_bubble(pose, stance, t) {
    const restEyes = pose.rig.eyes.reduce((sum, eye) => sum.add(eye), new THREE.Vector3()).divideScalar(pose.rig.eyes.length);
    const before = restEyes.clone().applyMatrix4(pose.matrix("head"));
    const [across, depth, up] = GLASS_BUBBLE.ahead;
    const text = lookedPoint(pose, GLASS_BUBBLE.depth) ?? before.clone().add(new THREE.Vector3(SIDES[freeSide(stance)] * across, depth, up));
    const way = Math.sign(text.x - before.x);
    const side = way ? (way > 0 ? "l" : "r") : freeSide(stance);
    breathe(pose, t);
    trunk(pose, {tilt: -SIDES[side] * GLASS_BUBBLE.lean});
    armsAtRest(pose, stance, [side]);
    const eyes = restEyes.applyMatrix4(pose.matrix("head"));
    const sight = text.clone().sub(eyes);
    const slant = THREE.MathUtils.radToDeg(Math.atan2(sight.x, -sight.y));
    const tip = THREE.MathUtils.radToDeg(Math.atan2(-sight.z, Math.hypot(sight.x, sight.y)));
    // the lens as far out along the sight as the hand can hold it, from GLASS_BUBBLE out in toward the eyes, so it stays on the line
    const handle = new THREE.Vector3(0, 0, 1).applyMatrix4(euler(tip, 0, slant));
    const reached = (lens) => {
        const grip = pose.carried(lens.clone().addScaledVector(handle, -(GLASS.handle / 2 + GLASS.radius) * GLASS_BUBBLE.size));
        return pose.withinReach(side, grip, 0.97).distanceTo(grip) < 0.02;
    };
    const furthest = Math.min(GLASS_BUBBLE.out, sight.length() * GLASS_BUBBLE.share);
    const steps = Array.from({length: 8}, (_, step) => furthest * (1 - step / 10));
    const lens = lensBefore(eyes, text, steps.find((reach) => reached(lensBefore(eyes, text, reach))) ?? steps.at(-1));
    glassOver(pose, side, 1, lens, 0, {tip, roll: 0, slant, size: GLASS_BUBBLE.size});
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
    supportLift: 0.22, whistleLift: 0.25, clothLift: 0.2, clothTurn: -90, compactFps: 6,
    tap: 10, rock: 3, turn: 12, nod: 8,
    writeStroke: 0.035, writeHeight: 0.02,
    glance: 22, hop: 0.18, stumble: 12,
    writingWrist: [0.38, -0.76, 2.1],
    yawnWrist: [0.48, -0.86, 2.12], whistleWrist: [0.48, -0.82, 2.2],
    sipWrist: [0.7, -0.63, 2.17], shieldWrist: [0.22, -0.64, 2.13],
    wipeWrist: [0.1, -0.7, 1.9], saluteWrist: [1.28, -0.32, 2.59],
    gestureIn: 0.2, gestureOut: 0.8,
    yawnEyes: 0.94, yawnSpan: [0.08, 0.92],
    pastimeSpan: [0.3, 0.7], whistleEyes: 0.65, sipEyes: 0.5, sipTip: 12,
    grooveEyes: 0.4, beats: 4, sways: 2, wipes: 3, wipeLift: 0.035,
    wipeAcross: 0.04, bowLean: 18, bowNod: 10,
    leapSpan: [0.18, 0.78], catchSpan: [0.15, 0.45], recoverSpan: [0.45, 0.85], recover: 0.3,
};
export const WRITING = {butler: "writing_stylus", coach: "writing_pencil", colleague: "writing_pen", homie: "writing_marker", squire: "writing_quill"};
const HELD_FRAMES = ACTING.intro + ACTING.hold + ACTING.outro;
// The wait, one long round: the figure turned toward the compose box, tapping its foot, and toward the end a while of whistling idly.
// Spans are shares of the held part.
export const WAIT = {intro: 8, hold: 144, outro: 8, whistleSpan: [0.7, 0.98], beats: 12, sways: 3};
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
    restingPropArm(pose, side);
    armToward(pose, side, ready, pose.carried(new THREE.Vector3(SIDES[side] * target[0], target[1], target[2])), {z: -SIDES[side] * 90, ...turn});
}

// Rebuild the same resting arm whether the caller has already posed it or reserved it for the gesture.
function restingPropArm(pose, side) {
    for (const role of ["upper_arm", "forearm", "hand"]) pose.final.delete(`${role}_${side}`);
    const {stance, swing, level} = pose.restArms;
    if (level.has(side)) return hold(pose, side);
    hang(pose, side, swing[side] ?? 0);
    if (stance.shield?.has(side)) pose.turn(`hand_${side}`, {y: -SIDES[side] * SHIELD_ROLL, z: SIDES[side] * SHIELD_TURN});
}

// Interpolate joint rotations from the actual rest, keeping the limb lengths and its supported prop continuous.
function armToward(pose, side, ready, target, turn, elbow = ACTING.elbow) {
    const names = ["upper_arm", "forearm", "hand"].map((role) => `${role}_${side}`);
    const resting = new Map(names.map((name) => [name, pose.matrix(name).clone()]));
    pose.reach(side, pose.withinReach(side, target, 0.999999), new THREE.Vector3(...elbow));
    const intended = new Map(names.map((name) => [name, pose.matrix(name).clone()]));
    for (const name of names.slice(0, 2)) {
        const at = pose.head(name, pose.standing(name));
        const from = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(resting.get(name)));
        const to = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(intended.get(name)));
        const transform = translation(at).multiply(new THREE.Matrix4().makeRotationFromQuaternion(from.slerp(to, ready))).multiply(translation(pose.rig.heads.get(name).clone().negate()));
        pose.setMove(name, transform);
    }
    const wrist = turn ?? new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(intended.get(names[2])));
    wristToward(pose, side, ready, wrist, resting.get(names[2]));
}

// A wrist turns about its own joint, preserving its scale and easing from the arm's current orientation.
function wristToward(pose, side, ready, turn, from = pose.matrix(`hand_${side}`)) {
    const hand = `hand_${side}`;
    const at = pose.head(hand, pose.standing(hand));
    const position = new THREE.Vector3();
    const rotation = new THREE.Quaternion();
    const scale = new THREE.Vector3();
    from.decompose(position, rotation, scale);
    const {x = 0, y = 0, z = 0} = turn;
    const wanted = turn.isQuaternion ? turn : new THREE.Quaternion().setFromRotationMatrix(euler(x, y, z));
    const transform = new THREE.Matrix4().compose(at, rotation.slerp(wanted, ready), scale).multiply(translation(pose.rig.heads.get(hand).clone().negate()));
    pose.setMove(hand, transform);
}

// Fingers turn toward their contact direction while the wrist finishes its approach.
function aimWristToward(pose, side, ready, direction) {
    const hand = `hand_${side}`;
    const from = pose.matrix(hand).clone();
    pose.aim(hand, direction);
    const aimed = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(pose.matrix(hand)));
    wristToward(pose, side, ready, aimed, from);
}

// A hand's contact point follows the posed head, with the rest of the hand and its prop kept outside the face.
function faceContactHand(pose, side, ready, contact, turn, offset, shoulder = 0) {
    if (!ready) return;
    const sign = SIDES[side];
    const head = pose.matrix("head");
    const rotation = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(head))
        .multiply(new THREE.Quaternion().setFromRotationMatrix(euler(turn.x ?? 0, turn.y ?? 0, turn.z ?? 0)));
    const target = new THREE.Vector3(sign * contact[0], contact[1], contact[2]).applyMatrix4(head)
        .sub(offset.clone().applyQuaternion(rotation));
    if (shoulder) pose.lift(`shoulder_${side}`, {z: shoulder * ready});
    restingFaceArm(pose, side);
    armToward(pose, side, ready, target, rotation, [1, -0.35, -0.6]);
    pose.inUse.add(side);
    pose.headContact = Math.max(pose.headContact, ready);
}

// A seated contact gesture leaves the same support hand that the posture restores when the gesture ends.
function restingFaceArm(pose, side) {
    restingPropArm(pose, side);
    if (pose.posture === "lounge") {
        const flat = new THREE.Vector3(SIDES[side] * LOUNGE.hands[0], LOUNGE.hands[1], LOUNGE.floor);
        handTo(pose, side, 1, pose.withinReach(side, flat, 0.97), new THREE.Vector3(0.6, 1, 0));
        pose.face(`hand_${side}`, {x: -80});
    } else if (pose.posture === "composed") {
        const sign = SIDES[side];
        const turned = Math.sign(signedTurn(pose.facing));
        const [x, y, z] = COMPOSED.feet;
        pose.step(side, new THREE.Vector3(sign * x, y, z), new THREE.Vector3(0, -1, 1));
        if (pose.leanWay && sign !== pose.leanWay) restOnKnee(pose, side);
        else if (pose.leanWay) handFlat(pose, side, COMPOSED.lean.out);
        else if (!turned || sign === turned) handFlat(pose, side, COMPOSED.hands[0]);
        else if (pose.head(`hand_${side}`, pose.matrix(`hand_${side}`)).z < COMPOSED.floor + COMPOSED.free) restOnKnee(pose, side);
    }
}

// The fingers cover the lower face, with the wrist below and the palm slightly clear of the shell.
function yawnHand(pose, side, ready) {
    const sign = SIDES[side];
    faceContactHand(pose, side, ready, [0.1, -1.0, 2.67], {y: -sign * 55, z: -sign * 110}, new THREE.Vector3(sign * HAND.grip, HAND.forward, 0));
}

// the most the head turns from the way the body faces, either side, in degrees; a look further round turns the body the rest of the way;
// and the most it tips, `down` and `up`, as a neck can, in degrees: a look steeper than that is looked at as far as the neck goes
export const HEAD_TURN = 65;
export const HEAD_TIP = {down: 35, up: 25};

// how far round, `yaw`, and how far down, `pitch`, in radians, the eyes look from where the head turns, to see `target`, a point in the
// figure's own axes (look.js lookAngles)
function lookAngle(pose, target) {
    const centre = pose.rig.eyes.reduce((sum, eye) => sum.add(eye), new THREE.Vector3()).divideScalar(pose.rig.eyes.length);
    const way = target.clone().sub(pose.head("head", pose.standing("head")));
    return lookAngles(way.x, -way.y, way.z, centre.z - pose.rig.heads.get("head").z);
}

// The head turned to look at `target`, `amount` of the way, never further round than HEAD_TURN from the body: it returns how many degrees
// further round the look is, which the body turns
function eyesToward(pose, target, amount = 1) {
    const looked = lookAngle(pose, target);
    const pitch = THREE.MathUtils.clamp(looked.pitch, radians(-HEAD_TIP.up), radians(HEAD_TIP.down));
    const yaw = THREE.MathUtils.radToDeg(looked.yaw);
    const turned = THREE.MathUtils.clamp(yaw, -HEAD_TURN, HEAD_TURN);
    pose.face("head", {x: THREE.MathUtils.radToDeg(pitch) * amount, z: turned * amount});
    pose.gaze = {target: target.toArray(), forward: READ_GAZE.forward};
    return (yaw - turned) * amount;
}


function read(pose, stance, t) {
    const frame = t * READ_FRAMES;
    const held = frame >= READING.intro && frame < READING.intro + READING.hold;
    const taking = frame < READING.intro ? frame : READ_FRAMES - 1 - frame;
    const ready = held ? 1 : rise(taking, 0, READING.ready);
    const open = held ? 1 : rise(taking, READING.ready, READING.opens);
    const phase = held ? (frame - READING.intro) % READING.pageEvery : 0;
    const page = held ? rise(phase, READING.pageFrom, READING.pageTo) : 0;
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
        const inward = THREE.MathUtils.radToDeg(Math.atan2(BOOK.closedGrip * (1 - open), BOOK.gripBack));
        armToward(pose, side, ready, target, {z: -sign * (READING.wristTurn + inward)}, READING.elbow);
    }
    const lineTime = phase / (READING.pageEvery / READING.lines);
    const line = Math.floor(lineTime);
    const along = lineTime - line;
    const returnAcross = rise(along, 0.7, 1);
    const across = rise(along, 0, 0.7) * (1 - returnAcross);
    const down = Math.min((line + returnAcross) / (READING.lines - 1), 1) * (line === READING.lines - 1 ? 1 - returnAcross : 1);
    const target = new THREE.Vector3(mix(-READ_GAZE.across, READ_GAZE.across, across), mix(READ_GAZE.top, READ_GAZE.bottom, down), -BOOK.pages).applyMatrix4(matrix);
    eyesToward(pose, toBlender(target), open);
    pose.holdBook(open, page, held || taking >= READING.ready);
    eyesAs(pose, "reading", open);
}

// The figure waits turned toward the compose box, tapping its foot, its arms hanging as they do standing idle, and whistles idly, swaying,
// toward the end of the round; the butler sways only while he whistles.
function waiting(pose, stance, t) {
    const {ready, phase} = waitTime(t);
    const butler = stance.voice === "butler";
    const tune = swell(phase, ...WAIT.whistleSpan) * ready;
    breathe(pose, 0);
    trunk(pose, {turn: ACTING.turn * ready, nod: -ACTING.nod * tune / 2, lean: ACTING.rock * waveOf(phase, WAIT.sways) * (butler ? tune : ready)});
    armsAtRest(pose, stance);
    pose.tap = ACTING.tap * Math.max(waveOf(phase, WAIT.beats), 0) * ready;
    if (pose.posture === "stand") pose.turn("foot_r", {x: pose.tap});
    if (tune) pose.shutEyes(1 - ACTING.whistleEyes * tune);
}

function yawn(pose, stance, t) {
    const {u, ready} = gestureTime(t, ACTING.yawnFrames);
    const side = freeSide(stance);
    breathe(pose, 0);
    trunk(pose, {lean: -ACTING.rock * ready, nod: -ACTING.nod * ready});
    armsAtRest(pose, stance);
    yawnHand(pose, side, ready);
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
    const mouthpiece = toBlender(new THREE.Vector3(...TOOLS.whistle.mouthAt).add(new THREE.Vector3(0, 0, -TOOLS.whistle.mouthpiece[2] / 2)))
        .applyMatrix4(euler(0, 0, SIDES[side] * 90));
    const contact = new THREE.Vector3(SIDES[side] * HAND.grip, HAND.forward, ACTING.whistleLift).add(mouthpiece);
    faceContactHand(pose, side, ready, [0.1, -0.96, 2.66], {z: -SIDES[side] * 90}, contact, 0.06);
    if (ready) pose.putAway(...IN_HAND, "coach_whistle");
    if (ready > 0.5) pose.holdProp("hand_whistle", side, [0, 0, ACTING.whistleLift], {z: SIDES[side] * 90});
    pose.shutEyes(1 - ACTING.whistleEyes * blast);
}

// The figure lies down on its back on the floor it stands on, its hands behind its head and a straw in its mouth, its near foot crossed over
// the other knee, whistling now and then with the crossed foot bobbing to the tune, and gets up again. Shares of the clip: lying down over
// `down`, getting up over `up`, and whistling in each of `tunes`. The back of the head rests on the hands at `pillow`, tipped `tilt` degrees
// back from upright, the head turned `glance` degrees toward the viewer so the eyes are seen, and the head laid `across` from where the
// figure stood, so the body lies in the middle of the picture.
export const REST = {
    frames: 120, fps: 8,
    down: [0, 0.1], up: [0.9, 1], tunes: [[0.3, 0.45], [0.62, 0.8]], beats: 40,
    pillow: [0, 1.0, 3.2], tilt: 72, across: -1.6,
    kneeUp: 60, kneeBend: 105, glance: 40, ankle: [-0.15, -0.15, -0.1], crossedKnee: [1, -0.4, 0.6], footBob: 18,
    wrist: [0.6, 0.55, 2.85], fingers: [-1, 0.4, 0.4], elbow: [1, -0.3, 0.8],
    straw: [0.14, -0.9, 0.4], strawTip: 115, strawWag: 8, eyes: 0.45, whistleEyes: 0.2,
};

// how far into a tune the clip is at u: a swell over each of REST.tunes, 0 between them
const tuneOf = (u) => REST.tunes.reduce((sum, [from, to]) => sum + swell(u, from, to), 0);

function rest(pose, stance, t) {
    const u = onceTime(t, REST.frames);
    const lying = rise(u, ...REST.down) * (1 - rise(u, ...REST.up));
    const tune = tuneOf(u);
    const tap = Math.max(waveOf(u, REST.beats), 0);
    breathe(pose, 0);
    armsAtRest(pose, stance, lying ? Object.keys(SIDES) : []);
    if (!lying) return;
    pose.putAway(...IN_HAND);
    trunk(pose, {turn: -REST.glance * lying});
    for (const [side, sign] of Object.entries(SIDES)) {
        const [x, y, z] = REST.wrist;
        restingPropArm(pose, side);
        armToward(pose, side, lying, new THREE.Vector3(sign * x, y, z), null, REST.elbow);
        const [across, forward, up] = REST.fingers;
        aimWristToward(pose, side, lying, new THREE.Vector3(sign * across, forward, up));
    }
    pose.turn("thigh_l", {x: -REST.kneeUp * lying});
    pose.bend("shin_l", REST.kneeBend * lying);
    const knee = pose.head("shin_l", pose.matrix("shin_l"));
    const resting = pose.head("foot_r", pose.standing("foot_r"));
    pose.step("r", resting.lerp(knee.add(new THREE.Vector3(...REST.ankle)), lying), new THREE.Vector3(...REST.crossedKnee));
    pose.turn("foot_r", {x: -REST.footBob * tune * tap});
    pose.wearProp("straw", REST.straw, {x: REST.strawTip + REST.strawWag * (1 + tune) * waveOf(u, 9)});
    const pillow = new THREE.Vector3(...REST.pillow);
    pose.turnAll({x: -REST.tilt * lying}, pillow);
    pose.turnAll({z: 90 * lying}, pillow);
    pose.offsetAll([REST.across * lying, -pillow.y * lying, -pillow.z * lying]);
    pose.shutEyes(mix(1, mix(REST.eyes, REST.whistleEyes, tune), lying));
}

// The near top rim of colleague_mug__cup in the supplied model's rest coordinates, converted from its GLB accessor bounds.
const MUG_NEAR_RIM = [1.781, -0.22, 2.360018];

function sipMotion(pose, stance, ready, tipped) {
    if (!ready) return;
    for (const side of stance.level) {
        const rim = new THREE.Vector3(SIDES[side] * MUG_NEAR_RIM[0], MUG_NEAR_RIM[1], MUG_NEAR_RIM[2]).sub(pose.rig.heads.get(`hand_${side}`));
        faceContactHand(pose, side, ready, [0.18, -0.96, 2.66], {y: -SIDES[side] * ACTING.sipTip * tipped, z: -SIDES[side] * 90}, rim);
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

function groove(pose, stance, t) {
    const u = onceTime(t, HEADPHONES.frames);
    const ready = rise(u, 0.35, 0.4) * (1 - rise(u, 0.6, 0.65));
    const beat = span(u, 0.35, 0.65);
    breathe(pose, 0);
    trunk(pose, {nod: ACTING.nod * waveOf(beat, ACTING.beats) * ready, tilt: ACTING.rock * waveOf(beat, ACTING.sways) * ready});
    armsAtRest(pose, stance);
    const grip = headphoneGrip(u);
    const contacts = headphoneContacts(headphonesAt(u, pose.moves(0)));
    for (const [index, side] of Object.keys(SIDES).entries()) {
        if (grip) pose.lift(`shoulder_${side}`, {x: SIDES[side] * 0.2 * grip, y: -0.18 * grip, z: 0.06 * grip});
        const contact = toBlender(contacts[index].at);
        const direction = toBlender(contacts[index].along).normalize();
        const fingers = pose.grip(side, [0, 0, 0]).sub(pose.rig.heads.get(`hand_${side}`));
        const wrist = contact.clone().addScaledVector(direction, -fingers.length());
        if (grip) {
            const shoulder = pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`));
            const reach = wrist.clone().sub(shoulder);
            const shift = reach.clone().setLength(reach.length() - Math.max(0.66, Math.min(0.94, reach.length()))).multiplyScalar(grip);
            pose.lift(`shoulder_${side}`, {x: shift.x, y: shift.y, z: shift.z});
        }
        restingFaceArm(pose, side);
        const rotation = new THREE.Quaternion().setFromUnitVectors(fingers.normalize(), direction);
        armToward(pose, side, grip, wrist, rotation, [1, 1, -1]);
        if (grip) pose.inUse.add(side);
    }
    pose.headphones = {u};
    pose.headContact = grip;
    pose.swing(waveOf(beat, ACTING.sways) * ready);
    pose.shutEyes(1 - ACTING.grooveEyes * ready);
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

// Squares a stack of papers, the sorting hand easing up from and back down to contact on each pass.
function compacting(pose, stance, t) {
    const {ready, phase} = heldTime(t);
    breathe(pose, 0);
    trunk(pose, {nod: ACTING.nod * ready});
    armsAtRest(pose, stance);
    propHand(pose, "l", ready, ACTING.wrist);
    propHand(pose, "r", ready, [ACTING.wrist[0] + ACTING.writeStroke * waveOf(phase, ACTING.sways), ACTING.wrist[1], ACTING.wrist[2] + ACTING.writeHeight * Math.max(waveOf(phase, ACTING.sways), 0) ** 2]);
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
    const sign = SIDES[side];
    faceContactHand(pose, side, ready, [1.0, -0.1, 3.5], {y: -sign * 117}, new THREE.Vector3(sign * HAND.grip, HAND.forward, 0), 0.32);
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

// One repeatable blow: a small preparation, an accelerating strike onto the parcel at `lands`, contact, rebound, then a slower lift.
export const WORK = {blows: 1, blowFrames: 8, fps: 10, lands: 0.3, prepare: 0.08, contact: 0.34, rebound: 0.46, poised: 0.94, bounce: 0.035, snap: 50, thumb: 90, roll: -90, fist: 0.62, turn: 80, strike: 0.432, landsAt: [0.72, -1.81]};

function blowOf(t) {
    const phase = ((t * WORK.blows) % 1 + 1) % 1;
    if (phase < WORK.prepare) return mix(WORK.poised, 1, ease(phase / WORK.prepare));
    if (phase < WORK.lands) return mix(1, WORK.strike, span(phase, WORK.prepare, WORK.lands) ** 2);
    if (phase < WORK.contact) return WORK.strike;
    if (phase < WORK.rebound) return WORK.strike + WORK.bounce * Math.sin(Math.PI * span(phase, WORK.contact, WORK.rebound)) ** 2;
    return mix(WORK.strike, WORK.poised, ease(span(phase, WORK.rebound, 1)));
}

// Where the blows land in the picture of a figure of `stance` hammering on its feet, as a share of the picture's width from its middle,
// toward the viewer's right
export function blowsLandAt(stance) {
    const sign = SIDES[freeSide(stance)];
    const [across, forward] = WORK.landsAt;
    const turn = radians(sign * WORK.turn);
    return (sign * across * Math.cos(turn) - forward * Math.sin(turn)) / FRAMED_HEIGHT;
}

// hammers away with a hammer in the free hand, the body dipping into each blow
function work(pose, stance, t) {
    const side = freeSide(stance);
    const raised = Math.max(blowOf(t), WORK.strike);
    const blow = 1 - raised;
    const phase = ((t * WORK.blows) % 1 + 1) % 1;
    const prepare = Math.sin(Math.PI * span(phase, 0, WORK.prepare)) ** 2;
    const settle = swell(phase, WORK.lands, WORK.rebound);
    crouch(pose, 0.04 * blow);
    breathe(pose, 0);
    trunk(pose, {lean: 8 + 6 * blow - 2 * prepare, nod: 9 + 2 * settle});
    armsAtRest(pose, stance, [side]);
    armTo(pose, side, 1, {y: mix(75, 5, raised), z: -35, bend: mix(15, 70, raised)});
    pose.roll(`forearm_${side}`, SIDES[side] * WORK.roll);
    pose.clench(side, WORK.fist);
    pose.holdProp("work_hammer", side, [0, 0, 0], {x: WORK.thumb, z: SIDES[side] * WORK.snap * blow});
    if (pose.posture === "stand") pose.revolve(SIDES[side] * WORK.turn);
}

// Inspecting the box it hammers (parcels.js INSPECT), so it reads at a glance: turned `turn` degrees toward the box, it takes the
// magnifying glass out over `out`, bends `bend` and leans `lean` degrees in toward the box, its head nodded `nod` degrees down at it, and
// holds the glass up between its eyes and the box as the viewer sees them, the lens `between` of the way from the eyes to the box's top at
// `box` (across, forward and up from the feet as it hammers, WORK landsAt) and the handle pointing back from it toward the eyes, as one
// looks through a magnifying glass; held `front` before the figure toward the viewer, as the box is drawn on the page behind it, and
// slanted, tipped `tip` and turned `slant` degrees from the viewer so its rim is skewed (glassOver), the turn against the roll that points
// the handle back at the eyes so the two add rather than undo each other, drawn `size` times its own size and
// its lens clear glass (glassOf). It sweeps the glass slowly
// `sweep` along the box and back over `along`, pauses over `pause` with a small nod `nodded` degrees deeper, and puts the glass away over
// `away`
export const INSPECTING = {
    frames: 60, fps: 12, out: [0, 0.08], along: [0.08, 0.76], pause: [0.76, 0.9], away: [0.92, 1],
    turn: 65, bend: 0.35, lean: 34, nod: 22, nodded: 10, box: [0.72, -1.81, 1.2], between: 0.5, front: -1.2, sweep: 0.4, size: 1.45,
    tip: 35, slant: -35,
};

// the top of the box the figure hammers, as the viewer sees the figure turned as it hammers (WORK turn), in the figure's units
export function boxSeen(sign) {
    const [across, forward, up] = INSPECTING.box;
    return new THREE.Vector3(sign * across, forward, up).applyAxisAngle(new THREE.Vector3(0, 0, 1), radians(sign * WORK.turn));
}

// The glass held over the box, as the viewer sees the figure, its eyes at `eyes`, swept `along` of its sweep: the middle of its lens,
// `between` of the way across and down from the eyes to the box's top and held `front` toward the viewer; and the way from the eyes to
// the box, across and up, which the glass is rolled to, its handle back toward the eyes
export function glassSeen(eyes, sign, along) {
    const box = boxSeen(sign);
    const way = new THREE.Vector3(box.x - eyes.x, 0, box.z - eyes.z).normalize();
    const lens = new THREE.Vector3(mix(eyes.x, box.x, INSPECTING.between) + INSPECTING.sweep * along, INSPECTING.front, mix(eyes.z, box.z, INSPECTING.between));
    return {lens, way};
}

// The magnifying glass held out over what the figure inspects (inspect, search), `k` of the way up from the hand hanging: its lens's middle
// at `lens` as the viewer sees the figure, the figure turned `turned` radians round from it; held slanted, so its rim is skewed from the
// viewer and it reads as a magnifying glass, tipped `tip` degrees about the figure's across axis, rolled `roll` in the viewer's plane and
// turned `slant` round about the up axis; the hand on `side` gripping its handle as far back from the lens as the glass is long; the
// glass drawn `size` times its size, its lens clear glass (glassOf)
function glassOver(pose, side, k, lens, turned, {tip, roll, slant, size}) {
    const up = new THREE.Vector3(0, 0, 1).applyMatrix4(euler(tip, roll, slant));
    const grip = lens.clone().addScaledVector(up, -(GLASS.handle / 2 + GLASS.radius) * size).applyAxisAngle(new THREE.Vector3(0, 0, 1), -turned);
    handTo(pose, side, k, pose.withinReach(side, pose.carried(grip), 0.97), new THREE.Vector3(...ACTING.elbow));
    pose.putAway(...IN_HAND);
    if (k <= 0.3) return;
    pose.holdUpright("magnifying_glass", side, [0, 0, 0], {x: tip, y: roll, z: slant - THREE.MathUtils.radToDeg(turned)});
    Object.assign(pose.props.get("magnifying_glass"), {magnifies: k, size, roll});
}

function inspect(pose, stance, t) {
    const side = freeSide(stance);
    const sign = SIDES[side];
    const ready = partOf(t, INSPECTING.out) * (1 - partOf(t, INSPECTING.away));
    const along = Math.sin(2 * Math.PI * span(t, ...INSPECTING.along));
    const nodded = swell(t, ...INSPECTING.pause);
    const up = new THREE.Vector3(0, 0, 1);
    const turned = radians(sign * INSPECTING.turn);
    crouch(pose, INSPECTING.bend * ready * ready);
    breathe(pose, 0);
    trunk(pose, {lean: INSPECTING.lean * ready, nod: (INSPECTING.nod + INSPECTING.nodded * nodded) * ready});
    armsAtRest(pose, stance, [side]);
    const eyes = pose.rig.eyes.reduce((sum, eye) => sum.add(eye), new THREE.Vector3()).divideScalar(pose.rig.eyes.length).applyMatrix4(pose.matrix("head"));
    const {lens, way} = glassSeen(eyes.applyAxisAngle(up, turned), sign, along);
    const roll = THREE.MathUtils.radToDeg(Math.atan2(way.x, way.z));
    glassOver(pose, side, ready, lens, turned, {tip: INSPECTING.tip, roll, slant: sign * INSPECTING.slant, size: INSPECTING.size});
    eyesAs(pose, "reading", ready);
    if (pose.posture === "stand") pose.revolve(sign * INSPECTING.turn);
}

// The figure stands still watching something in the sky, as the page says in `pose.sky`, its head turned to it by the look the page gives
// (lookToward): the free hand shading its eyes by `shade`, 0 to 1, as when what it watches is far off, the hand at the side of the visor
// and pointing out over it like a cap's peak; and stepped back by `back`, 0 to 1, with a small hop as it steps, leaning back to look up
export const SKY = {step: 0.6, hop: 0.12, lean: 8, shadeWrist: [1.18, -0.5, 2.72], shadeHand: [-0.35, -1, 0.2]};

// how far in front of the figure what it looks at in its picture is taken to be, or behind it on the page for a look `behind`; and that
// as a share of the picture's height
export const LOOK_DEPTH = -1.2;
export const LOOK_REACH = Math.abs(LOOK_DEPTH) / FRAMED_HEIGHT;
// how far down a figure's picture its head turns about, and how far above that its eyes are, as shares of the picture's height
export const headPivotOf = (figure) => 0.5 - (figure.rig.heads.get("head").z - FRAMED_MIDDLE) / FRAMED_HEIGHT;
export const eyesAboveOf = (figure) => (figure.rig.eyes.reduce((sum, eye) => sum + eye.z, 0) / figure.rig.eyes.length - figure.rig.heads.get("head").z) / FRAMED_HEIGHT;

// Reading recruits the upper body before the neck reaches its limit, with a small backward lean at the far end of a line.
export const READING_BODY = {start: 20, softness: 18, share: 0.7, turn: 74, lean: 7};

// Carry a reading turn through the spine and shoulders while the neck leads and the feet keep their place.
function readingToward(pose, at, point, facing) {
    const axis = new THREE.Vector3(0, 0, 1);
    const local = (value, turn = 0) => value.clone().applyAxisAngle(axis, radians(-(facing + turn)));
    const raw = THREE.MathUtils.radToDeg(lookAngle(pose, local(point)).yaw);
    const middle = point.clone();
    middle.x = ((at.readingCenter ?? at.x) - 0.5) * FRAMED_HEIGHT;
    const anchor = THREE.MathUtils.radToDeg(lookAngle(pose, local(middle)).yaw);
    const yaw = Number.isFinite(at.readingYaw) ? at.readingYaw + signedTurn((at.readingFacing ?? facing) - facing) : anchor + signedTurn(raw - anchor);
    const follow = Number.isFinite(at.readingFollow) ? at.readingFollow + signedTurn((at.readingFacing ?? facing) - facing) : yaw;
    const excess = Math.max(Math.abs(follow) - READING_BODY.start, 0);
    const wanted = Math.sign(follow) * READING_BODY.share * excess * excess / (excess + READING_BODY.softness);
    const shoulder = THREE.MathUtils.clamp(THREE.MathUtils.clamp(wanted, yaw - HEAD_TURN, yaw + HEAD_TURN), -READING_BODY.turn, READING_BODY.turn);
    const further = bodyTurnFor(pose.posture, yaw - shoulder - THREE.MathUtils.clamp(yaw - shoulder, -HEAD_TURN, HEAD_TURN), at.most);
    const amount = at.amount ?? 1;
    const carried = amount * amount;
    const turn = further * carried;
    trunk(pose, {twist: shoulder * carried, lean: -READING_BODY.lean * Math.min(Math.abs(shoulder) / READING_BODY.turn, 1) * carried});
    const own = pose.matrix("head").clone();
    const chest = yawOf(pose, "chest");
    const head = chest + THREE.MathUtils.clamp(yaw - turn - chest, -HEAD_TURN, HEAD_TURN);
    const target = local(point, turn);
    const pitch = Number.isFinite(at.readingPitch) ? radians(at.readingPitch) : THREE.MathUtils.clamp(lookAngle(pose, target).pitch, radians(-HEAD_TIP.up), radians(HEAD_TIP.down));
    pose.face("head", {x: THREE.MathUtils.radToDeg(pitch), z: head});
    if (amount < 1) pose.final.set("head", between(own, pose.matrix("head"), amount));
    pose.gaze = {target: target.toArray(), forward: READ_GAZE.forward};
    return turn;
}

// The head turned to look at `at`, a point in the figure's picture as shares of its width from the left and its height from the top, as
// the UFO it watches or the leading edge of a progress bar under its feet, in front of the figure, or `at.behind` it on the page, the
// figure turned `facing` degrees; `at.amount` of the way from
// the head as its clip has it, 0 to 1, as the look eases in and out. It returns how many degrees the body turns for a look further round
// than the head goes, the body following the head as the look eases in, so the head leads. A look that `at.faces` what it looks at, as at
// what it admires, turns the body the whole way round to it standing, the head then looking straight on at it, or no more than `at.most`
// degrees round when the look says so, the head turning the rest; seated the body turns as for any look (bodyTurnFor).
export function lookToward(pose, at, facing = 0) {
    const point = new THREE.Vector3((at.x - 0.5) * FRAMED_HEIGHT, at.behind ? -LOOK_DEPTH : LOOK_DEPTH, FRAMED_MIDDLE + (0.5 - at.y) * FRAMED_HEIGHT);
    if (at.behind && at.mood === "reading" && pose.posture !== "walk") return readingToward(pose, at, point, facing);
    const turnedBy = (turn) => point.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), radians(-(facing + turn)));
    const most = at.most ?? Infinity;
    const whole = at.faces && pose.posture === "stand" ? Math.min(Math.max(THREE.MathUtils.radToDeg(lookAngle(pose, turnedBy(0)).yaw), -most), most) : 0;
    const own = pose.matrix("head").clone();
    const further = whole + eyesToward(pose, turnedBy(whole));
    const amount = at.amount ?? 1;
    if (amount < 1) pose.final.set("head", between(own, pose.matrix("head"), amount));
    return further * amount * amount;
}

// a bone's move `k` of the way from `from` to `to`, turned and placed part way, as a head easing into or out of a look
function between(from, to, k) {
    const [a, b] = [from, to].map((move) => {
        const parts = {at: new THREE.Vector3(), turn: new THREE.Quaternion(), size: new THREE.Vector3()};
        move.decompose(parts.at, parts.turn, parts.size);
        return parts;
    });
    return new THREE.Matrix4().compose(a.at.lerp(b.at, k), a.turn.slerp(b.turn, k), a.size.lerp(b.size, k));
}

function watch(pose, stance, t) {
    const {shade, back} = pose.sky ?? {shade: 0, back: 0};
    pose.lift("root", {y: SKY.step * back, z: SKY.hop * Math.sin(Math.PI * back)});
    breathe(pose, t);
    trunk(pose, {lean: -SKY.lean * back});
    const side = freeSide(stance);
    armsAtRest(pose, stance, shade ? [side] : []);
    if (shade) {
        propHand(pose, side, shade, SKY.shadeWrist);
        const [across, forward, up] = SKY.shadeHand;
        const hand = `hand_${side}`;
        const now = pose.rig.along.get(hand).clone().transformDirection(pose.matrix(hand));
        pose.aim(hand, now.lerp(new THREE.Vector3(SIDES[side] * across, forward, up), shade));
        pose.putAway(...IN_HAND);
    }
}

// Pushes a parcel along in front of it as one pushes a heavy box: the back bent `lean` degrees forward from the hips, so the body leans
// in about a quarter of the way to flat, the knees giving by `drop` with a little strain, the feet stepping `behind` the hips, both arms
// out with the hands flat on the parcel's near side at `hands` from where its feet stand, a little over half way up it (it stands nearly
// as high as the figure's hips), and the head behind the hands, raised `nod` degrees against the lean so it looks ahead past the parcel
// and never down over its top, hardly turned by a look (its `head` holds it, looks.js HEAD). It turns to face the parcel before it leans in: the clip's first `turn` frames it stands upright while it turns, as long as the change of
// facing eases at its pace (places.js CHANGE_SECONDS), and over the rest of its `intro` it leans in; then it pushes, a stride a `stride`
// frames
export const SHOVE = {lean: 34, nod: -42, drop: 0.25, behind: 0.2, hands: [0.42, -1.3, 0.6], turn: 4, intro: 9, stride: 6, fps: 12};

// how far into the lean the push is at `t` of its frames, 0 upright while it turns and 1 leaning in
export function leanOf(t) {
    const frame = t * (SHOVE.intro + SHOVE.stride);
    return frame >= SHOVE.intro ? 1 : ease((frame - SHOVE.turn) / (SHOVE.intro - SHOVE.turn));
}

function push(pose, stance, t) {
    const k = leanOf(t);
    stride(pose, stance, pose.stride, pose.posture === "walk" ? 1 : 0, {lean: 0, drop: SHOVE.drop * k, behind: SHOVE.behind * k, bend: {nod: SHOVE.nod * k}});
    pose.bendAbove("spine", {x: SHOVE.lean * k});
    const [across, forward, up] = SHOVE.hands;
    for (const [side, sign] of Object.entries(SIDES)) {
        handTo(pose, side, k, pose.withinReach(side, new THREE.Vector3(sign * across, forward, up), 0.97), new THREE.Vector3(...ACTING.elbow));
        pose.face(`hand_${side}`, {z: -sign * 90 * k});
    }
    pose.putAway(...IN_HAND);
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
    pose.lift("root", {z: 0.1 * air - 0.28 * crouch});
    breathe(pose, 0);
    trunk(pose, {lean: 14 * crouch - 6 * air, nod: -4 * air});
    flung(pose, stance, 40 * crouch, 80 * rise(u, 0.26, 0.42) * (1 - 0.4 * rise(u, 0.6, 1)));
    fold(pose, 0.28 * crouch);
    tucked(pose, air);
}

const BACKFLIP_RAISE = 25;
const BACKFLIP_TURN = 360;

// The tucked flip turns around the large-headed figure's upper-body centre while the page carries its travel arc.
function backflip(pose, stance, t) {
    const u = onceTime(t, 22);
    const crouch = rise(u, 0, 0.26) * (1 - rise(u, 0.26, 0.34));
    const turn = rise(u, 0.3, 0.86);
    const air = rise(u, 0.28, 0.4) * (1 - rise(u, 0.86, 0.95));
    pose.lift("root", {z: 0.1 * air - 0.28 * crouch});
    breathe(pose, 0);
    trunk(pose, {lean: 12 * crouch});
    flung(pose, stance, 30 * crouch, BACKFLIP_RAISE * air);
    fold(pose, 0.28 * crouch);
    tucked(pose, 1.2 * air);
    const centre = pose.head("chest", pose.matrix("chest")).lerp(pose.head("neck", pose.matrix("neck")), 0.75);
    centre.z += 0.05;
    pose.turnAll({x: BACKFLIP_TURN * turn}, centre);
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
    const u = onceTime(t, LANDING.frames);
    const dip = rise(u, 0, 0.2) * (1 - rise(u, 0.2, 1));
    pose.lift("root", {z: -0.32 * dip});
    breathe(pose, 0);
    trunk(pose, {lean: 16 * dip, nod: 8 * dip});
    flung(pose, stance, 0, 38 * dip);
    fold(pose, 0.32 * dip);
}

// The squire brakes at the bug, turns on the spot, then returns along the same path with the quill leading. The page carries the
// canvas along the chase; the local travel stays small enough to keep the quill and outstretched hand inside it.
function squire_chase(pose, stance, t) {
    const u = onceTime(t, 24);
    const reach = CHASE_REACH * (u < 0.5 ? rise(u, 0, 0.5) : 1 - rise(u, 0.5, 1));
    const turning = swell(u, 0.4, 0.6);
    const motion = u === 0 || u === 1 ? 0 : ease(Math.sin(Math.PI * u)) * (1 - 0.85 * turning);
    const facing = 90 * rise(u, 0, 0.12) - 180 * rise(u, 0.4, 0.6) + 90 * rise(u, 0.88, 1);
    const quill = heldUp(stance);
    stride(pose, stance, 4 * u, motion, {running: true, lean: 12, apart: quill});
    quill.forEach((side) => armTo(pose, side, motion, SQUIRE_QUILL));
    pose.revolve(facing);
    pose.offsetAll([reach, 0, 0]);
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
    hatLift: 0.12, hatTip: 4, hatFingers: 0.37, hatShoulder: [0.15, -0.7, 0.15], hatBow: 24, hatNod: 18, hatGripAngle: 30,
    monocleWrist: [0.55, -0.8, 2.62], monocleWorn: [0.354, -0.95, 0.66], monoclePeer: 8, monocleTilt: 9,
    toastWrist: [0.78, -0.72, 2.55], toastClink: 0.12, sipWrist: [0.42, -0.78, 2.38], sipTip: 20,
    shakaWrist: [1.22, -0.25, 2.72], shakaWaggle: 28, shakaWaggles: 3,
    shadesWrist: [0.5, -0.82, 2.55], shadesWorn: [0, -0.96, 0.66], shadesLean: 7, shadesTilt: 10,
    fireWrist: [0.48, -0.86, 2.28], fireSize: 2.4,
    thumbWrist: [0.62, -0.84, 2.3],
    glassesWrist: [0.32, -0.8, 2.47], peerLean: 12, peerTurn: 18,
    prayerWrist: [0.12, -0.62, 2.0], prayerRoll: 180, thanksBow: 14,
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
    propHand(pose, side, k, target, {x: -60, ...turn});
}

// straight up, at rest
const UP = new THREE.Vector3(0, 0, 1);

// The butler grips the front quarter of the curled brim, clear of his ear, lifts it, then tips about that contact during a shallow bow.
// The hollow crown clears the head, and the fingers stay on the real brim as it lifts and returns.
function hat_tip(pose, stance, t) {
    const {u} = reacting(t);
    const ready = rise(u, 0, 0.2) * (1 - rise(u, 0.86, 1));
    const side = freeSide(stance);
    const lifted = rise(u, 0.22, 0.32) * (1 - rise(u, 0.74, 0.84));
    const tipped = rise(u, 0.34, 0.46) * (1 - rise(u, 0.6, 0.72));
    const bow = rise(u, 0.06, 0.2) * (1 - rise(u, 0.86, 1));
    breathe(pose, 0);
    trunk(pose, {lean: REACTING.hatBow * bow, nod: REACTING.hatNod * bow});
    const [out, forward, raise] = REACTING.hatShoulder;
    pose.lift(`shoulder_${side}`, {x: SIDES[side] * out * ready, y: (forward + 0.1 * (1 - lifted)) * ready, z: raise * ready * (0.45 + 0.55 * lifted)});
    armsAtRest(pose, stance, ready ? [side] : []);
    const {at, turn, grip} = hatHeld(pose, side, lifted, tipped);
    if (ready) {
        restingPropArm(pose, side);
        const fingers = pose.grip(side, [REACTING.hatFingers, 0, 0]).sub(pose.rig.heads.get(`hand_${side}`));
        const direction = new THREE.Vector3(-SIDES[side] * 0.2, 0.3, 1).transformDirection(pose.matrix("head"));
        const wrist = grip.clone().addScaledVector(direction, -fingers.length());
        const rotation = new THREE.Quaternion().setFromUnitVectors(fingers.normalize(), direction);
        armToward(pose, side, ready, wrist, rotation, [1, -2, -0.4]);
    }
    pose.headContact = ready;
    if (lifted || tipped) {
        const head = pose.matrix("head").clone().invert();
        at.add(handGrip(pose, side, [REACTING.hatFingers, 0, 0]).applyMatrix4(head)).sub(grip.clone().applyMatrix4(head));
        pose.putAway("butler_top_hat", "butler_top_hat_band");
        pose.wearProp("top_hat", at.sub(pose.rig.heads.get("head")).toArray(), turn);
    }
    eyesAs(pose, "amused", bow);
}

// The front quarter of the actual curled rim, halfway through its thickness, in the hat's own space.
function hatBrimContact(side) {
    const angle = radians(REACTING.hatGripAngle);
    const radius = BUTLER.hat.crown + BUTLER.hat.brim;
    return new THREE.Vector3(SIDES[side] * radius * Math.cos(angle), -radius * Math.sin(angle), BUTLER.hat.curl * Math.cos(angle) ** 2 + BUTLER.hat.thick / 2);
}

// The hat's rigid transform about the gripped outer brim, in the head's rest space; its contact point carried into the posed body.
function hatHeld(pose, side, lifted, tipped) {
    const edge = hatBrimContact(side);
    const turn = {y: SIDES[side] * REACTING.hatTip * tipped};
    const base = new THREE.Vector3(0, 0, BUTLER.hat.base + REACTING.hatLift * lifted);
    const at = base.clone().add(edge).sub(edge.clone().applyMatrix4(euler(0, turn.y, 0)));
    const grip = base.add(edge).applyMatrix4(pose.matrix("head"));
    return {at, turn, grip};
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

// any voice presses its hands together before its chest, fingers up, and gives a small bow, eyes closed: thanks
function thanks(pose, stance, t) {
    const {u, ready} = reacting(t);
    const bow = swell(u, 0.25, 0.8);
    breathe(pose, 0);
    trunk(pose, {lean: REACTING.thanksBow * bow, nod: 10 * bow});
    armsAtRest(pose, stance, ready ? Object.keys(SIDES) : []);
    if (ready) pose.putAway(...IN_HAND);
    for (const [side, sign] of Object.entries(SIDES)) {
        propHand(pose, side, ready, REACTING.prayerWrist, {x: REACTING.prayerRoll, y: -sign * 90, z: 0});
    }
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
    propHand(pose, side, ready, REACTING.castleWrist, {x: -30});
    if (ready) pose.putAway("squire_quill");
    if (ready > 0.4) {
        pose.holdUpright("castle", side, [0, 0, 0.12]);
        keepCarrying(pose);
    }
    eyesAs(pose, "amused", bow);
}

// The journal moments and the searches the figure acts out (acts.js ACTS), what it holds and what grows beside it drawn by the page at its
// free hand and its feet (chat/FigureAct.vue). The wrist places, against the body at rest with the free hand's side outward: held up high,
// the sign held up, at
// the drawer, at the binoculars before the eyes, the flashlight held out, and down at the corner of the floor while it crouches `crouch`
export const ACTED = {
    high: [1.0, -0.25, 2.92],
    sign: [0.5, -0.25, 3.0], signWaggle: 0.1,
    drawer: [1.16, -0.4, 1.66], drop: 0.12, binoculars: [0.24, -0.8, 2.36], sweep: 30, nozzle: [1.1, -0.55, 1.88], torchSweep: 0.16,
    corner: [1.0, -0.42, 1.36], lift: 0.3, crouch: 0.6, peekLean: 34,
}

// the free hand's place between the wrist places `from` and `to`, `k` of the way
const between3 = (from, to, k) => from.map((n, index) => mix(n, to[index], k));

// what the free hand carries put away while it holds what the page draws in it, the busy hand keeping its own
const emptyHand = (pose) => pose.putAway(...[...IN_HAND].filter((item) => !BUSY_ITEMS.has(item)));

// the free hand carried `ready` of the way from hanging to the wrist place `at`, the other arm at rest
function actHand(pose, stance, ready, at, turn = {}) {
    const side = freeSide(stance);
    armsAtRest(pose, stance, ready ? [side] : []);
    propHand(pose, side, ready, at, turn);
    if (ready) emptyHand(pose);
}

// The calling pose and grip, in figure units and degrees. The shared glove's measured support point `fingertip` touches the dial at
// `dialTilt`; the wrist is solved from that surface contact. `palm` includes the handle's crown and the glove's depth, while `grip`
// closes the fingers. The receiver grille follows the side of the bare head and the handset lifts along `arc`.
export const CALL = {bend: 0.8, pickupBend: 0.4, lean: 30, nod: 18, talkNod: 5, ear: [0.94, 0.05, 3.48], handsetLean: 50, tilt: 8, finger: 0.742, fingertip: [0.733867, -0.000944, 0.006280], dialTilt: 20, restWrist: 40, palm: 0.38, grip: 0.68, across: 0.2, arc: [-0.065, 0.035, 0.35], seatedArc: [0.2, -0.155, -0.005], turn: 105};

// a point on the telephone, `local` in its own axes (across, back, up from the middle of its base), the base standing at `base` in the
// figure's, the whole telephone tipped `tip` degrees toward the viewer so its dial shows
export function onPhoneAt(local, base, turn = 0) {
    return local.clone().applyMatrix4(euler(TELEPHONE.tip, 0, turn)).add(base);
}

// A tilted finger touches the visible hole at its measured support point, with the rest of the glove outside the dial face.
function dialFingerAt(side, hole, turn) {
    const normal = fromSet(new THREE.Vector3(0, 1, 0).transformDirection(dialFrame())).transformDirection(euler(TELEPHONE.tip, 0, turn));
    const along = normal.clone().negate().multiplyScalar(SIDES[side]);
    const up = new THREE.Vector3(0, 0, 1).projectOnPlane(along).normalize();
    const rotation = new THREE.Matrix4().makeBasis(along, up.clone().cross(along), up).multiply(euler(0, SIDES[side] * CALL.dialTilt, 0));
    const [x, y, z] = CALL.fingertip;
    const contact = new THREE.Vector3(SIDES[side] * x, y, z).applyMatrix4(rotation);
    return {normal, rotation, wrist: hole.clone().sub(contact)};
}

function fingerIn(pose, side, k, hole, turn, chestTilt) {
    const {normal, rotation, wrist} = dialFingerAt(side, hole, turn);
    const elbow = new THREE.Vector3(1, -0.7, -0.1);
    callHandTo(pose, side, 0, wrist, elbow);
    const hand = `hand_${side}`;
    if (!k) {
        callWristFromSeat(pose, side, 0);
        return;
    }
    // Keep the wrist's starting turn at the upright entry pose. Taking it from the bent torso every frame can reverse a shortest
    // quaternion turn as it crosses 180 degrees. The hand aims before the final approach and stays aimed until clear on withdrawal.
    const reference = new Posing(pose.rig);
    breathe(reference, 0);
    reference.bendAbove("chest", {y: chestTilt});
    callHandTo(reference, side, 0, wrist, elbow);
    const start = new THREE.Quaternion().setFromRotationMatrix(pose.posture === "composed" ? euler(-80, 0, 0) : new THREE.Matrix4().extractRotation(reference.matrix(hand)));
    const shoulder = pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`));
    const from = pose.head(hand, pose.matrix(hand)).sub(shoulder);
    const target = pose.withinReach(side, wrist, 0.999).sub(shoulder);
    const length = mix(from.length(), target.length(), k);
    const direction = from.normalize();
    const travel = new THREE.Quaternion().setFromUnitVectors(direction, target.normalize());
    // A spherical reach stays outside the shoulder's folded limit; the small normal bow keeps the fingers above the dial surface.
    const atTarget = shoulder.clone().add(direction.applyQuaternion(new THREE.Quaternion().slerp(travel, k)).multiplyScalar(length)).addScaledVector(normal, 0.15 * Math.sin(Math.PI * k));
    const restPole = pose.posture === "composed" ? new THREE.Vector3(1, 0.3, 0) : HANGING_ELBOW.clone();
    pose.reach(side, pose.withinReach(side, atTarget, 0.999), restPole.lerp(elbow, k));
    const at = pose.head(hand, pose.matrix(hand));
    const finish = new THREE.Quaternion().setFromRotationMatrix(rotation);
    const turned = new THREE.Matrix4().makeRotationFromQuaternion(start.slerp(finish, callLift(k, [0, 0.8])));
    pose.final.set(hand, translation(at).multiply(turned).multiply(translation(pose.rig.heads.get(hand).clone().negate())));
}

// The reaching hand rises outside the telephone before crossing above it; replacement retraces that arc.
function callHandTo(pose, side, ready, target, elbow) {
    const shoulder = pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`));
    const resting = pose.posture === "composed" ? pose.withinReach(side, callRestingHand(pose, side), 0.97) : shoulder.clone().add(new THREE.Vector3(SIDES[side] * Math.cos(radians(HANG)), 0, -Math.sin(radians(HANG))).multiplyScalar(HANG_REACH));
    const restPole = pose.posture === "composed" ? new THREE.Vector3(1, 0.3, 0) : HANGING_ELBOW.clone();
    if (ready === 0 || ready === 1) {
        pose.reach(side, pose.withinReach(side, ready ? target : resting, 0.999), ready ? elbow : restPole);
        return;
    }
    // Interpolate radius separately, so the wrist cannot cross the shoulder's folded limit. Sampling distance along this spherical
    // arc also prevents a speed spike where a normalised straight interpolation would pass close to the shoulder.
    const from = resting.sub(shoulder), to = target.clone().sub(shoulder);
    const length = mix(from.length(), to.length(), ready);
    const first = from.normalize();
    const way = first.clone();
    const travel = new THREE.Quaternion().setFromUnitVectors(way, to.normalize());
    const course = new THREE.CatmullRomCurve3([first.clone(), new THREE.Vector3(SIDES[side] * 0.7, -0.35, 0.7).normalize(), to.clone()]);
    const sphere = new THREE.Curve();
    sphere.getPoint = (u) => course.getPoint(u).normalize();
    way.copy(sphere.getPointAt(ready));
    const at = shoulder.clone().addScaledVector(way, length);
    // Transport the elbow's bend plane with the reach, then twist it to its final plane. Blending raw poles can pass through zero
    // after projection and flip the elbow, even while the wrist moves continuously.
    const mirror = (vector) => new THREE.Vector3(SIDES[side] * vector.x, vector.y, vector.z);
    const initial = mirror(restPole).projectOnPlane(first).normalize();
    const finish = mirror(elbow).projectOnPlane(to).normalize();
    const atEnd = initial.clone().applyQuaternion(travel);
    const twist = Math.atan2(to.dot(atEnd.clone().cross(finish)), atEnd.dot(finish));
    const bend = initial.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(first, way)).applyAxisAngle(way, twist * ready);
    pose.reach(side, pose.withinReach(side, at, 0.999), mirror(bend));
}

// A turned or leaning seated figure rests its free hand on its knee and its supporting hand on the floor.
function callRestingHand(pose, side) {
    const sign = SIDES[side];
    const supporting = pose.leanWay || Math.sign(signedTurn(pose.facing));
    if (supporting && sign !== supporting) {
        const [x, y, z] = COMPOSED.feet;
        pose.step(side, new THREE.Vector3(sign * x, y, z), new THREE.Vector3(0, -1, 1));
        return pose.head(`shin_${side}`, pose.matrix(`shin_${side}`)).add(new THREE.Vector3(...COMPOSED.lean.knee));
    }
    const across = pose.leanWay ? COMPOSED.lean.out : COMPOSED.hands[0];
    return new THREE.Vector3(sign * across, COMPOSED.hands[1], COMPOSED.floor);
}

// The seated palm turns away from its support gradually, without a wrist flip at the first reach.
function callWristFromSeat(pose, side, ready) {
    if (pose.posture !== "composed" || ready >= 1) return;
    const hand = `hand_${side}`;
    const wrist = pose.head(hand, pose.matrix(hand));
    const resting = new THREE.Quaternion().setFromRotationMatrix(euler(-80, 0, 0));
    const held = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(pose.matrix(hand)));
    const turn = new THREE.Matrix4().makeRotationFromQuaternion(resting.slerp(held, ready));
    pose.final.set(hand, translation(wrist).multiply(turn).multiply(translation(pose.rig.heads.get(hand).clone().negate())));
}

// a point in the telephone's own axes (y up, its front +z) in the figure's (z up, its front -y)
const fromSet = (point) => new THREE.Vector3(point.x, -point.z, point.y);

// where the dial sits in the telephone's own axes: its middle on the middle of the front face, from the face's foot to its brow, and its
// axis out of the face, as a matrix from the dial's own axes (its face up its y)
function dialFrame() {
    const {base} = TELEPHONE;
    const [foot, brow] = [[base.depth / 2, 0], base.brow];
    const out = new THREE.Vector2(brow[1], foot[0] - brow[0]).normalize();
    const middle = new THREE.Vector3(0, (foot[1] + brow[1]) / 2, (foot[0] + brow[0]) / 2).add(new THREE.Vector3(0, out.y, out.x).multiplyScalar(bulge()));
    return new THREE.Matrix4().compose(middle, new THREE.Quaternion().setFromEuler(new THREE.Euler(Math.atan2(out.x, out.y), 0, 0)), new THREE.Vector3(1, 1, 1));
}

// how far the body's rounding swells out of its side outline, and how high its domed top is `across` from the middle
const bulge = () => TELEPHONE.base.round * 0.8;
const crownAt = (across) => TELEPHONE.base.height + bulge() + TELEPHONE.base.dome * Math.max(1 - (across / (TELEPHONE.base.width / 2)) ** 2, 0);

// where the handset's middle rests across the cradle's prongs, in the figure's axes against the telephone
const cradled = () => fromSet(new THREE.Vector3(0, crownAt(TELEPHONE.cradle.apart) + TELEPHONE.cradle.height + TELEPHONE.handset.rest, TELEPHONE.cradle.at));

// The right hand takes the symmetric receiver by the opposite end. Turning about its own vertical swaps the ends without
// changing the resting shape; the tipped cradle's Euler turn therefore reverses its tip as well as adding half a turn of yaw.
function cradledTurn(side, turn) {
    const flipped = side === "r";
    return {x: flipped ? -TELEPHONE.tip : TELEPHONE.tip, z: turn + (flipped ? 180 : 0)};
}

// a point `turned` degrees round the dial from its first hole, on the ring of holes, just over the dial's face, in the figure's axes
// against the telephone
export function dialHole(turned) {
    const {dial} = TELEPHONE;
    const angle = radians(dial.first - turned);
    return fromSet(new THREE.Vector3(Math.cos(angle) * dial.ring, dial.face * 1.75 + 0.003, -Math.sin(angle) * dial.ring).applyMatrix4(dialFrame()));
}

// the handset held at the ear on `side`: its long axis, ear cup up, leaning back from upright, and its cups' mouths toward the head, as
// the turn its prop takes (figure.js euler, degrees about x, y and z) and that axis
function handsetAtEar(side) {
    const sign = SIDES[side];
    const up = Math.sqrt(1 - CALL.across ** 2);
    const along = new THREE.Vector3(sign * CALL.across, up * Math.sin(radians(CALL.handsetLean)), up * Math.cos(radians(CALL.handsetLean)));
    const outward = new THREE.Vector3(sign, 0, 0).projectOnPlane(along).normalize();
    const basis = new THREE.Matrix4().makeBasis(along, outward.clone().cross(along), outward);
    const turn = new THREE.Euler().setFromRotationMatrix(basis, "ZYX");
    return {along, basis, turn: {x: THREE.MathUtils.radToDeg(turn.x), y: THREE.MathUtils.radToDeg(turn.y), z: THREE.MathUtils.radToDeg(turn.z)}};
}

// The centres of the actual cup grilles, including the outward tilt of their bulbs.
const handsetGrille = (sign) => new THREE.Vector3(sign * (TELEPHONE.handset.length / 2 + TELEPHONE.handset.end[1] * TELEPHONE.handset.grille * Math.sin(0.22)), 0, -TELEPHONE.handset.drop - TELEPHONE.handset.end[1] * TELEPHONE.handset.grille * Math.cos(0.22));

// A handset leaves and meets its cradle with no sudden acceleration.
function callLift(u, phase) {
    const k = span(u, ...phase);
    return k ** 3 * (10 - 15 * k + 6 * k * k);
}

// The telephone's way in and out at `u` of the call (acts.js phone_call): whether it is there, how far above the floor it is drawn and how it
// squashes, and how far through a poof of smoke it is at its place, if one bursts. It is there whole from the first frame, `above` the
// floor in the burst of its poof; it drops onto the floor over `drop`, gathering speed, and settles over `settle`, squashing `squash` flat
// as it lands and wobbling `wobbles` times smaller each time to still; it goes in the middle of the poof it leaves in, over `goes`
export function phoneArrival(u) {
    const act = ACTS.phone_call;
    const fell = span(u, ...act.drop);
    const settling = span(u, ...act.settle);
    const wobble = settling > 0 && settling < 1 ? Math.sin(Math.PI * act.wobbles * settling) ** 3 * (1 - settling) ** 2 : 0;
    const leaving = span(u, ...act.goes);
    const arriving = span(u, ...act.poof);
    return {
        here: leaving < 0.5,
        above: act.above * (1 - callLift(fell, [0, 1])),
        squash: act.squash * wobble,
        puff: u >= act.goes[0] ? leaving : arriving < 1 ? 0.3 + 0.7 * arriving : null,
    };
}

// Both postures pick up, dial, talk and replace the handset along the same eased phases. The seated set faces the reaching hand.
function phone_call(pose, stance, t) {
    if (pose.posture !== "stand") return seatedCall(pose, stance, t);
    const side = freeSide(stance);
    const base = new THREE.Vector3(SIDES[side] * TELEPHONE.at[0], TELEPHONE.at[1], 0);
    callAt(pose, stance, onceTime(t, ACTS.phone_call.frames), side, base, -SIDES[side] * CALL.turn);
}

// The set stands beside and behind the hip. A small lean lets the far hand reach its inward-facing dial.
function seatedCall(pose, stance, t) {
    pose.kneesTogether();
    const {beside, behind, turn} = ACTS.phone_call.seated;
    const side = phoneHand(pose.facing, pose.phoneWay) > 0 ? "l" : "r";
    const base = new THREE.Vector3(SIDES[side] * beside, behind, POSTURES[pose.posture].drop * FRAMED_HEIGHT);
    callAt(pose, stance, onceTime(t, ACTS.phone_call.frames), side, base, -SIDES[side] * turn);
}

function callAt(pose, stance, u, side, base, turn) {
    const act = ACTS.phone_call;
    const standing = pose.posture === "stand";
    const dialler = side === "l" ? "r" : "l";
    const restBend = Math.max(
        callLift(u, act.reach) * (1 - callLift(u, act.lift)),
        callLift(u, [act.hang[0], (act.hang[0] + act.hang[1]) / 2]) * (1 - callLift(u, [act.hang[1], act.goes[0]])),
    );
    const finger = callLift(u, act.finger) * (1 - callLift(u, act.back));
    const bent = Math.max(restBend, finger);
    const lifted = callLift(u, act.lift) * (1 - callLift(u, act.hang));
    const talking = span(u, ...act.talk);
    // The high cradle needs only a shallow bend; reaching the lower dial uses the deeper crouch.
    const down = standing ? Math.max(CALL.pickupBend * restBend, CALL.bend * finger) : 0;
    const reach = callLift(u, act.reach) * (1 - callLift(u, [act.hang[1], act.goes[0]]));
    crouch(pose, down);
    breathe(pose, 0);
    trunk(pose, {lean: standing ? CALL.lean * bent : -act.seated.backLean * bent * (1 - finger), nod: (standing ? CALL.nod * bent : 0) + CALL.talkNod * Math.sin(Math.PI * act.nods * talking) ** 2, tilt: SIDES[side] * CALL.tilt * lifted});
    if (!standing) {
        const supported = pose.posture === "composed" ? pose.leanWay * COMPOSED.lean.tilt * reach : 0;
        pose.bendAbove("spine", {y: SIDES[side] * act.seated.lean * finger - supported});
    }
    const chestTilt = SIDES[side] * (stance.voice === "butler" ? 1.2 : 2);
    pose.bendAbove("chest", {y: chestTilt * lifted});
    const hole = onPhoneAt(dialHole(act.turn * partOf(u, act.dial)), base, turn);
    if (standing && finger > 0) {
        pose.lift("root", {y: -dialStep(pose.rig, side, hole, turn, chestTilt) * finger});
        for (const foot of Object.keys(SIDES)) {
            pose.step(foot, pose.rig.heads.get(`foot_${foot}`).clone(), new THREE.Vector3(0, -1, 0));
            pose.face(`foot_${foot}`, {});
        }
    }
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, [side, dialler]);
    if (!standing) {
        pose.inUse.add(side);
        if (finger > 0) pose.inUse.add(dialler);
    }
    const inHand = u >= act.reach[1] && u < act.hang[1];
    const mouth = handsetHand(pose, side, {base, turn, reach, lifted, inHand});
    const spring = [mix(act.back[0], act.back[1], act.release), act.back[1]];
    const turned = act.turn * partOf(u, act.dial) * (1 - partOf(u, spring));
    fingerIn(pose, dialler, finger, hole, turn, chestTilt);
    // While crouching to the cradle, the idle wrist folds up so its fingers stay above the floor.
    if (standing && restBend) pose.turn(`hand_${dialler}`, {y: -SIDES[dialler] * CALL.restWrist * restBend});
    eyesAs(pose, "amused", talking > 0 && talking < 1 ? 1 : 0);
    phoneProps(pose, {u, base, turn, root: pose.carried(new THREE.Vector3()), side, inHand, mouth, turned});
}

// The standing hips move forward only far enough for a bent arm to reach each hole; the feet stay planted.
function dialStep(rig, side, hole, turn, chestTilt) {
    const reference = new Posing(rig);
    reference.lift("root", {z: -CALL.bend});
    breathe(reference, 0);
    trunk(reference, {lean: CALL.lean, nod: CALL.nod, tilt: SIDES[side] * CALL.tilt});
    reference.bendAbove("chest", {y: chestTilt});
    const dialler = side === "l" ? "r" : "l";
    const shoulder = reference.head(`upper_arm_${dialler}`, reference.standing(`upper_arm_${dialler}`));
    const {wrist} = dialFingerAt(dialler, hole, turn);
    const [upper, lower, hand] = ["upper_arm", "forearm", "hand"].map((name) => rig.heads.get(`${name}_${dialler}`));
    const reach = (upper.distanceTo(lower) + lower.distanceTo(hand)) * 0.98;
    const across = (shoulder.x - wrist.x) ** 2 + (shoulder.z - wrist.z) ** 2;
    return Math.max(0, shoulder.y - wrist.y - Math.sqrt(Math.max(0, reach ** 2 - across)));
}

// The cord attaches to the outside of the mouthpiece, away from the gripping hand.
const handsetMouth = () => new THREE.Vector3(-TELEPHONE.handset.length / 2 - TELEPHONE.handset.end[0], 0, -TELEPHONE.handset.drop - TELEPHONE.handset.end[1] * 0.45);

// Carry the elbow's bend plane between the wrist directions at each receiver pose. Interpolating the original world-space poles
// instead can pass through the reach axis, making the elbow reverse while the wrist remains continuous.
function handsetElbow(side, first, current, last, fromPole, toPole, k) {
    const mirror = (vector) => new THREE.Vector3(SIDES[side] * vector.x, vector.y, vector.z);
    const initial = mirror(fromPole).projectOnPlane(first).normalize();
    const finish = mirror(toPole).projectOnPlane(last).normalize();
    const atEnd = initial.clone().applyQuaternion(new THREE.Quaternion().setFromUnitVectors(first, last));
    const twist = Math.atan2(last.dot(atEnd.clone().cross(finish)), atEnd.dot(finish));
    const bend = initial.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(first, current)).applyAxisAngle(current, twist * k);
    return mirror(bend);
}

// The receiver's long axis rises first; its outward direction follows that axis before twisting to the final grip. This keeps the
// mouthpiece below the hand while a seated caller stands the receiver upright and then tips it toward the ear.
function seatedHandsetTurn(rest, held, lifted) {
    const first = new THREE.Vector3(1, 0, 0).transformDirection(rest);
    const last = new THREE.Vector3(1, 0, 0).transformDirection(held);
    const travel = new THREE.Quaternion().setFromUnitVectors(first, last);
    const moving = new THREE.Quaternion().slerp(travel, lifted);
    const axis = first.clone().applyQuaternion(moving);
    const outside = new THREE.Vector3(0, 0, 1).transformDirection(rest);
    const atEnd = outside.clone().applyQuaternion(travel);
    const finish = new THREE.Vector3(0, 0, 1).transformDirection(held);
    const twist = Math.atan2(last.dot(atEnd.clone().cross(finish)), atEnd.dot(finish));
    const normal = outside.applyQuaternion(moving).applyAxisAngle(axis, twist * lifted);
    return new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(axis, normal.clone().cross(axis), normal));
}

// The hand on `side` taking the handset off the cradle of the telephone standing at `base`, `reach` of the way to it, and holding it
// `lifted` of the way to the ear, the palm behind the grip and the hand running up along the handset once it is `inHand`: the handset held
// there, and where its mouthpiece is, for the cord
function handsetHand(pose, side, {base, turn: phoneTurn, reach, lifted, inHand}) {
    const standing = pose.posture === "stand";
    const atEar = handsetAtEar(side);
    const [x, y, z] = CALL.ear;
    const ear = new THREE.Vector3(SIDES[side] * x, y, z).applyMatrix4(pose.matrix("head"));
    const heldTurn = new THREE.Matrix4().extractRotation(pose.matrix("head")).multiply(atEar.basis);
    const held = ear.clone().sub(handsetGrille(1).applyMatrix4(heldTurn));
    const rest = onPhoneAt(cradled(), base, phoneTurn);
    const cradleTurn = cradledTurn(side, phoneTurn);
    const restTurn = euler(cradleTurn.x, 0, cradleTurn.z);
    // Seated, first turn the receiver upright, keeping its mouthpiece and cord below the hand, then bring the upper cup to the ear.
    // Each half eases to rest at that upright pose, without concentrating the turn into the middle of the already eased lift.
    const upright = new THREE.Matrix4().makeBasis(new THREE.Vector3(0, 0, 1), new THREE.Vector3(1, 0, 0), new THREE.Vector3(0, 1, 0));
    const half = lifted < 0.5 ? rise(lifted, 0, 0.5) : rise(lifted, 0.5, 1);
    const rotation = standing ? new THREE.Quaternion().setFromRotationMatrix(restTurn).slerp(new THREE.Quaternion().setFromRotationMatrix(heldTurn), lifted) : lifted < 0.5 ? seatedHandsetTurn(restTurn, upright, half) : seatedHandsetTurn(upright, heldTurn, half);
    const turn = new THREE.Matrix4().makeRotationFromQuaternion(rotation);
    const outward = new THREE.Vector3(0, 0, 1).applyQuaternion(rotation);
    const arc = Math.sin(Math.PI * lifted) ** 2;
    const [across, back, up] = standing ? CALL.arc : CALL.seatedArc;
    const origin = rest.clone().lerp(held, lifted).add(new THREE.Vector3(SIDES[side] * across, back, up).multiplyScalar(arc));
    // Roll the palm around the handle toward its shoulder at mid-lift, leaving space between the forearm and the lower cup.
    const phi = radians((standing ? SIDES[side] * 15 * (1 - lifted) - SIDES[side] * 15 * arc : -SIDES[side] * 30 * arc) - SIDES[side] * 30 * lifted);
    const normal = outward.clone().multiplyScalar(Math.cos(phi)).addScaledVector(new THREE.Vector3(0, 1, 0).applyQuaternion(rotation), Math.sin(phi));
    const palmOffset = outward.clone().multiplyScalar(0.06).addScaledVector(normal, CALL.palm - 0.06);
    const palm = origin.clone().add(palmOffset);
    const shoulder = pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`));
    const angleAt = (frame, place, roll) => {
        const axis = new THREE.Vector3(1, 0, 0).transformDirection(frame);
        const out = new THREE.Vector3(0, 0, 1).transformDirection(frame);
        const n = out.clone().multiplyScalar(Math.cos(roll)).addScaledVector(new THREE.Vector3(0, 1, 0).transformDirection(frame), Math.sin(roll));
        const point = place.clone().addScaledVector(out, 0.06).addScaledVector(n, CALL.palm - 0.06).sub(shoulder);
        return Math.atan2(point.dot(n.clone().cross(axis)), point.dot(axis));
    };
    // Stable end angles avoid the wrist reversing when its projected direction passes through zero during the lift.
    const from = angleAt(restTurn, rest, 0);
    const to = angleAt(heldTurn, held, -SIDES[side] * radians(30));
    const difference = Math.atan2(Math.sin(to - from), Math.cos(to - from));
    const angle = from + difference * lifted;
    const axis = new THREE.Vector3(1, 0, 0).applyQuaternion(rotation);
    const fingers = axis.clone().multiplyScalar(Math.cos(angle)).addScaledVector(normal.clone().cross(axis), Math.sin(angle));
    const hand = `hand_${side}`;
    const closed = ease(span(reach, 0.65, 1));
    const share = mix(1, CALL.grip, closed);
    const acrossHand = fingers.clone().multiplyScalar(SIDES[side]);
    const handTurn = new THREE.Matrix4().makeBasis(acrossHand, normal.clone().cross(acrossHand), normal);
    const offset = new THREE.Vector3(SIDES[side] * HAND.grip * share, HAND.forward, 0).applyMatrix4(handTurn);
    const target = palm.clone().sub(offset);
    let elbow = new THREE.Vector3(1, -0.65 + arc, mix(-0.1, -0.12, lifted) + 0.5 * arc);
    if (!standing) {
        // The three bend planes are anchored to the same physical wrist contacts as the receiver path, including the rolled palm.
        const wristAt = (frame, place, roll, alongAngle) => {
            const axis = new THREE.Vector3(1, 0, 0).transformDirection(frame);
            const out = new THREE.Vector3(0, 0, 1).transformDirection(frame);
            const n = out.clone().multiplyScalar(Math.cos(roll)).addScaledVector(new THREE.Vector3(0, 1, 0).transformDirection(frame), Math.sin(roll));
            const fingers = axis.clone().multiplyScalar(Math.cos(alongAngle)).addScaledVector(n.clone().cross(axis), Math.sin(alongAngle));
            const across = fingers.multiplyScalar(SIDES[side]);
            const basis = new THREE.Matrix4().makeBasis(across, n.clone().cross(across), n);
            return place.clone().addScaledVector(out, 0.06).addScaledVector(n, CALL.palm - 0.06).sub(new THREE.Vector3(SIDES[side] * HAND.grip * share, HAND.forward, 0).applyMatrix4(basis));
        };
        const middle = rest.clone().lerp(held, 0.5).add(new THREE.Vector3(SIDES[side] * across, back, up));
        const firstDirection = wristAt(restTurn, rest, 0, from).sub(shoulder).normalize();
        const middleDirection = wristAt(upright, middle, -SIDES[side] * radians(45), from + difference * 0.5).sub(shoulder).normalize();
        const lastDirection = wristAt(heldTurn, held, -SIDES[side] * radians(30), to).sub(shoulder).normalize();
        const currentDirection = target.clone().sub(shoulder).normalize();
        const firstPole = new THREE.Vector3(1, -0.65, -0.1);
        const middlePole = new THREE.Vector3(2, -1.15, -1.11);
        const lastPole = new THREE.Vector3(1, -0.65, -0.12);
        elbow = lifted < 0.5
            ? handsetElbow(side, firstDirection, currentDirection, middleDirection, firstPole, middlePole, half)
            : handsetElbow(side, middleDirection, currentDirection, lastDirection, middlePole, lastPole, half);
    }
    callHandTo(pose, side, reach, pose.withinReach(side, target, 0.999), elbow);
    const wrist = pose.head(hand, pose.matrix(hand));
    // As with the dialling hand, use the upright entry turn rather than a changing IK turn. Aim the palm before its final approach
    // to the handle, and keep that turn until the hand is clear on withdrawal.
    const reference = new Posing(pose.rig);
    breathe(reference, 0);
    callHandTo(reference, side, 0, target, elbow);
    const start = new THREE.Quaternion().setFromRotationMatrix(pose.posture === "composed" ? euler(-80, 0, 0) : new THREE.Matrix4().extractRotation(reference.matrix(hand)));
    const finish = new THREE.Quaternion().setFromRotationMatrix(handTurn);
    const heldHand = new THREE.Matrix4().makeRotationFromQuaternion(start.slerp(finish, callLift(reach, [0, 0.7])));
    pose.final.set(hand, translation(wrist).multiply(heldHand).multiply(translation(pose.rig.heads.get(hand).clone().negate())));
    pose.clench(side, share);
    if (!inHand) return rest.clone().add(handsetMouth().applyMatrix4(restTurn));
    const grip = pose.grip(side, [0, 0, 0]).applyMatrix4(pose.matrix(hand)).sub(palmOffset);
    const angles = new THREE.Euler().setFromQuaternion(rotation, "ZYX");
    pose.holdUpright("telephone_handset", side, [0, 0, 0], {x: THREE.MathUtils.radToDeg(angles.x), y: THREE.MathUtils.radToDeg(angles.y), z: THREE.MathUtils.radToDeg(angles.z)});
    pose.props.get("telephone_handset").at = grip.clone().applyMatrix4(pose.matrix(hand).clone().invert());
    return grip.add(handsetMouth().applyMatrix4(turn));
}

// The telephone at `u` of the call, its base standing at `base` in the figure's axes, `root` how far the root has moved from its place at
// rest: whole from the first frame, dropping in out of its poof and settling, gone in the poof it leaves in; its dial turned `turned`
// degrees, the handset on its cradle unless it is `inHand`, and its coiled cord from the base's side to the mouthpiece at `mouth`
function phoneProps(pose, {u, base, turn, root, side, inHand, mouth, turned}) {
    const act = ACTS.phone_call;
    const on = (local) => onPhoneAt(local, base, turn).sub(root);
    const arrival = phoneArrival(u);
    const scale = new THREE.Vector3(1 + arrival.squash / 2, 1 + arrival.squash / 2, 1 - arrival.squash);
    const lift = new THREE.Vector3(0, 0, arrival.above);
    const cradle = cradled().multiply(scale);
    const resting = cradledTurn(side, turn);
    if (!inHand) pose.standProp("telephone_handset", on(cradle).add(lift).toArray(), resting);
    const poof = arrival.puff ?? 0;
    if (poof > 0 && poof < 1) {
        pose.standProp("telephone_poof", on(new THREE.Vector3(0, 0, TELEPHONE.base.height / 2 + (u < act.goes[0] ? act.above : 0))).toArray());
        Object.assign(pose.props.get("telephone_poof"), {puff: poof});
    }
    if (!arrival.here) {
        pose.props.delete("telephone_handset");
        return;
    }
    pose.standProp("telephone", on(new THREE.Vector3()).add(lift).toArray(), {x: TELEPHONE.tip, z: turn});
    Object.assign(pose.props.get("telephone"), {squash: arrival.squash, dial: turned});
    // The cord prop cancels the root translation; its endpoints are already in the figure's fixed coordinates.
    pose.standProp("telephone_cord", root.clone().negate().toArray());
    const from = onPhoneAt(new THREE.Vector3(-TELEPHONE.base.width * 0.5 * (1 - TELEPHONE.base.narrow * 0.3), 0.18, TELEPHONE.base.height * 0.3).multiply(scale), base, turn).add(lift);
    const to = inHand ? mouth : onPhoneAt(cradle, base, turn).add(handsetMouth().applyMatrix4(euler(resting.x, 0, resting.z))).add(lift);
    const aside = new THREE.Vector3(SIDES[side] * (Math.max(Math.abs(from.x), Math.abs(to.x)) + 0.45), Math.min(from.y, to.y) - 0.12, Math.min(from.z, to.z) - 0.22);
    Object.assign(pose.props.get("telephone_cord"), {from, to, aside});
}

// raises a sign with a question mark on a stick high over its head and waggles it
function ask_sign(pose, stance, t) {
    const act = ACTS.ask_sign;
    const u = onceTime(t, act.frames);
    const up = partOf(u, act.raise) * (1 - partOf(u, act.lower));
    const waggle = waveOf(span(u, ...act.waggle), act.waggles) * swell(u, ...act.waggle);
    const [x, y, z] = ACTED.sign;
    breathe(pose, 0);
    trunk(pose, {nod: -10 * up, tilt: 4 * waggle});
    actHand(pose, stance, up, [x + ACTED.signWaggle * waggle, y, z]);
    eyesAs(pose, "worried", up);
}

// Where the scroll is held, against the body at rest: the rollers' middle `at` before the chest, low enough for the eyes to show over its
// top edge, each hand `across` from the middle toward its own side, the rollers `closed` apart in height while it is rolled and `apart`
// once it is open; and the head reading it, nodded `nod` degrees down into it and `lineNod` more for each line below, turned slowly from
// `scan` degrees to its own left to as far to its right over the first `sweep` of a line, and back for the next
export const SCROLL = {at: [0, -0.74, 2.02], across: 0.4, closed: 0.08, apart: 0.64, elbow: [1, 0.4, -0.6], nod: 16, lineNod: 4, scan: 12, sweep: 0.6};

// brings the rolled scroll up before its chest, pulls its two rollers apart between its hands, the free hand's above, reads it down line
// by line with its head going slowly along each, and rolls it closed between its hands again
function scroll(pose, stance, t) {
    const act = ACTS.scroll;
    const u = onceTime(t, act.frames);
    const ready = partOf(u, act.raise) * (1 - partOf(u, act.lower));
    const open = partOf(u, act.unrolls) * (1 - partOf(u, act.rolls));
    const read = span(u, act.unrolls[1], act.rolls[0]);
    breathe(pose, 0);
    trunk(pose, {lean: 3 * ready});
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, ready ? Object.keys(SIDES) : []);
    const top = freeSide(stance);
    const [x, y, z] = SCROLL.at;
    for (const [side, sign] of Object.entries(SIDES)) {
        const height = z + ((side === top ? 1 : -1) * mix(SCROLL.closed, SCROLL.apart, open)) / 2;
        const spot = new THREE.Vector3(x + sign * SCROLL.across, y, height);
        if (ready) handTo(pose, side, ready, pose.withinReach(side, pose.carried(spot), 0.97), new THREE.Vector3(...SCROLL.elbow));
    }
    const line = Math.min(Math.floor(read * act.lines), act.lines - 1);
    const along = read * act.lines - line;
    const turn = SCROLL.scan * (1 - 2 * partOf(along, [0, SCROLL.sweep]) + 2 * partOf(along, [SCROLL.sweep, 1]));
    const down = Math.min(line + partOf(along, [SCROLL.sweep, 1]), act.lines - 1);
    pose.face("head", {x: (SCROLL.nod + SCROLL.lineNod * down) * open, z: turn * open});
    eyesAs(pose, "reading", open);
    if (ready) holdScroll(pose, top, ready === 1 ? (top === "l" ? "r" : "l") : null, open);
}

// The report scroll (REPORT_SCROLL) in the hands as they are posed: its top roller gripped toward one end by the hand on `top`, its bottom
// roller toward the other end by the hand on `bottom`, the scroll centred between the two hands; or rolled up just under the top one in
// that hand alone while `bottom` is none; unrolled `open` of the way
function holdScroll(pose, top, bottom, open) {
    const grip = (side) => pose.grip(side, [0, 0, 0]).applyMatrix4(pose.matrix(`hand_${side}`));
    const upper = grip(top);
    const lower = bottom ? grip(bottom) : upper.clone().add(new THREE.Vector3(0, 0, -REPORT_SCROLL.rolled));
    const middle = upper.clone().add(lower).multiplyScalar(0.5);
    if (bottom) upper.x = lower.x = middle.x;
    const root = pose.matrix("root").clone().invert();
    pose.standProp("report_scroll", middle.clone().applyMatrix4(root).toArray());
    Object.assign(pose.props.get("report_scroll"), {top: upper.sub(middle), bottom: lower.sub(middle), open});
}

// reaches down to the drawer slid out of the cabinet beside it and drops a card into it
function file_card(pose, stance, t) {
    const act = ACTS.file_card;
    const u = onceTime(t, act.frames);
    const out = partOf(u, act.reach) * (1 - partOf(u, act.back));
    const [x, y, z] = ACTED.drawer;
    breathe(pose, 0);
    trunk(pose, {lean: 10 * out, nod: 14 * out});
    actHand(pose, stance, out, [x, y, z - ACTED.drop * partOf(u, act.filed)]);
}

// how far into the box the packed figure sinks, below the floor where the page hides it
const PACKED = {sink: 2.1, hop: 0.75, leap: 1.0};

// hops up into the box grown at its feet and sinks down in it, and once the compaction is over jumps out of it, arms up
function pack_box(pose, stance, t) {
    const act = ACTS.pack_box;
    const {into, out} = heldPhases(act, t);
    const hop = swell(into, ...act.hop);
    const sunk = partOf(into, act.into) * (1 - partOf(out, [act.pops, act.pops + 0.2]));
    const leap = swell(out, ...act.leap);
    pose.lift("root", {z: PACKED.hop * hop - PACKED.sink * sunk + PACKED.leap * leap});
    breathe(pose, 0);
    trunk(pose, {lean: 6 * hop, nod: 12 * sunk - 10 * leap});
    flung(pose, stance, 0, 60 * hop + 120 * leap);
    tucked(pose, 0.7 * hop + 0.6 * leap);
    pose.putAway(...IN_HAND);
    eyesAs(pose, "amused", leap);
}

// holds up the press coming down on its head with both hands, eyes squeezed shut while it is squashed, and lets go as it lifts
function press(pose, stance, t) {
    const act = ACTS.press;
    const {into, out} = heldPhases(act, t);
    const up = partOf(into, [0.2, 0.55]) * (1 - partOf(out, [0.2, 0.5]));
    breathe(pose, 0);
    trunk(pose, {nod: -8 * up});
    flung(pose, stance, 0, 140 * up);
    pose.putAway(...IN_HAND);
    pose.shutEyes(1 - 0.8 * partOf(into, act.squashes) * (1 - partOf(out, act.frees)));
}

// holds the vacuum's nozzle out low beside it, sweeping it a little, as the words fly into it
function vacuum(pose, stance, t) {
    const {held, into, out} = heldPhases(ACTS.vacuum, t);
    const [x, y, z] = ACTED.nozzle;
    breathe(pose, 0);
    trunk(pose, {lean: 8, nod: 14, turn: -SIDES[freeSide(stance)] * 14});
    actHand(pose, stance, into * (1 - out), [x, y, z - 0.12 * waveOf(held ?? 0, 2)], {x: -10});
}

// Eager for the bar under its feet to end: its feet tapping fast over the intro, then pointing down at the bar with the free hand, bouncing
// Eager for the bar under its feet to end, wild with it as a child is: its feet tapping fast over the intro, then both free hands pointing
// down at the bar, bouncing and wiggling, and all the while its eyes sparkling stars
export const EAGERNESS = {intro: 18, hold: 12, outro: 6, fps: 12, taps: 6, tap: 18, point: [1.25, -0.45, 1.75], bounce: 0.14, wiggle: 7, sparkle: 0.25};

function eager(pose, stance, t) {
    const {intro, hold, outro, taps, tap, point, bounce, wiggle, sparkle} = EAGERNESS;
    const frame = t * (intro + hold + outro);
    const tapping = frame < intro ? Math.sin((Math.PI * frame) / intro) : 0;
    const pointing = frame < intro ? rise(frame / intro, 0.7, 1) : 1 - rise((frame - intro - hold) / outro, 0, 1);
    const held = frame >= intro && frame < intro + hold ? (frame - intro) / hold : null;
    const bob = held === null ? 0 : Math.sin(2 * Math.PI * held) ** 2;
    const beat = waveOf(frame / intro, taps);
    pose.lift("root", {z: bounce * bob});
    breathe(pose, 0);
    trunk(pose, {lean: 6 * pointing, nod: 14 * pointing + 4 * bob, twist: wiggle * (held === null ? tapping * beat : waveOf(held, 2))});
    if (pose.posture === "stand") {
        pose.turn("foot_l", {x: tap * tapping * Math.max(beat, 0)});
        pose.turn("foot_r", {x: tap * tapping * Math.max(-beat, 0)});
    }
    armsAtRest(pose, stance, pointing ? [...stance.free] : []);
    for (const side of stance.free) propHand(pose, side, pointing, [point[0], point[1], point[2] + 0.1 * bob * SIDES[side]], {x: 40});
    if (pointing) emptyHand(pose);
    const glow = Math.min(frame / 4, 1) * (1 - span(frame, intro + hold, intro + hold + outro));
    pose.starEyes(glow * (1 + sparkle * Math.abs(waveOf(frame / 6))));
}

const TANTRUM_POSES = {butler: butler_tantrum, homie: homie_tantrum, coach: coach_tantrum, colleague: colleague_tantrum, squire: squire_tantrum};

// The same failure has a different performance in each voice.
function tantrum(pose, stance, t) {
    (TANTRUM_POSES[stance.voice] ?? colleague_tantrum)(pose, stance, t);
}

const BUTLER_TANTRUM = {floor: [-1.38, -0.72, 0.04], lift: 0.42, aside: 0.65};

// He throws the hat clear, hops beside it, then crouches to grasp the brim before lifting it back onto his head.
function butlerTantrumBody(pose, u) {
    const ready = rise(u, 0, 0.1) * (1 - rise(u, 0.94, 1));
    const bow = rise(u, 0, 0.12) * (1 - rise(u, 0.26, 0.34)) + rise(u, 0.78, 0.84) * (1 - rise(u, 0.96, 1));
    const pickup = rise(u, 0.6, 0.7) * (1 - rise(u, 0.72, 0.84));
    const mad = rise(u, 0.31, 0.34) * (1 - rise(u, 0.6, 0.64));
    const hop = Math.sin(Math.PI * ACTS.tantrum.hops * span(u, 0.34, 0.6)) ** 2;
    const aside = rise(u, 0.22, 0.28) * (1 - rise(u, 0.78, 0.85));
    const acrossHop = Math.sin(Math.PI * span(u, 0.22, 0.34)) ** 2 + Math.sin(Math.PI * span(u, 0.78, 0.85)) ** 2;
    const depth = 0.42 * bow * bow + 0.04 * mad * (1 - hop) + 0.65 * pickup * pickup;
    const lifted = 0.42 * hop + 0.12 * acrossHop;
    pose.lift("root", {x: BUTLER_TANTRUM.aside * aside, z: lifted - depth});
    breathe(pose, 0);
    trunk(pose, {lean: 10 * bow + 7 * mad + 30 * pickup, nod: 8 * bow + 10 * mad + 12 * pickup, tilt: 2 * mad * waveOf(u, 18)});
    stepLeg(pose, "l", 0, lifted + 0.05 * hop, lifted - depth);
    stepLeg(pose, "r", 0, lifted + 0.05 * hop, lifted - depth);
    return {ready, bow, pickup, mad, hop};
}

// An upright hat lands on its brim. Its free flight stays to the side of the face, with a small bounce on impact.
function butlerTantrumHat(pose, u) {
    const reference = new Posing(pose.rig, "stand", 0);
    butlerTantrumBody(reference, 0.18);
    const high = reference.matrix("head").clone().multiply(new THREE.Matrix4().makeTranslation(0, 0, BUTLER.hat.base + BUTLER_TANTRUM.lift));
    const outside = high.clone();
    outside.elements[12] = BUTLER_TANTRUM.floor[0];
    const floor = new THREE.Matrix4().makeTranslation(...BUTLER_TANTRUM.floor).multiply(euler(0, 0, 180));
    if (u < 0.18) {
        const lifted = REACTING.hatLift * rise(u, 0.12, 0.18);
        return pose.matrix("head").clone().multiply(new THREE.Matrix4().makeTranslation(0, 0, BUTLER.hat.base + lifted));
    }
    if (u < 0.22) {
        const lifted = mix(REACTING.hatLift, BUTLER_TANTRUM.lift, rise(u, 0.18, 0.22));
        return reference.matrix("head").clone().multiply(new THREE.Matrix4().makeTranslation(0, 0, BUTLER.hat.base + lifted));
    }
    if (u < 0.26) return between(high, outside, rise(u, 0.22, 0.26));
    if (u < 0.34) return between(outside, floor, rise(u, 0.26, 0.34));
    if (u < 0.72) {
        floor.elements[14] += 0.07 * Math.sin(Math.PI * span(u, 0.34, 0.39)) ** 2;
        return floor;
    }
    const liftedFloor = floor.clone();
    liftedFloor.elements[14] = 0.6;
    if (u < 0.75) return between(floor, liftedFloor, rise(u, 0.72, 0.75));
    const beside = new THREE.Matrix4().makeTranslation(-1.3, -0.6, 2.7).multiply(euler(0, -90, 0));
    if (u < 0.81) {
        const lifted = between(liftedFloor, beside, rise(u, 0.75, 0.81));
        lifted.elements[12] += 0.09 * Math.sin(Math.PI * span(u, 0.75, 0.81)) ** 2;
        return lifted;
    }
    const raised = beside.clone();
    raised.elements[14] = 3.55;
    if (u < 0.85) return between(beside, raised, rise(u, 0.81, 0.85));
    if (u < 0.91) {
        const placed = pose.matrix("head").clone().multiply(new THREE.Matrix4().makeTranslation(0, 0, BUTLER.hat.base + BUTLER_TANTRUM.lift));
        return between(raised, placed, rise(u, 0.85, 0.91));
    }
    const lifted = BUTLER_TANTRUM.lift * (1 - rise(u, 0.91, 0.96));
    return pose.matrix("head").clone().multiply(new THREE.Matrix4().makeTranslation(0, 0, BUTLER.hat.base + lifted));
}

function butler_tantrum(pose, stance, t) {
    const u = onceTime(t, ACTS.tantrum.frames);
    const {ready, mad, hop} = butlerTantrumBody(pose, u);
    const side = freeSide(stance);
    const retrieving = u >= 0.6;
    const grip = rise(u, 0, 0.12) * (1 - rise(u, 0.18, 0.26)) + rise(u, 0.6, 0.7) * (1 - rise(u, 0.96, 1));
    const lifted = u < 0.5 ? rise(u, 0.12, 0.18) : 1 - rise(u, 0.9, 0.96);
    const hat = butlerTantrumHat(pose, u);
    armsAtRest(pose, stance, Object.keys(SIDES));
    for (const hand of Object.keys(SIDES)) {
        armTo(pose, hand, 0, {});
        if (mad) armToward(pose, hand, mad, pose.carried(new THREE.Vector3(SIDES[hand] * 1.05, -0.6, 1.7 + 0.18 * hop)), {z: -SIDES[hand] * 30}, [1, 0.2, -1]);
        pose.clench(hand, 1 - 0.32 * mad);
    }
    if (grip) {
        const [out, forward, raise] = REACTING.hatShoulder;
        const shoulder = grip * (retrieving ? rise(u, 0.76, 0.88) : 1);
        const extraReach = rise(u, 0.83, 0.89) * (1 - rise(u, 0.91, 0.96));
        pose.lift(`shoulder_${side}`, {x: SIDES[side] * out * shoulder, y: (forward + 0.1 * (1 - lifted)) * shoulder - 0.12 * extraReach, z: raise * shoulder * (0.45 + 0.55 * lifted) + 0.24 * extraReach});
        const contact = retrieving ? hatBrimContact(side).applyMatrix4(hat) : hatHeld(pose, side, lifted, 0).grip;
        if (!retrieving) restingPropArm(pose, side);
        const fingers = pose.grip(side, [REACTING.hatFingers, 0, 0]).sub(pose.rig.heads.get(`hand_${side}`));
        let direction = new THREE.Vector3(-SIDES[side] * 0.2, 0.3, 1).transformDirection(pose.matrix("head"));
        if (retrieving) {
            const toward = contact.clone().sub(pose.head(`upper_arm_${side}`, pose.matrix(`upper_arm_${side}`))).normalize();
            const turn = new THREE.Quaternion().setFromUnitVectors(toward, direction);
            direction = toward.applyQuaternion(new THREE.Quaternion().slerp(turn, rise(u, 0.87, 0.91)));
        }
        const wrist = contact.clone().addScaledVector(direction, -fingers.length());
        if (retrieving) {
            const shoulder = pose.head(`upper_arm_${side}`, pose.matrix(`upper_arm_${side}`));
            const near = pose.foldedReach(side) + 0.02;
            if (wrist.distanceTo(shoulder) < near) {
                const along = contact.clone().sub(shoulder), distance = along.length();
                along.normalize();
                const reach = (near * near + distance * distance - fingers.lengthSq()) / (2 * distance);
                const pole = new THREE.Vector3(0, -1, 0).addScaledVector(along, along.y).normalize();
                wrist.copy(shoulder).addScaledVector(along, reach).addScaledVector(pole, Math.sqrt(Math.max(0, near * near - reach * reach)));
                direction = contact.clone().sub(wrist).normalize();
            }
        }
        const rotation = new THREE.Quaternion().setFromUnitVectors(fingers.normalize(), direction);
        armToward(pose, side, grip, wrist, rotation, [1, -2, -0.4]);
        if (retrieving && u >= 0.7 && u <= 0.96) {
            const held = pose.grip(side, [REACTING.hatFingers, 0, 0]).applyMatrix4(pose.matrix(`hand_${side}`));
            const correction = held.sub(contact);
            hat.elements[12] += correction.x;
            hat.elements[13] += correction.y;
            hat.elements[14] += correction.z;
        }
    }
    pose.headContact = ready;
    if (u > 0.12 && u < 0.96) {
        const held = u < 0.18 || u >= 0.91;
        const frame = held ? "head" : u >= 0.7 ? `hand_${side}` : "root";
        const local = pose.matrix(frame).clone().invert().multiply(hat);
        const at = new THREE.Vector3(), rotation = new THREE.Quaternion(), scale = new THREE.Vector3();
        local.decompose(at, rotation, scale);
        const turn = new THREE.Euler().setFromQuaternion(rotation, "ZYX");
        const angles = {x: THREE.MathUtils.radToDeg(turn.x), y: THREE.MathUtils.radToDeg(turn.y), z: THREE.MathUtils.radToDeg(turn.z)};
        pose.props.set("top_hat", {bone: frame, frame, at, turn: angles, ...(held ? {} : {returnMode: "toss"})});
        pose.putAway("butler_top_hat", "butler_top_hat_band");
    }
    eyesAs(pose, "angry", ready);
}

// crushed by the bar it was eager for failing, slumped and looking down, then mad about it: stamping one foot and the other, fists
// clenched at its sides, shaking, its eyes red
function fume(pose, stance, t) {
    const act = ACTS.fume;
    const u = onceTime(t, act.frames);
    const crushed = swell(u, act.crushed[0], act.crushed[1] + 0.06);
    const mad = partOf(u, [act.mad[0], act.mad[0] + 0.06]) * (1 - partOf(u, [act.mad[1] - 0.1, 1]));
    const stamp = waveOf(span(u, ...act.mad), act.stamps / 2);
    crouch(pose, 0.14 * crushed);
    pose.lift("root", {z: 0.12 * mad * Math.abs(stamp)});
    breathe(pose, 0);
    trunk(pose, {lean: 16 * crushed + 6 * mad, nod: 28 * crushed + 10 * mad, tilt: 5 * mad * waveOf(u, 14)});
    armsAtRest(pose, stance, [...stance.free]);
    for (const side of stance.free) {
        armTo(pose, side, mad, {y: 40, z: -25, bend: 95});
        pose.clench(side, 1 - 0.28 * mad);
    }
    if (pose.posture === "stand") {
        for (const [side, sign] of [["l", 1], ["r", -1]]) {
            const up = mad * Math.max(sign * stamp, 0);
            pose.turn(`thigh_${side}`, {x: -34 * up, y: sign * 18 * up});
            pose.turn(`shin_${side}`, {x: 52 * up});
        }
    }
    if (crushed > mad) eyesAs(pose, "worried", crushed);
    else eyesAs(pose, "angry", mad);
}

const tantrumBeat = (u, from, to) => swell(u, from, to) ** 2;

// Each foot comes back flat to its own place. The small knee bend keeps the supporting sole planted through the stamping.
function tantrumFeet(pose, ready, left, right, depth = 0.045, spread = 0) {
    if (pose.posture !== "stand") {
        pose.swing(0.5 * (left - right));
        return;
    }
    const drop = depth * ready * ready;
    pose.lift("root", {z: -drop});
    for (const [side, height] of [["l", left], ["r", right]]) {
        stepLeg(pose, side, 0, height, -drop);
        if (spread) {
            pose.turn(`thigh_${side}`, {y: SIDES[side] * spread * height});
            pose.face(`foot_${side}`, {});
        }
    }
}

// An expansive palms-up protest, then four impatient stamps out to alternating sides.
function homie_tantrum(pose, stance, t) {
    const u = onceTime(t, ACTS.tantrum.frames);
    const ready = rise(u, 0.02, 0.12) * (1 - rise(u, 0.86, 1));
    const protest = rise(u, 0.06, 0.18) * (1 - rise(u, 0.36, 0.48));
    const shake = waveOf(span(u, 0.12, 0.4), 3) * tantrumBeat(u, 0.12, 0.4);
    const left = tantrumBeat(u, 0.43, 0.54) + tantrumBeat(u, 0.65, 0.76);
    const right = tantrumBeat(u, 0.54, 0.65) + tantrumBeat(u, 0.76, 0.87);
    tantrumFeet(pose, ready, 0.3 * left, 0.3 * right, 0.05, 24);
    breathe(pose, 0);
    trunk(pose, {lean: 5 * ready + 5 * protest, nod: 8 * ready, turn: 24 * shake, twist: 5 * (left - right), tilt: 4 * (left - right)});
    armsAtRest(pose, stance);
    if (ready) pose.putAway(...IN_HAND);
    for (const [side, sign] of Object.entries(SIDES)) {
        pose.lift(`shoulder_${side}`, {z: 0.08 * protest});
        const at = new THREE.Vector3(sign * (1.05 + 0.3 * protest), -0.65, 1.75 + 0.4 * protest + 0.1 * (side === "l" ? left : right));
        armToward(pose, side, ready, pose.carried(at), {x: 70 * protest, y: -sign * 10, z: -sign * 20}, [1, 0.2, -1]);
        pose.clench(side, 1 - 0.22 * ready * (1 - protest));
    }
    eyesAs(pose, "angry", ready);
}

// A coach's pointed reprimand gives way to two sharp stamps, with the other fist held firmly at the waist.
function coach_tantrum(pose, stance, t) {
    const u = onceTime(t, ACTS.tantrum.frames);
    const ready = rise(u, 0.02, 0.12) * (1 - rise(u, 0.86, 1));
    const scold = rise(u, 0.08, 0.18) * (1 - rise(u, 0.5, 0.6));
    const jab = tantrumBeat(u, 0.18, 0.29) + tantrumBeat(u, 0.33, 0.44);
    const stamp = tantrumBeat(u, 0.58, 0.69) + tantrumBeat(u, 0.73, 0.84);
    tantrumFeet(pose, ready, 0, 0.38 * stamp, 0.065);
    breathe(pose, 0);
    trunk(pose, {lean: 10 * ready + 4 * jab, nod: 10 * ready + 6 * jab, twist: -8 * scold, turn: 6 * scold});
    armsAtRest(pose, stance);
    if (ready) pose.putAway(...IN_HAND);
    const pointAt = new THREE.Vector3(1.04 + 0.14 * jab, -0.55 - 0.3 * scold - 0.12 * jab, 1.75 + 0.45 * scold);
    armToward(pose, "l", ready, pose.carried(pointAt), {x: 10, z: -75 * scold}, [1, 0.15, -1]);
    armToward(pose, "r", ready, pose.carried(new THREE.Vector3(-0.95, -0.4, 1.6 + 0.1 * stamp)), {z: 25}, [1, 0.2, -1]);
    pose.clench("l", 1 - 0.2 * ready * (1 - scold));
    pose.clench("r", 1 - 0.3 * ready);
    eyesAs(pose, "angry", ready);
}

// A colleague tries to contain the irritation: shoulders and fists tremble, one foot stamps, and the hands settle again.
function colleague_tantrum(pose, stance, t) {
    const u = onceTime(t, ACTS.tantrum.frames);
    const ready = rise(u, 0.02, 0.14) * (1 - rise(u, 0.82, 1));
    const tense = rise(u, 0.1, 0.24) * (1 - rise(u, 0.58, 0.73));
    const shake = waveOf(span(u, 0.23, 0.59), 7) * tantrumBeat(u, 0.23, 0.59);
    const stamp = tantrumBeat(u, 0.61, 0.78);
    tantrumFeet(pose, ready, 0.3 * stamp, 0, 0.035);
    breathe(pose, 0);
    trunk(pose, {lean: 6 * ready + 3 * tense, nod: 12 * tense, turn: 3 * shake, twist: 2 * shake});
    armsAtRest(pose, stance);
    if (ready) pose.putAway(...IN_HAND);
    for (const [side, sign] of Object.entries(SIDES)) {
        pose.lift(`shoulder_${side}`, {z: 0.1 * tense + sign * 0.025 * shake});
        const at = new THREE.Vector3(sign * (0.93 + 0.035 * shake), -0.58, 1.55 + 0.38 * tense + sign * 0.055 * shake);
        armToward(pose, side, ready, pose.carried(at), {z: -sign * 35}, [1, 0.1, -1]);
        pose.clench(side, 1 - 0.34 * ready);
    }
    eyesAs(pose, "angry", ready);
}

// A knight's affront: squared fists, an indignant look to either side, and two heavy armored stamps.
function squire_tantrum(pose, stance, t) {
    const u = onceTime(t, ACTS.tantrum.frames);
    const ready = rise(u, 0.02, 0.14) * (1 - rise(u, 0.86, 1));
    const affront = rise(u, 0.08, 0.2) * (1 - rise(u, 0.74, 0.86));
    const left = tantrumBeat(u, 0.34, 0.51);
    const right = tantrumBeat(u, 0.61, 0.8);
    const look = tantrumBeat(u, 0.16, 0.4) - tantrumBeat(u, 0.48, 0.74);
    tantrumFeet(pose, ready, 0.48 * left, 0.48 * right, 0.085, 12);
    breathe(pose, 0);
    trunk(pose, {lean: 4 * ready + 5 * (left + right), nod: 6 * ready, turn: 22 * look, twist: 8 * look});
    armsAtRest(pose, stance);
    if (ready) pose.putAway(...IN_HAND);
    for (const [side, sign] of Object.entries(SIDES)) {
        const stamp = side === "l" ? left : right;
        const at = new THREE.Vector3(sign * 1.12, -0.6, 1.65 + 0.5 * affront - 0.2 * stamp);
        armToward(pose, side, ready, pose.carried(at), {z: -sign * 65}, [1, 0.25, -1]);
        pose.clench(side, 1 - 0.32 * ready);
    }
    eyesAs(pose, "angry", ready);
}

// A glance from standing still, held a moment and back: to the page's left or right, the head turned up to `head` degrees and the
// shoulders `body` more after it, so a look further round than HEAD_TURN turns the body too; or up, the head tipped back
// a glance aside is small and held a moment: the head turns a little, the body barely
export const GLANCE = {frames: 36, fps: 12, head: 18, body: 5, up: 10};

const glanceAt = (way, up) => (pose, stance, t) => {
    const u = onceTime(t, GLANCE.frames);
    const held = rise(u, 0.08, 0.25) * (1 - rise(u, 0.75, 0.92));
    trunk(pose, {twist: way * GLANCE.body * held, turn: way * GLANCE.head * held, nod: -up * GLANCE.up * held});
    armsAtRest(pose, stance);
};

// how quick a landing is: a real fall's stop, the knees giving and springing back in under a third of a second
export const LANDING = {frames: 6, fps: 20};

// Landing wrong from a launch: it trips, falls onto its knees at a fall's speed with a little bounce, shakes its head, gets up and gives a little hop, arms up, as if nothing
// happened; the hips drop `drop` to kneel, the shins laid back along the floor. The largest shoes' `feet` extents keep their soles,
// insteps and toes above the floor while they roll over, with the leg solver preserving their connection to the knees.
export const TUMBLE = {frames: 48, fps: 12, trip: [0, 0.14], down: [0.05, 0.11], bounce: [0.11, 0.18], shake: [0.3, 0.58], shakes: 3, up: [0.62, 0.8], hop: [0.8, 0.96], drop: 0.74, feet: {sole: 0.33, instep: 0.184, toe: 0.8}};

function tumble(pose, stance, t) {
    const u = onceTime(t, TUMBLE.frames);
    const kneel = rise(u, ...TUMBLE.down) * (1 - rise(u, ...TUMBLE.up));
    const flail = swell(u, ...TUMBLE.trip);
    const shake = waveOf(span(u, ...TUMBLE.shake), TUMBLE.shakes) * swell(u, ...TUMBLE.shake);
    const hop = swell(u, ...TUMBLE.hop);
    pose.lift("root", {z: -TUMBLE.drop * kneel + 0.1 * swell(u, ...TUMBLE.bounce) + 0.16 * hop});
    if (pose.posture === "stand") remorseLegs(pose, kneel, TUMBLE.feet);
    trunk(pose, {lean: 12 * kneel + 10 * flail * (1 - kneel), nod: 12 * kneel, turn: 26 * shake});
    flung(pose, stance, 0, 100 * flail * (1 - kneel) + 60 * hop, 8 * flail);
    pose.putAway(...IN_HAND);
    if (hop > 0.1) eyesAs(pose, "amused", hop);
    else eyesAs(pose, kneel > 0.5 ? "worried" : "startled", Math.max(kneel, flail));
}

// Sitting on the edge of a floor, legs over the edge, leaning back a little on both hands laid flat on the edge beside its hips, palms
// down and fingers out, the free hands only, a carried thing kept in hand; it breathes, its feet sway and its toes tip now and then.
// `hands` is where each wrist rests, across and forward, on the floor line the seat sits on (LOUNGE floor), the free hand's side outward;
// `toes` how far the toes tip, in degrees, on the swing's every other beat
export const LEDGE = {hands: [0.8, 0.18], lean: -7, nod: -3, toes: 14};

function ledge_sit(pose, stance, t) {
    breathe(pose, t);
    trunk(pose, {lean: LEDGE.lean, nod: LEDGE.nod + 2 * waveOf(t)});
    const [x, y] = LEDGE.hands;
    armsAtRest(pose, stance, [...stance.free]);
    for (const side of stance.free) {
        handTo(pose, side, 1, pose.withinReach(side, new THREE.Vector3(SIDES[side] * x, y, LOUNGE.floor), 0.97), new THREE.Vector3(1, 0.6, 0.2));
        pose.face(`hand_${side}`, {x: -80});
    }
    if (stance.free.size) emptyHand(pose);
    pose.swing(0.6 * waveOf(t));
    pose.tap = LEDGE.toes * Math.max(waveOf(t, 2), 0);
}

// Makes room without standing: the supporting palm plants before each lift, the hips cross while lifted, and the feet follow.
function newest_scoot(pose, stance, t) {
    const u = Math.min(t * NEWEST_ASIDE.frames / (NEWEST_ASIDE.frames - 1), 1);
    const motion = newestScootAt(u);
    const way = pose.walkWay || 1;
    const support = reachSide(stance, -way);
    const sign = SIDES[support];
    const movement = new THREE.Vector3(way * pose.stride * FRAMED_HEIGHT / NEWEST_ASIDE.shuffles, 0, 0).applyAxisAngle(new THREE.Vector3(0, 0, 1), radians(-pose.facing));
    LEGS[pose.posture]?.under(pose);
    idle(pose, stance, 0);
    pose.lift("root", {z: motion.lift});
    pose.bendAbove("spine", {y: sign * 24 * motion.weight});
    trunk(pose, {lean: -3 * motion.ready, nod: 5 * motion.ready, turn: way * 8 * motion.ready});
    pose.swing(-way * 0.65 * motion.follow);
    LEGS[pose.posture]?.over(pose);
    const hand = new THREE.Vector3(sign * 0.86, 0.08, LOUNGE.floor + 0.07).addScaledVector(movement, -0.5 + rise(motion.phase, 0, 0.3) - motion.moved);
    hand.z += 0.12 * Math.sin(Math.PI * span(motion.phase, 0, 0.3)) ** 2;
    armToward(pose, support, motion.ready, pose.withinReach(support, hand, 0.999), {x: -80}, [1, 0.45, 0.15]);
    for (const side of Object.keys(SIDES)) pose.turn(`foot_${side}`, {x: -4 * motion.follow});
}

// Checks a pocket watch where it sits on an edge waiting on a run (runWait.js): the free hand brings it out of the waistcoat pocket at
// `pocket` up before the chest at `held` over `out`, the head bowed `look` degrees to read it, and puts it back over `back`; the legs swing
// as they do on the edge
export const WATCH_CHECK = {pocket: [0.35, -0.5, 1.45], held: [0.15, -0.95, 1.95], look: 18, out: [0.1, 0.3], back: [0.72, 0.92]};

function pocket_watch(pose, stance, t) {
    const side = freeSide(stance);
    const out = partOf(t, WATCH_CHECK.out) * (1 - partOf(t, WATCH_CHECK.back));
    const at = (point) => new THREE.Vector3(SIDES[side] * point[0], point[1], point[2]);
    breathe(pose, t);
    trunk(pose, {lean: 4 * out, nod: WATCH_CHECK.look * out});
    armsAtRest(pose, stance, [side]);
    handTo(pose, side, Math.max(out, 0.001), pose.withinReach(side, at(WATCH_CHECK.pocket).lerp(at(WATCH_CHECK.held), out), 0.97), new THREE.Vector3(SIDES[side] * 0.6, -0.5, -0.6));
    if (out > 0.15) pose.holdUpright("pocket_watch", side, [0, 0, 0], {x: -30});
    pose.swing(0.4 * waveOf(t));
}

// Dozes where it sits on an edge waiting on a run (runWait.js): the head sinking forward up to `nod` degrees and the shoulders slumping
// `lean`, the eyes shut, a Z coming and going on the visor (visorPixels.js), the legs still but for a slow sway
export const DOZE = {nod: 24, lean: 8};

function doze(pose, stance, t) {
    const sink = 0.7 + 0.3 * Math.sin(2 * Math.PI * t);
    breathe(pose, t);
    trunk(pose, {lean: DOZE.lean * sink, nod: DOZE.nod * sink});
    armsAtRest(pose, stance);
    pose.shutEyes(0);
    pose.doze(1 + (Math.floor(t * 4) % 2));
    pose.swing(0.15 * waveOf(t));
}

// hops on up from bubble to bubble, arms flung up and legs tucked, very fast
function hop_up(pose, stance, t) {
    const pump = waveOf(t);
    breathe(pose, 0);
    trunk(pose, {lean: 8, nod: -12});
    flung(pose, stance, 0, 110 + 20 * pump);
    tucked(pose, 0.6 + 0.2 * pump);
}

// where the hands swat at the tickling pointer, in front of the face, across, forward (toward the viewer is less) and up in the
// figure's units; how many swats a play of it has, and how much it giggles, shaking
// where the swatting hands go, across, forward and up in the figure's units, with no pointer to aim at; how far across and how low and high
// a swat aimed at the pointer reaches; how many swats a play holds and how far it giggles
const SWAT = {at: [0.3, -0.8, 2.45], across: 1.5, low: 1.1, high: 3.4, swats: 4, giggle: 4};

// where a swat aims: at the pointer, `pose.at` in shares of the picture (lookToward), brought within the arms' reach, or straight ahead
function swatTarget(pose) {
    if (!pose.at) return null;
    const across = Math.min(Math.max((pose.at.x - 0.5) * FRAMED_HEIGHT, -SWAT.across), SWAT.across);
    const up = Math.min(Math.max(FRAMED_MIDDLE + (0.5 - pose.at.y) * FRAMED_HEIGHT, SWAT.low), SWAT.high);
    return new THREE.Vector3(across, SWAT.at[1], up);
}

// tickled by the mouse pointer it swats at it, giggling, its eyes squeezed shut laughing, a kawaii > <: with the pointer in sight each swat
// goes at the pointer, with the hand on its side, else with one hand and then the other at the air before it
function tickle_swat(pose, stance, t) {
    const u = onceTime(t, 24);
    const ready = rise(u, 0, 0.12) * (1 - rise(u, 0.88, 1));
    const swat = t * SWAT.swats;
    const aimed = swatTarget(pose);
    const which = aimed ? (aimed.x * SIDES.l > 0 ? "l" : "r") : Math.floor(swat) % 2 ? "l" : "r";
    const out = Math.sin(Math.PI * (swat % 1));
    breathe(pose, u);
    trunk(pose, {tilt: SWAT.giggle * Math.sin(2 * Math.PI * swat * 2) * ready, nod: -3 * ready});
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, Object.keys(SIDES));
    for (const side of Object.keys(SIDES)) {
        const [x, y, z] = SWAT.at;
        const target = side === which && aimed ? pose.withinReach(side, aimed, 0.95) : new THREE.Vector3(SIDES[side] * x, y, z);
        const amount = ready * (0.25 + (side === which ? 0.75 * out : 0));
        restingPropArm(pose, side);
        armToward(pose, side, amount, target, null, [1, -0.4, -0.3]);
    }
    pose.squeezeEyes(1);
}

// where the disco dance points its hands, across, forward (toward the viewer is less) and up in the figure's units: one up and out over
// its shoulder, the other down and out by its hip
const DISCO = {up: [1.2, -0.3, 2.85], down: [0.95, -0.25, 1.3], sway: 12, bounce: 0.18};

// The pointing arms trade places through a short eased crossover, followed by a readable hold on each beat.
function disco(pose, stance, t) {
    const act = ACTS.disco;
    const u = onceTime(t, act.frames);
    const beat = u * act.beats;
    const which = Math.floor(beat) % 2 ? 1 : -1;
    const across = which * (2 * rise(beat % 1, 0, 0.42) - 1);
    const into = partOf(u, [0, 0.08]) * (1 - partOf(u, [0.88, 1]));
    const bounce = Math.sin(Math.PI * beat) ** 2 * into;
    crouch(pose, DISCO.bounce * bounce);
    breathe(pose, u);
    trunk(pose, {tilt: across * DISCO.sway * into, nod: -4 * into + 2 * bounce});
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, Object.keys(SIDES));
    for (const side of Object.keys(SIDES)) {
        const sign = SIDES[side];
        const raised = (1 + sign * across) / 2;
        const target = new THREE.Vector3(...DISCO.down).lerp(new THREE.Vector3(...DISCO.up), raised);
        target.x *= sign;
        const elbow = new THREE.Vector3(1, 0.4, mix(-0.6, 0.2, raised));
        handTo(pose, side, into, pose.carried(target), elbow);
    }
    eyesAs(pose, "amused", into);
}

// The rifle is drawn from behind the right shoulder, then seated against it, with the other palm under the fore-end. The feet turn
// toward the wall and the chest takes a small shooting stance; the head follows the barrel from its cheek against the stock.
export const RIFLE = {grip: [-0.1, -0.62, 2.0], down: 12, fore: 0.9, behind: [-0.45, 0.45, 1.45], kick: 0.13, climb: 7, shoulder: 7, turn: 22, cheek: 14, steep: 60};

// The chat is behind the figure (+Y). Side walls are almost in its plane; a top-wall target is on the screen behind its shoulders.
export const RIFLE_DEPTH = {wall: 0.8, screen: 3.2};
export const rifleTarget = (target) => new THREE.Vector3(
    (target.x - 0.5) * FRAMED_HEIGHT,
    mix(RIFLE_DEPTH.wall, RIFLE_DEPTH.screen, target.back ?? partOf(-target.y, [0, 0.8])),
    FRAMED_MIDDLE + (0.5 - target.y) * FRAMED_HEIGHT
);

// The rifle's line as it is held, kicked `kick` of the way back, aimed `aim` degrees down (RIFLE down unless it aims at a bug), out to the
// figure's left, `way` 1, or held the other way round, out to its right, `way` -1: where the grip is, the way the barrel points, and its
// pitch down, degrees
export function rifleLine(kick, aim = RIFLE.down, way = 1) {
    const pitch = aim - RIFLE.climb * kick;
    const along = new THREE.Vector3(way * Math.cos(radians(pitch)), 0, -Math.sin(radians(pitch)));
    const [x, y, z] = RIFLE.grip;
    return {grip: new THREE.Vector3(way * x, y, z).addScaledVector(along, -RIFLE.kick * kick), along, pitch};
}

// The rifle's recoil rises quickly without a jump and eases back before the next burst.
export const burstKick = (t) => {
    const {shots, count} = ACTS.bug_shot;
    if (t <= shots[0] || t >= shots[1]) return 0;
    const phase = (((t - shots[0]) / (shots[1] - shots[0])) * count) % 1;
    return phase < 0.08 ? ease(phase / 0.08) : 1 - ease(span(phase, 0.08, 0.5));
};

// The whole body faces the target, rather than passing a sideways rifle between hands. Angles stay on the back half of the room
// (90 to 270 degrees), so an aim crossing behind the head turns continuously through the back instead of flipping at 180 degrees.
export function rifleAim(target, facing) {
    const point = rifleTarget(target ?? {x: 2.2, y: 0.35});
    const yaw = (THREE.MathUtils.radToDeg(Math.atan2(point.x, -point.y)) + 360) % 360;
    const down = THREE.MathUtils.radToDeg(Math.atan2(-(point.z - RIFLE.grip[2]), Math.hypot(point.x, point.y)));
    return {turn: yaw - facing, down, way: 1, handed: 1, point: point.applyAxisAngle(new THREE.Vector3(0, 0, 1), radians(-facing))};
}

// The rifle's own axes as held, its barrel along `along`, in the pose's own axes: its top up while it is held level, and turned away from
// the figure the steeper it is aimed up, so the hand under it lies between it and the body, within the short arm's reach
function rifleAxes(along) {
    const rising = Math.max(along.z, 0);
    const toward = new THREE.Vector3(0, -rising, 1 - rising).normalize();
    const up = toward.sub(along.clone().multiplyScalar(toward.dot(along))).normalize();
    return new THREE.Matrix4().makeBasis(along.clone(), up.clone().cross(along), up);
}

// The rifle's turn as held (heldPropOf), its barrel along `along` (rifleAxes), in degrees
function rifleTurn(along) {
    const turn = new THREE.Euler().setFromRotationMatrix(rifleAxes(along), "ZYX");
    return {x: THREE.MathUtils.radToDeg(turn.x), y: THREE.MathUtils.radToDeg(turn.y), z: THREE.MathUtils.radToDeg(turn.z)};
}

// The way the barrel points from the grip at `grip` so its line passes through `point` (rifleAim), the body to be turned `turn` degrees
// afterwards: a burst kicks the grip back along the line and the barrel stays on the bug; along `planned` with no point
function barrelWay(grip, point, turn, planned) {
    if (!point) return planned;
    const there = point.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), radians(-turn));
    // the barrel stands above the grip as the rifle is turned, so the way is found from the rifle aimed once, then again
    const from = (way) => grip.clone().add(rifleUp(way).multiplyScalar(RIFLE_HOLD.barrel));
    const first = there.clone().sub(from(there.clone().sub(grip).normalize())).normalize();
    return there.sub(from(first)).normalize();
}

// the way up from the rifle, its barrel along `along` (rifleAxes)
const rifleUp = (along) => new THREE.Vector3().setFromMatrixColumn(rifleAxes(along), 2);

// Reconstruct the arm's rotations along their actual aiming arcs, keeping quaternion signs continuous as the target crosses the body.
function rifleArmRotation(pose, side) {
    const upper = `upper_arm_${side}`;
    let rotation = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().extractRotation(pose.standing(upper)));
    for (const role of ["upper_arm", "forearm"]) {
        const name = `${role}_${side}`;
        const before = pose.rig.along.get(name).clone().applyQuaternion(rotation).normalize();
        const after = pose.rig.along.get(name).clone().transformDirection(pose.matrix(name)).normalize();
        rotation = new THREE.Quaternion().setFromUnitVectors(before, after).multiply(rotation);
    }
    return rotation;
}

// Blend the chosen wrist rotation arcs without exchanging their quaternion signs partway through the handoff.
function rifleWristRotation(from, to, amount) {
    return new THREE.Quaternion(mix(from.x, to.x, amount), mix(from.y, to.y, amount), mix(from.z, to.z, amount), mix(from.w, to.w, amount)).normalize();
}

// The other hand under the rifle, held at `grip` with its barrel along `along`: its wrist placed so its palm lies under the handguard
// (RIFLE_HOLD), at its middle or as far along it toward the grip as the arm needs to reach it, the palm turned up and the fingers along
// the barrel
function cradle(pose, side, k, grip, along) {
    const down = rifleUp(along).negate();
    const wristAt = (fore) => grip.clone().addScaledVector(along, fore - HAND.grip).addScaledVector(down, RIFLE_HOLD.under);
    const shoulder = pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`));
    const upper = pose.rig.heads.get(`upper_arm_${side}`);
    const elbow = pose.rig.heads.get(`forearm_${side}`);
    const hand = pose.rig.heads.get(`hand_${side}`);
    const reach = (upper.distanceTo(elbow) + elbow.distanceTo(hand)) * 0.97;
    const from = wristAt(0).sub(shoulder);
    const projected = from.dot(along);
    const furthest = -projected + Math.sqrt(Math.max(projected ** 2 - from.lengthSq() + reach ** 2, 0));
    const wrist = wristAt(Math.max(RIFLE_HOLD.nearest, Math.min(RIFLE_HOLD.fore, furthest)));
    handTo(pose, side, k, pose.withinReach(side, wrist, 0.97), new THREE.Vector3(SIDES[side] * 0.6, -0.6, -0.6));
    const pitch = Math.asin(-SIDES[side] * along.z);
    const yaw = Math.atan2(along.y, along.x) + (side === "r" ? Math.PI : 0);
    const target = new THREE.Quaternion().setFromEuler(new THREE.Euler(radians(RIFLE_HOLD.roll), pitch, yaw, "ZYX"));
    const rotation = rifleWristRotation(rifleArmRotation(pose, side), target, k);
    wristToward(pose, side, 1, rotation);
    return rotation;
}

// The right palm closes around the grip; the stock stays seated in the shoulder and the left palm finds the reachable fore-end.
// Both arm paths use the same handTo/cradle solvers as the draw, so turning the whole figure never swaps the rifle between hands.
function rifleShouldered(pose, onto, kick, ready, drawn, aim) {
    const shoulder = pose.head("upper_arm_r", pose.standing("upper_arm_r")).add(new THREE.Vector3(0.22, -0.03, 0.05));
    const planned = new THREE.Vector3(0, -Math.cos(radians(onto.down)), -Math.sin(radians(onto.down)));
    const along = barrelWay(shoulder, onto.point, onto.turn * aim, planned);
    const stock = -(RIFLE_PARTS.stock[0][0] - RIFLE_PARTS.stock[1][0] / 2) * RIFLE_PARTS.scale;
    const grip = shoulder.clone().addScaledVector(along, stock - RIFLE.kick * kick);
    const rotation = new THREE.Quaternion().setFromRotationMatrix(rifleAxes(along).multiply(euler(0, -90, 0)));
    const scale = new THREE.Vector3(0.66, 1, 1);
    const shape = new THREE.Matrix4().compose(new THREE.Vector3(), rotation, scale);
    const offset = pose.grip("r", [0, 0, 0]).sub(pose.rig.heads.get("hand_r")).applyMatrix4(shape);
    const wrist = new THREE.Vector3(...RIFLE.behind).lerp(grip.clone().sub(offset), drawn);
    wrist.x -= 0.3 * Math.sin(Math.PI * drawn);
    handTo(pose, "r", ready, pose.withinReach("r", wrist, 0.999999), new THREE.Vector3(1, 0.3, -0.8));
    pose.clench("r", mix(1, 0.66, aim));
    wristToward(pose, "r", aim, rotation);
    const held = pose.grip("r", [0, 0, 0]).applyMatrix4(pose.matrix("hand_r"));
    const aimed = barrelWay(held, onto.point, onto.turn * aim, along);
    cradle(pose, "l", aim, held, aimed);
    return {held, along: aimed};
}

// Match a combat stride to page distance while the torso remains turned toward its target.
function combatSteps(pose, amount, turn, length, rest = 0) {
    pose.stride *= length * FRAMED_HEIGHT / WALK_STRIDE[0];
    pose.strideTurn = pose.walkWay * 90 * Math.sign(pose.stride || 1) - turn - pose.facing;
    strideUnder(pose);
    const sideways = 0.1 * Math.abs(Math.sin(radians(pose.strideTurn)));
    const height = (pose.strideHeight - sideways) * amount - rest * (1 - amount);
    pose.lift("root", {z: height - pose.strideHeight});
    pose.strideHeight = height;
}

// shoots the bugs a fixed run brings (acts.js bug_shot): reaches behind its back for the rifle, one hand on its grip, the stock into that
// shoulder, the other hand under the handguard, the rifle resting in its palm; its cheek down to the sights, turned toward the bug it aims
// at (pose.target, one bug each turn of the act, acts.js bugShotFrame), swinging onto it as each turn begins, the barrel aimed from where
// the gripping hand holds it so its line runs through the bug, each burst kicking the rifle, both hands with it, and the shoulder back;
// its eyes in fight mode from the draw until the last bug is gone, and the rifle lowered once it has splattered; its legs backing
// away while it faces a bug it is too steep to shoot (pose.walkWay)
function bug_shot(pose, stance, t) {
    const act = ACTS.bug_shot;
    const middle = (act.draw[0] + act.draw[1]) / 2;
    const reach = partOf(t, [act.draw[0], middle]) * (1 - partOf(t, [middle, act.draw[1]]));
    const aim = partOf(t, [middle, act.draw[1]]) * (1 - partOf(t, [act.drops[0] + 0.05, act.drops[0] + 0.2]));
    const kick = burstKick(t);
    const shoulder = burstKick(t - 0.008);
    const onto = rifleAim(pose.target, pose.facing);
    const grip = onto.way > 0 ? "r" : "l";
    // a bug too steep to shoot is first backed away from along the floor, the figure keeping its face to it (acts.js backPlan): its legs
    // step backward, pose.walkWay naming it while it does, and its body stays turned toward the bug as it is
    const moving = t >= act.splat ? partOf(t, [act.splat, act.splat + 0.025]) : partOf(t, [act.draw[1], act.draw[1] + 0.025]) * (1 - partOf(t, [act.aim[1] - 0.025, act.aim[1]]));
    const stepping = Math.abs(pose.walkWay) * moving;
    if (stepping) combatSteps(pose, stepping, onto.turn * aim, act.back.stride, 0.025 * aim);
    else crouch(pose, 0.025 * aim);
    breathe(pose, t, 1 - 0.65 * aim);
    pose.turn("chest", {z: -onto.handed * RIFLE.shoulder * shoulder});
    trunk(pose, {lean: 4 * aim - 2 * shoulder, twist: -25 * aim, nod: (onto.down + RIFLE.cheek) * aim - 4 * shoulder, turn: 25 * aim, tilt: -12 * aim});
    pose.headContact = aim;
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, Object.keys(SIDES));
    const drawn = partOf(t, [middle, act.draw[1]]);
    const ready = partOf(t, [act.draw[0], middle]) * (1 - partOf(t, [act.drops[0] + 0.05, act.drops[0] + 0.2]));
    const {held, along} = rifleShouldered(pose, onto, kick, ready, drawn, aim);
    if (aim) {
        const point = onto.point.clone().applyAxisAngle(new THREE.Vector3(0, 0, 1), radians(-onto.turn * aim));
        const look = lookAngle(pose, point);
        const own = pose.matrix("head").clone();
        pose.face("head", {x: THREE.MathUtils.radToDeg(look.pitch), y: -6, z: THREE.MathUtils.radToDeg(look.yaw)});
        pose.final.set("head", between(own, pose.matrix("head"), aim));
        pose.gaze = {target: point.toArray(), forward: READ_GAZE.forward};
    }
    if (aim > 0.05 || reach > 0.3) {
        pose.holdUpright("rifle", grip, [0, 0, 0], rifleTurn(along));
        const rifle = pose.props.get("rifle");
        rifle.at = held.clone().applyMatrix4(pose.matrix(`hand_${grip}`).clone().invert());
        rifle.firing = kick > 0.6;
    }
    fightEyes(pose, t, partOf(t, act.draw) * (1 - partOf(t, [act.fly[0], act.fly[1]])));
    if (stepping) strideLegs(pose, stepping);
    if (pose.posture === "stand") pose.revolve(onto.turn * aim);
}

// The big wooden mallet swung at the bug (acts.js bug_smash), in the figure's units: where the right hand grips its handle and the way the
// handle points from there, resting low at its side, its head on the floor (`rest`); raised for the wind-up (`top`), the hands low before
// the chest, as the arms cannot reach past the big head, and the handle leaning well forward, so the mallet's head stands above the eyes
// and well in front of the visor and any hat, never passing through them; and swung down onto the bug out on its left (`blow`); the left
// hand `apart` further up the handle; the figure turned `turn` degrees toward the bug
export const MALLET_SWING = {
    rest: {grip: [0.1, -0.65, 1.6], way: [1.6, -0.6, -1]},
    top: {grip: [-0.05, -0.75, 2.2], way: [0.25, -1.35, 1.6]},
    blow: {grip: [0.25, -0.75, 1.68], way: [1.7, -0.45, -1.1]},
    apart: 0.3,
    turn: 30,
};

// The mallet lifts in a forward arc, accelerates into contact, rebounds clear, then settles before being put away.
export function malletAt(t) {
    const {raise, swing, lower} = ACTS.bug_smash;
    const hold = (name) => ({grip: new THREE.Vector3(...MALLET_SWING[name].grip), way: new THREE.Vector3(...MALLET_SWING[name].way).normalize()});
    const between = (from, to, k) => ({grip: from.grip.clone().lerp(to.grip, k), way: from.way.clone().lerp(to.way, k).normalize()});
    if (t < swing[0]) {
        const lift = partOf(t, raise);
        const result = between(hold("rest"), hold("top"), lift);
        result.grip.y -= 0.14 * Math.sin(Math.PI * lift);
        return result;
    }
    if (t < swing[1]) {
        const fall = span(t, ...swing) ** 2;
        const result = between(hold("top"), hold("blow"), fall);
        result.grip.y -= 0.1 * Math.sin(Math.PI * fall);
        return result;
    }
    if (t < lower[0]) {
        const rebound = 0.13 * Math.sin(Math.PI * span(t, swing[1], swing[1] + 0.07)) ** 2;
        const result = hold("blow");
        result.grip.z += rebound;
        return result;
    }
    return between(hold("blow"), hold("rest"), partOf(t, lower));
}

// Place the closed palm on the handle, correcting the wrist for the fist's shorter reach.
function malletHand(pose, side, held, grip, elbow) {
    const wrist = grip.clone();
    for (let pass = 0; pass < 3; pass++) {
        pose.final.delete(`hand_${side}`);
        handTo(pose, side, held, pose.withinReach(side, wrist, 0.97), elbow);
        pose.clench(side, mix(1, 0.68, held));
        const palm = pose.grip(side, [0, 0, 0]).applyMatrix4(pose.matrix(`hand_${side}`));
        wrist.addScaledVector(grip.clone().sub(palm), held ** 3);
    }
}

// The knees preload under the raised mallet, compress into the blow, and recover behind its small rebound.
function bug_smash(pose, stance, t) {
    const act = ACTS.bug_smash;
    const walking = Math.abs(pose.walkWay) * partOf(t, [act.walk[0], act.walk[0] + 0.025]) * (1 - partOf(t, [act.walk[1] - 0.035, act.walk[1]]));
    const held = partOf(t, [act.raise[0] - 0.08, act.raise[0]]) * (1 - partOf(t, [act.lower[1], 1]));
    const {grip, way} = malletAt(t);
    const standing = grip.clone();
    const poised = partOf(t, act.raise) * (1 - partOf(t, act.swing));
    const swing = partOf(t, act.swing);
    const settle = 1 - partOf(t, [act.blow + 0.015, act.blow + 0.11]);
    const blow = swing * settle;
    if (walking) combatSteps(pose, walking, SIDES.l * MALLET_SWING.turn * held + pose.walkWay * 90 * walking, SMASH.stride);
    breathe(pose, t, 1 - 0.7 * held);
    trunk(pose, {lean: -4 * poised + 11 * blow, nod: -4 * poised + 8 * blow, twist: -4 * poised});
    crouch(pose, 0.045 * poised + 0.14 * blow);
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, Object.keys(SIDES));
    malletHand(pose, "r", held, grip, new THREE.Vector3(-0.6, -0.4, -0.6));
    let palm = pose.grip("r", [0, 0, 0]).applyMatrix4(pose.matrix("hand_r"));
    const support = BIG_MALLET.head * Math.abs(way.z) + BIG_MALLET.width * 0.5 * Math.sqrt(1 - way.z ** 2);
    const lift = Math.max(support + 0.006 - palm.z - way.z * BIG_MALLET.handle, 0);
    if (held > 0.85 && lift > 0) {
        grip.z += lift * partOf(held, [0.85, 1]);
        malletHand(pose, "r", held, grip, new THREE.Vector3(-0.6, -0.4, -0.6));
        palm = pose.grip("r", [0, 0, 0]).applyMatrix4(pose.matrix("hand_r"));
    }
    malletHand(pose, "l", held, palm.clone().addScaledVector(way, MALLET_SWING.apart), new THREE.Vector3(0.6, -0.4, -0.6));
    const turn = {y: THREE.MathUtils.radToDeg(-Math.asin(way.z)), z: THREE.MathUtils.radToDeg(Math.atan2(way.y, way.x))};
    if (held > 0.3) {
        if (held < 1) {
            const placed = standing.lerp(palm, partOf(held, [0.85, 1]));
            placed.z = Math.max(placed.z, support + 0.006 - way.z * BIG_MALLET.handle);
            pose.standProp("big_mallet", placed.toArray(), turn);
        } else pose.holdUpright("big_mallet", "r", [0, 0, 0], turn);
    }
    fightEyes(pose, t, held * (1 - partOf(t, act.gone)));
    if (walking) strideLegs(pose, walking);
    if (pose.posture === "stand") pose.revolve(SIDES.l * MALLET_SWING.turn * held + pose.walkWay * 90 * walking);
}

// The halo of a repented sin, over the head (acts.js halo): `above` the head's pivot, as wide as `radius`, its ring `ring` thick, tipped
// `tip` degrees toward the viewer so it shows as a ring; the hands folded before the chest at `hands`, across, forward and up
export const HALO_RING = {above: 2.42, radius: 0.42, ring: 0.05, tip: 14, hands: [0.1, -0.62, 2.05]};

// A halo above the head and any hat, the hands folded and eyes serene; a small hover and gentle head tip leave the ring clear of the
// tall crown and the top of the picture (acts.js halo).
function halo(pose, stance, t) {
    const act = ACTS.halo;
    const shown = partOf(t, act.grows) * (1 - partOf(t, act.fades));
    breathe(pose, t);
    pose.lift("root", {z: act.float * shown * (1 + Math.sin(2 * Math.PI * t))});
    trunk(pose, {nod: -2 * shown});
    pose.putAway(...IN_HAND);
    handsTo(pose, {...stance, free: new Set(Object.keys(SIDES))}, shown, HALO_RING.hands);
    // The raised top hat needs a slightly flatter halo to leave room below the camera ceiling.
    const butler = stance.voice === "butler";
    pose.wearProp("halo", [0, 0, HALO_RING.above + (butler ? 0.07 : 0)], {x: butler ? -9 : 0});
    pose.props.get("halo").size = Math.max(shown, 0.01);
    eyesAs(pose, "serene", shown);
}

// The small confession token travels from the waist to clasped hands against the chest.
export const CRUCIFIX_HOLD = {pocket: [-0.4, -0.4, 1.45], front: [-0.04, -0.59, 2.02], apart: 0.08, tremble: 0.006};

// The body settles onto its knees while the shoes roll from their soles onto their tops.
export const REMORSE = {drop: 0.654, back: 0.12, ankleBack: 0.376, sole: 0.33, instep: 0.18, toe: 0.44, lean: 18, bow: 30, shoulders: 0.055};

function remorseLegs(pose, lowered, feet = REMORSE) {
    if (!lowered) return;
    for (const side of Object.keys(SIDES)) {
        const folded = rise(lowered, 0.35, 1);
        const angle = Math.PI * folded;
        const ankle = pose.rig.heads.get(`foot_${side}`).clone();
        ankle.y += REMORSE.ankleBack * folded;
        ankle.z = Math.max(feet.sole * Math.cos(angle), -feet.instep * Math.cos(angle)) + feet.toe * Math.sin(angle);
        const bend = pose.rig.heads.get(`shin_${side}`).clone().sub(pose.rig.heads.get(`thigh_${side}`));
        if (side === "r") bend.x = -bend.x;
        pose.step(side, ankle, bend.lerp(new THREE.Vector3(0, -1, 0), lowered));
        pose.face(`foot_${side}`, {x: 180 * folded});
    }
}

function remorseHand(pose, side, folded, at) {
    const hand = `hand_${side}`;
    const shoulder = pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`));
    const elbow = pose.head(`forearm_${side}`, pose.matrix(`forearm_${side}`)).sub(shoulder);
    if (side === "r") elbow.x = -elbow.x;
    const resting = pose.head(hand, pose.matrix(hand));
    const restingWay = pose.rig.along.get(hand).clone().transformDirection(pose.matrix(hand));
    const inward = new THREE.Vector3(-SIDES[side], 0, 0.12).normalize();
    const closed = mix(1, 0.72, folded);
    const wrist = at.clone().addScaledVector(inward, -HAND.grip * closed);
    const target = resting.lerp(wrist, folded);
    target.z += 0.08 * Math.sin(Math.PI * folded);
    pose.reach(side, pose.withinReach(side, target, 0.997), elbow.lerp(new THREE.Vector3(1, -0.35, -0.6), folded));
    pose.aim(hand, restingWay.lerp(inward, folded).normalize());
    pose.clench(side, closed);
}

// A breath catches, the knees take the weight, and the bowed head follows the shoulders; the small token stays within the clasp.
function repent(pose, stance, t) {
    const act = ACTS.repent;
    const u = onceTime(t, act.frames);
    const kneel = partOf(u, act.kneel) * (1 - partOf(u, act.rise));
    const folded = partOf(u, act.out) * (1 - rise(u, act.down[0], 1));
    const bow = rise(u, act.stand[1] * 0.5, act.up[1]) * (1 - rise(u, act.rise[0], 1));
    const held = swell(u, act.hold[0], act.hold[1]);
    const breath = 0.6 * Math.sin(2 * Math.PI * u * 1.4) * swell(u, 0, 1) * (1 - 0.85 * held);
    const shake = CRUCIFIX_HOLD.tremble * Math.sin(2 * Math.PI * 5 * u) * held;
    pose.lift("root", {y: REMORSE.back * kneel, z: -REMORSE.drop * kneel});
    if (pose.posture === "stand") remorseLegs(pose, kneel);
    trunk(pose, {lean: REMORSE.lean * kneel + breath, nod: REMORSE.bow * bow - breath * 0.5, tilt: 2 * held});
    for (const side of Object.keys(SIDES)) pose.lift(`shoulder_${side}`, {z: -REMORSE.shoulders * bow});
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance);
    const chest = new THREE.Vector3(...CRUCIFIX_HOLD.front).applyMatrix4(pose.matrix("chest"));
    chest.z += shake;
    for (const side of folded ? Object.keys(SIDES) : []) {
        const at = chest.clone().add(new THREE.Vector3(side === "l" ? CRUCIFIX_HOLD.apart : 0, side === "l" ? -0.025 : 0, side === "l" ? 0.025 : 0));
        remorseHand(pose, side, folded, at);
    }
    const shown = partOf(u, act.up) * (1 - partOf(u, act.down));
    if (shown > 0) {
        pose.holdUpright("crucifix", "r", [0, 0, 0], {x: -8 * folded});
        pose.props.get("crucifix").size = shown;
    }
    eyesAs(pose, "worried", Math.max(kneel, bow));
    pose.glanceEyes(-0.2 * bow, 0);
}

// where the hands hold the pogo stick's handles, across, forward (toward the viewer is less) and up in the figure's units, and where the
// hand reaching behind its back for the stick goes
const POGO_GRIP = [0.42, -0.55, ACTS.pogo.handles * FRAMED_HEIGHT + HAND.grip * 0.66];
const POGO_BEHIND = [0.45, 0.45, 1.45];

// up a high place on a pogo stick (acts.js pogo): reaches behind its back and carries the stick round its side in one continuous arc,
// holds both handles and bounces,
// the knees giving at the foot of each bounce, springs up and lets the stick go at the top of the throw
function pogo(pose, stance, t) {
    const act = ACTS.pogo;
    const drawn = partOf(t, [act.draw[1] * 0.5, act.draw[1]]);
    const reach = partOf(t, [act.draw[0], act.draw[1] * 0.5]) * (1 - partOf(t, act.release));
    const held = partOf(t, [act.draw[1] * 0.6, act.draw[1]]) * (1 - partOf(t, act.release));
    const hop = pogoHop(pogoBounces(), (t - act.bounces[0]) / (act.bounces[1] - act.bounces[0]));
    const give = t < act.bounces[0] ? partOf(t, [act.bounces[0] - 0.04, act.bounces[0]]) : t <= act.bounces[1] ? Math.cos(Math.PI * hop.s) ** 2 : 1 - partOf(t, [act.spring[0], act.spring[0] + 0.06]);
    crouch(pose, 0.22 * give * held);
    breathe(pose, t);
    trunk(pose, {lean: 6 * held, nod: -6 * held});
    pose.putAway(...IN_HAND);
    armsAtRest(pose, stance, Object.keys(SIDES));
    const [x, y, z] = POGO_GRIP;
    const [bx, by, bz] = POGO_BEHIND;
    for (const side of Object.keys(SIDES)) {
        const sign = SIDES[side];
        if (side === "r") {
            const wrist = new THREE.Vector3(sign * bx, by, bz).lerp(new THREE.Vector3(sign * x, y, z), drawn);
            wrist.x -= 0.2 * Math.sin(Math.PI * drawn);
            handTo(pose, side, reach, wrist, new THREE.Vector3(1, 0.5, -0.5).lerp(new THREE.Vector3(1, -0.2, -0.4), drawn));
        } else handTo(pose, side, held, new THREE.Vector3(sign * x, y, z), new THREE.Vector3(1, -0.2, -0.4));
        pose.clench(side, mix(1, 0.66, held));
        wristToward(pose, side, held, {y: sign * 90});
    }
    eyesAs(pose, "amused", held);
}

// where each hand holds its rope of the swing, beside the head, in the figure's units across, forward and up: inside the ropes' half span
// (acts.js rope_swing ties, as a share of the 5.4 units the picture frames) by the sleeve's `arm`, so the ropes run outside the arms; and
// how far above the seat the figure is, `above`, as it sits down onto it and rises off it
export const SWING_HOLD = {arm: 0.29, up: 2.6, forward: -0.1, above: 0.12};
const ROPE_GRIP = [(ACTS.rope_swing.ties * FRAMED_HEIGHT) / 2 - SWING_HOLD.arm, SWING_HOLD.forward, SWING_HOLD.up];

// Sits down onto the rope swing's seat, holds both ropes beside its head, and leans back and pumps its legs with each swing. The final
// pose and its whole prop turn together about the two knots, preserving their length and the hands' and hips' contact; the seat rises
// at both ends of the arc. The head stays upright as the body leans, with room above the tall hat even while boarding and rising off.
function rope_swing(pose, stance, t) {
    const pump = swingAt(t);
    const breath = heldPhases(ACTS.rope_swing, t).held ?? 0;
    pose.kneesTogether();
    pose.lift("root", {z: SWING_HOLD.above * offSwing(t)});
    pose.standProp("rope_swing", new THREE.Vector3(0, 0, POSTURES.sit.drop * FRAMED_HEIGHT).sub(pose.carried(new THREE.Vector3())).toArray());
    breathe(pose, breath);
    const lean = stance.voice === "butler" ? -30 * pump + 35 * offSwing(t) * (t < 0.5 ? 1 : -1) : -5 * pump;
    const nod = stance.voice === "butler" ? ACTS.rope_swing.angle * pump - lean : -4 * (1 - pump * pump) + (ACTS.rope_swing.angle + 5) * pump;
    trunk(pose, {lean, nod});
    pose.putAway(...IN_HAND);
    const [x, y, z] = ROPE_GRIP;
    armsAtRest(pose, stance, Object.keys(SIDES));
    for (const side of Object.keys(SIDES)) {
        handTo(pose, side, 1, pose.carried(new THREE.Vector3(SIDES[side] * x, y, z)), new THREE.Vector3(1, 0, -0.4));
        pose.face(`hand_${side}`, {z: -SIDES[side] * 90});
    }
    pose.swing(1.2 * pump);
    eyesAs(pose, "amused");
    const knots = new THREE.Vector3(0, (SWING.front + SWING.back) / 2, (POSTURES.sit.drop + ACTS.rope_swing.rope) * FRAMED_HEIGHT);
    pose.suspension = aboutPoint(knots, euler(-ACTS.rope_swing.angle * pump, 0, 0));
}

// where each hand grips the parachute's lines, in the figure's units across, forward and up: up and out above the shoulders, the arms
// raised in a V
export const CHUTE_GRIP = [1.25, 0, 2.95];

// hangs from the parachute's lines with both hands up gripping them above its shoulders, the legs hanging straight and swinging a little
function chute(pose, stance, t) {
    const swing = waveOf(t);
    breathe(pose, t);
    trunk(pose, {nod: -6, tilt: 3 * swing});
    pose.putAway(...IN_HAND);
    const [x, y, z] = CHUTE_GRIP;
    armsAtRest(pose, stance, Object.keys(SIDES));
    for (const side of Object.keys(SIDES)) {
        handTo(pose, side, 1, pose.withinReach(side, pose.carried(new THREE.Vector3(SIDES[side] * x, y, z)), 0.97), new THREE.Vector3(1, 0, -0.4));
        pose.face(`hand_${side}`, {z: -SIDES[side] * 90});
    }
    tucked(pose, 0.05, 6 * swing);
    eyesAs(pose, "amused");
}

// The figure looks all about through binoculars held up to its eyes, sweeping slowly from one side to the other, the hand keeping them
// before the eyes as the head turns
// The binoculars before the visor as the figure scans the chat (BINOCULARS): their eyepieces `ahead` before the eyes and `below` under
// them, tipped up with the head; both hands up under the barrels, as far as the arms reach; the figure turned `turn` degrees so the barrels
// show their length
export const BINOCULAR_HOLD = {ahead: 0.95, below: 0.06, hands: 0.22, turn: 35};

// scans up and down the chat through binoculars from the compose box (acts.js binoculars): head and binoculars tipped up the chat and
// swept slowly up and down it, the body turning a little left and right, both hands holding them up before the visor
function binoculars(pose, stance, t) {
    const act = ACTS.binoculars;
    const turn = 0.4 * ACTED.sweep * waveOf(t, act.sweep);
    const up = act.up + act.scan * waveOf(t, 2);
    trunk(pose, {twist: turn, nod: -up});
    armsAtRest(pose, stance, ["l", "r"]);
    const eyes = pose.rig.eyes.reduce((sum, eye) => sum.add(eye), new THREE.Vector3()).divideScalar(pose.rig.eyes.length).applyMatrix4(pose.matrix("head"));
    const tipped = new THREE.Vector3(0, -Math.cos(radians(up)), Math.sin(radians(up)));
    const held = eyes.clone().addScaledVector(tipped, BINOCULAR_HOLD.ahead).add(new THREE.Vector3(0, 0, -BINOCULAR_HOLD.below));
    pose.standProp("binoculars", held.toArray(), {x: -up, z: turn});
    for (const side of ["l", "r"]) {
        const under = pose.carried(held.clone().add(new THREE.Vector3(SIDES[side] * BINOCULAR_HOLD.hands, 0.1, -0.16)));
        handTo(pose, side, 1, pose.withinReach(side, under, 0.97), new THREE.Vector3(...ACTING.elbow));
    }
    emptyHand(pose);
    if (pose.posture === "stand") pose.revolve(SIDES[freeSide(stance)] * BINOCULAR_HOLD.turn);
}


// Rummaging (acts.js rummage): how deep it crouches and how far it leans in, in the figure's units and degrees; where its hands dig past
// the window's edge, across, forward and up, each `dig` up and down as it digs, the elbows the way `elbow` says; and how far it turns
// side-on to the edge
export const RUMMAGE = {crouch: 0.3, lean: 48, nod: 12, hands: [0.3, -1.45, 1.75], dig: 0.3, elbow: [1, -0.4, -0.6], turn: 90, wiggle: 6};

function rummage(pose, stance, t) {
    const act = ACTS.rummage;
    const side = reachSide(stance, pose.leanWay);
    const into = partOf(t, act.leans) * (1 - partOf(t, act.pops));
    const digging = waveOf(t, act.digs);
    crouch(pose, RUMMAGE.crouch * into);
    breathe(pose, 0);
    trunk(pose, {nod: RUMMAGE.nod * into, tilt: RUMMAGE.wiggle * digging * into});
    pose.bendAbove("spine", {x: (RUMMAGE.lean + RUMMAGE.wiggle * digging) * into});
    armsAtRest(pose, stance);
    const [x, y, z] = RUMMAGE.hands;
    for (const [hand, way] of into ? [["l", 1], ["r", -1]] : []) {
        const dug = pose.carried(new THREE.Vector3(SIDES[hand] * x, y, z + way * RUMMAGE.dig * digging));
        armToward(pose, hand, into, pose.withinReach(hand, dug, 0.97), undefined, RUMMAGE.elbow);
    }
    RUMMAGED.forEach((name, index) => {
        const flung = flungAt(index, t, pose.throws ?? undefined);
        if (flung) pose.standProp(name, [flung.at[0], flung.at[1], flung.at[2] + RUMMAGE.crouch * into], {x: flung.turn, z: flung.turn / 3}, 1 - flung.landed);
    });
    if (pose.posture === "stand") pose.revolve(SIDES[side] * RUMMAGE.turn * into);
}

// The figure types on and stops to think now and then at the laptop, thinking as it does anywhere: its head tilted up and aside, its
// finger at its cheek and its eyes glancing up, under the thought cloud (acts.js type_ponder), the other hand tapping slowly at the keys
// with a soft lift and return, never changing velocity abruptly at contact or at the loop's seam
function type_ponder(pose, stance, t) {
    const side = freeSide(stance);
    const sign = SIDES[side];
    const [x, y, z] = TYPING_HANDS;
    breathe(pose, t);
    trunk(pose, {lean: 2, nod: PONDERING.nod / 2 + 2 * waveOf(t), tilt: -sign * PONDERING.tilt * 0.7});
    handsTo(pose, stance, 1, [x, y, z + 0.03 * Math.max(waveOf(t, 2), 0) ** 2]);
    fingerAtCheek(pose, side, 1);
    pose.holdLaptop();
    pose.glanceEyes(PONDERING.glance[0], -sign * PONDERING.glance[1]);
}

// The figure wipes its brow with the back of the free hand in a break from the work, and blows out
function wipe_brow(pose, stance, t) {
    const {u, ready} = gestureTime(t, ACTING.greetingFrames);
    const across = swell(u, 0.3, 0.75);
    const side = freeSide(stance);
    const sign = SIDES[side];
    breathe(pose, 0);
    trunk(pose, {lean: -4 * ready, nod: -10 * ready});
    armsAtRest(pose, stance, ready ? [side] : []);
    pose.lift(`shoulder_${side}`, {y: -0.32 * ready, z: 0.4 * ready});
    faceContactHand(pose, side, ready, between3([0.6, -0.93, 3.35], [0.15, -0.93, 3.35], across), {y: -sign * 110}, new THREE.Vector3(sign * HAND.grip, 0.148, 0));
    if (ready) emptyHand(pose);
    pose.shutEyes(1 - 0.6 * across);
}

// The figure waves up at the UFO with the free hand, stepping back as the watch does
function wave_up(pose, stance, t) {
    const {back} = pose.sky ?? {back: 0};
    pose.lift("root", {y: SKY.step * back, z: SKY.hop * Math.sin(Math.PI * back)});
    breathe(pose, t);
    trunk(pose, {lean: -SKY.lean * back});
    const side = freeSide(stance);
    armsAtRest(pose, stance, [side]);
    waveArm(pose, side, t);
    emptyHand(pose);
    eyesAs(pose, "amused");
}

// What a posture does to the legs of whatever clip is drawn in it: what it sets before the clip poses the body, and what it lays over the
// legs after. Standing, the clip has the legs to itself, and so does a clip that poses its own `legs`, as the push walks on bent knees.
export const LEGS = {
    sit: {under: seat, over: seatedLegs},
    lounge: {under: loungedSeat, over: loungedLegs},
    composed: {under: composedSeat, over: composedLegs},
    walk: {under: strideUnder, over: strideLegs},
};

// The postures a clip is drawn in: a gesture standing, seated on an edge, lounging or sitting composed on a floor's top or on the move, its legs laid by the posture; a move of the whole
// body on its feet alone; a hang from its hands alone; and the laptop only on a lap
const GESTURE = ["stand", "sit", "lounge", "composed", "walk"];
const MOVE = ["stand"];
// an act made standing or wherever the figure sits, on an edge or a floor, as the telephone call is, which never stands it up
const STANDING_OR_SEATED = ["stand", "sit", "composed"];
const HANGING = ["hang"];
const ON_A_LAP = ["sit", "lounge"];
// a gesture whose hands are both up off the floor, so never drawn lounging or sitting composed, where both hands lean on it
const HANDS_UP = ["stand", "sit", "walk"];
// the seconds the figure types at its laptop, once it has started, before anything else may take it off it
export const TYPING_SECONDS = 5;

// Every clip plays out before another starts, so the figure never reads as cut off: one that plays once to its end, a loop to the end of
// its cycle or of the stretch it names as `leaves`. An `interruptible` clip gives way the moment something else is wanted instead, as the
// walk does the moment there is nowhere left to go and a fall the moment its feet meet the ground; a beat, a reaction, a jump or a
// landing never is. A clip that names `marks` has the page draw its mark drifting up from the head in the frames it names, from one to
// the next of each pair: the Z of sleep, the notes of a whistled tune. A clip that `cuts` in takes over at once from whatever plays, as the
// figure stops what it does to watch the UFO or swats at a tickle. Every clip declares its `head`, how strongly it keeps its own head
// against a look (looks.js HEAD); one that holds it, as climbing the ladder, pushing a parcel or thinking, is never turned toward the viewer
// for a look in the eyes either. A clip that `holds` plays on whatever comes, never cut off, as the eagerness for a
// run's end does. A clip that names `least` plays at least that many seconds before anything else may
// take over, the beats waiting behind it, as typing does; one that is `aside` is drawn seated turned aside from the viewer, never square
// to it, as at the laptop.

export const CLIPS = [
    {name: "newest_scoot", head: HEAD.alone, frames: NEWEST_ASIDE.frames, fps: NEWEST_ASIDE.fps, loops: false, legs: true, postures: ["sit", "lounge", "composed"], pose: newest_scoot},
    {name: "idle", head: HEAD.free, frames: 24, fps: 8, loops: true, leaves: 8, postures: GESTURE, pose: idle},
    {name: "nod", head: HEAD.gestures, frames: 10, fps: 12, loops: false, postures: GESTURE, pose: nod},
    {name: "hand_rub", head: HEAD.gestures, frames: ACTS.hand_rub.frames, fps: ACTS.hand_rub.fps, loops: false, postures: MOVE, pose: hand_rub},
    {name: "ponder", head: HEAD.holds, frames: ACTS.ponder.frames, fps: ACTS.ponder.fps, loops: false, postures: GESTURE, pose: thinkingClip(ACTS.ponder)},
    {name: "think_cloud", head: HEAD.holds, frames: ACTS.think_cloud.frames, fps: ACTS.think_cloud.fps, loops: false, postures: GESTURE, pose: thinkingClip(ACTS.think_cloud)},
    {name: "got_it", head: HEAD.holds, frames: ACTS.got_it.frames, fps: ACTS.got_it.fps, loops: false, postures: GESTURE, pose: thinkingClip(ACTS.got_it)},
    {name: "shake", head: HEAD.gestures, frames: 12, fps: 12, loops: false, postures: GESTURE, pose: shake},
    {name: "wave", head: HEAD.gestures, frames: 12, fps: 12, loops: true, postures: GESTURE, pose: wave},
    {name: "celebrate", head: HEAD.gestures, frames: 12, fps: 10, loops: true, postures: MOVE, pose: celebrate},
    {name: "sleep", head: HEAD.holds, frames: ACTING.yawnFrames + SLEEP_FRAMES, intro: ACTING.yawnFrames, leaves: SLEEP_FRAMES, fps: 6, loops: true, postures: GESTURE, marks: {mark: "Z", frames: [[ACTING.yawnFrames, ACTING.yawnFrames + SLEEP_FRAMES]]}, pose: sleep},
    {name: "walk", head: HEAD.free, frames: 12, fps: 12, loops: true, interruptible: true, postures: MOVE, pose: walk},
    {name: "run", head: HEAD.free, frames: 16, fps: 16, loops: true, interruptible: true, postures: MOVE, pose: run},
    {name: "walk_in", head: HEAD.free, frames: 40, fps: 12, loops: false, postures: MOVE, pose: walk_in},
    {name: "run_in", head: HEAD.free, frames: 28, fps: 12, loops: false, postures: MOVE, pose: run_in},
    {name: "pull_ups", head: HEAD.holds, frames: 24, fps: 10, loops: true, postures: MOVE, pose: pull_ups},
    {name: "ladder_climb", head: HEAD.holds, frames: 16, fps: 8, loops: true, interruptible: true, postures: MOVE, pose: ladder_climb},
    {name: "hang_l", head: HEAD.holds, frames: 24, fps: 8, loops: true, leaves: 8, postures: HANGING, pose: dangle("l")},
    {name: "hang_r", head: HEAD.holds, frames: 24, fps: 8, loops: true, leaves: 8, postures: HANGING, pose: dangle("r")},
    {name: "enter", head: HEAD.gestures, frames: 36, fps: 12, loops: false, postures: MOVE, pose: enter},
    {name: "exit", head: HEAD.gestures, frames: 28, fps: 12, loops: false, postures: MOVE, pose: exit},
    {name: "search", head: HEAD.holds, frames: 80, fps: 10, loops: true, postures: ["stand"], pose: search},
    {name: "glass_bubble", head: HEAD.free, frames: 48, fps: 10, loops: true, postures: ["stand"], pose: glass_bubble},
    {name: "lean", head: HEAD.free, frames: 48, fps: 8, loops: true, leaves: 24, postures: ["stand"], pose: lean},
    {name: "read", head: HEAD.holds, frames: READ_FRAMES, fps: READING.fps, loops: true, intro: READING.intro, outro: READING.outro, leaves: READING.pageEvery, postures: GESTURE, pose: read},
    {name: "write", head: HEAD.holds, frames: HELD_FRAMES, intro: ACTING.intro, outro: ACTING.outro, leaves: ACTING.hold, fps: ACTING.fps, loops: true, postures: GESTURE, pose: writing},
    {name: "waiting", head: HEAD.free, frames: WAIT_FRAMES, intro: WAIT.intro, outro: WAIT.outro, leaves: WAIT.hold, fps: ACTING.fps, loops: true, postures: ["stand", "sit"], pose: waiting},
    {name: "compacting", head: HEAD.gestures, frames: HELD_FRAMES, intro: ACTING.intro, outro: ACTING.outro, leaves: ACTING.hold, fps: ACTING.compactFps, loops: true, postures: GESTURE, pose: compacting},
    {name: "yawn", head: HEAD.gestures, frames: ACTING.yawnFrames, fps: ACTING.fps, loops: false, postures: GESTURE, pose: yawn},
    {name: "rest", head: HEAD.free, frames: REST.frames, fps: REST.fps, loops: false, postures: MOVE, marks: {mark: "♪", frames: REST.tunes.map((tune) => tune.map((share) => share * REST.frames))}, pose: rest},
    {name: "whistle", head: HEAD.gestures, frames: ACTING.pastimeFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["coach"], pose: whistle},
    {name: "phone_call", head: HEAD.alone, frames: ACTS.phone_call.frames, fps: ACTS.phone_call.fps, loops: false, postures: STANDING_OR_SEATED, pose: phone_call},
    {name: "sip", head: HEAD.gestures, frames: ACTING.pastimeFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["colleague"], pose: sip},
    {name: "groove", head: HEAD.gestures, frames: HEADPHONES.frames, fps: HEADPHONES.fps, loops: false, postures: GESTURE, voices: ["homie"], pose: groove},
    {name: "shield_polish", head: HEAD.gestures, frames: ACTING.pastimeFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: shieldPolish},
    {name: "bow", head: HEAD.gestures, frames: ACTING.greetingFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["butler"], pose: bow},
    {name: "salute", head: HEAD.gestures, frames: ACTING.greetingFrames, fps: ACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: salute},
    {name: "startled", head: HEAD.gestures, frames: ACTING.hopFrames, fps: ACTING.fps, loops: false, postures: GESTURE, pose: startled},
    {name: "stumble", head: HEAD.gestures, frames: ACTING.stumbleFrames, fps: ACTING.fps, loops: false, postures: ["walk"], pose: stumble},
    {name: "glance", head: HEAD.holds, frames: ACTING.greetingFrames, fps: ACTING.fps, loops: false, postures: GESTURE, pose: glance},
    {name: "work", head: HEAD.free, frames: WORK.blows * WORK.blowFrames, fps: WORK.fps, loops: true, postures: ["stand", "sit"], pose: work},
    {name: "inspect", head: HEAD.holds, frames: INSPECTING.frames, fps: INSPECTING.fps, loops: true, postures: ["stand"], pose: inspect},
    {name: "point", head: HEAD.gestures, frames: 12, fps: 8, loops: true, postures: GESTURE, pose: point},
    {name: "watch", head: HEAD.free, frames: 8, fps: 8, loops: true, cuts: true, postures: ["stand", "sit"], pose: watch},
    {name: "push", head: HEAD.holds, frames: SHOVE.intro + SHOVE.stride, intro: SHOVE.intro, fps: SHOVE.fps, loops: true, legs: true, postures: ["walk", "stand"], pose: push},
    {name: "jump", head: HEAD.gestures, frames: 16, fps: 20, loops: false, postures: MOVE, pose: jump},
    {name: "tickle_swat", head: HEAD.free, frames: 24, fps: 16, loops: false, cuts: true, postures: GESTURE, pose: tickle_swat},
    {name: "disco", head: HEAD.holds, frames: ACTS.disco.frames, fps: ACTS.disco.fps, loops: false, postures: MOVE, pose: disco},
    {name: "bug_shot", head: HEAD.holds, frames: ACTS.bug_shot.frames, fps: ACTS.bug_shot.fps, loops: false, postures: MOVE, pose: bug_shot},
    {name: "bug_smash", head: HEAD.holds, frames: ACTS.bug_smash.frames, fps: ACTS.bug_smash.fps, loops: false, postures: MOVE, pose: bug_smash},
    {name: "halo", head: HEAD.gestures, frames: ACTS.halo.frames, fps: ACTS.halo.fps, loops: false, postures: MOVE, pose: halo},
    {name: "repent", head: HEAD.holds, frames: ACTS.repent.frames, fps: ACTS.repent.fps, loops: false, postures: MOVE, rises: true, pose: repent},
    {name: "pogo", head: HEAD.holds, frames: ACTS.pogo.frames, fps: ACTS.pogo.fps, loops: false, postures: MOVE, pose: pogo},
    {name: "fall", head: HEAD.gestures, frames: 12, fps: 12, loops: false, interruptible: true, postures: MOVE, pose: fall},
    {name: "backflip", head: HEAD.holds, frames: 22, fps: 20, loops: false, postures: MOVE, pose: backflip},
    {name: "land", head: HEAD.gestures, frames: LANDING.frames, fps: LANDING.fps, loops: false, postures: MOVE, pose: land},
    {name: "type", head: HEAD.holds, frames: 24, fps: 8, loops: true, leaves: 8, least: TYPING_SECONDS, aside: true, postures: ON_A_LAP, pose: type},
    {name: "joy", head: HEAD.gestures, frames: ACTS.joy.frames, fps: ACTS.joy.fps, loops: false, postures: GESTURE, pose: joy},
    {name: "dismay", head: HEAD.gestures, frames: 28, fps: 10, loops: false, postures: GESTURE, pose: dismay},
    {name: "stretch", head: HEAD.gestures, frames: 24, fps: 8, loops: false, postures: GESTURE, pose: stretch},
    {name: "squire_chase", head: HEAD.gestures, frames: 24, fps: 12, loops: false, postures: MOVE, pose: squire_chase},
    {name: "pointed", head: HEAD.gestures, frames: 20, fps: 10, loops: false, postures: MOVE, pose: pointed},
    {name: "hat_tip", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, holds: true, postures: ["stand", "sit"], voices: ["butler"], pose: hat_tip},
    {name: "monocle", head: HEAD.holds, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["butler"], pose: monocle},
    {name: "toast", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["butler"], pose: toast},
    {name: "shaka", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["homie"], pose: shaka},
    {name: "shades", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["homie"], pose: shades},
    {name: "fire", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["homie"], pose: fire},
    {name: "thumbs_up", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["colleague"], pose: thumbs_up},
    {name: "peer", head: HEAD.holds, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["colleague"], pose: peer},
    {name: "thanks", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, pose: thanks},
    {name: "party_popper", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["coach"], pose: party_popper},
    {name: "flex", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["coach"], pose: flex},
    {name: "trophy", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["coach"], pose: trophy},
    {name: "sword", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: sword},
    {name: "shield_up", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: shield_up},
    {name: "castle", head: HEAD.gestures, frames: REACTING.frames, fps: REACTING.fps, loops: false, postures: GESTURE, voices: ["squire"], pose: castle},
    {name: "ask_sign", head: HEAD.gestures, frames: ACTS.ask_sign.frames, fps: ACTS.ask_sign.fps, loops: false, postures: GESTURE, pose: ask_sign},
    {name: "scroll", head: HEAD.holds, frames: ACTS.scroll.frames, fps: ACTS.scroll.fps, loops: false, postures: GESTURE, pose: scroll},
    {name: "file_card", head: HEAD.gestures, frames: ACTS.file_card.frames, fps: ACTS.file_card.fps, loops: false, postures: MOVE, pose: file_card},
    {name: "pack_box", head: HEAD.gestures, frames: ACTS.pack_box.intro + ACTS.pack_box.hold + ACTS.pack_box.outro, intro: ACTS.pack_box.intro, outro: ACTS.pack_box.outro, leaves: ACTS.pack_box.hold, fps: ACTS.pack_box.fps, loops: true, postures: MOVE, pose: pack_box},
    {name: "press", head: HEAD.gestures, frames: ACTS.press.intro + ACTS.press.hold + ACTS.press.outro, intro: ACTS.press.intro, outro: ACTS.press.outro, leaves: ACTS.press.hold, fps: ACTS.press.fps, loops: true, postures: GESTURE, pose: press},
    {name: "vacuum", head: HEAD.gestures, frames: ACTS.vacuum.intro + ACTS.vacuum.hold + ACTS.vacuum.outro, intro: ACTS.vacuum.intro, outro: ACTS.vacuum.outro, leaves: ACTS.vacuum.hold, fps: ACTS.vacuum.fps, loops: true, postures: MOVE, pose: vacuum},
    {name: "eager", head: HEAD.free, frames: EAGERNESS.intro + EAGERNESS.hold + EAGERNESS.outro, intro: EAGERNESS.intro, outro: EAGERNESS.outro, leaves: EAGERNESS.hold, fps: EAGERNESS.fps, loops: true, holds: true, postures: MOVE, pose: eager},
    {name: "fume", head: HEAD.gestures, frames: ACTS.fume.frames, fps: ACTS.fume.fps, loops: false, cuts: true, postures: MOVE, pose: fume},
    {name: "look_left", head: HEAD.holds, frames: GLANCE.frames, fps: GLANCE.fps, loops: false, postures: GESTURE, pose: glanceAt(-1, 0)},
    {name: "look_right", head: HEAD.holds, frames: GLANCE.frames, fps: GLANCE.fps, loops: false, postures: GESTURE, pose: glanceAt(1, 0)},
    {name: "look_up", head: HEAD.holds, frames: GLANCE.frames, fps: GLANCE.fps, loops: false, postures: GESTURE, pose: glanceAt(0, 1)},
    {name: "tumble", head: HEAD.holds, frames: TUMBLE.frames, fps: TUMBLE.fps, loops: false, postures: MOVE, pose: tumble},
    {name: "ledge_sit", head: HEAD.free, frames: 32, fps: 8, loops: true, leaves: 8, postures: ON_A_LAP, pose: ledge_sit},
    {name: "pocket_watch", head: HEAD.holds, frames: 48, fps: 10, loops: true, postures: ON_A_LAP, pose: pocket_watch},
    {name: "doze", head: HEAD.holds, frames: 48, fps: 8, loops: true, leaves: 24, postures: ON_A_LAP, pose: doze},
    {name: "hop_up", head: HEAD.free, frames: 8, fps: 16, loops: true, interruptible: true, cuts: true, postures: MOVE, pose: hop_up},
    {name: "rope_swing", head: HEAD.gestures, frames: ACTS.rope_swing.intro + ACTS.rope_swing.hold + ACTS.rope_swing.outro, intro: ACTS.rope_swing.intro, outro: ACTS.rope_swing.outro, leaves: ACTS.rope_swing.hold, fps: ACTS.rope_swing.fps, loops: true, postures: ["sit"], pose: rope_swing},
    {name: "chute", head: HEAD.holds, frames: ACTS.chute.frames, fps: ACTS.chute.fps, loops: true, interruptible: true, cuts: true, postures: MOVE, pose: chute},
    {name: "binoculars", head: HEAD.holds, frames: ACTS.binoculars.frames, fps: ACTS.binoculars.fps, loops: true, postures: HANDS_UP, pose: binoculars},
    {name: "rummage", head: HEAD.holds, frames: ACTS.rummage.frames, fps: ACTS.rummage.fps, loops: true, postures: MOVE, pose: rummage},
    {name: "type_ponder", head: HEAD.holds, frames: ACTS.type_ponder.frames, fps: ACTS.type_ponder.fps, loops: true, leaves: 8, least: TYPING_SECONDS, aside: true, postures: ON_A_LAP, pose: type_ponder},
    {name: "wipe_brow", head: HEAD.gestures, frames: ACTING.greetingFrames, fps: ACTING.fps, loops: false, postures: GESTURE, pose: wipe_brow},
    {name: "wave_up", head: HEAD.gestures, frames: 12, fps: 12, loops: true, cuts: true, postures: ["stand", "sit"], pose: wave_up},
    {name: "tantrum", head: HEAD.gestures, frames: ACTS.tantrum.frames, fps: ACTS.tantrum.fps, loops: false, cuts: true, postures: MOVE, pose: tantrum},
];

// A part carried by the bones it is skinned to, its outline's hull pushed out along its own normals by `push`
const SKINNED = /* glsl */ `
    #include <common>
    #include <skinning_pars_vertex>
    attribute vec3 hullNormal;
    uniform float push;
    varying vec3 worldNormal;
    varying vec3 worldPosition;
    varying vec3 localPosition;

    void main() {
        localPosition = position;
        #include <beginnormal_vertex>
        #ifdef HULL
            objectNormal = hullNormal;
        #endif
        #include <skinbase_vertex>
        #include <skinnormal_vertex>
        #include <begin_vertex>
        #include <skinning_vertex>
        transformed += normalize(objectNormal) * push;
        worldNormal = normalize(mat3(modelMatrix) * objectNormal);
        worldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
    }
`;

// Every flat part is lit by the light bulb over the head too while it glows (LIGHT_BULB): as warm as `bulbGlow`, on the faces turned to the
// bulb at `bulbAt`, weaker with the square of the distance by `bulbFalloff`
const FLAT = /* glsl */ `
    uniform vec3 colour;
    uniform float alpha;
    uniform vec3 light;
    uniform vec3 shade;
    uniform float litFrom;
    uniform vec3 bulbAt;
    uniform vec3 bulbGlow;
    uniform float bulbFalloff;
    varying vec3 worldNormal;
    varying vec3 worldPosition;

    void main() {
        vec3 normal = normalize(worldNormal);
        if (!gl_FrontFacing) {
            normal = -normal;
        }
        float lit = step(litFrom, dot(normal, light));
        vec3 toBulb = bulbAt - worldPosition;
        float bulb = max(dot(normal, normalize(toBulb)), 0.0) / (1.0 + dot(toBulb, toBulb) * bulbFalloff);
        gl_FragColor = vec4(colour * mix(shade, vec3(1.0), lit) + bulbGlow * bulb * mix(colour, vec3(1.0), 0.35), alpha);
        #include <colorspace_fragment>
    }
`;

// The visor reads as a screen of the grid's pixels (visorPixels.js GRID): its face one plain `glass` colour, near-black and unshaded, with
// nothing laid over it, no grid of unlit pixels, no glare and no rim, so only the lit pixels show on it; each lit pixel glows in the colour
// `pixels` holds for it, drawn brighter than that colour and brightest at its middle (`shine`); the lines between the pixels are the
// glass, `gap` of a pixel wide and never under `line` of the screen's own pixels however small the figure is drawn, nor over half a
// pixel, so each pixel reads on its own,
// and lit pixels are `dark` as bright there under a dance's band. It is drawn on its own, supersampled and never softened (Stage.drawScreen). It is
// lit whole by a dance (visor.js discoScreen): a band about its middle reaching `across` and `open` of the way to its sides and its top
// and bottom, white with `flash` and else `glow`, as strong as `lit`.
// `source`'s part at (x, y), `width` by `height`, drawn over the whole of `canvas`, cleared first, smoothed and never blurred
const drawSmoothed = (canvas, source, x, y, width, height) => {
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.filter = "none";
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(source, x, y, width, height, 0, 0, canvas.width, canvas.height);
};
export const HIDDEN_PARTS = ["headphones"];

export const SCREEN = {
    gap: 0.16, dark: 0.35, glass: [0.006, 0.007, 0.01],
    // a lit pixel is drawn brighter than its colour, brightest at its middle
    shine: {lift: 1, core: 0.55, tightness: 6},
    framesBehind: 6,
};
const SCREEN_FRAGMENT = /* glsl */ `
    uniform vec3 glow;
    uniform float lit;
    uniform float across;
    uniform float open;
    uniform float flash;
    uniform float core;
    uniform vec2 middle;
    uniform vec2 extent;
    uniform sampler2D pixels;
    uniform vec2 grid;
    uniform float gap;
    uniform float dark;
    uniform vec3 glass;
    uniform vec3 shine;
    varying vec3 localPosition;

    // the colour and how lit a pixel of the grid is, by its column and row
    vec4 pixelAt(vec2 cell) {
        return texture2D(pixels, (clamp(cell, vec2(0.0), grid - 1.0) + 0.5) / grid);
    }

    void main() {
        vec2 from = abs(localPosition.xy - middle) / extent;
        float band = step(from.x, across) * step(from.y, open);
        vec2 place = clamp(vec2(localPosition.x - middle.x + extent.x, middle.y + extent.y - localPosition.y) / (2.0 * extent), 0.0, 0.9999) * grid;
        vec2 cell = fract(place);
        // the dark lines between the pixels, gap of each pixel wide, centred on the borders between
        // pixels, their edges blended over one drawn fragment so a screen drawn small shows no jagged steps or shimmer
        vec2 lines = clamp(vec2(gap), 0.0, 0.5);
        vec2 border = min(cell, 1.0 - cell);
        vec2 blend = fwidth(place) * 0.5;
        vec2 edges = smoothstep(lines * 0.5 - blend, lines * 0.5 + blend, border);
        float pixel = edges.x * edges.y;
        vec4 shown = pixelAt(floor(place));
        // the face: the glass alone, one plain colour, the lit pixels the only thing on it
        vec3 screen = glass;
        vec2 offMiddle = cell - 0.5;
        vec3 glowing = shown.rgb * (1.0 + shine.x) + shine.y * exp(-dot(offMiddle, offMiddle) * shine.z) * mix(shown.rgb, vec3(1.0), 0.5);
        vec3 drawn = mix(screen, glowing, shown.a * pixel);
        float centre = max(1.0 - length(from), 0.0);
        vec3 shine = glow * lit * mix(dark, 1.0, pixel);
        vec3 lighted = mix(shine + (vec3(1.0) - glow) * core * centre * centre * pixel, vec3(1.0), flash);
        gl_FragColor = vec4(mix(drawn * (1.0 - step(0.001, lit + flash) * 0.6), lighted, band * max(lit, flash)), 1.0);
        #include <colorspace_fragment>
    }
`;

// the visor's material: a flat part's, drawn as a screen, its pixels and its band measured across the visor's own bounds; the
// pixels it shows are the `pixels` texture's, one texel each, filled in by showPixels
export function screenMaterial(mesh) {
    const material = flatMaterial(mesh);
    material.fragmentShader = SCREEN_FRAGMENT;
    const bounds = new THREE.Box3().setFromBufferAttribute(mesh.geometry.attributes.position);
    const middle = bounds.getCenter(new THREE.Vector3());
    const extent = bounds.getSize(new THREE.Vector3()).multiplyScalar(0.5);
    Object.assign(material.uniforms, {
        glow: {value: new THREE.Vector3()}, lit: {value: 0}, across: {value: 0}, open: {value: 0}, flash: {value: 0}, core: {value: VISOR.core},
        middle: {value: new THREE.Vector2(middle.x, middle.y)}, extent: {value: new THREE.Vector2(extent.x, extent.y)},
        pixels: {value: pixelTexture()}, grid: {value: new THREE.Vector2(GRID.columns, GRID.rows)}, gap: {value: SCREEN.gap}, dark: {value: SCREEN.dark},
        glass: {value: new THREE.Vector3(...SCREEN.glass)},
        shine: {value: new THREE.Vector3(SCREEN.shine.lift, SCREEN.shine.core, SCREEN.shine.tightness)},
    });
    return material;
}

// The visor screen set into the head: `depth` of the figure's units behind the head's front surface at its most forward, about half a
// centimetre on a human head, the head taken as a human's 15 cm across (the head shell is 1.83 units across); and the head's surface
// within the screen's outline set `behind` it further, further than the outline drawn round the head stands out from it (OUTLINE_WIDTH),
// so neither the head nor its outline shows through the screen
export const SCREEN_INSET = {depth: 0.06, behind: OUTLINE_WIDTH + 0.014};

// the meshes the head is made of, which the screen is set into: the head's own shell, and a helmet's shell worn over it
const isHeadShell = (mesh) => mesh.name === "head_shell" || mesh.name.endsWith("__shell");

// The surface of `geometry` seen from the model's front, along -z: where along z it is at its most forward at `x`, `y`, or null where none
// of it is there. Its triangles are kept in a grid of `cell` squares across x and y, so each look tests only the few over that point.
export function frontOf(geometry, cell = 0.05) {
    const at = geometry.attributes.position;
    const corner = (index) => (geometry.index ? geometry.index.getX(index) : index);
    const count = geometry.index ? geometry.index.count : at.count;
    // a grid square by its column and row, as one number: the rows a figure's head spans stay far under the stride
    const square = (column, row) => column * 100003 + row;
    const squares = new Map();
    for (let first = 0; first < count; first += 3) {
        const triangle = [0, 1, 2].map((offset) => {
            const index = corner(first + offset);
            return {x: at.getX(index), y: at.getY(index), z: at.getZ(index)};
        });
        const [a, b, c] = triangle;
        const [left, right] = [Math.floor(Math.min(a.x, b.x, c.x) / cell), Math.floor(Math.max(a.x, b.x, c.x) / cell)];
        const [bottom, top] = [Math.floor(Math.min(a.y, b.y, c.y) / cell), Math.floor(Math.max(a.y, b.y, c.y) / cell)];
        for (let column = left; column <= right; column++) {
            for (let row = bottom; row <= top; row++) {
                const key = square(column, row);
                if (!squares.has(key)) squares.set(key, []);
                squares.get(key).push(triangle);
            }
        }
    }
    return (x, y) => (squares.get(square(Math.floor(x / cell), Math.floor(y / cell))) ?? []).reduce((front, triangle) => {
        const z = heightIn(triangle, x, y);
        return z === null || (front !== null && front >= z) ? front : z;
    }, null);
}

// where along z the triangle `[a, b, c]` is over `x`, `y`, or null when the point is not over it, its edges counted as over it
function heightIn([a, b, c], x, y) {
    const area = (b.x - a.x) * (c.y - a.y) - (c.x - a.x) * (b.y - a.y);
    if (Math.abs(area) < 1e-12) return null;
    const u = ((b.x - x) * (c.y - y) - (c.x - x) * (b.y - y)) / area;
    const v = ((c.x - x) * (a.y - y) - (a.x - x) * (c.y - y)) / area;
    const w = 1 - u - v;
    return u >= -1e-9 && v >= -1e-9 && w >= -1e-9 ? u * a.z + v * b.z + w * c.z : null;
}

// the most forward of the surfaces `fronts` (frontOf) at `x`, `y`, or null where none of them is there
const mostForward = (fronts, x, y) => fronts.map((front) => front(x, y)).reduce((most, z) => (z === null || (most !== null && most >= z) ? most : z), null);

// The `screen` geometry set into the head whose shells are the `shells` geometries, all in the model's own axes: moved back until its
// most forward point is SCREEN_INSET.depth behind the head's front surface, and every point of the shells within the screen's outline set
// SCREEN_INSET.behind the screen, the pocket it sits in
export function setScreenIn(screen, shells) {
    const head = shells.map((shell) => frontOf(shell));
    const at = screen.attributes.position;
    let proud = -Infinity;
    for (let index = 0; index < at.count; index++) proud = Math.max(proud, at.getZ(index) - (mostForward(head, at.getX(index), at.getY(index)) ?? Infinity));
    screen.translate(0, 0, -(proud + SCREEN_INSET.depth));
    const glass = frontOf(screen);
    for (const shell of shells) {
        const points = shell.attributes.position;
        for (let index = 0; index < points.count; index++) {
            const behind = glass(points.getX(index), points.getY(index));
            if (behind !== null && points.getZ(index) > behind - SCREEN_INSET.behind) points.setZ(index, behind - SCREEN_INSET.behind);
        }
        points.needsUpdate = true;
    }
}

// the pictures `lit` the face passes through, each shown in turn for one of the screen's frames, `frame` counting them, FRAMES_PER_SECOND
// of them a second, or TICKER.fps while words scroll across it: a picture shorter than a frame, such as the shut eye of a blink, still
// shows, and no more than SCREEN.framesBehind wait to be shown
export function screenFrame(material, lit, frame) {
    const waiting = (material.userData.waiting ??= []);
    const key = lit.map(({column, row, colour}) => `${column},${row},${colour.join(",")}`).join(";");
    if (key !== (waiting.at(-1)?.key ?? material.userData.shownKey)) waiting.push({key, lit});
    if (waiting.length > SCREEN.framesBehind) waiting.splice(0, waiting.length - SCREEN.framesBehind);
    if (material.userData.frame === frame || !waiting.length) return;
    const next = waiting.shift();
    showPixels(material.uniforms.pixels.value, next.lit);
    material.userData.shownKey = next.key;
    material.userData.frame = frame;
}

// a texture of one texel for each of the grid's pixels, row 0 the top, all of them off
export function pixelTexture() {
    const texture = new THREE.DataTexture(new Uint8Array(GRID.columns * GRID.rows * 4), GRID.columns, GRID.rows);
    texture.magFilter = texture.minFilter = THREE.NearestFilter;
    texture.needsUpdate = true;
    return texture;
}

// the pixels `lit` (visorPixels.js litPixels) shown in `texture`, every other one off
export function showPixels(texture, lit) {
    const data = texture.image.data;
    data.fill(0);
    for (const {column, row, colour} of lit) data.set([...colour.map((part) => Math.round(part * 255)), 255], (row * GRID.columns + column) * 4);
    texture.needsUpdate = true;
}

const LINE = /* glsl */ `
    uniform vec3 colour;
    uniform float alpha;

    void main() {
        gl_FragColor = vec4(colour, alpha);
        #include <colorspace_fragment>
    }
`;

// a quantized glb scales each mesh up from small units, so the outline is pushed in the mesh's own units
const vertexUniforms = (mesh, push) => ({push: {value: push / mesh.getWorldScale(new THREE.Vector3()).x}});

function flatMaterial(mesh) {
    const {r, g, b} = mesh.material.color;
    return new THREE.ShaderMaterial({
        vertexShader: SKINNED,
        fragmentShader: FLAT,
        side: THREE.DoubleSide,
        uniforms: {
            ...vertexUniforms(mesh, 0),
            colour: {value: new THREE.Vector3(r, g, b)},
            alpha: {value: 1},
            light: {value: LIGHT_FROM.clone().normalize().applyMatrix4(TO_GLB)},
            shade: {value: SHADE},
            litFrom: {value: LIT_FROM},
            bulbAt: {value: new THREE.Vector3()},
            bulbGlow: {value: new THREE.Vector3()},
            bulbFalloff: {value: LIGHT_BULB.falloff},
        },
    });
}

function outlineMaterial(mesh) {
    return new THREE.ShaderMaterial({
        vertexShader: SKINNED,
        fragmentShader: LINE,
        side: THREE.BackSide,
        defines: {HULL: ""},
        uniforms: {...vertexUniforms(mesh, OUTLINE_WIDTH), colour: {value: OUTLINE_COLOUR}, alpha: {value: 1}},
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
    const glb = await transport.raw(url);
    if (glb.ok) {
        return glb.arrayBuffer();
    }
    const text = await transport.raw(`${url}.txt`).then((response) => response.text());
    return Uint8Array.from(atob(text), (character) => character.charCodeAt(0)).buffer;
}

// The figure of one voice from its glb, its worn pieces drawn and the body parts they cover left out (rig.assemble)
export async function loadFigure(url, wardrobe, voice) {
    const [bytes, manifest] = await Promise.all([glbBytes(url), transport.raw(wardrobe).then((response) => response.json())]);
    const bare = voice === "bare";
    const covered = new Set((bare ? [] : manifest.outfits[voice]).flatMap((item) => manifest.assets[item].hide_base_parts));
    return figureOf(bytes, voice, DECODER, (mesh) => !covered.has(mesh.name) && !(bare && mesh.userData.item));
}

// the voices dressed over their glb, including replacement accessories with rigid supports
const DRESSES = {butler: dressButler, homie: dressHomie};

// The figure in a glb's bytes, posed by the clips: every mesh `shows` keeps is drawn, shaded and outlined; `decoder` is where Draco's decoder is served
export async function figureOf(bytes, voice, decoder, shows = () => true) {
    const gltf = await new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath(decoder)).parseAsync(bytes, "");
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);
    const found = [];
    scene.traverse((node) => node.isSkinnedMesh && found.push(node));
    const meshes = (DRESSES[voice] ?? ((each) => each))(withoutEars(found));
    setScreenIn(meshes.find((mesh) => mesh.name === VISOR_MESH).geometry, meshes.filter(isHeadShell).map((mesh) => mesh.geometry));
    const screens = [];
    const visorHulls = [];
    for (const mesh of meshes) {
        mesh.visible = shows(mesh) && !LEFT_OUT.has(mesh.userData.item) && mesh.userData.item !== TABLET;
        addHullNormals(mesh.geometry);
        const hull = new THREE.SkinnedMesh(mesh.geometry, outlineMaterial(mesh));
        hull.bind(mesh.skeleton, mesh.bindMatrix);
        hull.visible = mesh.visible;
        mesh.userData.hull = hull;
        hull.userData.item = mesh.userData.item;
        hull.frustumCulled = mesh.frustumCulled = false;
        mesh.material = mesh.name === VISOR_MESH ? screenMaterial(mesh) : flatMaterial(mesh);
        if (mesh.name === VISOR_MESH) screens.push(mesh.material);
        if (mesh.name === VISOR_MESH) visorHulls.push(hull);
        mesh.parent.add(hull);
        hull.position.copy(mesh.position);
        hull.quaternion.copy(mesh.quaternion);
        hull.scale.copy(mesh.scale);
        // the eyes are drawn in the visor's pixels, never as the model's own eye parts
        if (mesh.name.startsWith("eye_")) mesh.visible = hull.visible = false;
        if (HIDDEN_PARTS.some((part) => mesh.name.startsWith(part))) mesh.visible = hull.visible = false;
    }
    const carried = meshes.filter((mesh) => mesh.visible);
    const busy = handsHolding(carried, BUSY_ITEMS);
    const tablet = meshes.filter((mesh) => mesh.userData.item === TABLET && shows(mesh));
    const stance = {
        voice,
        level: handsHolding(carried, LEVEL_ITEMS),
        busy,
        carried: handsHolding(carried, IN_HAND),
        free: new Set(Object.keys(SIDES).filter((side) => !busy.has(side))),
        tablet: handsHolding(tablet, new Set([TABLET])),
        shield: handsHolding(carried, new Set(["squire_shield"])),
    };
    const laptop = laptopOf();
    const book = bookOf();
    const propByName = propsOf();
    const wornHat = meshes.find((mesh) => mesh.name === "butler_top_hat");
    if (wornHat) propByName.get("top_hat").getObjectByName("top_hat_crown").material.uniforms.colour.value.copy(wornHat.material.uniforms.colour.value);
    scene.add(laptop, book, ...propByName.values());
    const headphones = voice === "homie" ? headphonesOf(shadedPart, meshes) : null;
    if (headphones) scene.add(headphones.root);
    const bulbLight = {bulbAt: {value: new THREE.Vector3()}, bulbGlow: {value: new THREE.Vector3()}};
    scene.traverse((node) => node.material?.uniforms?.bulbGlow && Object.assign(node.material.uniforms, bulbLight));
    const hulls = (shown) => shown.flatMap((mesh) => [mesh, mesh.userData.hull]);
    const inHand = carried.filter((mesh) => IN_HAND.has(mesh.userData.item));
    const stowable = hulls(carried.filter((mesh) => mesh.userData.item));
    return {scene, rig: rigOf(scene), stance, screens, visorHulls, laptop, book, propByName, props: [...propByName.values()], stowable, tablet: hulls(tablet), inHand: hulls(inHand), bulbLight, headphones};
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

// A block of 1U server units stacked (parcels.js PARCEL), in the same flat colours, for the parcels the figure builds: its front toward the
// viewer, tipped back by as much as shows the strip of its top, its front's bottom edge on the floor at the origin. Each unit's status
// lights run along the left of its front and its vent slits along the right, at these shares of the front's width, the lights' radius and
// the slits' width and height too, of its width and its unit's height
const UNIT_FRONT = {lights: [0.144, 0.267, 0.389, 0.511], light: 0.047, vents: [0.633, 0.711, 0.789, 0.867], vent: [0.033, 0.49]};
const UNIT_COLOURS = {front: 0x1c1e25, top: 0x2c2f39, side: 0x121318, vent: 0x050608, edge: 0x4a4e5c};

function serverBlockOf(perPixel) {
    const width = PARCEL.width * perPixel;
    const tilt = Math.asin(PARCEL.top / PARCEL.width);
    const unit = ((PARCEL.height - PARCEL.top) * perPixel) / Math.cos(tilt) / PARCEL.units;
    const [side, top, front] = [UNIT_COLOURS.side, UNIT_COLOURS.top, UNIT_COLOURS.front].map((colour) => new THREE.MeshBasicMaterial({color: colour}));
    const lights = [];
    const units = Array.from({length: PARCEL.units}, (_, index) => {
        const box = new THREE.Mesh(new THREE.BoxGeometry(width, unit, width), [side, side, top, side, front, side]);
        box.add(new THREE.LineSegments(new THREE.EdgesGeometry(box.geometry), new THREE.LineBasicMaterial({color: UNIT_COLOURS.edge})));
        box.position.set(0, unit * (index + 0.5), -width / 2);
        const onFront = (mesh, share) => {
            mesh.position.set(width * (share - 0.5), 0, width / 2 + 0.002);
            box.add(mesh);
            return mesh;
        };
        lights.push(...UNIT_FRONT.lights.map((share) => onFront(new THREE.Mesh(new THREE.CircleGeometry(width * UNIT_FRONT.light, 12), new THREE.MeshBasicMaterial()), share)));
        UNIT_FRONT.vents.forEach((share) => onFront(flat(new THREE.PlaneGeometry(width * UNIT_FRONT.vent[0], unit * UNIT_FRONT.vent[1]), UNIT_COLOURS.vent), share));
        return box;
    });
    const block = new THREE.Group();
    block.rotation.x = tilt;
    block.add(...units);
    const scene = new THREE.Scene();
    scene.add(block);
    scene.updateMatrixWorld(true);
    return {scene, lights, bounds: new THREE.Box3().setFromObject(block)};
}

// the block's lights as they shine at step `phase` of the blink (parcels.js brightness), lit `lit`
function lightBlock(block, lit, phase) {
    const dark = new THREE.Color(UNIT_COLOURS.front);
    block.lights.forEach((light, index) => {
        const shine = new THREE.Color().setRGB(...LIGHT_COLOURS[lit], THREE.SRGBColorSpace);
        light.material.color.copy(dark.clone().lerp(shine, brightness(lit, phase, index % UNIT_FRONT.lights.length)));
    });
}

// The UFO that takes the work away (parcels.js UFO), each part shaded and outlined as the figure's own are: a saucer UFO width pixels
// across, its hull turned from the profile `hull` (shares of its radius across and up from its middle), a band round its rim, a glass dome
// `dome` of the radius on top with a short antenna and its ball, lights round the rim, `lights` of them `light` of the radius each, and the
// lamp under its belly the beam shines from, `lamp` of the radius, UFO belly pixels below its middle as the page sees it. It is tipped
// `tilt` degrees toward the viewer, so its top and dome show, its middle at the picture's middle.
export const SAUCER = {
    hull: [[0, -0.27], [0.32, -0.29], [0.64, -0.2], [0.92, -0.06], [1, 0], [0.93, 0.07], [0.62, 0.15], [0.38, 0.19], [0, 0.2]],
    band: 0.04, dome: 0.4, antenna: [0.16, 0.05], lights: 10, light: 0.075, lamp: 0.26, tilt: 16,
    colours: {hull: 0xb9bdc8, band: 0x5d6170, dome: 0xcfe6ff, antenna: 0x5d6170, dark: 0x3a3d4a, lamp: 0xfff3a8, lit: [0xe8b84a, 0x6366f1]},
};

export function saucerOf(perPixel) {
    const radius = (UFO.width / 2) * perPixel;
    const saucer = new THREE.Group();
    saucer.name = "saucer";
    const hull = new THREE.LatheGeometry(SAUCER.hull.map(([across, up]) => new THREE.Vector2(across * radius, up * radius)), 48);
    shadedPart(saucer, "hull", hull, SAUCER.colours.hull);
    shadedPart(saucer, "band", new THREE.TorusGeometry(radius * 0.985, radius * SAUCER.band, 8, 64), SAUCER.colours.band).rotation.x = Math.PI / 2;
    const domeAt = SAUCER.hull.at(-1)[1] * radius * 0.9;
    shadedPart(saucer, "dome", new THREE.SphereGeometry(radius * SAUCER.dome, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), SAUCER.colours.dome, [0, domeAt, 0]);
    const [stalk, ball] = SAUCER.antenna.map((share) => share * radius);
    shadedPart(saucer, "antenna", new THREE.CylinderGeometry(ball * 0.25, ball * 0.25, stalk, 8), SAUCER.colours.antenna, [0, domeAt + radius * SAUCER.dome + stalk / 2, 0]);
    shadedPart(saucer, "ball", new THREE.SphereGeometry(ball, 12, 8), SAUCER.colours.lit[0], [0, domeAt + radius * SAUCER.dome + stalk, 0]);
    const lights = Array.from({length: SAUCER.lights}, (_, index) => {
        const turn = (index / SAUCER.lights) * Math.PI * 2;
        return shadedPart(saucer, `light_${index}`, new THREE.SphereGeometry(radius * SAUCER.light, 12, 8), SAUCER.colours.dark, [Math.sin(turn) * radius, 0, Math.cos(turn) * radius]);
    });
    const lampAt = -(UFO.belly * perPixel) / Math.cos(radians(SAUCER.tilt));
    shadedPart(saucer, "lamp", new THREE.CylinderGeometry(radius * SAUCER.lamp, radius * SAUCER.lamp * 1.15, radius * 0.07, 24), SAUCER.colours.lamp, [0, lampAt, 0]);
    saucer.rotation.x = radians(SAUCER.tilt);
    saucer.position.y = FRAMED_MIDDLE;
    const scene = new THREE.Scene();
    scene.add(saucer);
    scene.updateMatrixWorld(true);
    return {scene, lights, middle: new THREE.Vector3(0, FRAMED_MIDDLE, 0), bounds: new THREE.Box3().setFromObject(saucer)};
}

// the saucer's rim lights at step `phase` of their blink (parcels.js UFO blink): every UFO blink-th one lit, amber and indigo by turns, the
// rest dark, so the light runs round the rim step by step
export function lightSaucer(saucer, phase) {
    saucer.lights.forEach((light, index) => {
        const colour = new THREE.Color(index % UFO.blink === phase ? SAUCER.colours.lit[Math.floor(index / UFO.blink) % 2] : SAUCER.colours.dark);
        light.material.uniforms.colour.value.set(colour.r, colour.g, colour.b);
    });
}

// The parachute's canopy (acts.js chute), each panel shaded and outlined as the figure's own are: a dome of `panels` gores in the colours by
// turns, turned from a sphere `reach` radians down from its top and flattened to `flat` of its height, with a vent cap at its top; tipped
// `tilt` degrees toward the viewer so its top shows. Its lines leave the rim at `lines` turns round it, a pair for each hand.
export const CANOPY = {panels: 8, reach: 1.15, flat: 0.62, vent: 0.14, tilt: 14, lines: [-0.35, 0.35], colours: {gores: [0xd9413b, 0xf6f1e3], vent: 0x8f2a26}};

export function canopyOf(perPixel, picture) {
    const radius = ((ACTS.chute.width * picture) / 2 / Math.sin(CANOPY.reach)) * perPixel;
    const canopy = new THREE.Group();
    canopy.name = "canopy";
    const dome = new THREE.Group();
    dome.name = "canopy";
    dome.scale.y = CANOPY.flat;
    canopy.add(dome);
    for (let index = 0; index < CANOPY.panels; index++) {
        const gore = new THREE.SphereGeometry(radius, 8, 10, (index / CANOPY.panels) * Math.PI * 2, (Math.PI * 2) / CANOPY.panels, 0, CANOPY.reach);
        shadedPart(dome, `gore_${index}`, gore, CANOPY.colours.gores[index % 2]);
    }
    shadedPart(dome, "vent", new THREE.SphereGeometry(radius * 1.01, 16, 4, 0, Math.PI * 2, 0, CANOPY.vent), CANOPY.colours.vent);
    const rim = radius * Math.sin(CANOPY.reach);
    const rimUp = radius * Math.cos(CANOPY.reach) * CANOPY.flat;
    const ends = [-1, 1].flatMap((way) => CANOPY.lines.map((turn) => new THREE.Vector3(way * rim * Math.cos(turn), rimUp, rim * Math.sin(turn))));
    const points = ends.map((end) => {
        const point = new THREE.Object3D();
        point.position.copy(end);
        canopy.add(point);
        return point;
    });
    canopy.rotation.x = radians(CANOPY.tilt);
    canopy.position.y = FRAMED_MIDDLE - rimUp;
    const scene = new THREE.Scene();
    scene.add(canopy);
    scene.updateMatrixWorld(true);
    const rimMiddle = new THREE.Vector3(0, rimUp, 0).applyMatrix4(canopy.matrixWorld);
    return {scene, middle: rimMiddle, ends: points.map((point) => new THREE.Vector3().setFromMatrixPosition(point.matrixWorld)), bounds: new THREE.Box3().setFromObject(canopy)};
}

// A magnifying glass in the same flat colours, comically large as the figure is drawn small: its handle up its y axis with the handle's
// middle, where the hand closes on it, at the origin, its lens in the plane of x and y above the handle
export const GLASS = {radius: 0.52, rim: 0.08, handle: 0.5, grip: 0.07};
const GLASS_COLOURS = {rim: 0x2b2e38, lens: 0xcfe6ff, handle: 0x474a52, edge: 0xa9adb8, glint: 0xffffff};

export function glassOf(glass) {
    const {radius, rim, handle, grip} = GLASS;
    const flat = (geometry, colour, more = {}) => {
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: colour, side: THREE.DoubleSide, ...more}));
        mesh.frustumCulled = false;
        return mesh;
    };
    const held = new THREE.Group();
    glass.add(held);
    const ring = flat(new THREE.TorusGeometry(radius, rim, 12, 48), GLASS_COLOURS.rim);
    ring.position.y = handle / 2 + radius;
    ring.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.CircleGeometry(radius + rim, 48)), new THREE.LineBasicMaterial({color: GLASS_COLOURS.edge})));
    const lens = flat(new THREE.CircleGeometry(radius, 48), GLASS_COLOURS.lens, {transparent: true, opacity: 0.18, depthWrite: false});
    lens.position.y = handle / 2 + radius;
    const glint = flat(new THREE.RingGeometry(radius * 0.55, radius * 0.72, 24, 1, Math.PI * 0.55, Math.PI * 0.4), GLASS_COLOURS.glint);
    glint.position.set(0, handle / 2 + radius, 0.008);
    const shaft = flat(new THREE.CylinderGeometry(grip, grip * 1.2, handle, 16), GLASS_COLOURS.handle);
    held.add(shaft, ring, lens, glint);
    // over what it inspects, the glass is drawn larger, its lens clear glass, its glint at the top left however far the glass is rolled,
    // `roll` degrees (glassOver)
    glass.userData.shape = ({magnifies = 0, size = 1, roll = 0}) => {
        held.scale.setScalar(magnifies ? size : 1);
        glint.rotation.z = radians(roll);
    };
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
    whistle: {body: [0.13, 0.1, 0.16], mouthpiece: [0.08, 0.04, 0.15], mouthAt: [0, 0.01, -0.12]},
    cloth: {width: 0.35, depth: 0.26, thickness: 0.02},
    // a hammer held a little up its handle, its head across the top, tipped outward so each blow lands downward
    hammer: {handleRadius: 0.06, handleLength: 1.2, gripFrom: 0.15, head: [0.55, 0.22, 0.22], sides: 10, tilt: 45},
    // a stalk of straw held in the corner of the mouth, its seed head at the far end
    straw: {radius: 0.03, length: 0.7, head: [0.045, 0.16]},
    colours: {ink: 0x272936, silver: 0xa9adb8, paper: 0xf3eedf, white: 0xf4f2ed, accent: 0x6366f1, pencil: 0xd6b06b, handle: 0x8a5a2b, straw: 0xe8c66a},
};

export function propsOf() {
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
    const {pen, paper, cloth, colours} = TOOLS;
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
    const whistle = group("hand_whistle");
    part(whistle, "body", new THREE.BoxGeometry(...TOOLS.whistle.body), colours.accent);
    part(whistle, "mouthpiece", new THREE.BoxGeometry(...TOOLS.whistle.mouthpiece), colours.silver, TOOLS.whistle.mouthAt);
    const {hammer} = TOOLS;
    const mallet = group("work_hammer");
    part(mallet, "handle", new THREE.CylinderGeometry(hammer.handleRadius, hammer.handleRadius, hammer.handleLength, hammer.sides), colours.handle, [0, hammer.handleLength / 2 - hammer.gripFrom, 0]);
    part(mallet, "head", new THREE.BoxGeometry(...hammer.head), colours.silver, [0, hammer.handleLength - hammer.gripFrom, 0]);
    const {straw} = TOOLS;
    const stalk = group("straw");
    part(stalk, "stalk", new THREE.CylinderGeometry(straw.radius, straw.radius, straw.length, 6), colours.straw, [0, straw.length / 2, 0]);
    part(stalk, "seeds", new THREE.ConeGeometry(...straw.head, 6), colours.pencil, [0, straw.length + straw.head[1] / 2, 0]);
    glassOf(group("magnifying_glass"));
    const wipe = group("polishing_cloth");
    part(wipe, "fold", new THREE.BoxGeometry(cloth.width, cloth.thickness, cloth.depth), colours.white);
    reactionPropsOf(group, part);
    telephoneOf(group("telephone"), group("telephone_handset"), group("telephone_cord"), group("telephone_poof"));
    lightBulbOf(group("light_bulb"));
    reportScrollOf(group("report_scroll"));
    binocularsOf(group("binoculars"));
    rifleOf(group("rifle"));
    bigMalletOf(group("big_mallet"));
    haloOf(group("halo"));
    crucifixOf(group("crucifix"));
    pocketWatchOf(group("pocket_watch"));
    ropeSwingOf(group("rope_swing"));
    rummagedOf(group);
    return props;
}

// The things the figure flings over its shoulder rummaging (rummage), in its own shaded style, in the figure's units:
// a few loose `papers` fanned apart; a `boot` of a shaft, a foot and a sole; a fish's `bone`, its spine, ribs, head and tail; a closed
// `book`, its cover and pages. Each is drawn at the size the pose gives it, so it can shrink away.
export const RUMMAGE_THINGS = {
    papers: {sheet: [0.9, 0.02, 0.66], count: 3, fan: 18},
    boot: {shaft: [0.4, 0.72, 0.45], foot: [0.4, 0.3, 0.84], sole: 0.07},
    bone: {spine: 1.1, ribs: 5, rib: 0.5, head: [0.24, 0.18, 0.08], tail: [0.2, 0.26], thick: 0.035},
    book: {cover: [0.75, 0.15, 0.56], pages: [0.7, 0.12, 0.53]},
    colours: {paper: 0xf6f1e3, leather: 0x6b4426, sole: 0x2a2420, bone: 0xece4d2, cover: 0xa8323a, pages: 0xf3ead2},
};

function rummagedOf(group) {
    const {papers, boot, bone, book, colours} = RUMMAGE_THINGS;
    const things = [];
    const sized = (name) => {
        const root = group(name);
        const body = new THREE.Group();
        body.name = name;
        root.add(body);
        root.userData.shape = ({size = 1}) => body.scale.setScalar(Math.max(size, 0.001));
        things.push(body);
        return body;
    };
    const sheets = sized("rummage_papers");
    for (let index = 0; index < papers.count; index++) {
        const sheet = shadedPart(sheets, `sheet_${index}`, new THREE.BoxGeometry(...papers.sheet), colours.paper, [0, index * papers.sheet[1] * 2, 0]);
        sheet.rotation.y = radians(papers.fan * (index - (papers.count - 1) / 2));
    }
    const shoe = sized("rummage_boot");
    shadedPart(shoe, "shaft", new THREE.BoxGeometry(...boot.shaft), colours.leather, [0, boot.foot[1] + boot.shaft[1] / 2, 0]);
    shadedPart(shoe, "foot", new THREE.BoxGeometry(...boot.foot), colours.leather, [0, boot.foot[1] / 2, (boot.foot[2] - boot.shaft[2]) / 2]);
    shadedPart(shoe, "sole", new THREE.BoxGeometry(boot.foot[0] * 1.05, boot.sole, boot.foot[2] * 1.04), colours.sole, [0, 0, (boot.foot[2] - boot.shaft[2]) / 2]);
    const fish = sized("rummage_bone");
    const spine = shadedPart(fish, "spine", new THREE.CylinderGeometry(bone.thick, bone.thick, bone.spine, 6), colours.bone);
    spine.rotation.z = Math.PI / 2;
    for (let index = 0; index < bone.ribs; index++) {
        const across = (index / (bone.ribs - 1) - 0.5) * bone.spine * 0.7;
        const length = bone.rib * (1 - Math.abs(across) / bone.spine);
        shadedPart(fish, `rib_${index}`, new THREE.CylinderGeometry(bone.thick * 0.7, bone.thick * 0.7, length, 5), colours.bone, [across, 0, 0]);
    }
    const head = shadedPart(fish, "head", new THREE.SphereGeometry(1, 14, 10), colours.bone, [bone.spine / 2 + bone.head[0] * 0.8, 0, 0]);
    head.scale.set(...bone.head);
    const tail = shadedPart(fish, "tail", new THREE.ConeGeometry(bone.tail[0], bone.tail[1], 3), colours.bone, [-bone.spine / 2 - bone.tail[1] / 2, 0, 0]);
    tail.rotation.z = -Math.PI / 2;
    const tome = sized("rummage_book");
    shadedPart(tome, "cover", new THREE.BoxGeometry(...book.cover), colours.cover);
    shadedPart(tome, "pages", new THREE.BoxGeometry(...book.pages), colours.pages, [(book.cover[0] - book.pages[0]) / 2 + 0.03, 0, 0]);
    // each turns about its own middle as it flies
    for (const thing of things) {
        thing.updateMatrixWorld(true);
        const middle = new THREE.Box3().setFromObject(thing).getCenter(new THREE.Vector3()).sub(thing.getWorldPosition(new THREE.Vector3()));
        for (const piece of thing.children) piece.position.sub(middle);
    }
}


// The binoculars the figure scans the chat through (binoculars), in its own shaded style, in the figure's units: two barrels `barrel`
// round and `length` long, `apart` between their middles, pointing toward the viewer, each with a rim `rim` thick and a glinting lens at
// its far end and an eyepiece `eyepiece` (round, long) at the near one, joined by a `bridge` (across, up, deep). Drawn standing in the
// figure's frame, its own up the figure's.
export const BINOCULARS = {
    barrel: 0.24, length: 0.6, apart: 0.54, rim: 0.045, eyepiece: [0.15, 0.14], bridge: [0.28, 0.13, 0.22],
    colours: {body: 0x2a2c36, rim: 0x9aa0ad, eyepiece: 0x1b1c22, lens: 0x8ec5ff},
};

// The rifle of the bug shot, each part shaded and outlined as the figure's own are, in the figure's units: its grip at the origin where the
// right hand holds it, the barrel out along +x and up along +z, so held level it points out to the figure's left; the wooden stock back to
// the shoulder, the dark receiver with its magazine underneath, the wooden handguard, the barrel and the sights on top; and the flash at
// the muzzle while a burst fires; every length `scale` times as given, so it reads at the figure's size
export const RIFLE_PARTS = {
    scale: 1.4,
    stock: [[-0.23, 0, 0.0], [0.34, 0.09, 0.16]],
    receiver: [[0.1, 0, 0.04], [0.46, 0.1, 0.14]],
    grip: [[-0.03, 0, -0.1], [0.08, 0.08, 0.2]],
    magazine: [[0.2, 0, -0.15], [0.1, 0.07, 0.26]],
    handguard: [[0.38, 0, 0.04], [0.42, 0.1, 0.11]],
    sight: [[0.24, 0, 0.14], [0.06, 0.04, 0.06]],
    front: [[1.17, 0, 0.11], [0.03, 0.03, 0.07]],
    barrel: {from: 0.76, to: 1.24, radius: 0.03, up: 0.06},
    colours: {wood: 0x8a5a2b, metal: 0x2b2e38, barrel: 0x474a52, flash: 0xffd25a},
};

// How the rifle is held: the barrel's line `barrel` above the grip (its barrel up), and the other hand's palm under the handguard,
// `fore` along the barrel from the grip, at the handguard's middle, or as near as `nearest`, its end toward the grip, and `under` below the
// grip's height, its fingers along the barrel, the palm turned up by `roll`; the short stock and rearward fore-end fit the unchanged arms
export const RIFLE_HOLD = {barrel: RIFLE_PARTS.barrel.up * RIFLE_PARTS.scale, fore: 0.38 * RIFLE_PARTS.scale, nearest: 0.17 * RIFLE_PARTS.scale, under: 0.17, roll: 90};

// a space inside the prop `root` laid out in the pose's own axes, up along z and toward the viewer along -y, as a prop's parts are given;
// a prop's root is placed in the glb's (heldPropOf)
function poseSpace(root) {
    const space = new THREE.Group();
    space.name = root.name;
    space.rotation.x = -Math.PI / 2;
    root.add(space);
    return space;
}

export function rifleOf(prop) {
    const root = poseSpace(prop);
    const {colours, barrel, scale} = RIFLE_PARTS;
    const sized = (values) => values.map((value) => value * scale);
    for (const name of ["stock", "receiver", "grip", "magazine", "handguard", "sight", "front"]) {
        const [at, size] = RIFLE_PARTS[name];
        shadedPart(root, name, new THREE.BoxGeometry(...sized(size)), ["stock", "handguard"].includes(name) ? colours.wood : colours.metal, sized(at));
    }
    const [from, to, radius, up] = sized([barrel.from, barrel.to, barrel.radius, barrel.up]);
    const tube = shadedPart(root, "barrel", new THREE.CylinderGeometry(radius, radius, to - from, 12), colours.barrel, [(from + to) / 2, 0, up]);
    tube.rotation.z = Math.PI / 2;
    const flash = shadedPart(root, "flash", new THREE.OctahedronGeometry(0.12 * scale, 0), colours.flash, [to + 0.1 * scale, 0, up]);
    flash.scale.set(1.6, 0.6, 1);
    prop.userData.shape = ({firing}) => (flash.visible = Boolean(firing));
}

// The big wooden mallet of the bug smash, shaded and outlined, in the figure's units: its handle from the right hand at the origin out
// along +x, `handle` long and `grip` thick, its head a wooden drum `head` round and `width` long at the handle's end, its face down the
// swing, with an iron band round either end
export const BIG_MALLET = {handle: 2.0, grip: 0.06, head: 0.42, width: 0.85, band: 0.04, colours: {handle: 0xb07a45, head: 0x9b6a3a, band: 0x6b6f7c}};

export function bigMalletOf(prop) {
    const root = poseSpace(prop);
    const {handle, grip, head, width, band, colours} = BIG_MALLET;
    shadedPart(root, "handle", new THREE.CylinderGeometry(grip, grip * 1.2, handle, 12), colours.handle, [handle / 2, 0, 0]).rotation.z = Math.PI / 2;
    shadedPart(root, "head", new THREE.CylinderGeometry(head, head, width, 20), colours.head, [handle, 0, 0]).rotation.x = Math.PI / 2;
    for (const end of [-1, 1]) shadedPart(root, `band_${end}`, new THREE.CylinderGeometry(head * 1.04, head * 1.04, band, 20), colours.band, [handle, 0, end * (width / 2 - band)]).rotation.x = Math.PI / 2;
}

// the halo of a repented sin (HALO_RING), a golden ring lying flat over the head, as big as the act has grown it
export function haloOf(prop) {
    const ring = shadedPart(poseSpace(prop), "ring", new THREE.TorusGeometry(HALO_RING.radius, HALO_RING.ring, 10, 40), 0xf2c84b);
    ring.rotation.x = radians(HALO_RING.tip);
    prop.userData.shape = ({size}) => ring.scale.setScalar(size ?? 1);
}

// A small brass token within the clasp, below the face so the body carries the confession.
export const CRUCIFIX = {long: 0.62, across: 0.32, bar: 0.075, at: 0.14, colours: {wood: 0xd9a441, gold: 0xf6e3a1}};

export function crucifixOf(prop) {
    const root = poseSpace(prop);
    const {long, across, bar, at, colours} = CRUCIFIX;
    shadedPart(root, "upright", new THREE.BoxGeometry(bar, bar, long), colours.wood, [0, 0, long * 0.2]);
    shadedPart(root, "crossbar", new THREE.BoxGeometry(across, bar, bar), colours.wood, [0, 0, long * 0.2 + at]);
    shadedPart(root, "centre", new THREE.SphereGeometry(bar * 0.7, 10, 8), colours.gold, [0, -bar * 0.5, long * 0.2 + at]);
}

// The pocket watch the figure checks sitting waiting on a run, shaded and outlined in gold, in the figure's units: a case `radius` across
// and `depth` thick, its cream face toward the viewer, the hour and the minute hands on it, and the bow it hangs from on top
export const POCKET_WATCH = {radius: 0.2, depth: 0.08, bow: 0.06, colours: {gold: 0xe8b84a, face: 0xf6f1e3, hands: 0x272936}};

export function pocketWatchOf(prop) {
    const root = poseSpace(prop);
    const {radius, depth, bow, colours} = POCKET_WATCH;
    const round = new THREE.Euler(Math.PI / 2, 0, 0);
    shadedPart(root, "case", new THREE.CylinderGeometry(radius, radius, depth, 24).applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(round)), colours.gold, [0, 0, 0]);
    shadedPart(root, "face", new THREE.CylinderGeometry(radius * 0.82, radius * 0.82, depth * 0.3, 24).applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(round)), colours.face, [0, -depth * 0.45, 0]);
    shadedPart(root, "hour_hand", new THREE.BoxGeometry(radius * 0.08, depth * 0.2, radius * 0.45), colours.hands, [radius * 0.1, -depth * 0.62, radius * 0.18]);
    shadedPart(root, "minute_hand", new THREE.BoxGeometry(radius * 0.6, depth * 0.2, radius * 0.06), colours.hands, [radius * 0.28, -depth * 0.62, 0]);
    shadedPart(root, "bow", new THREE.TorusGeometry(bow, bow * 0.3, 8, 16).applyMatrix4(new THREE.Matrix4().makeRotationFromEuler(round)), colours.gold, [0, 0, radius + bow * 0.8]);
}

// The rope swing the figure sits on, in its own scene, in the figure's units about the middle of the line the figure sits on (places.js
// POSTURES sit), its sizes as acts.js rope_swing gives them in shares of the 5.4 units the picture frames: a wooden seat `seat` wide and
// `thick` thick, its top `under` below that line, where the hips rest, running from `front` back to `back` (forward is -y), so the
// shins and the feet hang down before its front and never through it; and a rope `cord` thick up from near either end, `ties` apart,
// through the seat's middle from front to back, beside the figure and behind its hands, to a knot `knot` round on the bubble's bottom
// edge, `rope` above that line
export const SWING = {thick: 0.14, front: -0.12, back: 0.4, cord: 0.035, knot: 0.08, colours: {wood: 0x8a5a2b, rope: 0xc9a56a}};

export function ropeSwingOf(prop) {
    const root = poseSpace(prop);
    const [seat, ties, rope, under] = ["seat", "ties", "rope", "under"].map((key) => ACTS.rope_swing[key] * FRAMED_HEIGHT);
    const {thick, front, back, cord, knot, colours} = SWING;
    const middle = (front + back) / 2;
    shadedPart(root, "seat", new THREE.BoxGeometry(seat, back - front, thick), colours.wood, [0, middle, -under - thick / 2]);
    for (const [side, sign] of Object.entries(SIDES)) {
        const upright = new THREE.CylinderGeometry(cord, cord, rope + under, 8).rotateX(Math.PI / 2);
        shadedPart(root, `rope_${side}`, upright, colours.rope, [(sign * ties) / 2, middle, (rope - under) / 2]);
        shadedPart(root, `knot_${side}`, new THREE.IcosahedronGeometry(knot, 1), colours.rope, [(sign * ties) / 2, middle, rope]);
    }
}

// The bug of a fixed test run, shaded and outlined as the figure's props are: a beetle `long` of the picture's pixels long walking toward
// -x, its round brown body, its head, six legs that step at `phase` of their stride and two feelers, tipped `tilt` degrees toward the viewer
// so its back shows, standing on the floor at the picture's middle
export const BUG = {long: 15, tilt: 22, colours: {body: 0x7a5232, head: 0x4a2f1c, leg: 0x2b2e38, shine: 0xb88a5c}};

export function bugOf(perPixel, phase) {
    const unit = BUG.long * perPixel;
    const bug = new THREE.Group();
    bug.name = "bug";
    const body = shadedPart(bug, "body", new THREE.SphereGeometry(unit * 0.38, 18, 12), BUG.colours.body, [unit * 0.1, 0, unit * 0.3]);
    body.scale.set(1.3, 0.85, 0.75);
    shadedPart(bug, "head", new THREE.SphereGeometry(unit * 0.2, 14, 10), BUG.colours.head, [-unit * 0.42, 0, unit * 0.3]);
    for (const [index, x] of [-0.18, 0.1, 0.38].entries()) {
        for (const side of [-1, 1]) {
            const step = Math.sin(Math.PI * (phase + index / 3 + (side > 0 ? 0.5 : 0)) * 2) * 0.12;
            const leg = shadedPart(bug, `leg_${index}_${side}`, new THREE.CylinderGeometry(unit * 0.035, unit * 0.035, unit * 0.42, 6), BUG.colours.leg, [unit * (x + step), side * unit * 0.28, unit * 0.14]);
            leg.rotation.x = side * 0.9;
        }
    }
    for (const side of [-1, 1]) {
        const feeler = shadedPart(bug, `feeler_${side}`, new THREE.CylinderGeometry(unit * 0.02, unit * 0.02, unit * 0.36, 5), BUG.colours.leg, [-unit * 0.64, side * unit * 0.08, unit * 0.48]);
        feeler.rotation.set(side * 0.4, 0, 0.9);
    }
    bug.rotation.x = radians(BUG.tilt);
    bug.position.y = FRAMED_MIDDLE;
    const scene = new THREE.Scene();
    scene.add(bug);
    scene.updateMatrixWorld(true);
    return {scene, foot: new THREE.Vector3(0, FRAMED_MIDDLE, 0), bounds: new THREE.Box3().setFromObject(bug)};
}

export function binocularsOf(root) {
    const {barrel, length, apart, rim, eyepiece, bridge, colours} = BINOCULARS;
    const toward = (mesh) => {
        mesh.rotation.x = Math.PI / 2;
        return mesh;
    };
    for (const [index, side] of [-1, 1].entries()) {
        const x = (side * apart) / 2;
        toward(shadedPart(root, `barrel_${index}`, new THREE.CylinderGeometry(barrel, barrel * 0.9, length, 20), colours.body, [x, 0, length / 2]));
        shadedPart(root, `rim_${index}`, new THREE.TorusGeometry(barrel, rim, 10, 28), colours.rim, [x, 0, length]);
        toward(shadedPart(root, `eyepiece_${index}`, new THREE.CylinderGeometry(eyepiece[0], eyepiece[0], eyepiece[1], 16), colours.eyepiece, [x, 0, -eyepiece[1] / 2]));
        const lens = new THREE.Mesh(new THREE.CircleGeometry(barrel * 0.85, 24), new THREE.MeshBasicMaterial({color: colours.lens, side: THREE.DoubleSide}));
        lens.name = `${root.name}_lens_${index}`;
        lens.position.set(x, 0, length + 0.004);
        lens.frustumCulled = false;
        root.add(lens);
    }
    shadedPart(root, "bridge", new THREE.BoxGeometry(...bridge), colours.body, [0, 0, length * 0.45]);
}

// The report scroll the figure reads (scroll), in the figure's own style: two wooden rollers `roller` round and `length` long, across, a
// knob `knob` round on each end, and on each a sleeve of the parchment wound round it, `wound` round while the scroll is rolled up and
// `unwound` once it is open, the rollers turning as it unrolls; between them the parchment `width` wide, its plain aged back to the
// viewer, bowed `bow` toward it in the middle and its side edges curled `curl` back, in `rows` by `columns` facets so it catches the
// light. Rolled up in one hand its rollers lie `rolled` apart. Every number of it is here, in the figure's units.
export const REPORT_SCROLL = {
    roller: 0.045, length: 1.25, knob: 0.075, wound: 0.11, unwound: 0.06, turns: 1.5, width: 1, bow: 0.06, curl: 0.08, rows: 10, columns: 16,
    rolled: 0.22,
    colours: {wood: 0x8a5a2b, knob: 0x6b4220, back: 0xdcc79c, wound: 0xe6d6ae},
};

// the scroll's parts in its own axes, its middle at the root; its `shape` puts its rollers at `top` and `bottom` (from its middle, in the
// figure's own axes, z up) and stretches the parchment between them, unrolled `open` of the way, 0 to 1
export function reportScrollOf(root) {
    const {roller, length, knob, wound, unwound, turns, width, bow, curl, rows, columns, colours} = REPORT_SCROLL;
    const rollers = ["top", "bottom"].map((which) => {
        const group = new THREE.Group();
        group.name = `${root.name}_${which}`;
        root.add(group);
        const rod = shadedPart(group, "roller", new THREE.CylinderGeometry(roller, roller, length, 14), colours.wood);
        rod.rotation.z = Math.PI / 2;
        for (const end of [-1, 1]) shadedPart(group, `knob_${end > 0 ? "l" : "r"}`, new THREE.SphereGeometry(knob, 14, 10), colours.knob, [(end * length) / 2, 0, 0]);
        const sleeve = shadedPart(group, "wound", new THREE.CylinderGeometry(1, 1, width, 18), colours.wound);
        sleeve.rotation.z = Math.PI / 2;
        return {group, sleeve, rod};
    });
    const sheet = new THREE.PlaneGeometry(width, 1, columns, rows);
    const parchment = shadedPart(root, "parchment", sheet, colours.back);
    const glb = (point) => new THREE.Vector3(point.x, point.z, -point.y);
    root.userData.shape = ({top, bottom, open}) => {
        const [upper, lower] = [glb(top), glb(bottom)];
        const radius = mix(wound, unwound, open);
        rollers.forEach(({group, sleeve, rod}, index) => {
            group.position.copy(index ? lower : upper);
            sleeve.scale.set(radius, 1, radius);
            rod.rotation.x = (index ? -1 : 1) * turns * 2 * Math.PI * open;
        });
        parchment.visible = open > 0.02;
        const position = sheet.attributes.position;
        for (let row = 0; row <= rows; row++) {
            const along = row / rows;
            const middle = upper.clone().lerp(lower, along);
            for (let column = 0; column <= columns; column++) {
                const across = column / columns - 0.5;
                const out = bow * Math.sin(Math.PI * along) * open - curl * (2 * across) ** 4;
                position.setXYZ(row * (columns + 1) + column, middle.x + across * width, middle.y, middle.z + radius + out);
            }
        }
        position.needsUpdate = true;
        sheet.computeVertexNormals();
        sheet.setAttribute("hullNormal", sheet.attributes.normal.clone());
    };
}

// The light bulb over the head at the end of the thinking act, in the figure's own style, standing `at` (across toward the hand raised
// under it, forward and up, in the figure's units), just above the head and inside the picture whatever the figure wears on it: a pear
// shaped glass globe `globe` round, narrowing into its neck, on a screw base `base` round and high with `threads` rings about it and a
// small contact under it; inside, a filament on two wires, drawn through the glass. Switched off its glass is clear and its filament
// dark; lit, both glow `warm`, a soft halo `halo` times its size about it, and it lights the parts of the figure turned to it (FLAT) as
// strongly as `strength`, weaker with the square of the distance by `falloff`. Every number of it is here.
export const LIGHT_BULB = {
    at: [0.95, -0.25, 4.05], globe: 0.36, neck: 0.15, base: [0.15, 0.22], threads: 3, filament: 0.14, wire: 0.014, halo: 1.7,
    strength: 1.4, falloff: 0.6,
    colours: {glass: 0xe3edf3, glassLit: 0xffe27a, base: 0xb7bcc6, contact: 0x3a3d47, filament: 0x5b5f6b, filamentLit: 0xfff4c2, warm: [1, 0.82, 0.42]},
};

// the light bulb's parts in its own axes, its middle at the root, the globe up and the base down; its `shape` grows it in by `size` and
// lights it by `lit`, both 0 to 1
export function lightBulbOf(root) {
    const {globe, neck, base, threads, filament, wire, halo, colours} = LIGHT_BULB;
    const bulb = new THREE.Group();
    bulb.name = root.name;
    root.add(bulb);
    const profile = [[0, globe * 1.95], [globe * 0.55, globe * 1.85], [globe * 0.92, globe * 1.45], [globe, globe], [globe * 0.88, globe * 0.55], [neck * 1.2, globe * 0.18], [neck, 0]].map(([x, y]) => new THREE.Vector2(x, y)).reverse();
    const glass = shadedPart(bulb, "glass", new THREE.LatheGeometry(profile, 28), colours.glass);
    glass.material.uniforms.shade = {value: SHADE.clone()};
    const [radius, height] = base;
    shadedPart(bulb, "base", new THREE.CylinderGeometry(radius, radius * 0.92, height, 20), colours.base, [0, -height / 2, 0]);
    for (let ring = 0; ring < threads; ring++) shadedPart(bulb, `thread_${ring}`, new THREE.TorusGeometry(radius * 1.02, height / (threads * 4), 6, 20), colours.base, [0, -height * ((ring + 0.6) / threads), 0]).rotation.x = Math.PI / 2;
    shadedPart(bulb, "contact", new THREE.SphereGeometry(radius * 0.45, 12, 8), colours.contact, [0, -height, 0]);
    const zigzag = new THREE.CatmullRomCurve3([[-filament, globe * 0.6], [-filament * 0.5, globe * 1.15], [0, globe * 0.95], [filament * 0.5, globe * 1.15], [filament, globe * 0.6]].map(([x, y]) => new THREE.Vector3(x, y, 0)));
    const lamp = new THREE.Group();
    bulb.add(lamp);
    const parts = [new THREE.TubeGeometry(zigzag, 24, wire * 1.4, 6), ...[-1, 1].map((side) => new THREE.TubeGeometry(new THREE.LineCurve3(new THREE.Vector3(side * filament, 0.02, 0), new THREE.Vector3(side * filament, globe * 0.6, 0)), 1, wire, 6))];
    const glowing = parts.map((geometry) => {
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: colours.filament, depthTest: false}));
        mesh.renderOrder = 2;
        mesh.frustumCulled = false;
        lamp.add(mesh);
        return mesh;
    });
    const aura = new THREE.Mesh(new THREE.CircleGeometry(globe * halo, 32), new THREE.MeshBasicMaterial({color: new THREE.Color(...colours.warm), transparent: true, depthWrite: false}));
    aura.position.set(0, globe, -globe * 1.2);
    aura.frustumCulled = false;
    bulb.add(aura);
    const off = new THREE.Color(colours.glass);
    const on = new THREE.Color(colours.glassLit);
    root.userData.shape = ({size, lit}) => {
        bulb.scale.setScalar(Math.max(size, 0.001));
        const colour = off.clone().lerp(on, lit);
        glass.material.uniforms.colour.value.set(colour.r, colour.g, colour.b);
        glass.material.uniforms.shade.value.copy(SHADE).lerp(new THREE.Vector3(1.25, 1.25, 1.25), lit);
        for (const mesh of glowing) mesh.material.color.set(colours.filament).lerp(new THREE.Color(colours.filamentLit), lit);
        aura.visible = lit > 0;
        aura.material.opacity = 0.35 * lit;
    };
}

// a part shaded and outlined as the figure's own are (flatMaterial, outlineMaterial), for a prop that should read as solid
function shadedPart(root, name, geometry, colour, at = [0, 0, 0]) {
    const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({color: colour}));
    addHullNormals(geometry);
    mesh.material = flatMaterial(mesh);
    const hull = new THREE.Mesh(geometry, outlineMaterial(mesh));
    hull.frustumCulled = mesh.frustumCulled = false;
    mesh.add(hull);
    mesh.name = `${root.name}_${name}`;
    mesh.position.set(...at);
    root.add(mesh);
    return mesh;
}

// the telephone's body as one solid in its own axes (TELEPHONE base): its side's outline, the front sloping back to the brow, round over
// the top and down the back, drawn out across its width with rounded sides, and narrowed toward the top
function bodyGeometry() {
    const {width, narrow, depth, height, brow, round, dome} = TELEPHONE.base;
    const side = new THREE.Shape();
    side.moveTo(-depth / 2 + round * 0.5, 0);
    side.lineTo(depth / 2 - round * 0.5, 0);
    side.quadraticCurveTo(depth / 2, 0, depth / 2 - round * 0.2, round * 0.5);
    side.lineTo(brow[0] + round * 0.3, brow[1] - round * 0.4);
    side.quadraticCurveTo(brow[0] - round * 0.2, height, brow[0] - round * 1.6, height);
    side.lineTo(-depth / 2 + round * 1.8, height);
    side.quadraticCurveTo(-depth / 2 + round * 0.1, height, -depth / 2 + round * 0.1, height - round * 1.6);
    side.lineTo(-depth / 2, round * 0.5);
    side.quadraticCurveTo(-depth / 2, 0, -depth / 2 + round * 0.5, 0);
    const across = width - 2 * round;
    const solid = new THREE.ExtrudeGeometry(side, {depth: across, bevelEnabled: true, bevelThickness: round, bevelSize: bulge(), bevelSegments: 6, curveSegments: 12});
    solid.rotateY(-Math.PI / 2).translate(across / 2, 0, 0);
    const position = solid.attributes.position;
    for (let index = 0; index < position.count; index++) {
        const [x, y] = [position.getX(index), Math.max(position.getY(index), 0)];
        position.setX(index, x * (1 - (narrow * y) / height));
        position.setY(index, position.getY(index) + dome * (y / height) ** 2 * Math.max(1 - (x / (width / 2)) ** 2, 0));
    }
    solid.computeVertexNormals();
    return solid;
}

// The telephone's base, dial and cradle in `set`, standing up its y axis with its front toward the viewer (+z), its handset in `handset`,
// its middle at the origin and its cups' mouths down, and its cord in `cord`, coiled from its shape's `from` to its `to` (in the figure's
// own axes, against the root), and the poof it comes and goes in in `poof`, bursting as its shape's `puff` goes from 0 to 1. The body
// squashes as its shape's `squash` says, flatter and wider for more, and the dial's wheel turns `dial` degrees
export function telephoneOf(set, handset, cord, poof) {
    const {base, dial, cradle, colours} = TELEPHONE;
    const body = new THREE.Group();
    body.name = set.name;
    set.add(body);
    shadedPart(body, "base", bodyGeometry(), colours.body);
    const face = new THREE.Group();
    face.name = set.name;
    face.matrixAutoUpdate = false;
    face.matrix.copy(dialFrame());
    body.add(face);
    shadedPart(face, "dial_plate", new THREE.CylinderGeometry(dial.plate, dial.plate, dial.face, 40), colours.face, [0, dial.face / 2, 0]);
    for (let index = 0; index < dial.holes; index++) {
        const angle = radians(dial.first + (dial.spread * index) / (dial.holes - 1));
        shadedPart(face, `number_${index}`, new THREE.BoxGeometry(0.03, dial.face * 0.6, 0.045), colours.mark, [Math.cos(angle) * dial.marks, dial.face, -Math.sin(angle) * dial.marks]);
    }
    const wheel = new THREE.Group();
    wheel.name = set.name;
    wheel.position.y = dial.face;
    face.add(wheel);
    shadedPart(wheel, "dial_wheel", new THREE.CylinderGeometry(dial.radius, dial.radius, dial.face * 0.6, 36), colours.wheel, [0, dial.face * 0.3, 0]);
    for (let index = 0; index < dial.holes; index++) {
        const angle = radians(dial.first + (dial.spread * index) / (dial.holes - 1));
        shadedPart(wheel, `hole_${index}`, new THREE.CylinderGeometry(dial.hole, dial.hole, dial.face * 0.7, 12), colours.hole, [Math.cos(angle) * dial.ring, dial.face * 0.4, -Math.sin(angle) * dial.ring]);
    }
    shadedPart(face, "dial_label", new THREE.CylinderGeometry(dial.label, dial.label, dial.face * 1.6, 24), colours.label, [0, dial.face, 0]);
    const stop = radians(dial.first - ACTS.phone_call.turn - 22);
    shadedPart(face, "dial_stop", new THREE.BoxGeometry(0.04, dial.face * 2.2, 0.1), colours.label, [Math.cos(stop) * (dial.radius + 0.02), dial.face * 1.2, -Math.sin(stop) * (dial.radius + 0.02)]);
    for (const sign of [1, -1]) {
        const top = crownAt(cradle.apart) + cradle.height;
        shadedPart(body, `prong_${sign}`, new THREE.CylinderGeometry(cradle.post, cradle.post * 1.4, cradle.height + 0.04, 12), colours.body, [sign * cradle.apart, top - cradle.height / 2 - 0.02, cradle.at]);
        const saddle = shadedPart(body, `saddle_${sign}`, new THREE.TorusGeometry(TELEPHONE.handset.grip * 1.1, cradle.post * 0.45, 8, 14, Math.PI), colours.body, [sign * cradle.apart, top + TELEPHONE.handset.grip * 0.4, cradle.at]);
        saddle.rotation.set(0, Math.PI / 2, Math.PI);
    }
    const held = new THREE.Group();
    held.name = handset.name;
    handset.add(held);
    const {length, grip, drop, end} = TELEPHONE.handset;
    const horn = new THREE.CatmullRomCurve3([[-length / 2, -drop], [-length / 2 + 0.24, 0.02], [0, 0.06], [length / 2 - 0.24, 0.02], [length / 2, -drop]].map(([x, y]) => new THREE.Vector3(x, y, 0)));
    shadedPart(held, "handle", new THREE.TubeGeometry(horn, 32, grip, 12), colours.body);
    for (const [name, sign] of [["ear", 1], ["mouth", -1]]) {
        const piece = new THREE.Group();
        piece.name = handset.name;
        piece.position.set(sign * length / 2, -drop, 0);
        piece.rotation.z = sign * 0.22;
        held.add(piece);
        const bulb = shadedPart(piece, `${name}_piece`, new THREE.SphereGeometry(end[0], 24, 16), colours.body, [0, -end[1] * 0.45, 0]);
        bulb.scale.set(1, end[1] / end[0], 1);
        shadedPart(piece, `${name}_grille`, new THREE.CylinderGeometry(end[0] * 0.62, end[0] * 0.62, 0.025, 20), colours.grille, [0, -end[1] * TELEPHONE.handset.grille, 0]);
    }
    set.userData.shape = ({squash, dial: turned}) => {
        body.scale.set(1 + squash / 2, 1 - squash, 1 + squash / 2);
        wheel.rotation.y = -radians(turned);
    };
    const coiled = shadedPart(cord, "cord", cordGeometry(new THREE.Vector3(), new THREE.Vector3(1, 0, 0)), colours.body);
    cord.userData.shape = ({from, to, aside}) => {
        coiled.geometry.dispose();
        coiled.geometry = coiled.children[0].geometry = cordGeometry(from, to, aside);
        addHullNormals(coiled.geometry);
    };
    const {puffs, puff, from, to} = TELEPHONE.poof;
    const smoke = Array.from({length: puffs}, (_, index) => shadedPart(poof, `puff_${index}`, new THREE.IcosahedronGeometry(puff * (0.75 + 0.5 * ((index * 7) % 5) / 4), 1), colours.smoke));
    poof.userData.shape = ({puff: k}) => {
        smoke.forEach((each, index) => {
            const angle = (2 * Math.PI * index) / puffs;
            const out = from + (to - from) * Math.sqrt(k);
            each.position.set(Math.cos(angle) * out, Math.sin(angle * 2) * out * 0.35, Math.sin(angle) * out * 0.6);
            each.scale.setScalar(Math.max(Math.sin(Math.PI * k), 1e-3));
        });
    };
}

// the telephone's coiled cord from `from` to `to`, points in the figure's own axes, sagging between them and wound round its path, as the
// prop's own geometry (z up there is y)
function cordGeometry(from, to, aside) {
    const {cord, coils, coil} = TELEPHONE;
    const glb = (point) => new THREE.Vector3(point.x, point.z, -point.y);
    const [a, b] = [glb(from), glb(to)];
    const sag = a.clone().lerp(b, 0.5).add(new THREE.Vector3(0, -0.35 * a.distanceTo(b), 0));
    const path = aside ? new THREE.CubicBezierCurve3(a, glb(aside), glb(aside).lerp(b, 0.3), b) : new THREE.QuadraticBezierCurve3(a, sag, b);
    // The drape is planar; its normal stays steady even where a tangent turns vertical.
    const side = (aside ? glb(aside) : sag.clone()).sub(a).cross(b.clone().sub(a));
    if (side.lengthSq() < 1e-12) {
        side.copy(b).sub(a).cross(new THREE.Vector3(0, 1, 0));
        if (side.lengthSq() < 1e-12) side.set(0, 0, 1);
    }
    side.normalize();
    const points = Array.from({length: coils * 8 + 1}, (_, index) => {
        const k = index / (coils * 8);
        const at = path.getPoint(k);
        const tangent = path.getTangent(k);
        const up = tangent.clone().cross(side).normalize();
        const angle = 2 * Math.PI * coils * k;
        const wound = coil * Math.sin(Math.PI * k) ** 0.5;
        return at.addScaledVector(side, Math.cos(angle) * wound).addScaledVector(up, Math.sin(angle) * wound);
    });
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points), coils * 16, cord, 6);
}

// The things the voices bring out when the agent answers with one of their faces, sized against the figure, each standing up its y axis
// with its front toward the viewer (+z)
export const REACTION_PROPS = {
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
    const {monocle, flute, shades, flame, finger, popper, confetti, trophy, sword, castle, colours} = REACTION_PROPS;
    const ink = TOOLS.colours.ink, silver = TOOLS.colours.silver, accent = TOOLS.colours.accent;
    const topHat = group("top_hat");
    shadedPart(topHat, "crown", topHatGeometry(), colours.hat);
    shadedPart(topHat, "band", topHatBandGeometry(), new THREE.Color(...BUTLER.satin).getHex());
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

// the light bulb's light on the figure, where the bulb is and as warm as it is lit, none while it is out
export function lightFromBulb(figure, pose, lit = pose.bulbLit) {
    const {bulbAt, bulbGlow} = figure.bulbLight;
    bulbGlow.value.set(...LIGHT_BULB.colours.warm).multiplyScalar(LIGHT_BULB.strength * lit);
    if (lit) bulbAt.value.setFromMatrixPosition(figure.propByName.get("light_bulb").matrix).add(new THREE.Vector3(0, LIGHT_BULB.globe, 0));
}

// every prop placed where the pose holds it, and one whose shape moves, as the papers squared or the confetti flying, shaped as it says
export function moveProps(figure, pose, moves, transitions = null) {
    for (const [name, prop] of figure.propByName) {
        restorePropOpacity(prop);
        const entry = name === "top_hat" ? null : transitions?.entries.get(`prop:${name}`);
        const held = entry?.value ?? pose.props.get(name);
        prop.visible = Boolean(held);
        if (!held) continue;
        prop.matrix.copy(entry?.to === 0 && name === "binoculars" ? retainedProp(figure, `prop:${name}`, moves) ?? heldPropOf(moves, held) : heldPropOf(moves, held));
        prop.matrixWorldNeedsUpdate = true;
        prop.userData.shape?.(held);
        if (entry) fadeProp(prop, entry.alpha);
        if (name === "binoculars" && entry?.to !== 0) rememberProp(figure, `prop:${name}`, prop, "hand_l", moves);
    }
}

// A retiring book, laptop or pair of binoculars follows one of its last supports as a rigid object. Its shape and scale stay as drawn
// while the hands separate for the next pose, rather than stretching the outgoing prop between them.
const propSupport = (moves, bone) => TO_GLB.clone().multiply(moves.get(bone)).multiply(FROM_GLB);

function rememberProp(figure, name, prop, bone, moves) {
    (figure.propAnchors ??= new Map()).set(name, {bone, local: propSupport(moves, bone).invert().multiply(prop.matrix)});
}

function retainedProp(figure, name, moves) {
    const anchor = figure.propAnchors?.get(name);
    return anchor && propSupport(moves, anchor.bone).multiply(anchor.local);
}

// An interrupted tip keeps one opaque hat in the head's frame. It straightens about the same curled brim contact, then lowers into
// the identical worn mesh; that mesh replaces it only when they meet. Static samples take their requested placement immediately.
const HAT_RETURN_SECONDS = 0.12;
const HAT_STRAIGHTEN_SECONDS = 0.02;

function returnHat(figure, pose, moves, time) {
    if (!pose.props.has("top_hat") && !figure.hatReturn) return false;
    const hat = figure.propByName.get("top_hat");
    const support = propSupport(moves, "head");
    if (pose.props.has("top_hat")) {
        const brim = hatBrimContact(freeSide(figure.stance)).applyMatrix4(TO_GLB);
        figure.hatReturn = {world: hat.matrix.clone(), local: support.clone().invert().multiply(hat.matrix), brim, posture: pose.posture, frame: pose.props.get("top_hat").frame, returnMode: pose.props.get("top_hat").returnMode, began: null, time: Number.isFinite(time) ? time : null};
    } else if (!Number.isFinite(time)) {
        figure.hatReturn = null;
    } else if (figure.hatReturn) {
        const returning = figure.hatReturn;
        const now = Math.max(time, returning.time ?? time);
        returning.began ??= now;
        returning.time = now;
        const elapsed = now - returning.began;
        // A cancelled tantrum retires the free hat at its last spot, then restores the worn hat with the usual prop fade.
        if (returning.returnMode === "toss") {
            const away = elapsed < PROP_FADE_SECONDS;
            hat.matrix.copy(away ? returning.world : support.multiply(new THREE.Matrix4().makeTranslation(0, BUTLER.hat.base, 0)));
            hat.matrixWorldNeedsUpdate = true;
            fadeProp(hat, away ? 1 - partOf(elapsed, [0, PROP_FADE_SECONDS]) : partOf(elapsed, [PROP_FADE_SECONDS, 2 * PROP_FADE_SECONDS]));
            if (elapsed < 2 * PROP_FADE_SECONDS) {
                for (const part of figure.stowable) if (["butler_top_hat", "butler_top_hat_band"].includes(part.userData.item)) part.visible = false;
                return true;
            }
            hat.visible = false;
            figure.hatReturn = null;
            return false;
        }
        const at = new THREE.Vector3(), turn = new THREE.Quaternion(), scale = new THREE.Vector3();
        returning.local.decompose(at, turn, scale);
        // A smaller tip needs less straightening; an upright lifted hat lowers at once, before the seated body unbows beneath it.
        const angle = turn.angleTo(new THREE.Quaternion());
        const returningSeated = returning.posture === "sit" && returning.frame === "head" && returning.returnMode !== "toss";
        const seconds = returningSeated ? 0.06 : HAT_RETURN_SECONDS;
        const straightened = (returningSeated ? 0.01 : HAT_STRAIGHTEN_SECONDS) * Math.min(angle / radians(REACTING.hatTip), 1);
        const straighten = straightened > 1e-8 ? partOf(elapsed, [0, straightened]) : 1;
        const lower = partOf(elapsed, [straightened, seconds]);
        turn.slerp(new THREE.Quaternion(), straighten);
        scale.lerp(new THREE.Vector3(1, 1, 1), straighten);
        at.copy(returning.brim).applyMatrix4(returning.local).sub(returning.brim.clone().multiply(scale).applyQuaternion(turn));
        at.lerp(new THREE.Vector3(0, BUTLER.hat.base, 0), lower);
        hat.matrix.copy(support.multiply(elapsed ? new THREE.Matrix4().compose(at, turn, scale) : returning.local));
        hat.matrixWorldNeedsUpdate = true;
        hat.visible = elapsed < seconds;
        if (!hat.visible) figure.hatReturn = null;
    }
    if (hat.visible) {
        for (const part of figure.stowable) if (["butler_top_hat", "butler_top_hat_band"].includes(part.userData.item)) part.visible = false;
    }
    return Number.isFinite(figure.hatReturn?.began);
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

function heldBookOf(grips, open) {
    const left = grips.l.clone(), right = grips.r.clone();
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

// where each hand's closed fingers grip, in the figure's own space, for the pose's moves
function gripsOf(pose, moves) {
    return Object.fromEntries(Object.keys(SIDES).map((side) => [side, pose.grip(side, [0, 0, 0]).applyMatrix4(moves.get(`hand_${side}`)).applyMatrix4(TO_GLB)]));
}

// the figure's bones placed for the pose, turned `facing` degrees, eased from `blend.from` by `blend.k` while a blend is given; the moves
// placed are returned, so the next change can ease from them
// The moves drawn for `pose` turned `facing` degrees, eased from those before a change as `blend` says, and whether they have settled;
// getting up off a seat (`blend.plant`, places.js leavesSeat) the lower sole is kept where the act puts it, so the body unfolds on its feet
// on the floor line from the first frame. A grounded walk/run change only lifts feet that would penetrate the floor; its flight phase
// keeps its existing height, and airborne grabs use neither constraint.
export function blendedMoves(rig, pose, facing, blend) {
    const target = pose.moves(facing);
    if (!blend) return {moves: target, settled: true};
    const result = blendMoves(rig, blend.from, target, blend.k, blend.previous);
    if (!blend.plant && !blend.floor) return result;
    const sole = (moves) => Math.min(...Object.keys(SIDES).map((side) => pose.head(`foot_${side}`, moves.get(`foot_${side}`)).z));
    const floor = Math.min(...Object.keys(SIDES).map((side) => rig.heads.get(`foot_${side}`).z));
    const lift = new THREE.Matrix4().makeTranslation(0, 0, blend.plant ? sole(target) - sole(result.moves) : Math.max(0, floor - sole(result.moves)));
    return {moves: new Map([...result.moves].map(([name, move]) => [name, lift.clone().multiply(move)])), settled: result.settled};
}

// The hand leaves the brim before the head turns. Seated, the head and torso then rise in sequence, with the hips on the seat.
function returnedHatMoves(figure, pose, facing, blend, time) {
    if (!blend || !Number.isFinite(time) || pose.props.has("top_hat") || figure.hatRecovery?.from !== blend.from) figure.hatRecovery = null;
    if (blend && Number.isFinite(time) && !pose.props.has("top_hat") && figure.hatReturn?.frame === "head" && figure.hatReturn.returnMode !== "toss" && !figure.hatRecovery) {
        figure.hatRecovery = {from: blend.from, previous: blend.from, armPrevious: blend.from, posture: figure.hatReturn.posture, side: freeSide(figure.stance), began: time, time};
    }
    const recovery = figure.hatRecovery;
    if (!recovery) return blendedMoves(figure.rig, pose, facing, blend);
    const elapsed = Math.max(time, recovery.time) - recovery.began;
    recovery.time = Math.max(time, recovery.time);
    const seated = recovery.posture === "sit";
    const result = blendedMoves(figure.rig, pose, facing, {...blend, k: seated ? partOf(elapsed, [0.08, CHANGE_SECONDS]) : blend.k, previous: recovery.previous});
    recovery.previous = result.moves;
    const moves = new Map(result.moves);
    const above = (bone, ancestor) => bone === ancestor || (Boolean(figure.rig.parents.get(bone)) && above(figure.rig.parents.get(bone), ancestor));
    if (seated) {
        const k = partOf(elapsed, [0, CHANGE_SECONDS]);
        const pivot = figure.rig.heads.get("spine").clone().applyMatrix4(moves.get("spine"));
        const axis = new THREE.Vector3(1, 0, 0).transformDirection(moves.get("spine"));
        const bend = aboutPoint(pivot, new THREE.Matrix4().makeRotationAxis(axis, radians(12) * Math.sin(Math.PI * k) ** 2));
        for (const [bone, move] of moves) if (above(bone, "spine")) moves.set(bone, bend.clone().multiply(move));
        const from = new THREE.Euler().setFromRotationMatrix(recovery.from.get("head"), "ZYX");
        const target = new THREE.Euler().setFromRotationMatrix(pose.moves(facing).get("head"), "ZYX");
        const angles = new THREE.Euler().setFromRotationMatrix(result.moves.get("head"), "ZYX");
        const upright = partOf(elapsed, [0.04, 0.16]);
        angles.x = mix(from.x, target.x, upright);
        angles.y = mix(from.y, target.y, upright);
        const head = moves.get("head");
        const at = figure.rig.heads.get("head").clone().applyMatrix4(head);
        const scale = new THREE.Vector3().setFromMatrixScale(head);
        const placed = new THREE.Matrix4().compose(at, new THREE.Quaternion().setFromEuler(angles), scale)
            .multiply(translation(figure.rig.heads.get("head").clone().negate()));
        const adjusted = placed.clone().multiply(head.clone().invert());
        for (const [bone, move] of moves) if (above(bone, "head")) moves.set(bone, adjusted.clone().multiply(move));
    }
    // Reparent the quicker arm pose onto the current chest so its shoulder, elbow and wrist keep their normal spacing.
    const arm = blendedMoves(figure.rig, pose, facing, {...blend, k: partOf(elapsed, [0, 0.12]), previous: recovery.armPrevious}).moves;
    recovery.armPrevious = arm;
    const support = moves.get("chest").clone().multiply(arm.get("chest").clone().invert());
    for (const [bone, move] of arm) if (above(bone, `shoulder_${recovery.side}`)) moves.set(bone, support.clone().multiply(move));
    if (elapsed >= CHANGE_SECONDS && result.settled) figure.hatRecovery = null;
    return {moves, settled: elapsed >= CHANGE_SECONDS && result.settled};
}

function place(figure, pose, facing, blend, time = null) {
    const result = returnedHatMoves(figure, pose, facing, blend, time);
    if (blend) blend.settled = result.settled;
    const moves = result.moves;
    const world = new Map();
    for (const bone of figure.rig.bones) {
        const placed = TO_GLB.clone().multiply(moves.get(bone.name)).multiply(FROM_GLB).multiply(figure.rig.rest.get(bone.name));
        world.set(bone.name, placed);
        const parentWorld = bone.parent.isBone ? world.get(bone.parent.name) : bone.parent.matrixWorld;
        parentWorld.clone().invert().multiply(placed).decompose(bone.position, bone.quaternion, bone.scale);
    }
    const wanted = new Map([...pose.props].filter(([name]) => name !== "top_hat").map(([name, held]) => [`prop:${name}`, held]));
    if (pose.laptop) wanted.set("laptop", true);
    if (pose.book?.visible) wanted.set("book", pose.book);
    if (pose.tablet) wanted.set("tablet", true);
    const props = transitionProps(figure.propTransitions?.props, wanted, time);
    const occupied = pose.laptop || pose.book || pose.props.size > 0 || props.present;
    const carried = new Map(figure.inHand.filter((part) => !pose.stowed.has(part.userData.item) && (!occupied || pose.keep.has(part.userData.item))).map((part) => [part.userData.item, true]));
    const carrying = transitionProps(figure.propTransitions?.carrying, carried, time);
    const clearingHands = [...carrying.entries.values()].some((entry) => !entry.to && entry.alpha > 1e-9);
    for (const [name, entry] of props.entries) {
        const before = figure.propTransitions?.props.entries.get(name);
        if (Number.isFinite(time) && entry.to && clearingHands && (!before || before.waiting)) {
            Object.assign(entry, {alpha: 0, from: 0, began: props.time, waiting: true});
        } else delete entry.waiting;
    }
    props.active = [...props.entries.values()].some((entry) => Math.abs(entry.alpha - entry.to) > 1e-9);
    restorePropOpacity(figure.laptop);
    restorePropOpacity(figure.book);
    const laptop = props.entries.get("laptop"), book = props.entries.get("book"), tablet = props.entries.get("tablet");
    fadeProp(figure.laptop, laptop?.alpha ?? 0);
    if (book) {
        openBook(figure.book, book.value.open, book.value.page);
        figure.book.matrix.copy(book.to ? heldBookOf(gripsOf(pose, moves), book.value.open) : retainedProp(figure, "book", moves) ?? heldBookOf(gripsOf(pose, moves), book.value.open));
        figure.book.matrixWorldNeedsUpdate = true;
        if (book.to) rememberProp(figure, "book", figure.book, "hand_l", moves);
    }
    fadeProp(figure.book, book?.alpha ?? 0);
    for (const part of figure.tablet) {
        restorePropOpacity(part);
        fadeProp(part, tablet?.alpha ?? 0);
    }
    for (const part of figure.stowable) part.visible = !pose.stowed.has(part.userData.item);
    for (const part of figure.inHand) {
        restorePropOpacity(part);
        fadeProp(part, carrying.entries.get(part.userData.item)?.alpha ?? 0);
    }
    moveProps(figure, pose, moves, props);
    const returningHat = returnHat(figure, pose, moves, time);
    const returningHeadphones = moveHeadphones(figure.headphones, pose.headphones, moves, time);
    figure.propTransitions = {props, carrying, active: props.active || carrying.active || returningHat || returningHeadphones, present: props.present || figure.propByName.get("top_hat").visible || Boolean(pose.headphones)};
    const bulb = props.entries.get("prop:light_bulb");
    lightFromBulb(figure, pose, bulb ? (bulb.value.lit ?? 0) * bulb.alpha : 0);
    if (laptop) {
        figure.laptop.matrix.copy(laptop.to ? lapOf(world) : retainedProp(figure, "laptop", moves) ?? lapOf(world));
        figure.laptop.matrixWorldNeedsUpdate = true;
        if (laptop.to) rememberProp(figure, "laptop", figure.laptop, "hips", moves);
    }
    for (const name of figure.propAnchors?.keys() ?? []) if (!props.entries.has(name)) figure.propAnchors.delete(name);
    const crt = pose.screen ?? DARK_SCREEN;
    // the eyes go out before a lit visor comes on, a display with nothing on it; a sign glows in the visor's colour, as white as its flash
    // and as bright as it is lit
    const sign = pose.eyeShape && {...pose.eyeShape, colour: signColour(pose.screen)};
    const lit = litPixels({eyed: crt.eyes > EYES_GONE, eyes: pose.eyes, glance: pose.eyeGlance, tint: pose.eyeTint, hearts: pose.hearts, stars: pose.stars, squeezed: pose.squeezed, dozing: pose.dozing, whoa: pose.whoa, sign, ticker: pose.ticker});
    for (const material of figure.screens) {
        material.uniforms.lit.value = crt.glow;
        material.uniforms.across.value = crt.across;
        material.uniforms.open.value = crt.open;
        material.uniforms.flash.value = crt.flash;
        if (pose.screen) material.uniforms.glow.value.set(...pose.screen.colour);
        screenFrame(material, lit, Math.floor((performance.now() * (pose.ticker ? TICKER.fps : FRAMES_PER_SECOND)) / 1000));
    }
    // the visor's outline pokes through the middle of the curved visor, unseen on the dark screen and plain on a lit one
    for (const hull of figure.visorHulls) hull.visible = !pose.screen || Boolean(pose.screen.sign);
    return moves;
}

// How many degrees the body turns for a look `further` round than its head goes (lookToward), in `posture`: none while it walks, its body
// facing the way it walks whatever its head glances at; seated, only a little, no further than it shifts on its seat (places.js
// SEAT_POSE), so it never turns round where it sits and its head turns the rest of its way; standing, all of it, so a look behind it on
// the page, as at what it admires, turns it round to it, its back to the viewer
export function bodyTurnFor(posture, further, limit = Infinity) {
    if (posture === "walk") return 0;
    if (!SEATED.has(posture)) return Math.min(Math.max(further, -limit), limit);
    const most = Math.max(...SEAT_POSE.turns);
    return Math.min(Math.max(further, -most), most);
}

// A look the eyes take on over whatever the body does, `seconds` into a look that lasts `lasts` seconds: taken on at once and let go at the
// end, the head turned to the viewer meanwhile so the eyes are seen. Hearts beat as a heart does, a strong swell and a weaker one.
const BEAT_SECONDS = 0.8;

// how strongly a look holds, 0 to 1, `seconds` into one that lasts `lasts`: eased in over `into` seconds and back out over `out` at the end
export const LOOK_EASE = {into: 0.35, out: 0.45};
export const lookStrength = ({seconds, lasts}) => partOf(seconds, [0, LOOK_EASE.into]) * (1 - partOf(seconds, [lasts - LOOK_EASE.out, lasts]));

// how big the heart eyes are `seconds` into their look, at its full strength: a strong swell and a weaker one each beat
export function heartBeat(seconds) {
    const beat = (seconds % BEAT_SECONDS) / BEAT_SECONDS;
    return 1 + 0.28 * swell(beat, 0, 0.3) + 0.14 * swell(beat, 0.3, 0.55);
}

// held by the pointer: its eyes wide and a round mouth under them on the visor, a 'whoa'
function startledHeld(pose) {
    eyesAs(pose, "startled");
    pose.whoa = true;
}

function lookAs(pose, {mood, seconds, lasts}) {
    const strength = lookStrength({seconds, lasts});
    if (EYES[mood].hearts) {
        pose.heartEyes(strength * heartBeat(seconds));
    } else {
        eyesAs(pose, mood, strength);
    }
}

// How far a figure turns toward the viewer so its face is seen, as while its eyes show anything or its visor glows: its face `share` of
// the way round from the way the body faces, never quite head on and never further from the viewer than `most` degrees, wherever the act
// had its head; its chest leaning in by `lean` of the way the body faces, its neck and head turning the rest, the head never further than
// HEAD_TURN from the chest, and its body, as far as its posture lets it (bodyTurnFor), what the head cannot, so a figure facing sideways
// or away still shows its face
export const TOWARD_VIEWER = {share: 0.8, lean: 0.12, most: 20};

// How far a figure seated on an edge turns toward the viewer by itself (turnToViewer), so its face shows however sideways it sits: by
// SEATED_TOWARD while it looks at nothing, and not at all while it looks at something, which may be the other way
export const SEATED_TOWARD = 0.55;
export const seatedTurn = (posture, at) => (posture === "sit" && !at ? SEATED_TOWARD : 0);

// the way `bone` faces in the figure's own axes as posed so far, in degrees from straight out of the page
function yawOf(pose, bone) {
    const ahead = new THREE.Vector3(0, -1, 0).transformDirection(pose.matrix(bone));
    return THREE.MathUtils.radToDeg(Math.atan2(ahead.x, -ahead.y));
}

// the figure turned `facing` degrees turned toward the viewer, `strength` of the way, 0 to 1; it returns how many degrees the body turns
// with it
export function turnToViewer(pose, facing, strength) {
    const sideways = signedTurn(facing);
    const face = () => signedTurn(facing + yawOf(pose, "head"));
    const most = TOWARD_VIEWER.most;
    const goal = mix(face(), THREE.MathUtils.clamp((1 - TOWARD_VIEWER.share) * sideways, -most, most), strength);
    pose.bendAbove("chest", {z: -TOWARD_VIEWER.lean * sideways * strength});
    pose.turn("neck", {z: -0.3 * signedTurn(face() - goal)});
    const within = signedTurn(yawOf(pose, "head") - yawOf(pose, "chest"));
    const turned = within - THREE.MathUtils.clamp(within - signedTurn(face() - goal), -HEAD_TURN, HEAD_TURN);
    pose.turn("head", {z: -turned});
    return bodyTurnFor(pose.posture, -signedTurn(face() - goal));
}

// the colour of a run's end shown in the eyes on the visor `screen` (visor.js visorAt), as white as its flash and as bright as it is lit
export const signColour = (screen) => {
    const sign = screen?.sign;
    return sign ? screen.colour.map((part) => (part + (1 - part) * sign.white) * sign.lit) : [1, 1, 1];
};

// the visor mesh every voice wears, the black screen its eyes are drawn on, and how lit it is before the eyes are gone from it
const VISOR_MESH = "face_screen";
const EYES_GONE = 0.05;
// the visor as it is unlit: its eyes shown and its band dark
const DARK_SCREEN = {eyes: 1, across: 0, open: 0, flash: 0, glow: 0};

// The clip's pose at `frame` for a figure of `rig` and `stance`, turned `facing` degrees, as Stage.draw draws it with `options`: the pose,
// and how many degrees the figure is turned as drawn
export function drawnPose(rig, stance, clip, frame, facing, {posture = "stand", eyes = null, stride = 0, sky = null, throws = null, leanWay = 0, walkWay = 0, at = null, target = null, open = 1, screen = null, tilt = 0, ticker = null, grabbed = false, phoneWay = 1} = {}) {
    const pose = new Posing(rig, posture, stride);
    Object.assign(pose, {phoneWay, ticker, sky, throws, leanWay, walkWay, screen, at, target, facing});
    if (!clip.legs) LEGS[posture]?.under(pose);
    clip.pose(pose, stance, frame / clip.frames);
    const headFree = 1 - pose.headContact;
    if (tilt && headFree) trunk(pose, {tilt: tilt * headFree});
    if (!clip.legs) LEGS[posture]?.over(pose);
    // whatever its eyes show, a look a moment puts in them, its visor aglow or a sign on it, startled held, or a picture its act puts on
    // the visor, it turns its face to the viewer so it is seen, a look at something giving way to it; never lounging, as it is only ever
    // drawn side-on, nor in an act that keeps its head alone
    const shows = turnsToViewer(posture) && clip.head !== HEAD.alone ? Math.max(eyes ? lookStrength(eyes) : 0, screen ? glowTurn(screen) : 0, grabbed ? 1 : 0, pose.eyesShown()) * headFree : 0;
    const looked = at && headFree ? {...at, amount: (at.amount ?? 1) * (1 - shows) * headFree} : null;
    const turned = facing + (looked && turnsToViewer(posture) ? bodyTurnFor(posture, lookToward(pose, looked, facing), looked.most) : 0);
    if (open < 1) pose.shutEyes(Math.min(pose.eyes, open));
    // the eyes go out as a lit visor comes on, closing to a line
    if (screen) pose.shutEyes(Math.min(pose.eyes, screen.eyes));
    // seated sideways with nothing to look at, it turns toward the viewer by itself, as it does while its eyes show something
    const seated = turnsToViewer(posture) && !holdsHead(clip) ? seatedTurn(posture, at) * headFree : 0;
    const toward = !pose.gaze ? Math.max(shows, seated) : shows;
    const round = toward ? turnToViewer(pose, turned, toward) : 0;
    if (eyes) lookAs(pose, eyes);
    if (at?.mood) eyesAs(pose, at.mood, at.amount);
    if (grabbed) startledHeld(pose);
    if (screen?.sign) pose.shapeEyes(screen.sign.name, screen.sign.strength);
    return {pose, turned: turned + round};
}

// whether a figure in `posture` may turn to the viewer for a look or its lit visor, or turn its head to look at something: never lounging,
// its legs straight out, as it is only ever drawn side-on
export const turnsToViewer = (posture) => posture !== "lounge";

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
        this.screenRenderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
        this.screenRenderer.setPixelRatio(1);
        this.screenRenderer.setClearColor(0x000000, 0);
    }

    headAt(figure, moves) {
        if (!moves) return {x: 0.5, y: 0.3};
        const at = figure.rig.eyes.reduce((sum, eye) => sum.add(eye), new THREE.Vector3()).divideScalar(figure.rig.eyes.length);
        return this.pictured(at.applyMatrix4(moves.get("head")));
    }

    // where the free hand grips in the picture, which way across the picture its side is, 1 to the right, and where the other hand grips
    handAt(figure, moves) {
        const side = freeSide(figure.stance);
        const other = side === "l" ? "r" : "l";
        if (!moves) return {x: 0.5 + SIDES[side] * 0.25, y: 0.6, out: SIDES[side], other: {x: 0.5 - SIDES[side] * 0.25, y: 0.6}};
        return {...this.gripAt(figure, moves, side), out: SIDES[side], other: this.gripAt(figure, moves, other)};
    }

    // where the hand on `side` grips in the picture
    gripAt(figure, moves, side) {
        const grip = new THREE.Vector3(SIDES[side] * HAND.grip, HAND.forward, 0).add(figure.rig.heads.get(`hand_${side}`));
        return this.pictured(grip.applyMatrix4(moves.get(`hand_${side}`)));
    }

    // a point of the posed figure as shares of its picture's width from the left and height from the top
    pictured(point) {
        const at = point.applyMatrix4(TO_GLB).project(this.camera);
        return {x: (at.x + 1) / 2, y: (1 - at.y) / 2};
    }

    // The clip's pose at this frame in `posture`, the figure turned `facing` degrees, with the look `eyes` takes on, drawn to fill the canvas;
    // on the move, `stride` is how far through its step the walk is, `sky` is how a figure watching the sky stands (watch), `throws` how the
    // things it flings out rummaging fly this time (acts.js throwsFor), `leanWay` the way it leans out rummaging (reachSide), `walkWay` the
    // way it walks to meet the mallet's bug (bug_smash), `at` is where
    // in its picture it looks (lookToward), with the look in its eyes as it does, `at.mood` (EYES), as when it admires a picture, `target` the bug its rifle aims at there (rifleAim), `open` how open a blink leaves the eyes (blink.js), `tilt` how many degrees the head leans (headTilt.js, grab.js), `grabbed` whether the pointer holds it, startled (startledHeld), `phoneWay` which mirrored telephone placement a seated call uses
    // (seatedCall), and during a change `blend` eases from
    // the moves drawn before it. It returns the moves it drew.
    draw(figure, clip, frame, facing, canvas, {blend = null, time = null, ...options} = {}) {
        const {pose, turned} = drawnPose(figure.rig, figure.stance, clip, frame, facing, options);
        const moves = place(figure, pose, turned, blend, time);
        this.drawBody(figure, canvas);
        this.drawScreen(figure, canvas);
        return moves;
    }

    // The opaque figure but its screen, drawn softened onto `canvas`. Translucent props share the screen's final colour pass so their
    // fading silhouettes and clear lenses composite on top of whichever body or visor surface is behind them.
    drawBody(figure, canvas) {
        const size = canvas.width * BODY_SUPERSAMPLE;
        if (this.renderer.domElement.width !== size) this.renderer.setSize(size, size, false);
        const hidden = new Map(figure.screens.map((material) => [material, material.visible]));
        figure.scene.traverse((node) => {
            for (const material of [node.material ?? []].flat()) if (propOverlay(material)) hidden.set(material, material.visible);
        });
        try {
            for (const material of hidden.keys()) material.visible = false;
            this.renderer.render(figure.scene, this.camera);
        } finally {
            for (const [material, visible] of hidden) material.visible = visible;
        }
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";
        context.filter = `blur(${softenOn(canvas)}px)`;
        context.drawImage(this.renderer.domElement, 0, 0, canvas.width, canvas.height);
        context.filter = "none";
    }

    // The screen and translucent props laid over the body supersampled and never softened. First fill depth with opaque geometry,
    // then draw their colour against that depth; a retiring prop in front of the visor blends over its pixels without hiding them
    // prematurely. The screen's own outline, which pokes through its curved middle, is left to the body.
    drawScreen(figure, canvas) {
        const size = canvas.width * SUPERSAMPLE;
        if (this.screenRenderer.domElement.width !== size) this.screenRenderer.setSize(size, size, false);
        const colours = new Map();
        const depths = new Map();
        const overlays = new Set(figure.screens);
        figure.scene.traverse((node) => {
            for (const material of [node.material ?? []].flat()) {
                colours.set(material, material.colorWrite);
                depths.set(material, material.depthWrite);
                if (propOverlay(material)) overlays.add(material);
            }
        });
        const outlined = figure.visorHulls.map((hull) => hull.visible);
        const autoClear = this.screenRenderer.autoClear;
        try {
            for (const material of colours.keys()) material.colorWrite = false;
            for (const material of overlays) if (propOverlay(material)) material.depthWrite = false;
            for (const hull of figure.visorHulls) hull.visible = false;
            this.screenRenderer.autoClear = false;
            this.screenRenderer.clear(true, true, true);
            this.screenRenderer.render(figure.scene, this.camera);
            for (const material of overlays) material.colorWrite = colours.get(material) ?? true;
            this.screenRenderer.render(figure.scene, this.camera);
        } finally {
            this.screenRenderer.autoClear = autoClear;
            figure.visorHulls.forEach((hull, index) => (hull.visible = outlined[index]));
            for (const [material, colorWrite] of colours) material.colorWrite = colorWrite;
            for (const [material, depthWrite] of depths) material.depthWrite = depthWrite;
        }
        this.screenCanvas ??= document.createElement("canvas");
        this.screenCanvas.width = canvas.width;
        this.screenCanvas.height = canvas.height;
        this.halvedOnto(this.screenRenderer.domElement, 0, 0, size, size, this.screenCanvas);
        canvas.getContext("2d").drawImage(this.screenCanvas, 0, 0);
    }

    // The part of `source` at (x, y), `width` by `height`, drawn onto `canvas` halved twice through a canvas between, each halving
    // averaging every two by two pixels into one
    halvedOnto(source, x, y, width, height, canvas) {
        this.half ??= document.createElement("canvas");
        this.half.width = canvas.width * 2;
        this.half.height = canvas.height * 2;
        drawSmoothed(this.half, source, x, y, width, height);
        drawSmoothed(canvas, this.half, 0, 0, this.half.width, this.half.height);
    }

    // A parcel's block of server units (serverBlockOf) with its lights `lit` at step `phase` of their blink, drawn through the figure's own
    // camera at the scale of a figure whose picture is `picture` pixels high on the page, `ratio` canvas pixels to a page pixel: a canvas
    // just holding it, and how many page pixels of it lie below the floor
    drawBlock(lit, phase, picture, ratio) {
        if (this.blockFor !== picture) this.block = serverBlockOf(FRAMED_HEIGHT / picture);
        this.blockFor = picture;
        lightBlock(this.block, lit, phase);
        const drawn = this.propPicture(this.block, new THREE.Vector3(0, 0, 0), picture, ratio);
        return {canvas: drawn.canvas, below: drawn.height - drawn.at.y};
    }

    // The UFO's saucer (saucerOf) with its rim lights at step `phase` of their blink, drawn through the figure's own camera at the scale of
    // a figure whose picture is `picture` pixels high on the page, `ratio` canvas pixels to a page pixel: a canvas just holding it, and
    // where its middle is on it, in page pixels from its top left
    drawSaucer(phase, picture, ratio) {
        if (this.saucerFor !== picture) this.saucer = saucerOf(FRAMED_HEIGHT / picture);
        this.saucerFor = picture;
        lightSaucer(this.saucer, phase);
        const drawn = this.propPicture(this.saucer, this.saucer.middle, picture, ratio);
        return {canvas: drawn.canvas, at: drawn.at};
    }

    // The bug (bugOf) at step `phase` of its stride drawn through the figure's own camera at the scale of a figure whose picture is `picture`
    // pixels high, `ratio` canvas pixels to a page pixel: a canvas just holding it, and where the point under its middle on the floor is
    drawBug(phase, picture, ratio) {
        const bug = bugOf(FRAMED_HEIGHT / picture, phase);
        const drawn = this.propPicture(bug, bug.foot, picture, ratio);
        return {canvas: drawn.canvas, at: drawn.at};
    }

    // The parachute's canopy (canopyOf) drawn through the figure's own camera at the scale of a figure whose picture is `picture` pixels high,
    // `ratio` canvas pixels to a page pixel: a canvas just holding it, where the middle of its rim is on it, and where its lines leave the
    // rim, the left hand's pair first, in page pixels from its top left
    drawCanopy(picture, ratio) {
        const canopy = canopyOf(FRAMED_HEIGHT / picture, picture);
        const drawn = this.propPicture(canopy, canopy.middle, picture, ratio);
        const centre = canopy.middle.clone().project(this.camera);
        const pixels = (k) => ((k + 1) / 2) * picture;
        const ends = canopy.ends.map((end) => {
            const at = end.clone().project(this.camera);
            return {x: drawn.at.x + pixels(at.x) - pixels(centre.x), y: drawn.at.y - pixels(at.y) + pixels(centre.y)};
        });
        return {canvas: drawn.canvas, at: drawn.at, ends};
    }

    // A prop's `scene` rendered through the figure's camera at the scale of a figure whose picture is `picture` pixels high, cut to a canvas
    // just holding its `bounds`: the canvas, how high it is in page pixels, and where the point `origin` falls on it, from its top left
    propPicture({scene, bounds}, origin, picture, ratio) {
        const size = Math.round(picture * ratio) * SUPERSAMPLE;
        if (this.renderer.domElement.width !== size) this.renderer.setSize(size, size, false);
        this.renderer.render(scene, this.camera);
        const {min, max} = bounds;
        const corners = [min.x, max.x].flatMap((x) => [min.y, max.y].flatMap((y) => [min.z, max.z].map((z) => new THREE.Vector3(x, y, z).project(this.camera))));
        const across = (k) => ((k + 1) / 2) * size;
        const left = Math.floor(Math.min(...corners.map((at) => across(at.x)))) - SUPERSAMPLE;
        const right = Math.ceil(Math.max(...corners.map((at) => across(at.x)))) + SUPERSAMPLE;
        const top = Math.floor(Math.min(...corners.map((at) => size - across(at.y)))) - SUPERSAMPLE;
        const bottom = Math.ceil(Math.max(...corners.map((at) => size - across(at.y)))) + SUPERSAMPLE;
        const canvas = document.createElement("canvas");
        canvas.width = Math.round((right - left) / SUPERSAMPLE);
        canvas.height = Math.round((bottom - top) / SUPERSAMPLE);
        this.halvedOnto(this.renderer.domElement, left, top, right - left, bottom - top, canvas);
        const point = origin.clone().project(this.camera);
        const page = (pixels) => pixels / SUPERSAMPLE / ratio;
        return {canvas, height: page(bottom - top), at: {x: page(across(point.x) - left), y: page(size - across(point.y) - top)}};
    }
}
