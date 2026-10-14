const ARM = /^(arm|forearm|hand)_[lr]_root$/;
const PROTECTED = new Set(["head_root", "torso_root", "pelvis_root"]);

export const shown = (object) => object.visible && (!object.parent || shown(object.parent));
export const isArm = (mesh) => ARM.test(mesh.userData.attachment || "");
export const isProtected = (mesh) => PROTECTED.has(mesh.userData.attachment);

export function sweepCases(clips, voice, facings = [30, 70]) {
    return clips.filter((clip) => !clip.voices || clip.voices.includes(voice)).flatMap((clip) =>
        clip.postures.flatMap((posture) => facings.flatMap((facing) =>
            Array.from({length: clip.frames}, (_, frame) => ({clip: clip.name, posture, facing, frame}))
        ))
    );
}

export function collisionParts(figure) {
    const originals = [];
    figure.scene.traverse((mesh) => {
        if (mesh.isSkinnedMesh && mesh.userData.hull && shown(mesh)) originals.push(mesh);
    });
    const protectedParts = originals.filter(isProtected);
    const moving = originals.filter(isArm);
    // Procedural props have no attachment metadata. Outline hulls are not a second surface.
    for (const root of [figure.book, figure.glass, figure.laptop, ...(figure.props || [])].filter(Boolean)) {
        root.traverse((mesh) => {
            if (mesh.isMesh && shown(mesh) && !moving.includes(mesh)) moving.push(mesh);
        });
    }
    return {protectedParts, moving};
}
