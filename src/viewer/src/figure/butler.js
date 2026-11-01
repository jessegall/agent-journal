import * as THREE from "three";

// The butler's dress over its glb, in the glb's own units with y up and the front toward +z: a top hat in the bowler's place, tall with
// straight sides, a flat crown, a narrow brim curled up at the sides and a dark satin band, square on the head; white gloves; a white bow
// tie on a wing collar, its tips standing up beside the knot; and a tailcoat's two tails hanging behind it to the back of the knees.
export const BUTLER = {
    hat: {base: 3.78, crown: 0.86, height: 1.0, brim: 0.2, thick: 0.05, curl: 0.18, band: [0.04, 0.24], bandOut: 0.015, sides: 48},
    white: [0.97, 0.97, 0.95],
    whites: ["hand_shell_l", "hand_shell_r", "butler_bow_tie__knot", "butler_bow_tie__loop_l", "butler_bow_tie__loop_r", "butler_shirt__collar_band", "butler_shirt__collar_point_l", "butler_shirt__collar_point_r"],
    wing: {points: [[0.04, 2.47], [0.19, 2.45], [0.09, 2.36]], z: 0.43, thick: 0.02},
    tails: {side: [[-0.3, 1.78], [-0.47, 1.78], [-0.68, 0.72], [-0.58, 0.72]], across: [0.04, 0.36]},
    satin: [0.15, 0.15, 0.24],
    removed: ["butler_bowler_hat", "butler_tailcoat__tail_l", "butler_tailcoat__tail_r"],
    // the tails, sat on and out of sight under it whenever it sits: bound to the waist alone they cannot fold, and would hang through the
    // seat
    satOn: ["butler_tail_l", "butler_tail_r"],
};

// A mesh of the dress: `geometry` in the glb's world as it is bound, drawn in `colour` and moved with the bone the part `on` is bound to
function partOn(on, name, geometry, colour) {
    geometry.applyMatrix4(on.matrixWorld.clone().invert());
    const count = geometry.attributes.position.count;
    const bone = on.geometry.attributes.skinIndex.getX(0);
    geometry.setAttribute("skinIndex", new THREE.Uint16BufferAttribute(Array.from({length: count * 4}, (_, i) => (i % 4 ? 0 : bone)), 4));
    geometry.setAttribute("skinWeight", new THREE.Float32BufferAttribute(Array.from({length: count * 4}, (_, i) => (i % 4 ? 0 : 1)), 4));
    const mesh = new THREE.SkinnedMesh(geometry, new THREE.MeshBasicMaterial({color: new THREE.Color(...colour)}));
    mesh.name = name;
    mesh.userData = {item: name};
    mesh.position.copy(on.position);
    mesh.quaternion.copy(on.quaternion);
    mesh.scale.copy(on.scale);
    on.parent.add(mesh);
    mesh.bind(on.skeleton, on.bindMatrix);
    mesh.updateMatrixWorld(true);
    return mesh;
}

// The top hat, turned about its upright middle with its brim's foot at the origin: its brim, the crown's straight sides and its flat top,
// the brim's edge raised at the left and right so it curls up there; its underside open inside the crown, as a hat is, so a solid cap
// never cuts across the head while it is put on or lifted; worn on the head, and the one the butler lifts off it
export function topHatGeometry() {
    const {crown, height, brim, thick, curl, sides} = BUTLER.hat;
    const outer = crown + brim;
    const profile = [[crown, 0], [outer, 0], [outer, thick], [crown, thick], [crown, height], [0.001, height]];
    const geometry = new THREE.LatheGeometry(profile.map(([x, y]) => new THREE.Vector2(x, y)), sides);
    const position = geometry.attributes.position;
    for (let i = 0; i < position.count; i++) {
        const [x, y, z] = [position.getX(i), position.getY(i), position.getZ(i)];
        const out = Math.hypot(x, z);
        if (y <= thick + 1e-6 && out > crown) position.setY(i, y + curl * ((out - crown) / brim) ** 2 * (x / out) ** 2);
    }
    geometry.computeVertexNormals();
    return geometry;
}

// the top hat's band, a ring a little proud of the crown just above the brim, placed as topHatGeometry is
export function topHatBandGeometry() {
    const {crown, band, bandOut, sides} = BUTLER.hat;
    const geometry = new THREE.CylinderGeometry(crown + bandOut, crown + bandOut, band[1] - band[0], sides, 1, true);
    geometry.translate(0, (band[0] + band[1]) / 2, 0);
    return geometry;
}

// one of the wing collar's tips, on the side `sign` says, a thin triangle standing beside the bow tie's knot
function wingGeometry(sign) {
    const {points, z, thick} = BUTLER.wing;
    const shape = new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(sign * x, y)));
    const geometry = new THREE.ExtrudeGeometry(shape, {depth: thick, bevelEnabled: false});
    geometry.translate(0, 0, z);
    return geometry;
}

// one of the coat's tails, on the side `sign` says: a flap from the waist down to the back of the knees, standing further off the legs at
// its foot, as seen from the side by its outline `side` (each corner z, y), across the back from `across`
function tailGeometry(sign) {
    const {side, across} = BUTLER.tails;
    const shape = new THREE.Shape(side.map(([z, y]) => new THREE.Vector2(z, y)));
    const geometry = new THREE.ExtrudeGeometry(shape, {depth: across[1] - across[0], bevelEnabled: false});
    geometry.rotateY(-Math.PI / 2);
    geometry.translate(sign > 0 ? across[1] : -across[0], 0, 0);
    geometry.computeVertexNormals();
    return geometry;
}

// The butler's meshes dressed: the bowler and the coat's short tails gone, the gloves, bow tie and collar white, and the top hat, the
// collar's wing tips and the long tails added, each bound as the part it stands in for
export function dressButler(meshes) {
    const named = (name) => meshes.find((mesh) => mesh.name === name);
    for (const mesh of meshes.filter((each) => BUTLER.whites.includes(each.name))) {
        mesh.material = mesh.material.clone();
        mesh.material.color.setRGB(...BUTLER.white);
    }
    const crown = named("butler_bowler_hat__crown");
    const middle = new THREE.Box3().setFromObject(crown).getCenter(new THREE.Vector3());
    const hat = crown.material.color.toArray();
    const coat = named("butler_tailcoat__body").material.color.toArray();
    const collar = named("butler_bow_tie__knot");
    const spine = named("butler_tailcoat__tail_l");
    const added = [
        partOn(crown, "butler_top_hat", topHatGeometry().translate(middle.x, BUTLER.hat.base, middle.z), hat),
        partOn(crown, "butler_top_hat_band", topHatBandGeometry().translate(middle.x, BUTLER.hat.base, middle.z), BUTLER.satin),
        ...[1, -1].map((sign) => partOn(collar, `butler_wing_collar_${sign > 0 ? "l" : "r"}`, wingGeometry(sign), BUTLER.white)),
        ...[1, -1].map((sign) => partOn(spine, `butler_tail_${sign > 0 ? "l" : "r"}`, tailGeometry(sign), coat)),
    ];
    const gone = meshes.filter((mesh) => BUTLER.removed.some((item) => mesh.name.startsWith(item)));
    for (const mesh of gone) mesh.parent.remove(mesh);
    return [...meshes.filter((mesh) => !gone.includes(mesh)), ...added];
}
