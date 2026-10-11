// The butler's wave clip drawn twice: from the rendered sheet, and in the browser from the rigged glb, posed by a port of
// clips.py and rig.Posing and shaded as toon.py shades it, held for each step of the clip.
import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
import {DRACOLoader} from "three/addons/loaders/DRACOLoader.js";

const VOICE = "butler";
const CLIP = {name: "wave", frames: 12, fps: 12};
const SHEET = {url: `../../../src/web/dist/mascots/${VOICE}/${CLIP.name}.webp`, cell: 224, columns: 8};
const FIGURE = new URLSearchParams(location.search).get("figure") ?? `${VOICE}.glb`;
const WARDROBE = "../wardrobe/wardrobe_manifest.json";

// render_clips.py and snaps.py: an orthographic camera eight units in front, framing 5.4 units about a height of 2.4
const FRAMED_HEIGHT = 5.4;
const FRAMED_MIDDLE = 2.4;
const DISTANCE = 8;
const DEPTH = 3;

// EEVEE takes 16 samples a pixel; the browser draws the cell this many times wider and scales it down
const SUPERSAMPLE = Number(new URLSearchParams(location.search).get("supersample") ?? 2);

// and softens it as EEVEE's 1.5 px pixel filter does, as a blur this many cell pixels wide
const SOFTEN = Number(new URLSearchParams(location.search).get("soften") ?? 0.5);

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
const LEVEL_ITEMS = new Set(["butler_tray", "butler_tablet", "colleague_mug"]);
const BUSY_ITEMS = new Set([...LEVEL_ITEMS, "squire_shield", "coach_clipboard"]);
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
                .multiply(translation(rest)),
        );
    }

    bend(name, degrees) {
        const {base, side} = sideOf(name);
        const standing = this.standing(name);
        const axis = hingeAxis(base, side).transformDirection(standing).normalize();
        const turn = new THREE.Matrix4().makeRotationAxis(axis, radians(degrees));
        this.final.set(name, aboutPoint(this.head(name, standing), turn).multiply(standing));
    }

    moves() {
        const moves = new Map();
        for (const name of this.rig.order) {
            const parent = this.rig.parents.get(name);
            moves.set(name, this.final.get(name) ?? (parent ? moves.get(parent) : new THREE.Matrix4()));
        }
        return moves;
    }
}

const waveOf = (t, turns = 1) => Math.sin(2 * Math.PI * turns * t);

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

function armsAtRest(pose, stance, apart = []) {
    for (const side of Object.keys(SIDES)) {
        if (apart.includes(side)) {
            continue;
        }
        if (stance.level.has(side)) {
            hold(pose, side);
            continue;
        }
        hang(pose, side);
    }
}

function wave(pose, stance, t) {
    const side = stance.busy.has("r") ? "l" : "r";
    const sign = SIDES[side];
    trunk(pose, {twist: -sign * 4, turn: -sign * 8, tilt: -sign * 6});
    armsAtRest(pose, stance, [side]);
    pose.turn(`upper_arm_${side}`, {x: -RAISED_ROLL});
    pose.turn(`upper_arm_${side}`, {y: -sign * 10});
    pose.bend(`forearm_${side}`, 45 + 22 * waveOf(t));
}

