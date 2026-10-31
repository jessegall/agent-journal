// An old rotary desk telephone, drawn a size too large for the figure so it plainly reads as one: its place on the floor across and forward
// of the feet, tipped `tip` degrees toward the viewer, with a footprint near square. Its body, seen from the side, stands `height` high and
// `depth` deep: its front face slopes back from the floor at the front up to its brow, `brow` (forward of the middle and up), with the dial
// set in it, its top runs back from there and its back comes down to the floor, every edge rounded by `round` and its top domed `dome`
// higher in the middle; it is `width` across at the floor and `narrow` of that narrower at the top, nearly as tall as it is wide. The
// dial is a cream plate `plate` round filling most of the front face, `face` thick, with marks round its rim for the numbers `marks` from
// its middle, and on it a dark wheel `radius` round, its `holes` white finger holes `hole` round on a ring `ring` from the middle, the
// first `first` degrees round from the right and the rest `spread` degrees on, a small label in the middle and a finger stop past the
// last. On top, `at` back of the middle, two prongs `apart` from the middle and `height` high, each with a saddle for the handle. The
// handset is a curved horn `length` long, its handle `grip` thick bending down `drop` at its ends into round ends, an ear piece and a
// mouth piece, each a bulb `end` round and high with its grille underneath; it rests `rest` over the prongs, across the top with its
// ends hanging past the sides. The cord is `cord` thick in `coils` turns `coil` round. The poof it comes and goes in
// is `puffs` puffs of smoke `puff` round, bursting out from `from` to `to` of the figure's units about its middle. Each part is shaded and
// outlined as the figure is, never flat.
export const TELEPHONE = {
    at: [0.5, -1.25],
    tip: 10,
    base: {width: 1.2, narrow: 0.18, depth: 0.85, height: 0.88, brow: [0.08, 0.8], round: 0.16, dome: 0.06},
    dial: {plate: 0.42, face: 0.045, marks: 0.37, radius: 0.31, holes: 10, hole: 0.05, ring: 0.22, first: 60, spread: 290, label: 0.11},
    cradle: {at: -0.14, apart: 0.3, post: 0.055, height: 0.13},
    handset: {length: 1.4, grip: 0.085, drop: 0.15, end: [0.2, 0.15], rest: 0.06, grille: 1.52},
    cord: 0.022, coils: 14, coil: 0.05,
    poof: {puffs: 11, puff: 0.24, from: 0.5, to: 0.95},
    colours: {body: 0xa8322d, face: 0xf1e6cf, wheel: 0x2b2e38, hole: 0xf4f2ed, mark: 0x2b2e38, label: 0xf4f2ed, grille: 0x2b2e38, smoke: 0xe6e3ee},
};

// phoneWay selects a hand, mirrored as the figure faces backwards; the complete telephone can project to either side of the hips.
export const phoneHand = (facing, way) => way * Math.cos(facing * Math.PI / 180) >= 0 ? 1 : -1;

// The full resting telephone's horizontal projection, including its tilted depth, cradle, handset ends and drawn outline.
// Bounds enclose the rounded meshes; both ends of the squash range reserve the landing wobble too. Coordinates are model units
// about the figure's hips, before the page scales and translates them. No renderer is needed to choose a supported side.
export function phoneFootprint(facing, way, call) {
    const {beside, behind, turn} = call.seated;
    const side = phoneHand(facing, way), radians = Math.PI / 180;
    const angle = (facing - side * turn) * radians, tip = TELEPHONE.tip * radians;
    const {base, cradle, handset, dial} = TELEPHONE;
    const bulge = base.round * 0.8, crown = base.height + bulge + base.dome;
    const rest = crown - base.dome * (cradle.apart / (base.width / 2)) ** 2 + cradle.height + handset.rest;
    const padding = 0.04;
    const middle = side * beside * Math.cos(facing * radians) - behind * Math.sin(facing * radians);
    const across = Math.cos(angle), forward = Math.cos(tip) * Math.sin(angle), up = Math.sin(tip) * Math.sin(angle);
    const values = [];
    const project = (xs, ys, zs) => {
        for (const x of xs) for (const y of ys) for (const z of zs) values.push(middle + x * across + y * up + z * forward);
    };
    const radius = handset.end[0], depth = handset.end[1];
    const cupWidth = handset.length / 2 + radius + depth * 0.45 * Math.sin(0.22);
    const cupBottom = -handset.drop - depth * handset.grille - radius * 0.62 * Math.sin(0.22) - 0.025 / 2;
    for (const squash of [-call.squash, 0, call.squash]) {
        const wide = 1 + squash / 2, high = 1 - squash;
        project(
            [-base.width / 2 - padding, base.width / 2 + padding].map((value) => value * wide),
            [-bulge - padding, crown + cradle.height + handset.grip + cradle.post + padding].map((value) => value * high),
            [-base.depth / 2 - bulge - padding, base.depth / 2 + bulge + dial.face * 2.2 + padding].map((value) => value * wide),
        );
        project(
            [-cupWidth - padding, cupWidth + padding],
            [rest * high + cupBottom - padding, rest * high + 0.08 + handset.grip + padding],
            [cradle.at * wide - radius - padding, cradle.at * wide + radius + padding],
        );
    }
    return {left: Math.min(...values), right: Math.max(...values), middle, side};
}
