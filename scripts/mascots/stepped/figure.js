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
const SIDES = {l: 1, r: -1};
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
const LEVEL_ITEMS = new Set(["butler_tray", "butler_tablet", "colleague_mug"]);
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
    constructor(rig) {
        this.rig = rig;
        this.final = new Map();
        this.eyes = 1;
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

    shutEyes(open) {
        this.eyes = Math.max(open, MIN_EYE_HEIGHT);
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
    pose.turn(`forearm_${side}`, {x: -bend});
}

function hold(pose, side) {
    const sign = SIDES[side];
    pose.turn(`upper_arm_${side}`, {y: sign * HANG});
    pose.turn(`upper_arm_${side}`, {z: sign * HOLD_ROLL});
    pose.face(`forearm_${side}`, {y: -sign * HOLD_LIFT, z: -sign * HOLD_SWING});
    pose.face(`hand_${side}`, {z: -sign * HOLD_TWIST});
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
    pose.reach(side, new THREE.Vector3(sign * x, y, z), new THREE.Vector3(...THINK_ELBOW));
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
    const phase = 2 * Math.PI * t;
    pose.lift("root", {z: 0.05 * Math.cos(2 * phase)});
    pose.turn("hips", {z: 5 * Math.sin(phase)});
    trunk(pose, {lean: 3, twist: -7 * Math.sin(phase), turn: 3 * Math.sin(phase)});
    armsAtRest(pose, stance, [], {l: 22 * Math.sin(phase), r: -22 * Math.sin(phase)});
    for (const [side, offset] of [
        ["l", 0.0],
        ["r", Math.PI],
    ]) {
        const angle = phase + offset;
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
const SEAT_LIFT = 0.20;
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
    return Math.min(Math.max(t * frames / (frames - 1), 0), 1);
}

export function supportsClip(name, stance) {
    return name !== "pull_ups" || !(stance.busy.size || stance.level.size);
}

function sit_on_edge(pose, stance, t) {
    const sway = waveOf(t);
    pose.lift("root", {z: SEAT_LIFT});
    trunk(pose, {lean: 1.5 * sway, nod: -1.5 * sway, turn: 3 * waveOf(t, 1)});
    armsAtRest(pose, stance);
    for (const [side, sign] of Object.entries(SIDES)) {
        pose.turn(`thigh_${side}`, {x: -88});
        pose.bend(`shin_${side}`, 88 + sign * 9 * sway);
        pose.turn(`foot_${side}`, {x: -sign * 5 * sway});
    }
    pose.shutEyes(blinkAt(t, 0.625, 24));
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
    const upper = thigh.z - shin.z, lower = shin.z - foot.z;
    const down = upper + lower + rootHeight - lift;
    const cosine = (forward * forward + down * down - upper * upper - lower * lower) / (2 * upper * lower);
    if (cosine < -1 - 1e-10 || cosine > 1 + 1e-10) {
        throw new RangeError(`${side} stride target is outside the unchanged leg reach`);
    }
    const knee = Math.acos(Math.round(cosine * 1e10) / 1e10);
    const hip = Math.atan2(forward, down) - Math.atan2(lower * Math.sin(knee), upper + lower * Math.cos(knee));
    pose.turn(`thigh_${side}`, {x: hip * 180 / Math.PI});
    pose.bend(`shin_${side}`, knee * 180 / Math.PI);
    pose.face(`foot_${side}`, {x: toe});
}

function entering(pose, stance, t, frames, running = false) {
    const u = onceTime(t, frames);
    const q = Math.min(u / ENTRY_TRAVEL_END, 1);
    const progress = ease(q);
    const distance = ENTRY_DISTANCE * (1 - progress);
    const motion = 1 - ease((q - 0.76) / 0.24);
    const [stride, duty, clearance] = running ? [1.84, 0.38, 0.20] : [1.36, 0.60, 0.16];
    const cycle = ENTRY_DISTANCE * progress / stride;
    const halfPhase = cycle % 0.5;
    const flight = running && halfPhase > duty ? Math.max(0, Math.sin(Math.PI * (halfPhase - duty) / (0.5 - duty))) : 0;
    const rootHeight = motion * (-(running ? 0.075 : 0.11) + (running ? 0.055 * flight : 0));
    pose.lift("root", {y: distance, z: rootHeight});
    trunk(pose, {lean: (running ? 10 : 3) * motion, nod: (running ? -6 : -2) * motion});
    const swing = (running ? 24 : 14) * waveOf(cycle) * motion;
    const carried = stance.carried ?? stance.busy;
    const jogging = Object.keys(SIDES).filter((side) => running && !carried.has(side) && !stance.level.has(side));
    armsAtRest(pose, stance, jogging, Object.fromEntries(Object.entries(SIDES).map(([side, sign]) =>
        [side, carried.has(side) ? 0 : sign * swing])));
    for (const side of jogging) hang(pose, side, SIDES[side] * swing, 10 + 40 * motion);
    if (motion > 0) {
        for (const [side, offset] of [["l", 0], ["r", 0.5]]) {
            const [step, lift] = strideFoot(cycle + offset, stride, duty, clearance);
            const phase = (cycle + offset) % 1;
            const flightPhase = phase >= duty ? (phase - duty) / (1 - duty) : 0;
            const toe = (running ? 14 : 11) * Math.sin(Math.PI * flightPhase) * motion;
            stepLeg(pose, side, motion * step, motion * lift, rootHeight, toe);
        }
    }
    const facing = 90 * (1 - ease((u - ENTRY_TRAVEL_END) / (ENTRY_TURN_END - ENTRY_TRAVEL_END)));
    pose.revolve(facing);
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
    const pull = 0.5 - 0.5 * Math.cos(2 * Math.PI * t);
    pose.lift("root", {z: 0.20 + 0.38 * pull});
    trunk(pose, {nod: -3 * pull});
    for (const [side, sign] of Object.entries(SIDES)) {
        const shoulder = pose.head(`upper_arm_${side}`, pose.standing(`upper_arm_${side}`));
        const heads = pose.rig.heads;
        const upper = Math.abs(heads.get(`forearm_${side}`).x - heads.get(`upper_arm_${side}`).x);
        const lower = Math.abs(heads.get(`hand_${side}`).x - heads.get(`forearm_${side}`).x);
        const across = PULL_WRIST_X - sign * shoulder.x, up = PULL_WRIST_Z - shoulder.z;
        const bend = Math.acos((across * across + up * up - upper * upper - lower * lower) / (2 * upper * lower));
        const raiseBy = Math.atan2(up, across) - Math.atan2(lower * Math.sin(bend), upper + lower * Math.cos(bend));
        pose.turn(`upper_arm_${side}`, {x: -90});
        pose.turn(`upper_arm_${side}`, {y: -sign * raiseBy * 180 / Math.PI});
        pose.bend(`forearm_${side}`, bend * 180 / Math.PI);
        pose.face(`hand_${side}`, {x: -90, y: -sign * 45});
        pose.turn(`thigh_${side}`, {x: -8});
        pose.bend(`shin_${side}`, 18);
        pose.turn(`foot_${side}`, {x: -10});
    }
}

export const CLIPS = [
    {name: "idle", frames: 24, fps: 8, loops: true, pose: idle},
    {name: "blink", frames: 6, fps: 12, loops: false, pose: blink},
    {name: "nod", frames: 10, fps: 12, loops: false, pose: nod},
    {name: "shake", frames: 12, fps: 12, loops: false, pose: shake},
    {name: "wave", frames: 12, fps: 12, loops: true, pose: wave},
    {name: "think", frames: 12, fps: 6, loops: true, pose: think},
    {name: "celebrate", frames: 12, fps: 10, loops: true, pose: celebrate},
    {name: "sleep", frames: 18, fps: 6, loops: true, pose: sleep},
    {name: "walk", frames: 12, fps: 12, loops: true, pose: walk},
    {name: "sit_on_edge", frames: 24, fps: 8, loops: true, pose: sit_on_edge},
    {name: "walk_in", frames: 40, fps: 12, loops: false, pose: walk_in},
    {name: "run_in", frames: 28, fps: 12, loops: false, pose: run_in},
    {name: "pull_ups", frames: 24, fps: 10, loops: true, pose: pull_ups},
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
    const draco = new DRACOLoader().setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/");
    const [bytes, manifest] = await Promise.all([glbBytes(url), fetch(wardrobe).then((response) => response.json())]);
    const gltf = await new GLTFLoader().setDRACOLoader(draco).parseAsync(bytes, "");
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);
    const bare = voice === "bare";
    const covered = new Set((bare ? [] : manifest.outfits[voice]).flatMap((item) => manifest.assets[item].hide_base_parts));
    const meshes = [];
    scene.traverse((node) => node.isSkinnedMesh && meshes.push(node));
    const eyes = [];
    for (const mesh of meshes) {
        mesh.visible = !covered.has(mesh.name) && !(bare && mesh.userData.item);
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
            eyes.push(mesh.material, hull.material);
        }
    }
    const carried = meshes.filter((mesh) => mesh.visible);
    const stance = {level: handsHolding(carried, LEVEL_ITEMS), busy: handsHolding(carried, BUSY_ITEMS),
        carried: handsHolding(carried, new Set([...BUSY_ITEMS, "squire_quill"]))};
    return {scene, rig: rigOf(scene), stance, eyes};
}

function place(figure, pose, facing) {
    const moves = pose.moves(facing);
    const world = new Map();
    for (const bone of figure.rig.bones) {
        const placed = TO_GLB.clone().multiply(moves.get(bone.name)).multiply(FROM_GLB).multiply(figure.rig.rest.get(bone.name));
        world.set(bone.name, placed);
        const parentWorld = bone.parent.isBone ? world.get(bone.parent.name) : bone.parent.matrixWorld;
        parentWorld.clone().invert().multiply(placed).decompose(bone.position, bone.quaternion, bone.scale);
    }
    for (const material of figure.eyes) {
        material.uniforms.openness.value = pose.eyes;
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

    // the clip's pose at this frame, the figure turned `facing` degrees, drawn to fill the canvas
    draw(figure, clip, frame, facing, canvas) {
        const pose = new Posing(figure.rig);
        clip.pose(pose, figure.stance, frame / clip.frames);
        place(figure, pose, facing);
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
    }
}
