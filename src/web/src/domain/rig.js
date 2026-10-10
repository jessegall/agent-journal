const EASE = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);
const REST = {rotate: 0, x: 0, y: 0};

export const rigUrl = (voice, file) => `voices/rigs/${voice}/${file}`;

export const EYES = "eyes";

// The image a layer shows in a pose; the eyes are a layer of their own, so shut lids override whatever the pose shows there.
export const fileOf = (layer, pose, lids = "") =>
    (layer.name === EYES && lids && layer.states?.[lids]) ||
    (layer.states && pose[layer.name]?.state ? layer.states[pose[layer.name].state] : layer.file) ||
    layer.file;

function keyAt(track, ms) {
    const after = track.findIndex(([at]) => at > ms);
    if (after === -1) return {...REST, ...track[track.length - 1][1]};
    if (after === 0) return {...REST, ...track[0][1]};
    const [from, a] = track[after - 1];
    const [to, b] = track[after];
    const t = EASE((ms - from) / (to - from));
    const start = {...REST, ...a};
    const end = {...REST, ...b};
    return {rotate: start.rotate + (end.rotate - start.rotate) * t, x: start.x + (end.x - start.x) * t, y: start.y + (end.y - start.y) * t};
}

function heldAt(track, ms, field) {
    const passed = track.filter(([at, key]) => at <= ms && key[field] !== undefined);
    return passed.length ? passed[passed.length - 1][1][field] : null;
}

export function poseAt(animation, ms) {
    return Object.fromEntries(
        Object.entries(animation.tracks).map(([part, track]) => [part, {...keyAt(track, ms), state: heldAt(track, ms, "state"), order: heldAt(track, ms, "order")}])
    );
}

export const orderOf = (layer, pose) => pose[layer.name]?.order ?? layer.order;

function own(layer, move) {
    const [px, py] = layer.pivot;
    return new DOMMatrix()
        .translate(move.x + px, move.y + py)
        .rotate(move.rotate)
        .translate(-px, -py);
}

export function transforms(rig, pose) {
    const byName = Object.fromEntries(rig.layers.map((layer) => [layer.name, layer]));
    const placed = {};
    const place = (name) => {
        if (placed[name]) return placed[name];
        const layer = byName[name];
        const local = own(layer, pose[name] || REST);
        placed[name] = layer.parent ? place(layer.parent).multiply(local) : local;
        return placed[name];
    };
    return Object.fromEntries(rig.layers.map((layer) => [layer.name, place(layer.name).toString()]));
}
