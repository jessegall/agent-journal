// The visor is a screen of GRID.columns by GRID.rows square pixels, column 0 on the viewer's left and row 0 at the top, each off or lit
// in a colour; the figure draws whatever is lit (figure.js screenMaterial). The eyes and everything shown in their place are pictures
// on that grid, and each of their changes steps from one picture to the next: the frames of an animation.
import {LETTER, LETTERS} from "./visorFont.js";

export const GRID = {columns: 32, rows: 15};

// how many times a second the screen's pixels change, slow like a small real screen, while the figure moves at the page's frame rate
export const FRAMES_PER_SECOND = 6;

// where an eye's pictures are centred on the grid: the figure's right eye on the viewer's left, its left on the right, both on the
// middle row; a picture that points one way, as the squeezed eye pointing in toward the nose, is turned round for the eye on the right
export const EYE_SPOTS = [
    {column: 8, row: 7, mirrored: false},
    {column: 23, row: 7, mirrored: true},
];

// The pictures, each a list of rows of the same length: "#" lit in its colour, "o" in its highlight, "." off
export const PICTURES = {
    eye_wide: ["..#####..", ".#######.", "###...###", "##.....##", "##.....##", "##.....##"],
    eye_open: ["..#####..", ".#######.", "###...###", "##.....##"],
    eye_narrowed: ["..#####..", ".#######.", "###...###"],
    eye_half: [".#######.", "###...###"],
    eye_shut: [".#######."],
    heart_big: [".##...##.", "#o##.####", "#########", "#########", ".#######.", "..#####..", "...###...", "....#...."],
    heart_small: [".##.##.", "#o#####", "#######", ".#####.", "..###..", "...#..."],
    heart_tiny: ["##.##", "#####", ".###.", "..#.."],
    star_big: ["....#....", "....#....", "...###...", "####o####", ".#######.", "..#####..", "..##.##..", ".##...##.", ".#.....#."],
    star_twinkle: ["o...#...o", "....#....", "...###...", "####o####", ".#######.", "..#####..", "..##.##..", ".##...##.", "o#.....#o"],
    star_small: ["..#..", ".###.", "##o##", ".###.", ".#.#."],
    squeezed: ["##....", ".###..", "...##.", "....##", "...##.", ".###..", "##...."],
    z_small: ["###", "..#", ".#.", "#..", "###"],
    z_big: ["#####", "....#", "...#.", "..#..", ".#...", "#....", "#####"],
    cross: ["##.....##", "###...###", ".###.###.", "..#####..", "...###...", "..#####..", ".###.###.", "###...###", "##.....##"],
    tick: [".......##", "......###", ".....###.", "##..###..", "######...", ".####....", "..##....."],
    whoa: [".##.", "#..#", "#..#", ".##."],
};

// The frames each picture family steps through, each with the least size it takes: the eyes by how open they are, so a blink, a squint
// or a wide look steps from one to the next; the hearts by their beat and the stars by their sparkle, each growing in from nothing
export const FRAMES = {
    eyes: [["eye_shut", 0], ["eye_half", 0.25], ["eye_narrowed", 0.55], ["eye_open", 0.82], ["eye_wide", 1.25]],
    hearts: [["heart_tiny", 0.05], ["heart_small", 0.6], ["heart_big", 1.08]],
    stars: [["star_small", 0.05], ["star_big", 0.6], ["star_twinkle", 1.12]],
    z: [["z_small", 0.05], ["z_big", 1.5]],
};

// the frame of the family `name` for `size`: the last whose least size it reaches, or none below the first
export const frameFor = (name, size) => FRAMES[name].filter(([, least]) => size >= least).at(-1)?.[0] ?? null;

// The colours of the pictures, red, green and blue from 0 to 1, and their highlights
export const COLOURS = {
    eyes: [1, 0.94, 0.81],
    hearts: [1, 0.3, 0.5],
    heartLight: [1, 0.78, 0.86],
    stars: [1, 0.86, 0.3],
    starLight: [1, 1, 1],
};

// how many pixels an eye's glance moves it for a glance of its whole height
const EYE_HEIGHT = PICTURES.eye_open.length;

// The pixels lit for a face, each {column, row, colour}: `face` says how open the `eyes` are (Posing.eyes) and whether they show at all
// (`eyed`), their `glance` aside and up as shares of their height (Posing.eyeGlance), their `tint`, and what takes their place: `hearts`,
// `stars` or `squeezed` at their size, or a run's end as a `sign` ({name, colour, strength}), shown as far up and down from the middle
// as its strength; a Z above them while it is `dozing`, at its size; and a round mouth under them while it says `whoa`
export function litPixels(face) {
    if (face.ticker) return tickerPixels(face.ticker.text, face.ticker.step, COLOURS.eyes);
    if (!face.eyed) return [];
    const shown = shownPicture(face);
    const eyes = shown ? EYE_SPOTS.flatMap((spot) => placed(shown, spot, face)) : [];
    const zFrame = face.dozing > 0 ? frameFor("z", face.dozing) : null;
    const z = zFrame ? placed({name: zFrame, colour: COLOURS.eyes, light: COLOURS.eyes, reach: 1}, Z_SPOT, face) : [];
    const whoa = face.whoa ? placed({name: "whoa", colour: COLOURS.eyes, light: COLOURS.eyes, reach: 1}, WHOA_SPOT, face) : [];
    return [...eyes, ...z, ...whoa];
}

