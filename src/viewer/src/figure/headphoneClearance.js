import * as THREE from "three";

const TO_GLB = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
const FROM_GLB = TO_GLB.clone().invert();
const DIRECTIONS = [];
for (let x = -1; x <= 1; x++) for (let y = -1; y <= 1; y++) for (let z = -1; z <= 1; z++) {
    if (x || y || z) DIRECTIONS.push(new THREE.Vector3(x, y, z).normalize());
}
const CLEARANCE = {nodes: 65, bare: 0.002, outlined: 0.004};

const materialPush = (mesh) => (mesh.userData.hull ?? mesh.children.find((child) => child.material?.uniforms?.push))?.material.uniforms.push.value ?? 0;
const identity = (matrix) => matrix.equals(new THREE.Matrix4());

function meshData(mesh, outlined) {
    const {position, hullNormal, skinIndex, skinWeight} = mesh.geometry.attributes;
    const points = new Float64Array(position.count * 3), posed = new Float64Array(points.length);
    const joints = new Uint16Array(position.count * 4), weights = new Float64Array(joints.length);
    const push = outlined ? materialPush(mesh) : 0;
    const point = new THREE.Vector3();
    for (let i = 0; i < position.count; i++) {
        point.fromBufferAttribute(position, i);
        if (push) point.addScaledVector(new THREE.Vector3().fromBufferAttribute(hullNormal, i), push);
        point.applyMatrix4(mesh.bindMatrix);
        points.set(point.toArray(), i * 3);
        for (let j = 0; j < 4; j++) {
            joints[i * 4 + j] = skinIndex.getComponent(i, j);
            weights[i * 4 + j] = skinWeight.getComponent(i, j);
        }
    }
    return {mesh, points, posed, joints, weights, bones: mesh.skeleton.bones.map((bone) => bone.name), finish: mesh.matrixWorld.clone().multiply(mesh.bindMatrixInverse)};
}

function supportPlanes(points, indices, directions) {
    return directions.map((normal) => {
        let constant = -Infinity;
        for (const index of indices) {
            const at = index * 3;
            constant = Math.max(constant, normal.x * points[at] + normal.y * points[at + 1] + normal.z * points[at + 2]);
        }
        return {normal: normal.clone(), constant};
    });
}

function collider(data, indices, bone, rigid, outlined) {
    return {data, indices: Uint32Array.from(indices), bone, rigid, outlined, rest: rigid ? supportPlanes(data.points, indices, DIRECTIONS) : null, planes: DIRECTIONS.map((normal) => ({normal: normal.clone(), constant: 0})), box: new THREE.Box3()};
}

// Every sleeve triangle belongs to one section, with all three of its vertices retained. The union therefore contains the actual
// deformed cloth without filling the empty space between a bent upper arm and forearm.
function sleeveSections(data, side) {
    const {mesh, joints, weights, bones} = data;
    const indices = mesh.geometry.index?.array ?? Array.from({length: mesh.geometry.attributes.position.count}, (_, index) => index);
    const groups = [new Set(), new Set(), new Set()];
    for (let i = 0; i < indices.length; i += 3) {
        const shares = [0, 0, 0];
        for (let j = 0; j < 3; j++) for (let slot = 0; slot < 4; slot++) {
            const at = indices[i + j] * 4 + slot, name = bones[joints[at]];
            const section = name === `forearm_${side}` || name === `hand_${side}` ? 2 : name === `upper_arm_${side}` ? 1 : 0;
            shares[section] += weights[at];
        }
        const group = groups[shares.indexOf(Math.max(...shares))];
        for (let j = 0; j < 3; j++) group.add(indices[i + j]);
    }
    return groups.map((indices, index) => collider(data, indices, `${["shoulder", "upper_arm", "forearm"][index]}_${side}`, false, true)).filter((each) => each.indices.length);
}

