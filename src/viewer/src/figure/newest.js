// Timing shared by the seated pose and its travel, so the hips move only while the supporting hand lifts them.
export const NEWEST_ASIDE = {notice: 0.42, gap: 8, shuffles: 3, seconds: 2.4, frames: 48, fps: 20, lift: 0.12};

const within = (value) => Math.min(Math.max(value, 0), 1);
const smooth = (value) => {
    const k = within(value);
    return k * k * (3 - 2 * k);
};
const between = (u, from, to) => smooth((u - from) / (to - from));

// Three settled shuffles, each preparing a support hand, lifting, moving across, then lowering before the next push.
export function newestScootAt(u) {
    const progress = within(u);
    const across = within((progress - 0.12) / 0.76) * NEWEST_ASIDE.shuffles;
    const shuffle = Math.min(Math.floor(across), NEWEST_ASIDE.shuffles - 1);
    const phase = across - shuffle;
    const lifted = between(phase, 0.26, 0.38) * (1 - between(phase, 0.76, 0.96));
    const moved = between(phase, 0.38, 0.76);
    const ready = between(progress, 0, 0.12) * (1 - between(progress, 0.88, 1));
    const weight = between(phase, 0.2, 0.34) * (1 - between(phase, 0.84, 1));
    const follow = Math.sin(Math.PI * within((phase - 0.45) / 0.55)) ** 2;
    return {moved, across: (shuffle + moved) / NEWEST_ASIDE.shuffles, lift: NEWEST_ASIDE.lift * lifted, ready, weight, follow, shuffle, phase};
}

// Keep the seat's canonical direction while easing from the frozen rendered pose into the next seated clip, without standing first.
export function newestSeatAfter(aside, place, footing, resumeFacing, now) {
    return {
        place: {...place, face: aside.canonicalFace},
        footing: {...footing, face: aside.footingFace},
        posed: {posture: place.posture, facing: resumeFacing, turning: false},
        seatPose: {face: resumeFacing, from: aside.facing, to: resumeFacing, since: now, next: now + 4},
    };
}
