import {FRAMED} from "./frame.js";

// One complete walking cycle, shared by the foot solver and the distance travelled on the page.
export const GAIT = {length: 1.36, planted: 0.6, clearance: 0.16};

// A run has longer steps, a shorter support phase and room for both soles to leave the ground.
export const RUN = {length: 2.16, planted: 0.42, clearance: 0.3};

export const strideAtDistance = (distance, size, running = false) => size > 0 ? distance * FRAMED.height / (size * (running ? RUN : GAIT).length) : 0;

// A planted sole moves back at the body's speed. Its Hermite return meets that same speed at either end, and the squared sine lifts
// it with zero vertical speed at toe-off and touchdown, so neither the foot nor its solved knee changes direction in one frame.
export function gaitFoot(cycle, {length, planted, clearance}) {
    const phase = ((cycle % 1) + 1) % 1;
    const span = length * planted;
    if (phase < planted) return [-span / 2 + length * phase, 0];
    const swing = (phase - planted) / (1 - planted);
    const forward = span / 2 - span * (3 * swing * swing - 2 * swing * swing * swing) + length * (1 - planted) * swing * (1 - swing) * (1 - 2 * swing);
    return [forward, clearance * Math.sin(Math.PI * swing) ** 2];
}

// Ground travel accelerates and brakes over a short ramp, with a steady pace between them. Integrating smoothstep gives zero speed
// and acceleration at either end; dividing by the travelled area keeps the final position exact, even on a very short trip.
export function travelAt(elapsed, duration, ramp) {
    if (duration <= 0) return 1;
    const time = Math.min(Math.max(elapsed, 0), duration);
    const edge = Math.min(Math.max(ramp, 0), duration / 2);
    if (!edge) return time / duration;
    const area = duration - edge;
    const integral = (u) => u * u * u * (1 - u / 2);
    if (time < edge) return edge * integral(time / edge) / area;
    if (time > duration - edge) return 1 - edge * integral((duration - time) / edge) / area;
    return (time - edge / 2) / area;
}
