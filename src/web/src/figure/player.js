import {Stage} from "./figure.js";

// How many clips' drawn frames are kept; the clip on screen and the few before it, so going back to idle draws nothing again.
const KEPT_CLIPS = 4;

// Plays a figure's clips into a canvas. Each stepped frame is posed and drawn once, then copied: posing costs milliseconds a frame
// and a copy costs next to nothing, so a figure on screen all session costs one copy per step of its clip.
export class FigurePlayer {
    constructor(figure, canvas) {
        this.figure = figure;
        this.canvas = canvas;
        this.stage = new Stage();
        this.drawn = new Map();
        this.shown = "";
    }

    // the clip's frame `index`, turned `facing` degrees, onto the canvas; nothing is drawn when that frame is already there
    show(clip, index, facing = 0) {
        const key = `${clip.name}/${index}/${facing}/${this.canvas.width}`;
        if (key === this.shown) return;
        const frame = this.frameOf(clip, index, facing);
        const context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        context.drawImage(frame, 0, 0);
        this.shown = key;
    }

    frameOf(clip, index, facing) {
        const key = `${clip.name}/${facing}/${this.canvas.width}`;
        const frames = this.drawn.get(key) || [];
        this.drawn.delete(key);
        this.drawn.set(key, frames);
        while (this.drawn.size > KEPT_CLIPS) this.drawn.delete(this.drawn.keys().next().value);
        if (!frames[index]) {
            const frame = document.createElement("canvas");
            frame.width = frame.height = this.canvas.width;
            this.stage.draw(this.figure, clip, index, facing, frame);
            frames[index] = frame;
        }
        return frames[index];
    }
}
