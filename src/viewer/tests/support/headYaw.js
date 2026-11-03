import * as THREE from "three";

// The head's forward direction in the pose's Z-up coordinates, measured from facing the viewer.
export function headYaw(moves) {
    const forward = new THREE.Vector3(0, -1, 0).transformDirection(moves.get("head"));
    return THREE.MathUtils.radToDeg(Math.atan2(forward.x, -forward.y));
}
