import {BODY} from "./places.js";

// The highest the figure jumps, in its own heights from its hat to its feet, for every avatar: the one limit for a hop onto a bubble and a
// reach up to hang from a bubble's side; anything higher is reached in steps, on the pogo stick (POGO), or not at all
export const JUMP = {most: 2.5};

// how tall a figure ({size, below}) stands, from its hat to its feet, in pixels
export const heightOf = ({size, below}) => (1 - below - BODY.top) * size;

// how far up one jump of a figure goes at most, in pixels
export const jumpMost = (figure) => JUMP.most * heightOf(figure);

// The pogo stick takes the figure up a big climb only, of at least `share` of the chat window's height, as high as that is; its reach is
// what makes it worth taking, so the jump's limit (JUMP) does not hold it
export const POGO = {share: 0.5};

// whether a climb of `height` pixels is one for the pogo stick, in a chat window `chat` pixels high
export const pogoClimb = (height, chat) => height >= POGO.share * chat;

// The footholds a climb from the feet at `from` up to feet at height `y` hops onto, of those in `holds` (feet {x, y}), each hop no higher
// than `most`: as many hops as the height needs, each onto the highest foothold in reach, until `y` itself is in reach; null when a gap on
// the way is too high to hop
export function climbStops(from, y, holds, most) {
    const stops = [];
    let at = from;
    while (at.y - y > most) {
        const reach = holds.filter((hold) => hold.y < at.y && hold.y > y && at.y - hold.y <= most);
        if (!reach.length) return null;
        at = reach.reduce((best, hold) => (hold.y < best.y ? hold : best));
        stops.push(at);
    }
    return stops;
}
