import {Stage} from "./figure.js";

// How many clips' drawn frames are kept; the clip on screen and the few before it, so going back to idle draws nothing again.
const KEPT_CLIPS = 4;

// Plays a figure's clips into a canvas. Each stepped frame is posed and drawn once, then copied: posing costs milliseconds a frame
// and a copy costs next to nothing, so a figure on screen all session costs one copy per step of its clip. A frame whose eyes wear a
// look is drawn each time, as the look moves on its own clock.
export class FigurePlayer {
    constructor(figure, canvas) {
        this.figure = figure;
        this.canvas = canvas;
        this.stage = new Stage();
        this.drawn = new Map();
        this.shown = "";
        this.looking = null;
    }

    // the clip's frame `index` in `posture`, turned `facing` degrees, onto the canvas, the eyes wearing the look `eyes` if one is given;
    // nothing is drawn when that frame is already there
    show(clip, index, facing, {posture, eyes = null}) {
        const key = `${clip.name}/${index}/${facing}/${posture}/${this.canvas.width}/${eyes ? `${eyes.mood}@${eyes.seconds}` : ""}`;
        if (key === this.shown) return;
        const frame = eyes ? this.lookOf(clip, index, facing, posture, eyes) : this.frameOf(clip, index, facing, posture);
        const context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(frame, 0, 0);
        this.shown = key;
    }

    frameOf(clip, index, facing, posture) {
        const key = `${clip.name}/${facing}/${posture}/${this.canvas.width}`;
        const frames = this.drawn.get(key) || [];
        this.drawn.delete(key);
        this.drawn.set(key, frames);
        while (this.drawn.size > KEPT_CLIPS) this.drawn.delete(this.drawn.keys().next().value);
        if (!frames[index]) {
            frames[index] = this.blank();
            this.stage.draw(this.figure, clip, index, facing, frames[index], {posture});
        }
        return frames[index];
    }

    lookOf(clip, index, facing, posture, eyes) {
        this.looking ??= this.blank();
        this.stage.draw(this.figure, clip, index, facing, this.looking, {posture, eyes});
        return this.looking;
    }

    blank() {
        const frame = document.createElement("canvas");
        frame.width = frame.height = this.canvas.width;
        return frame;
    }
}