// where the round mouth of a startled 'whoa' is centred on the grid: low between the eyes
export const WHOA_SPOT = {column: 16, row: 12, mirrored: false};

// where the Z of a figure dozing is centred on the grid: high up between the eyes, toward its left
export const Z_SPOT = {column: 18, row: 3, mirrored: false};

// the picture shown in each eye's place, always one that exists: a family of pictures below its first size gives way to the next, its colours, how far it reaches up and down from its middle (1 the whole picture), whether it
// glances with the eyes, and whether it points one way
function shownPicture(face) {
    const sign = face.sign?.strength >= 0.25 ? face.sign : null;
    if (sign) return {name: sign.name, colour: sign.colour, light: sign.colour, reach: sign.strength};
    const heart = face.hearts > 0 ? frameFor("hearts", face.hearts) : null;
    if (heart) return {name: heart, colour: COLOURS.hearts, light: COLOURS.heartLight, reach: 1};
    const star = face.stars > 0 ? frameFor("stars", face.stars) : null;
    if (star) return {name: star, colour: COLOURS.stars, light: COLOURS.starLight, reach: 1};
    if (face.squeezed > 0) return {name: "squeezed", colour: COLOURS.eyes, light: COLOURS.eyes, reach: 1, points: true};
    const open = Math.max(0, face.eyes * (1 - (face.sign?.strength ?? 0)));
    const colour = face.tint ?? COLOURS.eyes;
    return {name: frameFor("eyes", open), colour, light: colour, reach: 1, glances: true};
}

// the lit pixels of `shown` centred on `spot`, moved by the eyes' glance when it glances
function placed(shown, spot, face) {
    const rows = PICTURES[shown.name];
    const width = rows[0].length;
    const [aside, up] = shown.glances ? face.glance.map((part) => Math.round(part * EYE_HEIGHT)) : [0, 0];
    const left = spot.column - Math.floor(width / 2) + aside;
    const top = spot.row - Math.floor(rows.length / 2) - up;
    const middle = (rows.length - 1) / 2;
    const pixels = [];
    rows.forEach((line, y) => {
        if (Math.abs(y - middle) > (shown.reach * rows.length) / 2) return;
        [...line].forEach((mark, x) => {
            if (mark === ".") return;
            const column = left + (shown.points && spot.mirrored ? width - 1 - x : x);
            const row = top + y;
            if (column >= 0 && column < GRID.columns && row >= 0 && row < GRID.rows) pixels.push({column, row, colour: mark === "o" ? shown.light : shown.colour});
        });
    });
    return pixels;
}

// Text scrolled across the screen right to left in the visor's letters (visorFont.js), on the rows from TICKER.row down, moved
// TICKER.columnsPerFrame columns each of its `fps` frames a second, the screen stepping that fast while it shows, so a worker and its task
// pass in under three seconds: it comes in at the right edge and has passed once it leaves at the left
export const TICKER = {row: 4, columnsPerFrame: 2, fps: 30};

// the width of `text` in the visor's letters, in columns, a gap after each letter
export const tickerWidth = (text) => text.length * (LETTER.width + LETTER.gap);

// how many columns `text` moves to pass the whole screen, and how many seconds that takes
export const tickerSteps = (text) => GRID.columns + tickerWidth(text);
export const tickerSeconds = (text) => tickerSteps(text) / TICKER.columnsPerFrame / TICKER.fps;

// the ticker `seconds` into scrolling `text`, or null once it has passed
export function tickerAt(text, seconds) {
    const step = TICKER.columnsPerFrame * Math.floor(Math.max(0, seconds) * TICKER.fps);
    return text && step < tickerSteps(text) ? {text, step} : null;
}

// the lit pixels of `text` moved `step` columns in from the right edge, in `colour`
export function tickerPixels(text, step, colour) {
    const pixels = [];
    [...text.toUpperCase()].forEach((character, index) => {
        const left = GRID.columns - step + index * (LETTER.width + LETTER.gap);
        (LETTERS[character] ?? []).forEach((line, y) => {
            [...line].forEach((mark, x) => {
                const column = left + x;
                if (mark === "#" && column >= 0 && column < GRID.columns) pixels.push({column, row: TICKER.row + y, colour});
            });
        });
    });
    return pixels;
}

