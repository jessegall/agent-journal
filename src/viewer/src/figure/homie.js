import * as THREE from "three";
import {PROP_FADE_SECONDS, fadeProp, restorePropOpacity} from "./propTransition.js";
import {HeadphoneBandCurve, clearHeadphonePoint, fitHeadphoneBand, headphoneCollidersOf} from "./headphoneClearance.js";

// A loose headset rests in front of the hoodie. Its cups keep their shape; the band opens as both hands lift it over the cap.
export const HEADPHONES = {
    frames: 120, fps: 18,
    cup: {radius: 0.25, depth: 0.1, pad: 0.045, insert: 0.18, outline: 0.016},
    band: {radius: 0.012, outline: 0.008, segments: 40},
    colours: {silver: [0.46778381, 0.47932017, 0.60382736], accent: [0.17144111, 0.13843161, 0.86315721], dark: [0.02217389, 0.02315337, 0.04518620]},
};

const smooth = (value) => {
    const k = Math.max(0, Math.min(1, value));
    return k * k * (3 - 2 * k);
};
const span = (value, a, b) => smooth((value - a) / (b - a));
const TO_GLB = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
const FROM_GLB = TO_GLB.clone().invert();
const support = (moves, bone) => TO_GLB.clone().multiply(moves.get(bone)).multiply(FROM_GLB);

export function headphoneProgress(u) {
    return u == null ? 0 : span(u, 0.1, 0.34) * (1 - span(u, 0.68, 0.92));
}

export function headphoneGrip(u) {
    return span(u, 0.02, 0.1) * (1 - span(u, 0.34, 0.4)) + span(u, 0.62, 0.68) * (1 - span(u, 0.92, 1));
}

const poses = [
    {at: 0, bone: "chest", cups: [0.4, 1.96, 0.75], turn: 0.45, band: [[0.4, 2.17, 0.75], [1.05, 2.56, 0.65], [1.05, 2.56, -0.85], [0, 2.56, -0.96], [-1.05, 2.56, -0.85], [-1.05, 2.56, 0.65], [-0.4, 2.17, 0.75]]},
    {at: 0.3, bone: "chest", cups: [1.42, 2.15, 0.85], turn: 1.25, band: [[1.42, 2.36, 0.85], [1.4, 2.48, 0.4], [1.1, 2.49, -1.25], [0, 2.47, -1.65], [-1.1, 2.49, -1.25], [-1.4, 2.48, 0.4], [-1.42, 2.36, 0.85]]},
    {at: 0.75, bone: "chest", cups: [1.42, 3.23, 0.2], turn: Math.PI / 2, band: [[1.42, 3.44, 0.2], [1.4, 3.88, -0.18], [1.1, 4.3, -1.25], [0, 4.5, -1.65], [-1.1, 4.3, -1.25], [-1.4, 3.88, -0.18], [-1.42, 3.44, 0.2]]},
    // The pads sit against the bare head's outlined sides after the wider lift has cleared the cap.
    {at: 1, bone: "head", cups: [1.08, 3.23, 0], turn: Math.PI / 2, band: [[1.08, 3.44, 0], [1.3, 3.8, 0], [0.92, 4.1, 0], [0, 4.23, 0], [-0.92, 4.1, 0], [-1.3, 3.8, 0], [-1.08, 3.44, 0]]},
];

// Absolute model-space anchors become one rigid frame on the chest or the head. The band is the only flexible part.
function fittedPose(descriptor, moves) {
    const frame = support(moves, descriptor.bone);
    const rotation = new THREE.Quaternion().setFromRotationMatrix(frame);
    return {
        progress: descriptor.at,
        cups: [1, -1].map((sign) => ({
            at: new THREE.Vector3(sign * descriptor.cups[0], descriptor.cups[1], descriptor.cups[2]).applyMatrix4(frame),
            turn: rotation.clone().multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), sign * descriptor.turn)),
        })),
        band: descriptor.band.map((point) => new THREE.Vector3(...point).applyMatrix4(frame)),
    };
}

export function headphonesAt(u, moves) {
    const progress = headphoneProgress(u);
    const last = poses.findIndex((pose) => pose.at >= progress);
    if (last <= 0) return fittedPose(poses[0], moves);
    const before = poses[last - 1], after = poses[last];
    const k = span(progress, before.at, after.at);
    const a = fittedPose(before, moves), b = fittedPose(after, moves);
    return {
        progress,
        cups: a.cups.map((cup, index) => ({at: cup.at.lerp(b.cups[index].at, k), turn: cup.turn.slerp(b.cups[index].turn, k)})),
        band: a.band.map((point, index) => point.lerp(b.band[index], k)),
    };
}

export function headphoneContacts(state) {
    const k = span(state.progress, 0.25, 0.75);
    const angle = (15 + 75 * k) * Math.PI / 180, direction = (15 + 75 * k) * Math.PI / 180;
    return state.cups.map(({at, turn}, index) => {
        const sign = index ? -1 : 1;
        return {
            at: new THREE.Vector3(sign * 0.24 * Math.cos(angle), -0.24 * Math.sin(angle), 0.05).applyQuaternion(turn).add(at),
            along: new THREE.Vector3(-sign * Math.cos(direction), Math.sin(direction), 0.8 * (1 - k)).normalize().applyQuaternion(turn),
        };
    });
}

