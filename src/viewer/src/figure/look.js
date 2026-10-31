// How the head turns to look at a point, the one formula the pose (figure.js eyesToward) and the look on the page (reactions.js gazeAfter)
// share: the point `across`, `ahead` and `up` from the head's pivot, the eyes `above` the pivot; the yaw, round toward the figure's left,
// and the pitch, down, in radians, so the eyes and not the pivot meet the point
export function lookAngles(across, ahead, up, above) {
    const length = Math.hypot(across, ahead, up);
    return {yaw: Math.atan2(across, ahead), pitch: Math.asin(Math.min(Math.max(above / length, -1), 1)) - Math.atan2(up, Math.hypot(across, ahead))};
}

// the way the head faces for a turn {yaw, pitch}, as the pose turns it (figure.js euler): across toward the figure's left, ahead, and up
export const lookWay = ({yaw, pitch}) => [Math.sin(yaw) * Math.cos(pitch), Math.cos(yaw) * Math.cos(pitch), -Math.sin(pitch)];

// How far `up` a point `across` from the head's pivot and `ahead` of it lies for the head to look at it with `pitch` (lookAngles), the
// eyes `above` the pivot: found by halving, the pitch falling as the point rises
export function upFor(across, ahead, pitch, above) {
    let [low, high] = [-100 * Math.abs(ahead), 100 * Math.abs(ahead)];
    for (let step = 0; step < 60; step++) {
        const middle = (low + high) / 2;
        if (lookAngles(across, ahead, middle, above).pitch > pitch) low = middle;
        else high = middle;
    }
    return (low + high) / 2;
}