// Bake immutable vertex/skin inputs once. Rigid head accessories retain their support planes; only the small cloth meshes are skinned
// on the CPU. The same arrays and planes are reused each frame.
export function headphoneCollidersOf(meshes) {
    const found = [];
    if (!Array.isArray(meshes)) {
        meshes.traverse((mesh) => found.push(mesh));
        meshes = found;
    }
    const colliders = [], dynamic = [];
    for (const mesh of meshes) {
        if (!mesh.isSkinnedMesh || !mesh.name) continue;
        const head = mesh.name === "head_shell", adornment = mesh.name.startsWith("homie_backwards_cap__");
        const sleeve = /^homie_hoodie__sleeve_([lr])$/.exec(mesh.name);
        const cloth = mesh.name === "homie_hoodie__body" || mesh.name === "homie_hoodie__folded_hood";
        if (!head && !adornment && !sleeve && !cloth) continue;
        const data = meshData(mesh, adornment || Boolean(sleeve));
        const rigid = (head || adornment) && identity(data.finish) && Array.from({length: mesh.geometry.attributes.position.count}, (_, i) => i).every((i) => data.bones[data.joints[i * 4]] === "head" && data.weights[i * 4] > 1 - 1e-7);
        if (!rigid) dynamic.push(data);
        if (sleeve) colliders.push(...sleeveSections(data, sleeve[1]));
        else colliders.push(collider(data, Array.from({length: mesh.geometry.attributes.position.count}, (_, i) => i), head || adornment ? "head" : "chest", rigid, adornment));
    }
    return {colliders, dynamic, matrices: new Map(), last: null};
}

export function posedHeadphoneColliders(state, moves, {radius = 0.012, outline = 0.008, bodyOutline = 0} = {}) {
    const matrices = state.matrices;
    if (state.last === moves) {
        for (const shape of state.colliders) {
            shape.margin = radius + (shape.outlined ? outline + CLEARANCE.outlined : bodyOutline + CLEARANCE.bare);
            for (const plane of shape.planes) plane.constant = plane.base + shape.margin;
        }
        return state.colliders;
    }
    for (const [name, move] of moves) {
        if (!matrices.has(name)) matrices.set(name, new THREE.Matrix4());
        matrices.get(name).copy(TO_GLB).multiply(move).multiply(FROM_GLB);
    }
    const point = new THREE.Vector3();
    for (const data of state.dynamic) {
        const {points, posed, joints, weights, bones, finish} = data;
        for (let i = 0; i < points.length / 3; i++) {
            const x = points[i * 3], y = points[i * 3 + 1], z = points[i * 3 + 2];
            let px = 0, py = 0, pz = 0;
            for (let slot = 0; slot < 4; slot++) {
                const at = i * 4 + slot, weight = weights[at];
                if (!weight) continue;
                const e = matrices.get(bones[joints[at]]).elements;
                px += weight * (e[0] * x + e[4] * y + e[8] * z + e[12]);
                py += weight * (e[1] * x + e[5] * y + e[9] * z + e[13]);
                pz += weight * (e[2] * x + e[6] * y + e[10] * z + e[14]);
            }
            point.set(px, py, pz).applyMatrix4(finish);
            posed[i * 3] = point.x; posed[i * 3 + 1] = point.y; posed[i * 3 + 2] = point.z;
        }
    }
    const normalMatrix = new THREE.Matrix3();
    for (const shape of state.colliders) {
        const frame = matrices.get(shape.bone);
        shape.margin = radius + (shape.outlined ? outline + CLEARANCE.outlined : bodyOutline + CLEARANCE.bare);
        if (shape.rigid) {
            normalMatrix.getNormalMatrix(frame);
            for (let i = 0; i < shape.planes.length; i++) {
                const plane = shape.planes[i], rest = shape.rest[i];
                point.copy(rest.normal).multiplyScalar(rest.constant).applyMatrix4(frame);
                plane.normal.copy(rest.normal).applyMatrix3(normalMatrix).normalize();
                plane.base = plane.normal.dot(point);
                plane.constant = plane.base + shape.margin;
            }
        } else {
            const {posed} = shape.data;
            for (let i = 0; i < shape.planes.length; i++) {
                const plane = shape.planes[i];
                plane.normal.copy(DIRECTIONS[i]).transformDirection(frame);
                const {x, y, z} = plane.normal;
                let constant = -Infinity;
                for (const index of shape.indices) {
                    const at = index * 3;
                    constant = Math.max(constant, x * posed[at] + y * posed[at + 1] + z * posed[at + 2]);
                }
                plane.base = constant;
                plane.constant = plane.base + shape.margin;
            }
        }
    }
    state.last = moves;
    return state.colliders;
}

function inside(point, shape) {
    for (const {normal, constant} of shape.planes) if (normal.dot(point) > constant + 1e-8) return false;
    return true;
}

