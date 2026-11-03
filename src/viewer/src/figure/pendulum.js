// A figure hanging by one hand swings about that hand as a damped pendulum as long as its body below the hand: it swings out when it
// lands there or the hand is carried sideways, and settles to a slow sway

const GRAVITY = 9.81;
// the picture is taken as this many metres tall and the body's weight hangs this share of it below the hand, so it swings at a real
// body's pace, about 1.3 seconds a swing, whatever size it is drawn
const PICTURE_METRES = 1.5;
const WEIGHT_BELOW = 0.3;
const LENGTH = PICTURE_METRES * WEIGHT_BELOW;
const NATURAL = Math.sqrt(GRAVITY / LENGTH);
// how fast a swing dies away, as a share of the damping that would stop it without one swing
const DAMPING = 0.08;
// the sway it settles to, in radians, at half its own pace
const SWAY = 0.025;
// how fast it swings out, in radians a second, as it lands at the end of a trip
export const LANDING_SPEED = 0.8;
const LONGEST_STEP = 1 / 30;

export const STILL = Object.freeze({angle: 0, speed: 0});

// The swing `seconds` on, at `now` seconds, the hand carried `offset` pixels to the right meanwhile in a picture `size` pixels tall; the
// angle turns clockwise on the screen, as a CSS rotate does
export function swung({angle, speed}, seconds, now, offset, size) {
    const step = Math.min(Math.max(seconds, 0), LONGEST_STEP);
    const carried = angle + ((offset / size) * PICTURE_METRES) / LENGTH;
    const sway = SWAY * Math.sin((NATURAL * now) / 2);
    const pull = -(NATURAL ** 2) * (Math.sin(carried) - sway) - 2 * DAMPING * NATURAL * speed;
    const next = speed + pull * step;
    return {angle: carried + next * step, speed: next};
}

// The swing a figure lands in at the end of a trip that went `way` (-1 left, 1 right): its body carries on the way it went
export const landedSwing = (way) => ({angle: 0, speed: -way * LANDING_SPEED});
