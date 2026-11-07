// A prop entering or leaving an act stays attached while its colour fades over this many seconds.
export const PROP_FADE_SECONDS = 0.16;

const smooth = (value) => value * value * (3 - 2 * value);
const clone = (value) => value?.clone ? value.clone() : Array.isArray(value) ? value.map(clone) : value && typeof value === "object" ? Object.fromEntries(Object.entries(value).map(([key, each]) => [key, clone(each)])) : value;

const alphaAt = (entry, now) => {
    const elapsed = Math.min(Math.max((now - entry.began) / PROP_FADE_SECONDS, 0), 1);
    return entry.from + (entry.to - entry.from) * smooth(elapsed);
};

// The props requested this frame and the ones still retiring from the preceding act. A missing clock means an exact static sample:
// it replaces the state at full opacity, so strips and cached frames never depend on which sample happened to be drawn before them.
export function transitionProps(previous, wanted, time = null) {
    if (!Number.isFinite(time)) {
        const entries = new Map([...wanted].map(([name, value]) => [name, {value: clone(value), alpha: 1, from: 1, to: 1, began: 0}]));
        return {entries, time: null, active: false, present: entries.size > 0};
    }
    const now = Math.max(time, previous?.time ?? time);
    const entries = new Map();
    for (const name of new Set([...(previous?.entries.keys() ?? []), ...wanted.keys()])) {
        const before = previous?.entries.get(name);
        const to = Number(wanted.has(name));
        let entry = before ? {...before, alpha: previous.time === null ? before.alpha : alphaAt(before, now)} : {alpha: 0, from: 0, to, began: now};
        if (before && Math.abs(entry.alpha - before.to) <= 1e-9) entry.alpha = before.to;
        if (before && before.to !== to) entry = {...entry, from: entry.alpha, to, began: now};
        if (wanted.has(name)) entry.value = clone(wanted.get(name));
        if (!to && entry.alpha <= 1e-9) continue;
        entries.set(name, entry);
    }
    return {entries, time: now, active: [...entries.values()].some((entry) => Math.abs(entry.alpha - entry.to) > 1e-9), present: entries.size > 0};
}

const materialsIn = (root) => {
    const found = new Set();
    root.traverse((node) => {
        for (const material of [node.material ?? []].flat()) found.add(material);
    });
    return found;
};

// Restore the authored material before a prop updates its own shape or light, so an animated lens or halo opacity never compounds
// the fade from the previous frame. The records also keep opaque materials opaque again once the transition has finished.
export function restorePropOpacity(root) {
    for (const material of materialsIn(root)) {
        const saved = material.userData.propOpacity;
        if (!saved) continue;
        material.opacity = saved.opacity;
        material.transparent = saved.transparent;
        material.depthWrite = saved.depthWrite;
        material.forceSinglePass = saved.forceSinglePass;
        if (material.uniforms?.alpha) material.uniforms.alpha.value = saved.alpha;
        delete material.userData.propOpacity;
    }
}

export function fadeProp(root, alpha) {
    root.visible = alpha > 1e-9;
    for (const material of materialsIn(root)) {
        const drawnTransparent = material.userData.propTransparent ?? material.transparent;
        if (alpha < 1) {
            material.userData.propOpacity = {opacity: material.opacity, transparent: material.transparent, depthWrite: material.depthWrite, forceSinglePass: material.forceSinglePass, alpha: material.uniforms?.alpha?.value ?? 1};
            material.opacity *= alpha;
            if (material.uniforms?.alpha) material.uniforms.alpha.value *= alpha;
            material.transparent = true;
            material.depthWrite = false;
            material.forceSinglePass = true;
        }
        // Built-in materials compile an opaque fragment variant; changing only their render order would leave alpha pinned to one.
        if (drawnTransparent !== material.transparent) material.needsUpdate = true;
        material.userData.propTransparent = material.transparent;
    }
}

// Translucent props share the visor's final colour pass; otherwise a clear lens or a retiring prop would be painted behind its eyes.
export const propOverlay = (material) => material.transparent;