const SKINNED = /* glsl */ `
    #include <common>
    #include <skinning_pars_vertex>
    attribute vec3 hullNormal;
    uniform float push;
    varying vec3 worldNormal;

    void main() {
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

function flatMaterial(colour) {
    return new THREE.ShaderMaterial({
        vertexShader: SKINNED,
        fragmentShader: FLAT,
        side: THREE.DoubleSide,
        uniforms: {
            push: {value: 0},
            colour: {value: new THREE.Vector3(colour.r, colour.g, colour.b)},
            light: {value: toGlbDirection(LIGHT_FROM)},
            shade: {value: SHADE},
            litFrom: {value: LIT_FROM},
        },
    });
}

function outlineMaterial() {
    return new THREE.ShaderMaterial({
        vertexShader: SKINNED,
        fragmentShader: LINE,
        side: THREE.BackSide,
        defines: {HULL: ""},
        uniforms: {push: {value: OUTLINE_WIDTH}, colour: {value: OUTLINE_COLOUR}},
    });
}

function toGlbDirection(vector) {
    return vector.clone().normalize().applyMatrix4(TO_GLB);
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

function coveredParts(manifest) {
    return new Set(manifest.outfits[VOICE].flatMap((item) => manifest.assets[item].hide_base_parts));
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
    return {bones, order: bones.map((bone) => bone.name), parents, rest, heads};
}

function poseRig(rig, moves) {
    const world = new Map();
    for (const bone of rig.bones) {
        const move = TO_GLB.clone().multiply(moves.get(bone.name)).multiply(FROM_GLB);
        const placed = move.multiply(rig.rest.get(bone.name));
        world.set(bone.name, placed);
        const parentWorld = bone.parent.isBone ? world.get(bone.parent.name) : bone.parent.matrixWorld;
        parentWorld.clone().invert().multiply(placed).decompose(bone.position, bone.quaternion, bone.scale);
    }
}

async function loadFigure() {
    const draco = new DRACOLoader().setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/libs/draco/gltf/");
    const [gltf, manifest] = await Promise.all([
        new GLTFLoader().setDRACOLoader(draco).loadAsync(FIGURE),
        fetch(WARDROBE).then((response) => response.json()),
    ]);
    const scene = gltf.scene;
    scene.updateMatrixWorld(true);
    const covered = coveredParts(manifest);
    const meshes = [];
    scene.traverse((node) => node.isSkinnedMesh && meshes.push(node));
    for (const mesh of meshes) {
        mesh.visible = !covered.has(mesh.name);
        addHullNormals(mesh.geometry);
        const hull = new THREE.SkinnedMesh(mesh.geometry, outlineMaterial());
        hull.bind(mesh.skeleton, mesh.bindMatrix);
        hull.visible = mesh.visible;
        hull.frustumCulled = mesh.frustumCulled = false;
        mesh.material = flatMaterial(mesh.material.color);
        mesh.parent.add(hull);
        hull.position.copy(mesh.position);
        hull.quaternion.copy(mesh.quaternion);
        hull.scale.copy(mesh.scale);
    }
    const stance = {level: handsHolding(meshes, LEVEL_ITEMS), busy: handsHolding(meshes, BUSY_ITEMS)};
    return {scene, rig: rigOf(scene), stance};
}

function camera() {
    const half = FRAMED_HEIGHT / 2;
    const view = new THREE.OrthographicCamera(-half, half, half, -half, DISTANCE - DEPTH, DISTANCE + DEPTH);
    view.position.set(0, FRAMED_MIDDLE, DISTANCE);
    view.lookAt(0, FRAMED_MIDDLE, 0);
    return view;
}

function sheetCell(size) {
    const cell = document.createElement("div");
    cell.className = "sheet";
    const rows = Math.ceil(CLIP.frames / SHEET.columns);
    Object.assign(cell.style, {
        width: `${size}px`,
        height: `${size}px`,
        backgroundImage: `url(${SHEET.url})`,
        backgroundSize: `${size * SHEET.columns}px ${size * rows}px`,
    });
    return {
        element: cell,
        show(frame) {
            const row = Math.floor(frame / SHEET.columns);
            cell.style.backgroundPosition = `${-(frame % SHEET.columns) * size}px ${-row * size}px`;
        },
    };
}

function figureCaption(element, words) {
    const figure = document.createElement("figure");
    const caption = document.createElement("figcaption");
    caption.textContent = words;
    figure.append(element, caption);
    return figure;
}

async function main() {
    const {scene, rig, stance} = await loadFigure();
    const view = camera();
    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true, preserveDrawingBuffer: true});
    renderer.setPixelRatio(1);
    renderer.setSize(SHEET.cell * SUPERSAMPLE, SHEET.cell * SUPERSAMPLE, false);
    renderer.setClearColor(0x000000, 0);
    const cells = [];
    const pictures = [];
    for (const row of document.querySelectorAll(".row")) {
        const size = Number(row.dataset.size);
        const cell = sheetCell(size);
        const picture = document.createElement("canvas");
        Object.assign(picture.style, {width: `${size}px`, height: `${size}px`});
        picture.width = picture.height = SHEET.cell;
        cells.push(cell);
        pictures.push(picture);
        row.append(figureCaption(cell.element, `Rendered sheet, ${size} px`), figureCaption(picture, `Browser, ${size} px`));
    }
    let frame = 0;
    let shown = -1;
    let paused = false;
    let started = performance.now();
    const draw = () => {
        const pose = new Posing(rig);
        wave(pose, stance, frame / CLIP.frames);
        poseRig(rig, pose.moves());
        renderer.render(scene, view);
        for (const picture of pictures) {
            const context = picture.getContext("2d");
            context.clearRect(0, 0, SHEET.cell, SHEET.cell);
            context.imageSmoothingQuality = "high";
            context.filter = `blur(${SOFTEN}px)`;
            context.drawImage(renderer.domElement, 0, 0, SHEET.cell, SHEET.cell);
        }
        cells.forEach((cell) => cell.show(frame));
        document.getElementById("frame").textContent = `Frame ${frame + 1} of ${CLIP.frames}`;
        shown = frame;
    };
    const tick = (now) => {
        if (!paused) {
            frame = Math.floor(((now - started) / 1000) * CLIP.fps) % CLIP.frames;
        }
        if (frame !== shown) {
            draw();
        }
        requestAnimationFrame(tick);
    };
    document.getElementById("pause").addEventListener("click", (event) => {
        paused = !paused;
        started = performance.now() - (frame / CLIP.fps) * 1000;
        event.target.textContent = paused ? "Play" : "Pause";
    });
    document.getElementById("step").addEventListener("click", () => {
        paused = true;
        document.getElementById("pause").textContent = "Play";
        frame = (frame + 1) % CLIP.frames;
    });
    window.showFrame = (index) => {
        paused = true;
        frame = index;
        draw();
        return pictures[0].toDataURL("image/png");
    };
    requestAnimationFrame(tick);
}

main();
