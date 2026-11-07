// How the figure's picture frames it, in its own units: `height` of them from the picture's top to its bottom, about a height of `middle`
// above its feet, as render_clips.py and snaps.py frame it; the figure's drawing and the page's drawings over it alike read it
export const FRAMED = {height: 5.4, middle: 2.4};

// A turn follows the shortest arc and keeps its angular velocity when the target moves. Re-starting a pose blend for every new
// facing freezes its first frame over and over; this damped turn instead eases both a fixed destination and a moving glance.
export function turnFrame(state, target, seconds, duration) {
    if (!state) return {facing: target, speed: 0, settled: true};
    const elapsed = Math.max(0, Math.min(seconds, 0.05));
    const offset = ((state.facing - target + 180) % 360 + 360) % 360 - 180;
    const goal = state.facing - offset;
    const rate = 8 / duration;
    const along = state.speed + rate * offset;
    const decay = Math.exp(-rate * elapsed);
    const desired = goal + (offset + along * elapsed) * decay;
    const step = Math.min(Math.max(desired - state.facing, -720 * elapsed), 720 * elapsed);
    const speed = Math.abs(desired - state.facing) > 720 * elapsed ? Math.sign(step) * 720 : (state.speed - rate * along * elapsed) * decay;
    const facing = state.facing + step;
    const settled = Math.abs(facing - goal) < 0.001 && Math.abs(speed) < 0.05;
    return {facing: settled ? goal : facing, speed: settled ? 0 : speed, settled};
}
