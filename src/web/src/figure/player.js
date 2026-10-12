import {Stage} from "./figure.js";
import {CHANGE_SECONDS} from "./places.js";

// How many clips' drawn frames are kept; the clip on screen and the few before it, so going back to idle draws nothing again.
const KEPT_CLIPS = 4;

const smooth = (k) => k * k * (3 - 2 * k);

// Plays a figure's clips into a canvas. Each stepped frame is posed and drawn once, then copied: posing costs milliseconds a frame
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
        // the bone moves of the frame on the canvas, its clip, posture and facing, and the change easing out of the moves before it
        this.moves = null;
        this.shape = "";
        this.blend = null;
    }

    // whether a change is still easing, so its frames go on being drawn until it is done
    blending() {
        return this.blend !== null;
    }

    // the clip's frame `index` in `posture`, turned `facing` degrees, onto the canvas, the eyes wearing the look `eyes` if one is given and
    // the legs `stride` through a step on the move; nothing is drawn when that frame is already there and nothing eases
    show(clip, index, facing, {posture, eyes = null, stride = null}) {
        const shape = `${clip.name}/${posture}/${facing}`;
        if (shape !== this.shape && this.moves) this.blend = {from: this.moves, began: performance.now()};
        this.shape = shape;
        const k = this.blend ? Math.min((performance.now() - this.blend.began) / 1000 / CHANGE_SECONDS, 1) : 1;
        const blend = k < 1 ? {from: this.blend.from, k: smooth(k)} : null;
        if (!blend) this.blend = null;
        const key = `${clip.name}/${index}/${facing}/${posture}/${stride}/${this.canvas.width}/${eyes ? `${eyes.mood}@${eyes.seconds}` : ""}`;
        if (key === this.shown && !blend) return;
        const live = eyes || stride !== null || blend;
        const {frame, moves} = live
            ? this.liveOf(clip, index, facing, {posture, eyes, stride: stride ?? 0, blend})
            : this.frameOf(clip, index, facing, posture);
        const context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(frame, 0, 0);
        this.moves = moves;
        // a frame drawn part way through a change is never the frame the clip itself draws there
        this.shown = blend ? "" : key;
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