function interval(from, direction, shape, limit = Infinity) {
    let enter = 0, leave = limit;
    for (const {normal, constant} of shape.planes) {
        const along = normal.dot(direction), gap = constant - normal.dot(from);
        if (Math.abs(along) < 1e-10) { if (gap < 0) return null; else continue; }
        const hit = gap / along;
        if (along > 0) leave = Math.min(leave, hit);
        else enter = Math.max(enter, hit);
        if (enter > leave) return null;
    }
    return leave >= 0 && enter <= limit ? [Math.max(0, enter), leave] : null;
}

function rayExit(point, direction, colliders) {
    const intervals = colliders.map((shape) => interval(point, direction, shape)).filter(Boolean).sort((a, b) => a[0] - b[0]);
    let distance = 0;
    for (const [enter, leave] of intervals) {
        if (enter > distance + 1e-6) break;
        distance = Math.max(distance, leave + 0.0002);
    }
    return distance;
}

function project(point, colliders, guide, prefer, frame) {
    const containing = colliders.filter((shape) => inside(point, shape));
    if (!containing.length) return point;
    const directions = [];
    for (const shape of containing) {
        let nearest = -Infinity;
        for (const {normal, constant} of shape.planes) nearest = Math.max(nearest, normal.dot(point) - constant);
        for (const {normal, constant} of shape.planes) if (normal.dot(point) - constant > nearest - 0.06) directions.push(normal);
    }
    directions.push(...DIRECTIONS.map((direction) => direction.clone().transformDirection(frame)));
    let best = null, score = Infinity;
    for (const direction of directions) {
        const distance = rayExit(point, direction, colliders);
        if (!Number.isFinite(distance)) continue;
        const candidate = point.clone().addScaledVector(direction, distance);
        const cost = distance * distance + 0.08 * candidate.distanceToSquared(guide) + 0.015 * candidate.distanceToSquared(prefer);
        if (cost < score) { score = cost; best = candidate; }
    }
    return best ?? point;
}

// The earcup caller may use a conservative enclosing sphere and translate the complete rigid cup by this difference. Calling this
// before fitting the band reuses the same posed cloth vertices; only the clearance offset of the cached planes changes.
export function clearHeadphonePoint(point, colliderState, moves, {radius = 0.27, outline = 0.018, bodyOutline = 0.036, guide = point, direction = null} = {}) {
    if (!colliderState?.colliders.length) return point.clone();
    const colliders = posedHeadphoneColliders(colliderState, moves, {radius, outline, bodyOutline});
    if (direction) {
        const along = direction.clone().normalize();
        return point.clone().addScaledVector(along, rayExit(point, along, colliders));
    }
    return project(point, colliders, guide, point, colliderState.matrices.get("chest")).clone();
}

function crossing(a, b, colliders) {
    const direction = b.clone().sub(a);
    return colliders.some((shape) => {
        const hit = interval(a, direction, shape, 1);
        return hit && hit[1] - hit[0] > 1e-6;
    });
}

// A line grazing a convex corner can clear a combination of its two faces with a tiny shift. Either face alone can require a
// much larger displacement even though the connecting segment barely touches the corner.
function segmentPlanes(a, b, shape) {
    const direction = b.clone().sub(a);
    let enter = 0, leave = 1, entry = null, exit = null;
    for (const plane of shape.planes) {
        const along = plane.normal.dot(direction);
        if (Math.abs(along) < 1e-10) continue;
        const at = (plane.constant - plane.normal.dot(a)) / along;
        if (along < 0 && at > enter) { enter = at; entry = plane; }
        if (along > 0 && at < leave) { leave = at; exit = plane; }
    }
    if (!entry || !exit) return shape.planes;
    const aWeight = exit.normal.dot(direction), bWeight = -entry.normal.dot(direction);
    const normal = entry.normal.clone().multiplyScalar(aWeight).addScaledVector(exit.normal, bWeight), length = normal.length();
    if (length < 1e-8) return shape.planes;
    return [{normal: normal.divideScalar(length), constant: (entry.constant * aWeight + exit.constant * bWeight) / length}, ...shape.planes];
}

