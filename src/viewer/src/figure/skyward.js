// The figure's run up the message bubbles and out over the top of the chat, now and then while it idles, and its parachute back down. Every
// number that decides it is here, in pixels and milliseconds on the page: how long a hop takes at least and for each pixel it covers, how
// high above its higher end it arcs, as a share of the figure's height, how long the figure stays out of sight, between the two, and how
// fast it comes down on its parachute, in its own heights a second.
export const SKYWARD = {hopMs: 220, perPixel: 0.7, arc: 0.3, gone: [1000, 5000], chute: 1.1};

// The hops of a run from the feet at `from` up the stands in `up` (each feet {x, y}, each higher than the last) and on out over the top of
// the chat, whose top is at `top`, past which the figure is not drawn: each {from, to, ms}
export function skywardHops(from, up, top) {
    const stops = [...up, {x: (up.at(-1) ?? from).x, y: top}];
    return stops.map((to, index) => {
        const start = index ? stops[index - 1] : from;
        return {from: start, to, ms: SKYWARD.hopMs + SKYWARD.perPixel * Math.hypot(to.x - start.x, to.y - start.y)};
    });
}

// Where the run is `ms` into its `hops`: its feet, arcing above the higher end of the hop it is on, the way it goes across (1 to the
// right), and whether it has gone off the top, as a run of no hops has at once, as when the figure is thrown off the top
export function skywardAt(hops, ms, size) {
    let left = ms;
    for (const hop of hops) {
        if (left < hop.ms) {
            const k = left / hop.ms;
            const arc = SKYWARD.arc * size * 4 * k * (1 - k);
            return {x: hop.from.x + (hop.to.x - hop.from.x) * k, y: hop.from.y + (hop.to.y - hop.from.y) * k - arc, way: Math.sign(hop.to.x - hop.from.x), gone: false};
        }
        left -= hop.ms;
    }
    return {...hops.at(-1)?.to, way: 0, gone: true};
}

// how long a run of `hops` takes
export const skywardMs = (hops) => hops.reduce((sum, hop) => sum + hop.ms, 0);

// how long the figure stays out of sight before its parachute brings it back, at the roll `random()` gives
export const goneMs = (random) => SKYWARD.gone[0] + random() * (SKYWARD.gone[1] - SKYWARD.gone[0]);
