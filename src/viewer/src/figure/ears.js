// The glb's base ears are separate meshes. Detaching them before dressing and outlining leaves the head, hats and hair unchanged;
// Homie's moving ear cups belong to its procedural headphones, never to the head.
export function withoutEars(meshes) {
    return meshes.filter((mesh) => {
        if (!mesh.name.startsWith("ear_")) return true;
        mesh.removeFromParent();
        return false;
    });
}