// Keep the cup anchors fixed and let the thin neck loop yield around the posed character. Short sections leave a shoulder through
// a common supporting plane, moving each end only as far as it needs. Chest-relative rays keep the route independent of the viewing
// direction; every choice comes from this pose, so static previews do not depend on frame order.
export function fitHeadphoneBand(band, colliderState, moves, {radius = 0.012, outline = 0.008} = {}) {
    if (!colliderState?.colliders.length) return {points: band, linear: false, corrections: 0, unresolved: 0};
    const colliders = posedHeadphoneColliders(colliderState, moves, {radius, outline});
    const frame = TO_GLB.clone().multiply(moves.get("chest")).multiply(FROM_GLB), inverse = frame.clone().invert();
    const curve = new THREE.CatmullRomCurve3(band, false, "catmullrom", 0.15);
    const points = Array.from({length: CLEARANCE.nodes}, (_, i) => curve.getPointAt(i / (CLEARANCE.nodes - 1)));
    const original = points.map((point) => point.clone());
    const directions = points.map((point, i) => {
        const local = point.clone().applyMatrix4(inverse);
        const angle = 0.49 + (Math.PI * 2 - 0.98) * i / (points.length - 1);
        // The collar exits horizontally and the crown upward. The tiny authored arc bias keeps this defined at the centerline.
        return new THREE.Vector3(local.x + 0.025 * Math.sin(angle), Math.max(0, local.y - 2.75), local.z + 0.025 * Math.cos(angle)).normalize().transformDirection(frame);
    });
    let corrections = 0, unresolved = 0;
    const epsilon = 0.0005, segment = new THREE.Vector3();
    for (let round = 0; round < 12; round++) {
        let changed = false;
        for (let i = 1; i < points.length - 1; i++) {
            const distance = rayExit(points[i], directions[i], colliders);
            if (distance <= 0) continue;
            points[i].addScaledVector(directions[i], distance);
            corrections++;
            changed = true;
        }
        // Both ends clear the same support plane without pushing an already-clear neighbor farther away.
        for (let step = 1; step < points.length; step++) {
            const i = round % 2 ? points.length - step : step;
            const a = points[i - 1], b = points[i], da = directions[i - 1], db = directions[i];
            const fixedA = i === 1, fixedB = i === points.length - 1;
            for (const shape of colliders) {
                const hit = interval(a, segment.subVectors(b, a), shape, 1);
                if (!hit || hit[1] - hit[0] <= 1e-6) continue;
                let distance = Infinity, shiftA = 0, shiftB = 0;
                for (const plane of segmentPlanes(a, b, shape)) {
                    const gapA = plane.constant + epsilon - plane.normal.dot(a), gapB = plane.constant + epsilon - plane.normal.dot(b);
                    if (fixedA && gapA > 0 || fixedB && gapB > 0) continue;
                    const alongA = plane.normal.dot(da), alongB = plane.normal.dot(db);
                    if (!fixedA && gapA > 0 && alongA <= 1e-4 || !fixedB && gapB > 0 && alongB <= 1e-4) continue;
                    const needA = fixedA || gapA <= 0 ? 0 : gapA / alongA, needB = fixedB || gapB <= 0 ? 0 : gapB / alongB;
                    const amount = Math.max(needA, needB);
                    if (amount < distance) { distance = amount; shiftA = needA; shiftB = needB; }
                }
                if (!Number.isFinite(distance) || distance <= 0) continue;
                if (!fixedA) a.addScaledVector(da, shiftA);
                if (!fixedB) b.addScaledVector(db, shiftB);
                corrections++;
                changed = true;
            }
        }
        unresolved = 0;
        for (let i = 1; i < points.length; i++) if (crossing(points[i - 1], points[i], colliders)) unresolved++;
        if (!unresolved || !changed) break;
    }
    const maximumShift = Math.max(...points.map((point, i) => point.distanceTo(original[i])));
    return {points, linear: true, corrections, unresolved, maximumShift};
}

export class HeadphoneBandCurve extends THREE.Curve {
    constructor(points) {
        super();
        this.points = points;
    }

    getPoint(t, target = new THREE.Vector3()) {
        const at = Math.min(this.points.length - 1, Math.max(0, t) * (this.points.length - 1)), index = Math.floor(at);
        return target.copy(this.points[index]).lerp(this.points[Math.min(index + 1, this.points.length - 1)], at - index);
    }

    getPointAt(t, target = new THREE.Vector3()) {
        return this.getPoint(t, target);
    }

    getTangentAt(t, target = new THREE.Vector3()) {
        return this.getTangent(t, target);
    }
}
