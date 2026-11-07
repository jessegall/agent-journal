import {SIDES, Stage, reachSide} from "./figure.js";
import {CHANGE_SECONDS, POSTURES, leavesSeat} from "./places.js";
import {turnFrame} from "./frame.js";

// How many clips' drawn frames are kept; the clip on screen and the few before it, so going back to idle draws nothing again.
const KEPT_CLIPS = 4;

const smooth = (k) => k * k * (3 - 2 * k);

// Plays a figure's clips into a canvas. A whole frame is posed and drawn once, then copied: posing costs milliseconds a frame
// and a copy costs next to nothing, so a figure on screen all session costs one copy per step of its clip. A frame whose eyes wear a
// look, whose legs walk under the clip, or that eases out of the pose before a change is drawn each time, as each of those moves on a
// clock of its own.
export class FigurePlayer {
    constructor(figure, canvas) {
        this.figure = figure;
        this.canvas = canvas;
        this.stage = new Stage();
        this.drawn = new Map();
        this.shown = "";
        this.drawing = null;
        // the bone moves of the frame on the canvas, its clip, posture and facing, and the change easing out of the moves before it, kept on
        // its feet when it gets up off a seat (places.js leavesSeat), and so while it goes on into another standing pose before it is done
        this.moves = null;
        this.shape = "";
        this.posture = "";
        this.blend = null;
        this.facing = null;
        this.turn = null;
        this.drewAt = null;
        this.propClips = new Set();
    }

    // whether a change is still easing, so its frames go on being drawn until it is done
    blending() {
        return this.blend !== null || Boolean(this.turn);
    }

    // Ease an explicit gaze interruption even when the clip, posture and facing key stays the same.
    easeFromCurrent() {
        if (this.moves) this.blend = {from: this.moves, began: performance.now(), plant: Boolean(this.blend?.plant), floor: Boolean(this.blend?.floor)};
    }

    // the clip's frame `index` in `posture`, turned `facing` degrees, onto the canvas, the eyes wearing the look `eyes` if one is given,
    // the legs `stride` through a step on the move, a figure watching the sky standing as `sky` says (figure.js watch), and the head
    // looking at `at` in the picture when given (figure.js lookToward), a rifle aimed at `target` there (figure.js rifleAim), the eyes `open`
    // that far through a blink, and the visor lit as a
    // screen as `screen` says (figure/visor.js), the head leaning `tilt` degrees at rest (figure/headTilt.js), and the things flung out
    // rummaging flying as `throws` says (acts.js throwsFor), leaning out `leanWay` (figure.js reachSide); nothing is drawn when that frame is
    // already there and nothing eases; `ticker` is text scrolling across the visor in place of the eyes (visorPixels.js tickerPixels); and the
    // figure `grabbed` by the pointer startled (figure.js startledHeld); and which mirrored telephone placement a seated call uses,
    // `phoneWay` (figure.js seatedCall); an `airborne` figure no longer plants its feet while leaving a seat
    show(clip, index, facing, {posture, eyes = null, stride = null, sky = null, throws = null, leanWay = 0, walkWay = 0, at = null, target = null, open = 1, screen = null, tilt = 0, ticker = null, grabbed = false, phoneWay = 1, airborne = false}) {
        if (["walk", "run"].includes(clip.name) && stride !== null) index = ((stride % 1 + 1) % 1) * clip.frames;
        const now = performance.now();
        const shape = `${clip.name}/${posture}/${facing}`;
        // Catching a grounded transition also starts from the picture already drawn; removing its floor correction from the old source would
        // move the whole figure on the first airborne frame.
        if ((!this.shape.startsWith(`${clip.name}/${posture}/`) || (airborne && (this.blend?.plant || this.blend?.floor))) && this.moves) {
            const striding = [this.shape.split("/")[0], clip.name].some((name) => ["walk", "run"].includes(name));
            this.blend = {
                from: this.moves, began: now,
                plant: !airborne && (leavesSeat(this.posture, posture) || (Boolean(this.blend?.plant) && POSTURES[posture].drop === 0)),
                floor: !airborne && this.posture === "stand" && posture === "stand" && striding,
            };
        }
        const before = this.facing ?? (this.shape ? Number(this.shape.split("/")[2]) : null);
        const turn = turnFrame(before === null ? null : {facing: before, speed: this.turn?.speed ?? 0}, facing, (now - (this.drewAt ?? now)) / 1000, CHANGE_SECONDS);
        this.facing = turn.facing;
        this.turn = turn.settled ? null : turn;
        this.drewAt = now;
        this.shape = shape;
        this.posture = posture;
        facing = this.facing;
        const k = this.blend ? Math.min((now - this.blend.began) / 1000 / CHANGE_SECONDS, 1) : 1;
        const blend = this.blend ? {from: this.blend.from, previous: this.moves, k: smooth(k), settled: false, plant: this.blend.plant, floor: this.blend.floor} : null;
        const key = JSON.stringify([clip.name, index, facing, posture, stride, this.canvas.width, this.canvas.height, eyes, sky, throws, leanWay, walkWay, at, target, open, screen, tilt, ticker, grabbed, phoneWay]);
        const props = this.figure?.propTransitions;
        if (key === this.shown && !blend && !props?.active) return;
        const live = eyes || stride !== null || sky || throws || leanWay || walkWay || at || target || open < 1 || screen || tilt || ticker || grabbed || phoneWay !== 1 || blend || this.turn || props?.present || props?.active || this.propClips?.has(clip.name) || !Number.isInteger(index);
        const {frame, moves} = live
            ? this.liveOf(clip, index, facing, {posture, eyes, stride: stride ?? 0, blend, sky, throws, leanWay, walkWay, at, target, open, screen, tilt, ticker, grabbed, phoneWay, time: now / 1000})
            : this.frameOf(clip, index, facing, posture);
        // A cached full-opacity prop frame must not later replace a frame partway through the prop's entrance or retirement.
        if (this.figure?.propTransitions?.present) (this.propClips ??= new Set()).add(clip.name);
        const context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(frame, 0, 0);
        this.moves = moves;
        if (blend?.settled) this.blend = null;
        // a frame drawn part way through a change is never the frame the clip itself draws there
        this.shown = blend ? "" : key;
    }

    // the way the figure leans out rummaging toward `way`, 1 the picture's right, -1 its left: that way, or the other when that hand is busy
    reachWay(way) {
        return SIDES[reachSide(this.figure.stance, way)];
    }

    headAt() {
        return this.stage.headAt(this.figure, this.moves);
    }

    handAt() {
        return this.stage.handAt(this.figure, this.moves);
    }

    frameOf(clip, index, facing, posture) {
        const key = `${clip.name}/${facing}/${posture}/${this.canvas.width}`;
        const frames = this.drawn.get(key) || [];
        this.drawn.delete(key);
        this.drawn.set(key, frames);
        while (this.drawn.size > KEPT_CLIPS) this.drawn.delete(this.drawn.keys().next().value);
        if (!frames[index]) {
            const frame = this.blank();
            frames[index] = {frame, moves: this.stage.draw(this.figure, clip, index, facing, frame, {posture})};
        }
        return frames[index];
    }

    liveOf(clip, index, facing, options) {
        this.drawing ??= this.blank();
        return {frame: this.drawing, moves: this.stage.draw(this.figure, clip, index, facing, this.drawing, options)};
    }

    blank() {
        const frame = document.createElement("canvas");
        frame.width = frame.height = this.canvas.width;
        return frame;
    }
}
