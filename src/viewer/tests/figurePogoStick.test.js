import {createApp, h} from "vue";
import {afterEach, expect, test} from "vitest";

const {CLIPS} = await import("../src/figure/figure.js");
const {actDrawn} = await import("../src/figure/acts.js");
const {default: FigureAct} = await import("../src/chat/FigureAct.vue");

const SIZE = 112;
let app = null;

afterEach(() => {
    app?.unmount();
    app = null;
    document.body.innerHTML = "";
});

// what is drawn over the figure's picture drawn playing `clip` at `frame`, as VoiceFigure draws it (acting): the act's drawing, mounted
// with the hands, head and feet where an act has them, or nothing for a clip that is no act
function drawnOver(clip, frame) {
    const act = actDrawn(clip, frame);
    app?.unmount();
    document.body.innerHTML = "";
    if (!act) return document.body;
    const host = document.createElement("div");
    document.body.append(host);
    const hand = {x: 0.62, y: 0.55, out: 1, other: {x: 0.38, y: 0.55}};
    app = createApp({render: () => h(FigureAct, {name: act.name, u: act.u, hand, head: {x: 0.5, y: 0.25}, feet: 0.94, size: SIZE, room: {left: 200, right: 200}})});
    app.mount(host);
    return host;
}

const stick = (drawn) => drawn.querySelector("[data-pogo-stick]");
const frames = (clip) => Array.from({length: 6}, (_, step) => Math.floor((step / 5) * (clip.frames - 1)));

test("the pogo stick is drawn only while the pogo act is drawn: not while the figure turns at a seat before the leg, and never in any act after it", () => {
    const pogo = CLIPS.find((clip) => clip.name === "pogo");
    // held while the pogo act plays
    expect(stick(drawnOver(pogo, Math.round(0.4 * pogo.frames)))).not.toBe(null);
    // the act waiting while the figure turns at its seat draws nothing over it: the picture is drawn idle meanwhile, and so is what is over it
    expect(stick(drawnOver(CLIPS.find((clip) => clip.name === "idle"), 0))).toBe(null);
    // every act after it, through each of them, has no stick over the figure
    for (const clip of CLIPS.filter((each) => each.name !== "pogo")) {
        for (const frame of frames(clip)) {
            const drawn = drawnOver(clip, frame);
            expect(stick(drawn), `${clip.name} at ${frame}`).toBe(null);
            // and what is drawn is that act's own, if it has any
            const over = drawn.querySelector("[data-act]");
            if (over) expect(over.getAttribute("data-act"), `${clip.name} at ${frame}`).toBe(clip.name);
        }
    }
});