// Free cups yield forward and down from an approaching arm or chin. Their orientation and shape stay rigid, and the neck loop
// follows the shifted cup anchors. The authored hand-held music path already clears the body and retains its exact contact points.
export function fittedHeadphonesAt(headphones, u, moves) {
    const state = headphonesAt(u, moves);
    if (!headphones?.colliders) return state;
    const free = u == null ? 1 : (1 - headphoneGrip(u)) * (1 - headphoneProgress(u));
    if (free > 0) {
        const chest = support(moves, "chest");
        state.cups.forEach((cup, index) => {
            const direction = new THREE.Vector3(index ? -0.2 : 0.2, -0.55, 1).transformDirection(chest);
            const at = clearHeadphonePoint(cup.at, headphones.colliders, moves, {radius: 0.29, outline: 0, direction});
            const shift = at.clone().sub(cup.at).multiplyScalar(free);
            cup.at.add(shift);
            const end = index ? state.band.length - 1 : 0, next = index ? end - 1 : 1;
            state.band[end].add(shift);
            state.band[next].addScaledVector(shift, 0.35);
        });
    }
    const fit = fitHeadphoneBand(state.band, headphones.colliders, moves, HEADPHONES.band);
    return {...state, band: fit.points, linear: fit.linear, corrections: fit.corrections, unresolved: fit.unresolved, maximumBandShift: fit.maximumShift ?? 0};
}

export function dressHomie(meshes) {
    const removed = meshes.filter((mesh) => mesh.name.startsWith("homie_headphones__"));
    for (const mesh of removed) mesh.parent.remove(mesh);
    return meshes.filter((mesh) => !removed.includes(mesh));
}

function bandGeometry(points, linear = false) {
    const curve = linear ? new HeadphoneBandCurve(points) : new THREE.CatmullRomCurve3(points, false, "catmullrom", 0.15);
    const geometry = new THREE.TubeGeometry(curve, linear ? points.length - 1 : HEADPHONES.band.segments, HEADPHONES.band.radius, 8, false);
    geometry.setAttribute("hullNormal", geometry.attributes.normal.clone());
    return geometry;
}

export function headphonesOf(shadedPart, meshes = null) {
    const root = new THREE.Group();
    root.name = "homie_headphones";
    const colour = (name) => new THREE.Color(...HEADPHONES.colours[name]);
    const cup = HEADPHONES.cup;
    const cylinder = (radius, depth) => new THREE.CylinderGeometry(radius, radius, depth, 32).rotateX(Math.PI / 2);
    const cups = ["l", "r"].map((side) => {
        const group = new THREE.Group();
        group.name = `homie_headphones_${side}`;
        shadedPart(group, "pad", cylinder(cup.radius * 0.91, cup.pad), colour("dark"), [0, 0, -(cup.depth + cup.pad) / 2]);
        shadedPart(group, "cup", cylinder(cup.radius, cup.depth), colour("silver"));
        shadedPart(group, "insert", cylinder(cup.insert, 0.014), colour("accent"), [0, 0, cup.depth / 2 + 0.008]);
        for (const part of group.children) if (part.children[0]?.material.uniforms?.push) part.children[0].material.uniforms.push.value = cup.outline;
        root.add(group);
        return group;
    });
    const band = shadedPart(root, "band", bandGeometry(poses[0].band.map((point) => new THREE.Vector3(...point))), colour("dark"));
    if (band.children[0]?.material.uniforms?.push) band.children[0].material.uniforms.push.value = HEADPHONES.band.outline;
    return {root, cups, band, colliders: meshes ? headphoneCollidersOf(meshes) : null, previous: null, raised: false, returning: null};
}

function applyHeadphones(headphones, state) {
    headphones.cups.forEach((cup, index) => {
        cup.position.copy(state.cups[index].at);
        cup.quaternion.copy(state.cups[index].turn);
    });
    const geometry = bandGeometry(state.band, state.linear);
    headphones.band.geometry.dispose();
    headphones.band.geometry = headphones.band.children[0].geometry = geometry;
    headphones.root.updateMatrixWorld(true);
    headphones.previous = state;
}

// A cancelled jam retires its last placement, then restores the loose headset. The zero-opacity midpoint never shows two headsets.
export function moveHeadphones(headphones, requested, moves, time) {
    if (!headphones) return false;
    restorePropOpacity(headphones.root);
    if (!Number.isFinite(time)) headphones.returning = null;
    else if (!requested && headphones.raised && !headphones.returning) headphones.returning = {from: headphones.previous, began: time, elapsed: 0};
    let active = false, state = null, alpha = 1;
    if (headphones.returning) {
        const elapsed = headphones.returning.elapsed = Math.max(headphones.returning.elapsed, time - headphones.returning.began);
        if (elapsed < 2 * PROP_FADE_SECONDS) {
            active = true;
            if (elapsed < PROP_FADE_SECONDS) {
                state = headphones.returning.from;
                alpha = 1 - span(elapsed, 0, PROP_FADE_SECONDS);
            } else alpha = span(elapsed, PROP_FADE_SECONDS, 2 * PROP_FADE_SECONDS);
        } else headphones.returning = null;
    }
    state ??= fittedHeadphonesAt(headphones, requested?.u ?? null, moves);
    applyHeadphones(headphones, state);
    fadeProp(headphones.root, alpha);
    // Grasping already relaxes the free-cup fit before lift and after lowering. Cancelling either phase must retire that exact
    // placement too; the normal zero-grip endpoints retain the ordinary loose-neck fit without a recovery.
    headphones.raised = Boolean(requested && (headphoneProgress(requested.u) > 1e-9 || headphoneGrip(requested.u) > 1e-9));
    return active;
}
