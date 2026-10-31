import {fallFrame} from "../domain/figureMotion.js";

// A primary press takes the body at once. It dangles under the pointer as a damped pendulum; released, it flies at the pointer's speed
// over its last `sampled` seconds, capped at `fastest`, tumbling `spin` degrees a second. It bounces off the sides keeping `bounce` of
// its speed, and returns on a parachute once it has flown `away` pixels above the chat.
export const GRAB = {sampled: 0.1, fastest: 3000, spin: 900, bounce: 0.5, away: 500};

// the longest step the flight takes at once, in seconds, so a frame missed while the tab was away does not carry it through a wall
const LONGEST_STEP = 0.05;

const clamp = (value, least, most) => Math.min(Math.max(value, least), most);

// The pointer's speed at `now` from its `moves` ({x, y, at} in pixels and seconds, oldest first), in pixels a second: over its moves of the
// last GRAB.sampled seconds, none when it has not moved in that time, never faster than GRAB.fastest
export function pointerSpeed(moves, now) {
    const recent = moves.filter((move) => now - move.at <= GRAB.sampled);
    if (recent.length < 2) return {x: 0, y: 0};
    const [first, last] = [recent[0], recent.at(-1)];
    const seconds = Math.max(last.at - first.at, 1e-3);
    const [x, y] = [(last.x - first.x) / seconds, (last.y - first.y) / seconds];
    const scale = Math.min(1, GRAB.fastest / Math.max(Math.hypot(x, y), 1e-9));
    return {x: x * scale, y: y * scale};
}

// Whether a grab has the figure in the air, held or thrown: whatever act it was playing, even one that may not be interrupted, is cut at once
export const grabbedInAir = (airborne) => Boolean(airborne?.held || airborne?.thrown);

// Keep the screen point caught by a press when a CSS chase, squash or tumble is stopped. The new picture turns about that point.
export function caughtPicture(at, pointer, size, matrix = {a: 1, b: 0, c: 0, d: 1, e: 0, f: 0}, origin = {x: 0, y: 0}) {
    const {a, b, c, d, e, f} = matrix;
    const determinant = a * d - b * c;
    const x = pointer.x - at.x - origin.x - e + a * origin.x + c * origin.y;
    const y = pointer.y - at.y - origin.y - f + b * origin.x + d * origin.y;
    const point = {x: (d * x - c * y) / determinant / size, y: (a * y - b * x) / determinant / size};
    const scale = Math.hypot(a, b);
    return {at: {x: pointer.x - point.x * size, y: pointer.y - point.y * size}, point, angle: Math.atan2(b, a), scale: [scale, determinant / scale]};
}

// A stopped squash recovers while it is held or thrown, without changing the point held by the pointer.
export function caughtScale(airborne, now) {
    if (!airborne.scaleFrom) return [1, 1];
    const u = clamp((now - airborne.scaleAt) / 180, 0, 1);
    const k = u * u * (3 - 2 * u);
    return airborne.scaleFrom.map((scale) => scale + (1 - scale) * k);
}

// Changing from the held point to the tumble's centre retains the same picture on its release frame.
export function releasedFeet(airborne, size) {
    const angle = airborne.hang ?? 0;
    const [sx, sy] = airborne.scale ?? [1, 1];
    const dx = ((airborne.grip?.x ?? 0.5) - 0.5) * size;
    const dy = ((airborne.grip?.y ?? 0.55) - 0.55) * size;
    return {...airborne, x: airborne.x + dx - Math.cos(angle) * sx * dx + Math.sin(angle) * sy * dy, y: airborne.y + dy - Math.sin(angle) * sx * dx - Math.cos(angle) * sy * dy};
}

// A press owns the body at its current picture position. Neither the old seat nor the trip waiting to leave it survives the lift.
export const takenBody = (body, feet, point) => ({
    place: {...feet, posture: "stand", face: 0, view: null, on: null},
    at: {...body.at},
    trip: null,
    leg: {x: body.at.x, y: body.at.y, ms: 0, lead: 0, easing: "linear"},
    walk: {from: {...body.at}, began: 0, on: null},
    footing: null,
    airborne: {...feet, posture: "stand", face: 0, held: true, hang: 0, grip: point},
    landing: false,
    arriving: false,
    leaving: false,
    slide: null,
    rested: "stand",
});

// The figure let go with its feet at `feet` at `speed` ({x, y} pixels a second, down is more), at `now` in milliseconds: in the air,
// tumbling as it flies, falling from there
export const thrownFrom = (feet, speed, now) => ({
    x: feet.x, y: feet.y, posture: "stand", face: feet.face ?? 0, vx: speed.x, speed: speed.y, at: now,
    spin: feet.held ? (feet.hang ?? 0) * 180 / Math.PI : 0, peak: 0, thrown: true,
    ...(feet.scaleFrom && {scale: caughtScale(feet, now), scaleFrom: feet.scaleFrom, scaleAt: feet.scaleAt}),
});

// One frame of a throw at `now` over the `floors`, its feet kept between the chat's sides `room.left` and `room.right`: the throw flown on
// across and falling as any fall does (figureMotion.js fallFrame), off the sides; once it lands on the nearest floor below where it comes
// down, a bubble's top or the chat's floor, null with the spot it landed on, standing; and `gone` once it rises GRAB.away pixels past
// `room.top`, the chat's top, nothing stopping it on the way, out of sight above the chat
export function thrownFrame(thrown, floors, room, now) {
    const seconds = Math.min((now - thrown.at) / 1000, LONGEST_STEP);
    const across = thrown.x + thrown.vx * seconds;
    const off = across < room.left || across > room.right;
    const x = clamp(across, room.left, room.right);
    const {landed, ...fell} = fallFrame({...thrown, x}, floors, seconds);
    if (landed) return {airborne: null, landed: {x, y: landed.top, posture: "stand", face: 0, view: null, on: landed.element ?? null}, gone: false};
    const spin = thrown.spin + (Math.sign(thrown.vx) || 1) * GRAB.spin * seconds;
    const airborne = {...thrown, ...fell, x, vx: off ? -thrown.vx * GRAB.bounce : thrown.vx, spin, at: now, ...(thrown.scaleFrom && {scale: caughtScale(thrown, now)})};
    return {airborne, landed: null, gone: airborne.speed < 0 && airborne.y <= room.top - GRAB.away};
}
